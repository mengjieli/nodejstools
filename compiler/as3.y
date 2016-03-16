%left OBJBLOCK
%left STMTBLOCK
%left ';'
%left ','
%right '=' '*=' '/=' '%=' '+=' '-=' '||=' '<<=' '>>=' '&=' '^=' '|='
%right '?:'
%left '||'
%left '&&'
%left 'as' 'is' 'in'
%left IN
%left '|'
%left '^'
%left '&'
%left '!==' '===' '==' '!='
%left '>' '<' '>=' '<='
%left '<<' '>>' '<<<' '>>>'
%left '+' '-'
%left '*' '/' '%'
%right UMINUS ADD '!' '&' '~'
%right FADD FUMINUS
%left EUMINUS EADD
%left '[]' '()' '.'
%left '.<>()'
%%

file : pkg pkgouts {common.file.readFileComplete();}

pkgouts : pkgout pkgouts
    | pkgout
    | '{' pkgouts '}'
    |

pkgout : imports
    | classDefine

pkg :pkgTag pkgurl '{' imports classDefine '}' {common.file.exitPackage();}
    |pkgTag pkgurl '{' imports interfaceDefine '}' {common.file.exitPackage();}
pkgTag :  'package' {common.file.enterPackage();}

pkgurl : simpleURL {common.file.setPackageURL(nodes[0].expval);}
       |
imports : imports imports
    |'import' simpleURL devices {common.file.addImport(nodes[1].expval);}
    | namespaceDefine devices
    | metaTags
    |

interfaceDefine : interfaceHead '{' memberDefines '}' {common.file.exitClass();}
interfaceHead : interfaceBegin id extendsDefine {common.file.setClassName(nodes[1].value.name);}
interfaceBegin : classDynamic classPublic classFinal 'interface' {common.file.enterClass(true);}
    |classPublic classDynamic classFinal 'interface' {common.file.enterClass(true);}

namespaceDefine : id 'namespace' id {node.expval = new global.As3NameSpace(nodes[2].value.name);common.file.addNameSpace(node.expval);}

classDefine :classHead  '{' memberDefines '}' {common.file.exitClass();}
    |
classHead : classBegin id extendsDefine implementsDefine {common.file.setClassName(nodes[1].value.name);}
classBegin :classDynamic classPublic classFinal 'class' {common.file.enterClass();}
    |classPublic classDynamic classFinal 'class' {common.file.enterClass();}
    | classFinal classPublic classDynamic 'class' {common.file.enterClass();}
    |classFinal classDynamic classPublic 'class' {common.file.enterClass();}
    | classPublic classFinal classDynamic 'class' {common.file.enterClass();}
    | classDynamic classFinal classPublic 'class' {common.file.enterClass();}
classPublic : 'public'
            | 'private'
            | 'protected'
            | 'internal'
            |
classFinal : 'final'
    |
classDynamic : 'dynamic'
    |
extendsDefine : 'extends' simpleURL {common.file.setClassExtends(nodes[1].expval);}
    |
implementsDefine : 'implements' simpleURLds {common.file.addClassImplements(nodes[1].expval);}
    |
simpleURLds : simpleURL {node.expval = [nodes[0].expval];}
    | simpleURL ',' simpleURLds  {node.expval = [nodes[0].expval].concat(nodes[2].expval);}

simpleURL : simpleURL '.' id {node.expval = nodes[0].expval + "." + nodes[2].value.name;}  //表示Sprite 或者 flash.display.Sprite这样的类名
    | simpleURL '.' '*' {node.expval = nodes[0].expval + ".*";}  //例如 flash.display.* 包含所有的类名
    | simpleURL '.' 'Vector' {node.expval = nodes[0].expval + ".Vector";}
    | simpleURL '.' 'flash_proxy' {node.expval = nodes[0].expval + ".flash_proxy";}
    | id {node.expval = nodes[0].value.name;}
    | 'Vector' {node.expval = "Vector";}
    | 'flash_proxy' {node.expval = "flash_proxy";}


