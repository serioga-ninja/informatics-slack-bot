import {combineReducers} from 'redux';
import linksReducer from './links/links';

const botApp = combineReducers({
    links: linksReducer
});

export default botApp;

