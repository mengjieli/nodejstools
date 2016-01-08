/**
 *
 * @author 
 *
 */
class AlertPanel extends eui.Panel {
    
    private content: eui.Label;
    private sure: eui.Button;
    private cancle: eui.Button;
    
	public constructor(content:string,title:string="提示",
    	sureLabel:string="",sureBack:Function=null,sureThis:any=null,
	cancleLabel:string="",cancleBack:Function=null,cancleThis:any=null) {
        super();
        
        this.width = 400;
        this.height = 300;
        
        var button;
        if(sureLabel && sureLabel != "") {
            button = new eui.Button();
            button.width = 70;
            button.height = 30;
            button.label = "确定";
            this.addChild(button);
            button.bottom = 5;
            this.sure = button;
            this.sure.addEventListener(egret.TouchEvent.TOUCH_TAP,function(e: egret.TouchEvent): void {
                if(sureBack) {
                    sureBack.apply(sureThis);
                }
                this.parent.removeChild(this);
            },this);
        }

        if(cancleLabel && cancleLabel != "") {
            button = new eui.Button();
            button.width = 70;
            button.height = 30;
            button.label = "取消";
            this.addChild(button);
            button.bottom = 5;
            this.cancle = button;
            this.cancle.addEventListener(egret.TouchEvent.TOUCH_TAP,function(e: egret.TouchEvent): void {
                if(cancleBack) {
                    cancleBack.apply(cancleThis);
                }
                this.parent.removeChild(this);
            },this);
        }
        
        if(this.sure && this.cancle) {
            this.sure.horizontalCenter = -60;
            this.cancle.horizontalCenter = 60;
        } else if(this.sure) {
            this.sure.horizontalCenter = 0;
        } else if(this.cancle) {
            this.cancle.horizontalCenter = 0;
        }
        
        this.title = title;
        this.addChild(this.content = new eui.Label());
        this.content.y = 30;
        this.content.size = 14;
        this.content.textColor = 0;
        this.content.text = content;
        this.content.maxWidth = this.width;
        this.content.lineSpacing = 3;
        this.content.wordWrap = true;
        this.content.multiline = true;
        this.content.verticalCenter = 0;
        this.content.horizontalCenter = 0;
        
        PopManager.pop(this,true,true);
	}
}
