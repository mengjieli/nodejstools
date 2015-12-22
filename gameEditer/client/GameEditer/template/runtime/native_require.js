
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/eui/eui.js",
	"libs/modules/res/res.js",
	"libs/modules/socket/socket.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/PreLoadingPanel.js",
	"bin-debug/components/ImageButton.js",
	"bin-debug/components/file/FileInfo.js",
	"bin-debug/net/VByteArray.js",
	"bin-debug/components/file/LocalFile.js",
	"bin-debug/components/file/LocalFileFormat.js",
	"bin-debug/components/file/LocalFileInfo.js",
	"bin-debug/components/file/LocalFileType.js",
	"bin-debug/components/ui/AlertPanel.js",
	"bin-debug/components/ui/DirectionView.js",
	"bin-debug/components/ui/DirectionViewItem.js",
	"bin-debug/components/ui/FileSelecteView.js",
	"bin-debug/net/GameNet.js",
	"bin-debug/components/ui/direction/DirectionData.js",
	"bin-debug/components/ui/managers/PopManager.js",
	"bin-debug/components/ui/win/WinBgImage.js",
	"bin-debug/data/Config.js",
	"bin-debug/data/EditerData.js",
	"bin-debug/data/contentView/ContentViewData.js",
	"bin-debug/data/contentView/ContentViewEvent.js",
	"bin-debug/data/projectData/AniamationInfo.js",
	"bin-debug/data/projectData/DataInfo.js",
	"bin-debug/data/projectData/ImageInfo.js",
	"bin-debug/data/projectData/ModelInfo.js",
	"bin-debug/data/projectData/ProjectData.js",
	"bin-debug/data/projectData/ProjectDirectionData.js",
	"bin-debug/data/projectdata/spritessheetinfo.js",
	"bin-debug/data/projectData/ViewInfo.js",
	"bin-debug/data/uiData/MenuData.js",
	"bin-debug/data/uiData/MenuEvent.js",
	"bin-debug/data/uiData/PanelData.js",
	"bin-debug/data/uiData/UIData.js",
	"bin-debug/data/uiData/UIDataEvent.js",
	"bin-debug/panels/directionView/ProjectView.js",
	"bin-debug/panels/directionView/contentView/ContentPanel.js",
	"bin-debug/panels/directionView/contentView/ViewContentTabBar.js",
	"bin-debug/panels/directionView/contentView/fileView/aniationEditer/AnimationEditer.js",
	"bin-debug/panels/directionView/contentView/fileView/simpleView/ConentPanelItemBase.js",
	"bin-debug/panels/directionView/contentView/fileView/simpleView/ImageView.js",
	"bin-debug/panels/directionView/contentView/fileView/simpleView/JsonView.js",
	"bin-debug/panels/directionView/contentView/fileView/simpleView/TextView.js",
	"bin-debug/panels/directionView/contentView/fileView/simpleView/XmlView.js",
	"bin-debug/panels/directionView/projectCommand/SaveProjectCommand.js",
	"bin-debug/panels/directionView/projectDirectionView/AddProjectDirectionPanel.js",
	"bin-debug/panels/directionView/projectDirectionView/AddProjectFilePanel.js",
	"bin-debug/panels/directionView/projectDirectionView/ProjectDirectionItem.js",
	"bin-debug/panels/directionView/projectDirectionView/ProjectDirectionView.js",
	"bin-debug/panels/loading/LoadingEvent.js",
	"bin-debug/panels/loading/LoadingView.js",
	"bin-debug/panels/main/MainPanel.js",
	"bin-debug/panels/menu/Menu.js",
	"bin-debug/data/projectdata/fileinfobase.js",
	//----auto game_file_list end----
];

var window = {};

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "noScale",
		contentWidth: 640,
		contentHeight: 960,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:30,textColor:0x00c200,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};