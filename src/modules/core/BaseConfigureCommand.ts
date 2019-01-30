import variables from '../../configs/variables';
import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../../models/registered-module.model';
import {LoggerService} from '../../services/logger.service';
import MODULES_CONFIG from '../modules.config';
import {BaseCommand, IBaseCommand} from './BaseCommand.class';
import {BASE_CONFIGURE_COMMANDS} from './BaseConfigureCommands.factory';
import {CONFIG_HAS_CHANGED} from './Commands';
import {ModuleTypes} from './Enums';
import {IConfigurationList} from './Interfaces';
import {camelCaseToCebabCase, simpleSuccessAttachment} from './utils';
import EventEmitter = NodeJS.EventEmitter;

export interface IBaseConfigureCommand<T> extends IBaseCommand {
    moduleName: string;
    emitter: EventEmitter;
    configList: IConfigurationList<any, any>;

    additionalHelpCommands?: { title: string; text: string; }[];
}

export abstract class BaseConfigureCommand<T> extends BaseCommand implements IBaseConfigureCommand<T> {

    abstract moduleName: string;
    abstract emitter: EventEmitter;
    abstract configList: IConfigurationList<string[], any>;
    abstract moduleType: ModuleTypes;

    protected logService = new LoggerService('BaseConfigureCommand');

    additionalHelpCommands = [];

    execute(requestBody: ISlackRequestBody, configs: T): Promise<any> {
        let attachments: ISlackWebhookRequestBodyAttachment[] = [];

        return RegisteredModuleModel
            .findOne({chanelId: requestBody.channel_id, moduleType: this.moduleType})
            .then((moduleModel: IRegisteredModuleModelDocument<any>) => {
                return Object.keys(configs).map((key) => {
                    return () => {
                        return this.configList[key](moduleModel, configs[key]).then((configuration) => {
                            moduleModel.set({
                                ...moduleModel.configuration,
                                configuration
                            });

                            attachments = attachments.concat(simpleSuccessAttachment());
                        });
                    };
                }).reduce((prev: Promise<any>, current: any) => prev.then(current), Promise.resolve()).then(() => {
                    return moduleModel.save();
                });
            }).then(() => {
                this.logService.info('Config is done');
                this.emitter.emit(CONFIG_HAS_CHANGED, requestBody.channel_id);

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
                    text: `/${variables.slack.COMMAND} ${this.moduleName} ${MODULES_CONFIG.COMMANDS.CONFIGURE} [key1=value1 key2=key2value1,key2value1 ...]`
                },
                {
                    title: 'Config list',
                    text: Object.keys(this.configList)
                        .map((key) => camelCaseToCebabCase(key))
                        .join('|')
                },
                {
                    title: 'Example set post frequency (minutes)',
                    text: `/${variables.slack.COMMAND} ${this.moduleName} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${BASE_CONFIGURE_COMMANDS.FREQUENCY}=20`
                },
                {
                    title: `Example set post strategy. Available: As soon as possible = 1, Random and single = 2`,
                    text: `/${variables.slack.COMMAND} ${this.moduleName} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${BASE_CONFIGURE_COMMANDS.POST_STRATEGY}=2`
                }
            ].concat(this.additionalHelpCommands)
        });
    }

}
