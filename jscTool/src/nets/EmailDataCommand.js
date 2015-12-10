/**
 * Created by Administrator on 2015/12/3.
 */
EmailDataCommandCMD         = {};
EmailDataCommandCMD.load    = 699;
EmailDataCommandCMD.info    = 698;
MailSTATE                   = {};
MailSTATE.system            = 0x01;
MailSTATE.reade             = 0x10;
MailSTATE.receive           = 0x20;

var EmailDataCommand = function()
{
    var init = function()
    {
        NetMgr.inst().addEventListener( EmailDataCommandCMD.load, loadCall, this );
        NetMgr.inst().addEventListener( EmailDataCommandCMD.info, infoCall, this );
    }

    var loadCall = function( cmd, msg )
    {
        msg.resetCMDData();
        var mailId          = msg.readString();
        var surplusTime     = msg.readUint();
        var flags           = msg.readUint();
        var obj             = null;
        var infoData        = mainData.emailData.getItem("id",mailId);
        //判断邮件是否新的
        if( infoData != null )
        {
            obj             = infoData;
        }
        else
        {
            obj             = DataManager.getInstance().getNewData("EmailData");
            obj.isLoadInfo  = false;
        }
        obj.id              = mailId;
        obj.surplusTime     = surplusTime;
        obj.flags           = flags;
        obj.isRead          = !!( flags & MailSTATE.reade );
        obj.isReceive       = !!( flags & MailSTATE.receive );
        if( obj.isLoadInfo  == false )
        {
            //新的就加载内容
            var msg = new SocketBytes();
            msg.writeUint( 601 );
            msg.writeString( mailId );
            msg.writeUint( 1 );             // 语言类型  先写死
            NetMgr.inst().send( msg );
        }
        if( infoData == null )
        {
            mainData.emailData.push(obj);
        }
    }

    var infoCall = function( cmd, msg )
    {
        msg.resetCMDData();
        var mailId          = msg.readString();
        var languageId      = msg.readUint();
        var time            = msg.readUint();
        var type            = msg.readUint();
        var role            = msg.readString();
        var title           = msg.readString();
        var body            = msg.readString();
        var items           = [];
        var len             = msg.readUint();
        for( var i=0; i<len; i++ )
        {
            var it          = DataManager.getInstance().getNewData("MailItemData");
            it.id           = msg.readUint();
            it.num          = msg.readUint();
            items.push( it );
        }
        var infoData        = mainData.emailData.getItem("id",mailId);
        if( infoData == null ) return;
        var mail            = infoData;
        mail.languageId     = languageId;
        mail.time           = time;
        mail.type           = type;
        mail.roleId         = role;
        mail.roleName       = "";
        mail.title          = title;
        mail.msg            = body;
        for( var i=0; i<len; i++ )
        {
            mail.items.push(items[i]);
        }
        mail.isLoadInfo     = true;
    }

    init();
}