/**
 * Created by mengj_000 on 2015/4/7.
 */
var TokenType = require("./output/as3/core/TokenType.js");
/**
 * 产生式
 * @param head 产生式的名称
 * @param exp 产生式的表达式数组
 * @constructor
 */
var Create = function(head,exp,prec,code){
    this.id = Create.id;
    Create.id++;
    this.head = head;
    this.exp = exp;
    this.prec = prec;
    this.code = code;

    this.createHash();
    //console.log("[添加表达式] ",Create.id);
};

Create.hash = {};
Create.hashId = 1;

Create.prototype.createHash = function(){
    //return;
    this.hash = this.head + ":";
    for(var i = 0; i < this.exp.length; i++)
    {
        this.hash += "I" + i + "" + this.exp[i];
    }
    this.hash += this.prec;
    if(Create.hash[this.hash] == undefined)
    {
        Create.hash[this.hash] = Create.hashId;
        Create.hashId++;
    }
    this.hash = Create.hash[this.hash];
}

//Create.prototype.equals = function(create){
//    return create.hash==this.hash?true:false;
//    if(this.head != create.head || this.exp.length != create.exp.length) return false;
//    for(var i = 0; i < this.exp.length; i++)
//    {
//        if(this.exp[i] != create.exp[i]) return false;
//    }
//    return true;
//};

Create.id = 0;

//function createItem(create,pos,next)
//{
//    var obj = {};
//    obj.id = Item.id;
//    Item.id++;
//    obj.create = create;
//    obj.pos = pos;
//    obj.next = next;
//    obj.hash = create.hash + ":" + pos + ":" + next;
//    return obj;
//}

/**
 * 项
 * @param create
 * @param pos
 * @constructor
 */
var Item = function(create,pos,next){
    this.create = create;
    this.pos = pos;
    //预测符号，LR(1)语言中的第二个参数
    this.next = next;

    this.hash = this.create.hash + ":" + this.pos + ":" + this.next;
    //console.log("[添加Item] ",Item.id);
};

Item.id = 0;

Item.record = {};

/**
 * 项集
 * @constructor
 */
var Closure = function(){
    this.id = Closure.id;
    Closure.id ++;
    this.items = [];
    //console.log("[添加Closure] ",Closure.id);
};

/**
 * 添加项
 * @param item
 */
Closure.prototype.addItem = function(item){
    for(var i = 0; i < this.items.length; i++)
    {
        if(this.items[i].create.hash == item.create.hash && this.items[i].pos == item.pos && this.items[i].next == item.next) return false;
    }
    this.items.push(item);
    return item;
};

Closure.prototype.getItemByExpAndPos = function(create,pos)
{
    for(var i = 0; i < this.items.length; i++)
    {
        if(this.items[i].pos == pos && this.items[i].create.hash == create.hash)
        {
            return this.items[i];
        }
    }
    return null;
}

Closure.prototype.createHash = function()
{
    this.hash = "";
    for(var i = 0; i < this.items.length; i++)
    {
        this.hash += " " + this.items[i].hash;
    }
}

/**
 * 判断两个Closure是否具有相同的核心
 * @param closure
 */
Closure.prototype.hasSameCore = function(closure){
    if(this.items.length != closure.items.length) return false;
    var flag;
    for(var i = 0; i < this.items.length; i++)
    {
        flag = false;
        for(var j = 0; j < closure.items.length; j++)
        {
            //找到相同核心
            if(this.items[i].create == closure.items[j].create)
            {
                flag = true;
                break;
            }
        }
        if(flag == false) return false;
    }
    return true;
};

/**
 * 融合两个Closure
 * @param closure
 */
