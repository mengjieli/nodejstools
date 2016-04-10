1.文件结构，分为4部分，第一部分为说明，第二部分为正则表达式的定义，第三部分为token的表达式(只引用定义部分的表达式)，第四部分为辅助函数。

2. 特殊运算符：
| 或
* 闭包
+ 正闭包
? 可选部分
（ 左括号
） 右括号
[~] 非运算符，表示除了什么之外的运算符，例如[~=]表示除了=之外的其它运算符，[~不能写其它正则表达式或运算符号]，例如[~{abc}]是不可以的，然后[~a*]是不能的，~并不是非运算，而是取除什么之外的其它字符
any 表示所有的符号
以上运算符的替换格式为\\加运算符，例如要匹配+则替换成\\+

第三部分，如果return null或者不写return或return null，则会自动跳过此token，返回下一个token

%%
num 0|1|2|3|4|5|6|7|8|9
abc a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z
ABC A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z
ws \t| |　|\r|\n
space {ws}+
id ({abc}|{ABC}|_|$)({abc}|{ABC}|{num}|_)*
int {num}+
oxInt 0(x|X)(0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|A|B|C|D|E|F)*
number ({num}+)?.{num}+
cstr "[~"]*"|'[~']*'
%%
{space} {return null;}

null {return TokenType.Type["null"];}
as {return TokenType.Type["as"];}
is {return TokenType.Type["is"];}
true {return TokenType.Type["true"];}
false {return TokenType.Type["false"];}

"{" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"}" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}

"\(" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"\)" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"\+" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"-" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"\*" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"/" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"=" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"%" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}

">" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"<" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"!" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"\|\|" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"&&" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}

"^" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"\|" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"&" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"~" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"<<" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
">>" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"<<<" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
">>>" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}

"\?" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"." {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
":" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
";" {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}
"," {this.commonInfo.tokenValue = content;return TokenType.Type["op"];}

{int} {this.commonInfo.tokenValue = content;return TokenType.Type["valueInt"];}
{oxInt} {this.commonInfo.tokenValue = content;return TokenType.Type["valueOxInt"];}
{number} {this.commonInfo.tokenValue = content;return TokenType.Type["valueNumber"];}
{cstr} {this.commonInfo.tokenValue = content;return TokenType.Type["valueString"];}
{id} {this.commonInfo.tokenValue = installId(this.commonInfo,content);return TokenType.Type["id"];}

%%
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