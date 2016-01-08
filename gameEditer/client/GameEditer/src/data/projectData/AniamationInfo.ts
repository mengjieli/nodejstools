/**
 *
 * @author 
 *
 */
class FileInfoBase extends egret.EventDispatcher {

    protected _url: string;
    protected _name: string;
    protected _desc: string;
    protected _isNew: boolean = true;

    public constructor(url,name,desc) {
        super();
        this._url = url;
        this._name = name;
        this._desc = desc;
    }
    
    public update(file:FileInfoBase):void {
        
    }
    
    public get isNew():boolean {
        return this._isNew;
    }

    public get url(): string {
        return this._url + "/" + this._name + ".json";
    }
    
    public get name():string {
        return this._name;
    }

    public get desc(): string {
        return this._desc;
    }

    public get fileContent(): string {
        var config = {
            "name": this._name,
            "desc": this._desc
        }
        return JSON.stringify(config);
    }
}


/**
 *
 * @author 
 *
 */
class AniamationInfo extends FileInfoBase{
    public constructor(url,name,desc) {
        super(url,name,desc);
	}
}