Closure.prototype.memgerCore = function(closure,goto,action) {
    for(var i = 0; i < this.items.length; i++)
    {
        for(var j = 0; j < closure.items.length; j++)
        {
            //找到相同核心
            if(this.items[i].create == closure.items[j].create)
            {
                this.addItem(closure.items[j]);
                break;
            }
        }
    }
    var newGoto = {};
    //合并goto函数
    for(var k in goto)
    {
        if(k + "" == closure.id + "") continue;
        newGoto[k] = {};
        for(var p in goto[k])
        {
            if(goto[k][p] == closure.id) newGoto[k][p] = this.id;
            else newGoto[k][p] = goto[k][p];
        }
    }
    for(k in goto)
    {
        if(k + "" == closure.id + "")
        {
            newGoto[this.id] = {};
            for(p in goto[k])
            {
                if(goto[k][p] == closure.id) newGoto[this.id][p] = this.id;
                else newGoto[this.id][p] = goto[k][p];
            }
        }
    }
    for(k in goto)
    {
        delete goto[k];
    }
    for(k in newGoto)
    {
        goto[k] = newGoto[k];
    }
    //合并action函数
    var newAction = {};
    for(k in action)
    {
        if(k + "" == closure.id + "") continue;
        newAction[k] = {};
        for(var m in action[k])
        {
            newAction[k][m] = {};
            for(p in action[k][m])
            {
                if(action[k][m].a == 2)
                {
                    if(action[k][m][p] == this.id) newAction[k][m][p] = this.id;
                    else newAction[k][m][p] = action[k][m][p];
                }
                else
                {
                    newAction[k][m][p] = action[k][m][p];
                }
            }
        }
    }
    for(k in action)
    {
        if(k + "" == closure.id + "")
        {
            newAction[this.id] = {};
            for(m in action[k])
            {
                newAction[this.id][m] = {};
                for(p in action[k][m])
                {
                    if(action[k][m].a == 2)
                    {
                        if(action[k][m][p] == this.id) newAction[this.id][m][p] = this.id;
                        else newAction[this.id][m][p] = action[k][m][p];
                    }
                    else
                    {
                        newAction[this.id][m][p] = action[k][m][p];
                    }
                }
            }
        }
    }
    for(k in action)
    {
        delete action[k];
    }
    for(k in newAction)
    {
        action[k] = newAction[k];
    }
};

Closure.prototype.print = function(){
    console.log("[Closure] id = ",this.id);
    for(var i = 0; i < this.items.length; i++)
    {
        console.log("[Print Closure] ",this.id,this.items[i]);
    }
};

Closure.id = 1;

/**
 * LRDFA LR文法自动机
 * @constructor
 */
var LRDFA = function(){
    //表达式集合
    this.creates = [];
    //全部输入
    this.inputs = [];
    //Action表
    this.action = {};
    //goto表
    this.goto = {};
    /**非终结符号表*/
    this.names = {};
    /**运算符优先级**/
    this.levels = {};
    /**优先级包含的所有运算符**/
    this.levelSign = {};
    //所有项闭包
    this.closures = [];
    //公用数据
    this.commonInfo = null;
    //表达式转换表
    this.expNameTrans = {};
    this.expNameTransId = 0;

    this.closureRecord = {};
};

/**栈顶元素**/
LRDFA.endSign = "$";
/**增广表达式的开始符号**/
LRDFA.startSign = "S'";

/**
 * 词法分析与语法分析的共享对象
 * info:
 * {
 *  scanner:,
 *  ids:{
 *      x:{name:x}
 *  },
 *  tokenValue:
 *  tokenPos:
 * }
 * @param info
 */
LRDFA.prototype.setCommonInfo = function(info){
    this.commonInfo = info;
};

/**
 * 翻译文件
 * @param content
 * @returns {string}
 */
