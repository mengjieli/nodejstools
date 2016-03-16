/**
 * Created by huitao on 5/6/2015.
 */
module as3
{
    export class ID3Info
    {
        /**
         *  专辑的名称；对应于 ID3 2.0 标签 TALB。
         */
        public album : string;

        /**
         * 歌手的姓名；对应于 ID3 2.0 标签 TPE1。
         */
        public artist : string;

        /**
         * 录制的相关注解；对应于 ID3 2.0 标签 COMM。
         */
        public comment : string;


        /**
         * 歌曲的流派；对应于 ID3 2.0 标签 TCON。
         */
        public genre : string;


        /**
         * 歌曲的名称；对应于 ID3 2.0 标签 TIT2。
         */
        public songName : string;


        /**
         * 曲目编号；对应于 ID3 2.0 标签 TRCK。
         */
        public track : string;

        /**
         * 录制的年份；对应于 ID3 2.0 标签 TYER。
         */
        public year : string;

        constructor()
        {

        }
    }

}