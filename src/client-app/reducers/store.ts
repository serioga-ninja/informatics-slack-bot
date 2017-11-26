import botApp from './index';
import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

if (typeof window === 'undefined') {
    (<any>global).window = {}
}

// Grab the state from a global variable injected into the server-generated HTML
let preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

// Create Redux store with initial state
let store = createStore(botApp, preloadedState, composeWithDevTools());

export default store;