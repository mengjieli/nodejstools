/**
 *
 * @author 
 *
 */
class Graphics {
    
    /**
     * 画虚线
     */ 
	public static drawVirtualLine(graphics:egret.Graphics,startX:number,startY:number,endX:number,endY:number,realWidth=5,virtualWidth=5):void {
	    var pos = 0;
	    var gapX = endX - startX;
	    var gapY = endY - startY;
	    var len = Math.sqrt(gapX*gapX + gapY*gapY);
	    while(pos < len) {
	        var lineStartX = startX + pos*gapX/len;
	        var lineStartY = startY + pos*gapY/len;
	        pos += realWidth;
	        if(pos > len) pos = len;
	        var lineEndX = startX + pos*gapX/len;
	        var lineEndY = startY + pos*gapY/len;
	        graphics.moveTo(lineStartX,lineStartY);
	        graphics.lineTo(lineEndX,lineEndY);
	        pos += virtualWidth;
        }
        graphics.endFill();
	}
	
    public static drawVirtualArrow(graphics: egret.Graphics,startX: number,startY: number,endX: number,endY: number,realWidth = 5,virtualWidth = 5): void {
        Graphics.drawVirtualLine(graphics,startX,startY,endX,endY);
        var rot = Math.atan2( - endY + startY, - endX + startX);
        var rot1 = rot + 30*Math.PI/180;
        var rot2 = rot - 30 * Math.PI / 180;
        var len = 12;
        
        Graphics.drawVirtualLine(graphics,endX,endY,endX + len * Math.cos(rot1),endY + len * Math.sin(rot1),5,3);
        Graphics.drawVirtualLine(graphics,endX,endY,endX + len * Math.cos(rot2),endY + len * Math.sin(rot2),5,3);
    }
    
    public static drawArrow(graphics: egret.Graphics,startX: number,startY: number,endX: number,endY: number,realWidth = 5,virtualWidth = 5): void {
        Graphics.drawVirtualLine(graphics,startX,startY,endX,endY,10,0);
        var rot = Math.atan2(- endY + startY,- endX + startX);
        var rot1 = rot + 30 * Math.PI / 180;
        var rot2 = rot - 30 * Math.PI / 180;
        var len = 12;
        Graphics.drawVirtualLine(graphics,endX,endY,endX + len * Math.cos(rot1),endY + len * Math.sin(rot1),len,0);
        Graphics.drawVirtualLine(graphics,endX,endY,endX + len * Math.cos(rot2),endY + len * Math.sin(rot2),len,0);

    }
}
