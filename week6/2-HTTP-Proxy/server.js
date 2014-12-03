var url = require('url'),
    http = require('http'),
    https = require('https'),
    request = require("request"),
    LinkTranform = require('./transform').LinkTranform;

var acceptor = http.createServer().listen(3000);
console.log('Proxy server running at port: ' + 3000);

var _cookie = {};

acceptor.on('request', function(request, response) {
    request.pause();
    var connector = httpGet(request, function(err, res) {
        if(err) {
            request.resume();
            response.statusCode = 500;
            return response.end();
        }
        var linkFormatter = createFormatter();

        res
            .pipe(linkFormatter)
            .pipe(response, {
                end: true
            });
    });

    request
        .pipe(connector, {
            end: true
        });
    request.resume();
});

function createFormatter() {
    var parser = new LinkTranform();
    return parser;
}

function httpGet(request, callback) {
    return httpRequest(request, callback);
};

function httpRequest(request, callback, data, headers) {
    var rawUrl = request.url
    if(rawUrl.indexOf("/") === 0) {
        rawUrl = rawUrl.substring(1);
    }
    console.log('request ' + rawUrl);
    var options = genRequestOptions(rawUrl, request.method, request.data, request.headers);
    var req;
    if (options._protocol == "https" && !options.agent) {
        req = https.request(options, function(res) {
            responseHandler(res, callback, data, headers);
        });
    } else {
        req = http.request(options, function(res) {
            responseHandler(res, callback, data, headers);
        });
    }
    return req;
};

function responseHandler(res, callback, data, headers) {
    setCookieByHttpRes(res);
    if (res.statusCode === 200){
        callback(null, res);
    }else if (res.statusCode === 301 || res.statusCode === 302){
        var nextTarget = res.headers.location;
        process.nextTick(function(){
            httpRequest(nextTarget, callback, data, headers);
        });
    }else{
        callback("Server return " + res.statusCode + ": " + buffer);
    }
};

function genRequestOptions(rawUrl, method, data, headers) {
    var target;
    try {
        target = url.parse(rawUrl);
    } catch (err) {
        console.log("URL parse error, please input validate URL");
        return;
    }
    if (target && target.host) {
        var result = {
            path: rawUrl,
            host: target.host,
            method: method,
            agent: false,
            headers: {}
        }
        if(data) {
            result.data = data;
        }
        result.headers.Cookie = cookieToStr(_cookie);

        if (target.protocol==="http:"){
            result.port = target.port ? target.port : 80;
            result._protocol = "http";
        }else if (target.protocol==="https:"){
            result.port = target.port ? target.port : 443;
            result._protocol = "https";
        }
        return result;
    }
};

function cookieToStr(cookie) {
    if (cookie) {
        var result = "";
        for (var key in cookie) {
            result += key + (cookie[key] ? "=" + cookie[key] : "") + "; ";
        }
        return result;
    }
    return "";
};

function setCookieByHttpRes(res){
    var rawCookie = res.headers["set-cookie"];
    rawCookie && rawCookie.forEach(function(line){
        line && line.split(';').forEach(function(c){
            var parts = c.split('=');
            _cookie[parts[0].trim()] = (parts[1] || '').trim();
        });
    });
};