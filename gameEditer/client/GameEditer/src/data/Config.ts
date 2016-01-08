/**
 *
 * @author 
 *
 */
class Config {
    
    public static localServerIp = "localhost";
    public static localServerPort = 9500;
    
    public static localResourceServerPort = 9501;
    //资源服务器的端口不一定是 9501,有可能被别的占用
    public static localResourceServer = "http://localhost:";
    
    public static workFile = "/Users/mengjieli/Documents/CocosProjects/NewPaik/res/";
    
    public static width = 1000;
    public static height = 650;
    
    public static getResourceURL = function(url):string {
        return Config.localResourceServer + "/" + url + "?" + Math.random();
    }
}
