/**
 *
 * @author
 *
 */
var Config = (function () {
    function Config() {
    }
    var d = __define,c=Config;p=c.prototype;
    Config.localServerIp = "localhost";
    Config.localServerPort = 9500;
    Config.localResourceServerPort = 9501;
    //资源服务器的端口不一定是 9501,有可能被别的占用
    Config.localResourceServer = "http://localhost:";
    Config.workFile = "/Users/mengjieli/Documents/CocosProjects/NewPaik/res/";
    Config.width = 1000;
    Config.height = 650;
    Config.getResourceURL = function (url) {
        return Config.localResourceServer + "/" + url + "?" + Math.random();
    };
    return Config;
})();
egret.registerClass(Config,"Config");
