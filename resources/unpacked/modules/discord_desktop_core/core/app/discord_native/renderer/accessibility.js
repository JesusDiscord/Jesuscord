"use strict";const electron=require("electron"),{ACCESSIBILITY_GET_ENABLED:ACCESSIBILITY_GET_ENABLED}=require("../common/constants").IPCEvents;async function isAccessibilitySupportEnabled(){return electron.ipcRenderer.invoke(ACCESSIBILITY_GET_ENABLED)}module.exports={isAccessibilitySupportEnabled:isAccessibilitySupportEnabled};