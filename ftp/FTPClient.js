require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");

var config = {
    "ip": "121.40.18.57",
    "user": "nihaowalk",
    "password": "walkwest-98",
    "direction": "ParkerEmpire/out/"
}

var ftp = new FTP(config.ip,config.user,config.password);

var url = config.direction + "update1.zip";
console.log(url);
ftp.del(url);