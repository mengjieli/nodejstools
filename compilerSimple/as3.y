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
start : stmts {node.expval = nodes[0].expval;}
stmts : stmt stmts {node.expval = nodes[1].expval;node.expval.addStmtAt(nodes[0].expval,0);}
    | stmt {node.expval = new Stmts();node.expval.addStmt(nodes[0].expval);}
stmt : expr {node.expval = new ExprStmt(nodes[0].expval);}
    | device {node.expval = new DeviceStmt();}
expr : '-' expr  %prec UMINUS {node.expval = new Expr("-a",nodes[1].expval);}
    | '+' expr  %prec ADD {node.expval = new Expr("+a",nodes[1].expval);}
    | '!' expr {node.expval = new Expr("!",nodes[1].expval);}
    | expr '*' expr {node.expval = new Expr("*",nodes[0].expval,nodes[2].expval);}
    | expr '/' expr {node.expval = new Expr("/",nodes[0].expval,nodes[2].expval);}
    | expr '%' expr {node.expval = new Expr("%",nodes[0].expval,nodes[2].expval);}
    | expr '+' expr {node.expval = new Expr("+",nodes[0].expval,nodes[2].expval);}
    | expr '-' expr {node.expval = new Expr("-",nodes[0].expval,nodes[2].expval);}
    | expr '<<' expr {node.expval = new Expr("<<",nodes[0].expval,nodes[2].expval);}
    | expr '>>' expr {node.expval = new Expr(">>",nodes[0].expval,nodes[2].expval);}
    | expr '<<<' expr {node.expval = new Expr("<<<",nodes[0].expval,nodes[2].expval);}
    | expr '>>>' expr {node.expval = new Expr(">>>",nodes[0].expval,nodes[2].expval);}
    | expr '>' expr {node.expval = new Expr(">",nodes[0].expval,nodes[2].expval);}
    | expr '<' expr {node.expval = new Expr("<",nodes[0].expval,nodes[2].expval);}
    | expr '>' '=' expr {node.expval = new Expr(">=",nodes[0].expval,nodes[3].expval);}
    | expr '<' '=' expr {node.expval = new Expr("<=",nodes[0].expval,nodes[3].expval);}
    | expr '=' '=' expr {node.expval = new Expr("==",nodes[0].expval,nodes[3].expval);}
    | expr '=' '=' '=' expr {node.expval = new Expr("===",nodes[0].expval,nodes[4].expval);}
    | expr '!' '=' '=' expr {node.expval = new Expr("!==",nodes[0].expval,nodes[4].expval);}
    | expr '!' '=' expr {node.expval = new Expr("!=",nodes[0].expval,nodes[3].expval);}
    | expr '&' expr {node.expval = new Expr("&",nodes[0].expval,nodes[2].expval);}
    | '~' expr {node.expval = new Expr("~",nodes[1].expval);}
    | expr '^' expr {node.expval = new Expr("^",nodes[0].expval,nodes[2].expval);}
    | expr '|' expr {node.expval = new Expr("|",nodes[0].expval,nodes[2].expval);}
    | expr '&&' expr {node.expval = new Expr("&&",nodes[0].expval,nodes[2].expval);}
    | expr '||' expr {node.expval = new Expr("||",nodes[0].expval,nodes[2].expval);}
    | expr '?' expr ':' expr {node.expval = new Expr("?:",nodes[0].expval,nodes[2].expval,nodes[4].expval);}
    | atr {node.expval = new Expr("Atr",nodes[0].expval);}
    | CInt {node.expval = new Expr("int",nodes[0].value);}
    | OXCInt {node.expval = new Expr("0xint",nodes[0].value);}
    | CNumber {node.expval = new Expr("number",nodes[0].value);}
    | CString {node.expval = new Expr("string",nodes[0].value);}
    | true {node.expval = new Expr("boolean","true");}
    | false {node.expval = new Expr("boolean","false");}
    | 'null' {node.expval = new Expr("null");}

atr :'(' expr ')' {node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("()",nodes[1].expval));}  //属性相关的定义
    | CString {node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("string",nodes[0].value));}
    | id {node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("id",nodes[0].value.name));}
    | objValue {node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("object",nodes[0].expval));}
    | atr '.' id {node.expval = nodes[0].expval;node.expval.addItem(new ExprAtrItem(".",nodes[2].value.name));}
    | atr funcCallEnd {node.expval = nodes[0].expval;node.expval.addItem(new ExprAtrItem("call",nodes[1].expval));}

objValue : '{' objValueItems '}' %prec OBJBLOCK {node.expval = new ObjectAtr(nodes.length==2?[]:nodes[1].expval);}    //Object值
objValueItems : objectKey ':' expr ',' objValueItems {node.expval = [[nodes[0].expval,nodes[2].expval]];node.expval = node.expval.concat(nodes.length==4?[null]:nodes[4].expval);}
    | objectKey ':' expr {node.expval = [[nodes[0].expval,nodes[2].expval]];}
    |

objectKey : id {node.expval = new Expr("string",nodes[0].value.name);}   //基本的值类型
    | CInt {node.expval = new Expr("int",nodes[0].value);}
    | OXCInt {node.expval = new Expr("0xint",nodes[0].value);}
    | CNumber {node.expval = new Expr("number",nodes[0].value);}
    | CString {node.expval = new Expr("string",nodes[0].value);}

funcCallEnd : '(' callParams ')' {node.expval = nodes.length==2?new CallParams():nodes[1].expval;}

callParams : expr ',' callParams  {node.expval = nodes[2].expval;node.expval.addParamAt(nodes[0].expval,0);}  //函数调用参数
    | expr {node.expval = new CallParams();node.expval.addParam(nodes[0].expval);}
    |

device : ';'
       | ','
       |
%%