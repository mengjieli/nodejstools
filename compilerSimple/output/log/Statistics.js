/**
 * Created by mengj_000 on 2015/5/8.
 * 转换率统计
 */

function Statistics()
{
}

Statistics.files = {};
Statistics.api = 0;
Statistics.apiWarn = 0;
Statistics.type = 0;
Statistics.typeWarn = [];

function copyNextFile()
{
    var item = copyNextFile.copyFileList.shift();
    if(item[0] == 1)
    {
        var url = item[1];
        var saveUrl = item[2];
        global.File.readBinaryFileAnsync(url,function(data){
            global.Log.log(url + " -> " + saveUrl);
            File.saveFileBinaryAnsync(saveUrl,data,function(){
                if(copyNextFile.copyFileList.length == 0)
                {
                    if(copyNextFile.copyComplete != null) copyNextFile.copyComplete();
                }
                else
                {
                    copyNextFile();
                }
            },function(){
                global.Log.log("拷贝资源失败：" + url);
            });
            //File.saveFileBinary(saveUrl,data);
        },function(){
            global.Log.log("拷贝资源失败：" + url);
            if(copyNextFile.copyFileList.length == 0)
            {
                if(copyNextFile.copyComplete != null) copyNextFile.copyComplete();
            }
            else
            {
                copyNextFile();
            }
        });
    }
    else
    {
        var saveUrl = item[1];
        var data = item[2];
        File.saveFileBinaryAnsync(saveUrl,data,function(){
            if(copyNextFile.copyFileList.length == 0)
            {
                if(copyNextFile.copyComplete != null) copyNextFile.copyComplete();
            }
            else
            {
                copyNextFile();
            }
        },function(){
            global.Log.log("保存资源失败：" + url);
        },"utf-8");
    }
}

copyNextFile.copyFileList = [];
copyNextFile.copyComplete = null;

Statistics.addFile = function(url,file)
{
    Statistics.files[url] = {"file":file,"length": file.length,"result": true};
}

Statistics.addFailFile = function(url)
{
    Statistics.files[url]["result"] = false;
}

Statistics.addParserError = function(url,pos)
{
    Statistics.files[url].parserError = global.Log.getFilePos(Statistics.files[url].file,pos);
}

Statistics.addScannerError = function(url,pos)
{
    Statistics.files[url].scannerError = global.Log.getFilePos(Statistics.files[url].file,pos);
}

Statistics.saveLog = function(api,apicontent,complete)
{
    var url = global.projUrl + global.filedev + "log" + global.filedev + "files.txt";
    
    var nextFunction = function()
    {
    	var content = "";
	    var all = 0;
	    var succ = 0;
	    for(var key in Statistics.files)
	    {
	        all++;
	        content += key + ",";
	        if(Statistics.files[key].parserError == undefined && Statistics.files[key].scannerError == undefined)
	        {
	            content += "0," + global.projBin + global.filedev + "src" + global.filedev + key;
	            succ++;
	        }
	        else if(Statistics.files[key].parserError != undefined)
	        {
	            content += "1," + Statistics.files[key].parserError;
	        }
	        else if(Statistics.files[key].scannerError != undefined)
	        {
	            content += "2," + Statistics.files[key].scannerError;
	        }
	        content += "\r\n";
	    }
		copyNextFile.copyFileList.push([2,api,apicontent]);
	    copyNextFile.copyFileList.push([2,url,content]);
	    //global.File.saveFile(url,content);
	
	    url = global.projUrl + global.filedev + "log" + global.filedev + "types.txt";
	    content = "";
	    for(var i = 0; i < Statistics.typeWarn.length; i++)
	    {
	        // Statistics.typeWarn.push({"class":clsName,"pos":pos,"expr":expstr});
	        content += Statistics.typeWarn[i].class + " " + Statistics.typeWarn[i].pos + " " + Statistics.typeWarn[i].expr + "\r\n";
	    }
	    copyNextFile.copyFileList.push([2,url,content]);
	    //global.File.saveFile(url,content);
	
	    var per;
	    var flag;
	    var i;
	    url = global.projUrl + global.filedev + "log" + global.filedev + "statistics.txt";
	    content = "";
	
	    var allper = 0;
	    allper = succ/all;
	    per = (Math.floor(1000*succ/all)/10).toString();
	    flag = false;
	    for(i = 0; i < per.length; i++)
	    {
	        if(per.charAt(i) == ".")
	        {
	            flag = true;
	            break;
	        }
	    }
	    if(flag == false) per += ".0";
	    content += "代码文件转换率 " + succ + "/" +  all + " " + per + " 1\r\n";
	
	    per = (Math.floor(1000*(Statistics.api-Statistics.apiWarn)/Statistics.api)/10).toString();
	    flag = false;
	    for(i = 0; i < per.length; i++)
	    {
	        if(per.charAt(i) == ".")
	        {
	            flag = true;
	            break;
	        }
	    }
	    if(flag == false) per += ".0";
	    content += "API转换率 " + (Statistics.api-Statistics.apiWarn) + "/" +  Statistics.api + " " + per + " 2\r\n";
	
	    per = (Math.floor(1000*(Statistics.type-Statistics.typeWarn.length)/Statistics.type)/10).toString();
	    flag = false;
	    for(i = 0; i < per.length; i++)
	    {
	        if(per.charAt(i) == ".")
	        {
	            flag = true;
	            break;
	        }
	    }
	    if(flag == false) per += ".0";
	    content += "类型识别率 " + (Statistics.type-Statistics.typeWarn.length) + "/" +  Statistics.type + " " + per + " 3\r\n";
	
	
	    //allper = allper*0.7*(Statistics.api-Statistics.apiWarn)/Statistics.api + allper*0.3*(Statistics.type-Statistics.typeWarn.length)/Statistics.type;
	    //allper = (Math.floor(allper*1000)/10).toString();
	    //flag = false;
	    //for(i = 0; i < allper.length; i++)
	    //{
	    //    if(allper.charAt(i) == ".")
	    //    {
	    //        flag = true;
	    //        break;
	    //    }
	    //}
	    //if(flag == false) allper += ".0";
	    //content += "总体评估 " + " " + allper + "% 4";
	
	    copyNextFile.copyFileList.push([2,url,content]);
	    //global.File.saveFile(url,content);
	    
	    //console.log("save logs : ",copyNextFile.copyFileList);
	    
	    copyNextFile.copyComplete = complete;
	    copyNextFile();
    }
    
    if(!global.File.isFileExist(url))
    {
      global.File.saveFileBinaryAnsync(url,"",nextFunction,function(){
      	console.log("保存文件失败：",url);
      });
    }
    else
    {
    	nextFunction();
    }
    
}

Statistics.addAPI = function()
{
    Statistics.api ++;
}

Statistics.addAPIWarn = function()
{
    Statistics.apiWarn ++;
}

Statistics.addExpr = function()
{
    Statistics.type ++;
}

Statistics.addExprWarn = function(clsName,pos,expstr)
{
    Statistics.typeWarn.push({"class":clsName,"pos":pos,"expr":expstr});
}

global.Statistics = Statistics;
