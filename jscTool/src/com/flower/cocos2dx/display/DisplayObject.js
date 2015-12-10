var flower;
(function (flower) {
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);

        function DisplayObject(subClass) {
            subClass = subClass == null ? false : subClass;
            _super.call(this);
            if (subClass == 0) {
                flower.DebugInfo.debug("|创建DisplayObject| 无意义的对象，如果是子对象必须设置subClass为true", DebugInfo.ERROR);
                return;
            }
        }

        var d = __define, c = DisplayObject;
        p = c.prototype;

        p.initBuffer = function () {
            this._id = DisplayObject.sid;
            DisplayObject.sid++;
            this.incycle = false;
            this._visible = true;
            this._alpha = 1;
            this._parentAlpha = 1;
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
            this._scaleX = 1;
            this._scaleY = 1;
            this._anchorX = 0.5;
            this._anchorY = 0.5;
            this._rotation = 0;
            this._blendMode = 1;
            this.mouseEnabled = true;
            this.mutiplyMouseEnabled = false;
            this.exd = {};
            this._moveX = 0;
            this._moveY = 0;
            this._mouseX = 0;
            this._mouseY = 0;
            this._zOrder = 0;
            this._parent = null;
            this._stage = null;
            this._tag = 0;
        }

        p.cycleBuffer = function () {
            this.incycle = true;
        }

        p.isMouseTarget = function (matrix, mutiply) {
            if (this.mouseEnabled == false || this._visible == false) return false;
            matrix.save();
            matrix.translate(-this._x, -this._y);
            if (this._rotation) matrix.rotate(-this._rotation);
            if (this._scaleX != 1 || this._scaleY != 1) matrix.scale(1 / this._scaleX, 1 / this._scaleY);
            this._mouseX = matrix.tx - this._moveX + this._anchorX * this._width;
            this._mouseY = matrix.ty - this._moveY + this._anchorY * this._height;
            if (this._mouseX >= 0 && this._mouseY >= 0 && this._mouseX < this._width && this._mouseY < this._height) {
                return true;
            }
            matrix.setTo.apply(matrix, matrix._saves.pop());
            return false;
        }

        p.getId = function () {
            return this._id;
        }

        p.getShow = function () {
            return this._show;
        }

        p.setVisible = function (val) {
            if (this._visible == val) return;
            this._visible = val;
            if (null != this._show) {
                this._show.setVisible(this._visible);
            }
        }

        p.getVisible = function () {
            return this._visible;
        }

        p.setParentAlpha = function (val) {
            this._parentAlpha = val;
        }

        p.removeFromParent = function () {
            if (this._parent) {
                this._parent.removeChild(this);
            }
        }

        p.setAlpha = function (val) {
            if (this._alpha != val) {
                this._alpha = val;
            }
        }

        p.getAlpha = function () {
            return this._alpha;
        }

        p.setPosition = function (p) {
            if (this._x == p.x && this._y == p.y) return;
            this._x = p.x;
            this._y = p.y;
            this._show.setPosition(parseInt(this._x), parseInt(this._y));
        }

        p.getPosition = function () {
            return cc.p(this._x, this._y);
        }

        p.setPosition2 = function (x, y) {
            if (this._x == x && this._y == y) return;
            this._x = x;
            this._y = y;
            this._show.setPosition(parseInt(this._x), parseInt(this._y));
        }

        p.setX = function (val) {
            if (this._x == val) return;
            this._x = val;
            if (null != this._show) {
                this._show.setPosition(parseInt(this._x), parseInt(this._y));
            }
        }

        p.getX = function () {
            return this._x;
        }

        __define(p, "x",
            function () {
                return this._x;
            },
            function (val) {
                val = +val;
                if (this._x == val) return;
                this._x = val;
                if (null != this._show) {
                    this._show.setPosition(parseInt(this._x), parseInt(this._y));
                }
            }
        )

        p.setY = function (val) {
            if (this._y == val) return;
            this._y = val;
            if (this._show) this._show.setPosition(parseInt(this._x), parseInt(this._y));
        }

        p.getY = function () {
            return this._y;
        }

        __define(p, "y",
            function () {
                return this._y;
            },
            function (val) {
                val = +val;
                if (this._y == val) return;
                this._y = val;
                if (this._show) this._show.setPosition(parseInt(this._x), parseInt(this._y));
            }
        )

        p.getWidth = function () {
            return this._width;
        }

        __define(p, "width",
            function () {
                return this._width;
            },
            function (val) {

            }
        )

        p.getHeight = function () {
            return this._height;
        }

        __define(p, "height",
            function () {
                return this._height;
            },
            function (val) {

            }
        )

        p.setScaleX = function (val) {
            if (this._scaleX == val) return;
            this._scaleX = val;
            if (this._show) this._show.setScaleX(val);
        }

        p.getScaleX = function () {
            return this._scaleX;
        }

        __define(p, "scaleX",
            function () {
                return this._scaleX;
            },
            function (val) {
                val = +val;
                if (this._scaleX == val) return;
                this._scaleX = val;
                if (this._show) this._show.setScaleX(val);
            }
        )

        p.setScaleY = function (val) {
            if (this._scaleY == val) return;
            this._scaleY = val;
            if (this._show) this._show.setScaleY(val);
        }

        p.getScaleY = function () {
            return this._scaleY;
        }

        __define(p, "scaleY",
            function () {
                return this._scaleY;
            },
            function (val) {
                val = +val;
                if (this._scaleY == val) return;
                this._scaleY = val;
                if (this._show) this._show.setScaleY(val);
            }
        )

        p.setRotation = function (val) {
            if (this._rotation == val) return;
            this._rotation = -val * Math.PI / 180;
            if (this._show) this._show.setRotation(val);
        }

        p.getRotation = function () {
            return -this._rotation * 180 / Math.PI;
        }

        __define(p, "rotation",
            function () {
                return -this._rotation * 180 / Math.PI;
            },
            function (val) {
                val = +val;
                if (this._rotation == val) return;
                this._rotation = -val * Math.PI / 180;
                if (this._show) this._show.setRotation(val);
            }
        )

        p.setAnchorPoint = function (x, y) {
            if (this._anchorX == x && this._anchorY == y) return;
            this._anchorX = x;
            this._anchorY = y;
            this._show.setAnchorPoint(this._anchorX, this._anchorY);
        }

        p.getAnchorX = function () {
            return this._anchorX;
        }

        __define(p, "anchorX",
            function () {
                return this._anchorX;
            },
            function (val) {
                val = +val;
                if (this._anchorX == val) return;
                this._anchorX = val;
                this._show.setAnchorPoint(this._anchorX, this._anchorY);
            }
        )
        p.getAnchorY = function () {
            return this._anchorY;
        }

        __define(p, "anchorY",
            function () {
                return this._anchorY;
            },
            function (val) {
                val = +val;
                if (this._anchorY == val) return;
                this._anchorY = val;
                this._show.setAnchorPoint(this._anchorX, this._anchorY);
            }
        )

        p.getMouseX = function () {
            return this._mouseX;
        }

        __define(p, "mouseX",
            function () {
                return this._mouseX;
            },
            function (val) {
                flower.DebugInfo.debug("mouseX 为只读属性", DebugInfo.ERROR);
            }
        )

        p.getMouseY = function () {
            return this._mouseY;
        }

        __define(p, "mouseY",
            function () {
                return this._mouseY;
            },
            function (val) {
                flower.DebugInfo.debug("mouseY 为只读属性", DebugInfo.ERROR);
            }
        )

        p.setBlendMode = function (val) {
            this._blendMode = val;
        }

        __define(p, "blendMode",
            function () {
                return this._blendMode;
            },
            function (val) {
                this._blendMode = val;
            }
        )

        p.setParent = function (val) {
            if (val == null && this._parent != null) {
                if (this._show) this._parent.getContainer().removeChild(this._show);
                this._parent = val;
                if (this.hasEventListener(flower.Event.REMOVE)) {
                    this.dispatchEvent(new flower.Event(flower.Event.REMOVE));
                }
            }
            else {
                this._parent = val;
                var tmp = this._parent.getContainer();
                if (null != tmp) {
                    tmp.addChild(this._show);
                    if (this.hasEventListener(flower.Event.ADD)) {
                        this.dispatchEvent(new flower.Event(flower.Event.ADD));
                    }
                }
            }
        }

        p.getParent = function () {
            return this._parent;
        }

        __define(p, "parent",
            function () {
                return this._parent;
            },
            function (val) {
                flower.DebugInfo.debug("parent 为只读属性", DebugInfo.ERROR);
            }
        )

        p.setStage = function (stage) {
            if (this._stage != stage) {
                this._stage = stage;
                if (this._stage) {
                    if (this.hasEventListener(flower.Event.ADD_TO_STAGE)) {
                        this.dispatchEvent(new flower.Event(flower.Event.ADD_TO_STAGE));
                    }
                }
                else {
                    if (this.hasEventListener(flower.Event.REMOVE_FROM_STAGE)) {
                        this.dispatchEvent(new flower.Event(flower.Event.REMOVE_FROM_STAGE));
                    }
                }
            }
        }

        __define(p, "stage",
            function () {
                return this._stage;
            },
            function (val) {
                flower.DebugInfo.debug("stage 为只读属性", DebugInfo.ERROR);
            }
        )

        p.setZorder = function (val) {
            if (this._zOrder == val) return;
            this._zOrder = val;
            if (this._show) this._show.setLocalZOrder(this._zOrder);
        }

        p.setLocalZOrder = function (val) {
            if (this._zOrder == val) return;
            this._zOrder = val;
            if (this._show) this._show.setLocalZOrder(this._zOrder);
        }

        __define(p, "zOrder",
            function () {
                return this._zOrder;
            },
            function (val) {
                val = +val;
                if (this._zOrder == val) return;
                this._zOrder = val;
                if (this._show) this._show.setLocalZOrder(this._zOrder);
            }
        )

        p.setTag = function (val) {
            this._tag = val;
        }

        p.getTag = function () {
            return this._tag;
        }

        __define(p, "tag",
            function () {
                return this._tag;
            },
            function (val) {
                this._tag = val;
            }
        )

        p.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this._parent) this._parent.removeChild(this);
        }

        DisplayObject.sid = 0;

        return DisplayObject;
    })(flower.EventDispatcher);
    flower.DisplayObject = DisplayObject;
})(flower || (flower = {}));
