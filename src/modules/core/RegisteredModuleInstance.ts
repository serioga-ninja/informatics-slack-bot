import {IRegisteredModule} from '../../interfaces/i-registered-module';
import Timer = NodeJS.Timer;
import * as mongoose from 'mongoose';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import request = require('request');
import {LogService} from '../../services/log.service';

let logService = new LogService('Registered Modules');

const MINUTE = 1000 * 60;

export interface ISomething extends mongoose.Document {
    postedChannels: string[];
}

export class RegisteredModuleInstance {

    private _interval: Timer;

    constructor(public model: IRegisteredModule<any>,
                private modelInstance: mongoose.Model<ISomething>,
                private agregateFunction: (collection: ISomething[]) => Promise<ISlackWebhookRequestBody | null>) {
        this._interval = setInterval(() => this.onAction(), MINUTE * model.configuration.frequency);

        this.onAction();
    }

    private onAction() {
        this.modelInstance
            .find({postedChannels: {$nin: [this.model.chanel_id]}})
            .then((items) => this
                .agregateFunction(items)
                .then(data => {
                    if (data === null) {
                        return;
                    }

                    logService.info(`Posting data to channel ${this.model.chanel_id}`, data);

                    return new Promise(resolve => {

                        request({
                            method: 'POST',
                            url: this.model.chanel_link,
                            json: true,
                            body: data
                        }, (error, result: any) => {
                            resolve();
                        });
                    }).then(() => {
                        return Promise.all(items.map(item => {
                            item.postedChannels.push(this.model.chanel_id);
                            return item.save();
                        }));
                    });
                })
            )
    }

    destroy() {
        logService.info(`Stopping instance for moduleId ${this.model._id} for channel ${this.model.chanel_id}`);
        clearInterval(this._interval);
    }
}