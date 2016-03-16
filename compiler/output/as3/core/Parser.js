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

Parser.prototype.runProgrammer = function (id,node,nodes) {
    var common = this.commonInfo;
    switch (id){
        case 286: 
        case 1: common.file.readFileComplete();break;
        case 10: common.file.enterPackage();break;
        case 292: case 295: case 297: case 291: case 296: case 293: case 294: case 290: case 298: case 299: case 26: case 31: case 27: case 30: case 29: 
        case 28: common.file.enterClass();break;
        case 11: common.file.setPackageURL(nodes[0].expval);break;
        case 51: case 99: 
        case 114: node.expval = nodes[0].value.name;break;
        case 52: node.expval = "Vector";break;
        case 53: node.expval = "flash_proxy";break;
        case 314: 
        case 14: common.file.addImport(nodes[1].expval);break;
        case 323: case 338: case 322: case 341: case 25: 
        case 19: common.file.setClassName(nodes[1].value.name);break;
        case 308: case 324: case 307: case 309: case 328: case 300: case 301: case 344: case 327: case 329: case 8: 
        case 9: common.file.exitPackage();break;
        case 312: case 325: case 326: case 311: case 342: case 313: case 343: case 310: case 20: 
        case 21: common.file.enterClass(true);break;
        case 22: node.expval = new global.As3NameSpace(nodes[2].value.name);common.file.addNameSpace(node.expval);break;
        case 315: case 23: case 340: 
        case 18: common.file.exitClass();break;
        case 271: 
        case 275: node.expval = new As3BaseValue("id",nodes[0].value.name);break;
        case 274: case 272: 
        case 273: node.expval = new As3BaseValue("id",nodes[0].token);break;
        case 95: node.expval = "public";break;
        case 96: 
        case 98: node.expval = "private";break;
        case 97: node.expval = "protected";break;
        case 62: common.file.addStmt(nodes[0].expval);break;
        case 316: 
        case 63: addMemberFunction(node,nodes[nodes.length==1?0:1],nodes.length==1?"public":nodes[0].expval,false,false,common);break;
        case 71: case 137: case 90: case 255: case 138: case 139: case 140: case 141: case 142: case 143: case 144: case 145: case 146: case 149: case 150: case 151: case 227: case 126: case 127: case 130: case 131: case 92: case 79: 
        case 167: node.expval = nodes[0].expval;break;
        case 262: common.file.enterFunction();break;
        case 101: node.var = true;break;
        case 102: node.var = false;break;
        case 336: 
        case 136: node.expval = new As3ExprStmt(nodes[0].expval);break;
        case 256: 
        case 279: node.expval = new As3BaseValue("string",nodes[0].value);break;
        case 229: node.expval = new As3Expr("int",nodes[0].value);break;
        case 230: node.expval = new As3Expr("0xint",nodes[0].value);break;
        case 231: node.expval = new As3Expr("number",nodes[0].value);break;
        case 147: node.expval = new As3ContinueStmt();break;
        case 148: node.expval = new As3BreakStmt();break;
        case 152: node.expval = new As3DeviceStmt();break;
        case 155: node.expval = new As3ReturnStmt(null);break;
        case 228: node.expval = nodes[0].expval;node.expval.start = true;break;
        case 232: node.expval = new As3Expr("boolean","true");break;
        case 233: node.expval = new As3Expr("boolean","false");break;
        case 234: node.expval = new As3Expr("null");break;
        case 237: node.expval = new As3ExprAtr();node.expval.addItem(new As3RegExpValue(nodes[0].value));break;
        case 238: case 239: case 240: 
        case 241: node.expval = new As3ExprAtr();node.expval.addItem(nodes[0].expval);break;
        case 47: 
        case 113: node.expval = nodes[0].expval + "." + nodes[2].value.name;break;
        case 48: node.expval = nodes[0].expval + ".*";break;
        case 49: node.expval = nodes[0].expval + ".Vector";break;
        case 50: node.expval = nodes[0].expval + ".flash_proxy";break;
        case 330: 
        case 125: node.expval = new As3BlockStmt(nodes.length==2?null:nodes[1].expval);break;
        case 331: 
        case 267: node.expval = new As3ObjectValue(nodes.length==2?[]:nodes[1].expval);break;
        case 134: 
        case 129: node.expval = new As3Stmts();node.expval.addStmt(nodes[0].expval);break;
        case 276: node.expval = new As3BaseValue("int",nodes[0].value);break;
        case 277: node.expval = new As3BaseValue("0xint",nodes[0].value);break;
        case 278: node.expval = new As3BaseValue("number",nodes[0].value);break;
        case 86: node.expval = {"public":nodes.length==1?"public":nodes[0].expval,"static":false,"var":nodes[nodes.length==1?0:1].var};break;
        case 317: 
        case 66: addMemberFunction(node,nodes[nodes.length==2?1:2],nodes.length==2?"public":nodes[0].expval,true,false,common);break;
        case 318: 
        case 69: addMemberFunction(node,nodes[nodes.length==2?1:2],nodes.length==2?"public":nodes[0].expval,false,true,common);break;
        case 320: 
        case 88: node.expval = {"public":nodes.length==2?"public":nodes[0].expval,"static":true,"var":nodes[nodes.length==1?1:2].var};break;
        case 70: node.expval = nodes[0].expval;node.expval.block = nodes[1].expval;break;
        case 76: node.expval = "get";break;
        case 77: node.expval = "set";break;
        case 104: 
        case 83: node.expval = new As3Params();node.expval.addParam(nodes[0].expval);break;
        case 85: var vals = As3Var.createVars(nodes[0].expval.public,nodes[0].expval.static,nodes[0].expval.var,nodes[1].expval);common.file.addVars(vals);break;
        case 347: 
        case 106: node.expval = new As3Param(nodes[0].expval.val,nodes.length==1?new As3Type(0):nodes[1].expval,null);break;
        case 348: 
        case 153: var vals = As3Var.createVars("private",false,nodes[0].var,nodes[1].expval);node.expval = new As3DefineStmt(vals);common.file.addVars(vals);break;
        case 91: case 107: 
        case 73: node.expval = nodes[1].expval;break;
        case 265: case 45: case 119: 
        case 176: node.expval = [nodes[0].expval];break;
        case 337: 
        case 263: node.expval = new As3ArrayValue(nodes.length==2?[]:nodes[1].expval);break;
        case 349: 
        case 154: node.expval = new As3ReturnStmt(nodes[1].expval);break;
        case 350: 
        case 174: node.expval = new As3TryStmt(nodes[1].expval,nodes.length==3?nodes[2].expval:null);break;
        case 351: 
        case 179: node.expval = new As3DeleteStmt(nodes[1].expval);break;
        case 352: 
        case 180: node.expval = new As3ThrowStmt(nodes[1].expval);break;
        case 186: node.expval = new As3Expr("+a",nodes[1].expval);break;
        case 185: node.expval = new As3Expr("-a",nodes[1].expval);break;
        case 187: node.expval = new As3Expr("!",nodes[1].expval);break;
        case 206: node.expval = new As3Expr("~",nodes[1].expval);break;
        case 252: node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem("call",nodes[1].expval));break;
        case 110: node.expval = new As3Type(0);break;
        case 243: node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("new",nodes[1].expval,null,false));break;
        case 109: node.expval = new As3Type(1,nodes[0].expval);break;
        case 41: common.file.setClassExtends(nodes[1].expval);break;
        case 43: common.file.addClassImplements(nodes[1].expval);break;
        case 133: 
        case 128: node.expval = nodes[1].expval;node.expval.addStmtAt(nodes[0].expval,0);break;
        case 355: 
        case 173: node.expval = new As3DefaultStmt(nodes.length==3?nodes[2].expval:null);break;
        case 67: addMemberFunction(node,nodes[2],"public",true,false,common);break;
        case 345: 
        case 64: addMemberFunction(node,nodes[nodes.length==3?2:3],nodes.length==3?"public":nodes[2].expval,true,false,common);break;
        case 65: addMemberFunction(node,nodes[nodes.length==2?1:2],nodes.length==2?"public":nodes[1].expval,true,false,common);break;
        case 68: addMemberFunction(node,nodes[nodes.length==2?1:2],nodes.length==2?"public":nodes[1].expval,false,true,common);break;
        case 87: node.expval = {"public":nodes.length==2?"public":nodes[1].expval,"static":true,"var":nodes[nodes.length==1?1:2].var};break;
        case 236: node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("()",nodes[1].expval));break;
        case 188: node.expval = new As3Expr("*",nodes[0].expval,nodes[2].expval);break;
        case 211: node.expval = new As3Expr("=",nodes[0].expval,nodes[2].expval);break;
        case 198: node.expval = new As3Expr("<",nodes[0].expval,nodes[2].expval);break;
        case 197: node.expval = new As3Expr(">",nodes[0].expval,nodes[2].expval);break;
        case 235: node.expval = new As3Expr("in",nodes[0].expval,nodes[2].expval);break;
        case 191: node.expval = new As3Expr("+",nodes[0].expval,nodes[2].expval);break;
        case 181: node.expval = new As3Expr("a++",nodes[0].expval);break;
        case 192: node.expval = new As3Expr("-",nodes[0].expval,nodes[2].expval);break;
        case 182: node.expval = new As3Expr("a--",nodes[0].expval);break;
        case 189: node.expval = new As3Expr("/",nodes[0].expval,nodes[2].expval);break;
        case 190: node.expval = new As3Expr("%",nodes[0].expval,nodes[2].expval);break;
        case 193: node.expval = new As3Expr("<<",nodes[0].expval,nodes[2].expval);break;
        case 194: node.expval = new As3Expr(">>",nodes[0].expval,nodes[2].expval);break;
        case 195: node.expval = new As3Expr("<<<",nodes[0].expval,nodes[2].expval);break;
        case 196: node.expval = new As3Expr(">>>",nodes[0].expval,nodes[2].expval);break;
        case 205: node.expval = new As3Expr("&",nodes[0].expval,nodes[2].expval);break;
        case 207: node.expval = new As3Expr("^",nodes[0].expval,nodes[2].expval);break;
        case 208: node.expval = new As3Expr("|",nodes[0].expval,nodes[2].expval);break;
        case 209: node.expval = new As3Expr("&&",nodes[0].expval,nodes[2].expval);break;
        case 210: node.expval = new As3Expr("||",nodes[0].expval,nodes[2].expval);break;
        case 224: node.expval = new As3Expr("as",nodes[0].expval,nodes[2].expval);break;
        case 225: node.expval = new As3Expr("is",nodes[0].expval,nodes[2].expval);nodes[2].expval.start = true;break;
        case 357: 
        case 264: node.expval = [nodes[0].expval];if(nodes.length==2)node.expval.push(null);else node.expval = node.expval.concat(nodes[2].expval);break;
        case 183: node.expval = new As3Expr("++a",nodes[2].expval);break;
        case 184: node.expval = new As3Expr("--a",nodes[2].expval);break;
        case 246: node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem(".",nodes[2].expval));break;
        case 353: 
        case 254: node.expval = nodes.length==2?new As3CallParams():nodes[1].expval;break;
        case 258: node.expval = new As3CallParams();node.expval.addParam(nodes[0].expval);break;
        case 242: node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("new",nodes[1].expval,nodes[2].expval,true));break;
        case 339: 
        case 116: if(nodes.length==6)common.file.addMetaTag(new As3MetaTag(nodes[1].value.name,nodes[3].expval));break;
        case 362: 
        case 118: node.expval = nodes.length==3?nodes[2].expval.concat([nodes[0].expval]):[nodes[0].expval];break;
        case 363: 
        case 172: node.expval = new As3CaseStmt(nodes[1].expval,nodes.length==4?nodes[3].expval:null);break;
        case 269: node.expval = [[nodes[0].expval,nodes[2].expval]];break;
        case 364: case 375: case 356: case 376: case 335: case 383: case 365: 
        case 72: common.file.enterFunction();createFunctionValue(node,nodes);break;
        case 103: node.expval = nodes[0].expval;node.expval.addParam(nodes[2].expval);break;
        case 346: 
        case 105: node.expval = new As3Param(nodes[0].expval.val,nodes.length==3?new As3Type(0):nodes[1].expval,nodes[nodes.length==3?2:3].expval);break;
        case 212: node.expval = new As3Expr("*=",nodes[0].expval,nodes[3].expval);break;
        case 201: node.expval = new As3Expr("==",nodes[0].expval,nodes[3].expval);break;
        case 200: node.expval = new As3Expr("<=",nodes[0].expval,nodes[3].expval);break;
        case 199: node.expval = new As3Expr(">=",nodes[0].expval,nodes[3].expval);break;
        case 216: node.expval = new As3Expr("+=",nodes[0].expval,nodes[3].expval);break;
        case 217: node.expval = new As3Expr("-=",nodes[0].expval,nodes[3].expval);break;
        case 204: node.expval = new As3Expr("!=",nodes[0].expval,nodes[3].expval);break;
        case 213: node.expval = new As3Expr("/=",nodes[0].expval,nodes[3].expval);break;
        case 214: node.expval = new As3Expr("%=",nodes[0].expval,nodes[3].expval);break;
        case 219: node.expval = new As3Expr("<<=",nodes[0].expval,nodes[3].expval);break;
        case 220: node.expval = new As3Expr(">>=",nodes[0].expval,nodes[3].expval);break;
        case 215: node.expval = new As3Expr("&=",nodes[0].expval,nodes[3].expval);break;
        case 221: node.expval = new As3Expr("^=",nodes[0].expval,nodes[3].expval);break;
        case 222: node.expval = new As3Expr("|=",nodes[0].expval,nodes[3].expval);break;
        case 218: node.expval = new As3Expr("||=",nodes[0].expval,nodes[3].expval);break;
        case 175: node.expval = [nodes[0].expval].concat(nodes[1].expval);break;
        case 250: node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem("..",nodes[3].expval));break;
        case 247: node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem(".",null));node.expval.addItem(new As3ExprAtrItem(".",nodes[3].expval));break;
        case 248: node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem(".@",nodes[3].expval));break;
        case 371: 
        case 257: node.expval = nodes[2].expval;node.expval.addParamAt(nodes[0].expval,0);break;
        case 251: node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem("[]",nodes[2].expval));break;
        case 245: node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("new ()",nodes[2].expval,null,false));break;
        case 361: case 372: case 373: case 354: case 382: case 360: case 261: 
        case 260: createFunctionValue(node,nodes);node.expval.block = nodes[nodes.length-1].expval;node.expval = new As3FunctionValue(node.expval);node.expval.addVars(common.file.exitFunction());break;
        case 46: node.expval = [nodes[0].expval].concat(nodes[2].expval);break;
        case 121: case 122: case 123: 
        case 124: node.expval={"name":nodes[0].value.name,"val":nodes[2].value};break;
        case 117: if(nodes.length==7)common.file.addMetaTag(new As3MetaTag(nodes[1].value.name,[{"name":nodes[3].value,"val":null}]));break;
        case 374: 
        case 268: node.expval = [[nodes[0].expval,nodes[2].expval]];node.expval = node.expval.concat(nodes.length==4?[null]:nodes[4].expval);break;
        case 202: node.expval = new As3Expr("===",nodes[0].expval,nodes[4].expval);break;
        case 203: node.expval = new As3Expr("!==",nodes[0].expval,nodes[4].expval);break;
        case 223: node.expval = new As3Expr("?:",nodes[0].expval,nodes[2].expval,nodes[4].expval);break;
        case 156: node.expval = new As3IfStmt(nodes[2].expval,nodes[4].expval,null);break;
        case 378: case 368: case 385: 
        case 165: node.expval=[nodes[0].expval].concat(nodes[2].expval);break;
        case 166: node.expval=[nodes[0].expval];break;
        case 162: node.expval = new As3ForInStmt(nodes[2].expval.expval1,nodes[2].expval.expval2,nodes[4].expval);break;
        case 169: node.expval = new As3WhileStmt(nodes[2].expval,nodes[4].expval);break;
        case 171: node.expval = new As3SwitchStmt(nodes[2].expval,nodes[4].expval);break;
        case 244: node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("new ()",nodes[2].expval,nodes[4].expval,true));break;
        case 74: node.expval = new As3Type(3);break;
        case 82: node.expval = nodes[0].expval; node.expval.addParam(nodes[2].expval);break;
        case 367: case 370: case 377: case 358: case 379: case 359: case 380: case 366: case 384: case 158: case 160: 
        case 159: addForStmt(node,nodes);node.expval = new As3ForStmt(node.expval.da,node.expval.exp1,node.expval.exp2,node.expval.stmt);break;
        case 164: node.expval = new As3ForEachStmt(nodes[3].expval.expval1,nodes[3].expval.expval2,nodes[5].expval);break;
        case 170: node.expval = new As3DoWhileStmt(nodes[4].expval,nodes[1].expval);break;
        case 249: node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem(".@[]",nodes[4].expval));break;
        case 111: node.expval = new As3Type(2,nodes[4].expval);break;
        case 112: node.expval = new As3Type(2,nodes[3].expval);break;
        case 84: node.expval = new As3Params();node.expval.addParam(new As3Param(nodes[3].expval.name,new As3Type(4),null));break;
        case 226: node.expval = new As3Expr("is",nodes[0].expval,new As3Type(2,nodes[5].expval));break;
        case 157: node.expval = new As3IfStmt(nodes[2].expval,nodes[4].expval,nodes[6].expval);break;
        case 161: node.expval = new As3ForInStmt(nodes[2].expval,nodes[4].expval,nodes[6].expval);break;
        case 381: 
        case 178: node.expval = new As3CatchStmt(new As3Param(nodes[2].value.name,nodes.length==5?null:nodes[3].expval),nodes[nodes.length==5?4:5].expval);break;
        case 253: node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("Vector call",new As3Type(1,nodes[3].expval),nodes[6].expval));break;
        case 163: node.expval = new As3ForEachStmt(nodes[3].expval,nodes[5].expval,nodes[7].expval);break;
        case 81: node.expval = nodes[0].expval;node.expval.addParam(new As3Param(nodes[5].expval.name,new As3Type(4),null));break;
    }
};

