import request = require('request');
var FeedParser = require('feedparser');

export = function(url:string[]) {
    if(!url) {
        throw new Error('There is no url to work with');
    }

    var req = request(url[0]);
    var feedparser = new FeedParser();

    req.on('response', function (res) {
        var stream = this;

        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

        stream.pipe(feedparser);
    });


    feedparser.on('readable', function() {
        var stream = this
            , meta = this.meta
            , item;

        while (item = stream.read()) {
            console.log(item.title);
        }
    });
}