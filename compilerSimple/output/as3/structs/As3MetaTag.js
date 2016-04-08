/**
 * Created by mengj_000 on 2015/4/21.
 * 元标签
 * 比如[SWF(width="960",height="640")]
 *
 * list = [{name:"wdith",val:"960",val:"640"}];
 *
 * type和subType
 *
 * SWF
 * 1: {
 * }
 *
 * Embed
 * 2: {
 *   1:图片
 *   2:字符串
 * }
 *
 *
 *
 *
 */

var As3Type = global.As3Type;

function As3MetaTag(name,atrs)
{
    //名称
    this.name = name; //例如SWF,Embed
    //属性
    this.list = atrs==null?[]:atrs; //属性，例如width="960"
    this.list = this.list.reverse();
    for(var i = 0; i < this.list.length; i++)
    {
        if(this.list[i].val)
        this.list[i].val = this.list[i].val.slice(1,this.list[i].val.length-1);
    }

    this.packageURL = "";
    //console.log("元标签:",this.name,this.list);
}

/**
 * 分析元标签内容
 */
As3MetaTag.prototype.getContent = function()
{
    this.type = 0;
    this.subType = 0;

    //SWF
    this.width = 0;
    this.height = 0;

    //Embed
    this.sourceName = "";
    this.source = "";
    this.mimeType = "";
    this.classType = null;//隐藏类型

    if(this.name == "SWF")
    {
        this.type = 1;
        for(var i = 0; i < this.list.length; i++)
        {
            if(this.list[i].name == "width") this.width = parseInt(this.list[i].val);
            if(this.list[i].name == "height") this.height = parseInt(this.list[i].val);
        }
    }
    var pkglen = this.packageURL==""?0:this.packageURL.split(".").length;
    if(this.name == "Embed" || this.name == "EMBED")
    {
        this.type = 2;
        for(var i = 0; i < this.list.length; i++)
        {
            if(this.list[i].name == "source")
            {
                var end = this.list[i].val;
                end = end.split(".")[end.split(".").length-1];
                if(end == "JPG" || end == "PNG" || end == "jpg" || end == "png")
                {
                    this.subType = 1;
                    this.classType = new As3Type(0,"flash.display.Bitmap");
                }
                this.source = this.sourceName = this.list[i].val;
                var len = pkglen;
                var first = 0;
                if(len == 0)
                {
                }
                else
                {
                    for(var c = 0; c < this.source.length; c++)
                    {
                        if(this.source.charAt(c) == "/")
                        {
                            if(this.source.slice(first,c) == ".")
                            {
                                first = c + 1;
                            }
                            else
                            {
                                first = c + 1;
                                len--;
                                if(len == 0)
                                {
                                    this.source = this.source.slice(first,this.source.length);
                                    break;
                                }
                            }
                        }
                    }
                }
                //console.log(this.sourceName ," : ",this.source);
            }
            else if(this.list[i].name == "mimeType")
            {
                if(this.list[i].val == "application/octet-stream")
                {
                    this.subType = 2;
                    this.classType = new As3Type(0,"String");
                }
            }
        }
    }
}

As3MetaTag.prototype.setPackageURL = function(url,fileURL)
{
    this.packageURL = url;
    //console.log("设置包路径,",url);
    this.getContent();
    if(this.type == 0)
    {
        var str = "[" + this.name + "(";
        for(var i = 0; i < this.list.length; i++)
        {
            str += this.list[i].name + "=" + this.list[i].val + (i<this.list.length-1?",":"");
        }
        str += ")]";
        //console.log("无法识别的元标签,",fileURL,":",str);
    }
}

As3MetaTag.prototype.printTS = function(before,cls)
{
    return "";
}

global.As3MetaTag = As3MetaTag;