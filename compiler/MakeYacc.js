/**
 * Created by mengj_000 on 2015/4/11.
 */
//var Scanner = require("./output/Scanner.js");
//var scanner = new Scanner();
//var commonInfo = {"ids":{},"tokenValue":null,"scanner":scanner};
//scanner.setCommonInfo(commonInfo);
//dfa.setCommonInfo(commonInfo);
//dfa.addFunction("factor","expr'>='term|factor'+'i d|id|factor id;");
var LR1 = require("./LR1.js");
var LRDFA = require("./LRDFA.js");
var LALR = require("./LALR.js");
var path = require("path");
var fs = require("fs");
var sourceFile = path.resolve(process.cwd(), process.argv[2]);
if (!fs.existsSync(sourceFile) || fs.statSync(sourceFile).isDirectory()) {
    console.log('不合法的lex文件');
}
else
{
    lex = fs.readFileSync(sourceFile,"utf-8");
    console.log("解析lex程序...");
    //console.log(lex);
}

var dfa = new LALR();
var file = fs.readFileSync(sourceFile,"utf-8");
var blocks = file.split("%%");
var lines = blocks[0].split("\r\n");
var levels = {};
var lv = 0;
var sign;
var levelsign = {};
var j;
for(var i = 0; i < lines.length; i++)
{
    //获取优先级表
    if(lines[i].charAt(0) == "%")
    {
        console.log("line : ",lines[i]);
        if(lines[i].slice(1,5) == "left")
        {
            sign = "left";
            j = 5;
        }
        else
        {
            sign = "right";
            j = 6;
        }
        for(; j < lines[i].length; j++)
        {
            if(lines[i].charAt(j) == "'")
            {
                for(var e = j + 1; e < lines[i].length; e++)
                {
                    if(lines[i].charAt(e) == "'")
                    {
                        levels[lines[i].slice(j + 1,e)] = {"type":sign,"level":lv};
                        j = e;
                        break;
                    }
                    else
                    {
                        levelsign[lines[i].charAt(e)] = true;
                    }
                }
            }
            else if(lines[i].charCodeAt(j) >= "a".charCodeAt(0) && lines[i].charCodeAt(j) <= "z".charCodeAt(0) ||
                lines[i].charCodeAt(j) >= "A".charCodeAt(0) && lines[i].charCodeAt(j) <= "Z".charCodeAt(0))
            {
                for(var e = j + 1; e < lines[i].length; e++)
                {
                    if(lines[i].charAt(e) == " " || lines[i].charAt(e) == "\t" || e == lines[i].length - 1)
                    {
                        if(e == lines[i].length - 1) levels[lines[i].slice(j,e + 1)] = {"type":sign,"level":lv};
                        else levels[lines[i].slice(j,e)] = {"type":sign,"level":lv};
                        break;
                    }
                }
                j = e;
            }
        }
        lv ++;
    }
}
dfa.levels = levels;
dfa.levelSign = levelsign;
console.log("levels");
console.log(levels);
console.log(levelsign);
console.log("levels End");
var exps = blocks[1].split("\r\n");
var first;
var ch = "";
var name;
var createExp;
var exp;
var creates = [];
var code;
var f;
var prec;
var expEnd;
for(var i = 0; i < exps.length; i++)
{
    exp = exps[i];
    first = "";
    expEnd = 0;
    for(var j = 0; j < exp.length; j++)
    {
        if(first == "")
        {
            if(exp.charAt(j) == "\t" || exp.charAt(j) == " ") continue;
            if(exp.charCodeAt(j) >= "a".charCodeAt(0) && exp.charCodeAt(j) <= "z".charCodeAt(0) ||
                exp.charCodeAt(j) >= "A".charCodeAt(0) && exp.charCodeAt(j) <= "Z".charCodeAt(0) || exp.charAt(j) == "|")
            {
                if(exp.charAt(j) == "|")
                {
                    f = j;
                }
                else
                {
                    for(f = j + 1; f < exp.length; f++)
                    {
                        if(exp.charAt(f) == ":" || exp.charAt(f) == " ")
                        {
                            name = exp.slice(j,f);
                            //createExp = [];
                            //codes = [];
                            //creates.push({"name":name,"exps":createExp,"codes":codes});
                            break;
                        }
                    }
                }
                for(; f < exp.length; f++)
                {
                    if(exp.charAt(f) == ":" || exp.charAt(f) == "|")
                    {
                        code = "";
                        prec = "";
                        for(var k = f + 1; k < exp.length; k++)
                        {
                            if(exp.slice(k,k+2) == "\\\\")
                            {
                                expEnd = k;
                                break;
                            }
                            if(exp.slice(k,k+3) == "'{'" || exp.slice(k,k+3) == "'}'" || exp.slice(k,k+3) == '"{"' || exp.slice(k,k+3) == '"}"')
                            {
                                k += 2;
                                continue;
                            }
                            if(exp.slice(k,k+5) == "%prec")
                            {
                                expEnd = k;
                                for(var p = k + 6; p < exp.length; p++)
                                {
                                    if(exp.charAt(p) == " " || exp.charAt(p) == "\t")
                                    {
                                        if(prec != "")
                                        {
                                            k = p;
                                            break;
                                        }
                                        continue;
                                    }
                                    prec += exp.charAt(p);
                                    if(p == exp.length - 1)
                                    {
                                        k = p + 1;
                                        break;
                                    }
                                }
                            }
                            if(exp.charAt(k) == "{")
                            {
                                if(expEnd == 0) expEnd = k;
                                for(var p = k + 1; p < exp.length; p++)
                                {
                                    if(exp.charAt(p) == "\\" && exp.charAt(p + 1) == "}")
                                    {
                                        exp = exp.slice(0,p) + exp.slice(p + 1,exp.length);
                                    }
                                    else if(exp.charAt(p) == "}")
                                    {
                                        code = exp.slice(k + 1,p);
                                        k = p;
                                        //codes.push(exp.slice(k + 1,p));
                                        break;
                                    }
                                }
                            }
                            else if(k == exp.length-1)
                            {
                                //codes.push(null);
                            }
                        }
                        if(expEnd == 0) expEnd = exp.length;
                        //console.log("添加表达式：",name," -> ",exp.slice(f+1,expEnd)," ,len = ",expEnd-f-1);
                        dfa.addFunction(name,exp.slice(f+1,expEnd) + ";",prec,code);
                        //createExp.push(exp.slice(f+1,k));
                        break;
                    }
                }
                break;
            }
        }
    }
}
var time = (new Date()).getTime();

