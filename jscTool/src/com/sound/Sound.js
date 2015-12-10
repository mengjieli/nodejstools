function Sound() {
    this.ctor.apply(this, arguments);
};

Sound.prototype =
{
    ctor: function () {
    }
};
Sound.instance;
Sound.getInstance = function () {
    if (!Sound.instance) Sound.instance = new Sound();
    return Sound.instance;
};
Sound.sounds = {};
Sound.addSound = function (url) {
    if (Sound.sounds[url]) return;
    Sound.sounds[url] = true;
    cc.log("预加载音效：" + url);
    cc.AudioEngine.getInstance().preloadEffect(url);
};
Sound.deleteSound = function (url) {
    if (Sound.sounds[url]) {
        delete Sound.sounds[url];
    }
    else {
        return;
    }
    cc.log("删除音效：" + url);
    cc.AudioEngine.getInstance().unloadEffect(url);
};
Sound.playSound = function (url) {
    cc.log("play sound:" + url);
    if (!Sound.sounds[url]) {
        cc.log("[错误] 没有提前加载的音效：" + url);
    }
    return cc.AudioEngine.getInstance().playEffect(url);
};
Sound.stopSound = function (id) {
    cc.AudioEngine.getInstance().stopEffect(id);
};
Sound.bgmVlumeEndBack = null;
Sound.bgmVlumeEndBackOwner = null;
Sound.playBGM = function (url) {
    return 0;
    return cc.AudioEngine.getInstance().playMusic(url);
};
Sound.setBGMVolume = function (val) {
    cc.AudioEngine.getInstance().setMusicVolume(val);
};
Sound.setBGMVolumeTween = function (from, to, endBack, endOwner) {
    Sound.setBGMVolume(from);
    Sound.bgmVlumeEndBack = endBack;
    Sound.bgmVlumeEndBackOwner = endOwner;
};
Sound.setBGMVolumeEnd = function () {
    if (Sound.bgmVlumeEndBack != null) Sound.bgmVlumeEndBack.apply(Sound.bgmVlumeEndBackOwner);
};
Sound.stopBGM = function (id) {
    cc.AudioEngine.getInstance().stopMusic(id);
};
Sound.extend = extendClass;
