import {Observable} from 'rxjs/Observable';

import variables from '../../configs/variables';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import {IWeatherItem, OpenWeatherService} from '../../services/open-weather.service';
import {SlackService} from '../../services/slack.service';

const COLLECT_WEATHER_INTERVAL = 21600000;

class WeatherModule {

    init(): void {
        const openWeatherService = new OpenWeatherService();

        Observable
            .interval(COLLECT_WEATHER_INTERVAL)
            .subscribe((data) => {
                openWeatherService
                    .grabOpenWeatherData()
                    .then((data) => openWeatherService.lastWeather = data);
            });

        openWeatherService.grabOpenWeatherData()
            .then((data) => openWeatherService.lastWeather = data);
    }


    postWeatherToTheChanel(data: IWeatherItem[]): Promise<any> {
        const attachments: ISlackWebhookRequestBodyAttachment[] = OpenWeatherService.weatherItemToSlackAttachment(data);

        return SlackService.postToChanel(variables.slack.SLACK_TEST_CHANEL_LINK, {
            text: '',
            attachments: attachments
        });
    }
}

const weatherModule = new WeatherModule();

export default weatherModule;
