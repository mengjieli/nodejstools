var ArrayData = function () {
    this.list = [];
    this._length = 0;
}

/**
 * 数组尾部加入元素
 * @param item
 */
ArrayData.prototype.push = function (item) {
    this.list.push(item);
    if (typeof item != "number" && item.setParent) {
        item.setParent(this, "Array");
    }
    this.length = this._length + 1;
}

/**
 * 数组头部加入元素
 */
ArrayData.prototype.shift = function () {
    var item = this.list.shift();
    if (typeof item != "number" && item.setParent) {
        item.setParent(null, null);
    }
    this.length = this._length - 1;
}

/**
 * 从尾部删除
 */
ArrayData.prototype.pop = function () {
    var item = this.list.pop();
    if (typeof item != "number" && item.setParent) {
        item.setParent(null, null);
    }
    this.length = this._length - 1;
}

/**
 * 删除某个元素
 */
ArrayData.prototype.delItemAt = function (index) {
    var item = this.list.shift(index);
    if (typeof item != "number" && item.setParent) {
        item.setParent(null, null);
    }
    this.length = this._length - 1;
}

/**
 * 删除某个特定元素
 */
ArrayData.prototype.delItem = function (key,value) {
    var item;
    for(var i = 0; i < this.list.length; i++) {
        if(this.list[i][key] == value) {
            item = this.list.splice(i,1)[0];
            break;
        }
    }
    if (typeof item != "number" && item.setParent) {
        item.setParent(null, null);
    }
    this.length = this._length - 1;
}

/**
 * 排序
 */
ArrayData.prototype.sort = function () {
    this.list.sort.apply(this.list.sort, arguments);
    this.length = this._length;
}

/**
 * 获取第 index 个元素
 * @param index
 * @returns {*}
 */
ArrayData.prototype.getItemAt = function (index) {
    return this.list[index];
}

/**
 * 查询列表中 属性 key 等于 value 的对象，返回数组
 * @param key
 * @param value
 * @return 数组对象 Array
 */
ArrayData.prototype.getItem = function (key, value) {
    var result = [];
    for (var i = 0; i < this.list.length; i++) {
        if (this.list[i][key] == value) {
            return this.list[i];
        }
    }
    return null;
}

/**
 * 设置第 index 个元素
 * @param index
 * @param item
 */
ArrayData.prototype.setItemAt = function (index, item) {
    if (index >= this._length) {
        GameSDK.Error.show("超出索引范围");
        return;
    }
    if (item == this.list[index]) return;
    if (typeof this.list[index] != "number" && this.list[index].setParent) {
        this.list[index].setParent(null, null);
    }
    this.list[index] = item;
    if (typeof item != "number" && item.setParent) {
        item.setParent(this, "Array");
    }
}

global.ArrayData = ArrayData;
ListenerBase.registerClass(ArrayData);

__define(ArrayData.prototype, "length"
    , function () {
        return this._length;
    }
    , function (val) {
        val = +val | 0;
        this._length = val;
        this.call(GameSDK.Event.PROPERTY_CHANGE, "length");
    }
);

ArrayData.prototype.setParent = function (parent, attributeName) {
    this._parent = parent;
    this._parentAttribute = attributeName;
}

ArrayData.prototype.propertyChange = function (name) {
}

GameSDK.ArrayData = ArrayData;