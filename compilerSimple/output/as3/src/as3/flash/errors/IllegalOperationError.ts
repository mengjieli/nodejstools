/**
 * Created by mengj_000 on 2015/5/3.
 */

module as3
{
    export class IllegalOperationError extends as3.Error
    {
        public constructor(msg?:string,id?:number)
        {
            super(msg,id);
            this.name = "IllegalOperationError";
        }
    }
}