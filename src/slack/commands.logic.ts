import {ISlackRequestBody} from '../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../interfaces/i-slack-web-hook-request-body';
import {IBaseModuleClass} from '../modules/core/base-module.class';
import MODULES_CONFIG from '../modules/modules.config';
import slackAppModule from '../modules/slack-apps/slack-app.module';
import {LoggerService} from '../services/logger.service';
import MODULES_LIST from './available-modules.list';

type InstagramCommand = 'register' | 'help' | 'configure' | 'remove';


const logService = new LoggerService('CommandsLogic');

export class CommandsLogic {

  static getModule(commandStringArr: string[]): IBaseModuleClass {
    const [moduleName] = commandStringArr;

    return MODULES_LIST.filter((module) => module.moduleName === moduleName)[0] || slackAppModule;
  }

  static getCommand(commandStringArr: string[]): InstagramCommand {
    const command = commandStringArr[1];

    return <InstagramCommand>command || 'help';
  }

  static collectArguments(commandStringArr: string[]): object {
    if (commandStringArr[1] !== MODULES_CONFIG.COMMANDS.CONFIGURE
      || (commandStringArr[1] === MODULES_CONFIG.COMMANDS.CONFIGURE && commandStringArr.length <= 2)) {
      return {};
    }
    const [module, command, ...configArgs] = commandStringArr;

    return configArgs.reduce((all: string[], current: string) => {
      const [key, value] = current.split('=');

      all[key] = (value || '').split(',').map((link) => link.replace(/ /, ''));

      return all;
    }, {});
  }

  private parse(commandString: string): Promise<{ module: IBaseModuleClass, command: string; args: object }> {
    return new Promise((resolve, reject) => {
      let commandStringArr = commandString.split(' ');

      const module: IBaseModuleClass = CommandsLogic.getModule(commandStringArr);

      // if module has not been set we set it to the default one
      if (module.moduleName === slackAppModule.moduleName) {
        commandStringArr = ['app'].concat(commandStringArr);
      }

      const command: string = CommandsLogic.getCommand(commandStringArr);
      const args = CommandsLogic.collectArguments(commandStringArr);

      resolve({module, command, args});
    });
  }

  public async execute(commandString: string, requestBody: ISlackRequestBody): Promise<ISlackWebHookRequestBody> {
    try {
      const {module, command, args} = await this.parse(commandString);

      return module.execute(requestBody, command, args);
    } catch (error) {
      logService.error(error);

      return <ISlackWebHookRequestBody>{
        text: 'error',
        attachments: [
          {
            title: error.name,
            text: error.stack,
            color: '#a60200'
          }
        ]
      };

    }
  }
}

const commandsModule = new CommandsLogic();

export default commandsModule;
