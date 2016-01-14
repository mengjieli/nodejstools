/**
 *
 * @author 
 *
 */
class LocalFile extends egret.EventDispatcher {
    
    private url: string;
    private rootPath: string;
    private _exist: boolean;
    public list: Array<LocalFileInfo> = [];
    
    public constructor(rootPath) {
        super();
        this.rootPath = rootPath;
        this.url = "";

        GameNet.registerBack(101,this.recvDirectionList,this);
        GameNet.registerBack(121,this.recvSaveComplete,this);
        GameNet.registerBack(123,this.recvMakeDirComplete,this);
        GameNet.registerBack(125,this.recvExistComplete,this);
	}
	
	public dispose():void {
        GameNet.removeBack(101,this.recvDirectionList,this);
        GameNet.removeBack(121,this.recvSaveComplete,this);
        GameNet.removeBack(123,this.recvMakeDirComplete,this);
        GameNet.removeBack(125,this.recvExistComplete,this);
	}
	
	/**
	 * @param type 文件类型
	 * 1 文本格式
	 * 2 二进制
	 */ 
	public saveFile(content:any,type:number=1):void {
        var bytes = new VByteArray();
        bytes.writeUIntV(120);
        bytes.writeUTFV(this.rootPath);
        bytes.writeByte(type);
        if(type == 1) { //保存文本格式的文件
            bytes.writeUTFV(content);
        }
        GameNet.sendMessage(bytes);
    }
    
    private recvSaveComplete(cmd,bytes:VByteArray):void {
        bytes.position = 0;
        bytes.readUIntV();
        var url = bytes.readUTFV();
        if(url != this.rootPath) {
            return;
        }
        if(bytes.readByte() == 0) {
            this.dispatchEventWith(egret.Event.COMPLETE);
        }
    }
    
    public makeDirection(): void {
        var bytes = new VByteArray();
        bytes.writeUIntV(122);
        bytes.writeUTFV(this.rootPath);
        GameNet.sendMessage(bytes);
    }
    
    private recvMakeDirComplete(cmd,bytes: VByteArray): void {
        bytes.position = 0;
        bytes.readUIntV();
        var url = bytes.readUTFV();
        if(url != this.rootPath) {
            return;
        }
        this.dispatchEventWith(egret.Event.COMPLETE);
    }
	
	public loadDirectionList() { 
        var bytes = new VByteArray();
        bytes.writeUIntV(100);
        bytes.writeUTFV(this.rootPath);
        GameNet.sendMessage(bytes);
    }

    private recvDirectionList(cmd: number,data: VByteArray): void {
        data.position = 0;
        var cmd = data.readUIntV();
        var url = data.readUTFV();
        if(url != this.rootPath) return;
        this.list = [];
        var len = data.readUIntV();
        for(var i = 0;i < len;i++) {
            var type = data.readByte() == 0 ? LocalFileType.DIRECTION : LocalFileType.FILE;
            var path = data.readUTFV();
            var url = path.slice(this.rootPath.length,path.length);
            if(url == "") continue;
            this.list.push(new LocalFileInfo(url,type));
        }
        this.dispatchEventWith(egret.Event.COMPLETE);
    }
    
    public isExist(): void {
        var bytes = new VByteArray();
        bytes.writeUIntV(124);
        bytes.writeUTFV(this.rootPath);
        GameNet.sendMessage(bytes);
    }
    
    private recvExistComplete(cmd: number,data: VByteArray): void {
        data.position = 0;
        data.readUIntV();
        var url = data.readUTFV();
        if(url != this.rootPath) return;
        this._exist = data.readBoolean();
        this.dispatchEventWith(egret.Event.COMPLETE);
    }
    
    public get exist():boolean {
        return this._exist;
    }
}