dfa.createDFA();
//dfa.createLR0();

console.log("耗时：",(new Date()).getTime() - time);


var addSpace = false;
var printObj = function(obj,space){
    space = space||"";
    var res = "";
    if(addSpace) res += "\r\n" + space + "{";
    else res += "{";
    for(var key in obj)
    {
        flag = true;
        var value = obj[key];
        if(addSpace) res += "\r\n" + space;
        for(i = 0; i < key.length; i++)
        {
            if(key.charCodeAt(i) >= "0".charCodeAt(0) && key.charCodeAt(i) <= "9".charCodeAt(0))
            {

            }
            else
            {
                flag = false;
                break;
            }
        }
        if(flag == true) res += key + ":";
        else res += "\"" + key + "\":";
        if(typeof (value) == "object")
        {
            res += printObj(value,"\t"+ space);
        }
        else
        {
            //console.log(key.charCodeAt(0),"boolean",value);
            if(value == null) res += "null";
            else if(typeof (value) == "number") res += value;
            else if(typeof (value) == "string")
            {
                var str = value;
                //if(str == "") console.log("空的呀！？",key,obj[key]);
                for(i = 0; i < str.length; i++)
                {
                    if(str.charAt(i) == "\"")
                    {
                        str = str.slice(0,i) + "\\\"" + str.slice(i+1,str.length);
                        i++;
                    }
                    else if(str.charAt(i) == "\\")
                    {
                        str = str.slice(0,i) + "\\\\" + str.slice(i+1,str.length);
                        i++;
                    }
                    else if(str.charCodeAt(i) == 13)
                    {
                        str = str.slice(0,i) + "\\r" + str.slice(i+1,str.length);
                        i++;
                    }
                    else if(str.charCodeAt(i) == 10)
                    {
                        str = str.slice(0,i) + "\\n" + str.slice(i+1,str.length);
                        i++;
                    }
                    else if(str.charCodeAt(i) == 9)
                    {
                        str = str.slice(0,i) + "\\t" + str.slice(i+1,str.length);
                        i++;
                    }
                }
                res += "\"" + str + "\"";
            }
            else if(typeof (value) == "boolean")
            {
                //console.log("value",obj[key]);
                res += value?"true":"false";
            }
        }
        res += ",";
    }
    if(res.charAt(res.length-1) == ",") res = res.slice(0,res.length-1);

    if(addSpace) res += "\r\n" + space + "}";
    else res += "}";
    return res;
}



