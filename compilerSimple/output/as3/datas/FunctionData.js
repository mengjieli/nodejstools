/**
 * Created by mengj_000 on 2015/4/23.
 */


function FunctionData(pb,st,name,returnType,namespace)
{
    this.subType = "function";

    this.class = "";
    this.name = name;
    this.public = pb;
    this.static = st;
    //返回类型
    this.returnType = returnType;
    this.namespace = namespace==undefined?"":namespace;
}


global.FunctionData = FunctionData;