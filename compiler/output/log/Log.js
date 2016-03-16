/**
 * Created by mengj_000 on 2015/4/23.
 */


function Log()
{

}

Log.items = [];

Log.log = function(str)
{
    console.log(str);
}

/**
 *
 * @param type 1没有对应的类信息 2对应的类没有实现 2没有类的属性对应信息 3类属性功能没有实现
 * @param file 2表示文件内容
 * @param pos 3表示文件位置
 * @param className  4表示对应的类
 * @param atrName 5表示类对应的属性
 */
Log.apilog = function(type,file,pos,className,atrName)//pos,apitype,className,atrName)
{
    Log.items.push({"type":type==undefined?0:type,"file":global.currentFile,"pos":Log.getFilePos(file,pos),"class":className==undefined?"":className,"atr":atrName==undefined?"":atrName,"expr":Log.getFilePosContent(file,pos)});
    global.Statistics.addAPIWarn();
}

Log.getFilePosContent = function(file,pos)
{
    var content = "";
    var len = 20;
    for(var i = pos - 1; i >= 0 && len > 0; i--,len--)
    {
        if(file.charAt(i) == "\r" || file.charAt(i) == "\n") break;
        content = file.charAt(i) + content;
    }
    for(var i = 0; i < content.length; i++)
    {
        if(content.charAt(i) == " " || content.charAt(i) == "\t")
        {
            content = content.slice(0,i) + content.slice(i+1,content.length);
            i--;
        }
        else
        {
            break;
        }
    }
    len = 20;
    for(var i = pos; i < file.length && len > 0; i++,len--)
    {
        if(file.charAt(i) == "\r" || file.charAt(i) == "\n") break;
        content += file.charAt(i);
    }
    return content;
}

Log.clearLog = function()
{
    var url = global.projUrl + "\\log\\api.txt";
    global.File.saveFile(url,"");
}

Log.saveLog = function(complete)
{
    var url = global.projUrl + "\\log\\api.txt";
    if(!global.File.isFileExist(url)) global.File.saveFile(url,"");
    var content = global.File.readUTF8File(url);
    var item;
    for(var i = 0; i < Log.items.length; i++)
    {
        item = Log.items[i];
        content += item.type + " " + item.file + " " + item.pos + " " + item.class + " " + item.atr + " " + item.expr + "\r\n";
    }
    //global.File.saveFile(url,content);
    global.Statistics.saveLog(url,content,complete);
}

Log.getFilePos = function (content,pos) {
    var line = 1;
    var charPos = 1;
    for(var i = 0; i < content.length && pos > 0; i++)
    {
        charPos++;
        if(content.charCodeAt(i) == 13)
        {
            if(content.charCodeAt(i+1) == 10)
            {
                i++;
                pos--;
            }
            charPos = 1;
            line++;
        }
        else if(content.charCodeAt(i+1) == 10)
        {
            if(content.charCodeAt(i) == 13)
            {
                i++;
                pos--;
            }
            charPos = 1;
            line++;
        }
        pos--;
    }
    return line + "行," + charPos;
};

Log.TIP = 1;
Log.WARN = 2;
Log.ERROR = 3;

global.Log = Log;