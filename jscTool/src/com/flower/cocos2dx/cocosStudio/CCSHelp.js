var flower;
(function (flower) {
    var CCSHelp = (function () {
        function CCSHelp() {

        }

        var d = __define, c = CCSHelp;
        p = c.prototype;

        CCSHelp.imageLoadTextures = function (img, info, myUrl) {
            img.loadTexture(flower.CCSHelp.transfromImageTexturesInfo(info, myUrl).url, flower.CCSHelp.transfromImageTexturesInfo(info, myUrl).type);
        }
        
        CCSHelp.transfromImageTexturesInfo = function (info, myUrl) {
            var obj = {
                "url": info.path,
                "type": info.resourceType
            };
            if (info.resourceType == 0) obj.url = myUrl + info.path;
            return obj;
        }

        return CCSHelp;
    })();
    flower.CCSHelp = CCSHelp;
})(flower || (flower = {}));
