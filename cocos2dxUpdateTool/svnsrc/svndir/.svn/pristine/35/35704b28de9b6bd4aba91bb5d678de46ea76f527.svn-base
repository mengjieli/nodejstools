function BigMapActionData() {
    if (BigMapActionData.instance) return;
    BigMapActionData.instance = this;
    //寻路障碍
    this.blocks = null;
    //角色
    this.rolers = [];
    //建筑
    this.builds = [];
    //地块
    this.earths = [];
    var list = ProfileData.getInstance().castleList;
    for (var i = 0; i < list.length; i++) {
        this.builds.push(list[i]);
    }
    NetMgr.inst().addEventListener(398, this.recvEarthInfo, this);
}

BigMapActionData.prototype.recvEarthInfo = function (cmd, data) {
    /*
     int         x                       // 世界坐标
     int         y                       //
     string      parentObjectUuid        // 领地所属城堡
     string      ownerUuid               // 领地所有者（和城堡所属一致）
     uint        accelerationCardApplied // 是否使用过效率卡
     uint        ticketItemId            // 已使用的土地购买券的道具 id，用于换算领地等级
     uint        productionResourceId    // 产出的资源 id
     uint        productionInitDelay     // 刚购买的领地要经历这么长时间才能产出资源，置零表示正在产出
     array       attributes
     uint        attributeId           //
     int         value
     */
    data.resetCMDData();
    var x = data.readInt();
    var y = data.readInt();
    var castleId = data.readString();
    var user = data.readString();
    var useAccelerationCard = data.readUint();
    var earthCard = data.readUint();
    if (!earthCard) {
        return;
    }
    var productionResourceId = data.readUint();
    var resourceAmount = data.readUint();
    var earth;
    for (var i = 0; i < this.earths.length; i++) {
        if (this.earths[i].coordX == x && this.earths[i].coordY == y) {
            earth = this.earths[i];
            break;
        }
    }
    var addEarth = false;
    if (!earth) {
        var blockConfig = ServerMapConfig.getInstance().getBlock(x, y);
        earth = new MapEarthData(blockConfig);
        this.earths.push(earth);
        addEarth = true;
    }
    earth.receiveInfo(user, castleId, x, y, useAccelerationCard, earthCard, productionResourceId, resourceAmount);
    if (addEarth) {
        this.call(BigMapActionData.ADD_EARTH, earth);
    }
}

BigMapActionData.prototype.recvMapInfo = function (cmd, data) {
    /*
     string      mapObjectUuid     // 建筑或部队 uuid
     uint        mapObjectTypeId
     string      ownerUuid         // 所属玩家 uuid
     string      parentObjectUuid  // 所属的城堡 uuid
     string      name              // 城堡名字
     int         x                 // 世界坐标 X
     int         y                 // 世界坐标 Y
     array       attributes        //
     uint        attributeId     //
     int         value
     */
    data.resetCMDData();
    var id = data.readString(); //城堡id
    var type = data.readUint(); //类型
    var accountId = data.readString(); //所属玩家idcastleId
    var castleId = data.readString(); //所属城堡 id
    var name = data.readString();//城堡名称
    var x = data.readInt();
    var y = data.readInt();
    var res;
    if (type == 1205001) {
        for (var i = 0; i < this.builds.length; i++) {
            if (this.builds[i].id == id) {
                res = this.builds[i];
                break;
            }
        }
        if (!res) {
            res = new MapCastleData(type);
            res.receiveCastleInfo(id, accountId, castleId, name, x, y);
            this.addBuild(res);
        } else {
            res.receiveCastleInfo(id, accountId, castleId, name, x, y);
            this.call(BigMapActionData.UPDATE_BUILD, res);
        }
    } else {
    }
    return res;
}

BigMapActionData.prototype.setBlocks = function (blocks, startX, startY) {
    this.blocks = blocks;
    for (var i = 0; this.builds.length; i++) {
        this.builds[i].setBlocks(blocks, startX, startY);
    }
}

/**
 * 摄像机视角锁定
 * @param display
 */
BigMapActionData.prototype.lockDisplay = function (display) {
    this.call(BigMapActionData.LOCK_DISPLAY, display);
}

BigMapActionData.prototype.addRoler = function (info) {
    var roler = new BigMapRolerData(info);
    this.rolers.push(roler);
    this.call(BigMapActionData.ADD_ROLER, roler);
    return roler;
}

BigMapActionData.prototype.addBuild = function (build) {
    this.builds.push(build);
    this.call(BigMapActionData.ADD_BUILD, build);
    return build;
}

/**
 * 获取城堡的地块列表
 * @param castleId 城堡id
 * @param resourceId 地块产出的资源类型类型
 */
BigMapActionData.prototype.getCastleEarth = function (castleId, resourceId) {
    var list = [];
    for (var i = 0; i < this.earths.length; i++) {
        if (this.earths[i].castle == castleId && this.earths[i].productionResourceId == resourceId) {
            list.push(this.earths[i]);
        }
    }
    return list;
}

BigMapActionData.instance = null;
BigMapActionData.getInstance = function () {
    return BigMapActionData.instance;
}

BigMapActionData.LOCK_DISPLAY = "lock_display";
BigMapActionData.ADD_ROLER = "add_roler";
BigMapActionData.ADD_BUILD = "add_build";
BigMapActionData.ADD_EARTH = "add_earth";
BigMapActionData.UPDATE_BUILD = "update_build";

ListenerBase.registerClass(BigMapActionData);