var ChangeLayer = cc.Sprite.extend({
    shaderLayer: null,
    frontLayer: null,
    moduleData: null,
    data: null,
    config: null,
    list: null,
    selects: null, //选择的对象
    showClick: null,//显示了菜单
    clickObject: null,//当前点击对象
    clickShowObject: null,//点击显示的对象
    clickShowEffect: null,//点击对象特效
    ctor: function (shaderLayer, frontLayer) {
        this._super();
        this.shaderLayer = shaderLayer;
        this.frontLayer = frontLayer;
        this.list = [];
        this.selects = [];
        this.config = ServerMapConfig.getInstance();
        this.moduleData = ModuleMgr.inst().getData("BigMapModule");
        this.data = this.moduleData.getActionManager();
        this.data.addListener(BigMapActionData.UPDATE_ROLER, this.addRoler, this);
        this.data.addListener(BigMapActionData.ADD_BUILD, this.addBuild, this);
        this.scheduleUpdate();
    },
    update: function (dt) {
        var arr = this.list;
        //从大到小排序
        arr.sort(function (a, b) {
            return (a.py == b.py) ? (a.px == b.px ? 0 : (a.px < b.px ? 1 : -1)) : (a.py < b.py ? 1 : -1);
        });
        //for(var i = 0; i < arr.length; i++) {
        //    trace("排序后：",i,arr[i].data.name,arr[i].py);
        //}
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var item = arr[i];
            item.setLocalZOrder(i);
        }
    },
    updateShow: function (camera) {
        this.setPosition(-camera.x, -camera.y);
        var builds = this.data.builds;
        var rolers = this.data.rolers;
        trace("视野内建筑物、角色", builds.length, rolers.length);
        var find;
        for (var i = 0; i < builds.length; i++) {
            if (builds[i].x > camera.x - 200 && builds[i].x < camera.x + camera.width + 200 &&
                builds[i].y > camera.y - 200 && builds[i].y < camera.y + camera.height + 200) {
                find = false;
                for (var f = 0; f < this.list.length; f++) {
                    //trace("比较",this.list.length,f,this.list[f].data.name,builds[i].name);
                    if (this.list[f].data == builds[i]) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    trace("添加建筑");
                    var build = new MapBuild(this.shaderLayer, builds[i]);
                    this.addChild(build);
                    this.list.push(build);
                }
            }
        }
        for (var i = 0; i < rolers.length; i++) {
            if (rolers[i].x > camera.x - 50 && rolers[i].x < camera.x + camera.width + 50 &&
                rolers[i].y > camera.y - 50 && rolers[i].y < camera.y + camera.height + 50) {
                find = false;
                for (var f = 0; f < this.list.length; f++) {
                    //trace("比较",this.list.length,f,this.list[f].data.name,builds[i].name);
                    if (this.list[f].data == rolers[i]) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    trace("添加部队");
                    var roler = new MapRoler(this.shaderLayer, rolers[i]);
                    this.addChild(roler);
                    this.list.push(roler);
                }
            }
        }
    },
    addRoler: function (roler) {
        //var roler = new MapRoler(this.shaderLayer, rolerData);
        //this.addChild(roler);
        //this.list.push(roler);
        var camera = MapCamera.getInstance();
        if (roler.x > camera.x - 100 && roler.x < camera.x + camera.width + 100 &&
            roler.y > camera.y - 100 && roler.y < camera.y + camera.height + 100) {
            this.updateShow(camera);
        }
    },
    addBuild: function (build) {
        var camera = MapCamera.getInstance();
        if (build.x > camera.x - 200 && build.x < camera.x + camera.width + 200 &&
            build.y > camera.y - 200 && build.y < camera.y + camera.height + 200) {
            this.updateShow(camera);
        }
    },
    dragMap: function () {
        if (this.showClick) {
            this.closeSelect();
            return;
        }
    },
    onTouch: function (x, y) {
        if (this.showClick) {
            this.closeSelect();
            return;
        }
        //点击到的点坐标
        var point = MapUtils.transPositionToPoint(x, y);
        var position = MapUtils.transPointToPosition(point.x, point.y);
        //获取该点的对象
        var obj = this.getGirdObject(point.x, point.y);
        if (!obj || obj == this.selects[0]) {
            var earth = this.frontLayer.getEarth(point.x, point.y);
            if (earth) {
                obj = earth;
            }
        }
        var _this = this;
        trace("获取对象", point.x, point.y, obj ? obj.mapId : "nothing");
        var result = 0;
        if (!this.selects.length) {
            if (obj && obj.type != MapDisplayType.Earth) {
                //点击了对象
                result = 1;
            } else {
                //点击了地块
                result = 2;
            }
        } else {
            if (obj && obj.type != MapDisplayType.Earth) {
                while (this.selects.length) {
                    this.selects.pop().setSelected(false);
                }
                //换了点击对象
                result = 1;
            } else {
                //选择了对象，点击了地块
                result = 3;
            }
        }
        console.log("result:" + result);

        if (result == 1) { //点击了对象
            if (obj.type == MapDisplayType.Player) {
                this.selects.push(obj);
                obj.setSelected(true);
            } else if (obj.type == MapDisplayType.Build) {
                this.clickCastle(obj, point, position);
            }
        } else if (result == 2) {
            this.clickEarth(point, position);
        } else if (result == 3) {
            if (this.config.getBlock(point.x, point.y).type != 1608001) {
                var _this = this;
                this.showClick = true;
                this.showEarthEffect(position);
                ModuleMgr.inst().openModule("TileMenuModule", {
                    x: (position.x - MapCamera.getInstance().x) * MapCamera.getInstance().screenScaleX,
                    y: (position.y - MapCamera.getInstance().y) * MapCamera.getInstance().screenScaleY,
                    list: [{
                        id: 1501010, back: function () {
                            _this.closeSelect();
                            for (var i = 0; i < _this.selects.length; i++) {
                                if (_this.selects[i].type == MapDisplayType.Player) {
                                    var roler = _this.selects[i];
                                    var pos = MapUtils.transPositionToPoint(x, y);
                                    //trace("触摸点", x, y, pos.x, pos.y);
                                    var path = _this.moduleData.getAStar().findPath(roler.coordX, roler.coordY, pos.x, pos.y);
                                    //roler.goDownTheRoad(path);
                                    var msg = new SocketBytes();
                                    msg.writeUint(303);
                                    msg.writeString(roler.id);
                                    msg.writeUint(path.length);
                                    for (var p = 0; p < path.length; p++) {
                                        msg.writeInt(path[p].x - lastPath.x);
                                        msg.writeInt(path[p].y - lastPath.y);
                                        console.log((path[p].x - lastPath.x) + "," + (path[p].y - lastPath.y));
                                        lastPath = path[p];
                                    }
                                    msg.writeString("");
                                    NetMgr.inst().send(msg);
                                }
                            }
                        }, thisObj: null
                    }/*, {
                     id: 1501002,
                     back: function () {
                     ModuleMgr.inst().openModule("BlockInfoModule", {
                     "territoryid": blockInfo.type,
                     "certificateid": earth ? earth.getEarthCard() : null
                     });
                     },
                     }*/]
                }); //打开弹框
            } else { //点击障碍处理
            }
        }
    },
    /**
     * 获取格子上的对象
     * @param x
     * @param y
     * @returns {*}
     */
    getGirdObject: function (x, y) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].type == MapDisplayType.Earth && this.list[i].isTouch(x, y)) {
                return this.list[i];
            }
        }
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].type == MapDisplayType.Player && this.list[i].isTouch(x, y)) {
                return this.list[i];
            }
        }
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].type == MapDisplayType.Build && this.list[i].isTouch(x, y)) {
                return this.list[i];
            }
        }
        return null;
    },
    /**
     * 点击了城堡
     * @param castle
     */
    clickCastle: function (castle, point, position) {
        //是否为自己的地块
        var isMy = castle.isMyCastle();
        var _this = this;
        var list = [
            {
                id: 1501002,
                back: function () {
                    _this.closeSelect();
                    trace("点击详情");
                    //TODO
                    var msg = new SocketBytes();
                    msg.writeUint(414);
                    msg.writeString(castle.getCastleId());
                    NetMgr.inst().send(msg);
                    ModuleMgr.inst().openModule("AlertString", {
                        str: ResMgr.inst().getString("college_18"),
                        color: null,
                        time: null,
                        pos: null
                    });

                }
            },
            {
                id: 1501009,
                back: function () {
                    _this.closeSelect();
                    ModuleMgr.inst().openModule("AddCollectModule", {"id": null, "pos": {x: point.x, y: point.y}});
                }
            }
        ]
        position = MapUtils.transPointToPosition(castle.coordX, castle.coordY);
        ModuleMgr.inst().openModule("TileMenuModule", {
            x: (position.x + MapUtils.width / 2 - MapCamera.getInstance().x) * MapCamera.getInstance().screenScaleX,
            y: (position.y - MapCamera.getInstance().y) * MapCamera.getInstance().screenScaleY,
            list: list
        });
        this.showClick = true;
    },
    clickEarth: function (point, position) {
        var _this = this;
        var blockInfo = this.config.getBlock(point.x, point.y);
        if (blockInfo.type != 1608001) {
            this.showEarthEffect(position);
            trace("点击地块", point.x, point.y, blockInfo.type);
            var isMyCastlePower = false;
            var castle = null;
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].type == MapDisplayType.Build) {
                    if (this.list[i].isMyCastlePowerRange(point.x, point.y)) {
                        isMyCastlePower = true;
                        castle = this.list[i];
                        break;
                    }
                }
            }
            var earth = this.frontLayer.getEarth(point.x, point.y);
            var list = [
                {
                    id: 1501002,
                    back: function () {
                        _this.closeSelect();
                        ModuleMgr.inst().openModule("BlockInfoModule", {
                            "territoryid": blockInfo.type,
                            "certificateid": earth ? earth.getEarthCard() : null
                        });
                    }
                },
                {
                    id: 1501009,
                    back: function () { //收藏夹功能
                        _this.closeSelect();
                        ModuleMgr.inst().openModule("AddCollectModule", {
                            "id": null,
                            "pos": {x: point.x, y: point.y}
                        });
                    }
                }];
            if (earth) { //有地块
                if (earth.isMine()) { //我的地块
                    if (earth.level < MapConfigUtils.getMaxEatrhLevel()) {  //地块等级还可以继续升
                        list.push({
                            id: 1501001,
                            back: function () { //升级领地
                                _this.closeSelect();
                                ModuleMgr.inst().openModule("BlockLevelupModule", {
                                    "territoryid": blockInfo.type,
                                    "certificateid": earth.getEarthCard(),
                                    x: point.x,
                                    y: point.y
                                });
                            }
                        });
                    }
                    if (!earth.getUseAccelerationCard()) { //是否用过效率卡
                        list.push({
                            id: 1501015,
                            back: function () { //使用效率卡
                                _this.closeSelect();
                                //TODO 服务端还没做
                                //var msg = new SocketBytes();
                                //msg.writeUint(305);
                                //msg.writeInt(point.x);
                                //msg.writeInt(point.y);
                                //NetMgr.inst().send(msg);
                                ModuleMgr.inst().openModule("AlertString", {
                                    str: ResMgr.inst().getString("college_18"),
                                    color: null,
                                    time: null,
                                    pos: null
                                });

                            }
                        });
                    }
                }
            } else { //空地
                if (isMyCastlePower) {
                    list.push({
                        id: 1501014,
                        back: function () { //使用土地券
                            _this.closeSelect();
                            ModuleMgr.inst().openModule("UseScrollModule",
                                {id: blockInfo.type, castleId: castle.getCastleId(), x: point.x, y: point.y});//关闭弹框
                        }
                    });
                }
            }
            ModuleMgr.inst().openModule("TileMenuModule", {
                x: (position.x - MapCamera.getInstance().x) * MapCamera.getInstance().screenScaleX,
                y: (position.y - MapCamera.getInstance().y) * MapCamera.getInstance().screenScaleY,
                list: list
            });
            this.showClick = true;
        } else {
            //TODO 点击了不可走地块
        }
    },
    showEarthEffect: function (position) {
        this.clickShowObject = new cc.Sprite("res/fight/ui/selectEarth.png");
        this.addChild(this.clickShowObject);
        this.clickShowObject.setPosition(position.x, position.y);
        this.clickShowEffect = new EarthEffect(this.clickShowObject);
    },
    closeSelect: function () {
        this.showClick = false;
        ModuleMgr.inst().openModule("TileMenuModule", null);//关闭弹框
        if (this.clickShowObject) {
            this.clickShowObject.getParent().removeChild(this.clickShowObject);
            this.clickShowObject = null;
        }
        if (this.clickShowEffect) {
            this.clickShowEffect.dispose();
            this.clickShowEffect = null;
        }
    },
    dispose: function () {
        this.closeSelect();
    }
});