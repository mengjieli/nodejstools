require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");


var cfg = {
    "ip": "121.40.18.57",
    "user": "nihaowalk",
    "password": "walkwest-98",
    "direction": "ParkerEmpire/192/"
};

//(file, ftpurl, complete, thisObj)

var index = 0;
var list = [1,2,3,4,5,6,7,8,9];
var ftp = new FTP(cfg.ip,cfg.user,cfg.password);

var upload = function() {
    if(index >= list.length ) {
        console.log("上传完毕!!!");
        return;
    }
    var name = "update" + list[index] + ".zip";
    var url = "./../cocos2dxUpdateTool/history/192/" + name;
    console.log("upload ",url,cfg.direction + name);
    ftp.upload(url,cfg.direction + name,upload);
    index++;
}

ftp.connect(function(){
    upload();
    console.log("连上了!! !!");
});