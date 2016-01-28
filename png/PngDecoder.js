require("./../tools/com/requirecom");



//var decode = new PNGDecoder();
//var file = new File("a.png");
//var buffer = file.readContent("binary", "Buffer");
//decode.decode(buffer);

var png = new File("2.png");
var decoder = new PNGDecoder();
var buffer = png.readContent("binary", "Buffer");
var data = decoder.decode(buffer);

//for(var y = 0; y < data.colors.length; y++) {
//    for(var x = 0; x < data.colors[y].length; x++) {
//        console.log(x,y,NumberDo.to16(data.colors[y][x],8));
//    }
//}

var encoder = new PNGEncoder();

encoder.encode(
    data.colors,
    3
);

//encoder.encode(
//    [[0xFFFFFFFF, 0XFF000000],
//        [0xFF808080, 0x000000]],
//    3
//);

//encoder.encode(
//    [[0xFFFFFFFF, 0xFFFF0000, 0x66FF0000],
//        [0x6600FF00, 0x660000FF, 0xFF00FF00]],
//    3
//);


var buffer = new Buffer(encoder.getData());
var index = 0;
file = new File("a" + index + ".png");
while (file.isExist()) {
    index++;
    file = new File("a" + index + ".png");
}
file = new File("a" + index + ".png");
file.save(buffer, "binary");
//var str = "";
//for (var i = 0; i < buffer.length; i++) {
//    str += NumberDo.to16(buffer[i], 2) + (i && (i + 1) % 16 == 0 ? "\n" : " ");
//}
//console.log(str);


//var cubic = {
//    r:32,
//    g:64,
//    b:96,
//    count:2
//};
//var lenCount = Math.ceil(Math.pow(cubic.count, 1 / 3));
//var len = Math.floor(32 / lenCount);
//var smallCubicList = [];
//var more = 32 - lenCount * len;
//more = 32 - (lenCount - more) * len;
//for (var r = cubic.r; r < cubic.r + 32;) {
//    for(var g = cubic.g; g < cubic.g + 32;) {
//        for(var b = cubic.b; b < cubic.b + 32;) {
//            console.log(r,g,b);
//            b += len;
//            if (b < cubic.b + more) {
//                b += 1;
//            }
//        }
//        g += len;
//        if (g < cubic.g + more) {
//            g += 1;
//        }
//    }
//    r += len;
//    if (r < cubic.r + more) {
//        r += 1;
//    }
//}