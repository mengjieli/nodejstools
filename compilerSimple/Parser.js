/**
 * 语法分析器
 * @author 北京白鹭时代科技有限公司
 * @Date 2015.4.18
 * @constructor
 */
var ParserTable = global.ParserTable;
var TokenType = global.TokenType;

var Parser = function(){
    //Action表
    this.action = ParserTable.action;
    //goto表
    this.goto = ParserTable.goto;
    //公用数据
    this.commonInfo = null;
};

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
Parser.prototype.setCommonInfo = function(info){
    this.commonInfo = info;
    this.commonInfo.tokenCount = 0;
};

/**
 * 翻译文件
 * @param content
 * @returns {string}
 */
Parser.prototype.transformToTS = function(content){
    //console.log("翻译");
    //console.log(content);
    //console.log();
    var commonInfo = this.commonInfo;
    var scanner = this.commonInfo.scanner;
    scanner.setTokenContent(content);
    var token;
    token = scanner.getNextToken();
    var newNode = {"type":"leaf","token":token,"value":commonInfo.tokenValue};
    if(TokenType.TokenTrans[token]) token = commonInfo.tokenValue;
    commonInfo.tokenCount++;
    if(token == null) return null;
    var state = 1; //初始状态
    var stack = [state];//状态栈
    var nodeStack = [];//结点栈
    //console.log(nodeStack);
    //console.log("准备开始计算");
    commonInfo.nodeStack = nodeStack;
    var i;
    var action;
    var popNodes;
    var commonDebug = {"file":content};
    //console.log("获取token: ",token);
    while(true)
    {
        //console.log("state：",state," token：",token," action：",this.action[state]);
        //查看规约和移入情况
        if(this.action[state][token] == undefined)
        {
            //global.Log.log("语法分析错误," + this.commonInfo.url  + getFilePosInfo(content,commonInfo.tokenPos),3);
            Statistics.addParserError(commonInfo.url,commonInfo.tokenPos);
            return false;
        }
        action = this.action[state][token];
        //console.log("当前token：",token," action：",action);
        //规约 {"a":1,"c":{"head":"T","exp":["T","+","F"]}}
        if(action.a == 0)
        {
            //console.log("接受");
            break;
        }
        else if(action.a == 1) //规约
        {
            popNodes = [];
            i = action.c.exp;
            while(i)
            {
                stack.pop();
                popNodes.push(nodeStack.pop());
                i--;
            }
            popNodes.reverse();
            commonInfo.newNode = {"type":"node","create":action.c.id,"nodes":popNodes,"tokenPos":popNodes[0].tokenPos,"debug":popNodes[0].debug};
            if(action.c.code)
            {
                this.runProgrammer(action.c.id,commonInfo.newNode,popNodes);
                if(commonInfo.newNode.expval)
                {
                    commonInfo.newNode.expval.tokenPos = commonInfo.newNode.tokenPos;
                    commonInfo.newNode.expval.debug = commonInfo.newNode.debug;
                }
            }
            state = stack[stack.length-1];
            state = this.goto[state][action.c.head];
            stack.push(state);
            nodeStack.push(commonInfo.newNode);
            //console.log("规约：", action.c.exp,stack);
            //console.log(nodeStack);
        }
        else //移入 {"a":2,"to":2}
        {
            state = this.action[state][token].to;
            stack.push(state);
            nodeStack.push(newNode);
            //console.log("移入：",token, stack);
            //console.log(nodeStack);
            token = null;
            newNode = null;
        }
        if(token == null && token != Parser.endSign)
        {
            token = scanner.getNextToken();
            commonInfo.tokenCount++;
            if(token == null)
                return false;
            else
                newNode = {"type":"leaf","token":token,"value":commonInfo.tokenValue,"tokenPos":commonInfo.tokenPos,"debug":commonDebug};
            if(TokenType.TokenTrans[token]) token = commonInfo.tokenValue;
            //console.log("获取token: ",token,newNode);
        }
    }
    return true;
};

Parser.endSign = "$";

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
};

global.Parser = Parser;
//module.exports = Parser;

