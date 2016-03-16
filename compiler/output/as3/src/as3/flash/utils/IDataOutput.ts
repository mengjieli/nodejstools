/**
 * Created by huitao on 2015/5/15.
 */
module as3
{
    export interface IDataOutput
    {

        writeBoolean(value:boolean):void;

        writeByte(value:number):void;

        writeBytes(bytes:as3.ByteArray, offset:number = 0, length:number = 0):void;

        writeDouble(value:number):void;

        writeFloat(value:number):void;

        writeInt(value:number):void;

        writeMultiByte(value:string, charSet:string):void;

        writeObject(object:any):void;

        writeShort(value:number):void;

        writeUnsignedInt(value:number):void;

        writeUTF(value:string):void;

        writeUTFBytes(value:string):void;

    }
}

