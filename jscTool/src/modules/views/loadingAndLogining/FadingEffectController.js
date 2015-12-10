/*
**文字显示效果控制 2015-09-01 shenwei
*/
var FadingEffectController = cc.Class.extend({

    _owner : null,
    _action : null,
    _duration : null,
    _direction : null,
    _distance : null,
    _originPo : null,

    ctor : function(target, duration, direction, distance)
    {
        if(!target)
        {
            cc.error("效果显示对象非法");
            return;
        }

        this._owner = target;
        this._target = target;
        this._duration = duration;
        this._direction = direction;
        this._distance = distance;
        this._originPo = cc.p(target.x, target.y);

        this.play();
    },

    play : function()
    {
        this._owner.stopAllActions();
        var endPo = this._originPo;
        this._owner.setOpacity(0);
        var beginPo = this.getBeginPoByMoveDirection(this._owner, this._direction, this._distance);
        this._owner.x = beginPo.x;
        this._owner.y = beginPo.y;

        this._action = this._owner.runAction(cc.Sequence(
            cc.Spawn(
                cc.moveTo(this._duration, endPo.x, endPo.y),
                cc.fadeTo(this._duration, 255)
            )
        ));
    },

    getBeginPoByMoveDirection : function(target, direction, distance)
    {
        if(!target) return;
        distance = distance < 0 ? 0 : distance;
        var beginPo = cc.p(0, 0);
        switch(direction)
        {
            case FADING_EFFECT_DIR.LEFT_TO_RIGHT:
                beginPo.x = target.x - distance;
                beginPo.y = target.y;
                break;

            case FADING_EFFECT_DIR.RIGHT_TO_LEFT:
                beginPo.x = target.x + distance;
                beginPo.y = target.y;
                break;

            case FADING_EFFECT_DIR.UP_TO_DOWN:
                beginPo.x = target.x;
                beginPo.y = target.y + distance;
                break;

            case FADING_EFFECT_DIR.DOWN_TO_UP:
                beginPo.x = target.x;
                beginPo.y = target.y - distance;
                break;

            default:
                break;
        }

        return beginPo;
    },

    destroy : function()
    {
        this._owner.stopAllActions();
        this._action = null;
        this._duration = null;
        this._direction = null;
        this._distance = null;
        this._originPo = null;
    }
});

//方向,目前只处理单向维度
var FADING_EFFECT_DIR = {};
FADING_EFFECT_DIR.UNKNOWN = -1;
FADING_EFFECT_DIR.LEFT_TO_RIGHT = 0;
FADING_EFFECT_DIR.RIGHT_TO_LEFT = 1;
FADING_EFFECT_DIR.UP_TO_DOWN = 2;
FADING_EFFECT_DIR.DOWN_TO_UP = 3;
//默认效果时间
FadingEffectController.DEFAULT_EFFECT_DURATION = 1.2;
//默认效果位移
FadingEffectController.DEFAULT_EFFECT_DISTANCE = 50;
