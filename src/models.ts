import Sequelize = require('sequelize');
import sequelize = require('./configs/db/db');

export var Posts = sequelize.define('posts', {
    user_id: {
        type: Sequelize.STRING
    },
    appName: {
        type: Sequelize.STRING,
        field: 'app_name'
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    link: {
        type: Sequelize.STRING
    },
    pubDate: {
        type: Sequelize.DATE,
        field: 'pub_date'
    }
});