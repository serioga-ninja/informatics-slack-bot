import * as React from 'react';

import {Link} from 'react-router-dom';
import Links from './Links';
import {Route, Switch} from 'react-router';

class App extends React.Component {

    render() {

        return (
            <div>
                <Link to="/links"> Links </Link>

                <Switch>
                    <Route path="/links" component={Links} />
                </Switch>
            </div>
        ) ;
    }
}

export default App;
