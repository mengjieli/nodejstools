/**
 * Created by huitao on 5/6/2015.
 */
module as3
{
    export class SoundTransform
    {
        /**
         * 从 0（无）至 1（全部）的值，指定了左输入在左扬声器里播放的量。
         */
        public leftToLeft : number;


        /**
         * 从 0（无）至 1（全部）的值，指定了左输入在右扬声器里播放的量。
         */
        public leftToRight : number;


        /**
         * 声音从左到右的平移，范围从 -1（左侧最大平移）至 1（右侧最大平移）。
         */
        public pan : number;

        /**
         * 从 0（无）至 1（全部）的值，指定了右输入在左扬声器里播放的量。
         */
        public rightToLeft : number;

        /**
         * 从 0（无）至 1（全部）的值，指定了右输入在右扬声器里播放的量。
         */
        public  rightToRight : number;
        /**
         * 音量范围从 0（静音）至 1（最大音量）。
         */
        public volume : number;

        constructor(vol:number = 1, panning:number = 0)
        {
            this.pan = panning;
            this.volume = vol;
        }
    }
}
