/**
 *
 * @author 
 *
 */
class ScrollTip extends egret.Sprite {
    
    private label:eui.Label;
    private level:number;
    private time:number;
    
	public constructor(content:string) {
    	super();
    	
    	var label = new eui.Label();
    	label.size = 20;
    	label.textColor = 0xffffff;
    	label.text = content;
    	label.textAlign = egret.HorizontalAlign.CENTER;
    	this.addChild(label);
    	this.label = label;
    	
    	this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
    	this.addEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
    	
    	this.level = 1;
    	this.time = (new Date()).getTime() + 2000;
	}
	
	private addToStage(e:egret.Event):void {
	    this.x = this.stage.stageWidth/2;
	    this.y = this.stage.stageHeight/4;
	}
	
    private onFrame(e: egret.Event): void {
        this.label.y = -100 + 100 * (this.time - (new Date()).getTime() )/2000;
        this.label.alpha =  (this.time - (new Date()).getTime()) / 2000;
	    if(this.level == 1) {
	        if((new Date()).getTime() >= this.time) {
	            this.removeEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
	            this.parent.removeChild(this);
	        }
	    }
	}
}
