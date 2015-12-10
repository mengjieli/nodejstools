var flower;
(function (flower) {
    var TextureManager = (function () {
        function TextureManager() {
            this.list = [];
            if (TextureManager.classLock == true) {
                flower.DebugInfo.debug("无法创建对象TextureManager，此类为单例模式，请访问TextureManager.getInstance()", flower.DebugInfo.WARN);
                return;
            }
        }

        var d = __define, c = TextureManager;
        p = c.prototype;

        p.hasTexture = function (url) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].url == url) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 传入 cocos2dx 的原始数据
         * @param source
         */
        p.createTexture = function (url, source) {
            flower.DebugInfo.debug("|加载纹理| " + url, flower.DebugInfo.TIP);
            var texture = new flower.Texture2D(url, source);
            this.list.push(texture);
        }

        p.delTexture = function (texture) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i] == texture) {
                    flower.Texture2D.safeLock = false;
                    this.list.splice(i, 1)[0].dispose();
                    flower.DebugInfo.debug("|删除纹理| " + texture.getUrl(), flower.DebugInfo.TIP);
                    flower.Texture2D.safeLock = true;
                    return;
                }
            }
            flower.DebugInfo.debug("|释放纹理| 未找到的纹理 : " + texture.getUrl(), flower.DebugInfo.WARN);
        }

        p.getNewTexture = function (url) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].url == url) {
                    this.list[i].addCount();
                    return this.list[i];
                }
            }
            flower.DebugInfo.debug("|获取新纹理| 未找到的纹理 : " + url, flower.DebugInfo.WARN);
            return null;
        }

        p.getTextureInfo = function (url) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].url == url) {
                    return this.list[i];
                }
            }
            flower.DebugInfo.debug("|获取纹理| 未找到的纹理 : " + url, flower.DebugInfo.WARN);
            return null;
        }

        p.disposeTexure = function (texture) {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i] == texture) {
                    this.list[i].delCount();
                    return;
                }
            }
            flower.DebugInfo.debug("|释放纹理| 未找到的纹理 " + texture.getUrl(), flower.DebugInfo.WARN);
        }

        TextureManager.classLock = true;
        TextureManager.ist;
        TextureManager.getInstance = function () {
            if (!TextureManager.ist) {
                TextureManager.classLock = false;
                TextureManager.ist = new TextureManager();
                TextureManager.classLock = true;
            }
            return TextureManager.ist;
        };

        return TextureManager;
    })();
    flower.TextureManager = TextureManager;
})(flower || (flower = {}));