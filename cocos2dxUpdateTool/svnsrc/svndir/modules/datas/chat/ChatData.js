/**
 * Created by Administrator on 2015/11/18/0018.
 */

//模块间事件
ChatEvent = {};
ChatEvent.ADD_CHAT = "add_chat";//收到后抛出增加聊天信息事件

//通讯部分
ChatNetEvent = {};
ChatNetEvent.ERROR=0;//错误信息
ChatNetEvent.SEND_CHAT=600;//发送聊天
ChatNetEvent.GET_CHAT=699;//收到聊天信息


var ChatData = DataBase.extend({

    _arrNetChat:null,//聊天数据

    ctor:function()
    {

    },
    //初始化
    init:function()
    {

        NetMgr.inst().addEventListener(ChatNetEvent.ERROR, this.netGetError, this);
        NetMgr.inst().addEventListener(ChatNetEvent.GET_CHAT, this.netGetChat, this);
        if(this._arrNetChat==null) {
            this._arrNetChat={};
            this._arrNetChat[ChatData.CHATTYPE_WORLD]=[];
            this._arrNetChat[ChatData.CHATTYPE_SYSTEM]=[];
            this._arrNetChat[ChatData.CHATTYPE_TRADE]=[];
            this._arrNetChat[ChatData.CHATTYPE_UNION]=[];
        }
    },

    //===================================通讯部分=========================
    //错误信息
    netGetError:function(cmd, data){
        if (ChatNetEvent.ERROR == cmd) {
            data.resetCMDData();
            var data0=data.readUint();
            var data1=data.readInt();
            var data2=data.readString();
            if(data1!=0&&data0!=0){
                cc.log("收到错误信息  对应协议号"+data0+"@@@错误信息@@@"+ResMgr.inst().getString(String(data1))+"@@@处理id@@@"+data2);
                ModuleMgr.inst().openModule("AlertString",{str:ResMgr.inst().getString(String(data1)),color:null,time:null,pos:null});
            }
            if(data0!=0&&data1==0){
                cc.log("请求成功 返回消息 协议号"+data0);
                EventMgr.inst().dispatchEvent( CastleEvent.NET_COMPLETE,data0);
            }
        }
    },
    //获取聊天信息
    netGetChat:function(cmd,data){
        if (ChatNetEvent.GET_CHAT == cmd) {
            data.resetCMDData();
            var arrData=[data.readString(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint()];
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
        this._arrNetChat[chatNet._type].push(chatNet);
        EventMgr.inst().dispatchEvent( ChatEvent.ADD_CHAT,chatNet);
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