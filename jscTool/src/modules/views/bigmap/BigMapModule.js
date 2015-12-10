var BigMapModule = ModuleBase.extend({
    data: null, //ModuleData
    layer: null, //地图层次
    camera: null,//镜头
    txt: null,
    ctor: function () {
        this._super();
        this.lastCameraX = null;
        this.lastCameraY = null;
    },
    initUI: function () {
        var txt = ccui.Text();
        txt.setFontSize(25);
        txt.setAnchorPoint(0, 0);
        txt.setString("FPS:");
        txt.setPosition(0, 100);
        this.txt = txt;
        //this.getParent().addChild(txt);

        //初始化数据
        this.data = ModuleMgr.inst().getData("BigMapModule");

        //初始化显示
        this.addChild(this.layer = new BigMapLayerManager());
        this.camera = new MapCamera();
        this.camera.init(0, 0,
            -this.data.getServerMapWidth() * 2, -this.data.getServerMapHeight() * 2,
            this.data.getServerMapWidth() * 4, this.data.getServerMapHeight() * 4);
        this.layer.setScale(this.camera.screenScaleX, this.camera.screenScaleY);

        //注册鼠标事件
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        }, this);

        //注册回调
        this.scheduleUpdate();

        var castle = ProfileData.getInstance().castle;
        if(castle) {
            this.camera.lookAt(castle.x, castle.y);
        }

        /*var _this = this;
        setTimeout(function () {
            var actionData = _this.data.getActionManager();
            for (var i = -2; i < 6; i++) {
                if (_this.data.getBlock(castleList[0].coordX + i, castleList[0].coordY - 2).type != 1608001) {
                    actionData.addRoler({
                        id: 1207001,
                        x: castleList[0].coordX + i,
                        y: castleList[0].coordY - 2
                    });
                    break;
                }
            }
        }, 100000);*/
    },
    destroy: function () {
        this.unscheduleUpdate();
        this.layer.dispose();
    },
    show: function (data) {
        UIData.getInstance().showMapComplete();
    },
    //更新
    time: 0,
    count: 0,
    lastCameraX: 1000000000,
    lastCameraY: 1000000000,
    update: function (dt) {
        this.count++;
        this.time += dt;
        /*if (this.time > 1 && this.txt) {
         this.txt.setString("FPS: " + Math.floor(this.count/this.time));
         this.time = 0;
         this.count = 0;
         }*/
        if (this.camera.checkMove()) {
            //trace(this.lastCameraX,this.lastCameraY,bigGridX,bigGridY);
            if (Math.abs(this.camera.x - this.lastCameraX) > this.camera.width * 0.5 ||
                Math.abs(this.camera.y - this.lastCameraY) > this.camera.height * 0.5) {
                var start = MapUtils.transPositionToPoint(this.camera.x - this.camera.width, this.camera.y - this.camera.height);
                var end = MapUtils.transPositionToPoint(this.camera.x + this.camera.width * 2, this.camera.y + this.camera.height * 2);
                //刷新视野
                var msg = new SocketBytes();
                msg.writeUint(301);
                msg.writeInt(start.x);
                msg.writeInt(start.y);
                msg.writeUint(end.x - start.x);
                msg.writeUint(end.y - start.y);
                NetMgr.inst().send(msg);
                //刷新视野
                msg = new SocketBytes();
                msg.writeUint(302);
                msg.writeInt(start.x);
                msg.writeInt(start.y);
                msg.writeUint(end.x - start.x);
                msg.writeUint(end.y - start.y);
                NetMgr.inst().send(msg);
                //记录上次视野范围
                this.lastCameraX = this.camera.x;
                this.lastCameraY = this.camera.y;
                trace("更新视野",this.camera.x,this.camera.y, start.x, start.y, end.x, end.y);
            }
            this.layer.updateShow(this.camera);
        }
    },
    touchBeganPos: null,
    touchPos: null,
    clickFlag: null,
    onTouchBegan: function (touch, event) {
        this.touchPos = touch.getLocation();
        this.touchBeganPos = cc.p(this.touchPos.x, this.touchPos.y);
        this.clickFlag = true;
        //trace("按下", this.touchBeganPos.x, this.touchBeganPos.y);
        this.touchPos.x /= this.camera.screenScaleX;
        this.touchPos.y /= this.camera.screenScaleY;
        this.layer.onTouchBegan(this.touchPos.x, this.touchPos.y);
        //trace("点击：", this.touchPos.x, this.touchPos.y,this.camera.x,this.camera.y,this.layer.getPosition().y);
        return true;
    },
    onTouchMoved: function (touch, event) {
        var pos = touch.getLocation();
        if (this.clickFlag && (Math.abs(pos.x - this.touchBeganPos.x) > 10 || Math.abs(pos.y - this.touchBeganPos.y > 10))) {
            this.clickFlag = false;
            this.layer.dragMap();
            trace("移动超出范围", this.touchBeganPos.x, this.touchBeganPos.y, pos.x, pos.y);
        }
        pos.x /= this.camera.screenScaleX;
        pos.y /= this.camera.screenScaleY;
        this.camera.move(this.touchPos.x - pos.x, this.touchPos.y - pos.y);
        this.touchPos = pos;
    },
    onTouchEnded: function (touch, event) {
        if (this.clickFlag) {
            this.layer.onTouchEnded(this.touchPos.x, this.touchPos.y);
        }
    },
});