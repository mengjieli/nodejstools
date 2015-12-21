/**
 *
 * @author 
 *
 */
class LocalFileInfo {
    
    public url: string;
    public type: string;
    
	public constructor(url:string,type:string) {
        this.url = url;
        this.type = type;
	}
	
	public get loadPath():string {
        return Config.localResourceServer + "/" + this.url;
	}
}
