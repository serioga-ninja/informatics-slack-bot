import Sequelize = require('sequelize');
import sequelize = require('./helpers/db');

export var Posts = sequelize.define('posts', {
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