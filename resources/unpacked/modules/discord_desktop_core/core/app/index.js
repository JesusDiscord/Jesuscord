"use strict"; Object.defineProperty(exports, "__esModule", { value: !0 }), exports.startup = startup, exports.handleOpenUrl = handleOpenUrl, exports.setMainWindowVisible = setMainWindowVisible; const { Menu: Menu, BrowserWindow: BrowserWindow } = require("electron"), fetch = require("node-fetch").default; let mainScreen; function startup(e) { require("./bootstrapModules").init(e), require("./paths"), require("./splashScreen"); const n = require("./moduleUpdater"), r = require("./updater"); require("./autoStart"); const t = require("./buildInfo"), i = require("./appSettings"), s = require("./Constants"); s.init(e.Constants); const a = require("./appFeatures"); a.init(); const o = require("./GPUSettings"); e.GPUSettings.replace(o), require("./rootCertificates").init(), require("./discord_native/browser/accessibility"); const c = require("./discord_native/browser/app"); c.injectBuildInfo(t), c.injectModuleUpdater(n), c.injectUpdater(r), require("./discord_native/browser/clipboard"), require("./discord_native/browser/constants"), require("./discord_native/browser/crashReporter"), require("./discord_native/browser/features").injectFeaturesBackend(a.getFeatures()), require("./discord_native/browser/fileManager"), require("./discord_native/browser/userDataCache"), require("./discord_native/browser/gpuSettings").injectGpuSettingsBackend(o); const d = require("./discord_native/browser/nativeModules"); d.injectModuleUpdater(n), d.injectUpdater(r), require("./discord_native/browser/powerMonitor"), require("./discord_native/browser/powerSaveBlocker"), require("./discord_native/browser/processUtils"), require("./discord_native/browser/settings").injectSettingsBackend(i.getSettings()), require("./discord_native/browser/spellCheck"), require("./lightcordMainProcess"); const l = require("./discord_native/browser/window"), u = require("./crashReporterSetup"); global.crashReporterMetadata = u.metadata, global.mainAppDirname = s.MAIN_APP_DIRNAME, global.features = a.getFeatures(), global.appSettings = i.getSettings(), global.mainWindowId = s.DEFAULT_MAIN_WINDOW_ID, global.moduleUpdater = n; let p = require("./applicationMenu"); i().get("isTabs", !1) && (p = p.map(e => (["View", "&View"].includes(e.label) && e.submenu.push({ type: "separator" }, { label: "New Tab", click: () => { mainScreen.webContentsSend("NEW_TAB") }, accelerator: "CmdOrCtrl+T" }, { label: "Close Current Tab", click: () => { mainScreen.webContentsSend("CLOSE_TAB") }, accelerator: "CmdOrCtrl+W" }), e.submenu = e.submenu.map(e => (["Command+r", "Control+R"].includes(e.accelerator) && (e.click = function () { mainScreen.webContentsSend("RELOAD") }), ["&Developer", "Developer"].includes(e.label) && (e.submenu[0].click = (() => { mainScreen.webContentsSend("OPEN_DEVTOOLS") })), e)), e))), require("./ipcMain").on("NEW_TAB", () => { mainScreen.webContentsSend("NEW_TAB") }), Menu.setApplicationMenu(Menu.buildFromTemplate(p)), mainScreen = require("./mainScreen"); let S = e.Constants.version; e.splashScreen.events.once("APP_SHOULD_SHOW", () => { mainScreen.setMainWindowVisible(!0) }), e.splashScreen.events.on("APP_SHOULD_LAUNCH", () => { mainScreen.init(!1); const { getWindow: e } = require("./popoutWindows"); l.injectGetWindow(n => e(n) || BrowserWindow.fromId(mainScreen.getMainWindowId())) }), mainScreen.events.once("ready", () => { w ? e.splashScreen.pageReady() : mainScreen.setMainWindowVisible(!0) }); let w = !1; if (Date.now() - global.appSettings.get("LAST_UPDATE_CHECK_TIMESTAMP", 0) < 648e6) { console.log("Starting with version " + S + " because it hasn't been 1 week since the last check."), mainScreen.init(!1); const { getWindow: e } = require("./popoutWindows"); l.injectGetWindow(n => e(n) || BrowserWindow.fromId(mainScreen.getMainWindowId())) } else w = !0, console.log("Checking if version " + S + " is outdated..."), e.splashScreen.initSplash(), e.splashScreen.events.on("SPLASH_SCREEN_READY", () => { fetch({ headers: { "User-Agent": "Jesuscord-Updater/1.0" } }).then(async n => { const r = await n.json(); if (200 !== n.status) return console.error("Couldn't check updates. Using installed version."), void e.splashScreen.launchMainWindow(); global.appSettings.set("LAST_UPDATE_CHECK_TIMESTAMP", Date.now()), global.appSettings.save(), r.version > S ? (console.error("App Outdated. updating..."), e.splashScreen.updateSplashState("update-available"), updateApp()) : (console.error("Latest version already installed. Opening window."), e.splashScreen.launchMainWindow()) }).catch(n => { console.error("Couldn't check updates. Using installed version."), console.log(n), e.splashScreen.launchMainWindow() }) }); const { getWindow: b } = require("./popoutWindows"); l.injectGetWindow(e => b(e) || BrowserWindow.fromId(mainScreen.getMainWindowId())) } function handleOpenUrl(e) { mainScreen.handleOpenUrl(e) } function setMainWindowVisible(e) { mainScreen.setMainWindowVisible(e) } function updateApp(e) { const n = require("./bootstrapModules"); n.splashScreen.setSplashState({ status: "downloading-updates", progress: 0 }), n.splashScreen.setSplashState({ status: "update-manually" }), n.splashScreen.focusWindow(), delete global.appSettings.settings.LAST_UPDATE_CHECK_TIMESTAMP, global.appSettings.save() }