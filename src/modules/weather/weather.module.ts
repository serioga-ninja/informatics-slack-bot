import {Observable} from 'rxjs/Observable';
import {BaseModuleClass} from '../core/base-module.class';
import {IBaseCommandStatic} from '../core/commands/base-command.class';
import {HelpCommand} from '../core/commands/help.command';
import {ModuleTypes} from '../core/enums';
import {GetLastWeatherCommand} from './commands/get-last-weather-command';
import weatherService from './open-weather.service';

const COLLECT_WEATHER_INTERVAL = 21600000;

class WeatherModule extends BaseModuleClass {
  moduleType = ModuleTypes.Weather;

  moduleName = 'weather';

  commands: IBaseCommandStatic[];

  constructor() {
    super();

    this.commands = [
      HelpCommand,
      GetLastWeatherCommand
    ];
  }

  init(): void {
    Observable
      .interval(COLLECT_WEATHER_INTERVAL)
      .subscribe(() => {
        weatherService
          .grabOpenWeatherData()
          .then((data) => weatherService.lastWeather = data);
      });

    weatherService
      .grabOpenWeatherData()
      .then((data) => weatherService.lastWeather = data);
  }
}

const weatherModule = new WeatherModule();
weatherModule.init();

export default weatherModule;
