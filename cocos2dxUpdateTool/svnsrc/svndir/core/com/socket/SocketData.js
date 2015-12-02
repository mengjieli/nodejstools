/**
 *
 * 文件名: SocketData.js
 * 创建时间: 2015/4/3- 13:50
 *
 * 功能说明: 二进制数组操作，重新封装了一下对字符串的操作
 *
 */


var SocketData = ByteArray.extend( new function()
{
    var _me = this;

    this.ctor  = function( buffer )
    {
        this._super( buffer );
    }

    this.writeString = function( str )
    {
        var bytes = Tools.stringToBytes ( str );
        this.writeByte( bytes.length );
        this.writeBytes ( bytes );
    }

    this.readString = function()
    {
        var len = this.readShort();
        var arr = this.readBytes ( len );
        var str = Tools.bytesToString ( arr );
        return str;
    }

});