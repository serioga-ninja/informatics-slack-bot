import {PostStrategies} from '../../../core/enums';
import {ILinksToPostModelDocument} from '../../../db/models/links-to-post.model';
import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import {ISlackWebHookRequestBodyAttachment} from '../../../interfaces/i-slack-web-hook-request-body-attachment';
import {SlackRecurringModule} from '../../../messengers/slack/slack.recurring-module';
import {InstagramQueries} from '../instagram.queries';

export class InstagramSlackRecurringModule extends SlackRecurringModule {

  protected mapData(items: ILinksToPostModelDocument[]): ISlackWebHookRequestBody {
    return <ISlackWebHookRequestBody>{
      text: '',
      attachments: items.map((model) => (<ISlackWebHookRequestBodyAttachment>{
        title_link: model.title,
        image_url: model.contentUrl,
        title: model.title
      }))
    };
  }

  protected collectData(): Promise<ILinksToPostModelDocument[]> {
    switch (this.model.configuration.postStrategy) {
      case PostStrategies.RandomSingle:
        return InstagramQueries.getRandomItems(this.model.chanelId, this.model.configuration);
      case PostStrategies.AsSoonAsPossible:
      default:
        return InstagramQueries.getLatest(this.model.chanelId, this.model.configuration);
    }
  }
}
