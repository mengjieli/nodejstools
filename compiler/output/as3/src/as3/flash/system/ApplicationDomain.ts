/**
 * Created by mengj_000 on 2015/4/27.
 */


module as3
{
    export class ApplicationDomain
    {
        private _parentDomain:ApplicationDomain = null;

        public domainMemory:egret.ByteArray = null;
        // 所有的完全限定名称
        public defNames:string[] = [];
        // 资源所在的模块
        public resModule:string = "";

        public constructor(parentDomain?:ApplicationDomain)
        {
            this._parentDomain = parentDomain;
        }

        public static currentDomain:ApplicationDomain;

        public get parentDomain():ApplicationDomain
        {
            return this._parentDomain;
        }
        // 判断字符串是不是纯数字
        public static isNumber(str:string):boolean
        {
            if("" == str || null == str)
            {
                return false;
            }
            for(var index = 0; index < str.length; index++)
            {
                var ch:string = str[index];
                if(ch >= "0" && ch <= "9")
                {
                    continue;
                }
                else
                {
                    return false;
                }
            }
            return true;
        }
        private getDefName(name:string):string
        {
            var arr:string[] = this.resModule.split(".");
            for(var index:number = 0; index < arr.length; index++)
            {
                if(ApplicationDomain.isNumber(arr[index]))
                {
                    arr[index] = "a" + arr[index];
                }
            }
            var moduleName = arr.join("_");
            if( "_" == moduleName.charAt(moduleName.length-1) )
            {
                moduleName = moduleName.substring(0, moduleName.length-1);
            }

            arr = name.split(".");
            for(index = 0; index < arr.length; index++)
            {
                if(ApplicationDomain.isNumber(arr[index]))
                {
                    arr[index] = "a" + arr[index];
                }
            }
            var clsName:string = arr.join("_");
            var defName:string = moduleName + "." + clsName;
            return defName;
        }
        /**
         * 从指定的应用程序域获取一个公共定义。
         * @param name
         */
        public getDefinition(name:string):any
        {
            var defName:string = this.getDefName(name)
            var def:any = egret.getDefinitionByName(defName);
            return def;
        }

        /**
         * 检查指定的应用程序域之内是否存在一个公共定义。
         * @param name
         */
        public hasDefinition(name:string):boolean
        {
            var defName:string = this.getDefName(name)
            var hasDef:boolean = egret.hasDefinition(defName);
            return hasDef;
        }
        /**
         *
         从指定应用程序域获取各个公共定义的所有完全限定名称。该定义可以是一个类、一个命名空间或一个函数的定义。可将从此方法返回的名称传递给 getDefinition() 方法，以获取实际定义的对象。
         */
        public getQualifiedDefinitionNames():string[]
        {
            return this.defNames;
        }

        public static MIN_DOMAIN_MEMORY_LENGTH:number = 0;
    }
}

as3.ApplicationDomain.currentDomain = new as3.ApplicationDomain();