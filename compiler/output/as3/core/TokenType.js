/**
 * Created by mengj_000 on 2015/4/6.
 */
var TokenType = {
    endSign:"$",
    public:"public",
    private:"private",
    protected:"protected",
    final:"final",
    dynamic:"dynamic",
    internal:"internal",
    class:"class",
    interface:"interface",
    extends:"extends",
    implements:"implements",
    import:"import",
    var:"var",
    static:"static",
    const:"const",
    function:"function",
    override:"override",
    void:"void",
    return:"return",
    package:"package",
    flashProxy:"flash_proxy",
    namespace:"namespace",
    finally:"finally",
    new:"new",
    as:"as",
    is:"is",
    get:"get",
    set:"set",
    Vector:"Vector",
    op:"op",
    id:"id",//id
    valueInt:"CInt",//整数常量
    valueOxInt:"OXCInt",//16位数字
    valueNumber:"CNumber",//数字常量
    valueString:"CString",//字符串常量
    valueRegExp:"RegExp",//字符串常量
    null:"null",
    true:"true",
    false:"false",

    if:"if",
    else:"else",
    for:"for",
    each:"each",
    in:"in",

    do:"do",
    while:"while",
    switch:"switch",
    case:"case",
    default:"default",
    continue:"continue",
    break:"break",
    try:"try",
    catch:"catch",
    delete:"delete",
    throw:"throw",
        "TokenTrans":{
        "op":true
    }
};

global.TokenType = TokenType;
//module.exports = TokenType;