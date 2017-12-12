import {ObjectId} from 'mongodb';
import Timer = NodeJS.Timer;
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ILinksToPostModelDocument} from '../../models/links-to-post.model';
import request = require('request');
import {LogService} from '../../services/log.service';
import {
    IRegisteredModuleModelDocument,
    default as RegisteredModuleModel
} from '../../models/registered-module.model';

let logService = new LogService('Registered Modules');

const MINUTE = 1000 * 60;

export class RegisteredModuleInstance {

    private _interval: Timer;
    private model: IRegisteredModuleModelDocument<any>;

    constructor(public modelId: ObjectId,
                protected collectDataFn: (model: IRegisteredModuleModelDocument<any>) => Promise<{ data: ISlackWebhookRequestBody | null; items: ILinksToPostModelDocument[] }>) {

        this.init();
    }

    private onAction() {
        this.collectDataFn(this.model).then(({data, items}) => {
            if (data === null) {
                return;
            }

            logService.info(`Posting data to channel ${this.model.chanelId}`, data);

            return new Promise(resolve => {

                request({
                    method: 'POST',
                    url: this.model.chanelLink,
                    json: true,
                    body: data
                }, () => resolve());
            }).then(() => {
                return Promise.all(items.map(item => {
                    let postedChannels = [...item.postedChannels, this.model.chanelId];

                    return item.update({postedChannels});
                }));
            });
        });
    }

    public destroy() {
        logService.info(`Stopping instance for moduleId ${this.model._id} for channel ${this.model.chanelId}`);
        clearInterval(this._interval);
    }

    public init() {
        RegisteredModuleModel
            .findById(this.modelId)
            .then(model => {
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