class ListLabel extends eui.Component implements eui.IItemRenderer {
    
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
        this.label.textColor = 0xffffff;
        this.label.height = 20;
        this.label.x = 2;
        this.label.y = 3;
        this.addChild(this.label);
        
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touch,this);
    }
    
    private touch(e:egret.TouchEvent):void {
        this.dispatchEventWith(egret.Event.CHANGE,true);
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
class List extends eui.Component {
    
    private list:eui.List;
    
    public constructor(horizontal:boolean=false) {
    	super();
    	
        var exml;
        if(horizontal) {
            exml = `<e:Skin xmlns:e="http://ns.egret.com/eui">
                <e:Image width="100%" height="100%" source="resource/images/blue2.png" scale9Grid="10,10,51,20"/>
                <e:Group id="group" width="100%" height="100%" xmlns:e="http://ns.egret.com/eui">
                    <e:Scroller width="100%" height="100%">
                        <e:Skin>
                            <e:HScrollBar id="verticalScrollBar" width="100%" height="20" bottom="0">
                                <e:Skin>
                                    <e:Image width="100%" height="100%" source="resource/assets/ScrollBar/track.png" scale9Grid="1,1,4,4"/>
                                    <e:Image id="thumb" width="20" height="20" source="resource/assets/ScrollBar/roundthumb.png"  scale9Grid="1,1,4,4"/>
                                </e:Skin>
                            </e:HScrollBar>
                        </e:Skin>
                        <e:List id="list" width="100%" height="100%">
                            <e:layout>
                                <e:HorizontalLayout/>
                            </e:layout>
                        </e:List>
                    </e:Scroller>
                </e:Group>
            </e:Skin>`;
        } else {
            exml = `<e:Skin xmlns:e="http://ns.egret.com/eui">
                <e:Image width="100%" height="100%" source="resource/images/blue2.png" scale9Grid="10,10,51,20"/>
                <e:Group id="group" width="100%" height="100%" xmlns:e="http://ns.egret.com/eui">
                    <e:Scroller width="100%" height="100%">
                        <e:Skin>
                            <e:VScrollBar id="verticalScrollBar" width="20" height="100%" right="0">
                                <e:Skin>
                                    <e:Image width="100%" height="100%" source="resource/assets/ScrollBar/track.png" scale9Grid="1,1,4,4"/>
                                    <e:Image id="thumb" width="20" height="20" source="resource/assets/ScrollBar/roundthumb.png"  scale9Grid="1,1,4,4"/>
                                </e:Skin>
                            </e:VScrollBar>
                        </e:Skin>
                        <e:List id="list" width="100%" height="100%">
                        </e:List>
                    </e:Scroller>
                </e:Group>
            </e:Skin>`;
        }
        this.skinName = exml;
        this.list.itemRenderer = ListLabel;
	}
	
    public set itemRenderer(val:any) {
        this.list.itemRenderer = val;
    }
    
    public get itemRenderer():any {
        return this.list.itemRenderer;
    }
	
    public set dataProvider(data: eui.ICollection) {
        this.list.dataProvider = data;
    }

    public get dataProvider(): eui.ICollection {
        return this.list.dataProvider;
    }
    
    public get selectedItem():any {
        return this.list.selectedItem;
    }
}
