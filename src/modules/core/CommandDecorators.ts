import {ICommandSuccess} from './BaseCommand.class';
import RegisteredAppModel from '../slack-apps/models/registered-app.model';
import {
    ChanelNotRegisteredError, InformaticsSlackBotBaseError, ModuleNotExistsError,
    UnknownConfigError
} from './Errors';
import {ModuleTypes} from '../../enums/module-types';
import {RegisteredModulesService} from './Modules.service';

export const SimpleCommandResponse = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let method: () => Promise<ICommandSuccess> = descriptor.value;

    descriptor.value = function (...args: any[]) {

        return method
            .apply(target, args)
            .then((data: ICommandSuccess = <ICommandSuccess>{}) => {
                return <ICommandSuccess>{
                    response_type: 'in_channel',
                    text: data.text || 'Success!',
                    attachments: data.attachments || []
                }
            });
    };
};

export function ChannelIsRegistered(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method: () => Promise<ICommandSuccess> = descriptor.value;

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
                return <ICommandSuccess>{
                    response_type: 'in_channel',
                    text: error.message
                }
            });
    };
}

export const ChannelIsActivated = (moduleType: ModuleTypes) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let method: () => Promise<ICommandSuccess> = descriptor.value;

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
                    return <ICommandSuccess>{
                        response_type: 'in_channel',
                        text: error.message
                    }
                });
        };
    }
};

export const ValidateConfigs = (availableCommands: { [key: string]: (requestBody: any, configs: any) => Promise<any> }) => {

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let method: () => Promise<ICommandSuccess> = descriptor.value;

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