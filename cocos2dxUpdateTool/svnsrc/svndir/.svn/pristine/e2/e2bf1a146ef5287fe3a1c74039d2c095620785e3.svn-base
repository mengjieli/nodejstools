/**
 *
 * 文件名: ByteArray.js
 * 创建时间: 2015/4/3- 13:50
 *
 * 功能说明: 二进制数组操作
 *
 */

var ByteArray = cc.Class.extend( new function ( )
{
    var _me = this;
    var _arrayBuffer = [];
    var _endian = "bigEndian"; //"bigEndian","littleEndian"
    var _position = 0;

    this.ctor = function( buffer )
    {
        if( buffer )
        {
            var arrBuffer = new Uint8Array( buffer );
            _arrayBuffer = Array.apply( [], arrBuffer );
        }
    }

    this.setPosition = function ( pos )
    {
        pos = Math.max ( 0 , pos );
        var len = _arrayBuffer.length;
        pos = Math.min ( len , pos );
        _position = pos;
    }

    this.getLength = function()
    {
        return _arrayBuffer.length;
    }

    this.setEndian = function ( endian )
    {
        _endian = endian;
    }

    this.isLittle = function ()
    {
        return _endian == "littleEndian";
    }


    this.writeByte = function ( val )
    {
        _arrayBuffer.splice ( _position , 0 , val );
        _position++;
    }

    this.writeBytes = function ( bytesArray )
    {
        for ( var i = 0 ; i < bytesArray.length ; ++i )
        {
            this.writeByte ( bytesArray[ i ] );
        }
    }


    this.writeShort = function ( val )
    {
        if ( this.isLittle () )
        {
            val = Tools.bytesReverse ( val , 2 );
        }

        writeNumber ( val , 2 );

    }

    this.writeInt = function ( val )
    {
        if ( this.isLittle () )
        {
            val = Tools.bytesReverse ( val , 4 );
        }
        writeNumber ( val , 4 );
    }

    this.writeDouble = function ( val )
    {
        if ( this.isLittle () )
        {
            val = Tools.bytesReverse ( val , 8 );
        }
        writeNumber ( val , 8 );
    }

    this.writeString = function ( str )
    {
        var bytes = Tools.stringToBytes ( str );
        this.writeBytes ( bytes );

    }


    this.readByte = function ()
    {
        if ( isSpillage ( 1 ) )
        {
            cc.log ( "读取越界" );
            return 0;
        }
        var val = _arrayBuffer[ _position ];
        _position++;
        return val;
    }

    this.readBytes = function ( len )
    {
        if ( isSpillage ( len ) )
        {
            cc.log ( "读取越界" );
            return 0;
        }
        var end = _position + len;
        var arr = _arrayBuffer.slice ( _position , end );
        _position += len;
        return arr;
    }

    this.readShort = function ()
    {
        var val = 0;
        if ( isSpillage ( 2 ) )
        {
            cc.log ( "readShort 读取越界" );
            return val;
        }

        val = readNumber ( 2 );

        if ( this.isLittle () )
        {
            val = Tools.bytesReverse ( val , 2 );
        }

        return val;
    }

    this.readInt = function ()
    {
        var val = 0;
        if ( isSpillage ( 4 ) )
        {
            cc.log ( "readInt 读取越界" );
            return val;
        }

        val = readNumber ( 4 );

        if ( this.isLittle () )
        {
            val = Tools.bytesReverse ( val , 4 );
        }

        return val;
    }

    this.readDouble = function ()
    {
        var val = 0;
        if ( isSpillage ( 8 ) )
        {
            cc.log ( "readDouble 读取越界" );
            return val;
        }

        val = readNumber ( 8 );

        if ( this.isLittle () )
        {
            val = Tools.bytesReverse ( val , 8 );
        }

        return val;
    }


    this.readString = function ( len )
    {
        var arr = this.readBytes ( len );
        var str = Tools.bytesToString ( arr );
        return str;
    }

    this.getBytes = function()
    {
        return _arrayBuffer.concat([]);
    }

    this.getArrayBuffer = function()
    {
        var arrBuff = new Uint8Array( _arrayBuffer );
        return arrBuff.buffer;
    }

    //写入len长度类型的整型
    function writeNumber ( val , len )
    {
        var arr = Tools.numberToBinaryArray ( val , len );
        for ( var i in arr )
        {
            _me.writeByte ( arr[ i ] );
        }
    }

    //跟据长度读取整型
    function readNumber ( len )
    {
        var arr = _me.readBytes ( len );
        var num = Tools.BinaryArrayToNumber ( arr );
        return num;
    }

    //判断是否越界
    function isSpillage ( len )
    {
        var minLen = _position + len;

        return minLen > _arrayBuffer.length;

    }
});