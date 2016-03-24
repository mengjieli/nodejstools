require("./../../tools/com/requirecom");
require("./../../tools/shell/requireshell");
require("./../../tools/ftp/requireftp");
require("./../../tools/net/requirenet");

//new ShellCommand("node",["./FileSyncClient","limengjie"],function(){
//    console.log("exit");
//},null,
//function(data){
//    console.log("data:",data);
//},null,
//function(e){
//    console.log("error:",e);
//},null);


var fork = require('child_process').fork;
// 获取当前机器的 CPU 数量
// 生成新进程
var sub = fork('./FileSyncClient.js',["limengjie",5553]);


sub.on('message', function(m) {
    // 收到子进程发送的消息
    console.log('got message from sub: ', m);
});


// 向子进程发送消息
sub.send({hello: 'world'});