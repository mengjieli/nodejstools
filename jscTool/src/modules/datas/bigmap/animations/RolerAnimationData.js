var Action = {
    "Stand": "stand",
    "Run": "run",
    "Attack": "attack"
}

var Dir = {
    "Right": "Right",
    "RightUp": "RightUp",
    "RightDown": "RightDown",
    "Left": "Left",
    "LeftUp": "LeftUp",
    "LeftDown": "LeftDown"
}

var $ActionDir = {
    "Right": "r",
    "RightUp": "ru",
    "RightDown": "rd",
    "Left": "r",
    "LeftUp": "ru",
    "LeftDown": "rd"
}

var $ActionScale = {
    "Right": {
        x: 1,
        y: 1
    },
    "RightUp": {
        x: 1,
        y: 1
    },
    "RightDown": {
        x: 1,
        y: 1
    },
    "Left": {
        x: -1,
        y: 1
    },
    "LeftUp": {
        x: -1,
        y: 1
    },
    "LeftDown": {
        x: -1,
        y: 1
    }
}

var $rolerActions = {}

/**
 * 生成角色单个动作配置
 * @param id
 * @param action
 * @param data
 */
function getRolerSingleAction(id, action, data) {
    var cfg;
    if (action == "standrd") {
        cfg = {
            plist: "res/fight/rolers/" + id + ".plist",
            name: id + "_000",
            format: "png",
            start: 0,
            end: 12,
            frameRate: 18,
            x: 0,
            y: 0
        };
    } else if (action == "standr") {
        cfg = {
            plist: "res/fight/rolers/" + id + ".plist",
            name: id + "_000",
            format: "png",
            start: 13,
            end: 25,
            frameRate: 18,
            x: 0,
            y: 0
        };
    } else if (action == "standru") {
        cfg = {
            plist: "res/fight/rolers/" + id + ".plist",
            name: id + "_000",
            format: "png",
            start: 26,
            end: 38,
            frameRate: 18,
            x: 0,
            y: 0
        };
    } else if (action == "runrd") {
        cfg = {
            plist: "res/fight/rolers/" + id + ".plist",
            name: id + "_100",
            format: "png",
            start: 0,
            end: 12,
            frameRate: 18,
            x: 0,
            y: 0
        };
    } else if (action == "runr") {
        cfg = {
            plist: "res/fight/rolers/" + id + ".plist",
            name: id + "_100",
            format: "png",
            start: 13,
            end: 25,
            frameRate: 18,
            x: 0,
            y: 0
        };
    } else if (action == "runru") {
        cfg = {
            plist: "res/fight/rolers/" + id + ".plist",
            name: id + "_100",
            format: "png",
            start: 26,
            end: 38,
            frameRate: 18,
            x: 0,
            y: 0
        };
    } else if (action == "attackrd") {
        cfg = {
            plist: "res/fight/rolers/" + id + ".plist",
            name: id + "_200",
            format: "png",
            start: 0,
            end: 24,
            frameRate: 18,
            x: 0,
            y: 0
        };
    } else if (action == "attackr") {
        cfg = {
            plist: "res/fight/rolers/" + id + ".plist",
            name: id + "_200",
            format: "png",
            start: 25,
            end: 49,
            frameRate: 18,
            x: 0,
            y: 0
        };
    } else if (action == "attackru") {
        cfg = {
            plist: "res/fight/rolers/" + id + ".plist",
            name: id + "_200",
            format: "png",
            start: 50,
            end: 74,
            frameRate: 18,
            x: 0,
            y: 0
        };
    }
    if (data) {
        for (var key in data) {
            if (key == "plist") {
                cfg.plist = "res/fight/rolers/" + data.plist + ".plist";
            } else if (key == "name") {
                cfg.name = data.name;
            } else if (key == "format") {
                cfg.format = data.format;
            } else if (key == "start") {
                cfg.start = data.start;
            } else if (key == "end") {
                cfg.end = data.end;
            } else if (key == "frameRate") {
                cfg.frameRate = data.frameRate;
            } else if (key == "x") {
                cfg.x = data.x;
            } else if (key == "y") {
                cfg.y = data.y;
            } else if (key == "anchorX") {
                cfg.anchorX = data.anchorX;
            } else if (key == "anchorY") {
                cfg.anchorY = data.anchorY;
            }
        }
    }
    return cfg;
}

/**
 * 生成角色动作配置文件
 * @param id
 * @param data
 */
function addRolerAction(id, data) {
    var actions = ["standrd", "standr", "standru", "runrd", "runr", "runru", "attackrd", "attackr", "attackru"];
    for (var i = 0; i < actions.length; i++) {
        if (data && !data[actions[i]]) {
            continue;
        }
        $rolerActions[id + actions[i]] = getRolerSingleAction(id, actions[i], data[actions[i]]);
    }
}

addRolerAction(1207001, {
    "standru": {"start": 0, "end": 7,"frameRate":12},
    "standr": {"start": 8, "end": 16,"frameRate":12},
    "standrd": {"start": 17, "end": 24,"frameRate":12},
    "runrd": {"start": 0, "end": 8,"frameRate":12},
    "runr": {"start": 9, "end": 16,"frameRate":12},
    "runru": {"start": 17, "end": 24,"frameRate":12}
});


function RolerAnimationData() {
}

RolerAnimationData.$result = {
    config: null,
    scaleX: 1,
    scaleY: 1
};

/**
 * 获取角色动作配置
 * @param id 角色id
 * @param action 动作表
 * @param dir 动作方向
 * @returns {{action: null, scaleX: number, scaleY: number}|*}
 */
RolerAnimationData.getRolerConfig = function (id, action, dir) {
    var res = RolerAnimationData.$result;
    res.config = $rolerActions[id + action + $ActionDir[dir]];
    var scale = $ActionScale[dir];
    res.scaleX = scale.x;
    res.scaleY = scale.y;
    return res;
}

/**
 * 获取角色动画
 * @param id
 * @param action
 * @param dir
 * @returns {Animation}
 */
RolerAnimationData.getRolerAnimation = function (id, action, dir) {
    var action = RolerAnimationData.getRolerConfig(id, action, dir);
    var animation = new Animation(action.config);
    animation.setScale(action.scaleX, action.scaleY);
    return animation;
}