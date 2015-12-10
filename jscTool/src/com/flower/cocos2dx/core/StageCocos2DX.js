var flower;
(function (flower) {
    var StageCocos2DX = (function (_super) {
        __extends(StageCocos2DX, _super);
        function StageCocos2DX() {
            _super.call(this, true, true);
            if (StageCocos2DX.classLock == true) {
                DebugInfo.debug("不可创建StageCocos2DX对象，请访问单例方法StageCocos2DX.getInstance()", DebugInfo.ERROR);
                return;
            }
            this.initBuffer();
            this._stage = this;
            this._renderType = 5;
            this._stageWidth = cc.Director.getInstance().getWinSize().width;
            this._stageHeight = cc.Director.getInstance().getWinSize().height;
            this.setCamera(new flower.NormalCamera(this._stageWidth, this._stageHeight));
            flower.MouseManager.getInstance().init(this);
            this._scene = cc.Scene();
            if (cc.Director.getInstance().getRunningScene()) cc.Director.getInstance().replaceScene(this._scene);
            else  cc.Director.getInstance().runWithScene(this._scene);
            this._show = new flower.StageNode();
            this._scene.addChild(this._show);
            this._show.setAnchorPoint(0, 0);
        }

        var d = __define, c = StageCocos2DX;
        p = c.prototype;

        p.getMouseTarget2 = function (mouseX, mouseY, mutiply) {
            var matrix = this._camera.getMatrix();
            matrix.save();
            this._camera.loadMouseMatrix(mouseX, mouseY);
            var target = this.getMouseTarget(matrix, mutiply);
            matrix.setTo.apply(null, matrix._saves.pop());
            if (target == null) target = this;
            return target;
        }

        p.setCamera = function (val) {
            if (this._camera) {
                (this._camera).addEventListener(CameraEvent.MOVE, this.onCameraMove, this);
                this._camera = null;
            }
            this._camera = val;
        }

        p.onCameraMove = function (e) {
            this.setPosition2(this._x, this._y);
        }

        p.getWidth = function () {
            return this._stageWidth;
        }

        p.getHeight = function () {
            return this._stageHeight;
        }

        p.getScene = function () {
            return this._scene;
        }

        StageCocos2DX.ist;
        StageCocos2DX.classLock = true;
        StageCocos2DX.getInstance = function () {
            if (!StageCocos2DX.ist) {
                StageCocos2DX.classLock = false;
                StageCocos2DX.ist = new StageCocos2DX();
                StageCocos2DX.classLock = true;
            }
            return StageCocos2DX.ist;
        }

        StageCocos2DX.start = function () {
            StageCocos2DX.getInstance();
        }

        return StageCocos2DX;
    })(flower.DisplayObjectContainer);
    flower.StageCocos2DX = StageCocos2DX;
})(flower || (flower = {}));

