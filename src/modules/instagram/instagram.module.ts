import {InstagramService} from './instagram.service';

import {BaseModuleClass} from '../core/BaseModule.class';
import instagramLinksRegistrationCommand from './commands/registration.command';
import RegisteredModuleModel from '../slack-apps/models/registered-module.model';
import {ModuleTypes} from '../../enums/module-types';

import 'rxjs/add/observable/interval';
import {RegisteredModulesService} from '../core/Modules.service';
import instagramLinksRemoveCommand from './commands/remove.command';
import {LogService} from '../../services/log.service';
import {InstagramRouter} from './instagram.router';
import instagramInstanceFactory from './instagram-instanace.factory';
import {IInstagramConfiguration, IRegisteredModule} from '../../interfaces/i-registered-module';
import instagramLinksConfigureCommand from './commands/configure.command';
import commandInProgress from '../slack-apps/commands/in-progress';
import instagramEmitter from './instagram.emitter';
import {CONFIG_HAS_CHANGED} from '../core/Commands';
import * as _ from 'lodash';

let logService = new LogService('InstagramModule');

const URLS = [
    'http://instagram.com/art_of_ck',
    'http://instagram.com/sensual_models',
    'http://instagram.com/sensuality_bnw',
    'http://instagram.com/man_talk_about_this',
    'http://instagram.com/mens_top_girls',
    'http://instagram.com/beautiful_shapes777',
    'http://instagram.com/top_girl_russia_',
    'http://instagram.com/playboy_moscow',
    'http://instagram.com/exclusive_grls',
    'http://instagram.com/top_hotestgirls_',
    'http://instagram.com/prideallamen',
    'http://instagram.com/classybabesxo'
];

class InstagramModule extends BaseModuleClass {

    routerClass: InstagramRouter = new InstagramRouter();

    registerCommand = instagramLinksRegistrationCommand;

    removeCommand = instagramLinksRemoveCommand;

    configureCommand = instagramLinksConfigureCommand;

    helpCommand = commandInProgress;

    commands = {};

    init() {
        super.init();

        instagramEmitter.on(CONFIG_HAS_CHANGED, (chanelId: string) => {
            logService.info(`Update configure for chanelId ${chanelId}`);
            return RegisteredModuleModel
                .findOne({moduleType: ModuleTypes.instagramLinks, chanelId: chanelId})
                .then(moduleModel => {
                    let updatedIns = RegisteredModulesService
                        .startedInstances
                        .filter(inst => inst.model.chanelId === chanelId && inst.model.moduleType === ModuleTypes.instagramLinks)[0];

                    updatedIns.model = moduleModel;
                    this
                        .collectData()
                        .then(() => {
                            updatedIns.onAction();
                        });
                });
        });
    }

    collectData() {
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
                logService.info(`Registering ${collection.length} modules`);
                collection.forEach(module => {
                    RegisteredModulesService.startModuleInstance(instagramInstanceFactory(module));
                });
            });

    }
}

let instagramModule = new InstagramModule();
instagramModule.init();

export default instagramModule;