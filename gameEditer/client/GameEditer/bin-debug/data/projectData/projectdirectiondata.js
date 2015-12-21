/**
 *
 * @author
 *
 */
var ProjectDirectionData = (function () {
    function ProjectDirectionData() {
    }
    var d = __define,c=ProjectDirectionData;p=c.prototype;
    ProjectDirectionData.data = [
        {
            "name": "model",
            "desc": "模块",
            "src": "model",
            "parent": null,
            "depth": 0
        },
        {
            "name": "view",
            "desc": "视图",
            "src": "view",
            "parent": null,
            "depth": 0
        },
        {
            "name": "css",
            "desc": "样式",
            "src": "view/css",
            "parent": "view",
            "depth": 1
        },
        {
            "name": "buttonCss",
            "desc": "按钮样式",
            "src": "view/css/button",
            "parent": "css",
            "depth": 2
        },
        {
            "name": "data",
            "desc": "按钮样式",
            "src": "data",
            "parent": null,
            "depth": 0
        },
        {
            "name": "resource",
            "desc": "资源",
            "src": "resource",
            "parent": null,
            "depth": 0
        },
        {
            "name": "animation",
            "desc": "动画",
            "src": "resource/animation",
            "parent": "resource",
            "depth": 1
        },
        {
            "name": "image",
            "desc": "图片",
            "src": "resource/image",
            "parent": "resource",
            "depth": 1
        },
        {
            "name": "spritesSheet",
            "desc": "SpritesSheet",
            "src": "resource/spritesSheet",
            "parent": "resource",
            "depth": 1
        }
    ];
    return ProjectDirectionData;
})();
egret.registerClass(ProjectDirectionData,"ProjectDirectionData");