var innerProgrammer = "Parser.prototype.runProgrammer = function (id,node,nodes) {\r\n";
//innerProgrammer += "    return;\r\n";
innerProgrammer += "    var common = this.commonInfo;\r\n";
innerProgrammer += "    switch (id){\r\n";
var programmers = {};
var results = {};
for(var p in dfa.action)
{
    for(var q in dfa.action[p])
    {
        if(dfa.action[p][q].a == 0)
        {
            delete dfa.action[p][q].c;
        }
        else if(dfa.action[p][q].a == 1)
        {
            if(dfa.action[p][q].c.code != "" && programmers[dfa.action[p][q].c.id] == undefined)
            {
                if(!results[dfa.action[p][q].c.code]) results[dfa.action[p][q].c.code] = [];
                results[dfa.action[p][q].c.code].push(dfa.action[p][q].c.id);
                //innerProgrammer += "        case " + dfa.action[p][q].c.id + ":" + dfa.action[p][q].c.code + "break;\r\n";
                programmers[dfa.action[p][q].c.id] = true;
            }
            dfa.action[p][q].c = {"id":dfa.action[p][q].c.id,"head":dfa.action[p][q].c.head,"code":dfa.action[p][q].c.code==""?false:true,"exp":dfa.action[p][q].c.exp.length};
        }
        else if(dfa.action[p][q].a == 2)
        {
            delete dfa.action[p][q].c;
            delete dfa.action[p][q].item;
        }
    }
}
for(p in results)
{
    for(var i = 0; i < results[p].length; i++)
    {
        if(i == 0 || i == results[p].length - 1)
        {
            if(i == results[p].length - 1 && i != 0) innerProgrammer += "\r\n";
            innerProgrammer += "        ";
        }
        innerProgrammer += "case " + results[p][i] + ": ";
        if(i == results[p].length - 1) innerProgrammer += p + "break;\r\n";
        //if(i < results[p].length - 1) innerProgrammer += "case " + results[p][i] + ":";
        //else innerProgrammer += "case " + results[p][i] + ":";
        //innerProgrammer += (i == 0?"        ":"") + "case " + results[p][i] + ":";
        //if(i < results[p].length - 2) innerProgrammer += " ";
        //else if(i == results[p].length - 1) innerProgrammer += "\r\n        ";
        //else innerProgrammer += p + "break;\r\n";
    }
}
innerProgrammer += "    }\r\n";
innerProgrammer += "};\r\n";

var content = "var action = " + printObj(dfa.action) + ";";
content += "\r\n";
content += "var goto = " + printObj(dfa.goto) + ";";
content += "\r\n";
content += "global.ParserTable = {\"action\":action,\"goto\":goto};\r\n";
fs.writeFile("output/as3/core/ParserTable.js",content);



content = "";
var copy = fs.readFileSync("Parser.js","utf-8");
content += copy;
content += innerProgrammer;
content += blocks[2];

fs.writeFile("output/as3/core/Parser.js",content);

console.log("生成语法扫描文件./output/as3/core/Parser.js");