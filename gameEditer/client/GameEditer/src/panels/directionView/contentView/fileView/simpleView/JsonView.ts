
/**
 *
 * @author 
 *
 */
class JsonView extends ConentPanelItemBase {

    private file: FileInfo;
    private content: eui.Label;

    public constructor(file: FileInfo) {
        super();
        this.file = file;

        this.percentWidth = this.percentHeight = 100;
        this.addChild(this.content = new eui.Label());
        this.content.size = 14;
        this.content.percentWidth = 100;
        this.content.wordWrap = true;
        this.content.multiline = true;
        
        RES.getResByUrl(Config.getResourceURL(this.file.url),
            this.onGetComplete,this,RES.ResourceItem.TYPE_JSON);
//        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
//        request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
    }

    private onGetComplete(data): void {
        this.content.text = JSON.stringify(data);
        /*var request = <egret.HttpRequest>event.currentTarget;
        console.log("get data : ",request.response);
        this.content.text = request.response;*/
    }

    public isExist(e: ContentViewEvent): boolean {
        if(e.file == this.file) {
            return true;
        }
        return false;
    }

    public get name(): string {
        return this.file.name + "        ";
    }
}
