//默认协议第一个收取的是玩家数据

var PlayerDataCommand = cc.Class.extend({
    ctor: function () {
        NetMgr.inst().addEventListener(298, this.updatePlayerData, this);//更新账号属性
    },

    updatePlayerData: function (cmd, data) {
        if (cmd == 298) {
            data.resetCMDData();
            var account = data.readString();//uid
            var nick = data.readString();
            if (mainData.playerData.account == "" || mainData.playerData.account == account) {
                mainData.playerData.account = account;
                if (nick != "") {
                    mainData.playerData.nick = nick;
                }
                var len = data.readUint();
                for (var i = 0; i < len; i++) {
                    var slot = data.readUint();
                    var value = data.readString();
                    if (slot == 1) {
                        mainData.playerData.gender = value;
                    }
                    if (slot == 2) {
                        mainData.playerData.headid = value;
                    }
                    if (slot == 199) {
                        mainData.playerData.collection = value;
                    }
                    if (slot == 303) {
                        mainData.playerData.signday = value;
                    }
                }
            }
            else {
                var newplayer = null;
                var list = mainData.otherPlayerDataList;
                for (var i = 0; i < list.length; i++) {
                    if (list.getItemAt(i).account == account) {
                        newplayer = list.getItemAt(i);
                        if (nick != "") {
                            list.getItemAt(i).nick = nick;
                        }
                        var len = data.readUint();
                        for (var i = 0; i < len; i++) {
                            var slot = data.readUint();
                            var value = data.readString();
                            if (slot == 1) {
                                list.getItemAt(i).gender = value;
                            }
                            if (slot == 2) {
                                list.getItemAt(i).headid = value;
                            }
                            if (slot == 199) {
                                list.getItemAt(i).collection = value;
                            }
                            if (slot == 303) {
                                list.getItemAt(i).signday = value;
                            }
                        }
                        break;
                    }
                }
                if (newplayer == null) {
                    newplayer = {};
                    newplayer.account = account;
                    if (nick != "") {
                        newplayer.nick = nick;
                    }
                    var len = data.readUint();
                    for (var i = 0; i < len; i++) {
                        var slot = data.readUint();
                        var value = data.readString();
                        if (slot == 1) {
                            newplayer.gender = value;
                        }
                        if (slot == 2) {
                            newplayer.headid = value;
                        }
                        if (slot == 199) {
                            newplayer.collection = value;
                        }
                        if (slot == 303) {
                            newplayer.signday = value;
                        }
                    }
                    mainData.otherPlayerDataList.push(newplayer);
                }
            }
        }
    }
});