memberDefines : memberDefines memberDefine
    | memberDefines metaTags
    | metaTags
    | memberDefine
    | namespaceDefine
    |
memberDefine : memberVarDefine
    | memberFuncDefine
    | stmt {common.file.addStmt(nodes[0].expval);}
memberFuncDefine : typeFinalDefine funcDefine {addMemberFunction(node,nodes[nodes.length==1?0:1],nodes.length==1?"public":nodes[0].expval,false,false,common);}    //成员函数
    | 'override' 'flash_proxy' typeFinalDefine funcDefine {addMemberFunction(node,nodes[nodes.length==3?2:3],nodes.length==3?"public":nodes[2].expval,true,false,common);}
    | 'override' typeFinalDefine funcDefine {addMemberFunction(node,nodes[nodes.length==2?1:2],nodes.length==2?"public":nodes[1].expval,true,false,common);}
    | typeFinalDefine 'override' funcDefine {addMemberFunction(node,nodes[nodes.length==2?1:2],nodes.length==2?"public":nodes[0].expval,true,false,common);}
    | 'flash_proxy' 'override' funcDefine {addMemberFunction(node,nodes[2],"public",true,false,common);}
    | 'static' typeFinalDefine funcDefine {addMemberFunction(node,nodes[nodes.length==2?1:2],nodes.length==2?"public":nodes[1].expval,false,true,common);}
    | typeFinalDefine 'static' funcDefine {addMemberFunction(node,nodes[nodes.length==2?1:2],nodes.length==2?"public":nodes[0].expval,false,true,common);}
funcDefine : funcDefineHead block {node.expval = nodes[0].expval;node.expval.block = nodes[1].expval;}
    | funcDefineHead {node.expval = nodes[0].expval;}
funcDefineHead : 'function' getSet id '(' defineParams ')' returnType {common.file.enterFunction();createFunctionValue(node,nodes);} //成员函数的定义
returnType : ':' defineTypeValue {node.expval = nodes[1].expval;}  //函数的返回参数类型
    | ':'  'void' {node.expval = new As3Type(3);}
    |
getSet : 'get' {node.expval = "get";}
    | 'set' {node.expval = "set";}
    |
defineParams : defineParmasVal {node.expval = nodes[0].expval;}
    |
defineParmasVal : defineParmasVal ',' '.' '.' '.' defineContent {node.expval = nodes[0].expval;node.expval.addParam(new As3Param(nodes[5].expval.name,new As3Type(4),null));}  //函数参数
    | defineParmasVal ',' defineContent    {node.expval = nodes[0].expval; node.expval.addParam(nodes[2].expval);}
    | defineContent {node.expval = new As3Params();node.expval.addParam(nodes[0].expval);}
    | '.' '.' '.' defineContent {node.expval = new As3Params();node.expval.addParam(new As3Param(nodes[3].expval.name,new As3Type(4),null));}  //函数参数
memberVarDefine : memberVarHead defineContents {var vals = As3Var.createVars(nodes[0].expval.public,nodes[0].expval.static,nodes[0].expval.var,nodes[1].expval);common.file.addVars(vals);} //成员变量的定义
memberVarHead :  typeFinalDefine varConstDefine {node.expval = {"public":nodes.length==1?"public":nodes[0].expval,"static":false,"var":nodes[nodes.length==1?0:1].var\};}   //成员变量的public、static、var等属性
     | 'static' typeFinalDefine varConstDefine {node.expval = {"public":nodes.length==2?"public":nodes[1].expval,"static":true,"var":nodes[nodes.length==1?1:2].var\};}
     | typeFinalDefine 'static' varConstDefine {node.expval = {"public":nodes.length==2?"public":nodes[0].expval,"static":true,"var":nodes[nodes.length==1?1:2].var\};}
typeFinalDefine : finalType
                | typeDefine {node.expval = nodes[0].expval;}
                | finalType typeDefine {node.expval = nodes[1].expval;}
                | typeDefine finalType {node.expval = nodes[0].expval;}
