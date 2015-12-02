/**
 * Created by cgMu on 2015/11/10.
 */

var ScrolItem = cc.Node.extend({
    _ui:null,
    _touchPanel:null,

    ctor: function () {
        this._super();

        this._ui = ccs.load("res/images/ui/PayModule/ScrolItem.json","res/images/ui/").node;
        this.addChild( this._ui );

        var panel_bg = this._ui.getChildByName('Panel_1');

        var title_bg = panel_bg.getChildByName("Image_1");
        title_bg.ignoreContentAdaptWithSize(true);
        this._touchPanel = title_bg;

        var title = panel_bg.getChildByName("Text_1");
        title.ignoreContentAdaptWithSize(true);

        var name = panel_bg.getChildByName("Text_2");
        name.ignoreContentAdaptWithSize(true);

        var counts = panel_bg.getChildByName("Text_3");
        counts.ignoreContentAdaptWithSize(true);

        var icon = panel_bg.getChildByName("Image_2");
        icon.ignoreContentAdaptWithSize(true);

        var cost = panel_bg.getChildByName("Text_4");
        cost.ignoreContentAdaptWithSize(true);
    }

});