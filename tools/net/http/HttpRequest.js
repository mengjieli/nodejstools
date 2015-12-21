var http = require('http');
var querystring = require('querystring');

var HttpRequest = (function (_super) {
    __extends(HttpRequest, _super);

    /**
     *
     * @param serverIp 例如 '192.168.1.201'
     * @param port 例如 13212
     * @param path 例如 '/empery/data/'
     * @constructor
     */
    function HttpRequest(serverIp, port, path, encoding) {
        _super.call(this);
        this.serverIp = serverIp;
        this.port = port;
        this.path = path || "";
        this.encoding = encoding || "utf8";
    }

    var d = __define, c = HttpRequest;
    p = c.prototype;

    p.get = function (data) {
        data = data || {};
        var content = querystring.stringify(data);
        var options = {
            hostname: this.serverIp,
            port: this.port,
            path: this.path,
            method: 'GET'
        };
        var req = http.request(options, this.onConnect.bind(this));
        req.on("error", this.onError.bind(this));
        req.end();
    }

    p.onConnect = function (request) {
        request.setEncoding(this.encoding);
        request.on("data", this.onData.bind(this));
    }

    p.onData = function (data) {
        this.data = data;
        this.dispatchEvent(new Event(Event.DATA));
    }

    p.onError = function (e) {
        console.log('problem with request: ' + e.message);
    }

    return HttpRequest;
})(EventDispatcher);

global.HttpRequest = HttpRequest;


