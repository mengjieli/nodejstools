/**
 * Created by mengj_000 on 2015/4/5.
 */
var NFAGraphics = require("./NFAGraphics.js"),
    fs = require("fs"),
    path = require("path");

var replaceString = function(str,find,rep){
    for(var i = 0; i < str.length; i++)
    {
        if(str.slice(i,i+find.length) == find)
        {
            str = str.slice(0,i) + rep + str.slice(i+find.length,str.length);
            i == -1;
        }
    }
    return str;
}

var lex = "";
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

if(lex != "")
{
    var creates = [];
    var blocks = lex.split("%%");
    blocks.shift();
    var code;
    var line = "";
    var name;
    var content;
    var codeA = "A".charCodeAt(0);
    var codeZ = "Z".charCodeAt(0);
    var codea = "a".charCodeAt(0);
    var codez = "z".charCodeAt(0);
    var code0 = "0".charCodeAt(0);
    var code9 = "9".charCodeAt(0);
    var codey = '"'.charCodeAt(0);
    //读取声明部分
    var arr = blocks[0].split("\r\n");
    var findcodeY;
    for(var i = 0; i < arr.length; i++)
    {
        line = arr[i];
        code = line.charCodeAt(0);
        findcodeY = false;
        if(code >= codeA && code <= codeZ || code >= codea && code <= codez || code == codey)
        {
            name = "";
            content = "";
            for(var c = 0; c < line.length; c++)
            {
                code = line.charCodeAt(c);
                if(line.charAt(c) == "\\")
                {
                    name += line.charAt(c);
                    c++;
                    name += line.charAt(c);
                    continue;
                }
                if(c == 0 && code == codey)
                {
                    findcodeY = true;
                }
                else if(findcodeY == true)
                {
                    if(code == codey)
                    {
                        content = line.slice(c+2,line.length);
                        break;
                    }
                    else
                    {
                        name += line.charAt(c);
                    }
                }
                else
                {
                    if(code >= codeA && code <= codeZ || code >= codea && code <= codez || code >= code0 && code <= code9 || code == codey) name += line.charAt(c);
                    else
                    {
                        content = line.slice(c+1,line.length);
                        break;
                    }
                }
            }
            for(c = 0; c < creates.length; c++)
            {
                content =  replaceString(content,"{" + creates[c].name + "}","(" + creates[c].exp + ")");
            }
            creates.push({"name":name,"exp":content});
            //console.log(name + " -> " + content);
        }
    }
    //读取token定义
    arr = blocks[1].split("\r\n");
    var exps = [];//{"name":"(\t| |\r|\n)+","exp":"{}"}];
    var codekl = "{".charCodeAt(0);
    var codekr = "}".charCodeAt(0);
    var exp = "";
    var once;
    var bfs;
    //console.log(arr);
    for(i = 0; i < arr.length; i++) {
        line = arr[i];
        code = line.charCodeAt(0);
        findcodeY = false;
        if (code >= codeA && code <= codeZ || code >= codea && code <= codez || code == codey || code == codekl || code == "[".charCodeAt(0)) {
            once = false;
            if(line.slice(0,4) == "once")
            {
                once = true;
                line = line.slice(4,line.length);
                while(line.charAt(0) == " ")
                {
                    line = line.slice(1,line.length);
                }
            }
            bfs = [];
            if(line.charAt(0) == "[")
            {
                var last = 1;
                for(var c = last; c < line.length; c++)
                {
                    if(line.charAt(c) == "\\")
                    {
                        c++;
                    }
                    else
                    {
                        if(line.charAt(c) == "," || line.charAt(c) == "]")
                        {
                            bfs.push(line.slice(last,c));
                            last = c + 1;
                            if(line.charAt(c) == "]")
                            {
                                c++;
                                for(; c < line.length; c++)
                                {
                                    if(line.charAt(c) != " ")
                                    {
                                        break;
                                    }
                                }
                                line = line.slice(c,line.length);
                                break;
                            }
                        }
                    }
                }
            }
            name = "";
            content = "";
            for (var c = 0; c < line.length; c++) {
                code = line.charCodeAt(c);
                if (line.charAt(c) == "\\") {
                    name += line.charAt(c);
                    c++;
                    name += line.charAt(c);
                    continue;
                }
                if (c == 0 && code == codey) {
                    findcodeY = true;
                }
                else if (findcodeY == true) {
                    if (code == codey) {
                        content = line.slice(c + 3, line.length - 1);
                        break;
                    }
                    else {
                        name += line.charAt(c);
                    }
                }
                else {
                    if (code >= codeA && code <= codeZ || code >= codea && code <= codez || code >= code0 && code <= code9 || code == codey || code == codekl || code == codekr) name += line.charAt(c);
                    else {
                        content = line.slice(c + 2, line.length - 1);
                        break;
                    }
                }
            }
            for (c = 0; c < creates.length; c++) {
                name = replaceString(name,"{" + creates[c].name + "}", "(" + creates[c].exp + ")");
            }
            exps.push({"name": name, "exp": content,"once":once,"before":bfs});
            exp += name;
            //console.log(name,once);
        }
    }
    //替换所有表达式的[~部分]
    //首先获取所有的inputs符号集
    var inputs = ["中"];
    var ch;
    var flag;
    var revwords = [];
    var newwords = [];
    for(i = 0; i < exp.length; i++)
    {
        ch = exp.charAt(i);
        if(exp.slice(i,i+3) == "any")
        {
            i += 3;
            ch = exp.charAt(i);
        }
        if(exp.slice(i,i+2) == "[~")
        {
            i += 2;
            for(; i < exp.length; i++)
            {
                ch = exp.charAt(i);
                if(ch == "]")
                {
                    i++;
                    ch = exp.charAt(i);
                    break;
                }
                if(ch == "\\")
                {
                    i++;
                    ch += exp.charAt(i);
                }
                flag = false;
                for(var c = 0; c < inputs.length; c++)
                {
                    if(inputs[c] == ch)
                    {
                        flag = true;
                        break;
                    }
                }
                if(flag == false)
                {
                    inputs.push(ch);
                }
                flag = false;
                for(c = 0; c < revwords.length; c++)
                {
                    if(revwords[c] == ch)
                    {
                        flag = true;
                        break;
                    }
                }
                if(!flag) revwords.push(ch);
            }
        }
        if(ch == "\\")
        {
            i++;
            ch += exp.charAt(i);
        }
        if(ch == "*" || ch == "|" || ch == "+" || ch == "?" || ch =="(" || ch == ")") continue;
        flag = false;
        for(var c = 0; c < inputs.length; c++)
        {
            if(inputs[c] == ch)
            {
                flag = true;
                break;
            }
        }
        if(flag == false)
        {
            inputs.push(ch);
            newwords.push(ch);
        }
    }
    //替换any
    var anywords = "("
    for(i = 0; i < inputs.length; i++)
    {
        anywords += inputs[i] + (i < inputs.length - 1?"|":"");
    }
    anywords += ")";
    for(i = 0; i < exps.length; i++)
    {
        exp = exps[i].name;
        for(var j = 0; j < exp.length; j++)
        {
            if(exp.slice(j,j+3) == "any")
            {
                exp = exp.slice(0,j) + anywords + exp.slice(j+3,exp.length);
                j = -1;
            }
        }
        exps[i].name = exp;
    }
    for(i = 0; i < revwords.length; i++)
    {
        for(var j = 0; j < newwords.length; j++)
        {
            if(newwords[j] == revwords[i])
            {
                revwords.splice(i,1);
                i--;
                break;
            }
        }
    }
    for(i = 0; i < revwords.length; i++)
    {
        ch = revwords[i];
        flag = false;
        for(var j = 0; j < exps.length; j++)
        {
            if(exps[j].name == ch || exps[j].name == "(" + ch + ")")
            {
                flag = true;
                break;
            }
        }
        if(flag == true || ch == "中")
        {
            revwords.splice(i,1);
            i--;
        }
    }
    var revers = [];
    var copy;
    var first;
    var end;
    for(var n = 0; n < exps.length; n++)
    {
        exp = exps[n].name;
        for(i = 0; i < exp.length; i++)
        {
            ch = exp.charAt(i);
            if(exp.slice(i,i+3) == "any")
            {
                i += 3;
                ch = exp.charAt(i);
            }
            if(exp.slice(i,i+2) == "[~")
            {
                first = exp.slice(0,i);
                i += 2;
                for(; i < exp.length; i++)
                {
                    ch = exp.charAt(i);
                    if(ch == "]")
                    {
                        i++;
                        ch = exp.charAt(i);
                        end = exp.slice(i,exp.length);
                        copy = inputs.concat();
                        //if(exp == "('[~']*')")
                        //{
                        //    console.log("反向检测表达式：",exp);
                        //    console.log("copy:",copy,"revers",revers);
                        //}
                        //console.log("copy:",copy,"revers",revers);
                        for(j = 0; j < copy.length; j++)
                        {
                            for(var k = 0; k < revers.length; k++)
                            {
                                if(revers[k] == copy[j])
                                {
                                    copy.splice(j,1);
                                    j--;
                                }
                            }
                        }
                        revers = [];
                        exp = first + "(";
                        //console.log("copy:",copy);
                        for(j = 0; j < copy.length; j++)
                        {
                            exp += copy[j] + (j<copy.length-1?"|":"");
                        }
                        exp += ")" + end;
                        i = exp.length - end.length;
                        exps[n].name = exp;
                        break;
                    }
                    if(ch == "\\")
                    {
                        i++;
                        ch += exp.charAt(i);
                    }
                    revers.push(ch);
                }
            }
            if(ch == "\\")
            {
                i++;
                ch += exp.charAt(i);
            }
        }
    }

    var explanReg = function(exp,inputs){
        //替换any
        var anywords = "("
        for(i = 0; i < inputs.length; i++)
        {
            anywords += inputs[i] + (i < inputs.length - 1?"|":"");
        }
        anywords += ")";
        for(var j = 0; j < exp.length; j++) {
            if (exp.slice(j, j + 3) == "any") {
                exp = exp.slice(0, j) + anywords + exp.slice(j + 3, exp.length);
                j = -1;
            }
        }
        for(var i = 0; i < exp.length; i++)
        {
            if(exp.charCodeAt(i) == 13)
            {
                exp = exp.slice(0,i) + "\\r" + exp.slice(i+1,exp.length);
                i++;
                i++;
            }
            else if(exp.charCodeAt(i) == 10)
            {
                exp = exp.slice(0,i) + "\\n" + exp.slice(i+1,exp.length);
                i++;
                i++;
            }
            else if(exp.charCodeAt(i) == 9)
            {
                exp = exp.slice(0,i) + "\\t" + exp.slice(i+1,exp.length);
                i++;
                i++;
            }
        }
        console.log("返回exp:",exp);
        return exp;
    }
    //console.log("所有字符：",inputs);
    //console.log("剩余取反字符：",revwords);
    //for(i = 0; i < exps.length; i++)
    //{
    //    console.log(exps[i].name + " -> " + exps[i].exp);
    //}
    var grap = new NFAGraphics();
    for(i = 0; i < exps.length; i++)
    {
        //console.log("添加表达式：",exps[i].name);
        grap.addRegExp(exps[i].name,exps[i].once,exps[i].before.length==0?null:exps[i].before);
    }
    for(i = 0; i < revwords.length; i++)
    {
        console.log("补充表达式：",revwords[i]);
        grap.addRegExp(revwords[i]);
    }
    var dfa = grap.transToDFA();
    //for(i = 0; i < revwords.length; i++)
    //{
    //    dfa.setTokenPassByRegExp(revwords[i]);
    //}
    //dfa.setTokenPassByRegExp(explanReg("((\t| |\r|\n)+)",inputs));
    //dfa.setTokenPassByRegExp("(//any*(\r|\n))",inputs);
    /*var file = fs.readFileSync("Test.as","utf-8");
    console.log("文件：");
    console.log(file);
    console.log();
    dfa.setTokenContent(file);
    var token;
    while(true)
    {
        token = dfa.getNextToken();
        console.log("token : ",token);
        if(token == null) break;
    }*/
    var printObj = function(obj,space){
        var res = "";
        //res += "\r\n" + space + "{";
        res += "{";
        for(var key in obj)
        {
            flag = true;
            var value = obj[key];
            //res += "\r\n" + space;
            for(i = 0; i < key.length; i++)
            {
                if(key.charCodeAt(i) >= code0 && key.charCodeAt(i) <= code9)
                {

                }
                else
                {
                    flag = false;
                    break;
                }
            }
            if(flag == true) res += key + ":";
            else res += "" + key.charCodeAt(0) + ":";
            //if(typeof (key) == "string")
            //{
            //    for(i = 0; i < key.length; i++)
            //    {
            //        if(key.charAt(i) == "\"")
            //        {
            //            key = key.slice(0,i) + "\\\"" + key.slice(i+1,key.length);
            //            i++;
            //        }
            //        else if(key.charAt(i) == "\\")
            //        {
            //            key = key.slice(0,i) + "\\\\" + key.slice(i+1,key.length);
            //            i++;
            //        }
            //        else if(key.charCodeAt(i) == 13)
            //        {
            //            key = key.slice(0,i) + "\\r" + key.slice(i+1,key.length);
            //            i++;
            //            i++;
            //        }
            //        else if(key.charCodeAt(i) == 10)
            //        {
            //            key = key.slice(0,i) + "\\n" + key.slice(i+1,key.length);
            //            i++;
            //            i++;
            //        }
            //        else if(key.charCodeAt(i) == 9)
            //        {
            //            key = key.slice(0,i) + "\\t" + key.slice(i+1,key.length);
            //            i++;
            //            i++;
            //        }
            //    }
            //    res += "\"" + key + "\":";
            //}
            //else if(typeof (key) == "number")
            //{
            //    res += "\t" + key + ":";
            //}
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
                    if(str == "") console.log("空的呀！？",key,obk[key]);
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

        //res += "\r\n" + space + "}";
        res += "}";
        return res;
    }

    var printObj2 = function(obj)
    {
        var str = "{";
        for(var key in obj)
        {
            str += "\"" + key + "\":" +(typeof obj[key] == "object"?printObj2(obj[key]):obj[key]) + ",";
        }
        if(str.charAt(str.length-1) == ",") str = str.slice(0,str.length-1);
        str += "}";
        return str;
    }

    //console.log("ends :");
    //console.log(dfa.endInfos);
    //console.log();
    var namesChanges = {};
    for(i = 0; i < exps.length; i++)
    {
        for(var key in dfa.endInfos)
        {
            if(exps[i].name == dfa.endInfos[key].reg)
            {
                if(namesChanges[exps[i].name] == undefined) namesChanges[exps[i].name] = [];
                namesChanges[exps[i].name].push(key);
            }
        }
    }
    //console.log(namesChanges);
    var dfaInputs = dfa.inputs;
    //var newInputs = {};
    //for(var key in dfaInputs)
    //{
    //    newInputs[key.charCodeAt(0)] = dfaInputs[key];
    //}
    var file = "package flower.binding.compiler\n";
    file += "{\n";
    file += "\tpublic class ScannerTable\n";
    file += "\t{\n";
    file += "\t\tpublic static var moves:Object = " + printObj(dfa.moves,"") + ";\r\n";
    file += "\t\tpublic static var start:int = " + dfa.start + ";\r\n";
    var befores = {};
    for(var key in dfa.endInfos)
    {
        if(dfa.endInfos[key].before)
        {
            befores[key] = dfa.endInfos[key].before;
            //console.log("前缀状态：",key," tokens:",befores[key]);
        }
        dfa.endInfos[key] = dfa.endInfos[key].once;
    }
    file += "\t\tpublic static var endInfos:Object = " + printObj(dfa.endInfos,"") + ";\r\n";

    file += "\t\tpublic static var befores:Object = " + printObj2(befores,"") + ";\r\n";
    file += "\t\tpublic static var inputs:Object = " + printObj(dfa.inputs,"") + ";\r\n";
    file += "\t}\n";
    file += "}\n";
    //file += "global.ScannerTable = {moves:moves,endInfos:endInfos,inputs:inputs,start:start,befores:befores};"
    fs.writeFile("output/as3/core/ScannerTable.as",file);

    file = "";
    //file += "var tokenPass = " + printObj(dfa.tokenPass,"") + ";\r\n";
    file += fs.readFileSync("Scanner.js","utf-8");
    file += "Scanner.prototype.getTokenComplete = function(token,content){\r\n";
    file += "    this.commonInfo.tokenValue = null;\r\n";
    file += "    switch (token)\r\n";
    file += "    {\r\n";
    for(i = 0; i < exps.length; i++)
    {
        if(namesChanges[exps[i].name] == undefined) continue;
        for(var j = 0; j < namesChanges[exps[i].name].length; j++)
        {
            file += "       case " + namesChanges[exps[i].name][j] +  ":" + (j<namesChanges[exps[i].name].length-1?"\r\n":"");
        }
        file += exps[i].exp + "\r\n";
    }
    file += "    }\r\n";
    file += "    return null;\r\n";
    file += "};\r\n";
    file += blocks[2];
    fs.writeFile("output/as3/core/Scanner.js",file);

    console.log("生成词法扫描文件./output/as3/core/Scanner.js");

    //console.log("input13",dfa.inputs[String.fromCharCode(13)],typeof (dfa.inputs[String.fromCharCode(13)]));
}

/*var outputDir = path.resolve(process.cwd(), process.argv[3]);
if (fs.existsSync(outputDir)) {
    if (!fs.statSync(outputDir).isDirectory()) {
        throw new Error('invalid ouput dir');
        process.exit(1);
    }
    rimraf.sync(outputDir);
}*/