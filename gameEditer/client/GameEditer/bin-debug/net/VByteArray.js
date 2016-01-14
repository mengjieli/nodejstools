/**
 *
 * @author
 *
 */
var VByteArray = (function () {
    function VByteArray(big) {
        if (big === void 0) { big = true; }
        if (!VByteArray.bytesTmp) {
            VByteArray.bytesTmp = new egret.ByteArray();
        }
        this.bytes = [];
        this.big = big;
        this.position = 0;
        this.length = 0;
    }
    var d = __define,c=VByteArray;p=c.prototype;
    /**
     * 从原生字节流中读取数据
     */
    p.readFromByteArray = function (bytes) {
        this.bytes.length = 0;
        this.position = 0;
        this.length = 0;
        while (bytes.bytesAvailable) {
            this.bytes.push(bytes.readByte());
        }
    };
    /**
     * 把数据写到原生字节流中
     */
    p.writeToByteArray = function (bytes) {
        for (var i = 0; i < this.bytes.length; i++) {
            bytes.writeByte(this.bytes[i]);
        }
    };
    p.writeIntV = function (val) {
        if (val >= 0) {
            val *= 2;
        }
        else {
            val = ~val;
            val *= 2;
            val++;
        }
        this.writeUIntV(val);
    };
    p.writeUIntV = function (val) {
        var flag = false;
        val = val < 0 ? -val : val;
        var val2 = 0;
        if (val >= 0x10000000) {
            val2 = val / 0x10000000;
            val = val & 0xFFFFFFF;
            flag = true;
        }
        if (flag || val >> 7) {
            this.bytes.splice(this.position, 0, 0x80 | val & 0x7F);
            this.position++;
            this.length++;
        }
        else {
            this.bytes.splice(this.position, 0, val & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag || val >> 14) {
            this.bytes.splice(this.position, 0, 0x80 | (val >> 7) & 0x7F);
            this.position++;
            this.length++;
        }
        else if (val >> 7) {
            this.bytes.splice(this.position, 0, (val >> 7) & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag || val >> 21) {
            this.bytes.splice(this.position, 0, 0x80 | (val >> 14) & 0x7F);
            this.position++;
            this.length++;
        }
        else if (val >> 14) {
            this.bytes.splice(this.position, 0, (val >> 14) & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag || val >> 28) {
            this.bytes.splice(this.position, 0, 0x80 | (val >> 21) & 0x7F);
            this.position++;
            this.length++;
        }
        else if (val >> 21) {
            this.bytes.splice(this.position, 0, (val >> 21) & 0x7F);
            this.position++;
            this.length++;
        }
        if (flag) {
            this.writeUIntV(Math.floor(val2));
        }
        ;
    };
    p.writeInt = function (val) {
        var flag = val >= 0 ? true : false;
        val = val >= 0 ? val : (2147483648 + val);
        val = val & 0xFFFFFFFF;
        var big = this.big;
        var bytes = this.bytes;
        if (big) {
            bytes.splice(this.position, 0, (!flag ? 128 : 0) + (val >> 24));
            bytes.splice(this.position, 0, val >> 16 & 0xFF);
            bytes.splice(this.position, 0, val >> 8 & 0xFF);
            bytes.splice(this.position, 0, val & 0xFF);
        }
        else {
            bytes.splice(this.position, 0, val & 0xFF);
            bytes.splice(this.position, 0, val >> 8 & 0xFF);
            bytes.splice(this.position, 0, val >> 16 & 0xFF);
            bytes.splice(this.position, 0, (!flag ? 128 : 0) + (val >> 24));
        }
        this.length += 4;
        this.position += 4;
    };
    p.writeInt64 = function (val) {
        var flag = val >= 0 ? true : false;
        val = val >= 0 ? val : (9223372036854776001 + val);
        val = val & 0xFFFFFFFF;
        var big = this.big;
        var bytes = this.bytes;
        if (big) {
            bytes.splice(this.position, 0, (!flag ? 128 : 0) + (val >> 56));
            bytes.splice(this.position, 0, val >> 48 & 0xFF);
            bytes.splice(this.position, 0, val >> 40 & 0xFF);
            bytes.splice(this.position, 0, val >> 32 & 0xFF);
            bytes.splice(this.position, 0, val >> 24 & 0xFF);
            bytes.splice(this.position, 0, val >> 16 & 0xFF);
            bytes.splice(this.position, 0, val >> 8 & 0xFF);
            bytes.splice(this.position, 0, val & 0xFF);
        }
        else {
            bytes.splice(this.position, 0, val & 0xFF);
            bytes.splice(this.position, 0, val >> 8 & 0xFF);
            bytes.splice(this.position, 0, val >> 16 & 0xFF);
            bytes.splice(this.position, 0, val >> 24 & 0xFF);
            bytes.splice(this.position, 0, val >> 32 & 0xFF);
            bytes.splice(this.position, 0, val >> 40 & 0xFF);
            bytes.splice(this.position, 0, val >> 48 & 0xFF);
            bytes.splice(this.position, 0, (!flag ? 128 : 0) + (val >> 56));
        }
        this.length += 8;
        this.position += 8;
    };
    p.writeByte = function (val) {
        this.bytes.splice(this.position, 0, val);
        this.length += 1;
        this.position += 1;
    };
    p.writeboolean = function (val) {
        this.bytes.splice(this.position, 0, val == true ? 1 : 0);
        this.length += 1;
        this.position += 1;
    };
    p.writeUnsignedInt = function (val) {
        var bytes = this.bytes;
        if (this.big) {
            bytes.splice(this.position, 0, val >> 24);
            bytes.splice(this.position, 0, val >> 16 & 0xFF);
            bytes.splice(this.position, 0, val >> 8 & 0xFF);
            bytes.splice(this.position, 0, val & 0xFF);
        }
        else {
            bytes.splice(this.position, 0, val & 0xFF);
            bytes.splice(this.position, 0, val >> 8 & 0xFF);
            bytes.splice(this.position, 0, val >> 16 & 0xFF);
            bytes.splice(this.position, 0, val >> 24);
        }
        this.length += 4;
        this.position += 4;
    };
    p.writeShort = function (val) {
        val = val & 0xFFFF;
        var bytes = this.bytes;
        if (this.big) {
            bytes.splice(this.position, 0, val >> 8 & 0xFF);
            bytes.splice(this.position, 0, val & 0xFF);
        }
        else {
            bytes.splice(this.position, 0, val & 0xFF);
            bytes.splice(this.position, 0, val >> 8 & 0xFF);
        }
        this.length += 2;
        this.position += 2;
    };
    p.writeUnsignedShort = function (val) {
        val = val & 0xFFFF;
        if (this.big) {
            this.bytes.splice(this.position, 0, val >> 8 & 0xFF);
            this.bytes.splice(this.position, 0, val & 0xFF);
        }
        else {
            this.bytes.splice(this.position, 0, val & 0xFF);
            this.bytes.splice(this.position, 0, val >> 8 & 0xFF);
        }
        this.length += 2;
        this.position += 2;
    };
    p.writeUTF = function (val) {
        var arr = VByteArray.stringToBytes(val);
        this.writeShort(arr.length);
        for (var i = 0; i < arr.length; i++) {
            this.bytes.splice(this.position, 0, arr[i]);
            this.position++;
        }
        this.length += arr.length;
    };
    p.writeUTFV = function (val) {
        var arr = VByteArray.stringToBytes(val);
        this.writeUIntV(arr.length);
        for (var i = 0; i < arr.length; i++) {
            this.bytes.splice(this.position, 0, arr[i]);
            this.position++;
        }
        this.length += arr.length;
    };
    p.writeUTFBytes = function (val, len) {
        var arr = VByteArray.stringToBytes(val);
        for (var i = 0; i < len; i++) {
            if (i < arr.length)
                this.bytes.splice(this.position, 0, arr[i]);
            else
                this.bytes.splice(this.position, 0, 0);
            this.position++;
        }
        this.length += len;
    };
    p.writeBytes = function (b, start, len) {
        if (start === void 0) { start = 0; }
        if (len === void 0) { len = 0; }
        /*var copy = b.getData();
        for(var i = start;i < copy.length && i < start + len;i++) {
            this.bytes.splice(this.position,0,copy[i]);
            this.position++;
        }*/
        this.length += len;
    };
    p.readBoolean = function () {
        var val = this.bytes[this.position] == 0 ? false : true;
        this.position += 1;
        return val;
    };
    p.readIntV = function () {
        var val = this.readUIntV();
        if (val % 2 == 1) {
            val = Math.floor(val / 2);
            val = ~val;
        }
        else {
            val = Math.floor(val / 2);
        }
        return val;
    };
    p.readUIntV = function () {
        var val = 0;
        val += this.bytes[this.position] & 0x7F;
        if (this.bytes[this.position] >> 7) {
            this.position++;
            val += (this.bytes[this.position] & 0x7F) << 7;
            if (this.bytes[this.position] >> 7) {
                this.position++;
                val += (this.bytes[this.position] & 0x7F) << 14;
                if (this.bytes[this.position] >> 7) {
                    this.position++;
                    val += (this.bytes[this.position] & 0x7F) << 21;
                    if (this.bytes[this.position] >> 7) {
                        this.position++;
                        val += ((this.bytes[this.position] & 0x7F) << 24) * 16;
                        if (this.bytes[this.position] >> 7) {
                            this.position++;
                            val += ((this.bytes[this.position] & 0x7F) << 24) * 0x800;
                            if (this.bytes[this.position] >> 7) {
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
    };
    p.readInt = function () {
        var val = 0;
        var bytes = this.bytes;
        if (this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8 | bytes[this.position + 2] << 16 | bytes[this.position + 3] << 24;
        }
        else {
            val = bytes[this.position + 3] | bytes[this.position + 2] << 8 | bytes[this.position + 1] << 16 | bytes[this.position] << 24;
        }
        //if(val > (1<<31)) val = val - (1<<32);
        this.position += 4;
        return val;
    };
    p.readInt64 = function () {
        var val = 0;
        var bytes = this.bytes;
        if (this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8 | bytes[this.position + 2] << 16 | bytes[this.position + 3] << 24 | bytes[this.position + 4] << 32 | bytes[this.position + 5] << 40 | bytes[this.position + 6] << 48 | bytes[this.position + 7] << 56;
        }
        else {
            val = bytes[this.position + 7] | bytes[this.position + 6] << 8 | bytes[this.position + 5] << 16 | bytes[this.position + 4] << 24 | bytes[this.position + 3] << 32 | bytes[this.position + 2] << 40 | bytes[this.position + 1] << 48 | bytes[this.position] << 56;
        }
        //if(val > (1<<31)) val = val - (1<<32);
        this.position += 8;
        return val;
    };
    p.readUnsignedInt = function () {
        var val = 0;
        var bytes = this.bytes;
        if (this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8 | bytes[this.position + 2] << 16 | bytes[this.position + 3] << 24;
        }
        else {
            val = bytes[this.position + 3] | bytes[this.position + 2] << 8 | bytes[this.position + 1] << 16 | bytes[this.position] << 24;
        }
        this.position += 4;
        return val;
    };
    p.readByte = function () {
        var val = this.bytes[this.position];
        this.position += 1;
        return val;
    };
    p.readShort = function () {
        var val;
        var bytes = this.bytes;
        if (this.big) {
            val = bytes[this.position] | bytes[this.position + 1] << 8;
        }
        else {
            val = bytes[this.position] << 8 | bytes[this.position + 1];
        }
        if (val > (1 << 15))
            val = val - (1 << 16);
        this.position += 2;
        return val;
    };
    p.readUnsignedShort = function () {
        var val;
        if (this.big) {
            val = this.bytes[this.position] | this.bytes[this.position + 1] << 8;
        }
        else {
            val = this.bytes[this.position] << 8 | this.bytes[this.position + 1];
        }
        if (val > (1 << 15))
            val = val - (1 << 16);
        this.position += 2;
        return val;
    };
    p.readUTF = function () {
        var len = this.readShort();
        var val = VByteArray.bytesToString(this.bytes.slice(this.position, this.position + len));
        this.position += len;
        return val;
    };
    p.readUTFV = function () {
        var len = this.readUIntV();
        if (len == 0)
            return "";
        var val = VByteArray.bytesToString(this.bytes.slice(this.position, this.position + len));
        this.position += len;
        return val;
    };
    p.readUTFBytes = function (len) {
        var val = VByteArray.bytesToString(this.bytes.slice(this.position, this.position + len));
        this.position += len;
        return val;
    };
    p.bytesAvailable = function () {
        return this.length - this.position;
    };
    p.toString = function () {
        var str = "";
        for (var i = 0; i < this.bytes.length; i++) {
            str += this.bytes[i] + (i < this.bytes.length - 1 ? "," : "");
        }
        return str;
    };
    VByteArray.stringToBytes = function (val) {
        var res = [];
        var tmp = VByteArray.bytesTmp;
        tmp.position = 0;
        tmp.length = 0;
        tmp.writeUTFBytes(val);
        tmp.position = 0;
        for (var i = 0; i < tmp.length; i++) {
            res.push(tmp.readByte());
        }
        return res;
    };
    VByteArray.bytesToString = function (bytes) {
        var tmp = VByteArray.bytesTmp;
        tmp.position = 0;
        tmp.length = 0;
        for (var i = 0; i < bytes.length; i++) {
            tmp.writeByte(bytes[i]);
        }
        tmp.position = 0;
        return tmp.readUTFBytes(tmp.bytesAvailable);
    };
    return VByteArray;
})();
egret.registerClass(VByteArray,"VByteArray");
