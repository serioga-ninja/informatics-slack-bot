import {IBaseModuleClass} from '../core/modules/base-module.class';
import currencyModule from './currency/currency.module';
import instagramModule from './instagram/instagram.module';
import poltavaNewsModule from './poltava-news/poltava-news.module';
import weatherModule from './weather/weather.module';

const MODULES_LIST: IBaseModuleClass[] = [
  poltavaNewsModule,
  instagramModule,
  currencyModule,
  weatherModule
];

export default MODULES_LIST;
