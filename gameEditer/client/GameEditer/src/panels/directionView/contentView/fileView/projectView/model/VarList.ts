class VarListItem extends eui.Component implements eui.IItemRenderer {

    private _data: any;
    private _selected: boolean;
    private _itemIndex: number;

    private bg: eui.Image;
    private label: eui.Label;

    public constructor() {
        super();
        this.percentHeight = 100;
        this.width = 120;

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
        this.label.textColor = 0xffffff;
//        this.label.textAlign = egret.HorizontalAlign.CENTER;
        this.label.percentWidth = 100;
        this.label.percentHeight = 100;
        this.label.lineSpacing = 5;
        this.label.x = 2;
        this.label.y = 3;
        this.label.multiline = true;
        this.addChild(this.label);

        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touch,this);
    }

    private touch(e: egret.TouchEvent): void {
        this.dispatchEventWith(egret.Event.CHANGE,true);
    }

    public set data(val: any) {
        this._data = val;
        if(val) {
            this.label.text = val.desc + "\n" + val.type.desc;
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
class VarList extends List {
	public constructor() {
    	super(true);
      this.itemRenderer = VarListItem;
	}
}
