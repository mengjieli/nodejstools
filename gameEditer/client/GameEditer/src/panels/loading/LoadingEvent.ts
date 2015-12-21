/**
 *
 * @author 
 *
 */
class LoadingEvent extends egret.Event{
    
    public static START: string = "start";
    public static PROGRESS: string = "progress";
    public static COMPLETE: string = "complete";
    
    public title: string = "";
    public tip: string = "";
    /**
     * 进度 0 - 1
     */ 
    public progress: number = 0;
    
	public constructor(type:string) {
        super(type);
	}
}
