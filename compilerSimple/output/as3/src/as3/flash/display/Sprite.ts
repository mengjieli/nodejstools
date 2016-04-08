/**
 * Created by huitao on 2015/5/13.
 */
module as3
{
    export class Sprite extends egret.Sprite
    {

        private _buttonMode:boolean = false;

        //没有作用
        public get buttonMode():boolean
        {
            return this._buttonMode;
            Number
        }

        //没有作用
        public set buttonMode(val:boolean)
        {
            this._buttonMode = val;
        }

        constructor()
        {
            super();
        }
        public addEventListener_as3(type: string, listener: Function, useCapture?: boolean, priority?: number,weak?:boolean): void
        {
            this.addEventListener(type,listener,null,useCapture,priority);
        }

    }

}
