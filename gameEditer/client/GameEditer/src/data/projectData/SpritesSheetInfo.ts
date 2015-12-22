class SpritesSheetItem {
    public url: string;
    public width: number;
    public height: number;
    public offX: number;
    public offY: number;
    public resourceWidth: number;
    public resourceHeight: number;
    public rot: boolean;
    
    public constructor(url,width,height,offX,offY,resourceWidth,resourceHeight,rot) {
        this.url = url;
        this.width = width;
        this.height = height;
        this.offX = offX;
        this.offY = offY;
        this.resourceWidth = resourceWidth;
        this.resourceHeight = resourceHeight;
        this.rot = rot;
    }
}

/**
 *
 * @author 
 *
 */
class SpritesSheetInfo extends FileInfoBase {
    
    private images: Array<SpritesSheetItem>;
    
	public constructor(url,name,desc) {
        super(url,name,desc);
        this.images = [];
    }

    public get fileContent(): string {
        var config = {
            "name": this.name,
            "desc": this.desc,
            "images": this.images
        }
        return JSON.stringify(config);
    }
}
