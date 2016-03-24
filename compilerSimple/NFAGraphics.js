/**
 * Created by mengj_000 on 2015/4/4.
 */
var NFA = require("./NFA.js"),
    DFA = require("./DFA.js");
    NFANode = require("./NFANode.js"),
    NodeLink = require("./NodeLink.js") ;
/**
 * NFA图，即一个大的NFA
 * @constructor
 */
var NFAGraphics = function(){
    this.nodes = [];
    this.nodeId = 0;
    this.start = this.getNewNode();
    this.end = this.getNewNode();
    this.nfaRecords = {};
};

NFAGraphics.prototype.recordNewNFA = function (endId, reg,onceEnd,before) {

    var bfs;
    if(before)
    {
        bfs = {};
        for(var i = 0; i < before.length; i++)
        {
            bfs[before[i]] = true;
        }
    }
    this.nfaRecords[endId] = {"reg":reg,"once":onceEnd,"before":bfs};
}

/**
 * 产生一个新的结点
 * @returns {NFANode}
 */
NFAGraphics.prototype.getNewNode = function()
{
    var node = new NFANode(this.nodeId);
    this.nodeId++;
    this.nodes.push(node);
    return node;
};

/**
 * 融合两个结点
 * @param node1
 * @param node2
 * @returns {*}
 */
NFAGraphics.prototype.mixNodes = function(node1,node2)
{
    var find;
    for(var i = 0; i < node2.links.length; i++)
    {
        find = false;
        for(var j = 0; j < node1.links.length; j++)
        {
            if(node2.links[i].input == node1.links[j].input && node2.links[i].end == node1.links[j].end)
            {
                find = true;
                break;
            }
        }
        if(find == false)
        {
            node2.links[i].start = node1;
            node1.links.push(node2.links[i]);
        }
    }
    for(i = 0; i < this.nodes.length; i++)
    {
        if(this.nodes[i] == node2)
        {
            this.nodes.splice(i,1);
            break;
        }
    }
    return node1;
};

/**
 * 把NFA转化成DFA
 * 1.子集构造法
 * @returns {DFA}
 */
NFAGraphics.prototype.transToDFA  = function(){
    console.log("NFA转DFA");
    var inputs = [];
    var input;
    var recordInput;
    var flag;
    var moves = {};
    console.log("查询输入符号");
    for(var i = 0; i < this.nodes.length; i++)
    {
        for(var j = 0; j < this.nodes[i].links.length; j++)
        {
            input = this.nodes[i].links[j].input;
            recordInput = input;
            if(input == "")
            {

            }
            else if(typeof (input) == "number")
            {
                input = input + 48;
            }
            else
            {
                input = input.charCodeAt(0);
            }
            if( moves[this.nodes[i].id] == undefined)  moves[this.nodes[i].id] = {};
            if( moves[this.nodes[i].id][input] == undefined) moves[this.nodes[i].id][input] = [];
            moves[this.nodes[i].id][input].push(this.nodes[i].links[j].end.id);
            if(input == "") continue;
            flag = false;
            for(var c = 0; c < inputs.length; c++)
            {
                if(inputs[c] == input)
                {
                    flag = true;
                    break;
                }
            }
            if(flag == false) inputs.push(input);
        }
    }
    var newMoves = {};
    var records = {};
    var s = [];
    var newStates = [];
    this.moveToByE([this.start.id],moves,{},s);
    newStates.push(new StateGather(s));
    var g = newStates[0];
    var newg;
    var newStart = newStates[0].name;
    var newEnds = {};
    var newNodeNames = {};
    var newId = 0;
    var allStates = [];
    newNodeNames[newStart] = newId;
    newStart = newId;
    allStates.push(newId);
    newId++;
    console.log("去空状态");
    for(var k = 0; k < g.states.length; k++)
    {
        if(g.states[k] == this.end.id)
        {
            newEnds[newNodeNames[g.name]] = true;
        }
    }
    var name1;
    var name2;
    while(true){
        g = null;
        for(i = 0; i < newStates.length; i++)
        {
            if(!records[newStates[i].name])
            {
                g = newStates[i];
                break;
            }
        }
        if(g == null) break;
        records[g.name] = g;
        for(j = 0; j < inputs.length; j++)
        {
            s = this.moveTo(g.states,inputs[j],moves);
            newg = new StateGather(s);
            if(s.length == 0) continue;
            if(newNodeNames[newg.name])
            {

            }
            else
            {
                newNodeNames[newg.name] = newId;
                allStates.push(newId);
                newId++;
            }
            if(!records[newg.name]) newStates.push(newg);
            if(!newMoves[newNodeNames[g.name]]) newMoves[newNodeNames[g.name]] = {};
            if(newMoves[newNodeNames[g.name]][inputs[j]] != undefined) console.log("转DFA错误，已经存在的状态转换：",newNodeNames[g.name],inputs[j]);
            newMoves[newNodeNames[g.name]][inputs[j]] = newNodeNames[newg.name];
            for(var k = 0; k < newg.states.length; k++)
            {
                if(this.nfaRecords[newg.states[k]])
                {
                    newEnds[newNodeNames[newg.name]] = this.nfaRecords[newg.states[k]];
                    break;
                }
            }
        }
    }
    console.log("NFA优化完毕");
    return DFA.getDFAByMoves(allStates,newMoves,newStart,newEnds,inputs);
};

