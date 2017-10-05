import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../../classes/router.class';
import {InstagramPhotoParser} from '../../services/boobs.service';

export class SlackCommandsRouter extends RouterClass {

    public getSomeBoobs(req: Request, res: Response, next: NextFunction) {
        return new InstagramPhotoParser()
            .grabTheData(false)
            .then(data => {

                res.json({
                    response_type: 'in_channel',
                    text: '',
                    attachments: [{
                        image_url: data[Math.floor(Math.random() * data.length)]
                    }]
                });
            });
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/boobs', this.getSomeBoobs);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackBoobsRouter = new SlackCommandsRouter();

export default slackBoobsRouter.router;