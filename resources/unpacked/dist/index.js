"use strict"; var __createBinding = this && this.__createBinding || (Object.create ? function (e, t, r, a) { void 0 === a && (a = r), Object.defineProperty(e, a, { enumerable: !0, get: function () { return t[r] } }) } : function (e, t, r, a) { void 0 === a && (a = r), e[a] = t[r] }), __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (e, t) { Object.defineProperty(e, "default", { enumerable: !0, value: t }) } : function (e, t) { e.default = t }), __importStar = this && this.__importStar || function (e) { if (e && e.__esModule) return e; var t = {}; if (null != e) for (var r in e) "default" !== r && Object.hasOwnProperty.call(e, r) && __createBinding(t, e, r); return __setModuleDefault(t, e), t }, __importDefault = this && this.__importDefault || function (e) { return e && e.__esModule ? e : { default: e } }; Object.defineProperty(exports, "__esModule", { value: !0 }); const appSettings_1 = __importDefault(require("./appSettings")); let settings = appSettings_1.default.getSettings(); settings.get("GLASSTRON", !0) && require("glasstron"); const electron = __importStar(require("electron")), requireNative_1 = __importDefault(require("./requireNative")), autoStart_1 = __importDefault(require("./autoStart")), buildInfo = __importStar(require("./buildInfo")), Constants = __importStar(require("./Constants")), GPUSettings = __importStar(require("./GPUSettings")), moduleUpdater = __importStar(require("./common/moduleUpdater")), paths = __importStar(require("./common/paths")), splashScreen = __importStar(require("./splashScreen")), path_1 = require("path"), os_1 = require("os"); function setupHardwareAcceleration() { appSettings_1.default.getSettings().get("enableHardwareAcceleration", !0) || electron.app.disableHardwareAcceleration() } function hasArgvFlag(e) { return (process.argv || []).slice(1).includes(e) } "linux" === process.platform && void 0 === process.env.PULSE_LATENCY_MSEC && (process.env.PULSE_LATENCY_MSEC = "30"), paths.init(buildInfo), electron.app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required"), electron.app.commandLine.appendSwitch("no-force-async-hooks-checks"), electron.app.commandLine.appendSwitch("enable-transparent-visuals"), electron.app.allowRendererProcessReuse = !1, global.releaseChannel = "stable", setupHardwareAcceleration(), async function () { if (await electron.app.whenReady(), process.argv.includes("--should-create-shortcut") && (console.log("Creating shortcuts."), "win32" === process.platform)) { let e = { appUserModelId: Constants.APP_ID, description: Constants.packageJSON.description, target: process.execPath }; electron.shell.writeShortcutLink(path_1.join(os_1.homedir(), "Desktop", "Jesuscord.lnk"), "create", e), electron.shell.writeShortcutLink(path_1.join(electron.app.getPath("appData"), "Microsoft", "Windows", "Start Menu", "Programs", "Jesuscord.lnk"), "create", e), autoStart_1.default.isInstalled(e => { e || autoStart_1.default.install(console.log) }) } let e; console.log("Initializing Jesuscord."), console.log(`Version: ${buildInfo.version}\nreleaseChannel: ${buildInfo.releaseChannel}\ncommit: ${buildInfo.commit}`), electron.app.setAppUserModelId(Constants.APP_ID); const t = electron.app.requestSingleInstanceLock(), r = hasArgvFlag("--multi-instance"); if (!t && !r) return void electron.app.quit(); r || electron.app.on("second-instance", (t, r, a) => { r && "--overlay-host" === r[1] || e && e.handleOpenUrl(r) }); const a = hasArgvFlag("--start-minimized"); (e = requireNative_1.default("discord_desktop_core")).startup({ paths: paths, splashScreen: splashScreen, moduleUpdater: moduleUpdater, autoStart: autoStart_1.default, buildInfo: buildInfo, appSettings: appSettings_1.default, Constants: Constants, GPUSettings: GPUSettings }), e.setMainWindowVisible(!a) }();