require("./../tools/com/requirecom");

var zlib = require("zlib");

var PNGEncoder = (function (_super) {
    __extends(PNGEncoder, _super);

    /**
     * @param bytes 数组
     * @constructor
     */
    function PNGEncoder() {
        _super.call(this);
        this.initializeCRCTable();
        this.data = {};
    }

    var d = __define, c = PNGEncoder;
    var p = c.prototype;

    p.encode = function (colors, colorType, plte, trns) {
        this.position = 0;
        this.length = 0;
        this.writeHead();
        this.writeContent({
            "colors": colors,
            "width": colors[0].length,
            "height": colors.length,
            "colorType": colorType,
            "plte": plte,
            "trns": trns
        });
    }

    /**
     * 读取 png 的开头，开头总是 0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A
     */
    p.writeHead = function () {
        var head = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        for (var i = 0; i < head.length; i++) {
            this.writeByte(head[i]);
        }
    }

    /**
     * 读取数据块内容
     */
    p.writeContent = function (data) {
        var i = 0;
        this.writeTrunk("IHDR", this.getIHDR(data));
        if (data.plte) {
            this.writeTrunk("PLTE", this.getPLTE(data));
        }
        if (data.trns) {
            this.writeTrunk("tRNS", this.gettRNS(data));
        }
        this.writeTrunk("IDAT", this.getIDAT(data));
        this.writeTrunk("IEND");
    }

    p.initializeCRCTable = function () {
        this.crcTable = [];

        for (var n = 0; n < 256; n++) {
            var c = n;
            for (var k = 0; k < 8; k++) {
                if (c & 1)
                    c = ((0xedb88320) ^ (c >>> 1));
                else
                    c = (c >>> 1);
            }
            if (c < 0) {
                c = Math.pow(2, 32) + c;
            }
            this.crcTable[n] = c;
        }
    }

    p.writeTrunk = function (name, data) {
        //写入长度
        var len = 0;
        if (data) {
            len = data.length;
        }
        this.writeUnsignedInt(len);

        //写入类型
        var typePos = this.position;
        this.writeUTFBytes(name);

        //写入data
        if (data) {
            this.writeArray(data);
        }

        var crcPos = this.position;
        this.position = typePos;
        var crc = 0xFFFFFFFF;
        for (var i = typePos; i < crcPos; i++) {
            var val1 = crc ^ this.readByte();
            if (val1 < 0) {
                val1 = Math.pow(2, 32) + val1;
            }
            val1 = this.crcTable[val1 % 256];
            var val2 = Math.floor(crc / 256);
            crc = val1 ^ val2;
            if (crc < 0) {
                crc = Math.pow(2, 32) + crc;
            }
        }
        crc = crc ^ 0xFFFFFFFF;
        if (crc < 0) {
            crc = Math.pow(2, 32) + crc;
        }
        this.position = crcPos;
        this.writeUnsignedInt(crc);
    }

    p.getIHDR = function (data) {
        var bytes = new ByteArray();
        bytes.writeInt(data.width);
        bytes.writeInt(data.height);
        bytes.writeByte(8); // bit depth per channel
        bytes.writeByte(data.colorType); // color type: RGBA
        bytes.writeByte(0); // compression method
        bytes.writeByte(0); // filter method
        bytes.writeByte(0); // interlace method
        return bytes.getData();
    }

    p.getPLTE = function (data) {
        var plte = data.plte;
        var bytes = new ByteArray();
        for (var i = 0; i < plte.length; i++) {
            var color = plte[i];
            bytes.writeByte(color >> 16);
            bytes.writeByte(color >> 8 & 0xFF);
            bytes.writeByte(color & 0xFF);
        }
        return bytes.getData();
    }

    p.gettRNS = function (data) {
        var bytes = new ByteArray();
        var trns = data.trns;
        switch (data.colorType) {
            case 3:
                for (var i = 0; i < trns.length; i++) {
                    bytes.writeByte(trns[i]);
                }
                break;
        }
        return bytes.getData();
    }

    p.getIDAT = function (data) {
        var IDAT = new ByteArray();
        var width = data.width;
        var height = data.height;
        var transparent = data.transparent;
        for (var y = 0; y < height; y++) {
            IDAT.writeByte(0); //no filter
            var x;
            var pixel;
            switch (data.colorType) {
                case 0:
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        var r = pixel >> 16 & 0xFF;
                        var g = pixel >> 8 & 0xFF;
                        var b = pixel & 0xFF;
                        var gray = Math.floor(r * 0.3086 + g * 0.6094 + b * 0.082);
                        IDAT.writeByte(gray);
                    }
                    break;
                case 2:
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        var r = pixel >> 16 & 0xFF;
                        var g = pixel >> 8 & 0xFF;
                        var b = pixel & 0xFF;
                        IDAT.writeByte(r);
                        IDAT.writeByte(g);
                        IDAT.writeByte(b);
                    }
                    break;
                case 3: //索引颜色模式，写入索引值
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        var r = pixel >> 16 & 0xFF;
                        var g = pixel >> 8 & 0xFF;
                        var b = pixel & 0xFF;
                        IDAT.writeByte(0);
                    }
                    break;
                case 4:
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        var a = pixel >> 24;
                        var r = pixel >> 16 & 0xFF;
                        var g = pixel >> 8 & 0xFF;
                        var b = pixel & 0xFF;
                        var gray = Math.floor(r * 0.3086 + g * 0.6094 + b * 0.082);
                        IDAT.writeByte(gray);
                        IDAT.writeByte(a);
                    }
                    break;
                case 6:
                    for (x = 0; x < width; x++) {
                        pixel = data.colors[y][x];
                        var a = pixel >> 24;
                        var r = pixel >> 16 & 0xFF;
                        var g = pixel >> 8 & 0xFF;
                        var b = pixel & 0xFF;
                        IDAT.writeByte(r);
                        IDAT.writeByte(g);
                        IDAT.writeByte(b);
                        IDAT.writeByte(a);
                    }
                    break;
            }
        }
        var buffer = new Buffer(IDAT.getData());
        buffer = zlib.deflateSync(buffer);
        var array = [];
        for (var i = 0; i < buffer.length; i++) {
            array[i] = buffer[i];
        }
        return array;
    }

    p.error = function (tip) {
        throw "[PNGEncoder Error]" + tip;
    }

    return PNGEncoder;
})
(ByteArray);

