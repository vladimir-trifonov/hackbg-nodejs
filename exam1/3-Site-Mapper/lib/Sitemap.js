var async = require('async'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    robots = require('robots'),
    select = require('soupselect').select,
    htmlparser = require("htmlparser"),
    request = require('request'),
    Map = require('./graph').Graph,
    Url = require('url'),
    Q = require('q');

function Sitemap(options) {
    this.options = util._extend({
        max: 10
    }, options);
    this.map = new Map();
    this.linksCount = 0;
    this.tasksCount = 0;

    EventEmitter.call(this);
    return this;
}
util.inherits(Sitemap, EventEmitter);

Sitemap.prototype.createSitemap = function() {
    var self = this,
        parser = new robots.RobotsParser();

    this._initEventHandlers();

    parser.setUrl(this._getUrl({"url":this.options.url}) + '/robots.txt', function(parser, success) {
        if (success) {
            self.robotsParser = parser;
            self.emit('starttask');
            self.emit('crawlurl', self._getUrl({"url":self.options.url}));
        }
    });
}

Sitemap.prototype._initEventHandlers = function() {
    var self = this;
    this.on('crawlurl', this._urlTask.bind(this));
    this.on('parselinks', this._linksTask.bind(this));
    this.on('starttask', function() {
        self._taskRegister.call(self, "start");
    });
    this.on('endtask', function() {
        self._taskRegister.call(self, "end");
    });
}

Sitemap.prototype._taskRegister = function(status) {
    if (status === "start") {
        this.tasksCount++;
    } else if (status === "end") {
        this.tasksCount--;
    }

    if (this.tasksCount === 0) {
        this.emit('ready', this.map.toArray("url", "links"));
    }
}

Sitemap.prototype._getUrl = function(options) {
    var urlObj = {},
        url = options.url || this.options.url;
    if (typeof this.options.scheme !== "undefined") {
        urlObj.protocol = this.options.scheme;
    } else {
        urlObj.protocol = 'http';
    }

    if (typeof this.options.port !== "undefined") {
        urlObj.hostname = url;
        urlObj.port = this.options.port;
    } else {
        urlObj.host = url;
    }

    if (options.query) {
        urlObj.query = options.query;
    }

    return Url.format(urlObj);
}

Sitemap.prototype._getPath = function(url) {
    var urlObj = Url.parse(url);
    return urlObj.pathname;
}

Sitemap.prototype._canFetch = function(path) {
    var deferred = Q.defer();
    this.robotsParser.canFetch('*', path, function(access) {
        if (access) {
            deferred.resolve();
        } else {
            deferred.reject();
        }
    })

    return deferred.promise;
}

Sitemap.prototype._urlTask = function(url) {
    var self = this,
        path = this._getPath(url);

    this._canFetch(path).then(function() {
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var handler = new htmlparser.DefaultHandler(function(err, dom) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        var links = select(dom, 'a');
                        if (links) {
                            process.nextTick(function() {
                                self.emit('parselinks', url, links);
                            })
                        }
                    }
                });

                var htmlParser = new htmlparser.Parser(handler);
                htmlParser.parseComplete(body);
            } else {
                self.emit('endtask');
            }
        });
    }, function() {
        self.emit('endtask');
    });
}

Sitemap.prototype._linksTask = function(url, links) {
    var self = this;

    if (links.length !== 0) {
        var baseUrl = self._getUrl({"url":this.options.url});
        links.forEach(function(link) {
            var href = link.attribs.href,
                crawlLink = false,
                hashIndex = 0,
                hashlink = false,
                preventAdd = false;

            if (href) {
                if (href.indexOf('/') === 0) {
                    href = self._getUrl({"query": href});
                    crawlLink = true;
                } else if (href.indexOf(self.options.url) !== -1) {
                    crawlLink = true;
                }

                hashIndex = href.indexOf('#');
                hashlink = hashIndex !== -1;
                if ((crawlLink && hashlink) || hashIndex === 0) {
                    crawlLink === false;
                    hashlink = true;
                    preventAdd = true;
                }
                if (crawlLink &&
                    !self.map._hasNode(href) &&
                    self.linksCount < self.options.max) {
                    self.linksCount++;
                    self.emit('starttask');
                    setImmediate(function() {
                        self.emit('crawlurl', href);
                    })
                }
                if (!preventAdd) {
                    self.map.addEdge(url, href);
                }
            }
        });
    }

    self.emit('endtask');
}

module.exports.Sitemap = Sitemap;