var As3CallParams = global.As3CallParams;
var As3Param = global.As3Param;
var As3Params = global.As3Params;
var As3Type = global.As3Type;
var As3Var = global.As3Var;

var As3MetaTag = global.As3MetaTag;

var As3BlockStmt = global.As3BlockStmt;
var As3CaseStmt = global.As3CaseStmt;
var As3CatchStmt = global.As3CatchStmt;
var As3ContinueStmt = global.As3ContinueStmt;
var As3BreakStmt = global.As3BreakStmt;
var As3DefaultStmt = global.As3DefaultStmt;
var As3DefineStmt = global.As3DefineStmt;
var As3DeleteStmt = global.As3DeleteStmt;
var As3DeviceStmt = global.As3DeviceStmt;
var As3DoWhileStmt = global.As3DoWhileStmt;
var As3ExprStmt = global.As3ExprStmt;
var As3ForEachStmt = global.As3ForEachStmt;
var As3ForInStmt = global.As3ForInStmt;
var As3ForStmt = global.As3ForStmt;
var As3IfStmt = global.As3IfStmt;
var As3ReturnStmt = global.As3ReturnStmt;
var As3Stmts = global.As3Stmts;
var As3ThrowStmt = global.As3ThrowStmt;
var As3TryStmt = global.As3TryStmt;
var As3WhileStmt = global.As3WhileStmt;
var As3SwitchStmt = global.As3SwitchStmt;