global.PNGEncoder = PNGEncoder;

/*var file = new File("save.png");
 var content = file.readContent("binary", "Array");
 var str = "";
 for (var i = 0; i < content.length; i++) {
 str += NumberDo.to16(content[i],2) + (i&&(i+1)%16==0?"\n":" ");
 }
 console.log(str);
 var data = (new PNGDecoder()).decode(content);
 console.log(data);*/

/*var list = [0x78, 0xDA, 0x63, 0xF8, 0x0F, 0x04, 0x0C, 0x0C, 0x0C, 0xFF, 0x19, 0x1A, 0x1A, 0x1A, 0x40, 0x0C, 0x06, 0x00, 0x57, 0x45, 0x07, 0x7B];
 var list = [0x78, 0xDA, 0x63, 0xF8, 0x0F, 0x04, 0x0C, 0x0C, 0x0C, 0xFF, 0x19, 0x1A, 0x1A, 0x1A, 0x40, 0x0C, 0x06, 0x00, 0x57, 0x45, 0x07, 0x7B];
 var buffer = new Buffer(list);
 console.log(buffer);
 buffer = zlib.unzipSync(buffer);
 console.log(buffer);
 buffer = zlib.gzipSync(buffer);
 console.log(buffer);
 buffer = zlib.unzipSync(buffer);
 console.log(buffer);

 return;*/

//for (var key in zlib) {
//    console.log(key);
//}

///*
var encoder = new PNGEncoder();
 encoder.encode(
 [[0xFFFFFFFF, 0xFFFF0000],
 [0xFF00FF00, 0xFF0000FF]],
 6
 );
 var buffer = new Buffer(encoder.getData());
 file = new File("a.png");
 file.save(buffer, "binary");
 //console.log(buffer);
 var str = "";
 for (var i = 0; i < buffer.length; i++) {
 str += NumberDo.to16(buffer[i],2) + (i&&(i+1)%16==0?"\n":" ");
 }
 console.log(str);
 //*/

/*
 Zlib
 Z_NO_FLUSH
 Z_PARTIAL_FLUSH
 Z_SYNC_FLUSH
 Z_FULL_FLUSH
 Z_FINISH
 Z_BLOCK
 Z_OK
 Z_STREAM_END
 Z_NEED_DICT
 Z_ERRNO
 Z_STREAM_ERROR
 Z_DATA_ERROR
 Z_MEM_ERROR
 Z_BUF_ERROR
 Z_VERSION_ERROR
 Z_NO_COMPRESSION
 Z_BEST_SPEED
 Z_BEST_COMPRESSION
 Z_DEFAULT_COMPRESSION
 Z_FILTERED
 Z_HUFFMAN_ONLY
 Z_RLE
 Z_FIXED
 Z_DEFAULT_STRATEGY
 ZLIB_VERNUM
 ZLIB_VERSION

 windowBits
 Z_MIN_WINDOWBITS
 Z_MAX_WINDOWBITS
 Z_DEFAULT_WINDOWBITS

 chunkSize
 Z_MIN_CHUNK
 Z_MAX_CHUNK
 Z_DEFAULT_CHUNK

 memlevel
 Z_MIN_MEMLEVEL
 Z_MAX_MEMLEVEL
 Z_DEFAULT_MEMLEVEL


 level
 Z_MIN_LEVEL
 Z_MAX_LEVEL
 Z_DEFAULT_LEVEL
 */

//<Buffer 1f 8b 08 00 00 00 00 00 00 03 63 00 00 8d ef 02 d2 01 00 00 00>
//<Buffer 1f 8b 08 00 00 00 00 00 00 03 03 00 00 00 00 00 00 00 00 00>



var list = [0x00];
//var list = [0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0xFF];
var buffer = new Buffer("");
//console.log(buffer);
console.log(zlib.deflateSync(buffer));
return;
buffer = new Buffer([0x78,0xDA,0x63,0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0xFF]);
console.log(zlib.gzipSync(buffer));

//buffer = new Buffer([0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0xFF]);
//console.log(zlib.gzipSync(buffer));
//return;

/*console.log(buffer);
 buffer = new Buffer([0x78,0xDA,0x63,0xF8,0x0F,0x02,0x0C,0x0C,0x60,0x04,0x22,0xFE,0x03,0x00,0x63,0xAE,0x09,0xF7]);
 console.log(buffer);
 buffer = zlib.unzipSync(buffer);
 console.log(buffer);*/