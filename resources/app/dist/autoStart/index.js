var __importDefault = this && this.__importDefault || function (t) {
    return t && t.__esModule ? t : {
        default: t
    }
};
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const auto_launch_1 = __importDefault(require("auto-launch")),
    autoStart = new auto_launch_1.default({
        name: "Justicecord"
    });
exports.default = {
    install(t) {
        autoStart.enable().then(t, t)
    },
    isInstalled(t) {
        autoStart.isEnabled().then(t)
    },
    uninstall(t) {
        autoStart.disable().then(t, t)
    },
    update(t) {
        autoStart.enable().then(t, t)
    }
};