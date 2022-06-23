"use strict"; var __createBinding = this && this.__createBinding || (Object.create ? function (e, t, r, i) { void 0 === i && (i = r), Object.defineProperty(e, i, { enumerable: !0, get: function () { return t[r] } }) } : function (e, t, r, i) { void 0 === i && (i = r), e[i] = t[r] }), __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (e, t) { Object.defineProperty(e, "default", { enumerable: !0, value: t }) } : function (e, t) { e.default = t }), __importStar = this && this.__importStar || function (e) { if (e && e.__esModule) return e; var t = {}; if (null != e) for (var r in e) "default" !== r && Object.hasOwnProperty.call(e, r) && __createBinding(t, e, r); return __setModuleDefault(t, e), t }, __importDefault = this && this.__importDefault || function (e) { return e && e.__esModule ? e : { default: e } }; Object.defineProperty(exports, "__esModule", { value: !0 }), exports.packageJSON = exports.version = exports.mainAppDirname = exports.UPDATE_ENDPOINT = exports.API_ENDPOINT = exports.APP_ID = exports.APP_NAME = void 0; const buildInfo_1 = require("./buildInfo"), appSettings_1 = __importDefault(require("./appSettings")), pak = require("../package.json"), path = __importStar(require("path")), settings = appSettings_1.default.getSettings(); function capitalizeFirstLetter(e) { return e.charAt(0).toUpperCase() + e.slice(1) } exports.APP_NAME = "Justicecord" + ("stable" === buildInfo_1.releaseChannel ? "" : capitalizeFirstLetter(buildInfo_1.releaseChannel)); const APP_ID_BASE = "com.squirrel"; exports.APP_ID = `com.squirrel.${exports.APP_NAME}.${exports.APP_NAME}`, exports.API_ENDPOINT = settings.get("API_ENDPOINT") || "https://discord.com/api", exports.UPDATE_ENDPOINT = settings.get("UPDATE_ENDPOINT") || exports.API_ENDPOINT, exports.mainAppDirname = path.join(__dirname, ".."), exports.version = pak.version, exports.packageJSON = pak;