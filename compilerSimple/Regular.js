/**
 * Created by mengj_000 on 2015/4/5.
 */
var NFAGraphics = require("./NFAGraphics.js");
var Regular = function (regExp) {
    var g = new NFAGraphics();
    NFAGraphics.addNFAToGraphics(regExp,g);
    this.dfa = g.transToDFA();
};

Regular.prototype.find = function (source, find) {
    return this.dfa.find(source,find);
}

module.exports = Regular;