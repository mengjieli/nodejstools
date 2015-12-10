var jc;
(function (jc) {
    var DelayCall = (function () {
        function DelayCall() {
        }

        var d = __define, c = DelayCall;
        p = c.prototype;

        DelayCall.calls = [];
        DelayCall.addCall = function (delay, call, owner) {
            var args = [];
            for (var key in arguments) {
                if (key >= 3) args.push(arguments[key]);
            }

            DelayCall.calls.push({
                "delay": delay,
                "call": call,
                "owner": owner,
                "args": args.length == 0 ? null : args
            });
        };
        DelayCall.removeCall = function (call, owner) {
            for (var i = 0; i < DelayCall.calls.length; i++) {
                if (DelayCall.calls[i].call == call && DelayCall.calls[i].owner == owner) {
                    DelayCall.calls.splice(i, 1);
                    i--;
                }
            }
        };
        DelayCall.update = function (delate) {
            for (var i = 0; i < DelayCall.calls.length; i++) {
                DelayCall.calls[i].delay -= delate;
                if (DelayCall.calls[i].delay <= 0) {
                    DelayCall.calls[i].call.apply(DelayCall.calls[i].owner, DelayCall.calls[i].args);
                    DelayCall.calls[i] = null;
                }
            }
            for (i = 0; i < DelayCall.calls.length; i++) {
                if (DelayCall.calls[i] == null) {
                    DelayCall.calls.splice(i, 1);
                    i--;
                }
            }
        };

        return DelayCall;
    })();
    jc.DelayCall = DelayCall;
})(jc || (jc = {}));
