import variables from '../../../configs/variables';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {BaseConfigureCommand, IBaseConfigureCommand} from '../../core/BaseConfigureCommand';
import {BASE_CONFIGURE_COMMANDS, baseConfigureCommandsFactory} from '../../core/BaseConfigureCommands.factory';
import {ChannelIsRegistered, SimpleCommandResponse, ValidateConfigs} from '../../core/CommandDecorators';
import {ModuleTypes} from '../../core/Enums';
import {camelCaseToCebabCase, simpleSuccessAttachment} from '../../core/utils';
import MODULES_CONFIG from '../../modules.config';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../../slack-apps/models/registered-module.model';
import * as _ from 'lodash';
import {IInstagramConfiguration} from '../../../interfaces/i-registered-module';
import {IConfigurationList} from '../../core/Interfaces';
import instagramEmitter from '../instagram.emitter';

interface IInstagramLinksConfig {
    addLinks?: string[];
    removeLinks?: string[];
    showLinks?: string[];
    frequency?: string[];
}

const INSTAGRAM_LINKS_AVAILABLE_CONFIGS = {
    ...BASE_CONFIGURE_COMMANDS,

    ADD_LINKS: 'addLinks',
    REMOVE_LINKS: 'removeLinks',
    SHOW_LINKS: 'showLinks'
};


const configActions: IConfigurationList<string[]> = {
    ...baseConfigureCommandsFactory(ModuleTypes.instagramLinks),

    [INSTAGRAM_LINKS_AVAILABLE_CONFIGS.ADD_LINKS]: (requestBody: ISlackRequestBody, links: string[]) => {
        return RegisteredModuleModel
            .findOne({chanelId: requestBody.channel_id, moduleType: ModuleTypes.instagramLinks})
            .then((moduleModel: IRegisteredModuleModelDocument<IInstagramConfiguration>) => {
                let configuration: IInstagramConfiguration = moduleModel.configuration;
                let allLinks = (configuration.links || [])
                    .concat(links)
                    .map(link => link.split('/').slice(-1)[0]);

                allLinks = _.uniq(allLinks);

                return moduleModel.set({
                    configuration: {
                        ...configuration,
                        links: allLinks
                    }
                }).save()
            })
            .then(() => ([simpleSuccessAttachment()]));
    },

    [INSTAGRAM_LINKS_AVAILABLE_CONFIGS.REMOVE_LINKS]: (requestBody: ISlackRequestBody, links: string[]) => {
        return RegisteredModuleModel
            .findOne({chanelId: requestBody.channel_id, moduleType: ModuleTypes.instagramLinks})
            .then((moduleModel: IRegisteredModuleModelDocument<IInstagramConfiguration>) => {
                let configuration: IInstagramConfiguration = moduleModel.configuration;
                let linksToRemove = links.map(link => link.split('/').slice(-1)[0]);

                let differences = _.difference(configuration.links || [], linksToRemove);
                let addLinks = configuration.links.filter(link => differences.indexOf(link) !== -1);

                return moduleModel.set({
                    configuration: {
                        ...configuration,
                        links: addLinks
                    }
                }).save()
            })
            .then(() => ([simpleSuccessAttachment()]));
    },

    [INSTAGRAM_LINKS_AVAILABLE_CONFIGS.SHOW_LINKS]: (requestBody: ISlackRequestBody) => {
        return RegisteredModuleModel
            .findOne({chanelId: requestBody.channel_id, moduleType: ModuleTypes.instagramLinks})
            .then((moduleModel: IRegisteredModuleModelDocument<IInstagramConfiguration>) => {
                return moduleModel.configuration.links.map(link => ([simpleSuccessAttachment({title: link})]))
            });
    }
};


class InstagramLinksConfigureCommand extends BaseConfigureCommand<IInstagramLinksConfig> implements IBaseConfigureCommand<IInstagramLinksConfig> {

    moduleName = MODULES_CONFIG.MODULES.INSTAGRAM_LINKS;

    emitter = instagramEmitter;

    configList = configActions;

    additionalHelpCommands = [
        {
            title: 'Example add instagram public',
            text: `/${variables.slack.COMMAND} ${MODULES_CONFIG.MODULES.INSTAGRAM_LINKS} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${camelCaseToCebabCase(INSTAGRAM_LINKS_AVAILABLE_CONFIGS.ADD_LINKS)}=inst_cat_public1,inst_cat_public2`
        },
        {
            title: 'Example remove instagram public',
            text: `/${variables.slack.COMMAND} ${MODULES_CONFIG.MODULES.INSTAGRAM_LINKS} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${camelCaseToCebabCase(INSTAGRAM_LINKS_AVAILABLE_CONFIGS.REMOVE_LINKS)}=inst_cat_public1,inst_cat_public2`
        },
        {
            title: 'Example set post frequency (minutes)',
            text: `/${variables.slack.COMMAND} ${MODULES_CONFIG.MODULES.INSTAGRAM_LINKS} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${camelCaseToCebabCase(INSTAGRAM_LINKS_AVAILABLE_CONFIGS.FREQUENCY)}=20`
        }
    ];

    @ChannelIsRegistered
    @ValidateConfigs(configActions)
    @SimpleCommandResponse
    execute(...args) {
        return super.execute.apply(instagramLinksConfigureCommand, args);
    }
}

let instagramLinksConfigureCommand = new InstagramLinksConfigureCommand();

export default instagramLinksConfigureCommand;