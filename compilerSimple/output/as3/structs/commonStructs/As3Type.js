/**
 * Created by mengj_000 on 2015/4/20.
 */

/*
 defineTypeValue : simpleTypeValue {node.expval = {"type":1,"name":nodes[0].expval\};}  //类型
 | '*'  {node.expval = {"type":0\};}
 |'Vector' '.' '<' '*' '>' {node.expval = {"type":2,"name":nodes[4].expval\};}
 |'Vector' '.' '<' simpleTypeValue '>' {node.expval = {"type":2,"name":nodes[3].expval\};}
 simpleTypeValue : simpleTypeValue '.' id {node.expval = nodes[0].expval + "." + nodes[2].value.name;}  //表示Sprite 或者 flash.display.Sprite这样的类名
 | id {node.expval = nodes[0].value.name;}
 {type:0} //*任何类型
 {type:1,name:"ClassName"}  //简单类型，例如Int {type:1,name:"Int"}
 //例如com.jc.ui.utils.DelayCall{type:1,name:com.jc.ui.utils.DelayCall}
 {type:2,name:"ClassName"}  //Vector.<ClassName> 类型
 {type:3}  //void 类型，函数的返回类型专用
 {type:4} //表示函数的剩余参数的类型
 */

var Log = global.Log;

function As3Type(type,name)
{
    this.type = type;
    this.name = name;
    this.changeTypeFlag = false;
    this.findImport = false;
}

As3Type.prototype.clone = function()
{
    var type = new As3Type(this.type,this.name);
    type.changeTypeFlag = this.changeTypeFlag;
    return type;
}

As3Type.prototype.changeVarType = function(impts)
{
    this.changeTypeFlag = true;
    if(this.type == 1 || this.type == 2)
    {
        if(impts[this.name] != undefined)
        {
            this.name = impts[this.name];
            this.findImport = true;
        }
    }
}

As3Type.prototype.printTS = function(before,cls,initName)
{
    if(this.changeTypeFlag == false)
    {
        this.changeVarType(cls.importClass);
    }
    var str;
    if(this.type == 0) str = "any";
    else if(this.type == 1)
    {
        str = this.name;
        //str = cls.getClassAllName(this.name);
        if(str == "*") str = "any";
        else if(str == "Array") str = "Array<any>";
        else
        {
            str = cls.mgr.changeClassName(str);
            if(str.slice(0,6) == "flash.")
            {
                Log.apilog(1,this.debug.file,this.tokenPos,this.name);
                //Log.log("没有对应的类映射" + this.name + ",文件" + cls.allName + "," + Log.getFilePos(this.debug.file,this.tokenPos),2,1,this.name);
            }
        }
        //if(As3Type.transTypeName[this.name]) str = As3Type.transTypeName[this.name];
        //else str = this.name;
    }
    else if(this.type == 2)
    {
        str = this.name;

        if(str == "*") str = "any";
        else
        {
            str = cls.mgr.changeClassName(str);
            if(str.slice(0,6) == "flash.")
            {
                Log.apilog(1,this.debug.file,this.tokenPos,this.name);
                //Log.log("没有对应的类映射" + this.name + ",文件" + cls.allName + "," + Log.getFilePos(this.debug.file,this.tokenPos),2,1,this.name);
            }
        }
        str = "Array<" + str + ">";
        //if(As3Type.transTypeName[this.name]) str = "Array<" + (As3Type.transTypeName[this.name]=="*"?"any":As3Type.transTypeName[this.name]) + ">";
        //else str = "Array<" + (this.name=="*"?"any":this.name) + ">";
    }
    else if(this.type == 3) str = "";
    if(initName)
    {
        if(this.type == 1 && this.name == "Object") str = "any";
    }
    if(global.packageCut && str.split(".").length > 2) {
        str = str.split(".")[0] + "." + str.split(".")[str.split(".").length-1];
    }
    return str;
}

As3Type.create = function(str,show)
{
    var type;
    var name;
    if(str.slice(0,6) == "Vector" || str == "Vector")
    {
        type = 2;
        if(str == "Vector")
        {
            name = "*";
        }
        else
        {
            name = str.slice(str.search("<") + 1,str.search(">"));
        }
    }
    else
    {
        if(str == "*")
        {
            type = 0;
        }
        else if(str == "void")
        {
            type = 3;
        }
        else
        {
            type = 1;
            name = str;
            if(name == "") name = "*";
        }
    }
    return new As3Type(type,name);
}

global.As3Type = As3Type;
