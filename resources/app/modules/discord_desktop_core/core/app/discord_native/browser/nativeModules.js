"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.injectModuleUpdater=injectModuleUpdater,exports.injectUpdater=injectUpdater;const childProcess=require("child_process"),electron=require("electron"),{once:once}=require("events"),path=require("path"),process=require("process"),{NATIVE_MODULES_GET_PATHS:NATIVE_MODULES_GET_PATHS,NATIVE_MODULES_INSTALL:NATIVE_MODULES_INSTALL,NATIVE_MODULES_FINISH_UPDATER_BOOTSTRAP:NATIVE_MODULES_FINISH_UPDATER_BOOTSTRAP,NATIVE_MODULES_GET_HAS_NEW_UPDATER:NATIVE_MODULES_GET_HAS_NEW_UPDATER}=require("../common/constants").IPCEvents;let injectedModuleUpdater=null,injectedUpdater=null;function injectModuleUpdater(e){injectedModuleUpdater=e}function injectUpdater(e){injectedUpdater=e}async function newUpdaterInstall(e,t){try{await e.installModule(t),await e.commitModules()}catch(e){throw new Error(`Failed to install ${t}: ${e}`)}}electron.ipcMain.on(NATIVE_MODULES_GET_PATHS,e=>{e.returnValue={mainAppDirname:global.mainAppDirname,browserModulePaths:require("module").globalPaths}}),electron.ipcMain.handle(NATIVE_MODULES_INSTALL,async(e,t)=>{var n;const r=null===(n=injectedUpdater)||void 0===n?void 0:n.getUpdater();if(null!=r)return newUpdaterInstall(r,t);const o=injectedModuleUpdater;if(!o)throw new Error("Module updater is not available!");const a=new Promise((e,n)=>{const r=a=>{a.name===t&&(o.events.removeListener(o.INSTALLED_MODULE,r),a.succeeded?e():n(new Error("Failed to install "+t)))};o.events.on(o.INSTALLED_MODULE,r)});o.install(t,!1),await a}),electron.ipcMain.on(NATIVE_MODULES_GET_HAS_NEW_UPDATER,e=>{var t;e.returnValue=null!=(null===(t=injectedUpdater)||void 0===t?void 0:t.getUpdater())}),electron.ipcMain.on(NATIVE_MODULES_FINISH_UPDATER_BOOTSTRAP,async(e,[t,n,r])=>{if("number"!=typeof t||"number"!=typeof n||"number"!=typeof r)throw new Error("You tried.");const o=`${t}.${n}.${r}`,a=path.join(path.dirname(process.execPath),"..","app-"+o,path.basename(process.execPath));electron.app.once("will-quit",()=>{childProcess.spawn(a,[],{detached:!0,stdio:"inherit"})}),console.log(`Restarting from ${path.resolve(process.execPath)} to ${path.resolve(a)}`),electron.app.quit()});