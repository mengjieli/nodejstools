/**
 *
 * @author 
 *
 */
class DataConfig {
	public constructor() {
	}
	
	public static typeDropDownData:eui.ArrayCollection = new eui.ArrayCollection([
        { label: "整数",type: "int" },
        { label: "数字",type: "number" },
        { label: "真假",type: "bool" },
        { label: "字符串",type: "string" },
        { label: "数组",type: "Array" }
    	]);
    	
    public static typeArrayDropDownData = new eui.ArrayCollection([
        { label: "整数",type: "int" },
        { label: "数字",type: "number" },
        { label: "真假",type: "bool" },
        { label: "字符串",type: "string" }
    ]);
    
    public static typeDesc = {
        "int":"整数",
        "number":"数字",
        "bool":"真假",
        "string":"字符串"
    }
}
