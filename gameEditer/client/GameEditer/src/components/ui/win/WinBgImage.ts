/**
 *
 * @author 
 *
 */
class WinBgImage extends eui.Image {
    
	public constructor(type:number=1) {
        super();
        if(type == 1) {
            this.source = RES.getRes("blue2");
            this.scale9Grid = new egret.Rectangle(10,10,54,23);
        }
        else if(type == 2) {
            this.source = RES.getRes("depthBlueBg");
            this.scale9Grid = new egret.Rectangle(30,30,18,76);
        }
	}
}
