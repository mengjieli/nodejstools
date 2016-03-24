/**
 * Created by mengj_000 on 2015/4/17.
 */
var Create = function(head,exp,prec,code)
{
    this.id = Create.id;
    //if(head == "normaltmts" && exp.length == 2  && exp[0] == "stmt" && exp[1] == "normaltmts")
    //{
    //    //normaltmts : stmt normaltmts
    //    console.log("找到表达式：",this.id);
    //}
    Create.id++;
    this.head = head;
    this.exp = exp;
    this.prec = prec;
    this.code = code;
    this.hash = head + ":";
    for(var i = 0; i < exp.length; i++)
    {
        this.hash += exp[i] + (i<exp.length-1?",":"");
    }
};

Create.id = 1;

var Item = function(create,pos)
{
    this.id = Item.id;
    Item.id++;
    this.create = create;
    this.pos = pos;
    this.hash = create.id + " " + pos;
    this.next = {};
    this.childItems = [];
    this.createItems = [];
};

Item.prototype.equals = function(item)
{
    if(item.pos != this.pos) return false;
    if(item.create.head != this.create.head) return false;
    if(item.create.exp.length != this.create.exp.length) return false;
    for(var i = 0; i < item.create.exp.length; i++)
    {
        if(item.create.exp[i] != this.create.exp[i]) return false;
    }
    return true;
}

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

Closure.prototype.getItemByExpAndPos = function(create,pos)
{
    for(var i = 0; i < this.items.length; i++)
    {
        if(this.items[i].create.id == create.id && this.items[i].pos == pos)
        {
            return this.items[i];
        }
    }
    return null;
}

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

Closure.prototype.equals = function(closure)
{
    if(closure.items.length != this.items.length) return false;
    var find;
    for(var i = 0 ;i < this.items.length; i++)
    {
        find = false;
        for(var f = 0; f < closure.items.length; f++)
        {
            //if(flag) console.log("比较啊 啊   ",this.items[i].create.head);
            if(this.items[i].equals(closure.items[f]))
            {
                find = true;
                break;
            }
        }
        if(find== false) return false;
    }
    return true;
}


var LALR = function()
{
    /**终结符**/
    this.names = {};
    /**运算符优先级**/
    this.levels = {};
    /**优先级包含的所有运算符**/
    this.levelSign = {};
    /**输入符号**/
    this.inputs = null;
    /**产生式**/
    this.creates = [];
    /**空残生式**/
    this.nullCreates = {};
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


    //表达式转换表
    this.expNameTrans = {};
    this.expNameTransId = 0;
};

LALR.startSign = "S'";

/**
 * 创建LR0的核心
 */
