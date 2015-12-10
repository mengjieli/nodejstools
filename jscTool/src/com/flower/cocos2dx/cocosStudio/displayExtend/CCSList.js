var flower;
(function (flower) {

    /**
     _cliper: null,
     _itemClass: null,
     _datas: [],
     _items: null,
     _itemHeight: null,
     _vh: null,
     _posAdd: null,
     _pos: null,
     _dragStartPos: null,
     _dragStartCliperPos: null,
     _backTween: null,
     _backFlag: null,
     _backTime: 0.4,
     _moveFlag: null,
     _moveTween: null,
     _moveLastTime: null,
     _moveSpeed: null,
     _moveInitFlag: null,
     _movePos: null,
     */

    var CCSList = (function (_super) {
        __extends(CCSList, _super);
        function CCSList(width, height, itemClass, itemSize, vh, posAdd) {
            vh = vh == null ? true : vh;
            posAdd = posAdd == null ? false : posAdd;
            this._datas = [];
            this._backTime = 0.4;
            _super.call(this, true, false);
            this.className = flower.ClassName.CCSList;
            this._items = new Array();
            this.setSize(cc.size(width, height));
            this._itemClass = itemClass;
            this._itemHeight = itemSize;
            this._vh = vh;
            this._posAdd = posAdd;
            this._cliper = Cliper.create();
            this._cliper.drawRectMask(0, 0, (vh == false ? (posAdd == true ? 1 : -1) : 1) * width, (vh == true ? (posAdd == false ? -1 : 1) : 1) * height);
            this.addChild(this._cliper);
            this._pos = 0;
            this._backFlag = true;
            this._moveFlag = true;
            this.addEventListener(flower.MouseEvent.MOUSE_DOWN, this.onMouseDown, this);
            this.addEventListener(flower.MouseEvent.CLICK, this.onMouseUp, this);
            this.addEventListener(flower.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
        }
        var d = __define,c=CCSList;p=c.prototype;

        p.onMouseDown = function (e) {
            this._dragStartPos = this._vh == true ? this.getMouseY() : this.getMouseX();
            this._dragStartCliperPos = this._pos;
            if (this._moveFlag) {
                this._moveLastTime = jc.EnterFrame.curTime;
                this._moveSpeed = 0;
                this._movePos = this._pos;
                this._moveInitFlag = false;
                jc.EnterFrame.add(this.recordMove, this);
            }
        }

        p.recordMove = function (delate) {
            if (delate < 0 || (jc.EnterFrame.curTime - this._moveLastTime > 0.2)) {
                this._moveInitFlag = true;
                this._moveSpeed = (this._pos - this._movePos) / (jc.EnterFrame.curTime - this._moveLastTime);
                this._moveLastTime = jc.EnterFrame.curTime;
                this._movePos = this._pos;
            }
        }

        p.onMouseMove = function (e) {
            if (this._backTween) {
                this._backTween.dispose();
                this._backTween = null;
            }
            if (this._moveTween) {
                this._moveTween.dispose();
                this._moveTween = null;
            }
            this._pos = this._dragStartCliperPos - this._dragStartPos + (this._vh == true ? this.getMouseY() : this.getMouseX());
            if (this._backFlag == false) {
                if (this._posAdd) {
                    if (this._pos > 0) this._pos = 0;
                    else if (this._pos < -this._datas.length * this._itemHeight + (this._vh == true ? this._height : this._width)) this._pos = -this._datas.length * this._itemHeight + (this._vh == true ? this._height : this._width);
                }
                else {
                    if (this._pos < 0) this._pos = 0;
                    else if (this._pos > this._datas.length * this._itemHeight - (this._vh == true ? this._height : this._width)) this._pos = this._datas.length * this._itemHeight - (this._vh == true ? this._height : this._width);
                }
            }
            this.update();
            if (this._moveFlag == true && this._moveInitFlag == false && this._pos != this._movePos) {
                this.recordMove(-1);
            }
        }

        p.onMouseUp = function (e) {
            var toPos;
            this.backToBegin();
            if (this._moveFlag) {
                jc.EnterFrame.del(this.recordMove, this);
                if (this._backTween == null) {
                    if (this._moveSpeed) {
                        var to = this._moveSpeed + this._pos;
                        var t = (this._moveSpeed < 0 ? -this._moveSpeed : this._moveSpeed) / 200;
                        var speed = (to - this._pos) / (this._moveSpeed / 200);
                        var a = speed / t;
                        this._moveTween = Tween.numberTo(t, {
                            from: this._pos,
                            to: to,
                            onUpdate: this.moveTweenChange,
                            owner: this,
                            ease: Ease.EASE_OUT
                        });
                    }
                }
            }
        }

        p.moveTweenChange = function (val) {
            this._pos = val;
            var flag = false;
            if (this._posAdd) {
                if (this._pos > 0) {
                    flag = true;
                    this._pos = 0;
                }
                else if (this._pos < -this._datas.length * this._itemHeight + (this._vh == true ? this._height : this._width)) {
                    flag = true;
                    this._pos = -this._datas.length * this._itemHeight + (this._vh == true ? this._height : this._width);
                }
            }
            else {
                if (this._pos < 0) {
                    flag = true;
                    this._pos = 0;
                }
                else if (this._pos > this._datas.length * this._itemHeight - (this._vh == true ? this._height : this._width)) {
                    flag = true;
                    this._pos = this._datas.length * this._itemHeight - (this._vh == true ? this._height : this._width);
                }
            }
            this.update();
            if (flag) {
                if (this._moveTween) {
                    this._moveTween.dispose();
                    this._moveTween = null;
                }
            }
        }

        p.backTweenChange = function (val) {
            this._pos = Math.floor(val);
            this.update();
        }

        p.addItem = function (data) {
            this._datas.push(data);
            CallLater.add(this.update, this);
        }

        p.addItemAt = function (data, index) {
            this._datas.splice(index, 0, data);
            CallLater.add(this.update, this);
        }

        p.delItem = function (data) {
            for (var i = 0; i < this._datas.length; i++) {
                if (this._datas[i] == data) {
                    this._datas.splice(i, 1);
                    break;
                }
            }
            CallLater.add(this.update, this);
        }

        p.delItemAt = function (index) {
            this._datas.splice(index, 1);
            CallLater.add(this.update, this);
        }

        p.setBack = function (flag) {
            this._backFlag = flag;
        }

        p.setBackTime = function (t) {
            this._backTime = t;
        }

        p.update = function () {
            var start;
            var pos;
            start = Math.floor((this._posAdd == true ? -1 : 1) * this._pos / this._itemHeight);
            pos = this._pos + (this._posAdd == true ? 1 : -1) * start * this._itemHeight;
            var len = this._datas.length;
            var index = 0;
            var item;
            var useList = this._items.slice(0, this._items.length);
            var i;
            for (i = start; i < len; i++) {
                if (i < 0) {
                    pos += (this._posAdd == true ? 1 : -1) * this._itemHeight;
                    continue;
                }
                for (var c = 0; c < useList.length; c++) {
                    if (useList[c].data == this._datas[i]) {
                        useList.splice(c, 1);
                        break;
                    }
                }
                pos += (this._posAdd == true ? 1 : -1) * this._itemHeight;
                if ((this._posAdd && pos >= (this._vh == true ? this._height : this._width)) || (!this._posAdd && pos <= -(this._vh == true ? this._height : this._width))) break;
            }
            pos = this._pos + (this._posAdd == true ? 1 : -1) * start * this._itemHeight;
            for (i = start; i < len; i++) {
                item = null;
                if (i < 0) {
                    pos += (this._posAdd == true ? 1 : -1) * this._itemHeight;
                    continue;
                }
                if (this._items.length) {
                    for (var f = 0; f < this._items.length; f++) {
                        if ((this._items[f]).data == this._datas[i]) {
                            item = this._items[f];
                            break;
                        }
                    }
                    if (item == null && useList.length) {
                        item = useList.pop();
                        item.setData(this._datas[i]);
                    }
                }
                if (item == null) {
                    item = new this._itemClass();
                    this._items.push(item);
                    this._cliper.addChild(item);
                    item.setData(this._datas[i]);
                }
                item.setVisible(true);
                if (this._vh) {
                    if (this._posAdd == false) item.setY(pos - this._itemHeight);
                    else  item.setY(pos);
                }
                else {
                    if (this._posAdd == false) item.setX(pos - this._itemHeight);
                    else  item.setX(pos);
                }
                pos += (this._posAdd == true ? 1 : -1) * this._itemHeight;
                index++;
                if ((this._posAdd && pos >= (this._vh == true ? this._height : this._width)) || (!this._posAdd && pos <= -(this._vh == true ? this._height : this._width))) break;
            }
            for (i = 0; i < useList.length; i++) {
                (useList[i]).setVisible(false);
            }
        }

        p.backToBegin = function () {
            var toPos;
            if (this._backFlag == true) {
                if (this._posAdd) {
                    if (this._pos > 0) this._backTween = Tween.numberTo(this._backTime, {
                        from: this._pos,
                        to: 0,
                        onUpdate: this.backTweenChange,
                        owner: this,
                        ease: Ease.EASE_OUT
                    });
                    else if (this._pos < -this._datas.length * this._itemHeight + (this._vh == true ? this._height : this._width)) {
                        toPos = -this._datas.length * this._itemHeight + (this._vh == true ? this._height : this._width);
                        if (toPos > 0) toPos = 0;
                        this._backTween = Tween.numberTo(this._backTime, {
                            from: this._pos,
                            to: toPos,
                            onUpdate: this.backTweenChange,
                            owner: this,
                            ease: Ease.EASE_OUT
                        });
                    }
                }
                else {
                    if (this._pos < 0) this._backTween = Tween.numberTo(this._backTime, {
                        from: this._pos,
                        to: 0,
                        onUpdate: this.backTweenChange,
                        owner: this,
                        ease: Ease.EASE_OUT
                    });
                    else if (this._pos > this._datas.length * this._itemHeight - (this._vh == true ? this._height : this._width)) {
                        toPos = this._datas.length * this._itemHeight - (this._vh == true ? this._height : this._width);
                        if (toPos < 0) toPos = 0;
                        this._backTween = Tween.numberTo(this._backTime, {
                            from: this._pos,
                            to: toPos,
                            onUpdate: this.backTweenChange,
                            owner: this,
                            ease: Ease.EASE_OUT
                        });
                    }
                }
            }
        }

        p.getListElemAt = function (type) {
            for (var i = 0; i < this._datas.length; ++i) {
                if (parseInt(this._datas[i].type) == type) {
                    return this._datas[i];
                }
            }
            return null;
        }

        p.getListElemNum = function () {
            return this._datas.length;
        }

        p.eraseData = function () {
            this._cliper.removeAllChilds();
            this._datas.length = 0;
            this._items.length = 0;
            this._pos = 0;
            this.update();
        }

        CCSList.create = function (width, height, itemClass, itemSize, vh, posAdd) {
            vh = vh == null ? true : vh;
            posAdd = posAdd == null ? false : posAdd;
            return new CCSList(width, height, itemClass, itemSize, vh, posAdd);
        };

        return CCSList;
    })(flower.CCSBase);
    flower.CCSList = CCSList;
})(flower || (flower = {}));
