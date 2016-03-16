/**
 * Created by mengj_000 on 2015/4/21.
 * 属性项
 */

var As3Type = global.As3Type;
var Log = global.Log;

function As3ExprAtrItem(type,val,val2,val3) {
    //属性项类型
    this.type = type;
    //值
    this.val = val;
    //第二个值
    this.val2 = val2;
    //第三个值
    this.val3 = val3;
}

As3ExprAtrItem.prototype.printTS = function(before,cls,info,start,atr)
{
    info.lastLastString = info.lastString;
    info.lastString = info.str;
    var trans;
    //注意Vector.<Sprite>[0].addChild 之类的转换
    if(this.type == "()")
    {
        var str = this.val.printTS(before,cls);
        info.type = new As3Type(0);//this.val.type;
        //console.log("(expr)调用后:",str,this.val);
        if(str.slice(str.length-2,str.length) == "\r\n") str = str.slice(0,str.length-2);
        info.str = info.str  + "(" +  str + ")";
        //console.log("进入()",start,info.str);
    }
    if(this.type == "new")
    {
        if(this.val.type == 1 && cls.importClass[this.val.name] == undefined)
        {
            var clsInfo = cls.data;
            var mb;
            var hasThis = false;
            if(this.val.name.slice(0,5) == "this.")
            {
                var arr = this.val.name.split(".");
                mb = clsInfo.getMember(arr[1]);
                hasThis = true;
            }
            else
            {
                mb = clsInfo.getMember(this.val.name);
            }
            if(mb) //如果是类变量
            {
                info.type = mb.type;
                if(mb.metaTag && mb.metaTag.type == 2)
                {
                    if(mb.metaTag.subType == 1)
                    {
                        if(hasThis)
                            info.str = "new " + this.val.name;
                        else
                            info.str = "new this." + this.val.name;
                        info.str += "(LoadingUI.getEmbedBitmapData(\"" + mb.metaTag.source + "\"))";
                    }
                    else if(mb.metaTag.subType == 2)
                    {
                        info.str = "LoadingUI.getEmbedBitmapData(\"" + mb.metaTag.source + "\")";
                    }
                }
                else
                {
                    info.str += "(" + (this.val2?this.val2.printTS("",cls):"") + ")";
                }
            }
            else
            {
                if(cls.mgr.class[this.val.name] != undefined && cls.mgr.class[this.val.name].class)
                {
                    info.type = new As3Type(1,this.val.name);
                    this.val.name = cls.mgr.transTable.changeClassName(this.val.name);
                    info.str = "new " + this.val.name + (this.val3?"(" + (this.val2?this.val2.printTS("",cls):"") + ")":"");
                }
                else
                {
                    var atype;
                    if(cls.functionStack.length) atype = cls.functionStack[cls.functionStack.length - 1].getVarType(this.val.name);
                    if(cls.functionStack.length && atype != null)
                    {
                        info.type = atype;
                        info.static = false;
                    }
                    else
                    {
                        Log.apilog(1,this.val.debug.file,this.val.tokenPos,this.val.name);
                    }
                    info.str = info.str + "new " + this.val.printTS("",cls) + (this.val3?"(" + (this.val2?this.val2.printTS("",cls):"") + ")":"");
                    info.type = new As3Type(0);
                    //Log.log("无法识别的类型(new语句)" + this.val.name + ",文件" + cls.allName + "," + Log.getFilePos(this.val.debug.file,this.val.tokenPos),1,2,cls.allName);
                }
            }
        }
        else
        {
            this.val.changeVarType(cls.importClass);
            if(this.val.type == 1 && this.val.name == "string")
            {
                var pstr = (this.val2?this.val2.printTS("",cls):"");
                if(pstr == "") info.str = info.str + "\"\"";
                else info.str = info.str + pstr;
            }
            else
                info.str = info.str + "new " + this.val.printTS("",cls) + "(" + (this.val2?this.val2.printTS("",cls):"") + ")";
            info.type = this.val;
            if(cls.mgr.class[this.val.name] == undefined || cls.mgr.class[this.val.name].class == undefined)
            {
                var atype;
                if(cls.functionStack.length) atype = cls.functionStack[cls.functionStack.length - 1].getVarType(this.val.name);
                if(cls.functionStack.length && atype != null)
                {
                    info.type = atype;
                    info.static = false;
                }
                else
                {
                    Log.apilog(1,this.val.debug.file,this.val.tokenPos,this.val.name);
                }
            }
            //console.log(this.val.name,info.type.name);
        }

        //if(info.str == "new Object()") info.str = "{}";
    }
    if(this.type == "new ()")
    {
        info.str = info.str + "new (" + this.val.printTS("",cls) + ")(" + (this.val2?this.val2.printTS("",cls):"") + ")";
        info.type = As3Type(0);

        //if(info.str == "new Object()") info.str = "{}";
        //Log.log("无法识别的类型(new语句),文件" + cls.allName + "," + Log.getFilePos(this.val.debug.file,this.val.tokenPos),1);
    }
    if(this.type == ".") {
        var dicflag = false;
        var xmlflag = false;
        var changeFlag = false;
        //if(!this.val) console.log("马勒戈壁？",cls.currentFunction.name,this);
        //if(this.val.type == "baseValue" && this.val.val == "dispose" && cls.currentFunction && cls.currentFunction.name == "createBitmap") console.log(info.type.type,info.type.name);
        //console.log(cls.name,this.val.type,global.Log.getFilePos(this.val.debug.file,this.val.tokenPos),this.val.debug.file.slice(this.val.tokenPos,this.val.tokenPos + 20));
        if (info.type.type == 1 && info.type.name == "flash.utils.Dictionary") {
            dicflag = true;
            info.dicstr = info.str;
        }
        if (info.type.type == 1 && info.type.name == "flash.display.MovieClip") {
            changeFlag = true;
        }
        if (info.type.type == 1 && info.type.name == "XML") {
            xmlflag = true;
            info.dicstr = info.str;
        }
        info.before = info.str;
        info.str = "";
        this.val.printTS("", cls, info);
        if(info.type.type == 1 && info.varchange)
        {
            changeFlag = true;
        }
        //console.log("进入.",start,info.str);
        if(dicflag)
        {
            info.dicparams = "\"" + info.str + "\"";
            info.str = info.dicstr + ".getAttributeList(" + info.dicparams + ")";
        }
        else if(xmlflag)
        {
            info.dicparams = "\"" + info.str + "\"";
            info.str = info.dicstr + ".child(" + info.dicparams + ")";
        }
        else
        {
            if(info.before != "") {
                if(changeFlag)
                {
                    info.str = info.before + "[\"" + info.str + "\"]";
                }
                else
                {
                    info.str = info.before + "." + info.str;
                }
            }
            else
                info.str = info.str;
        }
        if(info.type.type == 0)
        {
            //如果是某个包类
            if(cls.mgr.class[info.str])
            {
                if(cls.mgr.class[info.str].class)
                {
                    info.type = new As3Type(1,info.str);
                    info.str = cls.mgr.transTable.changeClassName(info.str);
                }
                else if(cls.mgr.class[info.str].function)
                {
                    info.type = new As3Type(1,"Function");
                    info.str = cls.mgr.transTable.changeSpecialFunction(info.str);
                }
            }
        }
        //if(cls.name == "TweenLite" && cls.currentFunction && cls.currentFunction.name == "setEnabled") console.log("属性",info.str);
    }
    if(this.type == ".@")
    {
        info.str = info.str + ".attribute(\"" + this.val.val + "\")";
        info.type = new As3Type(1,"XMLList");
    }
    if(this.type == "..")
    {
        info.str = info.str + ".dotAt(\"" + this.val.val + "\")";
        info.type = new As3Type(1,"XMLList");
    }
    if(this.type == ".@[]")
    {
        info.str = info.str + ".attribute(" + this.val.printTS("",cls,info) + ")";
        info.type = new As3Type(1,"XMLList");
    }
    if(this.type == "[]")
    {
        if(info.type.type == 1 && info.type.name == "flash.utils.Dictionary")
        {
            info.dicstr = info.str;
            info.dicparams = this.val.printTS("",cls);
            info.str = info.dicstr + ".getItem(" + info.dicparams + ")";
        }
        else
        {
            info.str = info.str + "[" + this.val.printTS("",cls) + "]";
        }
        if(info.type.type == 2)
        {
            info.type = new As3Type(1,info.type.name);
        }
        else
        {
            info.type = new As3Type(0);
        }
    }
    if(this.type == "call")
    {
        info.before = info.str;
        if(info.last)
        {
            if(info.last.class != "")
            {
                trans = cls.mgr.transTable.getClassMemberVar(info.last.class,info.last.name);
            }
            else
            {
                trans = cls.mgr.transTable.getSpecialFunction(info.last.name);
            }
        }
        if(trans)
        {
            if(trans.tparams.length)
            {
                if(info.last && info.last.subType == "var") info = info.str + ".apply(null,[";
                else info.str = info.str + "(";
                var pstr;
                var param;
                var checkBind = true;
                for(var i = 0; i < trans.tparams.length; i++)
                {
                    if(trans.tparams[i] == "0")
                    {
                        checkBind = false;
                    }
                    else if(trans.tparams[i] == "1")
                    {
                        if(info.before == "") info.str += info.del + ",";
                        else info.str += info.before + ",";
                    }
                    else if(trans.tparams[i].charAt(0) == "b")
                    {
                        var ss;
                        var num = parseInt(trans.tparams[i].slice(1,trans.tparams[i].length)) - 1;
                        if(num == -1)
                        {
                            pstr = info.del;
                        }
                        else
                        {
                            param = this.val.list[num];
                            ss = param.printTS("",cls);
                            for(var s = ss.length; s >= 0; s--)
                            {
                                if(ss.charAt(s) == ".")
                                {
                                    pstr = ss.slice(0,s);
                                    break;
                                }
                                if(ss.charAt(s) == "[")
                                {
                                    pstr += ss.slice(0,s);
                                    break;
                                }
                            }
                        }
                        info.str += pstr + ",";
                    }
                    else
                    {
                        var num = parseInt(trans.tparams[i].slice(1,trans.tparams[i].length)) - 1;
                        if(num < this.val.list.length)
                        {
                            param = this.val.list[num];

                            pstr = param.printTS("",cls);

                            if(checkBind && param.type == "attribute" && param.exprType.type == 1 && param.exprType.name == "Function" && param.printInfo.last && param.printInfo.last.subType == "function")
                            {
                                //console.log("擦",pstr,param,ss);
                                var copy = pstr;
                                for(var c = copy.length; c>= 0; c--)
                                {
                                    if(copy.charAt(c) == "." || copy.charAt(c) == "[")
                                    {
                                        copy = copy.slice(0,c);
                                        break;
                                    }
                                }
                                info.str += pstr + ".bind(" + copy + ")" + ",";
                            }
                            else
                            {
                                info.str += pstr + ",";
                            }
                        }
                    }
                }
                if(info.str.charAt(info.str.length-1) == ",") info.str = info.str.slice(0,info.str.length-1);
                if(info.last && info.last.subType == "var") info = info.str + "])";
                else info.str += ")";
            }
            else
            {
                if(info.exprType == "class" )
                {
                    info.str = "(<" + info.str + ">" + this.val.printTS("",cls) + ")";
                }
                else
                {
                    if(info.last && info.last.subType == "var") info.str = info.str + ".apply(null,[" + this.val.printTS("",cls) + "])";
                    else info.str = info.str + "(" + this.val.printTS("",cls) + ")";
                }
            }
        }
        else
        {
            if(info.exprType == "class" )
            {
                info.str = "(<" + info.str + ">" + this.val.printTS("",cls) + ")";
            }
            else
            {
                if(info.last && info.last.subType == "var") info.str = info.str + ".apply(" + (info.lastLastString||"null") + ",[" + this.val.printTS("",cls) + "])";
                else info.str = info.str + "(" + this.val.printTS("",cls) + ")";
            }
        }
        if(info.last)
        {
            info.type = info.last.returnType;
        }
        else
        {
            info.type = new As3Type(0);
        }
    }
    if(this.type == "Vector call")
    {
        info.str = info.str + "new Array<" + this.val.printTS("",cls) + ">(" + this.val2.printTS("",cls) + ")";
        info.type = new As3Type(0);
    }
    info.str = info.str;
    this.exprType = info.type;
}

global.As3ExprAtrItem = As3ExprAtrItem;