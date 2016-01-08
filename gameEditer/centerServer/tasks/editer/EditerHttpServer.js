var EditerHttpServer = (function (_super) {

    __extends(EditerHttpServer, _super);

    function EditerHttpServer(port, user) {
        this.user = user;
        _super.call(this, port);
    }

    var d = __define, c = EditerHttpServer;
    var p = c.prototype;

    p.onReciveRequest = function (request, response) {
        if (request.method == "GET") {
            var url = request.url;
            url = url.split("?")[0];
            if(url.charAt(0) == "/") {
                url = url.slice(1,url.length);
            }
            new HttpServerGetFileTask(this.user, this, url, request, response);
        }
    }

    return EditerHttpServer;

})(HttpServer);

global.EditerHttpServer = EditerHttpServer;