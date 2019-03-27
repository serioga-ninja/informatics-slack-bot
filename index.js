if (process.env.NODE_ENV === 'development') {
  require('ts-node').register({/* options */});
  require('dotenv').load();
  require('./src/index');
} else if (process.env.NODE_ENV === 'production') {
  try {
    require('dotenv').load();
  } catch (e) {
  }

  require('./build/index');
}
