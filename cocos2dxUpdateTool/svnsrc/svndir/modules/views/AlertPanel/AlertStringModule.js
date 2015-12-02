/**
 * Created by Administrator on 2015/11/07/0007.
 */
var AlertStringModule=ModuleBase.extend({
    _tf:null,//文本


    ctor:function()
    {
        this._super();
    },

    initUI:function()
    {
        if(this._tf==null){
            this._tf=new cc.LabelTTF("","Arial",20);
            this.addChild(this._tf);
        }
    },

    destroy:function() {
        this._super();
        this._tf.removeFromParent();
        this._tf=null;
    },
    show:function( data)//用法data参数   {str:ResMgr.inst().getString("castle_1"),color:null,time:null,pos:null}  pos屏幕位置 默认居中
    {
        //cc.log(data.str+data.time+data.color+"ALertstring#####################$$$$$$$$$$$"+data.pos);
        var size = cc.director.getVisibleSize();
        var moveHeight=80;
        if(data.pos==undefined||data.pos==null){
            data.pos=new cc.p(size.width/2,size.height/2);
        }
        else{
            if(data.pos.y>size.height-moveHeight) data.pos.y>=size.height-moveHeight;
            if(data.pos.y<0) data.pos=new cc.p(size.width/2,size.height/2);
        }
        if(this._tf==null){
            this._tf=new cc.LabelTTF(data.str,"Arial",20);
            this.addChild(this._tf);
        }
        else {
            if(this._tf.string==data.str){
                cc.log("和上次值一样 不顶");
                //this._tf.setColor((data.color==undefined||data.color==null)?cc.color.RED:data.color);
                //this._tf.setPosition(data.pos.x,data.pos.y);
                return;
            }
            else{
                this._tf.removeFromParent();
                this._tf=null;
                this._tf=new cc.LabelTTF(data.str,"Arial",20);
                this.addChild(this._tf);
            }
            this._tf.string=data.str;
        }
        this._tf.setColor((data.color==undefined||data.color==null)?cc.color.RED:data.color);
        this._tf.setPosition(data.pos.x,data.pos.y);

        if(data.time==null||data.time==undefined) data.time=1.8;
        var action1 = cc.moveTo(data.time, cc.p(data.pos.x, data.pos.y+moveHeight))//.easing(cc.easeIn(data.time));
        var action2 = cc.fadeOut(data.time).easing(cc.easeIn(data.time));;
        var action =cc.spawn(action1,action2);
        //var callback = new cc.CallFunc(function(){ AlertString.text.removeFromParent()},this);
        var callback = new cc.CallFunc(this.dispose,this);
        var move1=new cc.Sequence(action,callback);
        this._tf.runAction(move1);
        //AutoResizeUtils.setCenter(this._tf);
    },

    close:function()
    {
        this._super(true);
    },

    dispose:function(){
        ModuleMgr.inst().closeModule("AlertString");
    }

})