/**
 * Created by mengj_000 on 2015/4/4.
 */
var NFAGraphics = require("./NFAGraphics");
var Regular = require("./Regular.js");

var g = new NFAGraphics();
/*NFAGraphics.addNFAToGraphics("a/b",g);
var dfa = g.transToDFA();
dfa.find("baabab","a/b");*/
//NFAGraphics.addNFAToGraphics("0|1|2|3|4|5|6|7|8|9",g);
//NFAGraphics.addNFAToGraphics("a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z",g);
//NFAGraphics.addNFAToGraphics("A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z",g);
//NFAGraphics.addNFAToGraphics("(0|1|2|3|4|5|6|7|8|9)+",g);
//NFAGraphics.addNFAToGraphics("\\(",g);
//NFAGraphics.addNFAToGraphics("\\)",g);
//NFAGraphics.addNFAToGraphics(" |\t|\r|\n",g);
//NFAGraphics.addNFAToGraphics("if",g);
//NFAGraphics.addNFAToGraphics("0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|\\(|\\)| |\t|\r|\n|中",g);
//NFAGraphics.addNFAToGraphics("\"(0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|\\(|\\)| |中)*\"",g);
NFAGraphics.addNFAToGraphics("(X(中|X)*X)",g);
var dfa = g.transToDFA();
dfa.setTokenContent("if(\"我了个擦？\")");
//dfa.setTokenPassByRegExp(" |\t|\r|\n");
var token;
while(true)
{
    token = dfa.getNextToken();
    console.log("Token : ",token);
    //console.log("TokenPos : ",dfa.tokenPos);
    if(token == null) break;
}

//NFAGraphics.addNFAToGraphics("(0|1|2|3|4|5|6|7|8|9)+(\.(0|1|2|3|4|5|6|7|8|9)+)?|\.(0|1|2|3|4|5|6|7|8|9)+",g);
//NFAGraphics.addNFAToGraphics("(a|b|c|d)+",g);
//NFAGraphics.addNFAToGraphics("//",g);
//NFAGraphics.addNFAToGraphics("\\*",g);
//NFAGraphics.addNFAToGraphics("/\\*",g);
//NFAGraphics.addNFAToGraphics("switch",g);
//NFAGraphics.addNFAToGraphics("我",g);
//NFAGraphics.addNFAToGraphics("\\?",g);
//NFAGraphics.addNFAToGraphics("abb",g);
//NFAGraphics.addNFAToGraphics("a*b+",g);
//console.log("nfa分析完成分析");
//NFAGraphics.addNFAToGraphics("b",g);


//var d = g.transToDFA();
//var test = "/*";
//var time = (new Date()).getTime();

//console.log(test);
//var time1 = (new Date()).getTime();
//var flag = d.test(test);
//var gap = (new Date()).getTime() - time1;
//console.log("耗时：",gap);
//console.log("测试DFA : ",flag);
//console.log("查找: ", d.find("012/*","/*"));
//console.log("查找: ", d.find("ifswitchav","switch"));
//console.log("查找: ", d.find("你确定认识我吗？不认识！","我"));
//console.log("查找: ", d.find("你确定认识我吗?不认识！","?"));
//console.log("查找: ",(new Regular("我")).find("你确定认识我吗？不认识！","我"));
//console.log("查找: ",(new Regular("\\?")).find("你确定认识我吗?不认识！","?"));


/*console.log(g.start.id, g.end.id, d);

var moves = {
    0:{
        "":[1,2]
    },
    1:{
        "":[0,3],
        "a":[7,8,9]
    },
    3: {
        "": [7],
        "a": [10, 11]
    },
    7:{
        "":[12,13,14],
        "a":[15]
    }
};

var res = g.moveTo([0],"a",moves);
//g.moveToByE([0],moves,{},res);

for(i = 0; i < res.length; i++)
{
    console.log("结果状态：" + res[i]);
}*/
