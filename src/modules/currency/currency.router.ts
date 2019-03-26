import {Request, Response} from 'express';
import * as rp from 'request-promise';

import {RouterClass} from '../../api/router.class';

import {IMinFinCurrencyRow} from './currency';


export class CurrencyRouter extends RouterClass {

  public async usd(req: Request, res: Response) {
    const cookiejar = rp.jar();
    cookiejar.setCookie('__cfduid=d6a5a488909a32eeccf6e9bf2310319211549443487; minfin_sessions=9a6c13a54aed7b8fdca215b3845fb2532696666c', 'https://minfin.com.ua');

    const todaysData: IMinFinCurrencyRow[] = await rp({
      jar: cookiejar,
      uri: `https://minfin.com.ua/data/currency/ib/usd.ib.today.json?201903261250`,
      json: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0'
      },
    });
    const yesterdayData: IMinFinCurrencyRow[] = await rp({
      jar: cookiejar,
      uri: `https://minfin.com.ua/data/currency/ib/usd.ib.yesterday.json?201903261720`,
      json: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0'
      },
    });

    res.render('currency/views/currency-graph', {
      todaysData: JSON.stringify(todaysData),
      yesterdayData: JSON.stringify(yesterdayData)
    });
  }

  init() {
    this.router.get('/usd', this.usd);
  }

}

// Create the SlackRouter, and export its configured Express.Router
const currencyRouter = new CurrencyRouter();

export default currencyRouter.router;
