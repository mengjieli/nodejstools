/**
 * Created by huitao on 4/28/2015.
 */
module as3
{
    export class XMLList
    {
        public _value:any;

        constructor(_value:any = null)
        {
            this._value = _value;
        }

        /**
         * 调用每个 XML 对象的 attributes() 方法，并返回每个 XML 对象属性的 XMLList 对象。
         * @returns {null}
         */
        public attributes():XMLList
        {
            var list:XMLList ;
            var rlt:Array<any> = [];
            for( var p in this._value)
            {
                list = (<XML> this._value[p] ).attributes();
                rlt = rlt.concat(list._value);
            }
            console.log(list);
            return new XMLList(rlt);
        }

        /**
         * 调用每个 XML 对象的 attributes() 方法，并返回每个 XML 对象属性的 XMLList 对象。
         * @param attributeName
         * @returns {XMLList}
         */
        public attribute(attributeName:any):XMLList
        {
            var list:XMLList ;
            var rlt:Array<any> = [];
            for( var p in this._value)
            {
                list = (<XML> this._value[p] ).attribute(attributeName);
                rlt = rlt.concat(list._value);
            }
            console.log(list);
            return new XMLList(rlt);
        }

        /**
         * 调用每个 XML 对象的 child() 方法，并返回包含有序结果的 XMLList 对象。
         * @param propertyName
         * @returns {*}
         */
        public child(propertyName:string):XMLList
        {
            var list:XMLList ;
            var rlt:Array<any> = [];
            for( var p in this._value)
            {
                list = (<XML> this._value[p] ).child(propertyName);
                rlt = rlt.concat(list._value);
            }
            console.log(list);
            return new XMLList(rlt);
        }

        public copy():XMLList
        {
            var list:XML ;
            var rlt:Array<any> = [];
            for( var p in this._value)
            {
                list = (<XML> this._value[p] ).copy();
                rlt.push(list);
            }
            return new XMLList(rlt);
        }

        public descendants(_name?:any):XMLList
        {
            var list:XMLList ;
            var rlt:Array<any> = [];
            for( var p in this._value)
            {
                list = (<XML> this._value[p] ).descendants(_name);
                rlt = rlt.concat(list._value);
            }
            console.log(list);
            return new XMLList(rlt);
        }


        public dotAt(_name:string ,_value?:any):XMLList
        {
            var arr:Array<any> = new Array<any>();

            var list:XMLList = this.descendants();

            var xml:XML = null;
            for(var i:number = 0 ;i < (<Array<any>>list._value).length;i ++)
            {
                xml = list._value[i];
                if(xml._valueObj.hasOwnProperty("$"+_name) == true && (_value == undefined || xml._valueObj["$"+_name] == _value))
                {
                    arr.push(xml);
                }
            }
            return new XMLList(arr);
        }

        public contains(_value:any):boolean
        {
            var rets:boolean = false ;

            for( var p in this._value)
            {
                rets = (<XML> this._value[p] ).contains(_value);
                if(rets == true)
                    return true;
            }
            return rets;
        }

        /**
         * 调用每个 XML 对象的 children() 方法，并返回包含结果的 XMLList 对象。
         * @returns {null}
         */
        public children():XMLList
        {
            var list:XMLList ;
            var rlt:Array<any> = [];
            for( var p in this._value)
            {
                list = (<XML> this._value[p] ).children();
                rlt = rlt.concat(list._value);
            }
            console.log(list);
            return new XMLList(rlt);

        }

        /**
         * 列出所有XML 对象的元素。
         * @param name
         * @returns {XMLList}
         */
        public elements(name:any):XMLList
        {
            var list:XMLList ;
            var rlt:Array<any> = [];
            for( var p in this._value)
            {
                list = (<XML> this._value[p] ).elements(name);
                rlt = rlt.concat(list._value);
            }
            return new XMLList(rlt);
        }

        /**
         * 检查 XMLList 对象是否包含复杂内容。
         */
        public hasComplexContent():boolean
        {
            var list:XMLList ;
            var rlt:Array<any> = [];
            for( var p in this._value)
            {
                if(<XML> this._value[p].hasComplexContent() )
                {
                    return true;
                }
            }
            return false;
        }

        public hasSimpleContent():boolean
        {
            return !this.hasComplexContent();
        }

        public hasOwnProperty(_value:any):boolean
        {
            var rets:boolean = false ;

            for( var p in this._value)
            {
                rets = (<XML> this._value[p] ).hasOwnProperty(_value);
                if(rets == true)
                    return true;
            }
            return rets;
        }

        public parent ():any
        {
            var list:XMLList ;
            var rlt:Array<any> = new Array<any>();

            var num:number = 0;
            var leng:number = this._value.length;
            if(leng == 0) return undefined;
            //用于保存相同的个数

            for(var i:number = 0 ; i <  leng - 2 ; i++)
            {
                console.log(this._value[i].parent()._valueObj);
                if(this._value[i].parent()._valueObj.equals() == this._value[i+1].parent()._valueObj)
                {
                    num+=1;
                }
            }
            if(leng == num)
            {
                return this._value[0].parent();
            }

            return undefined;;
        }

        public toXMLString():string
        {
            //对各个进行处理
            var ret:string = "";
            for (var i :number = 0 ;i < this.length() ;i ++)
            {
                ret = ret.concat(this._value[i].toXMLString());
            }

            return ret;
        }

        public length():number
        {
            console.log(this._value instanceof Array);
            if(this._value instanceof Array)
            {
                return this._value.length;
            }
            else
            {
                return 0;
            }
        }
    }
}

