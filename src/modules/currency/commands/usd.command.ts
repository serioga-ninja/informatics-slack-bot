import variables from '../../../configs/variables';
import {BaseCommand} from '../../../core/modules/commands/base-command.class';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../messengers/slack/models/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../../messengers/slack/models/i-slack-web-hook-request-body';
import {IImageParseResult, ImageParser} from '../image-parser';

export class UsdCommand extends BaseCommand {
  public static readonly commandName: string = 'usd';

  public static info(moduleName: string): IInfo[] {
    return [
      {
        title: 'Returns USD',
        text: `/${variables.SLACK.COMMAND} ${moduleName} ${UsdCommand.commandName}`
      }
    ];
  }

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    return Promise.resolve();
  }

  async execute(requestBody: ISlackRequestBody): Promise<ISlackWebHookRequestBody> {
    const imagePath: IImageParseResult = await ImageParser.getCurrenciesTable();
    const currenciesChart: IImageParseResult = await ImageParser.getCurrenciesChart();

    return <ISlackWebHookRequestBody>{
      response_type: 'ephemeral',
      text: '',
      attachments: [
        {text: imagePath.url, image_url: imagePath.url},
        {text: currenciesChart.url, image_url: currenciesChart.url},
      ]
    };
  }
}
