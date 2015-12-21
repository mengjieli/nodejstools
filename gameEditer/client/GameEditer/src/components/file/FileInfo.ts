/**
 *
 * @author 
 *
 */
class FileInfo {
    
    public url: string;
    public name: string;
    public format: string;
    public end: string;
    public type: string;
    public status: string;
    public depth: number;
    public parent: FileInfo;
    public hasFloder: boolean;
    public dataList: ICollection;
    public more: any;
    
	public constructor(url,name,format,end,type,status,depth) {
        this.url = url;
        this.name = name;
        this.format = format;
        this.end = end;
        this.type = type;
        this.status = status;
        this.depth = depth;
	}
}
