require("./../tools/com/requirecom");
require("./../tools/shell/requireshell");
require("./../tools/ftp/requireftp");


var info = {
    "ip": "121.40.18.57",
    "user": "nihaowalk",
    "password": "walkwest-98",
    "direction": "ParkerEmpire/out/"
};

var ftp = new FTP(info.ip, info.user, info.password);

ftp.connect(function () {
    ftp.upload("project.manifest", info.direction + "project.manifest", function () {
        ftp.upload("version.manifest", info.direction + "version.manifest", function () {
            ftp.upload("update1000009.zip", info.direction + "update1000009.zip", function () {
                console.log("upload complete !");
            });
        });
    });
})