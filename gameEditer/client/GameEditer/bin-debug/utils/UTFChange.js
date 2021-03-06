/**
 *
 * @author
 *
 */
var UTFChange = (function () {
    function UTFChange() {
    }
    var d = __define,c=UTFChange;p=c.prototype;
    UTFChange.numberToString = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < 0)
                arr[i] += 256;
        }
        var res = [];
        for (i = 0; i < arr.length; i++) {
            if (arr[i] == 0)
                break;
            if ((arr[i] & 128) == 0)
                res.push(arr[i]); //1位
            else if ((arr[i] & 64) == 0)
                res.push(arr[i] % 128); //1位
            else if ((arr[i] & 32) == 0) {
                res.push((arr[i] % 32) * 64 + (arr[i + 1] % 64));
                i++;
            }
            else if ((arr[i] & 16) == 0) {
                res.push((arr[i] % 16) * 64 * 64 + (arr[i + 1] % 64) * 64 + (arr[i + 2] % 64));
                i++;
                i++;
            }
            else if ((arr[i] & 8) == 0) {
                res.push((arr[i] % 8) * 64 * 64 * 64 + (arr[i + 1] % 64) * 64 * 64 + (arr[i + 2] % 64) * 64 + (arr[i + 2] % 64));
                i++;
                i++;
                i++;
            }
        }
        var str = "";
        for (i = 0; i < res.length; i++) {
            str += String.fromCharCode(res[i]);
        }
        return str;
    };
    return UTFChange;
})();
egret.registerClass(UTFChange,"UTFChange");
