import variables from '../../../configs/variables';
import {ModuleTypes} from '../../../core/enums';
import {BaseCommand} from '../../../core/modules/commands/base-command.class';
import LinksToPostModel, {ILinksToPostModelDocument} from '../../../db/models/links-to-post.model';
import {IInfo} from '../../../interfaces/i-info';
import {ILinksToPostModel} from '../../../interfaces/i-links-to-post.model';
import {ISlackWebHookRequestBody} from '../../../messengers/slack/interfaces/i-slack-web-hook-request-body';
import {ISlackWebHookRequestBodyAttachment} from '../../../messengers/slack/interfaces/i-slack-web-hook-request-body-attachment';

export class LatestCommand extends BaseCommand {
  public static readonly commandName: string = 'latest';

  public static info(moduleName: string): IInfo[] {
    return [{
      title: 'Usage',
      text: `/${variables.slack.COMMAND} ${moduleName} ${LatestCommand.commandName}`
    }];
  }

  async execute(): Promise<ISlackWebHookRequestBody> {
    const model: ILinksToPostModelDocument = await LinksToPostModel.findOne({
      contentType: ModuleTypes.PoltavaNews
    }, null, {sort: {createdAt: -1}});
    const modelJson: ILinksToPostModel = model.toJSON();

    return {
      response_type: 'in_channel',
      text: '',
      attachments: [
        <ISlackWebHookRequestBodyAttachment>{
          title_link: modelJson.contentUrl,
          image_url: modelJson.contentUrl,
          title: modelJson.title
        }
      ]
    };
  }
}
