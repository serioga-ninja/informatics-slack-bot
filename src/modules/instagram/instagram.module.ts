import {ModuleTypes} from '../core/Enums';
import helpCommand from './commands/help.command';
import {InstagramService} from './instagram.service';

import {BaseModuleClass} from '../core/BaseModule.class';
import instagramLinksRegistrationCommand from './commands/registration.command';
import RegisteredModuleModel from '../slack-apps/models/registered-module.model';

import 'rxjs/add/observable/interval';
import {RegisteredModulesService} from '../core/Modules.service';
import instagramLinksRemoveCommand from './commands/remove.command';
import {InstagramRouter} from './instagram.router';
import instagramInstanceFactory from './instagram-instanace.factory';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';
import instagramLinksConfigureCommand from './commands/configure.command';
import instagramEmitter from './instagram.emitter';
import {CONFIG_HAS_CHANGED} from '../core/Commands';
import * as _ from 'lodash';

class InstagramModule extends BaseModuleClass {

    moduleName = 'InstagramModule';

    routerClass: InstagramRouter = new InstagramRouter();

    registerCommand = instagramLinksRegistrationCommand;

    removeCommand = instagramLinksRemoveCommand;

    configureCommand = instagramLinksConfigureCommand;

    helpCommand = helpCommand;

    commands = {};

    init() {
        super.init();

        instagramEmitter.on(CONFIG_HAS_CHANGED, (chanelId: string) => {
            this.logService.info(`Update configure for chanelId ${chanelId}`);
            return RegisteredModuleModel
                .findOne({moduleType: ModuleTypes.instagramLinks, chanelId: chanelId})
                .then(moduleModel => {

                    this.collectData().then(() => {
                        RegisteredModulesService
                            .startedInstances
                            .find(inst => moduleModel._id.equals(inst.modelId))
                            .init();
                    });
                });
        });
    }

    collectData() {
        this.logService.info(`Collecting data`);

        return RegisteredModuleModel
            .find(<IRegisteredModule<IInstagramConfiguration>>{
                moduleType: ModuleTypes.instagramLinks,
                isActive: true
            })
            .select('configuration.links')
            .then(modulesCollection => {
                let instagramPublicIds: string[] = _.uniq(
                    modulesCollection
                        .map(module => module.configuration.links)
                        .reduce((all: string[], current: string[]) => {
                            return all.concat(current);
                        }, [])
                );

                this.logService.info(`Collecting data for public`, instagramPublicIds);

                let instagramPhotoParser = new InstagramService(instagramPublicIds, new RegExp(/"thumbnail_src": "([\w:\/\-\.\n]+)/g));

                return instagramPhotoParser
                    .collectData()
                    .then(data => InstagramService.filterLinks(data))
                    .then(data => InstagramService.saveToDB(data));
            });
    }

    preloadActiveModules() {
        return RegisteredModuleModel
            .find({
                moduleType: ModuleTypes.instagramLinks,
                isActive: true
            })
            .then(collection => {
                this.logService.info(`Registering ${collection.length} modules`);
                collection.forEach(module => {
                    RegisteredModulesService.startModuleInstance(instagramInstanceFactory(module));
                });
            });

    }
}

let instagramModule = new InstagramModule();
instagramModule.init();

export default instagramModule;