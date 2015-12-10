/**
 * Created by Administrator on 2015/11/9.
 */

MailEvent                       = {};
MailEvent.SEND_NEW_MAIL         = "send_mail_new_mail";
MailEvent.SEND_ADD_MAIL         = "send_mail_add_mail";
MailEvent.SEND_DELETE_MAIL      = "send_mail_delete_mail";
MailEvent.SEND_READE_MAIL       = "send_mail_reade_mail";
MailEvent.SEND_RECEIVE_MAIL     = "send_mail_receive_mail";
MailEvent.SEND_UPDATE_MAIL      = "send_mail_update_mail";

MailCMD                 = {};
MailCMD.NC_MAIL_LOAD    = 600;
MailCMD.NC_MAIL_INFO    = 601;
MailCMD.NC_MAIL_WRITE   = 602;
MailCMD.NC_MAIL_READE   = 603;
MailCMD.NC_MAIL_RECEIVE = 604;
MailCMD.NC_MAIL_DELETE  = 605;
MailCMD.NS_MAIL_LOAD    = 699;
MailCMD.NS_MAIL_INFO    = 698;
MailCMD.NS_MAIL_NEW     = 697;
MailSTATE               = {};
MailSTATE.system        = 0x01;
MailSTATE.reade         = 0x10;
MailSTATE.receive       = 0x20;

var TagMailItemInfo = function()
{
    this.id = null;
    this.callFun = function( type )
    {
        var info = mainData.emailData.getItem( "id", this.id );
        if( info == null || info.isLoadInfo == false ) return;
        var moduleData = ModuleMgr.inst().getData("MailModule");
        if( type == "isLoadInfo" )
        {
            moduleData.updateMailData( this.id );
            addFun( this.id );
        }
        else if( type == "isRead")
        {
            moduleData.updateMailData( this.id );
            updateFun( this.id );
        }
        else if( type == "isReceive" )
        {
            moduleData.updateMailData( this.id );
            receiveFun( this.id );
        }
        else if( type == "surplusTime" && info.surplusTime <= 0 )
        {
            moduleData.deleteMailData( this.id );
            deleteFun( this.id );
        }
    }

    var addFun = function( id )
    {
        EventMgr.inst().dispatchEvent( MailEvent.SEND_ADD_MAIL, id );
    }

    var deleteFun = function( id )
    {
        EventMgr.inst().dispatchEvent( MailEvent.SEND_DELETE_MAIL, id );
    }

    var receiveFun = function( id )
    {
        EventMgr.inst().dispatchEvent( MailEvent.SEND_RECEIVE_MAIL, id );
    }

    var updateFun = function( id )
    {
        EventMgr.inst().dispatchEvent( MailEvent.SEND_UPDATE_MAIL, id );
    }

}

