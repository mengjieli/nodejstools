/**
 * Created by huitao on 5/6/2015.
 */
module as3
{
    export class SoundChannel extends egret.EventDispatcher
    {
        //[read-only] 左声道的当前幅度（音量），范围从 0（静音）至 1（最大幅度）。 SoundChannel
        private _leftPeak : number;
        public get leftPeak():number
        {
            return this._leftPeak;
        }

        private _position : number;
        public get position():number
        {
            return this._position;
        }

        private _rightPeak : number;
        public get rightPeak():number
        {
            return this._rightPeak;
        }

        /**分配给该声道的 SoundTransform 对象。*/
        private _soundTransform : SoundTransform;
        public get soundTransform():SoundTransform
        {
            return this._soundTransform;
        }

        public set soundTransform(_value:SoundTransform)
        {
            if(this._sound != null)
            {
                this._sound.setVolume(_value.volume)
            }
        }
        private _sound:egret.Sound;

        constructor(_s?:egret.Sound)
        {
            super();
            this._sound = _s;
        }

        private scompleteFun(es:Event):void
        {
            this.dispatchEvent(es)
        }


        public stop():void
        {
            if(this._sound != null)
            {
                this._sound.pause();
            }
        }


    }
}