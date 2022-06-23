var __createBinding = this && this.__createBinding || (Object.create ? function (e, t, r, i) {
        void 0 === i && (i = r), Object.defineProperty(e, i, {
            enumerable: !0,
            get: function () {
                return t[r]
            }
        })
    } : function (e, t, r, i) {
        void 0 === i && (i = r), e[i] = t[r]
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
    };
Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.getCommitID = void 0;
const child_process = __importStar(require("child_process"));
let commit_id = "2d4f4aae4152464af9e9999cdb9b0121ba454011";
const defaultString = Buffer.from([123, 99, 111, 109, 109, 105, 116, 125]).toString("utf8");

function getCommitID() {
    if (commit_id !== defaultString) return commit_id;
    try {
        return commit_id = child_process.execSync("git rev-parse HEAD").toString()
    } catch (e) {
        return console.error(e), "{Unknown}"
    }
}
exports.getCommitID = getCommitID;