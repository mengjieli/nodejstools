/**
 *
 * @author 
 *
 */
class LocalFile extends egret.EventDispatcher {
    
    private url: string;
    private rootPath: string;
    public list: Array<LocalFileInfo> = [];
    
    public constructor(rootPath) {
        super();
        this.rootPath = rootPath;
        this.url = "";
        
        GameNet.registerBack(11,this.recvDirectionList,this);
        GameNet.registerBack(21,this.recvSaveComplete,this);
        GameNet.registerBack(23,this.recvMakeDirComplete,this);
	}
	
	public dispose():void {
        GameNet.removeBack(11,this.recvDirectionList,this);
        GameNet.removeBack(21,this.recvSaveComplete,this);
        GameNet.removeBack(23,this.recvMakeDirComplete,this);
	}
	
	/**
	 * @param type 文件类型
	 * 1 文本格式
	 * 2 二进制
	 */ 
	public saveFile(content:any,type:number=1):void {
        var bytes = new VByteArray();
        bytes.writeUIntV(20);
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
        bytes.writeUIntV(22);
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
        bytes.writeUIntV(10);
        bytes.writeUTFV(this.rootPath);
        GameNet.sendMessage(bytes);
    }

    private recvDirectionList(cmd: number,data: VByteArray): void {
        data.position = 0;
        data.readUIntV();
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
}
