/**
 *
 * @author
 *
 */
var LocalFileFormat = (function () {
    function LocalFileFormat() {
    }
    var d = __define,c=LocalFileFormat;p=c.prototype;
    LocalFileFormat.Image = "image";
    LocalFileFormat.Json = "json";
    LocalFileFormat.Xml = "xml";
    LocalFileFormat.Text = "text";
    LocalFileFormat.Html = "html";
    LocalFileFormat.SubType = {
        "png": "png",
        "jpg": "jpg"
    };
    return LocalFileFormat;
})();
egret.registerClass(LocalFileFormat,"LocalFileFormat");
