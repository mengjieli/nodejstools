/**
 * Created by Administrator on 2015/09/07/0007.
 */

var MapModule = ModuleBase.extend({
    _mapLayer: null,        //地图主层
    _layers: null,          //地图分层
    _objects: null,          //地图对象
    _staticObjectDic: null,  //静态对象容器\
    _cameraPos: null,        //摄像机坐标
    _starOffset: null,       //起始坐标到屏幕中心的偏移量
    _oldCameraPos: null,     //旧的摄像机坐标
    _moveSize: null,         //摄像机移动取数据范围，超出范围就向服务端取数据
    _mapFrontierRect: null,  //摄像机移动范围 ：注意w,h不是宽高。是点
    _viewScale: 1,
    _currentViewRect: null,   //当前的显示的视野像素大小
    _backdrop: null, //地图背景层，包括地图上的建筑等元素。
    fightTest: null,
    ctor: function () {
        this._super();
    },
    initUI: function () {
        //注册事件
        EventMgr.inst().addEventListener(MapEvent.ACCEPT_MOVE_CAMERA, this.moveCameraEvent, this);
        EventMgr.inst().addEventListener(PlayerEvent.SEND_ADD_OBJECT, this.addObjects, this);
        EventMgr.inst().addEventListener(PlayerEvent.SEND_REMOVE_OBJECT, this.removeObjects, this);
        EventMgr.inst().addEventListener(MapEvent.SEND_SERVER_LIST, this.showMap, this);
        //注册鼠标事件
        cc.eventManager.addListener(
            {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan.bind(this),
                onTouchMoved: this.onTouchMoved.bind(this),
                onTouchEnded: this.onTouchEnded.bind(this)
            },
            this);
        //初始化对象列表和层次
        this._objects = [];
        this._staticObjectDic = {};
        this._mapLayer = new cc.Layer();
        this.addChild(this._mapLayer);
        this._layers = [];
        this._objects = [];
        //初始化地图层次结构
        for (var i = 0; i <= ObjectLayerType.End; i++) {
            var layer = null;
            if (i == ObjectLayerType.BACKGROUND) {
                this._backdrop = new MapBackdrop();
                layer = this._backdrop;
            }
            else {
                layer = new cc.Layer();
            }
            this._layers[i] = layer;
            this._mapLayer.addChild(layer);
            this._objects[i] = [];
        }
        this._oldCameraPos = cc.p(0, 0);
        this._viewScale = 1;
        this._starOffset = cc.size(0, 0);
        this._starOffset.width = GameMgr.inst().viewSize.width >> 1;
        this._starOffset.height = GameMgr.inst().viewSize.height >> 1;
        this._moveSize = cc.size(0, 0);
        this._moveSize.width = GameMgr.inst().viewSize.width / 2.5;
        this._moveSize.height = GameMgr.inst().viewSize.height / 2.5;
        //地图大小配置
        this._mapServerRanksSize = cc.size(240, 270);
        this._mapServerPixelSize = cc.size(0, 0);
        this._mapServerPixelSize.width = this._mapServerRanksSize.width * HexagonUtils.gridSize.width;
        this._mapServerPixelSize.height = this._mapServerRanksSize.width * HexagonUtils.gridSize.height;
        this._mapDataSize = cc.size(10, 9);
        this._mapDataGridSize = cc.size(0, 0);
        this._mapDataGridSize.width = this._mapServerRanksSize.width / this._mapDataSize.width * HexagonUtils.gridSize.width;
        this._mapDataGridSize.height = this._mapServerRanksSize.height / this._mapDataSize.height * HexagonUtils.gridSize.height;
        //地块UI test
        /*
        var touchCallback = function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                var tileid = null;
                var pos = sender.getPosition();
                switch (sender.getTag()) {
                    case 1:
                        tileid = 1906001;//1601001;//
                        break;
                    case 2:
                        tileid = 1904001; //1602001;//
                        break;
                    case 3:
                        tileid = null;//1603001;//
                        break;
                }
                //ModuleMgr.inst().openModule("TileMenuModule",{objectid:tileid,objectpos:pos});
                ModuleMgr.inst().openModule("BuildingUIModule", {objectid: tileid, objectpos: pos});
            }
        };
        /*var tile1 = new ccui.Button();
         tile1.setTitleText("building一");
         tile1.setTag(1);
         tile1.setTitleFontSize(30);
         tile1.addTouchEventListener(touchCallback,this);
         tile1.setPosition(cc.p(200,200));
         this.addChild(tile1);
         var tile2 = new ccui.Button();
         tile2.setTitleText("building二");
         tile2.setTag(2);
         tile2.setTitleFontSize(30);
         tile2.addTouchEventListener(touchCallback,this);
         tile2.setPosition(cc.p(350,300));
         this.addChild(tile2);
         var tile3 = new ccui.Button();
         tile3.setTitleText("其他");
         tile3.setTag(3);
         tile3.setTitleFontSize(30);
         tile3.addTouchEventListener(touchCallback,this);
         tile3.setPosition(cc.p(600,400));
         this.addChild(tile3);//*/
        //this.addChild(this.fightTest = new FightTest(this));
    },
    destroy: function () {
        EventMgr.inst().removeEventListener(MapEvent.ACCEPT_MOVE_CAMERA, this.moveCameraEvent, this);
        EventMgr.inst().removeEventListener(PlayerEvent.SEND_ADD_OBJECT, this.addObjects, this);
        EventMgr.inst().removeEventListener(PlayerEvent.SEND_ADD_OBJECT, this.removeObjects, this);
        EventMgr.inst().removeEventListener(MapEvent.SEND_SERVER_LIST, this.showMap, this);
    },
    show: function (data) {
        ModuleMgr.inst().openModule("MainResourcesModule");
        ModuleMgr.inst().openModule("MainMenuModule");
        var map = ModuleMgr.inst().getData("MapModule");
        if (map == null) return;
        if (map._servers == null) {
            map.ncGetServerList();
        }
        else {
            this.showMap();
        }
    },
    showMap: function () {
        //地图尺寸
        var map = ModuleMgr.inst().getData("MapModule");
        if (this._mapFrontierRect == null) {
            this._mapFrontierRect = cc.rect(0, 0, 0, 0);
            this._mapFrontierRect.x = map._mapSizeRect.x + this._starOffset.width;
            this._mapFrontierRect.y = map._mapSizeRect.y + this._starOffset.height;
            this._mapFrontierRect.width = map._mapSizeRect.x + map._mapSizeRect.width - this._starOffset.width;
            this._mapFrontierRect.height = map._mapSizeRect.y + map._mapSizeRect.height - this._starOffset.height;
        }
        var pos = cc.p(0, 0);
        //城堡
        /*var player = ModuleMgr.inst().getData("PlayerData");
        if (player == null) return;
        var towerId = cc.sys.localStorage.getItem("towerId");
        var obj = player.getObject(towerId);
        //如果为空，取第一个城堡
        if (obj == null) {
            obj = player.getFirstTower();
        }
        //如果城堡为空,取移民
        if (obj == null) {
            obj = player.getFirstImmigrant();
        }
        //如果什么都没有。取服务器中心
        if (obj == null) {
            pos = cc.p(0, 0);
        }
        else {
            pos = obj.getPosition();
        }*/
        this.setCameraPos(pos);
        this.setMapObjects(pos);
    },
    _beganPos: null,
    _movedPos: null,
    onTouchBegan: function (touch, event) {
        this._beganPos = touch.getLocation();
        this._movedPos = this._beganPos;
        if (this.fightTest) {
            this.fightTest.touch(touch, event);
        }
        return true;
    },
    onTouchMoved: function (touch, event) {
        var starPos = this._beganPos;
        var endPos = touch.getLocation();
        //触摸范围大于30
        if ((Math.abs(starPos.x - endPos.x) > 30 || Math.abs(starPos.y - endPos.y) > 30)) {
            var offset = MathUtils.pointSubtract(this._movedPos, endPos);
            var cameraP = MathUtils.pointAdd(this._cameraPos, offset);
            this.setCameraPos(cameraP);
        }
        this._movedPos = endPos;
    },
    onTouchEnded: function (touch, event) {

    },
    /*
     * 移动摄像机
     * pos ：坐标
     * isMove　：是否延时移动过去，就是按步长移动
     */
    moveCameraEvent: function (eventName, pos, isMove) {
        if (isMove) {

        }
        else {
            this.setCameraPos(pos);
        }
    },
    setScaleView: function (f) {
        this._viewScale = f;
    },
    /*
     * 设置相机坐标
     * pos ：相机看的目标点
     */
    setCameraPos: function (pos) {
        if (this._mapFrontierRect == null) return;
        //判断是超过边界
        if (pos.x < this._mapFrontierRect.x) pos.x = this._mapFrontierRect.x;
        if (pos.y < this._mapFrontierRect.y) pos.y = this._mapFrontierRect.y;
        if (pos.x > this._mapFrontierRect.width) pos.x = this._mapFrontierRect.width;
        if (pos.y > this._mapFrontierRect.height) pos.y = this._mapFrontierRect.height;

        var p = cc.p(0, 0);
        p.x = this._starOffset.width - pos.x;
        p.y = this._starOffset.height - pos.y;

        this._cameraPos = pos;
        this.setMapLayerPos(p);
        //cc.error( "new::" + pos.x + ":" + pos.y );


        //绘制中新点
        //this._layers[ObjectLayerType.OBJECT].removeAllChildren();
        //var drawNode = new cc.DrawNode();
        //drawNode.drawRect( cc.p(pos.x,pos.y), cc.p(pos.x+ 4, pos.y + 4), cc.color(255,255,0,255 ), 1, cc.color(255,255,255,1) );
        //this._layers[ObjectLayerType.OBJECT].addChild( drawNode );

        //移动超过一定范围，就像服务端求数据
        var sub = MathUtils.pointSubtract(this._cameraPos, this._oldCameraPos);
        if (Math.abs(sub.x) > this._moveSize.width || Math.abs(sub.y) > this._moveSize.height) {
            //cc.log("请求数据");
            this.setMapObjects(pos);
        }
    },

    /*
     * 请求以及本地设置地图显示对象，
     */
    setMapObjects: function (pos) {
        this._oldCameraPos = pos;

        //cc.log( "old:::" +  pos.x + ":" + pos.y );

        //绘制旧中心新点
        //this._layers[ObjectLayerType.BOTTOM].removeAllChildren();
        //var drawNode = new cc.DrawNode();
        //drawNode.drawRect( cc.p(pos.x,pos.y), cc.p(pos.x+ 4, pos.y + 4), cc.color(255,255,255,255 ), 1, cc.color(255,255,255,1) );
        //this._layers[ObjectLayerType.BOTTOM].addChild( drawNode );

        //视野尺寸，单位像素,
        var rect = cc.rect(0, 0, 0, 0);
        rect.x = pos.x - this._starOffset.width - (GameMgr.inst().viewSize.width >> 1);
        rect.y = pos.y - this._starOffset.height - (GameMgr.inst().viewSize.height >> 1);
        rect.width = GameMgr.inst().viewSize.width * 2;
        rect.height = GameMgr.inst().viewSize.height * 2;
        this._currentViewRect = rect;
        //视野大小，单位行列
        var starPos = HexagonUtils.getRanksByCentralPoint(rect.x, rect.y);
        var endPos = HexagonUtils.getRanksByCentralPoint(rect.x + rect.width, rect.y + rect.height);
        var viewSize = MathUtils.pointSubtract(endPos, starPos);
        var viewRanksRect = cc.rect(starPos.x, starPos.y, Math.abs(viewSize.x), Math.abs(viewSize.y));

        //向服务端请求数据
        var map = ModuleMgr.inst().getData("MapModule");
        map.ncMoveCamera(viewRanksRect);
        //更新本地地图对象
        //this.updateTerrain( rect );
        this._backdrop.updateTerrain(rect);
    },

    /*
     * 设置地形坐标
     * pos：坐标
     */
    setMapLayerPos: function (pos) {
        if (this._mapLayer == null) return;
        this._mapLayer.setPosition(pos);
    },


    addObjectToMap: function (obj) {
        if (obj == null) return;

        this._layers[obj._objectLayer].addChild(obj);
        this._objects[obj._objectLayer].push(obj);
    },

    removeObjectToMap: function (obj) {
        if (obj == null) return;

        this._layers[obj._objectLayer].removeChild(obj);
        var list = this._objects[obj._objectLayer];
        if (list) {
            for (var key in list) {
                var item = list[key];
                if (item && item.getID() == obj.getID()) {
                    list.splice(key, 1);
                    break;
                }
            }
        }
    },

    /*
     * 列表排序
     */
    sortObjects: function (layerType) {
        var arr = null;

        var layer = this._layers[layerType];
        if (layer) {
            arr = layer.getChildren();
        }

        if (arr == null || arr.length <= 1) {
            return;
        }
        //从大到小排序
        arr.sort(function (a, b) {
            return (a.y == b.y) ? 0 : (a.y < b.y ? 1 : -1);
        });
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var item = arr[i];
            item.setLocalZOrder(i);
        }
    },


    /*
     * 添加对象到场景
     * id 实例ID
     * isClient 是否客户端创建
     */
    addObjects: function (eventName, id) {

    },

    removeObjects: function (eventName, id) {

    },


    /*************************************************************************************
     * 静态对象操作 star
     * 因为静态对象太多（发消息通知显示会消息过多，频繁）。也没有操作。只显示，所以只好放到View来创建
     * 以后真正确定静态对象不参与对象排序。可以单独做成静态层
     *************************************************************************************/


    /*
     * 读取背景对象表
     */
    updateTerrain: function (rect) {
        return;

        var map = ModuleMgr.inst().getData("MapModule");
        if (map == null) return;


        var sers = map.getServers();

        var mapArr = []; //{ dataRect:rect, path:string }
        var loadList = [];

        var t = (new Date()).getTime();
        for (var key in sers) {
            var item = sers[key];
            var itemX = item.pos.x;
            var itemY = item.pos.y;
            if (item.pos.x < 0)itemX = "0" + Math.abs(itemX);
            if (item.pos.y < 0) itemY = "0" + Math.abs(itemY);
            var mapPath = "map" + itemX + "_" + itemY;
            if (item.isOpen == false) continue;
            if (!cc.rectIntersectsRect(item.rect, rect)) continue;
            //cc.log( item.rect.x +":"+ item.rect.y +":"+ item.rect.width +":"+ item.rect.height);

            for (var index in item.list) {
                var mapData = item.list[index];
                var dataPath = mapData.pos.x + "_" + mapData.pos.y;
                if (cc.rectIntersectsRect(mapData.rect, rect)) {
                    //cc.log( mapData.id )
                    var objItem = {};
                    objItem.rect = mapData.rect;
                    objItem.path = mapPath + "/" + dataPath;
                    mapArr.push(objItem);
                    var fullPath = ResMgr.inst()._mapPath + objItem.path + ".json";
                    //cc.log( mapData.rect.x +":"+ mapData.rect.y +":"+ mapData.rect.width +":"+ mapData.rect.height);
                    //cc.log( fullPath );
                    loadList.push(fullPath);
                }
            }
        }

        var e = (new Date()).getTime();
        cc.log("遍历表耗时:" + "" + (e - t));

        ResMgr.inst().loadList("地图配置", loadList, this.resLoadCallBack, this, mapArr);
    },

    resLoadCallBack: function (event, loadName, data) {
        if (event != LoadEvent.LOAD_COMPLETE || this._currentViewRect == null) return;

        //this._layers[ObjectLayerType.EFFECT].removeAllChildren();
        //var drawNode = new cc.DrawNode();
        //this._layers[ObjectLayerType.EFFECT].addChild( drawNode );

        var dataArr = [];
        for (var index in data) {
            var item = data[index];

            if (!cc.rectIntersectsRect(item.rect, this._currentViewRect)) return;
            var config = ResMgr.inst().getMapConfig(item.path);
            if (config != null) {
                dataArr.push(config);
            }
            //drawNode.drawRect( cc.p(item.rect.x,item.rect.y), cc.p(item.rect.x + item.rect.width,item.rect.y+item.rect.height), cc.color(255,255,255,1 ), 1, cc.color(255,255,255,255) );

        }

        if (dataArr.length > 0) {
            this.updateClientObjects(this._currentViewRect, dataArr);
        }
    },

    /*
     * 摄像机移动。跟新镜头
     * rect:视口大小
     * mapArr：地图列表
     */
    updateClientObjects: function (rect, mapArr) {
        //先把视野之外的删除
        for (var id in this._staticObjectDic) {
            var item = this._staticObjectDic[id];
            if (!cc.rectIntersectsRect(rect, item.rect)) {
                //从显示层中删除
                this.removeObjectToMap(item.object);
                //从静态容器中删除-- 以后可以扩展成缓存
                this.removeStaticObject(item.object.getID());
            }
        }
        //从表里添加
        var len = mapArr.length;
        var t = (new Date()).getTime();
        for (var i = 0; i < len; i++) {
            var data = mapArr[i];
            //背景
            var bgs = data.bottom;
            var bsLen = bgs.length;
            for (var j = 0; j < bsLen; j++) {
                this.createStaticObject(rect, bgs[j], true);
            }
            //对象
            var objs = data.first;
            var objLen = objs.length;
            this._objectNum = 0;
            for (var j = 0; j < objLen; j++) {
                this.createStaticObject(rect, objs[j], false);
            }
        }
        cc.log("创建了 " + this._objectNum + " 对象");
        //排序
        this.sortObjects(ObjectLayerType.STATICOBJECT);
        var e = (new Date()).getTime();
        cc.log("创建对象耗时:" + +(e - t));
    },
    _objectNum: 0,
    createStaticObject: function (rect, arr, isBg) {
        var itemArr = arr;
        var pos = cc.p(itemArr[1], itemArr[2]);
        var img = "map_static_" + itemArr[0] + ".png";
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(img);
        var imgRect = cc.rect(0, 0, 0, 0);
        imgRect.width = spriteFrame.getOriginalSize().width;
        imgRect.height = spriteFrame.getOriginalSize().height;
        if (isBg) {
            imgRect.width = imgRect.width * 2;
            imgRect.height = imgRect.height * 2;
        }
        imgRect.x = pos.x;
        imgRect.y = pos.y - imgRect.height;
        pos.y = imgRect.y;
        var id = itemArr[0] + "" + pos.x + "" + pos.y;
        if (cc.rectIntersectsRect(rect, imgRect) && this.isShow(id)) {
            this._objectNum++;
            var objData = {};
            objData.isBj = isBg;
            objData.id = itemArr[0];
            objData.x = pos.x;
            objData.y = pos.y;
            objData.rotation = itemArr[3] == undefined ? 0 : itemArr[3];
            objData.scaleX = itemArr[4] == undefined ? 1 : itemArr[4];
            objData.scaleY = itemArr[5] == undefined ? 1 : itemArr[5];
            if (isBg) {
                objData.scaleX = objData.scaleX * 2;
                objData.scaleY = objData.scaleY * 2;
            }
            objData.opacity = itemArr[6] == undefined ? 1 : itemArr[6];

            var staticObject = new StaticObject();
            staticObject.initConfig(objData);
            this.addObjectToMap(staticObject);
            //添加到容器
            this.addStaticObject(staticObject, imgRect);
        }
    },
    isShow: function (id) {
        return this._staticObjectDic[id] == undefined;
    },
    addStaticObject: function (obj, imageRect) {
        var item = {};
        item.object = obj;
        item.rect = imageRect;
        item.time = 0;
        this._staticObjectDic[obj.getID()] = item;
    },
    removeStaticObject: function (id) {
        delete this._staticObjectDic[id];
    },
    /*************************************************************************************
     * 静态对象操作 end
     *************************************************************************************/

});