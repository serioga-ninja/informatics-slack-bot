import {IRegisteredModule} from '../interfaces/i-registered-module';
import Timer = NodeJS.Timer;
import * as mongoose from 'mongoose';
import {ISlackWebhookRequestBody} from '../interfaces/i-slack-webhook-request-body';
import request = require('request');

interface ISomething extends mongoose.Document {
    postedChannels: string[];
}

export class RegisteredModuleInstance {

    private _interval: Timer;

    constructor(public model: IRegisteredModule,
                private modelInstance: mongoose.Model<ISomething>,
                private agregateFunction: (model: ISomething[]) => Promise<ISlackWebhookRequestBody | null>) {
        this._interval = setInterval(() => this.onAction(), model.configuration.frequency);
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
        clearInterval(this._interval);
    }
}