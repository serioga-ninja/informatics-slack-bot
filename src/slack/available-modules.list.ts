import {IBaseModuleClass} from '../modules/core/base-module.class';
import currencyModule from '../modules/currency/currency.module';
import instagramModule from '../modules/instagram/instagram.module';
import poltavaNewsModule from '../modules/poltava-news/poltava-news.module';
import weatherModule from '../modules/weather/weather.module';

const MODULES_LIST: IBaseModuleClass[] = [
  poltavaNewsModule,
  instagramModule,
  currencyModule,
  weatherModule
];

export default MODULES_LIST;
