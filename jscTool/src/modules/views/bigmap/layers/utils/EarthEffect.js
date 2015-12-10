/**
 *
 * @param display
 * @constructor
 */
var EarthEffect = function (display) {
    this.display = display;
    this.start = 0.2;
    this.end = 0.8;
    this.add = 2;
    this.value = 0.8;
    this.speed = -this.add;
    this.call = new IntervalCall(this.update, this, 0.033);
    this.update();
}

//更新
EarthEffect.prototype.update = function () {
    this.value += this.speed * 0.033;
    if (this.value < this.start || this.value > this.end) {
        this.speed = -this.speed;
        if (this.value < this.start) {
            this.value = this.start;
        }
        if (this.value > this.end) {
            this.value = this.end;
        }
    }
    this.display.setOpacity(this.value * 255);
}

EarthEffect.prototype.dispose = function () {
    this.call.clear();
    this.call = null;
    this.display = null;
}