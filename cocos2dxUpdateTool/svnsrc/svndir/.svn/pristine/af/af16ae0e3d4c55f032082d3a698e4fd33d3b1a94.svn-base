/**
 * Created by Administrator on 2015/11/24/0024.
 */
var PlayerInfoModule = ModuleBase.extend({
    _ui: null,//ui
    _id:null,//玩家id
    _tfName:null,//名字
    _imgHead:null,//头像
    _btPrivateChat:null,//私聊按钮
    _btAddFriend:null,//加好友按钮
    _btClose:null,//关闭按钮

    ctor: function ()
    {
        this._super();
    },
    initUI: function ()
    {
        this._ui = ccs.load("res/images/ui/playerInfo/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );

        this._tfName = this._ui.getChildByName("Panel_2").getChildByName("name");
        this._imgHead = this._ui.getChildByName("Panel_2").getChildByName("head");
        this._btPrivateChat = this._ui.getChildByName("Panel_2").getChildByName("private_chat");
        this._btPrivateChat.addTouchEventListener( this.onPrivateChat, this );
        this._btAddFriend = this._ui.getChildByName("Panel_2").getChildByName("add_friend");
        this._btAddFriend.addTouchEventListener( this.onAddFriend, this );
        this._btClose = this._ui.getChildByName("Panel_2").getChildByName("close");
        this._btClose.addTouchEventListener( this.onClose, this );

        this._ui.getChildByName("Panel_2").getChildByName("family").setVisible(false);
        this._ui.getChildByName("Panel_2").getChildByName("level").setVisible(false);
    },
    //
    show:function( data )
    {
        cc.log(" 玩家信息  show------------");
        if(data!=undefined) {
            cc.log("data.id"+data.id);
            this._id=data.id;
        }
        var url=ResMgr.inst().getCSV("head",1).head_id;
        this._imgHead.loadTexture(ResMgr.inst().getIcoPath(url));
        this._imgHead.scale=0.9;
        //this._tfName.setString();
    },
    //清除方法
    destroy:function() {
        cc.log("玩家信息destroy");
    },
    //==========================事件
    onPrivateChat:function(node,type){
        if( type == ccui.Widget.TOUCH_ENDED ){
            cc.log("打开私聊模块"+this._id);
            ModuleMgr.inst().openModule("PrivateChatModule",{id:this._id});
        }
    },
    onAddFriend:function(node,type){
        if( type == ccui.Widget.TOUCH_ENDED ){
            cc.log("打开好友模块");

        }
    },
    onClose:function(node,type)
    {
        if( type == ccui.Widget.TOUCH_ENDED ){
            ModuleMgr.inst().closeModule("PlayerInfoModule");
        }
    },

})