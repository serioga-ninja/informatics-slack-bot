import 'rxjs/add/observable/interval';

import {ISlackRequestBody} from '../../messengers/slack/models/i-slack-request-body';
import {LoggerService} from '../../services/logger.service';
import {ModuleTypes} from '../enums';
import {IBaseCommandStatic} from './commands/base-command.class';
import {CommandResult, ICommandResult} from './commands/models';
import EventEmitter = NodeJS.EventEmitter;


export interface IBaseModuleClass {
  moduleType: ModuleTypes;
  moduleName: string;
  commands: IBaseCommandStatic[];
  emitter?: EventEmitter;
  execute(requestBody: ISlackRequestBody, command: string, args?: object): Promise<ICommandResult>;
  hasCommand(commandName: string): boolean;
  init(): void;
}

export abstract class BaseModuleClass implements IBaseModuleClass {
  abstract moduleType: ModuleTypes;
  abstract moduleName: string;
  abstract commands: IBaseCommandStatic[];
  emitter?: EventEmitter;
  protected logService: LoggerService;

  init(): void {
    this.logService = new LoggerService(this.moduleName);
  }

  hasCommand(commandName: string): boolean {
    return this.commands.filter((command) => command.commandName === commandName).length > 0;
  }

  async execute(requestBody: ISlackRequestBody, commandName: string, args?: object): Promise<ICommandResult> {
    const Command: IBaseCommandStatic = this.commands.find((command) => command.commandName === commandName);

    if (Command.requireArgs && Object.keys(args).length === 0) {
      return new Command(this).help();
    }

    const command = new Command(this);

    await command.validate(requestBody);

    const result: ICommandResult = await command.execute(requestBody, args);

    return new CommandResult({
      text: result.text || 'Success!',
      attachments: result.attachments || []
    });
  }

}
