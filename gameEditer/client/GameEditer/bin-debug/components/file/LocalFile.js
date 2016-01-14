/**
 *
 * @author
 *
 */
var LocalFile = (function (_super) {
    __extends(LocalFile, _super);
    function LocalFile(rootPath) {
        _super.call(this);
        this.list = [];
        this.rootPath = rootPath;
        this.url = "";
        GameNet.registerBack(101, this.recvDirectionList, this);
        GameNet.registerBack(121, this.recvSaveComplete, this);
        GameNet.registerBack(123, this.recvMakeDirComplete, this);
        GameNet.registerBack(125, this.recvExistComplete, this);
    }
    var d = __define,c=LocalFile;p=c.prototype;
    p.dispose = function () {
        GameNet.removeBack(101, this.recvDirectionList, this);
        GameNet.removeBack(121, this.recvSaveComplete, this);
        GameNet.removeBack(123, this.recvMakeDirComplete, this);
        GameNet.removeBack(125, this.recvExistComplete, this);
    };
    /**
     * @param type 文件类型
     * 1 文本格式
     * 2 二进制
     */
    p.saveFile = function (content, type) {
        if (type === void 0) { type = 1; }
        var bytes = new VByteArray();
        bytes.writeUIntV(120);
        bytes.writeUTFV(this.rootPath);
        bytes.writeByte(type);
        if (type == 1) {
            bytes.writeUTFV(content);
        }
        GameNet.sendMessage(bytes);
    };
    p.recvSaveComplete = function (cmd, bytes) {
        bytes.position = 0;
        bytes.readUIntV();
        var url = bytes.readUTFV();
        if (url != this.rootPath) {
            return;
        }
        if (bytes.readByte() == 0) {
            this.dispatchEventWith(egret.Event.COMPLETE);
        }
    };
    p.makeDirection = function () {
        var bytes = new VByteArray();
        bytes.writeUIntV(122);
        bytes.writeUTFV(this.rootPath);
        GameNet.sendMessage(bytes);
    };
    p.recvMakeDirComplete = function (cmd, bytes) {
        bytes.position = 0;
        bytes.readUIntV();
        var url = bytes.readUTFV();
        if (url != this.rootPath) {
            return;
        }
        this.dispatchEventWith(egret.Event.COMPLETE);
    };
    p.loadDirectionList = function () {
        var bytes = new VByteArray();
        bytes.writeUIntV(100);
        bytes.writeUTFV(this.rootPath);
        GameNet.sendMessage(bytes);
    };
    p.recvDirectionList = function (cmd, data) {
        data.position = 0;
        var cmd = data.readUIntV();
        var url = data.readUTFV();
        if (url != this.rootPath)
            return;
        this.list = [];
        var len = data.readUIntV();
        for (var i = 0; i < len; i++) {
            var type = data.readByte() == 0 ? LocalFileType.DIRECTION : LocalFileType.FILE;
            var path = data.readUTFV();
            var url = path.slice(this.rootPath.length, path.length);
            if (url == "")
                continue;
            this.list.push(new LocalFileInfo(url, type));
        }
        this.dispatchEventWith(egret.Event.COMPLETE);
    };
    p.isExist = function () {
        var bytes = new VByteArray();
        bytes.writeUIntV(124);
        bytes.writeUTFV(this.rootPath);
        GameNet.sendMessage(bytes);
    };
    p.recvExistComplete = function (cmd, data) {
        data.position = 0;
        data.readUIntV();
        var url = data.readUTFV();
        if (url != this.rootPath)
            return;
        this._exist = data.readBoolean();
        this.dispatchEventWith(egret.Event.COMPLETE);
    };
    d(p, "exist"
        ,function () {
            return this._exist;
        }
    );
    return LocalFile;
})(egret.EventDispatcher);
egret.registerClass(LocalFile,"LocalFile");
