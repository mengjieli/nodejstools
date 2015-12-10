var MapConfigUtils = function () {
}

MapConfigUtils.maxEarthLevel = null;
/**
 * 获取土地最大等级
 */
MapConfigUtils.getMaxEatrhLevel = function () {
    if (!MapConfigUtils.maxEarthLevel) {
        var max = 0;
        var list = ModuleMgr.inst().getData("ConfigTableUpdator").getConfigTableValueAll("item");
        for (var i = 0; i < list.length; i++) {
            if (list[i].class == 5) {
                max = parseInt(list[i].type) > max ? parseInt(list[i].type) : max;
            }
        }
        MapConfigUtils.maxEarthLevel = max;
    }
    return MapConfigUtils.maxEarthLevel;
}