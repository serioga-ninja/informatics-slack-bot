import express = require('express');
import requestLogger = require('./logger');
import customerRouter = require('./router');

export class WebApi {
    constructor(private app:express.Express, private port: number) {
        this.configureMiddleware(app);
        this.configureRoutes(app);
    }

    private configureMiddleware(app: express.Express) {
        app.use(requestLogger);
    }

    private configureRoutes(app: express.Express) {
        app.use("/api", customerRouter );
    }

    public run() {
        this.app.listen(this.port, () => {
            console.info(`listening on ${this.port}`);
        });  
    }
}