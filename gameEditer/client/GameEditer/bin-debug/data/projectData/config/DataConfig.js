/**
 *
 * @author
 *
 */
var DataConfig = (function () {
    function DataConfig() {
    }
    var d = __define,c=DataConfig;p=c.prototype;
    DataConfig.typeDropDownData = new eui.ArrayCollection([
        { label: "整数", type: "int" },
        { label: "数字", type: "number" },
        { label: "真假", type: "bool" },
        { label: "字符串", type: "string" },
        { label: "数组", type: "Array" }
    ]);
    DataConfig.typeArrayDropDownData = new eui.ArrayCollection([
        { label: "整数", type: "int" },
        { label: "数字", type: "number" },
        { label: "真假", type: "bool" },
        { label: "字符串", type: "string" }
    ]);
    DataConfig.typeDesc = {
        "int": "整数",
        "number": "数字",
        "bool": "真假",
        "string": "字符串"
    };
    return DataConfig;
})();
egret.registerClass(DataConfig,"DataConfig");
