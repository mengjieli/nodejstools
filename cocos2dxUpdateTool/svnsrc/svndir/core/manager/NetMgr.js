
/*
 * 网络管理器
 * 负责网络消息处理
 */

NetEvent = {};
NetEvent.socket = {};
NetEvent.socket.SOCKET_CONNECT = "net_socket_connect";
NetEvent.socket.SOCKET_CLOSE = "net_socket_close";

NetEvent.socketType = {};
NetEvent.socketType.WEB = 1;
NetEvent.socketType.TCP = 2;
NetEvent.socketType.HTTP = 3;

var NetMgr = function ()
{

    var _me = this;
    var _event = null;                  //事件对像
    var _tcpSocket = null;              //tcpsocket
    var _webSocket = null;              //
    var _isConnection = false;
    var _encoding = "byte"; 	        //套接字的编码,默认为文本,文本:text,字节:byte

    function init ()
    {
        _event = new EventDispatcher();
    }

    this.destroy = function()
    {
        _event = null;
        this.closeWebScoket();
        NetMgr.instance = null;
    }

    this.connectTcpSocket = function ( ip , port )
    {
        if ( cc.sys.isNative )
        {

        }
    }

    this.connectWebSocket = function ( url )
    {
        _webSocket = null;//把之前创建那个置为null
        _webSocket = new WebSocket ( url );

        _webSocket.onopen = function ( evt )
        {
            _isConnection = true;

            cc.log("webSocket " +  url + " 连接成功");
            _event.dispatchEvent( NetEvent.socket.SOCKET_CONNECT, NetEvent.socketType.WEB );
        };

        _webSocket.onmessage = function ( evt )
        {
            if( !cc.sys.isNative && evt.data instanceof Blob )
            {
                //cc.log( "Blob" );
                var reader = new FileReader();
                reader.onloadend = function()
                {
                    receiveArrayBuffer( this.result );
                }
                reader.readAsArrayBuffer(evt.data);
            }
            else if( cc.sys.isNative && evt.data instanceof ArrayBuffer  )
            {
                //cc.log( "ArrayBuffer" );
                receiveArrayBuffer( evt.data );
            }
            else if( typeof(evt.data) == "string" )
            {
                //cc.log( "String" );
                //cc.log( evt.data );
                var msgData = null;
                msgData = JSON.parse ( evt.data );
                if ( msgData == null ) return;
                dispatchMessage( msgData.cmd, msgData );
            }


        };

        _webSocket.onerror = function ( evt )
        {
            cc.log( "websocket出错" + evt.data );
        };

        _webSocket.onclose = function ( evt )
        {
            cc.log( "websocket关闭" + evt.code );
            if( _webSocket == this )
            {
                _webSocket = null;
                _isConnection = false;
                if( _event )_event.dispatchEvent( NetEvent.socket.SOCKET_CLOSE, NetEvent.socketType.WEB );
            }
        };
    }

    this.closeWebScoket = function ()
    {
        if( _webSocket )
        {
            _webSocket.close();
            _webSocket = null;
        }
    }

    this.closeTcpSocket = function()
    {
        if( _tcpSocket )
        {
            _tcpSocket.close();
            _tcpSocket = null;
        }
    }


    this.setEncoding = function ( encoding )
    {
        _encoding = encoding;
    }

    //发送消息
    //obj 要发送的数据
    //type 发送类型 1:websocket,2:tcp,3:http

    this.send = function ( obj , type )
    {
        switch ( type )
        {
            case NetEvent.socketType.WEB:
                this.sendWebSocket ( obj );
                break;
            case NetEvent.socketType.TCP:
                this.sendTcp ( obj );
                break;
            case NetEvent.socketType.HTTP:
                this.sendHttp ( obj.url , obj.params , obj.isPost , obj.callback , obj.errorcallback );
                break;
            default:
                this.sendWebSocket ( obj );
                break;
        }
    }


    this.sendWebSocket = function ( obj )
    {
        if(_isConnection == false)
        {
            //ReconnectionManager.getInstance().reConnection(obj);
            return;
        }
        if( _encoding == "text" )
        {
            _webSocket.send ( JSON.stringify ( obj ) );
        }
        else if( _encoding == "byte" )
        {
            obj.setPosition(0);
            var cmd = obj.readUint();
            //cc.log("发送消息:   cmd:" + cmd + "　消息长度: " + obj.getLength() );
            _webSocket.send( obj.getArrayBuffer() );
        }
    }

    //发送tcp
    this.sendTcp = function ( obj )
    {

    }

    //发送http信息
    //2015-10-15 by shenwei 添加附带数据流类型
    this.sendHttp = function ( url , params , isPost , callback , errorcallback,callBackParams, contentType)
    {
        if ( url == null || url == '' )
            return;

        var xhr = cc.loader.getXMLHttpRequest ();
        if ( isPost )
        {
            xhr.open ( "POST" , url, true );
            if(!contentType)
            {
                contentType = "application/x-www-form-urlencoded";
            }
            xhr.setRequestHeader ( "Content-Type",contentType );
        } else
        {
            xhr.open ( "GET" , url, true );
        }

        xhr.onloadend = function()
        {
            if ( xhr.status != 200 )
            {
                var response = xhr.responseText;
                if ( errorcallback )
                {
                    errorcallback ( url,response );
                }
            }
        }

        xhr.onreadystatechange = function ()
        {
            if ( xhr.readyState == 4 && xhr.status == 200 )
            {
                var response = xhr.responseText;
                var objData = JSON.parse( JSON.stringify(response) );
                if( objData && objData.cmd )
                {
                    dispatchMessage( objData.cmd, objData );
                }
                if ( callback )
                {
                    callback ( objData,callBackParams);
                }
            }
            else if ( xhr.readyState == 4 && xhr.status != 200 )
            {
                var response = xhr.responseText;
                if ( errorcallback )
                {
                    errorcallback ( url,response );
                }
            }
        };

        if ( params == null || params == "" )
        {
            xhr.send ();
        }
        else
        {
            xhr.send ( params );
        }
    }

    /*
     * 注册事件
     * eventName：事件key
     * eventFun ：事件函数
     * obj		：事件对像
     */
    this.addEventListener = function ( eventName , eventFun , obj )
    {
        //找出事件列表，没有就创建
        _event.addEventListener( eventName, eventFun, obj );
    }
    this.dispatchEvent = function( eventName )
    {
        _event.dispatchEvent.apply( _event, arguments );
    }
    /*
     * 删除事件
     * eventName：事件key
     * eventFun ：事件函数
     * obj		：事件对像
     */
    this.removeEventListener = function ( eventName , eventFun , obj )
    {
        _event.removeEventListener( eventName, eventFun, obj );

    }

    /*
     * 重置事件列表
     */
    this.resetEventList = function ()
    {
        _event.resetEventList();

    }

    /*
     * 是否连接网络
     */
    this.isConnection = function ()
    {
        return _isConnection;
    }

    var receiveArrayBuffer = function( arrayBuff )
    {
        //var buff = new SocketBytes();
        //buff.initBuffer( arrayBuff );
        //var cmd = buff.readUint();
        //cc.log( "收到消息:   cmd:" + cmd + "　消息长度: " + buff.getLength() );
        //dispatchMessage( cmd, buff );
        var buff = new SocketBytes();
        buff.initBuffer( arrayBuff );
        var cmd = buff.readUint();

        var str = "收到消息:   cmd:" + cmd + "　消息长度: " + buff.getLength() + "   当前游标:" + buff.getPosition();
        if( arrayBuff.byteLength <= 200 )
        {
            str +=  "  [";
            var numbers = new Uint8Array( arrayBuff );

            for (var i=0; i<numbers.length; i++)
            {
                str += numbers[i] + ",";
            }
            if( arrayBuff.byteLength > 200 )  str += "......";

            str +=  "]";
        }
        cc.log(  str );

        dispatchMessage( cmd, buff );

    }

    /*
     * 处理收到的网络消息。并分发出去
     * cmd： 消息ID
     * msgData： 消息数据
     */
    function dispatchMessage ( cmd , msgData )
    {
        _event.dispatchEvent.apply ( _event , arguments );
    }

    init ();
}


NetMgr.instance = null;
NetMgr.inst = function ()
{
    if ( NetMgr.instance == null )
    {
        NetMgr.instance = new NetMgr ();
    }
    return NetMgr.instance;
}