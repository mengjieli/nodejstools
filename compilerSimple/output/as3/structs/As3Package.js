/**
 * Created by mengj_000 on 2015/4/20.
 */
function As3Package()
{
    //包路径
    this.packageURL = "";
    //imports
    this.imports = [];
    //类
    this.class = null;
}

/**
 * 完成一个类
 */
As3Package.prototype.complete = function()
{
    this.class.imports = this.imports;
    this.class.packageURL = this.packageURL;
    this.class.complete();
}

/**
 * 添加import目录
 * @param url
 */
As3Package.prototype.addImport = function(url)
{
    this.imports.push(url);
}

As3Package.prototype.printTS = function(mgr,before)
{
    return this.class.printTS(mgr,before);
}

global.As3Package = As3Package;