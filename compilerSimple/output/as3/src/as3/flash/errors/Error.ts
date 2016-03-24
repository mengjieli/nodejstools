/**
 * Created by huitao on 2015/5/13.
 */
module as3
{
    export class Error
    {


        private _message : string = "";
        public get message():string
        {
            return this._message;
        }

        public name : string = "";

        private _errorID:number = 0;
        public get errorId():number
        {
            return this._errorID;
        }
        constructor(message?:string, id?:number)
        {
            this._message = message != undefined ? message : "";
            this._errorID = id != undefined ? id : 0 ;
        }

        public getStackTrace():string
        {
            return "暂时没有提供错误调用堆栈...";
        }

        public toString():string
        {
            return "没事有实现";
        }

    }
}
