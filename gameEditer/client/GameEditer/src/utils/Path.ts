/**
 *
 * @author 
 *
 */
class Path {
    public static getPath(url: string): string {
        var name = url.split("/")[url.split("/").length - 1];
        return url.slice(0,url.length-name.length-1);
    }
    
	public static getName(url:string):string {
        var name = url.split("/")[url.split("/").length-1];
        return name.split(".")[0];
	}
	
    public static getFileFormat(url: string): string {
        var name = url.split("/")[url.split("/").length - 1];
        if(name.split(".").length == 1) return null;
        return name.split(".")[name.split(".").length-1];
	}
}
