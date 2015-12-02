var OtherProfile = function () {
    this.id = null; //accountUuid
    this.name = null; //名称
    this.sex = null; //性别
    this.head = null; //头像
}

OtherProfile.prototype.recvProfile = function (accountId, data) {
    this.id = accountId;
    this.name = data.readString();
    //读取属性
    /*
     1         性别
     2         头像
     199         收藏夹
     300         最后登录时间（没登录过置空）
     301         最后离线时间（在线置空）
     302         上次签到时间（UTC 毫秒时间戳）
     303         连续签到天数（累计，例如连续签到一个星期，则该值为 "7"）*/
    var len = data.readInt();
    for (var i = 0; i < len; i++) {
        var type = data.readUint();
        var value = data.readString();
        if (type == 1) {
            this.sex = parseInt(value);
        } else if (type == 2) {
            this.head = value;
        }
    }
}