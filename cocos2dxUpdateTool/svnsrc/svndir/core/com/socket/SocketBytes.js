/**
 *
 * 文件名: SocketBytes.js
 * 创建时间: 2015/4/20- 21:10
 *
 * 功能说明: 所有的数据都是变长
 *
 */

var SocketBytes = function()
{
    var _me = this;
    var _arrayBuffer = [];
    var _position = 0;

    this.initBuffer = function( buffer )
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
    
    this.getPosition = function() 
    {
		return _position;
	}

    this.getLength = function()
    {
        return _arrayBuffer.length;
    }

    this.writeUint = function ( val )
    {
        for ( var i = 0 ; i < 6 ; ++i )
        {
            var by = val & 0x7F;
            val = Math.floor ( val / 128 );
            if ( val == 0 )
            {
                //_arrayBuffer.push ( by );
                _arrayBuffer.splice ( _position , 0 , by );
                _position++;
                return;
            }
            //_arrayBuffer.push ( by | 0x80 );
            _arrayBuffer.splice ( _position , 0 , by | 0x80 );
            _position++;
        }
        //_arrayBuffer.push ( val & 0xFF );
        _arrayBuffer.splice ( _position , 0 , val & 0xFF );
        _position++;
    }

    this.writeInt = function( val )
    {
        if ( val >= 0 )
        {
            this.writeUint ( val * 2 );
        }
        else
        {
            this.writeUint ( -val*2 - 1 );
        }
    }

    this.writeBytes = function ( val )
    {
        this.writeUint ( val.length );
        writeArrayBytes ( val );
    }

    this.writeString = function( str )
    {
        var bytes = Tools.stringToBytes ( str );
        this.writeBytes( bytes );
    }


    this.readUint = function()
    {
        var val = 0;
        for ( var i = 0 ; i < 6 ; ++i )
        {
            if( _position >= _arrayBuffer.length )
            {
                cc.log("byte读取越界");
                return val;
            }
            var by = _arrayBuffer[_position];
            _position++;
            val += (by & 0x7F) * Math.pow(128, i);
            if ( !(by & 0x80) )
            {
                return val;
            }
        }
        val *= 256;

        if( _position >= _arrayBuffer.length )
        {
            cc.log("byte读取越界");
            return val;
        }
        var by = _arrayBuffer[_position];
        _position++;
        val += (by & 0xFF) * Math.pow(128, 6);
        return val;
    }

    this.readInt = function()
    {
        var tmp = this.readUint ();
        if ( !(tmp & 1) )
        {
            return tmp / 2;
        } else
        {
            return -(tmp + 1) / 2;
        }
    }


    this.readBytes = function ( )
    {
        var length = this.readUint ( );
        return readArrayBytes ( length );
    }


    this.readString = function()
    {
        var length = this.readUint ( );
        var arr = readArrayBytes( length );
        var str = Tools.bytesToString ( arr );
        return str;
    }

    this.getArrayBuffer = function()
    {
        var arrBuff = new Uint8Array( _arrayBuffer );
        return arrBuff.buffer;
    }


    function writeArrayBytes ( val )
    {
        for ( var i = 0 ; i < val.length ; ++i )
        {
            //_arrayBuffer.push ( val[ i ] );
            _arrayBuffer.splice ( _position , 0 , val[ i ] & 0xFF );
            _position++;
        }
    }


    function readArrayBytes( length )
    {
        var val = new Array;
        for ( var i = 0 ; i < length ; ++i )
        {
            if( _position >= _arrayBuffer.length )
            {
                cc.log("byte读取越界");
                break;
            }
            val.push ( _arrayBuffer[_position] & 0xFF );
            _position++;
        }
        return val;
    }

    this.resetCMDData = function ()
    {
        this.setPosition(0);
        this.readUint();
    }


}