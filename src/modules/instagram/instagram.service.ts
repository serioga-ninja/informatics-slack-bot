import {ParserService} from '../../classes/parser.service';
import InstagramLinkModel, {IInstagramLinkModelDocument} from './models/instagram-link.model';
import {IInstagramLinkModel} from './interfaces/i-instagram-link-model';

const DOMAIN_URL = 'https://api.instagram.com';

export class InstagramService extends ParserService<string[]> {

    public static parseUrlFn(a: string[]): string {
        return a[1];
    }

    public static filterLinks(data: string[]): Promise<string[]> {

        return InstagramLinkModel
            .aggregate({$match: {link: {$in: data}}})
            .then((objects: IInstagramLinkModelDocument[]) => {
                return data
                    .filter(link => {
                        return !objects.find((obj) => {
                            return obj.image_url === link;
                        });
                    })
            });
    }

    public static saveToDB(data: string[]) {
        return Promise.all(data.map(link => {
            return new InstagramLinkModel().set(<IInstagramLinkModel>{
                image_url: link
            }).save();
        }))
    }

    public static getAllImageDocuments(): Promise<IInstagramLinkModelDocument[]> {
        return InstagramLinkModel
            .find({link: /^http/})
            .then((data: IInstagramLinkModelDocument[]) => data);
    }

    public static getAllImages(): Promise<string[]> {
        return InstagramService
            .getAllImageDocuments()
            .then(data => {
                return data.map((row: IInstagramLinkModelDocument) => row.image_url)
            });
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