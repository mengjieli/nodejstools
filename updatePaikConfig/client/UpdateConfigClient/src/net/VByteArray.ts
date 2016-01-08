/**
 *
 * @author 
 *
 */
class VByteArray {
    
    private bytes: Array<number>;
    private big:boolean;
    public position:number;
    public length: number;
    
	public constructor(big:boolean = true) {
        if(!VByteArray.bytesTmp)
        {
            VByteArray.bytesTmp = new egret.ByteArray();
        }
        this.bytes = [];
        this.big = big;
        this.position = 0;
        this.length = 0;
	}
	
	/**
	 * 从原生字节流中读取数据
	 */ 
	public readFromByteArray(bytes:egret.ByteArray):void {
        this.bytes.length = 0;
        this.position = 0;
        this.length = 0;
        while(bytes.bytesAvailable) {
            this.bytes.push(bytes.readByte());
        }
	}
	
	/**
	 * 把数据写到原生字节流中
	 */ 
	public writeToByteArray(bytes:egret.ByteArray):void {
        for(var i = 0;i < this.bytes.length; i++) {
            bytes.writeByte(this.bytes[i]);
        }
	}
	
    public writeIntV(val:number):void
	{
        if(val >= 0) {
            val *= 2;
        }
        else {
            val = ~val;
            val *= 2;
            val++;
        }
        this.writeUIntV(val);
    }

    public writeUIntV(val: number): void {
        var flag: boolean = false;
        val = val < 0 ? -val : val;
        var val2: number = 0;
        if(val >= 0x10000000) {
            val2 = val / 0x10000000;
            val = val & 0xFFFFFFF;
            flag = true;
        }
    
        if(flag || val >> 7) //第一位
        {
            this.bytes.splice(this.position,0,0x80 | val & 0x7F);
            this.position++;
            this.length++;
        }
        else {
            this.bytes.splice(this.position,0,val & 0x7F);
            this.position++;
            this.length++;
        }
    
        if(flag || val >> 14) //第二位
        {
            this.bytes.splice(this.position,0,0x80 | (val >> 7) & 0x7F);
            this.position++;
            this.length++;
        }
        else if(val >> 7) {
            this.bytes.splice(this.position,0,(val >> 7) & 0x7F);
            this.position++;
            this.length++;
        }
    
        if(flag || val >> 21) //第三位
        {
            this.bytes.splice(this.position,0,0x80 | (val >> 14) & 0x7F);
            this.position++;
            this.length++;
        }
        else if(val >> 14) {
            this.bytes.splice(this.position,0,(val >> 14) & 0x7F);
            this.position++;
            this.length++;
        }
    
        if(flag || val >> 28) //第四位
        {
            this.bytes.splice(this.position,0,0x80 | (val >> 21) & 0x7F);
            this.position++;
            this.length++;
        }
        else if(val >> 21) {
            this.bytes.splice(this.position,0,(val >> 21) & 0x7F);
            this.position++;
            this.length++;
        }
    
        if(flag) {
            this.writeUIntV(Math.floor(val2));
        };
    }

    public writeInt(val: number): void {
        var flag: boolean = val >= 0 ? true : false;
        val = val >= 0 ? val : (2147483648 + val);
        val = val & 0xFFFFFFFF;
        var big = this.big;
        var bytes = this.bytes;
        if(big) {
            bytes.splice(this.position,0,(!flag ? 128 : 0) + (val >> 24));
            bytes.splice(this.position,0,val >> 16 & 0xFF);
            bytes.splice(this.position,0,val >> 8 & 0xFF);
            bytes.splice(this.position,0,val & 0xFF);
        }
        else {
            bytes.splice(this.position,0,val & 0xFF);
            bytes.splice(this.position,0,val >> 8 & 0xFF);
            bytes.splice(this.position,0,val >> 16 & 0xFF);
            bytes.splice(this.position,0,(!flag ? 128 : 0) + (val >> 24));
        }
        this.length += 4;
        this.position += 4;
    }

    public writeInt64(val: number): void {
        var flag: boolean = val >= 0 ? true : false;
        val = val >= 0 ? val : (9223372036854776001 + val);
        val = val & 0xFFFFFFFF;
        var big = this.big;
        var bytes = this.bytes;
        if(big) {
            bytes.splice(this.position,0,(!flag ? 128 : 0) + (val >> 56));
            bytes.splice(this.position,0,val >> 48 & 0xFF);
            bytes.splice(this.position,0,val >> 40 & 0xFF);
            bytes.splice(this.position,0,val >> 32 & 0xFF);
            bytes.splice(this.position,0,val >> 24 & 0xFF);
            bytes.splice(this.position,0,val >> 16 & 0xFF);
            bytes.splice(this.position,0,val >> 8 & 0xFF);
            bytes.splice(this.position,0,val & 0xFF);
        }
        else {
            bytes.splice(this.position,0,val & 0xFF);
            bytes.splice(this.position,0,val >> 8 & 0xFF);
            bytes.splice(this.position,0,val >> 16 & 0xFF);
            bytes.splice(this.position,0,val >> 24 & 0xFF);
            bytes.splice(this.position,0,val >> 32 & 0xFF);
            bytes.splice(this.position,0,val >> 40 & 0xFF);
            bytes.splice(this.position,0,val >> 48 & 0xFF);
            bytes.splice(this.position,0,(!flag ? 128 : 0) + (val >> 56));
        }
        this.length += 8;
        this.position += 8;
    }