finalType : 'final'
     |
typeDefine : 'public' {node.expval = "public";}    //判断对象的公开性
    | 'private' {node.expval = "private";}
    | 'protected' {node.expval = "protected";}
    | 'internal' {node.expval = "private";}
    | id {node.expval = nodes[0].value.name;}
    |
varConstDefine : 'var' {node.var = true;}     //判断对象是变量还是常量
    | 'const'  {node.var = false;}
defineContents : defineContents ',' defineContent {node.expval = nodes[0].expval;node.expval.addParam(nodes[2].expval);} //一系列的变量定义，例如var a:int,b:int=1,c:String;
    | defineContent {node.expval = new As3Params();node.expval.addParam(nodes[0].expval);}
defineContent : varName defineType '=' expr {node.expval = new As3Param(nodes[0].expval.val,nodes.length==3?new As3Type(0):nodes[1].expval,nodes[nodes.length==3?2:3].expval);}
    |  varName defineType {node.expval = new As3Param(nodes[0].expval.val,nodes.length==1?new As3Type(0):nodes[1].expval,null);}
defineType : ':' defineTypeValue {node.expval = nodes[1].expval;}//类型
           |
defineTypeValue : simpleTypeValue {node.expval = new As3Type(1,nodes[0].expval);}  //类型
    | '*'  {node.expval = new As3Type(0);}
    |'Vector' '.' '<' '*' '>' {node.expval = new As3Type(2,nodes[4].expval);}
    |'Vector' '.' '<' simpleTypeValue '>' {node.expval = new As3Type(2,nodes[3].expval);}
simpleTypeValue : simpleTypeValue '.' id {node.expval = nodes[0].expval + "." + nodes[2].value.name;}  //表示Sprite 或者 flash.display.Sprite这样的类名
    | id {node.expval = nodes[0].value.name;}

metaTags: metaTag device
metaTag : '[' id '(' metaItems ')' ']' {if(nodes.length==6)common.file.addMetaTag(new As3MetaTag(nodes[1].value.name,nodes[3].expval));}
    | '[' id '(' CString ')' ']' {if(nodes.length==7)common.file.addMetaTag(new As3MetaTag(nodes[1].value.name,[{"name":nodes[3].value,"val":null\}]));}
metaItems : metaItem ',' metaItems {node.expval = nodes.length==3?nodes[2].expval.concat([nodes[0].expval]):[nodes[0].expval];}
        | metaItem {node.expval = [nodes[0].expval];}
        |
metaItem : id '=' CString {node.expval={"name":nodes[0].value.name,"val":nodes[2].value\};}
        | id '=' CInt {node.expval={"name":nodes[0].value.name,"val":nodes[2].value\};}
        | id '=' OXCInt {node.expval={"name":nodes[0].value.name,"val":nodes[2].value\};}
        | id '=' CNumber {node.expval={"name":nodes[0].value.name,"val":nodes[2].value\};}


block : '{' stmts '}' %prec STMTBLOCK {node.expval = new As3BlockStmt(nodes.length==2?null:nodes[1].expval);}
stmts : normaltmts {node.expval = nodes[0].expval;}
      | specailstmts {node.expval = nodes[0].expval;}
specailstmts : specailstmt specailstmts {node.expval = nodes[1].expval;node.expval.addStmtAt(nodes[0].expval,0);}
    | specailstmt {node.expval = new As3Stmts();node.expval.addStmt(nodes[0].expval);}
specailstmt : casestmt {node.expval = nodes[0].expval;}
    | defaultstmt {node.expval = nodes[0].expval;}
    |
normaltmts : stmt normaltmts {node.expval = nodes[1].expval;node.expval.addStmtAt(nodes[0].expval,0);}
    | stmt {node.expval = new As3Stmts();node.expval.addStmt(nodes[0].expval);}
    |
