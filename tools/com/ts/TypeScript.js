var __define = this.__define || function (o, p, g, s) {
        Object.defineProperty(o, p, {configurable: true, enumerable: true, get: g, set: s});
    };

global.__define = __define;

/*
Example get & set
function File(){
}
global.__define(File.prototype, "content",
    function () {
        return fs.readFileSync(this.url, "utf-8");
    },
    function (val) {
    }
);*/