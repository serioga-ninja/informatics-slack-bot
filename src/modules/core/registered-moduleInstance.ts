import {ObjectId} from 'mongodb';
import * as request from 'request';

import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ILinksToPostModelDocument} from '../../models/links-to-post.model';
import {default as RegisteredModuleModel, IRegisteredModuleModelDocument} from '../../models/registered-module.model';
import {LoggerService} from '../../services/logger.service';
import Timer = NodeJS.Timer;

const logService = new LoggerService('Registered Modules');

const MINUTE = 60000;

export class RegisteredModuleInstance {

  private _interval: Timer;
  private model: IRegisteredModuleModelDocument<any>;

  constructor(public modelId: ObjectId,
              protected collectDataFn: (model: IRegisteredModuleModelDocument<any>) => Promise<{ data: ISlackWebhookRequestBody | null; items: ILinksToPostModelDocument[] }>) {

    this.init();
  }

  private async onAction(): Promise<void> {
    logService.info(`Time to post to channel!`, this.model.toObject());

    const {data, items} = await this.collectDataFn(this.model);
    if (data === null) {
      return;
    }

    logService.info(`Posting data to channel ${this.model.chanelId}`, data);

    await new Promise((resolve) => {
      request({
        method: 'POST',
        url: this.model.chanelLink,
        json: true,
        body: data
      }, () => resolve());
    });

    for (const item of items) {
      const postedChannels = [...item.postedChannels, this.model.chanelId];

      await item.update({postedChannels});
    }
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
}
