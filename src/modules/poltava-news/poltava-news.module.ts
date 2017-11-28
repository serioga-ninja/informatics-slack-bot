import {BaseModuleClass} from '../BaseModule.class';
import {PoltavaNewsRouter} from './poltava-news.router';
import {PoltavaNewsService} from './poltava-news.service';
import {PoltavaNewsRegistrationCommand} from './commands/registration.command';
import RegisteredModuleModel from '../../models/registered-module.model';
import {ModuleTypes} from '../../enums/module-types';
import {Observable} from 'rxjs/Observable';
import {RegisteredModuleInstance} from '../RegisteredModuleInstance';

const POST_FREQUENCY = 1000 * 60 * 10;

const URLS = [
    'https://poltava.to/news/'
];

class PoltavaNewsModule extends BaseModuleClass {

    routerClass: PoltavaNewsRouter = new PoltavaNewsRouter();

    registerCommand = new PoltavaNewsRegistrationCommand();

    commands = {};

    startedInstances: RegisteredModuleInstance[] = [];

    init() {
        PoltavaNewsService
            .activeModules
            .subscribe(modules => {
                let activeModulesIds = this.startedInstances.map(item => item.model._id.toString());
                let modulesIds = modules.map(item => item._id.toString());

                let modulesToRemove = this.startedInstances
                    .filter(inst => modulesIds.indexOf(inst.model._id.toString()) === -1);
                let modulesToAdd = modules
                    .filter(module => activeModulesIds.indexOf(module._id.toString()) === -1);

                console.log(modules);
                // create a subject for each of module
            });

        RegisteredModuleModel
            .find({module_type: ModuleTypes.poltavaNews})
            .then(collection => {
                PoltavaNewsService
                    .activeModules
                    .next(collection);
            });

        Observable
            .interval(POST_FREQUENCY)
            .subscribe(() => {
                this.collectData();
            });

        this.collectData();
    }

    collectData() {
        let poltavaNewsService = new PoltavaNewsService(URLS);

        poltavaNewsService
            .grabTheData()
            .then(data => PoltavaNewsService.filterData(data))
            .then(data => PoltavaNewsService.saveToDB(data));
    }
}

let poltavaNewsModule = new PoltavaNewsModule();

export default poltavaNewsModule;