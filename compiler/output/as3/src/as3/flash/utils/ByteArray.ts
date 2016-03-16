/**
 * Created by huitao on 5/6/2015.
 */

module as3
{
    export class ByteArray extends egret.ByteArray
    {
        //[static] 指示用于新 ByteArray 实例的 ByteArray 类的默认对象编码。  ByteArray
        static defaultObjectEncoding : number

        //用于确定在写入或读取 ByteArray 实例时应使用 ActionScript 3.0、ActionScript 2.0 还是 ActionScript 1.0 格式。  ByteArray
        public objectEncoding : number

        constructor()
        {
            super();
        }

        /**
         *  使用 zlib 压缩方法压缩字节数组。  ByteArray
         */
        public compress():void
        {
        }

        /**
         * 从字节数组中读取一个以 AMF 序列化格式进行编码的对象。 ByteArray
         */
        public readObject():any
        {
        }

        /**
         * @todo 没有实现
         * @param length
         * @param charSet
         * @returns {string}
         */
        public readMultiByte(length:number, charSet?:string):string
        {
            return "";
        }

        /**
         * 解压缩字节数组。
         */
        public uncompress():void
        {

        }

        /**
         * 使用指定的字符集将多字节字符串写入字节流。 ByteArray
         * @param value
         * @param charSet
         */
        public writeMultiByte(value:string, charSet:string):void
        {
        }

        /**
         * 将对象以 AMF 序列化格式写入字节数组。 ByteArray
         * @param object
         */
        public writeObject(object:any):void
        {
        }
    }
}