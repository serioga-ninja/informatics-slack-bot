import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../../classes/router.class';
import LinkModel from '../../models/link.model';
import {LinkTypes} from '../../enums/link-types';

export class LinksRouter extends RouterClass {

    getLinks(req: Request, res: Response) {
        return LinkModel
            .aggregate({$match: {type: LinkTypes.InstagramLink}})
            .then(data => {
                res.json(data);
            })
    }

    init() {
        this.router.get('/', this.getLinks);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const linksRouter = new LinksRouter();

export default linksRouter.router;