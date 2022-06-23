var __createBinding = this && this.__createBinding || (Object.create ? function (e, t, s, n) {
        void 0 === n && (n = s), Object.defineProperty(e, n, {
            enumerable: !0,
            get: function () {
                return t[s]
            }
        })
    } : function (e, t, s, n) {
        void 0 === n && (n = s), e[n] = t[s]
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
            for (var s in e) "default" !== s && Object.hasOwnProperty.call(e, s) && __createBinding(t, e, s);
        return __setModuleDefault(t, e), t
    };
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.checkForUpdates = exports.installPendingUpdates = exports.install = exports.getInstalled = exports.isInstalled = exports.setInBackground = exports.init = exports.initPathsOnly = exports.supportsEventObjects = exports.events = exports.NO_PENDING_UPDATES = exports.INSTALLING_MODULE_PROGRESS = exports.INSTALLING_MODULE = exports.INSTALLING_MODULES_FINISHED = exports.DOWNLOADED_MODULE = exports.UPDATE_MANUALLY = exports.DOWNLOADING_MODULES_FINISHED = exports.DOWNLOADING_MODULE_PROGRESS = exports.DOWNLOADING_MODULE = exports.UPDATE_CHECK_FINISHED = exports.INSTALLED_MODULE = exports.CHECKING_FOR_UPDATES = void 0;
const fs = __importStar(require("fs")),
    path = __importStar(require("path")),
    events_1 = require("events"),
    process = __importStar(require("process"));
exports.CHECKING_FOR_UPDATES = "checking-for-updates", exports.INSTALLED_MODULE = "installed-module", exports.UPDATE_CHECK_FINISHED = "update-check-finished", exports.DOWNLOADING_MODULE = "downloading-module", exports.DOWNLOADING_MODULE_PROGRESS = "downloading-module-progress", exports.DOWNLOADING_MODULES_FINISHED = "downloading-modules-finished", exports.UPDATE_MANUALLY = "update-manually", exports.DOWNLOADED_MODULE = "downloaded-module", exports.INSTALLING_MODULES_FINISHED = "installing-modules-finished", exports.INSTALLING_MODULE = "installing-module", exports.INSTALLING_MODULE_PROGRESS = "installing-module-progress", exports.NO_PENDING_UPDATES = "no-pending-updates";
const installedModules = fs.readdirSync(path.join(__dirname, "..", "..", "modules"));
class Events extends events_1.EventEmitter {
    constructor() {
        super(), this.history = []
    }
    append(e) {
        e.now = String(process.hrtime.bigint()), this._eventIsInteresting(e) && this.history.push(e), process.nextTick(() => this.emit(e.type, e))
    }
    _eventIsInteresting(e) {
        return e.type !== exports.DOWNLOADING_MODULE_PROGRESS && e.type !== exports.INSTALLING_MODULE_PROGRESS
    }
}

function initPathsOnly(e) {}

function init(e, t, s) {}

function setInBackground() {}

function isInstalled(e, t) {
    return installedModules.includes(e)
}

function getInstalled() {
    return installedModules
}

function install(e, t, s) {
    isInstalled(e) && (t || exports.events.append({
        type: exports.INSTALLED_MODULE,
        name: e,
        current: 1,
        total: 1,
        succeeded: !0
    }))
}

function installPendingUpdates() {
    exports.events.append({
        type: exports.NO_PENDING_UPDATES
    })
}

function checkForUpdates() {
    exports.events.append({
        type: exports.CHECKING_FOR_UPDATES
    }), exports.events.append({
        type: exports.UPDATE_CHECK_FINISHED,
        succeeded: !0,
        updateCount: 0,
        manualRequired: !1
    })
}
exports.events = new Events, exports.supportsEventObjects = !0, exports.initPathsOnly = initPathsOnly, exports.init = init, exports.setInBackground = setInBackground, exports.isInstalled = isInstalled, exports.getInstalled = getInstalled, exports.install = install, exports.installPendingUpdates = installPendingUpdates, exports.checkForUpdates = checkForUpdates;