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
start : expr {node.expval = nodes[0].expval;}
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
    | true {node.expval = new Expr("boolean","true");}
    | false {node.expval = new Expr("boolean","false");}
    | 'null' {node.expval = new Expr("null");}

atr :'(' expr ')' {node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("()",nodes[1].expval));}  //属性相关的定义
    | CString {node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("string",nodes[0].value));}
    | id {node.expval = new ExprAtr();node.expval.addItem(new ExprAtrItem("id",nodes[0].value.name));}
    | atr '.' id {node.expval = nodes[0].expval;node.expval.addItem(new ExprAtrItem(".",nodes[2].value.name));}
    | atr funcCallEnd {node.expval = nodes[0].expval;node.expval.addItem(new ExprAtrItem("call",nodes[1].expval));}

funcCallEnd : '(' callParams ')' {node.expval = nodes.length==2?new CallParams():nodes[1].expval;}

callParams : expr ',' callParams  {node.expval = nodes[2].expval;node.expval.addParamAt(nodes[0].expval,0);}  //函数调用参数
    | expr {node.expval = new CallParams();node.expval.addParam(nodes[0].expval);}
    |

device : ';'
       | ','
       |
%%