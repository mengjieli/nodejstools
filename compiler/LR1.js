/**
 * Created by mengj_000 on 2015/4/17.
 */
var Create = function(head,exp,prec,code)
{
    this.id = Create.id;
    Create.id++;
    this.head = head;
    this.exp = exp;
    this.prec = prec;
    this.code = code;
    this.hash = "";
    for(var i = 0; i < exp.length; i++)
    {
        this.hash += exp[i] + (i<exp.length-1?",":"");
    }
};

Create.id = 1;

var Item = function(create,pos,next)
{
    this.id = Item.id;
    Item.id++;
    this.create = create;
    this.pos = pos;
    this.next = next;
    this.hash = create.id + " " + pos + " " + next;
};

Item.id = 1;

var Closure = function()
{
    this.id = Closure.id;
    Closure.id++;
    //所有的项，包括核心项和非核心项
    this.items = [];
    //核心项
    this.seedMap = {};
    //核心数
    this.seedLength = 0;
    //非核心项Map
    this.itemMap = {};
};

Closure.id = 1;

/**
 * 添加核心项
 * @param create
 */
Closure.prototype.addSeed = function(item)
{
    this.items.push(item);
    this.seedMap[item.hash] = item;
    this.itemMap[item.hash] = item;
    this.seedLength++;
};

Closure.prototype.getItemByInput = function(input)
{
    for(var i = 0; i < this.items.length; i++)
    {
        if(this.items[i].pos == this.items[i].create.exp.length) continue;
        if(this.items[i].create.exp[this.items[i].pos] == input) return this.items[i];
    }
    return null;
}

/**
 * 添加非核心项
 * @param item
 */
Closure.prototype.addItem = function(item)
{
    this.items.push(item);
    this.itemMap[item.hash] = item;
};


var LR1 = function()
{
    /**终结符**/
    this.names = {};
    /**输入符号**/
    this.inputs = null;
    /**产生式**/
    this.creates = [];
    /**产生式Map**/
    this.createMap = {};
    /**内核**/
    this.closures = [];
    /**内核Map**/
    this.closuresMap = {};
    /**action表**/
    this.action = {};
    /**goto表**/
    this.goto = {};
    /**items集合**/
    this.items = {};
    /**空残生式**/
    this.numCreates = {};

    //表达式转换表
    this.expNameTrans = {};
    this.expNameTransId = 0;
};

LR1.startSign = "S'";

/**
 * 创建LR0的核心
 */
