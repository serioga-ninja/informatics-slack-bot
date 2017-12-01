import {BaseModuleClass} from '../BaseModule.class';
import {PoltavaNewsRouter} from './poltava-news.router';
import {PoltavaNewsService} from './poltava-news.service';
import poltavaNewsRegistrationCommand from './commands/registration.command';
import RegisteredModuleModel from '../../models/registered-module.model';
import {ModuleTypes} from '../../enums/module-types';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/interval';
import {RegisteredModulesService} from '../slack-apps/registered-modules.service';
import poltavaNewsRemoveCommand from './commands/remove.command';
import poltavaNewsInstanceFactory from './poltava-news-instanace.factory';
import {LogService} from '../../services/log.service';

let logService = new LogService('PoltavaNewsModule');

const POST_FREQUENCY = 1000 * 60 * 10;

const URLS = [
    'https://poltava.to/news/'
];

class PoltavaNewsModule extends BaseModuleClass {

    routerClass: PoltavaNewsRouter = new PoltavaNewsRouter();

    registerCommand = poltavaNewsRegistrationCommand;

    removeCommand = poltavaNewsRemoveCommand;

    commands = {};

    init() {
        Observable
            .interval(POST_FREQUENCY)
            .subscribe(() => {
                this.collectData();
            });

        this.collectData().then(() => this.preloadActiveModules());
    }

    collectData() {
        let poltavaNewsService = new PoltavaNewsService(URLS);

        return poltavaNewsService
            .grabTheData()
            .then(data => PoltavaNewsService.filterData(data))
            .then(data => PoltavaNewsService.saveToDB(data));
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
                    RegisteredModulesService.startModuleInstance(poltavaNewsInstanceFactory(module));
                });
            });

    }
}

let poltavaNewsModule = new PoltavaNewsModule();
poltavaNewsModule.init();

export default poltavaNewsModule;