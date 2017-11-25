import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router';
import App from './components/App';
import {Provider} from 'react-redux';
import {Store} from 'redux';


function getServer(url: string, store: Store<any>, context: object = {}) {

    return ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={url} context={context}>
                <App/>
            </StaticRouter>
        </Provider>
    );
}

export default getServer;