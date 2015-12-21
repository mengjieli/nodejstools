/**
 *
 * @author 
 *
 */
class ImageButton extends eui.Image {
    
	public constructor(source,touchBack=null,touchThis=null) {
        super();
        this.source = source;
        if(touchBack) {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,touchBack,touchThis);
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
        },this);
	}
}
