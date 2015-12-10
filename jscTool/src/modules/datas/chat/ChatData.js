/**
 * Created by Administrator on 2015/11/18/0018.
 */

//模块间事件
ChatEvent = {};
ChatEvent.ADD_CHAT = "chat_add_chat";//收到聊天相信消息后抛出增加聊天信息事件
ChatEvent.TIP_CHAT = "chat_tip_chat";//提示有消息抛出事件

//通讯部分
ChatNetEvent = {};
ChatNetEvent.ERROR=0;//错误信息
ChatNetEvent.SEND_CHAT=800;//发送聊天
ChatNetEvent.SEND_CHAT_INFO=801;//发送获取聊天详细内容根据id
ChatNetEvent.GET_CHAT=899;//收到聊天基础信息
ChatNetEvent.GET_CHAT_INFO=898;//收到聊天详细信息


var ChatData = DataBase.extend({

    _arrNetChat:null,//聊天数据
    _isShow:null,//聊天窗体显示
    _arrChatId:null,//聊天id数组
    _languageId:null,//语言id

    ctor:function()
    {

    },
    //初始化
    init:function()
    {
        this._arrChatId=[];
        this._languageId=0;
        //this._isShow=true;

        NetMgr.inst().addEventListener(ChatNetEvent.ERROR, this.netGetError, this);
        NetMgr.inst().addEventListener(ChatNetEvent.GET_CHAT, this.netGetChat, this);
        NetMgr.inst().addEventListener(ChatNetEvent.GET_CHAT_INFO, this.netGetChatInfo, this);
        if(this._arrNetChat==null) {
            this._arrNetChat={};
            this._arrNetChat[ChatData.CHATTYPE_WORLD]=[];
            this._arrNetChat[ChatData.CHATTYPE_SYSTEM]=[];
            this._arrNetChat[ChatData.CHATTYPE_TRADE]=[];
            this._arrNetChat[ChatData.CHATTYPE_UNION]=[];
        }
    },

    //===================================通讯部分=========================
    //发送聊天信息
    netSendChat:function(id,channel,arr){
        var msg = new SocketBytes();
        msg.writeUint(ChatNetEvent.SEND_CHAT);
        msg.writeUint(channel);
        msg.writeUint(0);
        msg.writeUint(this._languageId);
        msg.writeUint(arr.length);
        for(var i=0;i<arr.length;i++){
            msg.writeUint(arr[i][0]);
            msg.writeString(arr[i][1]);
        }
        NetMgr.inst().send(msg);
    },
    //发送请求详细聊天信息
    netSendChatInfo:function(id){
        cc.log("发送请求详细信息"+id);
        var msg = new SocketBytes();
        msg.writeUint(ChatNetEvent.SEND_CHAT_INFO);
        msg.writeUint(this._languageId);
        if(id==undefined){
            if(this._arrChatId&&this._arrChatId.length>0){
                msg.writeUint(this._arrChatId.length);
                for(var i=0;i<this._arrChatId.length;i++){
                    msg.writeString(this._arrChatId[i]);
                }
            }
            else {
                cc.log("没有需要请求的聊天id列表");
                return;
            }
        }else{
            msg.writeUint(1);
            msg.writeString(id);
        }
        NetMgr.inst().send(msg);
    },
    //错误信息
    netGetError:function(cmd, data){
        if (ChatNetEvent.ERROR == cmd) {
            data.resetCMDData();
            var data0=data.readUint();
            var data1=data.readInt();
            var data2=data.readString();
            if(data1!=0&&data0!=0){
                cc.log("收到错误信息  对应协议号"+data0+"@@@错误信息@@@"+ResMgr.inst().getString(String(data1))+"@@@处理id@@@"+data2);
                //ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString(String(data1)),color:null,time:null,pos:null});
            }
            if(data0!=0&&data1==0){
                cc.log("请求成功 返回消息 协议号"+data0);
                //EventMgr.inst().dispatchEvent( CastleEvent.NET_COMPLETE,data0);
            }
        }
    },
    //获取聊天信息
    netGetChat:function(cmd,data){
        if (ChatNetEvent.GET_CHAT == cmd) {
            data.resetCMDData();//id 频道 类型 语言 时间
            var arrData=[data.readString(),data.readUint(),data.readUint(),data.readUint(),data.readUint()];
            //cc.log(arrData[1]+"####arrData[1]@@@@@"+arrData[2]+"dispatchEvent( CastleEvent.UPDATE_BUILDIN"+arrData[3]);
            cc.log("收到基础聊天信息"+arrData[0]);
            this.addChatId(arrData[0]);
            //EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_TECH,arrData);
        }
    },
    //获取聊天详细信息
    netGetChatInfo:function(cmd,data){
        cc.log("收到聊天详细信息");
        if (ChatNetEvent.GET_CHAT_INFO == cmd) {
            data.resetCMDData();

            var id=data.readString();
            var channel=data.readUint();
            var type=data.readUint();
            var languageId=data.readUint();
            var time=data.readUint();
            var roleId=data.readString();
            var len = data.readUint();
            var message=[];
            for (var i = 0; i < len; i++) {
                var slot = data.readUint();
                var value = data.readString();
                message.push([slot,value]);
                //if(i==0)  message=value;
                //else message+=value;
            }
            //var arrData=[data.readString(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint()];
            var arrData=[id,channel,type,languageId,time,roleId,message,slot];
            //cc.log(arrData[1]+"####arrData[1]@@@@@"+arrData[2]+"dispatchEvent( CastleEvent.UPDATE_BUILDIN"+arrData[3]);
            this.addNetChat(arrData);
            //EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_TECH,arrData);
        }
    },
    //==================================================通讯部分方法
    //增加聊天信息方法
    addNetChat:function(arr){
        var chatNet=new ChatBeanNet(arr);
        cc.log("chatNet._type:"+chatNet._type)
        //chatNet._type
        if(this._arrNetChat[chatNet._channel].length>ChatData.CHAT_SAVE_NUMBER) this._arrNetChat[chatNet._channel].shift();//超过限定数量删除首位
        this._arrNetChat[chatNet._channel].push(chatNet);
        EventMgr.inst().dispatchEvent( ChatEvent.ADD_CHAT,chatNet);
    },
    //增加聊天id基础信息
    addChatId:function(id){
        cc.log("发送基础信息id"+id);
        if(this._isShow){
            this.netSendChatInfo(id);
            this._arrChatId=[];
        }
        else {
            this._arrChatId.push(id);
            EventMgr.inst().dispatchEvent( ChatEvent.TIP_CHAT);
        }
    },
    //清除
    destroy:function()
    {
        //NetMgr.inst().removeEventListener( MapCmd.SERVER_LIST, this.nsGetServerList, this );
    },

})

//静态属性
ChatData.CHATTYPE_WORLD=1;//世界
ChatData.CHATTYPE_SYSTEM=2;//系统公告
ChatData.CHATTYPE_TRADE=3;//交易
ChatData.CHATTYPE_UNION=4;//联盟

ChatData.CHAT_SAVE_NUMBER=50;//聊天信息暂时保留50条