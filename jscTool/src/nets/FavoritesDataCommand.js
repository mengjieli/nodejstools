/**
 * Created by Administrator on 2015/12/4.
 */

var FavoritesDataCommand = function()
{
    var init = function()
    {
        NetMgr.inst().addEventListener( 298, loadCall, this );
    }

    var loadCall = function( cmd, msg )
    {
        msg.resetCMDData();
        var uid             = msg.readString();
        var localityId      = SelfData.getInstance().accountId;
        if( uid == localityId );
        {
            msg.readString();
            var len         = msg.readUint();
            for( var i=0; i<len; i++ )
            {
                var key     = msg.readUint();
                var str     = msg.readString();
                if( key == 199 )
                {
                    mainData.favoritesData = str;
                }
            }
        }
    }

    init();
}