LRDFA.prototype.transformToTS = function(content){
    console.log("翻译");
    console.log(content);
    console.log();
    var str = "";
    var commonInfo = this.commonInfo;
    var scanner = this.commonInfo.scanner;
    scanner.setTokenContent(content);
    var token;
    token = scanner.getNextToken();
    if(token == TokenType.op) token = commonInfo.tokenValue;
    if(token == null) return;
    var state = 1; //初始状态
    var stack = [state];//状态栈
    var i;
    var action;
    while(true)
    {
        //查看规约和移入情况
        if(this.action[state][token] == undefined)
        {
            console.log("语法分析错误，" + getFilePosInfo(content,commonInfo.tokenPos) + "：" + content.slice(commonInfo.tokenPos,commonInfo.tokenPos+10));
            return str;
        }
        action = this.action[state][token];
        //console.log("当前token：",token," action：",action);
        //规约 {"a":1,"c":{"head":"T","exp":["T","+","F"]}}
        if(action.a == 0)
        {
            console.log("接受");
            break;
        }
        else if(action.a == 1) //规约
        {
            i = action.c.exp.length;
            while(i)
            {
                stack.pop();
                i--;
            }
            state = stack[stack.length-1];
            state = this.goto[state][action.c.head];
            stack.push(state);
            console.log("规约：", action.c.exp,stack);
        }
        else //移入 {"a":2,"to":2}
        {
            state = this.action[state][token].to;
            stack.push(state);
            console.log("移入：",token, stack);
            token = null;
        }
        if(token == null && token != LRDFA.endSign)
        {
            token = scanner.getNextToken();
            if(token == null) token = LRDFA.endSign;
            if(token == TokenType.op) token = commonInfo.tokenValue;
            //console.log("获取token: ",token);
        }
    }
    return str;
};

/**
 * 往文法分析器中添加一个产生式
 * 例如factor -> '(' expr ')'|DIGIT
 * 传入factor,'(' expr ')'|DIGIT
 * 注意，大写的是非终结符，小写的是总结符（词法单元）
 * @param head 产生式的头
 * @param exp 产生式的表达式
 */
LRDFA.prototype.addFunction = function(head,exp,prec,code){
    //转换名称
    if(this.expNameTrans[head] == undefined)
    {
        this.expNameTransId ++;
        this.expNameTrans[head] = this.expNameTransId;

        //记录终结符号
        this.names[this.expNameTrans[head]] = true;
    }

    //this.names[head] = true;

    //ascii码表 A-65 Z-90 a-97 z-122
    var arr = [];
    var ch;
    var name = "";
    for(var i = 0; i < exp.length; i++) {
        ch = exp.charAt(i);
        if (ch == " ") {
            if (name != "") {
                arr.push(name);
                name = "";
            }
            continue;
        }
        if (ch == "\r" || ch == "\n" || ch == "\t") continue;
        if (ch == "|") {
            if (name != "") {
                arr.push(name);
                name = "";
            }
            this.creates.push(new Create(head,arr,prec,code));
            arr = [];
            continue;
        }
        if (ch == "'") {
            if (name != "") {
                arr.push(name);
                name = "";
            }
            name = "";
            for (var f = i + 1; f < exp.length; f++) {
                ch = exp.charAt(f);
                if (ch == "\\") {
                    f++;
                    if (exp.charAt(f) == "'") name += exp.charAt(f);
                    continue;
                }
                if (ch == "'") {
                    arr.push(name);
                    name = "";
                    i = f;
                    break;
                }
                else {
                    name += ch;
                }
            }
        }
        else if (ch == ";") {
            if (name != "")
            {
                arr.push(name);
            }
            this.creates.push(new Create(head,arr,prec,code));
        }
        else {
            name += exp.charAt(i);
        }
    }
};

/**
 * 构造DFA
 * 1.添加增广表达式
 * 2.获取全部输入符号
 * 3.构造项集
 * 4.项集分组，构造DFA
 */