/**
 * 计算通过输入input能从状态集能到达的另一个状态集
 * @param states 状态集合
 * @param input 输入字符
 * @param moves 转换表
 */
NFAGraphics.prototype.moveTo = function(states,input,moves){
    var res = [];
    var find = {};
    this.moveToByE(states,moves,find,res);
    if(input == "") return res;
    states = res;
    res = [];
    find = {};
    var s;
    var arr;
    var ns;
    for(var i = 0; i < states.length; i++)
    {
        s = states[i];
        if(moves[s] == undefined) continue;
        if(moves[s][input] == undefined) continue;
        arr = moves[s][input];
        for(var a = 0; a < arr.length; a++)
        {
            ns = arr[a];
            if(find[ns]) break;
            find[ns] = true;
            res.push(ns);
        }
    }
    states = res;
    res = [];
    find = {};
    this.moveToByE(states,moves,find,res);
    return res;
};

/**
 * 计算通过空转换就能到的状态集合
 * @param states 输入状态
 * @param moves 转换状态图
 * @param find 已寻找过的状态
 * @param res 结果
 */
NFAGraphics.prototype.moveToByE = function(states,moves,find,res){
    var s;
    for(var i = 0; i < states.length; i++)
    {
        s = states[i];
        if(find[s]) continue;
        find[s] = true;
        res.push(s);
        if(!moves[s]) continue;
        if(!moves[s][""]) continue;
        var trans = moves[s][""];
        this.moveToByE(trans,moves,find,res);
    }
};

/**
 * 添加一条正则表达式
 * @param regExp
 */
NFAGraphics.prototype.addRegExp = function (regExp,onceEnd,before) {
    NFAGraphics.addNFAToGraphics(regExp,this,onceEnd,before);
}

/**
 *符号栈
 */
NFAGraphics.opstack = [];
/**
 *NFA栈
 */
NFAGraphics.nfastack = [];
/**
 *当前的graphics
 */
NFAGraphics.currentGraphics = null;

/**
 *向graphics中添加一个NFA
 */
