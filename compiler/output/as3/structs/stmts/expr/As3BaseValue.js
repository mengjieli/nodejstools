/**
 * Created by mengj_000 on 2015/4/21.
 * 基本数据类型
 * id、int、0xint、number、string
 {type:1,name:"ClassName"}  //简单类型，例如Int {type:1,name:"Int"}
 //例如com.jc.ui.utils.DelayCall{type:1,name:com.jc.ui.utils.DelayCall}
 {type:2,name:"ClassName"}  //Vector.<ClassName> 类型
 {type:3}  //void 类型，函数的返回类型专用
 {type:4} //表示函数的剩余参数的类型
 */

var As3Type = global.As3Type;
var Log = global.Log;

function As3BaseValue(type,val)
{
    this.type = "baseValue"
    this.valtype = type;
    this.val = val;
    //表达式类型，临时计算
    this.exprType = null;
}

As3BaseValue.prototype.printTS = function(before,cls,info,start,atr)
{
    //if(cls.name == "TweenLite" && cls.currentFunction && cls.currentFunction.name == "setEnabled" && this.val == "masterList") console.log("找",info.str);
    //console.log(this.val,info);
    //console.log(cls.name,this.val);
    //console.log(cls.allName,global.Log.getFilePos(this.debug.file,this.tokenPos),this.val);
    info.varchange = null;
    info.last = null;
    if(info.type == null)
    {
        if(this.valtype == "string")
        {
            info.type = new As3Type(1,"String");
        }
        else if(this.valtype == "number")
        {
            info.type = new As3Type(1,"Number");
        }
        else if(this.valtype == "int" || this.valtype == "0xint")
        {
            info.type = new As3Type(1,"int");
        }
    }
    var needCheck = false;
    var begin = "";
    var end = "";
    var val = this.val;
    var trans;
    info.exprType = "value";
    if(this.valtype == "id")
    {
        if(start == true)
        {
            if(cls.currentFunction && this.val == "arguments")
            {
                cls.currentFunction.usearguments = true;
                val = this.val = "_arguments__";
            }
            if(cls.functionStack.length) type = cls.functionStack[cls.functionStack.length - 1].getVarType(this.val);
            if(cls.functionStack.length && type != null)
            {
                info.type = type;
                info.static = false;
            }
            else if(this.val == "this")
            {
                info.type = new As3Type(1,cls.allName);
                info.static = false;
            }
            else if(this.val == cls.name && !(atr.list.length > 1 && atr.list[1].type == "call"))
            {
                info.type = new As3Type(1,cls.allName);
                needCheck = false;
                info.static = true;
                val = cls.allName;
                //if(cls.name == "TweenLite" && cls.currentFunction && cls.currentFunction.name == "setEnabled" && this.val == "TweenLite") console.log(val);
            }
            else
            {
                var clsInfo = cls.data;
                var mb;
                mb = clsInfo.getMember(this.val);
                if(mb)
                {
                    //如果是类的变量
                    needCheck = true;
                    info.static = false;
                    info.type = new As3Type(1,clsInfo.name);
                }
                else
                {
                    mb = clsInfo.getStaticMember(this.val);
                    if(mb)
                    {
                        needCheck = true;
                        info.static = true;
                        info.type = new As3Type(1,mb.class);
                    }
                    else
                    {
                        //查看是否为某个包
                        var url = cls.getImport(this.val);
                        //if(cls.currentFunction == null && this.val == "OverwriteManager") console.log("嗯？",this.val,url);
                        if(url)
                        {
                            if(atr.list.length == 1)
                            {
                                info.type = new As3Type(1,url);
                                val = cls.mgr.transTable.changeClassName(url);
                            }
                            else
                            {
                                if(cls.mgr.class[url] && cls.mgr.class[url].class && url != "Array" && url != "Boolean"
                                    && url != "int" && url != "Number" && url!= "Object"
                                    && url != "String" && url != "uint" && url != "Vector"
                                    && url != "XML" && url!= "XMLList")
                                {
                                    info.exprType = "class";
                                }
                                if(info.exprType == "class" ||
                                    ((atr.list[1].type == "." &&  !(atr.list[1].valtype == "id" && (atr.list[1].val == "call" || atr.list[1].val == "apply")))|| atr.list[1].type == "[]"))
                                {
                                    info.type = new As3Type(1,url);
                                    info.static = true;
                                    needCheck = false;
                                    //进行类名转换
                                    val = cls.mgr.transTable.changeClassName(url);
                                }
                                else if(atr.list[1].type == "call")
                                {
                                    info.type = new As3Type(1,"Function");
                                    info.static = false;
                                    needCheck = false;
                                    if(cls.mgr.class[url] && cls.mgr.class[url].function) mb = cls.mgr.class[url].function;
                                    if(mb)
                                    {
                                        info.last = mb;
                                        trans = cls.mgr.transTable.getSpecialFunction(url);
                                        if(trans.delbefore)
                                        {
                                            info.del = info.before;
                                            info.before = "";
                                        }
                                        val = trans.tfunction;
                                        if(trans.exist == false) Log.apilog(4,this.debug.file,this.tokenPos,"",this.val);
                                    }
                                    else
                                    {
                                        //console.log("函数没有对应的解析啊？",this.val);
                                    }
                                }
                                else
                                {
                                    //console.log("有问题啊，这个判断！？",this.val);
                                }
                            }
                        }
                        else
                        {
                            if(this.val == "super")
                            {
                                clsInfo = clsInfo.super;
                                info.type = new As3Type(1,cls.allName);
                            }
                            else if(this.val == "_arguments__")
                            {
                                info.type = new As3Type(0,"Array");
                            }
                            else if(this.val == "Infinity")
                            {
                                info.type = new As3Type(0,"Number");
                            }
                            else if(this.val == "NaN" || this.val == "undefined")
                            {
                                info.type = new As3Type(0);
                            }
                            else
                            {
                                info.type = new As3Type(0);
                                if(cls.mgr.classbegin[this.val] == undefined)
                                    Log.apilog(1,this.debug.file,this.tokenPos,this.val);
                            }
                            //console.log("没有对应的解析",this.val);
                            //下面没有代码 !
                        }
                    }
                }
            }
        }

        if(info.type.type != 0 && (start != true ||  needCheck == true))
        {
            if(info.type.type == 1)
            {
                clsInfo = null;
                if(cls.mgr.class[info.type.name]) clsInfo = cls.mgr.class[info.type.name].class;
                if(clsInfo)
                {
                    var mb = clsInfo.getMember(this.val);
                    if(mb)
                    {
                        //if(this.val == "mouseEnabled") console.log(this.val,cls.name,cls.currentFunction.name,clsInfo.name,mb);

                        if(mb.namespace != "")
                        {
                            val = mb.namespace + "_" + val;
                        }

                        info.last = mb;
                        if(start) {
                            if (cls.functionStack.length <= 1) {
                                begin = "this.";
                            }
                        }
                        if(mb.subType == "function")
                        {
                            info.type = new As3Type(1,"Function");
                        }
                        else if(mb.subType == "var")
                        {
                            info.type = mb.type;
                        }
                        trans = cls.mgr.transTable.getClassMemberVar(mb.class,this.val);
                        if(trans == null)
                        {
                            //Log.apilog(3,this.debug.file,this.tokenPos,clsInfo.name,this.val);
                            //if(clsInfo.name.slice(0,6) == "flash") Log.apilog(3,this.debug.file,this.tokenPos,clsInfo.name,this.val);
                            //    console.log("没有对应的转换信息:",clsInfo.name + "." + this.val);
                        }
                        else
                        {
                            if(trans.delbefore)
                            {
                                info.del = info.before;
                                info.before = "";
                            }
                            if(trans.tvarchange)
                            {
                                if(begin == "this.")
                                {
                                    begin = "this[\"";
                                    end = "\"]";
                                }
                                info.varchange = true;
                            }
                            //console.log("转换信息:",trans);
                            if(trans.tvar != "")
                            {
                                val = trans.tvar;
                            }
                            else if(trans.tfunction != "")
                            {
                                val = trans.tfunction;
                            }
                            if(trans.exist == false) Log.apilog(4,this.debug.file,this.tokenPos,mb.class,this.val);
                        }
                    }
                    else
                    {
                        mb = clsInfo.getStaticMember(this.val);
                        if(mb)
                        {
                            if(mb.namespace != "")
                            {
                                val = mb.namespace + "_" + val;
                            }

                            info.last = mb;
                            if(start) begin = clsInfo.name + ".";
                            trans = cls.mgr.transTable.getClassMemberVar(info.type.name,this.val);
                            //if(cls.name == "TimeUtils" && this.val == "addEventListener") console.log("？",this.val,clsInfo.name);
                            if(mb.subType == "function")
                            {
                                info.type = new As3Type(1,"Function");
                                if(trans)
                                {
                                    if(trans.tvarchange)
                                    {
                                        info.varchange = true;
                                    }
                                    if(trans.delbefore)
                                    {
                                        info.del = info.before;
                                        info.before = "";
                                    }
                                    val = trans.tfunction;
                                    if(trans.exist == false) Log.apilog(4,this.debug.file,this.tokenPos,mb.class,this.val);
                                    //if(trans.)
                                }
                                else
                                {
                                    //console.log("没有对应的转换:",info.type.name+"."+this.val);
                                    //if(clsInfo.name.slice(0,6) == "flash.")
                                    //    console.log("没有对应的转换信息:",clsInfo.name + "." + this.val);
                                }
                            }
                            else //属性
                            {
                                info.type = mb.type;
                                if(trans)
                                {
                                    if(trans.tvarchange)
                                    {
                                        info.varchange = true;
                                    }
                                    if(trans.delbefore)
                                    {
                                        info.del = info.before;
                                        info.before = "";
                                    }
                                    val = trans.tvar;
                                    if(trans.exist == false) Log.apilog(4,this.debug.file,this.tokenPos,mb.class,this.val);
                                    //if(trans.)
                                }
                                else
                                {
                                    //console.log("没有对应的转换:",info.type.name+"."+this.val);
                                }
                                //if(this.val == "NUMERIC") console.log("好吧");
                            }
                        }
                        else
                        {
                            //即不是函数临时变量，也不是类的成员函数或变量
                            //判断是否为某个导入包
                            var url = cls.getImport(this.val);
                            if(url)
                            {
                                if(cls.mgr.class[url])
                                {
                                    if(cls.mgr.class[url].class && cls.mgr.class[url].function)
                                    {
                                        info.type = new As3Type(1,"Function");
                                    }
                                    else
                                    {
                                        info.type = new As3Type(1,"Function");
                                    }
                                }
                                else
                                {
                                    info.type = new As3Type(0);
                                    //console.log("没有对应的解析",this.val);
                                    //Log.apilog(1,this.debug.file,this.tokenPos,cls.name);
                                }
                            }
                            else
                            {
                                //即不是函数临时变量，也不是类的成员函数或变量
                                if(clsInfo.name != "flash.utils.Dictionary" && clsInfo.name != "flash.display.MovieClip" && clsInfo.name != "Object" && clsInfo.name != "XML" && clsInfo.name != "XMLList" && clsInfo.name != "Class")
                                {
                                    Log.apilog(3,this.debug.file,this.tokenPos,info.type.name,this.val);
                                }
                                info.type = new As3Type(0);
                            }
                        }
                    }
                }
                else
                {
                    //console.log("不存在的定义:" + info.type.name + "." + this.val);
                }
            }
            else if(info.type.type == 2)
            {
            }
        }
    }
    if(info.type == null) info.type = new As3Type(0);
    this.exprType = info.type;
    info.str = info.str + begin + val + end;
    //if(cls.name == "TweenLite" && cls.currentFunction && cls.currentFunction.name == "setEnabled" && this.val == "TweenLite") console.log(info.str,",",begin,",",val);
    //if(cls.name == "TweenLite" && cls.currentFunction && cls.currentFunction.name == "setEnabled" && this.val == "masterList") console.log(info.str,",",begin,",",val);
    //console.log("类型:",info.type," val=",this.val," str=",info.str);
}

As3BaseValue.prototype.printSimpleTS = function(before,cls)
{
    return this.val;
}

global.As3BaseValue = As3BaseValue;