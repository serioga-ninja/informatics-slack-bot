import {Request, Response, NextFunction} from 'express';
import {RouterClass} from '../../classes/router.class';
import boobsService from '../../services/boobs.service';
import weatherService, {WeatherService} from '../../services/weather.service';

export class SlackCommandsRouter extends RouterClass {

    public getSomeBoobs(req: Request, res: Response, next: NextFunction) {
        return boobsService
            .getAllImages()
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

    public getSomeWeather(req: Request, res: Response) {
        let itemsToShow = 3;
        let {text} = req.body;
        if (text.length > 0 && typeof parseInt(text.split(' ')[0], 10) === 'number') {
            itemsToShow = parseInt(text.split(' ')[0], 10);
        }


        return weatherService
            .getAvailableData()
            .then(data => {
                res.json({
                    response_type: 'in_channel',
                    text: '',
                    attachments: WeatherService.weatherItemToSlackAttachment(data.list.slice(0, itemsToShow))
                });
            });
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/boobs', this.getSomeBoobs);
        this.router.post('/weather', this.getSomeWeather);
    }

}

// Create the SlackRouter, and export its configured Express.Router
const slackBoobsRouter = new SlackCommandsRouter();

export default slackBoobsRouter.router;