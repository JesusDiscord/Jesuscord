"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.injectFeaturesBackend=injectFeaturesBackend;const electron=require("electron"),{FEATURES_GET_BROWSER_FEATURES:FEATURES_GET_BROWSER_FEATURES}=require("../common/constants").IPCEvents;let injectedFeatures=null;function getFeatures(){return null!=injectedFeatures?injectedFeatures:{getSupported:()=>[],supports:()=>!1,declareSupported:()=>{}}}function injectFeaturesBackend(e){injectedFeatures=e}electron.ipcMain.on(FEATURES_GET_BROWSER_FEATURES,e=>{e.returnValue=getFeatures().getSupported()});