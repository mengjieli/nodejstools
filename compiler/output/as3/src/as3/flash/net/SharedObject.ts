/**
 * Created by huitao on 2015/5/25.
 */
module as3
{
    /**
     * 使用本地缓存 修改，添加都必须flush
     */
    export class SharedObject{

        //static _self:SharedObject = null;

        public static shareds:Object = null;

        public client:Object;

        private _data:Object;

        private _lname:string;

        public set lname(val:string)
        {
            this._lname = val;
        }
        public get lname():string
        {
            return this._lname;
        }

        public get data():Object {
            return this._data;
        }

        static deaultObjectEncoding:number;

        private _fps:number;
        public set fps(_val:number) {
            this._fps = _val;
        }

        private _objectEncoding:number;
        public get objectEncoding():number {
            return this._objectEncoding;
        }

        public set objectEncoding(_val:number) {
            this._objectEncoding = _val;
        }

        constructor() {
            if(SharedObject.shareds == null)
            {
                SharedObject.shareds = new Object();
            }

            this._data = new Object();
        }

        /**
         * 没有实现
         */
        public close():void {
            //this.clear()

        }

        public clear():void
        {
            egret.localStorage.removeItem(this.lname);
            delete SharedObject.shareds[this.lname];
        }

        /**
         * 没有实现
         * @param myConnection
         * @param params
         */
        public connect(myConnection:NetConnection, params:string):void {

        }


        public flush(minDiskSpace:number = 0) {
            for (var prop in this._data) {
                console.log("myObject."+prop+" = "+this._data[prop]);
                //this.setItem(prop,this._data[prop])
                //egret.localStorage.setItem(prop,this._data[prop]);
            }
            egret.localStorage.setItem(this.lname,JSON.stringify(this._data));
            console.log(JSON.stringify(this._data) + "完成")
        }

        public static getLocal(name:string, localPath:string = null, secure:boolean = false):SharedObject {

            var shared:as3.SharedObject ;

            if(SharedObject.shareds == null)
            {
                SharedObject.shareds = new Object();
            }

            if(SharedObject.shareds[name] == undefined || SharedObject.shareds[name] == null)
            {
                SharedObject.shareds[name] = new as3.SharedObject();
            }

            shared = SharedObject.shareds[name];

            var stor:string = egret.localStorage.getItem(name);

            if (stor != null && stor != undefined)
            {
                var obj:Object = JSON.parse(stor);

                for (var prop in obj) {
                    console.log("obj."+prop+" = "+obj[prop]);
                    shared.data[prop] = obj[prop];
                }
            }

            shared.lname = name;
            return shared;
        }


        public static getRemote(name:string, remotePath:string = null, persistence:Object = null, secure:boolean = false):void
        {

        }

        public send(...arg):void
        {

        }

        public setDirty(propertyName:string):void
        {

        }

        public setProperty(propertyName:string,value:Object= null):void
        {

        }
    }
}
