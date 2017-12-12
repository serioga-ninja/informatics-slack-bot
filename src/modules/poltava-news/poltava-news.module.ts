import {BaseModuleClass} from '../core/BaseModule.class';
import {CONFIG_HAS_CHANGED} from '../core/Commands';
import {ModuleTypes} from '../core/Enums';
import poltavaNewsConfigureCommand from './commands/configure.command';
import poltavaNewsEmitter from './poltava-news.emitter';
import {PoltavaNewsRouter} from './poltava-news.router';
import {PoltavaNewsService} from './poltava-news.service';
import poltavaNewsRegistrationCommand from './commands/registration.command';
import RegisteredModuleModel from '../../models/registered-module.model';

import 'rxjs/add/observable/interval';
import {RegisteredModulesService} from '../core/Modules.service';
import poltavaNewsRemoveCommand from './commands/remove.command';
import poltavaNewsInstanceFactory from './poltava-news-instanace.factory';
import helpCommand from './commands/help.command';

const POST_FREQUENCY = 1000 * 60 * 10;

const URLS = [
    'https://poltava.to/rss/news.xml'
];

class PoltavaNewsModule extends BaseModuleClass {

    moduleName = 'PoltavaNewsModule';

    routerClass: PoltavaNewsRouter = new PoltavaNewsRouter();

    registerCommand = poltavaNewsRegistrationCommand;

    removeCommand = poltavaNewsRemoveCommand;

    helpCommand = helpCommand;

    configureCommand = poltavaNewsConfigureCommand;

    commands = {};

    init() {
        super.init();

        poltavaNewsEmitter.on(CONFIG_HAS_CHANGED, (chanelId: string) => {
            this.logService.info(`Update configure for chanelId ${chanelId}`);
            return RegisteredModuleModel
                .findOne({moduleType: ModuleTypes.poltavaNews, chanelId: chanelId})
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
                this.logService.info(`Registering ${collection.length} modules`);
                collection.forEach(module => {
                    RegisteredModulesService.startModuleInstance(poltavaNewsInstanceFactory(module));
                });
            });

    }
}

let poltavaNewsModule = new PoltavaNewsModule();
poltavaNewsModule.init();

export default poltavaNewsModule;