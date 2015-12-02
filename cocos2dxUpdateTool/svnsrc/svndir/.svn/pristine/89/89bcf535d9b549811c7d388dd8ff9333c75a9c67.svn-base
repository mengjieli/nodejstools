/**
 * Created by Administrator on 2015/11/12.
 */
/**
 * Created by Administrator on 2015/11/12.
 */


var RichType = {};

RichType.text  = 0;
RichType.image = 1;
RichType.link = 2;

var NodeItem = function()
{
    this.type = 0;				//类型
    this.node = null;		//显示组件
};

var MailTextControl = cc.Node.extend({

    _width:0,					//控件高度
    _space:1, 					//行与行之间间距
    _textFont:"微软雅黑",
    _color:null,
    _textSize:15,
    _itemList:null,
    _nodeList:null,
    _offsetWidth:0,
    _line:0,
    _lineHeights:null,
    _defaultENW:0,          //默认英文宽
    _defaultCNW:0,          //默认中文宽
    _defaultH:0,            //默认高

    ctor : function(textFont,color,textSize,width)
    {
        this._super();

        this.initData();
        this._width = width;
        if( textFont != undefined )this._textFont = textFont;
        this._color = color;
        this._textSize = textSize;

        var text = cc.LabelTTF.create( "A", this._textFont, this._textSize );
        this._defaultH = text.getContentSize().height;
        this._defaultENW = text.getContentSize().width;
        var text = cc.LabelTTF.create( "中", this._textFont, this._textSize );
        this._defaultCNW = text.getContentSize().width;

    },

    initData:function()
    {
        this._itemList = [];
        this._nodeList = [];
        this._lineHeights = {};
        this._line = 0;
        this._offsetWidth = 0;
    },

    //设置文本
    setText:function( strText )
    {
        this.initData();
        this.removeAllChildren();
        this.pushText( strText );
    },

    pushText:function( strText )
    {
        var cn = cc.LabelTTF.create( "中", this._textFont, this._textSize).getContentSize();
        var en = cc.LabelTTF.create( "A", this._textFont, this._textSize).getContentSize();
        var item = {};
        item.type = 0;
        item.text = strText;							//文本内容
        item.fontName 			= this._textFont;		//字体名称
        item.fontSize 			= this._textSize;		//字体大小
        item.color 				= this._color;			//字体颜色
        item.cnW = cn.width;
        item.enW = en.width;
        item.h = cn.height;

        this.handleText( item );
    },

    //解析元系
    pushItem:function( item )
    {
        //str, fontName, fontSize, cor
    },

    handleText:function( item )
    {
        var str = item.text;
        var fontName = item.fontName;
        var fontSize = item.fontSize;
        var cor = item.color;

        var text = null;
        var splitText = "\n";
        while( str.length )
        {

            var starIndex = str.indexOf(splitText);
            if(starIndex == 0)
            {
                if( this._width != 0 ) this.newline();
                starIndex = splitText.length;
            }
            else
            {
                starIndex = 0;
            }
            var ch = str.slice(starIndex);
            var index = str.indexOf(splitText, starIndex);
            if(index != -1 )
            {
                ch = str.slice(starIndex, index );
                str = str.slice( index, str.length );
            }
            else str = "";

            var w = ch.length * item.cnW;
            if( this._width != 0 &&  w > this._width)
            {
                var textWidth = this._offsetWidth;
                var end = 0;
                for( var i=0; i<ch.length; i++ )
                {
                    var enAscii = ch.charCodeAt(i);
                    var strW = item.cnW;
                    if( enAscii >= 32 && enAscii <= 126 )
                    {
                        strW = item.enW;
                    }
                    textWidth += strW;
                    if(textWidth > this._width)
                    {
                        end = i;
                        break;
                    }
                }
                if( end == 0 )end = ch.length;
                var starText = ch.slice(0, end);
                var endText = ch.slice(end, ch.length);
                if(starText.length > 0)
                {
                    var text = cc.LabelTTF.create( starText, fontName, fontSize );
                    text.setColor( cor );
                    var node = new NodeItem();
                    node.type = RichType.text;
                    node.node = text;
                    this.pushNode( RichType.text, node );
                }
                if(endText.length > 0)
                {
                    var nextItem = {};
                    nextItem.type = 0;
                    nextItem.text = endText;							//文本内容
                    nextItem.fontName 			= this._textFont;		//字体名称
                    nextItem.fontSize 			= this._textSize;		//字体大小
                    nextItem.color 				= this._color;			//字体颜色
                    nextItem.cnW = item.cnW;
                    nextItem.enW = item.enW;
                    nextItem.h = item.h;

                    this.newline();
                    this.handleText( nextItem );
                }
            }
            else
            {
                var text = cc.LabelTTF.create( ch, fontName, fontSize );
                text.setColor( cor );
                var node = new NodeItem();
                node.type = RichType.text;
                node.node = text;
                this.pushNode( RichType.text, node);
            }
        }
    },

    newline:function()
    {
        this._line ++;
        this._offsetWidth = 0;
    },

    pushNode:function( type, node )
    {
        node.node.setAnchorPoint(cc.p(0, 1.0));
        node.node.setPosition( cc.p( this._offsetWidth, this.getLineHeight(this._line) ) );

        this._offsetWidth += node.node.getContentSize().width;
        var h = node.node.getContentSize().height;
        this.setLineHeight( this._line, h );

        this._nodeList.push( node );
        this.addChild(node.node);
    },

    setLineHeight:function( line, value )
    {
        var v = this._lineHeights[ line ] != null ? this._lineHeights[ line ] : 0;
        if(value > v)
        {
            this._lineHeights[ line ] = value;
        }
    },

    getLineHeight:function( line )
    {
        var num = 0;
        for( var i=0; i<line; i++)
        {
            var h = this._lineHeights[i] != null ? this._lineHeights[i] : this._defaultH;
            num += h + this._space;
        }
        return -num;
    },

    getHeight:function()
    {
        var num = 0;
        for( var i=0; i<=this._line; i++)
        {
            var h = this._lineHeights[i] != null ? this._lineHeights[i] : this._defaultH;
            h = h + this._space;
            num += h;
        }
        return num;
    },

    getWidth:function()
    {
        var w = this._width;
        if( w == 0 )
        {
            for( var i in this._nodeList )
            {
                var node = this._nodeList[i];
                w += node.node.getContentSize().width;
            }
        }
        return w;
    },

});