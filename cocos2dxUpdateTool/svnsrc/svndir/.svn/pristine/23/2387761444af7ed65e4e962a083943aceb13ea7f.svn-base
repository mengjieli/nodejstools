/**
 * zwp .
 * 动画类
 */

var AnimationSprite = cc.Sprite.extend({

    _isAdd:false,

    _callBack:null,
    _owner:null,
    _parameter:null,

    ctor:function( )
    {
        this._super();
    },

    onEnter: function ()
    {
        this._super();
        this.scheduleUpdate();
    },

    onExit: function ()
    {
        this._super();
    },

    update:function( dt )
    {
        this._super( dt );

        if( this._isAdd )
        {
            this.setBlendFunc(gl.ONE,gl.ONE);
        }
    },

    setAdd:function( b )
    {
        this._isAdd = b;
    },


    /*
     * 设置动画, 按时间播发
     * animationConfig ：动画配置
     * duration ： 持续时间
     * callBack ：回调函数
     * owner ：回调对象
     * data ：数据
     */
    setAnimationByTime:function( animationConfig, duration, callBack, owner, data )
    {
        this.removeData();

        if (animationConfig == null) return;

        this.setAnchorPoint( animationConfig.anchorX, animationConfig.anchorY );
        this.setScale( animationConfig.scale );

        var lists = [];

        var num = Number( animationConfig.frameNum );
        var time = Number( animationConfig.time );
        var delay = time/num;
        duration = duration == undefined ? 0 : duration;
        var loop = duration > 0 ? duration : 1;

        var imgName = animationConfig.key + "_";
        if( animationConfig.imageName != undefined || animationConfig.imageName != "0" )
        {
            imgName = animationConfig.imageName;
        }
        for (var i = 0; i < num; i++)
        {
            var frameName = imgName + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame( frameName );
            lists.push( spriteFrame );
        }

        if( lists.length == 0 ) return;

        var an = new cc.Animation( lists, delay );
        an.setLoops( loop );
        var animate = new cc.Animate( an );

        var action = cc.repeatForever( animate );
        this.runAction( action );

        if( duration > 0 )
        {
            this._callBack = callBack == undefined ? null : callBack;
            this._owner = owner == undefined ? null : owner;
            this._parameter = data == undefined ? null : data;

            var delay = cc.sequence( cc.delayTime(duration), cc.callFunc( this.endAnimation, this ) );
            this.runAction( delay );
        }

    },

    /*
     * 设置动画, 按次数播发
     * animationConfig ：动画配置
     * count ： 播放次数
     * callBack ：回调函数
     * owner ：回调对象
     * data ：数据
     */
    setAnimationByCount:function( animationConfig, count, callBack, owner, data )
    {
        this.removeData();
        if (animationConfig == null) return;

        this.setAnchorPoint( animationConfig.anchorX, animationConfig.anchorY );
        this.setScale( animationConfig.scale );

        var lists = [];

        var num = Number( animationConfig.frameNum );
        var time = Number( animationConfig.time );
        var delay = time/num;
        count = count == undefined ? 0 : count;
        var loop = count > 0 ? count : 1;

        var imgName = animationConfig.key + "_";
        if( animationConfig.imageName != undefined && animationConfig.imageName != "0" )
        {
            imgName = animationConfig.imageName;
        }
        for (var i = 0; i < num; i++)
        {
            var frameName = imgName + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame( frameName );
            lists.push( spriteFrame );
        }
        if( lists.length == 0 ) return;

        var an = new cc.Animation( lists, delay );
        an.setLoops( loop );
        var animate = new cc.Animate( an );

        var ac = null;

        if( count <= 0 )
        {
            ac = cc.repeatForever( animate );
        }
        else
        {
            if (callBack)
            {
                this._callBack = callBack == undefined ? null : callBack;
                this._owner = owner == undefined ? null : owner;
                this._parameter = data == undefined ? null : data;
                ac =  cc.sequence( animate, cc.callFunc( this.endAnimation, this ) );
            }
            else
            {
                ac =  cc.sequence( animate );
            }
        }

        if( ac )
        {
            this.runAction( ac );
        }
    },



    endAnimation:function( node )
    {
        if( this._callBack ) this._callBack.call( this._owner, this._parameter );
        this.removeData();
    },

    getSpriteFrameList:function( animationConfig )
    {
        var lists = [];
        var imgName = animationConfig.key + "_";
        if( animationConfig.imageName != undefined && animationConfig.imageName != "0" )
        {
            imgName = animationConfig.imageName;
        }
        for (var i = 0; i < num; i++)
        {
            var frameName = imgName + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame( frameName );
            lists.push( spriteFrame );
        }
        return lists;
    },

    removeData:function()
    {
        this._isAdd = false;
        this._callBack = null;
        this._owner = null;
        this._parameter = null;

        this.stopAllActions();
        this.removeAllChildren();
    }
});