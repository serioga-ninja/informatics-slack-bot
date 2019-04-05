import {ILinksToPostModelDocument} from '../../../db/models/links-to-post.model';
import {ISlackWebHookRequestBody} from '../../../interfaces/i-slack-web-hook-request-body';
import {ISlackWebHookRequestBodyAttachment} from '../../../interfaces/i-slack-web-hook-request-body-attachment';
import {SlackRecurringModule} from '../../../messengers/slack/slack.recurring-module';
import {PoltavaNewsQueries} from '../poltava-news.queries';

export class PoltavaNewsSlackRecurringModule extends SlackRecurringModule {

  protected mapData(items: ILinksToPostModelDocument[]): ISlackWebHookRequestBody {
    return <ISlackWebHookRequestBody>{
      text: '',
      attachments: items.map((model) => (<ISlackWebHookRequestBodyAttachment>{
        title_link: model.contentUrl,
        image_url: model.contentUrl,
        title: model.title
      }))
    };
  }

  protected collectData(): Promise<ILinksToPostModelDocument[]> {
    return PoltavaNewsQueries.getLatest(this.model.id, this.model.configuration);
  }
}