    public writeByte(val: number): void {
        this.bytes.splice(this.position,0,val);
        this.length += 1;
        this.position += 1;
    }

    public writeboolean(val: boolean): void {
        this.bytes.splice(this.position,0,val == true ? 1 : 0);
        this.length += 1;
        this.position += 1;
    }

    public writeUnsignedInt(val: number): void {
        var bytes = this.bytes;
        if(this.big) {
            bytes.splice(this.position,0,val >> 24);
            bytes.splice(this.position,0,val >> 16 & 0xFF);
            bytes.splice(this.position,0,val >> 8 & 0xFF);
            bytes.splice(this.position,0,val & 0xFF);
        }
        else {
            bytes.splice(this.position,0,val & 0xFF);
            bytes.splice(this.position,0,val >> 8 & 0xFF);
            bytes.splice(this.position,0,val >> 16 & 0xFF);
            bytes.splice(this.position,0,val >> 24);
        }
        this.length += 4;
        this.position += 4;
    }

    public writeShort(val: number): void {
        val = val & 0xFFFF;
        var bytes = this.bytes;
        if(this.big) {
            bytes.splice(this.position,0,val >> 8 & 0xFF);
            bytes.splice(this.position,0,val & 0xFF);
        }
        else {
            bytes.splice(this.position,0,val & 0xFF);
            bytes.splice(this.position,0,val >> 8 & 0xFF);
        }
        this.length += 2;
        this.position += 2;
    }

    public writeUnsignedShort(val: number): void {
        val = val & 0xFFFF;
        if(this.big) {
            this.bytes.splice(this.position,0,val >> 8 & 0xFF);
            this.bytes.splice(this.position,0,val & 0xFF);
        }
        else {
            this.bytes.splice(this.position,0,val & 0xFF);
            this.bytes.splice(this.position,0,val >> 8 & 0xFF);
        }
        this.length += 2;
        this.position += 2;
    }

    public writeUTF(val: string): void {
        var arr = VByteArray.stringToBytes(val);
        this.writeShort(arr.length);
        for(var i = 0;i < arr.length;i++) {
            this.bytes.splice(this.position,0,arr[i]);
            this.position++;
        }
        this.length += arr.length;
    }

    public writeUTFV(val: string): void {
        var arr = VByteArray.stringToBytes(val);
        this.writeUIntV(arr.length);
        for(var i = 0;i < arr.length;i++) {
            this.bytes.splice(this.position,0,arr[i]);
            this.position++;
        }
        this.length += arr.length;
    }

    public writeUTFBytes(val: string,len: number): void {
        var arr = VByteArray.stringToBytes(val);
        for(var i = 0;i < len;i++) {
            if(i < arr.length) this.bytes.splice(this.position,0,arr[i]);
            else this.bytes.splice(this.position,0,0);
            this.position++;
        }
        this.length += len;
    }

    public writeBytes(b: VByteArray,start = 0,len = 0): void {
        /*var copy = b.getData();
        for(var i = start;i < copy.length && i < start + len;i++) {
            this.bytes.splice(this.position,0,copy[i]);
            this.position++;
        }*/
        this.length += len;
    }

    public readBoolean():boolean {
        var val: boolean = this.bytes[this.position] == 0 ? false : true;
        this.position += 1;
        return val;
    }

    public readIntV(): number {
        var val: number = this.readUIntV();
        if(val % 2 == 1) {
            val = Math.floor(val / 2);
            val = ~val;
        }
        else {
            val = Math.floor(val / 2);
        }
        return val;
    }

