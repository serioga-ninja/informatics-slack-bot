import { RssItem, App, PostItem } from "./interfaces";

abstract class MiddlewareClass {
    constructor(private data:Array<RssItem>, private configs: Object) {
    }
}

export class SlackWebHooks extends MiddlewareClass {
    
}