/**
 * Created by mengj_000 on 2015/4/30.
 */

require("./as3/fileutils/File");

var fs = require("fs"),
    path = require("path"),
    File = global.File;


var files = [];

files.push("./log/Statistics");
files.push("./log/Log");

files.push("./as3/structs/commonStructs/As3CallParams");
files.push("./as3/structs/commonStructs/As3Param");
files.push("./as3/structs/commonStructs/As3Params");
files.push("./as3/structs/commonStructs/As3Type");
files.push("./as3/structs/commonStructs/As3Var");

files.push("./as3/structs/stmts/expr/As3ArrayValue");
files.push("./as3/structs/stmts/expr/As3BaseValue");
files.push("./as3/structs/stmts/expr/As3ExprAtr");
files.push("./as3/structs/stmts/expr/As3ExprAtrItem");
files.push("./as3/structs/stmts/expr/As3FunctionValue");
files.push("./as3/structs/stmts/expr/As3ObjectValue");
files.push("./as3/structs/stmts/expr/As3Expr");
files.push("./as3/structs/stmts/expr/As3RegExpValue");

files.push("./as3/structs/stmts/As3BlockStmt");
files.push("./as3/structs/stmts/As3BreakStmt");
files.push("./as3/structs/stmts/As3CaseStmt");
files.push("./as3/structs/stmts/As3CatchStmt");
files.push("./as3/structs/stmts/As3ContinueStmt");
files.push("./as3/structs/stmts/As3DefaultStmt");
files.push("./as3/structs/stmts/As3DefineStmt");
files.push("./as3/structs/stmts/As3DeleteStmt");
files.push("./as3/structs/stmts/As3DeviceStmt");
files.push("./as3/structs/stmts/As3DoWhileStmt");
files.push("./as3/structs/stmts/As3ExprStmt");
files.push("./as3/structs/stmts/As3ForEachStmt");
files.push("./as3/structs/stmts/As3ForInStmt");
files.push("./as3/structs/stmts/As3ForStmt");
files.push("./as3/structs/stmts/As3IfStmt");
files.push("./as3/structs/stmts/As3ReturnStmt");
files.push("./as3/structs/stmts/As3Stmts");
files.push("./as3/structs/stmts/As3ThrowStmt");
files.push("./as3/structs/stmts/As3TryStmt");
files.push("./as3/structs/stmts/As3WhileStmt");
files.push("./as3/structs/stmts/As3SwitchStmt");

files.push("./as3/structs/As3Function");
files.push("./as3/structs/As3MetaTag");
files.push("./as3/structs/As3PrintHelp");
files.push("./as3/structs/As3Package");
files.push("./as3/structs/As3Class");
files.push("./as3/structs/As3File");
files.push("./as3/structs/As3NameSpace");

files.push("./as3/core/TokenType");
files.push("./as3/core/ParserTable");
files.push("./as3/core/ScannerTable");
files.push("./as3/core/Scanner");

files.push("./as3/datas/As3TransTableItem");
files.push("./as3/datas/As3TransTable");
files.push("./as3/datas/VarData");
files.push("./as3/datas/FunctionData");
files.push("./as3/datas/ClassData");

files.push("./as3/fileutils/File");
files.push("./as3/core/Parser");
files.push("./as3/As3TransManager");

files.push("./TransAs");

var content = "uglifyjs ";
for(i = 0; i < files.length; i++)
{
    content += files[i] + ".js ";
}
content += "-o Trans.js -m";//" --mangle-props";

File.saveFile("UglifyTrans.bat",content);

//多文件压缩，指定source map和网站来源
//result = UglifyJS.minify(files,{
//    output:"Trans.js",
//    mangle:true
//});