/**
 * Created by Administrator on 2015/11/9.
 */

MailEvent = {};

MailEvent.SEND_NEW_MAIL = "send_mail_new_mail";
MailEvent.SEND_ADD_MAIL = "send_mail_add_mail";
MailEvent.SEND_DELETE_MAIL = "send_mail_delete_mail";
MailEvent.SEND_READE_MAIL = "send_mail_reade_mail";
MailEvent.SEND_RECEIVE_MAIL = "send_mail_receive_mail";
MailEvent.SEND_UPDATE_MAIL = "send_mail_update_mail";

MailCMD = {};
MailCMD.NC_MAIL_LOAD    = 600;
MailCMD.NC_MAIL_INFO    = 601;
MailCMD.NC_MAIL_WRITE   = 602;
MailCMD.NC_MAIL_READE   = 603;
MailCMD.NC_MAIL_RECEIVE = 604;
MailCMD.NC_MAIL_DELETE  = 605;

MailCMD.NS_MAIL_LOAD    = 699;
MailCMD.NS_MAIL_INFO    = 698;
MailCMD.NS_MAIL_NEW     = 697;

MailSTATE = {};
MailSTATE.system    = 0x01;
MailSTATE.reade     = 0x10;
MailSTATE.receive    = 0x20;


var MailData = DataBase.extend({

    _mailDates:null,
    _isLoad:false,

    _newsCache:null,

    ctor:function()
    {
        this._super();
    },

    init:function()
    {
        NetMgr.inst().addEventListener( MailCMD.NS_MAIL_LOAD    , this.nsLoad, this);
        NetMgr.inst().addEventListener( MailCMD.NS_MAIL_INFO    , this.nsInfo, this);
        NetMgr.inst().addEventListener( MailCMD.NS_MAIL_NEW     , this.nsNew, this);

        this._mailDates = {};
        this._newsCache = {};

        this.ncLoad();

        //this._mailDates["1"] =
        //{
        //    id:1,
        //    roleId:0,
        //    roleName:"aff",
        //    title:"1wo shi zhu ti",
        //    msg:"wo shi 客人发苏打粉 飒沓的安德森阿斯啊打算阿萨法飒飒大法师打发似的发顺丰是打发似的发顺丰阿萨德发生的发生 地方\n阿斯\n蒂芬 啊的萨芬啊啊打的费啊  的萨芬阿\n萨德发射点发 阿斯达大多数发送发生的发射点发撒安德森发送飒沓 打发发撒旦发射点发阿萨打发打发阿德法大撒旦发射打发苏打粉飒沓 ti",
        //    items:[],
        //    isRead:false,
        //    time:(new Date()).getTime(),
        //};
        //
        //this._mailDates["2"] =
        //{
        //    id:2,
        //    roleId:0,
        //    roleName:"afffdf",
        //    title:"0wo shi zhu ti1",
        //    msg:"wo shi zhu ti",
        //    items:[],
        //    isRead:false,
        //    time:(new Date()).getTime(),
        //};
        //
        //this._mailDates["3"] =
        //{
        //    id:3,
        //    roleId:0,
        //    roleName:"aaaff",
        //    title:"0wo shi zhu ti1",
        //    msg:"wo shi zhu ti",
        //    items:[],
        //    isRead:true,
        //    time:(new Date()).getTime(),
        //};
        //
        //
        //this._mailDates["4"] =
        //{
        //    id:4,
        //    roleId:0,
        //    roleName:"affffd",
        //    title:"0wo shi zhu ti1",
        //    msg:"wo shi zhu ti",
        //    items:[{id:525522,num:4},{id:525522,num:4}],
        //    isRead:false,
        //    time:(new Date()).getTime(),
        //};
        //
        //this._mailDates["5"] =
        //{
        //    id:5,
        //    roleId:0,
        //    roleName:"affffd",
        //    title:"0wo shi zhu ti1",
        //    msg:"wo shi zhu ti",
        //    items:[{id:525522,num:4},{id:525522,num:4}],
        //    isRead:false,
        //    time:(new Date()).getTime(),
        //};
        //
        //this._mailDates["6"] =
        //{
        //    id:6,
        //    roleId:0,
        //    roleName:"affffd",
        //    title:"0wo shi zhu ti1",
        //    msg:"wo shi zhu ti",
        //    items:[{id:525522,num:4},{id:525522,num:4}],
        //    isRead:false,
        //    time:(new Date()).getTime(),
        //};
        //
        //this._mailDates["7"] =
        //{
        //    id:7,
        //    roleId:0,
        //    roleName:"affffd",
        //    title:"0wo shi zhu ti1",
        //    msg:"wo shi zhu ti",
        //    items:[{id:525522,num:4},{id:525522,num:4}],
        //    isRead:false,
        //    time:(new Date()).getTime(),
        //};
        //
        //this._mailDates["8"] =
        //{
        //    id:8,
        //    roleId:0,
        //    roleName:"affffd",
        //    title:"0wo shi zhu ti1",
        //    msg:"wo shi zhu ti",
        //    items:[{id:525522,num:4},{id:525522,num:4}],
        //    isRead:false,
        //    time:(new Date()).getTime(),
        //};
        //
        //this._mailDates["9"] =
        //{
        //    id:9,
        //    roleId:0,
        //    roleName:"affffd",
        //    title:"0wo shi zhu ti1",
        //    msg:"wo shi zhu ti dfasdf adfa asd fasdf asdfa fadsfas dfas dfas fdsa fadf asdf asdf asdfa sdfa dsf sdfasdfas fasfasd  fsdaf asdfs dsa",
        //    items:[{id:525522,num:4},{id:525522,num:4}],
        //    isRead:false,
        //    time:(new Date()).getTime(),
        //};
    },

    destroy:function()
    {
        NetMgr.inst().removeEventListener( MailCMD.NS_MAIL_LOAD    , this.nsLoad, this);
        NetMgr.inst().removeEventListener( MailCMD.NS_MAIL_INFO    , this.nsInfo, this);
        NetMgr.inst().removeEventListener( MailCMD.NS_MAIL_NEW     , this.nsNew, this);
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