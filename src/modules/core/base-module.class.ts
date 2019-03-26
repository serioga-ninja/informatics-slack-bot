import 'rxjs/add/observable/interval';
import {Observable} from 'rxjs/Observable';
import RegisteredModuleModel from '../../db/models/registered-module.model';

import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../interfaces/i-slack-web-hook-request-body';
import {LoggerService} from '../../services/logger.service';
import {CONFIG_HAS_CHANGED} from './commands';

import {IBaseCommandStatic} from './commands/base-command.class';
import {ModuleTypes} from './enums';
import {RegisteredModulesService} from './modules.service';
import EventEmitter = NodeJS.EventEmitter;

const PRELOAD_DATA_FREQUENCY = 600000;

export interface IBaseModuleClass {
  moduleType: ModuleTypes;
  moduleName: string;
  commands: IBaseCommandStatic[];
  emitter?: EventEmitter;
  execute(requestBody: ISlackRequestBody, command: string, args?: object): Promise<ISlackWebHookRequestBody>;
  hasCommand(commandName: string): boolean;
  collectData(): Promise<any>;
  init(): void;
  preloadActiveModules(): Promise<any>;
}

export abstract class BaseModuleClass implements IBaseModuleClass {
  abstract moduleType: ModuleTypes;
  abstract moduleName: string;
  abstract commands: IBaseCommandStatic[];
  emitter?: EventEmitter;
  protected logService: LoggerService;

  init(): void {
    this.logService = new LoggerService(this.moduleName);

    Observable
      .interval(PRELOAD_DATA_FREQUENCY)
      .subscribe(() => {
        this.collectData();
      });

    if (this.emitter) {
      this.emitter.on(CONFIG_HAS_CHANGED, async (chanelId: string) => {
        this.logService.info(`Update configure for module ${this.moduleName} chanelId ${chanelId}`);

        const moduleModel = await RegisteredModuleModel.findOne({moduleType: this.moduleType, chanelId: chanelId});

        await this.collectData();

        try {
          await RegisteredModulesService
            .startedInstances
            .find((inst) => moduleModel._id.equals(inst.modelId))
            .init();
        } catch (e) {
          this.logService.error(e);
        }
      });
    }

    this.collectData()
      .then(() => this.preloadActiveModules());
  }

  hasCommand(commandName: string): boolean {
    return this.commands.filter((command) => command.commandName === commandName).length > 0;
  }

  // method used to collect all the necessary data
  abstract collectData(): Promise<any>;

  abstract preloadActiveModules(): Promise<any>;

  async execute(requestBody: ISlackRequestBody, commandName: string, args?: object): Promise<ISlackWebHookRequestBody> {
    const Command: IBaseCommandStatic = this.commands.find((command) => command.commandName === commandName);

    if (Command.requireArgs && Object.keys(args).length === 0) {
      return new Command(this).help();
    }

    const command = new Command(this);

    await command.validate(requestBody);

    const result: ISlackWebHookRequestBody = await command.execute(requestBody, args);

    return <ISlackWebHookRequestBody>{
      response_type: 'in_channel',
      text: result.text || 'Success!',
      attachments: result.attachments || []
    };
  }

}
