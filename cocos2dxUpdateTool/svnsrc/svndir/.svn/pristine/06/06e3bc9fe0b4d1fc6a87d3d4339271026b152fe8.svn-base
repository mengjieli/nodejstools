/**
 * 登录成功后，发送网络消息，等待所有消息返回后调用返回函数，才真正的进入游戏界面
 * @param back
 * @constructor
 */
function EnterGameNet(back) {

    //初始化二级地图网络数据
    new ProfileData();
    new ServerMapConfig();
    new BigMapActionData();

    ModuleMgr.inst().getData("ItemModule").loadItem();//获取道具

    //需要监听返回的协议号
    var cmds = [
        0,
        599
    ];
    var cmd0 = {
        411: false
    };

    var listener = function (cmd, data) {
        if (cmd == 0) {
            data.resetCMDData();
            var backCmd = data.readUint();
            cmd0[backCmd] = true;
            var flag = true;
            for (var key in cmd0) {
                if (cmd0[key] == false) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                NetMgr.inst().removeEventListener(cmd, listener);
                loads[cmd] = true;
            }
        } else {
            NetMgr.inst().removeEventListener(cmd, listener);
            loads[cmd] = true;
        }
        for (var key in cmd0) {
            if (cmd0[key] == false) {
                return;
            }
        }
        for (var c = 0; c < cmds.length; c++) {
            if (!loads[cmd]) {
                return;
            }
        }
        back();
    };
    var loads = {};
    for (var i = 0; i < cmds.length; i++) {
        NetMgr.inst().addEventListener(cmds[i], listener);
    }
}

/**
 * 连上服务器
 */
EnterGameNet.onConnectGameServer = function () {
    new OtherProfileData();
}