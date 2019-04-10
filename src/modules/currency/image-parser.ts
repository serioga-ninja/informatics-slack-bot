import * as path from 'path';
import * as phantom from 'phantom';
import variables from '../../configs/variables';

export interface IImageParseResult {
  fullPath: string;
  url: string;
}

export class ImageParser {
  public static async getCurrenciesTable(): Promise<IImageParseResult> {

    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.setting('userAgent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0');
    await page.property('viewportSize', {width: 500, height: 768});
    await page.property('clipRect', {top: 460, left: 958, width: 653, height: 210});
    await page.open('https://minfin.com.ua/ua/currency/mb/');

    const imageName: string = `${new Date().getTime()}.png`;
    const imagePath: string = path.join('public', 'images', imageName);
    await page.render(imagePath);
    await instance.exit();

    return {
      fullPath: path.join(process.cwd(), imagePath),
      url: `http://${variables.APP.DOMAIN_URL}/${['public', 'images', imageName].join('/')}`
    };
  }

  public static async getCurrenciesChart(): Promise<IImageParseResult> {

    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.setting('userAgent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0');
    await page.property('viewportSize', {width: 500, height: 768});
    await page.property('clipRect', {top: 740, left: 952, width: 323, height: 263});
    await page.open('https://minfin.com.ua/ua/currency/mb/');

    const imageName: string = `${new Date().getTime()}.png`;
    const imagePath: string = path.join('public', 'images', imageName);
    await page.render(imagePath);
    await instance.exit();

    return {
      fullPath: path.join(process.cwd(), imagePath),
      url: `http://${variables.APP.DOMAIN_URL}/${['public', 'images', imageName].join('/')}`
    };
  }
}
