var flower;
(function (flower) {
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);

        function DisplayObjectContainer(subClass, init) {
            subClass = subClass || false;
            init = init || false;
            this._childs = new Array();
            _super.call(this, true);
            if (subClass == false && flower.ClassLock.DisplayObjectContainer == true) {
                flower.DebugInfo.debug("|创建DisplayObjectContainer| 直接创建请用DisplayObjectContainer.creat()，如果是子类subClass必须传true", DebugInfo.ERROR);
                return;
            }
            this._subClass = subClass;
            this.className = flower.ClassName.DisplayObjectContainer;
            if (init == false) {
                this.initBuffer();
            }
        }

        var d = __define, c = DisplayObjectContainer;
        p = c.prototype;

        p.initBuffer = function () {
            _super.prototype.initBuffer.call(this);
            this.mutiplyMouseEnabled = true;
            this._mouseAim = false;
            if (this._show == null) {
                this._show = new cc.Node();
            }
        }

        p.cycleBuffer = function () {
            _super.prototype.cycleBuffer.call(this);
            this._show = null;
        }

        p.addChild = function (child) {
            if (child.getParent()) child.getParent().removeChild(child);
            child.setZorder(this._childs.length);
            this._childs.push(child);
            child.setParent(this);
            child.setStage(this._stage);
            child.setParentAlpha(this._parentAlpha * this._alpha);
        }

        p.addChildAt = function (child, index) {
            index = index == null ? 0 : index;
            if (child.getParent()) child.getParent().removeChild(child);
            child.setZorder(index);
            this._childs.splice(index, 0, child);
            var len = this._childs.length;
            for (var i = index + 1; i < len; i++) {
                this._childs[i].setZorder(i);
            }
            child.setParent(this);
            child.setStage(this._stage);
            child.setParentAlpha(this._parentAlpha * this._alpha);
        }

        p.getChildByIndex = function (index) {
            return this._childs[index];
        }

        p.getNumChildren = function () {
            return this._childs.length;
        }

        p.removeChild = function (child) {
            for (var i = 0; i < this._childs.length; i++) {
                if (this._childs[i] == child) {
                    this._childs.splice(i, 1);
                    child.setStage(null);
                    child.setParent(null);
                    return child;
                }
            }
            return null;
        }

        p.removeAllChilds = function () {
            while (this._childs.length) {
                this._childs.pop().dispose();
            }
        }

        p.setChildIndex = function (child, index) {
            if (index >= this._childs.length) {
                DebugInfo.debug("设置子对象层次错误，" + index + "超出最大范围" + (this._childs.length - 1), DebugInfo.ERROR);
                return;
            }
            var childIndex = -1;
            var len = this._childs.length;
            for (var i = 0; i < len; i++) {
                if (this._childs[i] == child) {
                    childIndex = i;
                }
            }
            if (childIndex == -1) {
                DebugInfo.debug("本容器不包含该子对象", DebugInfo.ERROR);
                return;
            }
            if (childIndex == index) return;
            this._childs.splice(childIndex, 1);
            this._childs.splice(index, 0, child);
            i = childIndex < index ? childIndex : index;
            for (; i < len; i++) {
                this._childs[i].zorder = i;
            }
        }

        p.getChildIndex = function (child) {
            for (var i = 0; i < this._childs.length; i++) {
                if (this._childs[i] == child) {
                    return i;
                }
            }
            return null;
        }

        p.contains = function (child) {
            if (child.getParent() == this) return true;
            return false;
        }

        p.getContainer = function () {
            trace("this._show : ", this._show, this._show.getParent());
            return this._show;
        }

        p.getChildByTag = function (val) {
            for (var i = 0; i < this._childs.length; i++) {
                if (this._childs[i]._tag == val) {
                    return this._childs[i];
                }
            }
            return null;
        }

        p.getMouseTarget = function (matrix, mutiply) {
            if (this.mouseEnabled == false || this._visible == false) return null;
            if (mutiply == true && this.mutiplyMouseEnabled == false) return null;
            matrix.save();
            matrix.translate(-this._x, -this._y);
            if (this._rotation) matrix.rotate(-this._rotation);
            if (this._scaleX != 1 || this._scaleY != 1) matrix.scale(1 / this._scaleX, 1 / this._scaleY);
            this._mouseX = matrix.tx;
            this._mouseY = matrix.ty;
            var target;
            var len = this._childs.length;
            for (var i = len - 1; i >= 0; i--) {
                if (this._childs[i].mouseEnabled && (mutiply == false || (mutiply == true && this._childs[i].mutiplyMouseEnabled == true))) {
                    if ((IDE.TYPE == 1 && this._childs[i].hasOwnProperty("getMouseTarget")) || (IDE.TYPE == 2 && this._childs[i]["getMouseTarget"])) {
                        target = (this._childs[i]).getMouseTarget(matrix, mutiply);
                        if (target != null) break;
                    }
                    else if (this._childs[i].isMouseTarget(matrix, mutiply) == true) {
                        target = this._childs[i];
                        break;
                    }
                }
            }
            matrix.setTo.apply(matrix, matrix._saves.pop());
            if (this._mouseAim == true && target != null) {
                return this;
            }
            return target;
        }

        p.getChildByNameEx = function (name) {
            for (var i = 0; i < this._childs.length; ++i) {
                if (name == this._childs[i].name) {
                    return this._childs[i];
                }
            }
            return null;
        }

        p.setAlpha = function (val) {
            this._alpha = val;
            this.setParentAlpha(this._parentAlpha);
        }

        p.setParentAlpha = function (val) {
            this._parentAlpha = val;
            for (var i = 0; i < this._childs.length; i++) {
                this._childs[i].setParentAlpha(this._alpha * this._parentAlpha);
            }
        }

        p.getWidth = function () {
            var sx = 0;
            var ex = 0;
            for (var i = 0; i < this._childs.length; i++) {
                if (this._childs[i].getX() < sx) {
                    sx = this._childs[i].getX();
                }
                if (this._childs[i].getX() + this._childs[i].getWidth() > ex) {
                    ex = this._childs[i].getX() + this._childs[i].getWidth();
                }
            }
            return ex - sx;
        }

        p.getHeight = function () {
            var sy = 0;
            var ey = 0;
            for (var i = 0; i < this._childs.length; i++) {
                if (this._childs[i].getY() < sy) {
                    sy = this._childs[i].getY();
                }
                if (this._childs[i].getY() + this._childs[i].getHeight() > ey) {
                    ey = this._childs[i].getY() + this._childs[i].getHeight();
                }
            }
            return ey - sy;
        }

        p.setStage = function (stage) {
            _super.prototype.setStage.call(this, stage);
            for (var i = 0; i < this._childs.length; i++) {
                this._childs[i].setStage(this._stage);
            }
        }

        p.dispose = function () {
            if (this.incycle) {
                return;
            }
            while (this._childs.length) {
                this._childs[0].dispose();
            }
            _super.prototype.dispose.call(this);
            if (this.className == flower.ClassName.DisplayObjectContainer) {
                flower.BufferPool.cycle(flower.ClassName.DisplayObjectContainer, this, flower.BufferPool.DisplayObjectContainerMax);
            }
        }

        DisplayObjectContainer.create = function () {
            flower.ClassLock.DisplayObjectContainer = false;
            var dis = flower.BufferPool.create(flower.ClassName.DisplayObjectContainer, DisplayObjectContainer);
            flower.ClassLock.DisplayObjectContainer = true;
            return dis;
        }

        return DisplayObjectContainer;
    })(flower.DisplayObject);
    flower.DisplayObjectContainer = DisplayObjectContainer;
})(flower || (flower = {}));
