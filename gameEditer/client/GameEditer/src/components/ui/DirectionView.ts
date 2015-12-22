/**
 *
 * @author 
 *
 */
class DirectionView extends eui.Component {

    private group: eui.Group;
    private list: eui.List;

    public constructor(renderer:any=null) {
        super();
        renderer = renderer || DirectionViewItem;
        var exml =
            `<e:Skin xmlns:e="http://ns.egret.com/eui">
                <e:Image width="100%" height="100%" source="resource/images/depthBlueBg.png" scale9Grid="30,30,18,76"/>
                <e:Group id="group" width="100%" y="30" xmlns:e="http://ns.egret.com/eui">
                    <e:Scroller width="100%" height="100%">
                        <e:Skin>
                            <e:VScrollBar id="verticalScrollBar" width="20" height="100%" right="0">
                                <e:Skin>
                                    <e:Image width="100%" height="100%" source="resource/assets/ScrollBar/track.png" scale9Grid="1,1,4,4"/>
                                    <e:Image id="thumb" width="20" height="20" source="resource/assets/ScrollBar/roundthumb.png"  scale9Grid="1,1,4,4"/>
                                </e:Skin>
                            </e:VScrollBar>
                        </e:Skin>
                        <e:List id="list" height="100%">
                        </e:List>
                    </e:Scroller>
                </e:Group>
            </e:Skin>`;
        this.skinName = exml;
        this.list.itemRenderer = renderer;
    }
    
    public validateDisplayList():void {
        super.validateDisplayList();
        this.group.height = this.height - this.group.y;
        this.list.x = 5;
        this.list.width = this.width - 10;
    }

    public get selectedItem(): any {
        return this.list.selectedItem;
    }

    public set dataProvider(collection: eui.ICollection) {
        if(this.list.dataProvider != collection && collection) {
            collection.addEventListener(eui.CollectionEventKind.UPDATE,this.update,this);
        }
        this.list.dataProvider = collection;
    }

    private update(e:any):void {
        var data = this.list.dataProvider;
        this.dataProvider = null;
        this.dataProvider = data;
    }
}
