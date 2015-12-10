var jc;
(function (jc) {
    var CallLater = (function () {
        function CallLater() {
        }

        var d = __define, c = CallLater;
        p = c.prototype;

        CallLater.calls = [];
        CallLater.add = function (call, owner) {
            var args = [];
            for (var key in arguments) {
                if (key >= 2) args.push(arguments[key]);
            }

            for (var i = 0; i < CallLater.calls.length; i++) {
                if (CallLater.calls[i].call == call && CallLater.calls[i].owner == owner) {
                    CallLater.calls[i].args = args.length == 0 ? null : args;
                    return;
                }
            }
            CallLater.calls.push({
                "call": call,
                "owner": owner,
                "args": args.length == 0 ? null : args
            });
        }

        CallLater.del = function (call, owner) {
            for (var i = 0; i < CallLater.calls.length; i++) {
                if (CallLater.calls[i].call == call && CallLater.calls[i].owner == owner) {
                    CallLater.calls.splice(i, 1);
                    return;
                }
            }
        }

        CallLater.run = function () {
            var copy = CallLater.calls;
            CallLater.calls = [];
            for (var i = 0; i < copy.length; i++) {
                copy[i].call.apply(copy[i].owner, copy[i].args);
            }
        }

        return CallLater;
    })();
    jc.CallLater = CallLater;
})(jc || (jc = {}));
