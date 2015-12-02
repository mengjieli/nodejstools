/**
 * Created by zhouyulong on 2015/5/25.
 * MD5
 */
function hexMd5StringAsUtf8(str){
    var words = [ 0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476 ];

    var chunk = [];
    var bitLength = 0;

    var push = function(by){
        chunk.push(by);

        if(chunk.length < 64){
            return;
        }

        var temp = words.slice(0);

        var step = function(i, k, r){
            var f = fspec[i >>> 4](temp[(65 - i) % 4], temp[(66 - i) % 4], temp[(67 - i) % 4]);
            var g = gspec[i >>> 4](i);

            var w = 0;
            for(var j = 0; j < 4; ++j){
                w |= chunk[g * 4 + j] << j * 8;
            }
            w += temp[(64 - i) % 4] + f + k;
            w = (w << r) | (w >>> (32 - r));
            temp[(64 - i) % 4] = temp[(65 - i) % 4] + w;
        };
        var fspec = [
            function(b, c, d){ return (b & c) | (~b & d); },
            function(b, c, d){ return (d & b) | (~d & c); },
            function(b, c, d){ return b ^ c ^ d; },
            function(b, c, d){ return c ^ (b | ~d); }
        ];
        var gspec = [
            function(i){ return i; },
            function(i){ return (5 * i + 1) & 0x0F; },
            function(i){ return (3 * i + 5) & 0x0F; },
            function(i){ return (7 * i) & 0x0F; }
        ];

        step( 0, 0xD76AA478,  7);
        step( 1, 0xE8C7B756, 12);
        step( 2, 0x242070DB, 17);
        step( 3, 0xC1BDCEEE, 22);
        step( 4, 0xF57C0FAF,  7);
        step( 5, 0x4787C62A, 12);
        step( 6, 0xA8304613, 17);
        step( 7, 0xFD469501, 22);
        step( 8, 0x698098D8,  7);
        step( 9, 0x8B44F7AF, 12);
        step(10, 0xFFFF5BB1, 17);
        step(11, 0x895CD7BE, 22);
        step(12, 0x6B901122,  7);
        step(13, 0xFD987193, 12);
        step(14, 0xA679438E, 17);
        step(15, 0x49B40821, 22);

        step(16, 0xF61E2562,  5);
        step(17, 0xC040B340,  9);
        step(18, 0x265E5A51, 14);
        step(19, 0xE9B6C7AA, 20);
        step(20, 0xD62F105D,  5);
        step(21, 0x02441453,  9);
        step(22, 0xD8A1E681, 14);
        step(23, 0xE7D3FBC8, 20);
        step(24, 0x21E1CDE6,  5);
        step(25, 0xC33707D6,  9);
        step(26, 0xF4D50D87, 14);
        step(27, 0x455A14ED, 20);
        step(28, 0xA9E3E905,  5);
        step(29, 0xFCEFA3F8,  9);
        step(30, 0x676F02D9, 14);
        step(31, 0x8D2A4C8A, 20);

        step(32, 0xFFFA3942,  4);
        step(33, 0x8771F681, 11);
        step(34, 0x6D9D6122, 16);
        step(35, 0xFDE5380C, 23);
        step(36, 0xA4BEEA44,  4);
        step(37, 0x4BDECFA9, 11);
        step(38, 0xF6BB4B60, 16);
        step(39, 0xBEBFBC70, 23);
        step(40, 0x289B7EC6,  4);
        step(41, 0xEAA127FA, 11);
        step(42, 0xD4EF3085, 16);
        step(43, 0x04881D05, 23);
        step(44, 0xD9D4D039,  4);
        step(45, 0xE6DB99E5, 11);
        step(46, 0x1FA27CF8, 16);
        step(47, 0xC4AC5665, 23);

        step(48, 0xF4292244,  6);
        step(49, 0x432AFF97, 10);
        step(50, 0xAB9423A7, 15);
        step(51, 0xFC93A039, 21);
        step(52, 0x655B59C3,  6);
        step(53, 0x8F0CCC92, 10);
        step(54, 0xFFEFF47D, 15);
        step(55, 0x85845DD1, 21);
        step(56, 0x6FA87E4F,  6);
        step(57, 0xFE2CE6E0, 10);
        step(58, 0xA3014314, 15);
        step(59, 0x4E0811A1, 21);
        step(60, 0xF7537E82,  6);
        step(61, 0xBD3AF235, 10);
        step(62, 0x2AD7D2BB, 15);
        step(63, 0xEB86D391, 21);

        for(var i = 0; i < 4; ++i){
            words[i] += temp[i];
            words[i] &= 0xFFFFFFFF;
        }

        chunk.length = 0;
    };

    for(var i = 0; i < str.length; ++i){
        var codePoint = str.charCodeAt(i);
        if((0xD800 <= codePoint) && (codePoint < 0xDC00)){
            var leading = codePoint & 0x3FF;
            var trailing = str.charCodeAt(++i) & 0x3FF;
            codePoint = ((leading << 10) | trailing) + 0x10000;
        }
        if(codePoint < 0x80){ // 7 位
            push(codePoint);
            bitLength += 8;
        } else if(codePoint < 0x800){ // 11 位 = 5 + 6
            push(((codePoint >>>  6) & 0x1F) | 0xC0);
            push(((codePoint       ) & 0x3F) | 0x80);
            bitLength += 16;
        } else if(codePoint < 0x10000){ // 16 位 = 4 + 6 + 6
            push(((codePoint >>> 12) & 0x0F) | 0xE0);
            push(((codePoint >>>  6) & 0x3F) | 0x80);
            push(((codePoint       ) & 0x3F) | 0x80);
            bitLength += 24;
        } else { // 21 位 = 3 + 6 + 6 + 6
            push(((codePoint >>> 18) & 0x07) | 0xF0);
            push(((codePoint >>> 12) & 0x3F) | 0x80);
            push(((codePoint >>>  6) & 0x3F) | 0x80);
            push(((codePoint       ) & 0x3F) | 0x80);
            bitLength += 32;
        }
    }

    push(0x80);
    while(chunk.length != 56){
        push(0);
    }
    for(var i = 0; i < 8; ++i){
        push(bitLength & 0xFF);
        bitLength >>>= 8;
    }

    var ret = "";
    for(var i = 0; i < 4; ++i){
        var word = words[i];
        for(var j = 0; j < 4; ++j){
            var low = "0123456789abcdef"[word & 0x0F];
            word >>>= 4;
            var high = "0123456789abcdef"[word & 0x0F];
            word >>>= 4;
            ret += high;
            ret += low;
        }
    }
    return ret;
}