stmt : expr device {node.expval = new As3ExprStmt(nodes[0].expval);}
    | block {node.expval = nodes[0].expval;}
    | returnstmt {node.expval = nodes[0].expval;}
    | definestmt {node.expval = nodes[0].expval;}
    | ifstmt {node.expval = nodes[0].expval;}
    | forstmt {node.expval = nodes[0].expval;}
    | forinstmt {node.expval = nodes[0].expval;}
    | foreachinstmt {node.expval = nodes[0].expval;}
    | whilestmt {node.expval = nodes[0].expval;}
    | dowhilestmt {node.expval = nodes[0].expval;}
    | switchstmt {node.expval = nodes[0].expval;}
    | 'continue' {node.expval = new As3ContinueStmt();}
    | 'break' {node.expval = new As3BreakStmt();}
    | trystmt {node.expval = nodes[0].expval;}
    | deletestmt {node.expval = nodes[0].expval;}
    | throwstmt {node.expval = nodes[0].expval;}
    | ';' {node.expval = new As3DeviceStmt();}
definestmt : varConstDefine defineContents device {var vals = As3Var.createVars("private",false,nodes[0].var,nodes[1].expval);node.expval = new As3DefineStmt(vals);common.file.addVars(vals);}
returnstmt : 'return' stmt device {node.expval = new As3ReturnStmt(nodes[1].expval);}
    |  'return' {node.expval = new As3ReturnStmt(null);}
ifstmt : 'if' '(' expr ')' stmt {node.expval = new As3IfStmt(nodes[2].expval,nodes[4].expval,null);}
    | 'if' '(' expr ')' stmt 'else' stmt {node.expval = new As3IfStmt(nodes[2].expval,nodes[4].expval,nodes[6].expval);}
forstmt : 'for' '(' definestmt expnull ';' expnulls ')' stmt {addForStmt(node,nodes);node.expval = new As3ForStmt(node.expval.da,node.expval.exp1,node.expval.exp2,node.expval.stmt);}
        | 'for' '(' expr ';' expnull ';' expnulls ')' stmt {addForStmt(node,nodes);node.expval = new As3ForStmt(node.expval.da,node.expval.exp1,node.expval.exp2,node.expval.stmt);}
        | 'for' '(' ';' expnull ';' expnulls ')' stmt {addForStmt(node,nodes);node.expval = new As3ForStmt(node.expval.da,node.expval.exp1,node.expval.exp2,node.expval.stmt);}
forinstmt : 'for' '(' definestmt 'in' expr ')' stmt %prec IN {node.expval = new As3ForInStmt(nodes[2].expval,nodes[4].expval,nodes[6].expval);}
    |'for' '(' expin  ')' stmt {node.expval = new As3ForInStmt(nodes[2].expval.expval1,nodes[2].expval.expval2,nodes[4].expval);}
foreachinstmt : 'for' 'each' '(' definestmt 'in' expr ')' stmt  {node.expval = new As3ForEachStmt(nodes[3].expval,nodes[5].expval,nodes[7].expval);}
    |  'for' 'each' '(' expin ')' stmt  {node.expval = new As3ForEachStmt(nodes[3].expval.expval1,nodes[3].expval.expval2,nodes[5].expval);}
expnulls : expnull ',' expnulls {node.expval=[nodes[0].expval].concat(nodes[2].expval);}
    | expnull {node.expval=[nodes[0].expval];}
expnull : expr {node.expval = nodes[0].expval;}
    |
whilestmt : 'while' '(' expr ')' stmt {node.expval = new As3WhileStmt(nodes[2].expval,nodes[4].expval);}
dowhilestmt : 'do' stmt 'while' '(' expr ')' {node.expval = new As3DoWhileStmt(nodes[4].expval,nodes[1].expval);}
switchstmt : 'switch' '(' expr ')' stmt {node.expval = new As3SwitchStmt(nodes[2].expval,nodes[4].expval);}
casestmt : 'case' expr ':' normaltmts {node.expval = new As3CaseStmt(nodes[1].expval,nodes.length==4?nodes[3].expval:null);}
defaultstmt : 'default' ':' normaltmts {node.expval = new As3DefaultStmt(nodes.length==3?nodes[2].expval:null);}
trystmt : 'try' stmt catchstmts {node.expval = new As3TryStmt(nodes[1].expval,nodes.length==3?nodes[2].expval:null);}
catchstmts : catchstmt catchstmts {node.expval = [nodes[0].expval].concat(nodes[1].expval);}
    | catchstmt {node.expval = [nodes[0].expval];}
    |