NFAGraphics.addNFAToGraphics = function(exp,graphics,onceEnd,before)
{
    console.log("添加正则表达式",exp);
    NFAGraphics.currentGraphics = graphics;
    var ch;
    var i = 0;
    var len = exp.length;
    var nfa;
    var nextCh;
    var op;
    while(i<len)
    {
        ch = exp.charAt(i);
        if(ch == "\\")
        {
            i++;
            ch += exp.charAt(i);
        }
        if(ch == "|")
        {
            if(NFAGraphics.opstack.length)
            {
                op = NFAGraphics.opstack[NFAGraphics.opstack.length-1];
                while(op != "" && op != "(")
                {
                    NFAGraphics.popOpStack();
                    if(NFAGraphics.opstack.length == 0) break;
                    op = NFAGraphics.opstack[NFAGraphics.opstack.length-1];
                }
            }
            NFAGraphics.opstack.push("|");
        }
        else if(ch == "*")
        {
            nfa = new NFA();
            NFAGraphics.opstack.push("*");
            NFAGraphics.popOpStack();
            if(i < len - 1)
            {
                nextCh = exp.charAt(i+1);
                if(nextCh != ")" && nextCh != "*" && nextCh != "+" && nextCh != "|" && nextCh != "?")
                {
                    NFAGraphics.opstack.push(".");
                }
            }
        }
        else if(ch == "+")
        {
            nfa = new NFA();
            NFAGraphics.opstack.push("+");
            NFAGraphics.popOpStack();
            if(i < len - 1)
            {
                nextCh = exp.charAt(i+1);
                if(nextCh != ")" && nextCh != "*" && nextCh != "+" && nextCh != "|" && nextCh != "?")
                {
                    NFAGraphics.opstack.push(".");
                }
            }
        }
        else if(ch == "?")
        {
            nfa = new NFA();
            NFAGraphics.opstack.push("?");
            NFAGraphics.popOpStack();
            if(i < len - 1)
            {
                nextCh = exp.charAt(i+1);
                if(nextCh != ")" && nextCh != "*" && nextCh != "+" && nextCh != "|" && nextCh != "?")
                {
                    NFAGraphics.opstack.push(".");
                }
            }
        }
        else if(ch == "(")
        {
            NFAGraphics.opstack.push(ch);
        }
        else if(ch == ")")
        {
            op = NFAGraphics.opstack[NFAGraphics.opstack.length-1];
            while(op != "(")
            {
                NFAGraphics.popOpStack();
                op = NFAGraphics.opstack[NFAGraphics.opstack.length-1];
            }
            NFAGraphics.opstack.pop();
            if(i < exp.length - 1)
            {
                nextCh = exp.charAt(i+1);
                if(nextCh == "(" || (nextCh != "|" && nextCh != "*" && nextCh != "+" && nextCh != "?" && nextCh != ")"))
                {
                    NFAGraphics.opstack.push(".");
                }
            }
        }
        else //非运算符 构造NFA
        {
            if(ch == "\\*")
            {
                ch = "*";
            }
            else if(ch == "\\r")
            {
                ch = "\r";
            }else if(ch == "\\t")
            {
                ch = "\t";
            }else if(ch == "\\n")
            {
                ch = "\n";
            }
            else if(ch == "\\|")
            {
                ch = "|";
            }
            else if(ch == "\\+")
            {
                ch = "+";
            }
            else if(ch == "\\?")
            {
                ch = "?";
            }
            else if(ch == "\\(")
            {
                ch = "(";
            }
            else if(ch == "\\)")
            {
                ch = ")";
            }
            //console.log("构造nfa");
            //构造一个新的nfa，起点指向终点，边为当前字符
            nfa = new NFA();
            nfa.start = NFAGraphics.currentGraphics.getNewNode();
            nfa.end = NFAGraphics.currentGraphics.getNewNode();
            nfa.start.addLink(ch,nfa.end);
            NFAGraphics.nfastack.push(nfa);
            //如果有下一个字符
            if(i < len - 1)
            {
                nextCh = exp.charAt(i+1);
                if(nextCh == "(" || (nextCh != "|" && nextCh != "*" && nextCh != "+" && nextCh != "?" && nextCh != ")"))
                {
                    NFAGraphics.opstack.push(".");
                }
            }
        }
        i++;
    }
    while(NFAGraphics.opstack.length)
    {
        NFAGraphics.popOpStack();
    }
    if(NFAGraphics.nfastack.length != 1)
    {
        console.log("出错啦",NFAGraphics.nfastack.length);
    }
    nfa = NFAGraphics.nfastack.pop();
    NFAGraphics.currentGraphics.start.addLink("",nfa.start);
    nfa.end.addLink("",NFAGraphics.currentGraphics.end);
    i = 0;
    //while(i < exp.length)
    //{
    //    ch = exp.charAt(i);
    //    if(ch == "\\")
    //    {
    //        exp = exp.slice(0,i) + exp.slice(i+1,exp.length);
    //        i--;
    //    }
    //    i++;
    //}
    NFAGraphics.currentGraphics.recordNewNFA(nfa.end.id,exp,onceEnd,before);
    console.log("添加正则表达式完成");
    return NFAGraphics.currentGraphics;
};