LRDFA.prototype.createDFA = function () {
    for(var i = 0; i < this.creates.length; i++)
    {
        if(this.expNameTrans[this.creates[i].head]) this.creates[i].head = this.expNameTrans[this.creates[i].head];
        for(var c = 0; c < this.creates[i].exp.length; c++)
        {
            if(this.expNameTrans[this.creates[i].exp[c]] != undefined)
            {
                this.creates[i].exp[c] = this.expNameTrans[this.creates[i].exp[c]];
            }
        }
        this.creates[i].createHash();
        console.log("表达式：",this.creates[i].head," -> ",this.creates[i].exp, " hash：",this.creates[i].hash);
    }

    //1.添加增广表达式
    var startSign = LRDFA.startSign;
    this.addFunction(startSign,this.creates[0].head + ";");
    //2.获取全部输入符号
    var inputs = [];
    var flag;
    for(var i = 0; i < this.creates.length; i++)
    {
        for(var j = 0; j < this.creates[i].exp.length; j++)
        {
            flag = true;
            for(var k = 0; k < inputs.length; k++)
            {
                if(this.creates[i].exp[j] == inputs[k])
                {
                    flag = false;
                    break;
                }
            }
            if(flag) inputs.push(this.creates[i].exp[j]);
        }
    }
    this.inputs = this.inputs.concat(inputs);
    //3.构造项集
    var items = [];
    var itemHash;
    var newItem;
    for(i = 0; i < this.creates.length; i++)
    {
        for(j = 0; j <= this.creates[i].exp.length; j++)
        {
            itemHash = this.creates[i].hash + ":" + j + ":";
            if(Item.record[itemHash]) newItem = Item.record[itemHash];
            else
            {
                Item.id ++;
                Item.record[itemHash]  = newItem = {"create":this.creates[i],"pos":j,"next":"","hash":itemHash};
            }
            items.push(newItem);
        }
    }
    //4.分组，构造DFA
    var startCreate = this.getCreateByHead(startSign)[0];
    itemHash = startCreate.hash + ":0:"+LRDFA.endSign;
    var item = {"create":startCreate,"pos":0,"next":LRDFA.endSign,"hash":itemHash};
    Item.record[itemHash] = item;
    var start = new Closure();
    start = this.createClosure(item,start,null,{}); //初始项闭包
    start.createHash();
    this.closureRecord[start.hash] = start;
    this.closures.push(start);
    var closure = start;
    var newClosure;
    var records = {}; //表示哪个项集已经遍历过
    var myItemRecord;
    var lastCount = 50;
    while(closure != null)
    {
        if(this.closures.length > lastCount)
        {
            console.log("内核数：" + this.closures.length);
            lastCount += 50;
        }
        if(this.action[closure.id] == undefined) this.action[closure.id] = {};
        if(this.goto[closure.id] == undefined) this.goto[closure.id] = {};
        records[closure.id] = true;
        for(i = 0; i < closure.items.length; i++) {
            if (closure.items[i].pos == closure.items[i].create.exp.length) //规约，加入action表
            {
                var findPos = closure.items[i].pos - 1;
                var findPQ;
                var findClosure = closure;
                var sameFlag = false;
                while(findPos >= 0)
                {
                    findPQ = false;
                    for(var p in this.goto)
                    {
                        for(var q in this.goto[p])
                        {
                            if(this.goto[p][q] == findClosure.id && q == closure.items[i].create.exp[findPos])
                            {
                                findPQ = true;
                                for(var r = 0; r < this.closures.length; r++)
                                {
                                    if(this.closures[r].id == p)
                                    {
                                        findClosure = this.closures[r];
                                        if(findPos == 0)
                                        {
                                            if(this.goto[findClosure.id][closure.items[i].create.head] == closure.id)
                                            {
                                                sameFlag = true;
                                            }
                                            break;
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        if(findPQ == true) break;
                    }
                    if(findPQ == false) break;
                }
                findPos--;
                if(sameFlag)
                {
                    continue;
                }

                //规约-规约冲突
                if(this.action[closure.id][closure.items[i].next] != undefined)
                {
                    var sign1 = "";
                    var sign2 = "";
                    if(this.action[closure.id][closure.items[i].next].c.prec != "")
                    {
                        sign1 = this.action[closure.id][closure.items[i].next].c.prec;
                    }
                    else
                    {
                        for(var k = 0; k < this.action[closure.id][closure.items[i].next].c.exp.length; k++)
                        {
                            if(this.levelSign[this.action[closure.id][closure.items[i].next].c.exp[k]] != undefined)
                            {
                                sign1 += this.action[closure.id][closure.items[i].next].c.exp[k];
                            }
                        }
                    }
                    if(closure.items[i].create.prec != "")
                    {
                        sign2 = closure.items[i].create.prec;
                    }
                    else
                    {
                        for(k = 0; k < closure.items[i].create.exp.length; k++)
                        {
                            if(this.levelSign[closure.items[i].create.exp[k]] != undefined)
                            {
                                sign2 += closure.items[i].create.exp[k];
                            }
                        }
                    }
                    if(sign1 == "" || sign2 == "")
                    {
                        console.log("构造LR(1)错误，规约-规约冲突.",closure.id,closure.items[i].next,this.action[closure.id][closure.items[i].next].c);
                        console.log(closure.items[i]);
                        return;
                    }
                    else
                    {
                        if(this.levels[sign2].level > this.levels[sign1].level)
                        {

                            if (closure.items[i].create.head == LRDFA.startSign) this.action[closure.id][closure.items[i].next] = {"a": 0,"c":closure.items[i].create};
                            else this.action[closure.id][closure.items[i].next] = {"a": 1, "c": closure.items[i].create};
                        }
                        else if(this.levels[sign2].level == this.levels[sign1].level)
                        {
                            if(this.levels[sign2].type == "right")
                            {
                                if (closure.items[i].create.head == LRDFA.startSign) this.action[closure.id][closure.items[i].next] = {"a": 0,"c":closure.items[i].create};
                                else this.action[closure.id][closure.items[i].next] = {"a": 1, "c": closure.items[i].create};
                            }
                        }
                    }
                }
                else
                {
                    if (closure.items[i].create.head == LRDFA.startSign) this.action[closure.id][closure.items[i].next] = {"a": 0,"c":closure.items[i].create};
                    else this.action[closure.id][closure.items[i].next] = {"a": 1, "c": closure.items[i].create};
                }
            }
        }
        myItemRecord = {};
        for(i = 0; i < this.inputs.length; i++)
        {
            var hash = "";
            var newItems = [];
            for(j = 0; j < closure.items.length; j++)
            {
                //已经是此表达式的最后一项了
                if(closure.items[j].pos == closure.items[j].create.exp.length) continue;
                //判断项的下一个输入符是否为当前要判断的输入符
                if(closure.items[j].create.exp[closure.items[j].pos] != this.inputs[i]) continue;
                myItemRecord[this.inputs[i]] = closure.items[j];
                //myItem = closure.items[j];
                itemHash = closure.items[j].create.hash + ":" + (closure.items[j].pos+1) + ":"+closure.items[j].next;
                newItem = Item.record[itemHash];
                if(newItem)
                {
                    item = newItem;
                }
                else
                {
                    Item.id ++ ;
                    Item.record[itemHash] = item = {"create":closure.items[j].create,"pos":closure.items[j].pos+1,"next":closure.items[j].next,"hash":itemHash};
                }
                hash += item.hash + " ";
                newItems.push(item);
            }
            var newC;
            if(this.closureRecord[hash])
            {
                newClosure = this.closureRecord[hash];
                newC = false;
                //flag = true;
            }
            else
            {
                //flag = false;
                newC = true;
                newClosure = new Closure();
                LRDFA.addNewClosureId++;
                this.closureRecord[hash] = newClosure;
                for(j = 0; j < newItems.length; j++)
                {
                    newClosure = this.createClosure(newItems[j],newClosure,null,{});
                    newClosure.createHash();
                    this.closureRecord[newClosure.hash] = newClosure;
                }
                //this.closures.push(newClosure);
            }
            if(newClosure && newClosure.items.length)
            {
                flag = this.existClosure(newClosure);
                if(flag == false)
                {
                    this.closures.push(newClosure);
                }
                else
                {
                    newClosure = flag;
                }
                if(this.names[this.inputs[i]] == undefined) //终结符，加入action表
                {
                    if(this.action[closure.id][this.inputs[i]] != undefined)
                    {
                        //移入-规约冲突
                        if(this.action[closure.id][this.inputs[i]].a == 1)
                        {
                            var sign1 = "";
                            var sign2 = "";
                            if(this.action[closure.id][this.inputs[i]].c.prec != "")
                            {
                                sign1 = this.action[closure.id][this.inputs[i]].c.prec;
                            }
                            else
                            {
                                for(var k = 0; k < this.action[closure.id][this.inputs[i]].c.exp.length; k++)
                                {
                                    if(this.levelSign[this.action[closure.id][this.inputs[i]].c.exp[k]] != undefined)
                                    {
                                        sign1 += this.action[closure.id][this.inputs[i]].c.exp[k];
                                    }
                                }
                            }
                            if(myItemRecord[this.inputs[i]].create.prec != "")
                            {

                                sign2 = myItemRecord[this.inputs[i]].create.prec;
                            }
                            else
                            {
                                for(k = 0; k < myItemRecord[this.inputs[i]].create.exp.length; k++)
                                {
                                    if(this.levelSign[myItemRecord[this.inputs[i]].create.exp[k]] != undefined)
                                    {
                                        sign2 += myItemRecord[this.inputs[i]].create.exp[k];
                                    }
                                }
                            }
                            if(sign1 == "" || sign2 == "")
                            {
                                this.action[closure.id][this.inputs[i]] = {"a":2,"to":newClosure.id};
                            }
                            else
                            {
                                if(this.levels[sign2].level > this.levels[sign1].level)
                                {
                                    this.action[closure.id][this.inputs[i]] = {"a":2,"to":newClosure.id};
                                }
                                else if(this.levels[sign2].level == this.levels[sign1].level)
                                {
                                    if(this.levels[sign2].type == "right") this.action[closure.id][this.inputs[i]] = {"a":2,"to":newClosure.id};
                                }
                            }
                        }
                        else
                        {
                            console.log("构造LR(1)错误2.Closure.id = " + closure.id + "->" + newClosure.id + ",input : " + this.inputs[i] + ",exp : " ,this.action[closure.id][this.inputs[i]]);
                        }
                    }
                    else
                    {
                        this.action[closure.id][this.inputs[i]] = {"a":2,"to":newClosure.id};
                    }
                }
                else //非终结符，加入goto表
                {
                    this.goto[closure.id][this.inputs[i]] = newClosure.id;
                }
            }
        }
        closure = null;
        for(i = 0; i < this.closures.length; i++)
        {
            if(records[this.closures[i].id] == undefined)
            {
                closure = this.closures[i];
                break;
            }
        }
    }
    console.log("语法分析器构造完成");
    console.log(Create.id,Item.id,Closure.id,LRDFA.first,this.closures.length,LRDFA.addNewClosureId,LRDFA.createClosureId);
};

LRDFA.firstRecord = {};

LRDFA.prototype.countClosure = function(closure)
{
    var creates = this.creates;
    var item;
    var ch;
    var ends;
    var first;
    var newItem;
    for(var i = 0; i < closure.items.length; i++)
    {
        item = closure.items[i];
        ch = item.create.exp[item.pos];
        //如果项所在的符号是终结符则直接返回这个
        if(this.names[ch] == undefined) continue;
        for(var c = 0; c < creates.length; c++)
        {
            if(creates[c].head == ch)
            {
                newItem = closure.getItemByExpAndPos(creates[c],0);
                if(!newItem)
                {
                    newItem = new Item(creates[c],0);
                    closure.addItem(newItem);
                }
                first = {};
                ends = item.create.exp.slice(item.pos+1,item.create.exp.length).concat([k]);
                this.getFirst(ends,first);
                for(var f in first)
                {
                    newItem.next[f] = true;
                    start.getItemByExpAndPos(newItem.create,newItem.pos).next[f] = true;
                    //console.log("新向前看符号,",f,start.getItemByExpAndPos(newItem.create,newItem.pos).create.head," -> ",start.getItemByExpAndPos(newItem.create,newItem.pos).create.exp);
                }
            }
        }
    }
}

LRDFA.first = 0 ;
/**
 * 求表达式的First集合
 * @param exps
 */
LRDFA.prototype.getFirst = function(exps,first,checks){
    LRDFA.first++;
    first = first||{};
    checks = checks||[];
    var same;
    for(var i = 0; i < checks.length; i++)
    {
        if(checks[i].length != exps.length) continue;
        same = true;
        for(var j = 0; j < checks[i].length; j++)
        {
            if(checks[i][j] !=  exps[j])
            {
                same = false;
                break;
            }
        }
        if(same) return;
    }
    var expStr = "";
    for(i = 0; i < exps.length;i++) expStr += ":" + exps[i];
    checks.push(exps);
    var pos = 0;
    var exp;
    var nullFlag;
    while(pos < exps.length)
    {
        exp = exps[pos];
        //如果是终结符
        if(this.names[exp] == undefined)
        {
            if(first[exp] == undefined) first[exp] = true;
            return first;
        }
        //如果是非终结符，例如A
        nullFlag = false;
        //遍历所有的exp
        //把形如 A -> aB... A -> dF 之类的a,b等终结符全部加入到First里
        for(var i = 0; i < this.creates.length; i++) {
            //是否以A开头
            if (this.creates[i].head == exp) {
                //如果此表达式为空
                if (this.creates[i].exp.length == 0) {
                    nullFlag = true;
                }
                else {
                    //第一个字符是否为终结符
                    if (this.names[this.creates[i].exp[0]] == undefined) {
                        //如果是终结符就把这个符号直接加进First中
                        if (first[this.creates[i].exp[0]] == undefined) first[this.creates[i].exp[0]] = true;
                    }
                    else {
                        //如果是非终结符就把这个的非终结符First加入其中
                        var equal = exps.length == this.creates[i].exp.length ? true : false;
                        if (equal) {
                            for (var m = 0; m < exps.length; m++) {
                                if (exps[m] != this.creates[i].exp[m]) {
                                    equal = false;
                                    break;
                                }
                            }
                        }
                        if (!equal)
                        {
                            this.getFirst(this.creates[i].exp, first,checks);
                        }
                    }
                }
            }
        }
        if(nullFlag)
        {
            this.getFirst(exps.slice(pos + 1,exps.length),first,checks);
        }
        else break;
        pos++;
    }
    return first;
};


LRDFA.prototype.hasNullCreate = function(head){
    for(var i = 0; i < this.creates.length; i++)
    {
        if(this.creates[i].head == head && this.creates[i].exp.length == 0) return true;
    }
    return false;
}

LRDFA.addNewClosureId = 0;
/**
 * 求项集的闭包
 * 1.将item加入闭包中
 * 2.如果A->a.Bc在closure(item)中，B->b是一个产生式，并且B->.b不在产生式中，就将这个项加入其中。不断的应用这个规则，直到没有新的项可以加入到closure(item)中为止
 * @param item 项Item
 * @return Closure 项集
 * @param ends 后缀
 */
LRDFA.createClosureId = 0;
LRDFA.prototype.createClosure = function(item,closure,ends){
    var recordItem = item;
    LRDFA.createClosureId++;
    ends = ends||[];
    closure.addItem(item);
    var pItem = item;
    if(item.pos < item.create.exp.length && this.hasNullCreate(item.create.exp[item.pos]))
    {
        var nullCreate = new Create(item.create.head,item.create.exp.slice(0,item.pos).concat(item.create.exp.slice(item.pos+1,item.create.exp.length)),item.create.prec,item.create.code);
        var ItemHash = nullCreate.hash + ":" + item.pos + ":"+item.next;
        if(false && Item.record[ItemHash]) nullItem = Item.record[ItemHash];
        else
        {
            Item.id++;
            Item.record[ItemHash] = nullItem = {"create":nullCreate,"pos":item.pos,"next":item.next,"hash":ItemHash};
        }
        if(nullItem.create.exp.length) closure = this.createClosure(nullItem,closure,ends);
    }
    var ch = item.create.exp[item.pos];
    //如果项所在的符号是终结符则直接返回这个
    if(this.names[ch] == undefined){
        //有可能同样的Item已经在this.closures里了，需要判断
        return closure;
    }
    //如果是终结符，就需要重判断有没有新的items进来
    ends = item.create.exp.slice(item.pos + 1,item.create.exp.length).concat(ends);
    var exps = ends.concat(item.next);
    var first;
    var expsstr = "";
    for(var ccc = 0; ccc < exps.length; ccc++) expsstr += " " + exps[ccc];
    if(LRDFA.firstRecord[expsstr] != undefined) first = LRDFA.firstRecord[expsstr];
    else LRDFA.firstRecord[expsstr] =  first = this.getFirst(exps);
    for(var i = 0; i < this.creates.length; i++)
    {
        if(this.creates[i].head == ch)
        {
            if(this.creates[i].exp.length == 0)
            {
                continue;
            }
            for(var key in first)
            {
                var itemHash = this.creates[i].hash + ":0:"+key;
                var newItem;
                if(Item.record[itemHash]) newItem = Item.record[itemHash];
                else
                {
                    Item.id++;
                    Item.record[itemHash] = newItem = {"create":this.creates[i],"pos":0,"next":key,"hash":itemHash};
                }
                if(closure.addItem(newItem))
                {
                    closure = this.createClosure(newItem,closure,ends);
                }
            }
        }
    }
    return closure;
};

/**
 * 查询项闭包是否已存在
 * @param closure
 */
LRDFA.prototype.existClosure = function(closure){
    var flag;
    for(var i = 0; i < this.closures.length; i++)
    {
        if(this.closures[i].items.length != closure.items.length) continue;
        for(var j = 0; j < closure.items.length; j++)
        {
            flag = false;
            for(var k = 0; k < this.closures[i].items.length; k++)
            {
                if(this.closures[i].items[k].hash == closure.items[j].hash)
                {
                    flag = true;
                    break;
                }
            }
            if(flag == false) break;
        }
        if(flag == true) return this.closures[i];
    }
    return false;
};

/**
 * 根据非终结符查找产生式
 * @param head 非终结符，即产生式的名称
 *
 * @returns {Array}
 */
LRDFA.prototype.getCreateByHead = function(head){
    var res = [];
    for(var i = 0; i < this.creates.length; i++)
    {
        if(this.creates[i].head == head)
        {
            res.push(this.creates[i]);
        }
    }
    return res;
};

/**
 * 查询项
 * @param create
 * @returns [Item,...]
 */
LRDFA.prototype.getItemByCreate = function(create){
    for(var i = 0; i < this.items.length; i++)
    {
        if(this.items[i].create == create) return this.items[i];
    }
    return null;
};

/**
 * 创造LRLA
 */
LRDFA.prototype.createLRLA = function() {
    var records = {}; //表示哪个核心是检测过的
    var closure;
    var closure2;
    var newGoto = {};
    var newAction = {};
    for(var k in this.goto)
    {
        newGoto[k] = {};
        for(var p in this.goto[k])
        {
            newGoto[k][p] = this.goto[k][p];
        }
    }
    for(k in this.action)
    {
        newAction[k] = {};
        for(p in this.action[k])
        {
            newAction[k][p] = {};
            for(var m in this.action[k][p])
            {
                newAction[k][p][m] = this.action[k][p][m];
            }
        }
    }
    for(var i = 0; i < this.closures.length; i++)
    {
        closure = this.closures[i];
        if(records[closure.id] == true) continue;
        records[closure.id] = true;
        for(var j = 0; j < this.closures.length; j++)
        {
            closure2 = this.closures[j];
            if(closure == closure2) continue;
            //如果具有相同核心
            if(closure.hasSameCore(closure2))
            {
                closure.memgerCore(closure2,newGoto,newAction);
                records[closure2.id] = true;
            }
        }
    }
    this.goto = newGoto;
    this.action = newAction;
};

LRDFA.prototype.print = function(){
    console.log(this.inputs);
    console.log();
    console.log(this.goto);
    console.log();
    for(var id in this.action)
    {
        for(var ch in this.action[id])
        {
            console.log(id + " -> " + ch + " ->",this.action[id][ch]);
        }
    }
};

module.exports = LRDFA;

/**
 * 帮助函数，分析文件指针在文件的什么地方
 * @param content
 * @param pos
 * @returns {string}
 */
var getFilePosInfo = function (content,pos) {
    var line = 1;
    var charPos = 1;
    for(var i = 0; i < content.length && pos > 0; i++)
    {
        charPos++;
        if(content.charCodeAt(i) == 13)
        {
            if(content.charCodeAt(i+1) == 10)
            {
                i++;
                pos--;
            }
            charPos = 1;
            line++;
        }
        else if(content.charCodeAt(i+1) == 10)
        {
            if(content.charCodeAt(i) == 13)
            {
                i++;
                pos--;
            }
            charPos = 1;
            line++;
        }
        pos--;
    }
    return "第" + line + "行，第" + charPos + "个字符";
}