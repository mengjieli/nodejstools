/**
 * Created by mengj_000 on 2015/4/27.
 */


module as3
{
    export class Loader extends egret.DisplayObjectContainer
    {
        private _contentLoaderInfo:as3.LoaderInfo = null;

        private context:as3.LoaderContext = null;

        public constructor()
        {
            super();
            this._contentLoaderInfo = new as3.LoaderInfo();
            this._contentLoaderInfo.addEventListener(egret.Event.COMPLETE,this.loadComplete,this, false, 0);
        }

        public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        {
            this.addEventListener(type,listener,null,useCapture,priority);
        }

        public loadComplete(e:egret.Event):void
        {
            this.addChild(this._contentLoaderInfo.content);
        }

        public get content()
        {
            return this._contentLoaderInfo.content;
        }

        public get contentLoaderInfo():as3.LoaderInfo
        {
            return this._contentLoaderInfo;
        }

        public loadBytes(byts:as3.ByteArray, context:LoaderContext = null):void
        {

        }

        public load(req:egret.URLRequest, context:as3.LoaderContext = null)
        {
            if(req.url.indexOf(".swf") != -1 || req.url.indexOf(".SWF") != -1)
            {
                // 加载swf资源一定要加载到新ApplicationDomain中，否则在当前域根据导出类名无法获取到类定义
                if(null == context)
                {
                    context = new as3.LoaderContext(false, new as3.ApplicationDomain());
                }
                // 一定要
                if(null == context.applicationDomain)
                {
                    context.applicationDomain = as3.ApplicationDomain.currentDomain;
                }
                this.context = context;
                this._contentLoaderInfo.applicationDomain = context.applicationDomain;
            }
            this._contentLoaderInfo.initWidthLoader(this,req);
        }
    }
}