import { a as j, b as k, c as U, d as P, e as z, f as B, g as x, h as G } from "@nf-internal/chunk-6W36LU3Y";
import { a as E, b as O, c as T, d as H, e as N, f as A, g as L } from "@nf-internal/chunk-PCY2MORF";
import "@nf-internal/chunk-4CLCTAJ7";
import { \u0275getDOM as M, DOCUMENT as h } from "@angular/common";
import { \u0275getDOM as Ge } from "@angular/common";
import * as o from "@angular/core";
import { \u0275global as w, ApplicationRef as V, InjectionToken as b, Injector as $, Optional as Y, \u0275Console as ge, \u0275RuntimeError as g, SecurityContext as d, \u0275allowSanitizationBypassAndThrow as p, \u0275unwrapSafeValue as f, \u0275_sanitizeUrl as F, \u0275_sanitizeHtml as q, \u0275bypassSanitizationTrustHtml as X, \u0275bypassSanitizationTrustStyle as J, \u0275bypassSanitizationTrustScript as K, \u0275bypassSanitizationTrustUrl as Z, \u0275bypassSanitizationTrustResourceUrl as Q, makeEnvironmentProviders as W, \u0275withDomHydration as ee, \u0275withEventReplay as te, \u0275withI18nSupport as ne, \u0275withIncrementalHydration as re, ENVIRONMENT_INITIALIZER as Te, inject as we, \u0275IS_ENABLED_BLOCKING_INITIAL_NAVIGATION as Se, \u0275formatRuntimeError as Me, Version as oe } from "@angular/core";
import { \u0275withHttpTransferCache as D } from "@angular/common/http";
var Ie = (() => { class t {
    _doc;
    _dom;
    constructor(e) { this._doc = e, this._dom = M(); }
    addTag(e, n = !1) { return e ? this._getOrCreateElement(e, n) : null; }
    addTags(e, n = !1) { return e ? e.reduce((r, s) => (s && r.push(this._getOrCreateElement(s, n)), r), []) : []; }
    getTag(e) { return e && this._doc.querySelector(`meta[${e}]`) || null; }
    getTags(e) { if (!e)
        return []; let n = this._doc.querySelectorAll(`meta[${e}]`); return n ? [].slice.call(n) : []; }
    updateTag(e, n) { if (!e)
        return null; n = n || this._parseSelector(e); let r = this.getTag(n); return r ? this._setMetaElementAttributes(e, r) : this._getOrCreateElement(e, !0); }
    removeTag(e) { this.removeTagElement(this.getTag(e)); }
    removeTagElement(e) { e && this._dom.remove(e); }
    _getOrCreateElement(e, n = !1) { if (!n) {
        let c = this._parseSelector(e), a = this.getTags(c).filter(l => this._containsAttributes(e, l))[0];
        if (a !== void 0)
            return a;
    } let r = this._dom.createElement("meta"); return this._setMetaElementAttributes(e, r), this._doc.getElementsByTagName("head")[0].appendChild(r), r; }
    _setMetaElementAttributes(e, n) { return Object.keys(e).forEach(r => n.setAttribute(this._getMetaKeyMap(r), e[r])), n; }
    _parseSelector(e) { let n = e.name ? "name" : "property"; return `${n}="${e[n]}"`; }
    _containsAttributes(e, n) { return Object.keys(e).every(r => n.getAttribute(this._getMetaKeyMap(r)) === e[r]); }
    _getMetaKeyMap(e) { return ie[e] || e; }
    static \u0275fac = function (n) { return new (n || t)(o.\u0275\u0275inject(h)); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: t.\u0275fac, providedIn: "root" });
} return t; })(), ie = { httpEquiv: "http-equiv" }, Ce = (() => { class t {
    _doc;
    constructor(e) { this._doc = e; }
    getTitle() { return this._doc.title; }
    setTitle(e) { this._doc.title = e || ""; }
    static \u0275fac = function (n) { return new (n || t)(o.\u0275\u0275inject(h)); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: t.\u0275fac, providedIn: "root" });
} return t; })();
function I(t, i) { if (typeof COMPILED > "u" || !COMPILED) {
    let e = w.ng = w.ng || {};
    e[t] = i;
} }
var _ = class {
    msPerTick;
    numTicks;
    constructor(i, e) { this.msPerTick = i, this.numTicks = e; }
}, v = class {
    appRef;
    constructor(i) { this.appRef = i.injector.get(V); }
    timeChangeDetection(i) { let e = i && i.record, n = "Change Detection"; e && "profile" in console && typeof console.profile == "function" && console.profile(n); let r = performance.now(), s = 0; for (; s < 5 || performance.now() - r < 500;)
        this.appRef.tick(), s++; let c = performance.now(); e && "profileEnd" in console && typeof console.profileEnd == "function" && console.profileEnd(n); let a = (c - r) / s; return console.log(`ran ${s} change detection cycles`), console.log(`${a.toFixed(2)} ms per check`), new _(a, s); }
}, C = "profiler";
function Re(t) { return I(C, new v(t)), t; }
function Oe() { I(C, null); }
var S = class {
    static all() { return () => !0; }
    static css(i) { return e => e.nativeElement != null ? se(e.nativeElement, i) : !1; }
    static directive(i) { return e => e.providerTokens.indexOf(i) !== -1; }
};
function se(t, i) { return M().isElementNode(t) ? t.matches && t.matches(i) || t.msMatchesSelector && t.msMatchesSelector(i) || t.webkitMatchesSelector && t.webkitMatchesSelector(i) : !1; }
var ae = { pan: !0, panstart: !0, panmove: !0, panend: !0, pancancel: !0, panleft: !0, panright: !0, panup: !0, pandown: !0, pinch: !0, pinchstart: !0, pinchmove: !0, pinchend: !0, pinchcancel: !0, pinchin: !0, pinchout: !0, press: !0, pressup: !0, rotate: !0, rotatestart: !0, rotatemove: !0, rotateend: !0, rotatecancel: !0, swipe: !0, swipeleft: !0, swiperight: !0, swipeup: !0, swipedown: !0, tap: !0, doubletap: !0 }, y = new b(""), R = new b(""), ce = (() => { class t {
    events = [];
    overrides = {};
    options;
    buildHammer(e) { let n = new Hammer(e, this.options); n.get("pinch").set({ enable: !0 }), n.get("rotate").set({ enable: !0 }); for (let r in this.overrides)
        n.get(r).set(this.overrides[r]); return n; }
    static \u0275fac = function (n) { return new (n || t); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: t.\u0275fac });
} return t; })(), ue = (() => { class t extends E {
    _config;
    _injector;
    loader;
    _loaderPromise = null;
    constructor(e, n, r, s) { super(e), this._config = n, this._injector = r, this.loader = s; }
    supports(e) { return !(!ae.hasOwnProperty(e.toLowerCase()) && !this.isCustomEvent(e) || !window.Hammer && !this.loader); }
    addEventListener(e, n, r) { let s = this.manager.getZone(); if (n = n.toLowerCase(), !window.Hammer && this.loader) {
        this._loaderPromise = this._loaderPromise || s.runOutsideAngular(() => this.loader());
        let c = !1, a = () => { c = !0; };
        return s.runOutsideAngular(() => this._loaderPromise.then(() => { if (!window.Hammer) {
            a = () => { };
            return;
        } c || (a = this.addEventListener(e, n, r)); }).catch(() => { a = () => { }; })), () => { a(); };
    } return s.runOutsideAngular(() => { let c = this._config.buildHammer(e), a = function (l) { s.runGuarded(function () { r(l); }); }; return c.on(n, a), () => { c.off(n, a), typeof c.destroy == "function" && c.destroy(); }; }); }
    isCustomEvent(e) { return this._config.events.indexOf(e) > -1; }
    static \u0275fac = function (n) { return new (n || t)(o.\u0275\u0275inject(h), o.\u0275\u0275inject(y), o.\u0275\u0275inject(o.Injector), o.\u0275\u0275inject(R, 8)); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: t.\u0275fac });
} return t; })(), He = (() => { class t {
    static \u0275fac = function (n) { return new (n || t); };
    static \u0275mod = o.\u0275\u0275defineNgModule({ type: t });
    static \u0275inj = o.\u0275\u0275defineInjector({ providers: [{ provide: T, useClass: ue, multi: !0, deps: [h, y, $, [new Y, R]] }, { provide: y, useClass: ce }] });
} return t; })(), de = (() => { class t {
    static \u0275fac = function (n) { return new (n || t); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: function (n) { let r = null; return n ? r = new (n || t) : r = o.\u0275\u0275inject(le), r; }, providedIn: "root" });
} return t; })(), le = (() => { class t extends de {
    _doc;
    constructor(e) { super(), this._doc = e; }
    sanitize(e, n) { if (n == null)
        return null; switch (e) {
        case d.NONE: return n;
        case d.HTML: return p(n, "HTML") ? f(n) : q(this._doc, String(n)).toString();
        case d.STYLE: return p(n, "Style") ? f(n) : n;
        case d.SCRIPT:
            if (p(n, "Script"))
                return f(n);
            throw new g(5200, !1);
        case d.URL: return p(n, "URL") ? f(n) : F(String(n));
        case d.RESOURCE_URL:
            if (p(n, "ResourceURL"))
                return f(n);
            throw new g(5201, !1);
        default: throw new g(5202, !1);
    } }
    bypassSecurityTrustHtml(e) { return X(e); }
    bypassSecurityTrustStyle(e) { return J(e); }
    bypassSecurityTrustScript(e) { return K(e); }
    bypassSecurityTrustUrl(e) { return Z(e); }
    bypassSecurityTrustResourceUrl(e) { return Q(e); }
    static \u0275fac = function (n) { return new (n || t)(o.\u0275\u0275inject(h)); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: t, factory: t.\u0275fac, providedIn: "root" });
} return t; })(), u = (function (t) { return t[t.NoHttpTransferCache = 0] = "NoHttpTransferCache", t[t.HttpTransferCacheOptions = 1] = "HttpTransferCacheOptions", t[t.I18nSupport = 2] = "I18nSupport", t[t.EventReplay = 3] = "EventReplay", t[t.IncrementalHydration = 4] = "IncrementalHydration", t; })(u || {});
function m(t, i = [], e = {}) { return { \u0275kind: t, \u0275providers: i }; }
function Ne() { return m(u.NoHttpTransferCache); }
function Ae(t) { return m(u.HttpTransferCacheOptions, D(t)); }
function Le() { return m(u.I18nSupport, ne()); }
function je() { return m(u.EventReplay, te()); }
function ke() { return m(u.IncrementalHydration, re()); }
function Ue(...t) { let i = [], e = new Set; for (let { \u0275providers: r, \u0275kind: s } of t)
    e.add(s), r.length && i.push(r); let n = e.has(u.HttpTransferCacheOptions); return W([[], [], ee(), e.has(u.NoHttpTransferCache) || n ? [] : D({}), i]); }
