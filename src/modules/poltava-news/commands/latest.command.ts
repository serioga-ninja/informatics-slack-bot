import {ILinksToPostModel} from '../../../interfaces/i-links-to-post.model';
import {ISlackWebhookRequestBody} from '../../../interfaces/i-slack-webhook-request-body';
import {ISlackWebhookRequestBodyAttachment} from '../../../interfaces/i-slack-webhook-request-body-attachment';
import LinksToPostModel, {ILinksToPostModelDocument} from '../../../models/links-to-post.model';
import {BaseCommand} from '../../core/base-command.class';
import {ModuleTypes} from '../../core/enums';

class LatestCommand extends BaseCommand {

  async execute(): Promise<ISlackWebhookRequestBody> {
    const model: ILinksToPostModelDocument = await LinksToPostModel.findOne({
      contentType: ModuleTypes.PoltavaNews
    }, null, {sort: {createdAt: -1}});
    const modelJson: ILinksToPostModel = model.toJSON();

    return {
      response_type: 'in_channel',
      text: '',
      attachments: [
        <ISlackWebhookRequestBodyAttachment>{
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
