/**
 * Created by huitao on 2015/5/13.
 */

module as3
{
    export class Capabilities
    {
        private _avHardwareDisable : boolean;
        public get avHardwareDisable():boolean
        {
            return false;
        }
        hasAccessibility : boolean;
        public get hasAccessibility():boolean
        {
            return false;
        }
        private _hasAudio : boolean;
        public get hasAudio():boolean
        {
            return false;
        }
        private _hasAudioEncoder : boolean;
        public get hasAudioEncoder():boolean
        {
            return false;
        }
        private _hasEmbeddedVideo : boolean;
        public get hasEmbeddedVideo():boolean
        {
            return false;
        }
        private _hasIME : boolean;
        public get hasIME():boolean
        {
            return false;
        }

        private _hasMP3 : boolean;
        public get hasMP3():boolean
        {
            return false;
        }

        private _hasPrinting : boolean;
        public get hasPrinting():boolean
        {
            return false;
        }

        private _hasScreenBroadcast : boolean;
        public get hasScreenBroadcast():boolean
        {
            return false;
        }
        private _hasScreenPlayback : boolean;
        public get hasScreenPlayback():boolean
        {
            return false;
        }
        private _hasStreamingAudio : boolean;
        public get hasStreamingAudio():boolean
        {
            return false;
        }
        private _hasStreamingVideo : boolean;
        public get hasStreamingVideo():boolean
        {
            return false;
        }
        private _hasTLS : boolean;
        public get hasTLS():boolean
        {
            return false;
        }
        private _hasVideoEncoder : boolean;
        public get hasVideoEncoder():boolean
        {
            return false;
        }
        private _isDebugger : boolean;
        public get isDebugger():boolean
        {
            return false;
        }
        private _language : string;
        public get language():string
        {
            return "";
        }
        private _localFileReadDisable : boolean;
        public get localFileReadDisable():boolean
        {
            return false;
        }
        private _manufacturer : string;
        public get manufacturer():string
        {
            return "";
        }
        private _os : string;
        public get os():string
        {
            return "";
        }
        private _pixelAspectRatio : number;
        public get pixelAspectRatio():number
        {
            return 1;
        }
        private _playerType : string = "Desktop";
        public get playerType():string
        {
            return this._playerType;
        }
        private _screenColor : string;
        public get screenColor():string
        {
            return "";
        }

        private _screenDPI : number;
        public get screenDPI():number
        {
            return 0;
        }
        private _screenResolutionX : number;
        public get screenResolutionX():number
        {
            return 0;
        }
        private _screenResolutionY : number;
        public get screenResolutionY():number
        {
            return 1;
        }
        private _serverString : string;
        public get serverString():string
        {
            return "";
        }
        private _version : string
        public get version():string
        {
            return "";
        }

        constructor()
        {

        }
    }
}
