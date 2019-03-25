import {Request, Response} from 'express';
import {RouterClass} from '../router.class';

export class TestRouter extends RouterClass {

  public test(req: Request, res: Response) {
    res.json({ok: 'ok'});
  }

  init() {
    this.router.get('/test', this.test);
  }

}

const testRouter = new TestRouter();

export default testRouter.router;
