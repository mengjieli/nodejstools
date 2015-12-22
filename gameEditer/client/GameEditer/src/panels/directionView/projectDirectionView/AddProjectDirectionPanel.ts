/**
 *
 * @author 
 *
 */
class AddProjectDirectionPanel extends eui.Panel {

    private sure: eui.Button;
    private cancle: eui.Button;
    
	public constructor(project:ProjectData,data:FileInfo) {
    	
        super();
        
        this.title = "新建文件夹";

        this.width = 400;
        this.height = 300;

        var button;
        button = new eui.Button();
        button.width = 70;
        button.height = 30;
        button.label = "确定";
        this.addChild(button);
        button.bottom = 5;
        this.sure = button;
        this.sure.addEventListener(egret.TouchEvent.TOUCH_TAP,function(e: egret.TouchEvent): void {
            project.addFloder(data.url,input.text,input2.text);
            this.parent.removeChild(this);
        },this);
        
        button = new eui.Button();
        button.width = 70;
        button.height = 30;
        button.label = "取消";
        this.addChild(button);
        button.bottom = 5;
        this.cancle = button;
        this.cancle.addEventListener(egret.TouchEvent.TOUCH_TAP,function(e: egret.TouchEvent): void {
            this.parent.removeChild(this);
        },this);
        
        this.sure.horizontalCenter = -60;
        this.cancle.horizontalCenter = 60;
        
        var label = new eui.Label();
        label.size = 14;
        label.textColor = 0;
        label.width = 350;
        label.text = "路径: " + data.url + "/";
        label.x = 20;
        label.y = 50;
        this.addChild(label);
        
        label = new eui.Label();
        label.size = 14;
        label.textColor = 0;
        label.text = "名称: ";
        label.x = 20;
        label.y = 75;
        this.addChild(label);
        
        var input = new eui.Label();
        input.size = 14;
        input.border = true;
        input.borderColor = 0;
        input.textColor = 0;
        input.type = egret.TextFieldType.INPUT;
        input.restrict = "a-z A-Z 0-9"
        input.x = 60;
        input.y = 75;
        input.width = 210;
        input.height = 20;
        input.textAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(input);
        
        label = new eui.Label();
        label.size = 14;
        label.textColor = 0;
        label.text = "备注: ";
        label.x = 20;
        label.y = 100;
        this.addChild(label);

        var input2 = new eui.Label();
        input2.size = 14;
        input2.border = true;
        input2.borderColor = 0;
        input2.textColor = 0;
        input2.type = egret.TextFieldType.INPUT;
        input2.x = 60;
        input2.y = 100;
        input2.width = 210;
        input2.height = 20;
        input2.textAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(input2);
	}
}
