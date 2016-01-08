/**
 *
 * @author 
 *
 */
class DataInfoMember {
    
    public desc: string;
    public type: string;
    public typeValue: string;
    
    public constructor(desc,type,typeValue){
        
    }
}

class DataInfo extends FileInfoBase{
    
    private members:Array<DataInfoMember>;
    
	public constructor(url,name,desc) {
        super(url,name,desc);
        this.members = [];
	}
	
	public get fileContent():string {
        var config = {
            "name":this.name,
            "desc":this.desc,
            "members": this.members
	    }
        return JSON.stringify(config);
	}
	
    public update(data:DataInfo):void {
        this._name = data.name;
	}
	
	public static decode(url,config):DataInfo {
        if(config.name == null || config.members == null) {
             return null;
        }
        var members: Array<DataInfoMember> = [];
        try {
            for(var name in config.members) {
                var desc = config.members[name].desc;
                desc = desc || "";
                
                //var info = new DataInfoMember();
            }
        } catch(e) {
            return null;
        }
        var data = new DataInfo(url,config.name,config.desc);
        data.members = members;
        return data;
	}
}
