require("./../../tools/com/requirecom");

var list = (new File("./src")).readFilesWidthEnd("*");
for(var i = 0; i < list.length; i++) {
    var file = list[i];
    console.log(i+1,"/",list.length,file.url);
    var decoder = new PNGDecoder();
    var buffer = file.readContent("binary", "Buffer");

    console.log(buffer);
    var data = decoder.decode(buffer);
    //try {
    //} catch(e) {
    //    console.log("Error",e,file.url);
    //    continue;
    //}
    //if(data.colors == null) {
    //    console.log("Error no data ",file.url);
    //    continue;
    //}

    //TODO 处理颜色
    /*var colors = data.colors;
    for(var y = 0; y < colors.length; y++) {
        for(var x = 0; x < colors.length; x++) {
            var a = (colors[y][x]/(256*256*256))&0xFF;
            if(a == 0) {
                colors[y][x] = 0xff000000;
            }
        }
    }*/


    var encoder = new PNGEncoder();
    encoder.encode(
        data.colors,
        3
    );
    var buffer = new Buffer(encoder.getData());
    file = new File(file.url.replace("src","out"));
    file.save(buffer, "binary");
}