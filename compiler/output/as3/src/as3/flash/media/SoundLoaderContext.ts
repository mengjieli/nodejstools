/**
 * Created by huitao on 5/6/2015.
 */
module as3
{
    export class SoundLoaderContext
    {
        /**
         * 在开始传输声音流之前，将其预加载到缓冲区中所用的秒数。
         * @type {number}
         */
        public bufferTime : number = 1000;

        /**
         * 指定 Flash Player 是否应在开始加载声音之前，尝试从所加载声音的服务器下载跨域策略文件。
         * @type {boolean}
         */
        public checkPolicyFile : boolean = false;

        constructor(bufferTime:number = 1000, checkPolicyFile:boolean = false)
        {
            this.bufferTime = bufferTime;
            this.checkPolicyFile = checkPolicyFile;
        }
    }
}