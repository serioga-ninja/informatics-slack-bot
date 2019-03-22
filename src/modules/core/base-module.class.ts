import 'rxjs/add/observable/interval';
import {Observable} from 'rxjs/Observable';

import {ISlackRequestBody} from '../../interfaces/i-slack-request-body';
import {ISlackWebhookRequestBody} from '../../interfaces/i-slack-webhook-request-body';
import RegisteredModuleModel from '../../models/registered-module.model';
import {LoggerService} from '../../services/logger.service';
import MODULES_CONFIG from '../modules.config';
import commandInProgress from '../slack-apps/commands/in-progress';

import {BaseCommand} from './base-command.class';
import {CONFIG_HAS_CHANGED} from './commands';
import {ModuleTypes} from './enums';
import {RegisteredModulesService} from './modules.service';
import EventEmitter = NodeJS.EventEmitter;

const PRELOAD_DATA_FREQUENCY = 600000;

const CALL_HELP_ON_EMPTY_ARGS_COMMANDS = [
  MODULES_CONFIG.COMMANDS.CONFIGURE
];

export interface IBaseModuleClass {
  moduleType: ModuleTypes;
  moduleName: string;
  registerCommand: BaseCommand;
  removeCommand: BaseCommand;
  helpCommand: BaseCommand;
  configureCommand: BaseCommand;
  commands: { [key: string]: BaseCommand };
  emitter?: EventEmitter;
}

export abstract class BaseModuleClass implements IBaseModuleClass {
  abstract moduleType: ModuleTypes;

  protected logService: LoggerService;

  abstract moduleName: string;

  // informatics-slack-bot [:moduleName] init
  abstract registerCommand: BaseCommand = commandInProgress;

  // informatics-slack-bot [:moduleName] remove
  abstract removeCommand: BaseCommand = commandInProgress;

  // informatics-slack-bot [:moduleName] [:help]
  abstract helpCommand: BaseCommand = commandInProgress;

  // informatics-slack-bot [:moduleName] config
  public configureCommand: BaseCommand = commandInProgress;

  abstract commands: { [key: string]: BaseCommand };

  emitter?: EventEmitter;

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

  // method used to collect all the necessary data
  abstract collectData(): Promise<any>;

  abstract preloadActiveModules(): Promise<any>;

  execute(requestBody: ISlackRequestBody, command: string, args?: object): Promise<ISlackWebhookRequestBody> {
    let executableCommand: BaseCommand;

    switch (command) {
      case MODULES_CONFIG.COMMANDS.INIT:
        executableCommand = this.registerCommand;
        break;
      case MODULES_CONFIG.COMMANDS.REMOVE:
        executableCommand = this.removeCommand;
        break;
      case MODULES_CONFIG.COMMANDS.CONFIGURE:
        executableCommand = this.configureCommand;
        break;
      case MODULES_CONFIG.COMMANDS.HELP:
        executableCommand = this.helpCommand;
        break;
      default:
        executableCommand = this.commands[command];
    }

    if (CALL_HELP_ON_EMPTY_ARGS_COMMANDS.indexOf(command) !== -1 && Object.keys(args).length === 0) {
      return executableCommand
        .help();
    }

    return executableCommand
      .execute(requestBody, args);
  }

}
