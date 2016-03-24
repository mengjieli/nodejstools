/**
 * Created by mengj_000 on 2015/4/4.
 */

var NodeLink = require("./NodeLink.js");
var DFANode = require("./DFANode");

/**
 * DFA转换表格式：
 * moves = {
 *    0:{
 *      "a":{s:1},
 *      "b":{s:2},
 *      "1":{s:5}
 *    },
 *    1:{
 *      "a":{},
 *    }
 * }
 * @constructor
 */
var DFA = function(){
    //DFA的开始结点
    this.start = null;
    //转换表
    this.moves = null;
    //接受状态信息
    this.endInfos = null;
    //前缀
    this.befores = null;
    //所有输入字符
    this.inputs = null;
    //token位置
    this.tokenPos = 0;
    //token分析的内容
    this.tokenContent = null;
    //token分析的内容字符串长度
    this.tokenContentLength = 0;
    //获取token需要跳过哪些
    this.tokenPass = {};
};

DFA.prototype.setTokenPassByRegExp = function(regExp){
    var flag = false;
    for(var id in this.endInfos)
    {
        if(this.endInfos[id] == regExp)
        {
            flag = true;
            this.tokenPass[id] = true;
        }
    }
    if(flag == false)
    {
        console.log();
        console.log("没有匹配的正则表达式，passRegExp",regExp);
        console.log();
    }
};

DFA.prototype.print = function(){
    console.log("打印DFA");
    for(var key in this.inputs)
    {
        console.log(key.charCodeAt(0),this.inputs[key]);
    }
    console.log("结束打印DFA");
}

DFA.prototype.setTokenContent = function(content){
    this.tokenContent = content;
    this.tokenPos = 0;
    this.tokenContentLength = content.length;
};

DFA.prototype.getNextToken = function () {
    if(this.tokenContentLength == 0)
    {
        if(!this.endInfos[this.start]) return null;
        return this.endInfos[this.start];
    }
    var ch;
    var findStart = this.tokenPos;
    var state = this.start;
    var lastEndPos = -1;
    var lastEndState = -1;
    while(this.tokenPos < this.tokenContentLength)
    {
        ch = this.tokenContent.charAt(this.tokenPos);
        if(ch == "\\")
        {
            this.tokenPos++;
            ch += this.tokenContent.charAt(this.tokenPos);
        }
        if(this.inputs.hasOwnProperty(ch) == false)
        {
            ch = "中";
        }
        if(this.moves[state] == undefined || this.moves[state][ch] == undefined)
        {
            break;
        }
        state = this.moves[state][ch];
        if(this.endInfos[state])
        {
            lastEndPos = this.tokenPos;
            lastEndState = state;
        }
        this.tokenPos++;
    }
    if(lastEndPos != -1)
    {
        if(this.tokenPass[lastEndState] != undefined)
        {
            this.tokenPos = lastEndPos + 1;
            return this.getNextToken();
        }
        this.tokenPos = lastEndPos + 1;
        var str = this.tokenContent.slice(findStart,this.tokenPos);
        return {"type":this.endInfos[lastEndState],"val":str};
    }
    return null;
};

DFA.prototype.find = function (str,search) {
    if(str.length == 0) return -1;
    var moves = this.moves;
    var endInfos = this.endInfos;
    var state = this.start;
    var pos = 0;
    var i = pos;
    var len = str.length;
    var ch;
    while(i < len)
    {
        ch = str.charAt(i);
        if(ch == "\\")
        {
            this.tokenPos++;
            ch += this.tokenContent.charAt(this.tokenPos);
        }
        if(moves[state] == undefined || moves[state][ch] == undefined)
        {
            state = this.start;
            pos++;
            i = pos;
        }
        else
        {
            state = moves[state][ch];
            if(endInfos[state] && search == endInfos[state])
            {
                return i - endInfos[state].length + 1;
            }
            i++;
        }
    }
    return -1;
}

/**
 * 测试DFA能否接受某个字符串
 * @param str
 */
