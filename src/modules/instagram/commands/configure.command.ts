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
    REMOVE_LINKS: 'removeLinks'
};


const configActions: IConfigurationList<string[], IInstagramConfiguration> = {
    ...baseConfigureCommandsFactory(),

    [INSTAGRAM_LINKS_AVAILABLE_CONFIGS.ADD_LINKS]: (moduleModel: IRegisteredModuleModelDocument<any>, newLinks: string[]) => {
        let configuration: IInstagramConfiguration = moduleModel.configuration;
        let links = (configuration.links || [])
            .concat(newLinks)
            .map(link => link.split('/').slice(-1)[0]);

        links = _.uniq(links);

        return Promise.resolve({
            links
        });
    },

    [INSTAGRAM_LINKS_AVAILABLE_CONFIGS.REMOVE_LINKS]: (moduleModel: IRegisteredModuleModelDocument<any>, newLinks: string[]) => {
        let configuration: IInstagramConfiguration = moduleModel.configuration;
        let linksToRemove = newLinks.map(link => link.split('/').slice(-1)[0]);

        let differences = _.difference(configuration.links || [], linksToRemove);
        let links = configuration.links.filter(link => differences.indexOf(link) !== -1);

        return Promise.resolve({
            links
        });
    }
};


class InstagramLinksConfigureCommand extends BaseConfigureCommand<IInstagramLinksConfig> implements IBaseConfigureCommand<IInstagramLinksConfig> {

    moduleName = MODULES_CONFIG.MODULES.INSTAGRAM_LINKS;

    emitter = instagramEmitter;

    configList = configActions;

    moduleType = ModuleTypes.instagramLinks;

    additionalHelpCommands = [
        {
            title: 'Example add instagram public',
            text: `/${variables.slack.COMMAND} ${MODULES_CONFIG.MODULES.INSTAGRAM_LINKS} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${camelCaseToCebabCase(INSTAGRAM_LINKS_AVAILABLE_CONFIGS.ADD_LINKS)}=inst_cat_public1,inst_cat_public2`
        },
        {
            title: 'Example remove instagram public',
            text: `/${variables.slack.COMMAND} ${MODULES_CONFIG.MODULES.INSTAGRAM_LINKS} ${MODULES_CONFIG.COMMANDS.CONFIGURE} ${camelCaseToCebabCase(INSTAGRAM_LINKS_AVAILABLE_CONFIGS.REMOVE_LINKS)}=inst_cat_public1,inst_cat_public2`
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