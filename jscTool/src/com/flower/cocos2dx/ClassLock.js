var flower;
(function (flower) {
    var ClassLock = (function () {
        function ClassLock() {
        }

        var d = __define, c = ClassLock;
        p = c.prototype;

        ClassLock.DisplayObjectContainer = true;
        ClassLock.Bitmap = true;
        ClassLock.TextField = true;
        ClassLock.InputTextField = true;
        ClassLock.Graphics = true;
        ClassLock.Cliper = true;
        ClassLock.CCSBase = true;
        ClassLock.CCSPanel = true;
        ClassLock.CCSImageView = true;
        ClassLock.CCSLabel = true;
        ClassLock.CCSInput = true;
        ClassLock.CCSLabelAtlas = true;
        ClassLock.CCSButton = true;
        ClassLock.CCSCheckBox = true;
        ClassLock.CCSList = true;

        return ClassLock;
    })();
    flower.ClassLock = ClassLock;
})(flower || (flower = {}));
