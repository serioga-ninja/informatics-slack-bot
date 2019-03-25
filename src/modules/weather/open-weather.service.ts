import * as qs from 'querystring';
import * as request from 'request';

import variables from '../../configs/variables';
import {ISlackWebHookRequestBodyAttachment} from '../../interfaces/i-slack-web-hook-request-body-attachment';


export interface IWeatherItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: { id: number; main: string; description: string; icon: string; } [];
  clouds: { all: number; };
  wind: { speed: number; deg: number; };
  sys: { pod: string; };
  dt_txt: string;
}

interface ISuccessResponse {
  id: number;
  name: string;
  coord: { lon: number; lat: number };
  country: string;
  cod: string;
  message: string;
  cnt: number;
  list: IWeatherItem[];
}

export class OpenWeatherService {
  public lastWeather: ISuccessResponse;

  static get PoltavaRequestUrl(): string {
    return `http://api.openweathermap.org/data/2.5/forecast?${qs.stringify({
      id: variables.weather.poltavaCityId,
      lang: 'ua',
      appid: variables.weather.openWeatherApiKey,
      units: 'metric'
    })}`;
  }

  static get PoltavaHtmlViewLink(): string {
    return `http://openweathermap.org/city/${variables.weather.poltavaCityId}?utm_source=openweathermap&utm_medium=widget&utm_campaign=html_old`;
  }

  static getWeatherIcon(ico: string): string {
    return `http://openweathermap.org/img/w/${ico}.png`;
  }

  static weatherItemToSlackAttachment(items: IWeatherItem[]): ISlackWebHookRequestBodyAttachment[] {
    return items
      .map((row) => {
        return <ISlackWebHookRequestBodyAttachment>{
          ts: row.dt.toString(),
          footer: 'openweathermap',
          footer_icon: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/favicon.ico',
          title_link: OpenWeatherService.PoltavaHtmlViewLink,
          image_url: OpenWeatherService.getWeatherIcon(row.weather[0].icon),
          color: '#36a64f',
          title: `${Math.ceil(row.main.temp)}C, ${row.weather[0].description}`
        };
      });
  }

  getAvailableData(): Promise<ISuccessResponse> {
    return new Promise((resolve) => {
      if (this.lastWeather) {
        return resolve(this.lastWeather);
      }

      return this.grabOpenWeatherData().then((data) => {
        this.lastWeather = data;
        resolve(data);
      });
    });
  }

  grabOpenWeatherData(): Promise<ISuccessResponse> {
    return new Promise((resolve) => {
      request
        .get(OpenWeatherService.PoltavaRequestUrl, (err, result: any) => {
          resolve(JSON.parse(result.body));
        });
    });
  }

}

const weatherService = new OpenWeatherService();

export default weatherService;
