import {InstagramService} from './instagram.service';

import {BaseModuleClass} from '../core/BaseModule.class';
import poltavaNewsRegistrationCommand from './commands/registration.command';
import RegisteredModuleModel from '../slack-apps/models/registered-module.model';
import {ModuleTypes} from '../../enums/module-types';

import 'rxjs/add/observable/interval';
import {RegisteredModulesService} from '../core/Modules.service';
import poltavaNewsRemoveCommand from './commands/remove.command';
import {LogService} from '../../services/log.service';
import {InstagramRouter} from './instagram.router';
import instagramInstanceFactory from './instagram-instanace.factory';

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

    registerCommand = poltavaNewsRegistrationCommand;

    removeCommand = poltavaNewsRemoveCommand;

    commands = {};

    collectData() {
        let instagramPhotoParser = new InstagramService(URLS, new RegExp(/"thumbnail_src": "([\w:\/\-\.\n]+)/g));

        return instagramPhotoParser
            .collectData()
            .then(data => InstagramService.filterLinks(data))
            .then(data => InstagramService.saveToDB(data));
    }

    preloadActiveModules() {
        return RegisteredModuleModel
            .find({
                module_type: ModuleTypes.poltavaNews,
                is_active: true
            })
            .then(collection => {
                logService.info(`Registering ${collection.length} modules`);
                collection.forEach(module => {
                    RegisteredModulesService.startModuleInstance(instagramInstanceFactory(module));
                });
            });

    }
}

let poltavaNewsModule = new InstagramModule();
poltavaNewsModule.init();

export default poltavaNewsModule;