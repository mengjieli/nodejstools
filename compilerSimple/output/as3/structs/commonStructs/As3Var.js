/**
 * Created by mengj_000 on 2015/4/20.
 */

function As3Var(pb,st,vf,param)
{
    this.public = pb;
    this.static = st;
    this.varFlag = vf;
    this.name = param.name;
    this.type = param.type;
    this.init = param.init;
    //元标签
    this.metaTag = null;
    this.namespace = "";
    if(this.public != "public" && this.public != "private" && this.public != "protected")
    {
        this.namespace = "_";// = this.public;
        this.public = "public";
    }
}

As3Var.prototype.clone = function()
{
    return new As3Var(this.public,this.static,this.varFlag,{"name":this.name,"type":this.type.clone(),"init":this.init});
}

As3Var.prototype.addMetaTag = function(tag)
{
    if(tag.type == 2)
    {
        this.metaTag = tag;
    }
}

As3Var.prototype.printTS = function(before,cls) {

    var str = before;
    if (this.static) str += "public ";
    else {
        str += {
            "public": "public",
            "protected": "public",
            "private": "private"
        }[(this.public)] + " ";
    }
    if (this.static) str += "static ";
    str += (this.namespace != ""?this.namespace + "_":"") + (this.name == "" ? "" : this.name);
    if (this.type)
    {
        str += ":" + this.type.printTS(before, cls,true);
    }
    else
    {
        str += ":any";
    }
    var initStmt = "";
    if (this.init) {
        var end = this.init.printTS(before, cls);
        if (this.init.type == "attribute" && this.init.exprType && this.init.exprType.type == 1 &&
            this.init.exprType.name == "Function" && this.init.printInfo.last && this.init.printInfo.last.subType == "function") {
            var copy = end;
            for (var c = copy.length; c >= 0; c--) {
                if (copy.charAt(c) == "." || copy.charAt(c) == "[") {
                    copy = copy.slice(0, c);
                    break;
                }
            }
            initStmt += " = " + end;
            //initStmt += " = " + end + ".bind(" + copy + ")";
        }
        else {
            initStmt += " = " + end;
        }
    }
    else
    {
        if(this.metaTag)
        {
            if(this.metaTag.type == 2 && this.metaTag.subType == 1)
            {
                initStmt = " = as3.Bitmap";
            }
        }
    }
    if(this.static && this.init)
    {
        cls.staticStmts += cls.allNameCut + "." + this.name + initStmt + ";\r\n";
    }
    else
    {
        str += initStmt;
    }
    if(this.init && this.init.type == "attribute" && this.init.list[0].type == "functionValue")
    {
    }
    else
    {
        str += ";\r\n";
    }
    return str;
}

As3Var.prototype.printContentTS = function(before,cls,printType)
{
    var str = "";
    str += this.name==""?"":this.name;
    if(this.type && printType) str += ":" + this.type.printTS(before,cls,true);
    if(this.init) str += " = " + this.init.printTS(before,cls);
    return str;
}

As3Var.createVars = function(pb,st,vf,params)
{
    var list = [];
    for(var i = 0; i < params.list.length; i++)
    {
        list.push(new As3Var(pb,st,vf,params.list[i]));
    }
    return list;
}

global.As3Var = As3Var;