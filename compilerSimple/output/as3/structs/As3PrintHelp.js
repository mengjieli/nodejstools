/**
 * Created by mengj_000 on 2015/4/21.
 */


function As3PrintHelp()
{

}

As3PrintHelp.printStmtsTS = function(value,before,cls)
{
    var str = "";
    if(value.hasOwnProperty("length"))
    {
        for(var i = 0; i < value.length; i++)
        {
            str += value[i].printTS(before,cls);
        }
    }
    else
    {
        str += value[i].printTS(value,before,cls);
    }
    return str;
}

global.As3PrintHelp = As3PrintHelp;