catchstmt : 'catch' '(' id defineType ')' stmt {node.expval = new As3CatchStmt(new As3Param(nodes[2].value.name,nodes.length==5?null:nodes[3].expval),nodes[nodes.length==5?4:5].expval);}
deletestmt : 'delete' expr device {node.expval = new As3DeleteStmt(nodes[1].expval);}
throwstmt : 'throw' expr device {node.expval = new As3ThrowStmt(nodes[1].expval);}

expr : expr '+' '+' %prec EADD {node.expval = new As3Expr("a++",nodes[0].expval);}
    | expr '-' '-' %prec EUMINUS {node.expval = new As3Expr("a--",nodes[0].expval);}
    | '+' '+' expr %prec FADD {node.expval = new As3Expr("++a",nodes[2].expval);}
    | '-' '-' expr %prec FUMINUS {node.expval = new As3Expr("--a",nodes[2].expval);}
    | '-' expr  %prec UMINUS {node.expval = new As3Expr("-a",nodes[1].expval);}
    | '+' expr  %prec ADD {node.expval = new As3Expr("+a",nodes[1].expval);}
    | '!' expr {node.expval = new As3Expr("!",nodes[1].expval);}
    | expr '*' expr {node.expval = new As3Expr("*",nodes[0].expval,nodes[2].expval);}
    | expr '/' expr {node.expval = new As3Expr("/",nodes[0].expval,nodes[2].expval);}
    | expr '%' expr {node.expval = new As3Expr("%",nodes[0].expval,nodes[2].expval);}
    | expr '+' expr {node.expval = new As3Expr("+",nodes[0].expval,nodes[2].expval);}
    | expr '-' expr {node.expval = new As3Expr("-",nodes[0].expval,nodes[2].expval);}
    | expr '<<' expr {node.expval = new As3Expr("<<",nodes[0].expval,nodes[2].expval);}
    | expr '>>' expr {node.expval = new As3Expr(">>",nodes[0].expval,nodes[2].expval);}
    | expr '<<<' expr {node.expval = new As3Expr("<<<",nodes[0].expval,nodes[2].expval);}
    | expr '>>>' expr {node.expval = new As3Expr(">>>",nodes[0].expval,nodes[2].expval);}
    | expr '>' expr {node.expval = new As3Expr(">",nodes[0].expval,nodes[2].expval);}
    | expr '<' expr {node.expval = new As3Expr("<",nodes[0].expval,nodes[2].expval);}
    | expr '>' '=' expr {node.expval = new As3Expr(">=",nodes[0].expval,nodes[3].expval);}
    | expr '<' '=' expr {node.expval = new As3Expr("<=",nodes[0].expval,nodes[3].expval);}
    | expr '=' '=' expr {node.expval = new As3Expr("==",nodes[0].expval,nodes[3].expval);}
    | expr '=' '=' '=' expr {node.expval = new As3Expr("===",nodes[0].expval,nodes[4].expval);}
    | expr '!' '=' '=' expr {node.expval = new As3Expr("!==",nodes[0].expval,nodes[4].expval);}
    | expr '!' '=' expr {node.expval = new As3Expr("!=",nodes[0].expval,nodes[3].expval);}
    | expr '&' expr {node.expval = new As3Expr("&",nodes[0].expval,nodes[2].expval);}
    | '~' expr {node.expval = new As3Expr("~",nodes[1].expval);}
    | expr '^' expr {node.expval = new As3Expr("^",nodes[0].expval,nodes[2].expval);}
    | expr '|' expr {node.expval = new As3Expr("|",nodes[0].expval,nodes[2].expval);}
    | expr '&&' expr {node.expval = new As3Expr("&&",nodes[0].expval,nodes[2].expval);}
    | expr '||' expr {node.expval = new As3Expr("||",nodes[0].expval,nodes[2].expval);}
    | expr '=' expr {node.expval = new As3Expr("=",nodes[0].expval,nodes[2].expval);}
    | expr '*' '=' expr {node.expval = new As3Expr("*=",nodes[0].expval,nodes[3].expval);}
    | expr '/' '=' expr {node.expval = new As3Expr("/=",nodes[0].expval,nodes[3].expval);}
    | expr '%' '=' expr {node.expval = new As3Expr("%=",nodes[0].expval,nodes[3].expval);}
    | expr '&' '=' expr {node.expval = new As3Expr("&=",nodes[0].expval,nodes[3].expval);}
    | expr '+' '=' expr {node.expval = new As3Expr("+=",nodes[0].expval,nodes[3].expval);}
    | expr '-' '=' expr {node.expval = new As3Expr("-=",nodes[0].expval,nodes[3].expval);}
    | expr '||'  '=' expr {node.expval = new As3Expr("||=",nodes[0].expval,nodes[3].expval);}
    | expr '<<'  '=' expr {node.expval = new As3Expr("<<=",nodes[0].expval,nodes[3].expval);}
    | expr '>>' '=' expr {node.expval = new As3Expr(">>=",nodes[0].expval,nodes[3].expval);}
    | expr '^' '=' expr {node.expval = new As3Expr("^=",nodes[0].expval,nodes[3].expval);}
    | expr '|' '=' expr {node.expval = new As3Expr("|=",nodes[0].expval,nodes[3].expval);}
    | expr '?' expr ':' expr {node.expval = new As3Expr("?:",nodes[0].expval,nodes[2].expval,nodes[4].expval);}
    | expr 'as' defineTypeValue {node.expval = new As3Expr("as",nodes[0].expval,nodes[2].expval);}
    | expr 'is' atr {node.expval = new As3Expr("is",nodes[0].expval,nodes[2].expval);nodes[2].expval.start = true;}
    | expr 'is' 'Vector' '.' '<' simpleTypeValue '>' {node.expval = new As3Expr("is",nodes[0].expval,new As3Type(2,nodes[5].expval));}
    | expin {node.expval = nodes[0].expval;}
    | atr {node.expval = nodes[0].expval;node.expval.start = true;}
    | CInt {node.expval = new As3Expr("int",nodes[0].value);}
    | OXCInt {node.expval = new As3Expr("0xint",nodes[0].value);}
    | CNumber {node.expval = new As3Expr("number",nodes[0].value);}
    | true {node.expval = new As3Expr("boolean","true");}
    | false {node.expval = new As3Expr("boolean","false");}
    | 'null' {node.expval = new As3Expr("null");}
