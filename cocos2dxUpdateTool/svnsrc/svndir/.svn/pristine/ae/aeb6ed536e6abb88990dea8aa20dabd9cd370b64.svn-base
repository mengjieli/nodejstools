function ProfileData() {
    ProfileData.instance = this;

    this.castleIdList = [];
    this.castleList = [];
    this.castle = null;

    NetMgr.inst().addEventListener(397, this.recvCastleList, this);
    this.requestCastleList();
}

/**
 * 加载自己的城堡列表
 */
ProfileData.prototype.requestCastleList = function () {
    var msg = new SocketBytes();
    msg.writeUint(411);
    NetMgr.inst().send(msg);
}

/**
 * 加载自己的城堡列表
 */
ProfileData.prototype.selectCastle = function ( id ) {
    if(UIData.getInstance().showType == UIData.SHOW_CASTLE && (!this.castle || id == this.castle.id)) {
        return;
    }
    this.call(ProfileData.CHANGE_CASTLE);
    for(var i = 0; i < this.castleList.length; i++) {
        if(this.castleList[i].id == id) {
            this.castle = this.castleList[i];
            this.call(ProfileData.UPDATE_CASTLE_COUNT);
            break;
        }
    }
    ModuleMgr.inst().openModule("MapChangeModule", {"type": MapChangeModule.SHOW_CASTLE});
    //trace("点了主城：",id);
}

ProfileData.prototype.recvCastleList = function (cmd, data) {
    var item = BigMapActionData.getInstance().recvMapInfo(cmd,data);
    if (item.type == 1205001 && item.user == SelfData.getInstance().accountId) {
        var find = false;
        for(var i = 0; i < this.castleList.length; i++) {
            if(this.castleList[i].id == item.id) {
                this.castleList[i].receiveFromCastle(item);
                find = true;
                break;
            }
        }
        if(!find) {
            this.castleList.push(item);
            this.castleIdList.push(item.id);
            if (this.castle == null) {
                this.castle = item;
            }
            this.call(ProfileData.UPDATE_CASTLE_COUNT);
        }
        this.call(ProfileData.NET_COMPLETE);
    }
}

ProfileData.CHANGE_CASTLE = "change_castle";
ProfileData.NET_COMPLETE = "new_complete";
ProfileData.UPDATE_CASTLE_COUNT = "update_cast_count";

ProfileData.instance = null;
ProfileData.getInstance = function () {
    return ProfileData.instance;
}

ListenerBase.registerClass(ProfileData);