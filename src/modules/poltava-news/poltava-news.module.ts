import 'rxjs/add/observable/interval';
import RegisteredModuleModel from '../../models/registered-module.model';
import {BaseModuleClass} from '../core/BaseModule.class';
import {CONFIG_HAS_CHANGED} from '../core/Commands';
import {ModuleTypes} from '../core/Enums';
import {RegisteredModulesService} from '../core/Modules.service';
import poltavaNewsConfigureCommand from './commands/configure.command';
import helpCommand from './commands/help.command';
import poltavaNewsRegistrationCommand from './commands/registration.command';
import poltavaNewsRemoveCommand from './commands/remove.command';
import poltavaNewsInstanceFactory from './poltava-news-instanace.factory';
import poltavaNewsEmitter from './poltava-news.emitter';
import {PoltavaNewsRouter} from './poltava-news.router';
import {PoltavaNewsService} from './poltava-news.service';

const POST_FREQUENCY = 600000;

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
                .then((moduleModel) => {

                    this.collectData().then(() => {
                        RegisteredModulesService
                            .startedInstances
                            .find((inst) => moduleModel._id.equals(inst.modelId))
                            .init();
                    });
                });
        });
    }

    collectData() {
        const poltavaNewsService = new PoltavaNewsService(URLS);

        return poltavaNewsService
            .grabTheData()
            .then((data) => PoltavaNewsService.filterData(data))
            .then((data) => PoltavaNewsService.saveToDB(data));
    }

    preloadActiveModules() {
        return RegisteredModuleModel
            .find({
                moduleType: ModuleTypes.poltavaNews,
                isActive: true
            })
            .then((collection) => {
                this.logService.info(`Registering ${collection.length} modules`);
                collection.forEach((module) => {
                    RegisteredModulesService.startModuleInstance(poltavaNewsInstanceFactory(module));
                });
            });

    }
}

const poltavaNewsModule = new PoltavaNewsModule();
poltavaNewsModule.init();

export default poltavaNewsModule;
