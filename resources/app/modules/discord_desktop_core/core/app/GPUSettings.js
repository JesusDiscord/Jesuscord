"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getEnableHardwareAcceleration=getEnableHardwareAcceleration,exports.setEnableHardwareAcceleration=setEnableHardwareAcceleration;var _electron=require("electron"),_appSettings=require("./appSettings");const settings=(0,_appSettings.getSettings)();function getEnableHardwareAcceleration(){return settings.get("enableHardwareAcceleration",!0)}function setEnableHardwareAcceleration(e){settings.set("enableHardwareAcceleration",e),settings.save(),_electron.app.relaunch(),_electron.app.exit(0)}