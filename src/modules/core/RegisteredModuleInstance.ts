import {IRegisteredModule} from '../../interfaces/i-registered-module';
import Timer = NodeJS.Timer;
import * as mongoose from 'mongoose';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import request = require('request');
import {LogService} from '../../services/log.service';
import {IRegisteredModuleModelDocument} from '../slack-apps/models/registered-module.model';

let logService = new LogService('Registered Modules');

const MINUTE = 1000 * 60;

const baseSearchAggregationFn = (model: IRegisteredModule<any>) => ({postedChannels: {$nin: [model.chanelId]}});

export interface ISomething extends mongoose.Document {
    postedChannels: string[];
}

export class RegisteredModuleInstance {

    private _interval: Timer;

    constructor(public model: IRegisteredModuleModelDocument<any>,
                protected modelInstance: mongoose.Model<ISomething>,
                protected aggregateFunction: (collection: ISomething[]) => Promise<ISlackWebhookRequestBody | null>,
                protected searchAggregationFn: (model: IRegisteredModule<any>) => object = baseSearchAggregationFn) {

        this._interval = setInterval(() => this.onAction(), MINUTE * model.configuration.frequency);

        this.onAction();
    }

    private onAction() {
        this.modelInstance
            .find(this.searchAggregationFn(this.model))
            .then((items) => this
                .aggregateFunction(items)
                .then(data => {
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
                        }, (error, result: any) => {
                            resolve();
                        });
                    }).then(() => {
                        return Promise.all(items.map(item => {
                            item.postedChannels.push(this.model.chanelId);
                            return item.save();
                        }));
                    });
                })
            )
    }

    destroy() {
        logService.info(`Stopping instance for moduleId ${this.model._id} for channel ${this.model.chanelId}`);
        clearInterval(this._interval);
    }
}