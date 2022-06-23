var __createBinding = this && this.__createBinding || (Object.create ? function (e, t, r, a) {
        void 0 === a && (a = r), Object.defineProperty(e, a, {
            enumerable: !0,
            get: function () {
                return t[r]
            }
        })
    } : function (e, t, r, a) {
        void 0 === a && (a = r), e[a] = t[r]
    }),
    __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (e, t) {
        Object.defineProperty(e, "default", {
            enumerable: !0,
            value: t
        })
    } : function (e, t) {
        e.default = t
    }),
    __importStar = this && this.__importStar || function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) "default" !== r && Object.hasOwnProperty.call(e, r) && __createBinding(t, e, r);
        return __setModuleDefault(t, e), t
    },
    __importDefault = this && this.__importDefault || function (e) {
        return e && e.__esModule ? e : {
            default: e
        }
    };
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.getResources = exports.getUserData = exports.init = exports.cleanOldVersions = void 0;
const fs = __importStar(require("fs")),
    path = __importStar(require("path")),
    rimraf_1 = __importDefault(require("rimraf")),
    electron_1 = require("electron"),
    fs_1 = __importDefault(require("fs"));
let userDataPath = null,
    resourcesPath = null;

function determineAppUserDataRoot() {
    return electron_1.app.getPath("appData")
}

function determineUserData(e, t) {
    return path.join(e, "Jesuscord")
}

function cleanOldVersions(e) {
    (fs.readdirSync(userDataPath) || []).forEach(t => {
        const r = path.join(userDataPath, t);
        fs.lstatSync(r).isDirectory() && -1 === t.indexOf(e.version) && null != t.match("^[0-9]+.[0-9]+.[0-9]+") && (console.log("Removing old directory ", t), rimraf_1.default(r, fs_1.default, e => {
            e && console.warn("...failed with error: ", e)
        }))
    })
}

function init(e) {
    resourcesPath = path.join(require.main.filename, "..", "..", "..");
    const t = determineAppUserDataRoot();
    userDataPath = determineUserData(t, e);
    const {
        app: r
    } = require("electron");
    r.setPath("userData", userDataPath), console.log(userDataPath, e.version)
}

function getUserData() {
    return userDataPath
}

function getResources() {
    return resourcesPath
}
exports.cleanOldVersions = cleanOldVersions, exports.init = init, exports.getUserData = getUserData, exports.getResources = getResources;