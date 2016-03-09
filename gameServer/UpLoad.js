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

var listcfg =  {
    "1": "1.0.1",
    "4": "1.0.4",
    "6": "1.0.6",
    "7": "1.0.7",
    "8": "1.0.8",
    "9": "1.0.9",
    "10": "1.1.0",
    "11": "1.1.1",
    "12": "1.1.2",
    "13": "1.1.3",
    "16": "1.1.6",
    "17": "1.1.7",
    "18": "1.1.8",
    "19": "1.1.9",
    "20": "1.2.0",
    "22": "1.2.2",
    "24": "1.2.4",
    "27": "1.2.7",
    "28": "1.2.8",
    "34": "1.3.4",
    "35": "1.3.5",
    "36": "1.3.6",
    "37": "1.3.7",
    "39": "1.3.9",
    "40": "1.4.0",
    "41": "1.4.1",
    "42": "1.4.2",
    "44": "1.4.4",
    "45": "1.4.5"
};

var index = 0;
var list = Object.keys(listcfg);
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
    console.log("连上了!! !!");
    upload();
});
