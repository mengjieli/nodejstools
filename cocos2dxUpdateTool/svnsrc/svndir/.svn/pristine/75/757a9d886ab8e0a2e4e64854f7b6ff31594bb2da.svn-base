/*
 {
 plist:"1.plist",
 name: "120000",
 format: "png",
 start: 0,
 end: 24,
 frameRate: 30,
 x: 0,
 y: 0
 }
 */

var Animation = cc.Sprite.extend({
    config: null,
    frame: -1, //当前第几帧
    length: 0,//总帧数
    moreTime: 0,//上帧多余的时间
    playFlag: false,//是否正在播放
    frames: null,//帧图片内容
    show: null,//当前显示的图片
    timeGap: 0,//每帧的时间间隔
    spriteName: null,//sprite的名称
    ctor: function (config) {
        this._super();
        this.frames = [];
        this.config = config;
        this.init();
        this.play();
        this.update(this.timeGap);
    },
    init: function () {
        this.spriteName = [];
        this.timeGap = 1 / this.config.frameRate;
        this.length = this.config.end - this.config.start + 1;
        var len = this.length;
        var nameLen = (this.config.end + "").length;
        var url;
        if (this.config.plist) {
            cc.spriteFrameCache.addSpriteFrames(this.config.plist);
            url = this.config.name;
        } else {
            url = this.config.url;
        }
        var urlBegin = url.slice(0, url.length - nameLen);
        var curName = "";
        var format = this.config.format;
        for (var i = 0; i < len; i++) {
            curName = (this.config.start + i) + "";
            for (var c = curName.length; c < nameLen; c++) {
                curName = "0" + curName;
            }
            curName = urlBegin + curName + "." + format;
            var sprite;
            if (this.config.plist) {
                sprite = new cc.Sprite("#" + curName);
            } else {
                sprite = new cc.Sprite(curName);
                this.spriteName.push(curName);
            }
            if (this.config.anchorX != null) {
                sprite.setAnchorPoint(this.config.anchorX, this.config.anchorY);
            }
            if (this.config.scaleX != null) {
                sprite.setScale(this.config.scaleX, this.config.scaleY);
            }
            sprite.setPosition(this.config.x, this.config.y);
            sprite.retain();
            this.frames.push(sprite);
        }
    },
    play: function () {
        if (this.playFlag) {
            return;
        }
        this.playFlag = true;
        this.scheduleUpdate();
    },
    stop: function () {
        if (!this.playFlag) {
            return;
        }
        this.playFlag = false;
        this.unscheduleUpdate();
    },
    isPlaying: function () {
        return this.playFlag;
    },
    update: function (dt) {
        dt += this.moreTime;
        this.moreTime = dt % this.timeGap;
        var curFrame = this.frame + Math.floor(dt / this.timeGap);
        if (curFrame >= this.length) {
            this.frame = 0;
            var len = Math.floor(curFrame / this.length);
            while (len) {
                //todo 循环处理结束事件
                len--;
            }
        }
        curFrame = curFrame % this.length;
        if (this.frame != curFrame) {
            if (this.show) {
                if (this.show.getParent()) {
                    this.removeChild(this.show);
                }
            }
            this.frame = curFrame;
            this.show = this.frames[this.frame];
            this.addChild(this.show);
        } else {
            this.frame = curFrame;
        }
    },
    /**
     * 清除内存，再使用完毕后清除内存。否则会内存溢出
     */
    dispose: function () {
        this.stop();
        for (var i = 0; i < this.frames.length; i++) {
            this.frames[i].release();
        }
        this.frames = null;
        if (this.show) {
            this.removeChild(this.show);
        }
        if (this.getParent()) {
            this.getParent().removeChild(this);
        }
        if (this.config.plist) {
            cc.spriteFrameCache.removeSpriteFrames(this.config.plist);
        } else {
            for (var i = 0; i < this.spriteName.length; i++) {
                cc.textureCache.removeTextureForKey(this.spriteName[i]);
            }
        }
    }
});