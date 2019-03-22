import {Router} from 'express';

export abstract class RouterClass {

    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init(): void {
        // init your routers down here
    }
}