expin : expr 'in' expr {node.expval = new As3Expr("in",nodes[0].expval,nodes[2].expval);}
atr :'(' expr ')' {node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("()",nodes[1].expval));}  //属性相关的定义
    | RegExp {node.expval = new As3ExprAtr();node.expval.addItem(new As3RegExpValue(nodes[0].value));}
    | funcValue {node.expval = new As3ExprAtr();node.expval.addItem(nodes[0].expval);}
    | arrValue {node.expval = new As3ExprAtr();node.expval.addItem(nodes[0].expval);}
    | atrValue {node.expval = new As3ExprAtr();node.expval.addItem(nodes[0].expval);}
    | objValue {node.expval = new As3ExprAtr();node.expval.addItem(nodes[0].expval);}
    | 'new' defineTypeValue funcCallEnd {node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("new",nodes[1].expval,nodes[2].expval,true));}
    | 'new' defineTypeValue {node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("new",nodes[1].expval,null,false));}
    | 'new' '(' expr ')' funcCallEnd  {node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("new ()",nodes[2].expval,nodes[4].expval,true));}
    | 'new' '(' expr ')' {node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("new ()",nodes[2].expval,null,false));}
    | atr '.' atrValue {node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem(".",nodes[2].expval));}
    | atr '.' '.' atrValue {node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem(".",null));node.expval.addItem(new As3ExprAtrItem(".",nodes[3].expval));}
    | atr '.' '@' atrValue {node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem(".@",nodes[3].expval));}
    | atr '.' '@' '[' expr ']' {node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem(".@[]",nodes[4].expval));}
    | atr '.' '.' id  {node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem("..",nodes[3].expval));}
    | atr '[' expr ']' {node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem("[]",nodes[2].expval));}
    | atr funcCallEnd {node.expval = nodes[0].expval;node.expval.addItem(new As3ExprAtrItem("call",nodes[1].expval));}
    | 'Vector' '.' '<' simpleURL '>' '(' expr ')'  {node.expval = new As3ExprAtr();node.expval.addItem(new As3ExprAtrItem("Vector call",new As3Type(1,nodes[3].expval),nodes[6].expval));}
