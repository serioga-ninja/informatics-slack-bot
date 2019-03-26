import {ILinksToPostModelDocument, LinksToPostModel} from '../../db/models/links-to-post.model';
import {ILinksToPostModel} from '../../interfaces/i-links-to-post.model';
import {LoggerService} from '../../services/logger.service';
import {ModuleTypes} from '../core/enums';
import {RssParserService} from '../core/rss-parser.service';

interface IRssInstagramItem {
  link: string;
  enclosure: {
    length: string;
    type: string;
    url: string;
  };
}

export interface IParseDataResults {
  chanelId: string;
  results: ILinksToPostModel[];
}

const DOMAIN_URL = 'https://queryfeed.net/instagram?q';

const instagramServiceLogger = new LoggerService('InstagramLogic');

export class InstagramLogic extends RssParserService<IRssInstagramItem, ILinksToPostModel> {

  public urls: string[];

  constructor(instagramPublicIds: string[]) {
    super();

    this.urls = instagramPublicIds.map((id) => `${DOMAIN_URL}=${id}`);
  }

  public static async saveToDB(parseDataResults: IParseDataResults[]) {
    for (const row of parseDataResults) {

      for (const linkObj of row.results) {
        try {
          await new LinksToPostModel().set(<ILinksToPostModel>{
            contentUrl: linkObj.contentUrl,
            title: linkObj.title,
            category: row.chanelId,
            contentType: ModuleTypes.InstagramLinks
          }).save();
        } catch (error) {
          instagramServiceLogger.error(error);
        }
      }
    }
  }

  public static async filterLinks(parseDataResults: IParseDataResults[]): Promise<IParseDataResults[]> {
    const allLinks: ILinksToPostModel[] = parseDataResults
      .map((row) => row.results)
      .reduce((all: ILinksToPostModel[], current: ILinksToPostModel[]) => all.concat(current), []);

    const objects: ILinksToPostModelDocument[] = await LinksToPostModel
      .find({title: {$in: allLinks.map((linkObj) => linkObj.title)}});
    const existingLinks = objects.map((model) => model.title);

    parseDataResults.forEach((parseRowResult) => {
      parseRowResult.results = parseRowResult.results.filter((link) => existingLinks.indexOf(link.title) === -1);
    });

    return parseDataResults;
  }

  public mapFn(item: IRssInstagramItem) {

    return <ILinksToPostModel>{
      contentType: ModuleTypes.InstagramLinks,
      contentUrl: item.enclosure.url,
      title: item.link
    };
  }

  public async collectData(): Promise<IParseDataResults[]> {
    const results: IParseDataResults[] = [];

    for (const url of this.urls) {
      try {
        const result = await this.getTheData(url);
        results.push({
          chanelId: url.split('q=').slice(-1)[0],
          results: result
        });
      } catch (e) {
      }
    }

    return results;
  }
}
