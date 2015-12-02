/**
 * 切换地图模块
 */
var MapChangeModule = ModuleBase.extend({
    animation1: null,
    animation2: null,
    effectWidth: 890,
    effectHeight: 590,
    allTime: 1,
    speedStart:1.2,
    minSpeed:0.8,
    speed:null,
    addSpeed:0.6,
    time: null,
    step: null,
    data:null,
    openModuleFlag:null,
    ctor: function () {
        this._super();
    },
    initUI: function () {
        var screenWidth = cc.Director.getInstance().getWinSize().width;
        var screenHeight = cc.Director.getInstance().getWinSize().height;
        var scaleX = screenWidth / this.effectWidth;
        var scaleY = screenHeight / this.effectHeight;
        var scale = scaleX > scaleY ? scaleX : scaleY;
        this.setScale(scale * 3, scale * 3);

        this.animation1 = new Animation({
            url: "res/fight/effect/cloud/cloud_up00",
            format: "png",
            start: 1,
            end: 13,
            frameRate: 18,
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0,
            scaleX:2,
            scaleY:2
        });
        this.addChild(this.animation1);
        this.animation1.setPosition(0, 0);

        this.animation2 = new Animation({
            url: "res/fight/effect/cloud/cloud_down00",
            format: "png",
            start: 1,
            end: 13,
            frameRate: 18,
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0,
            scaleX:2,
            scaleY:2
        });
        this.addChild(this.animation2);
        this.animation2.setPosition(0, 0);
        this.time = 0;
        this.step = 1;
        this.speed = this.speedStart;
        this.update(0);
    },
    update: function (dt) {
        if(this.step == 1 || this.step == 3) {
            this.animation1.setPosition(this.effectWidth * (1 - this.time), this.effectHeight * (1 - this.time));
            this.animation2.setPosition(this.effectWidth * (this.time - 1), this.effectHeight * (this.time - 1));
        }
        if (this.step == 1) {
            dt *= this.speed;
            this.speed -= this.addSpeed*dt;
            if(this.speed < this.minSpeed) {
                this.speed = this.minSpeed;
            }
            this.time += dt;
            if (this.time >= 1) {
                this.time = 0.3;
                this.step = 2;
                ModuleMgr.inst().openModule("TileMenuModule", null);//关闭弹框
                this.openModuleFlag = false;
                if(this.data.type == MapChangeModule.SHOW_CASTLE) {
                    var _this = this;
                    var back1 = function(){
                        _this.openModuleFlag = true;
                        UIData.getInstance().removeListener(UIData.SHOW_CASTLE_COMPLETE,back1);
                    }
                    UIData.getInstance().addListener(UIData.SHOW_CASTLE_COMPLETE,back1);
                    if(UIData.getInstance().showType == UIData.SHOW_CASTLE) {
                        ModuleMgr.inst().closeModule("CastleModule");
                    } else {
                        ModuleMgr.inst().closeModule("BigMapModule");
                    }
                    ModuleMgr.inst().openModule("CastleModule",this.data.moduleData);
                } else if(this.data.type == MapChangeModule.SHOW_MAP) {
                    var _this = this;
                    var back2 = function(){
                        _this.openModuleFlag = true;
                        UIData.getInstance().removeListener(UIData.SHOW_MAP_COMPLETE,back2);
                    }
                    UIData.getInstance().addListener(UIData.SHOW_MAP_COMPLETE,back2);
                    if(UIData.getInstance().showType == UIData.SHOW_CASTLE) {
                        ModuleMgr.inst().closeModule("CastleModule");
                    } else {
                        ModuleMgr.inst().closeModule("BigMapModule");
                    }
                    ModuleMgr.inst().openModule("BigMapModule",this.data.moduleData);
                }
            }
        } else if (this.step == 2) {
            this.time -= dt;
            if (this.time <= 0 && this.openModuleFlag) {
                this.time = 1;
                this.step = 3;
                this.speed = this.minSpeed;
            }
        } else {
            dt *= this.speed;
            this.speed += this.addSpeed*dt;
            if(this.speed > this.speedStart) {
                this.speed = this.speedStart;
            }
            this.time -= dt;
            if (this.time <= 0) {
                this.time = 0;
                this.step = 1;
                this.unscheduleUpdate();
                ModuleMgr.inst().closeModule("MapChangeModule");
            }
        }
    },
    show: function (data) {
        trace("消息：",data.type);
        this.data = data;
        this.scheduleUpdate();
        //切换地图时，更新切换按钮状态
        ModuleMgr.inst().getData("BattleUIModule").updateStateExchangeBtn(data.type);
    },
    destroy: function () {
        trace("销毁切换地图模块");
        this.animation1.dispose();
        this.animation2.dispose();
        this.animation1 = null;
        this.animation2 = null;
    }
});

//显示城内
MapChangeModule.SHOW_CASTLE = "showCastle";
//显示大地图
MapChangeModule.SHOW_MAP = "showMap";