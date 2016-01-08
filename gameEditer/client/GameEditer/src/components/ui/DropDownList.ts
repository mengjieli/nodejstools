class DropDownListItem extends eui.Component implements eui.IItemRenderer {
    private _data: any;
    private _selected: boolean;
    private _itemIndex: number;

    private bg: eui.Image;
    private label: eui.Label;

    public constructor() {
        super();
        
        this.percentWidth = 100;
        this.height = 20;

        var clickBg = new eui.Image(RES.getRes("blue"))
        this.addChild(clickBg);
        clickBg.percentWidth = 100;
        clickBg.percentHeight = 100;
        clickBg.alpha = 0;

        this.addChild(this.bg = new eui.Image(RES.getRes("blue")));
        this.bg.percentWidth = 100;
        this.bg.percentHeight = 100;
        
        this.label = new eui.Label();
        this.label.size = 14;
        this.label.textColor = 0;
        this.label.height = 20;
        this.label.textAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(this.label);
    }
    
    public set data(val: any) {
        this._data = val;
        if(val) {
            this.label.text = val.label;
        }
    }
    
    public get data(): any {
        return this._data;
    }

    public set selected(val: boolean) {
        this._selected = val;
        this.bg.visible = val;
    }

    protected setSelected(val: boolean): void {
        this._selected = val;
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set itemIndex(val: number) {
        this._itemIndex = val;
    }

    public get itemIndex(): number {
        return this._itemIndex;
    }
}

/**
 *
 * @author 
 *
 */
class DropDownList extends eui.Component{
    
    private label: eui.Label;
    private btn: ImageButton;
    private list: eui.List;
    private listBg: egret.Shape;
    
	public constructor(width,height) {
        super();

        
        this.width = width;
        this.height = height;
        
        var label = new eui.Label;
        this.addChild(label);
        label.border = true;
        label.textAlign = egret.VerticalAlign.MIDDLE;
        label.backgroundColor = 0x444444;
        label.background = true;
        label.textColor = 0xffffff;
        label.size = 14;
        label.percentWidth = 100;
        label.height = 20;
        this.label = label;
        
        this.btn = new ImageButton(RES.getRes("floderOpen"));
        this.addChild(this.btn);
        this.btn.y = 5;
        this.btn.right = 3;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onShowList,this);
        
        var shape = new egret.Shape();
        this.addChild(shape);
        
        this.list = new eui.List();
        this.list.itemRenderer = DropDownListItem;
        this.list.y = 20;
        this.list.percentWidth = 100;
        this.list.height = height - this.list.y;
        this.list.visible = false;
        this.list.addEventListener(egret.Event.CHANGE,this.onIndexChange,this);
        this.addChild(this.list);
        
        shape.y = this.list.y;
        shape.graphics.beginFill(0xcccccc);
        shape.graphics.drawRect(0,0,this.width,this.list.height);
        shape.graphics.endFill();
        shape.visible = false;
        this.listBg = shape;
	}
	
    public set dataProvider(data: eui.ICollection) {
        this.list.dataProvider = data;
        if(data.length == 0) return;
        this.list.selectedIndex = 0;
        this.label.text = this.list.selectedItem.label;
	}
	
    public get dataProvider():eui.ICollection {
        return this.list.dataProvider;
    }
    
    public get selectIndex():number {
        return this.list.selectedIndex;
    }
    
    public set selectIndex(index:number) {
        this.list.selectedIndex = index;
        this.label.text = this.list.selectedItem.label;
    }

    public get selectedItem(): any {
        return this.list.selectedItem;
    }
	
    private onShowList(e:egret.TouchEvent):void {
        this.list.visible = !this.list.visible;
        this.listBg.visible = this.list.visible;
    }
	
    private onIndexChange(e:egret.Event):void {
        this.label.text = this.list.selectedItem.label;
        if(this.list.visible) {
            this.list.visible = !this.list.visible;
            this.listBg.visible = this.list.visible;
        }
        this.dispatchEventWith(egret.Event.CHANGE);
    }
}
