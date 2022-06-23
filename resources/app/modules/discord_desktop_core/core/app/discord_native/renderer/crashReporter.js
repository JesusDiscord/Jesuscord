"use strict";const electron=require("electron"),{reconcileCrashReporterMetadata:reconcileCrashReporterMetadata}=require("../../../common/crashReporterUtils"),{getElectronMajorVersion:getElectronMajorVersion}=require("../../../common/processUtils"),{CRASH_REPORTER_UPDATE_METADATA:CRASH_REPORTER_UPDATE_METADATA}=require("../common/constants").IPCEvents;let metadata={};async function updateCrashReporter(e){const t=await electron.ipcRenderer.invoke(CRASH_REPORTER_UPDATE_METADATA,e);getElectronMajorVersion()<9&&electron.crashReporter.start(t.args),metadata=t.metadata||{},reconcileCrashReporterMetadata(electron.crashReporter,metadata)}function getMetadata(){return metadata}updateCrashReporter(metadata),module.exports={updateCrashReporter:updateCrashReporter,getMetadata:getMetadata};