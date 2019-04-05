import variables from '../../../configs/variables';
import {BaseCommand} from '../../../core/modules/commands/base-command.class';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import weatherService, {OpenWeatherService} from '../open-weather.service';

interface IAvailableConfigs {
  count: string;
}

export class GetLastWeatherCommand extends BaseCommand {
  public static readonly commandName: string = 'last';

  public static info(moduleName: string): IInfo[] {
    return [
      {
        title: 'Returns last weather',
        text: `/${variables.slack.COMMAND} ${moduleName} ${GetLastWeatherCommand.commandName}`
      },
      {
        title: 'Setting: `count`',
        text: `/${variables.slack.COMMAND} ${moduleName} ${GetLastWeatherCommand.commandName} count=1`
      }
    ];
  }

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    return Promise.resolve();
  }

  async execute(requestBody: ISlackRequestBody, args: IAvailableConfigs): Promise<ISlackWebHookRequestBody> {
    const {count = '1'} = args;
    const {list} = await weatherService.getAvailableData();

    return <ISlackWebHookRequestBody>{
      response_type: 'ephemeral',
      text: '',
      attachments: OpenWeatherService.weatherItemToSlackAttachment(list.slice(0, parseInt(count, 10)))
    };
  }
}
