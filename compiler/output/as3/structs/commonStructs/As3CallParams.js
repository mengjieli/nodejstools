/**
 * Created by mengj_000 on 2015/4/22.
 */

function As3CallParams()
{
    this.type = "callParams";
    this.list = [];
}

As3CallParams.prototype.addParam = function(val)
{
    this.list.push(val);
}

As3CallParams.prototype.addParamAt = function(val,index)
{
    this.list.splice(index,0,val);
}

As3CallParams.prototype.printTS = function(before,cls)
{
    var str = "";
    var item;
    for(var i = 0; i < this.list.length; i++)
    {
        item = this.list[i].printTS("",cls);

        //try{
        //    this.list[i].exprType.type == 1;
        //}
        //catch (e)
        //{
        //    if(this.list[i].type == "attribute" && cls.name == "MainViewController")
        //    {
        //        console.log(cls.allName,global.Log.getFilePos(this.list[i].debug.file,this.list[i].tokenPos),this.list[i].list[0].val);
        //    }
        //        //console.log(cls.allName,cls.currentFunction?cls.currentFunction.name:"",this.list[i].type,this.list[i]);
        //}
        if(this.list[i].type == "attribute" && this.list[i].exprType.type == 1 && this.list[i].exprType.name == "Function" && this.list[i].printInfo.last && this.list[i].printInfo.last.subType == "function")
        {
            var copy = item;
            for(var c = copy.length; c>= 0; c--)
            {
                if(copy.charAt(c) == "." || copy.charAt(c) == "[")
                {
                    copy = copy.slice(0,c);
                    break;
                }
            }
            str += "" + item + ".bind(" + copy + ")" + (i<this.list.length-1?",":"");
        }
        else
        {
            str += item + (i<this.list.length-1?",":"");
        }
    }
    return str;
}

global.As3CallParams = As3CallParams;