funcCallEnd : '(' callParams ')' {node.expval = nodes.length==2?new As3CallParams():nodes[1].expval;}
atrValue : varName {node.expval = nodes[0].expval;}
    | CString {node.expval = new As3BaseValue("string",nodes[0].value);}
callParams : expr ',' callParams  {node.expval = nodes[2].expval;node.expval.addParamAt(nodes[0].expval,0);}  //函数调用参数
    | expr {node.expval = new As3CallParams();node.expval.addParam(nodes[0].expval);}
    |
funcValue :funcValueHead id '(' defineParams ')' returnType block  {createFunctionValue(node,nodes);node.expval.block = nodes[nodes.length-1].expval;node.expval = new As3FunctionValue(node.expval);node.expval.addVars(common.file.exitFunction());}//体内函数定义
    | funcValueHead '(' defineParams ')' returnType block  {createFunctionValue(node,nodes);node.expval.block = nodes[nodes.length-1].expval;node.expval = new As3FunctionValue(node.expval);node.expval.addVars(common.file.exitFunction());}
funcValueHead : 'function' {common.file.enterFunction();}
arrValue : '[' arrValueContent ']' {node.expval = new As3ArrayValue(nodes.length==2?[]:nodes[1].expval);}  //数组值
arrValueContent : expr ',' arrValueContent {node.expval = [nodes[0].expval];if(nodes.length==2)node.expval.push(null);else node.expval = node.expval.concat(nodes[2].expval);}
    | expr {node.expval = [nodes[0].expval];}
    |
objValue : '{' objValueItems '}' %prec OBJBLOCK {node.expval = new As3ObjectValue(nodes.length==2?[]:nodes[1].expval);}    //Object值
objValueItems : baseValue ':' expr ',' objValueItems {node.expval = [[nodes[0].expval,nodes[2].expval]];node.expval = node.expval.concat(nodes.length==4?[null]:nodes[4].expval);}
    | baseValue ':' expr {node.expval = [[nodes[0].expval,nodes[2].expval]];}
    |
varName : id {node.expval = new As3BaseValue("id",nodes[0].value.name);}
    | 'final' {node.expval = new As3BaseValue("id",nodes[0].token);}
    | 'static' {node.expval = new As3BaseValue("id",nodes[0].token);}
    | 'namespace' {node.expval = new As3BaseValue("id",nodes[0].token);}
baseValue : id {node.expval = new As3BaseValue("id",nodes[0].value.name);}   //基本的值类型
      | CInt {node.expval = new As3BaseValue("int",nodes[0].value);}
      | OXCInt {node.expval = new As3BaseValue("0xint",nodes[0].value);}
      | CNumber {node.expval = new As3BaseValue("number",nodes[0].value);}
      | CString {node.expval = new As3BaseValue("string",nodes[0].value);}
devices : device devices
       | device
device : ';'
       | ','
       |
%%
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