var TokenType = global.TokenType;

/**
 * 词法分析器
 * @author 北京白鹭时代科技有限公司
 * @Date 2015.4.6
 * @constructor
 */
var Scanner = function(){
    //DFA的开始结点
    this.start = global.ScannerTable.start;
    //转换表
    this.moves = global.ScannerTable.moves;
    //接受状态信息
    this.endInfos = global.ScannerTable.endInfos;
    //接受状态前缀
    this.befores = global.ScannerTable.befores;
    //所有输入字符
    this.inputs = global.ScannerTable.inputs;
    //token位置
    this.tokenPos = 0;
    //token分析的内容
    this.tokenContent = null;
    //token分析的内容字符串长度
    this.tokenContentLength = 0;
    //整个分析过程的共享数据
    this.commonInfo = null;
    //上一个tokenValue
    this.lastToken = null;
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
Scanner.prototype.setCommonInfo = function(info){
    this.commonInfo = info;
};

/**
 * 设置token分析的内容
 * @param content
 */
Scanner.prototype.setTokenContent = function(content){
    content += "\r\n";
    this.tokenContent = content;
    this.tokenPos = 0;
    this.tokenContentLength = content.length;
    this.lastToken = null;
};

/**
 * 获取下一个token
 * @returns {*}
 */
Scanner.prototype.getNextToken = function () {
    if(this.tokenContentLength == 0)
    {
        return null;
    }
    var recordPos = this.tokenPos;
    var ch;
    var findStart = this.tokenPos;
    var state = this.start;
    var receiveStack = [];
    var lastEndPos = -1;
    var lastEndState = -1;
    //console.log("获取新的token:",this.tokenPos);
    while(this.tokenPos < this.tokenContentLength)
    {
        ch = this.tokenContent.charCodeAt(this.tokenPos);
        //console.log("字符:",ch," ,str=",String.fromCharCode(ch));
        if(ch == 92 && this.tokenPos < this.tokenContent.length)// && (this.tokenContent.charCodeAt(this.tokenPos + 1) == 34 || this.tokenContent.charCodeAt(this.tokenPos + 1) == 39))
        {
            this.tokenPos++;
        }
        if(this.inputs[ch] == undefined)
        {
            ch = 20013;
        }
        if(this.moves[state] == undefined || this.moves[state][ch] == undefined) break;
        state = this.moves[state][ch];
        if(this.endInfos[state] != undefined)
        {
            lastEndPos = this.tokenPos;
            lastEndState = state;
            receiveStack.push([this.tokenPos,state]);
            if(this.endInfos[state] == true) break;
        }
        this.tokenPos++;
    }
    var last;
    if(receiveStack.length)
    {
        while(receiveStack.length)
        {
            last = receiveStack.pop();
            lastEndPos = last[0];
            lastEndState = last[1];
            if(this.lastToken == null || this.befores[lastEndState] == undefined || (this.befores[lastEndState] != undefined && this.befores[lastEndState][this.lastToken] != undefined))
            {
                this.tokenPos = lastEndPos + 1;
                var str = this.tokenContent.slice(findStart,this.tokenPos);
                var result = this.getTokenComplete(lastEndState,str);
                if(result == null) return this.getNextToken();
                this.commonInfo.tokenPos = findStart;
                if(TokenType.TokenTrans[result] != undefined) this.lastToken = this.commonInfo.tokenValue;
                else this.lastToken = result;
                //console.log("返回token:",this.tokenPos,",len=",this.tokenContent.length);
                return result;
            }
        }
        //global.Log.log("获取token错误," + this.commonInfo.url  + getFilePosInfo(this.tokenContent,recordPos),3);
        Statistics.addScannerError(this.commonInfo.url,recordPos);
    }
    if(this.tokenPos < this.tokenContent.length)
    {
        //global.Log.log("获取token错误," + this.commonInfo.url  + getFilePosInfo(this.tokenContent,recordPos),3);
        Statistics.addScannerError(this.commonInfo.url,recordPos);
    }
    else
    {
        this.commonInfo.tokenValue = null;
        //console.log("返回结束符:",this.tokenPos);
        return TokenType.endSign;
    }
    return null;
};

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

global.Scanner = Scanner;
//module.exports = Scanner;

Scanner.prototype.getTokenComplete = function(token,content){
    this.commonInfo.tokenValue = null;
    switch (token)
    {
       case 1:return null;
       case 37:return TokenType.Type["null"];
       case 26:return TokenType.Type["as"];
       case 27:return TokenType.Type["is"];
       case 38:return TokenType.Type["true"];
       case 39:return TokenType.Type["false"];
       case 3:this.commonInfo.tokenValue = content;return TokenType.op;
       case 4:this.commonInfo.tokenValue = content;return TokenType.op;
       case 5:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 6:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 7:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 8:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 9:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 10:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 11:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 12:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 13:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 14:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 15:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 30:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 31:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 18:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 16:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 17:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 19:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 29:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 28:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 36:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 35:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 20:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 21:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 22:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 23:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 24:this.commonInfo.tokenValue = content;return TokenType.Type["op"];
       case 25:
       case 42:this.commonInfo.tokenValue = content;return TokenType.Type["valueInt"];
       case 33:this.commonInfo.tokenValue = content;return TokenType.Type["valueOxInt"];
       case 32:this.commonInfo.tokenValue = content;return TokenType.Type["valueNumber"];
       case 34:this.commonInfo.tokenValue = content;return TokenType.Type["valueString"];
       case 2:
       case 41:
       case 44:
       case 45:
       case 46:
       case 47:
       case 48:
       case 49:
       case 51:
       case 52:
       case 53:
       case 54:
       case 55:this.commonInfo.tokenValue = installId(this.commonInfo,content);return TokenType.Type["id"];
    }
    return null;
};

/**
 * 生成对应的Id表信息
 * @param commonInfo
 * @param content
 * @returns {*}
 */
function installId(commonInfo,content)
{
    if(commonInfo.ids[content])
    {
        return commonInfo.ids[content];
    }
    var id = {"name":content};
    commonInfo.ids[content] = id;
    return id;
}