var MailData = DataBase.extend( {

    _mailDates: null,
    _isLoad: false,

    _newsCache: null,
    ctor: function()
    {
        this._super();
    },

    init: function()
    {
        //NetMgr.inst().addEventListener( MailCMD.NS_MAIL_LOAD, this.nsLoad, this );
        //NetMgr.inst().addEventListener( MailCMD.NS_MAIL_INFO, this.nsInfo, this );
        //NetMgr.inst().addEventListener( MailCMD.NS_MAIL_NEW, this.nsNew, this );

        this._mailDates = {};
        this._newsCache = {};
        mainData.emailData.addListener( GameSDK.Event.PROPERTY_CHANGE, this.dataCall, this );
        this.ncLoad();
    },

    destroy: function()
    {
        //NetMgr.inst().removeEventListener( MailCMD.NS_MAIL_LOAD, this.nsLoad, this );
        //NetMgr.inst().removeEventListener( MailCMD.NS_MAIL_INFO, this.nsInfo, this );
        //NetMgr.inst().removeEventListener( MailCMD.NS_MAIL_NEW, this.nsNew, this );
        mainData.emailData.removeListener( GameSDK.Event.PROPERTY_CHANGE, this.dataCall, this );

    },

    dataCall: function(type)
    {
        if( type != "length" ) return;
        var len  = mainData.emailData._length;
        for( var i = 0; i<len; i++ )
        {
            var dataItem = mainData.emailData.getItemAt( i );
            if( dataItem ) this.addMailData( dataItem.id );
        }
    },

    addMailData:function( id )
    {
        var mail = this._mailDates[id];
        if( mail == null )
        {
            var obj = {};
            obj.id = id;
            this._mailDates[id] = obj;
            this.updateMailData( id );
        }
    },

    updateMailData:function( id )
    {
        var mail = this._mailDates[id];
        if( mail ==  null )
        {
            this.addMailData( id );
            return;
        }
        var dataInfo = mainData.emailData.getItem( "id", id );
        if( dataInfo ==  null ) return;

        mail.id             = dataInfo.id;
        mail.surplusTime    = dataInfo.surplusTime;
        mail.flags          = dataInfo.flags;
        mail.isRead         = dataInfo.isRead;
        mail.isReceive      = dataInfo.isReceive;
        mail.languageId     = dataInfo.languageId;
        mail.time           = dataInfo.time;
        mail.type           = dataInfo.type;
        mail.roleId         = dataInfo.roleId;
        mail.roleName       = "";
        mail.title          = dataInfo.title;
        mail.msg            = dataInfo.msg;
        mail.items          = [];
        if( mail.isReceive == false && dataInfo.items._length > 0 )
        {
            var itemLen = dataInfo.items._length;
            for( var i=0; i<itemLen; i++ )
            {
                var it      = dataInfo.items.getItemAt(i);
                var newItem = {};
                newItem.id  = it.id;
                newItem.num = it.num;
                mail.items.push( newItem );
            }
        }
        if( mail.event == null )
        {
            var eventObj = new TagMailItemInfo();
            eventObj.id = mail.id;
            mail.event = eventObj;
            dataInfo.addListener( GameSDK.Event.PROPERTY_CHANGE,eventObj.callFun, eventObj );
        }
    },

    deleteMailData:function( id )
    {
        var dataInfo = mainData.emailData.getItem( "id", id );
        var localData = this._mailDates[ id ];
        if( dataInfo ==  null ) return;
        dataInfo.removeListener( GameSDK.Event.PROPERTY_CHANGE,localData.event.callFun, localData.event );
        delete this._mailDates[ id ];
    },

    //获取邮件
    getMail:function( id )
    {
        return this._mailDates[id];
    },
    //获取全部邮件
    getMails:function()
    {
        return this._mailDates;
    },
    //获取新邮件数量
    getNewMailNum:function()
    {
        var n = 0;
        for( var key in this._mailDates )
        {
            var isRead = this.isReade( key );
            if( !isRead )
            {
                n ++;
            }
        }
        return n;
    },

    isHaveAccessory:function()
    {
        for( var key in this._mailDates )
        {
            var isRead = this.isReceive( key );
            if( !isRead )
            {
                return true;
            }
        }
        return false;
    },

    isSystem:function( id )
    {
        var b = true;
        var mail = this._mailDates[ id ];
        if( mail )
        {
            b = !!( mail.flags & MailSTATE.system );
        }
        return b;
    },

    isReade:function( id )
    {
        var b = true;
        var mail = this._mailDates[ id ];
        if( mail )
        {
            b = !!( mail.flags & MailSTATE.reade );
        }
        return b;
    },

    isReceive:function( id )
    {
        var b = true;
        var mail = this._mailDates[ id ];
        if( mail )
        {
            b = !!( mail.flags & MailSTATE.receive );
        }
        return b;
    },

    isLoad:function()
    {
        return this._isLoad;
    },

    //加载
    ncLoad:function()
    {
        this._isLoad = true;
        var msg = new SocketBytes();
        msg.writeUint( MailCMD.NC_MAIL_LOAD );
        NetMgr.inst().send( msg );
    },

    //删除全部
    ncDeleteMails:function()
    {
        for( var key in this._mailDates )
        {
            var isRead = this.isReade(key);
            var isReceive = this.isReceive(key);
            if (isRead && isReceive)
            {
                this.ncDeleteMail( key );
            }
        }
    },

    //删除单个
    ncDeleteMail:function( id )
    {
        var msg = new SocketBytes();
        msg.writeUint( MailCMD.NC_MAIL_DELETE );
        msg.writeString( id );
        NetMgr.inst().send( msg );
    },

    //读取单个
    ncReadMail:function( id )
    {
        var msg = new SocketBytes();
        msg.writeUint( MailCMD.NC_MAIL_READE );
        msg.writeString( id );
        NetMgr.inst().send( msg );
    },
    //领取全部
    ncReceiveMails:function()
    {
        for( var key in this._mailDates )
        {
            var isReceive = this.isReceive(key);
            if ( !isReceive)
            {
                this.ncReceiveMail( key );
            }
        }
    },
    //领取单个
    ncReceiveMail:function( id )
    {
        var msg = new SocketBytes();
        msg.writeUint( MailCMD.NC_MAIL_RECEIVE );
        msg.writeString( id );
        msg.writeUint( 1 );
        NetMgr.inst().send( msg );
    },

    nsLoad:function( cmd, data )
    {
        data.resetCMDData();
        var mailId          = data.readString();
        var surplusTime     = data.readUint();
        var flags           = data.readUint();

        var mail =  this._mailDates[ mailId ];

        if( this._newsCache[ mailId ] != null )
        {
            delete this._newsCache[ mailId ];
        }
        else if( this._newsCache[ mailId ] == null && mail == null )
        {
            this._newsCache[ mailId ] = 1;

            //请求数据
            var msg = new SocketBytes();
            msg.writeUint( MailCMD.NC_MAIL_INFO );
            msg.writeString( mailId );
            msg.writeUint( 1 );
            NetMgr.inst().send( msg );
        }

        var isUpdata = false;
        if( mail == null )
        {
            mail = {};
            this._mailDates[ mailId ] = mail;
        }
        else
        {
            isUpdata = true;
        }

        mail.id             = mailId;
        mail.surplusTime    = surplusTime;
        mail.flags          = flags;
        mail.isRead         = !!( flags & MailSTATE.reade );
        mail.isReceive      = !!( flags & MailSTATE.receive );
        cc.log( " 邮件状态：" + isUpdata + ": " + mailId );
        if( isUpdata )
        {
            //更新
            EventMgr.inst().dispatchEvent( MailEvent.SEND_UPDATE_MAIL, mailId );
        }
        if( mail && mail.surplusTime <= 0 )
        {
            cc.log("mailId:" + mailId);
            //删除
            EventMgr.inst().dispatchEvent( MailEvent.SEND_DELETE_MAIL, mailId );
            delete this._mailDates[ mailId ];
        }

        if( mail && !mail.isRead )
        {
            //新邮件
            EventMgr.inst().dispatchEvent( MailEvent.SEND_NEW_MAIL );
        }

    },

    nsInfo:function( cmd, data )
    {
        data.resetCMDData();
        var mailId          = data.readString();
        var languageId      = data.readUint();
        var time            = data.readUint();
        var type            = data.readUint();
        var role            = data.readString();
        var title           = data.readString();
        var body            = data.readString();
        var items           = [];
        var len             = data.readUint();
        for( var i=0; i<len; i++ )
        {
            var it      = {};
            it.id       = data.readUint();
            it.num      = data.readUint();
            items.push( it );
        }
        var mail = this._mailDates[ mailId ];
        if( mail == null ) return;
        mail.languageId     = languageId;
        mail.time           = time;
        mail.type           = type;
        mail.roleId         = role;
        mail.roleName       = "";
        mail.title          = title;
        mail.msg            = body;
        mail.items          = items;

        if( this._newsCache[ mailId ] != null )
        {
            //新邮件
            EventMgr.inst().dispatchEvent( MailEvent.SEND_ADD_MAIL, mailId );
            cc.log("new mailId:" + mailId);
            delete this._newsCache[ mailId ];
        }

    },

    nsNew:function( cmd, data )
    {
        data.resetCMDData();
        var mailId = data.readString();

        //新邮件
        EventMgr.inst().dispatchEvent( MailEvent.SEND_NEW_MAIL );
    },

});