/**
 * Created by mengj_000 on 2015/4/6.
 */
var TokenType = {
    endSign:"$",
    public:0,
    private:1,
    protected:2,
    final:3,
    class:4,
    interface:5,
    extends:6,
    implements:7,
    var:8,
    static:9,
    const:10,
    function:11,
    void:12,
    return:13,
    import:14,
    package:15,
    new:16,
    leftB:"{",//{
    rightB:"}",//}
    leftM:"[",//[
    rightM:"]",//]
    left:"(",//(
    right:")",//)
    op:"op",
    bop:33,
    op3:50,//?
    relation:34,
    split:40, //;
    splitPoint:41, //,
    mao:51,//:
    point:52,//.
    id:"id",//id
    valueInt:"CInt",//整数常量
    valueNumber:"CNumber",//数字常量
    valueString:"CString"//字符串常量
};

var TokenTrans = {
    "op":true
};

module.exports = TokenType;