var fs = require("fs");

var url = "c:\\JSON.csv";
var saveurl = "d:\\JSON.csv";

fs.readFile(url,'binary',function(err,data){
    if(err){
        console.log("读取失败");
    }else{
        console.log(saveurl);
        fs.writeFile(saveurl, data, 'binary', function(err){
            if(err){
                console.log("保存失败",err);
            }else{
                console.log("保存成功");
            }
        });
    }
});