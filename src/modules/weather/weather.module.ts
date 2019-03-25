import {Observable} from 'rxjs/Observable';

import variables from '../../configs/variables';
import {ISlackWebHookRequestBody} from '../../interfaces/i-slack-web-hook-request-body';
import {ISlackWebHookRequestBodyAttachment} from '../../interfaces/i-slack-web-hook-request-body-attachment';
import {SlackService} from '../../services/slack.service';
import {IWeatherItem, OpenWeatherService} from './open-weather.service';

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
    const attachments: ISlackWebHookRequestBodyAttachment[] = OpenWeatherService.weatherItemToSlackAttachment(data);

    return SlackService.postToChanel(variables.slack.SLACK_TEST_CHANEL_LINK, <ISlackWebHookRequestBody>{
      text: '',
      attachments: attachments
    });
  }
}

const weatherModule = new WeatherModule();

export default weatherModule;
