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
    public data: any;
    public parent: FileInfo;
    public hasFloder: boolean;
    public dataList: ICollection;
    public more: any;
    public more2: any;
    public hasLoad: boolean = false;
    public virtual: boolean = false;
    
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