LR1.prototype.createLR1 = function()
{
    //1.添加增广表达式
    var startSign = LR1.startSign;
    this.addFunction(startSign,this.creates[0].head + ";");

    //2.获取全部输入符号
    var inputs = [];
    var flag;
    for(var i = 0; i < this.creates.length; i++)
    {
        if(this.creates[i].exp.length == 0)
        {
            this.numCreates[this.creates[i].head] = true;
        }
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
    this.inputs = inputs;

    //3.构造Items

    //4.构造初始项集
    var startCreate = this.getCreateByHead(startSign)[0];
    var startItem = new Item(startCreate,0,"");
    startItem.next = "$";
    var start = new Closure();
    start.addSeed(startItem);
    this.countClosure(start);
    this.closures.push(start);
    this.closuresMap[start.id] = start;
    var closure = start;
    var records = {};
    var seedItems;
    var i;
    var c;
    var input;
    var item;
    var flag;
    var newClosure;
    var count = 0;
    var nextCount = 30;
    var itemCount = start.items.length;
    while(closure)
    {
        count++;
        if(count > nextCount)
        {
            console.log("核心：",this.closures.length,Item.id,itemCount,Closure.id,Create.id);
            nextCount += 30;
        }
        records[closure.id] = true;
        this.action[closure.id] = {};
        this.goto[closure.id] = {};
        for(var key in inputs)
        {
            input = inputs[key];
            for(i = 0; i < closure.items.length; i++)
            {
                item = closure.items[i];
                //判断产生式是否为最后1个
                if(item.pos == item.create.length) continue;
                //判断是否符合当前输入
                if(item.create.exp[item.pos] != input) continue;
                item = new Item(item.create,item.pos + 1,item.next);
                if(!seedItems) seedItems = [item];
                else seedItems.push(item);
            }
            if(seedItems)
            {
                flag = false;
                for(i = 0; i < this.closures.length; i++)
                {
                    if(this.closures[i].seedLength != seedItems.length) continue;
                    flag = true;
                    for(c = 0; c < seedItems.length; c++)
                    {
                        if(this.closures[i].seedMap[seedItems[c].hash] == undefined)
                        {
                            flag = false;
                            continue;
                        }
                    }
                    if(flag)
                    {
                        newClosure = this.closures[i];
                        break;
                    }
                }
                if(!flag)
                {
                    newClosure = new Closure();
                    for(i = 0; i < seedItems.length; i++)
                    {
                        newClosure.addSeed(seedItems[i]);
                    }
                    this.countClosure(newClosure);
                    this.closures.push(newClosure)
                    this.closuresMap[newClosure.id] = newClosure;
                    itemCount += newClosure.items.length;
                }
                if(this.names[input] != undefined)
                {
                    this.goto[closure.id][input] = newClosure.id;
                    //console.log(closure.id," -> ",input," goto ",newClosure.id);
                }
                else
                {
                    this.action[closure.id][input] = {"a":2,"to":newClosure.id,"c":closure.getItemByInput(input).create};
                    //console.log(closure.id," -> ",input," -> ",newClosure.id);
                }
            }
            seedItems = null;
        }

        closure = null;
        for(c = 0; c < this.closures.length; c++)
        {
            if(records[this.closures[c].id] == undefined)
            {
                closure = this.closures[c];
                break;
            }
        }
    }
};

LR1.prototype.createDFA = function()
{
    this.createLR1();
}

/**
 * 根据核心项求闭包
 * @param closure
 */
LR1.prototype.countClosure = function(closure)
{
    var creates = this.creates;
    var item;
    var ch;
    var ends;
    var first;
    var newItem;
    var i, c, p,m;
    var newExp;
    var newCreate;
    var hashHead;
    var hash;
    var key;
    for(i = 0; i < closure.items.length; i++)
    {
        item = closure.items[i];
        hashHead = "";
        for(p = 0; p < item.create.exp.length; p++)
        {
            if(p < item.pos)
            {
                hashHead += item.create.exp[p] + ",";
            }
            else
            {
                ch = item.create.exp[p];
                if(this.names[ch] == undefined) break;
                if(this.numCreates[ch] == undefined) break;
                hash = hashHead;
                if(p == item.create.exp.length - 1) hash = hash.slice(0,hash.length);
                for(m = p + 1; m < item.create.exp.length; m++)
                {
                    hash += item.create.exp[m] + (m<item.create.exp.length-1?",":"");
                }
                if(this.createMap[hash] != undefined)
                {
                    newCreate = this.createMap[hash];
                }
                else
                {
                    newExp = item.create.exp.slice(0,item.pos).concat(item.create.exp.slice(p + 1,item.create.exp.length));
                    newCreate = new Create(item.create.head,newExp,item.prec,item.code);
                    //console.log("新的产生式：",newCreate.head,"->",newCreate.exp," hash:",hash);
                    this.creates.push(newCreate);
                    this.createMap[newCreate.hash] = newCreate;
                }//create.id + " " + pos + " " + next
                hash = newCreate.id + " " + item.pos + " " + item.next;
                if(closure.itemMap[hash] == undefined)
                {
                    newItem = new Item(newCreate,item.pos,item.next);
                    //console.log("添加新的空项",newItem.create.head," -> ",newItem.create.exp, " next: ",newItem.next,closure.id," hash: ",hash);
                    closure.addItem(newItem);
                }
            }
        }
        ch = item.create.exp[item.pos];
        //如果项所在的符号是终结符则直接返回这个
        if(this.names[ch] == undefined) continue;
        for(c = 0; c < creates.length; c++)
        {
            if(creates[c].head == ch && creates[c].exp.length)
            {
                first = {};

                ends = item.create.exp.slice(item.pos+1,item.create.exp.length).concat([item.next]);
                this.getFirst(ends,first);

                //console.log("计算First,",ch,first);

                for(var f in first)
                {
                    if(closure.itemMap[creates[c].id + " 0 " + f] == undefined)
                    {
                        closure.addItem(new Item(creates[c],0,f));
                    }
                    else
                    {
                        newItem = closure.itemMap[creates[c].id + " 0 " + f];
                    }
                }
            }
        }
    }
    //console.log("计算闭包完毕，",closure.items.length);
    //for(i = 0; i < closure.items.length; i++)
    //{
    //    console.log("Item : ",closure.items[i].pos,closure.items[i].next,closure.items[i].create.head," -> ",closure.items[i].create.exp);
    //}
};

/**
 * 求表达式的First集合
 * @param exps
 */
LR1.prototype.getFirst = function(exps,first,checks){
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

/**
 * 根据非终结符查找产生式
 * @param head 非终结符，即产生式的名称
 *
 * @returns {Array}
 */
LR1.prototype.getCreateByHead = function(head){
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


LR1.prototype.addFunction = function(head,exp,prec,code)
{
    //转换名称
    /*if(this.expNameTrans[head] == undefined)
     {
     this.expNameTransId ++;
     this.expNameTrans[head] = this.expNameTransId;

     //记录终结符号
     this.names[this.expNameTrans[head]] = true;
     }*/

    this.names[head] = true;

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
            this.createMap[this.creates[this.creates.length-1]] = this.creates[this.creates.length-1];
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
            this.createMap[this.creates[this.creates.length-1]] = this.creates[this.creates.length-1];
        }
        else {
            name += exp.charAt(i);
        }
    }
};

module.exports = LR1;

//var lr = new LR1();
////lr.addFunction("E","E '+' T;");
////lr.addFunction("E","T;");
////lr.addFunction("T","T '*' F;");
////lr.addFunction("T","F;");
////lr.addFunction("F","'(' E ')';");
////lr.addFunction("F","id;");
//
////lr.addFunction("S","L '=' R;");
////lr.addFunction("S","R;");
////lr.addFunction("L","'*' R;");
////lr.addFunction("R","L;");
////lr.addFunction("L","id;");
//
//lr.addFunction("E","A B c;");
//lr.addFunction("A","a;");
//lr.addFunction("A",";");
//lr.addFunction("B","b;");
//lr.addFunction("B",";");
//
//lr.createDFA();
//
////console.log(lr.creates);
////console.log();
////console.log(lr.inputs);
////console.log();
//
//for(var i = 0; i < lr.closures.length; i++)
//{
//    console.log("closure " + i + " : " + lr.closures[i].id,lr.closures[i].items.length);
//    //for(var j = 0; j < lr.closures[i].items.length; j++)
//    //{
//    //    console.log(lr.closures[i].items[j]);
//    //}
//    //console.log();
//}
//
////console.log(lr.closures);