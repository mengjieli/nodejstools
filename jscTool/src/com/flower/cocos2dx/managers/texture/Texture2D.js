var flower;
(function (flower) {
    var Texture2D = (function () {
        function Texture2D(url, source) {
            this.url = url;
            this.count = 0;
            this._txt = source;
            var size = this._txt.getContentSize();
            this.width = size.width;
            this.height = size.height;
        }

        var d = __define, c = Texture2D;
        p = c.prototype;

        p.dispose = function () {
            if (Texture2D.safeLock == true) {
                DebugInfo.debug("|释放纹理| 操作失败，此方法提供内部结构使用，外部禁止使用，请用TextureManager.disposeTexure()代替，url:" + this.url, DebugInfo.ERROR);
                return;
            }
            if (this.count != 0) {
                if (Flower.resrict) {
                    DebugInfo.debug("|释放纹理| 纹理计数器不为0，此纹理不会被释放，计数为 " + this.count + "，地址为" + this.url, DebugInfo.ERROR);
                    return;
                }
                else {
                    DebugInfo.debug("|释放纹理| 纹理计数器不为0，计数为 " + this.count + "，地址为" + this.url, DebugInfo.WARN);
                }
            }
            cc.TextureCache.getInstance().removeTexture(this._txt);
            this._txt = null;
        }

        p.addCount = function () {
            this.count++;
            if (this.getUrl() == "res/dezhou/profile/por_exam_0.png") {
                trace("add por exam : " + this.count);
            }
        }

        p.delCount = function () {
            if (this.count) {
                this.count--;
            }
            if (this.getUrl() == "res/dezhou/profile/por_exam_0.png") {
                trace("del por exam : " + this.count);
            }
            if (!this.count) {
                flower.TextureManager.getInstance().delTexture(this);
            }
        }

        p.getCount = function () {
            return this.count;
        }

        p.getUrl = function () {
            return this.url;
        }

        p.getTexture = function () {
            return this._txt;
        }

        Texture2D.safeLock = true;
        Texture2D.extend = extendClass;

        return Texture2D;
    })();
    flower.Texture2D = Texture2D;
})(flower || (flower = {}));

