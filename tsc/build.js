var fs = require("fs");

var fileBefore = "./src/";
var outfile = "./out";

var files = [
    "EnterFrame.ts",

    "tween/supportClasses/IPlugin.ts",

    "tween/BasicPlugin.ts",
    "tween/Ease.ts",
    "tween/EaseFunction.ts",
    "tween/TimeLine.ts",
    "tween/Tween.ts",

    "tween/plugins/TweenCenter.ts",
    "tween/plugins/TweenPath.ts",
    "tween/plugins/TweenPhysicMove.ts"
];

var content = "tsc --target es5 --sourceMap ";
var jscontent = "";
for (var i = 0; i < files.length; i++) {
    content += fileBefore + files[i] + " ";
    //jscontent += "document.write(\"<script src='bin-debug/" + files[i].slice(0, files[i].length - 2) + "js'><\/script>\");\n";
}
content += "--outDir " + outfile;

fs.writeFile("build.sh", content);
//fs.writeFile("main.js", jscontent);