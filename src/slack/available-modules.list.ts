import {IBaseModuleClass} from '../modules/core/base-module.class';
import currencyModule from '../modules/currency/currency.module';
import instagramModule from '../modules/instagram/instagram.module';
import poltavaNewsModule from '../modules/poltava-news/poltava-news.module';

const MODULES_LIST: IBaseModuleClass[] = [
  poltavaNewsModule,
  instagramModule,
  currencyModule,
];

export default MODULES_LIST;
