"use strict";const electron=require("electron");function getDesktopCaptureSources(e){return new Promise((t,r)=>{electron.desktopCapturer.getSources(e).then(e=>t(e.map(e=>({id:e.id,name:e.name,url:e.thumbnail.toDataURL()}))))})}module.exports={getDesktopCaptureSources:getDesktopCaptureSources};