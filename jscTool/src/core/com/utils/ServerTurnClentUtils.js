/**
 * Created by zhouyulong on 2015/5/22.
 * 把服务器消息转换成客户端Object对象类
 */
var ServerTurnClentUtils = cc.Class.extend({

});

ServerTurnClentUtils.uint = 0;
ServerTurnClentUtils.string = 1;
ServerTurnClentUtils.repeat = 2;
ServerTurnClentUtils.sint = 4;

ServerTurnClentUtils.turn = function(data,params)
{
    if(params.length > 0)
    {
        if(params.length % 2 != 0)
        {
            cc.error("ServerTurnClentUtils.turn传参数数量不匹配:");
            return;
        }

        var a = 0;
        var obj = {};
        while(a < params.length)
        {
            var key = params[a];
            var type = params[a + 1];
            if(type != ServerTurnClentUtils.repeat)
            {
                var arr = [];
                obj[key]
            }
            else
            {
                obj[key] = ServerTurnClentUtils.read(data,type);
            }
            a += 2;
        }
    }
};

ServerTurnClentUtils.read = function(data,type)
{
    var value;
    switch (type)
    {
        case ServerTurnClentUtils.repeat:
        case ServerTurnClentUtils.uint:
            value = data.readUint();
            break;
        case ServerTurnClentUtils.string:
            value = data.readString();
            break;
        case ServerTurnClentUtils.sint:
            value = data.readInt();
            break;
    }

    return value;
};
