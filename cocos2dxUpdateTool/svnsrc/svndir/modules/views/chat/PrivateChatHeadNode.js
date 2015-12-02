/**
 * Created by Administrator on 2015/11/27/0027.
 */
var PrivateChatHeadNode = ccui.Widget.extend({

    _imgHead:null,//头像
    _imgHeadBox:null,//头像框
    _tfName:null,//名字
    _node:null,//聊天行组件
    _id:null,//玩家id
    ctor : function() {
        this._super();
        this.setAnchorPoint(cc.p(0,0));
    },
    initData:function(node,id,name,headId){
        //var netChat=new PrivateChatBeanNet(data._data);
        this._id=id;
        this._node=node;
        this._node.x=this._node.y=0;
        this.addChild(this._node);

        this._tfName=this._node.getChildByName("name");
        this._imgHeadBox=this._node.getChildByName("head_0");
        this._imgHead=this._node.getChildByName("head");
        this._imgHead.addTouchEventListener(this.onHeadTouch,this);
        var remove=this._node.getChildByName("remove");
        remove.addTouchEventListener(this.onRemoveTouch,this);

        var url=ResMgr.inst().getCSV("head",1).head_id;
        this._imgHead.loadTexture(ResMgr.inst().getIcoPath(url));
        this._imgHead.scale=0.9;
        this._tfName.setString(name);
        //cc.log(this._node.height+"height"+this._tfWords.height);
    },
    //=============================事件
    onHeadTouch:function(target,type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log("点击头像@@@@@@@@");
                EventMgr.inst().dispatchEvent( PirvateChatEvent.SELECT_HEAD,this._id);
                //ModuleMgr.inst().openModule("PlayerInfoModule",{id:"11"});
                break;
        }
    },
    onRemoveTouch:function(target,type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log("去除头像@@@@@@@@");
                EventMgr.inst().dispatchEvent( PirvateChatEvent.REMOVE_HEAD,this._id);
                break;
        }
    },
    destroy:function(){
        if(this._node){
            this._node.removeFromParent();
            this._node=null;
        }
    },
})