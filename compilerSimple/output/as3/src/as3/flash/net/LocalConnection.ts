/**
 * Created by huitao on 2015/5/14.
 */
module as3
{
    export class LocalConnection extends egret.EventDispatcher
    {
        private _client:Object;
        public get client():Object
        {
            return this._client;
        }

        private _domain:string="localhost";
        public get domain():string
        {
            return this._domain;
        }
        constructor(target?: any)
        {
            super(target);
        }

        public allowDomain(... domains):void
        {

        }

        public allowInsecureDomain(... domains):void
        {

        }

        public close():void
        {

        }

        public connect(connectionName:String):void
        {

        }

        public send(connectionName:String, methodName:String, ... arguments):void
        {

        }
        //在使用 connect(connectionName) 方法打开的连接（接收方 LocalConnection 对象）上调用名为 methodName 的方法。

    }
}
