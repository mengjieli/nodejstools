/**
 * Created by Administrator on 2015/10/13.
 * 动作管理器
 */


ActionType = {};

ActionType.stand = 1;
ActionType.run = 2;
ActionType.skill = 3;
ActionType.die = 4;
ActionType.upgrade = 5;
ActionType.Hurt = 6;

var ActionManager = function( owner )
{

    var _me = this;
    var _owner = owner;                         //动作拥有者
    var _actions = null;                        //动作实例
    var _actionType = ActionType.stand;         //当前动作

    var init = function()
    {
        _actions = {};

        _actions[ActionType.stand] = new StandAction( _owner, actionEndCallBack, _me );
        _actions[ActionType.run] = new RunAction( _owner, actionEndCallBack, _me );
        _actions[ActionType.skill] = new SkillAction( _owner, actionEndCallBack, _me );
        _actions[ActionType.die] = new DieAction( _owner, actionEndCallBack, _me );
        _actions[ActionType.upgrade] = new UpgradeAction( _owner, actionEndCallBack, _me );
        _actions[ActionType.Hurt] = new HurtAction( _owner, actionEndCallBack, _me );
    }

    /*
     * action 数据结构
     *｛
     *  type:           动作类型
     *  data:           附带数据，数据内容根据各个动作所变
     * ｝
     */
    this.runAction = function( action )
    {
        var nextAction = _actions[action.type];
        if( nextAction == null ) return;

        //当前动作是否可以结束
        var currentAction = _actions[ _actionType ];
        if(!currentAction.isFinish()) return;

        _actionType = action.type;
        currentAction.exitAction();
        nextAction.runAction( action.data );
    }

    //动作结束回调
    var actionEndCallBack = function()
    {
        _me.runAction( {type:ActionType.stand} );
    }


    init();

}