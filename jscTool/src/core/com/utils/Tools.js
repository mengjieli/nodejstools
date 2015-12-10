/**
 * 工具
 */

var Tools = Tools || {};

//utf16字符串转UTF8二进制数组

Tools.stringToBytes = function( val )
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
    return bytes;
}

//UTF8二进制数组转utf16字符串

Tools.bytesToString =  function ( bytesArray )
{
    var val = new String("");

    while ( bytesArray.length > 0 )
    {
        var codePoint = bytesArray.shift ();

        if ( codePoint >= 0x80 )
        {
            if ( (codePoint & 0xE0) == 0xC0 )
            { // 11 位
                codePoint &= 0x1F;
                codePoint <<= 6;
                codePoint |= bytesArray.shift () & 0x3F;
            }
            else if ( (codePoint & 0xF0) == 0xE0 )
            { // 16 位
                codePoint &= 0x0F;
                codePoint <<= 12;
                codePoint |= (bytesArray.shift () & 0x3F) << 6;
                codePoint |= bytesArray.shift () & 0x3F;
            }
            else
            { // 21 位
                codePoint &= 0x0F;
                codePoint <<= 18;
                codePoint |= (bytesArray.shift () & 0x3F) << 12;
                codePoint |= (bytesArray.shift () & 0x3F) << 6;
                codePoint |= bytesArray.shift () & 0x3F;
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


//整型转换成二制进数组

Tools.numberToBinaryArray = function ( val , len )
{
    var arr = [];
    for ( var i = 0 ; i < len ; i++ )
    {
        arr.push ( val >> (i * 8) & 0xff );
    }
    arr.reverse();
    return arr;
}

//二制进数组转换成整型

Tools.BinaryArrayToNumber = function ( bytes )
{
    var val = 0;
    for ( var i = 0 ; i < bytes.length ; i++ )
    {
        val = val << (i * 8);
        val |= bytes[ i ] & 0xff;
    }
    return val;
}


//倒转整型高底位

Tools.bytesReverse = function ( val , len )
{
    var num = 0;
    for ( var i = 0 ; i < len ; i++ )
    {
        num = num << 8;
        num = num | (val >> (i * 8) & 0xff);
    }
    return num;
}

//是否是数组
Tools.isArray = function (value)
{
    return toString.apply(value) == "[object Array]";
}

