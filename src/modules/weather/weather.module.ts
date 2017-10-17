import {Observable} from 'rxjs/Observable';
import {IWeatherItem, OpenWeatherService} from '../../services/open-weather.service';
import {ISlackWebhookRequestBodyAttachment} from '../../interfaces/i-slack-webhook-request-body-attachment';
import variables from '../../configs/variables';
import {SlackService} from '../../services/slack.service';

const COLLECT_WEATHER_INTERVAL = 1000 * 60 * 60 * 6;

class WeatherModule {

    init(): void {
        let openWeatherService = new OpenWeatherService();

        Observable
            .interval(COLLECT_WEATHER_INTERVAL)
            .subscribe(data => {
                openWeatherService
                    .grabOpenWeatherData()
                    .then(data => openWeatherService.lastWeather = data);
            });

        openWeatherService.grabOpenWeatherData()
            .then(data => openWeatherService.lastWeather = data);
    }


    postWeatherToTheChanel(data: IWeatherItem[]): Promise<any> {
        let attachments: ISlackWebhookRequestBodyAttachment[] = OpenWeatherService.weatherItemToSlackAttachment(data);

        return SlackService.postToChanel(variables.slack.SLACK_TEST_CHANEL_LINK, {
            text: '',
            attachments: attachments
        });
    }
}

let weatherModule = new WeatherModule();

export default weatherModule;