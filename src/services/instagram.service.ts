import variables from '../configs/variables';
import {ParserService} from '../classes/parser.service';
import ImageModel, {IImageModel, IImageModelDocument} from '../models/image.model';

const DOMAIN_URL = 'https://api.instagram.com';

export class InstagramService extends ParserService<string[]> {

    static parseUrlFn(a: string[]): string {
        return a[1];
    }

    static filterLinks(data: string[]): Promise<string[]> {

        return ImageModel
            .aggregate({$match: {link: {$in: data}}})
            .then((objects: IImageModelDocument[]) => {
                return data
                    .filter(link => {
                        return !objects.find((obj) => {
                            return obj.link === link;
                        });
                    })
            });
    }

    static saveToDB(data: string[]) {
        return Promise.all(data.map(link => {
            return new ImageModel().set(<IImageModel>{
                link: link
            }).save();
        }))
    }

    public static getAllImageDocuments(): Promise<IImageModelDocument[]> {
        return ImageModel
            .find({link: /^http/})
            .then((data: IImageModelDocument[]) => data);
    }

    public static getAllImages(): Promise<string[]> {
        return InstagramService
            .getAllImageDocuments()
            .then(data => {
                return data.map((row: IImageModelDocument) => row.link)
            });
    }

    static get authUrl() {
        return `${DOMAIN_URL}/oauth/authorize/?client_id=${variables.social.instagram.CLIENT_ID}&redirect_uri=${InstagramService.authRedirectUri}&response_type=code`;
    }

    static get authRedirectUri() {
        return `${variables.domainUrl}/api/v1/social/instagram/auth-callback`;
    }

    public urls: string[];
    public thumbnailReg: RegExp;

    constructor(urls: string[], thumbnailReg: RegExp) {
        super();

        this.urls = urls;

        this.thumbnailReg = thumbnailReg;
    }

    public collectData(): Promise<string[]> {
        return this
            .grabTheData(InstagramService.parseUrlFn, this.urls)
            .then((data: string[][]) => {
                return data
                    .reduce((result: string[], current: string[]) => {
                        result = result.concat(current);
                        return result;
                    }, []);
            });
    }
}