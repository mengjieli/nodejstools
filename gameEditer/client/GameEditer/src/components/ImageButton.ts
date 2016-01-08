/**
 *
 * @author 
 *
 */
class ImageButton extends eui.Component {
    
    private clickBg: egret.Shape;
    private image:eui.Image;
    
	public constructor(source,touchBack=null,touchThis=null) {
        super();
        
        this.clickBg = new egret.Shape;
        this.addChild(this.clickBg);
        
        var image = new eui.Image();
        image.source = source;
        this.addChild(image);
        this.image = image;
        
        if(touchBack) {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,touchBack,touchThis);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,touchBack,touchThis);
        }
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(e: egret.TouchEvent): void {
            this.scaleX = 0.9;
            this.scaleY = 0.9;
        },this);
        this.addEventListener(egret.TouchEvent.TOUCH_END,function(e: egret.TouchEvent): void {
            this.scaleX = 1;
            this.scaleY = 1;
        },this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,function(e: egret.TouchEvent): void {
            this.scaleX = 1;
            this.scaleY = 1;
            this.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        },this);
	}
	
    public validateDisplayList():void {
        super.validateDisplayList();
        this.clickBg.graphics.clear();
        this.clickBg.graphics.beginFill(0x555555,0);
        this.clickBg.graphics.drawRect(0,0,this.image.width,this.image.height);
        this.clickBg.graphics.endFill();
    }
}
