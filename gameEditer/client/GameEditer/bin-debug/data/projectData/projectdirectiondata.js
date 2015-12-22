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
            "depth": 0,
            "more2": {
                "type": "model",
                "desc": "模块",
                "addFloder": true,
                "addFile": true,
                "fresh": true,
                "delete": true
            }
        },
        {
            "name": "view",
            "desc": "视图",
            "src": "view",
            "parent": null,
            "depth": 0,
            "more2": {
                "type": "view",
                "desc": "视图",
                "addFloder": true,
                "addFile": true,
                "fresh": true,
                "delete": true
            }
        },
        {
            "name": "css",
            "desc": "样式",
            "src": "view/css",
            "parent": "view",
            "depth": 1,
            "more2": {
                "type": "css",
                "desc": "样式",
                "addFloder": false,
                "addFile": false,
                "fresh": true,
                "delete": true
            }
        },
        {
            "name": "buttonCss",
            "desc": "按钮样式",
            "src": "view/css/button",
            "parent": "css",
            "depth": 2,
            "more2": {
                "type": "view",
                "desc": "视图",
                "addFloder": true,
                "addFile": true,
                "fresh": true,
                "delete": true
            }
        },
        {
            "name": "data",
            "desc": "数据结构",
            "src": "data",
            "parent": null,
            "depth": 0,
            "more2": {
                "type": "data",
                "desc": "数据结构",
                "addFloder": true,
                "addFile": true,
                "fresh": true,
                "delete": true
            }
        },
        {
            "name": "resource",
            "desc": "资源",
            "src": "resource",
            "parent": null,
            "depth": 0,
            "more2": {
                "type": "resource",
                "desc": "资源",
                "addFloder": false,
                "addFile": false,
                "fresh": false,
                "delete": false
            }
        },
        {
            "name": "animation",
            "desc": "动画",
            "editFlag": true,
            "src": "resource/animation",
            "parent": "resource",
            "depth": 1,
            "more2": {
                "type": "animtion",
                "desc": "逐帧动画",
                "addFloder": true,
                "addFile": true,
                "fresh": true,
                "delete": true
            }
        },
        {
            "name": "spritesSheet",
            "desc": "SpritesSheet",
            "editFlag": true,
            "src": "resource/spritesSheet",
            "parent": "resource",
            "depth": 1,
            "more2": {
                "type": "spritesSheet",
                "desc": "spritesSheet",
                "addFloder": true,
                "addFile": true,
                "fresh": true,
                "delete": true
            }
        },
        {
            "name": "image",
            "desc": "图片",
            "editFlag": true,
            "src": "resource/image",
            "parent": "resource",
            "depth": 1,
            "more2": {
                "type": "image",
                "desc": "图片",
                "addFloder": true,
                "addFile": true,
                "fresh": true,
                "delete": true
            }
        }
    ];
    return ProjectDirectionData;
})();
egret.registerClass(ProjectDirectionData,"ProjectDirectionData");
