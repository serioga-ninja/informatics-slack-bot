import {ObjectId} from 'mongodb';

import web, {IChatPostMessageResult} from '../../configs/slack';
import {ILinksToPostModelDocument} from '../../db/models/links-to-post.model';
import {
  default as RegisteredModuleModel,
  IRegisteredModuleModelDocument
} from '../../db/models/registered-module.model';
import {ISlackWebHookRequestBody} from '../../interfaces/i-slack-web-hook-request-body';
import {LoggerService} from '../../services/logger.service';
import Timer = NodeJS.Timer;

const logService = new LoggerService('Registered Modules');

const MINUTE = 60000;

export class RegisteredModuleInstance {

  private _interval: Timer;
  private model: IRegisteredModuleModelDocument<any>;

  constructor(public modelId: ObjectId,
              protected collectDataFn: (model: IRegisteredModuleModelDocument<any>) => Promise<{ data: ISlackWebHookRequestBody | null; items: ILinksToPostModelDocument[] }>) {

    this.init();
  }

  public destroy() {
    logService.info(`Stopping instance for moduleId ${this.model._id} for channel ${this.model.chanelId}`);
    clearInterval(this._interval);
  }

  public init() {
    RegisteredModuleModel
      .findById(this.modelId)
      .then((model) => {
        this.model = model;

        logService.info(`Init channel ${this.model.chanelId}`);

        if (this._interval) {
          clearInterval(this._interval);
        }

        this._interval = setInterval(() => this.onAction(), MINUTE * this.model.configuration.frequency);

        this.onAction();
      });
  }

  private async onAction(): Promise<void> {
    logService.info(`Time to post to channel!`, this.model.toObject());

    const {data, items} = await this.collectDataFn(this.model);
    if (data === null || data.attachments.length === 0) {
      logService.info(`Nothing to post right now!`, this.model.toObject());

      return;
    }

    logService.info(`Posting data to channel ${this.model.chanelId}`, data);

    const res = await web.chat.postMessage({...data, channel: this.model.chanelId}) as IChatPostMessageResult;

    logService.info(`A message was posed to conversation ${res.channel} with id ${res.ts} which contains the message ${res.message}`);

    for (const item of items) {
      const postedChannels = [...item.postedChannels, this.model.chanelId];

      await item.update({postedChannels});
    }
  }
}
