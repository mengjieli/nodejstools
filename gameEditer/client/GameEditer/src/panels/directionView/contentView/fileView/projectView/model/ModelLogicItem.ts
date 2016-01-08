/**
 *
 * @author 
 *
 */
class ModelLogicItem extends eui.Component implements eui.IItemRenderer {
    
    private _selected: boolean;
    private _itemIndex: number;
    private _data: ModelLogicInfo;
    private _label: eui.Label;
    private delButton: ImageButton;
    private bg: eui.Image;
    
	public constructor() {
        super();

        this.height = 25;

        var clickBg = new eui.Image(RES.getRes("blue"))
        this.addChild(clickBg);
        clickBg.percentWidth = 100;
        clickBg.percentHeight = 100;
        clickBg.alpha = 0;

        this.addChild(this.bg = new eui.Image(RES.getRes("blue")));
        this.bg.percentWidth = 100;
        this.bg.percentHeight = 100;

        this._label = new eui.Label();
        this._label.size = 14;
        this._label.y = 5;
        this._label.height = this.height;
        this.addChild(this._label);
        
        this.delButton = new ImageButton(RES.getRes("delete"));
        this.delButton.y = 5;
        this.delButton.right = 5;
        this.addChild(this.delButton);
    }

    public set data(val: ModelLogicInfo) {
        this._data = val;
        this._label.text = this._data.desc;
    }

    public get data(): ModelLogicInfo {
        return this._data;
    }
    
    public set selected(val: boolean) {
        this._selected = val;
        this.bg.visible = val;
        this.delButton.visible = val;
        if(val) {
            this.dispatchEventWith("selected",true);
        }
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
