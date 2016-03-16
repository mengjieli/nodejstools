/**
 * Created by mengj_000 on 2015/4/4.
 */
/**一个NFA结点**/
var NFA = require("./NFA.js"),
    NFANode = require("./NFANode.js"),
    NodeLink = require("./NodeLink.js") ;

var NFANode = function(id){
    this.id = id;
    this.links = [];
    this.receive = null;
}

NFANode.prototype.addLink = function(input,next)
{
    var link = new NodeLink();
    link.start = this;
    link.input = input;
    link.end = next;
    this.links.push(link);
}

module.exports = NFANode;