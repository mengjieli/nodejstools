var os = require("os");

var System = {}

System.WINDOWS = "windows";
System.MACOS = "mac os";


var os = require('os');
var IPv4,hostName;
hostName=os.hostname();
for(var i=0;i<os.networkInterfaces().en0.length;i++){
    if(os.networkInterfaces().en0[i].family=='IPv4'){
        IPv4=os.networkInterfaces().en0[i].address;
    }
}

System.platform = os.platform().slice(0, 3) == "win" ? System.WINDOWS : System.MACOS;
System.hostName = hostName;
System.IP = IPv4;

global.System = System;