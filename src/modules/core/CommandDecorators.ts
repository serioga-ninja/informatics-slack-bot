import {ICommandSuccess} from './BaseCommand.class';
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import RegisteredAppModel from '../slack-apps/models/registered-app.model';
import {ChanelNotRegisteredError, InformaticsSlackBotBaseError, ModuleNotExistsError} from './Errors';
import {ModuleTypes} from '../../enums/module-types';
import {RegisteredModulesService} from './Modules.service';

export const SimpleCommandResponse = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let method: () => Promise<ICommandSuccess> = descriptor.value;

    descriptor.value = function (requestBody: ISlackRequestBody) {

        return method
            .apply(target, [requestBody])
            .then((data) => {
                return <ICommandSuccess>{
                    response_type: 'in_channel',
                    text: 'Success!'
                }
            });
    };
};

export function ChannelIsRegistered(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method: () => Promise<ICommandSuccess> = descriptor.value;

    descriptor.value = function (requestBody: ISlackRequestBody) {

        return RegisteredAppModel
            .find({'incoming_webhook.channel_id': requestBody.channel_id})
            .then(collection => {
                if (collection.length === 0) {
                    throw new ChanelNotRegisteredError();
                }
            })
            .then(() => method.apply(target, [requestBody]))
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

        descriptor.value = function (requestBody: ISlackRequestBody) {

            return RegisteredModulesService
                .moduleIsExists(moduleType, requestBody.channel_id)
                .then(exists => {
                    if (!exists) {
                        throw new ModuleNotExistsError();
                    }
                })
                .then(() => method.apply(target, [requestBody]))
                .catch((error: InformaticsSlackBotBaseError) => {
                    return <ICommandSuccess>{
                        response_type: 'in_channel',
                        text: error.message
                    }
                });
        };
    }
};