var Pe = new oe("21.2.8");
export { G as BrowserModule, S as By, de as DomSanitizer, T as EVENT_MANAGER_PLUGINS, H as EventManager, E as EventManagerPlugin, y as HAMMER_GESTURE_CONFIG, R as HAMMER_LOADER, ce as HammerGestureConfig, He as HammerModule, u as HydrationFeatureKind, Ie as Meta, A as REMOVE_STYLES_ON_COMPONENT_DESTROY, Ce as Title, Pe as VERSION, P as bootstrapApplication, z as createApplication, Oe as disableDebugTools, Re as enableDebugTools, x as platformBrowser, Ue as provideClientHydration, B as provideProtractorTestingSupport, je as withEventReplay, Ae as withHttpTransferCacheOptions, Le as withI18nSupport, ke as withIncrementalHydration, Ne as withNoHttpTransferCache, j as \u0275BrowserDomAdapter, k as \u0275BrowserGetTestability, O as \u0275DomEventsPlugin, L as \u0275DomRendererFactory2, le as \u0275DomSanitizerImpl, ue as \u0275HammerGesturesPlugin, U as \u0275KeyEventsPlugin, N as \u0275SharedStylesHost, Ge as \u0275getDOM };
/*! Bundled license information:

@angular/platform-browser/fesm2022/platform-browser.mjs:
  (**
   * @license Angular v21.2.8
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
