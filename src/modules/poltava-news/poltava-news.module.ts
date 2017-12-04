import {BaseModuleClass} from '../core/BaseModule.class';
import {PoltavaNewsRouter} from './poltava-news.router';
import {PoltavaNewsService} from './poltava-news.service';
import poltavaNewsRegistrationCommand from './commands/registration.command';
import RegisteredModuleModel from '../slack-apps/models/registered-module.model';
import {ModuleTypes} from '../../enums/module-types';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/interval';
import {RegisteredModulesService} from '../core/Modules.service';
import poltavaNewsRemoveCommand from './commands/remove.command';
import poltavaNewsInstanceFactory from './poltava-news-instanace.factory';
import {LogService} from '../../services/log.service';
import commandInProgress from '../slack-apps/commands/in-progress';

let logService = new LogService('PoltavaNewsModule');

const POST_FREQUENCY = 1000 * 60 * 10;

const URLS = [
    'https://poltava.to/news/'
];

class PoltavaNewsModule extends BaseModuleClass {

    routerClass: PoltavaNewsRouter = new PoltavaNewsRouter();

    registerCommand = poltavaNewsRegistrationCommand;

    removeCommand = poltavaNewsRemoveCommand;

    helpCommand = commandInProgress;

    commands = {};

    init() {
        Observable
            .interval(POST_FREQUENCY)
            .subscribe(() => {
                this.collectData();
            });

        super.init();
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
                moduleType: ModuleTypes.poltavaNews,
                isActive: true
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