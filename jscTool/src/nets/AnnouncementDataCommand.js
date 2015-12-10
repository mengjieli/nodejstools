/**
 * Created by Administrator on 2015/12/4.
 */

var AnnouncementDataCommand =  function()
{
    this.init = function()
    {
        //NetMgr.inst().addEventListener( 255, loadCall, this )
    }

    var loadCall = function( cmd, msg )
    {
        msg.resetCMDData();
        var obj = DataManager.getInstance().getNewData("AnnouncementData");
        obj.id = msg.readString();
        obj.msg = msg.readString();
        obj.num = msg.readUint();
        mainData.announcementData.push(obj);
    }
}