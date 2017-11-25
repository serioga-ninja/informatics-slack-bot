/**
 * Created by serioga on 29.05.17.
 */
import {object} from 'prop-types';

declare module '*.json' {

    let value: object;

    export default value;
}

declare global {
    interface Window { __PRELOADED_STATE__: any; }
}