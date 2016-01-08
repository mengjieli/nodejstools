/**
 *
 * @author
 *
 */
var Graphics = (function () {
    function Graphics() {
    }
    var d = __define,c=Graphics;p=c.prototype;
    /**
     * 画虚线
     */
    Graphics.drawVirtualLine = function (graphics, startX, startY, endX, endY, realWidth, virtualWidth) {
        if (realWidth === void 0) { realWidth = 5; }
        if (virtualWidth === void 0) { virtualWidth = 5; }
        var pos = 0;
        var gapX = endX - startX;
        var gapY = endY - startY;
        var len = Math.sqrt(gapX * gapX + gapY * gapY);
        while (pos < len) {
            var lineStartX = startX + pos * gapX / len;
            var lineStartY = startY + pos * gapY / len;
            pos += realWidth;
            if (pos > len)
                pos = len;
            var lineEndX = startX + pos * gapX / len;
            var lineEndY = startY + pos * gapY / len;
            graphics.moveTo(lineStartX, lineStartY);
            graphics.lineTo(lineEndX, lineEndY);
            pos += virtualWidth;
        }
        graphics.endFill();
    };
    Graphics.drawVirtualArrow = function (graphics, startX, startY, endX, endY, realWidth, virtualWidth) {
        if (realWidth === void 0) { realWidth = 5; }
        if (virtualWidth === void 0) { virtualWidth = 5; }
        Graphics.drawVirtualLine(graphics, startX, startY, endX, endY);
        var rot = Math.atan2(-endY + startY, -endX + startX);
        var rot1 = rot + 30 * Math.PI / 180;
        var rot2 = rot - 30 * Math.PI / 180;
        var len = 12;
        Graphics.drawVirtualLine(graphics, endX, endY, endX + len * Math.cos(rot1), endY + len * Math.sin(rot1), 5, 3);
        Graphics.drawVirtualLine(graphics, endX, endY, endX + len * Math.cos(rot2), endY + len * Math.sin(rot2), 5, 3);
    };
    Graphics.drawArrow = function (graphics, startX, startY, endX, endY, realWidth, virtualWidth) {
        if (realWidth === void 0) { realWidth = 5; }
        if (virtualWidth === void 0) { virtualWidth = 5; }
        Graphics.drawVirtualLine(graphics, startX, startY, endX, endY, 10, 0);
        var rot = Math.atan2(-endY + startY, -endX + startX);
        var rot1 = rot + 30 * Math.PI / 180;
        var rot2 = rot - 30 * Math.PI / 180;
        var len = 12;
        Graphics.drawVirtualLine(graphics, endX, endY, endX + len * Math.cos(rot1), endY + len * Math.sin(rot1), len, 0);
        Graphics.drawVirtualLine(graphics, endX, endY, endX + len * Math.cos(rot2), endY + len * Math.sin(rot2), len, 0);
    };
    return Graphics;
})();
egret.registerClass(Graphics,"Graphics");
