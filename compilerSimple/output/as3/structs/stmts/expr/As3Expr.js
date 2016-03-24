/**
 * Created by mengj_000 on 2015/4/20.
 */

function As3Expr(type,expval1,expval2,expval3)
{
    this.type = type;
    this.expval1 = expval1;
    this.expval2 = expval2;
    this.expval3 = expval3;
}

As3Expr.prototype.printTS = function(before,cls)
{
    if(this.type == "a++") return this.expval1.printTS("",cls) + "++";
    if(this.type == "a--") return this.expval1.printTS("",cls) + "--";
    if(this.type == "++a") return "++" + this.expval1.printTS("",cls);
    if(this.type == "--a") return "--" + this.expval1.printTS("",cls);
    if(this.type == "+a") return "+" + this.expval1.printTS("",cls);
    if(this.type == "-a") return "-" + this.expval1.printTS("",cls);
    if(this.type == "!") return "!" + this.expval1.printTS("",cls);
    if(this.type == "*") return this.expval1.printTS("",cls) + " * " + this.expval2.printTS("",cls);
    if(this.type == "/") return this.expval1.printTS("",cls) + " / " + this.expval2.printTS("",cls);
    if(this.type == "%") return this.expval1.printTS("",cls) + " % " + this.expval2.printTS("",cls);
    if(this.type == "+") return this.expval1.printTS("",cls) + " + " + this.expval2.printTS("",cls);
    if(this.type == "-") return this.expval1.printTS("",cls) + " - " + this.expval2.printTS("",cls);
    if(this.type == "<<") return this.expval1.printTS("",cls) + " << " + this.expval2.printTS("",cls);
    if(this.type == ">>") return this.expval1.printTS("",cls) + " >> " + this.expval2.printTS("",cls);
    if(this.type == "<<<") return this.expval1.printTS("",cls) + " <<< " + this.expval2.printTS("",cls);
    if(this.type == ">>>") return this.expval1.printTS("",cls) + " >>> " + this.expval2.printTS("",cls);
    if(this.type == ">") return this.expval1.printTS("",cls) + " > " + this.expval2.printTS("",cls);
    if(this.type == "<") return this.expval1.printTS("",cls) + " < " + this.expval2.printTS("",cls);
    if(this.type == ">=") return this.expval1.printTS("",cls) + " >= " + this.expval2.printTS("",cls);
    if(this.type == "<=") return this.expval1.printTS("",cls) + " <= " + this.expval2.printTS("",cls);
    if(this.type == "==") return this.expval1.printTS("",cls) + " == " + this.expval2.printTS("",cls);
    if(this.type == "===") return this.expval1.printTS("",cls) + " === " + this.expval2.printTS("",cls);
    if(this.type == "!==") return this.expval1.printTS("",cls) + " !== " + this.expval2.printTS("",cls);
    if(this.type == "!=") return this.expval1.printTS("",cls) + " != " + this.expval2.printTS("",cls);
    if(this.type == "&") return this.expval1.printTS("",cls) + " & " + this.expval2.printTS("",cls);
    if(this.type == "~") return "~" + this.expval1.printTS("",cls);
    if(this.type == "^") return this.expval1.printTS("",cls) + " ^ " + this.expval2.printTS("",cls);
    if(this.type == "|") return this.expval1.printTS("",cls) + " | " + this.expval2.printTS("",cls);
    if(this.type == "&&") return this.expval1.printTS("",cls) + " && " + this.expval2.printTS("",cls);
    if(this.type == "||") return this.expval1.printTS("",cls) + " || " + this.expval2.printTS("",cls);
    if(this.type == "=")
    {
        var begin = this.expval1.printTS("",cls);
        var end = this.expval2.printTS(before,cls);
        //if(cls.name == "TweenLite" && cls.currentFunction && cls.currentFunction.name == "setEnabled")
        //{
        //    console.log(this.expval1.type);
        //    console.log(this.expval1.list.length);
        //    console.log(this.expval1.list[this.expval1.list.length-1].type);
        //    console.log(this.expval1.list[this.expval1.list.length-2].exprType);
        //}
        if(this.expval1.type == "attribute" && this.expval1.list.length >= 2 &&
            (this.expval1.list[this.expval1.list.length-1].type == "[]" || this.expval1.list[this.expval1.list.length-1].type == ".") &&
            this.expval1.list[this.expval1.list.length-2].exprType &&
            this.expval1.list[this.expval1.list.length-2].exprType.type == 1 &&
            this.expval1.list[this.expval1.list.length-2].exprType.name == "flash.utils.Dictionary")
        {
            return this.expval1.printInfo.dicstr + ".setItem(" + this.expval1.printInfo.dicparams + "," + end + ")";
        }
        if(this.expval2.type == "attribute" && this.expval2.exprType && this.expval2.exprType.type == 1 && this.expval2.exprType.name == "Function" && this.expval2.printInfo.last && this.expval2.printInfo.last.subType == "function")
        {
            var copy = end;
            for(var c = copy.length; c>= 0; c--)
            {
                if(copy.charAt(c) == "." || copy.charAt(c) == "[")
                {
                    copy = copy.slice(0,c);
                    break;
                }
            }
            return begin + " = " + end;
            //return begin + " = " + end + ".bind(" + copy + ")";
        }
        return  begin + " = " + end;
    }
    if(this.type == "*=") return this.expval1.printTS("",cls) + " *= " + this.expval2.printTS("",cls);
    if(this.type == "/=") return this.expval1.printTS("",cls) + " /= " + this.expval2.printTS("",cls);
    if(this.type == "%=") return this.expval1.printTS("",cls) + " %= " + this.expval2.printTS("",cls);
    if(this.type == "&=") return this.expval1.printTS("",cls) + " &= " + this.expval2.printTS("",cls);
    if(this.type == "+=") return this.expval1.printTS("",cls) + " += " + this.expval2.printTS("",cls);
    if(this.type == "-=") return this.expval1.printTS("",cls) + " -= " + this.expval2.printTS("",cls);
    if(this.type == "||=")
    {
        var str1 = this.expval1.printTS("",cls);
        return str1 + " = " + str1 + " || " + this.expval2.printTS("",cls);
    }
    if(this.type == "<<=") return this.expval1.printTS("",cls) + " <<= " + this.expval2.printTS("",cls);
    if(this.type == ">>=") return this.expval1.printTS("",cls) + " >>= " + this.expval2.printTS("",cls);
    if(this.type == "^=") return this.expval1.printTS("",cls) + " ^= " + this.expval2.printTS("",cls);
    if(this.type == "|=") return this.expval1.printTS("",cls) + " |= " + this.expval2.printTS("",cls);
    if(this.type == "&") return this.expval1.printTS("",cls) + " & " + this.expval2.printTS("",cls);
    if(this.type == "?:") return this.expval1.printTS("",cls) + "?" + this.expval2.printTS("",cls) + ":" + this.expval3.printTS("",cls);
    if(this.type == "as")
    {
        //console.log("as函数","as3.as(" + this.expval1.printTS("",cls) + "," + this.expval2.printTS("",cls) + ")");
        //return "as3.as(" + this.expval1.printTS("",cls) + "," + this.expval2.printTS("",cls) + ")";
        return "<" + this.expval2.printTS("",cls) + ">" + this.expval1.printTS("",cls);
    }
    if(this.type == "is")
    {
        if(this.expval2.type == 1 && this.expval2.name == "Class") return "as3.As3is(" + this.expval1.printTS("",cls) + ",\"Class\")";
        var isstr = this.expval2.printTS("",cls,true);
        if(isstr == "boolean") isstr = "Boolean";
        if(isstr == "number") isstr = "Number";
        if(isstr == "string") isstr = "String";
        if(isstr == "int" || isstr == "uint" || isstr == "Number") {
            return "typeof(" + this.expval1.printTS("",cls) + ") == \"number\"";
        }
        if(isstr == "String") {
            return "typeof(" + this.expval1.printTS("",cls) + ") == \"string\"";
        }
        return "" + this.expval1.printTS("",cls) + " instanceof " + isstr + "";
        //return "System.As3is(" + this.expval1.printTS("",cls) + ",\"Class\")";
    }
    if(this.type == "in") return this.expval1.printTS("",cls) + " in " + this.expval2.printTS("",cls);//return "as3.As3in(" + this.expval1.printTS("",cls) + "," + this.expval2.printTS("",cls) + ")";
    if(this.type == "RegExp") return this.expval1;
    if(this.type == "null") return "null";
    //if(this.type == "attribute")
    //{
    //    var info = {"str":"","type":null,"last":null};
    //    this.expval1.printTS(before,cls,info,true);
    //    return info.str;
    //}
    return this.expval1;
}

global.As3Expr = As3Expr;