"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _electron=require("electron"),_default={on:(e,r)=>_electron.ipcMain.on("DISCORD_"+e,r),removeListener:(e,r)=>_electron.ipcMain.removeListener("DISCORD_"+e,r),reply:(e,r,...t)=>e.sender.send("DISCORD_"+r,...t)};exports.default=_default,module.exports=exports.default;