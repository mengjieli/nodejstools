var jc;
(function (jc) {
    var EnterFrame = (function () {
        function EnterFrame() {
        }

        var d = __define, c = EnterFrame;
        p = c.prototype;

        EnterFrame.enterFrames = [];
        EnterFrame.waitAdd = [];
        EnterFrame.curTime = 0;
        EnterFrame.add = function (call, owner) {
            for (var i = 0; i < EnterFrame.enterFrames.length; i++) {
                if (EnterFrame.enterFrames[i].call == call && EnterFrame.enterFrames[i].owner == owner) {
                    return;
                }
            }
            for (i = 0; i < EnterFrame.waitAdd.length; i++) {
                if (EnterFrame.waitAdd[i].call == call && EnterFrame.waitAdd[i].owner == owner) {
                    return;
                }
            }
            EnterFrame.waitAdd.push({
                "call": call,
                "owner": owner
            });
        };
        EnterFrame.addWithTimeStamp = function (call, owner) {
            for (var i = 0; i < EnterFrame.enterFrames.length; i++) {
                if (EnterFrame.enterFrames[i].call == call && EnterFrame.enterFrames[i].owner == owner) {
                    return;
                }
            }
            for (i = 0; i < EnterFrame.waitAdd.length; i++) {
                if (EnterFrame.waitAdd[i].call == call && EnterFrame.waitAdd[i].owner == owner) {
                    return;
                }
            }
            EnterFrame.waitAdd.push({
                "call": call,
                "owner": owner,
                "timeStamp":true
            });
        };
        EnterFrame.del = function (call, owner) {
            for (var i = 0; i < EnterFrame.enterFrames.length; i++) {
                if (EnterFrame.enterFrames[i].call == call && EnterFrame.enterFrames[i].owner == owner) {
                    EnterFrame.enterFrames.splice(i, 1);
                    return;
                }
            }
            for (i = 0; i < EnterFrame.waitAdd.length; i++) {
                if (EnterFrame.waitAdd[i].call == call && EnterFrame.waitAdd[i].owner == owner) {
                    EnterFrame.waitAdd.splice(i, 1);
                    return;
                }
            }
        };
        EnterFrame.updateFactor = 1;
        EnterFrame.update = function (delate) {
            EnterFrame.curTime += delate;
            jc.CallLater.run();
            jc.DelayCall.update(delate * EnterFrame.updateFactor);
            if (EnterFrame.waitAdd.length) {
                EnterFrame.enterFrames = EnterFrame.enterFrames.concat(EnterFrame.waitAdd);
                EnterFrame.waitAdd = [];
            }
            var copy = EnterFrame.enterFrames;
            for (var i = 0; i < copy.length; i++) {
                if(copy[i].timeStamp) {
                    copy[i].call.apply(copy[i].owner, [EnterFrame.curTime*1000]);
                } else {
                    copy[i].call.apply(copy[i].owner, [delate * EnterFrame.updateFactor]);
                }
            }
        };

        return EnterFrame;
    })();
    jc.EnterFrame = EnterFrame;
})(jc || (jc = {}));