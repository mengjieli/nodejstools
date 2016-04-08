require("./../../tools/com/requirecom");
require("./../../tools/shell/requireshell");
require("./../../tools/ftp/requireftp");
require("./../../tools/net/requirenet");

new ShellCommand("node",["FileSync.js","/Users/mengjieli/Documents/paik/paike_client/ParkerEmpire","localhost",11000,192,1]
,null,null,function(data){
        console.log(data);
    });

