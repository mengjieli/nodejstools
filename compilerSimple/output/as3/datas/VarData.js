/**
 * Created by mengj_000 on 2015/4/23.
 */


function VarData(pb,st,name,type,metaTage,namespace)
{
    this.subType = "var";
    this.class = "";
    this.name = name;
    this.public = pb;
    this.static = st;
    this.type = type;
    this.metaTag = metaTage;
    this.namespace = namespace==undefined?"":namespace;
}

global.VarData = VarData;