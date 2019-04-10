import * as bodyParser from 'body-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import 'rxjs/add/observable/interval';
import variables from './configs/variables';
import './db/config';
import slackRouter from './messengers/slack/api/slack.router';
import {expressLogger} from './services/logger.service';


// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
  }

  public init() {
    this.middleware();
    this.routes();
  }

  // Configure API endpoints.
  private routes(): void {
    // placeholder route handler
    this.express.use('/api/v1/slack', slackRouter.router);
  }

  public start() {
    const server = http.createServer(this.express);
    const port = variables.APP.SERVER_PORT;
    server.listen(port);

    server.on('error', (error: NodeJS.ErrnoException): void => {
      if (error.syscall !== 'listen') throw error;
      const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    server.on('listening', (): void => {
      const addr = server.address();
      const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
      console.log(`Listening on ${bind}`);
    });
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use('/public', express.static('public'));
    this.express.set('view engine', 'ejs');
    this.express.use(expressLogger);
    this.express.use(errorHandler());
    this.express.set('views', [
      path.join(process.cwd(), 'src', 'modules')
    ]);


    if (process.env.NODE_ENV === 'development') {
      // only use in development
      this.express.use(errorHandler());
    }

    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}));
  }
}

const app = new App();
app.init();
app.start();
