import * as fs from 'fs';
import web from '../../../configs/slack';
import variables from '../../../configs/variables';
import {BaseCommand} from '../../../core/modules/commands/base-command.class';
import {IInfo} from '../../../interfaces/i-info';
import {ISlackRequestBody} from '../../../messengers/slack/interfaces/i-slack-request-body';
import {ISlackWebHookRequestBody} from '../../../messengers/slack/interfaces/i-slack-web-hook-request-body';
import {ImageParser} from '../image-parser';

export class UsdCommand extends BaseCommand {
  public static readonly commandName: string = 'usd';

  public static info(moduleName: string): IInfo[] {
    return [
      {
        title: 'Returns USD',
        text: `/${variables.slack.COMMAND} ${moduleName} ${UsdCommand.commandName}`
      }
    ];
  }

  async validate(requestBody: ISlackRequestBody): Promise<void> {
    return Promise.resolve();
  }

  async execute(requestBody: ISlackRequestBody): Promise<ISlackWebHookRequestBody> {

    // it takes too long to generate data, so we send response instantly and then send the files to the channels
    setTimeout(async () => {
      const imagePath: string = await ImageParser.getCurrenciesTable();
      const currenciesChart: string = await ImageParser.getCurrenciesChart();

      fs.readFile(imagePath, async (err, file: Buffer) => {
        await web.files.upload({
          file,
          channels: requestBody.channel_id,
          filename: 'usd.png',
          filetype: 'png',
          title: 'USD'
        });

        fs.unlinkSync(imagePath);
      });

      fs.readFile(currenciesChart, async (err, file: Buffer) => {
        await web.files.upload({
          file,
          channels: requestBody.channel_id,
          filename: 'usd-chart.png',
          filetype: 'png',
          title: 'USD'
        });

        fs.unlinkSync(currenciesChart);
      });

    });

    return {
      response_type: 'ephemeral',
      text: 'Working...'
    };
  }
}
