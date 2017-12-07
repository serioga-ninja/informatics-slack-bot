import variables from '../../../configs/variables';
import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../../interfaces/i-slack-webhook-request-body-attachment';
import {BaseCommand} from '../../core/BaseCommand.class';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ChannelIsRegistered, SimpleCommandResponse, ValidateConfigs} from '../../core/CommandDecorators';
import {ModuleTypes} from '../../../enums/module-types';
import {camelCaseToCebabCase} from '../../core/utils';
import MODULES_CONFIG from '../../modules.config';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../../slack-apps/models/registered-module.model';
import {IConfigurationList} from '../../core/interfaces';
import {CONFIG_HAS_CHANGED} from '../../core/Commands';
import poltavaNewsEmitter from '../poltava-news.emitter';

interface IInstagramLinksConfig {
    addLinks: string;
}

const POLTAVA_NEWS_AVAILABLE_CONFIGS = {
    FREQUENCY: 'frequency'
};

const configActions: IConfigurationList<string[]> = {
    [POLTAVA_NEWS_AVAILABLE_CONFIGS.FREQUENCY]: (requestBody: ISlackRequestBody, minutes: string[]) => {
        return RegisteredModuleModel
            .findOne({chanelId: requestBody.channel_id, moduleType: ModuleTypes.poltavaNews})
            .then((moduleModel: IRegisteredModuleModelDocument<any>) => {
                moduleModel.configuration.frequency = parseInt(minutes[0], 10);

                moduleModel.save();

                return [{text: 'Success'}];
            });
    },
};


class PoltavaNewsConfigureCommand extends BaseCommand {

    @ChannelIsRegistered
    @ValidateConfigs(configActions)
    @SimpleCommandResponse
    execute(requestBody: ISlackRequestBody, configs: IInstagramLinksConfig): Promise<any> {
        let attachments: ISlackWebhookRequestBodyAttachment[] = [];

        return Object.keys(configs).map(key => {
            return () => {
                return configActions[key](requestBody, configs[key])
                    .then(res => {
                        attachments = attachments.concat(res)
                    });
            }
        }).reduce((prev: Promise<any>, current: any) => {

            return prev.then(current);
        }, Promise.resolve())
            .then(() => {
                poltavaNewsEmitter.emit(CONFIG_HAS_CHANGED, requestBody.channel_id);

                return {attachments};
            });
    }

    help() {
        return Promise.resolve(<ISlackWebhookRequestBody>{
            response_type: 'in_channel',
            text: '',
            attachments: [
                {
                    title: 'Usage',
                    text: `/${variables.slack.COMMAND} ${MODULES_CONFIG.MODULES.POLTAVA_NEWS} ${MODULES_CONFIG.COMMANDS.CONFIGURE} [key1=value1 key2=key2value1,key2value1 ...]`
                },
                {
                    title: 'Config list',
                    text: Object.keys(configActions)
                        .map(key => camelCaseToCebabCase(key))
                        .join('|')
                },
                {
                    title: 'Example set post frequency (minutes)',
                    text: `/${variables.slack.COMMAND} ${MODULES_CONFIG.MODULES.POLTAVA_NEWS} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${POLTAVA_NEWS_AVAILABLE_CONFIGS.FREQUENCY}=20`
                }
            ]
        })
    }
}

let poltavaNewsConfigureCommand = new PoltavaNewsConfigureCommand();

export default poltavaNewsConfigureCommand;