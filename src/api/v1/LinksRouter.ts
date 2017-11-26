import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../../classes/router.class';
import LinkModel, {ILinkModelDocument, LinkModelSchema} from '../../models/link.model';
import {LinkTypes} from '../../enums/link-types';
import {ILinkModel} from '../../interfaces/i-link-model';

export class LinksRouter extends RouterClass {

    getLinks(req: Request, res: Response) {
        return LinkModel
            .aggregate({$match: {type: LinkTypes.InstagramLink}})
            .then(data => {
                res.json(data);
            })
    }

    updateLinks(req: Request, res: Response) {
        let linkModels: ILinkModel[] = req.body.links;
        let ids: string[] = linkModels.filter(link => !!link._id).map(link => link._id);
        let links: string[] = linkModels.filter(link => !!link.link).map(link => link.link);

        return LinkModel
            .remove({_id: {$in: ids}})
            .then(() => {
                let newLinks: ILinkModel[] = [];

                return Promise.all(links.map(link => {
                    return new LinkModel().set(<ILinkModel>{
                        link: link,
                        type: LinkTypes.InstagramLink
                    }).save().then(link => newLinks.push(link));
                })).then(() => newLinks);
            })
            .then((links) => {
                res.json(links);
            })
    }

    init() {
        this.router.get('/', this.getLinks);
        this.router.put('/', this.updateLinks);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const linksRouter = new LinksRouter();

export default linksRouter.router;