LALR.prototype.createLR0 = function()
{
    //return;
    //1.添加增广表达式
    var startSign = LALR.startSign;
    this.addFunction(startSign,this.creates[0].head + ";","","");

    //2.获取全部输入符号
    var inputs = [];
    var flag;
    for(var i = 0; i < this.creates.length; i++)
    {
        if(this.creates[i].exp.length == 0)
        {
            this.nullCreates[this.creates[i].head] = true;
            console.log("空串：",this.creates[i].head);
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
    //简单推导空表达式
    var find = true;
    while(find)
    {
        find = false;
        for(i = 0; i < this.creates.length; i++)
        {
            if(this.nullCreates[this.creates[i].head] == undefined)
            {
                if(this.creates[i].exp.length == 1 && this.nullCreates[this.creates[i].exp[0]] != undefined)
                {
                    find = true;
                    this.nullCreates[this.creates[i].head] = true;
                    console.log("发现新的空串:",this.creates[i].head,this.creates[i].exp[0]);
                }
            }
        }
    }
    this.inputs = inputs;

    //3.构造初始项集
    var startCreate = this.getCreateByHead(startSign)[0];
    var startItem = new Item(startCreate,0);
    startItem.next = {"$":true};
    var start = new Closure();
    start.addSeed(startItem);
    this.countClosure(start);
    this.closures.push(start);
    //for(var i = 0; i < start.items.length; i++)
    //{
    //    console.log(start.id,start.items[i].id,":",start.items[i].create.head," -> ",start.items[i].create.exp, " pos:",start.items[i].pos);
    //}
    //return;
    this.closuresMap[start.id] = start;
    var closure = start;
    var records = {};
    var seedItems;
    var i, j,c;
    var input;
    var item;
    var flag;
    var newClosure;
    var ends;
    var first;
    var key;
    var newItem;
    var closureCount = 0;
    var nexClosure = 50;
    while(closure)
    {
        if(closureCount > nexClosure)
        {
            console.log("当前核心：",closureCount,this.closures.length,Closure.id,Item.id,Create.id);
            nexClosure += 50;
        }
        closureCount++;
        records[closure.id] = true;
        this.action[closure.id] = {};
        this.goto[closure.id] = {};
        for(var key in inputs)
        {
            input = inputs[key];
            //console.log("新的输入",input,closureCount,this.closures.length,Closure.id,Item.id,Create.id);
            for(i = 0; i < closure.items.length; i++)
            {
                item = closure.items[i];
                //判断产生式是否为最后1个
                if(item.pos == item.create.length) continue;
                //判断是否符合当前输入
                if(item.create.exp[item.pos] != input) continue;

                //first = {};
                //for(key in item.next)
                //{
                //    ends = item.create.exp.slice(item.pos+1,item.create.exp.length).concat([key]);
                //    this.getFirst(ends,first);
                //}
                //if(closure.id == 1 && item.create.head == "S" && item.create.exp.length == 3)
                //{
                //    console.log("first :",first," exp :",item.create.exp,item.pos);
                //}
                newItem = new Item(item.create,item.pos + 1);
                //if(newItem.create.id == 61)
                //{
                //    console.log();
                //    console.log();
                //    console.log("发现项:",newItem.create.head,"->",newItem.create.exp,newItem.pos,closure.id,input,newItem.create.id);
                //    console.log();
                //    console.log();
                //}
                if(seedItems)
                {
                    //console.log("1新的输入",input,seedItems.length);
                    flag = false;
                    for(j = 0; j < seedItems.length; j++)
                    {
                        //if(newItem.id == 26 && j == 0)
                        //{
                        //    console.log("推导关系：",newItem.pos,newItem.create.head," -> ",newItem.create.exp," ",seedItems[j].pos,seedItems[j].create.head," -> ",seedItems[j].create.exp);
                        //    console.log("推导关系：",newItem.id,seedItems[j].id);
                        //}
                        if(this.canBeFromItem(newItem,seedItems[j]))
                        {
                            //if(newItem.create.id == 61)
                            //{
                            //    console.log();
                            //    console.log();
                            //    console.log("被推导项:",newItem.create.head,"->",newItem.create.exp,newItem.pos,closure.id,input);
                            //    console.log();
                            //    console.log();
                            //}
                            flag = true;
                            break;
                        }
                    }
                    //console.log("11新的输入",input,seedItems.length,flag);
                    if(flag) continue;
                    for(j = 0; j < seedItems.length; j++)
                    {
                        if(this.canBeFromItem(seedItems[j],newItem))
                        {
                            //if(seedItems[j].create.id == 61)
                            //{
                            //    console.log();
                            //    console.log();
                            //    console.log("被删除项:",newItem.create.head,"->",newItem.create.exp,newItem.pos,closure.id,input,seedItems[j].create.head,"->",seedItems[j].create.exp,seedItems[j].pos);
                            //    console.log();
                            //    console.log();
                            //}
                            seedItems.splice(j,1);
                            j--;
                            //console.log("删除重复核心",seedItems.length,j);
                        }
                    }
                    //console.log("111新的输入",input,seedItems.length);
                }
                //console.log("2新的输入",input);
                //if(closure.id == 5 && input == "c") console.log("找到新的核心：",newItem);
                for(key in item.next)
                {
                    newItem.next[key] = true;
                }
                if(!seedItems) seedItems = [newItem];
                else
                {
                    seedItems.push(newItem);
                }
                //if(newItem.create.id == 61)
                //{
                //    console.log();
                //    console.log();
                //    console.log("新项被加入项:",newItem.create.head,newItem.pos);
                //    console.log();
                //    console.log();
                //}
            }
            //if(seedItems) console.log("新的核心：",seedItems.length,closure.id,input);
            if(seedItems)
            {
                flag = false;
                //if(seedItems) console.log("新的核心1：",seedItems.length,closure.id,input);
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
                //if(seedItems) console.log("新的核心2：",seedItems.length,closure.id,input);
                if(!flag)
                {
                    newClosure = new Closure();
                    //console.log("");
                    for(i = 0; i < seedItems.length; i++)
                    {
                        //if(newClosure.id == 98)
                        //{
                        //    console.log(closure.id,"核心：",seedItems[i].pos,seedItems[i].create.head,"->",seedItems[i].create.exp);
                        //}
                        newClosure.addSeed(seedItems[i]);
                    }
                    //if(seedItems) console.log("创建核心闭包");
                    this.countClosure(newClosure);
                    //if(seedItems) console.log("创建核心闭包");
                    //if(newClosure.id == 13)
                    //{
                    //    console.log("");
                    //    console.log("");
                    //    for(i = 0; i < newClosure.items.length; i++)
                    //    {
                    //        console.log(newClosure.id,newClosure.items[i].id,":",newClosure.items[i].create.head," -> ",newClosure.items[i].create.exp,newClosure.items[i].create.id,newClosure.items[i].create.exp,newClosure.items[i].create.hash, " pos:",newClosure.items[i].pos);
                    //    }
                    //    console.log("");
                    //    console.log("");
                    //}
                    for(var f = 0; f < this.closures.length;f++)
                    {
                        if(newClosure.equals(this.closures[f]) == true)
                        {
                            //console.log("相同核心!",newClosure.id,closure.id,input);
                            //console.log(newClosure.seedMap);
                            for(var p in newClosure.seedMap)
                            {
                                console.log(newClosure.seedMap[p].pos,newClosure.seedMap[p].create.head," -> ",newClosure.seedMap[p].create.exp)
                            }
                            console.log("");
                            console.log("");
                            for(p in this.closures[f].seedMap)
                            {
                                console.log(this.closures[f].seedMap[p].pos,this.closures[f].seedMap[p].create.head," -> ",this.closures[f].seedMap[p].create.exp)
                            }
                            console.log("");
                            console.log("");

                            //newClosure.equals(this.closures[f],true);
                            return;
                        }
                    }

                    this.closures.push(newClosure)
                    this.closuresMap[newClosure.id] = newClosure;

                }
                //if(seedItems) console.log("新的核心3：",seedItems.length,closure.id,input);
                if(this.names[input] != undefined)
                {
                    this.goto[closure.id][input] = newClosure.id;
                    console.log(closure.id," -> ",input," goto ",newClosure.id);
                }
                else
                {
                    this.action[closure.id][input] = {"a":2,"to":newClosure.id,"c":closure.getItemByInput(input).create,"item":closure.getItemByInput(input)};
                    console.log(closure.id," -> ",input," -> ",newClosure.id);
                }
                //if(seedItems) console.log("新的核心4：",seedItems.length,closure.id,input);
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
        //console.log("当前核心数：",this.closures.length,Closure.id,Item.id,Create.id,this.creates.length);
    }
};

LALR.prototype.createDFA = function()
{
    console.log("创建LR0核心");
    //1.生成LR0的核心
    this.createLR0();
    //console.log(this.closures[3].items);
    console.log("创建LR0核心完毕");


    console.log(this.nullCreates);
    console.log();
    console.log();
    console.log();
    //2.计算初始项中的非核心项的向前看符号和初始化传播表
    var startCreate = this.getCreateByHead(LALR.startSign)[0];
    var startItem = new Item(startCreate,0);
    var start = this.closures[0];
    var closure = start;

    //3传播向前看符号
    var flag = true;
    var nextClosure;
    var i,c;
    var ch;
    var newItem;
    var item;
    var p;
    var key;
    var first;
    var ends;
    while(flag)
    {
        flag = false;
        for(i = 0; i < this.closures.length; i++)
        {
            closure = this.closures[i];
            for(c = 0; c < closure.items.length; c++)
            {
                item = closure.items[c];
                for(p = 0; p < item.childItems.length; p++)
                {
                    for(key in item.next)
                    {
                        //if(item.childItems[p].next[key]  == undefined)
                        //{
                        //    console.log("传播了！");
                        //}
                        item.childItems[p].next[key] = true;
                    }
                }
                for(p = 0; p < item.createItems.length; p++)
                {
                    first = {};
                    ends = null;
                    for(key in item.next)
                    {
                        ends = item.create.exp.slice(item.pos+1,item.create.exp.length).concat([key]);
                        this.getFirst(ends,first);
                    }
                    if(ends == null)
                    {
                        ends = item.create.exp.slice(item.pos+1,item.create.exp.length);
                        this.getFirst(ends,first);
                    }
                    for(key in first)
                    {
                        //if(item.createItems[p].next[key] == undefined)
                        //{
                        //    console.log("传播了！2");
                        //}
                        item.createItems[p].next[key] = true;
                    }
                    //if(item.id == 22)
                    //{
                    //    console.log();
                    //    console.log("22的子类：",item.createItems[p].id,item.createItems[p].next);
                    //    console.log();
                    //}
                }
                //if(closure.seedMap[item.hash])
                //{
                //    for(k in item.next)
                //    {
                //        for(var j = 0; j < closure.items.length; j++)
                //        {
                //            if(c == j) continue;
                //            if(closure.items[j].next[k] != undefined) continue;
                //            closure.items[j].next[k] = item.next[k];
                //            //console.log("向前看符号组内传播 ",k,closure.id);
                //        }
                //    }
                //}
                if(item.pos == item.create.exp.length) continue;
                ch = item.create.exp[item.pos];
                if(this.names[ch] == undefined)
                    nextClosure = this.closuresMap[this.action[closure.id][ch].to];
                else
                    nextClosure = this.closuresMap[this.goto[closure.id][ch]];
                if(nextClosure == null)
                {
                    console.log("错啦");
                }
                newItem = nextClosure.getItemByExpAndPos(item.create,item.pos+1);
                if(newItem == null)
                {
                    console.log("错误项目：",closure.id,nextClosure.id,item.create.hash," id = ",item.create.id," , pos = ",item.pos,item.create.head," -> ",item.create.exp);
                    console.log();
                    for(var i = 0; i < nextClosure.items.length; i++)
                    {
                        console.log(nextClosure.items[i].create.hash," id = ",nextClosure.items[i].create.id, "  , pos = ",nextClosure.items[i].pos,nextClosure.items[i].create.head," -> ",nextClosure.items[i].create.exp);

                        console.log();
                    }
                }
                for(k in item.next)
                {
                    if(newItem.next[k] != undefined) continue;
                    newItem.next[k] = item.next[k];
                    flag = true;
                    //console.log("向前看符号传播 ",k,closure.id,"->",nextClosure.id);
                }
                //if(item.id == 39)
                //{
                //    console.log();
                //    console.log();
                //    console.log("找到 ",item.pos," ",item.create.head," -> ",item.create.exp," pos:",item.pos);
                //    console.log("传播到 ",newItem.pos,newItem.id," ",newItem.create.head," -> ",newItem.create.exp," pos:",newItem.pos);
                //    console.log("传播后 ",newItem.next);
                //    console.log();
                //    console.log();
                //}
            }
        }
    }
    //console.log("传播完成");
    var info;
    var sign1 = "";
    var sign2 = "";
    var m;
    var k;
    for(c = 0; c < this.closures.length; c++)
    {
        closure = this.closures[c];
        for(i = 0; i < closure.items.length; i++)
        {
            item = closure.items[i];
            //if(closure.id == 5)
            //{
            //    for(var m = 0; m < closure.items.length; m++)
            //    {
            //        console.log(closure.id," : ",closure.items[m].create.head," -> ",closure.items[m].create.exp," next :",closure.items[m].next);
            //    }
            //}
            //规约
            if(item.pos == item.create.exp.length)
            {
                if(item.create.exp.length == 1 && item.create.head == item.create.exp[0])
                {
                    //console.log("无效的规约：",item.create.head);
                    continue;
                }
                //if(item.create.id == 68)
                //{
                //    console.log("规约啦！？");
                //}
                for(k in item.next)
                {
                    if(this.action[closure.id][k] != undefined)
                    {
                        info = this.action[closure.id][k];
                        if(info.a == 2)
                        {
                            //console.log("规约 - 移进 冲突！",info.c.head,"->",info.c.exp,"移入 :",k);
                            //console.log("规约 - 移进 冲突！",item.create.head,"->",item.create.exp," pos:",item.pos);
                            //console.log();
                            sign1 = "";
                            sign2 = "";
                            if(info.c.prec != "")
                            {
                                sign1 = info.c.prec;
                            }
                            else
                            {
                                for(m = 0; m < info.c.exp.length; m++)
                                {
                                    if(this.levelSign[info.c.exp[m]] != undefined || this.levels[info.c.exp[m]] != undefined)
                                    {
                                        sign1 += info.c.exp[m];
                                    }
                                }
                            }
                            if(item.create.prec != "")
                            {
                                sign2 = item.create.prec;
                                if(sign2 == undefined)
                                {
                                    console.log("错啦！",item.create);
                                }
                            }
                            else
                            {
                                for(m = 0; m < item.create.exp.length; m++)
                                {
                                    if(this.levelSign[item.create.exp[m]] != undefined || this.levels[item.create.exp[m]] != undefined)
                                    {
                                        sign2 += item.create.exp[m];
                                    }
                                }
                            }
                            if(sign1 == "" || sign2 == "")
                            {
                                //if(item.create.id == 68) console.log("规约被移入干掉！",item.create.head,"->",item.create.exp,info.c.head,"->",info.c.exp," 移入：",k);
                                //console.log("默认选择移入",item.create.head,"->",item.create.exp,info.c.head,"->",info.c.exp," 移入：",k,sign1,sign2);
                                //console.log("默认选择移入判断 prec=",info.c.prec, ",s1=",sign1,",s2=",sign2,",judge=",sign1 == "",sign2 == "",sign1 == "" || sign2 == "");
                                //this.action[closure.id][item.next[k]] = {"a":2,"to":closure.id};
                            }
                            else
                            {
                                console.log("规约-移进冲突：s1=",sign1,",s2=",sign2);
                                //console.log("规约-移进冲突：",closure.id,k,sign1,sign2,info.c.head,"->",info.c.exp,item.create.head,"->",item.create.exp,info.item.id,info.item.pos,info.item.create.head);
                                if(this.levels[sign2].level > this.levels[sign1].level)
                                {
                                    this.action[closure.id][k] = {"a":1,"c":item.create};
                                    //if(item.create.id == 68) console.log("规约状态！",item.create.head,"->",item.create.exp);
                                }
                                else if(this.levels[sign2].level == this.levels[sign1].level)
                                {
                                    if(this.levels[sign2].type == "right") this.action[closure.id][k] = {"a":1,"c":item.create};
                                    //if(item.create.id == 68) console.log("规约状态！",item.create.head,"->",item.create.exp);
                                }
                            }
                        }
                        else if(info.a == 1)
                        {
                            sign1 = "";
                            sign2 = "";
                            if(info.c.prec != "")
                            {
                                sign1 = info.c.prec;
                            }
                            else
                            {
                                for(m = 0; m < info.c.exp.length; m++)
                                {
                                    if(this.levelSign[info.c.exp[m]] != undefined || this.levels[info.c.exp[m]] != undefined)
                                    {
                                        sign1 += info.c.exp[m];
                                    }
                                }
                            }
                            if(item.create.prec != "")
                            {

                                sign2 = item.create.prec;
                            }
                            else
                            {
                                for(m = 0; m < item.create.exp.length; m++)
                                {
                                    if(this.levelSign[item.create.exp[m]] != undefined || this.levels[item.create.exp[m]] != undefined)
                                    {
                                        sign2 += item.create.exp[m];
                                    }
                                }
                            }
                            //console.log("规约冲突:",sign1,sign2);
                            if(sign1 == "" || sign2 == "")
                            {
                                console.log("规约-规约出错1",sign1,info.c.head,"->",info.c.exp);
                                console.log("规约出错2",sign2,item.create.head,"->",item.create.exp," pos:",item.pos);
                                //this.action[closure.id][item.next[k]] = {"a":2,"to":closure.id};
                            }
                            else
                            {
                                if(this.levels[sign2].level > this.levels[sign1].level)
                                {
                                    this.action[closure.id][item.next[k]] = {"a":item.create.head == LALR.startSign?0:1,"c":item.create};
                                    //if(item.create.id == 68) console.log("规约状态！",item.create.head,"->",item.create.exp);
                                }
                                else if(this.levels[sign2].level == this.levels[sign1].level)
                                {
                                    if(this.levels[sign2].type == "right") this.action[closure.id][k] = {"a":item.create.head == LALR.startSign?0:1,"c":item.create};
                                    //if(item.create.id == 68) console.log("规约状态！",item.create.head,"->",item.create.exp);
                                }
                            }
                        }
                    }
                    else
                    {
                        this.action[closure.id][k] = {"a":item.create.head == LALR.startSign?0:1,"c":item.create};
                        //if(item.create.id == 68) console.log("规约状态！",item.create.head,"->",item.create.exp,closure.id);
                    }
                    //if(this.action[closure.id][k] != undefined)
                    //{
                    //    if(this.action[closure.id][k].a == 2)
                    //    {
                    //        console.log("移入-规约冲突",this.action[closure.id][k].a);
                    //    }
                    //    else
                    //    {
                    //        console.log("规约-规约冲突",closure.id,item.next[k],this.action[closure.id][item.next[k]].c);
                    //    }
                    //}
                    //this.action[closure.id][item.next[k]] = {"a":1,"c":item.create};
                }
            }
        }
    }



    //closure = this.closures[11];
    //console.log();
    //console.log("新的核心：",closure.id);
    //for(i = 0; i < closure.items.length; i++)
    //{
    //    console.log(closure.items[i].create.head," -> ",closure.items[i].create.exp," pos:",closure.items[i].pos," id:",closure.items[i].id," next:",closure.items[i].next);
    //}
    //console.log();
    //console.log();
};

/**
 * 根据核心项求闭包
 * @param closure
 */
LALR.prototype.countClosure = function(closure)
{
    //if(closure.id == 98 || closure.id == 73)
    //{
    //    for(var mm in closure.seedMap)
    //    {
    //        console.log("错误集:",closure.seedMap[mm].create.head," -> ",closure.seedMap[mm].create.exp," pos:",closure.seedMap[mm].pos);
    //    }
    //}
    var creates = this.creates;
    var item;
    var ch;
    var newItem;
    var i, c, p, m,n;
    var newExp;
    var newCreate;
    var hash;
    var first;
    var ends;
    var key;
    for(var i = 0; i < closure.items.length; i++)
    {
        item = closure.items[i];
        for(p = 0; p < item.create.exp.length; p++)
        {
            if(p < item.pos)
            {
            }
            else
            {
                ch = item.create.exp[p];
                if(this.names[ch] == undefined) break;
                if(this.nullCreates[ch] == undefined) break;
                hash = item.create.head + ":";
                for(n = 0; n < item.create.exp.length; n++)
                {
                    if(n < item.pos || n > p) hash += item.create.exp[n] + ",";
                }
                if(hash != item.create.head + ":") hash = hash.slice(0,hash.length-1);
                if(this.createMap[hash] != undefined)
                {
                    newCreate = this.createMap[hash];
                }
                else
                {
                    //if(closure.id == 13) console.log("产生式hash : ",hash,p,item.create.exp.length - 1);
                    newExp = item.create.exp.slice(0,item.pos).concat(item.create.exp.slice(p + 1,item.create.exp.length));
                    newCreate = new Create(item.create.head,newExp,item.create.prec,item.create.code);

                    var same = false;
                    var oldc;
                    for(var ck in this.createMap)
                    {
                        oldc = this.createMap[ck];
                        if(oldc.head != newCreate.head) continue;
                        if(oldc.exp.length != newCreate.exp.length) continue;
                        same = true;
                        for(var cc = 0; cc < newCreate.exp.length; cc++)
                        {
                            if(oldc.exp[cc] != newCreate.exp[cc])
                            {
                                same = false;
                                break;
                            }
                            if(same == false) break;
                        }
                        if(same)
                        {
                            console.log(same,"相同的表达式啊！",hash," ch",ch,p);
                            console.log("老的：",oldc.head,"->",oldc.exp,oldc.hash);
                            console.log("现在：",item.create.head,"->",item.create.exp,item.create.hash,item.pos);
                            console.log("新的：",newCreate.head,"->",newCreate.exp,newCreate.hash);
                            return;
                        }
                    }

                    //if(closure.id == 13) console.log("新的产生式：",newCreate.id,newCreate.head,"->",newCreate.exp," hash:",hash);
                    this.creates.push(newCreate);
                    this.createMap[newCreate.hash] = newCreate;
                    if(newCreate.exp.length == 0 && this.nullCreates[newCreate.head] == undefined)
                    {
                        console.log("新的空串呀！",newCreate.head);
                        this.nullCreates[newCreate.head] = true;
                    }
                }//create.id + " " + pos + " " + next
                hash = newCreate.id + " " + item.pos;
                if(newCreate.exp.length)
                {
                    if(closure.itemMap[hash] == undefined)
                    {
                        newItem = new Item(newCreate,item.pos);
                        closure.addItem(newItem);
                        //if(closure.id == 13) console.log("添加新的空项",closure.items.length,newItem.create.head," -> ",newItem.create.exp, " next: ",newItem.next,closure.id," hash: ",hash);
                    }
                    else
                    {
                        newItem = closure.itemMap[hash];
                    }
                    item.childItems.push(newItem);
                    for(key in item.next)
                    {
                        newItem.next[key] = true;
                    }
                }

                //console.log("newItem ",newCreate.head," -> ",newCreate.exp);
            }
        }
        ch = item.create.exp[item.pos];
        //如果项所在的符号是终结符则直接返回这个
        if(this.names[ch] == undefined) continue;
        //if(checks[ch] != undefined) continue;
        for(var c = 0; c < creates.length; c++)
        {
            if(creates[c].head == ch && creates[c].exp.length)
            {

                first = {};

                ends = null;

                for(key in item.next)
                {
                    ends = item.create.exp.slice(item.pos+1,item.create.exp.length).concat([key]);
                    this.getFirst(ends,first);
                    //if(closure.id == 1 && creates[c].id == 2)
                    //{
                    //    console.log("找到啦",ends,first,item.create.exp,item.pos);
                    //}
                }
                if(ends == null)
                {
                    ends = item.create.exp.slice(item.pos+1,item.create.exp.length);
                    this.getFirst(ends,first);
                }

                //if(closure.id == 1 && creates[c].id == 2)
                //{
                //    console.log("找到啦",first,item.create.exp,item.pos);
                //}

                if(closure.itemMap[creates[c].id + " 0"] == undefined)
                {
                    newItem = new Item(creates[c],0);
                    closure.addItem(newItem);
                    //console.log("新的子项",closure.id,newItem.id,newItem.create.head,"->",newItem.create.exp," pos:",newItem.pos);
                    //if(newItem.id == 25)
                    //{
                    //    console.log("25的父项：",closure.id,item.id,item.create.head,"->",item.create.exp," pos:",item.pos);
                    //}
                }
                else
                {
                    newItem = closure.itemMap[creates[c].id + " 0"];
                }
                item.createItems.push(newItem);
                for(var f in first)
                {
                    newItem.next[f] = true;
                    //if(f == ',')
                    //{
                    //    console.log("自发生逗号：",closure.id,newItem.create.head,"->",newItem.create.exp,",pos = ",newItem.pos,",id = ",newItem.id);
                    //}
                }

                //if(creates[c].head == "S")
                //{
                //    console.log();
                //    console.log();
                //    console.log(newItem);
                //    console.log();
                //    console.log();
                //    console.log();
                //}
            }
        }
        //checks[ch] = true;
    }


    //if(closure.id == 22)
    //{
    //    console.log();
    //    console.log("新的核心：",closure.id);
    //    for(i = 0; i < closure.items.length; i++)
    //    {
    //        console.log(closure.items[i].create.head," -> ",closure.items[i].create.exp," pos:",closure.items[i].pos," id:",closure.items[i].id);
    //    }
    //    console.log();
    //    console.log();
    //}
};

/**
 * 判断item是否可以从source推导出
 * @param item
 * @param source
 */
LALR.prototype.canBeFromItem = function(item,source)
{
    if(item.pos != source.pos || item.create.exp.length >= source.create.exp.length || item.create.head != source.create.head) return false;
    var ch;
    var exps;
    for(var i = 0; i < source.create.exp.length; i++)
    {
        if(i < item.pos)
        {
            if(item.create.exp[i] != source.create.exp[i]) return false;
        }
        else
        {
            ch = source.create.exp[i];
            if(this.nullCreates[ch] == undefined) return false;
            exps = source.create.exp.slice(0,source.pos).concat(source.create.exp.slice(i+1,source.create.exp.length));
            if(exps.length > item.create.exp.length) continue;
            for(; i < exps.length; i++)
            {
                if(exps[i] != item.create.exp[i]) return false;
            }
            break;
        }
    }
    return true;
}

/**
 * 求表达式的First集合
 * @param exps
 */
LALR.prototype.getFirst = function(exps,first,checks){
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
LALR.prototype.getCreateByHead = function(head){
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


LALR.prototype.addFunction = function(head,exp,prec,code)
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
            this.createMap[this.creates[this.creates.length-1].hash] = this.creates[this.creates.length-1];
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
            this.createMap[this.creates[this.creates.length-1].hash] = this.creates[this.creates.length-1];
        }
        else {
            name += exp.charAt(i);
        }
    }
};

//LALR.prototype.getCreate = function(head,exps)
//{
//    for(var i = 0; i < this.creates.length; i++)
//    {
//        if(this.creates[i].head == head && this.creates[i].exp.length == exps.length)
//        {
//            if(this.)
//        }
//    }
//    //normaltmts : stmt normaltmts
//}

module.exports = LALR;

/*
 var lr = new LALR();
 //lr.addFunction("E","E '+' T;");
 //lr.addFunction("E","T;");
 //lr.addFunction("T","T '*' F;");
 //lr.addFunction("T","F;");
 //lr.addFunction("F","'(' E ')';");
 //lr.addFunction("F","id;");

 //lr.addFunction("S","L '=' R;");
 //lr.addFunction("S","R;");
 //lr.addFunction("L","'*' R;");
 //lr.addFunction("R","L;");
 //lr.addFunction("L","id;");

 //lr.addFunction("S","C C;");
 //lr.addFunction("C","c C;");
 //lr.addFunction("C","d;");

 //lr.addFunction("S","a A d;","","");
 //lr.addFunction("S","a B e;","","");
 //lr.addFunction("S","b A e;","","");
 //lr.addFunction("S","b B d;","","");
 //lr.addFunction("A","c;","","");
 //lr.addFunction("B","c;","","");

 lr.addFunction("E","if id A;","","");
 lr.addFunction("E","E else A;","","");
 lr.addFunction("A","id C;","","");
 lr.addFunction("A","B;","","");
 lr.addFunction("C","';';","","");
 lr.addFunction("C",";","","");
 lr.addFunction("B","'{' A '}';","","");

 //lr.addFunction("S","A B c;");
 //lr.addFunction("A","a;");
 //lr.addFunction("A",";");
 //lr.addFunction("B","b;");
 //lr.addFunction("B",";");


 //var create = new Create("C",["E","d","C"],"","");
 //var create2 = new Create("C",["E","d"],"","");
 //lr.nullCreates["C"] = true;
 //console.log(lr.canBeFromItem(new Item(create2,2),new Item(create,2)));

 lr.createDFA();

 //console.log(lr.action);

 //console.log(lr.creates);
 //console.log();
 //console.log(lr.inputs);
 //console.log();

 console.log();
 for(var i = 0; i < lr.creates.length; i++)
 {
 console.log(lr.creates[i].id,lr.creates[i].head,"->",lr.creates[i].exp);
 }
 console.log();

 for(var i = 0; i < lr.closures.length; i++)
 {
 console.log("closure " + lr.closures[i].id ," : ",lr.closures[i].items.length);
 for(var j = 0; j < lr.closures[i].items.length; j++)
 {
 console.log(lr.closures[i].items[j].create.id,lr.closures[i].items[j].create.head," -> ",lr.closures[i].items[j].create.exp," pos : ",lr.closures[i].items[j].pos," next : ",lr.closures[i].items[j].next);
 }
 console.log();
 break;
 }

 //*/