var As3RegExpValue = global.As3RegExpValue;
var As3ArrayValue = global.As3ArrayValue;
var As3BaseValue = global.As3BaseValue;
var As3Expr = global.As3Expr;
var As3ExprAtr = global.As3ExprAtr;
var As3ExprAtrItem = global.As3ExprAtrItem;
var As3FunctionValue = global.As3FunctionValue;
var As3ObjectValue = global.As3ObjectValue;

/**
 * 添加成员函数
 * @param node
 * @param funcNode
 * @param public
 * @param override
 * @param static
 * @param common
 */
function addMemberFunction(node,funcNode,public,override,static,common)
{
    node.expval = funcNode.expval;
    node.expval.override = override;
    node.expval.public = public;
    node.expval.static = static;
    common.file.exitFunction(node.expval);
    /*if(common.inClass)
    {
        //在函数内定义
        if(common.inFunction)
        {
        }
        else
        {
            common.class.members.push(node.expval);
        }
    }*/
}

/**
 * 创建函数值
 * @param node
 * @param nodes
 */
function createFunctionValue(node,nodes,common)
{
    //'function' id '(' defineParams ')' returnType block
    //'function' id '(' defineParams ')' returnType
    //'function' '(' defineParams ')' returnType block
    //'function' '(' defineParams ')' returnType
    //'function' getSet id '(' defineParams ')' returnType
    node.expval = {
        "get":false,
        "set":false,
        "gset":false,
        "name":null,
        "params":null,
        "return":null,
        "block":null
    };
    if(nodes[1].value != "(") {
        node.expval.name = nodes[nodes[1].expval == "get" || nodes[1].expval == "set"?2:1].value.name;
    }
    if(nodes[1].expval == "get" || nodes[1].expval == "set")
    {
        //'function' getSet id '(' defineParams ')' returnType
        node.expval.gset = true;
        if(nodes[1].expval == "get") node.expval.get = true;
        else node.expval.set = true;
        if(nodes[4].value == ")")
        {
            //'function' getSet id '(' ')' returnType
            node.expval.params = new As3Params();;
            if(nodes.length == 5) node.expval.return = new As3Type(0);
            else node.expval.return = nodes[5].expval;
        }
        else
        {
            //'function' getSet id '(' defineParams ')' returnType
            node.expval.params = nodes[4].expval;
            if(nodes.length == 6) node.expval.return = new As3Type(0);
            else node.expval.return = nodes[6].expval;
        }
    }
    else
    {
        //'function' id '(' defineParams ')' returnType block
        //'function' id '(' defineParams ')' returnType

        if(nodes[2].value == "(")
        {
            //'function' id '(' defineParams ')' returnType block
            //'function' id '(' defineParams ')' returnType
            if(nodes[3].value == ")")
            {
                //'function' id '(' ')' returnType block
                //'function' id '(' ')' returnType
                node.expval.params = new As3Params();;
                if(nodes[nodes.length-1].expval && nodes[nodes.length-1].expval.type == "stmt_block")
                {
                    //'function' id '(' ')' returnType block
                    if(nodes.length == 5) node.expval.return = new As3Type(0);
                    else node.expval.return = nodes[4].expval;
                }
                else
                {
                    //'function' id '(' ')' returnType
                    if(nodes.length == 4) node.expval.return = new As3Type(0);
                    else node.expval.return = nodes[4].expval;
                }
            }
            else
            {
                //'function' id '(' defineParams ')' returnType block
                //'function' id '(' defineParams ')' returnType
                node.expval.params = nodes[3].expval;
                if(nodes[nodes.length-1].expval && nodes[nodes.length-1].expval.type == "stmt_block")
                {
                    //'function' id '(' defineParams ')' returnType block
                    //'function' id '(' defineParams ')' block
                    if(nodes.length == 6) node.expval.return = new As3Type(0);
                    else node.expval.return = nodes[5].expval;
                }
                else
                {
                    //'function' id '(' defineParams ')' returnType
                    //'function' id '(' defineParams ')'
                    if(nodes.length == 5) node.expval.return = new As3Type(0);
                    else node.expval.return = nodes[5].expval;
                }
            }
        }
        else
        {
            //'function' '(' defineParams ')' returnType block
            //'function' '(' defineParams ')' returnType
            if(nodes[2].value == ")")
            {
                //'function' '(' ')' returnType block
                //'function' '(' ')' returnType
                node.expval.params = new As3Params();;
                if(nodes[nodes.length-1].expval && nodes[nodes.length-1].expval.type == "stmt_block")
                {
                    //'function' '(' ')' returnType block
                    //'function' '(' ')' block
                    if(nodes.length == 4) node.expval.return = new As3Type(0);
                    else node.expval.return = nodes[3].expval;
                }
                else
                {
                    //'function' '(' ')' returnType
                    //'function' '(' ')'
                    if(nodes.length == 3) node.expval.return = new As3Type(0);
                    else node.expval.return = nodes[3].expval;
                }
            }
            else
            {
                //'function' '(' defineParams ')' returnType block
                //'function' '(' defineParams ')' returnType
                node.expval.params = nodes[2].expval;
                if(nodes.length == 5) node.expval.return = new As3Type(0);
                else node.expval.return = nodes[4].expval;
            }
        }
    }
}

