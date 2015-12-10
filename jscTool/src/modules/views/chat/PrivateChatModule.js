/**
 * Created by Administrator on 2015/11/25/0025.
 */
var PrivateChatModule = ModuleBase.extend({
    _ui: null,//ui
    _btClose:null,//关闭按钮
    _headScroll: null,      //头像滚动区域
    _sliderBack:null,       //滚动条背景
    _slider:null,           //滚动条
    _msgScroll: null,           //文本滚动区域
    _sliderBackMsg:null,       //滚动条背景
    _sliderMsg:null,           //滚动条

    _arrHead:null,//头像数组
    _arrChatNode:null,//聊天列表数组
    _chatData:null,//聊天数据

    _selectId:null,//当前选中聊天对象id

    _isTest:true,//测试用true
    _testLayer:null,//测试按钮层
    ctor: function ()
    {
        this._super();
    },
    initUI: function () {
        EventMgr.inst().addEventListener(PirvateChatEvent.ADD_CHAT, this.netAddChat, this);
        EventMgr.inst().addEventListener(PirvateChatEvent.REMOVE_HEAD, this.removeHead, this);
        EventMgr.inst().addEventListener(PirvateChatEvent.SELECT_HEAD, this.selectHead, this);
        this._chatData = ModuleMgr.inst().getData("PrivateChatModule");
        this._arrHead=[];
        this._arrChatNode = [];
        this._ui = ccs.load("res/images/ui/chatModule/Private.json", "res/images/ui/").node;
        this.addChild(this._ui);
        this._ui.getChildByName("Panel_2").getChildByName("item").setVisible(false);
        this._ui.getChildByName("Panel_2").getChildByName("item_right").setVisible(false);
        this._ui.getChildByName("Panel_2").getChildByName("item_head").setVisible(false);
        this._btClose = this._ui.getChildByName("Panel_2").getChildByName("close");
        this._btClose.addTouchEventListener( this.onClose, this );
        this._ui.getChildByName("Panel_2").getChildByName("title").setString( ResMgr.inst().getString("chat_9"));
        //滚动
        this._headScroll = this._ui.getChildByName("Panel_2").getChildByName("ScrollView_1");
        this._headScroll.addEventListener(this.onScroll, this);
        this._sliderBack = this._ui.getChildByName("Panel_2").getChildByName("Panel_7");
        this._slider = this._ui.getChildByName("Panel_2").getChildByName("Panel_7").getChildByName("Slider_1");

        this._msgScroll = this._ui.getChildByName("Panel_2").getChildByName("ScrollView_2");
        this._msgScroll.addEventListener(this.onScroll, this);
        this._sliderBackMsg = this._ui.getChildByName("Panel_2").getChildByName("Panel_8");
        this._sliderMsg = this._ui.getChildByName("Panel_2").getChildByName("Panel_8").getChildByName("Slider_2");

        //测试层
        if(this._isTest){
            this._testLayer = new cc.Layer();
            this.addChild(this._testLayer);
            for(var i=0;i<4;i++){
                var touchArea= new ccui.Layout();
                touchArea.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                touchArea.setContentSize( cc.size(30,20) );
                touchArea.setBackGroundColor(cc.color(100,100,100,255));
                touchArea.index=i;
                touchArea.setTouchEnabled(true);
                touchArea.addTouchEventListener(this.onTestTouch,this);
                this._testLayer.addChild(touchArea);
                touchArea.setPosition(cc.p(35*i,40));
            }
        }

        var size = cc.director.getVisibleSize();
        this._ui.setContentSize(size);
        ccui.helper.doLayout(this._ui);
    },
    show:function( data )
    {
        cc.log(" 私聊模块打开  show------------"+data.id);
        if(data&&data.id){
            this._chatData.addPrivateChat(data.id);
            this._selectId=data.id;
            this.showHead();
        }else{
            cc.log("打开私聊模块缺少参数");
        }
    },

    //=============================事件
    //滚动框事件回调
    onScroll: function (node, type) {
        switch (type) {
            case ccui.ScrollView.EVENT_SCROLLING:
                cc.log((node.name=="ScrollView_1")+"onScroll%%%%%%%%%%"+node.name+"node");
                this.updateSlider(node.name=="ScrollView_1");
                break;
            case ccui.ScrollView.EVENT_SCROLL_TO_TOP:
                cc.log(node.name=="ScrollView_1"+"onTop%%%%%%%%%%"+node.name);
                this.refreshSlider(0,node.name=="ScrollView_1");
                break;
            case ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM:
                cc.log(node.name=="ScrollView_1"+"onBottom%%%%%%%%%%"+node.name);
                this.refreshSlider(100,node.name=="ScrollView_1");
                break;
            default :
                break;
        }
    },
    //更新slider
    updateSlider:function(isHead){
        var panelH = this._msgScroll.getContentSize().height;
        var textH = this._msgScroll.getInnerContainerSize().height ;
        var pos = this._msgScroll.getInnerContainer().getPosition();
        if(isHead){
            var  panelH=this._headScroll.getContentSize().height;
            var textH = this._headScroll.getInnerContainerSize().height ;
            var pos = this._headScroll.getInnerContainer().getPosition();
        }
        cc.log(textH+"updateSlider"+panelH+"isHead"+isHead);
        if( textH<= panelH )
        {
            if(isHead){
                this._sliderBack.setVisible( false );
                this._slider.setVisible(false);
            }else{
                this._sliderBackMsg.setVisible( false );
                this._sliderMsg.setVisible(false);
            }
            return;
        }
        else
        {
            if(isHead){
                this._sliderBack.setVisible( true );
                this._slider.setVisible(true);
            }else{
                this._sliderBackMsg.setVisible( true );
                this._sliderMsg.setVisible(true)
            }
        }
        var p=(textH-panelH+pos.y)/(textH-panelH);
        p=Math.floor(p*100);
        if(p<0) p=0;
        else if(p>100) p=100;
        cc.log(p+"<percent"+panelH+"panelH"+textH+"pos"+pos.x+"xy"+pos.y);
        this.refreshSlider(p,isHead);
        cc.log("滚动条更新");
    },

    //通讯事件 增加聊天信息
    netAddChat:function(type, netData){
        var netChat=new PrivateChatBeanNet(netData._data);
        cc.log(this._selectId+"selectid<  >netAddChat  roleid："+netChat._role_id);
        if(this._selectId!=netChat._role_id){
            this.showHead();
            return;
        }
        var item = this._ui.getChildByName("Panel_2").getChildByName("item").clone();
        if(netChat._isMe)item = this._ui.getChildByName("Panel_2").getChildByName("item_right").clone();//是否是自己 左右框不同
        item.setVisible(true);
        var chatNode=new PrivateChatTfNode();
        chatNode.initData(item,netChat);
        if(this._arrChatNode.length>0){
            chatNode.setPosition(cc.p(10,this._arrChatNode[this._arrChatNode.length-1].y-this._arrChatNode[this._arrChatNode.length-1]._node.height));
            if(chatNode.y<chatNode._node.height){
                chatNode.setPosition(cc.p(10,chatNode._node.height));//最新的置底
                for(var i=this._arrChatNode.length-1;i>-1;i--){
                    if(i==this._arrChatNode.length-1){
                        this._arrChatNode[i].setPosition(cc.p(10,chatNode.y+this._arrChatNode[i]._node.height));
                    }else{
                        this._arrChatNode[i].setPosition(cc.p(10,this._arrChatNode[i+1].y+this._arrChatNode[i]._node.height));
                    }
                }
            }
        }else{
            cc.log("_msgScroll.getContentSize().height>>>滚动高"+this._msgScroll.getContentSize().height);
            cc.log(chatNode.anchorX+"anchorxy"+chatNode.anchorY);
            cc.log(chatNode.x+"chatNodexy"+chatNode.y);
            chatNode.setPosition(cc.p(10,this._msgScroll.getContentSize().height));
            cc.log(chatNode.x+"chatNodexy"+chatNode.y);
        }
        this._arrChatNode.push(chatNode);
        this._msgScroll.addChild(chatNode);
        var newH=this._arrChatNode[0].y;
        var oldH=this._msgScroll.getContentSize().height;
        cc.log(oldH+"oldH"+newH);
        if(oldH>=newH){
            this._sliderBackMsg.setVisible(false);
            this._sliderMsg.setVisible(false);
        }else{
            this._sliderBackMsg.setVisible(true);
            this._sliderMsg.setVisible(true);
            this._msgScroll.setInnerContainerSize(cc.size(this._msgScroll.getContentSize().width, newH));
        }
        this._msgScroll.jumpToBottom();
    },
    //-------------------------------------------------方法
    //更新滚动位置
    refreshSlider:function(percent,isHead){
        cc.log("更新滚动位置"+isHead)
        if(isHead==false||isHead==undefined){
            this._sliderMsg.setPercent( percent );
        }
        else this._slider.setPercent( percent );
    },
    //聊天对象头像列表
    showHead:function(){
        cc.log("选中的标签："+this._chatData._arrNetChat);
        this.clearHeadInfo();
        for(var i in this._chatData._arrNetChat){
            //var netChat=this._chatData._arrNetChat[i];
            var str=i+"测试用测试用测试用测试用测试\n用测试用测试用测试用测测试用测试用测试用测测试用测试用测试用测测试用测试用测试测试用测试用测试用测";
            var item = this._ui.getChildByName("Panel_2").getChildByName("item_head").clone();
            item.setVisible(true);
            var chatNode=new PrivateChatHeadNode();
            cc.log(item+"########item");
            chatNode.initData(item,i,"name","headid");
            //头像从下到上排列
            if(this._arrHead.length==0){
                chatNode.setPosition(cc.p(10,chatNode._node.height));
            }else{
                chatNode.setPosition(cc.p(10,this._arrHead[0].y+chatNode._node.height));
                cc.log(i+"iii"+item.height+"height:"+chatNode._node.height+"yyyy::"+chatNode.y);
            }
            this._arrHead.unshift(chatNode);
            this._headScroll.addChild(chatNode);
        }
        var newH=0;
        if(this._arrHead[0]) newH=this._arrHead[0].y;
        var oldH=this._headScroll.getContentSize().height;
        cc.log("this.头像.length"+this._arrHead.length);
        if(oldH>=newH){//不满 置顶排列
            this._sliderBack.setVisible(false);
            this._slider.setVisible(false);
            if(this._arrHead.length>0){
                for(var i=0;i<this._arrHead.length;i++){
                    if(i==0){
                        this._arrHead[i].setPosition(cc.p(10,oldH));
                    }else{
                        this._arrHead[i].setPosition(cc.p(10,this._arrHead[i-1].y-this._arrHead[i-1]._node.height));
                    }
                }
            }
        }else{
            this._sliderBack.setVisible(true);
            this._slider.setVisible(true);
        }
        if(newH<oldH) newH=oldH;
        cc.log("newHnewHnewHnewHnewH头像@@@@@@@@@@@@@@"+newH);
        this._headScroll.setInnerContainerSize(cc.size(this._headScroll.getContentSize().width, newH));
        this._headScroll.jumpToBottom();
        this.updateSlider(true);
    },
    //不同私聊头像切换
    showChatSelect:function(id){
        cc.log("选中的标签："+id);
        this.clearChatInfo();
        for(var i=this._chatData._arrNetChat[id].length-1;i>-1;i--){
            var netChat=this._chatData._arrNetChat[id][i];
            var item = this._ui.getChildByName("Panel_2").getChildByName("item").clone();
            if(netChat._isMe)item = this._ui.getChildByName("Panel_2").getChildByName("item_right").clone();//是否是自己 左右框不同
            item.setVisible(true);
            var chatNode=new PrivateChatTfNode();
            chatNode.initData(item,netChat);
            if(i==this._chatData._arrNetChat[id].length-1){
                chatNode.setPosition(cc.p(10,chatNode._node.height));
            }else{
                chatNode.setPosition(cc.p(10,this._arrChatNode[0].y+chatNode._node.height));
                //cc.log(i+"iii"+item.height+"height:"+chatNode._node.height+"yyyy::"+chatNode.y);
            }
            this._arrChatNode.unshift(chatNode);
            this._msgScroll.addChild(chatNode);
        }
        var newH=0;
        if(this._arrChatNode[0]) newH=this._arrChatNode[0].y;
        var oldH=this._msgScroll.getContentSize().height;
        cc.log("this._arrChatNode.length"+this._arrChatNode.length)
        if(oldH>=newH){
            this._sliderBackMsg.setVisible(false);
            this._sliderMsg.setVisible(false);
            if(this._arrChatNode.length>0){
                for(var i=0;i<this._arrChatNode.length;i++){
                    if(i==0){
                        this._arrChatNode[i].setPosition(cc.p(10,oldH));
                    }else{
                        this._arrChatNode[i].setPosition(cc.p(10,this._arrChatNode[i-1].y-this._arrChatNode[i-1]._node.height));
                    }
                }
            }
        }else{
            this._sliderBackMsg.setVisible(true);
            this._sliderMsg.setVisible(true);
        }
        if(newH<oldH) newH=oldH;
        cc.log("newHnewHnewHnewHnewH@@@@@@@@@@@@@@"+newH);
        this._msgScroll.setInnerContainerSize(cc.size(this._msgScroll.getContentSize().width, newH));
        this._msgScroll.jumpToBottom();
        this.updateSlider(false);
    },
    //选中私聊头像
    selectHead:function(type,id){
        this._selectId=id;
        this.showChatSelect(id);
    },
    //移除私聊头像
    removeHead:function(type,id){
        cc.log("removeHead移除头像事件"+id);
        if(this._selectId==id) {
            this.clearChatInfo();
            this._selectId=null;
        }
        this._chatData.removeDataById(id);
        this.showHead();
    },
    //清除聊天头像列表
    clearHeadInfo:function(){
        if(this._arrHead){
            for(var i=0;i<this._arrHead.length;i++){
                this._arrHead[i].destroy();
                this._arrHead[i].removeFromParent();
                this._arrHead[i]=null;
            }
            this._arrHead=[];
        }
    },
    //清除聊天信息列表
    clearChatInfo:function(){
        if(this._arrChatNode){
            for(var i=0;i<this._arrChatNode.length;i++){
                this._arrChatNode[i].destroy();
                this._arrChatNode[i].removeFromParent();
                this._arrChatNode[i]=null;
            }
            this._arrChatNode=[];
        }
    },

    //清除方法
    destroy:function() {

    },
    //关闭
    onClose:function(node,type)
    {
        if( type == ccui.Widget.TOUCH_ENDED ){
            ModuleMgr.inst().closeModule("PrivateChatModule");
        }
    },
    //测试按钮
    onTestTouch:function(target,type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log(target.index+"onTestTouch测试按钮")
                switch (target.index){
                    case 0:
                        var ranType=Math.ceil(Math.random()*2);
                        ranType=0;
                        var ran2=Math.ceil(Math.random()*4);
                        cc.log(ranType+"ranType");
                        this._chatData.addNetChat([ranType,"1","1",ran2+"名字啊","试用测试用测试用测测试用测试用测试用测测试用测试用测试用测测试用测试用测试测试",123214124124])

                        break;
                    case 1:
                        var ranType=Math.ceil(Math.random()*4);
                        ranType=1;
                        var ran2=Math.ceil(Math.random()*4);
                        cc.log(ranType+"ranType");
                        this._chatData.addNetChat([ranType,"1","1",ran2+"名字啊","试用测用测试用测试测试",123214124124])
                        break;
                    case 2:
                        var ranType=Math.ceil(Math.random()*4);
                        ranType=1;
                        var ran2=Math.ceil(Math.random()*4);
                        cc.log(ranType+"ranType");
                        this._chatData.addNetChat([ranType,"2","1",ran2+"名字啊","试用测试用测试用测测试用测试用测试用测测试用测试用测试用测测试用测试用测试测试",123214124124])

                        break;
                    case 3:
                        break;
                }
                break;
        }
    },
    //=====================================事件

})