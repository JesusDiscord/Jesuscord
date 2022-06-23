var __createBinding = this && this.__createBinding || (Object.create ? function (t, e, i, s) {
        void 0 === s && (s = i), Object.defineProperty(t, s, {
            enumerable: !0,
            get: function () {
                return e[i]
            }
        })
    } : function (t, e, i, s) {
        void 0 === s && (s = i), t[s] = e[i]
    }),
    __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (t, e) {
        Object.defineProperty(t, "default", {
            enumerable: !0,
            value: e
        })
    } : function (t, e) {
        t.default = e
    }),
    __importStar = this && this.__importStar || function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (null != t)
            for (var i in t) "default" !== i && Object.hasOwnProperty.call(t, i) && __createBinding(e, t, i);
        return __setModuleDefault(e, t), e
    };
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const fs = __importStar(require("fs")),
    path = __importStar(require("path"));
class Settings {
    constructor(t) {
        this.path = path.join(t, "settings.json");
        try {
            this.lastSaved = fs.readFileSync(this.path, "utf8"), this.settings = JSON.parse(this.lastSaved)
        } catch (t) {
            this.lastSaved = "", this.settings = {}
        }
        this.lastModified = this._lastModified()
    }
    _lastModified() {
        try {
            return fs.statSync(this.path).mtime.getTime()
        } catch (t) {
            return 0
        }
    }
    get(t, e = !1) {
        return this.settings.hasOwnProperty(t) ? this.settings[t] : e
    }
    set(t, e) {
        this.settings[t] = e
    }
    delete(t) {
        delete this.settings[t]
    }
    exists(t) {
        return t in this.settings
    }
    save() {
        if (this.lastModified && this.lastModified !== this._lastModified()) console.warn("Not saving settings, it has been externally modified.");
        else try {
            const t = JSON.stringify(this.settings, null, 2);
            this.lastSaved != t && (this.lastSaved = t, fs.writeFileSync(this.path, t, "utf8"), this.lastModified = this._lastModified())
        } catch (t) {
            console.warn("Failed saving settings with error: ", t)
        }
    }
}
exports.default = Settings;