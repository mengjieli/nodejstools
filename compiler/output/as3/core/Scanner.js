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
       case 42:return null;
       case 51:return null;
       case 73:return TokenType.package;
       case 66:return TokenType.public;
       case 74:return TokenType.private;
       case 82:return TokenType.protected;
       case 64:return TokenType.final;
       case 77:return TokenType.dynamic;
       case 59:return TokenType.class;
       case 79:return TokenType.internal;
       case 83:return TokenType.interface;
       case 75:return TokenType.extends;
       case 85:return TokenType.implements;
       case 44:return TokenType.var;
       case 70:return TokenType.static;
       case 60:return TokenType.const;
       case 81:return TokenType.function;
       case 80:return TokenType.override;
       case 55:return TokenType.void;
       case 47:return TokenType.new;
       case 68:return TokenType.return;
       case 57:return TokenType.null;
       case 67:return TokenType.import;
       case 72:return TokenType.Vector;
       case 29:return TokenType.as;
       case 32:return TokenType.is;
       case 43:return TokenType.get;
       case 48:return TokenType.set;
       case 30:return TokenType.if;
       case 54:return TokenType.else;
       case 46:return TokenType.for;
       case 53:return TokenType.each;
       case 31:return TokenType.in;
       case 78:return TokenType.continue;
       case 61:return TokenType.break;
       case 33:return TokenType.do;
       case 65:return TokenType.while;
       case 71:return TokenType.switch;
       case 52:return TokenType.case;
       case 76:return TokenType.default;
       case 45:return TokenType.try;
       case 58:return TokenType.catch;
       case 69:return TokenType.delete;
       case 62:return TokenType.throw;
       case 56:return TokenType.true;
       case 63:return TokenType.false;
       case 86:return TokenType.flashProxy;
       case 84:return TokenType.namespace;
       case 5:this.commonInfo.tokenValue = content;return TokenType.op;
       case 6:this.commonInfo.tokenValue = content;return TokenType.op;
       case 7:this.commonInfo.tokenValue = content;return TokenType.op;
       case 8:this.commonInfo.tokenValue = content;return TokenType.op;
       case 9:this.commonInfo.tokenValue = content;return TokenType.op;
       case 10:this.commonInfo.tokenValue = content;return TokenType.op;
       case 11:this.commonInfo.tokenValue = content;return TokenType.op;
       case 12:this.commonInfo.tokenValue = content;return TokenType.op;
       case 3:this.commonInfo.tokenValue = content;return TokenType.op;
       case 2:this.commonInfo.tokenValue = content;return TokenType.op;
       case 13:this.commonInfo.tokenValue = content;return TokenType.op;
       case 14:this.commonInfo.tokenValue = content;return TokenType.op;
       case 15:this.commonInfo.tokenValue = content;return TokenType.op;
       case 16:this.commonInfo.tokenValue = content;return TokenType.op;
       case 17:this.commonInfo.tokenValue = content;return TokenType.op;
       case 36:this.commonInfo.tokenValue = content;return TokenType.op;
       case 37:this.commonInfo.tokenValue = content;return TokenType.op;
       case 20:this.commonInfo.tokenValue = content;return TokenType.op;
       case 18:this.commonInfo.tokenValue = content;return TokenType.op;
       case 19:this.commonInfo.tokenValue = content;return TokenType.op;
       case 21:this.commonInfo.tokenValue = content;return TokenType.op;
       case 35:this.commonInfo.tokenValue = content;return TokenType.op;
       case 34:this.commonInfo.tokenValue = content;return TokenType.op;
       case 50:this.commonInfo.tokenValue = content;return TokenType.op;
       case 49:this.commonInfo.tokenValue = content;return TokenType.op;
       case 22:this.commonInfo.tokenValue = content;return TokenType.op;
       case 23:this.commonInfo.tokenValue = content;return TokenType.op;
       case 24:this.commonInfo.tokenValue = content;return TokenType.op;
       case 25:this.commonInfo.tokenValue = content;return TokenType.op;
       case 26:this.commonInfo.tokenValue = content;return TokenType.op;
       case 27:this.commonInfo.tokenValue = content;return TokenType.op;
       case 28:
       case 90:this.commonInfo.tokenValue = content;return TokenType.valueInt;
       case 39:this.commonInfo.tokenValue = content;return TokenType.valueOxInt;
       case 38:this.commonInfo.tokenValue = content;return TokenType.valueNumber;
       case 40:this.commonInfo.tokenValue = content;return TokenType.valueString;
       case 4:
       case 88:
       case 89:
       case 93:
       case 94:
       case 95:
       case 96:
       case 97:
       case 98:
       case 99:
       case 100:
       case 101:
       case 102:
       case 103:
       case 104:
       case 105:
       case 106:
       case 107:
       case 108:
       case 109:
       case 110:
       case 111:
       case 112:
       case 114:
       case 115:
       case 116:
       case 117:
       case 118:
       case 119:
       case 120:
       case 121:
       case 122:
       case 123:
       case 124:
       case 125:
       case 126:
       case 127:
       case 128:
       case 129:
       case 130:
       case 131:
       case 132:
       case 133:
       case 134:
       case 136:
       case 137:
       case 138:
       case 139:
       case 140:
       case 141:
       case 142:
       case 143:
       case 144:
       case 145:
       case 146:
       case 147:
       case 148:
       case 149:
       case 150:
       case 152:
       case 153:
       case 154:
       case 155:
       case 156:
       case 157:
       case 158:
       case 159:
       case 160:
       case 161:
       case 162:
       case 163:
       case 164:
       case 168:
       case 169:
       case 170:
       case 171:
       case 172:
       case 173:
       case 174:
       case 175:
       case 176:
       case 177:
       case 180:
       case 181:
       case 182:
       case 183:
       case 184:
       case 185:
       case 186:
       case 187:
       case 188:
       case 189:
       case 190:
       case 191:
       case 192:
       case 193:
       case 194:
       case 195:
       case 196:
       case 197:
       case 198:
       case 199:
       case 200:
       case 201:
       case 202:
       case 203:
       case 204:
       case 205:
       case 206:
       case 207:
       case 208:
       case 209:
       case 210:
       case 211:
       case 212:
       case 213:
       case 214:
       case 215:
       case 216:
       case 217:
       case 218:
       case 219:
       case 220:
       case 221:
       case 222:
       case 223:
       case 224:
       case 225:
       case 226:
       case 227:
       case 228:
       case 229:
       case 230:
       case 231:
       case 232:
       case 233:
       case 234:
       case 235:
       case 236:
       case 237:
       case 238:
       case 239:
       case 240:
       case 241:
       case 242:
       case 243:
       case 244:
       case 245:
       case 246:
       case 247:
       case 248:
       case 249:
       case 250:
       case 251:
       case 252:
       case 253:
       case 254:
       case 255:
       case 256:
       case 257:
       case 258:
       case 259:this.commonInfo.tokenValue = installId(this.commonInfo,content);return TokenType.id;
       case 41:
       case 91:this.commonInfo.tokenValue = content;return TokenType.valueRegExp;
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