/**
 * Created by huitao on 2015/5/14.
 */
module as3
{
    export class URLStream extends as3.URLLoader
    {
        //URLLoaderDataFormat.BINARY


        constructor(req?:as3.URLRequest)
        {
            super(req);

            //以二进制方式取出文件
            this.dataFormat = egret.URLLoaderDataFormat.BINARY;
        }



    }
}
