import LinksToPostModel, {ILinksToPostModelDocument} from '../../../db/models/links-to-post.model';
import {ILinksToPostModel} from '../../../interfaces/i-links-to-post.model';
import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import {ISlackWebHookRequestBodyAttachment} from '../../../interfaces/i-slack-web-hook-request-body-attachment';
import {BaseCommand} from '../../core/base-command.class';
import {ModuleTypes} from '../../core/enums';

class LatestCommand extends BaseCommand {

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

const latestCommand = new LatestCommand();

export default latestCommand;
