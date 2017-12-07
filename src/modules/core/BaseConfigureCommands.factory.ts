import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../slack-apps/models/registered-module.model';
import {ModuleTypes} from './Enums';
import {simpleSuccessAttachment} from './utils';

export const BASE_CONFIGURE_COMMANDS = {
    FREQUENCY: 'frequency'
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
        }
    }
};