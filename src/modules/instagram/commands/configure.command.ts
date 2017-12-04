import {BaseCommand} from '../../core/BaseCommand.class';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ChannelIsRegistered, SimpleCommandResponse, ValidateConfigs} from '../../core/CommandDecorators';
import * as Promise from 'bluebird';
import {ModuleTypes} from '../../../enums/module-types';
import {IRegisteredModuleModelDocument, RegisteredModuleModel} from '../../slack-apps/models/registered-module.model';
import * as _ from 'lodash';
import {IInstagramConfiguration} from '../../../interfaces/i-registered-module';
import {IConfigurationList} from '../../core/interfaces';
import instagramEmitter from '../instagram.emitter';
import {CONFIG_HAS_CHANGED} from '../../core/Commands';

interface IInstagramLinksConfig {
    addLinks: string;
}


const configActions: IConfigurationList<string[]> = {
    addLinks: (requestBody: ISlackRequestBody, links: string[]) => {
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
            });
    },

    removeLinks: (requestBody: ISlackRequestBody, links: string[]) => {
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
            });
    },
};


class InstagramLinksConfigureCommand extends BaseCommand {

    @ChannelIsRegistered
    @SimpleCommandResponse
    @ValidateConfigs(configActions)
    execute(requestBody: ISlackRequestBody, configs: IInstagramLinksConfig): Promise<any> {
        return Promise.each(Object.keys(configs), (key: string) => {
            return configActions[key](requestBody, configs[key]);
        })
            .then(() => instagramEmitter.emit(CONFIG_HAS_CHANGED, requestBody.channel_id));
    }
}

let instagramLinksConfigureCommand = new InstagramLinksConfigureCommand();

export default instagramLinksConfigureCommand;