    public readUIntV(): number {
        var val: number = 0;
        val += this.bytes[this.position] & 0x7F;
        if(this.bytes[this.position] >> 7) {
            this.position++;
            val += (this.bytes[this.position] & 0x7F) << 7;
            if(this.bytes[this.position] >> 7) {
                this.position++;
                val += (this.bytes[this.position] & 0x7F) << 14;
                if(this.bytes[this.position] >> 7) {
                    this.position++;
                    val += (this.bytes[this.position] & 0x7F) << 21;
                    if(this.bytes[this.position] >> 7) {
                        this.position++;
                        val += ((this.bytes[this.position] & 0x7F) << 24) * 16;
                        if(this.bytes[this.position] >> 7) {
                            this.position++;
                            val += ((this.bytes[this.position] & 0x7F) << 24) * 0x800;
                            if(this.bytes[this.position] >> 7) {
                                this.position++;
                                val += (this.bytes[this.position] << 24) * 0x40000;
                            }
                        }
                    }
                }
            }
        }
        this.position++;
        return val;
    }

    public readInt(): number {
        var val: number = 0;
        var bytes = this.bytes;
        if(this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8 | bytes[this.position + 2] << 16 | bytes[this.position + 3] << 24;
        }
        else {
            val = bytes[this.position + 3] | bytes[this.position + 2] << 8 | bytes[this.position + 1] << 16 | bytes[this.position] << 24;
        }
        //if(val > (1<<31)) val = val - (1<<32);
        this.position += 4;
        return val;
    }

    public readInt64(): number {
        var val: number = 0;
        var bytes = this.bytes;
        if(this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8 | bytes[this.position + 2] << 16 | bytes[this.position + 3] << 24 | bytes[this.position + 4] << 32 | bytes[this.position + 5] << 40 | bytes[this.position + 6] << 48 | bytes[this.position + 7] << 56;
        }
        else {
            val = bytes[this.position + 7] | bytes[this.position + 6] << 8 | bytes[this.position + 5] << 16 | bytes[this.position + 4] << 24 | bytes[this.position + 3] << 32 | bytes[this.position + 2] << 40 | bytes[this.position + 1] << 48 | bytes[this.position] << 56;
        }
        //if(val > (1<<31)) val = val - (1<<32);
        this.position += 8;
        return val;
    }

    public readUnsignedInt(): number {
        var val: number = 0;
        var bytes = this.bytes;
        if(this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8 | bytes[this.position + 2] << 16 | bytes[this.position + 3] << 24;
        }
        else {
            val = bytes[this.position + 3] | bytes[this.position + 2] << 8 | bytes[this.position + 1] << 16 | bytes[this.position] << 24;
        }
        this.position += 4;
        return val;
    }

    public readByte(): number {
        var val: number = this.bytes[this.position];
        this.position += 1;
        return val;
    }

    public readShort(): number {
        var val: number;
        var bytes = this.bytes;
        if(this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8;
        }
        else {
            val = bytes[this.position] << 8 | bytes[this.position + 1];
        }
    
        if(val > (1 << 15)) val = val - (1 << 16);
        this.position += 2;
        return val;
    }

    public readUnsignedShort(): number {
        var val: number;
        if(this.big) {
            val = this.bytes[this.position] | this.bytes[this.position + 1] << 8;
        }
        else {
            val = this.bytes[this.position] << 8 | this.bytes[this.position + 1];
        }
    
        if(val > (1 << 15)) val = val - (1 << 16);
        this.position += 2;
        return val;
    }

    public readUTF(): string {
        var len: number = this.readShort();
        var val: string = VByteArray.bytesToString(this.bytes.slice(this.position,this.position + len));
        this.position += len;
        return val;
    }

    public readUTFV(): string {
        var len: number = this.readUIntV();
        var val: string = VByteArray.bytesToString(this.bytes.slice(this.position,this.position + len));
        this.position += len;
        return val;
    }

    public readUTFBytes(len: number): string {
        var val: string = VByteArray.bytesToString(this.bytes.slice(this.position,this.position + len));
        this.position += len;
        return val;
    }

    public bytesAvailable(): number {
        return this.length - this.position;
    }
    
    public toString():string {
        var str = "";
        for(var i = 0;i < this.bytes.length; i++) {
            str += this.bytes[i] + (i < this.bytes.length - 1 ? "," : "");
        }
        return str;
    }

    
    private static bytesTmp: egret.ByteArray;
    private static stringToBytes(val: string): Array<number> {
        var res = [];
        var tmp = VByteArray.bytesTmp;
        tmp.position = 0;
        tmp.length = 0;
        tmp.writeUTFBytes(val);
        tmp.position = 0;
        for(var i = 0;i < tmp.length;i++) {
            res.push(tmp.readByte());
        }
        return res;
    }
    
    private static bytesToString(bytes:Array<number>):string {
        var tmp = VByteArray.bytesTmp;
        tmp.position = 0;
        tmp.length = 0;
        for(var i = 0;i < bytes.length; i++) {
            tmp.writeByte(bytes[i]);
        }
        tmp.position = 0;
        return tmp.readUTFBytes(tmp.bytesAvailable);
    }
}
