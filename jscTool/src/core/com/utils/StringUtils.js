/**
 * Created by zhouyulong on 2015/5/25.
 * 字符串工具类
 */
var StringUtils = cc.Class.extend({

});

/**
 * 从url里面截取文件名
 * @url                 url
 * @extension          扩展名  txt,png,jpg,xml,json
 */
StringUtils.getFileName = function(url,extension)
{
    var startPos = url.lastIndexOf("/");
    var endPos = url.lastIndexOf("." + extension);
    return url.substring(startPos + 1,endPos);
};

/**
 * 替换下标值
 * @original       原始值
 * @index          下标
 * @value          替换值
 */
StringUtils.replace = function(original,index,value)
{
    if(index >= original.length)
    {
        return original;
    }
    var start;
    var end;
    start = 0;
    end = index;
    var before;
    var after;
    if(end <= 0)
    {
        before = "";
    }
    else
    {
        before = original.substring(start,end);
    }
    start = index + 1;
    end = original.length;
    if(start >= original.length)
    {
        after = ""
    }
    else
    {
        after = original.substring(start,end)
    }
    var result = before + value.toString() + after;
    return result;
};

//格式化时间(毫秒)
StringUtils.formatTimer = function (value)
{
    var hour = Math.floor(value / 3600000);
    var minuter = Math.floor((value - (hour * 3600000)) / 60000);
    var second = Math.floor((value - (hour * 3600000) - (minuter * 60000)) / 1000);
    var result = "";
    if(hour >= 0)
    {
        if(hour.toString().length < 2)
        {
            result += "0" + hour + ":";
        }
        else
        {
            result += hour + ":";
        }
    }
    if(minuter >= 0)
    {
        if(minuter.toString().length < 2)
        {
            result += "0" + minuter + ":";
        }
        else
        {
            result += minuter + ":";
        }
    }
    if(second >= 0)
    {
        if(second.toString().length < 2)
        {
            result += "0" + second;
        }
        else
        {
            result += second;
        }
    }
    return result;
}

StringUtils.getUnitNumber = function( num )
{
    var n = Number(num);
    if( n == 0 ) return 0;
    var v = n;
    var str = "";
    if( v > 999 )
    {
        v = num*0.001;
        str = "K";
    }
    if( v >= 1000 )
    {
        v = v * 0.001;
        str = "M";
    }
    if( v >= 1000 )
    {
        v = v * 0.001;
        str = "G";
    }
    if( v >= 1000 )
    {
        v = v * 0.001;
        str = "T";
    }

    if(v > 999 )
        v = Math.floor(v*10)/10;
    else
        v = Math.floor(v);

    return v + str;
}


StringUtils.getStringLength = function( str )
{
    if( str == ""  || str == null )
    {
        return 0;
    }

    var num = str.length;
    var len = 0;
    for ( var i = 0; i < num; i++ )
    {
        var n = str.charCodeAt(i);
        if (n < 128)
        {
            len += 0.5;
        }
        else
        {
            len += 1;
        }
    }

    return len;
}


StringUtils.getChatTime = function( time )
{
    var date=new Date(time);
    var str=date.getHours()+":"+(date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes())+":"+(date.getSeconds()<10?("0"+date.getSeconds()):date.getSeconds());
    return str;
}