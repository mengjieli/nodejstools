var OtherProfileData = function () {
    OtherProfileData.instance = this;

    this.list = [];

    NetMgr.inst().addEventListener(298, this.recvProfileData, this);
}

OtherProfileData.prototype.recvProfileData = function (cmd, data) {
    data.resetCMDData();
    var player = null;
    var id = data.readString();
    var list = this.list;
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            player = list[i];
            break;
        }
    }
    if(!player) {
        player = new OtherProfile();
        list.push(player);
    }
    player.recvProfile(id,data);
}

/**
 * 根据用户 id 获取用户信息
 * @param id
 * @returns {*}
 */
OtherProfileData.prototype.getPlayerById = function(id) {
    var list = this.list;
    for(var i = 0,len = list.length; i < len; i++) {
        if(list[i].id == id) {
            return list[i];
        }
    }
    return {id:id,name:"未知",sex:"0",head:null};
}

OtherProfileData.instance = null;

OtherProfileData.getInstance = function() {
    return OtherProfileData.instance;
}

