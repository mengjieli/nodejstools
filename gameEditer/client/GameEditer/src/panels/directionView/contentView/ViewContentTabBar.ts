/**
 *
 * @author 
 *
 */
class ViewContentTabBar extends eui.ItemRenderer {
    
    private closeBtn: eui.Button;
    
	public constructor() {
        super();
        
        var exml = 
        `<e:Skin states="up,down" height="25" xmlns:e = "http://ns.egret.com/eui" >
            <e:Image source.down="resource/images/tabYes.png" source.up="resource/images/tabNo.png" width="100%" height="100%"/>
            <e:Label text="{data}" size="14" textColor.down="0xFFFFFF" textColor.up="0x666666" horizontalCenter="0" verticalCenter="0"/>
            <e:Button id="closeBtn" right="3" verticalCenter="0">
                <e:Skin states="up,down,disabled">
                    <e:Image alpha.up="1.0" alpha.down="0.5" alpha.disabled="0.5" source="resource/images/button/close.png"/>
                 </e:Skin>
            </e:Button>
        </e:Skin>`;
        
        this.skinName = exml;
        
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
	}
	
	private onClose(e:egret.TouchEvent):void {
        EditerData.getInstance().conteView.closeFile(this.itemIndex);
	}
}
