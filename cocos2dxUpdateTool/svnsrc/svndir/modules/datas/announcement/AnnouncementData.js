/**
 * Created by Administrator on 2015/10/23.
 */

AnnouncementEvent = {};

AnnouncementEvent.SEND_ANNOUNCEMENT_MSG = "send_announcement_msg";

var AnnouncementData = DataBase.extend({


    _announcements:null,

    ctor:function()
    {
        this._super();
        this._announcements = [];
        var obj = {};
        obj.msg = "version 0";
        obj.num = 3;
        this._announcements.push(obj);
        this._announcements.push(obj);
        this._announcements.push(obj);
    },

    init:function()
    {
        //NetMgr.inst().addEventListener( ProtoclId.DZSLogin , this.transactionHandler, this);
    },

    getAnnouncement:function()
    {
        var data = null;
        if( this._announcements && this._announcements.length > 0 )
        {
            data = this._announcements.shift();
        }
        return data;
    }

});