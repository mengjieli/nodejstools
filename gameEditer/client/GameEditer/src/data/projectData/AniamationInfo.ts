/**
 *
 * @author 
 *
 */
class FileInfoBase {

    protected _url: string;
    protected name: string;
    protected desc: string;

    public constructor(url,name,desc) {
        this._url = url;
        this.name = name;
        this.desc = desc;
    }

    public get url(): string {
        return this._url + "/" + this.name + ".json";
    }

    public get fileContent(): string {
        var config = {
            "name": this.name,
            "desc": this.desc
        }
        return JSON.stringify(config);
    }
}


/**
 *
 * @author 
 *
 */
class AniamationInfo {
	public constructor() {
	}
}
