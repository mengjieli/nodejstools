/**
 *
 * @author 
 *
 */
class ConentPanelItemBase extends eui.Component {

    public constructor() {
        super();
    }

    public isExist(e: ContentViewEvent): boolean {
        return false;
    }
}


/**
 *
 * @author 
 *
 */
class ImageView extends ConentPanelItemBase {
    
    private image: eui.Image;
    private infoTxt: eui.Label;
    private bitmap: egret.Bitmap;
    
    private file:FileInfo;
    
	public constructor(file:FileInfo) {
        super();
        this.file = file;
        var exml = 
            `<e:Skin xmlns:e = "http://ns.egret.com/eui">
                <e:Label id="infoTxt" size="14"/>
            </e:Skin>`;
        this.skinName = exml;
        
        this.percentWidth = this.percentHeight = 100;
        this.infoTxt.lineSpacing = 3;
        
        var imageLoader = new egret.ImageLoader();
        imageLoader.load(Config.localResourceServer + "/" + file.url);
        imageLoader.addEventListener(egret.Event.COMPLETE,this.onLoadImageComplete,this)
        //this.image.source = Config.localResourceServer + "/" + file.url;
    }
    
    private onLoadImageComplete(e:egret.Event):void {
        var imageLoader = e.currentTarget;
        this.bitmap = new egret.Bitmap(imageLoader.data);
        this.bitmap.x = 0;
        this.addChild(this.bitmap);
//        this.bitmap.x = (this.width - this.bitmap.width) / 2;
//        this.bitmap.y = (this.height - this.bitmap.height) / 2;
        
        this.infoTxt.text = "图片信息: \n" + this.file.url;
        this.infoTxt.text += "\n宽: " + this.bitmap.width + "   高: " + this.bitmap.height;
        this.infoTxt.x = this.bitmap.width + 50;
    }

    public isExist(e: ContentViewEvent): boolean {
        if(e.file == this.file) {
            return true;
        }
        return false;
    }
	
	public get name():string {
        return this.file.name + "        ";
	}
}
