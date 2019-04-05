import {ModuleTypes} from '../../core/enums';
import {IBaseModuleConfiguration} from '../../core/interfaces';
import LinksToPostModel, {ILinksToPostModelDocument} from '../../db/models/links-to-post.model';

export class PoltavaNewsQueries {
  public static async getLatest(chanelId: string, configuration: IBaseModuleConfiguration): Promise<ILinksToPostModelDocument[]> {
    return LinksToPostModel.find({
      postedChannels: {$nin: [chanelId]},
      contentType: ModuleTypes.PoltavaNews
    }).limit(configuration.limit || 1);
  }
}
