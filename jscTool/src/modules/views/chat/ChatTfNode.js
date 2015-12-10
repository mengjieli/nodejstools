/**
 * Created by Administrator on 2015/11/19/0019.
 */
var ChatTfNode = ccui.Widget.extend({

    _imgHead:null,//头像
    _imgHeadBox:null,//头像框
    _tfName:null,//名字
    _tfTime:null,//时间
    _tfWords:null,//说话文本

    _node:null,//聊天行组件
    _playerInfo:null,//玩家信息

    _lineNum:null,//行数
    _cnW:null,//中文字宽
    _enW:null,//英文字宽
    _cnH:null,//中文字高
    ctor : function() {
        this._super();
        this.setAnchorPoint(cc.p(0,0));
    },
    initData:function(node,data){
        var netChat=new ChatBeanNet(data._data);
        //cc.log(netChat._role_id+"role_id");
        //cc.log(mainData.otherPlayerDataList.length+"length");
        if(mainData.playerData.account==netChat._role_id) this._playerInfo=mainData.playerData;
        else this._playerInfo=mainData.otherPlayerDataList.getItem("account",netChat._role_id);//根据id取玩家数据
        cc.log(this._playerInfo.nick+"nick>headid"+this._playerInfo.headid);
        this._node=node;
        this._node.x=this._node.y=0;
        this.addChild(this._node);

        this._tfWords=this._node.getChildByName("words");
        //this._tfWords.setTextColor(cc.color.RED);
        //this._tfWords.setTextColor(cc.color(253,228,180));
        this._lineNum=1;//默认1行

        this._imgHeadBox=this._node.getChildByName("head_0");
        this._tfName=this._node.getChildByName("name");
        //this._tfName.setString(netChat._name);
        this._tfName.setString(this._playerInfo.nick);
        this._tfTime=this._node.getChildByName("time");
        this._tfTime.setString(StringUtils.getChatTime(netChat._time));
        this._imgHeadBox=this._node.getChildByName("head_0");
        this._imgHead=this._node.getChildByName("head");
        this._imgHead.addTouchEventListener(this.onHeadTouch,this);

        //var url=ResMgr.inst().getCSV("head",1).head_id;
        this._imgHead.loadTexture(ResMgr.inst().getIcoPath(this._playerInfo.headid==""?ResMgr.inst().getCSV("head",1).head_id:this._playerInfo.headid));
        //this._imgHead.scale=0.9;
        this.showString(netChat._message[0][1]);//暂时只处理文本
        //cc.log(this._node.height+"height"+this._tfWords.height);
    },


    showString:function(str){
        var en= cc.LabelTTF.create( "A","微软雅黑" ,ChatModule.WORDS_SIZE ).getContentSize();//ChatModule.WORDS_SIZE
        var cn = cc.LabelTTF.create( "中","微软雅黑" ,ChatModule.WORDS_SIZE ).getContentSize();//ChatModule.WORDS_SIZE
        cc.log("字符宽高"+cn.width+cn.height+"英文"+en.width+en.height);
        this._cnW=cn.width;
        this._cnH=cn.height;
        this._enW=en.width;
        this.setWordsHeight(str);
        this._tfWords.setString(str);
    },

    setWordsHeight:function(str){
        var index=str.indexOf("\n");
        cc.log(index+"index"+str.length);
        if(index>0){
            var newStr=str.slice(index);
            cc.log(newStr+"newStr");
            this._lineNum+=1;
            this.setWordsHeight(newStr);
            return;
        }
        var strW=0;//字符宽
        for( var i=0; i<str.length; i++ ) {
            var enAscii = str.charCodeAt(i);
            var oneW=null;
            if( enAscii >= 32 && enAscii <= 126 )
            {
                oneW= this._enW;
            }
            else{
                oneW= this._cnW;
            }
            strW+=oneW;
            //cc.log(strW+"字符宽"+oneW);
            if(strW>=this._tfWords.width){
                this._lineNum+=1;
                strW=(strW>this._tfWords.width)?oneW:0;
            }
        }
        //cc.log(this._lineNum+"行数"+this._tfWords.getContentSize().height+50);
        if(this._lineNum>2){
            var offy=(this._lineNum-2)*this._cnH;
            //cc.log("xy",this._tfWords.y);
            this._tfWords.setContentSize(cc.size(this._tfWords.width,this._tfWords.height+offy));
            this._node.setContentSize(cc.size(this._node.width,this._tfWords.getContentSize().height+50));
            this._tfWords.y+=offy;
            this._tfName.y+=offy;
            this._tfTime.y+=offy;
            this._imgHead.y+=offy;
            this._imgHeadBox.y+=offy;
        }
    },
    //=============================事件
    onHeadTouch:function(target,type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log("点击头像@@@@@@@@");
                //if(this._playerInfo.account==mainData.playerData.account) return;
                ModuleMgr.inst().openModule("PlayerInfoModule",{id:this._playerInfo.account});
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