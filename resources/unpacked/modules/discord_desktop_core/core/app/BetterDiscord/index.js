const ModuleLoader = require("./loaders/modules"),
    {
        EventEmitter: EventEmitter
    } = require("events"),
    Logger = require("./Logger"),
    fs = require("fs"),
    path = require("path"),
    electron = require("electron"),
    fetch = require("node-fetch").default,
    uuid = require("uuid/v4"),
    isPackaged = electron.remote.app.isPackaged,
    events = exports.events = new EventEmitter,
    logger = exports.logger = new Logger("Lightcord");
let hasInit = !1,
    tries = 0,
    hasReplacedLocalstorage = !1;
const localStorage = window.localStorage,
    UserAgent = electron.ipcRenderer.sendSync("LIGHTCORD_GET_USER_AGENT").replace(/lightcord\/[^ ]+/g, "discord/" + require("../discord_native/renderer/app").getVersion());
electron.ipcRenderer.sendSync("LIGHTCORD_SET_USER_AGENT", UserAgent), exports.init = function ({
    isTab: e
}) {
    if (1 == hasInit) return void console.warn(new Error("Jesuscord has already started."));
    formatLogger.log("The app is", isPackaged ? "packaged." : "not packaged."), hasInit = !0;
    /*let t = setInterval(() => {
        events.emit("debug", `[INIT] try ${tries++} `);
        try {
            if (!global.webpackJsonp) return;
            if (e && !hasReplacedLocalstorage) {
                console.log("Replacing localStorage..."), hasReplacedLocalstorage = !0;
                const e = require("localstorage-polyfill");
                Object.defineProperty(window, "localStorage", {
                    value: e
                })
            }
            if (!ModuleLoader.get(4)) return;
            clearInterval(t), privateInit().then(() => {
                console.log("Finished loading Jesuscord.")
            })
        } catch (e) {
            console.error(e)
        }
    }, 100)*/
};
let hasPrivateInit = !1;
async function privateInit() {
    if (!hasInit) return;
    if (hasPrivateInit) return;
    hasPrivateInit = !0;
    let e = require.cache[path.join(__dirname, "loaders", "modules.js")];
    e && (e.exports = window.BDModules), ModuleLoader.get(e => e.getCurrentHub)[0].getCurrentHub().getClient().getOptions().enabled = !1;
    const t = await ensureExported(e => !["Component", "PureComponent", "Children", "createElement", "cloneElement"].find(t => !e[t]));
    window.React = t;
    const r = await ensureExported(e => e.findDOMNode);
    if (window.ReactDOM = r, electron.remote.process.argv.includes("--disable-betterdiscord")) {
        let e, r;
        class n extends t.Component {
            render() {
                e || (e = ModuleLoader.get(e => e.FormSection)[0]), r || (r = ModuleLoader.get(e => e.marginTop60)[0]);
                let n = require("./Button").default;
                return t.createElement("div", {}, [t.createElement(e.FormSection, {
                    className: "",
                    tag: "h2",
                    title: "Jesuscord's Settings"
                }, t.createElement(n, {
                    color: "yellow",
                    look: "ghost",
                    size: "medium",
                    hoverColor: "red",
                    onClick: () => {
                        console.log("Should relaunch"), ipcRenderer.sendSync("LIGHTCORD_RELAUNCH_APP", {
                            args: electron.remote.process.argv.slice(1).filter(e => "--disable-betterdiscord" !== e)
                        })
                    },
                    wrapper: !0
                }, "Relaunch with BetterDiscord"))])
            }
        }
        ModuleLoader.get(e => e.Dispatcher && e.default && e.default.dispatch)[0].default.subscribe("USER_SETTINGS_UPDATE", e => {
            ipcRenderer.send("DISCORD_UPDATE_THEME", e.settings.theme)
        });
        let o = ModuleLoader.get(e => e.API_HOST)[0];
        return o.UserSettingsSections = Object.freeze(Object.assign({}, o.UserSettingsSections, {
            LIGHTCORD: "Jesuscord"
        })), ensureExported(e => e.default && e.default.prototype && e.default.prototype.getPredicateSections).then(e => {
            let t = e.default.prototype.getPredicateSections;
            e.default.prototype.getPredicateSections = function () {
                let e = t.call(this, ...arguments);
                if ("My Account" === e[1].section) {
                    let t = [];
                    for (t.push(e.pop()), t.push(e.pop()), t.push(e.pop()), t.push(e.pop()), e.push({
                            section: "HEADER",
                            label: "Jesuscord"
                        }, {
                            section: o.UserSettingsSections.LIGHTCORD,
                            label: "Jesuscord",
                            element: n
                        }, {
                            section: "DIVIDER"
                        }); t[0];) e.push(t.pop())
                }
                return e
            }
        }), void installReactDevtools()
    }
    let n = await ensureExported(e => e.createSound),
        o = n.createSound;
    n.createSound = function (e) {
        let t = "call_ringing_beat" === e || "call_ringing" === e;
        if (t) {
            let e = o.call(this, ...arguments);
            return Object.defineProperty(e, "name", {
                get: () => window.Lightcord.Settings.callRingingBeat ? "call_ringing_beat" : "call_ringing",
                set(e) {
                    console.log("Attempting to set call_ringing value. Canceling", e)
                },
                configurable: !1
            }), e
        }
        return o(...arguments)
    };
    let i = ModuleLoader.get(e => e.API_HOST)[0],
        s = ModuleLoader.get(e => e.Dispatcher && e.default && e.default.dispatch)[0].default;

    function a() {
        let e = ModuleLoader.get(e => e.default && e.default.getCurrentUser)[0].default.getCurrentUser();
        if (e) return e.hasFlag(i.UserFlags.HYPESQUAD_ONLINE_HOUSE_1) ? "1" : e.hasFlag(i.UserFlags.HYPESQUAD_ONLINE_HOUSE_2) ? "2" : e.hasFlag(i.UserFlags.HYPESQUAD_ONLINE_HOUSE_3) ? "3" : void 0
    }
    require(formatMinified(path.join(__dirname, "../../../../../BetterDiscordApp/dist/style{min}.css"))), require("./lightcord.css"), window.$ = window.jQuery = require("./jquery-3.6.0.slim.min.js"), require("./ace.js"), installReactDevtools(), fs.existsSync(BetterDiscordConfig.dataPath) || fs.mkdirSync(BetterDiscordConfig.dataPath, {
        recursive: !0
    });
    let l = path.join(BetterDiscordConfig.dataPath, "plugins"),
        c = path.join(BetterDiscordConfig.dataPath, "themes");
    if (console.log(`Plugins: ${l}\nThemes: ${c}`), !fs.existsSync(l)) {
        fs.mkdirSync(l, {
            recursive: !0
        });
        const e = path.join(l, "0PluginLibrary.plugin.js");
        fetch("https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js").then(async t => {
            if (200 !== t.status) return;
            const r = await t.buffer();
            fs.writeFileSync(e, r)
        }), BetterDiscordConfig.haveInstalledDefault = !0
    }
    if (fs.existsSync(c)) {
        const e = path.join(c, "DarkDiscord.theme.css");
        let t = [e, path.join(c, "DiscordDark.theme.css")];
        for (name of t)
            if (fs.existsSync(name)) {
                fs.readFileSync(name, "utf-8").includes("hellbound") && (fs.unlinkSync(name), fetch("https://raw.githubusercontent.com/hormelcookies/dark-discord/hormelcookies-patch-1/DarkDiscord.theme.css").then(async t => {
                    if (200 !== t.status) return;
                    const r = await t.buffer();
                    fs.writeFileSync(e, r)
                }))
            }
    } else {
        fs.mkdirSync(c, {
            recursive: !0
        });
        const e = path.join(c, "DarkDiscord.theme.css");
        fetch("https://raw.githubusercontent.com/hormelcookies/dark-discord/hormelcookies-patch-1/DarkDiscord.theme.css").then(async t => {
            if (200 !== t.status) return;
            const r = await t.buffer();
            fs.writeFileSync(e, r)
        });
        const t = path.join(c, "glasscord_example.theme.css");
        fetch("https://raw.githubusercontent.com/AryToNeX/Glasscord/master/extras/discord_example_theme/discord_example.theme.css").then(async e => {
            if (200 !== e.status) return;
            const r = await e.buffer();
            fs.writeFileSync(t, r)
        }), BetterDiscordConfig.haveInstalledDefault = !0
    }
    let d, u = ModuleLoader.get(e => e.default && "object" == typeof e.default && "isDeveloper" in e.default)[0];
    u && Object.defineProperty(u.default, "isDeveloper", {
        get: () => !!window.Lightcord.Settings.devMode,
        set: e => !!window.Lightcord.Settings.devMode
    });
    try {
        d = require("../../../../../DiscordJS").default
    } catch (e) {
        console.error(e), d = null
    }
    let p = e => {
        let t = Object.create(null);
        return Object.keys(e).forEach(r => {
            t[r] = e[r]
        }), t
    };
    window.Lightcord = p({
        DiscordModules: p({
            dispatcher: s,
            constants: i
        }),
        Settings: p({
            devMode: !1,
            callRingingBeat: !0
        }),
        Api: p({
            Authorization: null,
            ensureExported: ensureExported,
            cloneNullProto: p
        }),
        BetterDiscord: p({})
    }), s.subscribe("USER_SETTINGS_UPDATE", e => {
        ipcRenderer.send("DISCORD_UPDATE_THEME", e.settings.theme)
    }), require(formatMinified("lightcordapi/js/main{min}.js"));
    const f = new(require(formatMinified("../../../../../BetterDiscordApp/dist/index{min}.js")).default)(BetterDiscordConfig, require("./betterdiscord")),
        h = window.Lightcord.BetterDiscord.Utils,
        g = window.Lightcord.BetterDiscord.DOM;
    let m = !1;
    s.subscribe("LOGOUT", () => {
        m = !1
    });
    window.Lightcord.Api.settings;
    (async function () {
        const e = await ensureExported(e => e.default && e.default.prototype && e.default.prototype._handleDispatch);
        if (!e) return;
        let r = e.default.prototype._handleDispatch;

        function n(t) {
            if (e.default.prototype[t]) {
                const r = e.default.prototype[t];
                e.default.prototype[t] = function () {
                    if (!m) return r.call(this, ...arguments)
                }
            } else logger.warn(`Couldn't find ${t} on gateway.`)
        }
        e.default.prototype._handleDispatch = function (e, t, n) {
            if ("READY" === t)
                if (console.log(...arguments), m = e.user.bot, e.user.bot) {
                    logger.log("Logged in as a bot, spoofing user..."), e.user.bot = !1, e.user.premium = !0, e.user.premium_type = 1, e.user.email = e.user.email || uuid() + "@lightcord.xyz", e.experiments = e.experiments || [], e.guild_experiments = e.guild_experiments || [], e.connected_accounts = e.connected_accounts || [], e.relationships = e.relationships || [], e.notes = e.notes || {}, e.user_feed_settings = e.user_feed_settings || [], e.analytics_tokens = e.analytics_tokens || [], e.analytics_token = e.analytics_token || "", e.private_channels = e.private_channels || [], e.read_state = e.read_state || {
                        entries: [],
                        partial: !1,
                        version: 19438
                    }, e.consents = e.consents || {
                        personalization: !1
                    }, e.tutorial = e.tutorial || null, e.user_settings = Object.assign(e.user_settings || {}, {
                        afk_timeout: 600,
                        allow_accessibility_detection: !1,
                        animate_emoji: !0,
                        contact_sync_enabled: !1,
                        convert_emoticons: !0,
                        custom_status: null,
                        default_guilds_restricted: !1,
                        detect_platform_accounts: !1,
                        developer_mode: !0,
                        disable_games_tab: !0,
                        enable_tts_command: !0,
                        explicit_content_filter: 0,
                        friend_source_flags: {
                            all: !1,
                            mutual_friends: !1,
                            mutual_guilds: !1
                        },
                        gif_auto_play: !0,
                        guild_folders: [],
                        guild_positions: [],
                        inline_attachment_media: !0,
                        inline_embed_media: !0,
                        message_display_compact: !1,
                        native_phone_integration_enabled: !1,
                        render_embeds: !0,
                        render_reactions: !0,
                        restricted_guilds: [],
                        show_current_game: !1,
                        stream_notifications_enabled: !1
                    }, e.user_settings || {}), e.user_guild_settings = e.user_guild_settings || {
                        entries: [],
                        version: 0,
                        partial: !1
                    }, e.friend_suggestion_count = e.friend_suggestion_count || 0, e.presences = e.presences || [];
                    const t = electron.ipcRenderer.sendSync("LIGHTCORD_GET_BUILD_INFOS");
                    electron.ipcRenderer.sendSync("LIGHTCORD_SET_USER_AGENT", `DiscordBot (https://github.com/lightcord/lightcord, v${t.version})`)
                } else electron.ipcRenderer.sendSync("LIGHTCORD_SET_USER_AGENT", UserAgent), logger.log("Logged in as an user. Skipping user spoofing.");
            let o = r.call(this, ...arguments);
            if ("READY" === t && d) try {
                d.client.emit("self.ready", e)
            } catch (e) {
                console.error("[DiscordJS Error]", e)
            }
            return o
        }, s.subscribe("LOGOUT", () => {
            m = !1
        }), n("updateGuildSubscriptions"), n("callConnect"), n("lobbyConnect"), n("lobbyDisconnect"), n("lobbyVoiceStatesUpdate"), n("streamCreate"), n("streamWatch"), n("streamPing"), n("streamDelete"), n("streamSetPaused");
        const o = e.default.prototype._handleClose;
        e.default.prototype._handleClose = function (e, t, r) {
            let n = !this.intents;
            return delete this.intents, 4013 === t && n ? this.intents = 32509 : 4014 === t && (delete this.intents, console.log("Invalid intents ? Removing them.")), o.call(this, ...arguments)
        };
        const l = e.default.prototype._doIdentify;
        e.default.prototype._doIdentify = function () {
            let e = this.send;
            this.send = function (t, r, n) {
                return 2 === t && this.intents && (r.intents = this.intents), e.call(this, t, r, n)
            };
            const t = l.call(this, ...arguments);
            return this.send = e, t
        };
        const c = e.default.prototype.requestGuildMembers;
        e.default.prototype.requestGuildMembers = function () {
            return c.call(this, ...arguments)
        };
        BDModules.get(e => e.default && e.default.hasUnread).forEach(e => {
            const t = e.default.hasUnread;
            e.default.hasUnread = function () {
                return !m && t.call(this, ...arguments)
            };
            for (const t of ["ack"]) {
                if (console.log(t, e[t]), !e || !e[t]) {
                    logger.warn("Couldn't find prop " + t + " in ackmodule1");
                    continue
                }
                let r = e[t];
                e[t] = function () {
                    if (!m) return r.call(this, ...arguments)
                }
            }
            if (e.getAckTimestamp) {
                let t = e.getAckTimestamp;
                e.getAckTimestamp = function () {
                    return m ? NaN : t.call(this, ...arguments)
                }
            }
        });
        const u = ModuleLoader.get(e => e.default && e.default.getToken)[0];
        if (u) {
            const e = u.default.getToken;
            u.default.getToken = function () {
                const t = e.call(this);
                return t && m ? t.startsWith("Bot ") ? t : "Bot " + t : t
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const p = BDModules.get(e => e.default && e.default.fetchRelationships)[0];
        if (p) {
            const e = p.default.fetchRelationships;
            p.default.fetchRelationships = function () {
                if (!m) return e.call(this, ...arguments);
                setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.LOAD_RELATIONSHIPS_SUCCESS,
                        relationships: []
                    })
                })
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const f = BDModules.get(e => e.fetchConsents)[0];
        if (f) {
            const e = f.fetchConsents;
            f.fetchConsents = function () {
                if (!m) return e.call(this, ...arguments);
                setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.UPDATE_CONSENTS,
                        consents: {
                            personalization: !1,
                            usage_statistics: !1
                        }
                    })
                })
            };
            const t = f.setConsents;
            f.setConsents = function () {
                return m ? Promise.reject(new Error("Jesuscord bot emulation cannot change this setting.")) : t.call(this, ...arguments)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const g = BDModules.get(e => e.getHarvestStatus)[0];
        if (g) {
            const e = g.getHarvestStatus;
            g.getHarvestStatus = function () {
                return m ? Promise.resolve({
                    requestingHarvest: !1,
                    currentHarvestRequest: null
                }) : e.call(this, ...arguments)
            };
            const t = g.requestHarvest;
            g.requestHarvest = function () {
                return m ? Promise.reject() : t.call(this, ...arguments)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const _ = BDModules.get(e => e.getSanitizedRestrictedGuilds)[0];
        if (_) {
            const e = _.harvestDisabled;
            _.harvestDisabled = function () {
                if (!m) return e.call(this, ...arguments)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const E = BDModules.get(e => e.default && e.default.updateRemoteSettings)[0];
        if (E) {
            const e = E.default.updateRemoteSettings;
            E.default.updateRemoteSettings = function () {
                return m ? Promise.resolve() : e.call(this, ...arguments)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const S = BDModules.get(e => e.default && 2 === Object.keys(e.default).length && e.default.fetch && e.default.delete)[0];
        if (S) {
            const e = S.default.fetch;
            S.default.fetch = function () {
                if (!m) return e.call(this, ...arguments);
                setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.USER_AUTHORIZED_APPS_UPDATE,
                        apps: []
                    })
                })
            };
            const t = S.delete;
            S.delete = function () {
                if (!m) return t.call(this, ...arguments);
                S.fetch()
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const y = BDModules.get(e => e.fetchPaymentSources)[0];
        if (y) {
            const e = y.fetchPaymentSources;
            y.fetchPaymentSources = function () {
                if (!m) return e.call(this, ...arguments);
                setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.BILLING_PAYMENT_SOURCES_FETCH_START
                    }), setImmediate(() => {
                        s.dispatch({
                            type: i.ActionTypes.BILLING_PAYMENT_SOURCES_FETCH_SUCCESS,
                            paymentSources: []
                        })
                    })
                })
            };
            const t = y.fetchPayments;
            y.fetchPayments = function () {
                if (!m) return t.call(this, ...arguments);
                setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.BILLING_PAYMENTS_FETCH_START
                    }), setImmediate(() => {
                        s.dispatch({
                            type: i.ActionTypes.BILLING_PAYMENTS_FETCH_SUCCESS,
                            payments: []
                        })
                    })
                })
            };
            const r = y.fetchSubscriptions;
            y.fetchSubscriptions = function () {
                if (!m) return r.call(this, ...arguments);
                let e;
                return setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.BILLING_SUBSCRIPTION_FETCH_START
                    }), setImmediate(() => {
                        const t = [{
                            id: "123456789",
                            type: 1,
                            created_at: "2020-06-00T00:00:00.000000",
                            canceled_at: null,
                            current_period_start: "2020-06-00:00:00.000000",
                            current_period_end: "2100-06-00:00:00.000000",
                            status: 1,
                            payment_source_id: null,
                            payment_gateway: null,
                            payment_gateway_plan_id: "premium_year",
                            plan_id: "511651860671627264",
                            items: [{
                                id: "123456789",
                                plan_id: "511651860671627264",
                                quantity: 1
                            }],
                            currency: "usd"
                        }];
                        e({
                            body: t
                        }), s.dispatch({
                            type: i.ActionTypes.BILLING_SUBSCRIPTION_FETCH_SUCCESS,
                            subscriptions: t
                        })
                    })
                }), new Promise(t => e = t)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const b = BDModules.get(e => e.MARK_SERVER_READ)[0];
        if (b) {
            let e = b.MARK_SERVER_READ.action;
            b.MARK_SERVER_READ.action = function () {
                if (!m) return e.call(this, ...arguments)
            }, b.default && b.default.MARK_SERVER_READ && (b.default.MARK_SERVER_READ.action = b.MARK_SERVER_READ.action)
        } else logger.warn(new Error("Couldn't find module here"));
        const D = BDModules.get(e => e.fetchActivityStatistics)[0];
        if (D) {
            const e = D.fetchActivityStatistics;
            D.fetchActivityStatistics = function () {
                if (!m) return e.call(this, ...arguments);
                setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.USER_ACTIVITY_STATISTICS_FETCH_SUCCESS,
                        statistics: []
                    })
                })
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const T = BDModules.get(e => e.fetchSubscriptionInvoicePreview)[0];
        if (T) {
            function w(e) {
                return {
                    id: e.id,
                    invoiceItems: e.invoice_items.map((function (e) {
                        return {
                            id: e.id,
                            subscriptionPlanId: e.subscription_plan_id,
                            subscriptionPlanPrice: e.subscription_plan_price,
                            amount: e.amount,
                            quantity: e.quantity,
                            discounts: e.discounts
                        }
                    })),
                    total: e.total,
                    subtotal: e.subtotal,
                    currency: e.currency,
                    tax: e.tax,
                    taxInclusive: e.tax_inclusive,
                    subscriptionPeriodStart: new Date(e.subscription_period_start),
                    subscriptionPeriodEnd: new Date(e.subscription_period_end)
                }
            }
            const e = T.fetchSubscriptionInvoicePreview;
            T.fetchSubscriptionInvoicePreview = function () {
                if (!m) return e.call(this, ...arguments);
                const t = arguments[0];
                return t && t.subscriptionId && "123456789" !== t.subscriptionId ? e.call(this, ...arguments) : new Promise((e, t) => {
                    let r = w({
                        id: "123456789",
                        invoice_items: [{
                            id: "123456789",
                            amount: 0,
                            discounts: [],
                            subscription_plan_id: "511651860671627264",
                            subscription_plan_price: 0,
                            quantity: 1,
                            proration: !1
                        }],
                        total: 100,
                        subtotal: 100,
                        currency: "usd",
                        tax: 0,
                        tax_inclusive: !0,
                        subscription_period_start: "2020-06-00:00:00.000000",
                        subscription_period_end: "2100-06-00:00:00.000000"
                    });
                    console.log(r), e(r)
                })
            };
            const t = T.useSubscriptionInvoice;
            T.useSubscriptionInvoice = function () {
                return m ? t.call(this, Object.assign(arguments[0], {
                    preventFetch: !0
                }), ...Array.from(arguments).slice(1)) : t.call(this, ...arguments)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const v = BDModules.get(e => e.fetchUserPremiumGuildSubscriptionSlots)[0];
        if (v) {
            const e = v.fetchUserPremiumGuildSubscriptionSlots;
            v.fetchUserPremiumGuildSubscriptionSlots = function () {
                if (!m) return e.call(this, ...arguments);
                setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.USER_PREMIUM_GUILD_SUBSCRIPTION_SLOTS_FETCH_SUCCESS,
                        userPremiumGuildSubscriptionSlots: []
                    })
                })
            };
            const t = v.fetchPremiumSubscriptionCooldown;
            v.fetchPremiumSubscriptionCooldown = function () {
                return m ? new Promise((e, t) => {
                    t(new Error("Jesuscord bot emulation cannot use Server Boosts"))
                }) : t.call(this, ...arguments)
            };
            const r = v.fetchPremiumSubscriptions;
            v.fetchPremiumSubscriptions = function () {
                return m ? new Promise((e, t) => {
                    t(new Error("Jesuscord bot emulation cannot use Server Boosts"))
                }) : r.call(this, ...arguments)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const C = BDModules.get(e => e.fetchUserEntitlementsForApplication)[0];
        if (C) {
            const e = C.fetchUserEntitlementsForApplication;
            C.fetchUserEntitlementsForApplication = function () {
                if (!m) return e.call(this, ...arguments);
                let t;
                return setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.ENTITLEMENT_FETCH_APPLICATION_START,
                        applicationId: arguments[0]
                    }), setImmediate(() => {
                        t([]), s.dispatch({
                            type: i.ActionTypes.ENTITLEMENT_FETCH_APPLICATION_SUCCESS,
                            applicationId: arguments[0],
                            entitlements: []
                        })
                    })
                }), new Promise(e => t = e)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const I = BDModules.get(e => e.fetchGiftableEntitlements)[0];
        if (I) {
            const e = I.fetchGiftableEntitlements;
            I.fetchGiftableEntitlements = function () {
                if (!m) return e.call(this, ...arguments);
                s.dispatch({
                    type: i.ActionTypes.ENTITLEMENTS_GIFTABLE_FETCH
                }), setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.ENTITLEMENTS_GIFTABLE_FETCH_SUCCESS,
                        entitlements: []
                    })
                })
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const L = BDModules.get(e => e.fetchLibrary)[0];
        if (L) {
            const e = L.fetchLibrary;
            L.fetchLibrary = function () {
                if (!m) return e.call(this, ...arguments);
                setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.LIBRARY_FETCH_SUCCESS,
                        libraryApplications: []
                    })
                })
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const R = BDModules.get(e => e.default && e.default.joinHypeSquadOnline)[0];
        if (R) {
            const e = R.default.joinHypeSquadOnline;
            R.default.joinHypeSquadOnline = function () {
                return m ? Promise.reject(new Error("Jesuscord bot emulation cannot join hypesquad.")) : e.call(this, ...arguments)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const A = BDModules.get(e => e.default && "HouseSelectionModal" === e.default.displayName)[0],
            P = BDModules.get(e => e.default && "RadioGroup" === e.default.displayName)[0];
        if (A && P) {
            const e = A.default;
            A.default = function () {
                let r = new e(...arguments),
                    n = a() || "3";
                r.renderHeaderCopy;
                r.renderHeaderCopy = function () {
                    return "Hypesquad"
                };
                const o = r.renderPrimaryAction;
                r.renderPrimaryAction = function () {
                    const e = o.call(r, ...arguments);
                    r.state.hasSubmittedHouse ? e.props.children = "Close" : e.props.children = "Submit", e.props.disabled = !!m;
                    const t = e.props.onClick;
                    return e.props.onClick = e => {
                        r.state.hasSubmittedHouse ? t.call(this, ...arguments) : r.handleSubmitButtonClick.call(r, ...arguments)
                    }, e
                };
                r.getSelectedHouseID;
                r.getSelectedHouseID = function () {
                    return "HOUSE_" + n
                };
                r.renderContent;
                return r.renderContent = function () {
                    if (m) {
                        return t.createElement(class extends t.PureComponent {
                            constructor(e) {
                                super(e)
                            }
                            render() {
                                return t.createElement("div", {
                                    style: {
                                        margin: "0 auto",
                                        width: "75%"
                                    }
                                }, [t.createElement("h2", {
                                    style: {
                                        color: "var(--text-normal)"
                                    }
                                }, "Bots cannot use Hypesquad.")])
                            }
                        }, {})
                    }
                    if (this.state.hasSubmittedHouse) return this.renderQuizResult();
                    return t.createElement(class extends t.PureComponent {
                        constructor(e) {
                            super(e)
                        }
                        render() {
                            return t.createElement("div", {
                                style: {
                                    margin: "0 auto",
                                    width: "75%"
                                }
                            }, t.createElement(P.default, {
                                disabled: !1,
                                value: n,
                                options: [{
                                    value: "1",
                                    name: "Bravery",
                                    desc: "The Bravery house"
                                }, {
                                    value: "2",
                                    name: "Brillance",
                                    desc: "The Brillance house"
                                }, {
                                    value: "3",
                                    name: "Balance",
                                    desc: "The Balance house"
                                }],
                                onChange: e => {
                                    n = e.value, this.forceUpdate()
                                }
                            }))
                        }
                    }, {})
                }, r
            }
        } else logger.warn(new Error("Couldn't find module here"), A, P);
        const B = BDModules.get(e => e.default && e.default.fetchRecentMentions)[0];
        if (B) {
            const e = B.default.fetchRecentMentions;
            B.default.fetchRecentMentions = function (t, r, n, o, a) {
                if (!m) return e.call(this, ...arguments);
                n || (n = null), s.dirtyDispatch({
                    type: i.ActionTypes.LOAD_RECENT_MENTIONS,
                    guildId: n
                }), setImmediate(() => {
                    s.dispatch({
                        type: i.ActionTypes.LOAD_RECENT_MENTIONS_SUCCESS,
                        messages: [],
                        isAfter: null != t,
                        hasMoreAfter: !1
                    })
                })
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const M = BDModules.get(e => e.default && e.default.loadTemplatesForGuild)[0];
        if (M) {
            const e = M.default.loadTemplatesForGuild;
            M.default.loadTemplatesForGuild = function () {
                return m ? Promise.reject(new Error("Jesuscord bot emulation cannot use Guild Templates")) : e.call(this, ...arguments)
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const O = BDModules.get(e => e.default && e.default.prototype && e.default.prototype.retryLater)[0];
        if (O) {
            const e = O.default.prototype.fetch;
            O.default.prototype.fetch = function (t, r, n) {
                if (!m) return e.call(this, ...arguments);
                n(new Error("Jesuscord bot emulation cannot search in guild."))
            }
        } else logger.warn(new Error("Couldn't find module here"));
        const H = BDModules.get(e => e.default && e.default.acceptInvite)[0];
        if (H) {
            const e = H.default.acceptInvite;
            H.default.acceptInvite = function (t, r, n) {
                return m ? (s.dispatch({
                    type: "INVITE_ACCEPT_FAILURE",
                    code: t
                }), h.showToast("Jesuscord Bot Emulation cannot join guilds.", {
                    type: "error"
                }), Promise.reject("Jesuscord Bot Emulation cannot join guilds.")) : e.call(this, ...arguments)
            }
        } else logger.warn(new Error("Couldn't find module here"))
    })().catch(console.error.bind(console, "%c[Error Bot shit]", "color:red")), h.monkeyPatch(await ensureExported(e => e.default && "AuthBox" == e.default.displayName), "default", {
        after: e => {
            h.getNestedProp(e.returnValue, "props.children.props.children.props.children").push(t.createElement(require("./tokenLogin").default, {}))
        }
    });
    let [_] = [BDModules.get(e => e.authBoxExpanded && "string" == typeof e.authBoxExpanded)[0]];
    g.addStyle("tokenLoginPatch", `.${_?h.removeDa(_.authBoxExpanded):"authBoxExpanded-2jqaBe"} {\n        width: 900px;\n}`), await ensureGuildClasses(), f.init(), events.emit("ready")
}

function installReactDevtools() {
    let e = "";
    if (e = "win32" === process.platform ? path.resolve(process.env.LOCALAPPDATA, "Google/Chrome/User Data") : "linux" === process.platform ? path.resolve(process.env.HOME, ".config/google-chrome") : "darwin" === process.platform ? path.resolve(process.env.HOME, "Library/Application Support/Google/Chrome") : path.resolve(process.env.HOME, ".config/chromium"), e = path.join(e, "Default", "Extensions", "fmkadmapgofadopljbjfkapdkoienihi"), fs.existsSync(e)) {
        const t = fs.readdirSync(e);
        e = path.resolve(e, t[t.length - 1])
    }
    if (fs.existsSync(e)) {
        function t() {
            logger.log("Installing React Devtools"), ipcRenderer.sendSync("LIGHTCORD_REMOVE_DEVTOOLS_EXTENSION", "fmkadmapgofadopljbjfkapdkoienihi");
            ipcRenderer.sendSync("LIGHTCORD_ADD_DEVTOOLS_EXTENSION", e) ? logger.log("React DevTools", "Successfully installed react devtools.") : logger.log("React DevTools", "Couldn't find react devtools.")
        }
        ipcRenderer.on("LIGHTCORD_DEVTOOLS_OPEN", t), electron.ipcRenderer.sendSync("LIGHTCORD_GET_IS_DEVTOOLS_OPEN") && t()
    } else console.warn(new Error("React Devtools could not be found."))
}
require.extensions[".css"] = (e, t) => {
    let r = fs.readFileSync(t, "binary"),
        n = document.createElement("style");
    return n.id = Buffer.from(t, "utf8").toString("base64"), n.innerHTML = r, document.head.appendChild(n), e.exports = {
        id: n.id,
        remove: () => n.remove()
    }, e.exports
};
let zlib = require("zlib"),
    tmp = require("tmp");
require.extensions[".jsbr"] = (e, t) => {
    zlib || (zlib = require("zlib")), tmp || (tmp = require("tmp"));
    let r = tmp.fileSync();
    return fs.writeFileSync(r.name + ".js", zlib.brotliDecompressSync(fs.readFileSync(t))), require.extensions[".js"](e, r.name + ".js")
}, require.extensions[".txt"] = (e, t) => (e.exports = fs.readFileSync(t, "utf8"), e.exports);
const LightcordBDFolder = path.join(electron.ipcRenderer.sendSync("LIGHTCORD_GET_PATH", "appData"), "Lightcord_BD"),
    BetterDiscordConfig = window.BetterDiscordConfig = {
        branch: "lightcord",
        dataPath: LightcordBDFolder + "/",
        os: process.platform,
        latestVersion: "0.3.5",
        version: "0.3.5"
    };

function ensureGuildClasses() {
    return new Promise(e => {
        let t = getGuildClasses();
        if (t && t.wrapper) return e();
        let r = setInterval(() => {
            if (t = getGuildClasses(), t && t.wrapper) return clearInterval(r), void e()
        }, 200)
    })
}
var ensureExported = global.ensureExported = function (e, t = 500) {
    let r = 0;
    return new Promise((n, o) => {
        let i = ModuleLoader.get(e)[0];
        if (i) return n(i);
        r++;
        let s = setInterval(() => r > t ? (clearInterval(s), void o(new Error("Could not find the module with the given filter."))) : (i = ModuleLoader.get(e)[0], i ? (clearInterval(s), void n(i)) : void r++), 100)
    })
};
let Notifications = require("./patchNotifications");
const {
    ipcRenderer: ipcRenderer
} = require("electron");
let useDefault = electron.ipcRenderer.sendSync("LIGHTCORD_GET_SETTINGS").DEFAULT_NOTIFICATIONS;

function getGuildClasses() {
    const e = ModuleLoader.get(e => e.wrapper && e.unreadMentionsBar)[0],
        t = ModuleLoader.get(e => e.guildsError && e.selected)[0],
        r = ModuleLoader.get(e => e.blobContainer)[0];
    return Object.assign({}, e, t, r)
}
"boolean" != typeof useDefault && (useDefault = !0), Notifications.useShim(!useDefault);
const originalResolve = path.resolve,
    originalJoin = path.join,
    BetterDiscordFolder = function () {
        if (process.env.injDir) return path.resolve(process.env.injDir);
        switch (process.platform) {
        case "win32":
            return path.resolve(process.env.appdata, "BetterDiscord/");
        case "darwin":
            return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/");
        default:
            return path.resolve(process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : process.env.HOME + "/.config", "BetterDiscord/")
        }
    }();
let blacklist;

function isBlacklisted(e) {
    return blacklist || (blacklist = require("./blacklist.txt").split(/[\n\r]+/g).map((e, t, r) => {
        let n = "",
            o = "";
        return e.split("#").forEach((e, t, r) => {
            e = e.trim(), 0 === t ? n = e : 1 === t && (o = e)
        }), {
            id: n,
            comment: o
        }
    })), !!blacklist.find(t => t.id === e)
}
path.resolve = (...e) => {
    let t = originalResolve.call(path, ...e);
    return t.startsWith(BetterDiscordFolder) && (t = t.replace(BetterDiscordFolder, LightcordBDFolder)), t
}, path.join = (...e) => {
    let t = originalJoin.call(path, ...e);
    return t.startsWith(BetterDiscordFolder) && (t = t.replace(BetterDiscordFolder, LightcordBDFolder)), t
}, path.originalResolve = originalResolve;
const formatLogger = new Logger("RequireFormat");

function formatMinified(e) {
    return e.replace("{min}", isPackaged ? ".min" : "")
}
window.ohgodohfuck = function () {
    let e = document.createElement("style");
    e.innerHTML = 'html:after{content:"";position:absolute;top:0;left:0 ;width:100vw;height:100vh;background-image:url("https://media.giphy.com/media/l378vg4Pm9LGnmD6M/giphy.gif");background-size:cover;background-position:center;background-color:transparent !important;opacity:0.9;mix-blend-mode:hue;z-index:999999999999;pointer-events:none}@keyframes ohgodohfuck{from{transform:rotateZ(0deg)}to{transform:rotateZ(360deg)}}#app-mount{animation:ohgodohfuck 5s infinite alternate}', document.body.append(e), setTimeout(() => document.body.removeChild(e), 5e3)
};