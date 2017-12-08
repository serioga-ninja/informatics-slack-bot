import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../slack-apps/models/registered-module.model';
import {ModuleTypes} from './Enums';
import {InvalidConfigValueError} from './Errors';
import {camelCaseToCebabCase, simpleSuccessAttachment} from './utils';

export const BASE_CONFIGURE_COMMANDS = {
    FREQUENCY: 'frequency',
    POST_STRATEGY: 'postStrategy',
};

export const baseConfigureCommandsFactory = (moduleType: ModuleTypes) => {

    return {
        [BASE_CONFIGURE_COMMANDS.FREQUENCY]: (requestBody: ISlackRequestBody, minutes: string[]) => {
            return RegisteredModuleModel
                .findOne({chanelId: requestBody.channel_id, moduleType: moduleType})
                .then((moduleModel: IRegisteredModuleModelDocument<any>) => {
                    moduleModel.configuration.frequency = parseInt(minutes[0], 10);

                    moduleModel.save();

                    return [simpleSuccessAttachment()];
                });
        },
        [BASE_CONFIGURE_COMMANDS.POST_STRATEGY]: (requestBody: ISlackRequestBody, strategy: string[]) => {
            if ([1, 2].indexOf(parseInt(strategy[0], 10)) === -1) {
                return Promise.reject(new InvalidConfigValueError(camelCaseToCebabCase(BASE_CONFIGURE_COMMANDS.POST_STRATEGY)));
            }

            return RegisteredModuleModel
                .findOne({chanelId: requestBody.channel_id, moduleType: moduleType})
                .then((moduleModel: IRegisteredModuleModelDocument<any>) => {
                    moduleModel.configuration.postStrategy = parseInt(strategy[0], 10);

                    moduleModel.save();

                    return [simpleSuccessAttachment()];
                });
        }
    }
};