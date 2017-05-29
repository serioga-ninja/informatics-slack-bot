import * as Sequelize from 'sequelize';
import sequelize from '../configs/db/db';

export const Post = sequelize.define('posts', {
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

export default Post;