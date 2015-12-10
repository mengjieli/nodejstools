/**
 * Created by Administrator on 2015/11/27/0027.
 */

//模块间事件
PirvateChatEvent = {};
PirvateChatEvent.ADD_CHAT = "private_add_chat";//收到后抛出增加聊天信息事件
PirvateChatEvent.REMOVE_HEAD = "private_remove_head";//抛出移除私聊头像事件
PirvateChatEvent.SELECT_HEAD = "private_select_head";//抛出点击私聊头像事件
//通讯部分
PrivateChatNetEvent = {};
PrivateChatNetEvent.SEND_CHAT=610;//发送聊天
PrivateChatNetEvent.GET_CHAT=619;//收到聊天信息

var PrivateChatData = DataBase.extend({

    _arrNetChat:null,//聊天数据

    ctor:function()
    {

    },
    //初始化
    init:function()
    {
        NetMgr.inst().addEventListener(PrivateChatNetEvent.GET_CHAT, this.netGetChat, this);

        if(this._arrNetChat==null) {
            this._arrNetChat={};
        }
    },
    //===================================通讯部分=========================
    //收到私聊信息
    netGetChat:function(cmd,data){
        if (PrivateChatNetEvent.GET_CHAT == cmd) {
            data.resetCMDData();
            var arrData=[data.readString(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint(),data.readUint()];
            //cc.log(arrData[1]+"####arrData[1]@@@@@"+arrData[2]+"dispatchEvent( CastleEvent.UPDATE_BUILDIN"+arrData[3]);
            this.addNetChat(arrData);
            //EventMgr.inst().dispatchEvent( CastleEvent.UPDATE_TECH,arrData);
        }
    },
    //==================================================通讯部分方法
    //增加私聊信息方法
    addNetChat:function(arr){
        var chatNet=new PrivateChatBeanNet(arr);
        cc.log(chatNet._role_id+"id  chatNet._isMe:"+chatNet._isMe)
        //私聊角色id作为下标
        if(!this._arrNetChat[chatNet._role_id]) this._arrNetChat[chatNet._role_id]=[];
        this._arrNetChat[chatNet._role_id].push(chatNet);
        EventMgr.inst().dispatchEvent( PirvateChatEvent.ADD_CHAT,chatNet);
    },
    //===============================================方法
    //点击他人头像私聊处理
    addPrivateChat:function(id){
        if(!this._arrNetChat[id]) this._arrNetChat[id]=[];
    },
    //移除私聊
    removeDataById:function(id){
        if(this._arrNetChat[id]!=undefined) delete this._arrNetChat[id];
    },
    //清除
    destroy:function()
    {
        //NetMgr.inst().removeEventListener( MapCmd.SERVER_LIST, this.nsGetServerList, this );
    },

})