/**
 * 添加for语句   'for' '(' defineOrAttribute ';' expr ';' expr ')' stmt
 * 'for' '(' definestmt expnull ';' expnull ')'
 * @param node
 * @param nodes
 */
function addForStmt(node,nodes)
{
    node.expval = {"type":"stmt_for","da":null,"exp1":null,"exp2":null,"stmt":null};
    if(nodes[2].expval && nodes[2].expval.type && nodes[2].expval.type == "stmt_define")
    {
        node.expval.da = nodes[2].expval;
        if(nodes[3].value == ";")
        {
            if(nodes[4].value == ")")
            {
                node.expval.stmt = nodes[5].expval;
            }
            else
            {
                node.expval.exp2 = nodes[4].expval;
                node.expval.stmt = nodes[6].expval;
            }
        }
        else
        {
            node.expval.exp1 = nodes[3].expval;
            if(nodes[5].value == ")")
            {
                node.expval.stmt = nodes[6].expval;
            }
            else
            {
                node.expval.exp2 = nodes[5].expval;
                node.expval.stmt = nodes[7].expval;
            }
        }
    }
    else
    {
        if(nodes[2].value == ";")
        {
            if(nodes[3].value == ";")
            {
                if(nodes[4].value == ")")
                {
                    node.expval.stmt = nodes[5].expval;
                }
                else
                {
                    node.expval.exp2 = nodes[4].expval;
                    node.expval.stmt = nodes[6].expval;
                }
            }
            else
            {
                node.expval.exp1 = nodes[3].expval;
                if(nodes[5].value == ")")
                {
                    node.expval.stmt = nodes[6].expval;
                }
                else
                {
                    node.expval.exp2 = nodes[5].expval;
                    node.expval.stmt = nodes[7].expval;
                }
            }
        }
        else
        {
            node.expval.da = nodes[2].expval;
            if(nodes[4].value == ";")
            {
                if(nodes[5].value == ")")
                {
                    node.expval.stmt = nodes[6].expval;
                }
                else
                {
                    node.expval.exp2 = nodes[5].expval;
                    node.expval.stmt = nodes[7].expval;
                }
            }
            else
            {
                node.expval.exp1 = nodes[4].expval;
                if(nodes[6].value == ")")
                {
                    node.expval.stmt = nodes[7].expval;
                }
                else
                {
                    node.expval.exp2 = nodes[6].expval;
                    node.expval.stmt = nodes[8].expval;
                }
            }
        }
    }

}