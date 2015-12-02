var os = require("os");

var System = {}

System.WINDOWS = "windows";
System.MACOS = "mac os";

System.platform = os.platform().slice(0, 3) == "win" ? System.WINDOWS : System.MACOS;

global.System = System;