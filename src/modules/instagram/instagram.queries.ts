import {ModuleTypes} from '../../core/enums';
import LinksToPostModel, {ILinksToPostModelDocument} from '../../db/models/links-to-post.model';
import {IInstagramConfiguration} from '../../interfaces/i-registered-module';

export class InstagramQueries {
  public static async getRandomItems(chanelId: string, configuration: IInstagramConfiguration): Promise<ILinksToPostModelDocument[]> {
    const collection = await LinksToPostModel.aggregate([{
      $match: {
        postedChannels: {
          $nin: [chanelId]
        },
        category: {
          $in: configuration.links
        },
        contentType: ModuleTypes.InstagramLinks
      }
    }]).sample(configuration.limit || 1);

    return collection.map((item) => new LinksToPostModel(item));
  }

  public static async getLatest(chanelId: string, configuration: IInstagramConfiguration): Promise<ILinksToPostModelDocument[]> {
    return LinksToPostModel.find({
      postedChannels: {
        $nin: [chanelId]
      },
      category: {
        $in: configuration.links
      },
      contentType: ModuleTypes.InstagramLinks
    }).limit(configuration.limit || 1);
  }
}
