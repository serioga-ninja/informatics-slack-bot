import * as phantom from 'phantom';

(async () => {
  const instance = await phantom.create();
  const page = await instance.createPage();

  await page.setting('userAgent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0');
  await page.property('viewportSize', {width: 500, height: 768});
  await page.property('clipRect', {top: 740, left: 952, width: 323, height: 263});
  await page.open('https://minfin.com.ua/ua/currency/mb/');
  await page.render(`public/images/${new Date().getTime()}.png`);
  await instance.exit();
})();
