/**
 * Created by mengj_000 on 2015/4/4.
 */
var DFANode = function(id) {
    this.id = id;
    this.links = {};
    this.endFlag = false;//表示是否为可接受状态
    this.exp = null; //如果是可接受状态，此值表示接受的表达式
};

/**
 * 添加链接
 * @param input 输入字符
 * @param to 转换的node
 */
DFANode.prototype.addLink = function (input,to) {
    if(this.links[input]) console.log("错啦，DFA已有此转换");
    this.links[input] = to;
}

module.exports = DFANode;