"use strict";const electron=require("electron"),{WINDOW_BLUR:WINDOW_BLUR,WINDOW_CLOSE:WINDOW_CLOSE,WINDOW_FOCUS:WINDOW_FOCUS,WINDOW_MAXIMIZE:WINDOW_MAXIMIZE,WINDOW_MINIMIZE:WINDOW_MINIMIZE,WINDOW_RESTORE:WINDOW_RESTORE,WINDOW_FLASH_FRAME:WINDOW_FLASH_FRAME,WINDOW_TOGGLE_FULLSCREEN:WINDOW_TOGGLE_FULLSCREEN,WINDOW_SET_BACKGROUND_THROTTLING:WINDOW_SET_BACKGROUND_THROTTLING,WINDOW_SET_PROGRESS_BAR:WINDOW_SET_PROGRESS_BAR,WINDOW_IS_ALWAYS_ON_TOP:WINDOW_IS_ALWAYS_ON_TOP,WINDOW_SET_ALWAYS_ON_TOP:WINDOW_SET_ALWAYS_ON_TOP,WINDOW_DEVTOOLS_OPENED:WINDOW_DEVTOOLS_OPENED,WINDOW_DEVTOOLS_CLOSED:WINDOW_DEVTOOLS_CLOSED}=require("../common/constants").IPCEvents;let devtoolsOpenedCallback=()=>{},devtoolsClosedCallback=()=>{};async function flashFrame(e){electron.ipcRenderer.invoke(WINDOW_FLASH_FRAME,e)}async function minimize(e){electron.ipcRenderer.invoke(WINDOW_MINIMIZE,e)}async function restore(e){electron.ipcRenderer.invoke(WINDOW_RESTORE,e)}async function maximize(e){electron.ipcRenderer.invoke(WINDOW_MAXIMIZE,e)}async function focus(e,n){electron.ipcRenderer.invoke(WINDOW_FOCUS,n)}async function setAlwaysOnTop(e,n){return electron.ipcRenderer.invoke(WINDOW_SET_ALWAYS_ON_TOP,e,n)}async function isAlwaysOnTop(e){return electron.ipcRenderer.invoke(WINDOW_IS_ALWAYS_ON_TOP,e)}async function blur(e){electron.ipcRenderer.invoke(WINDOW_BLUR,e)}async function setProgressBar(e,n){electron.ipcRenderer.invoke(WINDOW_SET_PROGRESS_BAR,n,e)}async function fullscreen(e){electron.ipcRenderer.invoke(WINDOW_TOGGLE_FULLSCREEN,e)}async function close(e){electron.ipcRenderer.invoke(WINDOW_CLOSE,e)}async function setZoomFactor(e){electron.webFrame.setZoomFactor&&electron.webFrame.setZoomFactor(e/100)}async function setBackgroundThrottling(e){electron.ipcRenderer.invoke(WINDOW_SET_BACKGROUND_THROTTLING,e)}async function setDevtoolsCallbacks(e,n){devtoolsOpenedCallback=e,devtoolsClosedCallback=n}electron.ipcRenderer.on(WINDOW_DEVTOOLS_OPENED,async e=>{null!=devtoolsOpenedCallback&&devtoolsOpenedCallback()}),electron.ipcRenderer.on(WINDOW_DEVTOOLS_CLOSED,async e=>{null!=devtoolsOpenedCallback&&devtoolsOpenedCallback()}),module.exports={flashFrame:flashFrame,minimize:minimize,restore:restore,maximize:maximize,focus:focus,blur:blur,fullscreen:fullscreen,close:close,setAlwaysOnTop:setAlwaysOnTop,isAlwaysOnTop:isAlwaysOnTop,setZoomFactor:setZoomFactor,setBackgroundThrottling:setBackgroundThrottling,setProgressBar:setProgressBar,setDevtoolsCallbacks:setDevtoolsCallbacks};