DFA.prototype.test = function (str) {
    if(str.length == 0)
    {
        if(!this.endInfos[this.start]) return null;
        return this.endInfos[this.start];
    }
    var moves = this.moves;
    var endInfos = this.endInfos;
    var state = this.start;
    var i = 0;
    var len = str.length;
    var ch;
    while(i < len)
    {
        ch = str.charAt(i);
        if(ch == "\\")
        {
            this.tokenPos++;
            ch += this.tokenContent.charAt(this.tokenPos);
        }
        if(moves[state] == undefined || moves[state][ch] == undefined) return null;
        state = moves[state][ch];
        if(endInfos[state])
        {
            if(i == len - 1) return endInfos[state];
        }
        i++;
    }
    return null;
    /*if(str.length == 0)
    {
        if(this.start.endFlag == false) return null;
        else return this.start.exp;
    }
    var p = this.start;
    var ch;
    var i = 0;
    var len = str.length;
    while(i < len)
    {
        ch = str.charAt(i);
        if(!p.links[ch]) return null;
        p = p.links[ch];
        if(p.endFlag == true)
        {
            if(i == len - 1)
            {
                return p.exp;
            }
        }
        i++;
    }
    return null;*/
}

/**
 * 生成新的DFA
 * @param moves 所有的状态
 * @param moves 转换状态表
 * @param startId 开始ID
 * @param endIds 可接受的ID
 */
