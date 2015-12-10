/**
 *
 * 文件名: ArrayBufferEx.js
 * 创建时间: 2015/4/3- 11:53
 *
 * 功能说明: ArrayBuffer的护展。支持游标，支持各种类型的读取
 *
 */



var ArrayBufferEx = function()
{
    var _me = this;
    var _arrayBuffer = null;
    var _endian = "bigEndian"; //"bigEndian","littleEndian"
    var _position = 0;

    this.writeByte = function( val )
    {
        //判断内存是否可以插入一个字节，不够就扩内存
        var len = getBytesAvailable();
        if( len < 1 )
        {
            extendMemory(1);
        }
        var dataView = new DataView( _arrayBuffer );
        dataView.setInt8( _position, val );
        _position += 1;
    }

    this.writeBytes = function( val, offset, length )
    {

    }

    this.writeShort = function ( val )
    {
        //判断内存是否可以插入一个字节，不够就扩内存
        var len = getBytesAvailable();
        if( len < 2 )
        {
            extendMemory( 2 - len );
        }

        var dataView = new DataView( _arrayBuffer );
        dataView.setInt16( _position, val );
        _position += 2;
    }

    this.writeInt = function ( val )
    {
        //判断内存是否可以插入一个字节，不够就扩内存
        var len = getBytesAvailable();
        if( len < 4 )
        {
            extendMemory( 4 - len );
        }

        var dataView = new DataView( _arrayBuffer );
        dataView.setInt32( _position, val );
        _position += 4;
    }

    this.writeDouble = function ( val )
    {
        //判断内存是否可以插入一个字节，不够就扩内存
        var len = getBytesAvailable();
        if( len < 8 )
        {
            extendMemory( 8 - len );
        }

        var dataView = new DataView( _arrayBuffer );
        dataView.setFloat64( _position, val );
        _position += 8;
    }

    this.writeString = function( str )
    {
        var bytesSrc = pushString ( str );

        var len = getBytesAvailable ();
        if ( len < bytesSrc.byteLength + 2 )
        {
            extendMemory ( (bytesSrc.byteLength + 2) - len );
        }

        var dataView = new DataView ( _arrayBuffer );
        dataView.setInt16 ( _position , bytesSrc.byteLength );
        _position += 2;
        var byteDst = new Uint8Array ( _arrayBuffer );
        byteDst.set ( bytesSrc , _position );
    }


    this.readByte = function()
    {
        var n = 0;

        var len = this.getLength();

        if( _position + 1 <= len )
        {
            var dataView = new DataView( _arrayBuffer );
            n = dataView.getInt8(_position);
            _position += 1;
        }
        else
        {
            cc.log("读取字节超出范围");
        }
        return n;
    }


    this.readBytes = function( len )
    {

    }

    this.readShort = function()
    {
        var n = 0;
        var len = this.getLength();

        if( _position + 2 <= len )
        {
            var dataView = new DataView( _arrayBuffer );
            n = dataView.getInt16(_position);
            _position += 2;
        }
        else
        {
            cc.log("读取字节超出范围");
        }
        return n;
    }

    this.readInt = function()
    {
        var n = 0;
        var len = this.getLength();

        if( _position + 4 <= len )
        {
            var dataView = new DataView( _arrayBuffer );
            n = dataView.getInt32(_position);
            _position += 4;
        }
        else
        {
            cc.log("读取字节超出范围");
        }
        return n;
    }

    this.readDouble = function()
    {
        var n = 0;
        var len = this.getLength();

        if( _position + 8 <= len )
        {
            var dataView = new DataView( _arrayBuffer );
            n = dataView.getFloat64(_position);
            _position += 8;
        }
        else
        {
            cc.log("读取字节超出范围");
        }
        return n;
    }

    this.readString = function()
    {
        var str = "";
        var n = 0;
        var len = this.getLength();
        if( _position + 2 <= len )
        {
            var dataView = new DataView( _arrayBuffer );
            var strLen = dataView.getInt16( _position );
            _position += 2;

            if( _position + strLen <= len )
            {
                var bytes = new Uint8Array( _arrayBuffer, _position, strLen );
                var arr = Array.apply( [], bytes );
                str = shiftString( arr );
                _position += strLen;
            }
            else
            {
                cc.log("读取字节超出范围");
            }
        }
        else
        {
            cc.log("读取字节超出范围");
        }
        return str;
    },

        this.getLength = function()
        {
            var len = 0;
            if( _arrayBuffer != null )
            {
                len = _arrayBuffer.byteLength;
            }
            return len;
        }

    this.setPosition = function( pos )
    {
        pos = Math.max( 0, pos );

        var len = 0;
        if( _arrayBuffer != null )
        {
            len = _arrayBuffer.byteLength;
        }
        pos = Math.min( len, pos );

        _position = pos;
    }

    this.isLittleEndian = function()
    {
        return _endian == "littleEndian";
    }

    this.clear =function()
    {
        _arrayBuffer = null;
        _position = 0;
    }

    //获取空闲字节
    function getBytesAvailable()
    {
        var len = 0;
        if( _arrayBuffer != null )
        {
            len = _arrayBuffer.byteLength;
        }
        len = len - _position;
        return len;
    }
    //扩展内存
    function extendMemory( len )
    {
        if( _arrayBuffer == null )
        {
            _arrayBuffer = new ArrayBuffer( len );
        }
        else
        {
            len = _me.getLength() + len;
            var arrSrc = new Uint8Array( _arrayBuffer );
            var buffDst = new ArrayBuffer( len );
            var arrDst = new Uint8Array( buffDst );
            arrDst.set( arrSrc );
            _arrayBuffer = buffDst;
        }
    }

    function pushUint ( array , val )
    {
        for ( var i = 0 ; i < 6 ; ++i )
        {
            var by = val & 0x7F;
            val >>>= 7;
            if ( val == 0 )
            {
                array.push ( by );
                return;
            }
            array.push ( by | 0x80 );
        }
        array.push ( val & 0xFF );
    }

    function pushInt ( array , val )
    {
        if ( val >= 0 )
        {
            pushVuint ( array , val * 2 );
        } else
        {
            pushVuint ( array , (-val + 1) * 2 );
        }
    }

    function shiftUint ( array )
    {
        var val = 0;
        for ( var i = 0 ; i < 6 ; ++i )
        {
            var by = array.shift ();
            val |= (by & 0x7F) << (7 * i);
            if ( !(by & 0x80) )
            {
                return val;
            }
        }
        val <<= 8;
        val |= by & 0xFF;
        return val;
    }

    function shiftInt ( array )
    {
        var tmp = shiftVuint ( array );
        if ( !(tmp & 1) )
        {
            return tmp / 2;
        } else
        {
            return -(tmp + 1) / 2;
        }
    }

    function pushString ( val )
    {
        var bytes = new Array;
        for ( var i = 0 ; i < val.length ; ++i )
        {
            var codePoint = val.charCodeAt ( i );
            if ( (0xD800 <= codePoint) && (codePoint < 0xDC00) )
            {
                var leading = codePoint & 0x3FF;
                var trailing = val.charCodeAt ( ++i ) & 0x3FF;
                codePoint = ((leading << 10) | trailing) + 0x10000;
            }
            if ( codePoint < 0x80 )
            { // 7 位
                bytes.push ( codePoint );
            }
            else if ( codePoint < 0x800 )
            { // 11 位 = 5 + 6
                bytes.push ( ((codePoint >>> 6) & 0x1F) | 0xC0 );
                bytes.push ( ((codePoint       ) & 0x3F) | 0x80 );
            }
            else if ( codePoint < 0x10000 )
            { // 16 位 = 4 + 6 + 6
                bytes.push ( ((codePoint >>> 12) & 0x0F) | 0xE0 );
                bytes.push ( ((codePoint >>> 6) & 0x3F) | 0x80 );
                bytes.push ( ((codePoint       ) & 0x3F) | 0x80 );
            }
            else
            { // 21 位 = 3 + 6 + 6 + 6
                bytes.push ( ((codePoint >>> 18) & 0x07) | 0xF0 );
                bytes.push ( ((codePoint >>> 12) & 0x3F) | 0x80 );
                bytes.push ( ((codePoint >>> 6) & 0x3F) | 0x80 );
                bytes.push ( ((codePoint       ) & 0x3F) | 0x80 );
            }
        }

        var strArray = new Uint8Array ( bytes );
        return strArray;
    }

    function shiftString ( bytes )
    {
        var val = new String ();

        while ( bytes.length > 0 )
        {
            var codePoint = bytes.shift ();
            if ( codePoint >= 0x80 )
            {
                if ( (codePoint & 0xE0) == 0xC0 )
                { // 11 位
                    codePoint &= 0x1F;
                    codePoint <<= 6;
                    codePoint |= bytes.shift () & 0x3F;
                }
                else if ( (codePoint & 0xF0) == 0xE0 )
                { // 16 位
                    codePoint &= 0x0F;
                    codePoint <<= 12;
                    codePoint |= (bytes.shift () & 0x3F) << 6;
                    codePoint |= bytes.shift () & 0x3F;
                }
                else
                { // 21 位
                    codePoint &= 0x0F;
                    codePoint <<= 18;
                    codePoint |= (bytes.shift () & 0x3F) << 12;
                    codePoint |= (bytes.shift () & 0x3F) << 6;
                    codePoint |= bytes.shift () & 0x3F;
                }
            }

            if ( codePoint < 0x10000 )
            {
                val += String.fromCharCode ( codePoint );
            } else
            {
                var leading = ((codePoint - 0x10000) >>> 10) & 0x3FF;
                var trailing = codePoint & 0x3FF;
                val += String.fromCharCode ( leading | 0xD800 , trailing | 0xDC00 );
            }
        }
        return val;
    }

}