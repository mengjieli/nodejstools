/**
 * Created by Administrator on 2015/10/20.
 */

//地图显示层
MapBackdropLayer = {};
MapBackdropLayer.Backdrop = 1;
MapBackdropLayer.object = 2;
MapBackdropLayer.other = 3;


var MapBackdrop = cc.Node.extend({
    _layers: null,
    _currentViewRect: null,  //当前的显示的视野像素大小
    _staticObjectDic: null,  //静态对象容器
    _createCache: null,
    ctor: function () {
        this._super();
        this._staticObjectDic = {};
        this._layers = [];
        this._createCache = {};
        for (var i = MapBackdropLayer.Backdrop; i <= MapBackdropLayer.other; i++) {
            this._layers[i] = new cc.Node();
            this.addChild(this._layers[i]);
        }
    },
    initUI: function () {

    },
    /*
     * 读取背景对象表
     */
    updateTerrain: function (rect) {
        var map = ModuleMgr.inst().getData("MapModule");
        if (map == null) return;
        this._currentViewRect = rect;
        var sers = map.getServers();
        var mapArr = []; //{ dataRect:rect, path:string }
        var loadList = [];
        var t = (new Date()).getTime();
        for (var key in sers) {
            trace("MapSer",key,sers[key]);
            var item = sers[key];
            trace("MapSerItem",item.pos.x,item.pos.y,item.rect.x,item.rect.y,item.rect.width,item.rect.height);
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
        for(var i = 0; i < loadList.length; i++) {
            trace("加载地图配置：",loadList[i]);
        }
        for(var i = 0; i < mapArr.length; i++) {
            trace("加载地图配置2：",mapArr[i]);
        }
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
            for(var key in item) {
                trace("MapConfig",key,item[key]);
            }
            if (!cc.rectIntersectsRect(item.rect, this._currentViewRect)) return;
            console.log("mapConfigPath:" + item.path );
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
        //从表里添加
        var len = mapArr.length;
        var t = (new Date()).getTime();
        for (var i = 0; i < len; i++) {
            var data = mapArr[i];
            //背景
            var bgs = data.bottom;
            var bsLen = bgs.length;
            console.log("背景个数："  + bsLen);
            for (var j = 0; j < bsLen; j++) {
                this.judgeCanCreateStaticObject(rect, bgs[j], true);
            }
            //对象
            var objs = data.first;
            var objLen = objs.length;
            this._objectNum = 0;
            for (var j = 0; j < objLen; j++) {
                this.judgeCanCreateStaticObject(rect, objs[j], false);
            }
        }
        //把视野之外的删除
        for (var id in this._staticObjectDic) {
            var item = this._staticObjectDic[id];
            if (!cc.rectIntersectsRect(rect, item.rect)) {
                //从显示层中删除
                this.removeObjectToMap(item);
                //从静态容器中删除-- 以后可以扩展成缓存
                this.removeStaticObject(item.id);
            }
        }

        cc.log("创建了 " + this._objectNum + " 对象");
        var e = (new Date()).getTime();
        cc.log("创建对象耗时:" + +(e - t));
    },

    _objectNum: 0,
    judgeCanCreateStaticObject: function (rect, arr, isBj) {
        console.log("添加地图对象");
        var itemArr = arr;
        var pos = cc.p(itemArr[1], itemArr[2]);
        var img = "map_static_" + itemArr[0] + ".png";
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(img);
        var imgRect = cc.rect(0, 0, 0, 0);
        imgRect.width = spriteFrame.getOriginalSize().width;
        imgRect.height = spriteFrame.getOriginalSize().height;
        if (isBj) {
            imgRect.width = imgRect.width * 2;
            imgRect.height = imgRect.height * 2;
        }
        else {
            imgRect.width = imgRect.width * itemArr[4];
            imgRect.height = imgRect.height * itemArr[5];
        }
        imgRect.x = Math.floor(pos.x);
        imgRect.y = Math.floor(pos.y - imgRect.height);
        imgRect.width = Math.floor(imgRect.width);
        imgRect.height = Math.floor(imgRect.height);

        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(imgRect.y);
        var id = itemArr[0] + "" + pos.x + "" + pos.y;
        if (cc.rectIntersectsRect(rect, imgRect) && this.isShow(id)) {
            this._objectNum++;
            var objData = {};
            objData.id = id;
            objData.isBj = isBj;
            objData.rect = imgRect;
            objData.imgPath = "#" + img;
            objData.position = pos;
            objData.rotation = itemArr[3] == undefined ? 0 : itemArr[3];
            objData.scaleX = itemArr[4] == undefined ? 2 : itemArr[4];
            objData.scaleY = itemArr[5] == undefined ? 2 : itemArr[5];
            objData.opacity = itemArr[6] == undefined ? 1 : itemArr[6];
            objData.z = itemArr[7] == undefined ? 0 : itemArr[7];
            objData.time = Math.random() * 0.05;
            console.log("");
            console.log("对象");
            for(var key in objData) {
                trace("objData:",key,"=",objData[key]);
                if(key == "rect") {
                    trace(objData[key].x,objData[key].y,objData[key].width,objData[key].height);
                }
                if(key == "position") {
                    trace(objData[key].x,objData[key].y);
                }
            }

            if (isBj) {
                this.createStaticObject(objData);
            }
            else {
                this.createStaticObject(objData);
                //var t = Math.random() * 0.05;
                //this._createCache[id] = objData;
                //var ac = cc.sequence( cc.delayTime( t ), cc.callFunc( this.delayCallBack, this, id ) );
                //this.runAction( ac );

            }
        }
    },

    delayCallBack: function (node, id) {
        var objData = this._createCache[id];
        this.createStaticObject(objData);
    },

    createStaticObject: function (data) {
        if (data == null ||
            this._currentViewRect == null || !cc.rectIntersectsRect(this._currentViewRect, data.rect)) return;

        console.log("单张图片：" + data.imgPath);
        var sp = new cc.Sprite(data.imgPath);
        sp.setAnchorPoint(0, 0);
        sp.setPosition(data.position);
        sp.setRotation(data.rotation)
        sp.setScaleX(data.scaleX);
        sp.setScaleY(data.scaleY);
        sp.setOpacity(data.opacity * 255);
        sp.setLocalZOrder(data.z);

        var staticObj = {};
        staticObj.id = data.id;
        staticObj.layer = data.isBj ? MapBackdropLayer.Backdrop : MapBackdropLayer.object;
        staticObj.rect = data.rect;
        staticObj.time = ( new Date()).getTime();
        staticObj.sprite = sp;

        //添加到容器
        this.addObjectToMap(staticObj);
        this.addStaticObject(staticObj);
    },
    isShow: function (id) {
        return this._staticObjectDic[id] == undefined;
    },
    addStaticObject: function (obj) {
        this._staticObjectDic[obj.id] = obj;
    },
    removeStaticObject: function (id) {
        delete this._staticObjectDic[id];
    },
    addObjectToMap: function (obj) {
        if (obj == null) return;

        this._layers[obj.layer].addChild(obj.sprite);
    },
    removeObjectToMap: function (obj) {
        if (obj == null) return;

        this._layers[obj.layer].removeChild(obj.sprite);
    },
});