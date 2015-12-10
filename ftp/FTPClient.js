require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");

var config = {
    "ip": "121.40.18.57",
    "user": "nihaowalk",
    "password": "walkwest-98",
    "direction": "ParkerEmpire/out/"
}

var ftp = new FTP(config.ip, config.user, config.password);

/*var url = config.direction + "update1.zip";

 ftp.del(url);*/

//ftp.upload("安装包.zip",config.direction + "/paik-2015-12-9.zip",function(){
//    console.log("上传成功!");
//});

ftp.upload("./安装包.zip", config.direction + "paik-2015-12-9.zip", function () {
    console.log("上传成功!");
});