/**
 *弹出并计算符号栈顶元素
 *
 */
NFAGraphics.popOpStack = function()
{
    var op = NFAGraphics.opstack.pop();
    var nfa;
    var nfa2;
    var nfa3;
    //连接运算符
    if(op == ".")
    {
        nfa = new NFA();
        nfa3 = NFAGraphics.nfastack.pop();
        nfa2 = NFAGraphics.nfastack.pop();
        nfa3.start = NFAGraphics.currentGraphics.mixNodes(nfa2.end,nfa3.start);
        nfa.start = nfa2.start;
        nfa.end = nfa3.end;
        NFAGraphics.nfastack.push(nfa);
    }
    else if(op == "|")
    {
        nfa = new NFA();
        nfa.start = NFAGraphics.currentGraphics.getNewNode();
        nfa.end = NFAGraphics.currentGraphics.getNewNode();
        nfa2 = NFAGraphics.nfastack.pop();
        nfa3 = NFAGraphics.nfastack.pop();
        nfa.start.addLink("",nfa2.start);
        nfa.start.addLink("",nfa3.start);
        nfa2.end.addLink("",nfa.end);
        nfa3.end.addLink("",nfa.end);
        NFAGraphics.nfastack.push(nfa);
    }
    else if(op == "*")
    {
        nfa = new NFA();
        nfa.start = NFAGraphics.currentGraphics.getNewNode();
        nfa.end = NFAGraphics.currentGraphics.getNewNode();
        nfa2 = NFAGraphics.nfastack.pop();
        nfa.start.addLink("",nfa2.start);
        nfa2.end.addLink("",nfa.end);
        nfa.start.addLink("",nfa.end);
        nfa2.end.addLink("",nfa2.start);
        NFAGraphics.nfastack.push(nfa);
    }
    else if(op == "+")
    {
        nfa = new NFA();
        nfa.start = NFAGraphics.currentGraphics.getNewNode();
        nfa.end = NFAGraphics.currentGraphics.getNewNode();
        nfa2 = NFAGraphics.nfastack.pop();
        nfa.start.addLink("",nfa2.start);
        nfa2.end.addLink("",nfa.end);
        nfa2.end.addLink("",nfa2.start);
        NFAGraphics.nfastack.push(nfa);
    }
    else if(op == "?")
    {
        nfa = new NFA();
        nfa.start = NFAGraphics.currentGraphics.getNewNode();
        nfa.end = NFAGraphics.currentGraphics.getNewNode();
        nfa2 = NFAGraphics.nfastack.pop();
        nfa.start.addLink("",nfa2.start);
        nfa2.end.addLink("",nfa.end);
        nfa.start.addLink("",nfa.end);
        NFAGraphics.nfastack.push(nfa);
    }
};

module.exports = NFAGraphics;

var StateGather = function(states){
    this.states = states;
    this.name = "";
    for(var i = 0; i < this.states.length; i++)
    {
        this.name += this.states[i] + (i < this.states.length - 1?"++":"");
    }
};
