class LogicItemBorder {
    public static RECT_VIRTUAL:string = "rect_virtual";
    public static RECT_REAL:string = "rect_real";
}

/**
 *
 * @author 
 *
 */
class LogicItemBase extends eui.Component {
    
    private bg:egret.Shape;
    protected data:ModelLogicInfo;
    protected label1:Label;
    protected label2:Label;
    protected label3:Label;
    protected w = 150;
    protected h = 70;
    protected next:LogicItemBase;
    protected nextLine: egret.Shape;
    protected lineColor = 0xaaaaaa;
    protected fillColor = 0x555555;
    
	public constructor(data:ModelLogicInfo) {
    	super();
    	this.data = data;
    	this.addChild(this.bg = new egret.Shape());
    	this.label1 = Label.create({
    	    color:0xffffff,
    	    size:14,
    	    width:this.w,
    	    align:egret.HorizontalAlign.CENTER,
    	    height:20,
    	    y:5,
    	    max:15
    	});
    	this.addChild(this.label1);
        this.label2 = Label.create({
            color: 0xffffff,
            size: 14,
            width: this.w,
            align: egret.HorizontalAlign.CENTER,
            height: 20,
            y:27,
            max:14
        });
        this.addChild(this.label2);
        this.label3 = Label.create({
            color: 0xffffff,
            size: 14,
            width: this.w,
            align: egret.HorizontalAlign.CENTER,
            height: 20,
            y:49,
            max:11
        });
        this.addChild(this.label3);
	}
	
	protected showBorder(type:string):void {
    	this.bg.graphics.clear();
    	var width = this.w;
    	var height = this.h;
        if(type == LogicItemBorder.RECT_VIRTUAL) {
            this.bg.graphics.beginFill(this.fillColor);
            this.bg.graphics.drawRect(0,0,width,height);
            this.bg.graphics.endFill();
            this.bg.graphics.lineStyle(1,this.lineColor);
            Graphics.drawVirtualLine(this.bg.graphics,0,0,width,0);
            Graphics.drawVirtualLine(this.bg.graphics,width,0,width,height);
            Graphics.drawVirtualLine(this.bg.graphics,width,height,0,height);
            Graphics.drawVirtualLine(this.bg.graphics,0,height,0,0);
    	    
    	} else if(type == LogicItemBorder.RECT_REAL) {
    	    this.bg.graphics.lineStyle(1,this.lineColor);
    	    this.bg.graphics.beginFill(this.fillColor);
    	    this.bg.graphics.drawRect(0,0,width,height);
    	    this.bg.graphics.endFill();
    	}
	}
	
    protected createLine():egret.Shape {
	    var shape = new egret.Shape();
	    shape.graphics.lineStyle(1,this.lineColor);
	    return shape;
	}
	
	public addNext(info:ModelLogicItemInfo=null,parentLogic:ModelLogicItemInfo=null):void {
    	if(this.next) {
    	    this.removeChild(this.next);
    	    this.removeChild(this.nextLine);
    	    this.next = this.nextLine = null;
    	}
    	var next = ModelEditer.getNetLogicItem(this.data,info,parentLogic);
    	this.addChild(next);
    	next.y = this.h + 50;
    	this.next = next;
      this.nextLine = this.createLine();
      if(info) {
          Graphics.drawArrow(this.nextLine.graphics,this.w / 2,this.h,this.w / 2,next.y);
      } else {
          Graphics.drawVirtualArrow(this.nextLine.graphics,this.w / 2,this.h,this.w / 2,next.y);
      }
    	this.addChild(this.nextLine);
	}
}
