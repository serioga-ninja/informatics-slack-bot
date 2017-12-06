import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import RegisteredAppModel from '../slack-apps/models/registered-app.model';
import {
    ChanelAlreadyRegisteredError,
    ChanelNotRegisteredError, InformaticsSlackBotBaseError, ModuleNotExistsError,
    UnknownConfigError
} from './Errors';
import {ModuleTypes} from '../../enums/module-types';
import {RegisteredModulesService} from './Modules.service';

export const SimpleCommandResponse = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

    descriptor.value = function (...args: any[]) {

        return method
            .apply(target, args)
            .then((data: ISlackWebhookRequestBody = <ISlackWebhookRequestBody>{}) => {
                return <ISlackWebhookRequestBody>{
                    response_type: 'in_channel',
                    text: data.text || 'Success!',
                    attachments: data.attachments || []
                }
            });
    };
};

export function ChannelIsRegistered(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

    descriptor.value = function (...args: any[]) {
        let [requestBody] = args;

        return RegisteredAppModel
            .find({'incomingWebhook.channel_id': requestBody.channel_id})
            .then(collection => {
                if (collection.length === 0) {
                    throw new ChanelNotRegisteredError();
                }
            })
            .then(() => method.apply(target, args))
            .catch((error: InformaticsSlackBotBaseError) => {
                return <ISlackWebhookRequestBody>{
                    response_type: 'in_channel',
                    text: error.message
                }
            });
    };
}

export function ChannelNotRegistered(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

    descriptor.value = function (...args: any[]) {
        let [requestBody] = args;

        return RegisteredAppModel
            .find({'incomingWebhook.channel_id': requestBody.channel_id})
            .then(collection => {
                if (collection.length > 0) {
                    throw new ChanelAlreadyRegisteredError();
                }
            })
            .then(() => method.apply(target, args))
            .catch((error: InformaticsSlackBotBaseError) => {
                return <ISlackWebhookRequestBody>{
                    response_type: 'in_channel',
                    text: error.message
                }
            });
    };
}

export const ChannelIsActivated = (moduleType: ModuleTypes) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

        descriptor.value = function (...args: any[]) {
            let [requestBody] = args;

            return RegisteredModulesService
                .moduleIsExists(moduleType, requestBody.channel_id)
                .then(exists => {
                    if (!exists) {
                        throw new ModuleNotExistsError();
                    }
                })
                .then(() => method.apply(target, args))
                .catch((error: InformaticsSlackBotBaseError) => {
                    return <ISlackWebhookRequestBody>{
                        response_type: 'in_channel',
                        text: error.message
                    }
                });
        };
    }
};

export const ValidateConfigs = (availableCommands: { [key: string]: (requestBody: any, configs: any) => Promise<any> }) => {

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let method: () => Promise<ISlackWebhookRequestBody> = descriptor.value;

        descriptor.value = function (...args: any[]) {
            let [requestBody, configs] = args;

            return new Promise((resolve, reject) => {
                let unknownKey = Object.keys(configs).filter(key => availableCommands[key] === undefined)[0];

                if (unknownKey) {
                    reject(new UnknownConfigError(unknownKey));
                } else {
                    resolve();
                }
            })
                .then(() => method.apply(target, args));
        };
    }
};