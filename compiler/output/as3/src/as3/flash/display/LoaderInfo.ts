/**
 * Created by mengj_000 on 2015/4/27.
 */


module as3
{
    export class LoaderInfo extends egret.EventDispatcher
    {
        //public actionScriptVersion : number;
        private _applicationDomain : as3.ApplicationDomain;
        //public bytes : egret.ByteArray;
        //public bytesLoaded : number;
        //public bytesTotal : number;
        //public childAllowsParent : boolean;
        //public childSandboxBridge : Object
        private _content : egret.DisplayObject;
        //public contentType : String
        //public frameRate : Number
        //public height : int
        //public isURLInaccessible : Boolean
        public loader : as3.Loader;
        //public loaderURL : String
        //public parameters : Object
        //public parentAllowsChild : Boolean
        //public parentSandboxBridge : Object
        //public sameDomain : Boolean
        //public sharedEvents : EventDispatcher
        //public swfVersion : uint
        //public uncaughtErrorEvents : UncaughtErrorEvents
        //public url : String
        //public width : int
        private _urlload:egret.URLLoader;

        public constructor()
        {
            super();
        }

        public get applicationDomain()
        {
            return this._applicationDomain;
        }

        public set applicationDomain(domain:as3.ApplicationDomain)
        {
            this._applicationDomain = domain;
        }

        public get content():egret.DisplayObject
        {
            return this._content;
        }

        public initWidthLoader(loader:as3.Loader,req:egret.URLRequest)
        {
            this.loader = loader;

            var url = req.url;
            url = url.split("?")[0];
            var end = url.split(".")[1];
            if(end == "png" || end == "jpg" || end == "PNG" || end == "JPG") {
                if(this._urlload == null)
                {
                    this._urlload = new egret.URLLoader(req);
                    this._urlload.addEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
                }
                this._urlload.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                this._urlload.load(req);
            }
            else if(end == "swf" || end == "SWF")
            {
                //加载swf
               this.loadSWF(url.split(".")[0]);
            }
        }

        private onLoadComplete(e:egret.Event)
        {
            var txt:egret.Texture = this._urlload.data;
            var bmd:as3.BitmapData = new as3.BitmapData(txt._bitmapWidth,txt._bitmapHeight,false,0,txt);
            this._content = new as3.Bitmap(bmd);
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        }

        private loadGroupName:string = "";
        private loadSWF(swfName:string):void
        {
            swfName = "swfres/" + swfName;
            this.loadGroupName = swfName.split("/").join("_") + "_";
            //console.log(this.loadGroupName);
            RES.loadGroup(this.loadGroupName);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onResourceLoadError, this);
        }
        private onResourceLoadComplete(event: RES.ResourceEvent): void {
            // console.log("loaded group:" + event.groupName);
            if (event.groupName == this.loadGroupName) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);//必须在接收到本组加载成功后移除，不能放在if外面
                RES.getResAsync(event.groupName+"config", this.onLoadConfig, this);
            }
        }

        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onResourceLoadError(event: RES.ResourceEvent): void {
            console.warn("Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //Ignore the loading failed projects
            this.onResourceLoadComplete(event);
        }

        private onLoadConfig(obj:any):void
        {
            var resConfig:egret.Resconfig = new egret.Resconfig(obj);
            resConfig.resNamePrefix = resConfig.relativeDir.split("/").join("_");
            resConfig.resModule = resConfig.relativeDir.split("/").join(".");
            //console.log(resConfig);
            for(var symbol in resConfig.symbols)
            {
                this._applicationDomain.resModule = resConfig.resModule;
                this._applicationDomain.defNames.push(symbol);
                var def = this._applicationDomain.getDefinition(symbol);
                if(null == def)
                {// 没有导出类定义
                    console.warn("undefined class:"+symbol);
                    continue;
                }
                def.symbolName = symbol;
                def.resConfig  = resConfig;
            }

            this._content = new egret.SwfMovie(resConfig,'');//舞台对象
            //console.log(this._applicationDomain.defNames);
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        }

        public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        {
            this.addEventListener(type,listener,null,useCapture,priority);
        }

    }
}