/**
 * Created by Administrator on 2015/11/18/0018.
 */
var ChatModule = ModuleBase.extend({
    _ui: null,
    _tabs: null,             //TAB列表
    _selectTab: null,        //当前现在的Tab
    _tfContainer: null,      //图文混排容器
    _isInterval:null,       //是否间隔中

    _tfInput:null,          //输入文本
    _btClose:null,          //关闭聊天框
    _btSound:null,          //语音按钮
    _btWords:null,          //发送文本按钮

    _msgScroll: null,      //滚动条
    _sliderBack:null,       //滚动条背景
    _slider:null,           //滚动条

    _arrChatNode:null,//聊天列表数组
    _chatData:null,//聊天数据

    _isTest:false,//测试用true
    _testLayer:null,//测试按钮层

    ctor: function ()
    {
        this._super();
    },
    initUI: function ()
    {
        EventMgr.inst().addEventListener(ChatEvent.ADD_CHAT, this.netAddChat, this);
        EventMgr.inst().addEventListener(ChatEvent.TIP_CHAT, this.netTipChat, this);

        this._chatData = ModuleMgr.inst().getData("ChatModule");
        this._isInterval=false;

        this._arrChatNode=[];
        this._ui = ccs.load("res/images/ui/chatModule/Layer.json","res/images/ui/").node;
        this.addChild( this._ui );
        this._ui.getChildByName("item").setVisible(false);

        this._btClose=this._ui.getChildByName("Panel_2").getChildByName("Button_close");
        this._btClose.addTouchEventListener(this.onHide,this);
        this._ui.x=- this._btClose.x;
        this._btSound=this._ui.getChildByName("Button_sound");
        this._btSound.addTouchEventListener(this.onSound,this);
        this._btWords=this._ui.getChildByName("Button_words");
        this._btWords.setTitleText( ResMgr.inst().getString("chat_5"));
        this._btWords.addTouchEventListener(this.onWords,this);

        this._tfInput=this._ui.getChildByName("Panel_2").getChildByName("Panel_5").getChildByName("TextField_input");
        this._tfInput.addEventListener(this.onTfInput,this);
        this._msgScroll = this._ui.getChildByName("Panel_2").getChildByName("Panel_5").getChildByName("ScrollView_1");
        this._msgScroll.addEventListener( this.onScroll, this );

        this._sliderBack = this._ui.getChildByName("Panel_2").getChildByName("Panel_5").getChildByName("Panel_7");
        this._slider = this._ui.getChildByName("Panel_2").getChildByName("Panel_5").getChildByName("Panel_7").getChildByName("Slider_2");
        //cc.log(this._msgScroll.getContentSize().width+"w h"+this._msgScroll.getContentSize().height);
        //cc.log(this._sliderBack.getContentSize().width+"w h"+this._sliderBack.getContentSize().height);
        //cc.log(this._slider.getContentSize().width+"w h"+this._slider.getContentSize().height);

        //tab
        this._tabs = [];
        var panel = this._ui.getChildByName("Panel_2").getChildByName("Panel_3");
        for( var i=0; i<4; i++ )
        {
            var ui = panel.getChildByName( "Image_"+i );
            //ui.setVisible( true );
            ui.setTouchEnabled(true);
            ui.ignoreContentAdaptWithSize( true );
            var uiText = ui.getChildByName("Text");
            uiText.ignoreContentAdaptWithSize( true );
            uiText.setString( ResMgr.inst().getString("chat_"+(1+i)));
            ui.index = i;
            ui.addTouchEventListener( this.tabItemCall,this );
            this._tabs.push(ui);
        }
        var xt = this._ui.getChildByName("Panel_2").getChildByName("Panel_3").getChildByName("xiaotiao");
        xt.setLocalZOrder(20);

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

        //mainData.otherPlayerDataList.getItem("account",uid) 获取玩家信息  account

        var size = cc.director.getVisibleSize();
        this._ui.setContentSize(size);
        ccui.helper.doLayout(this._ui);

    },

    show:function( data )
    {
        cc.log(" 聊天模块打开  show------------");
        this._chatData._isShow=false;
        this.setSelectTab( 0 );

    },

    //====================================事件====================
    //切换标签
    tabItemCall:function( node, type )
    {
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            this.setSelectTab( node.index );
        }
    },
    //聊天窗体缩回弹出
    onHide:function(node,type){
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            cc.log("close");
            //this._ui.removeAllActions();
            var dt=0.3;
            if(this._chatData._isShow){
                var action1 = cc.moveTo(dt, cc.p(-node.x, this._ui.y));
            }
            else{
                var action1 = cc.moveTo(dt, cc.p(0, this._ui.y));
                this._btClose.setTitleText("");
                this._chatData.netSendChatInfo();
            }
            this._ui.runAction(action1);
            this._chatData._isShow=!this._chatData._isShow;

        }
    },
    //语音发送按钮事件
    onSound:function(node,type){
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            cc.log("发送sound");
        }
    },
    //文本发送按钮事件
    _intervalTime:null,
    onWords:function(node,type){
        if( type == ccui.Widget.TOUCH_ENDED )
        {
            //cc.log(this._isInterval+"######this._isInterval")
            if((this._selectTab.index+1)!=ChatData.CHATTYPE_WORLD) return;//暂时屏蔽世界以外的聊天发送
            if(this._tfInput.getString()==""){
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("请输入文字"),color:null,time:null,pos:null});
                return;
            }
            if(StringUtils.getStringLength(this._tfInput.getString())>ChatModule.WORDS_MAX){
                //cc.log("字符太多");
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("文本过长"),color:null,time:null,pos:null});
                return;
            }
            //if(this._isInterval){
            //    cc.log("间隔中5秒"+this._isInterval);
            //    ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString("71802"),color:null,time:null,pos:null});
            //    clearTimeout(this._intervalTime);
            //    this._isInterval=true;
            //    this._intervalTime = setTimeout(function () {
            //        this._isInterval=false;
            //        cc.log(this._isInterval+"this._isInterval归零");
            //        clearTimeout(this._intervalTime);
            //    }, ChatModule.WORDS_INTERVAL*1000,this);
            //    return;
            //}
            this._chatData.netSendChat(SelfData.getInstance.accountId,this._selectTab.index+1,[[1,this._tfInput.getString()]]);
            //this._isInterval=true;
            //this._intervalTime = setTimeout(function () {
            //    this._isInterval=false;
            //    cc.log(this._isInterval+"this._isInterval归fs");
            //    clearTimeout(this._intervalTime);
            //}, ChatModule.WORDS_INTERVAL*1000,this);

            this._tfInput.setString("");
        }
    },
    //间隔函数
    doInterval:function(){
        cc.log("clearInterval@@@@@@@@@"+this._isInterval);
        this._intervalTime.clearInterval()
    },
    //文本响应事件
    onTfInput:function(node,type){
        if( type == ccui.TextField.EVENT_ATTACH_WITH_IME )
        {
            cc.log("焦点定位到文本 可输入文本");
        }
        else if(type==ccui.TextField.EVENT_DETACH_WITH_IME){
            cc.log("焦点delete@@@@@@@@@@@@@@@@@@@@@%%%%%%%%%%%%%%");
        }
    },
    //滚动框事件回调
    onScroll: function (node, type) {
        switch (type) {
            case ccui.ScrollView.EVENT_SCROLLING:
                //cc.log("onScroll%%%%%%%%%%");
                this.updateSlider();
                break;
            case ccui.ScrollView.EVENT_SCROLL_TO_TOP:
                //cc.log("onTop%%%%%%%%%%");
                this.refreshSlider(0);
                break;
            case ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM:
                this.refreshSlider(100);
                break;
            default :
                break;
        }
    },
    //更新slider
    updateSlider:function(){
        var panelH = this._msgScroll.getContentSize().height;
        var textH = this._msgScroll.getInnerContainerSize().height ;
        var pos = this._msgScroll.getInnerContainer().getPosition();
        //cc.log(textH+"updateSlider"+panelH);
        if( textH<= panelH )
        {
            this._sliderBack.setVisible( false );
            this._slider.setVisible(false);
            return;
        }
        else
        {
            this._sliderBack.setVisible( true );
            this._slider.setVisible(true);
        }
        var p=(textH-panelH+pos.y)/(textH-panelH);
        //var p=(-pos.y)/(textH-panelH);
        p=Math.floor(p*100);
        if(p<0) p=0;
        else if(p>100) p=100;
        //cc.log(p+"<percent"+panelH+"panelH"+textH+"pos"+pos.x+"xy"+pos.y);
        this.refreshSlider(p);
        //cc.log("滚动条更新")
    },
    //通讯事件 增加聊天信息
    netAddChat:function(type, netData){
        var netChat=new ChatBeanNet(netData._data);
        //cc.log(this._selectTab.index+"netAddChat  类型："+netChat._channel);
        if((this._selectTab.index+1)!=netChat._channel){
            return;
        }
        var item = this._ui.getChildByName("item").clone();
        item.setVisible(true);
        var chatNode=new ChatTfNode();
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
            chatNode.setPosition(cc.p(10,this._msgScroll.getContentSize().height));
        }
        this._arrChatNode.push(chatNode);
        this._msgScroll.addChild(chatNode);
        var newH=this._arrChatNode[0].y;//+this._arrChatNode[this._arrChatNode.length-1]._node.height//this._arrChatNode[this._arrChatNode.length-1].y
        var oldH=this._msgScroll.getContentSize().height;
        if(oldH>=newH){
            this._sliderBack.setVisible(false);
            this._slider.setVisible(false);
        }else{
            this._sliderBack.setVisible(true);
            this._slider.setVisible(true);
            this._msgScroll.setInnerContainerSize(cc.size(this._msgScroll.getContentSize().width, newH));
        }
        this._msgScroll.jumpToBottom();
    },
    netTipChat:function(type){
        //cc.log("提示有新聊天信息");
        if(!this._chatData._isShow) this._btClose.setTitleText("..");
    },
    //-------------------------------------------------方法
    //更新滚动位置
    refreshSlider:function(percent){
        this._slider.setPercent( percent );
    },
    //设置Tab
    setSelectTab:function( index )
    {
        if( this._selectTab && this._selectTab.index == index ) return;

        if( this._selectTab != null )
        {
            this._selectTab.ignoreContentAdaptWithSize( true );
            this._selectTab.loadTexture("gy_yeqian_xuanze.png", ccui.Widget.PLIST_TEXTURE);
            ccui.helper.doLayout( this._selectTab );
            this._selectTab = null;
        }

        var len = this._tabs.length;

        for( var i=0; i<len; i++ )
        {
            var tab = this._tabs[i];
            if( tab.isVisible() == false ) continue;
            var txt = tab.getChildByName("Text");
            if( i == index )
            {
                tab.ignoreContentAdaptWithSize( true );
                tab.loadTexture("gy_yeqian_anxia.png", ccui.Widget.PLIST_TEXTURE);
                tab.setLocalZOrder(10);
                this._selectTab = tab;
                ccui.helper.doLayout( this._selectTab );
            }
            else
            {
                tab.setLocalZOrder( len - i );
            }

            txt.setTextColor( i == index ? cc.color(255,255,255) : cc.color( 134,134,134) );
        }
        this.showChatSelect(index+1);//类型
    },
    //不同频道切换
    showChatSelect:function(type){
        //cc.log("选中的标签："+type);
        this.clearChatInfo();
        for(var i=this._chatData._arrNetChat[type].length-1;i>-1;i--){
            var netChat=this._chatData._arrNetChat[type][i];
            var item = this._ui.getChildByName("item").clone();
            item.setVisible(true);
            var chatNode=new ChatTfNode();
            chatNode.initData(item,netChat);
            if(i==this._chatData._arrNetChat[type].length-1){
                chatNode.setPosition(cc.p(10,chatNode._node.height));
            }else{
                chatNode.setPosition(cc.p(10,this._arrChatNode[0].y+chatNode._node.height));
                //chatNode.setPosition(cc.p(10,this._arrChatNode[i+1].y+this._arrChatNode[i-1]._node.height));
                cc.log(i+"iii"+item.height+"height:"+chatNode._node.height+"yyyy::"+chatNode.y);
            }
            this._arrChatNode.unshift(chatNode);
            this._msgScroll.addChild(chatNode);
            //newH+=chatNode._node.height;
            //cc.log(chatNode.y+"getContentSize"+this._msgScroll.getContentSize().height +newH);

        }
        var newH=0;
        if(this._arrChatNode[0]) newH=this._arrChatNode[0].y;

        var oldH=this._msgScroll.getContentSize().height;
        //cc.log("this._arrChatNode.length"+this._arrChatNode.length)
        if(oldH>=newH){
            this._sliderBack.setVisible(false);
            this._slider.setVisible(false);
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
            this._sliderBack.setVisible(true);
            this._slider.setVisible(true);
        }
        if(newH<oldH) newH=oldH;
        cc.log("newHnewHnewHnewHnewH@@@@@@@@@@@@@@"+newH);
        this._msgScroll.setInnerContainerSize(cc.size(this._msgScroll.getContentSize().width, newH));
        this._msgScroll.jumpToBottom();

        this.updateSlider();
    },
    //清除聊天列表
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
    //测试按钮 测试用
    onTestTouch:function(target,type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log(target.index+"onTestTouch测试按钮")
                switch (target.index){
                    case 0:
                        var ranType=Math.ceil(Math.random()*4);
                        var ran2=Math.ceil(Math.random()*4);
                        cc.log(ranType+"ranType");
                        this._chatData.addNetChat([ranType,"123","1",ran2+"名字啊","试用测试用测试用测测试用测试用测试用测测试用测试用测试用测测试用测试用测试测试",123214124124])
                        break;
                    case 1:
                        var arrStr=["123","试用测试用测","名字啊名字啊名字啊名字啊名字啊名字啊名字啊","试用测试用测试用测测试用测试用用测试用测试用测试用测测试用测试用测试用测测试用测试用测试用测测试用测试用测试用测试用测试用测测试用测试用测测",
                            "字啊名字啊名字啊名字啊名字啊名字啊试用测试用测试用测测试用测试用用测试用测试用测试用测测试用测试用测试用测测试用测试用测试用测测试用测试用测试用测试用测试用测测试用测试用测测字啊名字啊名字啊名字啊名字啊名字啊"];
                        var ranArr=Math.ceil(Math.random()*4);
                        this._chatData.netSendChat(SelfData.getInstance.accountId,this._selectTab.index+1,[[1,arrStr[ranArr]]]);

                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                }
                break;
        }
    },
})
//静态属性
ChatModule.NODE_GAP=5;//聊天块距
ChatModule.WORDS_SIZE=20;//聊天字号
ChatModule.WORDS_MAX=60;//聊天字数上线
ChatModule.WORDS_INTERVAL=5;//聊天间隔时间