DFA.getDFAByMoves = function(allStates,moves,startId,endIds,inputs){
    console.log("生成DFA中...");
    /*console.log("DFA状态数：",allStates.length);
    var str = "";
    for(var a = 0; a < allStates.length; a++)
    {
        str += allStates[a] + ",";
    }
    console.log("状态：",str);
    console.log("开始状态：",startId);
    for(var p in endIds)
    {
        console.log("接受状态：",p,endIds[p]);
    }
    for(var p in moves)
    {
        for(var q in moves[p])
        {
            console.log(p," -> ",q," -> ",moves[p][q]);
        }
    }
    console.log("");
    console.log("");*/
    //第一步最小化DFA状态
    var groups = [[]];
    var findEnd;
    for(var i = 0; i < allStates.length; i++)
    {
        //如果是接受状态
        if(endIds[allStates[i]] != undefined)
        {
            findEnd = false;
            for(var f = 1; f < groups.length; f++)
            {
                if(endIds[groups[f][0]] == endIds[allStates[i]])
                {
                    groups[f].push(allStates[i]);
                    findEnd = true;
                    break;
                }
            }
            if(findEnd == false)
            {
                groups.push([allStates[i]]);
            }
        }
        else
        {
            groups[0].push(allStates[i]);
        }
    }
    /*for(i = 0; i < groups.length; i++)
    {
        str = "初始分组," + i + " : ";
        for(f = 0; f < groups[i].length; f++)
        {
            str += groups[i][f];
        }
        console.log(str);
    }
    console.log("");
    console.log("");*/
    /*for(i = 0; i < groups.length; i++)
    {
        for(f = 0; f < groups[i].length; f++)
        {
            console.log("组" + i," : ",groups[i][f]);
        }
    }*/
    /*for(i = 0; i < inputs.length; i++)
    {
        console.log("input : ",inputs[i]);
    }*/
    var first;
    var group;
    var state;
    var flag;
    while(true)
    {
        flag = true;
        for(i = 0; i < groups.length; i++)
        {
            for(f = 0; f < inputs.length; f++)
            {
                first = null;
                if(moves[groups[i][0]] != undefined && moves[groups[i][0]][inputs[f]] != undefined)
                {
                    first = moves[groups[i][0]][inputs[f]];
                    //console.log("组" + i + "第0个元素，状态" + groups[i][0] + "，输入" + inputs[f] + "之后转到状态：" + first);
                }
                group = [];
                for(var g = 1; g < groups[i].length; g++)
                {
                    state = null;
                    if(moves[groups[i][g]] != undefined && moves[groups[i][g]][inputs[f]] != undefined)
                    {
                        state = moves[groups[i][g]][inputs[f]];
                        //console.log("组" + i + "第" + g + "个元素，状态" + groups[i][g] + "，输入" + inputs[f] + "之后转到状态：" + state);
                    }
                    if(first != state)
                    {
                        flag = false;
                        group.push(groups[i][g]);
                        groups[i].splice(g,1);
                        g--;
                    }
                }
                if(flag == false)
                {
                    groups.push(group);
                    break;
                }
            }
            if(flag == false) break;
        }
        if(flag) break;
    }
    //console.log("分完组后状态数：",groups.length);
    var newMoves = [];
    var s;
    var newEnds = {};
    for(i = 0; i < groups.length; i++)
    {
        for(f = 0; f < groups.length; f++)
        {
            if(groups[i][f] == startId)
            {
                startId = i;
                //console.log("新的开始状态：",startId);
                break;
            }
        }
        //获取每个组的第一个状态
        if(endIds[groups[i][0]] != undefined)
        {
            newEnds[i] = endIds[groups[i][0]];
            //console.log("新的接受状态：",i,newEnds[i],groups[i][0]);
        }
        newMoves[i] = {};
        for(f = 0; f < inputs.length; f++)
        {
            if(moves[groups[i][0]] == undefined || moves[groups[i][0]][inputs[f]] == undefined) continue;
            s = moves[groups[i][0]][inputs[f]];
            flag = false;
            //console.log("旧的连接：",groups[i][0]," -> ",inputs[f]," -> ",s);
            for(var j = 0; j < groups.length; j++)
            {
                for(var k = 0; k < groups[j].length; k++)
                {
                    //console.log("检查：",j,k,groups[j][k],s);
                    if(s == groups[j][k])
                    {
                        newMoves[i][inputs[f]] = j;
                        flag = true;
                        //console.log("旧的连接：",groups[i][0]," -> ",inputs[f]," -> ",groups[j][k]);
                        //console.log("新的连接：",i," -> ",inputs[f]," -> ",j);
                        break;
                    }
                }
                if(flag) break;
            }
        }
    }
    moves = newMoves;
    endIds = newEnds;
    var allInputs = {};
    //console.log("我的输入：");
    for(var key in inputs)
    {
        allInputs[inputs[key]] = true;
        //console.log(allInputs[inputs[key]]);
    }
    inputs = allInputs;
    //console.log("我的输入End");

    //console.log("");
    //str = "";
    //for(var a = 0; a < allStates.length; a++)
    //{
    //    str += allStates[a] + ",";
    //}
    //str = "";
    //for(var p in inputs)
    //{
    //    str += p + ":" + inputs[p] + ",";
    //}
    //console.log("输入字符组：",str);
    //console.log("状态：",str);
    //console.log("开始状态：",startId);
    //for(var p in endIds)
    //{
    //    console.log("接受状态：",p,endIds[p]);
    //}
    //for(var p in moves)
    //{
    //    for(var q in moves[p])
    //    {
    //        console.log(p," -> ",q," -> ",moves[p][q]);
    //    }
    //}
    //console.log("");

    //第二部构造DFA
    var dfa = new DFA();
    dfa.start = startId;
    dfa.moves = moves;
    dfa.endInfos = endIds;
    dfa.inputs = inputs;
    return dfa;
    /*var dfa = new DFA();
    var node2;
    var node1;
    var nodes = {};
    var kyes;
    for(var id in moves)
    {
        if(!nodes[id])
        {
            node1 = new DFANode(id);
            nodes[id] = node1;
            if(id == startId) dfa.start = node1;
            if(endIds[id])
            {
                node1.endFlag = true;
                node1.exp = endIds[id];
            }
        }
        else
        {
            node1 = nodes[id];
        }
        for(var input in moves[id])
        {
            var id2 = moves[id][input];
            //console.log("DFA新转换：",id,input,id2);
            if(!nodes[id2])
            {
                node2 = new DFANode(id2);
                nodes[id2] = node2;
                if(id2 == startId) dfa.start = node2;
                if(endIds[id2])
                {
                    node2.endFlag = true;
                    node2.exp = endIds[id2];
                }
            }
            else
            {
                node2 = nodes[id2];
            }
            node1.addLink(input,node2);
        }
    }
    //console.log("DFA开始结点：" + dfa.start.id);
    return dfa;*/
};

module.exports = DFA;