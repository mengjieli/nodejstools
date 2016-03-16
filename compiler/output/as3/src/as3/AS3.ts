/**
 * Created by mengj_000 on 2015/4/16.
 */
module as3
{
    var progressTime = 0;
    export var frame = 0;
    export var stage:egret.Stage;
    export function init(stage:egret.Stage)
    {
        as3.stage = stage;
        progressTime = (new Date()).getTime();
        stage.addEventListener(egret.Event.ENTER_FRAME,onNextFrame,null);
    }

    function onNextFrame(e:egret.Event):void
    {
        frame++;
    }

    export function InitArray()
    {
        return null;
    }

    export function tranint(val){
        if(typeof val != "number")
            return parseInt(val);
        return Math.floor(val);
    }
    export function trannumber(val){
        if(typeof val != "number")
            return parseFloat(val);
        return val
    }
    export function Boolean(val){return val?true:false;}
    export function isNaN(val){return val==undefined?true:false;}
    export function String(val) {return val + "";}
    export function uint(val) {return val==undefined?0:val<0?0:Math.floor(val);}
    export function XML_(val)
    {
        return new XML(val);
    }
    export function XMLList_(val) {return new XMLList(val);}
    export function As3is(value,type):boolean
    {
        if(value == null) return false;
        if(type == "Class")
        {
            if(value.prototype && value.prototype.__class__) return true;
            return false;
        }
        var name;
        if(typeof(type) == "string") name = type;
        else  name = as3.getClassName(type);
        if(typeof(value) != "object")
        {
            if(typeof(value) == name) return true;
            return false;
        }
        if(egret.getQualifiedClassName(value) == name) return true;
        var cls;
        if(value.__proto__ && value.__proto__.__proto__) cls = value.__proto__.__proto__;
        while (cls) {
            if (cls.__class__ == name)
                return true;
            if(cls.__proto__ && cls.__proto__.__proto__) cls = cls.__proto__.__proto__;
            else cls = null;
        }
        return false;
    }


    export function As3in(val,expr):boolean
    {
        return expr[val]==undefined?false:true;
    }

    export function AS3Object(_val):Object
    {
        return _val;
    }

    export var sortOn = function(arr:Array<any>,fieldName:any,options?:any)
    {
        var ch:any;
        for(var i = 0; i < arr.length - 1; i++)
        {
            if(arr[i][fieldName] > arr[i+1][fieldName])
            {
                ch = arr[i+1];
                arr[i+1] = arr[i];
                arr[i] = ch;
                i = -1;
            }
        }
        return arr;
    }

    export class AS3Array {
        public static CASEINSENSITIVE:number = 1;
        public static DESCENDING:number = 2;
        public static NUMERIC:number = 16;
        public static RETURNINDEXEDARRAY:number = 8;
        public static UNIQUESORT:number = 4;
    }

    export class Dictionary
    {
        public map:Array<any> = new Array<any>();

        public constructor(weak?:boolean)
        {
        }

        public getItem(key)
        {
            for(var i = 0; i < this.map.length; i++)
            {
                if(this.map[i][0] == key) return this.map[i][1];
            }
            return undefined;
        }

        public setItem(key,val)
        {
            for(var i = 0; i < this.map.length; i++)
            {
                if(this.map[i][0] == key)
                {
                    this.map[i][1] = val;
                    return;
                }
            }
            this.map.push([key,val]);
        }

        public delItem(key)
        {
            for(var i = 0; i < this.map.length; i++)
            {
                if(this.map[i][0] == key)
                {
                    this.map.splice(i,1);
                    break;
                }
            }
        }

        public hasOwnProperty(key)
        {
            for(var i = 0; i < this.map.length; i++)
            {
                if(this.map[i][0] == key)
                {
                    return true;
                }
            }
            return false;
        }
    }


    export function getTimer():number
    {
        return (new Date()).getTime() - progressTime;
    }

    export class ArgumentError extends Error
    {
        public constructor(msg?:string,id?:number)
        {
            super(msg,id);
            this.name = "ArgumentError";
        }
    }
}