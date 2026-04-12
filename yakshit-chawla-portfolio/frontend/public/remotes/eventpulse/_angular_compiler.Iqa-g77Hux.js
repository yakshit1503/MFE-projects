import { a as S, b as pe } from "@nf-internal/chunk-4CLCTAJ7";
var gu = new RegExp(`(\\:not\\()|(([\\.\\#]?)[-\\w]+)|(?:\\[([-.\\w*\\\\$]+)(?:=(["']?)([^\\]"']*)\\5)?\\])|(\\))|(\\s*,\\s*)`, "g"), is = class n {
    element = null;
    classNames = [];
    attrs = [];
    notSelectors = [];
    static parse(e) { let t = [], s = (l, c) => { c.notSelectors.length > 0 && !c.element && c.classNames.length == 0 && c.attrs.length == 0 && (c.element = "*"), l.push(c); }, r = new n, i, o = r, a = !1; for (gu.lastIndex = 0; i = gu.exec(e);) {
        if (i[1]) {
            if (a)
                throw new Error("Nesting :not in a selector is not allowed");
            a = !0, o = new n, r.notSelectors.push(o);
        }
        let l = i[2];
        if (l) {
            let h = i[3];
            h === "#" ? o.addAttribute("id", l.slice(1)) : h === "." ? o.addClassName(l.slice(1)) : o.setElement(l);
        }
        let c = i[4];
        if (c && o.addAttribute(o.unescapeAttribute(c), i[6]), i[7] && (a = !1, o = r), i[8]) {
            if (a)
                throw new Error("Multiple selectors in :not are not supported");
            s(t, r), r = o = new n;
        }
    } return s(t, r), t; }
    unescapeAttribute(e) { let t = "", s = !1; for (let r = 0; r < e.length; r++) {
        let i = e.charAt(r);
        if (i === "\\") {
            s = !0;
            continue;
        }
        if (i === "$" && !s)
            throw new Error(`Error in attribute selector "${e}". Unescaped "$" is not supported. Please escape with "\\$".`);
        s = !1, t += i;
    } return t; }
    escapeAttribute(e) { return e.replace(/\\/g, "\\\\").replace(/\$/g, "\\$"); }
    isElementSelector() { return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 && this.notSelectors.length === 0; }
    hasElementSelector() { return !!this.element; }
    setElement(e = null) { this.element = e; }
    getAttrs() { let e = []; return this.classNames.length > 0 && e.push("class", this.classNames.join(" ")), e.concat(this.attrs); }
    addAttribute(e, t = "") { this.attrs.push(e, t && t.toLowerCase() || ""); }
    addClassName(e) { this.classNames.push(e.toLowerCase()); }
    toString() { let e = this.element || ""; if (this.classNames && this.classNames.forEach(t => e += `.${t}`), this.attrs)
        for (let t = 0; t < this.attrs.length; t += 2) {
            let s = this.escapeAttribute(this.attrs[t]), r = this.attrs[t + 1];
            e += `[${s}${r ? "=" + r : ""}]`;
        } return this.notSelectors.forEach(t => e += `:not(${t})`), e; }
}, Rr = class n {
    static createNotMatcher(e) { let t = new n; return t.addSelectables(e, null), t; }
    _elementMap = new Map;
    _elementPartialMap = new Map;
    _classMap = new Map;
    _classPartialMap = new Map;
    _attrValueMap = new Map;
    _attrValuePartialMap = new Map;
    _listContexts = [];
    addSelectables(e, t) { let s = null; e.length > 1 && (s = new za(e), this._listContexts.push(s)); for (let r = 0; r < e.length; r++)
        this._addSelectable(e[r], t, s); }
    _addSelectable(e, t, s) { let r = this, i = e.element, o = e.classNames, a = e.attrs, l = new Ga(e, t, s); if (i && (a.length === 0 && o.length === 0 ? this._addTerminal(r._elementMap, i, l) : r = this._addPartial(r._elementPartialMap, i)), o)
        for (let c = 0; c < o.length; c++) {
            let h = a.length === 0 && c === o.length - 1, p = o[c];
            h ? this._addTerminal(r._classMap, p, l) : r = this._addPartial(r._classPartialMap, p);
        } if (a)
        for (let c = 0; c < a.length; c += 2) {
            let h = c === a.length - 2, p = a[c], m = a[c + 1];
            if (h) {
                let v = r._attrValueMap, w = v.get(p);
                w || (w = new Map, v.set(p, w)), this._addTerminal(w, m, l);
            }
            else {
                let v = r._attrValuePartialMap, w = v.get(p);
                w || (w = new Map, v.set(p, w)), r = this._addPartial(w, m);
            }
        } }
    _addTerminal(e, t, s) { let r = e.get(t); r || (r = [], e.set(t, r)), r.push(s); }
    _addPartial(e, t) { let s = e.get(t); return s || (s = new n, e.set(t, s)), s; }
    match(e, t) { let s = !1, r = e.element, i = e.classNames, o = e.attrs; for (let a = 0; a < this._listContexts.length; a++)
        this._listContexts[a].alreadyMatched = !1; if (s = this._matchTerminal(this._elementMap, r, e, t) || s, s = this._matchPartial(this._elementPartialMap, r, e, t) || s, i)
        for (let a = 0; a < i.length; a++) {
            let l = i[a];
            s = this._matchTerminal(this._classMap, l, e, t) || s, s = this._matchPartial(this._classPartialMap, l, e, t) || s;
        } if (o)
        for (let a = 0; a < o.length; a += 2) {
            let l = o[a], c = o[a + 1], h = this._attrValueMap.get(l);
            c && (s = this._matchTerminal(h, "", e, t) || s), s = this._matchTerminal(h, c, e, t) || s;
            let p = this._attrValuePartialMap.get(l);
            c && (s = this._matchPartial(p, "", e, t) || s), s = this._matchPartial(p, c, e, t) || s;
        } return s; }
    _matchTerminal(e, t, s, r) { if (!e || typeof t != "string")
        return !1; let i = e.get(t) || [], o = e.get("*"); if (o && (i = i.concat(o)), i.length === 0)
        return !1; let a, l = !1; for (let c = 0; c < i.length; c++)
        a = i[c], l = a.finalize(s, r) || l; return l; }
    _matchPartial(e, t, s, r) { if (!e || typeof t != "string")
        return !1; let i = e.get(t); return i ? i.match(s, r) : !1; }
}, za = class {
    selectors;
    alreadyMatched = !1;
    constructor(e) { this.selectors = e; }
}, Ga = class {
    selector;
    cbContext;
    listContext;
    notSelectors;
    constructor(e, t, s) { this.selector = e, this.cbContext = t, this.listContext = s, this.notSelectors = e.notSelectors; }
    finalize(e, t) { let s = !0; return this.notSelectors.length > 0 && (!this.listContext || !this.listContext.alreadyMatched) && (s = !Rr.createNotMatcher(this.notSelectors).match(e, null)), s && t && (!this.listContext || !this.listContext.alreadyMatched) && (this.listContext && (this.listContext.alreadyMatched = !0), t(this.selector, this.cbContext)), s; }
}, oo = class {
    registry;
    constructor(e) { this.registry = e; }
    match(e) { return this.registry.has(e) ? this.registry.get(e) : []; }
}, Nd = !0, Ct = (function (n) { return n[n.Emulated = 0] = "Emulated", n[n.None = 2] = "None", n[n.ShadowDom = 3] = "ShadowDom", n[n.ExperimentalIsolatedShadowDom = 4] = "ExperimentalIsolatedShadowDom", n; })(Ct || {}), Ri = (function (n) { return n[n.OnPush = 0] = "OnPush", n[n.Default = 1] = "Default", n[n.Eager = 1] = "Eager", n; })(Ri || {}), Ns = (function (n) { return n[n.None = 0] = "None", n[n.SignalBased = 1] = "SignalBased", n[n.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", n; })(Ns || {}), Xa = { name: "custom-elements" }, Ya = { name: "no-errors-schema" }, Dd = Function, J = (function (n) { return n[n.NONE = 0] = "NONE", n[n.HTML = 1] = "HTML", n[n.STYLE = 2] = "STYLE", n[n.SCRIPT = 3] = "SCRIPT", n[n.URL = 4] = "URL", n[n.RESOURCE_URL = 5] = "RESOURCE_URL", n[n.ATTRIBUTE_NO_BINDING = 6] = "ATTRIBUTE_NO_BINDING", n; })(J || {}), $s = (function (n) { return n[n.Error = 0] = "Error", n[n.Warning = 1] = "Warning", n[n.Ignore = 2] = "Ignore", n; })($s || {});
function Pd(n) { let e = n.classNames && n.classNames.length ? [8, ...n.classNames] : []; return [n.element && n.element !== "*" ? n.element : "", ...n.attrs, ...e]; }
function Ld(n) { let e = n.classNames && n.classNames.length ? [8, ...n.classNames] : []; return n.element ? [5, n.element, ...n.attrs, ...e] : n.attrs.length ? [3, ...n.attrs, ...e] : n.classNames && n.classNames.length ? [9, ...n.classNames] : []; }
function Bd(n) { let e = Pd(n), t = n.notSelectors && n.notSelectors.length ? n.notSelectors.map(s => Ld(s)) : []; return e.concat(...t); }
function da(n) { return n ? is.parse(n).map(Bd) : []; }
var rk = Object.freeze({ __proto__: null, CUSTOM_ELEMENTS_SCHEMA: Xa, get ChangeDetectionStrategy() { return Ri; }, get InputFlags() { return Ns; }, get MissingTranslationStrategy() { return $s; }, NO_ERRORS_SCHEMA: Ya, get SecurityContext() { return J; }, Type: Dd, get ViewEncapsulation() { return Ct; }, emitDistinctChangesOnlyDefaultValue: Nd, parseSelectorToR3Selector: da }), Lt = (function (n) { return n[n.Directive = 0] = "Directive", n[n.Component = 1] = "Component", n[n.Injectable = 2] = "Injectable", n[n.Pipe = 3] = "Pipe", n[n.NgModule = 4] = "NgModule", n; })(Lt || {});
var ao;
function yp(n) { return n.id || Cp(n); }
function Cp(n) { return Fd(Rd(n.nodes).join("") + `[${n.meaning}]`); }
function Wc(n) { return n.id || Ap(n); }
function Ap(n) { let e = new Qa, t = n.nodes.map(s => s.visit(e, null)); return kp(t.join(""), n.meaning); }
var lo = class {
    visitText(e, t) { return e.value; }
    visitContainer(e, t) { return `[${e.children.map(s => s.visit(this)).join(", ")}]`; }
    visitIcu(e, t) { let s = Object.keys(e.cases).map(r => `${r} {${e.cases[r].visit(this)}}`); return `{${e.expression}, ${e.type}, ${s.join(", ")}}`; }
    visitTagPlaceholder(e, t) { return e.isVoid ? `<ph tag name="${e.startName}"/>` : `<ph tag name="${e.startName}">${e.children.map(s => s.visit(this)).join(", ")}</ph name="${e.closeName}">`; }
    visitPlaceholder(e, t) { return e.value ? `<ph name="${e.name}">${e.value}</ph>` : `<ph name="${e.name}"/>`; }
    visitIcuPlaceholder(e, t) { return `<ph icu name="${e.name}">${e.value.visit(this)}</ph>`; }
    visitBlockPlaceholder(e, t) { return `<ph block name="${e.startName}">${e.children.map(s => s.visit(this)).join(", ")}</ph name="${e.closeName}">`; }
}, Md = new lo;
function Rd(n) { return n.map(e => e.visit(Md, null)); }
var Qa = class extends lo {
    visitIcu(e) { let t = Object.keys(e.cases).map(s => `${s} {${e.cases[s].visit(this)}}`); return `{${e.type}, ${t.join(", ")}}`; }
};
function Fd(n) { ao ??= new TextEncoder; let e = [...ao.encode(n)], t = Vd(e, jc.Big), s = e.length * 8, r = new Uint32Array(80), i = 1732584193, o = 4023233417, a = 2562383102, l = 271733878, c = 3285377520; t[s >> 5] |= 128 << 24 - s % 32, t[(s + 64 >> 9 << 4) + 15] = s; for (let h = 0; h < t.length; h += 16) {
    let p = i, m = o, v = a, w = l, C = c;
    for (let T = 0; T < 80; T++) {
        T < 16 ? r[T] = t[h + T] : r[T] = Aa(r[T - 3] ^ r[T - 8] ^ r[T - 14] ^ r[T - 16], 1);
        let A = $d(T, o, a, l), R = A[0], se = A[1], O = [Aa(i, 5), R, c, se, r[T]].reduce(xs);
        c = l, l = a, a = Aa(o, 30), o = i, i = O;
    }
    i = xs(i, p), o = xs(o, m), a = xs(a, v), l = xs(l, w), c = xs(c, C);
} return pr(i) + pr(o) + pr(a) + pr(l) + pr(c); }
function pr(n) { return (n >>> 0).toString(16).padStart(8, "0"); }
function $d(n, e, t, s) { return n < 20 ? [e & t | ~e & s, 1518500249] : n < 40 ? [e ^ t ^ s, 1859775393] : n < 60 ? [e & t | e & s | t & s, 2400959708] : [e ^ t ^ s, 3395469782]; }
function vu(n) { ao ??= new TextEncoder; let e = ao.encode(n), t = new DataView(e.buffer, e.byteOffset, e.byteLength), s = wu(t, e.length, 0), r = wu(t, e.length, 102072); return s == 0 && (r == 0 || r == 1) && (s = s ^ 319790063, r = r ^ -1801410264), BigInt.asUintN(32, BigInt(s)) << BigInt(32) | BigInt.asUintN(32, BigInt(r)); }
function kp(n, e = "") { let t = vu(n); return e && (t = BigInt.asUintN(64, t << BigInt(1)) | t >> BigInt(63) & BigInt(1), t += vu(e)), BigInt.asUintN(63, t).toString(); }
function wu(n, e, t) { let s = 2654435769, r = 2654435769, i = 0, o = e - 12; for (; i <= o; i += 12) {
    s += n.getUint32(i, !0), r += n.getUint32(i + 4, !0), t += n.getUint32(i + 8, !0);
    let l = Eu(s, r, t);
    s = l[0], r = l[1], t = l[2];
} let a = e - i; return t += e, a >= 4 ? (s += n.getUint32(i, !0), i += 4, a >= 8 ? (r += n.getUint32(i, !0), i += 4, a >= 9 && (t += n.getUint8(i++) << 8), a >= 10 && (t += n.getUint8(i++) << 16), a === 11 && (t += n.getUint8(i++) << 24)) : (a >= 5 && (r += n.getUint8(i++)), a >= 6 && (r += n.getUint8(i++) << 8), a === 7 && (r += n.getUint8(i++) << 16))) : (a >= 1 && (s += n.getUint8(i++)), a >= 2 && (s += n.getUint8(i++) << 8), a === 3 && (s += n.getUint8(i++) << 16)), Eu(s, r, t)[2]; }
function Eu(n, e, t) { return n -= e, n -= t, n ^= t >>> 13, e -= t, e -= n, e ^= n << 8, t -= n, t -= e, t ^= e >>> 13, n -= e, n -= t, n ^= t >>> 12, e -= t, e -= n, e ^= n << 16, t -= n, t -= e, t ^= e >>> 5, n -= e, n -= t, n ^= t >>> 3, e -= t, e -= n, e ^= n << 10, t -= n, t -= e, t ^= e >>> 15, [n, e, t]; }
var jc = (function (n) { return n[n.Little = 0] = "Little", n[n.Big = 1] = "Big", n; })(jc || {});
function xs(n, e) { return Od(n, e)[1]; }
function Od(n, e) { let t = (n & 65535) + (e & 65535), s = (n >>> 16) + (e >>> 16) + (t >>> 16); return [s >>> 16, s << 16 | t & 65535]; }
function Aa(n, e) { return n << e | n >>> 32 - e; }
function Vd(n, e) { let t = n.length + 3 >>> 2, s = []; for (let r = 0; r < t; r++)
    s[r] = qd(n, r * 4, e); return s; }
function Su(n, e) { return e >= n.length ? 0 : n[e]; }
function qd(n, e, t) { let s = 0; if (t === jc.Big)
    for (let r = 0; r < 4; r++)
        s += Su(n, e + r) << 24 - 8 * r;
else
    for (let r = 0; r < 4; r++)
        s += Su(n, e + r) << 8 * r; return s; }
var zc = (function (n) { return n[n.None = 0] = "None", n[n.Const = 1] = "Const", n; })(zc || {}), xn = class {
    modifiers;
    constructor(e = zc.None) { this.modifiers = e; }
    hasModifier(e) { return (this.modifiers & e) !== 0; }
}, Yt = (function (n) { return n[n.Dynamic = 0] = "Dynamic", n[n.Bool = 1] = "Bool", n[n.String = 2] = "String", n[n.Int = 3] = "Int", n[n.Number = 4] = "Number", n[n.Function = 5] = "Function", n[n.Inferred = 6] = "Inferred", n[n.None = 7] = "None", n; })(Yt || {}), kt = class extends xn {
    name;
    constructor(e, t) { super(t), this.name = e; }
    visitType(e, t) { return e.visitBuiltinType(this, t); }
}, nt = class extends xn {
    value;
    typeParams;
    constructor(e, t, s = null) { super(t), this.value = e, this.typeParams = s; }
    visitType(e, t) { return e.visitExpressionType(this, t); }
}, Za = class extends xn {
    of;
    constructor(e, t) { super(t), this.of = e; }
    visitType(e, t) { return e.visitArrayType(this, t); }
}, Ja = class extends xn {
    valueType;
    constructor(e, t) { super(t), this.valueType = e || null; }
    visitType(e, t) { return e.visitMapType(this, t); }
}, co = class extends xn {
    type;
    constructor(e, t) { super(t), this.type = e; }
    visitType(e, t) { return e.visitTransplantedType(this, t); }
}, re = new kt(Yt.Dynamic), gt = new kt(Yt.Inferred), _p = new kt(Yt.Bool), Ud = new kt(Yt.Int), yn = new kt(Yt.Number), ma = new kt(Yt.String), Hd = new kt(Yt.Function), _t = new kt(Yt.None), Os = (function (n) { return n[n.Minus = 0] = "Minus", n[n.Plus = 1] = "Plus", n; })(Os || {}), x = (function (n) { return n[n.Equals = 0] = "Equals", n[n.NotEquals = 1] = "NotEquals", n[n.Assign = 2] = "Assign", n[n.Identical = 3] = "Identical", n[n.NotIdentical = 4] = "NotIdentical", n[n.Minus = 5] = "Minus", n[n.Plus = 6] = "Plus", n[n.Divide = 7] = "Divide", n[n.Multiply = 8] = "Multiply", n[n.Modulo = 9] = "Modulo", n[n.And = 10] = "And", n[n.Or = 11] = "Or", n[n.BitwiseOr = 12] = "BitwiseOr", n[n.BitwiseAnd = 13] = "BitwiseAnd", n[n.Lower = 14] = "Lower", n[n.LowerEquals = 15] = "LowerEquals", n[n.Bigger = 16] = "Bigger", n[n.BiggerEquals = 17] = "BiggerEquals", n[n.NullishCoalesce = 18] = "NullishCoalesce", n[n.Exponentiation = 19] = "Exponentiation", n[n.In = 20] = "In", n[n.InstanceOf = 21] = "InstanceOf", n[n.AdditionAssignment = 22] = "AdditionAssignment", n[n.SubtractionAssignment = 23] = "SubtractionAssignment", n[n.MultiplicationAssignment = 24] = "MultiplicationAssignment", n[n.DivisionAssignment = 25] = "DivisionAssignment", n[n.RemainderAssignment = 26] = "RemainderAssignment", n[n.ExponentiationAssignment = 27] = "ExponentiationAssignment", n[n.AndAssignment = 28] = "AndAssignment", n[n.OrAssignment = 29] = "OrAssignment", n[n.NullishCoalesceAssignment = 30] = "NullishCoalesceAssignment", n; })(x || {});
function bp(n, e) { return n == null || e == null ? n == e : n.isEquivalent(e); }
function Tp(n, e, t) { let s = n.length; if (s !== e.length)
    return !1; for (let r = 0; r < s; r++)
    if (!t(n[r], e[r]))
        return !1; return !0; }
function qe(n, e) { return Tp(n, e, (t, s) => t.isEquivalent(s)); }
var Y = class {
    type;
    sourceSpan;
    constructor(e, t) { this.type = e || null, this.sourceSpan = t || null; }
    prop(e, t) { return new Xe(this, e, null, t); }
    key(e, t, s) { return new Vt(this, e, t, s); }
    callFn(e, t, s) { return new Ue(this, e, null, t, s); }
    instantiate(e, t, s) { return new qs(this, e, t, s); }
    conditional(e, t = null, s) { return new bt(this, e, t, null, s); }
    equals(e, t) { return new j(x.Equals, this, e, null, t); }
    notEquals(e, t) { return new j(x.NotEquals, this, e, null, t); }
    identical(e, t) { return new j(x.Identical, this, e, null, t); }
    notIdentical(e, t) { return new j(x.NotIdentical, this, e, null, t); }
    minus(e, t) { return new j(x.Minus, this, e, null, t); }
    plus(e, t) { return new j(x.Plus, this, e, null, t); }
    divide(e, t) { return new j(x.Divide, this, e, null, t); }
    multiply(e, t) { return new j(x.Multiply, this, e, null, t); }
    modulo(e, t) { return new j(x.Modulo, this, e, null, t); }
    power(e, t) { return new j(x.Exponentiation, this, e, null, t); }
    and(e, t) { return new j(x.And, this, e, null, t); }
    bitwiseOr(e, t) { return new j(x.BitwiseOr, this, e, null, t); }
    bitwiseAnd(e, t) { return new j(x.BitwiseAnd, this, e, null, t); }
    or(e, t) { return new j(x.Or, this, e, null, t); }
    lower(e, t) { return new j(x.Lower, this, e, null, t); }
    lowerEquals(e, t) { return new j(x.LowerEquals, this, e, null, t); }
    bigger(e, t) { return new j(x.Bigger, this, e, null, t); }
    biggerEquals(e, t) { return new j(x.BiggerEquals, this, e, null, t); }
    isBlank(e) { return this.equals(Ip, e); }
    nullishCoalesce(e, t) { return new j(x.NullishCoalesce, this, e, null, t); }
    toStmt() { return new Te(this, null); }
}, vt = class n extends Y {
    name;
    constructor(e, t, s) { super(t, s), this.name = e; }
    isEquivalent(e) { return e instanceof n && this.name === e.name; }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitReadVarExpr(this, t); }
    clone() { return new n(this.name, this.type, this.sourceSpan); }
    set(e) { return new j(x.Assign, this, e, null, this.sourceSpan); }
}, os = class n extends Y {
    expr;
    constructor(e, t, s) { super(t, s), this.expr = e; }
    visitExpression(e, t) { return e.visitTypeofExpr(this, t); }
    isEquivalent(e) { return e instanceof n && e.expr.isEquivalent(this.expr); }
    isConstant() { return this.expr.isConstant(); }
    clone() { return new n(this.expr.clone()); }
}, Fr = class n extends Y {
    expr;
    constructor(e, t, s) { super(t, s), this.expr = e; }
    visitExpression(e, t) { return e.visitVoidExpr(this, t); }
    isEquivalent(e) { return e instanceof n && e.expr.isEquivalent(this.expr); }
    isConstant() { return this.expr.isConstant(); }
    clone() { return new n(this.expr.clone()); }
}, W = class n extends Y {
    node;
    constructor(e, t, s) { super(t, s), this.node = e; }
    isEquivalent(e) { return e instanceof n && this.node === e.node; }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitWrappedNodeExpr(this, t); }
    clone() { return new n(this.node, this.type, this.sourceSpan); }
}, Ue = class n extends Y {
    fn;
    args;
    pure;
    constructor(e, t, s, r, i = !1) { super(s, r), this.fn = e, this.args = t, this.pure = i; }
    get receiver() { return this.fn; }
    isEquivalent(e) { return e instanceof n && this.fn.isEquivalent(e.fn) && qe(this.args, e.args) && this.pure === e.pure; }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitInvokeFunctionExpr(this, t); }
    clone() { return new n(this.fn.clone(), this.args.map(e => e.clone()), this.type, this.sourceSpan, this.pure); }
}, Vs = class n extends Y {
    tag;
    template;
    constructor(e, t, s, r) { super(s, r), this.tag = e, this.template = t; }
    isEquivalent(e) { return e instanceof n && this.tag.isEquivalent(e.tag) && this.template.isEquivalent(e.template); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitTaggedTemplateLiteralExpr(this, t); }
    clone() { return new n(this.tag.clone(), this.template.clone(), this.type, this.sourceSpan); }
}, qs = class n extends Y {
    classExpr;
    args;
    constructor(e, t, s, r) { super(s, r), this.classExpr = e, this.args = t; }
    isEquivalent(e) { return e instanceof n && this.classExpr.isEquivalent(e.classExpr) && qe(this.args, e.args); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitInstantiateExpr(this, t); }
    clone() { return new n(this.classExpr.clone(), this.args.map(e => e.clone()), this.type, this.sourceSpan); }
}, as = class n extends Y {
    body;
    flags;
    constructor(e, t, s) { super(null, s), this.body = e, this.flags = t; }
    isEquivalent(e) { return e instanceof n && this.body === e.body && this.flags === e.flags; }
    isConstant() { return !0; }
    visitExpression(e, t) { return e.visitRegularExpressionLiteral(this, t); }
    clone() { return new n(this.body, this.flags, this.sourceSpan); }
}, xe = class n extends Y {
    value;
    constructor(e, t, s) { super(t, s), this.value = e; }
    isEquivalent(e) { return e instanceof n && this.value === e.value; }
    isConstant() { return !0; }
    visitExpression(e, t) { return e.visitLiteralExpr(this, t); }
    clone() { return new n(this.value, this.type, this.sourceSpan); }
}, Us = class n extends Y {
    elements;
    expressions;
    constructor(e, t, s) { super(null, s), this.elements = e, this.expressions = t; }
    isEquivalent(e) { return e instanceof n && Tp(this.elements, e.elements, (t, s) => t.text === s.text) && qe(this.expressions, e.expressions); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitTemplateLiteralExpr(this, t); }
    clone() { return new n(this.elements.map(e => e.clone()), this.expressions.map(e => e.clone())); }
}, $r = class n extends Y {
    text;
    rawText;
    constructor(e, t, s) { super(ma, t), this.text = e, this.rawText = s ?? Ka(eo(e)); }
    visitExpression(e, t) { return e.visitTemplateLiteralElementExpr(this, t); }
    isEquivalent(e) { return e instanceof n && e.text === this.text && e.rawText === this.rawText; }
    isConstant() { return !0; }
    clone() { return new n(this.text, this.sourceSpan, this.rawText); }
}, wn = class {
    text;
    sourceSpan;
    constructor(e, t) { this.text = e, this.sourceSpan = t; }
}, Jn = class {
    text;
    sourceSpan;
    associatedMessage;
    constructor(e, t, s) { this.text = e, this.sourceSpan = t, this.associatedMessage = s; }
}, Wd = "|", xu = "@@", jd = "\u241F", Or = class n extends Y {
    metaBlock;
    messageParts;
    placeHolderNames;
    expressions;
    constructor(e, t, s, r, i) { super(ma, i), this.metaBlock = e, this.messageParts = t, this.placeHolderNames = s, this.expressions = r; }
    isEquivalent(e) { return !1; }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitLocalizedString(this, t); }
    clone() { return new n(this.metaBlock, this.messageParts, this.placeHolderNames, this.expressions.map(e => e.clone()), this.sourceSpan); }
    serializeI18nHead() { let e = this.metaBlock.description || ""; return this.metaBlock.meaning && (e = `${this.metaBlock.meaning}${Wd}${e}`), this.metaBlock.customId && (e = `${e}${xu}${this.metaBlock.customId}`), this.metaBlock.legacyIds && this.metaBlock.legacyIds.forEach(t => { e = `${e}${jd}${t}`; }), yu(e, this.messageParts[0].text, this.getMessagePartSourceSpan(0)); }
    getMessagePartSourceSpan(e) { return this.messageParts[e]?.sourceSpan ?? this.sourceSpan; }
    getPlaceholderSourceSpan(e) { return this.placeHolderNames[e]?.sourceSpan ?? this.expressions[e]?.sourceSpan ?? this.sourceSpan; }
    serializeI18nTemplatePart(e) { let t = this.placeHolderNames[e - 1], s = this.messageParts[e], r = t.text; return t.associatedMessage?.legacyIds.length === 0 && (r += `${xu}${kp(t.associatedMessage.messageString, t.associatedMessage.meaning)}`), yu(r, s.text, this.getMessagePartSourceSpan(e)); }
}, eo = n => n.replace(/\\/g, "\\\\"), zd = n => n.replace(/^:/, "\\:"), Gd = n => n.replace(/:/g, "\\:"), Ka = n => n.replace(/`/g, "\\`").replace(/\${/g, "$\\{");
function yu(n, e, t) { return n === "" ? { cooked: e, raw: Ka(zd(eo(e))), range: t } : { cooked: `:${n}:${e}`, raw: Ka(`:${Gd(eo(n))}:${eo(e)}`), range: t }; }
var sn = class n extends Y {
    value;
    typeParams;
    constructor(e, t, s = null, r) { super(t, r), this.value = e, this.typeParams = s; }
    isEquivalent(e) { return e instanceof n && this.value.name === e.value.name && this.value.moduleName === e.value.moduleName; }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitExternalExpr(this, t); }
    clone() { return new n(this.value, this.type, this.typeParams, this.sourceSpan); }
}, el = class {
    moduleName;
    name;
    constructor(e, t) { this.moduleName = e, this.name = t; }
}, bt = class n extends Y {
    condition;
    falseCase;
    trueCase;
    constructor(e, t, s = null, r, i) { super(r || t.type, i), this.condition = e, this.falseCase = s, this.trueCase = t; }
    isEquivalent(e) { return e instanceof n && this.condition.isEquivalent(e.condition) && this.trueCase.isEquivalent(e.trueCase) && bp(this.falseCase, e.falseCase); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitConditionalExpr(this, t); }
    clone() { return new n(this.condition.clone(), this.trueCase.clone(), this.falseCase?.clone(), this.type, this.sourceSpan); }
}, ls = class n extends Y {
    url;
    urlComment;
    constructor(e, t, s) { super(null, t), this.url = e, this.urlComment = s; }
    isEquivalent(e) { return e instanceof n && this.url === e.url && this.urlComment === e.urlComment; }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitDynamicImportExpr(this, t); }
    clone() { return new n(typeof this.url == "string" ? this.url : this.url.clone(), this.sourceSpan, this.urlComment); }
}, Hs = class n extends Y {
    condition;
    constructor(e, t) { super(_p, t), this.condition = e; }
    isEquivalent(e) { return e instanceof n && this.condition.isEquivalent(e.condition); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitNotExpr(this, t); }
    clone() { return new n(this.condition.clone(), this.sourceSpan); }
}, Z = class n {
    name;
    type;
    constructor(e, t = null) { this.name = e, this.type = t; }
    isEquivalent(e) { return this.name === e.name; }
    clone() { return new n(this.name, this.type); }
}, en = class n extends Y {
    params;
    statements;
    name;
    constructor(e, t, s, r, i) { super(s, r), this.params = e, this.statements = t, this.name = i; }
    isEquivalent(e) { return (e instanceof n || e instanceof _n) && qe(this.params, e.params) && qe(this.statements, e.statements); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitFunctionExpr(this, t); }
    toDeclStmt(e, t) { return new _n(e, this.params, this.statements, this.type, t, this.sourceSpan); }
    clone() { return new n(this.params.map(e => e.clone()), this.statements, this.type, this.sourceSpan, this.name); }
}, Fn = class tl extends Y {
    params;
    body;
    constructor(e, t, s, r) { super(s, r), this.params = e, this.body = t; }
    isEquivalent(e) { return !(e instanceof tl) || !qe(this.params, e.params) ? !1 : this.body instanceof Y && e.body instanceof Y ? this.body.isEquivalent(e.body) : Array.isArray(this.body) && Array.isArray(e.body) ? qe(this.body, e.body) : !1; }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitArrowFunctionExpr(this, t); }
    clone() { return new tl(this.params.map(e => e.clone()), Array.isArray(this.body) ? this.body : this.body.clone(), this.type, this.sourceSpan); }
    toDeclStmt(e, t) { return new he(e, this, gt, t, this.sourceSpan); }
}, rn = class n extends Y {
    operator;
    expr;
    parens;
    constructor(e, t, s, r, i = !0) { super(s || yn, r), this.operator = e, this.expr = t, this.parens = i; }
    isEquivalent(e) { return e instanceof n && this.operator === e.operator && this.expr.isEquivalent(e.expr); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitUnaryOperatorExpr(this, t); }
    clone() { return new n(this.operator, this.expr.clone(), this.type, this.sourceSpan, this.parens); }
}, wt = class n extends Y {
    expr;
    constructor(e, t, s) { super(t, s), this.expr = e; }
    visitExpression(e, t) { return e.visitParenthesizedExpr(this, t); }
    isEquivalent(e) { return e instanceof n && e.expr.isEquivalent(this.expr); }
    isConstant() { return this.expr.isConstant(); }
    clone() { return new n(this.expr.clone()); }
}, j = class n extends Y {
    operator;
    rhs;
    lhs;
    constructor(e, t, s, r, i) { super(r || t.type, i), this.operator = e, this.rhs = s, this.lhs = t; }
    isEquivalent(e) { return e instanceof n && this.operator === e.operator && this.lhs.isEquivalent(e.lhs) && this.rhs.isEquivalent(e.rhs); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitBinaryOperatorExpr(this, t); }
    clone() { return new n(this.operator, this.lhs.clone(), this.rhs.clone(), this.type, this.sourceSpan); }
    isAssignment() { let e = this.operator; return e === x.Assign || e === x.AdditionAssignment || e === x.SubtractionAssignment || e === x.MultiplicationAssignment || e === x.DivisionAssignment || e === x.RemainderAssignment || e === x.ExponentiationAssignment || e === x.AndAssignment || e === x.OrAssignment || e === x.NullishCoalesceAssignment; }
}, Xe = class n extends Y {
    receiver;
    name;
    constructor(e, t, s, r) { super(s, r), this.receiver = e, this.name = t; }
    get index() { return this.name; }
    isEquivalent(e) { return e instanceof n && this.receiver.isEquivalent(e.receiver) && this.name === e.name; }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitReadPropExpr(this, t); }
    set(e) { return new j(x.Assign, this.receiver.prop(this.name), e, null, this.sourceSpan); }
    clone() { return new n(this.receiver.clone(), this.name, this.type, this.sourceSpan); }
}, Vt = class n extends Y {
    receiver;
    index;
    constructor(e, t, s, r) { super(s, r), this.receiver = e, this.index = t; }
    isEquivalent(e) { return e instanceof n && this.receiver.isEquivalent(e.receiver) && this.index.isEquivalent(e.index); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitReadKeyExpr(this, t); }
    set(e) { return new j(x.Assign, this.receiver.key(this.index), e, null, this.sourceSpan); }
    clone() { return new n(this.receiver.clone(), this.index.clone(), this.type, this.sourceSpan); }
}, Tt = class n extends Y {
    entries;
    constructor(e, t, s) { super(t, s), this.entries = e; }
    isConstant() { return this.entries.every(e => e.isConstant()); }
    isEquivalent(e) { return e instanceof n && qe(this.entries, e.entries); }
    visitExpression(e, t) { return e.visitLiteralArrayExpr(this, t); }
    clone() { return new n(this.entries.map(e => e.clone()), this.type, this.sourceSpan); }
}, cs = class n {
    key;
    value;
    quoted;
    constructor(e, t, s) { this.key = e, this.value = t, this.quoted = s; }
    isEquivalent(e) { return this.key === e.key && this.value.isEquivalent(e.value); }
    clone() { return new n(this.key, this.value.clone(), this.quoted); }
    isConstant() { return this.value.isConstant(); }
}, qt = class n {
    expression;
    constructor(e) { this.expression = e; }
    isEquivalent(e) { return e instanceof n && this.expression.isEquivalent(e.expression); }
    clone() { return new n(this.expression.clone()); }
    isConstant() { return this.expression.isConstant(); }
}, Et = class n extends Y {
    entries;
    valueType = null;
    constructor(e, t, s) { super(t, s), this.entries = e, t && (this.valueType = t.valueType); }
    isEquivalent(e) { return e instanceof n && qe(this.entries, e.entries); }
    isConstant() { return this.entries.every(e => e.isConstant()); }
    visitExpression(e, t) { return e.visitLiteralMapExpr(this, t); }
    clone() { let e = this.entries.map(t => t.clone()); return new n(e, this.type, this.sourceSpan); }
}, nl = class n extends Y {
    parts;
    constructor(e, t) { super(e[e.length - 1].type, t), this.parts = e; }
    isEquivalent(e) { return e instanceof n && qe(this.parts, e.parts); }
    isConstant() { return !1; }
    visitExpression(e, t) { return e.visitCommaExpr(this, t); }
    clone() { return new n(this.parts.map(e => e.clone())); }
}, Cn = class n extends Y {
    expression;
    constructor(e, t) { super(null, t), this.expression = e; }
    isEquivalent(e) { return e instanceof n && this.expression.isEquivalent(e.expression); }
    isConstant() { return this.expression.isConstant(); }
    visitExpression(e, t) { return e.visitSpreadElementExpr(this, t); }
    clone() { return new n(this.expression.clone(), this.sourceSpan); }
}, An = new xe(null, null, null), Ip = new xe(null, gt, null), ue = (function (n) { return n[n.None = 0] = "None", n[n.Final = 1] = "Final", n[n.Private = 2] = "Private", n[n.Exported = 4] = "Exported", n[n.Static = 8] = "Static", n; })(ue || {}), Vr = class {
    text;
    multiline;
    trailingNewline;
    constructor(e, t, s) { this.text = e, this.multiline = t, this.trailingNewline = s; }
    toString() { return this.multiline ? ` ${this.text} ` : this.text; }
}, qr = class extends Vr {
    tags;
    constructor(e) { super("", !0, !0), this.tags = e; }
    toString() { return em(this.tags); }
}, kn = class {
    modifiers;
    sourceSpan;
    leadingComments;
    constructor(e = ue.None, t = null, s) { this.modifiers = e, this.sourceSpan = t, this.leadingComments = s; }
    hasModifier(e) { return (this.modifiers & e) !== 0; }
    addLeadingComment(e) { this.leadingComments = this.leadingComments ?? [], this.leadingComments.push(e); }
}, he = class n extends kn {
    name;
    value;
    type;
    constructor(e, t, s, r, i, o) { super(r, i, o), this.name = e, this.value = t, this.type = s || t && t.type || null; }
    isEquivalent(e) { return e instanceof n && this.name === e.name && (this.value ? !!e.value && this.value.isEquivalent(e.value) : !e.value); }
    visitStatement(e, t) { return e.visitDeclareVarStmt(this, t); }
}, _n = class n extends kn {
    name;
    params;
    statements;
    type;
    constructor(e, t, s, r, i, o, a) { super(i, o, a), this.name = e, this.params = t, this.statements = s, this.type = r || null; }
    isEquivalent(e) { return e instanceof n && qe(this.params, e.params) && qe(this.statements, e.statements); }
    visitStatement(e, t) { return e.visitDeclareFunctionStmt(this, t); }
}, Te = class n extends kn {
    expr;
    constructor(e, t, s) { super(ue.None, t, s), this.expr = e; }
    isEquivalent(e) { return e instanceof n && this.expr.isEquivalent(e.expr); }
    visitStatement(e, t) { return e.visitExpressionStmt(this, t); }
}, me = class n extends kn {
    value;
    constructor(e, t = null, s) { super(ue.None, t, s), this.value = e; }
    isEquivalent(e) { return e instanceof n && this.value.isEquivalent(e.value); }
    visitStatement(e, t) { return e.visitReturnStmt(this, t); }
}, Ur = class n extends kn {
    condition;
    trueCase;
    falseCase;
    constructor(e, t, s = [], r, i) { super(ue.None, r, i), this.condition = e, this.trueCase = t, this.falseCase = s; }
    isEquivalent(e) { return e instanceof n && this.condition.isEquivalent(e.condition) && qe(this.trueCase, e.trueCase) && qe(this.falseCase, e.falseCase); }
    visitStatement(e, t) { return e.visitIfStmt(this, t); }
}, Xd = class {
    visitType(e, t) { return e; }
    visitExpression(e, t) { return e.type && e.type.visitType(this, t), e; }
    visitBuiltinType(e, t) { return this.visitType(e, t); }
    visitExpressionType(e, t) { return e.value.visitExpression(this, t), e.typeParams !== null && e.typeParams.forEach(s => this.visitType(s, t)), this.visitType(e, t); }
    visitArrayType(e, t) { return this.visitType(e, t); }
    visitMapType(e, t) { return this.visitType(e, t); }
    visitTransplantedType(e, t) { return e; }
    visitWrappedNodeExpr(e, t) { return e; }
    visitReadVarExpr(e, t) { return this.visitExpression(e, t); }
    visitDynamicImportExpr(e, t) { return this.visitExpression(e, t); }
    visitInvokeFunctionExpr(e, t) { return e.fn.visitExpression(this, t), this.visitAllExpressions(e.args, t), this.visitExpression(e, t); }
    visitTaggedTemplateLiteralExpr(e, t) { return e.tag.visitExpression(this, t), e.template.visitExpression(this, t), this.visitExpression(e, t); }
    visitInstantiateExpr(e, t) { return e.classExpr.visitExpression(this, t), this.visitAllExpressions(e.args, t), this.visitExpression(e, t); }
    visitLiteralExpr(e, t) { return this.visitExpression(e, t); }
    visitRegularExpressionLiteral(e, t) { return this.visitExpression(e, t); }
    visitLocalizedString(e, t) { return this.visitExpression(e, t); }
    visitExternalExpr(e, t) { return e.typeParams && e.typeParams.forEach(s => s.visitType(this, t)), this.visitExpression(e, t); }
    visitConditionalExpr(e, t) { return e.condition.visitExpression(this, t), e.trueCase.visitExpression(this, t), e.falseCase.visitExpression(this, t), this.visitExpression(e, t); }
    visitNotExpr(e, t) { return e.condition.visitExpression(this, t), this.visitExpression(e, t); }
    visitFunctionExpr(e, t) { return this.visitAllStatements(e.statements, t), this.visitExpression(e, t); }
    visitArrowFunctionExpr(e, t) { return Array.isArray(e.body) ? this.visitAllStatements(e.body, t) : e.body.visitExpression(this, t), this.visitExpression(e, t); }
    visitUnaryOperatorExpr(e, t) { return e.expr.visitExpression(this, t), this.visitExpression(e, t); }
    visitTypeofExpr(e, t) { return e.expr.visitExpression(this, t), this.visitExpression(e, t); }
    visitVoidExpr(e, t) { return e.expr.visitExpression(this, t), this.visitExpression(e, t); }
    visitBinaryOperatorExpr(e, t) { return e.lhs.visitExpression(this, t), e.rhs.visitExpression(this, t), this.visitExpression(e, t); }
    visitReadPropExpr(e, t) { return e.receiver.visitExpression(this, t), this.visitExpression(e, t); }
    visitReadKeyExpr(e, t) { return e.receiver.visitExpression(this, t), e.index.visitExpression(this, t), this.visitExpression(e, t); }
    visitLiteralArrayExpr(e, t) { return this.visitAllExpressions(e.entries, t), this.visitExpression(e, t); }
    visitLiteralMapExpr(e, t) { return e.entries.forEach(s => { s instanceof qt ? s.expression.visitExpression(this, t) : s.value.visitExpression(this, t); }), this.visitExpression(e, t); }
    visitCommaExpr(e, t) { return this.visitAllExpressions(e.parts, t), this.visitExpression(e, t); }
    visitTemplateLiteralExpr(e, t) { return this.visitAllExpressions(e.elements, t), this.visitAllExpressions(e.expressions, t), this.visitExpression(e, t); }
    visitTemplateLiteralElementExpr(e, t) { return this.visitExpression(e, t); }
    visitParenthesizedExpr(e, t) { return e.expr.visitExpression(this, t), this.visitExpression(e, t); }
    visitSpreadElementExpr(e, t) { return e.expression.visitExpression(this, t), this.visitExpression(e, t); }
    visitAllExpressions(e, t) { e.forEach(s => s.visitExpression(this, t)); }
    visitDeclareVarStmt(e, t) { return e.value && e.value.visitExpression(this, t), e.type && e.type.visitType(this, t), e; }
    visitDeclareFunctionStmt(e, t) { return this.visitAllStatements(e.statements, t), e.type && e.type.visitType(this, t), e; }
    visitExpressionStmt(e, t) { return e.expr.visitExpression(this, t), e; }
    visitReturnStmt(e, t) { return e.value.visitExpression(this, t), e; }
    visitIfStmt(e, t) { return e.condition.visitExpression(this, t), this.visitAllStatements(e.trueCase, t), this.visitAllStatements(e.falseCase, t), e; }
    visitAllStatements(e, t) { e.forEach(s => s.visitStatement(this, t)); }
};
function Yd(n, e = !1, t = !0) { return new Vr(n, e, t); }
function Np(n = []) { return new qr(n); }
function D(n, e, t) { return new vt(n, e, t); }
function y(n, e = null, t) { return new sn(n, null, e, t); }
function Qd(n, e, t) { return n != null ? Se(y(n, e, null), t) : null; }
function Se(n, e, t) { return new nt(n, e, t); }
function Zd(n, e) { return new co(n, e); }
function ir(n) { return new os(n); }
function q(n, e, t) { return new Tt(n, e, t); }
function ye(n, e = null) { return new Et(n.map(t => new cs(t.key, t.value, t.quoted)), e, null); }
function Jd(n, e, t, s) { return new rn(n, e, t, s); }
function Dp(n, e) { return new Hs(n, e); }
function on(n, e, t, s, r) { return new en(n, e, t, s, r); }
function ie(n, e, t, s) { return new Fn(n, e, t, s); }
function Fi(n, e, t, s, r) { return new Ur(n, e, t, s, r); }
function Pp(n, e, t, s) { return new Vs(n, e, t, s); }
function d(n, e, t) { return new xe(n, e, t); }
function Lp(n, e, t, s, r) { return new Or(n, e, t, s, r); }
function Kd(n) { return n instanceof xe && n.value === null; }
function Cu(n) { let e = ""; if (n.tagName && (e += ` @${n.tagName}`), n.text) {
    if (n.text.match(/\/\*|\*\//))
        throw new Error('JSDoc text cannot contain "/*" and "*/"');
    e += " " + n.text.replace(/@/g, "\\@");
} return e; }
function em(n) {
    if (n.length === 0)
        return "";
    if (n.length === 1 && n[0].tagName && !n[0].text)
        return `*${Cu(n[0])} `;
    let e = `*
`;
    for (let t of n)
        e += " *", e += Cu(t).replace(/\n/g, `
 * `), e += `
`;
    return e += " ", e;
}
var ok = Object.freeze({ __proto__: null, ArrayType: Za, ArrowFunctionExpr: Fn, BOOL_TYPE: _p, get BinaryOperator() { return x; }, BinaryOperatorExpr: j, BuiltinType: kt, get BuiltinTypeName() { return Yt; }, CommaExpr: nl, ConditionalExpr: bt, DYNAMIC_TYPE: re, DeclareFunctionStmt: _n, DeclareVarStmt: he, DynamicImportExpr: ls, Expression: Y, ExpressionStatement: Te, ExpressionType: nt, ExternalExpr: sn, ExternalReference: el, FUNCTION_TYPE: Hd, FnParam: Z, FunctionExpr: en, INFERRED_TYPE: gt, INT_TYPE: Ud, IfStmt: Ur, InstantiateExpr: qs, InvokeFunctionExpr: Ue, JSDocComment: qr, LeadingComment: Vr, LiteralArrayExpr: Tt, LiteralExpr: xe, LiteralMapExpr: Et, LiteralMapPropertyAssignment: cs, LiteralMapSpreadAssignment: qt, LiteralPiece: wn, LocalizedString: Or, MapType: Ja, NONE_TYPE: _t, NULL_EXPR: An, NUMBER_TYPE: yn, NotExpr: Hs, ParenthesizedExpr: wt, PlaceholderPiece: Jn, ReadKeyExpr: Vt, ReadPropExpr: Xe, ReadVarExpr: vt, RecursiveAstVisitor: Xd, RegularExpressionLiteralExpr: as, ReturnStatement: me, STRING_TYPE: ma, SpreadElementExpr: Cn, Statement: kn, get StmtModifier() { return ue; }, TYPED_NULL_EXPR: Ip, TaggedTemplateLiteralExpr: Vs, TemplateLiteralElementExpr: $r, TemplateLiteralExpr: Us, TransplantedType: co, Type: xn, get TypeModifier() { return zc; }, TypeofExpr: os, get UnaryOperator() { return Os; }, UnaryOperatorExpr: rn, VoidExpr: Fr, WrappedNodeExpr: W, areAllEquivalent: qe, arrowFn: ie, expressionType: Se, fn: on, ifStmt: Fi, importExpr: y, importType: Qd, isNull: Kd, jsDocComment: Np, leadingComment: Yd, literal: d, literalArr: q, literalMap: ye, localizedString: Lp, not: Dp, nullSafeIsEquivalent: bp, taggedTemplate: Pp, transplantedType: Zd, typeofExpr: ir, unary: Jd, variable: D }), tm = "_c", nm = {}, sm = 50, uo = class n extends Y {
    resolved;
    original;
    shared = !1;
    constructor(e) { super(e.type), this.resolved = e, this.original = e; }
    visitExpression(e, t) { return t === nm ? this.original.visitExpression(e, t) : this.resolved.visitExpression(e, t); }
    isEquivalent(e) { return e instanceof n && this.resolved.isEquivalent(e.resolved); }
    isConstant() { return !0; }
    clone() { throw new Error("Not supported."); }
    fixup(e) { this.resolved = e, this.shared = !0; }
}, ho = class {
    isClosureCompilerEnabled;
    statements = [];
    literals = new Map;
    literalFactories = new Map;
    sharedConstants = new Map;
    _claimedNames = new Map;
    nextNameIndex = 0;
    constructor(e = !1) { this.isClosureCompilerEnabled = e; }
    getConstLiteral(e, t) { if (e instanceof xe && !Au(e) || e instanceof uo)
        return e; let s = Hr.INSTANCE.keyOf(e), r = this.literals.get(s), i = !1; if (r || (r = new uo(e), this.literals.set(s, r), i = !0), !i && !r.shared || i && t) {
        let o = this.freshName(), a, l;
        this.isClosureCompilerEnabled && Au(e) ? (a = new en([], [new me(e)]), l = D(o).callFn([])) : (a = e, l = D(o)), this.statements.push(new he(o, a, gt, ue.Final)), r.fixup(l);
    } return r; }
    getSharedConstant(e, t) { let s = e.keyOf(t); if (!this.sharedConstants.has(s)) {
        let r = this.freshName();
        this.sharedConstants.set(s, D(r)), this.statements.push(e.toSharedConstantDeclaration(r, t));
    } return this.sharedConstants.get(s); }
    getSharedFunctionReference(e, t, s = !0) { let r = e instanceof Fn; for (let o of this.statements)
        if (r && o instanceof he && o.value?.isEquivalent(e) || !r && o instanceof _n && e instanceof en && e.isEquivalent(o))
            return D(o.name); let i = s ? this.uniqueName(t) : t; return this.statements.push(e instanceof en ? e.toDeclStmt(i, ue.Final) : new he(i, e, gt, ue.Final, e.sourceSpan)), D(i); }
    uniqueName(e, t = !0) { let s = this._claimedNames.get(e) ?? 0, r = s === 0 && !t ? `${e}` : `${e}${s}`; return this._claimedNames.set(e, s + 1), r; }
    freshName() { return this.uniqueName(tm); }
}, Hr = class n {
    static INSTANCE = new n;
    keyOf(e) { if (e instanceof xe && typeof e.value == "string")
        return `"${e.value}"`; if (e instanceof xe)
        return String(e.value); if (e instanceof as)
        return `/${e.body}/${e.flags ?? ""}`; if (e instanceof Tt) {
        let t = [];
        for (let s of e.entries)
            t.push(this.keyOf(s));
        return `[${t.join(",")}]`;
    }
    else if (e instanceof Et) {
        let t = [];
        for (let s of e.entries)
            if (s instanceof qt)
                t.push("..." + this.keyOf(s.expression));
            else {
                let r = s.key;
                s.quoted && (r = `"${r}"`), t.push(r + ":" + this.keyOf(s.value));
            }
        return `{${t.join(",")}}`;
    }
    else {
        if (e instanceof sn)
            return `import("${e.value.moduleName}", ${e.value.name})`;
        if (e instanceof vt)
            return `read(${e.name})`;
        if (e instanceof os)
            return `typeof(${this.keyOf(e.expr)})`;
        if (e instanceof Cn)
            return `...${this.keyOf(e.expression)}`;
        throw new Error(`${this.constructor.name} does not handle expressions of type ${e.constructor.name}`);
    } }
};
function Au(n) { return n instanceof xe && typeof n.value == "string" && n.value.length >= sm; }
var g = "@angular/core", f = (() => { class n {
    static core = { name: null, moduleName: g };
    static namespaceHTML = { name: "\u0275\u0275namespaceHTML", moduleName: g };
    static namespaceMathML = { name: "\u0275\u0275namespaceMathML", moduleName: g };
    static namespaceSVG = { name: "\u0275\u0275namespaceSVG", moduleName: g };
    static element = { name: "\u0275\u0275element", moduleName: g };
    static elementStart = { name: "\u0275\u0275elementStart", moduleName: g };
    static elementEnd = { name: "\u0275\u0275elementEnd", moduleName: g };
    static domElement = { name: "\u0275\u0275domElement", moduleName: g };
    static domElementStart = { name: "\u0275\u0275domElementStart", moduleName: g };
    static domElementEnd = { name: "\u0275\u0275domElementEnd", moduleName: g };
    static domElementContainer = { name: "\u0275\u0275domElementContainer", moduleName: g };
    static domElementContainerStart = { name: "\u0275\u0275domElementContainerStart", moduleName: g };
    static domElementContainerEnd = { name: "\u0275\u0275domElementContainerEnd", moduleName: g };
    static domTemplate = { name: "\u0275\u0275domTemplate", moduleName: g };
    static domListener = { name: "\u0275\u0275domListener", moduleName: g };
    static advance = { name: "\u0275\u0275advance", moduleName: g };
    static syntheticHostProperty = { name: "\u0275\u0275syntheticHostProperty", moduleName: g };
    static syntheticHostListener = { name: "\u0275\u0275syntheticHostListener", moduleName: g };
    static attribute = { name: "\u0275\u0275attribute", moduleName: g };
    static classProp = { name: "\u0275\u0275classProp", moduleName: g };
    static elementContainerStart = { name: "\u0275\u0275elementContainerStart", moduleName: g };
    static elementContainerEnd = { name: "\u0275\u0275elementContainerEnd", moduleName: g };
    static elementContainer = { name: "\u0275\u0275elementContainer", moduleName: g };
    static styleMap = { name: "\u0275\u0275styleMap", moduleName: g };
    static classMap = { name: "\u0275\u0275classMap", moduleName: g };
    static styleProp = { name: "\u0275\u0275styleProp", moduleName: g };
    static interpolate = { name: "\u0275\u0275interpolate", moduleName: g };
    static interpolate1 = { name: "\u0275\u0275interpolate1", moduleName: g };
    static interpolate2 = { name: "\u0275\u0275interpolate2", moduleName: g };
    static interpolate3 = { name: "\u0275\u0275interpolate3", moduleName: g };
    static interpolate4 = { name: "\u0275\u0275interpolate4", moduleName: g };
    static interpolate5 = { name: "\u0275\u0275interpolate5", moduleName: g };
    static interpolate6 = { name: "\u0275\u0275interpolate6", moduleName: g };
    static interpolate7 = { name: "\u0275\u0275interpolate7", moduleName: g };
    static interpolate8 = { name: "\u0275\u0275interpolate8", moduleName: g };
    static interpolateV = { name: "\u0275\u0275interpolateV", moduleName: g };
    static nextContext = { name: "\u0275\u0275nextContext", moduleName: g };
    static resetView = { name: "\u0275\u0275resetView", moduleName: g };
    static templateCreate = { name: "\u0275\u0275template", moduleName: g };
    static defer = { name: "\u0275\u0275defer", moduleName: g };
    static deferWhen = { name: "\u0275\u0275deferWhen", moduleName: g };
    static deferOnIdle = { name: "\u0275\u0275deferOnIdle", moduleName: g };
    static deferOnImmediate = { name: "\u0275\u0275deferOnImmediate", moduleName: g };
    static deferOnTimer = { name: "\u0275\u0275deferOnTimer", moduleName: g };
    static deferOnHover = { name: "\u0275\u0275deferOnHover", moduleName: g };
    static deferOnInteraction = { name: "\u0275\u0275deferOnInteraction", moduleName: g };
    static deferOnViewport = { name: "\u0275\u0275deferOnViewport", moduleName: g };
    static deferPrefetchWhen = { name: "\u0275\u0275deferPrefetchWhen", moduleName: g };
    static deferPrefetchOnIdle = { name: "\u0275\u0275deferPrefetchOnIdle", moduleName: g };
    static deferPrefetchOnImmediate = { name: "\u0275\u0275deferPrefetchOnImmediate", moduleName: g };
    static deferPrefetchOnTimer = { name: "\u0275\u0275deferPrefetchOnTimer", moduleName: g };
    static deferPrefetchOnHover = { name: "\u0275\u0275deferPrefetchOnHover", moduleName: g };
    static deferPrefetchOnInteraction = { name: "\u0275\u0275deferPrefetchOnInteraction", moduleName: g };
    static deferPrefetchOnViewport = { name: "\u0275\u0275deferPrefetchOnViewport", moduleName: g };
    static deferHydrateWhen = { name: "\u0275\u0275deferHydrateWhen", moduleName: g };
    static deferHydrateNever = { name: "\u0275\u0275deferHydrateNever", moduleName: g };
    static deferHydrateOnIdle = { name: "\u0275\u0275deferHydrateOnIdle", moduleName: g };
    static deferHydrateOnImmediate = { name: "\u0275\u0275deferHydrateOnImmediate", moduleName: g };
    static deferHydrateOnTimer = { name: "\u0275\u0275deferHydrateOnTimer", moduleName: g };
    static deferHydrateOnHover = { name: "\u0275\u0275deferHydrateOnHover", moduleName: g };
    static deferHydrateOnInteraction = { name: "\u0275\u0275deferHydrateOnInteraction", moduleName: g };
    static deferHydrateOnViewport = { name: "\u0275\u0275deferHydrateOnViewport", moduleName: g };
    static deferEnableTimerScheduling = { name: "\u0275\u0275deferEnableTimerScheduling", moduleName: g };
    static conditionalCreate = { name: "\u0275\u0275conditionalCreate", moduleName: g };
    static conditionalBranchCreate = { name: "\u0275\u0275conditionalBranchCreate", moduleName: g };
    static conditional = { name: "\u0275\u0275conditional", moduleName: g };
    static repeater = { name: "\u0275\u0275repeater", moduleName: g };
    static repeaterCreate = { name: "\u0275\u0275repeaterCreate", moduleName: g };
    static repeaterTrackByIndex = { name: "\u0275\u0275repeaterTrackByIndex", moduleName: g };
    static repeaterTrackByIdentity = { name: "\u0275\u0275repeaterTrackByIdentity", moduleName: g };
    static componentInstance = { name: "\u0275\u0275componentInstance", moduleName: g };
    static text = { name: "\u0275\u0275text", moduleName: g };
    static enableBindings = { name: "\u0275\u0275enableBindings", moduleName: g };
    static disableBindings = { name: "\u0275\u0275disableBindings", moduleName: g };
    static getCurrentView = { name: "\u0275\u0275getCurrentView", moduleName: g };
    static textInterpolate = { name: "\u0275\u0275textInterpolate", moduleName: g };
    static textInterpolate1 = { name: "\u0275\u0275textInterpolate1", moduleName: g };
    static textInterpolate2 = { name: "\u0275\u0275textInterpolate2", moduleName: g };
    static textInterpolate3 = { name: "\u0275\u0275textInterpolate3", moduleName: g };
    static textInterpolate4 = { name: "\u0275\u0275textInterpolate4", moduleName: g };
    static textInterpolate5 = { name: "\u0275\u0275textInterpolate5", moduleName: g };
    static textInterpolate6 = { name: "\u0275\u0275textInterpolate6", moduleName: g };
    static textInterpolate7 = { name: "\u0275\u0275textInterpolate7", moduleName: g };
    static textInterpolate8 = { name: "\u0275\u0275textInterpolate8", moduleName: g };
    static textInterpolateV = { name: "\u0275\u0275textInterpolateV", moduleName: g };
    static restoreView = { name: "\u0275\u0275restoreView", moduleName: g };
    static pureFunction0 = { name: "\u0275\u0275pureFunction0", moduleName: g };
    static pureFunction1 = { name: "\u0275\u0275pureFunction1", moduleName: g };
    static pureFunction2 = { name: "\u0275\u0275pureFunction2", moduleName: g };
    static pureFunction3 = { name: "\u0275\u0275pureFunction3", moduleName: g };
    static pureFunction4 = { name: "\u0275\u0275pureFunction4", moduleName: g };
    static pureFunction5 = { name: "\u0275\u0275pureFunction5", moduleName: g };
    static pureFunction6 = { name: "\u0275\u0275pureFunction6", moduleName: g };
    static pureFunction7 = { name: "\u0275\u0275pureFunction7", moduleName: g };
    static pureFunction8 = { name: "\u0275\u0275pureFunction8", moduleName: g };
    static pureFunctionV = { name: "\u0275\u0275pureFunctionV", moduleName: g };
    static pipeBind1 = { name: "\u0275\u0275pipeBind1", moduleName: g };
    static pipeBind2 = { name: "\u0275\u0275pipeBind2", moduleName: g };
    static pipeBind3 = { name: "\u0275\u0275pipeBind3", moduleName: g };
    static pipeBind4 = { name: "\u0275\u0275pipeBind4", moduleName: g };
    static pipeBindV = { name: "\u0275\u0275pipeBindV", moduleName: g };
    static domProperty = { name: "\u0275\u0275domProperty", moduleName: g };
    static ariaProperty = { name: "\u0275\u0275ariaProperty", moduleName: g };
    static property = { name: "\u0275\u0275property", moduleName: g };
    static control = { name: "\u0275\u0275control", moduleName: g };
    static controlCreate = { name: "\u0275\u0275controlCreate", moduleName: g };
    static animationEnterListener = { name: "\u0275\u0275animateEnterListener", moduleName: g };
    static animationLeaveListener = { name: "\u0275\u0275animateLeaveListener", moduleName: g };
    static animationEnter = { name: "\u0275\u0275animateEnter", moduleName: g };
    static animationLeave = { name: "\u0275\u0275animateLeave", moduleName: g };
    static i18n = { name: "\u0275\u0275i18n", moduleName: g };
    static i18nAttributes = { name: "\u0275\u0275i18nAttributes", moduleName: g };
    static i18nExp = { name: "\u0275\u0275i18nExp", moduleName: g };
    static i18nStart = { name: "\u0275\u0275i18nStart", moduleName: g };
    static i18nEnd = { name: "\u0275\u0275i18nEnd", moduleName: g };
    static i18nApply = { name: "\u0275\u0275i18nApply", moduleName: g };
    static i18nPostprocess = { name: "\u0275\u0275i18nPostprocess", moduleName: g };
    static pipe = { name: "\u0275\u0275pipe", moduleName: g };
    static projection = { name: "\u0275\u0275projection", moduleName: g };
    static projectionDef = { name: "\u0275\u0275projectionDef", moduleName: g };
    static reference = { name: "\u0275\u0275reference", moduleName: g };
    static inject = { name: "\u0275\u0275inject", moduleName: g };
    static injectAttribute = { name: "\u0275\u0275injectAttribute", moduleName: g };
    static directiveInject = { name: "\u0275\u0275directiveInject", moduleName: g };
    static invalidFactory = { name: "\u0275\u0275invalidFactory", moduleName: g };
    static invalidFactoryDep = { name: "\u0275\u0275invalidFactoryDep", moduleName: g };
    static templateRefExtractor = { name: "\u0275\u0275templateRefExtractor", moduleName: g };
    static forwardRef = { name: "forwardRef", moduleName: g };
    static resolveForwardRef = { name: "resolveForwardRef", moduleName: g };
    static replaceMetadata = { name: "\u0275\u0275replaceMetadata", moduleName: g };
    static getReplaceMetadataURL = { name: "\u0275\u0275getReplaceMetadataURL", moduleName: g };
    static \u0275\u0275defineInjectable = { name: "\u0275\u0275defineInjectable", moduleName: g };
    static declareInjectable = { name: "\u0275\u0275ngDeclareInjectable", moduleName: g };
    static InjectableDeclaration = { name: "\u0275\u0275InjectableDeclaration", moduleName: g };
    static resolveWindow = { name: "\u0275\u0275resolveWindow", moduleName: g };
    static resolveDocument = { name: "\u0275\u0275resolveDocument", moduleName: g };
    static resolveBody = { name: "\u0275\u0275resolveBody", moduleName: g };
    static getComponentDepsFactory = { name: "\u0275\u0275getComponentDepsFactory", moduleName: g };
    static defineComponent = { name: "\u0275\u0275defineComponent", moduleName: g };
    static declareComponent = { name: "\u0275\u0275ngDeclareComponent", moduleName: g };
    static setComponentScope = { name: "\u0275\u0275setComponentScope", moduleName: g };
    static ChangeDetectionStrategy = { name: "ChangeDetectionStrategy", moduleName: g };
    static ViewEncapsulation = { name: "ViewEncapsulation", moduleName: g };
    static ComponentDeclaration = { name: "\u0275\u0275ComponentDeclaration", moduleName: g };
    static FactoryDeclaration = { name: "\u0275\u0275FactoryDeclaration", moduleName: g };
    static declareFactory = { name: "\u0275\u0275ngDeclareFactory", moduleName: g };
    static FactoryTarget = { name: "\u0275\u0275FactoryTarget", moduleName: g };
    static defineDirective = { name: "\u0275\u0275defineDirective", moduleName: g };
    static declareDirective = { name: "\u0275\u0275ngDeclareDirective", moduleName: g };
    static DirectiveDeclaration = { name: "\u0275\u0275DirectiveDeclaration", moduleName: g };
    static InjectorDef = { name: "\u0275\u0275InjectorDef", moduleName: g };
    static InjectorDeclaration = { name: "\u0275\u0275InjectorDeclaration", moduleName: g };
    static defineInjector = { name: "\u0275\u0275defineInjector", moduleName: g };
    static declareInjector = { name: "\u0275\u0275ngDeclareInjector", moduleName: g };
    static NgModuleDeclaration = { name: "\u0275\u0275NgModuleDeclaration", moduleName: g };
    static ModuleWithProviders = { name: "ModuleWithProviders", moduleName: g };
    static defineNgModule = { name: "\u0275\u0275defineNgModule", moduleName: g };
    static declareNgModule = { name: "\u0275\u0275ngDeclareNgModule", moduleName: g };
    static setNgModuleScope = { name: "\u0275\u0275setNgModuleScope", moduleName: g };
    static registerNgModuleType = { name: "\u0275\u0275registerNgModuleType", moduleName: g };
    static PipeDeclaration = { name: "\u0275\u0275PipeDeclaration", moduleName: g };
    static definePipe = { name: "\u0275\u0275definePipe", moduleName: g };
    static declarePipe = { name: "\u0275\u0275ngDeclarePipe", moduleName: g };
    static declareClassMetadata = { name: "\u0275\u0275ngDeclareClassMetadata", moduleName: g };
    static declareClassMetadataAsync = { name: "\u0275\u0275ngDeclareClassMetadataAsync", moduleName: g };
    static setClassMetadata = { name: "\u0275setClassMetadata", moduleName: g };
    static setClassMetadataAsync = { name: "\u0275setClassMetadataAsync", moduleName: g };
    static setClassDebugInfo = { name: "\u0275setClassDebugInfo", moduleName: g };
    static queryRefresh = { name: "\u0275\u0275queryRefresh", moduleName: g };
    static viewQuery = { name: "\u0275\u0275viewQuery", moduleName: g };
    static loadQuery = { name: "\u0275\u0275loadQuery", moduleName: g };
    static contentQuery = { name: "\u0275\u0275contentQuery", moduleName: g };
    static viewQuerySignal = { name: "\u0275\u0275viewQuerySignal", moduleName: g };
    static contentQuerySignal = { name: "\u0275\u0275contentQuerySignal", moduleName: g };
    static queryAdvance = { name: "\u0275\u0275queryAdvance", moduleName: g };
    static twoWayProperty = { name: "\u0275\u0275twoWayProperty", moduleName: g };
    static twoWayBindingSet = { name: "\u0275\u0275twoWayBindingSet", moduleName: g };
    static twoWayListener = { name: "\u0275\u0275twoWayListener", moduleName: g };
    static declareLet = { name: "\u0275\u0275declareLet", moduleName: g };
    static storeLet = { name: "\u0275\u0275storeLet", moduleName: g };
    static readContextLet = { name: "\u0275\u0275readContextLet", moduleName: g };
    static arrowFunction = { name: "\u0275\u0275arrowFunction", moduleName: g };
    static attachSourceLocations = { name: "\u0275\u0275attachSourceLocations", moduleName: g };
    static NgOnChangesFeature = { name: "\u0275\u0275NgOnChangesFeature", moduleName: g };
    static ControlFeature = { name: "\u0275\u0275ControlFeature", moduleName: g };
    static InheritDefinitionFeature = { name: "\u0275\u0275InheritDefinitionFeature", moduleName: g };
    static ProvidersFeature = { name: "\u0275\u0275ProvidersFeature", moduleName: g };
    static HostDirectivesFeature = { name: "\u0275\u0275HostDirectivesFeature", moduleName: g };
    static ExternalStylesFeature = { name: "\u0275\u0275ExternalStylesFeature", moduleName: g };
    static listener = { name: "\u0275\u0275listener", moduleName: g };
    static getInheritedFactory = { name: "\u0275\u0275getInheritedFactory", moduleName: g };
    static sanitizeHtml = { name: "\u0275\u0275sanitizeHtml", moduleName: g };
    static sanitizeStyle = { name: "\u0275\u0275sanitizeStyle", moduleName: g };
    static validateAttribute = { name: "\u0275\u0275validateAttribute", moduleName: g };
    static sanitizeResourceUrl = { name: "\u0275\u0275sanitizeResourceUrl", moduleName: g };
    static sanitizeScript = { name: "\u0275\u0275sanitizeScript", moduleName: g };
    static sanitizeUrl = { name: "\u0275\u0275sanitizeUrl", moduleName: g };
    static sanitizeUrlOrResourceUrl = { name: "\u0275\u0275sanitizeUrlOrResourceUrl", moduleName: g };
    static trustConstantHtml = { name: "\u0275\u0275trustConstantHtml", moduleName: g };
    static trustConstantResourceUrl = { name: "\u0275\u0275trustConstantResourceUrl", moduleName: g };
    static inputDecorator = { name: "Input", moduleName: g };
    static outputDecorator = { name: "Output", moduleName: g };
    static viewChildDecorator = { name: "ViewChild", moduleName: g };
    static viewChildrenDecorator = { name: "ViewChildren", moduleName: g };
    static contentChildDecorator = { name: "ContentChild", moduleName: g };
    static contentChildrenDecorator = { name: "ContentChildren", moduleName: g };
    static InputSignalBrandWriteType = { name: "\u0275INPUT_SIGNAL_BRAND_WRITE_TYPE", moduleName: g };
    static UnwrapDirectiveSignalInputs = { name: "\u0275UnwrapDirectiveSignalInputs", moduleName: g };
    static unwrapWritableSignal = { name: "\u0275unwrapWritableSignal", moduleName: g };
    static assertType = { name: "\u0275assertType", moduleName: g };
} return n; })(), rm = /-+([a-z0-9])/g;
function im(n) { return n.replace(rm, (...e) => e[1].toUpperCase()); }
function om(n, e) { return Bp(n, ":", e); }
function am(n, e) { return Bp(n, ".", e); }
function Bp(n, e, t) { let s = n.indexOf(e); return s == -1 ? t : [n.slice(0, s).trim(), n.slice(s + 1).trim()]; }
function lm(n) { return n === void 0 ? null : n; }
function ak(n) { return n.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1"); }
function cm(n) { let e = []; for (let t = 0; t < n.length; t++) {
    let s = n.charCodeAt(t);
    if (s >= 55296 && s <= 56319 && n.length > t + 1) {
        let r = n.charCodeAt(t + 1);
        r >= 56320 && r <= 57343 && (t++, s = (s - 55296 << 10) + r - 56320 + 65536);
    }
    s <= 127 ? e.push(s) : s <= 2047 ? e.push(s >> 6 & 31 | 192, s & 63 | 128) : s <= 65535 ? e.push(s >> 12 | 224, s >> 6 & 63 | 128, s & 63 | 128) : s <= 2097151 && e.push(s >> 18 & 7 | 240, s >> 12 & 63 | 128, s >> 6 & 63 | 128, s & 63 | 128);
} return e; }
function Mp(n) {
    if (typeof n == "string")
        return n;
    if (Array.isArray(n))
        return `[${n.map(Mp).join(", ")}]`;
    if (n == null)
        return "" + n;
    let e = n.overriddenName || n.name;
    if (e)
        return `${e}`;
    if (!n.toString)
        return "object";
    let t = n.toString();
    if (t == null)
        return "" + t;
    let s = t.indexOf(`
`);
    return s >= 0 ? t.slice(0, s) : t;
}
var sl = class {
    full;
    major;
    minor;
    patch;
    constructor(e) { this.full = e; let t = e.split("."); this.major = t[0], this.minor = t[1], this.patch = t.slice(2).join("."); }
}, to = globalThis, um = /^([1-9]|1[0-8])\./;
function Rp(n) { return n.startsWith("0.") ? !0 : !um.test(n); }
var hm = 3, pm = "# sourceMappingURL=data:application/json;base64,", rl = class {
    file;
    sourcesContent = new Map;
    lines = [];
    lastCol0 = 0;
    hasMappings = !1;
    constructor(e = null) { this.file = e; }
    addSource(e, t = null) { return this.sourcesContent.has(e) || this.sourcesContent.set(e, t), this; }
    addLine() { return this.lines.push([]), this.lastCol0 = 0, this; }
    addMapping(e, t, s, r) { if (!this.currentLine)
        throw new Error("A line must be added before mappings can be added"); if (t != null && !this.sourcesContent.has(t))
        throw new Error(`Unknown source file "${t}"`); if (e == null)
        throw new Error("The column in the generated code must be provided"); if (e < this.lastCol0)
        throw new Error("Mapping should be added in output order"); if (t && (s == null || r == null))
        throw new Error("The source location must be provided when a source url is provided"); return this.hasMappings = !0, this.lastCol0 = e, this.currentLine.push({ col0: e, sourceUrl: t, sourceLine0: s, sourceCol0: r }), this; }
    get currentLine() { return this.lines.slice(-1)[0]; }
    toJSON() { if (!this.hasMappings)
        return null; let e = new Map, t = [], s = []; Array.from(this.sourcesContent.keys()).forEach((c, h) => { e.set(c, h), t.push(c), s.push(this.sourcesContent.get(c) || null); }); let r = "", i = 0, o = 0, a = 0, l = 0; return this.lines.forEach(c => { i = 0, r += c.map(h => { let p = Ui(h.col0 - i); return i = h.col0, h.sourceUrl != null && (p += Ui(e.get(h.sourceUrl) - o), o = e.get(h.sourceUrl), p += Ui(h.sourceLine0 - a), a = h.sourceLine0, p += Ui(h.sourceCol0 - l), l = h.sourceCol0), p; }).join(","), r += ";"; }), r = r.slice(0, -1), { file: this.file || "", version: hm, sourceRoot: "", sources: t, sourcesContent: s, mappings: r }; }
    toJsComment() { return this.hasMappings ? "//" + pm + fm(JSON.stringify(this, null, 0)) : ""; }
};
function fm(n) { let e = "", t = cm(n); for (let s = 0; s < t.length;) {
    let r = t[s++], i = s < t.length ? t[s++] : null, o = s < t.length ? t[s++] : null;
    e += yr(r >> 2), e += yr((r & 3) << 4 | (i === null ? 0 : i >> 4)), e += i === null ? "=" : yr((i & 15) << 2 | (o === null ? 0 : o >> 6)), e += i === null || o === null ? "=" : yr(o & 63);
} return e; }
function Ui(n) { n = n < 0 ? (-n << 1) + 1 : n << 1; let e = ""; do {
    let t = n & 31;
    n = n >> 5, n > 0 && (t = t | 32), e += yr(t);
} while (n > 0); return e; }
var dm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function yr(n) { if (n < 0 || n >= 64)
    throw new Error("Can only encode value in the range [0, 63]"); return dm[n]; }
var mm = /'|\\|\n|\r|\$/g, gm = /^[$A-Z_][0-9A-Z_$]*$/i, il = "  ", po = class {
    indent;
    partsLength = 0;
    parts = [];
    srcSpans = [];
    constructor(e) { this.indent = e; }
}, vm = new Map([[x.And, "&&"], [x.Bigger, ">"], [x.BiggerEquals, ">="], [x.BitwiseOr, "|"], [x.BitwiseAnd, "&"], [x.Divide, "/"], [x.Assign, "="], [x.Equals, "=="], [x.Identical, "==="], [x.Lower, "<"], [x.LowerEquals, "<="], [x.Minus, "-"], [x.Modulo, "%"], [x.Exponentiation, "**"], [x.Multiply, "*"], [x.NotEquals, "!="], [x.NotIdentical, "!=="], [x.NullishCoalesce, "??"], [x.Or, "||"], [x.Plus, "+"], [x.In, "in"], [x.InstanceOf, "instanceof"], [x.AdditionAssignment, "+="], [x.SubtractionAssignment, "-="], [x.MultiplicationAssignment, "*="], [x.DivisionAssignment, "/="], [x.RemainderAssignment, "%="], [x.ExponentiationAssignment, "**="], [x.AndAssignment, "&&="], [x.OrAssignment, "||="], [x.NullishCoalesceAssignment, "??="]]), ol = class n {
    _indent;
    static createRoot() { return new n(0); }
    _lines;
    constructor(e) { this._indent = e, this._lines = [new po(e)]; }
    get _currentLine() { return this._lines[this._lines.length - 1]; }
    println(e, t = "") { this.print(e || null, t, !0); }
    lineIsEmpty() { return this._currentLine.parts.length === 0; }
    lineLength() { return this._currentLine.indent * il.length + this._currentLine.partsLength; }
    print(e, t, s = !1) { t.length > 0 && (this._currentLine.parts.push(t), this._currentLine.partsLength += t.length, this._currentLine.srcSpans.push(e && e.sourceSpan || null)), s && this._lines.push(new po(this._indent)); }
    removeEmptyLastLine() { this.lineIsEmpty() && this._lines.pop(); }
    incIndent() { this._indent++, this.lineIsEmpty() && (this._currentLine.indent = this._indent); }
    decIndent() { this._indent--, this.lineIsEmpty() && (this._currentLine.indent = this._indent); }
    toSource() {
        return this.sourceLines.map(e => e.parts.length > 0 ? ku(e.indent) + e.parts.join("") : "").join(`
`);
    }
    toSourceMapGenerator(e, t = 0) { let s = new rl(e), r = !1, i = () => { r || (s.addSource(e, " ").addMapping(0, e, 0, 0), r = !0); }; for (let o = 0; o < t; o++)
        s.addLine(), i(); return this.sourceLines.forEach((o, a) => { s.addLine(); let l = o.srcSpans, c = o.parts, h = o.indent * il.length, p = 0; for (; p < l.length && !l[p];)
        h += c[p].length, p++; for (p < l.length && a === 0 && h === 0 ? r = !0 : i(); p < l.length;) {
        let m = l[p], v = m.start.file, w = m.start.line, C = m.start.col;
        for (s.addSource(v.url, v.content).addMapping(h, v.url, w, C), h += c[p].length, p++; p < l.length && (m === l[p] || !l[p]);)
            h += c[p].length, p++;
    } }), s; }
    spanOf(e, t) { let s = this._lines[e]; if (s) {
        let r = t - ku(s.indent).length;
        for (let i = 0; i < s.parts.length; i++) {
            let o = s.parts[i];
            if (o.length > r)
                return s.srcSpans[i];
            r -= o.length;
        }
    } return null; }
    get sourceLines() { return this._lines.length && this._lines[this._lines.length - 1].parts.length === 0 ? this._lines.slice(0, -1) : this._lines; }
}, al = class {
    _escapeDollarInStrings;
    lastIfCondition = null;
    constructor(e) { this._escapeDollarInStrings = e; }
    printLeadingComments(e, t) {
        if (e.leadingComments !== void 0)
            for (let s of e.leadingComments)
                s instanceof qr ? t.print(e, `/*${s.toString()}*/`, s.trailingNewline) : s.multiline ? t.print(e, `/* ${s.text} */`, s.trailingNewline) : s.text.split(`
`).forEach(r => { t.println(e, `// ${r}`); });
    }
    visitExpressionStmt(e, t) { return this.printLeadingComments(e, t), e.expr.visitExpression(this, t), t.println(e, ";"), null; }
    visitReturnStmt(e, t) { return this.printLeadingComments(e, t), t.print(e, "return "), e.value.visitExpression(this, t), t.println(e, ";"), null; }
    visitIfStmt(e, t) { this.printLeadingComments(e, t), t.print(e, "if ("), this.lastIfCondition = e.condition, e.condition.visitExpression(this, t), this.lastIfCondition = null, t.print(e, ") {"); let s = e.falseCase != null && e.falseCase.length > 0; return e.trueCase.length <= 1 && !s ? (t.print(e, " "), this.visitAllStatements(e.trueCase, t), t.removeEmptyLastLine(), t.print(e, " ")) : (t.println(), t.incIndent(), this.visitAllStatements(e.trueCase, t), t.decIndent(), s && (t.println(e, "} else {"), t.incIndent(), this.visitAllStatements(e.falseCase, t), t.decIndent())), t.println(e, "}"), null; }
    visitInvokeFunctionExpr(e, t) { let s = e.fn instanceof Fn; return s && t.print(e.fn, "("), e.fn.visitExpression(this, t), s && t.print(e.fn, ")"), t.print(e, "("), this.visitAllExpressions(e.args, t, ","), t.print(e, ")"), null; }
    visitTaggedTemplateLiteralExpr(e, t) { return e.tag.visitExpression(this, t), e.template.visitExpression(this, t), null; }
    visitTemplateLiteralExpr(e, t) { t.print(e, "`"); for (let s = 0; s < e.elements.length; s++) {
        e.elements[s].visitExpression(this, t);
        let r = s < e.expressions.length ? e.expressions[s] : null;
        r !== null && (t.print(r, "${"), r.visitExpression(this, t), t.print(r, "}"));
    } t.print(e, "`"); }
    visitTemplateLiteralElementExpr(e, t) { t.print(e, e.rawText); }
    visitWrappedNodeExpr(e, t) { throw new Error("Abstract emitter cannot visit WrappedNodeExpr."); }
    visitTypeofExpr(e, t) { t.print(e, "typeof "), e.expr.visitExpression(this, t); }
    visitVoidExpr(e, t) { t.print(e, "void "), e.expr.visitExpression(this, t); }
    visitReadVarExpr(e, t) { return t.print(e, e.name), null; }
    visitInstantiateExpr(e, t) { return t.print(e, "new "), e.classExpr.visitExpression(this, t), t.print(e, "("), this.visitAllExpressions(e.args, t, ","), t.print(e, ")"), null; }
    visitLiteralExpr(e, t) { let s = e.value; return typeof s == "string" ? t.print(e, Xn(s, this._escapeDollarInStrings)) : t.print(e, `${s}`), null; }
    visitRegularExpressionLiteral(e, t) { return t.print(e, `/${e.body}/${e.flags || ""}`), null; }
    visitLocalizedString(e, t) { let s = e.serializeI18nHead(); t.print(e, "$localize `" + s.raw); for (let r = 1; r < e.messageParts.length; r++)
        t.print(e, "${"), e.expressions[r - 1].visitExpression(this, t), t.print(e, `}${e.serializeI18nTemplatePart(r).raw}`); return t.print(e, "`"), null; }
    visitConditionalExpr(e, t) { return t.print(e, "("), e.condition.visitExpression(this, t), t.print(e, "? "), e.trueCase.visitExpression(this, t), t.print(e, ": "), e.falseCase.visitExpression(this, t), t.print(e, ")"), null; }
    visitDynamicImportExpr(e, t) { t.print(e, `import(${e.url})`); }
    visitNotExpr(e, t) { return t.print(e, "!"), e.condition.visitExpression(this, t), null; }
    visitUnaryOperatorExpr(e, t) { let s; switch (e.operator) {
        case Os.Plus:
            s = "+";
            break;
        case Os.Minus:
            s = "-";
            break;
        default: throw new Error(`Unknown operator ${e.operator}`);
    } let r = e !== this.lastIfCondition; return r && t.print(e, "("), t.print(e, s), e.expr.visitExpression(this, t), r && t.print(e, ")"), null; }
    visitBinaryOperatorExpr(e, t) { let s = vm.get(e.operator); if (!s)
        throw new Error(`Unknown operator ${e.operator}`); let r = e !== this.lastIfCondition; return r && t.print(e, "("), e.lhs.visitExpression(this, t), t.print(e, ` ${s} `), e.rhs.visitExpression(this, t), r && t.print(e, ")"), null; }
    visitReadPropExpr(e, t) { return e.receiver.visitExpression(this, t), t.print(e, "."), t.print(e, e.name), null; }
    visitReadKeyExpr(e, t) { return e.receiver.visitExpression(this, t), t.print(e, "["), e.index.visitExpression(this, t), t.print(e, "]"), null; }
    visitLiteralArrayExpr(e, t) { return t.print(e, "["), this.visitAllExpressions(e.entries, t, ","), t.print(e, "]"), null; }
    visitLiteralMapExpr(e, t) { return t.print(e, "{"), this.visitAllObjects(s => { s instanceof qt ? (t.print(e, "..."), s.expression.visitExpression(this, t)) : (t.print(e, `${Xn(s.key, this._escapeDollarInStrings, s.quoted)}:`), s.value.visitExpression(this, t)); }, e.entries, t, ","), t.print(e, "}"), null; }
    visitCommaExpr(e, t) { return t.print(e, "("), this.visitAllExpressions(e.parts, t, ","), t.print(e, ")"), null; }
    visitParenthesizedExpr(e, t) { e.expr.visitExpression(this, t); }
    visitSpreadElementExpr(e, t) { t.print(e, "..."), e.expression.visitExpression(this, t); }
    visitAllExpressions(e, t, s) { this.visitAllObjects(r => r.visitExpression(this, t), e, t, s); }
    visitAllObjects(e, t, s, r) { let i = !1; for (let o = 0; o < t.length; o++)
        o > 0 && (s.lineLength() > 80 ? (s.print(null, r, !0), i || (s.incIndent(), s.incIndent(), i = !0)) : s.print(null, r, !1)), e(t[o]); i && (s.decIndent(), s.decIndent()); }
    visitAllStatements(e, t) { e.forEach(s => s.visitStatement(this, t)); }
};
function Xn(n, e, t = !0) {
    if (n == null)
        return null;
    let s = n.replace(mm, (...i) => i[0] == "$" ? e ? "\\$" : "$" : i[0] == `
` ? "\\n" : i[0] == "\r" ? "\\r" : `\\${i[0]}`);
    return t || !gm.test(s) ? `'${s}'` : s;
}
function ku(n) { let e = ""; for (let t = 0; t < n; t++)
    e += il; return e; }
function ga(n, e) { if (e === 0)
    return Se(n); let t = []; for (let s = 0; s < e; s++)
    t.push(re); return Se(n, void 0, t); }
function wm(n, e) { let t = Xn(e, !1, !1); return t !== e ? `${n}[${t}]` : `${n}.${e}`; }
function Em(n) { return Fp("ngJitMode", n); }
function Wr(n) { return Fp("ngDevMode", n); }
function Fp(n, e) { let t = new sn({ name: n, moduleName: null }), s = new j(x.Identical, new os(t), d("undefined")), r = new j(x.Or, s, t, void 0, void 0); return new j(x.And, r, e); }
function we(n) { let e = new W(n); return { value: e, type: e }; }
function At(n, e) { let t = q(n.map(s => s.value)); return e ? ie([], t) : t; }
function Gc(n, e) { return { expression: n, forwardRef: e }; }
function Ds({ expression: n, forwardRef: e }) { switch (e) {
    case 0:
    case 1: return n;
    case 2: return Xc(n);
} }
function Xc(n) { return y(f.forwardRef).callFn([ie([], n)]); }
var fo = (function (n) { return n[n.Class = 0] = "Class", n[n.Function = 1] = "Function", n; })(fo || {});
function jn(n) { let e = D("__ngFactoryType__"), t = null, s = bu(n) ? e : new j(x.Or, e, n.type.value), r = null; n.deps !== null ? n.deps !== "invalid" && (r = new qs(s, _u(n.deps, n.target))) : (t = D(`\u0275${n.name}_BaseFactory`), r = t.callFn([s])); let i = [], o = null; function a(c) { let h = D("__ngConditionalFactory__"); i.push(new he(h.name, An, gt)); let p = r !== null ? h.set(r).toStmt() : y(f.invalidFactory).callFn([]).toStmt(); return i.push(Fi(e, [p], [h.set(c).toStmt()])), h; } if (bu(n)) {
    let c = _u(n.delegateDeps, n.target), h = new (n.delegateType === fo.Class ? qs : Ue)(n.delegate, c);
    o = a(h);
}
else
    Cm(n) ? o = a(n.expression) : o = r; if (o === null)
    i.push(y(f.invalidFactory).callFn([]).toStmt());
else if (t !== null) {
    let c = y(f.getInheritedFactory).callFn([n.type.value]), h = new j(x.Or, t, t.set(c));
    i.push(new me(h.callFn([s])));
}
else
    i.push(new me(o)); let l = on([new Z(e.name, re)], i, gt, void 0, `${n.name}_Factory`); return t !== null && (l = ie([], [new he(t.name), new me(l)]).callFn([], void 0, !0)), { expression: l, statements: [], type: $p(n) }; }
function $p(n) { let e = n.deps !== null && n.deps !== "invalid" ? xm(n.deps) : _t; return Se(y(f.FactoryDeclaration, [ga(n.type.type, n.typeArgumentCount), e])); }
function _u(n, e) { return n.map((t, s) => Sm(t, e, s)); }
function Sm(n, e, t) { if (n.token === null)
    return y(f.invalidFactoryDep).callFn([d(t)]); if (n.attributeNameType === null) {
    let s = 0 | (n.self ? 2 : 0) | (n.skipSelf ? 4 : 0) | (n.host ? 1 : 0) | (n.optional ? 8 : 0) | (e === Lt.Pipe ? 16 : 0), r = s !== 0 || n.optional ? d(s) : null, i = [n.token];
    r && i.push(r);
    let o = Am(e);
    return y(o).callFn(i);
}
else
    return y(f.injectAttribute).callFn([n.token]); }
function xm(n) { let e = !1, t = n.map(s => { let r = ym(s); return r !== null ? (e = !0, r) : d(null); }); return e ? Se(q(t)) : _t; }
function ym(n) { let e = []; return n.attributeNameType !== null && e.push({ key: "attribute", value: n.attributeNameType, quoted: !1 }), n.optional && e.push({ key: "optional", value: d(!0), quoted: !1 }), n.host && e.push({ key: "host", value: d(!0), quoted: !1 }), n.self && e.push({ key: "self", value: d(!0), quoted: !1 }), n.skipSelf && e.push({ key: "skipSelf", value: d(!0), quoted: !1 }), e.length > 0 ? ye(e) : null; }
function bu(n) { return n.delegateType !== void 0; }
function Cm(n) { return n.expression !== void 0; }
function Am(n) { switch (n) {
    case Lt.Component:
    case Lt.Directive:
    case Lt.Pipe: return f.directiveInject;
    case Lt.NgModule:
    case Lt.Injectable:
    default: return f.inject;
} }
var us = class {
    start;
    end;
    constructor(e, t) { this.start = e, this.end = t; }
    toAbsolute(e) { return new tt(e + this.start, e + this.end); }
}, te = class {
    span;
    sourceSpan;
    constructor(e, t) { this.span = e, this.sourceSpan = t; }
    toString() { return "AST"; }
}, jr = class extends te {
    nameSpan;
    constructor(e, t, s) { super(e, t), this.nameSpan = s; }
}, Ne = class extends te {
    visit(e, t = null) { return e.visitEmptyExpr?.(this, t); }
}, Ut = class extends te {
    visit(e, t = null) { return e.visitImplicitReceiver(this, t); }
}, zr = class extends te {
    visit(e, t = null) { return e.visitThisReceiver?.(this, t); }
}, Ws = class extends te {
    expressions;
    constructor(e, t, s) { super(e, t), this.expressions = s; }
    visit(e, t = null) { return e.visitChain(this, t); }
}, mo = class extends te {
    condition;
    trueExp;
    falseExp;
    constructor(e, t, s, r, i) { super(e, t), this.condition = s, this.trueExp = r, this.falseExp = i; }
    visit(e, t = null) { return e.visitConditional(this, t); }
}, $t = class extends jr {
    receiver;
    name;
    constructor(e, t, s, r, i) { super(e, t, s), this.receiver = r, this.name = i; }
    visit(e, t = null) { return e.visitPropertyRead(this, t); }
}, Gr = class extends jr {
    receiver;
    name;
    constructor(e, t, s, r, i) { super(e, t, s), this.receiver = r, this.name = i; }
    visit(e, t = null) { return e.visitSafePropertyRead(this, t); }
}, hs = class extends te {
    receiver;
    key;
    constructor(e, t, s, r) { super(e, t), this.receiver = s, this.key = r; }
    visit(e, t = null) { return e.visitKeyedRead(this, t); }
}, Xr = class extends te {
    receiver;
    key;
    constructor(e, t, s, r) { super(e, t), this.receiver = s, this.key = r; }
    visit(e, t = null) { return e.visitSafeKeyedRead(this, t); }
}, no = (function (n) { return n[n.ReferencedByName = 0] = "ReferencedByName", n[n.ReferencedDirectly = 1] = "ReferencedDirectly", n; })(no || {}), go = class extends jr {
    exp;
    name;
    args;
    type;
    constructor(e, t, s, r, i, o, a) { super(e, t, a), this.exp = s, this.name = r, this.args = i, this.type = o; }
    visit(e, t = null) { return e.visitPipe(this, t); }
}, We = class extends te {
    value;
    constructor(e, t, s) { super(e, t), this.value = s; }
    visit(e, t = null) { return e.visitLiteralPrimitive(this, t); }
}, Yr = class extends te {
    expressions;
    constructor(e, t, s) { super(e, t), this.expressions = s; }
    visit(e, t = null) { return e.visitLiteralArray(this, t); }
}, vo = class extends te {
    expression;
    constructor(e, t, s) { super(e, t), this.expression = s; }
    visit(e, t = null) { return e.visitSpreadElement(this, t); }
}, ps = class extends te {
    keys;
    values;
    constructor(e, t, s, r) { super(e, t), this.keys = s, this.values = r; }
    visit(e, t = null) { return e.visitLiteralMap(this, t); }
}, $i = class extends te {
    strings;
    expressions;
    constructor(e, t, s, r) { super(e, t), this.strings = s, this.expressions = r; }
    visit(e, t = null) { return e.visitInterpolation(this, t); }
}, Be = class extends te {
    operation;
    left;
    right;
    constructor(e, t, s, r, i) { super(e, t), this.operation = s, this.left = r, this.right = i; }
    visit(e, t = null) { return e.visitBinary(this, t); }
    static isAssignmentOperation(e) { return e === "=" || e === "+=" || e === "-=" || e === "*=" || e === "/=" || e === "%=" || e === "**=" || e === "&&=" || e === "||=" || e === "??="; }
}, Rs = class n extends Be {
    operator;
    expr;
    left = null;
    right = null;
    operation = null;
    static createMinus(e, t, s) { return new n(e, t, "-", s, "-", new We(e, t, 0), s); }
    static createPlus(e, t, s) { return new n(e, t, "+", s, "-", s, new We(e, t, 0)); }
    constructor(e, t, s, r, i, o, a) { super(e, t, i, o, a), this.operator = s, this.expr = r; }
    visit(e, t = null) { return e.visitUnary !== void 0 ? e.visitUnary(this, t) : e.visitBinary(this, t); }
}, Qr = class extends te {
    expression;
    constructor(e, t, s) { super(e, t), this.expression = s; }
    visit(e, t = null) { return e.visitPrefixNot(this, t); }
}, Zr = class extends te {
    expression;
    constructor(e, t, s) { super(e, t), this.expression = s; }
    visit(e, t = null) { return e.visitTypeofExpression(this, t); }
}, Jr = class extends te {
    expression;
    constructor(e, t, s) { super(e, t), this.expression = s; }
    visit(e, t = null) { return e.visitVoidExpression(this, t); }
}, Kr = class extends te {
    expression;
    constructor(e, t, s) { super(e, t), this.expression = s; }
    visit(e, t = null) { return e.visitNonNullAssert(this, t); }
}, js = class extends te {
    receiver;
    args;
    argumentSpan;
    constructor(e, t, s, r, i) { super(e, t), this.receiver = s, this.args = r, this.argumentSpan = i; }
    visit(e, t = null) { return e.visitCall(this, t); }
}, wo = class extends te {
    receiver;
    args;
    argumentSpan;
    constructor(e, t, s, r, i) { super(e, t), this.receiver = s, this.args = r, this.argumentSpan = i; }
    visit(e, t = null) { return e.visitSafeCall(this, t); }
}, ei = class extends te {
    tag;
    template;
    constructor(e, t, s, r) { super(e, t), this.tag = s, this.template = r; }
    visit(e, t) { return e.visitTaggedTemplateLiteral(this, t); }
}, ti = class extends te {
    elements;
    expressions;
    constructor(e, t, s, r) { super(e, t), this.elements = s, this.expressions = r; }
    visit(e, t) { return e.visitTemplateLiteral(this, t); }
}, Eo = class extends te {
    text;
    constructor(e, t, s) { super(e, t), this.text = s; }
    visit(e, t) { return e.visitTemplateLiteralElement(this, t); }
}, ni = class extends te {
    expression;
    constructor(e, t, s) { super(e, t), this.expression = s; }
    visit(e, t) { return e.visitParenthesizedExpression(this, t); }
}, ll = class {
    name;
    span;
    sourceSpan;
    constructor(e, t, s) { this.name = e, this.span = t, this.sourceSpan = s; }
}, So = class extends te {
    parameters;
    body;
    constructor(e, t, s, r) { super(e, t), this.parameters = s, this.body = r; }
    visit(e, t) { return e.visitArrowFunction(this, t); }
}, xo = class extends te {
    body;
    flags;
    constructor(e, t, s, r) { super(e, t), this.body = s, this.flags = r; }
    visit(e, t) { return e.visitRegularExpressionLiteral(this, t); }
}, tt = class {
    start;
    end;
    constructor(e, t) { this.start = e, this.end = t; }
}, ze = class extends te {
    ast;
    source;
    location;
    errors;
    constructor(e, t, s, r, i) { super(new us(0, t === null ? 0 : t.length), new tt(r, t === null ? r : r + t.length)), this.ast = e, this.source = t, this.location = s, this.errors = i; }
    visit(e, t = null) { return e.visitASTWithSource ? e.visitASTWithSource(this, t) : this.ast.visit(e, t); }
    toString() { return `${this.source} in ${this.location}`; }
}, si = class {
    sourceSpan;
    key;
    value;
    constructor(e, t, s) { this.sourceSpan = e, this.key = t, this.value = s; }
}, cl = class {
    sourceSpan;
    key;
    value;
    constructor(e, t, s) { this.sourceSpan = e, this.key = t, this.value = s; }
}, zs = class {
    visit(e, t) { e.visit(this, t); }
    visitUnary(e, t) { this.visit(e.expr, t); }
    visitBinary(e, t) { this.visit(e.left, t), this.visit(e.right, t); }
    visitChain(e, t) { this.visitAll(e.expressions, t); }
    visitConditional(e, t) { this.visit(e.condition, t), this.visit(e.trueExp, t), this.visit(e.falseExp, t); }
    visitPipe(e, t) { this.visit(e.exp, t), this.visitAll(e.args, t); }
    visitImplicitReceiver(e, t) { }
    visitThisReceiver(e, t) { }
    visitInterpolation(e, t) { this.visitAll(e.expressions, t); }
    visitKeyedRead(e, t) { this.visit(e.receiver, t), this.visit(e.key, t); }
    visitLiteralArray(e, t) { this.visitAll(e.expressions, t); }
    visitLiteralMap(e, t) { this.visitAll(e.values, t); }
    visitLiteralPrimitive(e, t) { }
    visitPrefixNot(e, t) { this.visit(e.expression, t); }
    visitTypeofExpression(e, t) { this.visit(e.expression, t); }
    visitVoidExpression(e, t) { this.visit(e.expression, t); }
    visitNonNullAssert(e, t) { this.visit(e.expression, t); }
    visitPropertyRead(e, t) { this.visit(e.receiver, t); }
    visitSafePropertyRead(e, t) { this.visit(e.receiver, t); }
    visitSafeKeyedRead(e, t) { this.visit(e.receiver, t), this.visit(e.key, t); }
    visitCall(e, t) { this.visit(e.receiver, t), this.visitAll(e.args, t); }
    visitSafeCall(e, t) { this.visit(e.receiver, t), this.visitAll(e.args, t); }
    visitTemplateLiteral(e, t) { for (let s = 0; s < e.elements.length; s++) {
        this.visit(e.elements[s], t);
        let r = s < e.expressions.length ? e.expressions[s] : null;
        r !== null && this.visit(r, t);
    } }
    visitTemplateLiteralElement(e, t) { }
    visitTaggedTemplateLiteral(e, t) { this.visit(e.tag, t), this.visit(e.template, t); }
    visitParenthesizedExpression(e, t) { this.visit(e.expression, t); }
    visitArrowFunction(e, t) { this.visit(e.body, t); }
    visitRegularExpressionLiteral(e, t) { }
    visitSpreadElement(e, t) { this.visit(e.expression, t); }
    visitEmptyExpr(e, t) { }
    visitAll(e, t) { for (let s of e)
        this.visit(s, t); }
}, Ps = class {
    name;
    expression;
    type;
    sourceSpan;
    keySpan;
    valueSpan;
    isLiteral;
    isLegacyAnimation;
    isAnimation;
    constructor(e, t, s, r, i, o) { this.name = e, this.expression = t, this.type = s, this.sourceSpan = r, this.keySpan = i, this.valueSpan = o, this.isLiteral = this.type === Pt.LITERAL_ATTR, this.isLegacyAnimation = this.type === Pt.LEGACY_ANIMATION, this.isAnimation = this.type === Pt.ANIMATION; }
}, Pt = (function (n) { return n[n.DEFAULT = 0] = "DEFAULT", n[n.LITERAL_ATTR = 1] = "LITERAL_ATTR", n[n.LEGACY_ANIMATION = 2] = "LEGACY_ANIMATION", n[n.TWO_WAY = 3] = "TWO_WAY", n[n.ANIMATION = 4] = "ANIMATION", n; })(Pt || {}), Oe = (function (n) { return n[n.Regular = 0] = "Regular", n[n.LegacyAnimation = 1] = "LegacyAnimation", n[n.TwoWay = 2] = "TwoWay", n[n.Animation = 3] = "Animation", n; })(Oe || {}), yo = class {
    name;
    targetOrPhase;
    type;
    handler;
    sourceSpan;
    handlerSpan;
    keySpan;
    constructor(e, t, s, r, i, o, a) { this.name = e, this.targetOrPhase = t, this.type = s, this.handler = r, this.sourceSpan = i, this.handlerSpan = o, this.keySpan = a; }
}, ul = class {
    name;
    value;
    sourceSpan;
    keySpan;
    valueSpan;
    constructor(e, t, s, r, i) { this.name = e, this.value = t, this.sourceSpan = s, this.keySpan = r, this.valueSpan = i; }
}, X = (function (n) { return n[n.Property = 0] = "Property", n[n.Attribute = 1] = "Attribute", n[n.Class = 2] = "Class", n[n.Style = 3] = "Style", n[n.LegacyAnimation = 4] = "LegacyAnimation", n[n.TwoWay = 5] = "TwoWay", n[n.Animation = 6] = "Animation", n; })(X || {}), Co = class {
    name;
    type;
    securityContext;
    value;
    unit;
    sourceSpan;
    keySpan;
    valueSpan;
    constructor(e, t, s, r, i, o, a, l) { this.name = e, this.type = t, this.securityContext = s, this.value = r, this.unit = i, this.sourceSpan = o, this.keySpan = a, this.valueSpan = l; }
}, Bt = (function (n) { return n[n.RAW_TEXT = 0] = "RAW_TEXT", n[n.ESCAPABLE_RAW_TEXT = 1] = "ESCAPABLE_RAW_TEXT", n[n.PARSABLE_DATA = 2] = "PARSABLE_DATA", n; })(Bt || {});
function It(n, e = !0) { if (n[0] != ":")
    return [null, n]; let t = n.indexOf(":", 1); if (t === -1) {
    if (e)
        throw new Error(`Unsupported format "${n}" expecting ":namespace:name"`);
    return [null, n];
} return [n.slice(1, t), n.slice(t + 1)]; }
function Tu(n) { return It(n)[1] === "ng-container"; }
function hl(n) { return It(n)[1] === "ng-content"; }
function km(n) { return It(n)[1] === "ng-template"; }
function pl(n) { return n === null ? null : It(n)[0]; }
function so(n, e) { return n ? `:${n}:${e}` : e; }
var va = class {
    value;
    sourceSpan;
    constructor(e, t) { this.value = e, this.sourceSpan = t; }
    visit(e) { throw new Error("visit() not implemented for Comment"); }
}, Yn = class {
    value;
    sourceSpan;
    constructor(e, t) { this.value = e, this.sourceSpan = t; }
    visit(e) { return e.visitText(this); }
}, Gs = class {
    value;
    sourceSpan;
    i18n;
    constructor(e, t, s) { this.value = e, this.sourceSpan = t, this.i18n = s; }
    visit(e) { return e.visitBoundText(this); }
}, Xs = class {
    name;
    value;
    sourceSpan;
    keySpan;
    valueSpan;
    i18n;
    constructor(e, t, s, r, i, o) { this.name = e, this.value = t, this.sourceSpan = s, this.keySpan = r, this.valueSpan = i, this.i18n = o; }
    visit(e) { return e.visitTextAttribute(this); }
}, fl = class n {
    name;
    type;
    securityContext;
    value;
    unit;
    sourceSpan;
    keySpan;
    valueSpan;
    i18n;
    constructor(e, t, s, r, i, o, a, l, c) { this.name = e, this.type = t, this.securityContext = s, this.value = r, this.unit = i, this.sourceSpan = o, this.keySpan = a, this.valueSpan = l, this.i18n = c; }
    static fromBoundElementProperty(e, t) { if (e.keySpan === void 0)
        throw new Error(`Unexpected state: keySpan must be defined for bound attributes but was not for ${e.name}: ${e.sourceSpan}`); return new n(e.name, e.type, e.securityContext, e.value, e.unit, e.sourceSpan, e.keySpan, e.valueSpan, t); }
    visit(e) { return e.visitBoundAttribute(this); }
}, dl = class n {
    name;
    type;
    handler;
    target;
    phase;
    sourceSpan;
    handlerSpan;
    keySpan;
    constructor(e, t, s, r, i, o, a, l) { this.name = e, this.type = t, this.handler = s, this.target = r, this.phase = i, this.sourceSpan = o, this.handlerSpan = a, this.keySpan = l; }
    static fromParsedEvent(e) { let t = e.type === Oe.Regular ? e.targetOrPhase : null, s = e.type === Oe.LegacyAnimation ? e.targetOrPhase : null; if (e.keySpan === void 0)
        throw new Error(`Unexpected state: keySpan must be defined for bound event but was not for ${e.name}: ${e.sourceSpan}`); return new n(e.name, e.type, e.handler, t, s, e.sourceSpan, e.handlerSpan, e.keySpan); }
    visit(e) { return e.visitBoundEvent(this); }
}, Ht = class {
    name;
    attributes;
    inputs;
    outputs;
    directives;
    children;
    references;
    isSelfClosing;
    sourceSpan;
    startSourceSpan;
    endSourceSpan;
    isVoid;
    i18n;
    constructor(e, t, s, r, i, o, a, l, c, h, p, m, v) { this.name = e, this.attributes = t, this.inputs = s, this.outputs = r, this.directives = i, this.children = o, this.references = a, this.isSelfClosing = l, this.sourceSpan = c, this.startSourceSpan = h, this.endSourceSpan = p, this.isVoid = m, this.i18n = v; }
    visit(e) { return e.visitElement(this); }
}, Wt = class {
    nameSpan;
    sourceSpan;
    prefetchSpan;
    whenOrOnSourceSpan;
    hydrateSpan;
    constructor(e, t, s, r, i) { this.nameSpan = e, this.sourceSpan = t, this.prefetchSpan = s, this.whenOrOnSourceSpan = r, this.hydrateSpan = i; }
    visit(e) { return e.visitDeferredTrigger(this); }
}, Ao = class extends Wt {
    value;
    constructor(e, t, s, r, i) { super(null, t, s, r, i), this.value = e; }
}, ml = class extends Wt {
}, gl = class extends Wt {
}, vl = class extends Wt {
}, ko = class extends Wt {
    reference;
    constructor(e, t, s, r, i, o) { super(t, s, r, i, o), this.reference = e; }
}, wl = class extends Wt {
    delay;
    constructor(e, t, s, r, i, o) { super(t, s, r, i, o), this.delay = e; }
}, _o = class extends Wt {
    reference;
    constructor(e, t, s, r, i, o) { super(t, s, r, i, o), this.reference = e; }
}, ri = class extends Wt {
    reference;
    options;
    constructor(e, t, s, r, i, o, a) { super(s, r, i, o, a), this.reference = e, this.options = t; }
}, Ye = class {
    nameSpan;
    sourceSpan;
    startSourceSpan;
    endSourceSpan;
    constructor(e, t, s, r) { this.nameSpan = e, this.sourceSpan = t, this.startSourceSpan = s, this.endSourceSpan = r; }
}, ii = class extends Ye {
    children;
    minimumTime;
    i18n;
    constructor(e, t, s, r, i, o, a) { super(s, r, i, o), this.children = e, this.minimumTime = t, this.i18n = a; }
    visit(e) { return e.visitDeferredBlockPlaceholder(this); }
}, oi = class extends Ye {
    children;
    afterTime;
    minimumTime;
    i18n;
    constructor(e, t, s, r, i, o, a, l) { super(r, i, o, a), this.children = e, this.afterTime = t, this.minimumTime = s, this.i18n = l; }
    visit(e) { return e.visitDeferredBlockLoading(this); }
}, ai = class extends Ye {
    children;
    i18n;
    constructor(e, t, s, r, i, o) { super(t, s, r, i), this.children = e, this.i18n = o; }
    visit(e) { return e.visitDeferredBlockError(this); }
}, fs = class extends Ye {
    children;
    placeholder;
    loading;
    error;
    mainBlockSpan;
    i18n;
    triggers;
    prefetchTriggers;
    hydrateTriggers;
    definedTriggers;
    definedPrefetchTriggers;
    definedHydrateTriggers;
    constructor(e, t, s, r, i, o, a, l, c, h, p, m, v) { super(l, c, p, m), this.children = e, this.placeholder = i, this.loading = o, this.error = a, this.mainBlockSpan = h, this.i18n = v, this.triggers = t, this.prefetchTriggers = s, this.hydrateTriggers = r, this.definedTriggers = Object.keys(t), this.definedPrefetchTriggers = Object.keys(s), this.definedHydrateTriggers = Object.keys(r); }
    visit(e) { return e.visitDeferredBlock(this); }
    visitAll(e) { this.visitTriggers(this.definedHydrateTriggers, this.hydrateTriggers, e), this.visitTriggers(this.definedTriggers, this.triggers, e), this.visitTriggers(this.definedPrefetchTriggers, this.prefetchTriggers, e), z(e, this.children); let t = [this.placeholder, this.loading, this.error].filter(s => s !== null); z(e, t); }
    visitTriggers(e, t, s) { z(s, e.map(r => t[r])); }
}, bo = class extends Ye {
    expression;
    groups;
    unknownBlocks;
    exhaustiveCheck;
    constructor(e, t, s, r, i, o, a, l) { super(l, i, o, a), this.expression = e, this.groups = t, this.unknownBlocks = s, this.exhaustiveCheck = r; }
    visit(e) { return e.visitSwitchBlock(this); }
}, El = class extends Ye {
    expression;
    constructor(e, t, s, r, i) { super(i, t, s, r), this.expression = e; }
    visit(e) { return e.visitSwitchBlockCase(this); }
}, li = class extends Ye {
    cases;
    children;
    i18n;
    constructor(e, t, s, r, i, o, a) { super(o, s, r, i), this.cases = e, this.children = t, this.i18n = a; }
    visit(e) { return e.visitSwitchBlockCaseGroup(this); }
}, Sl = class extends Ye {
    constructor(e, t, s, r) { super(r, e, t, s); }
    visit(e) { return e.visitSwitchExhaustiveCheck(this); }
}, Ys = class extends Ye {
    item;
    expression;
    trackBy;
    trackKeywordSpan;
    contextVariables;
    children;
    empty;
    mainBlockSpan;
    i18n;
    constructor(e, t, s, r, i, o, a, l, c, h, p, m, v) { super(m, l, h, p), this.item = e, this.expression = t, this.trackBy = s, this.trackKeywordSpan = r, this.contextVariables = i, this.children = o, this.empty = a, this.mainBlockSpan = c, this.i18n = v; }
    visit(e) { return e.visitForLoopBlock(this); }
}, ci = class extends Ye {
    children;
    i18n;
    constructor(e, t, s, r, i, o) { super(i, t, s, r), this.children = e, this.i18n = o; }
    visit(e) { return e.visitForLoopBlockEmpty(this); }
}, To = class extends Ye {
    branches;
    constructor(e, t, s, r, i) { super(i, t, s, r), this.branches = e; }
    visit(e) { return e.visitIfBlock(this); }
}, Kn = class extends Ye {
    expression;
    children;
    expressionAlias;
    i18n;
    constructor(e, t, s, r, i, o, a, l) { super(a, r, i, o), this.expression = e, this.children = t, this.expressionAlias = s, this.i18n = l; }
    visit(e) { return e.visitIfBlockBranch(this); }
}, Io = class {
    name;
    sourceSpan;
    nameSpan;
    constructor(e, t, s) { this.name = e, this.sourceSpan = t, this.nameSpan = s; }
    visit(e) { return e.visitUnknownBlock(this); }
}, Yc = class {
    name;
    value;
    sourceSpan;
    nameSpan;
    valueSpan;
    constructor(e, t, s, r, i) { this.name = e, this.value = t, this.sourceSpan = s, this.nameSpan = r, this.valueSpan = i; }
    visit(e) { return e.visitLetDeclaration(this); }
}, Tr = class {
    componentName;
    tagName;
    fullName;
    attributes;
    inputs;
    outputs;
    directives;
    children;
    references;
    isSelfClosing;
    sourceSpan;
    startSourceSpan;
    endSourceSpan;
    i18n;
    constructor(e, t, s, r, i, o, a, l, c, h, p, m, v, w) { this.componentName = e, this.tagName = t, this.fullName = s, this.attributes = r, this.inputs = i, this.outputs = o, this.directives = a, this.children = l, this.references = c, this.isSelfClosing = h, this.sourceSpan = p, this.startSourceSpan = m, this.endSourceSpan = v, this.i18n = w; }
    visit(e) { return e.visitComponent(this); }
}, Op = class {
    name;
    attributes;
    inputs;
    outputs;
    references;
    sourceSpan;
    startSourceSpan;
    endSourceSpan;
    i18n;
    constructor(e, t, s, r, i, o, a, l, c) { this.name = e, this.attributes = t, this.inputs = s, this.outputs = r, this.references = i, this.sourceSpan = o, this.startSourceSpan = a, this.endSourceSpan = l, this.i18n = c; }
    visit(e) { return e.visitDirective(this); }
}, st = class {
    tagName;
    attributes;
    inputs;
    outputs;
    directives;
    templateAttrs;
    children;
    references;
    variables;
    isSelfClosing;
    sourceSpan;
    startSourceSpan;
    endSourceSpan;
    i18n;
    constructor(e, t, s, r, i, o, a, l, c, h, p, m, v, w) { this.tagName = e, this.attributes = t, this.inputs = s, this.outputs = r, this.directives = i, this.templateAttrs = o, this.children = a, this.references = l, this.variables = c, this.isSelfClosing = h, this.sourceSpan = p, this.startSourceSpan = m, this.endSourceSpan = v, this.i18n = w; }
    visit(e) { return e.visitTemplate(this); }
}, Qs = class {
    selector;
    attributes;
    children;
    isSelfClosing;
    sourceSpan;
    startSourceSpan;
    endSourceSpan;
    i18n;
    name = "ng-content";
    constructor(e, t, s, r, i, o, a, l) { this.selector = e, this.attributes = t, this.children = s, this.isSelfClosing = r, this.sourceSpan = i, this.startSourceSpan = o, this.endSourceSpan = a, this.i18n = l; }
    visit(e) { return e.visitContent(this); }
}, bn = class {
    name;
    value;
    sourceSpan;
    keySpan;
    valueSpan;
    constructor(e, t, s, r, i) { this.name = e, this.value = t, this.sourceSpan = s, this.keySpan = r, this.valueSpan = i; }
    visit(e) { return e.visitVariable(this); }
}, ui = class {
    name;
    value;
    sourceSpan;
    keySpan;
    valueSpan;
    constructor(e, t, s, r, i) { this.name = e, this.value = t, this.sourceSpan = s, this.keySpan = r, this.valueSpan = i; }
    visit(e) { return e.visitReference(this); }
}, Vp = class {
    vars;
    placeholders;
    sourceSpan;
    i18n;
    constructor(e, t, s, r) { this.vars = e, this.placeholders = t, this.sourceSpan = s, this.i18n = r; }
    visit(e) { return e.visitIcu(this); }
}, hi = class {
    tagNames;
    bindings;
    listeners;
    sourceSpan;
    constructor(e, t, s, r) { if (this.tagNames = e, this.bindings = t, this.listeners = s, this.sourceSpan = r, e.length === 0)
        throw new Error("HostElement must have at least one tag name."); }
    visit() { throw new Error("HostElement cannot be visited"); }
}, _m = class {
    visitElement(e) { z(this, e.attributes), z(this, e.inputs), z(this, e.outputs), z(this, e.directives), z(this, e.children), z(this, e.references); }
    visitTemplate(e) { z(this, e.attributes), z(this, e.inputs), z(this, e.outputs), z(this, e.directives), z(this, e.children), z(this, e.references), z(this, e.variables); }
    visitDeferredBlock(e) { e.visitAll(this); }
    visitDeferredBlockPlaceholder(e) { z(this, e.children); }
    visitDeferredBlockError(e) { z(this, e.children); }
    visitDeferredBlockLoading(e) { z(this, e.children); }
    visitSwitchBlock(e) { z(this, e.groups); }
    visitSwitchBlockCase(e) { }
    visitSwitchBlockCaseGroup(e) { z(this, e.cases), z(this, e.children); }
    visitSwitchExhaustiveCheck(e) { }
    visitForLoopBlock(e) { let t = [e.item, ...e.contextVariables, ...e.children]; e.empty && t.push(e.empty), z(this, t); }
    visitForLoopBlockEmpty(e) { z(this, e.children); }
    visitIfBlock(e) { z(this, e.branches); }
    visitIfBlockBranch(e) { z(this, e.children), e.expressionAlias?.visit(this); }
    visitContent(e) { z(this, e.children); }
    visitComponent(e) { z(this, e.attributes), z(this, e.inputs), z(this, e.outputs), z(this, e.directives), z(this, e.children), z(this, e.references); }
    visitDirective(e) { z(this, e.attributes), z(this, e.inputs), z(this, e.outputs), z(this, e.references); }
    visitVariable(e) { }
    visitReference(e) { }
    visitTextAttribute(e) { }
    visitBoundAttribute(e) { }
    visitBoundEvent(e) { }
    visitText(e) { }
    visitBoundText(e) { }
    visitIcu(e) { }
    visitDeferredTrigger(e) { }
    visitUnknownBlock(e) { }
    visitLetDeclaration(e) { }
};
function z(n, e) { let t = []; if (n.visit)
    for (let s of e)
        n.visit(s);
else
    for (let s of e) {
        let r = s.visit(n);
        r && t.push(r);
    } return t; }
var Le = class {
    nodes;
    placeholders;
    placeholderToMessage;
    meaning;
    description;
    customId;
    sources;
    id;
    legacyIds = [];
    messageString;
    constructor(e, t, s, r, i, o) { this.nodes = e, this.placeholders = t, this.placeholderToMessage = s, this.meaning = r, this.description = i, this.customId = o, this.id = this.customId, this.messageString = bm(this.nodes), e.length ? this.sources = [{ filePath: e[0].sourceSpan.start.file.url, startLine: e[0].sourceSpan.start.line + 1, startCol: e[0].sourceSpan.start.col + 1, endLine: e[e.length - 1].sourceSpan.end.line + 1, endCol: e[0].sourceSpan.start.col + 1 }] : this.sources = []; }
}, Mt = class {
    value;
    sourceSpan;
    constructor(e, t) { this.value = e, this.sourceSpan = t; }
    visit(e, t) { return e.visitText(this, t); }
}, rt = class {
    children;
    sourceSpan;
    constructor(e, t) { this.children = e, this.sourceSpan = t; }
    visit(e, t) { return e.visitContainer(this, t); }
}, Tn = class {
    expression;
    type;
    cases;
    sourceSpan;
    expressionPlaceholder;
    constructor(e, t, s, r, i) { this.expression = e, this.type = t, this.cases = s, this.sourceSpan = r, this.expressionPlaceholder = i; }
    visit(e, t) { return e.visitIcu(this, t); }
}, jt = class {
    tag;
    attrs;
    startName;
    closeName;
    children;
    isVoid;
    sourceSpan;
    startSourceSpan;
    endSourceSpan;
    constructor(e, t, s, r, i, o, a, l, c) { this.tag = e, this.attrs = t, this.startName = s, this.closeName = r, this.children = i, this.isVoid = o, this.sourceSpan = a, this.startSourceSpan = l, this.endSourceSpan = c; }
    visit(e, t) { return e.visitTagPlaceholder(this, t); }
}, mt = class {
    value;
    name;
    sourceSpan;
    constructor(e, t, s) { this.value = e, this.name = t, this.sourceSpan = s; }
    visit(e, t) { return e.visitPlaceholder(this, t); }
}, In = class {
    value;
    name;
    sourceSpan;
    previousMessage;
    constructor(e, t, s) { this.value = e, this.name = t, this.sourceSpan = s; }
    visit(e, t) { return e.visitIcuPlaceholder(this, t); }
}, zt = class {
    name;
    parameters;
    startName;
    closeName;
    children;
    sourceSpan;
    startSourceSpan;
    endSourceSpan;
    constructor(e, t, s, r, i, o, a, l) { this.name = e, this.parameters = t, this.startName = s, this.closeName = r, this.children = i, this.sourceSpan = o, this.startSourceSpan = a, this.endSourceSpan = l; }
    visit(e, t) { return e.visitBlockPlaceholder(this, t); }
}, xl = class {
    visitText(e, t) { return new Mt(e.value, e.sourceSpan); }
    visitContainer(e, t) { let s = e.children.map(r => r.visit(this, t)); return new rt(s, e.sourceSpan); }
    visitIcu(e, t) { let s = {}; return Object.keys(e.cases).forEach(i => s[i] = e.cases[i].visit(this, t)), new Tn(e.expression, e.type, s, e.sourceSpan, e.expressionPlaceholder); }
    visitTagPlaceholder(e, t) { let s = e.children.map(r => r.visit(this, t)); return new jt(e.tag, e.attrs, e.startName, e.closeName, s, e.isVoid, e.sourceSpan, e.startSourceSpan, e.endSourceSpan); }
    visitPlaceholder(e, t) { return new mt(e.value, e.name, e.sourceSpan); }
    visitIcuPlaceholder(e, t) { return new In(e.value, e.name, e.sourceSpan); }
    visitBlockPlaceholder(e, t) { let s = e.children.map(r => r.visit(this, t)); return new zt(e.name, e.parameters, e.startName, e.closeName, s, e.sourceSpan, e.startSourceSpan, e.endSourceSpan); }
}, yl = class {
    visitText(e, t) { }
    visitContainer(e, t) { e.children.forEach(s => s.visit(this)); }
    visitIcu(e, t) { Object.keys(e.cases).forEach(s => { e.cases[s].visit(this); }); }
    visitTagPlaceholder(e, t) { e.children.forEach(s => s.visit(this)); }
    visitPlaceholder(e, t) { }
    visitIcuPlaceholder(e, t) { }
    visitBlockPlaceholder(e, t) { e.children.forEach(s => s.visit(this)); }
};
function bm(n) { let e = new Cl; return n.map(s => s.visit(e)).join(""); }
var Cl = class {
    visitText(e) { return e.value; }
    visitContainer(e) { return e.children.map(t => t.visit(this)).join(""); }
    visitIcu(e) { let t = Object.keys(e.cases).map(s => `${s} {${e.cases[s].visit(this)}}`); return `{${e.expressionPlaceholder}, ${e.type}, ${t.join(" ")}}`; }
    visitTagPlaceholder(e) { let t = e.children.map(s => s.visit(this)).join(""); return `{$${e.startName}}${t}{$${e.closeName}}`; }
    visitPlaceholder(e) { return `{$${e.name}}`; }
    visitIcuPlaceholder(e) { return `{$${e.name}}`; }
    visitBlockPlaceholder(e) { let t = e.children.map(s => s.visit(this)).join(""); return `{$${e.startName}}${t}{$${e.closeName}}`; }
}, Zs = class {
    createNameMapper(e) { return null; }
}, No = class extends yl {
    mapName;
    internalToPublic = {};
    publicToNextId = {};
    publicToInternal = {};
    constructor(e, t) { super(), this.mapName = t, e.nodes.forEach(s => s.visit(this)); }
    toPublicName(e) { return this.internalToPublic.hasOwnProperty(e) ? this.internalToPublic[e] : null; }
    toInternalName(e) { return this.publicToInternal.hasOwnProperty(e) ? this.publicToInternal[e] : null; }
    visitText(e, t) { return null; }
    visitTagPlaceholder(e, t) { this.visitPlaceholderName(e.startName), super.visitTagPlaceholder(e, t), this.visitPlaceholderName(e.closeName); }
    visitPlaceholder(e, t) { this.visitPlaceholderName(e.name); }
    visitBlockPlaceholder(e, t) { this.visitPlaceholderName(e.startName), super.visitBlockPlaceholder(e, t), this.visitPlaceholderName(e.closeName); }
    visitIcuPlaceholder(e, t) { this.visitPlaceholderName(e.name); }
    visitPlaceholderName(e) { if (!e || this.internalToPublic.hasOwnProperty(e))
        return; let t = this.mapName(e); if (this.publicToInternal.hasOwnProperty(t)) {
        let s = this.publicToNextId[t];
        this.publicToNextId[t] = s + 1, t = `${t}_${s}`;
    }
    else
        this.publicToNextId[t] = 1; this.internalToPublic[e] = t, this.publicToInternal[t] = e; }
}, Tm = class {
    visitTag(e) { let t = this._serializeAttributes(e.attrs); if (e.children.length == 0)
        return `<${e.name}${t}/>`; let s = e.children.map(r => r.visit(this)); return `<${e.name}${t}>${s.join("")}</${e.name}>`; }
    visitText(e) { return e.value; }
    visitDeclaration(e) { return `<?xml${this._serializeAttributes(e.attrs)} ?>`; }
    _serializeAttributes(e) { let t = Object.keys(e).map(s => `${s}="${e[s]}"`).join(" "); return t.length > 0 ? " " + t : ""; }
    visitDoctype(e) {
        return `<!DOCTYPE ${e.rootTag} [
${e.dtd}
]>`;
    }
}, Im = new Tm;
function Qc(n) { return n.map(e => e.visit(Im)).join(""); }
var pi = class {
    attrs = {};
    constructor(e) { Object.keys(e).forEach(t => { this.attrs[t] = wa(e[t]); }); }
    visit(e) { return e.visitDeclaration(this); }
}, Al = class {
    rootTag;
    dtd;
    constructor(e, t) { this.rootTag = e, this.dtd = t; }
    visit(e) { return e.visitDoctype(this); }
}, $ = class {
    name;
    children;
    attrs = {};
    constructor(e, t = {}, s = []) { this.name = e, this.children = s, Object.keys(t).forEach(r => { this.attrs[r] = wa(t[r]); }); }
    visit(e) { return e.visitTag(this); }
}, Q = class {
    value;
    constructor(e) { this.value = wa(e); }
    visit(e) { return e.visitText(this); }
}, G = class extends Q {
    constructor(e = 0) {
        super(`
${new Array(e + 1).join(" ")}`);
    }
}, Nm = [[/&/g, "&amp;"], [/"/g, "&quot;"], [/'/g, "&apos;"], [/</g, "&lt;"], [/>/g, "&gt;"]];
function wa(n) { return Nm.reduce((e, t) => e.replace(t[0], t[1]), n); }
var Dm = "angular", Iu = "messagebundle", Pm = "msg", Un = "ph", Hn = "ex", Lm = "source", Bm = `<!ELEMENT messagebundle (msg)*>
<!ATTLIST messagebundle class CDATA #IMPLIED>

<!ELEMENT msg (#PCDATA|ph|source)*>
<!ATTLIST msg id CDATA #IMPLIED>
<!ATTLIST msg seq CDATA #IMPLIED>
<!ATTLIST msg name CDATA #IMPLIED>
<!ATTLIST msg desc CDATA #IMPLIED>
<!ATTLIST msg meaning CDATA #IMPLIED>
<!ATTLIST msg obsolete (obsolete) #IMPLIED>
<!ATTLIST msg xml:space (default|preserve) "default">
<!ATTLIST msg is_hidden CDATA #IMPLIED>

<!ELEMENT source (#PCDATA)>

<!ELEMENT ph (#PCDATA|ex)*>
<!ATTLIST ph name CDATA #REQUIRED>

<!ELEMENT ex (#PCDATA)>`, kl = class extends Zs {
    write(e, t) { let s = new _l, r = new Mm, i = new $(Iu); return i.attrs.handler = Dm, e.forEach(o => { let a = { id: o.id }; o.description && (a.desc = o.description), o.meaning && (a.meaning = o.meaning); let l = []; o.sources.forEach(c => { l.push(new $(Lm, {}, [new Q(`${c.filePath}:${c.startLine}${c.endLine !== c.startLine ? "," + c.endLine : ""}`)])); }), i.children.push(new G(2), new $(Pm, a, [...l, ...r.serialize(o.nodes)])); }), i.children.push(new G), Qc([new pi({ version: "1.0", encoding: "UTF-8" }), new G, new Al(Iu, Bm), new G, s.addDefaultExamples(i), new G]); }
    load(e, t) { throw new Error("Unsupported"); }
    digest(e) { return qp(e); }
    createNameMapper(e) { return new No(e, Zc); }
}, Mm = class {
    visitText(e, t) { return [new Q(e.value)]; }
    visitContainer(e, t) { let s = []; return e.children.forEach(r => s.push(...r.visit(this))), s; }
    visitIcu(e, t) { let s = [new Q(`{${e.expressionPlaceholder}, ${e.type}, `)]; return Object.keys(e.cases).forEach(r => { s.push(new Q(`${r} {`), ...e.cases[r].visit(this), new Q("} ")); }), s.push(new Q("}")), s; }
    visitTagPlaceholder(e, t) { let s = new Q(`<${e.tag}>`), r = new $(Hn, {}, [s]), i = new $(Un, { name: e.startName }, [r, s]); if (e.isVoid)
        return [i]; let o = new Q(`</${e.tag}>`), a = new $(Hn, {}, [o]), l = new $(Un, { name: e.closeName }, [a, o]); return [i, ...this.serialize(e.children), l]; }
    visitPlaceholder(e, t) { let s = new Q(`{{${e.value}}}`), r = new $(Hn, {}, [s]); return [new $(Un, { name: e.name }, [r, s])]; }
    visitBlockPlaceholder(e, t) { let s = new Q(`@${e.name}`), r = new $(Hn, {}, [s]), i = new $(Un, { name: e.startName }, [r, s]), o = new Q("}"), a = new $(Hn, {}, [o]), l = new $(Un, { name: e.closeName }, [a, o]); return [i, ...this.serialize(e.children), l]; }
    visitIcuPlaceholder(e, t) { let s = e.value.expression, r = e.value.type, i = Object.keys(e.value.cases).map(l => l + " {...}").join(" "), o = new Q(`{${s}, ${r}, ${i}}`), a = new $(Hn, {}, [o]); return [new $(Un, { name: e.name }, [a, o])]; }
    serialize(e) { return [].concat(...e.map(t => t.visit(this))); }
};
function qp(n) { return Wc(n); }
var _l = class {
    addDefaultExamples(e) { return e.visit(this), e; }
    visitTag(e) { if (e.name === Un) {
        if (!e.children || e.children.length == 0) {
            let t = new Q(e.attrs.name || "...");
            e.children = [new $(Hn, {}, [t])];
        }
    }
    else
        e.children && e.children.forEach(t => t.visit(this)); }
    visitText(e) { }
    visitDeclaration(e) { }
    visitDoctype(e) { }
};
function Zc(n) { return n.toUpperCase().replace(/[^A-Z0-9_]/g, "_"); }
var Up = "i18n", bl = "i18n-", Rm = "VAR_";
function Hp(n) { return n === Up || n.startsWith(bl); }
function Fm(n) { return n.attrs.some(e => Hp(e.name)); }
function Wp(n) { return n.nodes[0]; }
function Jc(n = {}, e) { let t = {}; return n && Object.keys(n).length && Object.keys(n).forEach(s => t[Oi(s, e)] = n[s]), t; }
function Oi(n, e = !0) { let t = Zc(n); if (!e)
    return t; let s = t.split("_"); if (s.length === 1)
    return n.toLowerCase(); let r; /^\d+$/.test(s[s.length - 1]) && (r = s.pop()); let i = s.shift().toLowerCase(); return s.length && (i += s.map(o => o.charAt(0).toUpperCase() + o.slice(1).toLowerCase()).join("")), r ? `${i}_${r}` : i; }
var Kc = /[-.]/, eu = "_t", it = "ctx", or = "rf";
function jp(n, e) { let t = null; return () => (t || (n(new he(eu, void 0, re)), t = D(e)), t); }
function Ve(n) { return Array.isArray(n) ? q(n.map(Ve)) : d(n, gt); }
function Tl(n, e) { let t = Object.getOwnPropertyNames(n); return t.length === 0 ? null : ye(t.map(s => { let r = n[s], i, o, a, l; if (typeof r == "string")
    i = s, a = s, o = r, l = Ve(o);
else {
    a = s, i = r.classPropertyName, o = r.bindingPropertyName;
    let c = o !== i, h = r.transformFunction !== null, p = Ns.None;
    if (r.isSignal && (p |= Ns.SignalBased), h && (p |= Ns.HasDecoratorInputTransform), e && (c || h || p !== Ns.None)) {
        let m = [d(p), Ve(o)];
        (c || h) && (m.push(Ve(i)), h && m.push(r.transformFunction)), l = q(m);
    }
    else
        l = Ve(o);
} return { key: a, quoted: Kc.test(a), value: l }; })); }
var ae = class {
    values = [];
    set(e, t) { if (t) {
        let s = this.values.find(r => r.key === e);
        s ? s.value = t : this.values.push({ key: e, value: t, quoted: !1 });
    } }
    toLiteralMap() { return ye(this.values); }
};
function $m(n) { let e = n instanceof Ht ? n.name : "ng-template", t = Om(n), s = new is, r = It(e)[1]; return s.setElement(r), Object.getOwnPropertyNames(t).forEach(i => { let o = It(i)[1], a = t[i]; s.addAttribute(o, a), i.toLowerCase() === "class" && a.trim().split(/\s+/).forEach(c => s.addClassName(c)); }), s; }
function Om(n) { let e = {}; return n instanceof st && n.tagName !== "ng-template" ? n.templateAttrs.forEach(t => e[t.name] = "") : (n.attributes.forEach(t => { Hp(t.name) || (e[t.name] = t.value); }), n.inputs.forEach(t => { (t.type === X.Property || t.type === X.TwoWay) && (e[t.name] = ""); }), n.outputs.forEach(t => { e[t.name] = ""; })), e; }
function Nu(n, e) { let t = null, s = { name: n.name, type: n.type, typeArgumentCount: n.typeArgumentCount, deps: [], target: Lt.Injectable }; if (n.useClass !== void 0) {
    let a = n.useClass.expression.isEquivalent(n.type.value), l;
    n.deps !== void 0 && (l = n.deps), l !== void 0 ? t = jn(pe(S({}, s), { delegate: n.useClass.expression, delegateDeps: l, delegateType: fo.Class })) : a ? t = jn(s) : t = { statements: [], expression: Du(n.type.value, n.useClass.expression, e) };
}
else
    n.useFactory !== void 0 ? n.deps !== void 0 ? t = jn(pe(S({}, s), { delegate: n.useFactory, delegateDeps: n.deps || [], delegateType: fo.Function })) : t = { statements: [], expression: ie([], n.useFactory.callFn([])) } : n.useValue !== void 0 ? t = jn(pe(S({}, s), { expression: n.useValue.expression })) : n.useExisting !== void 0 ? t = jn(pe(S({}, s), { expression: y(f.inject).callFn([n.useExisting.expression]) })) : t = { statements: [], expression: Du(n.type.value, n.type.value, e) }; let r = n.type.value, i = new ae; return i.set("token", r), i.set("factory", t.expression), n.providedIn.expression.value !== null && i.set("providedIn", Ds(n.providedIn)), { expression: y(f.\u0275\u0275defineInjectable).callFn([i.toLiteralMap()], void 0, !0), type: zp(n), statements: t.statements }; }
function zp(n) { return new nt(y(f.InjectableDeclaration, [ga(n.type.type, n.typeArgumentCount)])); }
function Du(n, e, t) { if (n.node === e.node)
    return e.prop("\u0275fac"); if (!t)
    return Pu(e); let s = y(f.resolveForwardRef).callFn([e]); return Pu(s); }
function Pu(n) { let e = new Z("__ngFactoryType__", re); return ie([e], n.prop("\u0275fac").callFn([D(e.name)])); }
var _e = 0, Vm = 8, tu = 9, es = 10, Gp = 11, Xp = 12, nu = 13, Yp = 32, Il = 33, fi = 34, Qp = 35, Ea = 36, qm = 37, Do = 38, di = 39, $e = 40, ge = 41, Lu = 42, Zp = 43, De = 44, Po = 45, Wn = 46, lt = 47, Rt = 58, je = 59, Fs = 60, Ce = 61, Ke = 62, Bu = 63, su = 48, Um = 55, Jp = 57, $n = 65, Hm = 69, Wm = 70, jm = 88, ar = 90, Ot = 91, ts = 92, Zt = 93, zm = 94, On = 95, ds = 97, Gm = 98, Xm = 101, ru = 102, Kp = 110, ef = 114, tf = 116, nf = 117, sf = 118, rf = 120, Vi = 122, ht = 123, Mu = 124, Re = 125, of = 160, ys = 64, Nl = 96;
function mi(n) { return n >= tu && n <= Yp || n == of; }
function ct(n) { return su <= n && n <= Jp; }
function Nn(n) { return n >= ds && n <= Vi || n >= $n && n <= ar; }
function Ym(n) { return n >= ds && n <= ru || n >= $n && n <= Wm || ct(n); }
function Lo(n) { return n === es || n === nu; }
function Ru(n) { return su <= n && n <= Um; }
function Ir(n) { return n === di || n === fi || n === Nl; }
var ms = class n {
    file;
    offset;
    line;
    col;
    constructor(e, t, s, r) { this.file = e, this.offset = t, this.line = s, this.col = r; }
    toString() { return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url; }
    moveBy(e) { let t = this.file.content, s = t.length, r = this.offset, i = this.line, o = this.col; for (; r > 0 && e < 0;)
        if (r--, e++, t.charCodeAt(r) == es) {
            i--;
            let l = t.substring(0, r - 1).lastIndexOf(String.fromCharCode(es));
            o = l > 0 ? r - l : r;
        }
        else
            o--; for (; r < s && e > 0;) {
        let a = t.charCodeAt(r);
        r++, e--, a == es ? (i++, o = 0) : o++;
    } return new n(this.file, r, i, o); }
    getContext(e, t) {
        let s = this.file.content, r = this.offset;
        if (r != null) {
            r > s.length - 1 && (r = s.length - 1);
            let i = r, o = 0, a = 0;
            for (; o < e && r > 0 && (r--, o++, !(s[r] == `
` && ++a == t));)
                ;
            for (o = 0, a = 0; o < e && i < s.length - 1 && (i++, o++, !(s[i] == `
` && ++a == t));)
                ;
            return { before: s.substring(r, this.offset), after: s.substring(this.offset, i + 1) };
        }
        return null;
    }
}, gi = class {
    content;
    url;
    constructor(e, t) { this.content = e, this.url = t; }
}, B = class {
    start;
    end;
    fullStart;
    details;
    constructor(e, t, s = e, r = null) { this.start = e, this.end = t, this.fullStart = s, this.details = r; }
    toString() { return this.start.file.content.substring(this.start.offset, this.end.offset); }
}, vn = (function (n) { return n[n.WARNING = 0] = "WARNING", n[n.ERROR = 1] = "ERROR", n; })(vn || {}), N = class extends Error {
    span;
    msg;
    level;
    relatedError;
    constructor(e, t, s = vn.ERROR, r) { super(t), this.span = e, this.msg = t, this.level = s, this.relatedError = r, Object.setPrototypeOf(this, new.target.prototype); }
    contextualMessage() { let e = this.span.start.getContext(100, 3); return e ? `${this.msg} ("${e.before}[${vn[this.level]} ->]${e.after}")` : this.msg; }
    toString() { let e = this.span.details ? `, ${this.span.details}` : ""; return `${this.contextualMessage()}: ${this.span.start}${e}`; }
};
function Qm(n, e, t) { let s = `in ${n} ${e} in ${t}`, r = new gi("", s); return new B(new ms(r, -1, -1, -1), new ms(r, -1, -1, -1)); }
var Zm = 0;
function Jm(n) { if (!n || !n.reference)
    return null; let e = n.reference; if (e.__anonymousType)
    return e.__anonymousType; if (e.__forward_ref__)
    return "__forward_ref__"; let t = Mp(e); return t.indexOf("(") >= 0 ? (t = `anonymous_${Zm++}`, e.__anonymousType = t) : t = zn(t), t; }
function zn(n) { return n.replace(/\W/g, "_"); }
var Fu = '(this&&this.__makeTemplateObject||function(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e})', Dl = class extends al {
    constructor() { super(!1); }
    visitWrappedNodeExpr(e, t) { throw new Error("Cannot emit a WrappedNodeExpr in Javascript."); }
    visitDeclareVarStmt(e, t) { return t.print(e, `var ${e.name}`), e.value && (t.print(e, " = "), e.value.visitExpression(this, t)), t.println(e, ";"), null; }
    visitTaggedTemplateLiteralExpr(e, t) { let s = e.template.elements; return e.tag.visitExpression(this, t), t.print(e, `(${Fu}(`), t.print(e, `[${s.map(r => Xn(r.text, !1)).join(", ")}], `), t.print(e, `[${s.map(r => Xn(r.rawText, !1)).join(", ")}])`), e.template.expressions.forEach(r => { t.print(e, ", "), r.visitExpression(this, t); }), t.print(e, ")"), null; }
    visitTemplateLiteralExpr(e, t) { t.print(e, "`"); for (let s = 0; s < e.elements.length; s++) {
        e.elements[s].visitExpression(this, t);
        let r = s < e.expressions.length ? e.expressions[s] : null;
        r !== null && (t.print(r, "${"), r.visitExpression(this, t), t.print(r, "}"));
    } t.print(e, "`"); }
    visitTemplateLiteralElementExpr(e, t) { return t.print(e, e.rawText), null; }
    visitFunctionExpr(e, t) { return t.print(e, `function${e.name ? " " + e.name : ""}(`), this._visitParams(e.params, t), t.println(e, ") {"), t.incIndent(), this.visitAllStatements(e.statements, t), t.decIndent(), t.print(e, "}"), null; }
    visitArrowFunctionExpr(e, t) { if (t.print(e, "("), this._visitParams(e.params, t), t.print(e, ") =>"), Array.isArray(e.body))
        t.println(e, "{"), t.incIndent(), this.visitAllStatements(e.body, t), t.decIndent(), t.print(e, "}");
    else {
        let s = e.body instanceof Et;
        s && t.print(e, "("), e.body.visitExpression(this, t), s && t.print(e, ")");
    } return null; }
    visitDeclareFunctionStmt(e, t) { return t.print(e, `function ${e.name}(`), this._visitParams(e.params, t), t.println(e, ") {"), t.incIndent(), this.visitAllStatements(e.statements, t), t.decIndent(), t.println(e, "}"), null; }
    visitLocalizedString(e, t) { t.print(e, `$localize(${Fu}(`); let s = [e.serializeI18nHead()]; for (let r = 1; r < e.messageParts.length; r++)
        s.push(e.serializeI18nTemplatePart(r)); return t.print(e, `[${s.map(r => Xn(r.cooked, !1)).join(", ")}], `), t.print(e, `[${s.map(r => Xn(r.raw, !1)).join(", ")}])`), e.expressions.forEach(r => { t.print(e, ", "), r.visitExpression(this, t); }), t.print(e, ")"), null; }
    _visitParams(e, t) { this.visitAllObjects(s => t.print(null, s.name), e, t, ","); }
}, Hi;
function Km() { if (Hi === void 0) {
    let n = to.trustedTypes;
    if (Hi = null, n)
        try {
            Hi = n.createPolicy("angular#unsafe-jit", { createScript: e => e });
        }
        catch { }
} return Hi; }
function eg(n) { return Km()?.createScript(n) || n; }
function $u(...n) {
    if (!to.trustedTypes)
        return new Function(...n);
    let e = n.slice(0, -1).join(","), t = n[n.length - 1], s = `(function anonymous(${e}
) { ${t}
})`, r = to.eval(eg(s));
    return r.bind === void 0 ? new Function(...n) : (r.toString = () => s, r.bind(to));
}
var Pl = class {
    evaluateStatements(e, t, s, r) { let i = new Ll(s), o = ol.createRoot(); return t.length > 0 && !tg(t[0]) && (t = [d("use strict").toStmt(), ...t]), i.visitAllStatements(t, o), i.createReturnStmt(o), this.evaluateCode(e, o, i.getArgs(), r); }
    evaluateCode(e, t, s, r) {
        let i = `"use strict";${t.toSource()}
//# sourceURL=${e}`, o = [], a = [];
        for (let c in s)
            a.push(s[c]), o.push(c);
        if (r) {
            let c = $u(...o.concat("return null;")).toString(), h = c.slice(0, c.indexOf("return null;")).split(`
`).length - 1;
            i += `
${t.toSourceMapGenerator(e, h).toJsComment()}`;
        }
        let l = $u(...o.concat(i));
        return this.executeFunction(l, a);
    }
    executeFunction(e, t) { return e(...t); }
}, Ll = class extends Dl {
    refResolver;
    _evalArgNames = [];
    _evalArgValues = [];
    _evalExportedVars = [];
    constructor(e) { super(), this.refResolver = e; }
    createReturnStmt(e) { new me(new Et(this._evalExportedVars.map(s => new cs(s, D(s), !1)))).visitStatement(this, e); }
    getArgs() { let e = {}; for (let t = 0; t < this._evalArgNames.length; t++)
        e[this._evalArgNames[t]] = this._evalArgValues[t]; return e; }
    visitExternalExpr(e, t) { return this._emitReferenceToExternal(e, this.refResolver.resolveExternalReference(e.value), t), null; }
    visitWrappedNodeExpr(e, t) { return this._emitReferenceToExternal(e, e.node, t), null; }
    visitDeclareVarStmt(e, t) { return e.hasModifier(ue.Exported) && this._evalExportedVars.push(e.name), super.visitDeclareVarStmt(e, t); }
    visitDeclareFunctionStmt(e, t) { return e.hasModifier(ue.Exported) && this._evalExportedVars.push(e.name), super.visitDeclareFunctionStmt(e, t); }
    _emitReferenceToExternal(e, t, s) { let r = this._evalArgValues.indexOf(t); if (r === -1) {
        r = this._evalArgValues.length, this._evalArgValues.push(t);
        let i = Jm({ reference: t }) || "val";
        this._evalArgNames.push(`jit_${i}_${r}`);
    } s.print(e, this._evalArgNames[r]); }
};
function tg(n) { return n.isEquivalent(d("use strict").toStmt()); }
function Ou(n) { let e = new ae; n.providers !== null && e.set("providers", n.providers), n.imports.length > 0 && e.set("imports", q(n.imports)); let t = y(f.defineInjector).callFn([e.toLiteralMap()], void 0, !0), s = af(n); return { expression: t, type: s, statements: [] }; }
function af(n) { return new nt(y(f.InjectorDeclaration, [new nt(n.type.type)])); }
var Bl = class {
    context;
    constructor(e) { this.context = e; }
    resolveExternalReference(e) { if (e.moduleName !== "@angular/core")
        throw new Error(`Cannot resolve external reference to ${e.moduleName}, only references to @angular/core are supported.`); if (!this.context.hasOwnProperty(e.name))
        throw new Error(`No value provided for @angular/core symbol '${e.name}'.`); return this.context[e.name]; }
}, Bo = (function (n) { return n[n.Inline = 0] = "Inline", n[n.SideEffect = 1] = "SideEffect", n[n.Omit = 2] = "Omit", n; })(Bo || {}), Jt = (function (n) { return n[n.Global = 0] = "Global", n[n.Local = 1] = "Local", n; })(Jt || {});
function ng(n) { let e = [], t = new ae; if (t.set("type", n.type.value), n.kind === Jt.Global && n.bootstrap.length > 0 && t.set("bootstrap", At(n.bootstrap, n.containsForwardDecls)), n.selectorScopeMode === Bo.Inline)
    n.declarations.length > 0 && t.set("declarations", At(n.declarations, n.containsForwardDecls)), n.imports.length > 0 && t.set("imports", At(n.imports, n.containsForwardDecls)), n.exports.length > 0 && t.set("exports", At(n.exports, n.containsForwardDecls));
else if (n.selectorScopeMode === Bo.SideEffect) {
    let i = rg(n);
    i !== null && e.push(i);
} n.schemas !== null && n.schemas.length > 0 && t.set("schemas", q(n.schemas.map(i => i.value))), n.id !== null && (t.set("id", n.id), e.push(y(f.registerNgModuleType).callFn([n.type.value, n.id]).toStmt())); let s = y(f.defineNgModule).callFn([t.toLiteralMap()], void 0, !0), r = lf(n); return { expression: s, type: r, statements: e }; }
function sg(n) { let e = new ae; return e.set("type", new W(n.type)), n.bootstrap !== void 0 && e.set("bootstrap", new W(n.bootstrap)), n.declarations !== void 0 && e.set("declarations", new W(n.declarations)), n.imports !== void 0 && e.set("imports", new W(n.imports)), n.exports !== void 0 && e.set("exports", new W(n.exports)), n.schemas !== void 0 && e.set("schemas", new W(n.schemas)), n.id !== void 0 && e.set("id", new W(n.id)), y(f.defineNgModule).callFn([e.toLiteralMap()]); }
function lf(n) { if (n.kind === Jt.Local)
    return new nt(n.type.value); let { type: e, declarations: t, exports: s, imports: r, includeImportTypes: i, publicDeclarationTypes: o } = n; return new nt(y(f.NgModuleDeclaration, [new nt(e.type), o === null ? ka(t) : ig(o), i ? ka(r) : _t, ka(s)])); }
function rg(n) { let e = new ae; if (n.kind === Jt.Global ? n.declarations.length > 0 && e.set("declarations", At(n.declarations, n.containsForwardDecls)) : n.declarationsExpression && e.set("declarations", n.declarationsExpression), n.kind === Jt.Global ? n.imports.length > 0 && e.set("imports", At(n.imports, n.containsForwardDecls)) : n.importsExpression && e.set("imports", n.importsExpression), n.kind === Jt.Global ? n.exports.length > 0 && e.set("exports", At(n.exports, n.containsForwardDecls)) : n.exportsExpression && e.set("exports", n.exportsExpression), n.kind === Jt.Local && n.bootstrapExpression && e.set("bootstrap", n.bootstrapExpression), Object.keys(e.values).length === 0)
    return null; let t = new Ue(y(f.setNgModuleScope), [n.type.value, e.toLiteralMap()]), s = Em(t), r = new en([], [s.toStmt()]); return new Ue(r, []).toStmt(); }
function ka(n) { let e = n.map(t => ir(t.type)); return n.length > 0 ? Se(q(e)) : _t; }
function ig(n) { let e = n.map(t => ir(t)); return n.length > 0 ? Se(q(e)) : _t; }
function Vu(n) { let e = []; e.push({ key: "name", value: d(n.pipeName ?? n.name), quoted: !1 }), e.push({ key: "type", value: n.type.value, quoted: !1 }), e.push({ key: "pure", value: d(n.pure), quoted: !1 }), n.isStandalone === !1 && e.push({ key: "standalone", value: d(!1), quoted: !1 }); let t = y(f.definePipe).callFn([ye(e)], void 0, !0), s = cf(n); return { expression: t, type: s, statements: [] }; }
function cf(n) { return new nt(y(f.PipeDeclaration, [ga(n.type.type, n.typeArgumentCount), new nt(new xe(n.pipeName)), new nt(new xe(n.isStandalone))])); }
var tn = (function (n) { return n[n.Directive = 0] = "Directive", n[n.Pipe = 1] = "Pipe", n[n.NgModule = 2] = "NgModule", n; })(tn || {}), og = new Set(["inherit", "initial", "revert", "unset", "alternate", "alternate-reverse", "normal", "reverse", "backwards", "both", "forwards", "none", "paused", "running", "ease", "ease-in", "ease-in-out", "ease-out", "linear", "step-start", "step-end", "end", "jump-both", "jump-end", "jump-none", "jump-start", "start"]), ag = ["@media", "@supports", "@document", "@layer", "@container", "@scope", "@starting-style"], Mo = class {
    shimCssText(e, t, s = "") { let r = []; e = e.replace(Cg, a => { if (a.match(Ag))
        r.push(a);
    else {
        let l = a.match(yg);
        r.push(l?.join("") ?? "");
    } return ou; }), e = this._insertDirectives(e); let i = this._scopeCssText(e, t, s), o = 0; return i.replace(kg, () => r[o++]); }
    _insertDirectives(e) { return e = this._insertPolyfillDirectivesInCssText(e), this._insertPolyfillRulesInCssText(e); }
    _scopeKeyframesRelatedCss(e, t) { let s = new Set, r = Wi(e, i => this._scopeLocalKeyframeDeclarations(i, t, s)); return Wi(r, i => this._scopeAnimationRule(i, t, s)); }
    _scopeLocalKeyframeDeclarations(e, t, s) { return pe(S({}, e), { selector: e.selector.replace(/(^@(?:-webkit-)?keyframes(?:\s+))(['"]?)(.+)\2(\s*)$/, (r, i, o, a, l) => (s.add(Hu(a, o)), `${i}${o}${t}_${a}${o}${l}`)) }); }
    _scopeAnimationKeyframe(e, t, s) { return e.replace(/^(\s*)(['"]?)(.+?)\2(\s*)$/, (r, i, o, a, l) => (a = `${s.has(Hu(a, o)) ? t + "_" : ""}${a}`, `${i}${o}${a}${o}${l}`)); }
    _animationDeclarationKeyframesRe = /(^|\s+|,)(?:(?:(['"])((?:\\\\|\\\2|(?!\2).)+)\2)|(-?[A-Za-z][\w\-]*))(?=[,\s]|$)/g;
    _scopeAnimationRule(e, t, s) { let r = e.content.replace(/((?:^|\s+|;)(?:-webkit-)?animation\s*:\s*),*([^;]+)/g, (i, o, a) => o + a.replace(this._animationDeclarationKeyframesRe, (l, c, h = "", p, m) => p ? `${c}${this._scopeAnimationKeyframe(`${h}${p}${h}`, t, s)}` : og.has(m) ? l : `${c}${this._scopeAnimationKeyframe(m, t, s)}`)); return r = r.replace(/((?:^|\s+|;)(?:-webkit-)?animation-name(?:\s*):(?:\s*))([^;]+)/g, (i, o, a) => `${o}${a.split(",").map(l => this._scopeAnimationKeyframe(l, t, s)).join(",")}`), pe(S({}, e), { content: r }); }
    _insertPolyfillDirectivesInCssText(e) { return e.replace(cg, function (...t) { return t[2] + "{"; }); }
    _insertPolyfillRulesInCssText(e) { return e.replace(ug, (...t) => { let s = t[0].replace(t[1], "").replace(t[2], ""); return t[4] + s; }); }
    _scopeCssText(e, t, s) {
        let r = this._extractUnscopedRulesFromCssText(e);
        return e = this._insertPolyfillHostInCssText(e), e = this._convertColonHost(e), e = this._convertColonHostContext(e), e = this._convertShadowDOMSelectors(e), t && (e = this._scopeKeyframesRelatedCss(e, t), e = this._scopeSelectors(e, t, s)), e = e + `
` + r, e.trim();
    }
    _extractUnscopedRulesFromCssText(e) {
        let t = "", s;
        for (qu.lastIndex = 0; (s = qu.exec(e)) !== null;) {
            let r = s[0].replace(s[2], "").replace(s[1], s[4]);
            t += r + `

`;
        }
        return t;
    }
    _convertColonHost(e) { return e.replace(dg, (t, s, r) => { if (s) {
        let i = [];
        for (let o of this._splitOnTopLevelCommas(s, !0)) {
            let a = o.trim();
            if (!a)
                break;
            let l = dn + a.replace(Ro, "") + r;
            i.push(l);
        }
        return i.join(",");
    }
    else
        return dn + r; }); }
    *_splitOnTopLevelCommas(e, t) { let s = e.length, r = 0, i = 0; for (let o = 0; o < s; o++) {
        let a = e.charCodeAt(o);
        if (a === $e)
            r++;
        else if (a === ge) {
            if (r--, r < 0 && t) {
                yield e.slice(i, o);
                return;
            }
        }
        else
            a === De && r === 0 && (yield e.slice(i, o), i = o + 1);
    } yield e.slice(i); }
    _convertColonHostContext(e) { let t = []; for (let s of this._splitOnTopLevelCommas(e, !1))
        t.push(this._convertColonHostContextInSelectorPart(s)); return t.join(","); }
    _convertColonHostContextInSelectorPart(e) { return e.replace(gg, (t, s) => { let r = [[]], i = t.indexOf(Ts); for (; i !== -1;) {
        let o = t.substring(i + Ts.length);
        if (!o || o[0] !== "(") {
            t = o, i = t.indexOf(Ts);
            continue;
        }
        let a = [], l = 0;
        for (let h of this._splitOnTopLevelCommas(o.substring(1), !0)) {
            l = l + h.length + 1;
            let p = h.trim();
            p && a.push(p);
        }
        let c = r.length;
        Rg(r, a.length);
        for (let h = 0; h < a.length; h++)
            for (let p = 0; p < c; p++)
                r[p + h * c].push(a[h]);
        t = o.substring(l + 1), i = t.indexOf(Ts);
    } return r.map(o => Mg(o, t, s)).join(", "); }); }
    _convertShadowDOMSelectors(e) { return wg.reduce((t, s) => t.replace(s, " "), e); }
    _scopeSelectors(e, t, s) { return Wi(e, r => { let i = r.selector, o = r.content; return r.selector[0] !== "@" ? i = this._scopeSelector({ selector: i, scopeSelector: t, hostSelector: s, isParentSelector: !0 }) : ag.some(a => r.selector.startsWith(a)) ? o = this._scopeSelectors(r.content, t, s) : (r.selector.startsWith("@font-face") || r.selector.startsWith("@page")) && (o = this._stripScopingSelectors(r.content)), new vi(i, o); }); }
    _stripScopingSelectors(e) { return Wi(e, t => { let s = t.selector.replace(Uu, " ").replace(_a, " "); return new vi(s, t.content); }); }
    _safeSelector;
    _shouldScopeIndicator;
    _scopeSelector({ selector: e, scopeSelector: t, hostSelector: s, isParentSelector: r = !1 }) { let i = / ?,(?!(?:[^)(]*(?:\([^)(]*(?:\([^)(]*(?:\([^)(]*\)[^)(]*)*\)[^)(]*)*\)[^)(]*)*\))) ?/; return e.split(i).map(o => o.split(Uu)).map(o => { let [a, ...l] = o; return [(h => this._selectorNeedsScoping(h, t) ? this._applySelectorScope({ selector: h, scopeSelector: t, hostSelector: s, isParentSelector: r }) : h)(a), ...l].join(" "); }).join(", "); }
    _selectorNeedsScoping(e, t) { return !this._makeScopeMatcher(t).test(e); }
    _makeScopeMatcher(e) { let t = /\[/g, s = /\]/g; return e = e.replace(t, "\\[").replace(s, "\\]"), new RegExp("^(" + e + ")" + Eg, "m"); }
    _applySimpleSelectorScope(e, t, s) { if (Ls.lastIndex = 0, Ls.test(e)) {
        let r = `[${s}]`, i = e;
        for (; i.match(_a);)
            i = i.replace(_a, (o, a) => a.replace(/([^:\)]*)(:*)(.*)/, (l, c, h, p) => c + r + h + p));
        return i.replace(Ls, r);
    } return t + " " + e; }
    _applySelectorScope({ selector: e, scopeSelector: t, hostSelector: s, isParentSelector: r }) { let i = /\[is=([^\]]*)\]/g; t = t.replace(i, (C, ...T) => T[0]); let o = `[${t}]`, a = C => { let T = C.trim(); if (!T)
        return C; if (C.includes(dn)) {
        if (T = this._applySimpleSelectorScope(C, t, s), !C.match(vg)) {
            let [A, R, se, O] = T.match(/([^:]*)(:*)([\s\S]*)/);
            T = R + o + se + O;
        }
    }
    else {
        let A = C.replace(Ls, "");
        if (A.length > 0) {
            let R = A.match(/([^:]*)(:*)([\s\S]*)/);
            R && (T = R[1] + o + R[2] + R[3]);
        }
    } return T; }, l = C => { let T = "", A = [], R; for (; (R = fr.exec(C)) !== null;) {
        let se = 1, O = fr.lastIndex;
        for (; O < C.length;) {
            let xt = C[O];
            if (O++, xt === "(") {
                se++;
                continue;
            }
            if (xt === ")") {
                if (se--, se === 0)
                    break;
                continue;
            }
        }
        A.push(`${R[0]}${C.slice(fr.lastIndex, O)}`), fr.lastIndex = O;
    } return A.join("") === C ? T = A.map(se => { let [O] = se.match(fr) ?? [], xt = se.slice(O?.length, -1); xt.includes(dn) && (this._shouldScopeIndicator = !0); let hr = this._scopeSelector({ selector: xt, scopeSelector: t, hostSelector: s }); return `${O}${hr})`; }).join("") : (this._shouldScopeIndicator = this._shouldScopeIndicator || C.includes(dn), T = this._shouldScopeIndicator ? a(C) : C), T; }; r && (this._safeSelector = new Ml(e), e = this._safeSelector.content()); let c = "", h = 0, p, m = /( |>|\+|~(?!=))(?!([^)(]*(?:\([^)(]*(?:\([^)(]*(?:\([^)(]*\)[^)(]*)*\)[^)(]*)*\)[^)(]*)*\)))\s*/g, v = e.includes(dn); for ((r || this._shouldScopeIndicator) && (this._shouldScopeIndicator = !v); (p = m.exec(e)) !== null;) {
        let C = p[1], T = e.slice(h, p.index);
        if (T.match(/__esc-ph-(\d+)__/) && e[p.index + 1]?.match(/[a-fA-F\d]/))
            continue;
        let A = l(T);
        c += `${A} ${C} `, h = m.lastIndex;
    } let w = e.substring(h); return c += l(w), this._safeSelector.restore(c); }
    _insertPolyfillHostInCssText(e) { return e.replace(xg, Ts).replace(Sg, Ro); }
}, Ml = class {
    placeholders = [];
    index = 0;
    _content;
    constructor(e) { e = this._escapeRegexMatches(e, /(\[[^\]]*\])/g), e = e.replace(/(\\.)/g, (t, s) => { let r = `__esc-ph-${this.index}__`; return this.placeholders.push(s), this.index++, r; }), this._content = e.replace(fg, (t, s, r) => { let i = `__ph-${this.index}__`; return this.placeholders.push(`(${r})`), this.index++, s + i; }); }
    restore(e) { return e.replace(/__(?:ph|esc-ph)-(\d+)__/g, (t, s) => this.placeholders[+s]); }
    content() { return this._content; }
    _escapeRegexMatches(e, t) { return e.replace(t, (s, r) => { let i = `__ph-${this.index}__`; return this.placeholders.push(r), this.index++, i; }); }
}, lg = "(:(where|is)\\()?", fr = /:(where|is)\(/gi, cg = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim, ug = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim, qu = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim, Ro = "-shadowcsshost", Ts = "-shadowcsscontext", Rl = "[^)(]*", hg = String.raw `(?:\(${Rl}\)|${Rl})+?`, pg = String.raw `(?:\(${hg}\)|${Rl})+?`, iu = String.raw `(?:\((${pg})\))`, fg = new RegExp(String.raw `(:nth-[-\w]+)` + iu, "g"), dg = new RegExp(Ro + iu + "?([^,{]*)", "gim"), mg = Ts + iu + "?([^{]*)", gg = new RegExp(`${lg}(${mg})`, "gim"), dn = Ro + "-no-combinator", vg = new RegExp(`${dn}(?![^(]*\\))`, "g"), _a = /-shadowcsshost-no-combinator([^\s,]*)/, wg = [/::shadow/g, /::content/g, /\/shadow-deep\//g, /\/shadow\//g], Uu = /(?:>>>)|(?:\/deep\/)|(?:::ng-deep)/g, Eg = "([>\\s~+[.,{:][\\s\\S]*)?$", Ls = /-shadowcsshost/gim, Sg = /:host/gim, xg = /:host-context/gim, yg = /\r?\n/g, Cg = /\/\*[\s\S]*?\*\//g, Ag = /\/\*\s*#\s*source(Mapping)?URL=/g, ou = "%COMMENT%", kg = new RegExp(ou, "g"), ba = "%BLOCK%", _g = new RegExp(`(\\s*(?:${ou}\\s*)*)([^;\\{\\}]+?)(\\s*)((?:{%BLOCK%}?\\s*;?)|(?:\\s*;))`, "g"), bg = new Map([["{", "}"]]), uf = "%COMMA_IN_PLACEHOLDER%", hf = "%SEMI_IN_PLACEHOLDER%", pf = "%COLON_IN_PLACEHOLDER%", Tg = new RegExp(uf, "g"), Ig = new RegExp(hf, "g"), Ng = new RegExp(pf, "g"), vi = class {
    selector;
    content;
    constructor(e, t) { this.selector = e, this.content = t; }
};
function Wi(n, e) { let t = Lg(n), s = Dg(t, bg, ba), r = 0, i = s.escapedString.replace(_g, (...o) => { let a = o[2], l = "", c = o[4], h = ""; c && c.startsWith("{" + ba) && (l = s.blocks[r++], c = c.substring(ba.length + 1), h = "{"); let p = e(new vi(a, l)); return `${o[1]}${p.selector}${o[3]}${h}${p.content}${c}`; }); return Bg(i); }
var Fl = class {
    escapedString;
    blocks;
    constructor(e, t) { this.escapedString = e, this.blocks = t; }
};
function Dg(n, e, t) { let s = [], r = [], i = 0, o = 0, a = -1, l, c; for (let h = 0; h < n.length; h++) {
    let p = n[h];
    p === "\\" ? h++ : p === c ? (i--, i === 0 && (r.push(n.substring(a, h)), s.push(t), o = h, a = -1, l = c = void 0)) : p === l ? i++ : i === 0 && e.has(p) && (l = p, c = e.get(p), i = 1, a = h + 1, s.push(n.substring(o, a)));
} return a !== -1 ? (r.push(n.substring(a)), s.push(t)) : s.push(n.substring(o)), new Fl(s.join(""), r); }
var Pg = { ";": hf, ",": uf, ":": pf };
function Lg(n) { let e = n, t = null; for (let s = 0; s < e.length; s++) {
    let r = e[s];
    if (r === "\\")
        s++;
    else if (t !== null)
        if (r === t)
            t = null;
        else {
            let i = Pg[r];
            i && (e = `${e.substr(0, s)}${i}${e.substr(s + 1)}`, s += i.length - 1);
        }
    else
        (r === "'" || r === '"') && (t = r);
} return e; }
function Bg(n) { let e = n.replace(Tg, ","); return e = e.replace(Ig, ";"), e = e.replace(Ng, ":"), e; }
function Hu(n, e) { return e ? n.replace(/((?:^|[^\\])(?:\\\\)*)\\(?=['"])/g, "$1") : n; }
function Mg(n, e, t = "") { let s = dn; Ls.lastIndex = 0; let r = Ls.test(e); if (n.length === 0)
    return s + e; let i = [n.pop() || ""]; for (; n.length > 0;) {
    let o = i.length, a = n.pop();
    for (let l = 0; l < o; l++) {
        let c = i[l];
        i[o * 2 + l] = c + " " + a, i[o + l] = a + " " + c, i[l] = a + c;
    }
} return i.map(o => r ? `${t}${o}${e}` : `${t}${o}${s}${e}, ${t}${o} ${s}${e}`).join(","); }
function Rg(n, e) { let t = n.length; for (let s = 1; s < e; s++)
    for (let r = 0; r < t; r++)
        n[r + s * t] = n[r].slice(0); }
var u = (function (n) { return n[n.ListEnd = 0] = "ListEnd", n[n.Statement = 1] = "Statement", n[n.Variable = 2] = "Variable", n[n.ElementStart = 3] = "ElementStart", n[n.Element = 4] = "Element", n[n.Template = 5] = "Template", n[n.ElementEnd = 6] = "ElementEnd", n[n.ContainerStart = 7] = "ContainerStart", n[n.Container = 8] = "Container", n[n.ContainerEnd = 9] = "ContainerEnd", n[n.DisableBindings = 10] = "DisableBindings", n[n.ConditionalCreate = 11] = "ConditionalCreate", n[n.ConditionalBranchCreate = 12] = "ConditionalBranchCreate", n[n.Conditional = 13] = "Conditional", n[n.EnableBindings = 14] = "EnableBindings", n[n.Text = 15] = "Text", n[n.Listener = 16] = "Listener", n[n.InterpolateText = 17] = "InterpolateText", n[n.Binding = 18] = "Binding", n[n.Property = 19] = "Property", n[n.StyleProp = 20] = "StyleProp", n[n.ClassProp = 21] = "ClassProp", n[n.StyleMap = 22] = "StyleMap", n[n.ClassMap = 23] = "ClassMap", n[n.Advance = 24] = "Advance", n[n.Pipe = 25] = "Pipe", n[n.Attribute = 26] = "Attribute", n[n.ExtractedAttribute = 27] = "ExtractedAttribute", n[n.Defer = 28] = "Defer", n[n.DeferOn = 29] = "DeferOn", n[n.DeferWhen = 30] = "DeferWhen", n[n.I18nMessage = 31] = "I18nMessage", n[n.DomProperty = 32] = "DomProperty", n[n.Namespace = 33] = "Namespace", n[n.ProjectionDef = 34] = "ProjectionDef", n[n.Projection = 35] = "Projection", n[n.RepeaterCreate = 36] = "RepeaterCreate", n[n.Repeater = 37] = "Repeater", n[n.TwoWayProperty = 38] = "TwoWayProperty", n[n.TwoWayListener = 39] = "TwoWayListener", n[n.DeclareLet = 40] = "DeclareLet", n[n.StoreLet = 41] = "StoreLet", n[n.I18nStart = 42] = "I18nStart", n[n.I18n = 43] = "I18n", n[n.I18nEnd = 44] = "I18nEnd", n[n.I18nExpression = 45] = "I18nExpression", n[n.I18nApply = 46] = "I18nApply", n[n.IcuStart = 47] = "IcuStart", n[n.IcuEnd = 48] = "IcuEnd", n[n.IcuPlaceholder = 49] = "IcuPlaceholder", n[n.I18nContext = 50] = "I18nContext", n[n.I18nAttributes = 51] = "I18nAttributes", n[n.SourceLocation = 52] = "SourceLocation", n[n.Animation = 53] = "Animation", n[n.AnimationString = 54] = "AnimationString", n[n.AnimationBinding = 55] = "AnimationBinding", n[n.AnimationListener = 56] = "AnimationListener", n[n.Control = 57] = "Control", n[n.ControlCreate = 58] = "ControlCreate", n; })(u || {}), I = (function (n) { return n[n.LexicalRead = 0] = "LexicalRead", n[n.Context = 1] = "Context", n[n.TrackContext = 2] = "TrackContext", n[n.ReadVariable = 3] = "ReadVariable", n[n.NextContext = 4] = "NextContext", n[n.Reference = 5] = "Reference", n[n.StoreLet = 6] = "StoreLet", n[n.ContextLetReference = 7] = "ContextLetReference", n[n.GetCurrentView = 8] = "GetCurrentView", n[n.RestoreView = 9] = "RestoreView", n[n.ResetView = 10] = "ResetView", n[n.PureFunctionExpr = 11] = "PureFunctionExpr", n[n.PureFunctionParameterExpr = 12] = "PureFunctionParameterExpr", n[n.PipeBinding = 13] = "PipeBinding", n[n.PipeBindingVariadic = 14] = "PipeBindingVariadic", n[n.SafePropertyRead = 15] = "SafePropertyRead", n[n.SafeKeyedRead = 16] = "SafeKeyedRead", n[n.SafeInvokeFunction = 17] = "SafeInvokeFunction", n[n.SafeTernaryExpr = 18] = "SafeTernaryExpr", n[n.EmptyExpr = 19] = "EmptyExpr", n[n.AssignTemporaryExpr = 20] = "AssignTemporaryExpr", n[n.ReadTemporaryExpr = 21] = "ReadTemporaryExpr", n[n.SlotLiteralExpr = 22] = "SlotLiteralExpr", n[n.ConditionalCase = 23] = "ConditionalCase", n[n.ConstCollected = 24] = "ConstCollected", n[n.TwoWayBindingSet = 25] = "TwoWayBindingSet", n[n.ArrowFunction = 26] = "ArrowFunction", n; })(I || {}), pt = (function (n) { return n[n.None = 0] = "None", n[n.AlwaysInline = 1] = "AlwaysInline", n; })(pt || {}), be = (function (n) { return n[n.Context = 0] = "Context", n[n.Identifier = 1] = "Identifier", n[n.SavedView = 2] = "SavedView", n[n.Alias = 3] = "Alias", n; })(be || {}), b = (function (n) { return n[n.Attribute = 0] = "Attribute", n[n.ClassName = 1] = "ClassName", n[n.StyleProperty = 2] = "StyleProperty", n[n.Property = 3] = "Property", n[n.Template = 4] = "Template", n[n.I18n = 5] = "I18n", n[n.LegacyAnimation = 6] = "LegacyAnimation", n[n.TwoWayProperty = 7] = "TwoWayProperty", n[n.Animation = 8] = "Animation", n; })(b || {}), wi = (function (n) { return n[n.Creation = 0] = "Creation", n[n.Postproccessing = 1] = "Postproccessing", n; })(wi || {}), lr = (function (n) { return n[n.I18nText = 0] = "I18nText", n[n.I18nAttribute = 1] = "I18nAttribute", n; })(lr || {}), ne = (function (n) { return n[n.None = 0] = "None", n[n.ElementTag = 1] = "ElementTag", n[n.TemplateTag = 2] = "TemplateTag", n[n.OpenTag = 4] = "OpenTag", n[n.CloseTag = 8] = "CloseTag", n[n.ExpressionIndex = 16] = "ExpressionIndex", n; })(ne || {}), Pe = (function (n) { return n[n.HTML = 0] = "HTML", n[n.SVG = 1] = "SVG", n[n.Math = 2] = "Math", n; })(Pe || {}), ee = (function (n) { return n[n.Idle = 0] = "Idle", n[n.Immediate = 1] = "Immediate", n[n.Timer = 2] = "Timer", n[n.Hover = 3] = "Hover", n[n.Interaction = 4] = "Interaction", n[n.Viewport = 5] = "Viewport", n[n.Never = 6] = "Never", n; })(ee || {}), Qn = (function (n) { return n[n.RootI18n = 0] = "RootI18n", n[n.Icu = 1] = "Icu", n[n.Attr = 2] = "Attr", n; })(Qn || {}), Ge = (function (n) { return n[n.NgTemplate = 0] = "NgTemplate", n[n.Structural = 1] = "Structural", n[n.Block = 2] = "Block", n; })(Ge || {}), E = (() => { class n {
    static nextListId = 0;
    debugListId = n.nextListId++;
    head = { kind: u.ListEnd, next: null, prev: null, debugListId: this.debugListId };
    tail = { kind: u.ListEnd, next: null, prev: null, debugListId: this.debugListId };
    constructor() { this.head.next = this.tail, this.tail.prev = this.head; }
    push(t) { if (Array.isArray(t)) {
        for (let r of t)
            this.push(r);
        return;
    } n.assertIsNotEnd(t), n.assertIsUnowned(t), t.debugListId = this.debugListId; let s = this.tail.prev; t.prev = s, s.next = t, t.next = this.tail, this.tail.prev = t; }
    prepend(t) { if (t.length === 0)
        return; for (let i of t)
        n.assertIsNotEnd(i), n.assertIsUnowned(i), i.debugListId = this.debugListId; let s = this.head.next, r = this.head; for (let i of t)
        r.next = i, i.prev = r, r = i; r.next = s, s.prev = r; }
    *[Symbol.iterator]() { let t = this.head.next; for (; t !== this.tail;) {
        n.assertIsOwned(t, this.debugListId);
        let s = t.next;
        yield t, t = s;
    } }
    *reversed() { let t = this.tail.prev; for (; t !== this.head;) {
        n.assertIsOwned(t, this.debugListId);
        let s = t.prev;
        yield t, t = s;
    } }
    static replace(t, s) { n.assertIsNotEnd(t), n.assertIsNotEnd(s), n.assertIsOwned(t), n.assertIsUnowned(s), s.debugListId = t.debugListId, t.prev !== null && (t.prev.next = s, s.prev = t.prev), t.next !== null && (t.next.prev = s, s.next = t.next), t.debugListId = null, t.prev = null, t.next = null; }
    static replaceWithMany(t, s) { if (s.length === 0) {
        n.remove(t);
        return;
    } n.assertIsNotEnd(t), n.assertIsOwned(t); let r = t.debugListId; t.debugListId = null; for (let h of s)
        n.assertIsNotEnd(h), n.assertIsUnowned(h); let { prev: i, next: o } = t; t.prev = null, t.next = null; let a = i; for (let h of s)
        n.assertIsUnowned(h), h.debugListId = r, a.next = h, h.prev = a, h.next = null, a = h; let l = s[0], c = a; i !== null && (i.next = l, l.prev = i), o !== null && (o.prev = c, c.next = o); }
    static remove(t) { n.assertIsNotEnd(t), n.assertIsOwned(t), t.prev.next = t.next, t.next.prev = t.prev, t.debugListId = null, t.prev = null, t.next = null; }
    static insertBefore(t, s) { if (Array.isArray(t)) {
        for (let r of t)
            n.insertBefore(r, s);
        return;
    } if (n.assertIsOwned(s), s.prev === null)
        throw new Error("AssertionError: illegal operation on list start"); n.assertIsNotEnd(t), n.assertIsUnowned(t), t.debugListId = s.debugListId, t.prev = null, s.prev.next = t, t.prev = s.prev, t.next = s, s.prev = t; }
    static insertAfter(t, s) { if (n.assertIsOwned(s), s.next === null)
        throw new Error("AssertionError: illegal operation on list end"); n.assertIsNotEnd(t), n.assertIsUnowned(t), t.debugListId = s.debugListId, s.next.prev = t, t.next = s.next, t.prev = s, s.next = t; }
    static assertIsUnowned(t) { if (t.debugListId !== null)
        throw new Error(`AssertionError: illegal operation on owned node: ${u[t.kind]}`); }
    static assertIsOwned(t, s) { if (t.debugListId === null)
        throw new Error(`AssertionError: illegal operation on unowned node: ${u[t.kind]}`); if (s !== void 0 && t.debugListId !== s)
        throw new Error(`AssertionError: node belongs to the wrong list (expected ${s}, actual ${t.debugListId})`); }
    static assertIsNotEnd(t) { if (t.kind === u.ListEnd)
        throw new Error("AssertionError: illegal operation on list head or tail"); }
} return n; })();
function ot(n) { return S({ kind: u.Statement, statement: n }, M); }
function gn(n, e, t, s) { return S({ kind: u.Variable, xref: n, variable: e, initializer: t, flags: s }, M); }
var M = { debugListId: null, prev: null, next: null }, ff = Symbol("ConsumesSlot"), au = Symbol("DependsOnSlotContext"), Ss = Symbol("ConsumesVars"), qi = Symbol("UsesVarOffset"), St = { [ff]: !0, numSlotsUsed: 1 }, Qe = { [au]: !0 }, Ze = { [Ss]: !0 };
function cr(n) { return n[ff] === !0; }
function Ei(n) { return n[au] === !0; }
function Ta(n) { return n[Ss] === !0; }
function Wu(n) { return n[qi] === !0; }
function Fg(n, e, t) { return S(S(S({ kind: u.InterpolateText, target: n, interpolation: e, sourceSpan: t }, Qe), Ze), M); }
var le = class {
    strings;
    expressions;
    i18nPlaceholders;
    constructor(e, t, s) { if (this.strings = e, this.expressions = t, this.i18nPlaceholders = s, s.length !== 0 && s.length !== t.length)
        throw new Error(`Expected ${t.length} placeholders to match interpolation expression count, but got ${s.length}`); }
};
function gs(n, e, t, s, r, i, o, a, l, c, h) { return S({ kind: u.Binding, bindingKind: e, target: n, name: t, expression: s, unit: r, securityContext: i, isTextAttribute: o, isStructuralTemplateAttribute: a, templateKind: l, i18nContext: null, i18nMessage: c, sourceSpan: h }, M); }
function $g(n, e, t, s, r, i, o, a, l, c) { return S(S(S({ kind: u.Property, target: n, name: e, expression: t, bindingKind: s, securityContext: r, sanitizer: null, isStructuralTemplateAttribute: i, templateKind: o, i18nContext: a, i18nMessage: l, sourceSpan: c }, Qe), Ze), M); }
function Og(n, e, t, s, r, i, o, a, l) { return S(S(S({ kind: u.TwoWayProperty, target: n, name: e, expression: t, securityContext: s, sanitizer: null, isStructuralTemplateAttribute: r, templateKind: i, i18nContext: o, i18nMessage: a, sourceSpan: l }, Qe), Ze), M); }
function Vg(n, e, t, s, r) { return S(S(S({ kind: u.StyleProp, target: n, name: e, expression: t, unit: s, sourceSpan: r }, Qe), Ze), M); }
function qg(n, e, t, s) { return S(S(S({ kind: u.ClassProp, target: n, name: e, expression: t, sourceSpan: s }, Qe), Ze), M); }
function Ug(n, e, t) { return S(S(S({ kind: u.StyleMap, target: n, expression: e, sourceSpan: t }, Qe), Ze), M); }
function Hg(n, e, t) { return S(S(S({ kind: u.ClassMap, target: n, expression: e, sourceSpan: t }, Qe), Ze), M); }
function ju(n, e, t, s, r, i, o, a, l, c) { return S(S(S({ kind: u.Attribute, target: n, namespace: e, name: t, expression: s, securityContext: r, sanitizer: null, isTextAttribute: i, isStructuralTemplateAttribute: o, templateKind: a, i18nContext: null, i18nMessage: l, sourceSpan: c }, Qe), Ze), M); }
function Wg(n, e) { return S({ kind: u.Advance, delta: n, sourceSpan: e }, M); }
function df(n, e, t, s) { return S(S(S({ kind: u.Conditional, target: n, test: e, conditions: t, processed: null, sourceSpan: s, contextValue: null }, M), Qe), Ze); }
function jg(n, e, t, s) { return S(S({ kind: u.Repeater, target: n, targetSlot: e, collection: t, sourceSpan: s }, M), Qe); }
function zu(n, e, t, s, r, i, o) { return S({ kind: u.AnimationBinding, name: n, target: e, animationKind: t, expression: s, i18nMessage: null, securityContext: r, sanitizer: null, sourceSpan: i, animationBindingKind: o }, M); }
function zg(n, e, t, s) { return S(S(S({ kind: u.DeferWhen, target: n, expr: e, modifier: t, sourceSpan: s }, M), Qe), Ze); }
function mf(n, e, t, s, r, i, o, a, l, c, h) { return S(S(S({ kind: u.I18nExpression, context: n, target: e, i18nOwner: t, handle: s, expression: r, icuPlaceholder: i, i18nPlaceholder: o, resolutionTime: a, usage: l, name: c, sourceSpan: h }, M), Ze), Qe); }
function Gg(n, e, t) { return S({ kind: u.I18nApply, owner: n, handle: e, sourceSpan: t }, M); }
function Xg(n, e, t, s) { return S(S(S({ kind: u.StoreLet, target: n, declaredName: e, value: t, sourceSpan: s }, Qe), Ze), M); }
function Yg(n, e) { return S(S({ kind: u.Control, sourceSpan: e, target: n }, Qe), M); }
function Gt(n) { return n instanceof K; }
var K = class extends Y {
    constructor(e = null) { super(null, e); }
}, ke = class n extends K {
    name;
    kind = I.LexicalRead;
    constructor(e) { super(), this.name = e; }
    visitExpression(e, t) { }
    isEquivalent(e) { return this.name === e.name; }
    isConstant() { return !1; }
    transformInternalExpressions() { }
    clone() { return new n(this.name); }
}, Fo = class n extends K {
    target;
    targetSlot;
    offset;
    kind = I.Reference;
    constructor(e, t, s) { super(), this.target = e, this.targetSlot = t, this.offset = s; }
    visitExpression() { }
    isEquivalent(e) { return e instanceof n && e.target === this.target; }
    isConstant() { return !1; }
    transformInternalExpressions() { }
    clone() { return new n(this.target, this.targetSlot, this.offset); }
}, Si = class n extends K {
    target;
    value;
    sourceSpan;
    kind = I.StoreLet;
    [Ss] = !0;
    [au] = !0;
    constructor(e, t, s) { super(), this.target = e, this.value = t, this.sourceSpan = s; }
    visitExpression() { }
    isEquivalent(e) { return e instanceof n && e.target === this.target && e.value.isEquivalent(this.value); }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.value = _(this.value, e, t); }
    clone() { return new n(this.target, this.value, this.sourceSpan); }
}, xi = class n extends K {
    target;
    targetSlot;
    kind = I.ContextLetReference;
    constructor(e, t) { super(), this.target = e, this.targetSlot = t; }
    visitExpression() { }
    isEquivalent(e) { return e instanceof n && e.target === this.target; }
    isConstant() { return !1; }
    transformInternalExpressions() { }
    clone() { return new n(this.target, this.targetSlot); }
}, Dn = class n extends K {
    view;
    kind = I.Context;
    constructor(e) { super(), this.view = e; }
    visitExpression() { }
    isEquivalent(e) { return e instanceof n && e.view === this.view; }
    isConstant() { return !1; }
    transformInternalExpressions() { }
    clone() { return new n(this.view); }
}, $l = class n extends K {
    view;
    kind = I.TrackContext;
    constructor(e) { super(), this.view = e; }
    visitExpression() { }
    isEquivalent(e) { return e instanceof n && e.view === this.view; }
    isConstant() { return !1; }
    transformInternalExpressions() { }
    clone() { return new n(this.view); }
}, $o = class n extends K {
    kind = I.NextContext;
    steps = 1;
    visitExpression() { }
    isEquivalent(e) { return e instanceof n && e.steps === this.steps; }
    isConstant() { return !1; }
    transformInternalExpressions() { }
    clone() { let e = new n; return e.steps = this.steps, e; }
}, Ol = class n extends K {
    kind = I.GetCurrentView;
    constructor() { super(); }
    visitExpression() { }
    isEquivalent(e) { return e instanceof n; }
    isConstant() { return !1; }
    transformInternalExpressions() { }
    clone() { return new n; }
}, yi = class n extends K {
    view;
    kind = I.RestoreView;
    constructor(e) { super(), this.view = e; }
    visitExpression(e, t) { typeof this.view != "number" && this.view.visitExpression(e, t); }
    isEquivalent(e) { return !(e instanceof n) || typeof e.view != typeof this.view ? !1 : typeof this.view == "number" ? this.view === e.view : this.view.isEquivalent(e.view); }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { typeof this.view != "number" && (this.view = _(this.view, e, t)); }
    clone() { return new n(this.view instanceof Y ? this.view.clone() : this.view); }
}, Oo = class n extends K {
    expr;
    kind = I.ResetView;
    constructor(e) { super(), this.expr = e; }
    visitExpression(e, t) { this.expr.visitExpression(e, t); }
    isEquivalent(e) { return e instanceof n && this.expr.isEquivalent(e.expr); }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.expr = _(this.expr, e, t); }
    clone() { return new n(this.expr.clone()); }
}, Vo = class n extends K {
    target;
    value;
    kind = I.TwoWayBindingSet;
    constructor(e, t) { super(), this.target = e, this.value = t; }
    visitExpression(e, t) { this.target.visitExpression(e, t), this.value.visitExpression(e, t); }
    isEquivalent(e) { return this.target.isEquivalent(e.target) && this.value.isEquivalent(e.value); }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.target = _(this.target, e, t), this.value = _(this.value, e, t); }
    clone() { return new n(this.target, this.value); }
}, nn = class n extends K {
    xref;
    kind = I.ReadVariable;
    name = null;
    constructor(e) { super(), this.xref = e; }
    visitExpression() { }
    isEquivalent(e) { return e instanceof n && e.xref === this.xref; }
    isConstant() { return !1; }
    transformInternalExpressions() { }
    clone() { let e = new n(this.xref); return e.name = this.name, e; }
}, vs = class n extends K {
    kind = I.PureFunctionExpr;
    [Ss] = !0;
    [qi] = !0;
    varOffset = null;
    body;
    args;
    fn = null;
    constructor(e, t) { super(), this.body = e, this.args = t; }
    visitExpression(e, t) { this.body?.visitExpression(e, t); for (let s of this.args)
        s.visitExpression(e, t); }
    isEquivalent(e) { return !(e instanceof n) || e.args.length !== this.args.length ? !1 : e.body !== null && this.body !== null && e.body.isEquivalent(this.body) && e.args.every((t, s) => t.isEquivalent(this.args[s])); }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.body !== null ? this.body = _(this.body, e, t | U.InChildOperation) : this.fn !== null && (this.fn = _(this.fn, e, t)); for (let s = 0; s < this.args.length; s++)
        this.args[s] = _(this.args[s], e, t); }
    clone() { let e = new n(this.body?.clone() ?? null, this.args.map(t => t.clone())); return e.fn = this.fn?.clone() ?? null, e.varOffset = this.varOffset, e; }
}, Pn = class n extends K {
    index;
    kind = I.PureFunctionParameterExpr;
    constructor(e) { super(), this.index = e; }
    visitExpression() { }
    isEquivalent(e) { return e instanceof n && e.index === this.index; }
    isConstant() { return !0; }
    transformInternalExpressions() { }
    clone() { return new n(this.index); }
}, ws = class n extends K {
    target;
    targetSlot;
    name;
    args;
    kind = I.PipeBinding;
    [Ss] = !0;
    [qi] = !0;
    varOffset = null;
    constructor(e, t, s, r) { super(), this.target = e, this.targetSlot = t, this.name = s, this.args = r; }
    visitExpression(e, t) { for (let s of this.args)
        s.visitExpression(e, t); }
    isEquivalent() { return !1; }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { for (let s = 0; s < this.args.length; s++)
        this.args[s] = _(this.args[s], e, t); }
    clone() { let e = new n(this.target, this.targetSlot, this.name, this.args.map(t => t.clone())); return e.varOffset = this.varOffset, e; }
}, Ci = class n extends K {
    target;
    targetSlot;
    name;
    args;
    numArgs;
    kind = I.PipeBindingVariadic;
    [Ss] = !0;
    [qi] = !0;
    varOffset = null;
    constructor(e, t, s, r, i) { super(), this.target = e, this.targetSlot = t, this.name = s, this.args = r, this.numArgs = i; }
    visitExpression(e, t) { this.args.visitExpression(e, t); }
    isEquivalent() { return !1; }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.args = _(this.args, e, t); }
    clone() { let e = new n(this.target, this.targetSlot, this.name, this.args.clone(), this.numArgs); return e.varOffset = this.varOffset, e; }
}, Js = class n extends K {
    receiver;
    name;
    kind = I.SafePropertyRead;
    constructor(e, t) { super(), this.receiver = e, this.name = t; }
    get index() { return this.name; }
    visitExpression(e, t) { this.receiver.visitExpression(e, t); }
    isEquivalent() { return !1; }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.receiver = _(this.receiver, e, t); }
    clone() { return new n(this.receiver.clone(), this.name); }
}, Ks = class n extends K {
    receiver;
    index;
    kind = I.SafeKeyedRead;
    constructor(e, t, s) { super(s), this.receiver = e, this.index = t; }
    visitExpression(e, t) { this.receiver.visitExpression(e, t), this.index.visitExpression(e, t); }
    isEquivalent() { return !1; }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.receiver = _(this.receiver, e, t), this.index = _(this.index, e, t); }
    clone() { return new n(this.receiver.clone(), this.index.clone(), this.sourceSpan); }
}, Es = class n extends K {
    receiver;
    args;
    kind = I.SafeInvokeFunction;
    constructor(e, t) { super(), this.receiver = e, this.args = t; }
    visitExpression(e, t) { this.receiver.visitExpression(e, t); for (let s of this.args)
        s.visitExpression(e, t); }
    isEquivalent() { return !1; }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.receiver = _(this.receiver, e, t); for (let s = 0; s < this.args.length; s++)
        this.args[s] = _(this.args[s], e, t); }
    clone() { return new n(this.receiver.clone(), this.args.map(e => e.clone())); }
}, er = class n extends K {
    guard;
    expr;
    kind = I.SafeTernaryExpr;
    constructor(e, t) { super(), this.guard = e, this.expr = t; }
    visitExpression(e, t) { this.guard.visitExpression(e, t), this.expr.visitExpression(e, t); }
    isEquivalent() { return !1; }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.guard = _(this.guard, e, t), this.expr = _(this.expr, e, t); }
    clone() { return new n(this.guard.clone(), this.expr.clone()); }
}, Ai = class n extends K {
    kind = I.EmptyExpr;
    visitExpression(e, t) { }
    isEquivalent(e) { return e instanceof n; }
    isConstant() { return !0; }
    clone() { return new n; }
    transformInternalExpressions() { }
}, Xt = class n extends K {
    expr;
    xref;
    kind = I.AssignTemporaryExpr;
    name = null;
    constructor(e, t) { super(), this.expr = e, this.xref = t; }
    visitExpression(e, t) { this.expr.visitExpression(e, t); }
    isEquivalent() { return !1; }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { this.expr = _(this.expr, e, t); }
    clone() { let e = new n(this.expr.clone(), this.xref); return e.name = this.name, e; }
}, Ln = class n extends K {
    xref;
    kind = I.ReadTemporaryExpr;
    name = null;
    constructor(e) { super(), this.xref = e; }
    visitExpression(e, t) { }
    isEquivalent() { return this.xref === this.xref; }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { }
    clone() { let e = new n(this.xref); return e.name = this.name, e; }
}, qo = class n extends K {
    slot;
    kind = I.SlotLiteralExpr;
    constructor(e) { super(), this.slot = e; }
    visitExpression(e, t) { }
    isEquivalent(e) { return e instanceof n && e.slot === this.slot; }
    isConstant() { return !0; }
    clone() { return new n(this.slot); }
    transformInternalExpressions() { }
}, Uo = class n extends K {
    expr;
    target;
    targetSlot;
    alias;
    kind = I.ConditionalCase;
    constructor(e, t, s, r = null) { super(), this.expr = e, this.target = t, this.targetSlot = s, this.alias = r; }
    visitExpression(e, t) { this.expr !== null && this.expr.visitExpression(e, t); }
    isEquivalent(e) { return e instanceof n && e.expr === this.expr; }
    isConstant() { return !0; }
    clone() { return new n(this.expr, this.target, this.targetSlot); }
    transformInternalExpressions(e, t) { this.expr !== null && (this.expr = _(this.expr, e, t)); }
}, ki = class n extends K {
    expr;
    kind = I.ConstCollected;
    constructor(e) { super(), this.expr = e; }
    transformInternalExpressions(e, t) { this.expr = e(this.expr, t); }
    visitExpression(e, t) { this.expr.visitExpression(e, t); }
    isEquivalent(e) { return e instanceof n ? this.expr.isEquivalent(e.expr) : !1; }
    isConstant() { return this.expr.isConstant(); }
    clone() { return new n(this.expr); }
}, Vl = class n extends K {
    parameters;
    body;
    kind = I.ArrowFunction;
    [Ss] = !0;
    [qi] = !0;
    contextName = it;
    currentViewName = "view";
    varOffset = null;
    ops;
    constructor(e, t) { super(), this.parameters = e, this.body = t, this.ops = new E, this.ops.push([ot(new me(t, t.sourceSpan))]); }
    visitExpression(e, t) { for (let s of this.ops)
        de(s, r => { r.visitExpression(e, t); }); }
    isEquivalent(e) { return e instanceof n && e.parameters.length === this.parameters.length && e.parameters.every((t, s) => t.isEquivalent(this.parameters[s])) && e.body.isEquivalent(this.body); }
    isConstant() { return !1; }
    transformInternalExpressions(e, t) { for (let s of this.ops)
        ce(s, e, t | (U.InChildOperation | U.InArrowFunctionOperation)); }
    clone() { let e = new n(this.parameters, this.body); return e.varOffset = this.varOffset, e.ops = this.ops, e; }
};
function de(n, e) { ce(n, (t, s) => (e(t, s), t), U.None); }
var U = (function (n) { return n[n.None = 0] = "None", n[n.InChildOperation = 1] = "InChildOperation", n[n.InArrowFunctionOperation = 2] = "InArrowFunctionOperation", n; })(U || {});
function Ia(n, e, t) { for (let s = 0; s < n.expressions.length; s++)
    n.expressions[s] = _(n.expressions[s], e, t); }
function ce(n, e, t) { switch (n.kind) {
    case u.StyleProp:
    case u.StyleMap:
    case u.ClassProp:
    case u.ClassMap:
    case u.AnimationString:
    case u.AnimationBinding:
    case u.Binding:
        n.expression instanceof le ? Ia(n.expression, e, t) : n.expression = _(n.expression, e, t);
        break;
    case u.Property:
    case u.DomProperty:
    case u.Attribute:
        n.expression instanceof le ? Ia(n.expression, e, t) : n.expression = _(n.expression, e, t), n.sanitizer = n.sanitizer && _(n.sanitizer, e, t);
        break;
    case u.TwoWayProperty:
        n.expression = _(n.expression, e, t), n.sanitizer = n.sanitizer && _(n.sanitizer, e, t);
        break;
    case u.I18nExpression:
        n.expression = _(n.expression, e, t);
        break;
    case u.InterpolateText:
        Ia(n.interpolation, e, t);
        break;
    case u.Statement:
        Ho(n.statement, e, t);
        break;
    case u.Variable:
        n.initializer = _(n.initializer, e, t);
        break;
    case u.Conditional:
        for (let s of n.conditions)
            s.expr !== null && (s.expr = _(s.expr, e, t));
        n.processed !== null && (n.processed = _(n.processed, e, t)), n.contextValue !== null && (n.contextValue = _(n.contextValue, e, t));
        break;
    case u.Animation:
    case u.AnimationListener:
    case u.Listener:
    case u.TwoWayListener:
        for (let s of n.handlerOps)
            ce(s, e, t | U.InChildOperation);
        break;
    case u.ExtractedAttribute:
        n.expression = n.expression && _(n.expression, e, t), n.trustedValueFn = n.trustedValueFn && _(n.trustedValueFn, e, t);
        break;
    case u.RepeaterCreate:
        if (n.trackByOps === null)
            n.track = _(n.track, e, t);
        else
            for (let s of n.trackByOps)
                ce(s, e, t | U.InChildOperation);
        n.trackByFn !== null && (n.trackByFn = _(n.trackByFn, e, t));
        break;
    case u.Repeater:
        n.collection = _(n.collection, e, t);
        break;
    case u.Defer:
        n.loadingConfig !== null && (n.loadingConfig = _(n.loadingConfig, e, t)), n.placeholderConfig !== null && (n.placeholderConfig = _(n.placeholderConfig, e, t)), n.resolverFn !== null && (n.resolverFn = _(n.resolverFn, e, t));
        break;
    case u.I18nMessage:
        for (let [s, r] of n.params)
            n.params.set(s, _(r, e, t));
        for (let [s, r] of n.postprocessingParams)
            n.postprocessingParams.set(s, _(r, e, t));
        break;
    case u.DeferWhen:
        n.expr = _(n.expr, e, t);
        break;
    case u.StoreLet:
        n.value = _(n.value, e, t);
        break;
    case u.Advance:
    case u.Container:
    case u.ContainerEnd:
    case u.ContainerStart:
    case u.DeferOn:
    case u.DisableBindings:
    case u.Element:
    case u.ElementEnd:
    case u.ElementStart:
    case u.EnableBindings:
    case u.I18n:
    case u.I18nApply:
    case u.I18nContext:
    case u.I18nEnd:
    case u.I18nStart:
    case u.IcuEnd:
    case u.IcuStart:
    case u.Namespace:
    case u.Pipe:
    case u.Projection:
    case u.ProjectionDef:
    case u.Template:
    case u.Text:
    case u.I18nAttributes:
    case u.IcuPlaceholder:
    case u.DeclareLet:
    case u.SourceLocation:
    case u.ConditionalCreate:
    case u.ConditionalBranchCreate:
    case u.Control:
    case u.ControlCreate: break;
    default: throw new Error(`AssertionError: transformExpressionsInOp doesn't handle ${u[n.kind]}`);
} }
function _(n, e, t) { if (n instanceof K)
    n.transformInternalExpressions(e, t);
else if (n instanceof j)
    n.lhs = _(n.lhs, e, t), n.rhs = _(n.rhs, e, t);
else if (n instanceof rn)
    n.expr = _(n.expr, e, t);
else if (n instanceof Xe)
    n.receiver = _(n.receiver, e, t);
else if (n instanceof Vt)
    n.receiver = _(n.receiver, e, t), n.index = _(n.index, e, t);
else if (n instanceof Ue) {
    n.fn = _(n.fn, e, t);
    for (let s = 0; s < n.args.length; s++)
        n.args[s] = _(n.args[s], e, t);
}
else if (n instanceof Tt)
    for (let s = 0; s < n.entries.length; s++)
        n.entries[s] = _(n.entries[s], e, t);
else if (n instanceof Et)
    for (let s of n.entries)
        s instanceof qt ? s.expression = _(s.expression, e, t) : s.value = _(s.value, e, t);
else if (n instanceof bt)
    n.condition = _(n.condition, e, t), n.trueCase = _(n.trueCase, e, t), n.falseCase !== null && (n.falseCase = _(n.falseCase, e, t));
else if (n instanceof os)
    n.expr = _(n.expr, e, t);
else if (n instanceof Fr)
    n.expr = _(n.expr, e, t);
else if (n instanceof Or)
    for (let s = 0; s < n.expressions.length; s++)
        n.expressions[s] = _(n.expressions[s], e, t);
else if (n instanceof Hs)
    n.condition = _(n.condition, e, t);
else if (n instanceof Vs)
    n.tag = _(n.tag, e, t), n.template.expressions = n.template.expressions.map(s => _(s, e, t));
else if (n instanceof Fn)
    if (Array.isArray(n.body))
        for (let s = 0; s < n.body.length; s++)
            Ho(n.body[s], e, t | U.InChildOperation);
    else
        n.body = _(n.body, e, t | U.InChildOperation);
else if (!(n instanceof W)) {
    if (n instanceof Us)
        for (let s = 0; s < n.expressions.length; s++)
            n.expressions[s] = _(n.expressions[s], e, t);
    else if (n instanceof wt)
        n.expr = _(n.expr, e, t);
    else if (n instanceof Cn)
        n.expression = _(n.expression, e, t);
    else if (!(n instanceof vt || n instanceof sn || n instanceof xe || n instanceof as))
        throw new Error(`Unhandled expression kind: ${n.constructor.name}`);
} return e(n, t); }
function Ho(n, e, t) { if (n instanceof Te)
    n.expr = _(n.expr, e, t);
else if (n instanceof me)
    n.value = _(n.value, e, t);
else if (n instanceof he)
    n.value !== void 0 && (n.value = _(n.value, e, t));
else if (n instanceof Ur) {
    n.condition = _(n.condition, e, t);
    for (let s of n.trueCase)
        Ho(s, e, t);
    for (let s of n.falseCase)
        Ho(s, e, t);
}
else
    throw new Error(`Unhandled statement kind: ${n.constructor.name}`); }
function gf(n) { return n instanceof xe && typeof n.value == "string"; }
var Ie = class {
    slot = null;
}, Qg = new Set([u.Element, u.ElementStart, u.Container, u.ContainerStart, u.Template, u.RepeaterCreate, u.ConditionalCreate, u.ConditionalBranchCreate]);
function Bn(n) { return Qg.has(n.kind); }
function Zg(n, e, t, s, r, i) { return S(S({ kind: u.ElementStart, xref: e, tag: n, handle: new Ie, attributes: null, localRefs: [], nonBindable: !1, namespace: t, i18nPlaceholder: s, startSourceSpan: r, wholeSourceSpan: i }, St), M); }
function vf(n, e, t, s, r, i, o, a) { return S(S({ kind: u.Template, xref: n, templateKind: e, attributes: null, tag: t, handle: new Ie, functionNameSuffix: s, decls: null, vars: null, localRefs: [], nonBindable: !1, namespace: r, i18nPlaceholder: i, startSourceSpan: o, wholeSourceSpan: a }, St), M); }
function wf(n, e, t, s, r, i, o, a) { return S(S({ kind: u.ConditionalCreate, xref: n, templateKind: e, attributes: null, tag: t, handle: new Ie, functionNameSuffix: s, decls: null, vars: null, localRefs: [], nonBindable: !1, namespace: r, i18nPlaceholder: i, startSourceSpan: o, wholeSourceSpan: a }, St), M); }
function Ef(n, e, t, s, r, i, o, a) { return S(S({ kind: u.ConditionalBranchCreate, xref: n, templateKind: e, attributes: null, tag: t, handle: new Ie, functionNameSuffix: s, decls: null, vars: null, localRefs: [], nonBindable: !1, namespace: r, i18nPlaceholder: i, startSourceSpan: o, wholeSourceSpan: a }, St), M); }
function Jg(n, e, t, s, r, i, o, a, l, c) { return pe(S(S(S({ kind: u.RepeaterCreate, attributes: null, xref: n, handle: new Ie, emptyView: e, track: s, trackByFn: null, trackByOps: null, tag: t, emptyTag: i, emptyAttributes: null, functionNameSuffix: "For", namespace: Pe.HTML, nonBindable: !1, localRefs: [], decls: null, vars: null, varNames: r, usesComponentInstance: !1, i18nPlaceholder: o, emptyI18nPlaceholder: a, startSourceSpan: l, wholeSourceSpan: c }, St), M), Ze), { numSlotsUsed: e === null ? 2 : 3 }); }
function Kg(n, e) { return S({ kind: u.ElementEnd, xref: n, sourceSpan: e }, M); }
function ev(n) { return S({ kind: u.DisableBindings, xref: n }, M); }
function tv(n) { return S({ kind: u.EnableBindings, xref: n }, M); }
function Sf(n, e, t, s) { return S(S({ kind: u.Text, xref: n, handle: new Ie, initialValue: e, icuPlaceholder: t, sourceSpan: s }, St), M); }
function nv(n, e, t, s, r, i) { return S({ kind: u.AnimationString, name: n, target: e, animationKind: t, expression: s, i18nMessage: null, securityContext: r, sanitizer: null, sourceSpan: i }, M); }
function sv(n, e, t, s, r, i) { let o = new E; return o.push(s), S({ kind: u.Animation, name: n, target: e, animationKind: t, handlerOps: o, handlerFnName: null, i18nMessage: null, securityContext: r, sanitizer: null, sourceSpan: i }, M); }
function lu(n, e, t, s, r, i, o, a, l) { let c = new E; return c.push(r), S({ kind: u.Listener, target: n, targetSlot: e, tag: s, hostListener: a, name: t, handlerOps: c, handlerFnName: null, consumesDollarEvent: !1, isLegacyAnimationListener: i !== null, legacyAnimationPhase: i, eventTarget: o, sourceSpan: l }, M); }
function xf(n, e, t, s, r, i, o, a, l) { let c = new E; return c.push(r), S({ kind: u.AnimationListener, target: n, targetSlot: e, tag: s, hostListener: a, name: t, animationKind: i, handlerOps: c, handlerFnName: null, consumesDollarEvent: !1, eventTarget: o, sourceSpan: l }, M); }
function yf(n, e, t, s, r, i) { let o = new E; return o.push(r), S({ kind: u.TwoWayListener, target: n, targetSlot: e, tag: s, name: t, handlerOps: o, handlerFnName: null, sourceSpan: i }, M); }
function rv(n, e, t) { return S(S({ kind: u.Pipe, xref: n, handle: e, name: t }, M), St); }
function iv(n) { return S({ kind: u.Namespace, active: n }, M); }
function ov(n) { return S({ kind: u.ProjectionDef, def: n }, M); }
function av(n, e, t, s, r) { return pe(S(S({ kind: u.Projection, xref: n, handle: new Ie, selector: e, i18nPlaceholder: t, fallbackView: s, projectionSlotIndex: 0, attributes: null, localRefs: [], sourceSpan: r }, M), St), { numSlotsUsed: s === null ? 1 : 2 }); }
function ft(n, e, t, s, r, i, o, a) { return S({ kind: u.ExtractedAttribute, target: n, bindingKind: e, namespace: t, name: s, expression: r, i18nContext: i, i18nMessage: o, securityContext: a, trustedValueFn: null }, M); }
function lv(n, e, t, s, r, i) { return pe(S(S({ kind: u.Defer, xref: n, handle: new Ie, mainView: e, mainSlot: t, loadingView: null, loadingSlot: null, loadingConfig: null, loadingMinimumTime: null, loadingAfterTime: null, placeholderView: null, placeholderSlot: null, placeholderConfig: null, placeholderMinimumTime: null, errorView: null, errorSlot: null, ownResolverFn: s, resolverFn: r, flags: null, sourceSpan: i }, M), St), { numSlotsUsed: 2 }); }
function fn(n, e, t, s) { return S({ kind: u.DeferOn, defer: n, trigger: e, modifier: t, sourceSpan: s }, M); }
function cv(n, e, t) { return S(S({ kind: u.DeclareLet, xref: n, declaredName: e, sourceSpan: t, handle: new Ie }, St), M); }
function uv(n, e, t, s, r, i, o, a) { return S({ kind: u.I18nMessage, xref: n, i18nContext: e, i18nBlock: t, message: s, messagePlaceholder: r, params: i, postprocessingParams: o, needsPostprocessing: a, subMessages: [] }, M); }
function Sa(n, e, t, s) { return S(S({ kind: u.I18nStart, xref: n, handle: new Ie, root: t ?? n, message: e, messageIndex: null, subTemplateIndex: null, context: null, sourceSpan: s }, M), St); }
function xa(n, e) { return S({ kind: u.I18nEnd, xref: n, sourceSpan: e }, M); }
function hv(n, e, t, s) { return S({ kind: u.IcuStart, xref: n, message: e, messagePlaceholder: t, context: null, sourceSpan: s }, M); }
function pv(n) { return S({ kind: u.IcuEnd, xref: n }, M); }
function fv(n, e, t) { return S({ kind: u.IcuPlaceholder, xref: n, name: e, strings: t, expressionPlaceholders: [] }, M); }
function Na(n, e, t, s, r) { if (t === null && n !== Qn.Attr)
    throw new Error("AssertionError: i18nBlock must be provided for non-attribute contexts."); return S({ kind: u.I18nContext, contextKind: n, xref: e, i18nBlock: t, message: s, sourceSpan: r, params: new Map, postprocessingParams: new Map }, M); }
function Cf(n, e, t) { return S(S({ kind: u.I18nAttributes, xref: n, handle: e, target: t, i18nAttributesConfig: null }, M), St); }
function dv(n, e) { return S({ kind: u.SourceLocation, templatePath: n, locations: e }, M); }
function mv(n) { return S({ kind: u.ControlCreate, sourceSpan: n }, M); }
function gv(n, e, t, s, r, i) { return S(S({ kind: u.DomProperty, name: n, expression: e, bindingKind: t, i18nContext: s, securityContext: r, sanitizer: null, sourceSpan: i }, Ze), M); }
var Af = "CTX_REF_MARKER", k = (function (n) { return n[n.Tmpl = 0] = "Tmpl", n[n.Host = 1] = "Host", n[n.Both = 2] = "Both", n; })(k || {}), He = (function (n) { return n[n.Full = 0] = "Full", n[n.DomOnly = 1] = "DomOnly", n; })(He || {}), Wo = class {
    componentName;
    pool;
    mode;
    constructor(e, t, s) { this.componentName = e, this.pool = t, this.mode = s; }
    kind = k.Both;
    allocateXrefId() { return this.nextXrefId++; }
    nextXrefId = 0;
}, _i = class extends Wo {
    relativeContextFilePath;
    i18nUseExternalIds;
    deferMeta;
    allDeferrableDepsFn;
    relativeTemplatePath;
    enableDebugLocations;
    constructor(e, t, s, r, i, o, a, l, c) { super(e, t, s), this.relativeContextFilePath = r, this.i18nUseExternalIds = i, this.deferMeta = o, this.allDeferrableDepsFn = a, this.relativeTemplatePath = l, this.enableDebugLocations = c, this.root = new dt(this, this.allocateXrefId(), null), this.views.set(this.root.xref, this.root); }
    kind = k.Tmpl;
    fnSuffix = "Template";
    root;
    views = new Map;
    contentSelectors = null;
    allocateView(e) { let t = new dt(this, this.allocateXrefId(), e); return this.views.set(t.xref, t), t; }
    get units() { return this.views.values(); }
    addConst(e, t) { for (let r = 0; r < this.consts.length; r++)
        if (this.consts[r].isEquivalent(e))
            return r; let s = this.consts.length; return this.consts.push(e), t && this.constsInitializers.push(...t), s; }
    consts = [];
    constsInitializers = [];
}, jo = class {
    xref;
    constructor(e) { this.xref = e; }
    create = new E;
    update = new E;
    functions = new Set;
    fnName = null;
    vars = null;
    *ops() { for (let e of this.functions)
        for (let t of e.ops)
            yield t; for (let e of this.create)
        if (yield e, e.kind === u.Listener || e.kind === u.Animation || e.kind === u.AnimationListener || e.kind === u.TwoWayListener)
            for (let t of e.handlerOps)
                yield t;
        else if (e.kind === u.RepeaterCreate && e.trackByOps !== null)
            for (let t of e.trackByOps)
                yield t; for (let e of this.update)
        yield e; }
}, dt = class extends jo {
    job;
    parent;
    constructor(e, t, s) { super(t), this.job = e, this.parent = s; }
    contextVariables = new Map;
    aliases = new Set;
    decls = null;
}, zo = class extends Wo {
    constructor(e, t, s) { super(e, t, s), this.root = new ql(this); }
    kind = k.Host;
    fnSuffix = "HostBindings";
    root;
    get units() { return [this.root]; }
}, ql = class extends jo {
    job;
    constructor(e) { super(0), this.job = e; }
    attributes = null;
};
function vv(n) { for (let e of n.units)
    for (let t of e.ops())
        ce(t, wv, U.None); }
function wv(n) { if (n instanceof Ue && n.fn instanceof ke && n.fn.name === "$any") {
    if (n.args.length !== 1)
        throw new Error("The $any builtin function expects exactly one argument.");
    return n.args[0];
} return n; }
function Ev(n) { let e = new Map; for (let t of n.units)
    for (let s of t.create)
        s.kind === u.I18nContext && e.set(s.xref, s); for (let t of n.units)
    for (let s of t.update)
        s.kind === u.I18nExpression && Sv(e, s) && E.insertAfter(Gg(s.i18nOwner, s.handle, null), s); }
function Sv(n, e) { if (e.next?.kind !== u.I18nExpression)
    return !0; let t = n.get(e.context), s = n.get(e.next.context); if (t === void 0)
    throw new Error("AssertionError: expected an I18nContextOp to exist for the I18nExpressionOp's context"); if (s === void 0)
    throw new Error("AssertionError: expected an I18nContextOp to exist for the next I18nExpressionOp's context"); return t.i18nBlock !== null ? t.i18nBlock !== s.i18nBlock : e.i18nOwner !== e.next.i18nOwner; }
function xv(n) { for (let e of n.units) {
    let t = e.update.head, s = [], r = null;
    for (let i of e.create) {
        if (i.kind === u.I18nStart)
            r = { blockXref: i.xref, lastSlotConsumer: i.xref };
        else if (i.kind === u.I18nEnd) {
            for (let o of s)
                o.target = r.lastSlotConsumer, E.insertBefore(o, t);
            s.length = 0, r = null;
        }
        if (cr(i))
            for (r !== null && (r.lastSlotConsumer = i.xref); t.next !== null;) {
                if (r !== null && t.kind === u.I18nExpression && t.usage === lr.I18nText && t.i18nOwner === r.blockXref) {
                    let a = t;
                    t = t.next, E.remove(a), s.push(a);
                    continue;
                }
                let o = !1;
                if (Ei(t) && t.target !== i.xref ? o = !0 : (t.kind === u.Statement || t.kind === u.Variable) && de(t, a => { !o && Ei(a) && a.target !== i.xref && (o = !0); }), o)
                    break;
                t = t.next;
            }
    }
} }
function yv(n) { if (!(!n.enableDebugLocations || n.relativeTemplatePath === null))
    for (let e of n.units) {
        let t = [];
        for (let s of e.create)
            if (s.kind === u.ElementStart || s.kind === u.Element) {
                let r = s.startSourceSpan.start;
                t.push({ targetSlot: s.handle, offset: r.offset, line: r.line, column: r.col });
            }
        t.length > 0 && e.create.push(dv(n.relativeTemplatePath, t));
    } }
function kf(n) { let e = new Map; for (let t of n.create)
    cr(t) && (e.set(t.xref, t), t.kind === u.RepeaterCreate && t.emptyView !== null && e.set(t.emptyView, t)); return e; }
function Cv(n) { for (let e of n.units) {
    let t = kf(e);
    for (let s of e.ops())
        switch (s.kind) {
            case u.Attribute:
                Av(e, s, t);
                break;
            case u.Property:
                if (s.bindingKind !== b.LegacyAnimation && s.bindingKind !== b.Animation) {
                    let r;
                    s.i18nMessage !== null && s.templateKind === null ? r = b.I18n : s.isStructuralTemplateAttribute ? r = b.Template : r = b.Property, E.insertBefore(ft(s.target, r, null, s.name, null, null, null, s.securityContext), Is(t, s.target));
                }
                break;
            case u.TwoWayProperty:
                E.insertBefore(ft(s.target, b.TwoWayProperty, null, s.name, null, null, null, s.securityContext), Is(t, s.target));
                break;
            case u.StyleProp:
            case u.ClassProp:
                s.expression instanceof Ai && E.insertBefore(ft(s.target, b.Property, null, s.name, null, null, null, J.STYLE), Is(t, s.target));
                break;
            case u.Listener:
                if (!s.isLegacyAnimationListener) {
                    let r = ft(s.target, b.Property, null, s.name, null, null, null, J.NONE);
                    if (n.kind === k.Host)
                        break;
                    E.insertBefore(r, Is(t, s.target));
                }
                break;
            case u.TwoWayListener:
                if (n.kind !== k.Host) {
                    let r = ft(s.target, b.Property, null, s.name, null, null, null, J.NONE);
                    E.insertBefore(r, Is(t, s.target));
                }
                break;
        }
} }
function Is(n, e) { let t = n.get(e); if (t === void 0)
    throw new Error("All attributes should have an element-like target."); return t; }
function Av(n, e, t) { if (!(e.expression instanceof le) && e.isTextAttribute) {
    let s = ft(e.target, e.isStructuralTemplateAttribute ? b.Template : b.Attribute, e.namespace, e.name, e.expression, e.i18nContext, e.i18nMessage, e.securityContext);
    if (n.job.kind === k.Host)
        n.create.push(s);
    else {
        let r = Is(t, e.target);
        E.insertBefore(s, r);
    }
    E.remove(e);
} }
var Gu = "aria-";
function _f(n) { return n.startsWith(Gu) && n.length > Gu.length; }
function kv(n, e) { let t = n.get(e); if (t === void 0)
    throw new Error("All attributes should have an element-like target."); return t; }
function _v(n) { let e = new Map; for (let t of n.units)
    for (let s of t.create)
        Bn(s) && e.set(s.xref, s); for (let t of n.units)
    for (let s of t.ops())
        if (s.kind === u.Binding)
            switch (s.bindingKind) {
                case b.Attribute:
                    if (s.name === "ngNonBindable") {
                        E.remove(s);
                        let r = kv(e, s.target);
                        r.nonBindable = !0;
                    }
                    else if (s.name.startsWith("animate."))
                        E.replace(s, zu(s.name, s.target, s.name === "animate.enter" ? "enter" : "leave", s.expression, s.securityContext, s.sourceSpan, 0));
                    else {
                        let [r, i] = It(s.name);
                        E.replace(s, ju(s.target, r, i, s.expression, s.securityContext, s.isTextAttribute, s.isStructuralTemplateAttribute, s.templateKind, s.i18nMessage, s.sourceSpan));
                    }
                    break;
                case b.Animation:
                    E.replace(s, zu(s.name, s.target, s.name === "animate.enter" ? "enter" : "leave", s.expression, s.securityContext, s.sourceSpan, 1));
                    break;
                case b.Property:
                case b.LegacyAnimation:
                    n.mode === He.DomOnly && _f(s.name) ? E.replace(s, ju(s.target, null, s.name, s.expression, s.securityContext, !1, s.isStructuralTemplateAttribute, s.templateKind, s.i18nMessage, s.sourceSpan)) : n.kind === k.Host ? E.replace(s, gv(s.name, s.expression, s.bindingKind, s.i18nContext, s.securityContext, s.sourceSpan)) : E.replace(s, $g(s.target, s.name, s.expression, s.bindingKind, s.securityContext, s.isStructuralTemplateAttribute, s.templateKind, s.i18nContext, s.i18nMessage, s.sourceSpan));
                    break;
                case b.TwoWayProperty:
                    if (!(s.expression instanceof Y))
                        throw new Error(`Expected value of two-way property binding "${s.name}" to be an expression`);
                    E.replace(s, Og(s.target, s.name, s.expression, s.securityContext, s.isStructuralTemplateAttribute, s.templateKind, s.i18nContext, s.i18nMessage, s.sourceSpan));
                    break;
                case b.I18n:
                case b.ClassName:
                case b.StyleProperty: throw new Error(`Unhandled binding of kind ${b[s.bindingKind]}`);
            } }
var Xu = new Map([[f.ariaProperty, f.ariaProperty], [f.attribute, f.attribute], [f.classProp, f.classProp], [f.element, f.element], [f.elementContainer, f.elementContainer], [f.elementContainerEnd, f.elementContainerEnd], [f.elementContainerStart, f.elementContainerStart], [f.elementEnd, f.elementEnd], [f.elementStart, f.elementStart], [f.domProperty, f.domProperty], [f.i18nExp, f.i18nExp], [f.listener, f.listener], [f.listener, f.listener], [f.property, f.property], [f.styleProp, f.styleProp], [f.syntheticHostListener, f.syntheticHostListener], [f.syntheticHostProperty, f.syntheticHostProperty], [f.templateCreate, f.templateCreate], [f.twoWayProperty, f.twoWayProperty], [f.twoWayListener, f.twoWayListener], [f.declareLet, f.declareLet], [f.conditionalCreate, f.conditionalBranchCreate], [f.conditionalBranchCreate, f.conditionalBranchCreate], [f.domElement, f.domElement], [f.domElementStart, f.domElementStart], [f.domElementEnd, f.domElementEnd], [f.domElementContainer, f.domElementContainer], [f.domElementContainerStart, f.domElementContainerStart], [f.domElementContainerEnd, f.domElementContainerEnd], [f.domListener, f.domListener], [f.domTemplate, f.domTemplate], [f.animationEnter, f.animationEnter], [f.animationLeave, f.animationLeave], [f.animationEnterListener, f.animationEnterListener], [f.animationLeaveListener, f.animationLeaveListener]]), bv = 256;
function Tv(n) { for (let e of n.units)
    Yu(e.create), Yu(e.update); }
function Yu(n) { let e = null; for (let t of n) {
    if (t.kind !== u.Statement || !(t.statement instanceof Te)) {
        e = null;
        continue;
    }
    if (!(t.statement.expr instanceof Ue) || !(t.statement.expr.fn instanceof sn)) {
        e = null;
        continue;
    }
    let s = t.statement.expr.fn.value;
    if (!Xu.has(s)) {
        e = null;
        continue;
    }
    if (e !== null && Xu.get(e.instruction) === s && e.length < bv) {
        let r = e.expression.callFn(t.statement.expr.args, t.statement.expr.sourceSpan, t.statement.expr.pure);
        e.expression = r, e.op.statement = r.toStmt(), e.length++, E.remove(t);
    }
    else
        e = { op: t, instruction: s, expression: t.statement.expr, length: 1 };
} }
function Iv(n) { for (let e of n.units)
    for (let t of e.update)
        (t.kind === u.Attribute || t.kind === u.StyleProp || t.kind == u.StyleMap || t.kind === u.ClassMap) && t.expression instanceof le && t.expression.strings.length === 2 && t.expression.strings.every(r => r === "") && (t.expression = t.expression.expressions[0]); }
function Nv(n) { for (let e of n.units)
    for (let t of e.ops()) {
        if (t.kind !== u.Conditional)
            continue;
        let s, r = t.conditions.findIndex(a => a.expr === null);
        if (r >= 0) {
            let a = t.conditions.splice(r, 1)[0].targetSlot;
            s = new qo(a);
        }
        else
            s = d(-1);
        let i = t.test == null ? null : new Xt(t.test, n.allocateXrefId()), o = null;
        for (let a = t.conditions.length - 1; a >= 0; a--) {
            let l = t.conditions[a];
            if (l.expr !== null) {
                if (i !== null) {
                    let c = a === 0 ? i : new Ln(i.xref);
                    l.expr = new j(x.Identical, c, l.expr);
                }
                else
                    l.alias !== null && (o ??= n.allocateXrefId(), l.expr = new Xt(l.expr, o), t.contextValue = new Ln(o));
                s = new bt(l.expr, new qo(l.targetSlot), s);
            }
        }
        t.processed = s, t.conditions = [];
    } }
var Dv = new Map([["&&", x.And], [">", x.Bigger], [">=", x.BiggerEquals], ["|", x.BitwiseOr], ["&", x.BitwiseAnd], ["/", x.Divide], ["=", x.Assign], ["==", x.Equals], ["===", x.Identical], ["<", x.Lower], ["<=", x.LowerEquals], ["-", x.Minus], ["%", x.Modulo], ["**", x.Exponentiation], ["*", x.Multiply], ["!=", x.NotEquals], ["!==", x.NotIdentical], ["??", x.NullishCoalesce], ["||", x.Or], ["+", x.Plus], ["in", x.In], ["instanceof", x.InstanceOf], ["+=", x.AdditionAssignment], ["-=", x.SubtractionAssignment], ["*=", x.MultiplicationAssignment], ["/=", x.DivisionAssignment], ["%=", x.RemainderAssignment], ["**=", x.ExponentiationAssignment], ["&&=", x.AndAssignment], ["||=", x.OrAssignment], ["??=", x.NullishCoalesceAssignment]]);
function bf(n) { let e = new Map([["svg", Pe.SVG], ["math", Pe.Math]]); return n === null ? Pe.HTML : e.get(n) ?? Pe.HTML; }
function Pv(n) { let e = new Map([["svg", Pe.SVG], ["math", Pe.Math]]); for (let [t, s] of e.entries())
    if (s === n)
        return t; return null; }
function Lv(n, e) { return e === Pe.HTML ? n : `:${Pv(e)}:${n}`; }
function tr(n) { return Array.isArray(n) ? q(n.map(tr)) : d(n); }
function Bv(n) { let e = new Map; for (let t of n.units)
    for (let s of t.create)
        if (s.kind === u.ExtractedAttribute) {
            let r = e.get(s.target) || new Ul;
            e.set(s.target, r), r.add(s.bindingKind, s.name, s.expression, s.namespace, s.trustedValueFn), E.remove(s);
        } if (n instanceof _i)
    for (let t of n.units)
        for (let s of t.create)
            if (s.kind == u.Projection) {
                let r = e.get(s.xref);
                if (r !== void 0) {
                    let i = Hl(r);
                    i.entries.length > 0 && (s.attributes = i);
                }
            }
            else
                Bn(s) && (s.attributes = Qu(n, e, s.xref), s.kind === u.RepeaterCreate && s.emptyView !== null && (s.emptyAttributes = Qu(n, e, s.emptyView)));
else if (n instanceof zo)
    for (let [t, s] of e.entries()) {
        if (t !== n.root.xref)
            throw new Error("An attribute would be const collected into the host binding's template function, but is not associated with the root xref.");
        let r = Hl(s);
        r.entries.length > 0 && (n.root.attributes = r);
    } }
function Qu(n, e, t) { let s = e.get(t); if (s !== void 0) {
    let r = Hl(s);
    if (r.entries.length > 0)
        return n.addConst(r);
} return null; }
var Cs = Object.freeze([]), Ul = class {
    known = new Map;
    byKind = new Map;
    propertyBindings = null;
    projectAs = null;
    get attributes() { return this.byKind.get(b.Attribute) ?? Cs; }
    get classes() { return this.byKind.get(b.ClassName) ?? Cs; }
    get styles() { return this.byKind.get(b.StyleProperty) ?? Cs; }
    get bindings() { return this.propertyBindings ?? Cs; }
    get template() { return this.byKind.get(b.Template) ?? Cs; }
    get i18n() { return this.byKind.get(b.I18n) ?? Cs; }
    isKnown(e, t) { let s = this.known.get(e) ?? new Set; return this.known.set(e, s), s.has(t) ? !0 : (s.add(t), !1); }
    add(e, t, s, r, i) { if (!(e === b.Attribute || e === b.ClassName || e === b.StyleProperty) && this.isKnown(e, t))
        return; if (t === "ngProjectAs") {
        if (s === null || !(s instanceof xe) || s.value == null || typeof s.value?.toString() != "string")
            throw Error("ngProjectAs must have a string literal value");
        this.projectAs = s.value.toString();
    } let a = this.arrayFor(e); if (a.push(...Mv(r, t)), e === b.Attribute || e === b.StyleProperty) {
        if (s === null)
            throw Error("Attribute, i18n attribute, & style element attributes must have a value");
        if (i !== null) {
            if (!gf(s))
                throw Error("AssertionError: extracted attribute value should be string literal");
            a.push(Pp(i, new Us([new $r(s.value)], []), void 0, s.sourceSpan));
        }
        else
            a.push(s);
    } }
    arrayFor(e) { return e === b.Property || e === b.TwoWayProperty ? (this.propertyBindings ??= [], this.propertyBindings) : (this.byKind.has(e) || this.byKind.set(e, []), this.byKind.get(e)); }
};
function Mv(n, e) { let t = d(e); return n ? [d(0), d(n), t] : [t]; }
function Hl({ attributes: n, bindings: e, classes: t, i18n: s, projectAs: r, styles: i, template: o }) { let a = [...n]; if (r !== null) {
    let l = da(r)[0];
    a.push(d(5), tr(l));
} return t.length > 0 && a.push(d(1), ...t), i.length > 0 && a.push(d(2), ...i), e.length > 0 && a.push(d(3), ...e), o.length > 0 && a.push(d(4), ...o), s.length > 0 && a.push(d(6), ...s), q(a); }
function Rv(n, e) { let t = n.get(e); if (t === void 0)
    throw new Error("All attributes should have an element-like target."); return t; }
function Fv(n) { let e = new Map; for (let t of n.units)
    for (let s of t.create)
        Bn(s) && e.set(s.xref, s); for (let t of n.units)
    for (let s of t.ops())
        if (s.kind === u.AnimationBinding) {
            let r = $v(s);
            n.kind === k.Host ? t.create.push(r) : E.insertAfter(r, Rv(e, s.target)), E.remove(s);
        } }
function $v(n) { if (n.animationBindingKind === 0)
    return nv(n.name, n.target, n.name === "animate.enter" ? "enter" : "leave", n.expression, n.securityContext, n.sourceSpan); {
    let e = n.expression;
    return sv(n.name, n.target, n.name === "animate.enter" ? "enter" : "leave", [ot(new me(e, e.sourceSpan))], n.securityContext, n.sourceSpan);
} }
function Ov(n) { let e = new Map; for (let t of n.units) {
    for (let s of t.create)
        s.kind === u.I18nAttributes && e.set(s.target, s);
    for (let s of t.update)
        switch (s.kind) {
            case u.Property:
            case u.Attribute:
                if (s.i18nContext === null || !(s.expression instanceof le))
                    continue;
                let r = e.get(s.target);
                if (r === void 0)
                    throw new Error("AssertionError: An i18n attribute binding instruction requires the owning element to have an I18nAttributes create instruction");
                if (r.target !== s.target)
                    throw new Error("AssertionError: Expected i18nAttributes target element to match binding target element");
                let i = [];
                for (let o = 0; o < s.expression.expressions.length; o++) {
                    let a = s.expression.expressions[o];
                    if (s.expression.i18nPlaceholders.length !== s.expression.expressions.length)
                        throw new Error(`AssertionError: An i18n attribute binding instruction requires the same number of expressions and placeholders, but found ${s.expression.i18nPlaceholders.length} placeholders and ${s.expression.expressions.length} expressions`);
                    i.push(mf(s.i18nContext, r.target, r.xref, r.handle, a, null, s.expression.i18nPlaceholders[o], wi.Creation, lr.I18nAttribute, s.name, s.sourceSpan));
                }
                E.replaceWithMany(s, i);
                break;
        }
} }
function Vv(n) { let e = new Map; for (let r of n.units)
    for (let i of r.ops())
        switch (i.kind) {
            case u.Binding:
            case u.Property:
            case u.Attribute:
            case u.ExtractedAttribute:
                if (i.i18nMessage === null)
                    continue;
                if (!e.has(i.i18nMessage)) {
                    let o = Na(Qn.Attr, n.allocateXrefId(), null, i.i18nMessage, null);
                    r.create.push(o), e.set(i.i18nMessage, o.xref);
                }
                i.i18nContext = e.get(i.i18nMessage);
                break;
        } let t = new Map; for (let r of n.units)
    for (let i of r.create)
        switch (i.kind) {
            case u.I18nStart:
                if (i.xref === i.root) {
                    let o = Na(Qn.RootI18n, n.allocateXrefId(), i.xref, i.message, null);
                    r.create.push(o), i.context = o.xref, t.set(i.xref, o);
                }
                break;
        } for (let r of n.units)
    for (let i of r.create)
        if (i.kind === u.I18nStart && i.xref !== i.root) {
            let o = t.get(i.root);
            if (o === void 0)
                throw Error("AssertionError: Root i18n block i18n context should have been created.");
            i.context = o.xref, t.set(i.xref, o);
        } let s = null; for (let r of n.units)
    for (let i of r.create)
        switch (i.kind) {
            case u.I18nStart:
                s = i;
                break;
            case u.I18nEnd:
                s = null;
                break;
            case u.IcuStart:
                if (s === null)
                    throw Error("AssertionError: Unexpected ICU outside of an i18n block.");
                if (i.message.id !== s.message.id) {
                    let o = Na(Qn.Icu, n.allocateXrefId(), s.root, i.message, null);
                    r.create.push(o), i.context = o.xref;
                }
                else
                    i.context = s.context, t.get(s.xref).contextKind = Qn.Icu;
                break;
        } }
function qv(n) { let e = new Map; for (let t of n.units)
    for (let s of t.update.reversed())
        if (s.kind === u.Binding && s.isTextAttribute) {
            let r = e.get(s.target) || new Set;
            r.has(s.name) && (s.name === "style" || s.name === "class") && E.remove(s), r.add(s.name), e.set(s.target, r);
        } }
function Uv(n) { for (let e of n.units)
    for (let t of e.create)
        t.kind === u.Defer && (t.placeholderMinimumTime !== null && (t.placeholderConfig = new ki(tr([t.placeholderMinimumTime]))), (t.loadingMinimumTime !== null || t.loadingAfterTime !== null) && (t.loadingConfig = new ki(tr([t.loadingMinimumTime, t.loadingAfterTime])))); }
function Hv(n) { let e = new Map; function t(r) { if (e.has(r.xref))
    return e.get(r.xref); let i = new Wv; for (let o of r.create)
    if (!(!Bn(o) || o.localRefs === null)) {
        if (!Array.isArray(o.localRefs))
            throw new Error("LocalRefs were already processed, but were needed to resolve defer targets.");
        for (let a of o.localRefs)
            a.target === "" && i.targets.set(a.name, { xref: o.xref, slot: o.handle });
    } return e.set(r.xref, i), i; } function s(r, i, o) { switch (i.trigger.kind) {
    case ee.Idle:
    case ee.Never:
    case ee.Immediate:
    case ee.Timer: return;
    case ee.Hover:
    case ee.Interaction:
    case ee.Viewport:
        if (i.trigger.targetName === null) {
            if (o === null)
                throw new Error("defer on trigger with no target name must have a placeholder block");
            let c = n.views.get(o);
            if (c == null)
                throw new Error("AssertionError: could not find placeholder view for defer on trigger");
            for (let h of c.create)
                if (cr(h) && (Bn(h) || h.kind === u.Projection)) {
                    i.trigger.targetXref = h.xref, i.trigger.targetView = o, i.trigger.targetSlotViewSteps = -1, i.trigger.targetSlot = h.handle;
                    return;
                }
            return;
        }
        let a = o !== null ? n.views.get(o) : r, l = o !== null ? -1 : 0;
        for (; a !== null;) {
            let c = t(a);
            if (c.targets.has(i.trigger.targetName)) {
                let { xref: h, slot: p } = c.targets.get(i.trigger.targetName);
                i.trigger.targetXref = h, i.trigger.targetView = a.xref, i.trigger.targetSlotViewSteps = l, i.trigger.targetSlot = p;
                return;
            }
            a = a.parent !== null ? n.views.get(a.parent) : null, l++;
        }
        break;
    default: throw new Error(`Trigger kind ${i.trigger.kind} not handled`);
} } for (let r of n.units) {
    let i = new Map;
    for (let o of r.create)
        switch (o.kind) {
            case u.Defer:
                i.set(o.xref, o);
                break;
            case u.DeferOn:
                let a = i.get(o.defer);
                s(r, o, o.modifier === "hydrate" ? a.mainView : a.placeholderView);
                break;
        }
} }
var Wv = class {
    targets = new Map;
}, jv = new Map([[u.ElementEnd, [u.ElementStart, u.Element]], [u.ContainerEnd, [u.ContainerStart, u.Container]], [u.I18nEnd, [u.I18nStart, u.I18n]]]), zv = new Set([u.Pipe]);
function Gv(n) { for (let e of n.units)
    for (let t of e.create) {
        let s = jv.get(t.kind);
        if (s === void 0)
            continue;
        let [r, i] = s, o = t.prev;
        for (; o !== null && zv.has(o.kind);)
            o = o.prev;
        o !== null && o.kind === r && (o.kind = i, E.remove(t));
    } }
function Xv(n) { for (let e of n.units)
    for (let t of e.ops())
        ce(t, s => ew(s, { job: n }), U.None), ce(t, tw, U.None); }
function Je(n) { return n instanceof rn ? Je(n.expr) : n instanceof j ? Je(n.lhs) || Je(n.rhs) : n instanceof bt ? n.falseCase && Je(n.falseCase) ? !0 : Je(n.condition) || Je(n.trueCase) : n instanceof Hs ? Je(n.condition) : n instanceof Xt ? Je(n.expr) : n instanceof Xe ? Je(n.receiver) : n instanceof Vt ? Je(n.receiver) || Je(n.index) : n instanceof wt ? Je(n.expr) : n instanceof Ue || n instanceof Tt || n instanceof Et || n instanceof Es || n instanceof ws; }
function Yv(n) { let e = new Set; return _(n, t => (t instanceof Xt && e.add(t.xref), t), U.None), e; }
function Qv(n, e, t) { return _(n, s => { if (s instanceof Xt && e.has(s.xref)) {
    let r = new Ln(s.xref);
    return new Xt(r, r.xref);
} return s; }, U.None), n; }
function As(n, e, t) { let s; if (Je(n)) {
    let r = t.job.allocateXrefId();
    s = [new Xt(n, r), new Ln(r)];
}
else
    s = [n, n.clone()], Qv(s[1], Yv(s[0])); return new er(s[0], e(s[1])); }
function Zv(n) { return n instanceof Js || n instanceof Ks || n instanceof Es; }
function Jv(n) { return n instanceof Xe || n instanceof Vt || n instanceof Ue; }
function Tf(n) { return Zv(n) || Jv(n); }
function Kv(n) { if (Tf(n) && n.receiver instanceof er) {
    let e = n.receiver;
    for (; e.expr instanceof er;)
        e = e.expr;
    return e;
} return null; }
function ew(n, e) { if (!Tf(n))
    return n; let t = Kv(n); if (t) {
    if (n instanceof Ue)
        return t.expr = t.expr.callFn(n.args), n.receiver;
    if (n instanceof Xe)
        return t.expr = t.expr.prop(n.name), n.receiver;
    if (n instanceof Vt)
        return t.expr = t.expr.key(n.index), n.receiver;
    if (n instanceof Es)
        return t.expr = As(t.expr, s => s.callFn(n.args), e), n.receiver;
    if (n instanceof Js)
        return t.expr = As(t.expr, s => s.prop(n.name), e), n.receiver;
    if (n instanceof Ks)
        return t.expr = As(t.expr, s => s.key(n.index), e), n.receiver;
}
else {
    if (n instanceof Es)
        return As(n.receiver, s => s.callFn(n.args), e);
    if (n instanceof Js)
        return As(n.receiver, s => s.prop(n.name), e);
    if (n instanceof Ks)
        return As(n.receiver, s => s.key(n.index), e);
} return n; }
function tw(n) { return n instanceof er ? new wt(new bt(new j(x.Equals, n.guard, An), An, n.expr)) : n; }
var Zu = "\uFFFD", nw = "#", sw = "*", rw = "/", iw = ":", ow = "[", aw = "]", lw = "|";
function cw(n) { let e = new Map, t = new Map, s = new Map; for (let i of n.units)
    for (let o of i.create)
        switch (o.kind) {
            case u.I18nContext:
                let a = uw(n, o);
                i.create.push(a), e.set(o.xref, a), s.set(o.xref, o);
                break;
            case u.I18nStart:
                t.set(o.xref, o);
                break;
        } let r = null; for (let i of n.units)
    for (let o of i.create)
        switch (o.kind) {
            case u.IcuStart:
                r = o, E.remove(o);
                let a = s.get(o.context);
                if (a.contextKind !== Qn.Icu)
                    continue;
                let l = t.get(a.i18nBlock);
                if (l.context === a.xref)
                    continue;
                let c = t.get(l.root), h = e.get(c.context);
                if (h === void 0)
                    throw Error("AssertionError: ICU sub-message should belong to a root message.");
                let p = e.get(a.xref);
                p.messagePlaceholder = o.messagePlaceholder, h.subMessages.push(p.xref);
                break;
            case u.IcuEnd:
                r = null, E.remove(o);
                break;
            case u.IcuPlaceholder:
                if (r === null || r.context == null)
                    throw Error("AssertionError: Unexpected ICU placeholder outside of i18n context");
                e.get(r.context).postprocessingParams.set(o.name, d(hw(o))), E.remove(o);
                break;
        } }
function uw(n, e, t) { let s = Ju(e.params), r = Ju(e.postprocessingParams), i = [...e.params.values()].some(o => o.length > 1); return uv(n.allocateXrefId(), e.xref, e.i18nBlock, e.message, null, s, r, i); }
function hw(n) { if (n.strings.length !== n.expressionPlaceholders.length + 1)
    throw Error(`AssertionError: Invalid ICU placeholder with ${n.strings.length} strings and ${n.expressionPlaceholders.length} expressions`); let e = n.expressionPlaceholders.map(Bs); return n.strings.flatMap((t, s) => [t, e[s] || ""]).join(""); }
function Ju(n) { let e = new Map; for (let [t, s] of n) {
    let r = pw(s);
    r !== null && e.set(t, d(r));
} return e; }
function pw(n) { if (n.length === 0)
    return null; let e = n.map(t => Bs(t)); return e.length === 1 ? e[0] : `${ow}${e.join(lw)}${aw}`; }
function Bs(n) { if (n.flags & ne.ElementTag && n.flags & ne.TemplateTag) {
    if (typeof n.value != "object")
        throw Error("AssertionError: Expected i18n param value to have an element and template slot");
    let r = Bs(pe(S({}, n), { value: n.value.element, flags: n.flags & ~ne.TemplateTag })), i = Bs(pe(S({}, n), { value: n.value.template, flags: n.flags & ~ne.ElementTag }));
    return n.flags & ne.OpenTag && n.flags & ne.CloseTag ? `${i}${r}${i}` : n.flags & ne.CloseTag ? `${r}${i}` : `${i}${r}`;
} if (n.flags & ne.OpenTag && n.flags & ne.CloseTag)
    return `${Bs(pe(S({}, n), { flags: n.flags & ~ne.CloseTag }))}${Bs(pe(S({}, n), { flags: n.flags & ~ne.OpenTag }))}`; if (n.flags === ne.None)
    return `${n.value}`; let e = "", t = ""; n.flags & ne.ElementTag ? e = nw : n.flags & ne.TemplateTag && (e = sw), e !== "" && (t = n.flags & ne.CloseTag ? rw : ""); let s = n.subTemplateIndex === null ? "" : `${iw}${n.subTemplateIndex}`; return `${Zu}${t}${e}${n.value}${s}${Zu}`; }
function fw(n) { for (let e of n.units) {
    let t = new Map;
    for (let r of e.create) {
        if (cr(r)) {
            if (r.handle.slot === null)
                throw new Error("AssertionError: expected slots to have been allocated before generating advance() calls");
        }
        else
            continue;
        t.set(r.xref, r.handle.slot);
    }
    let s = 0;
    for (let r of e.update) {
        let i = null;
        if (Ei(r) ? i = r : de(r, a => { i === null && Ei(a) && (i = a); }), i === null)
            continue;
        if (!t.has(i.target))
            throw new Error(`AssertionError: reference to unknown slot for target ${i.target}`);
        let o = t.get(i.target);
        if (s !== o) {
            let a = o - s;
            if (a < 0)
                throw new Error("AssertionError: slot counter should never need to move backwards");
            E.insertBefore(Wg(a, i.sourceSpan), r), s = o;
        }
    }
} }
function dw(n) { for (let e of n.units)
    for (let t of e.update) {
        if (t.kind !== u.StoreLet)
            continue;
        let s = { kind: be.Identifier, name: null, identifier: t.declaredName, local: !0 };
        E.replace(t, gn(n.allocateXrefId(), s, new Si(t.target, t.value, t.sourceSpan), pt.None));
    } }
function mw(n) { let t = [], s = 0; for (let r of n.units)
    for (let i of r.create)
        i.kind === u.Projection && (t.push(i.selector), i.projectionSlotIndex = s++); if (t.length > 0) {
    let r = null;
    if (t.length > 1 || t[0] !== "*") {
        let i = t.map(o => o === "*" ? o : da(o));
        r = n.pool.getConstLiteral(tr(i), !0);
    }
    n.contentSelectors = n.pool.getConstLiteral(tr(t), !0), n.root.create.prepend([ov(r)]);
} }
function gw(n) { Cr(n.root, null); }
function Cr(n, e) { let t = Ku(n, e); for (let s of n.create)
    switch (s.kind) {
        case u.ConditionalCreate:
        case u.ConditionalBranchCreate:
        case u.Template:
            Cr(n.job.views.get(s.xref), t);
            break;
        case u.Projection:
            s.fallbackView !== null && Cr(n.job.views.get(s.fallbackView), t);
            break;
        case u.RepeaterCreate:
            Cr(n.job.views.get(s.xref), t), s.emptyView && Cr(n.job.views.get(s.emptyView), t), s.trackByOps !== null && s.trackByOps.prepend(Ar(n, t, !1));
            break;
        case u.Animation:
        case u.AnimationListener:
        case u.Listener:
        case u.TwoWayListener:
            s.handlerOps.prepend(Ar(n, t, !0));
            break;
    } n.update.prepend(Ar(n, t, !1)); for (let s of n.functions)
    s.ops.prepend(Ar(n, Ku(n, e), !0)); }
function Ku(n, e) { let t = { view: n.xref, viewContextVariable: { kind: be.Context, name: null, view: n.xref }, contextVariables: new Map, aliases: n.aliases, references: [], letDeclarations: [], parent: e }; for (let s of n.contextVariables.keys())
    t.contextVariables.set(s, { kind: be.Identifier, name: null, identifier: s, local: !1 }); for (let s of n.create)
    switch (s.kind) {
        case u.ElementStart:
        case u.ConditionalCreate:
        case u.ConditionalBranchCreate:
        case u.Template:
            if (!Array.isArray(s.localRefs))
                throw new Error("AssertionError: expected localRefs to be an array");
            for (let r = 0; r < s.localRefs.length; r++)
                t.references.push({ name: s.localRefs[r].name, targetId: s.xref, targetSlot: s.handle, offset: r, variable: { kind: be.Identifier, name: null, identifier: s.localRefs[r].name, local: !1 } });
            break;
        case u.DeclareLet:
            t.letDeclarations.push({ targetId: s.xref, targetSlot: s.handle, variable: { kind: be.Identifier, name: null, identifier: s.declaredName, local: !1 } });
            break;
    } return t; }
function Ar(n, e, t) { let s = []; e.view !== n.xref && s.push(gn(n.job.allocateXrefId(), e.viewContextVariable, new $o, pt.None)); let r = n.job.views.get(e.view); for (let [i, o] of r.contextVariables) {
    let a = new Dn(e.view), l = o === Af ? a : new Xe(a, o);
    s.push(gn(n.job.allocateXrefId(), e.contextVariables.get(i), l, pt.None));
} for (let i of r.aliases)
    s.push(gn(n.job.allocateXrefId(), i, i.expression.clone(), pt.AlwaysInline)); for (let i of e.references)
    s.push(gn(n.job.allocateXrefId(), i.variable, new Fo(i.targetId, i.targetSlot, i.offset), pt.None)); if (e.view !== n.xref || t)
    for (let i of e.letDeclarations)
        s.push(gn(n.job.allocateXrefId(), i.variable, new xi(i.targetId, i.targetSlot), pt.None)); return e.parent !== null && s.push(...Ar(n, e.parent, !1)), s; }
function vw(n) { for (let e of n.units)
    for (let t of e.ops())
        ce(t, s => s instanceof ki ? d(n.addConst(s.expr)) : s, U.None); }
var eh = "style.", th = "class.", ww = "style!", nh = "class!", sh = "!important";
function Ew(n) { for (let e of n.root.update)
    if (e.kind === u.Binding && e.bindingKind === b.Property)
        if (e.name.endsWith(sh) && (e.name = e.name.substring(0, e.name.length - sh.length)), e.name.startsWith(eh)) {
            e.bindingKind = b.StyleProperty, e.name = e.name.substring(eh.length), Sw(e.name) || (e.name = xw(e.name));
            let { property: t, suffix: s } = Da(e.name);
            e.name = t, e.unit = s;
        }
        else
            e.name.startsWith(ww) ? (e.bindingKind = b.StyleProperty, e.name = "style") : e.name.startsWith(th) ? (e.bindingKind = b.ClassName, e.name = Da(e.name.substring(th.length)).property) : e.name.startsWith(nh) && (e.bindingKind = b.ClassName, e.name = Da(e.name.substring(nh.length)).property); }
function Sw(n) { return n.startsWith("--"); }
function xw(n) { return n.replace(/[a-z][A-Z]/g, e => e.charAt(0) + "-" + e.charAt(1)).toLowerCase(); }
function Da(n) { let e = n.indexOf("!important"); e !== -1 && (n = e > 0 ? n.substring(0, e) : ""); let t = null, s = n, r = n.lastIndexOf("."); return r > 0 && (t = n.slice(r + 1), s = n.substring(0, r)), { property: s, suffix: t }; }
function Go(n, e = !1) { return ye(Object.keys(n).map(t => ({ key: t, quoted: e, value: n[t] }))); }
var Wl = class {
    visitText(e) { return e.value; }
    visitContainer(e) { return e.children.map(t => t.visit(this)).join(""); }
    visitIcu(e) { let t = Object.keys(e.cases).map(r => `${r} {${e.cases[r].visit(this)}}`); return `{${e.expressionPlaceholder}, ${e.type}, ${t.join(" ")}}`; }
    visitTagPlaceholder(e) { return e.isVoid ? this.formatPh(e.startName) : `${this.formatPh(e.startName)}${e.children.map(t => t.visit(this)).join("")}${this.formatPh(e.closeName)}`; }
    visitPlaceholder(e) { return this.formatPh(e.name); }
    visitBlockPlaceholder(e) { return `${this.formatPh(e.startName)}${e.children.map(t => t.visit(this)).join("")}${this.formatPh(e.closeName)}`; }
    visitIcuPlaceholder(e, t) { return this.formatPh(e.name); }
    formatPh(e) { return `{${Oi(e, !1)}}`; }
}, yw = new Wl;
function If(n) { return n.visit(yw); }
var an = class {
    sourceSpan;
    i18n;
    constructor(e, t) { this.sourceSpan = e, this.i18n = t; }
}, ln = class extends an {
    value;
    tokens;
    constructor(e, t, s, r) { super(t, r), this.value = e, this.tokens = s; }
    visit(e, t) { return e.visitText(this, t); }
}, En = class extends an {
    switchValue;
    type;
    cases;
    switchValueSourceSpan;
    constructor(e, t, s, r, i, o) { super(r, o), this.switchValue = e, this.type = t, this.cases = s, this.switchValueSourceSpan = i; }
    visit(e, t) { return e.visitExpansion(this, t); }
}, bi = class {
    value;
    expression;
    sourceSpan;
    valueSourceSpan;
    expSourceSpan;
    constructor(e, t, s, r, i) { this.value = e, this.expression = t, this.sourceSpan = s, this.valueSourceSpan = r, this.expSourceSpan = i; }
    visit(e, t) { return e.visitExpansionCase(this, t); }
}, Sn = class extends an {
    name;
    value;
    keySpan;
    valueSpan;
    valueTokens;
    constructor(e, t, s, r, i, o, a) { super(s, a), this.name = e, this.value = t, this.keySpan = r, this.valueSpan = i, this.valueTokens = o; }
    visit(e, t) { return e.visitAttribute(this, t); }
}, Me = class extends an {
    name;
    attrs;
    directives;
    children;
    isSelfClosing;
    startSourceSpan;
    endSourceSpan;
    isVoid;
    constructor(e, t, s, r, i, o, a, l = null, c, h) { super(o, h), this.name = e, this.attrs = t, this.directives = s, this.children = r, this.isSelfClosing = i, this.startSourceSpan = a, this.endSourceSpan = l, this.isVoid = c; }
    visit(e, t) { return e.visitElement(this, t); }
}, Mn = class {
    value;
    sourceSpan;
    constructor(e, t) { this.value = e, this.sourceSpan = t; }
    visit(e, t) { return e.visitComment(this, t); }
}, ut = class extends an {
    name;
    parameters;
    children;
    nameSpan;
    startSourceSpan;
    endSourceSpan;
    constructor(e, t, s, r, i, o, a = null, l) { super(r, l), this.name = e, this.parameters = t, this.children = s, this.nameSpan = i, this.startSourceSpan = o, this.endSourceSpan = a; }
    visit(e, t) { return e.visitBlock(this, t); }
}, Ae = class extends an {
    componentName;
    tagName;
    fullName;
    attrs;
    directives;
    children;
    isSelfClosing;
    startSourceSpan;
    endSourceSpan;
    constructor(e, t, s, r, i, o, a, l, c, h = null, p) { super(l, p), this.componentName = e, this.tagName = t, this.fullName = s, this.attrs = r, this.directives = i, this.children = o, this.isSelfClosing = a, this.startSourceSpan = c, this.endSourceSpan = h; }
    visit(e, t) { return e.visitComponent(this, t); }
}, Xo = class {
    name;
    attrs;
    sourceSpan;
    startSourceSpan;
    endSourceSpan;
    constructor(e, t, s, r, i = null) { this.name = e, this.attrs = t, this.sourceSpan = s, this.startSourceSpan = r, this.endSourceSpan = i; }
    visit(e, t) { return e.visitDirective(this, t); }
}, Yo = class {
    expression;
    sourceSpan;
    constructor(e, t) { this.expression = e, this.sourceSpan = t; }
    visit(e, t) { return e.visitBlockParameter(this, t); }
}, Qo = class {
    name;
    value;
    sourceSpan;
    nameSpan;
    valueSpan;
    constructor(e, t, s, r, i) { this.name = e, this.value = t, this.sourceSpan = s, this.nameSpan = r, this.valueSpan = i; }
    visit(e, t) { return e.visitLetDeclaration(this, t); }
};
function P(n, e, t = null) { let s = [], r = n.visit ? i => n.visit(i, t) || i.visit(n, t) : i => i.visit(n, t); return e.forEach(i => { let o = r(i); o && s.push(o); }), s; }
var rh = class {
    constructor() { }
    visitElement(e, t) { this.visitChildren(t, s => { s(e.attrs), s(e.directives), s(e.children); }); }
    visitAttribute(e, t) { }
    visitText(e, t) { }
    visitComment(e, t) { }
    visitExpansion(e, t) { return this.visitChildren(t, s => { s(e.cases); }); }
    visitExpansionCase(e, t) { }
    visitBlock(e, t) { this.visitChildren(t, s => { s(e.parameters), s(e.children); }); }
    visitBlockParameter(e, t) { }
    visitLetDeclaration(e, t) { }
    visitComponent(e, t) { this.visitChildren(t, s => { s(e.attrs), s(e.children); }); }
    visitDirective(e, t) { this.visitChildren(t, s => { s(e.attrs); }); }
    visitChildren(e, t) { let s = [], r = this; function i(o) { o && s.push(P(r, o, e)); } return t(i), Array.prototype.concat.apply([], s); }
}, Ti = { AElig: "\xC6", AMP: "&", amp: "&", Aacute: "\xC1", Abreve: "\u0102", Acirc: "\xC2", Acy: "\u0410", Afr: "\u{1D504}", Agrave: "\xC0", Alpha: "\u0391", Amacr: "\u0100", And: "\u2A53", Aogon: "\u0104", Aopf: "\u{1D538}", ApplyFunction: "\u2061", af: "\u2061", Aring: "\xC5", angst: "\xC5", Ascr: "\u{1D49C}", Assign: "\u2254", colone: "\u2254", coloneq: "\u2254", Atilde: "\xC3", Auml: "\xC4", Backslash: "\u2216", setminus: "\u2216", setmn: "\u2216", smallsetminus: "\u2216", ssetmn: "\u2216", Barv: "\u2AE7", Barwed: "\u2306", doublebarwedge: "\u2306", Bcy: "\u0411", Because: "\u2235", becaus: "\u2235", because: "\u2235", Bernoullis: "\u212C", Bscr: "\u212C", bernou: "\u212C", Beta: "\u0392", Bfr: "\u{1D505}", Bopf: "\u{1D539}", Breve: "\u02D8", breve: "\u02D8", Bumpeq: "\u224E", HumpDownHump: "\u224E", bump: "\u224E", CHcy: "\u0427", COPY: "\xA9", copy: "\xA9", Cacute: "\u0106", Cap: "\u22D2", CapitalDifferentialD: "\u2145", DD: "\u2145", Cayleys: "\u212D", Cfr: "\u212D", Ccaron: "\u010C", Ccedil: "\xC7", Ccirc: "\u0108", Cconint: "\u2230", Cdot: "\u010A", Cedilla: "\xB8", cedil: "\xB8", CenterDot: "\xB7", centerdot: "\xB7", middot: "\xB7", Chi: "\u03A7", CircleDot: "\u2299", odot: "\u2299", CircleMinus: "\u2296", ominus: "\u2296", CirclePlus: "\u2295", oplus: "\u2295", CircleTimes: "\u2297", otimes: "\u2297", ClockwiseContourIntegral: "\u2232", cwconint: "\u2232", CloseCurlyDoubleQuote: "\u201D", rdquo: "\u201D", rdquor: "\u201D", CloseCurlyQuote: "\u2019", rsquo: "\u2019", rsquor: "\u2019", Colon: "\u2237", Proportion: "\u2237", Colone: "\u2A74", Congruent: "\u2261", equiv: "\u2261", Conint: "\u222F", DoubleContourIntegral: "\u222F", ContourIntegral: "\u222E", conint: "\u222E", oint: "\u222E", Copf: "\u2102", complexes: "\u2102", Coproduct: "\u2210", coprod: "\u2210", CounterClockwiseContourIntegral: "\u2233", awconint: "\u2233", Cross: "\u2A2F", Cscr: "\u{1D49E}", Cup: "\u22D3", CupCap: "\u224D", asympeq: "\u224D", DDotrahd: "\u2911", DJcy: "\u0402", DScy: "\u0405", DZcy: "\u040F", Dagger: "\u2021", ddagger: "\u2021", Darr: "\u21A1", Dashv: "\u2AE4", DoubleLeftTee: "\u2AE4", Dcaron: "\u010E", Dcy: "\u0414", Del: "\u2207", nabla: "\u2207", Delta: "\u0394", Dfr: "\u{1D507}", DiacriticalAcute: "\xB4", acute: "\xB4", DiacriticalDot: "\u02D9", dot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", dblac: "\u02DD", DiacriticalGrave: "`", grave: "`", DiacriticalTilde: "\u02DC", tilde: "\u02DC", Diamond: "\u22C4", diam: "\u22C4", diamond: "\u22C4", DifferentialD: "\u2146", dd: "\u2146", Dopf: "\u{1D53B}", Dot: "\xA8", DoubleDot: "\xA8", die: "\xA8", uml: "\xA8", DotDot: "\u20DC", DotEqual: "\u2250", doteq: "\u2250", esdot: "\u2250", DoubleDownArrow: "\u21D3", Downarrow: "\u21D3", dArr: "\u21D3", DoubleLeftArrow: "\u21D0", Leftarrow: "\u21D0", lArr: "\u21D0", DoubleLeftRightArrow: "\u21D4", Leftrightarrow: "\u21D4", hArr: "\u21D4", iff: "\u21D4", DoubleLongLeftArrow: "\u27F8", Longleftarrow: "\u27F8", xlArr: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", Longleftrightarrow: "\u27FA", xhArr: "\u27FA", DoubleLongRightArrow: "\u27F9", Longrightarrow: "\u27F9", xrArr: "\u27F9", DoubleRightArrow: "\u21D2", Implies: "\u21D2", Rightarrow: "\u21D2", rArr: "\u21D2", DoubleRightTee: "\u22A8", vDash: "\u22A8", DoubleUpArrow: "\u21D1", Uparrow: "\u21D1", uArr: "\u21D1", DoubleUpDownArrow: "\u21D5", Updownarrow: "\u21D5", vArr: "\u21D5", DoubleVerticalBar: "\u2225", par: "\u2225", parallel: "\u2225", shortparallel: "\u2225", spar: "\u2225", DownArrow: "\u2193", ShortDownArrow: "\u2193", darr: "\u2193", downarrow: "\u2193", DownArrowBar: "\u2913", DownArrowUpArrow: "\u21F5", duarr: "\u21F5", DownBreve: "\u0311", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVector: "\u21BD", leftharpoondown: "\u21BD", lhard: "\u21BD", DownLeftVectorBar: "\u2956", DownRightTeeVector: "\u295F", DownRightVector: "\u21C1", rhard: "\u21C1", rightharpoondown: "\u21C1", DownRightVectorBar: "\u2957", DownTee: "\u22A4", top: "\u22A4", DownTeeArrow: "\u21A7", mapstodown: "\u21A7", Dscr: "\u{1D49F}", Dstrok: "\u0110", ENG: "\u014A", ETH: "\xD0", Eacute: "\xC9", Ecaron: "\u011A", Ecirc: "\xCA", Ecy: "\u042D", Edot: "\u0116", Efr: "\u{1D508}", Egrave: "\xC8", Element: "\u2208", in: "\u2208", isin: "\u2208", isinv: "\u2208", Emacr: "\u0112", EmptySmallSquare: "\u25FB", EmptyVerySmallSquare: "\u25AB", Eogon: "\u0118", Eopf: "\u{1D53C}", Epsilon: "\u0395", Equal: "\u2A75", EqualTilde: "\u2242", eqsim: "\u2242", esim: "\u2242", Equilibrium: "\u21CC", rightleftharpoons: "\u21CC", rlhar: "\u21CC", Escr: "\u2130", expectation: "\u2130", Esim: "\u2A73", Eta: "\u0397", Euml: "\xCB", Exists: "\u2203", exist: "\u2203", ExponentialE: "\u2147", ee: "\u2147", exponentiale: "\u2147", Fcy: "\u0424", Ffr: "\u{1D509}", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", blacksquare: "\u25AA", squarf: "\u25AA", squf: "\u25AA", Fopf: "\u{1D53D}", ForAll: "\u2200", forall: "\u2200", Fouriertrf: "\u2131", Fscr: "\u2131", GJcy: "\u0403", GT: ">", gt: ">", Gamma: "\u0393", Gammad: "\u03DC", Gbreve: "\u011E", Gcedil: "\u0122", Gcirc: "\u011C", Gcy: "\u0413", Gdot: "\u0120", Gfr: "\u{1D50A}", Gg: "\u22D9", ggg: "\u22D9", Gopf: "\u{1D53E}", GreaterEqual: "\u2265", ge: "\u2265", geq: "\u2265", GreaterEqualLess: "\u22DB", gel: "\u22DB", gtreqless: "\u22DB", GreaterFullEqual: "\u2267", gE: "\u2267", geqq: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", gl: "\u2277", gtrless: "\u2277", GreaterSlantEqual: "\u2A7E", geqslant: "\u2A7E", ges: "\u2A7E", GreaterTilde: "\u2273", gsim: "\u2273", gtrsim: "\u2273", Gscr: "\u{1D4A2}", Gt: "\u226B", NestedGreaterGreater: "\u226B", gg: "\u226B", HARDcy: "\u042A", Hacek: "\u02C7", caron: "\u02C7", Hat: "^", Hcirc: "\u0124", Hfr: "\u210C", Poincareplane: "\u210C", HilbertSpace: "\u210B", Hscr: "\u210B", hamilt: "\u210B", Hopf: "\u210D", quaternions: "\u210D", HorizontalLine: "\u2500", boxh: "\u2500", Hstrok: "\u0126", HumpEqual: "\u224F", bumpe: "\u224F", bumpeq: "\u224F", IEcy: "\u0415", IJlig: "\u0132", IOcy: "\u0401", Iacute: "\xCD", Icirc: "\xCE", Icy: "\u0418", Idot: "\u0130", Ifr: "\u2111", Im: "\u2111", image: "\u2111", imagpart: "\u2111", Igrave: "\xCC", Imacr: "\u012A", ImaginaryI: "\u2148", ii: "\u2148", Int: "\u222C", Integral: "\u222B", int: "\u222B", Intersection: "\u22C2", bigcap: "\u22C2", xcap: "\u22C2", InvisibleComma: "\u2063", ic: "\u2063", InvisibleTimes: "\u2062", it: "\u2062", Iogon: "\u012E", Iopf: "\u{1D540}", Iota: "\u0399", Iscr: "\u2110", imagline: "\u2110", Itilde: "\u0128", Iukcy: "\u0406", Iuml: "\xCF", Jcirc: "\u0134", Jcy: "\u0419", Jfr: "\u{1D50D}", Jopf: "\u{1D541}", Jscr: "\u{1D4A5}", Jsercy: "\u0408", Jukcy: "\u0404", KHcy: "\u0425", KJcy: "\u040C", Kappa: "\u039A", Kcedil: "\u0136", Kcy: "\u041A", Kfr: "\u{1D50E}", Kopf: "\u{1D542}", Kscr: "\u{1D4A6}", LJcy: "\u0409", LT: "<", lt: "<", Lacute: "\u0139", Lambda: "\u039B", Lang: "\u27EA", Laplacetrf: "\u2112", Lscr: "\u2112", lagran: "\u2112", Larr: "\u219E", twoheadleftarrow: "\u219E", Lcaron: "\u013D", Lcedil: "\u013B", Lcy: "\u041B", LeftAngleBracket: "\u27E8", lang: "\u27E8", langle: "\u27E8", LeftArrow: "\u2190", ShortLeftArrow: "\u2190", larr: "\u2190", leftarrow: "\u2190", slarr: "\u2190", LeftArrowBar: "\u21E4", larrb: "\u21E4", LeftArrowRightArrow: "\u21C6", leftrightarrows: "\u21C6", lrarr: "\u21C6", LeftCeiling: "\u2308", lceil: "\u2308", LeftDoubleBracket: "\u27E6", lobrk: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVector: "\u21C3", dharl: "\u21C3", downharpoonleft: "\u21C3", LeftDownVectorBar: "\u2959", LeftFloor: "\u230A", lfloor: "\u230A", LeftRightArrow: "\u2194", harr: "\u2194", leftrightarrow: "\u2194", LeftRightVector: "\u294E", LeftTee: "\u22A3", dashv: "\u22A3", LeftTeeArrow: "\u21A4", mapstoleft: "\u21A4", LeftTeeVector: "\u295A", LeftTriangle: "\u22B2", vartriangleleft: "\u22B2", vltri: "\u22B2", LeftTriangleBar: "\u29CF", LeftTriangleEqual: "\u22B4", ltrie: "\u22B4", trianglelefteq: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVector: "\u21BF", uharl: "\u21BF", upharpoonleft: "\u21BF", LeftUpVectorBar: "\u2958", LeftVector: "\u21BC", leftharpoonup: "\u21BC", lharu: "\u21BC", LeftVectorBar: "\u2952", LessEqualGreater: "\u22DA", leg: "\u22DA", lesseqgtr: "\u22DA", LessFullEqual: "\u2266", lE: "\u2266", leqq: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", lg: "\u2276", LessLess: "\u2AA1", LessSlantEqual: "\u2A7D", leqslant: "\u2A7D", les: "\u2A7D", LessTilde: "\u2272", lesssim: "\u2272", lsim: "\u2272", Lfr: "\u{1D50F}", Ll: "\u22D8", Lleftarrow: "\u21DA", lAarr: "\u21DA", Lmidot: "\u013F", LongLeftArrow: "\u27F5", longleftarrow: "\u27F5", xlarr: "\u27F5", LongLeftRightArrow: "\u27F7", longleftrightarrow: "\u27F7", xharr: "\u27F7", LongRightArrow: "\u27F6", longrightarrow: "\u27F6", xrarr: "\u27F6", Lopf: "\u{1D543}", LowerLeftArrow: "\u2199", swarr: "\u2199", swarrow: "\u2199", LowerRightArrow: "\u2198", searr: "\u2198", searrow: "\u2198", Lsh: "\u21B0", lsh: "\u21B0", Lstrok: "\u0141", Lt: "\u226A", NestedLessLess: "\u226A", ll: "\u226A", Map: "\u2905", Mcy: "\u041C", MediumSpace: "\u205F", Mellintrf: "\u2133", Mscr: "\u2133", phmmat: "\u2133", Mfr: "\u{1D510}", MinusPlus: "\u2213", mnplus: "\u2213", mp: "\u2213", Mopf: "\u{1D544}", Mu: "\u039C", NJcy: "\u040A", Nacute: "\u0143", Ncaron: "\u0147", Ncedil: "\u0145", Ncy: "\u041D", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", ZeroWidthSpace: "\u200B", NewLine: `
`, Nfr: "\u{1D511}", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nbsp: "\xA0", Nopf: "\u2115", naturals: "\u2115", Not: "\u2AEC", NotCongruent: "\u2262", nequiv: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", npar: "\u2226", nparallel: "\u2226", nshortparallel: "\u2226", nspar: "\u2226", NotElement: "\u2209", notin: "\u2209", notinva: "\u2209", NotEqual: "\u2260", ne: "\u2260", NotEqualTilde: "\u2242\u0338", nesim: "\u2242\u0338", NotExists: "\u2204", nexist: "\u2204", nexists: "\u2204", NotGreater: "\u226F", ngt: "\u226F", ngtr: "\u226F", NotGreaterEqual: "\u2271", nge: "\u2271", ngeq: "\u2271", NotGreaterFullEqual: "\u2267\u0338", ngE: "\u2267\u0338", ngeqq: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", nGtv: "\u226B\u0338", NotGreaterLess: "\u2279", ntgl: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", NotGreaterTilde: "\u2275", ngsim: "\u2275", NotHumpDownHump: "\u224E\u0338", nbump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", nbumpe: "\u224F\u0338", NotLeftTriangle: "\u22EA", nltri: "\u22EA", ntriangleleft: "\u22EA", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangleEqual: "\u22EC", nltrie: "\u22EC", ntrianglelefteq: "\u22EC", NotLess: "\u226E", nless: "\u226E", nlt: "\u226E", NotLessEqual: "\u2270", nle: "\u2270", nleq: "\u2270", NotLessGreater: "\u2278", ntlg: "\u2278", NotLessLess: "\u226A\u0338", nLtv: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", NotLessTilde: "\u2274", nlsim: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", NotPrecedes: "\u2280", npr: "\u2280", nprec: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", npre: "\u2AAF\u0338", npreceq: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", nprcue: "\u22E0", NotReverseElement: "\u220C", notni: "\u220C", notniva: "\u220C", NotRightTriangle: "\u22EB", nrtri: "\u22EB", ntriangleright: "\u22EB", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangleEqual: "\u22ED", nrtrie: "\u22ED", ntrianglerighteq: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", nsqsube: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", nsqsupe: "\u22E3", NotSubset: "\u2282\u20D2", nsubset: "\u2282\u20D2", vnsub: "\u2282\u20D2", NotSubsetEqual: "\u2288", nsube: "\u2288", nsubseteq: "\u2288", NotSucceeds: "\u2281", nsc: "\u2281", nsucc: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", nsce: "\u2AB0\u0338", nsucceq: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", nsccue: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", nsupset: "\u2283\u20D2", vnsup: "\u2283\u20D2", NotSupersetEqual: "\u2289", nsupe: "\u2289", nsupseteq: "\u2289", NotTilde: "\u2241", nsim: "\u2241", NotTildeEqual: "\u2244", nsime: "\u2244", nsimeq: "\u2244", NotTildeFullEqual: "\u2247", ncong: "\u2247", NotTildeTilde: "\u2249", nap: "\u2249", napprox: "\u2249", NotVerticalBar: "\u2224", nmid: "\u2224", nshortmid: "\u2224", nsmid: "\u2224", Nscr: "\u{1D4A9}", Ntilde: "\xD1", Nu: "\u039D", OElig: "\u0152", Oacute: "\xD3", Ocirc: "\xD4", Ocy: "\u041E", Odblac: "\u0150", Ofr: "\u{1D512}", Ograve: "\xD2", Omacr: "\u014C", Omega: "\u03A9", ohm: "\u03A9", Omicron: "\u039F", Oopf: "\u{1D546}", OpenCurlyDoubleQuote: "\u201C", ldquo: "\u201C", OpenCurlyQuote: "\u2018", lsquo: "\u2018", Or: "\u2A54", Oscr: "\u{1D4AA}", Oslash: "\xD8", Otilde: "\xD5", Otimes: "\u2A37", Ouml: "\xD6", OverBar: "\u203E", oline: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", tbrk: "\u23B4", OverParenthesis: "\u23DC", PartialD: "\u2202", part: "\u2202", Pcy: "\u041F", Pfr: "\u{1D513}", Phi: "\u03A6", Pi: "\u03A0", PlusMinus: "\xB1", plusmn: "\xB1", pm: "\xB1", Popf: "\u2119", primes: "\u2119", Pr: "\u2ABB", Precedes: "\u227A", pr: "\u227A", prec: "\u227A", PrecedesEqual: "\u2AAF", pre: "\u2AAF", preceq: "\u2AAF", PrecedesSlantEqual: "\u227C", prcue: "\u227C", preccurlyeq: "\u227C", PrecedesTilde: "\u227E", precsim: "\u227E", prsim: "\u227E", Prime: "\u2033", Product: "\u220F", prod: "\u220F", Proportional: "\u221D", prop: "\u221D", propto: "\u221D", varpropto: "\u221D", vprop: "\u221D", Pscr: "\u{1D4AB}", Psi: "\u03A8", QUOT: '"', quot: '"', Qfr: "\u{1D514}", Qopf: "\u211A", rationals: "\u211A", Qscr: "\u{1D4AC}", RBarr: "\u2910", drbkarow: "\u2910", REG: "\xAE", circledR: "\xAE", reg: "\xAE", Racute: "\u0154", Rang: "\u27EB", Rarr: "\u21A0", twoheadrightarrow: "\u21A0", Rarrtl: "\u2916", Rcaron: "\u0158", Rcedil: "\u0156", Rcy: "\u0420", Re: "\u211C", Rfr: "\u211C", real: "\u211C", realpart: "\u211C", ReverseElement: "\u220B", SuchThat: "\u220B", ni: "\u220B", niv: "\u220B", ReverseEquilibrium: "\u21CB", leftrightharpoons: "\u21CB", lrhar: "\u21CB", ReverseUpEquilibrium: "\u296F", duhar: "\u296F", Rho: "\u03A1", RightAngleBracket: "\u27E9", rang: "\u27E9", rangle: "\u27E9", RightArrow: "\u2192", ShortRightArrow: "\u2192", rarr: "\u2192", rightarrow: "\u2192", srarr: "\u2192", RightArrowBar: "\u21E5", rarrb: "\u21E5", RightArrowLeftArrow: "\u21C4", rightleftarrows: "\u21C4", rlarr: "\u21C4", RightCeiling: "\u2309", rceil: "\u2309", RightDoubleBracket: "\u27E7", robrk: "\u27E7", RightDownTeeVector: "\u295D", RightDownVector: "\u21C2", dharr: "\u21C2", downharpoonright: "\u21C2", RightDownVectorBar: "\u2955", RightFloor: "\u230B", rfloor: "\u230B", RightTee: "\u22A2", vdash: "\u22A2", RightTeeArrow: "\u21A6", map: "\u21A6", mapsto: "\u21A6", RightTeeVector: "\u295B", RightTriangle: "\u22B3", vartriangleright: "\u22B3", vrtri: "\u22B3", RightTriangleBar: "\u29D0", RightTriangleEqual: "\u22B5", rtrie: "\u22B5", trianglerighteq: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVector: "\u21BE", uharr: "\u21BE", upharpoonright: "\u21BE", RightUpVectorBar: "\u2954", RightVector: "\u21C0", rharu: "\u21C0", rightharpoonup: "\u21C0", RightVectorBar: "\u2953", Ropf: "\u211D", reals: "\u211D", RoundImplies: "\u2970", Rrightarrow: "\u21DB", rAarr: "\u21DB", Rscr: "\u211B", realine: "\u211B", Rsh: "\u21B1", rsh: "\u21B1", RuleDelayed: "\u29F4", SHCHcy: "\u0429", SHcy: "\u0428", SOFTcy: "\u042C", Sacute: "\u015A", Sc: "\u2ABC", Scaron: "\u0160", Scedil: "\u015E", Scirc: "\u015C", Scy: "\u0421", Sfr: "\u{1D516}", ShortUpArrow: "\u2191", UpArrow: "\u2191", uarr: "\u2191", uparrow: "\u2191", Sigma: "\u03A3", SmallCircle: "\u2218", compfn: "\u2218", Sopf: "\u{1D54A}", Sqrt: "\u221A", radic: "\u221A", Square: "\u25A1", squ: "\u25A1", square: "\u25A1", SquareIntersection: "\u2293", sqcap: "\u2293", SquareSubset: "\u228F", sqsub: "\u228F", sqsubset: "\u228F", SquareSubsetEqual: "\u2291", sqsube: "\u2291", sqsubseteq: "\u2291", SquareSuperset: "\u2290", sqsup: "\u2290", sqsupset: "\u2290", SquareSupersetEqual: "\u2292", sqsupe: "\u2292", sqsupseteq: "\u2292", SquareUnion: "\u2294", sqcup: "\u2294", Sscr: "\u{1D4AE}", Star: "\u22C6", sstarf: "\u22C6", Sub: "\u22D0", Subset: "\u22D0", SubsetEqual: "\u2286", sube: "\u2286", subseteq: "\u2286", Succeeds: "\u227B", sc: "\u227B", succ: "\u227B", SucceedsEqual: "\u2AB0", sce: "\u2AB0", succeq: "\u2AB0", SucceedsSlantEqual: "\u227D", sccue: "\u227D", succcurlyeq: "\u227D", SucceedsTilde: "\u227F", scsim: "\u227F", succsim: "\u227F", Sum: "\u2211", sum: "\u2211", Sup: "\u22D1", Supset: "\u22D1", Superset: "\u2283", sup: "\u2283", supset: "\u2283", SupersetEqual: "\u2287", supe: "\u2287", supseteq: "\u2287", THORN: "\xDE", TRADE: "\u2122", trade: "\u2122", TSHcy: "\u040B", TScy: "\u0426", Tab: "	", Tau: "\u03A4", Tcaron: "\u0164", Tcedil: "\u0162", Tcy: "\u0422", Tfr: "\u{1D517}", Therefore: "\u2234", there4: "\u2234", therefore: "\u2234", Theta: "\u0398", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", thinsp: "\u2009", Tilde: "\u223C", sim: "\u223C", thicksim: "\u223C", thksim: "\u223C", TildeEqual: "\u2243", sime: "\u2243", simeq: "\u2243", TildeFullEqual: "\u2245", cong: "\u2245", TildeTilde: "\u2248", ap: "\u2248", approx: "\u2248", asymp: "\u2248", thickapprox: "\u2248", thkap: "\u2248", Topf: "\u{1D54B}", TripleDot: "\u20DB", tdot: "\u20DB", Tscr: "\u{1D4AF}", Tstrok: "\u0166", Uacute: "\xDA", Uarr: "\u219F", Uarrocir: "\u2949", Ubrcy: "\u040E", Ubreve: "\u016C", Ucirc: "\xDB", Ucy: "\u0423", Udblac: "\u0170", Ufr: "\u{1D518}", Ugrave: "\xD9", Umacr: "\u016A", UnderBar: "_", lowbar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", bbrk: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", bigcup: "\u22C3", xcup: "\u22C3", UnionPlus: "\u228E", uplus: "\u228E", Uogon: "\u0172", Uopf: "\u{1D54C}", UpArrowBar: "\u2912", UpArrowDownArrow: "\u21C5", udarr: "\u21C5", UpDownArrow: "\u2195", updownarrow: "\u2195", varr: "\u2195", UpEquilibrium: "\u296E", udhar: "\u296E", UpTee: "\u22A5", bot: "\u22A5", bottom: "\u22A5", perp: "\u22A5", UpTeeArrow: "\u21A5", mapstoup: "\u21A5", UpperLeftArrow: "\u2196", nwarr: "\u2196", nwarrow: "\u2196", UpperRightArrow: "\u2197", nearr: "\u2197", nearrow: "\u2197", Upsi: "\u03D2", upsih: "\u03D2", Upsilon: "\u03A5", Uring: "\u016E", Uscr: "\u{1D4B0}", Utilde: "\u0168", Uuml: "\xDC", VDash: "\u22AB", Vbar: "\u2AEB", Vcy: "\u0412", Vdash: "\u22A9", Vdashl: "\u2AE6", Vee: "\u22C1", bigvee: "\u22C1", xvee: "\u22C1", Verbar: "\u2016", Vert: "\u2016", VerticalBar: "\u2223", mid: "\u2223", shortmid: "\u2223", smid: "\u2223", VerticalLine: "|", verbar: "|", vert: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", wr: "\u2240", wreath: "\u2240", VeryThinSpace: "\u200A", hairsp: "\u200A", Vfr: "\u{1D519}", Vopf: "\u{1D54D}", Vscr: "\u{1D4B1}", Vvdash: "\u22AA", Wcirc: "\u0174", Wedge: "\u22C0", bigwedge: "\u22C0", xwedge: "\u22C0", Wfr: "\u{1D51A}", Wopf: "\u{1D54E}", Wscr: "\u{1D4B2}", Xfr: "\u{1D51B}", Xi: "\u039E", Xopf: "\u{1D54F}", Xscr: "\u{1D4B3}", YAcy: "\u042F", YIcy: "\u0407", YUcy: "\u042E", Yacute: "\xDD", Ycirc: "\u0176", Ycy: "\u042B", Yfr: "\u{1D51C}", Yopf: "\u{1D550}", Yscr: "\u{1D4B4}", Yuml: "\u0178", ZHcy: "\u0416", Zacute: "\u0179", Zcaron: "\u017D", Zcy: "\u0417", Zdot: "\u017B", Zeta: "\u0396", Zfr: "\u2128", zeetrf: "\u2128", Zopf: "\u2124", integers: "\u2124", Zscr: "\u{1D4B5}", aacute: "\xE1", abreve: "\u0103", ac: "\u223E", mstpos: "\u223E", acE: "\u223E\u0333", acd: "\u223F", acirc: "\xE2", acy: "\u0430", aelig: "\xE6", afr: "\u{1D51E}", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", alpha: "\u03B1", amacr: "\u0101", amalg: "\u2A3F", and: "\u2227", wedge: "\u2227", andand: "\u2A55", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", angle: "\u2220", ange: "\u29A4", angmsd: "\u2221", measuredangle: "\u2221", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angzarr: "\u237C", aogon: "\u0105", aopf: "\u{1D552}", apE: "\u2A70", apacir: "\u2A6F", ape: "\u224A", approxeq: "\u224A", apid: "\u224B", apos: "'", aring: "\xE5", ascr: "\u{1D4B6}", ast: "*", midast: "*", atilde: "\xE3", auml: "\xE4", awint: "\u2A11", bNot: "\u2AED", backcong: "\u224C", bcong: "\u224C", backepsilon: "\u03F6", bepsi: "\u03F6", backprime: "\u2035", bprime: "\u2035", backsim: "\u223D", bsim: "\u223D", backsimeq: "\u22CD", bsime: "\u22CD", barvee: "\u22BD", barwed: "\u2305", barwedge: "\u2305", bbrktbrk: "\u23B6", bcy: "\u0431", bdquo: "\u201E", ldquor: "\u201E", bemptyv: "\u29B0", beta: "\u03B2", beth: "\u2136", between: "\u226C", twixt: "\u226C", bfr: "\u{1D51F}", bigcirc: "\u25EF", xcirc: "\u25EF", bigodot: "\u2A00", xodot: "\u2A00", bigoplus: "\u2A01", xoplus: "\u2A01", bigotimes: "\u2A02", xotime: "\u2A02", bigsqcup: "\u2A06", xsqcup: "\u2A06", bigstar: "\u2605", starf: "\u2605", bigtriangledown: "\u25BD", xdtri: "\u25BD", bigtriangleup: "\u25B3", xutri: "\u25B3", biguplus: "\u2A04", xuplus: "\u2A04", bkarow: "\u290D", rbarr: "\u290D", blacklozenge: "\u29EB", lozf: "\u29EB", blacktriangle: "\u25B4", utrif: "\u25B4", blacktriangledown: "\u25BE", dtrif: "\u25BE", blacktriangleleft: "\u25C2", ltrif: "\u25C2", blacktriangleright: "\u25B8", rtrif: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bnot: "\u2310", bopf: "\u{1D553}", bowtie: "\u22C8", boxDL: "\u2557", boxDR: "\u2554", boxDl: "\u2556", boxDr: "\u2553", boxH: "\u2550", boxHD: "\u2566", boxHU: "\u2569", boxHd: "\u2564", boxHu: "\u2567", boxUL: "\u255D", boxUR: "\u255A", boxUl: "\u255C", boxUr: "\u2559", boxV: "\u2551", boxVH: "\u256C", boxVL: "\u2563", boxVR: "\u2560", boxVh: "\u256B", boxVl: "\u2562", boxVr: "\u255F", boxbox: "\u29C9", boxdL: "\u2555", boxdR: "\u2552", boxdl: "\u2510", boxdr: "\u250C", boxhD: "\u2565", boxhU: "\u2568", boxhd: "\u252C", boxhu: "\u2534", boxminus: "\u229F", minusb: "\u229F", boxplus: "\u229E", plusb: "\u229E", boxtimes: "\u22A0", timesb: "\u22A0", boxuL: "\u255B", boxuR: "\u2558", boxul: "\u2518", boxur: "\u2514", boxv: "\u2502", boxvH: "\u256A", boxvL: "\u2561", boxvR: "\u255E", boxvh: "\u253C", boxvl: "\u2524", boxvr: "\u251C", brvbar: "\xA6", bscr: "\u{1D4B7}", bsemi: "\u204F", bsol: "\\", bsolb: "\u29C5", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bumpE: "\u2AAE", cacute: "\u0107", cap: "\u2229", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", capcup: "\u2A47", capdot: "\u2A40", caps: "\u2229\uFE00", caret: "\u2041", ccaps: "\u2A4D", ccaron: "\u010D", ccedil: "\xE7", ccirc: "\u0109", ccups: "\u2A4C", ccupssm: "\u2A50", cdot: "\u010B", cemptyv: "\u29B2", cent: "\xA2", cfr: "\u{1D520}", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", chi: "\u03C7", cir: "\u25CB", cirE: "\u29C3", circ: "\u02C6", circeq: "\u2257", cire: "\u2257", circlearrowleft: "\u21BA", olarr: "\u21BA", circlearrowright: "\u21BB", orarr: "\u21BB", circledS: "\u24C8", oS: "\u24C8", circledast: "\u229B", oast: "\u229B", circledcirc: "\u229A", ocir: "\u229A", circleddash: "\u229D", odash: "\u229D", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", clubs: "\u2663", clubsuit: "\u2663", colon: ":", comma: ",", commat: "@", comp: "\u2201", complement: "\u2201", congdot: "\u2A6D", copf: "\u{1D554}", copysr: "\u2117", crarr: "\u21B5", cross: "\u2717", cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", curlyeqprec: "\u22DE", cuesc: "\u22DF", curlyeqsucc: "\u22DF", cularr: "\u21B6", curvearrowleft: "\u21B6", cularrp: "\u293D", cup: "\u222A", cupbrcap: "\u2A48", cupcap: "\u2A46", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curvearrowright: "\u21B7", curarrm: "\u293C", curlyvee: "\u22CE", cuvee: "\u22CE", curlywedge: "\u22CF", cuwed: "\u22CF", curren: "\xA4", cwint: "\u2231", cylcty: "\u232D", dHar: "\u2965", dagger: "\u2020", daleth: "\u2138", dash: "\u2010", hyphen: "\u2010", dbkarow: "\u290F", rBarr: "\u290F", dcaron: "\u010F", dcy: "\u0434", ddarr: "\u21CA", downdownarrows: "\u21CA", ddotseq: "\u2A77", eDDot: "\u2A77", deg: "\xB0", delta: "\u03B4", demptyv: "\u29B1", dfisht: "\u297F", dfr: "\u{1D521}", diamondsuit: "\u2666", diams: "\u2666", digamma: "\u03DD", gammad: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", djcy: "\u0452", dlcorn: "\u231E", llcorner: "\u231E", dlcrop: "\u230D", dollar: "$", dopf: "\u{1D555}", doteqdot: "\u2251", eDot: "\u2251", dotminus: "\u2238", minusd: "\u2238", dotplus: "\u2214", plusdo: "\u2214", dotsquare: "\u22A1", sdotb: "\u22A1", drcorn: "\u231F", lrcorner: "\u231F", drcrop: "\u230C", dscr: "\u{1D4B9}", dscy: "\u0455", dsol: "\u29F6", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", triangledown: "\u25BF", dwangle: "\u29A6", dzcy: "\u045F", dzigrarr: "\u27FF", eacute: "\xE9", easter: "\u2A6E", ecaron: "\u011B", ecir: "\u2256", eqcirc: "\u2256", ecirc: "\xEA", ecolon: "\u2255", eqcolon: "\u2255", ecy: "\u044D", edot: "\u0117", efDot: "\u2252", fallingdotseq: "\u2252", efr: "\u{1D522}", eg: "\u2A9A", egrave: "\xE8", egs: "\u2A96", eqslantgtr: "\u2A96", egsdot: "\u2A98", el: "\u2A99", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", eqslantless: "\u2A95", elsdot: "\u2A97", emacr: "\u0113", empty: "\u2205", emptyset: "\u2205", emptyv: "\u2205", varnothing: "\u2205", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", eng: "\u014B", ensp: "\u2002", eogon: "\u0119", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", epsilon: "\u03B5", epsiv: "\u03F5", straightepsilon: "\u03F5", varepsilon: "\u03F5", equals: "=", equest: "\u225F", questeq: "\u225F", equivDD: "\u2A78", eqvparsl: "\u29E5", erDot: "\u2253", risingdotseq: "\u2253", erarr: "\u2971", escr: "\u212F", eta: "\u03B7", eth: "\xF0", euml: "\xEB", euro: "\u20AC", excl: "!", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", ffr: "\u{1D523}", filig: "\uFB01", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", fopf: "\u{1D557}", fork: "\u22D4", pitchfork: "\u22D4", forkv: "\u2AD9", fpartint: "\u2A0D", frac12: "\xBD", half: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", sfrown: "\u2322", fscr: "\u{1D4BB}", gEl: "\u2A8C", gtreqqless: "\u2A8C", gacute: "\u01F5", gamma: "\u03B3", gap: "\u2A86", gtrapprox: "\u2A86", gbreve: "\u011F", gcirc: "\u011D", gcy: "\u0433", gdot: "\u0121", gescc: "\u2AA9", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", gfr: "\u{1D524}", gimel: "\u2137", gjcy: "\u0453", glE: "\u2A92", gla: "\u2AA5", glj: "\u2AA4", gnE: "\u2269", gneqq: "\u2269", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gneq: "\u2A88", gnsim: "\u22E7", gopf: "\u{1D558}", gscr: "\u210A", gsime: "\u2A8E", gsiml: "\u2A90", gtcc: "\u2AA7", gtcir: "\u2A7A", gtdot: "\u22D7", gtrdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrarr: "\u2978", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", hardcy: "\u044A", harrcir: "\u2948", harrw: "\u21AD", leftrightsquigarrow: "\u21AD", hbar: "\u210F", hslash: "\u210F", planck: "\u210F", plankv: "\u210F", hcirc: "\u0125", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", mldr: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", hksearow: "\u2925", searhk: "\u2925", hkswarow: "\u2926", swarhk: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", larrhk: "\u21A9", hookrightarrow: "\u21AA", rarrhk: "\u21AA", hopf: "\u{1D559}", horbar: "\u2015", hscr: "\u{1D4BD}", hstrok: "\u0127", hybull: "\u2043", iacute: "\xED", icirc: "\xEE", icy: "\u0438", iecy: "\u0435", iexcl: "\xA1", ifr: "\u{1D526}", igrave: "\xEC", iiiint: "\u2A0C", qint: "\u2A0C", iiint: "\u222D", tint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", ijlig: "\u0133", imacr: "\u012B", imath: "\u0131", inodot: "\u0131", imof: "\u22B7", imped: "\u01B5", incare: "\u2105", infin: "\u221E", infintie: "\u29DD", intcal: "\u22BA", intercal: "\u22BA", intlarhk: "\u2A17", intprod: "\u2A3C", iprod: "\u2A3C", iocy: "\u0451", iogon: "\u012F", iopf: "\u{1D55A}", iota: "\u03B9", iquest: "\xBF", iscr: "\u{1D4BE}", isinE: "\u22F9", isindot: "\u22F5", isins: "\u22F4", isinsv: "\u22F3", itilde: "\u0129", iukcy: "\u0456", iuml: "\xEF", jcirc: "\u0135", jcy: "\u0439", jfr: "\u{1D527}", jmath: "\u0237", jopf: "\u{1D55B}", jscr: "\u{1D4BF}", jsercy: "\u0458", jukcy: "\u0454", kappa: "\u03BA", kappav: "\u03F0", varkappa: "\u03F0", kcedil: "\u0137", kcy: "\u043A", kfr: "\u{1D528}", kgreen: "\u0138", khcy: "\u0445", kjcy: "\u045C", kopf: "\u{1D55C}", kscr: "\u{1D4C0}", lAtail: "\u291B", lBarr: "\u290E", lEg: "\u2A8B", lesseqqgtr: "\u2A8B", lHar: "\u2962", lacute: "\u013A", laemptyv: "\u29B4", lambda: "\u03BB", langd: "\u2991", lap: "\u2A85", lessapprox: "\u2A85", laquo: "\xAB", larrbfs: "\u291F", larrfs: "\u291D", larrlp: "\u21AB", looparrowleft: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", leftarrowtail: "\u21A2", lat: "\u2AAB", latail: "\u2919", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lbbrk: "\u2772", lbrace: "{", lcub: "{", lbrack: "[", lsqb: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", lcaron: "\u013E", lcedil: "\u013C", lcy: "\u043B", ldca: "\u2936", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", leq: "\u2264", leftleftarrows: "\u21C7", llarr: "\u21C7", leftthreetimes: "\u22CB", lthree: "\u22CB", lescc: "\u2AA8", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessdot: "\u22D6", ltdot: "\u22D6", lfisht: "\u297C", lfr: "\u{1D529}", lgE: "\u2A91", lharul: "\u296A", lhblk: "\u2584", ljcy: "\u0459", llhard: "\u296B", lltri: "\u25FA", lmidot: "\u0140", lmoust: "\u23B0", lmoustache: "\u23B0", lnE: "\u2268", lneqq: "\u2268", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lneq: "\u2A87", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", longmapsto: "\u27FC", xmap: "\u27FC", looparrowright: "\u21AC", rarrlp: "\u21AC", lopar: "\u2985", lopf: "\u{1D55D}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", loz: "\u25CA", lozenge: "\u25CA", lpar: "(", lparlt: "\u2993", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", lsime: "\u2A8D", lsimg: "\u2A8F", lsquor: "\u201A", sbquo: "\u201A", lstrok: "\u0142", ltcc: "\u2AA6", ltcir: "\u2A79", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltrPar: "\u2996", ltri: "\u25C3", triangleleft: "\u25C3", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", mDDot: "\u223A", macr: "\xAF", strns: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", marker: "\u25AE", mcomma: "\u2A29", mcy: "\u043C", mdash: "\u2014", mfr: "\u{1D52A}", mho: "\u2127", micro: "\xB5", midcir: "\u2AF0", minus: "\u2212", minusdu: "\u2A2A", mlcp: "\u2ADB", models: "\u22A7", mopf: "\u{1D55E}", mscr: "\u{1D4C2}", mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nGg: "\u22D9\u0338", nGt: "\u226B\u20D2", nLeftarrow: "\u21CD", nlArr: "\u21CD", nLeftrightarrow: "\u21CE", nhArr: "\u21CE", nLl: "\u22D8\u0338", nLt: "\u226A\u20D2", nRightarrow: "\u21CF", nrArr: "\u21CF", nVDash: "\u22AF", nVdash: "\u22AE", nacute: "\u0144", nang: "\u2220\u20D2", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", natur: "\u266E", natural: "\u266E", ncap: "\u2A43", ncaron: "\u0148", ncedil: "\u0146", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", ncy: "\u043D", ndash: "\u2013", neArr: "\u21D7", nearhk: "\u2924", nedot: "\u2250\u0338", nesear: "\u2928", toea: "\u2928", nfr: "\u{1D52B}", nharr: "\u21AE", nleftrightarrow: "\u21AE", nhpar: "\u2AF2", nis: "\u22FC", nisd: "\u22FA", njcy: "\u045A", nlE: "\u2266\u0338", nleqq: "\u2266\u0338", nlarr: "\u219A", nleftarrow: "\u219A", nldr: "\u2025", nopf: "\u{1D55F}", not: "\xAC", notinE: "\u22F9\u0338", notindot: "\u22F5\u0338", notinvb: "\u22F7", notinvc: "\u22F6", notnivb: "\u22FE", notnivc: "\u22FD", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", nrarr: "\u219B", nrightarrow: "\u219B", nrarrc: "\u2933\u0338", nrarrw: "\u219D\u0338", nscr: "\u{1D4C3}", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsubseteqq: "\u2AC5\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338", nsupseteqq: "\u2AC6\u0338", ntilde: "\xF1", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvDash: "\u22AD", nvHarr: "\u2904", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwArr: "\u21D6", nwarhk: "\u2923", nwnear: "\u2927", oacute: "\xF3", ocirc: "\xF4", ocy: "\u043E", odblac: "\u0151", odiv: "\u2A38", odsold: "\u29BC", oelig: "\u0153", ofcir: "\u29BF", ofr: "\u{1D52C}", ogon: "\u02DB", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", olcir: "\u29BE", olcross: "\u29BB", olt: "\u29C0", omacr: "\u014D", omega: "\u03C9", omicron: "\u03BF", omid: "\u29B6", oopf: "\u{1D560}", opar: "\u29B7", operp: "\u29B9", or: "\u2228", vee: "\u2228", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", oscr: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oslash: "\xF8", osol: "\u2298", otilde: "\xF5", otimesas: "\u2A36", ouml: "\xF6", ovbar: "\u233D", para: "\xB6", parsim: "\u2AF3", parsl: "\u2AFD", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", pertenk: "\u2031", pfr: "\u{1D52D}", phi: "\u03C6", phiv: "\u03D5", straightphi: "\u03D5", varphi: "\u03D5", phone: "\u260E", pi: "\u03C0", piv: "\u03D6", varpi: "\u03D6", planckh: "\u210E", plus: "+", plusacir: "\u2A23", pluscir: "\u2A22", plusdu: "\u2A25", pluse: "\u2A72", plussim: "\u2A26", plustwo: "\u2A27", pointint: "\u2A15", popf: "\u{1D561}", pound: "\xA3", prE: "\u2AB3", prap: "\u2AB7", precapprox: "\u2AB7", precnapprox: "\u2AB9", prnap: "\u2AB9", precneqq: "\u2AB5", prnE: "\u2AB5", precnsim: "\u22E8", prnsim: "\u22E8", prime: "\u2032", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prurel: "\u22B0", pscr: "\u{1D4C5}", psi: "\u03C8", puncsp: "\u2008", qfr: "\u{1D52E}", qopf: "\u{1D562}", qprime: "\u2057", qscr: "\u{1D4C6}", quatint: "\u2A16", quest: "?", rAtail: "\u291C", rHar: "\u2964", race: "\u223D\u0331", racute: "\u0155", raemptyv: "\u29B3", rangd: "\u2992", range: "\u29A5", raquo: "\xBB", rarrap: "\u2975", rarrbfs: "\u2920", rarrc: "\u2933", rarrfs: "\u291E", rarrpl: "\u2945", rarrsim: "\u2974", rarrtl: "\u21A3", rightarrowtail: "\u21A3", rarrw: "\u219D", rightsquigarrow: "\u219D", ratail: "\u291A", ratio: "\u2236", rbbrk: "\u2773", rbrace: "}", rcub: "}", rbrack: "]", rsqb: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", rcaron: "\u0159", rcedil: "\u0157", rcy: "\u0440", rdca: "\u2937", rdldhar: "\u2969", rdsh: "\u21B3", rect: "\u25AD", rfisht: "\u297D", rfr: "\u{1D52F}", rharul: "\u296C", rho: "\u03C1", rhov: "\u03F1", varrho: "\u03F1", rightrightarrows: "\u21C9", rrarr: "\u21C9", rightthreetimes: "\u22CC", rthree: "\u22CC", ring: "\u02DA", rlm: "\u200F", rmoust: "\u23B1", rmoustache: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", ropar: "\u2986", ropf: "\u{1D563}", roplus: "\u2A2E", rotimes: "\u2A35", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rsaquo: "\u203A", rscr: "\u{1D4C7}", rtimes: "\u22CA", rtri: "\u25B9", triangleright: "\u25B9", rtriltri: "\u29CE", ruluhar: "\u2968", rx: "\u211E", sacute: "\u015B", scE: "\u2AB4", scap: "\u2AB8", succapprox: "\u2AB8", scaron: "\u0161", scedil: "\u015F", scirc: "\u015D", scnE: "\u2AB6", succneqq: "\u2AB6", scnap: "\u2ABA", succnapprox: "\u2ABA", scnsim: "\u22E9", succnsim: "\u22E9", scpolint: "\u2A13", scy: "\u0441", sdot: "\u22C5", sdote: "\u2A66", seArr: "\u21D8", sect: "\xA7", semi: ";", seswar: "\u2929", tosa: "\u2929", sext: "\u2736", sfr: "\u{1D530}", sharp: "\u266F", shchcy: "\u0449", shcy: "\u0448", shy: "\xAD", sigma: "\u03C3", sigmaf: "\u03C2", sigmav: "\u03C2", varsigma: "\u03C2", simdot: "\u2A6A", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", smashp: "\u2A33", smeparsl: "\u29E4", smile: "\u2323", ssmile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", softcy: "\u044C", sol: "/", solb: "\u29C4", solbar: "\u233F", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660", sqcaps: "\u2293\uFE00", sqcups: "\u2294\uFE00", sscr: "\u{1D4C8}", star: "\u2606", sub: "\u2282", subset: "\u2282", subE: "\u2AC5", subseteqq: "\u2AC5", subdot: "\u2ABD", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subsetneqq: "\u2ACB", subne: "\u228A", subsetneq: "\u228A", subplus: "\u2ABF", subrarr: "\u2979", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", supE: "\u2AC6", supseteqq: "\u2AC6", supdot: "\u2ABE", supdsub: "\u2AD8", supedot: "\u2AC4", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supsetneqq: "\u2ACC", supne: "\u228B", supsetneq: "\u228B", supplus: "\u2AC0", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swArr: "\u21D9", swnwar: "\u292A", szlig: "\xDF", target: "\u2316", tau: "\u03C4", tcaron: "\u0165", tcedil: "\u0163", tcy: "\u0442", telrec: "\u2315", tfr: "\u{1D531}", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", vartheta: "\u03D1", thorn: "\xFE", times: "\xD7", timesbar: "\u2A31", timesd: "\u2A30", topbot: "\u2336", topcir: "\u2AF1", topf: "\u{1D565}", topfork: "\u2ADA", tprime: "\u2034", triangle: "\u25B5", utri: "\u25B5", triangleq: "\u225C", trie: "\u225C", tridot: "\u25EC", triminus: "\u2A3A", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", tscr: "\u{1D4C9}", tscy: "\u0446", tshcy: "\u045B", tstrok: "\u0167", uHar: "\u2963", uacute: "\xFA", ubrcy: "\u045E", ubreve: "\u016D", ucirc: "\xFB", ucy: "\u0443", udblac: "\u0171", ufisht: "\u297E", ufr: "\u{1D532}", ugrave: "\xF9", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", umacr: "\u016B", uogon: "\u0173", uopf: "\u{1D566}", upsi: "\u03C5", upsilon: "\u03C5", upuparrows: "\u21C8", uuarr: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", uring: "\u016F", urtri: "\u25F9", uscr: "\u{1D4CA}", utdot: "\u22F0", utilde: "\u0169", uuml: "\xFC", uwangle: "\u29A7", vBar: "\u2AE8", vBarv: "\u2AE9", vangrt: "\u299C", varsubsetneq: "\u228A\uFE00", vsubne: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", vsubnE: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", vsupne: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vsupnE: "\u2ACC\uFE00", vcy: "\u0432", veebar: "\u22BB", veeeq: "\u225A", vellip: "\u22EE", vfr: "\u{1D533}", vopf: "\u{1D567}", vscr: "\u{1D4CB}", vzigzag: "\u299A", wcirc: "\u0175", wedbar: "\u2A5F", wedgeq: "\u2259", weierp: "\u2118", wp: "\u2118", wfr: "\u{1D534}", wopf: "\u{1D568}", wscr: "\u{1D4CC}", xfr: "\u{1D535}", xi: "\u03BE", xnis: "\u22FB", xopf: "\u{1D569}", xscr: "\u{1D4CD}", yacute: "\xFD", yacy: "\u044F", ycirc: "\u0177", ycy: "\u044B", yen: "\xA5", yfr: "\u{1D536}", yicy: "\u0457", yopf: "\u{1D56A}", yscr: "\u{1D4CE}", yucy: "\u044E", yuml: "\xFF", zacute: "\u017A", zcaron: "\u017E", zcy: "\u0437", zdot: "\u017C", zeta: "\u03B6", zfr: "\u{1D537}", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" }, Nf = "\uE500";
Ti.ngsp = Nf;
var jl = class {
    tokens;
    errors;
    nonNormalizedIcuExpressions;
    constructor(e, t, s) { this.tokens = e, this.errors = t, this.nonNormalizedIcuExpressions = s; }
};
function Cw(n, e, t, s = {}) { let r = new Gl(new gi(n, e), t, s); return r.tokenize(), new jl(Lw(r.tokens), r.errors, r.nonNormalizedIcuExpressions); }
var Aw = /\r\n?/g;
function ks(n) { return `Unexpected character "${n === _e ? "EOF" : String.fromCharCode(n)}"`; }
function ih(n) { return `Unknown entity "${n}" - use the "&#<decimal>;" or  "&#x<hex>;" syntax`; }
function kw(n, e) { return `Unable to parse entity "${e}" - ${n} character reference entities must end with ";"`; }
var zl = (function (n) { return n.HEX = "hexadecimal", n.DEC = "decimal", n; })(zl || {}), _w = ["@if", "@else", "@for", "@switch", "@case", "@default", "@empty", "@defer", "@placeholder", "@loading", "@error"], dr = { start: "{{", end: "}}" }, Gl = class {
    _getTagDefinition;
    _cursor;
    _tokenizeIcu;
    _leadingTriviaCodePoints;
    _currentTokenStart = null;
    _currentTokenType = null;
    _expansionCaseStack = [];
    _openDirectiveCount = 0;
    _inInterpolation = !1;
    _preserveLineEndings;
    _i18nNormalizeLineEndingsInICUs;
    _tokenizeBlocks;
    _tokenizeLet;
    _selectorlessEnabled;
    tokens = [];
    errors = [];
    nonNormalizedIcuExpressions = [];
    constructor(e, t, s) { this._getTagDefinition = t, this._tokenizeIcu = s.tokenizeExpansionForms || !1, this._leadingTriviaCodePoints = s.leadingTriviaChars && s.leadingTriviaChars.map(i => i.codePointAt(0) || 0); let r = s.range || { endPos: e.content.length, startPos: 0, startLine: 0, startCol: 0 }; this._cursor = s.escapedString ? new Xl(e, r) : new Zo(e, r), this._preserveLineEndings = s.preserveLineEndings || !1, this._i18nNormalizeLineEndingsInICUs = s.i18nNormalizeLineEndingsInICUs || !1, this._tokenizeBlocks = s.tokenizeBlocks ?? !0, this._tokenizeLet = s.tokenizeLet ?? !0, this._selectorlessEnabled = s.selectorlessEnabled ?? !1; try {
        this._cursor.init();
    }
    catch (i) {
        this.handleError(i);
    } }
    _processCarriageReturns(e) {
        return this._preserveLineEndings ? e : e.replace(Aw, `
`);
    }
    tokenize() { for (; this._cursor.peek() !== _e;) {
        let e = this._cursor.clone();
        try {
            this._attemptCharCode(Fs) ? this._attemptCharCode(Il) ? this._attemptCharCode(Ot) ? this._consumeCdata(e) : this._attemptCharCode(Po) ? this._consumeComment(e) : this._consumeDocType(e) : this._attemptCharCode(lt) ? this._consumeTagClose(e) : this._consumeTagOpen(e) : this._tokenizeLet && this._cursor.peek() === ys && !this._inInterpolation && this._isLetStart() ? this._consumeLetDeclaration(e) : this._tokenizeBlocks && this._isBlockStart() ? this._consumeBlockStart(e) : this._tokenizeBlocks && !this._inInterpolation && !this._isInExpansionCase() && !this._isInExpansionForm() && this._attemptCharCode(Re) ? this._consumeBlockEnd(e) : this._tokenizeIcu && this._tokenizeExpansionForm() || this._consumeWithInterpolation(5, 8, () => this._isTextEnd(), () => this._isTagStart());
        }
        catch (t) {
            this.handleError(t);
        }
    } this._beginToken(41), this._endToken([]); }
    _getBlockName() { let e = !1, t = this._cursor.clone(); return this._attemptCharCodeUntilFn(s => mi(s) ? !e : Pw(s) ? (e = !0, !1) : !0), this._cursor.getChars(t).trim(); }
    _consumeBlockStart(e) { this._requireCharCode(ys), this._beginToken(24, e); let t = this._endToken([this._getBlockName()]); if (t.parts[0] === "default never" && this._attemptCharCode(je)) {
        this._beginToken(25), this._endToken([]), this._beginToken(26), this._endToken([]);
        return;
    } if (this._cursor.peek() === $e)
        if (this._cursor.advance(), this._consumeBlockParameters(), this._attemptCharCodeUntilFn(oe), this._attemptCharCode(ge))
            this._attemptCharCodeUntilFn(oe);
        else {
            t.type = 28;
            return;
        } this._attemptCharCode(ht) ? (this._beginToken(25), this._endToken([])) : this._isBlockStart() && (t.parts[0] === "case" || t.parts[0] === "default") ? (this._beginToken(25), this._endToken([]), this._beginToken(26), this._endToken([])) : t.type = 28; }
    _consumeBlockEnd(e) { this._beginToken(26, e), this._endToken([]); }
    _consumeBlockParameters() { for (this._attemptCharCodeUntilFn(ah); this._cursor.peek() !== ge && this._cursor.peek() !== _e;) {
        this._beginToken(27);
        let e = this._cursor.clone(), t = null, s = 0;
        for (; this._cursor.peek() !== je && this._cursor.peek() !== _e || t !== null;) {
            let r = this._cursor.peek();
            if (r === ts)
                this._cursor.advance();
            else if (r === t)
                t = null;
            else if (t === null && Ir(r))
                t = r;
            else if (r === $e && t === null)
                s++;
            else if (r === ge && t === null) {
                if (s === 0)
                    break;
                s > 0 && s--;
            }
            this._cursor.advance();
        }
        this._endToken([this._cursor.getChars(e)]), this._attemptCharCodeUntilFn(ah);
    } }
    _consumeLetDeclaration(e) { if (this._requireStr("@let"), this._beginToken(29, e), mi(this._cursor.peek()))
        this._attemptCharCodeUntilFn(oe);
    else {
        let r = this._endToken([this._cursor.getChars(e)]);
        r.type = 32;
        return;
    } let t = this._endToken([this._getLetDeclarationName()]); if (this._attemptCharCodeUntilFn(oe), !this._attemptCharCode(Ce)) {
        t.type = 32;
        return;
    } this._attemptCharCodeUntilFn(r => oe(r) && !Lo(r)), this._consumeLetDeclarationValue(), this._cursor.peek() === je ? (this._beginToken(31), this._endToken([]), this._cursor.advance()) : (t.type = 32, t.sourceSpan = this._cursor.getSpan(e)); }
    _getLetDeclarationName() { let e = this._cursor.clone(), t = !1; return this._attemptCharCodeUntilFn(s => Nn(s) || s === Ea || s === On || t && ct(s) ? (t = !0, !1) : !0), this._cursor.getChars(e).trim(); }
    _consumeLetDeclarationValue() { let e = this._cursor.clone(); for (this._beginToken(30, e); this._cursor.peek() !== _e;) {
        let t = this._cursor.peek();
        if (t === je)
            break;
        Ir(t) && (this._cursor.advance(), this._attemptCharCodeUntilFn(s => s === ts ? (this._cursor.advance(), !1) : s === t)), this._cursor.advance();
    } this._endToken([this._cursor.getChars(e)]); }
    _tokenizeExpansionForm() { if (this.isExpansionFormStart())
        return this._consumeExpansionFormStart(), !0; if (Nw(this._cursor.peek()) && this._isInExpansionForm())
        return this._consumeExpansionCaseStart(), !0; if (this._cursor.peek() === Re) {
        if (this._isInExpansionCase())
            return this._consumeExpansionCaseEnd(), !0;
        if (this._isInExpansionForm())
            return this._consumeExpansionFormEnd(), !0;
    } return !1; }
    _beginToken(e, t = this._cursor.clone()) { this._currentTokenStart = t, this._currentTokenType = e; }
    _endToken(e, t) { if (this._currentTokenStart === null)
        throw new N(this._cursor.getSpan(t), "Programming error - attempted to end a token when there was no start to the token"); if (this._currentTokenType === null)
        throw new N(this._cursor.getSpan(this._currentTokenStart), "Programming error - attempted to end a token which has no token type"); let s = { type: this._currentTokenType, parts: e, sourceSpan: (t ?? this._cursor).getSpan(this._currentTokenStart, this._leadingTriviaCodePoints) }; return this.tokens.push(s), this._currentTokenStart = null, this._currentTokenType = null, s; }
    _createError(e, t) { this._isInExpansionForm() && (e += ` (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)`); let s = new N(t, e); return this._currentTokenStart = null, this._currentTokenType = null, s; }
    handleError(e) { if (e instanceof Ii && (e = this._createError(e.msg, this._cursor.getSpan(e.cursor))), e instanceof N)
        this.errors.push(e);
    else
        throw e; }
    _attemptCharCode(e) { return this._cursor.peek() === e ? (this._cursor.advance(), !0) : !1; }
    _attemptCharCodeCaseInsensitive(e) { return Dw(this._cursor.peek(), e) ? (this._cursor.advance(), !0) : !1; }
    _requireCharCode(e) { let t = this._cursor.clone(); if (!this._attemptCharCode(e))
        throw this._createError(ks(this._cursor.peek()), this._cursor.getSpan(t)); }
    _attemptStr(e) { let t = e.length; if (this._cursor.charsLeft() < t)
        return !1; let s = this._cursor.clone(); for (let r = 0; r < t; r++)
        if (!this._attemptCharCode(e.charCodeAt(r)))
            return this._cursor = s, !1; return !0; }
    _attemptStrCaseInsensitive(e) { for (let t = 0; t < e.length; t++)
        if (!this._attemptCharCodeCaseInsensitive(e.charCodeAt(t)))
            return !1; return !0; }
    _requireStr(e) { let t = this._cursor.clone(); if (!this._attemptStr(e))
        throw this._createError(ks(this._cursor.peek()), this._cursor.getSpan(t)); }
    _attemptCharCodeUntilFn(e) { for (; !e(this._cursor.peek());)
        this._cursor.advance(); }
    _requireCharCodeUntilFn(e, t) { let s = this._cursor.clone(); if (this._attemptCharCodeUntilFn(e), this._cursor.diff(s) < t)
        throw this._createError(ks(this._cursor.peek()), this._cursor.getSpan(s)); }
    _attemptUntilChar(e) { for (; this._cursor.peek() !== e;)
        this._cursor.advance(); }
    _readChar() { let e = String.fromCodePoint(this._cursor.peek()); return this._cursor.advance(), e; }
    _peekStr(e) { let t = e.length; if (this._cursor.charsLeft() < t)
        return !1; let s = this._cursor.clone(); for (let r = 0; r < t; r++) {
        if (s.peek() !== e.charCodeAt(r))
            return !1;
        s.advance();
    } return !0; }
    _isBlockStart() { return this._cursor.peek() === ys && _w.some(e => this._peekStr(e)); }
    _isLetStart() { return this._cursor.peek() === ys && this._peekStr("@let"); }
    _consumeEntity(e) { this._beginToken(9); let t = this._cursor.clone(); if (this._cursor.advance(), this._attemptCharCode(Qp)) {
        let s = this._attemptCharCode(rf) || this._attemptCharCode(jm), r = this._cursor.clone();
        if (this._attemptCharCodeUntilFn(Tw), this._cursor.peek() != je) {
            this._cursor.advance();
            let o = s ? zl.HEX : zl.DEC;
            throw this._createError(kw(o, this._cursor.getChars(t)), this._cursor.getSpan());
        }
        let i = this._cursor.getChars(r);
        this._cursor.advance();
        try {
            let o = parseInt(i, s ? 16 : 10);
            this._endToken([String.fromCodePoint(o), this._cursor.getChars(t)]);
        }
        catch {
            throw this._createError(ih(this._cursor.getChars(t)), this._cursor.getSpan());
        }
    }
    else {
        let s = this._cursor.clone();
        if (this._attemptCharCodeUntilFn(Iw), this._cursor.peek() != je)
            this._beginToken(e, t), this._cursor = s, this._endToken(["&"]);
        else {
            let r = this._cursor.getChars(s);
            this._cursor.advance();
            let i = Ti.hasOwnProperty(r) && Ti[r];
            if (!i)
                throw this._createError(ih(r), this._cursor.getSpan(t));
            this._endToken([i, `&${r};`]);
        }
    } }
    _consumeRawText(e, t) { this._beginToken(e ? 6 : 7); let s = []; for (;;) {
        let r = this._cursor.clone(), i = t();
        if (this._cursor = r, i)
            break;
        e && this._cursor.peek() === Do ? (this._endToken([this._processCarriageReturns(s.join(""))]), s.length = 0, this._consumeEntity(6), this._beginToken(6)) : s.push(this._readChar());
    } this._endToken([this._processCarriageReturns(s.join(""))]); }
    _consumeComment(e) { this._beginToken(10, e), this._requireCharCode(Po), this._endToken([]), this._consumeRawText(!1, () => this._attemptStr("-->")), this._beginToken(11), this._requireStr("-->"), this._endToken([]); }
    _consumeCdata(e) { this._beginToken(12, e), this._requireStr("CDATA["), this._endToken([]), this._consumeRawText(!1, () => this._attemptStr("]]>")), this._beginToken(13), this._requireStr("]]>"), this._endToken([]); }
    _consumeDocType(e) { this._beginToken(18, e); let t = this._cursor.clone(); this._attemptUntilChar(Ke); let s = this._cursor.getChars(t); this._cursor.advance(), this._endToken([s]); }
    _consumePrefixAndName(e) { let t = this._cursor.clone(), s = ""; for (; this._cursor.peek() !== Rt && !bw(this._cursor.peek());)
        this._cursor.advance(); let r; this._cursor.peek() === Rt ? (s = this._cursor.getChars(t), this._cursor.advance(), r = this._cursor.clone()) : r = t, this._requireCharCodeUntilFn(e, s === "" ? 0 : 1); let i = this._cursor.getChars(r); return [s, i]; }
    _consumeTagOpen(e) { let t, s, r, i; try {
        if (this._selectorlessEnabled && ji(this._cursor.peek()))
            i = this._consumeComponentOpenStart(e), [r, s, t] = i.parts, s && (r += `:${s}`), t && (r += `:${t}`), this._attemptCharCodeUntilFn(oe);
        else {
            if (!Nn(this._cursor.peek()))
                throw this._createError(ks(this._cursor.peek()), this._cursor.getSpan(e));
            i = this._consumeTagOpenStart(e), s = i.parts[0], t = r = i.parts[1], this._attemptCharCodeUntilFn(oe);
        }
        for (; !ch(this._cursor.peek());)
            if (this._selectorlessEnabled && this._cursor.peek() === ys) {
                let a = this._cursor.clone(), l = a.clone();
                l.advance(), ji(l.peek()) && this._consumeDirective(a, l);
            }
            else
                this._consumeAttribute();
        i.type === 33 ? this._consumeComponentOpenEnd() : this._consumeTagOpenEnd();
    }
    catch (a) {
        if (a instanceof N) {
            i ? i.type = i.type === 33 ? 37 : 4 : (this._beginToken(5, e), this._endToken(["<"]));
            return;
        }
        throw a;
    } let o = this._getTagDefinition(t).getContentType(s); o === Bt.RAW_TEXT ? this._consumeRawTextWithTagClose(i, r, !1) : o === Bt.ESCAPABLE_RAW_TEXT && this._consumeRawTextWithTagClose(i, r, !0); }
    _consumeRawTextWithTagClose(e, t, s) { this._consumeRawText(s, () => !this._attemptCharCode(Fs) || !this._attemptCharCode(lt) || (this._attemptCharCodeUntilFn(oe), !this._attemptStrCaseInsensitive(t)) ? !1 : (this._attemptCharCodeUntilFn(oe), this._attemptCharCode(Ke))), this._beginToken(e.type === 33 ? 36 : 3), this._requireCharCodeUntilFn(r => r === Ke, 3), this._cursor.advance(), this._endToken(e.parts); }
    _consumeTagOpenStart(e) { this._beginToken(0, e); let t = this._consumePrefixAndName(qn); return this._endToken(t); }
    _consumeComponentOpenStart(e) { this._beginToken(33, e); let t = this._consumeComponentName(); return this._endToken(t); }
    _consumeComponentName() { let e = this._cursor.clone(); for (; lh(this._cursor.peek());)
        this._cursor.advance(); let t = this._cursor.getChars(e), s = "", r = ""; return this._cursor.peek() === Rt && (this._cursor.advance(), [s, r] = this._consumePrefixAndName(qn)), [t, s, r]; }
    _consumeAttribute() { this._consumeAttributeName(), this._attemptCharCodeUntilFn(oe), this._attemptCharCode(Ce) && (this._attemptCharCodeUntilFn(oe), this._consumeAttributeValue()), this._attemptCharCodeUntilFn(oe); }
    _consumeAttributeName() { let e = this._cursor.peek(); if (e === di || e === fi)
        throw this._createError(ks(e), this._cursor.getSpan()); this._beginToken(14); let t; if (this._openDirectiveCount > 0) {
        let r = 0;
        t = i => { if (this._openDirectiveCount > 0) {
            if (i === $e)
                r++;
            else if (i === ge) {
                if (r === 0)
                    return !0;
                r--;
            }
        } return qn(i); };
    }
    else if (e === Ot) {
        let r = 0;
        t = i => (i === Ot ? r++ : i === Zt && r--, r <= 0 ? qn(i) : Lo(i));
    }
    else
        t = qn; let s = this._consumePrefixAndName(t); this._endToken(s); }
    _consumeAttributeValue() { if (this._cursor.peek() === di || this._cursor.peek() === fi) {
        let e = this._cursor.peek();
        this._consumeQuote(e);
        let t = () => this._cursor.peek() === e;
        this._consumeWithInterpolation(16, 17, t, t), this._consumeQuote(e);
    }
    else {
        let e = () => qn(this._cursor.peek());
        this._consumeWithInterpolation(16, 17, e, e);
    } }
    _consumeQuote(e) { this._beginToken(15), this._requireCharCode(e), this._endToken([String.fromCodePoint(e)]); }
    _consumeTagOpenEnd() { let e = this._attemptCharCode(lt) ? 2 : 1; this._beginToken(e), this._requireCharCode(Ke), this._endToken([]); }
    _consumeComponentOpenEnd() { let e = this._attemptCharCode(lt) ? 35 : 34; this._beginToken(e), this._requireCharCode(Ke), this._endToken([]); }
    _consumeTagClose(e) { if (this._selectorlessEnabled) {
        let s = e.clone();
        for (; s.peek() !== Ke && !ji(s.peek());)
            s.advance();
        if (ji(s.peek())) {
            this._beginToken(36, e);
            let r = this._consumeComponentName();
            this._attemptCharCodeUntilFn(oe), this._requireCharCode(Ke), this._endToken(r);
            return;
        }
    } this._beginToken(3, e), this._attemptCharCodeUntilFn(oe); let t = this._consumePrefixAndName(qn); this._attemptCharCodeUntilFn(oe), this._requireCharCode(Ke), this._endToken(t); }
    _consumeExpansionFormStart() { this._beginToken(19), this._requireCharCode(ht), this._endToken([]), this._expansionCaseStack.push(19), this._beginToken(7); let e = this._readUntil(De), t = this._processCarriageReturns(e); if (this._i18nNormalizeLineEndingsInICUs)
        this._endToken([t]);
    else {
        let r = this._endToken([e]);
        t !== e && this.nonNormalizedIcuExpressions.push(r);
    } this._requireCharCode(De), this._attemptCharCodeUntilFn(oe), this._beginToken(7); let s = this._readUntil(De); this._endToken([s]), this._requireCharCode(De), this._attemptCharCodeUntilFn(oe); }
    _consumeExpansionCaseStart() { this._beginToken(20); let e = this._readUntil(ht).trim(); this._endToken([e]), this._attemptCharCodeUntilFn(oe), this._beginToken(21), this._requireCharCode(ht), this._endToken([]), this._attemptCharCodeUntilFn(oe), this._expansionCaseStack.push(21); }
    _consumeExpansionCaseEnd() { this._beginToken(22), this._requireCharCode(Re), this._endToken([]), this._attemptCharCodeUntilFn(oe), this._expansionCaseStack.pop(); }
    _consumeExpansionFormEnd() { this._beginToken(23), this._requireCharCode(Re), this._endToken([]), this._expansionCaseStack.pop(); }
    _consumeWithInterpolation(e, t, s, r) { this._beginToken(e); let i = []; for (; !s();) {
        let o = this._cursor.clone();
        this._attemptStr(dr.start) ? (this._endToken([this._processCarriageReturns(i.join(""))], o), i.length = 0, this._consumeInterpolation(t, o, r), this._beginToken(e)) : this._cursor.peek() === Do ? (this._endToken([this._processCarriageReturns(i.join(""))]), i.length = 0, this._consumeEntity(e), this._beginToken(e)) : i.push(this._readChar());
    } this._inInterpolation = !1, this._endToken([this._processCarriageReturns(i.join(""))]); }
    _consumeInterpolation(e, t, s) { let r = []; this._beginToken(e, t), r.push(dr.start); let i = this._cursor.clone(), o = null, a = !1; for (; this._cursor.peek() !== _e && (s === null || !s());) {
        let l = this._cursor.clone();
        if (this._isTagStart()) {
            this._cursor = l, r.push(this._getProcessedChars(i, l)), this._endToken(r);
            return;
        }
        if (o === null)
            if (this._attemptStr(dr.end)) {
                r.push(this._getProcessedChars(i, l)), r.push(dr.end), this._endToken(r);
                return;
            }
            else
                this._attemptStr("//") && (a = !0);
        let c = this._cursor.peek();
        this._cursor.advance(), c === ts ? this._cursor.advance() : c === o ? o = null : !a && o === null && Ir(c) && (o = c);
    } r.push(this._getProcessedChars(i, this._cursor)), this._endToken(r); }
    _consumeDirective(e, t) { for (this._requireCharCode(ys), this._cursor.advance(); lh(this._cursor.peek());)
        this._cursor.advance(); this._beginToken(38, e); let s = this._cursor.getChars(t); if (this._endToken([s]), this._attemptCharCodeUntilFn(oe), this._cursor.peek() === $e) {
        for (this._openDirectiveCount++, this._beginToken(39), this._cursor.advance(), this._endToken([]), this._attemptCharCodeUntilFn(oe); !ch(this._cursor.peek()) && this._cursor.peek() !== ge;)
            this._consumeAttribute();
        if (this._attemptCharCodeUntilFn(oe), this._openDirectiveCount--, this._cursor.peek() !== ge) {
            if (this._cursor.peek() === Ke || this._cursor.peek() === lt)
                return;
            throw this._createError(ks(this._cursor.peek()), this._cursor.getSpan(e));
        }
        this._beginToken(40), this._cursor.advance(), this._endToken([]), this._attemptCharCodeUntilFn(oe);
    } }
    _getProcessedChars(e, t) { return this._processCarriageReturns(t.getChars(e)); }
    _isTextEnd() { return !!(this._isTagStart() || this._cursor.peek() === _e || this._tokenizeIcu && !this._inInterpolation && (this.isExpansionFormStart() || this._cursor.peek() === Re && this._isInExpansionCase()) || this._tokenizeBlocks && !this._inInterpolation && !this._isInExpansion() && (this._isBlockStart() || this._isLetStart() || this._cursor.peek() === Re)); }
    _isTagStart() { if (this._cursor.peek() === Fs) {
        let e = this._cursor.clone();
        e.advance();
        let t = e.peek();
        if (ds <= t && t <= Vi || $n <= t && t <= ar || t === lt || t === Il)
            return !0;
    } return !1; }
    _readUntil(e) { let t = this._cursor.clone(); return this._attemptUntilChar(e), this._cursor.getChars(t); }
    _isInExpansion() { return this._isInExpansionCase() || this._isInExpansionForm(); }
    _isInExpansionCase() { return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 21; }
    _isInExpansionForm() { return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 19; }
    isExpansionFormStart() { if (this._cursor.peek() !== ht)
        return !1; let e = this._cursor.clone(), t = this._attemptStr(dr.start); return this._cursor = e, !t; }
};
function oe(n) { return !mi(n) || n === _e; }
function qn(n) { return mi(n) || n === Ke || n === Fs || n === lt || n === di || n === fi || n === Ce || n === _e; }
function bw(n) { return (n < ds || Vi < n) && (n < $n || ar < n) && (n < su || n > Jp); }
function Tw(n) { return n === je || n === _e || !Ym(n); }
function Iw(n) { return n === je || n === _e || !(Nn(n) || ct(n)); }
function Nw(n) { return n !== Re; }
function Dw(n, e) { return oh(n) === oh(e); }
function oh(n) { return n >= ds && n <= Vi ? n - ds + $n : n; }
function Pw(n) { return Nn(n) || ct(n) || n === On; }
function ah(n) { return n !== je && oe(n); }
function ji(n) { return n === On || n >= $n && n <= ar; }
function lh(n) { return Nn(n) || ct(n) || n === On; }
function ch(n) { return n === lt || n === Ke || n === Fs || n === _e; }
function Lw(n) { let e = [], t; for (let s = 0; s < n.length; s++) {
    let r = n[s];
    t && t.type === 5 && r.type === 5 || t && t.type === 16 && r.type === 16 ? (t.parts[0] += r.parts[0], t.sourceSpan.end = r.sourceSpan.end) : (t = r, e.push(t));
} return e; }
var Zo = class n {
    state;
    file;
    input;
    end;
    constructor(e, t) { if (e instanceof n) {
        this.file = e.file, this.input = e.input, this.end = e.end;
        let s = e.state;
        this.state = { peek: s.peek, offset: s.offset, line: s.line, column: s.column };
    }
    else {
        if (!t)
            throw new Error("Programming error: the range argument must be provided with a file argument.");
        this.file = e, this.input = e.content, this.end = t.endPos, this.state = { peek: -1, offset: t.startPos, line: t.startLine, column: t.startCol };
    } }
    clone() { return new n(this); }
    peek() { return this.state.peek; }
    charsLeft() { return this.end - this.state.offset; }
    diff(e) { return this.state.offset - e.state.offset; }
    advance() { this.advanceState(this.state); }
    init() { this.updatePeek(this.state); }
    getSpan(e, t) { e = e || this; let s = e; if (t)
        for (; this.diff(e) > 0 && t.indexOf(e.peek()) !== -1;)
            s === e && (e = e.clone()), e.advance(); let r = this.locationFromCursor(e), i = this.locationFromCursor(this), o = s !== e ? this.locationFromCursor(s) : r; return new B(r, i, o); }
    getChars(e) { return this.input.substring(e.state.offset, this.state.offset); }
    charAt(e) { return this.input.charCodeAt(e); }
    advanceState(e) { if (e.offset >= this.end)
        throw this.state = e, new Ii('Unexpected character "EOF"', this); let t = this.charAt(e.offset); t === es ? (e.line++, e.column = 0) : Lo(t) || e.column++, e.offset++, this.updatePeek(e); }
    updatePeek(e) { e.peek = e.offset >= this.end ? _e : this.charAt(e.offset); }
    locationFromCursor(e) { return new ms(e.file, e.state.offset, e.state.line, e.state.column); }
}, Xl = class n extends Zo {
    internalState;
    constructor(e, t) { e instanceof n ? (super(e), this.internalState = S({}, e.internalState)) : (super(e, t), this.internalState = this.state); }
    advance() { this.state = this.internalState, super.advance(), this.processEscapeSequence(); }
    init() { super.init(), this.processEscapeSequence(); }
    clone() { return new n(this); }
    getChars(e) { let t = e.clone(), s = ""; for (; t.internalState.offset < this.internalState.offset;)
        s += String.fromCodePoint(t.peek()), t.advance(); return s; }
    processEscapeSequence() { let e = () => this.internalState.peek; if (e() === ts)
        if (this.internalState = S({}, this.state), this.advanceState(this.internalState), e() === Kp)
            this.state.peek = es;
        else if (e() === ef)
            this.state.peek = nu;
        else if (e() === sf)
            this.state.peek = Gp;
        else if (e() === tf)
            this.state.peek = tu;
        else if (e() === Gm)
            this.state.peek = Vm;
        else if (e() === ru)
            this.state.peek = Xp;
        else if (e() === nf)
            if (this.advanceState(this.internalState), e() === ht) {
                this.advanceState(this.internalState);
                let t = this.clone(), s = 0;
                for (; e() !== Re;)
                    this.advanceState(this.internalState), s++;
                this.state.peek = this.decodeHexDigits(t, s);
            }
            else {
                let t = this.clone();
                this.advanceState(this.internalState), this.advanceState(this.internalState), this.advanceState(this.internalState), this.state.peek = this.decodeHexDigits(t, 4);
            }
        else if (e() === rf) {
            this.advanceState(this.internalState);
            let t = this.clone();
            this.advanceState(this.internalState), this.state.peek = this.decodeHexDigits(t, 2);
        }
        else if (Ru(e())) {
            let t = "", s = 0, r = this.clone();
            for (; Ru(e()) && s < 3;)
                r = this.clone(), t += String.fromCodePoint(e()), this.advanceState(this.internalState), s++;
            this.state.peek = parseInt(t, 8), this.internalState = r.internalState;
        }
        else
            Lo(this.internalState.peek) ? (this.advanceState(this.internalState), this.state = this.internalState) : this.state.peek = this.internalState.peek; }
    decodeHexDigits(e, t) { let s = this.input.slice(e.internalState.offset, e.internalState.offset + t), r = parseInt(s, 16); if (isNaN(r))
        throw e.state = e.internalState, new Ii("Invalid hexadecimal escape sequence", e); return r; }
}, Ii = class extends Error {
    msg;
    cursor;
    constructor(e, t) { super(e), this.msg = e, this.cursor = t, Object.setPrototypeOf(this, new.target.prototype); }
}, fe = class n extends N {
    elementName;
    static create(e, t, s) { return new n(e, t, s); }
    constructor(e, t, s) { super(t, s), this.elementName = e; }
}, nr = class {
    rootNodes;
    errors;
    constructor(e, t) { this.rootNodes = e, this.errors = t; }
}, Df = class {
    getTagDefinition;
    constructor(e) { this.getTagDefinition = e; }
    parse(e, t, s) { let r = Cw(e, t, this.getTagDefinition, s), i = new Yl(r.tokens, this.getTagDefinition); return i.build(), new nr(i.rootNodes, [...r.errors, ...i.errors]); }
}, Yl = class n {
    tokens;
    tagDefinitionResolver;
    _index = -1;
    _peek;
    _containerStack = [];
    rootNodes = [];
    errors = [];
    constructor(e, t) { this.tokens = e, this.tagDefinitionResolver = t, this._advance(); }
    build() { for (; this._peek.type !== 41;)
        this._peek.type === 0 || this._peek.type === 4 ? this._consumeElementStartTag(this._advance()) : this._peek.type === 3 ? this._consumeElementEndTag(this._advance()) : this._peek.type === 12 ? (this._closeVoidElement(), this._consumeCdata(this._advance())) : this._peek.type === 10 ? (this._closeVoidElement(), this._consumeComment(this._advance())) : this._peek.type === 5 || this._peek.type === 7 || this._peek.type === 6 ? (this._closeVoidElement(), this._consumeText(this._advance())) : this._peek.type === 19 ? this._consumeExpansion(this._advance()) : this._peek.type === 24 ? (this._closeVoidElement(), this._consumeBlockOpen(this._advance())) : this._peek.type === 26 ? (this._closeVoidElement(), this._consumeBlockClose(this._advance())) : this._peek.type === 28 ? (this._closeVoidElement(), this._consumeIncompleteBlock(this._advance())) : this._peek.type === 29 ? (this._closeVoidElement(), this._consumeLet(this._advance())) : this._peek.type === 32 ? (this._closeVoidElement(), this._consumeIncompleteLet(this._advance())) : this._peek.type === 33 || this._peek.type === 37 ? this._consumeComponentStartTag(this._advance()) : this._peek.type === 36 ? this._consumeComponentEndTag(this._advance()) : this._advance(); for (let e of this._containerStack)
        e instanceof ut && this.errors.push(fe.create(e.name, e.sourceSpan, `Unclosed block "${e.name}"`)); }
    _advance() { let e = this._peek; return this._index < this.tokens.length - 1 && this._index++, this._peek = this.tokens[this._index], e; }
    _advanceIf(e) { return this._peek.type === e ? this._advance() : null; }
    _consumeCdata(e) { this._consumeText(this._advance()), this._advanceIf(13); }
    _consumeComment(e) { let t = this._advanceIf(7), s = this._advanceIf(11), r = t != null ? t.parts[0].trim() : null, i = s == null ? e.sourceSpan : new B(e.sourceSpan.start, s.sourceSpan.end, e.sourceSpan.fullStart); this._addToParent(new Mn(r, i)); }
    _consumeExpansion(e) { let t = this._advance(), s = this._advance(), r = []; for (; this._peek.type === 20;) {
        let o = this._parseExpansionCase();
        if (!o)
            return;
        r.push(o);
    } if (this._peek.type !== 23) {
        this.errors.push(fe.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '}'."));
        return;
    } let i = new B(e.sourceSpan.start, this._peek.sourceSpan.end, e.sourceSpan.fullStart); this._addToParent(new En(t.parts[0], s.parts[0], r, i, t.sourceSpan)), this._advance(); }
    _parseExpansionCase() { let e = this._advance(); if (this._peek.type !== 21)
        return this.errors.push(fe.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '{'.")), null; let t = this._advance(), s = this._collectExpansionExpTokens(t); if (!s)
        return null; let r = this._advance(); s.push({ type: 41, parts: [], sourceSpan: r.sourceSpan }); let i = new n(s, this.tagDefinitionResolver); if (i.build(), i.errors.length > 0)
        return this.errors = this.errors.concat(i.errors), null; let o = new B(e.sourceSpan.start, r.sourceSpan.end, e.sourceSpan.fullStart), a = new B(t.sourceSpan.start, r.sourceSpan.end, t.sourceSpan.fullStart); return new bi(e.parts[0], i.rootNodes, o, e.sourceSpan, a); }
    _collectExpansionExpTokens(e) { let t = [], s = [21]; for (;;) {
        if ((this._peek.type === 19 || this._peek.type === 21) && s.push(this._peek.type), this._peek.type === 22)
            if (uh(s, 21)) {
                if (s.pop(), s.length === 0)
                    return t;
            }
            else
                return this.errors.push(fe.create(null, e.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
        if (this._peek.type === 23)
            if (uh(s, 19))
                s.pop();
            else
                return this.errors.push(fe.create(null, e.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
        if (this._peek.type === 41)
            return this.errors.push(fe.create(null, e.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
        t.push(this._advance());
    } }
    _consumeText(e) {
        let t = [e], s = e.sourceSpan, r = e.parts[0];
        if (r.length > 0 && r[0] === `
`) {
            let i = this._getContainer();
            i != null && i.children.length === 0 && this._getTagDefinition(i)?.ignoreFirstLf && (r = r.substring(1), t[0] = { type: e.type, sourceSpan: e.sourceSpan, parts: [r] });
        }
        for (; this._peek.type === 8 || this._peek.type === 5 || this._peek.type === 9;)
            e = this._advance(), t.push(e), e.type === 8 ? r += e.parts.join("").replace(/&([^;]+);/g, hh) : e.type === 9 ? r += e.parts[0] : r += e.parts.join("");
        if (r.length > 0) {
            let i = e.sourceSpan;
            this._addToParent(new ln(r, new B(s.start, i.end, s.fullStart, s.details), t));
        }
    }
    _closeVoidElement() { let e = this._getContainer(); e !== null && this._getTagDefinition(e)?.isVoid && this._containerStack.pop(); }
    _consumeElementStartTag(e) { let t = [], s = []; this._consumeAttributesAndDirectives(t, s); let r = this._getElementFullName(e, this._getClosestElementLikeParent()), i = this._getTagDefinition(r), o = !1; this._peek.type === 2 ? (this._advance(), o = !0, i?.canSelfClose || pl(r) !== null || i?.isVoid || this.errors.push(fe.create(r, e.sourceSpan, `Only void, custom and foreign elements can be self closed "${e.parts[1]}"`))) : this._peek.type === 1 && (this._advance(), o = !1); let a = this._peek.sourceSpan.fullStart, l = new B(e.sourceSpan.start, a, e.sourceSpan.fullStart), c = new B(e.sourceSpan.start, a, e.sourceSpan.fullStart), h = new Me(r, t, s, [], o, l, c, void 0, i?.isVoid ?? !1), p = this._getContainer(), m = p !== null && !!this._getTagDefinition(p)?.isClosedByChild(h.name); this._pushContainer(h, m), o ? this._popContainer(r, Me, l) : e.type === 4 && (this._popContainer(r, Me, null), this.errors.push(fe.create(r, l, `Opening tag "${r}" not terminated.`))); }
    _consumeComponentStartTag(e) { let t = e.parts[0], s = [], r = []; this._consumeAttributesAndDirectives(s, r); let i = this._getClosestElementLikeParent(), o = this._getComponentTagName(e, i), a = this._getComponentFullName(e, i), l = this._peek.type === 35; this._advance(); let c = this._peek.sourceSpan.fullStart, h = new B(e.sourceSpan.start, c, e.sourceSpan.fullStart), p = new B(e.sourceSpan.start, c, e.sourceSpan.fullStart), m = new Ae(t, o, a, s, r, [], l, h, p, void 0), v = this._getContainer(), w = v !== null && m.tagName !== null && !!this._getTagDefinition(v)?.isClosedByChild(m.tagName); this._pushContainer(m, w), l ? this._popContainer(a, Ae, h) : e.type === 37 && (this._popContainer(a, Ae, null), this.errors.push(fe.create(a, h, `Opening tag "${a}" not terminated.`))); }
    _consumeAttributesAndDirectives(e, t) { for (; this._peek.type === 14 || this._peek.type === 38;)
        this._peek.type === 38 ? t.push(this._consumeDirective(this._peek)) : e.push(this._consumeAttr(this._advance())); }
    _consumeComponentEndTag(e) { let t = this._getComponentFullName(e, this._getClosestElementLikeParent()); if (!this._popContainer(t, Ae, e.sourceSpan)) {
        let s = this._containerStack[this._containerStack.length - 1], r;
        s instanceof Ae && s.componentName === e.parts[0] ? r = `, did you mean "${s.fullName}"?` : r = ". It may happen when the tag has already been closed by another tag.";
        let i = `Unexpected closing tag "${t}"${r}`;
        this.errors.push(fe.create(t, e.sourceSpan, i));
    } }
    _getTagDefinition(e) { return typeof e == "string" ? this.tagDefinitionResolver(e) : e instanceof Me ? this.tagDefinitionResolver(e.name) : e instanceof Ae && e.tagName !== null ? this.tagDefinitionResolver(e.tagName) : null; }
    _pushContainer(e, t) { t && this._containerStack.pop(), this._addToParent(e), this._containerStack.push(e); }
    _consumeElementEndTag(e) { let t = this._getElementFullName(e, this._getClosestElementLikeParent()); if (this._getTagDefinition(t)?.isVoid)
        this.errors.push(fe.create(t, e.sourceSpan, `Void elements do not have end tags "${e.parts[1]}"`));
    else if (!this._popContainer(t, Me, e.sourceSpan)) {
        let s = `Unexpected closing tag "${t}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
        this.errors.push(fe.create(t, e.sourceSpan, s));
    } }
    _popContainer(e, t, s) { let r = !1; for (let i = this._containerStack.length - 1; i >= 0; i--) {
        let o = this._containerStack[i];
        if (((o instanceof Ae ? o.fullName : o.name) === e || e === null) && o instanceof t)
            return o.endSourceSpan = s, o.sourceSpan.end = s !== null ? s.end : o.sourceSpan.end, this._containerStack.splice(i, this._containerStack.length - i), !r;
        (o instanceof ut || !this._getTagDefinition(o)?.closedByParent) && (r = !0);
    } return !1; }
    _consumeAttr(e) { let t = so(e.parts[0], e.parts[1]), s = e.sourceSpan.end; this._peek.type === 15 && this._advance(); let r = "", i = [], o, a; if (this._peek.type === 16)
        for (o = this._peek.sourceSpan, a = this._peek.sourceSpan.end; this._peek.type === 16 || this._peek.type === 17 || this._peek.type === 9;) {
            let h = this._advance();
            i.push(h), h.type === 17 ? r += h.parts.join("").replace(/&([^;]+);/g, hh) : h.type === 9 ? r += h.parts[0] : r += h.parts.join(""), a = s = h.sourceSpan.end;
        } this._peek.type === 15 && (s = this._advance().sourceSpan.end); let c = o && a && new B(o.start, a, o.fullStart); return new Sn(t, r, new B(e.sourceSpan.start, s, e.sourceSpan.fullStart), e.sourceSpan, c, i.length > 0 ? i : void 0, void 0); }
    _consumeDirective(e) { let t = [], s = e.sourceSpan.end, r = null; if (this._advance(), this._peek.type === 39) {
        for (s = this._peek.sourceSpan.end, this._advance(); this._peek.type === 14;)
            t.push(this._consumeAttr(this._advance()));
        this._peek.type === 40 ? (r = this._peek.sourceSpan, this._advance()) : this.errors.push(fe.create(null, e.sourceSpan, "Unterminated directive definition"));
    } let i = new B(e.sourceSpan.start, s, e.sourceSpan.fullStart), o = new B(i.start, r === null ? e.sourceSpan.end : r.end, i.fullStart); return new Xo(e.parts[0], t, o, i, r); }
    _consumeBlockOpen(e) { let t = []; for (; this._peek.type === 27;) {
        let a = this._advance();
        t.push(new Yo(a.parts[0], a.sourceSpan));
    } this._peek.type === 25 && this._advance(); let s = this._peek.sourceSpan.fullStart, r = new B(e.sourceSpan.start, s, e.sourceSpan.fullStart), i = new B(e.sourceSpan.start, s, e.sourceSpan.fullStart), o = new ut(e.parts[0], t, [], r, e.sourceSpan, i); this._pushContainer(o, !1); }
    _consumeBlockClose(e) { let t = this._containerStack.length, s = this._containerStack[t - 1]; if (!this._popContainer(null, ut, e.sourceSpan)) {
        if (this._containerStack.length < t) {
            let r = s instanceof Ae ? s.fullName : s.name;
            this.errors.push(fe.create(null, e.sourceSpan, `Unexpected closing block. The block may have been closed earlier. Did you forget to close the <${r}> element? If you meant to write the \`}\` character, you should use the "&#125;" HTML entity instead.`));
            return;
        }
        this.errors.push(fe.create(null, e.sourceSpan, 'Unexpected closing block. The block may have been closed earlier. If you meant to write the `}` character, you should use the "&#125;" HTML entity instead.'));
    } }
    _consumeIncompleteBlock(e) { let t = []; for (; this._peek.type === 27;) {
        let a = this._advance();
        t.push(new Yo(a.parts[0], a.sourceSpan));
    } let s = this._peek.sourceSpan.fullStart, r = new B(e.sourceSpan.start, s, e.sourceSpan.fullStart), i = new B(e.sourceSpan.start, s, e.sourceSpan.fullStart), o = new ut(e.parts[0], t, [], r, e.sourceSpan, i); this._pushContainer(o, !1), this._popContainer(null, ut, null), this.errors.push(fe.create(e.parts[0], r, `Incomplete block "${e.parts[0]}". If you meant to write the @ character, you should use the "&#64;" HTML entity instead.`)); }
    _consumeLet(e) { let t = e.parts[0], s, r; if (this._peek.type !== 30) {
        this.errors.push(fe.create(e.parts[0], e.sourceSpan, `Invalid @let declaration "${t}". Declaration must have a value.`));
        return;
    }
    else
        s = this._advance(); if (this._peek.type !== 31) {
        this.errors.push(fe.create(e.parts[0], e.sourceSpan, `Unterminated @let declaration "${t}". Declaration must be terminated with a semicolon.`));
        return;
    }
    else
        r = this._advance(); let i = r.sourceSpan.fullStart, o = new B(e.sourceSpan.start, i, e.sourceSpan.fullStart), a = e.sourceSpan.toString().lastIndexOf(t), l = e.sourceSpan.start.moveBy(a), c = new B(l, e.sourceSpan.end), h = new Qo(t, s.parts[0], o, c, s.sourceSpan); this._addToParent(h); }
    _consumeIncompleteLet(e) { let t = e.parts[0] ?? "", s = t ? ` "${t}"` : ""; if (t.length > 0) {
        let r = e.sourceSpan.toString().lastIndexOf(t), i = e.sourceSpan.start.moveBy(r), o = new B(i, e.sourceSpan.end), a = new B(e.sourceSpan.start, e.sourceSpan.start.moveBy(0)), l = new Qo(t, "", e.sourceSpan, o, a);
        this._addToParent(l);
    } this.errors.push(fe.create(e.parts[0], e.sourceSpan, `Incomplete @let declaration${s}. @let declarations must be written as \`@let <name> = <value>;\``)); }
    _getContainer() { return this._containerStack.length > 0 ? this._containerStack[this._containerStack.length - 1] : null; }
    _getClosestElementLikeParent() { for (let e = this._containerStack.length - 1; e > -1; e--) {
        let t = this._containerStack[e];
        if (t instanceof Me || t instanceof Ae)
            return t;
    } return null; }
    _addToParent(e) { let t = this._getContainer(); t === null ? this.rootNodes.push(e) : t.children.push(e); }
    _getElementFullName(e, t) { let s = this._getPrefix(e, t); return so(s, e.parts[1]); }
    _getComponentFullName(e, t) { let s = e.parts[0], r = this._getComponentTagName(e, t); return r === null ? s : r.startsWith(":") ? s + r : `${s}:${r}`; }
    _getComponentTagName(e, t) { let s = this._getPrefix(e, t), r = e.parts[2]; return !s && !r ? null : !s && r ? r : so(s, r || "ng-component"); }
    _getPrefix(e, t) { let s, r; if (e.type === 33 || e.type === 37 || e.type === 36 ? (s = e.parts[1], r = e.parts[2]) : (s = e.parts[0], r = e.parts[1]), s = s || this._getTagDefinition(r)?.implicitNamespacePrefix || "", !s && t) {
        let i = t instanceof Me ? t.name : t.tagName;
        if (i !== null) {
            let o = It(i)[1], a = this._getTagDefinition(o);
            a !== null && !a.preventNamespaceInheritance && (s = pl(i));
        }
    } return s; }
};
function uh(n, e) { return n.length > 0 && n[n.length - 1] === e; }
function hh(n, e) { return Ti[e] !== void 0 ? Ti[e] || n : /^#x[a-f0-9]+$/i.test(e) ? String.fromCodePoint(parseInt(e.slice(2), 16)) : /^#\d+$/.test(e) ? String.fromCodePoint(parseInt(e.slice(1), 10)) : n; }
var Pf = "ngPreserveWhitespaces", ph = new Set(["pre", "template", "textarea", "script", "style"]), Lf = ` \f
\r	\v\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF`, Bw = new RegExp(`[^${Lf}]`), Mw = new RegExp(`[${Lf}]{2,}`, "g");
function fh(n) { return n.some(e => e.name === Pf); }
function Bf(n) { return n.replace(new RegExp(Nf, "g"), " "); }
var Ni = class {
    preserveSignificantWhitespace;
    originalNodeMap;
    requireContext;
    icuExpansionDepth = 0;
    constructor(e, t, s = !0) { this.preserveSignificantWhitespace = e, this.originalNodeMap = t, this.requireContext = s; }
    visitElement(e, t) { if (ph.has(e.name) || fh(e.attrs)) {
        let r = new Me(e.name, yt(this, e.attrs), yt(this, e.directives), e.children, e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.isVoid, e.i18n);
        return this.originalNodeMap?.set(r, e), r;
    } let s = new Me(e.name, e.attrs, e.directives, yt(this, e.children), e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.isVoid, e.i18n); return this.originalNodeMap?.set(s, e), s; }
    visitAttribute(e, t) { return e.name !== Pf ? e : null; }
    visitText(e, t) { let s = e.value.match(Bw), r = t && (t.prev instanceof En || t.next instanceof En); if (this.icuExpansionDepth > 0 && this.preserveSignificantWhitespace)
        return e; if (s || r) {
        let o = e.tokens.map(h => h.type === 5 ? Ow(h) : h);
        if (!this.preserveSignificantWhitespace && o.length > 0) {
            let h = o[0];
            o.splice(0, 1, Rw(h, t));
            let p = o[o.length - 1];
            o.splice(o.length - 1, 1, Fw(p, t));
        }
        let a = Rf(e.value), l = this.preserveSignificantWhitespace ? a : $w(a, t), c = new ln(l, e.sourceSpan, o, e.i18n);
        return this.originalNodeMap?.set(c, e), c;
    } return null; }
    visitComment(e, t) { return e; }
    visitExpansion(e, t) { this.icuExpansionDepth++; let s; try {
        s = new En(e.switchValue, e.type, yt(this, e.cases), e.sourceSpan, e.switchValueSourceSpan, e.i18n);
    }
    finally {
        this.icuExpansionDepth--;
    } return this.originalNodeMap?.set(s, e), s; }
    visitExpansionCase(e, t) { let s = new bi(e.value, yt(this, e.expression), e.sourceSpan, e.valueSourceSpan, e.expSourceSpan); return this.originalNodeMap?.set(s, e), s; }
    visitBlock(e, t) { let s = new ut(e.name, e.parameters, yt(this, e.children), e.sourceSpan, e.nameSpan, e.startSourceSpan, e.endSourceSpan); return this.originalNodeMap?.set(s, e), s; }
    visitBlockParameter(e, t) { return e; }
    visitLetDeclaration(e, t) { return e; }
    visitComponent(e, t) { if (e.tagName && ph.has(e.tagName) || fh(e.attrs)) {
        let r = new Ae(e.componentName, e.tagName, e.fullName, yt(this, e.attrs), yt(this, e.directives), e.children, e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.i18n);
        return this.originalNodeMap?.set(r, e), r;
    } let s = new Ae(e.componentName, e.tagName, e.fullName, e.attrs, e.directives, yt(this, e.children), e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.i18n); return this.originalNodeMap?.set(s, e), s; }
    visitDirective(e, t) { return e; }
    visit(e, t) { if (this.requireContext && !t)
        throw new Error("WhitespaceVisitor requires context. Visit via `visitAllWithSiblings` to get this context."); return !1; }
};
function Rw(n, e) { return n.type !== 5 || !!e?.prev ? n : Mf(n, s => s.trimStart()); }
function Fw(n, e) { return n.type !== 5 || !!e?.next ? n : Mf(n, s => s.trimEnd()); }
function $w(n, e) { let t = !e?.prev, s = !e?.next, r = t ? n.trimStart() : n; return s ? r.trimEnd() : r; }
function Ow({ type: n, parts: e, sourceSpan: t }) { return { type: n, parts: [Rf(e[0])], sourceSpan: t }; }
function Mf({ type: n, parts: e, sourceSpan: t }, s) { return { type: n, parts: [s(e[0])], sourceSpan: t }; }
function Rf(n) { return Bf(n).replace(Mw, " "); }
function yt(n, e) { let t = []; return e.forEach((s, r) => { let i = { prev: e[r - 1], next: e[r + 1] }, o = s.visit(n, i); o && t.push(o); }), t; }
var L = (function (n) { return n[n.Character = 0] = "Character", n[n.Identifier = 1] = "Identifier", n[n.PrivateIdentifier = 2] = "PrivateIdentifier", n[n.Keyword = 3] = "Keyword", n[n.String = 4] = "String", n[n.Operator = 5] = "Operator", n[n.Number = 6] = "Number", n[n.RegExpBody = 7] = "RegExpBody", n[n.RegExpFlags = 8] = "RegExpFlags", n[n.Error = 9] = "Error", n; })(L || {}), ns = (function (n) { return n[n.Plain = 0] = "Plain", n[n.TemplateLiteralPart = 1] = "TemplateLiteralPart", n[n.TemplateLiteralEnd = 2] = "TemplateLiteralEnd", n; })(ns || {}), Vw = ["var", "let", "as", "null", "undefined", "true", "false", "if", "else", "this", "typeof", "void", "in", "instanceof"], Di = class {
    tokenize(e) { return new Ql(e).scan(); }
}, at = class {
    index;
    end;
    type;
    numValue;
    strValue;
    constructor(e, t, s, r, i) { this.index = e, this.end = t, this.type = s, this.numValue = r, this.strValue = i; }
    isCharacter(e) { return this.type === L.Character && this.numValue === e; }
    isNumber() { return this.type === L.Number; }
    isString() { return this.type === L.String; }
    isOperator(e) { return this.type === L.Operator && this.strValue === e; }
    isIdentifier() { return this.type === L.Identifier; }
    isPrivateIdentifier() { return this.type === L.PrivateIdentifier; }
    isKeyword() { return this.type === L.Keyword; }
    isKeywordLet() { return this.type === L.Keyword && this.strValue === "let"; }
    isKeywordAs() { return this.type === L.Keyword && this.strValue === "as"; }
    isKeywordNull() { return this.type === L.Keyword && this.strValue === "null"; }
    isKeywordUndefined() { return this.type === L.Keyword && this.strValue === "undefined"; }
    isKeywordTrue() { return this.type === L.Keyword && this.strValue === "true"; }
    isKeywordFalse() { return this.type === L.Keyword && this.strValue === "false"; }
    isKeywordThis() { return this.type === L.Keyword && this.strValue === "this"; }
    isKeywordTypeof() { return this.type === L.Keyword && this.strValue === "typeof"; }
    isKeywordVoid() { return this.type === L.Keyword && this.strValue === "void"; }
    isKeywordIn() { return this.type === L.Keyword && this.strValue === "in"; }
    isKeywordInstanceOf() { return this.type === L.Keyword && this.strValue === "instanceof"; }
    isError() { return this.type === L.Error; }
    isRegExpBody() { return this.type === L.RegExpBody; }
    isRegExpFlags() { return this.type === L.RegExpFlags; }
    toNumber() { return this.type === L.Number ? this.numValue : -1; }
    isTemplateLiteralPart() { return this.isString() && this.kind === ns.TemplateLiteralPart; }
    isTemplateLiteralEnd() { return this.isString() && this.kind === ns.TemplateLiteralEnd; }
    isTemplateLiteralInterpolationStart() { return this.isOperator("${"); }
    toString() { switch (this.type) {
        case L.Character:
        case L.Identifier:
        case L.Keyword:
        case L.Operator:
        case L.PrivateIdentifier:
        case L.String:
        case L.Error:
        case L.RegExpBody:
        case L.RegExpFlags: return this.strValue;
        case L.Number: return this.numValue.toString();
        default: return null;
    } }
}, Nr = class extends at {
    kind;
    constructor(e, t, s, r) { super(e, t, L.String, 0, s), this.kind = r; }
};
function mr(n, e, t) { return new at(n, e, L.Character, t, String.fromCharCode(t)); }
function qw(n, e, t) { return new at(n, e, L.Identifier, 0, t); }
function Uw(n, e, t) { return new at(n, e, L.PrivateIdentifier, 0, t); }
function Hw(n, e, t) { return new at(n, e, L.Keyword, 0, t); }
function un(n, e, t) { return new at(n, e, L.Operator, 0, t); }
function Ww(n, e, t) { return new at(n, e, L.Number, t, ""); }
function jw(n, e, t) { return new at(n, e, L.Error, 0, t); }
function zw(n, e, t) { return new at(n, e, L.RegExpBody, 0, t); }
function Gw(n, e, t) { return new at(n, e, L.RegExpFlags, 0, t); }
var gr = new at(-1, -1, L.Character, 0, ""), Ql = class {
    input;
    tokens = [];
    length;
    peek = 0;
    index = -1;
    braceStack = [];
    constructor(e) { this.input = e, this.length = e.length, this.advance(); }
    scan() { let e = this.scanToken(); for (; e !== null;)
        this.tokens.push(e), e = this.scanToken(); return this.tokens; }
    advance() { this.peek = ++this.index >= this.length ? _e : this.input.charCodeAt(this.index); }
    scanToken() { let e = this.input, t = this.length, s = this.peek, r = this.index; for (; s <= Yp;)
        if (++r >= t) {
            s = _e;
            break;
        }
        else
            s = e.charCodeAt(r); if (this.peek = s, this.index = r, r >= t)
        return null; if (dh(s))
        return this.scanIdentifier(); if (ct(s))
        return this.scanNumber(r); let i = r; switch (s) {
        case Wn: return this.advance(), ct(this.peek) ? this.scanNumber(i) : this.peek !== Wn ? mr(i, this.index, Wn) : (this.advance(), this.peek === Wn ? (this.advance(), un(i, this.index, "...")) : this.error(`Unexpected character [${String.fromCharCode(s)}]`, 0));
        case $e:
        case ge:
        case Ot:
        case Zt:
        case De:
        case Rt:
        case je: return this.scanCharacter(i, s);
        case ht: return this.scanOpenBrace(i, s);
        case Re: return this.scanCloseBrace(i, s);
        case di:
        case fi: return this.scanString();
        case Nl: return this.advance(), this.scanTemplateLiteralPart(i);
        case Qp: return this.scanPrivateIdentifier();
        case Zp: return this.scanComplexOperator(i, "+", Ce, "=");
        case Po: return this.scanComplexOperator(i, "-", Ce, "=");
        case lt: return this.isStartOfRegex() ? this.scanRegex(r) : this.scanComplexOperator(i, "/", Ce, "=");
        case qm: return this.scanComplexOperator(i, "%", Ce, "=");
        case zm: return this.scanOperator(i, "^");
        case Lu: return this.scanStar(i);
        case Bu: return this.scanQuestion(i);
        case Fs:
        case Ke: return this.scanComplexOperator(i, String.fromCharCode(s), Ce, "=");
        case Il: return this.scanComplexOperator(i, "!", Ce, "=", Ce, "=");
        case Ce: return this.scanEquals(i);
        case Do: return this.scanComplexOperator(i, "&", Do, "&", Ce, "=");
        case Mu: return this.scanComplexOperator(i, "|", Mu, "|", Ce, "=");
        case of:
            for (; mi(this.peek);)
                this.advance();
            return this.scanToken();
    } return this.advance(), this.error(`Unexpected character [${String.fromCharCode(s)}]`, 0); }
    scanCharacter(e, t) { return this.advance(), mr(e, this.index, t); }
    scanOperator(e, t) { return this.advance(), un(e, this.index, t); }
    scanOpenBrace(e, t) { return this.braceStack.push("expression"), this.advance(), mr(e, this.index, t); }
    scanCloseBrace(e, t) { return this.advance(), this.braceStack.pop() === "interpolation" ? (this.tokens.push(mr(e, this.index, Re)), this.scanTemplateLiteralPart(this.index)) : mr(e, this.index, t); }
    scanComplexOperator(e, t, s, r, i, o) { this.advance(); let a = t; return this.peek == s && (this.advance(), a += r), i != null && this.peek == i && (this.advance(), a += o), un(e, this.index, a); }
    scanEquals(e) { this.advance(); let t = "="; if (this.peek === Ce)
        this.advance(), t += "=";
    else if (this.peek === Ke)
        return this.advance(), t += ">", un(e, this.index, t); return this.peek === Ce && (this.advance(), t += "="), un(e, this.index, t); }
    scanIdentifier() { let e = this.index; for (this.advance(); mh(this.peek);)
        this.advance(); let t = this.input.substring(e, this.index); return Vw.indexOf(t) > -1 ? Hw(e, this.index, t) : qw(e, this.index, t); }
    scanPrivateIdentifier() { let e = this.index; if (this.advance(), !dh(this.peek))
        return this.error("Invalid character [#]", -1); for (; mh(this.peek);)
        this.advance(); let t = this.input.substring(e, this.index); return Uw(e, this.index, t); }
    scanNumber(e) { let t = this.index === e, s = !1; for (this.advance();;) {
        if (!ct(this.peek))
            if (this.peek === On) {
                if (!ct(this.input.charCodeAt(this.index - 1)) || !ct(this.input.charCodeAt(this.index + 1)))
                    return this.error("Invalid numeric separator", 0);
                s = !0;
            }
            else if (this.peek === Wn)
                t = !1;
            else if (Xw(this.peek)) {
                if (this.advance(), Yw(this.peek) && this.advance(), !ct(this.peek))
                    return this.error("Invalid exponent", -1);
                t = !1;
            }
            else
                break;
        this.advance();
    } let r = this.input.substring(e, this.index); s && (r = r.replace(/_/g, "")); let i = t ? Zw(r) : parseFloat(r); return Ww(e, this.index, i); }
    scanString() { let e = this.index, t = this.peek; this.advance(); let s = "", r = this.index, i = this.input; for (; this.peek != t;)
        if (this.peek == ts) {
            let a = this.scanStringBackslash(s, r);
            if (typeof a != "string")
                return a;
            s = a, r = this.index;
        }
        else {
            if (this.peek == _e)
                return this.error("Unterminated quote", 0);
            this.advance();
        } let o = i.substring(r, this.index); return this.advance(), new Nr(e, this.index, s + o, ns.Plain); }
    scanQuestion(e) { this.advance(); let t = "?"; return this.peek === Bu ? (t += "?", this.advance(), this.peek === Ce && (t += "=", this.advance())) : this.peek === Wn && (t += ".", this.advance()), un(e, this.index, t); }
    scanTemplateLiteralPart(e) { let t = "", s = this.index; for (; this.peek !== Nl;)
        if (this.peek === ts) {
            let i = this.scanStringBackslash(t, s);
            if (typeof i != "string")
                return i;
            t = i, s = this.index;
        }
        else if (this.peek === Ea) {
            let i = this.index;
            if (this.advance(), this.peek === ht)
                return this.braceStack.push("interpolation"), this.tokens.push(new Nr(e, i, t + this.input.substring(s, i), ns.TemplateLiteralPart)), this.advance(), un(i, this.index, this.input.substring(i, this.index));
        }
        else {
            if (this.peek === _e)
                return this.error("Unterminated template literal", 0);
            this.advance();
        } let r = this.input.substring(s, this.index); return this.advance(), new Nr(e, this.index, t + r, ns.TemplateLiteralEnd); }
    error(e, t) { let s = this.index + t; return jw(s, this.index, `Lexer Error: ${e} at column ${s} in expression [${this.input}]`); }
    scanStringBackslash(e, t) { e += this.input.substring(t, this.index); let s; if (this.advance(), this.peek === nf) {
        let r = this.input.substring(this.index + 1, this.index + 5);
        if (/^[0-9a-f]+$/i.test(r))
            s = parseInt(r, 16);
        else
            return this.error(`Invalid unicode escape [\\u${r}]`, 0);
        for (let i = 0; i < 5; i++)
            this.advance();
    }
    else
        s = Qw(this.peek), this.advance(); return e += String.fromCharCode(s), e; }
    scanStar(e) { this.advance(); let t = "*"; return this.peek === Lu ? (t += "*", this.advance(), this.peek === Ce && (t += "=", this.advance())) : this.peek === Ce && (t += "=", this.advance()), un(e, this.index, t); }
    isStartOfRegex() { if (this.tokens.length === 0)
        return !0; let e = this.tokens[this.tokens.length - 1]; if (e.isOperator("!")) {
        let t = this.tokens.length > 1 ? this.tokens[this.tokens.length - 2] : null;
        return t === null || t.type !== L.Identifier && !t.isCharacter(ge) && !t.isCharacter(Zt);
    } return e.type === L.Operator || e.isCharacter($e) || e.isCharacter(Ot) || e.isCharacter(De) || e.isCharacter(Rt); }
    scanRegex(e) { this.advance(); let t = this.index, s = !1, r = !1; for (;;) {
        let l = this.peek;
        if (l === _e)
            return this.error("Unterminated regular expression", 0);
        if (s)
            s = !1;
        else if (l === ts)
            s = !0;
        else if (l === Ot)
            r = !0;
        else if (l === Zt)
            r = !1;
        else if (l === lt && !r)
            break;
        this.advance();
    } let i = this.input.substring(t, this.index); this.advance(); let o = zw(e, this.index, i), a = this.scanRegexFlags(this.index); return a !== null ? (this.tokens.push(o), a) : o; }
    scanRegexFlags(e) { if (!Nn(this.peek))
        return null; for (; Nn(this.peek);)
        this.advance(); return Gw(e, this.index, this.input.substring(e, this.index)); }
};
function dh(n) { return ds <= n && n <= Vi || $n <= n && n <= ar || n == On || n == Ea; }
function mh(n) { return Nn(n) || ct(n) || n == On || n == Ea; }
function Xw(n) { return n == Xm || n == Hm; }
function Yw(n) { return n == Po || n == Zp; }
function Qw(n) { switch (n) {
    case Kp: return es;
    case ru: return Xp;
    case ef: return nu;
    case tf: return tu;
    case sf: return Gp;
    default: return n;
} }
function Zw(n) { let e = parseInt(n); if (isNaN(e))
    throw new Error("Invalid integer literal when parsing " + n); return e; }
var Zl = class {
    strings;
    expressions;
    offsets;
    constructor(e, t, s) { this.strings = e, this.expressions = t, this.offsets = s; }
}, Jl = class {
    templateBindings;
    warnings;
    errors;
    constructor(e, t, s) { this.templateBindings = e, this.warnings = t, this.errors = s; }
};
function mn(n) { return n.start.toString() || "(unknown)"; }
var Jo = class {
    _lexer;
    _supportsDirectPipeReferences;
    constructor(e, t = !1) { this._lexer = e, this._supportsDirectPipeReferences = t; }
    parseAction(e, t, s) { let r = []; this._checkNoInterpolation(r, e, t); let { stripped: i } = this._stripComments(e), o = this._lexer.tokenize(i), a = new Gn(e, t, s, o, 1, r, 0, this._supportsDirectPipeReferences).parseChain(); return new ze(a, e, mn(t), s, r); }
    parseBinding(e, t, s) { let r = [], i = this._parseBindingAst(e, t, s, r); return new ze(i, e, mn(t), s, r); }
    checkSimpleExpression(e) { let t = new Kl; return e.visit(t), t.errors; }
    parseSimpleBinding(e, t, s) { let r = [], i = this._parseBindingAst(e, t, s, r), o = this.checkSimpleExpression(i); return o.length > 0 && r.push(Ms(`Host binding expression cannot contain ${o.join(" ")}`, e, "", t)), new ze(i, e, mn(t), s, r); }
    _parseBindingAst(e, t, s, r) { this._checkNoInterpolation(r, e, t); let { stripped: i } = this._stripComments(e), o = this._lexer.tokenize(i); return new Gn(e, t, s, o, 0, r, 0, this._supportsDirectPipeReferences).parseChain(); }
    parseTemplateBindings(e, t, s, r, i) { let o = this._lexer.tokenize(t), a = []; return new Gn(t, s, i, o, 0, a, 0, this._supportsDirectPipeReferences).parseTemplateBindings({ source: e, span: new tt(r, r + e.length) }); }
    parseInterpolation(e, t, s, r) { let i = [], { strings: o, expressions: a, offsets: l } = this.splitInterpolation(e, t, i, r); if (a.length === 0)
        return null; let c = []; for (let h = 0; h < a.length; ++h) {
        let p = r?.[h * 2 + 1]?.sourceSpan, m = a[h].text, { stripped: v, hasComments: w } = this._stripComments(m), C = this._lexer.tokenize(v);
        if (w && v.trim().length === 0 && C.length === 0) {
            i.push(Ms("Interpolation expression cannot only contain a comment", e, `at column ${a[h].start} in`, t));
            continue;
        }
        let T = new Gn(p ? m : e, p || t, s, C, 0, i, l[h], this._supportsDirectPipeReferences).parseChain();
        c.push(T);
    } return this.createInterpolationAst(o.map(h => h.text), c, e, mn(t), s, i); }
    parseInterpolationExpression(e, t, s) { let { stripped: r } = this._stripComments(e), i = this._lexer.tokenize(r), o = [], a = new Gn(e, t, s, i, 0, o, 0, this._supportsDirectPipeReferences).parseChain(), l = ["", ""]; return this.createInterpolationAst(l, [a], e, mn(t), s, o); }
    createInterpolationAst(e, t, s, r, i, o) { let a = new us(0, s.length), l = new $i(a, a.toAbsolute(i), e, t); return new ze(l, s, r, i, o); }
    splitInterpolation(e, t, s, r) { let i = [], o = [], a = [], l = r ? Jw(r) : null, c = 0, h = !1, p = !1, m = "{{", v = "}}"; for (; c < e.length;)
        if (h) {
            let w = c, C = w + m.length, T = this._getInterpolationEndIndex(e, v, C);
            if (T === -1) {
                h = !1, p = !0;
                break;
            }
            let A = T + v.length, R = e.substring(C, T);
            R.trim().length === 0 && s.push(Ms("Blank expressions are not allowed in interpolated strings", e, `at column ${c} in`, t)), o.push({ text: R, start: w, end: A });
            let O = (l?.get(w) ?? w) + m.length;
            a.push(O), c = A, h = !1;
        }
        else {
            let w = c;
            c = e.indexOf(m, c), c === -1 && (c = e.length);
            let C = e.substring(w, c);
            i.push({ text: C, start: w, end: c }), h = !0;
        } if (!h)
        if (p) {
            let w = i[i.length - 1];
            w.text += e.substring(c), w.end = e.length;
        }
        else
            i.push({ text: e.substring(c), start: c, end: e.length }); return new Zl(i, o, a); }
    wrapLiteralPrimitive(e, t, s) { let r = new us(0, e == null ? 0 : e.length); return new ze(new We(r, r.toAbsolute(s), e), e, typeof t == "string" ? t : mn(t), s, []); }
    _stripComments(e) { let t = this._commentStart(e); return t != null ? { stripped: e.substring(0, t), hasComments: !0 } : { stripped: e, hasComments: !1 }; }
    _commentStart(e) { let t = null; for (let s = 0; s < e.length - 1; s++) {
        let r = e.charCodeAt(s), i = e.charCodeAt(s + 1);
        if (r === lt && i == lt && t == null)
            return s;
        t === r ? t = null : t == null && Ir(r) && (t = r);
    } return null; }
    _checkNoInterpolation(e, t, s) { let r = -1, i = -1; for (let o of this._forEachUnquotedChar(t, 0))
        if (r === -1)
            t.startsWith("{{") && (r = o);
        else if (i = this._getInterpolationEndIndex(t, "}}", o), i > -1)
            break; r > -1 && i > -1 && e.push(Ms("Got interpolation ({{}}) where expression was expected", t, `at column ${r} in`, s)); }
    _getInterpolationEndIndex(e, t, s) { for (let r of this._forEachUnquotedChar(e, s)) {
        if (e.startsWith(t, r))
            return r;
        if (e.startsWith("//", r))
            return e.indexOf(t, r);
    } return -1; }
    *_forEachUnquotedChar(e, t) { let s = null, r = 0; for (let i = t; i < e.length; i++) {
        let o = e[i];
        Ir(e.charCodeAt(i)) && (s === null || s === o) && r % 2 === 0 ? s = s === null ? o : null : s === null && (yield i), r = o === "\\" ? r + 1 : 0;
    } }
}, kr = (function (n) { return n[n.None = 0] = "None", n[n.Writable = 1] = "Writable", n; })(kr || {}), gh = new Set(["d", "g", "i", "m", "s", "u", "v", "y"]), Gn = class {
    input;
    parseSourceSpan;
    absoluteOffset;
    tokens;
    parseFlags;
    errors;
    offset;
    supportsDirectPipeReferences;
    rparensExpected = 0;
    rbracketsExpected = 0;
    rbracesExpected = 0;
    context = kr.None;
    sourceSpanCache = new Map;
    index = 0;
    constructor(e, t, s, r, i, o, a, l) { this.input = e, this.parseSourceSpan = t, this.absoluteOffset = s, this.tokens = r, this.parseFlags = i, this.errors = o, this.offset = a, this.supportsDirectPipeReferences = l; }
    peek(e) { let t = this.index + e; return t < this.tokens.length ? this.tokens[t] : gr; }
    get next() { return this.peek(0); }
    get atEOF() { return this.index >= this.tokens.length; }
    get inputIndex() { return this.atEOF ? this.currentEndIndex : this.next.index + this.offset; }
    get currentEndIndex() { return this.index > 0 ? this.peek(-1).end + this.offset : this.tokens.length === 0 ? this.input.length + this.offset : this.next.index + this.offset; }
    get currentAbsoluteOffset() { return this.absoluteOffset + this.inputIndex; }
    span(e, t) { let s = this.currentEndIndex; if (t !== void 0 && t > this.currentEndIndex && (s = t), e > s) {
        let r = s;
        s = e, e = r;
    } return new us(e, s); }
    sourceSpan(e, t) { let s = `${e}@${this.inputIndex}:${t}`; return this.sourceSpanCache.has(s) || this.sourceSpanCache.set(s, this.span(e, t).toAbsolute(this.absoluteOffset)), this.sourceSpanCache.get(s); }
    advance() { this.index++; }
    withContext(e, t) { this.context |= e; let s = t(); return this.context ^= e, s; }
    consumeOptionalCharacter(e) { return this.next.isCharacter(e) ? (this.advance(), !0) : !1; }
    peekKeywordLet() { return this.next.isKeywordLet(); }
    peekKeywordAs() { return this.next.isKeywordAs(); }
    expectCharacter(e) { this.consumeOptionalCharacter(e) || this.error(`Missing expected ${String.fromCharCode(e)}`); }
    consumeOptionalOperator(e) { return this.next.isOperator(e) ? (this.advance(), !0) : !1; }
    isAssignmentOperator(e) { return e.type === L.Operator && Be.isAssignmentOperation(e.strValue); }
    expectOperator(e) { this.consumeOptionalOperator(e) || this.error(`Missing expected operator ${e}`); }
    prettyPrintToken(e) { return e === gr ? "end of input" : `token ${e}`; }
    expectIdentifierOrKeyword() { let e = this.next; return !e.isIdentifier() && !e.isKeyword() ? (e.isPrivateIdentifier() ? this._reportErrorForPrivateIdentifier(e, "expected identifier or keyword") : this.error(`Unexpected ${this.prettyPrintToken(e)}, expected identifier or keyword`), null) : (this.advance(), e.toString()); }
    expectIdentifierOrKeywordOrString() { let e = this.next; return !e.isIdentifier() && !e.isKeyword() && !e.isString() ? (e.isPrivateIdentifier() ? this._reportErrorForPrivateIdentifier(e, "expected identifier, keyword or string") : this.error(`Unexpected ${this.prettyPrintToken(e)}, expected identifier, keyword, or string`), "") : (this.advance(), e.toString()); }
    parseChain() { let e = [], t = this.inputIndex; for (; this.index < this.tokens.length;) {
        let s = this.parsePipe();
        if (e.push(s), this.consumeOptionalCharacter(je))
            for (this.parseFlags & 1 || this.error("Binding expression cannot contain chained expression"); this.consumeOptionalCharacter(je);)
                ;
        else if (this.index < this.tokens.length) {
            let r = this.index;
            if (this.error(`Unexpected token '${this.next}'`), this.index === r)
                break;
        }
    } if (e.length === 0) {
        let s = this.offset, r = this.offset + this.input.length;
        return new Ne(this.span(s, r), this.sourceSpan(s, r));
    } return e.length == 1 ? e[0] : new Ws(this.span(t), this.sourceSpan(t), e); }
    parsePipe() { let e = this.inputIndex, t = this.parseExpression(); if (this.consumeOptionalOperator("|")) {
        this.parseFlags & 1 && this.error("Cannot have a pipe in an action expression");
        do {
            let s = this.inputIndex, r = this.expectIdentifierOrKeyword(), i, o;
            r !== null ? i = this.sourceSpan(s) : (r = "", o = this.next.index !== -1 ? this.next.index : this.input.length + this.offset, i = new us(o, o).toAbsolute(this.absoluteOffset));
            let a = [];
            for (; this.consumeOptionalCharacter(Rt);)
                a.push(this.parseExpression());
            let l;
            if (this.supportsDirectPipeReferences) {
                let c = r.charCodeAt(0);
                l = c === On || c >= $n && c <= ar ? no.ReferencedDirectly : no.ReferencedByName;
            }
            else
                l = no.ReferencedByName;
            t = new go(this.span(e), this.sourceSpan(e, o), t, r, a, l, i);
        } while (this.consumeOptionalOperator("|"));
    } return t; }
    parseExpression() { return this.parseConditional(); }
    parseConditional() { let e = this.inputIndex, t = this.parseLogicalOr(); if (this.consumeOptionalOperator("?")) {
        let s = this.parsePipe(), r;
        if (this.consumeOptionalCharacter(Rt))
            r = this.parsePipe();
        else {
            let i = this.inputIndex, o = this.input.substring(e, i);
            this.error(`Conditional expression ${o} requires all 3 expressions`), r = new Ne(this.span(e), this.sourceSpan(e));
        }
        return new mo(this.span(e), this.sourceSpan(e), t, s, r);
    }
    else
        return t; }
    parseLogicalOr() { let e = this.inputIndex, t = this.parseLogicalAnd(); for (; this.consumeOptionalOperator("||");) {
        let s = this.parseLogicalAnd();
        t = new Be(this.span(e), this.sourceSpan(e), "||", t, s);
    } return t; }
    parseLogicalAnd() { let e = this.inputIndex, t = this.parseNullishCoalescing(); for (; this.consumeOptionalOperator("&&");) {
        let s = this.parseNullishCoalescing();
        t = new Be(this.span(e), this.sourceSpan(e), "&&", t, s);
    } return t; }
    parseNullishCoalescing() { let e = this.inputIndex, t = this.parseEquality(); for (; this.consumeOptionalOperator("??");) {
        let s = this.parseEquality();
        t = new Be(this.span(e), this.sourceSpan(e), "??", t, s);
    } return t; }
    parseEquality() { let e = this.inputIndex, t = this.parseRelational(); for (; this.next.type == L.Operator;) {
        let s = this.next.strValue;
        switch (s) {
            case "==":
            case "===":
            case "!=":
            case "!==":
                this.advance();
                let r = this.parseRelational();
                t = new Be(this.span(e), this.sourceSpan(e), s, t, r);
                continue;
        }
        break;
    } return t; }
    parseRelational() { let e = this.inputIndex, t = this.parseAdditive(); for (; this.next.type == L.Operator || this.next.isKeywordIn() || this.next.isKeywordInstanceOf();) {
        let s = this.next.strValue;
        switch (s) {
            case "<":
            case ">":
            case "<=":
            case ">=":
            case "in":
            case "instanceof":
                this.advance();
                let r = this.parseAdditive();
                t = new Be(this.span(e), this.sourceSpan(e), s, t, r);
                continue;
        }
        break;
    } return t; }
    parseAdditive() { let e = this.inputIndex, t = this.parseMultiplicative(); for (; this.next.type == L.Operator;) {
        let s = this.next.strValue;
        switch (s) {
            case "+":
            case "-":
                this.advance();
                let r = this.parseMultiplicative();
                t = new Be(this.span(e), this.sourceSpan(e), s, t, r);
                continue;
        }
        break;
    } return t; }
    parseMultiplicative() { let e = this.inputIndex, t = this.parseExponentiation(); for (; this.next.type == L.Operator;) {
        let s = this.next.strValue;
        switch (s) {
            case "*":
            case "%":
            case "/":
                this.advance();
                let r = this.parseExponentiation();
                t = new Be(this.span(e), this.sourceSpan(e), s, t, r);
                continue;
        }
        break;
    } return t; }
    parseExponentiation() { let e = this.inputIndex, t = this.parsePrefix(); for (; this.next.type == L.Operator && this.next.strValue === "**";) {
        (t instanceof Rs || t instanceof Qr || t instanceof Zr || t instanceof Jr) && this.error("Unary operator used immediately before exponentiation expression. Parenthesis must be used to disambiguate operator precedence"), this.advance();
        let s = this.parseExponentiation();
        t = new Be(this.span(e), this.sourceSpan(e), "**", t, s);
    } return t; }
    parsePrefix() { if (this.next.type == L.Operator) {
        let e = this.inputIndex, t = this.next.strValue, s;
        switch (t) {
            case "+": return this.advance(), s = this.parsePrefix(), Rs.createPlus(this.span(e), this.sourceSpan(e), s);
            case "-": return this.advance(), s = this.parsePrefix(), Rs.createMinus(this.span(e), this.sourceSpan(e), s);
            case "!": return this.advance(), s = this.parsePrefix(), new Qr(this.span(e), this.sourceSpan(e), s);
        }
    }
    else if (this.next.isKeywordTypeof()) {
        let e = this.inputIndex;
        this.advance();
        let t = this.parsePrefix();
        return new Zr(this.span(e), this.sourceSpan(e), t);
    }
    else if (this.next.isKeywordVoid()) {
        let e = this.inputIndex;
        this.advance();
        let t = this.parsePrefix();
        return new Jr(this.span(e), this.sourceSpan(e), t);
    } return this.parseCallChain(); }
    parseCallChain() { let e = this.inputIndex, t = this.parsePrimary(); for (;;)
        if (this.consumeOptionalCharacter(Wn))
            t = this.parseAccessMember(t, e, !1);
        else if (this.consumeOptionalOperator("?."))
            this.consumeOptionalCharacter($e) ? t = this.parseCall(t, e, !0) : t = this.consumeOptionalCharacter(Ot) ? this.parseKeyedReadOrWrite(t, e, !0) : this.parseAccessMember(t, e, !0);
        else if (this.consumeOptionalCharacter(Ot))
            t = this.parseKeyedReadOrWrite(t, e, !1);
        else if (this.consumeOptionalCharacter($e))
            t = this.parseCall(t, e, !1);
        else if (this.consumeOptionalOperator("!"))
            t = new Kr(this.span(e), this.sourceSpan(e), t);
        else if (this.next.isTemplateLiteralEnd())
            t = this.parseNoInterpolationTaggedTemplateLiteral(t, e);
        else if (this.next.isTemplateLiteralPart())
            t = this.parseTaggedTemplateLiteral(t, e);
        else
            return t; }
    parsePrimary() { let e = this.inputIndex; if (this.isArrowFunction())
        return this.parseArrowFunction(e); if (this.consumeOptionalCharacter($e)) {
        this.rparensExpected++;
        let t = this.parsePipe();
        return this.consumeOptionalCharacter(ge) || (this.error("Missing closing parentheses"), this.consumeOptionalCharacter(ge)), this.rparensExpected--, new ni(this.span(e), this.sourceSpan(e), t);
    }
    else {
        if (this.next.isKeywordNull())
            return this.advance(), new We(this.span(e), this.sourceSpan(e), null);
        if (this.next.isKeywordUndefined())
            return this.advance(), new We(this.span(e), this.sourceSpan(e), void 0);
        if (this.next.isKeywordTrue())
            return this.advance(), new We(this.span(e), this.sourceSpan(e), !0);
        if (this.next.isKeywordFalse())
            return this.advance(), new We(this.span(e), this.sourceSpan(e), !1);
        if (this.next.isKeywordIn())
            return this.advance(), new We(this.span(e), this.sourceSpan(e), "in");
        if (this.next.isKeywordThis())
            return this.advance(), new zr(this.span(e), this.sourceSpan(e));
        if (this.consumeOptionalCharacter(Ot))
            return this.parseLiteralArray(e);
        if (this.next.isCharacter(ht))
            return this.parseLiteralMap();
        if (this.next.isIdentifier())
            return this.parseAccessMember(new Ut(this.span(e), this.sourceSpan(e)), e, !1);
        if (this.next.isNumber()) {
            let t = this.next.toNumber();
            return this.advance(), new We(this.span(e), this.sourceSpan(e), t);
        }
        else {
            if (this.next.isTemplateLiteralEnd())
                return this.parseNoInterpolationTemplateLiteral();
            if (this.next.isTemplateLiteralPart())
                return this.parseTemplateLiteral();
            if (this.next.isString() && this.next.kind === ns.Plain) {
                let t = this.next.toString();
                return this.advance(), new We(this.span(e), this.sourceSpan(e), t);
            }
            else
                return this.next.isPrivateIdentifier() ? (this._reportErrorForPrivateIdentifier(this.next, null), new Ne(this.span(e), this.sourceSpan(e))) : this.next.isRegExpBody() ? this.parseRegularExpressionLiteral() : this.index >= this.tokens.length ? (this.error(`Unexpected end of expression: ${this.input}`), new Ne(this.span(e), this.sourceSpan(e))) : (this.error(`Unexpected token ${this.next}`), new Ne(this.span(e), this.sourceSpan(e)));
        }
    } }
    parseLiteralArray(e) { this.rbracketsExpected++; let t = []; do
        if (this.next.isOperator("..."))
            t.push(this.parseSpreadElement());
        else if (!this.next.isCharacter(Zt))
            t.push(this.parsePipe());
        else
            break;
    while (this.consumeOptionalCharacter(De)); return this.rbracketsExpected--, this.expectCharacter(Zt), new Yr(this.span(e), this.sourceSpan(e), t); }
    parseLiteralMap() { let e = [], t = [], s = this.inputIndex; if (this.expectCharacter(ht), !this.consumeOptionalCharacter(Re)) {
        this.rbracesExpected++;
        do {
            let r = this.inputIndex;
            if (this.next.isOperator("...")) {
                this.advance(), e.push({ kind: "spread", span: this.span(r), sourceSpan: this.sourceSpan(r) }), t.push(this.parsePipe());
                continue;
            }
            let i = this.next.isString(), o = this.expectIdentifierOrKeywordOrString(), a = this.span(r), l = this.sourceSpan(r), c = { kind: "property", key: o, quoted: i, span: a, sourceSpan: l };
            e.push(c), i ? (this.expectCharacter(Rt), t.push(this.parsePipe())) : this.consumeOptionalCharacter(Rt) ? t.push(this.parsePipe()) : (c.isShorthandInitialized = !0, t.push(new $t(a, l, l, new Ut(a, l), o)));
        } while (this.consumeOptionalCharacter(De) && !this.next.isCharacter(Re));
        this.rbracesExpected--, this.expectCharacter(Re);
    } return new ps(this.span(s), this.sourceSpan(s), e, t); }
    parseAccessMember(e, t, s) { let r = this.inputIndex, i = this.withContext(kr.Writable, () => { let a = this.expectIdentifierOrKeyword() ?? ""; return a.length === 0 && this.error("Expected identifier for property access", e.span.end), a; }), o = this.sourceSpan(r); if (s)
        return this.isAssignmentOperator(this.next) ? (this.advance(), this.error("The '?.' operator cannot be used in the assignment"), new Ne(this.span(t), this.sourceSpan(t))) : new Gr(this.span(t), this.sourceSpan(t), o, e, i); if (this.isAssignmentOperator(this.next)) {
        let a = this.next.strValue;
        if (!(this.parseFlags & 1))
            return this.advance(), this.error("Bindings cannot contain assignments"), new Ne(this.span(t), this.sourceSpan(t));
        let l = new $t(this.span(t), this.sourceSpan(t), o, e, i);
        this.advance();
        let c = this.parseConditional();
        return new Be(this.span(t), this.sourceSpan(t), a, l, c);
    }
    else
        return new $t(this.span(t), this.sourceSpan(t), o, e, i); }
    parseCall(e, t, s) { let r = this.inputIndex; this.rparensExpected++; let i = this.parseCallArguments(), o = this.span(r, this.inputIndex).toAbsolute(this.absoluteOffset); this.expectCharacter(ge), this.rparensExpected--; let a = this.span(t), l = this.sourceSpan(t); return s ? new wo(a, l, e, i, o) : new js(a, l, e, i, o); }
    parseCallArguments() { if (this.next.isCharacter(ge))
        return []; let e = []; do
        e.push(this.next.isOperator("...") ? this.parseSpreadElement() : this.parsePipe());
    while (this.consumeOptionalCharacter(De)); return e; }
    parseSpreadElement() { this.next.isOperator("...") || this.error("Spread element must start with '...' operator"); let e = this.inputIndex; this.advance(); let t = this.parsePipe(), s = this.span(e), r = this.sourceSpan(e); return new vo(s, r, t); }
    expectTemplateBindingKey() { let e = "", t = !1, s = this.currentAbsoluteOffset; do
        e += this.expectIdentifierOrKeywordOrString(), t = this.consumeOptionalOperator("-"), t && (e += "-");
    while (t); return { source: e, span: new tt(s, s + e.length) }; }
    parseTemplateBindings(e) { let t = []; for (t.push(...this.parseDirectiveKeywordBindings(e)); this.index < this.tokens.length;) {
        let s = this.parseLetBinding();
        if (s)
            t.push(s);
        else {
            let r = this.expectTemplateBindingKey(), i = this.parseAsBinding(r);
            i ? t.push(i) : (r.source = e.source + r.source.charAt(0).toUpperCase() + r.source.substring(1), t.push(...this.parseDirectiveKeywordBindings(r)));
        }
        this.consumeStatementTerminator();
    } return new Jl(t, [], this.errors); }
    parseKeyedReadOrWrite(e, t, s) { return this.withContext(kr.Writable, () => { this.rbracketsExpected++; let r = this.parsePipe(); if (r instanceof Ne && this.error("Key access cannot be empty"), this.rbracketsExpected--, this.expectCharacter(Zt), this.isAssignmentOperator(this.next)) {
        let i = this.next.strValue;
        if (s)
            this.advance(), this.error("The '?.' operator cannot be used in the assignment");
        else {
            let o = new hs(this.span(t), this.sourceSpan(t), e, r);
            this.advance();
            let a = this.parseConditional();
            return new Be(this.span(t), this.sourceSpan(t), i, o, a);
        }
    }
    else
        return s ? new Xr(this.span(t), this.sourceSpan(t), e, r) : new hs(this.span(t), this.sourceSpan(t), e, r); return new Ne(this.span(t), this.sourceSpan(t)); }); }
    parseDirectiveKeywordBindings(e) { let t = []; this.consumeOptionalCharacter(Rt); let s = this.getDirectiveBoundTarget(), r = this.currentAbsoluteOffset, i = this.parseAsBinding(e); i || (this.consumeStatementTerminator(), r = this.currentAbsoluteOffset); let o = new tt(e.span.start, r); return t.push(new cl(o, e, s)), i && t.push(i), t; }
    getDirectiveBoundTarget() { if (this.next === gr || this.peekKeywordAs() || this.peekKeywordLet())
        return null; let e = this.parsePipe(), { start: t, end: s } = e.span, r = this.input.substring(t, s); return new ze(e, r, mn(this.parseSourceSpan), this.absoluteOffset + t, this.errors); }
    parseAsBinding(e) { if (!this.peekKeywordAs())
        return null; this.advance(); let t = this.expectTemplateBindingKey(); this.consumeStatementTerminator(); let s = new tt(e.span.start, this.currentAbsoluteOffset); return new si(s, t, e); }
    parseLetBinding() { if (!this.peekKeywordLet())
        return null; let e = this.currentAbsoluteOffset; this.advance(); let t = this.expectTemplateBindingKey(), s = null; this.consumeOptionalOperator("=") && (s = this.expectTemplateBindingKey()), this.consumeStatementTerminator(); let r = new tt(e, this.currentAbsoluteOffset); return new si(r, t, s); }
    parseNoInterpolationTaggedTemplateLiteral(e, t) { let s = this.parseNoInterpolationTemplateLiteral(); return new ei(this.span(t), this.sourceSpan(t), e, s); }
    parseNoInterpolationTemplateLiteral() { let e = this.next.strValue, t = this.inputIndex; this.advance(); let s = this.span(t), r = this.sourceSpan(t); return new ti(s, r, [new Eo(s, r, e)], []); }
    parseTaggedTemplateLiteral(e, t) { let s = this.parseTemplateLiteral(); return new ei(this.span(t), this.sourceSpan(t), e, s); }
    parseTemplateLiteral() { let e = [], t = [], s = this.inputIndex; for (; this.next !== gr;) {
        let r = this.next;
        if (r.isTemplateLiteralPart() || r.isTemplateLiteralEnd()) {
            let i = this.inputIndex;
            if (this.advance(), e.push(new Eo(this.span(i), this.sourceSpan(i), r.strValue)), r.isTemplateLiteralEnd())
                break;
        }
        else if (r.isTemplateLiteralInterpolationStart()) {
            this.advance(), this.rbracesExpected++;
            let i = this.parsePipe();
            i instanceof Ne ? this.error("Template literal interpolation cannot be empty") : t.push(i), this.rbracesExpected--;
        }
        else
            this.advance();
    } return new ti(this.span(s), this.sourceSpan(s), e, t); }
    parseRegularExpressionLiteral() { let e = this.next; if (this.advance(), !e.isRegExpBody())
        return new Ne(this.span(this.inputIndex), this.sourceSpan(this.inputIndex)); let t = null; if (this.next.isRegExpFlags()) {
        t = this.next, this.advance();
        let i = new Set;
        for (let o = 0; o < t.strValue.length; o++) {
            let a = t.strValue[o];
            gh.has(a) ? i.has(a) ? this.error(`Duplicate regular expression flag "${a}"`, t.index + o) : i.add(a) : this.error(`Unsupported regular expression flag "${a}". The supported flags are: ` + Array.from(gh, l => `"${l}"`).join(", "), t.index + o);
        }
    } let s = e.index, r = t ? t.end : e.end; return new xo(this.span(s, r), this.sourceSpan(s, r), e.strValue, t ? t.strValue : null); }
    parseArrowFunction(e) { let t; if (this.next.isIdentifier()) {
        let r = this.next;
        this.advance(), t = [this.getArrowFunctionIdentifierArg(r)];
    }
    else
        this.next.isCharacter($e) ? (this.rparensExpected++, this.advance(), t = this.parseArrowFunctionParameters(), this.rparensExpected--) : (t = [], this.error(`Unexpected token ${this.next}`)); this.expectOperator("=>"); let s; if (this.next.isCharacter(ht))
        this.error("Multi-line arrow functions are not supported. If you meant to return an object literal, wrap it with parentheses."), s = new Ne(this.span(e), this.sourceSpan(e));
    else {
        let r = this.parseFlags;
        this.parseFlags = 1, s = this.parseExpression(), this.parseFlags = r;
    } return new So(this.span(e), this.sourceSpan(e), t, s); }
    parseArrowFunctionParameters() { let e = []; if (!this.consumeOptionalCharacter(ge))
        for (; this.next !== gr;)
            if (this.next.isIdentifier()) {
                let t = this.next;
                if (this.advance(), e.push(this.getArrowFunctionIdentifierArg(t)), this.consumeOptionalCharacter(ge))
                    break;
                this.expectCharacter(De);
            }
            else {
                this.error(`Unexpected token ${this.next}`);
                break;
            } return e; }
    getArrowFunctionIdentifierArg(e) { return new ll(e.strValue, this.span(e.index), this.sourceSpan(e.index)); }
    isArrowFunction() { let e = this.index, t = this.tokens; if (e > t.length - 2)
        return !1; if (t[e].isIdentifier() && t[e + 1].isOperator("=>"))
        return !0; if (t[e].isCharacter($e)) {
        let s = e + 1;
        for (s; s < t.length && !(!t[s].isIdentifier() && !t[s].isCharacter(De)); s++)
            ;
        return s < t.length - 1 && t[s].isCharacter(ge) && t[s + 1].isOperator("=>");
    } return !1; }
    consumeStatementTerminator() { this.consumeOptionalCharacter(je) || this.consumeOptionalCharacter(De); }
    error(e, t = this.index) { this.errors.push(Ms(e, this.input, this.getErrorLocationText(t), this.parseSourceSpan)), this.skip(); }
    getErrorLocationText(e) { return e < this.tokens.length ? `at column ${this.tokens[e].index + 1} in` : "at the end of the expression"; }
    _reportErrorForPrivateIdentifier(e, t) { let s = `Private identifiers are not supported. Unexpected private identifier: ${e}`; t !== null && (s += `, ${t}`), this.error(s); }
    skip() { let e = this.next; for (; this.index < this.tokens.length && !e.isCharacter(je) && !e.isOperator("|") && (this.rparensExpected <= 0 || !e.isCharacter(ge)) && (this.rbracesExpected <= 0 || !e.isCharacter(Re)) && (this.rbracketsExpected <= 0 || !e.isCharacter(Zt)) && (!(this.context & kr.Writable) || !this.isAssignmentOperator(e));)
        this.next.isError() && this.errors.push(Ms(this.next.toString(), this.input, this.getErrorLocationText(this.next.index), this.parseSourceSpan)), this.advance(), e = this.next; }
};
function Ms(n, e, t, s) { t.length > 0 && (t = ` ${t} `); let r = mn(s), i = `Parser Error: ${n}${t}[${e}] in ${r}`; return new N(s, i); }
var Kl = class extends zs {
    errors = [];
    visitPipe() { this.errors.push("pipes"); }
};
function Jw(n) { let e = new Map, t = 0, s = 0, r = 0; for (; r < n.length;) {
    let i = n[r];
    if (i.type === 9) {
        let [o, a] = i.parts;
        t += a.length, s += o.length;
    }
    else {
        let o = i.parts.reduce((a, l) => a + l.length, 0);
        s += o, t += o;
    }
    e.set(s, t), r++;
} return e; }
function Kw(n) { return n.visit(new ec); }
var ec = class {
    visitUnary(e, t) { return `${e.operator}${e.expr.visit(this, t)}`; }
    visitBinary(e, t) { return `${e.left.visit(this, t)} ${e.operation} ${e.right.visit(this, t)}`; }
    visitChain(e, t) { return e.expressions.map(s => s.visit(this, t)).join("; "); }
    visitConditional(e, t) { return `${e.condition.visit(this, t)} ? ${e.trueExp.visit(this, t)} : ${e.falseExp.visit(this, t)}`; }
    visitThisReceiver() { return "this"; }
    visitImplicitReceiver() { return ""; }
    visitInterpolation(e, t) { return tE(e.strings, e.expressions.map(s => s.visit(this, t))).join(""); }
    visitKeyedRead(e, t) { return `${e.receiver.visit(this, t)}[${e.key.visit(this, t)}]`; }
    visitLiteralArray(e, t) { return `[${e.expressions.map(s => s.visit(this, t)).join(", ")}]`; }
    visitLiteralMap(e, t) { return `{${eE(e.keys.map(s => s.kind === "spread" ? "..." : s.quoted ? `'${s.key}'` : s.key), e.values.map(s => s.visit(this, t))).map(([s, r]) => `${s}: ${r}`).join(", ")}}`; }
    visitLiteralPrimitive(e) { if (e.value === null)
        return "null"; switch (typeof e.value) {
        case "number":
        case "boolean": return e.value.toString();
        case "undefined": return "undefined";
        case "string": return `'${e.value.replace(/'/g, "\\'")}'`;
        default: throw new Error(`Unsupported primitive type: ${e.value}`);
    } }
    visitPipe(e, t) { return `${e.exp.visit(this, t)} | ${e.name}`; }
    visitPrefixNot(e, t) { return `!${e.expression.visit(this, t)}`; }
    visitNonNullAssert(e, t) { return `${e.expression.visit(this, t)}!`; }
    visitPropertyRead(e, t) { return e.receiver instanceof Ut || e.receiver instanceof zr ? e.name : `${e.receiver.visit(this, t)}.${e.name}`; }
    visitSafePropertyRead(e, t) { return `${e.receiver.visit(this, t)}?.${e.name}`; }
    visitSafeKeyedRead(e, t) { return `${e.receiver.visit(this, t)}?.[${e.key.visit(this, t)}]`; }
    visitCall(e, t) { return `${e.receiver.visit(this, t)}(${e.args.map(s => s.visit(this, t)).join(", ")})`; }
    visitSafeCall(e, t) { return `${e.receiver.visit(this, t)}?.(${e.args.map(s => s.visit(this, t)).join(", ")})`; }
    visitTypeofExpression(e, t) { return `typeof ${e.expression.visit(this, t)}`; }
    visitVoidExpression(e, t) { return `void ${e.expression.visit(this, t)}`; }
    visitRegularExpressionLiteral(e, t) { return `/${e.body}/${e.flags || ""}`; }
    visitArrowFunction(e, t) { let s; return e.parameters.length === 1 ? s = e.parameters[0].name : s = `(${e.parameters.map(r => r.name).join(", ")})`, `${s} => ${e.body.visit(this, t)}`; }
    visitASTWithSource(e, t) { return e.ast.visit(this, t); }
    visitTemplateLiteral(e, t) { let s = ""; for (let r = 0; r < e.elements.length; r++) {
        s += e.elements[r].visit(this, t);
        let i = r < e.expressions.length ? e.expressions[r] : null;
        i !== null && (s += "${" + i.visit(this, t) + "}");
    } return "`" + s + "`"; }
    visitTemplateLiteralElement(e, t) { return e.text; }
    visitTaggedTemplateLiteral(e, t) { return e.tag.visit(this, t) + e.template.visit(this, t); }
    visitSpreadElement(e, t) { return `...${e.expression.visit(this, t)}`; }
    visitParenthesizedExpression(e, t) { return "(" + e.expression.visit(this, t) + ")"; }
};
function eE(n, e) { if (n.length !== e.length)
    throw new Error("Array lengths must match"); return n.map((t, s) => [t, e[s]]); }
function tE(n, e) { let t = []; for (let s = 0; s < Math.max(n.length, e.length); s++)
    s < n.length && t.push(n[s]), s < e.length && t.push(e[s]); return t; }
var ro;
function vh() { return ro || (ro = {}, vr(J.HTML, ["iframe|srcdoc", "*|innerHTML", "*|outerHTML"]), vr(J.STYLE, ["*|style"]), vr(J.URL, ["*|formAction", "area|href", "a|href", "a|xlink:href", "form|action", "annotation|href", "annotation|xlink:href", "annotation-xml|href", "annotation-xml|xlink:href", "maction|href", "maction|xlink:href", "malignmark|href", "malignmark|xlink:href", "math|href", "math|xlink:href", "mroot|href", "mroot|xlink:href", "msqrt|href", "msqrt|xlink:href", "merror|href", "merror|xlink:href", "mfrac|href", "mfrac|xlink:href", "mglyph|href", "mglyph|xlink:href", "msub|href", "msub|xlink:href", "msup|href", "msup|xlink:href", "msubsup|href", "msubsup|xlink:href", "mmultiscripts|href", "mmultiscripts|xlink:href", "mprescripts|href", "mprescripts|xlink:href", "mi|href", "mi|xlink:href", "mn|href", "mn|xlink:href", "mo|href", "mo|xlink:href", "mpadded|href", "mpadded|xlink:href", "mphantom|href", "mphantom|xlink:href", "mrow|href", "mrow|xlink:href", "ms|href", "ms|xlink:href", "mspace|href", "mspace|xlink:href", "mstyle|href", "mstyle|xlink:href", "mtable|href", "mtable|xlink:href", "mtd|href", "mtd|xlink:href", "mtr|href", "mtr|xlink:href", "mtext|href", "mtext|xlink:href", "mover|href", "mover|xlink:href", "munder|href", "munder|xlink:href", "munderover|href", "munderover|xlink:href", "semantics|href", "semantics|xlink:href", "none|href", "none|xlink:href", "img|src", "video|src"]), vr(J.RESOURCE_URL, ["base|href", "embed|src", "frame|src", "iframe|src", "link|href", "object|codebase", "object|data", "script|src", "script|href", "script|xlink:href"]), vr(J.ATTRIBUTE_NO_BINDING, ["animate|attributeName", "animate|values", "animate|to", "animate|from", "set|to", "set|attributeName", "animateMotion|attributeName", "animateTransform|attributeName", "unknown|attributeName", "unknown|values", "unknown|to", "unknown|from", "iframe|sandbox", "iframe|allow", "iframe|allowFullscreen", "iframe|referrerPolicy", "iframe|csp", "iframe|fetchPriority", "unknown|sandbox", "unknown|allow", "unknown|allowFullscreen", "unknown|referrerPolicy", "unknown|csp", "unknown|fetchPriority"])), ro; }
function vr(n, e) { for (let t of e)
    ro[t.toLowerCase()] = n; }
var tc = class {
}, nE = "boolean", sE = "number", rE = "string", iE = "object", oE = ["[Element]|textContent,%ariaActiveDescendantElement,%ariaAtomic,%ariaAutoComplete,%ariaBusy,%ariaChecked,%ariaColCount,%ariaColIndex,%ariaColIndexText,%ariaColSpan,%ariaControlsElements,%ariaCurrent,%ariaDescribedByElements,%ariaDescription,%ariaDetailsElements,%ariaDisabled,%ariaErrorMessageElements,%ariaExpanded,%ariaFlowToElements,%ariaHasPopup,%ariaHidden,%ariaInvalid,%ariaKeyShortcuts,%ariaLabel,%ariaLabelledByElements,%ariaLevel,%ariaLive,%ariaModal,%ariaMultiLine,%ariaMultiSelectable,%ariaOrientation,%ariaOwnsElements,%ariaPlaceholder,%ariaPosInSet,%ariaPressed,%ariaReadOnly,%ariaRelevant,%ariaRequired,%ariaRoleDescription,%ariaRowCount,%ariaRowIndex,%ariaRowIndexText,%ariaRowSpan,%ariaSelected,%ariaSetSize,%ariaSort,%ariaValueMax,%ariaValueMin,%ariaValueNow,%ariaValueText,%classList,className,elementTiming,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*fullscreenchange,*fullscreenerror,*search,*webkitfullscreenchange,*webkitfullscreenerror,outerHTML,%part,#scrollLeft,#scrollTop,slot,*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored", "[HTMLElement]^[Element]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,!inert,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy", "abbr,address,article,aside,b,bdi,bdo,cite,content,code,dd,dfn,dt,em,figcaption,figure,footer,header,hgroup,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,search,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy", "media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,!preservesPitch,src,%srcObject,#volume", ":svg:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,%style,#tabIndex", ":svg:graphics^:svg:|", ":svg:animation^:svg:|*begin,*end,*repeat", ":svg:geometry^:svg:|", ":svg:componentTransferFunction^:svg:|", ":svg:gradient^:svg:|", ":svg:textContent^:svg:graphics|", ":svg:textPositioning^:svg:textContent|", "a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,rev,search,shape,target,text,type,username", "area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,search,shape,target,username", "audio^media|", "br^[HTMLElement]|clear", "base^[HTMLElement]|href,target", "body^[HTMLElement]|aLink,background,bgColor,link,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink", "button^[HTMLElement]|!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value", "canvas^[HTMLElement]|#height,#width", "content^[HTMLElement]|select", "dl^[HTMLElement]|!compact", "data^[HTMLElement]|value", "datalist^[HTMLElement]|", "details^[HTMLElement]|!open", "dialog^[HTMLElement]|!open,returnValue", "dir^[HTMLElement]|!compact", "div^[HTMLElement]|align", "embed^[HTMLElement]|align,height,name,src,type,width", "fieldset^[HTMLElement]|!disabled,name", "font^[HTMLElement]|color,face,size", "form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target", "frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src", "frameset^[HTMLElement]|cols,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows", "geolocation^[HTMLElement]|accuracymode,!autolocate,*location,*promptaction,*promptdismiss,*validationstatuschange,!watch", "hr^[HTMLElement]|align,color,!noShade,size,width", "head^[HTMLElement]|", "h1,h2,h3,h4,h5,h6^[HTMLElement]|align", "html^[HTMLElement]|version", "iframe^[HTMLElement]|align,allow,!allowFullscreen,!allowPaymentRequest,csp,frameBorder,height,loading,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width", "img^[HTMLElement]|align,alt,border,%crossOrigin,decoding,#height,#hspace,!isMap,loading,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width", "input^[HTMLElement]|accept,align,alt,autocomplete,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width", "li^[HTMLElement]|type,#value", "label^[HTMLElement]|htmlFor", "legend^[HTMLElement]|align", "link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,imageSizes,imageSrcset,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type", "map^[HTMLElement]|name", "marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width", "menu^[HTMLElement]|!compact", "meta^[HTMLElement]|content,httpEquiv,media,name,scheme", "meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value", "ins,del^[HTMLElement]|cite,dateTime", "ol^[HTMLElement]|!compact,!reversed,#start,type", "object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width", "optgroup^[HTMLElement]|!disabled,label", "option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value", "output^[HTMLElement]|defaultValue,%htmlFor,name,value", "p^[HTMLElement]|align", "param^[HTMLElement]|name,type,value,valueType", "picture^[HTMLElement]|", "pre^[HTMLElement]|#width", "progress^[HTMLElement]|#max,#value", "q,blockquote,cite^[HTMLElement]|", "script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,!noModule,%referrerPolicy,src,text,type", "select^[HTMLElement]|autocomplete,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value", "selectedcontent^[HTMLElement]|", "slot^[HTMLElement]|name", "source^[HTMLElement]|#height,media,sizes,src,srcset,type,#width", "span^[HTMLElement]|", "style^[HTMLElement]|!disabled,media,type", "search^[HTMLELement]|", "caption^[HTMLElement]|align", "th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width", "col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width", "table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width", "tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign", "tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign", "template^[HTMLElement]|", "textarea^[HTMLElement]|autocomplete,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap", "time^[HTMLElement]|dateTime", "title^[HTMLElement]|text", "track^[HTMLElement]|!default,kind,label,src,srclang", "ul^[HTMLElement]|!compact,type", "unknown^[HTMLElement]|", "video^media|!disablePictureInPicture,#height,*enterpictureinpicture,*leavepictureinpicture,!playsInline,poster,#width", ":svg:a^:svg:graphics|", ":svg:animate^:svg:animation|", ":svg:animateMotion^:svg:animation|", ":svg:animateTransform^:svg:animation|", ":svg:circle^:svg:geometry|", ":svg:clipPath^:svg:graphics|", ":svg:defs^:svg:graphics|", ":svg:desc^:svg:|", ":svg:discard^:svg:|", ":svg:ellipse^:svg:geometry|", ":svg:feBlend^:svg:|", ":svg:feColorMatrix^:svg:|", ":svg:feComponentTransfer^:svg:|", ":svg:feComposite^:svg:|", ":svg:feConvolveMatrix^:svg:|", ":svg:feDiffuseLighting^:svg:|", ":svg:feDisplacementMap^:svg:|", ":svg:feDistantLight^:svg:|", ":svg:feDropShadow^:svg:|", ":svg:feFlood^:svg:|", ":svg:feFuncA^:svg:componentTransferFunction|", ":svg:feFuncB^:svg:componentTransferFunction|", ":svg:feFuncG^:svg:componentTransferFunction|", ":svg:feFuncR^:svg:componentTransferFunction|", ":svg:feGaussianBlur^:svg:|", ":svg:feImage^:svg:|", ":svg:feMerge^:svg:|", ":svg:feMergeNode^:svg:|", ":svg:feMorphology^:svg:|", ":svg:feOffset^:svg:|", ":svg:fePointLight^:svg:|", ":svg:feSpecularLighting^:svg:|", ":svg:feSpotLight^:svg:|", ":svg:feTile^:svg:|", ":svg:feTurbulence^:svg:|", ":svg:filter^:svg:|", ":svg:foreignObject^:svg:graphics|", ":svg:g^:svg:graphics|", ":svg:image^:svg:graphics|decoding", ":svg:line^:svg:geometry|", ":svg:linearGradient^:svg:gradient|", ":svg:mpath^:svg:|", ":svg:marker^:svg:|", ":svg:mask^:svg:|", ":svg:metadata^:svg:|", ":svg:path^:svg:geometry|", ":svg:pattern^:svg:|", ":svg:polygon^:svg:geometry|", ":svg:polyline^:svg:geometry|", ":svg:radialGradient^:svg:gradient|", ":svg:rect^:svg:geometry|", ":svg:svg^:svg:graphics|#currentScale,#zoomAndPan", ":svg:script^:svg:|type", ":svg:set^:svg:animation|", ":svg:stop^:svg:|", ":svg:style^:svg:|!disabled,media,title,type", ":svg:switch^:svg:graphics|", ":svg:symbol^:svg:|", ":svg:tspan^:svg:textPositioning|", ":svg:text^:svg:textPositioning|", ":svg:textPath^:svg:textContent|", ":svg:title^:svg:|", ":svg:use^:svg:graphics|", ":svg:view^:svg:|#zoomAndPan", "data^[HTMLElement]|value", "keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name", "menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default", "summary^[HTMLElement]|", "time^[HTMLElement]|dateTime", ":svg:cursor^:svg:|", ":math:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforeinput,*beforematch,*beforetoggle,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contentvisibilityautostatechange,*contextlost,*contextmenu,*contextrestored,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*scrollend,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,%style,#tabIndex", ":math:math^:math:|", ":math:maction^:math:|", ":math:menclose^:math:|", ":math:merror^:math:|", ":math:mfenced^:math:|", ":math:mfrac^:math:|", ":math:mi^:math:|", ":math:mmultiscripts^:math:|", ":math:mn^:math:|", ":math:mo^:math:|", ":math:mover^:math:|", ":math:mpadded^:math:|", ":math:mphantom^:math:|", ":math:mroot^:math:|", ":math:mrow^:math:|", ":math:ms^:math:|", ":math:mspace^:math:|", ":math:msqrt^:math:|", ":math:mstyle^:math:|", ":math:msub^:math:|", ":math:msubsup^:math:|", ":math:msup^:math:|", ":math:mtable^:math:|", ":math:mtd^:math:|", ":math:mtext^:math:|", ":math:mtr^:math:|", ":math:munder^:math:|", ":math:munderover^:math:|", ":math:semantics^:math:|"], Ff = new Map(Object.entries({ class: "className", for: "htmlFor", formaction: "formAction", innerHtml: "innerHTML", readonly: "readOnly", tabindex: "tabIndex", "aria-activedescendant": "ariaActiveDescendantElement", "aria-atomic": "ariaAtomic", "aria-autocomplete": "ariaAutoComplete", "aria-busy": "ariaBusy", "aria-checked": "ariaChecked", "aria-colcount": "ariaColCount", "aria-colindex": "ariaColIndex", "aria-colindextext": "ariaColIndexText", "aria-colspan": "ariaColSpan", "aria-controls": "ariaControlsElements", "aria-current": "ariaCurrent", "aria-describedby": "ariaDescribedByElements", "aria-description": "ariaDescription", "aria-details": "ariaDetailsElements", "aria-disabled": "ariaDisabled", "aria-errormessage": "ariaErrorMessageElements", "aria-expanded": "ariaExpanded", "aria-flowto": "ariaFlowToElements", "aria-haspopup": "ariaHasPopup", "aria-hidden": "ariaHidden", "aria-invalid": "ariaInvalid", "aria-keyshortcuts": "ariaKeyShortcuts", "aria-label": "ariaLabel", "aria-labelledby": "ariaLabelledByElements", "aria-level": "ariaLevel", "aria-live": "ariaLive", "aria-modal": "ariaModal", "aria-multiline": "ariaMultiLine", "aria-multiselectable": "ariaMultiSelectable", "aria-orientation": "ariaOrientation", "aria-owns": "ariaOwnsElements", "aria-placeholder": "ariaPlaceholder", "aria-posinset": "ariaPosInSet", "aria-pressed": "ariaPressed", "aria-readonly": "ariaReadOnly", "aria-required": "ariaRequired", "aria-roledescription": "ariaRoleDescription", "aria-rowcount": "ariaRowCount", "aria-rowindex": "ariaRowIndex", "aria-rowindextext": "ariaRowIndexText", "aria-rowspan": "ariaRowSpan", "aria-selected": "ariaSelected", "aria-setsize": "ariaSetSize", "aria-sort": "ariaSort", "aria-valuemax": "ariaValueMax", "aria-valuemin": "ariaValueMin", "aria-valuenow": "ariaValueNow", "aria-valuetext": "ariaValueText" })), aE = Array.from(Ff).reduce((n, [e, t]) => (n.set(e, t), n), new Map), sr = class extends tc {
    _schema = new Map;
    _eventSchema = new Map;
    constructor() { super(), oE.forEach(e => { let t = new Map, s = new Set, [r, i] = e.split("|"), o = i.split(","), [a, l] = r.split("^"); a.split(",").forEach(h => { this._schema.set(h.toLowerCase(), t), this._eventSchema.set(h.toLowerCase(), s); }); let c = l && this._schema.get(l.toLowerCase()); if (c) {
        for (let [h, p] of c)
            t.set(h, p);
        for (let h of this._eventSchema.get(l.toLowerCase()))
            s.add(h);
    } o.forEach(h => { if (h.length > 0)
        switch (h[0]) {
            case "*":
                s.add(h.substring(1));
                break;
            case "!":
                t.set(h.substring(1), nE);
                break;
            case "#":
                t.set(h.substring(1), sE);
                break;
            case "%":
                t.set(h.substring(1), iE);
                break;
            default: t.set(h, rE);
        } }); }); }
    hasProperty(e, t, s) { if (s.some(i => i.name === Ya.name))
        return !0; if (e.indexOf("-") > -1) {
        if (Tu(e) || hl(e))
            return !1;
        if (s.some(i => i.name === Xa.name))
            return !0;
    } return (this._schema.get(e.toLowerCase()) || this._schema.get("unknown")).has(t); }
    hasElement(e, t) { return t.some(s => s.name === Ya.name) || e.indexOf("-") > -1 && (Tu(e) || hl(e) || t.some(s => s.name === Xa.name)) ? !0 : this._schema.has(e.toLowerCase()); }
    securityContext(e, t, s) { s && (t = this.getMappedPropName(t)), e = e.toLowerCase(), t = t.toLowerCase(); let r = vh()[e + "|" + t]; return r || (r = vh()["*|" + t], r || J.NONE); }
    getMappedPropName(e) { return Ff.get(e) ?? e; }
    getDefaultComponentElementName() { return "ng-component"; }
    validateProperty(e) {
        return e.toLowerCase().startsWith("on") ? { error: !0, msg: `Binding to event property '${e}' is disallowed for security reasons, please use (${e.slice(2)})=...
If '${e}' is a directive input, make sure the directive is imported by the current module.` } : { error: !1 };
    }
    validateAttribute(e) { return e.toLowerCase().startsWith("on") ? { error: !0, msg: `Binding to event attribute '${e}' is disallowed for security reasons, please use (${e.slice(2)})=...` } : { error: !1 }; }
    allKnownElementNames() { return Array.from(this._schema.keys()); }
    allKnownAttributesOfElement(e) { let t = this._schema.get(e.toLowerCase()) || this._schema.get("unknown"); return Array.from(t.keys()).map(s => aE.get(s) ?? s); }
    allKnownEventsOfElement(e) { return Array.from(this._eventSchema.get(e.toLowerCase()) ?? []); }
    normalizeAnimationStyleProperty(e) { return im(e); }
    normalizeAnimationStyleValue(e, t, s) { let r = "", i = s.toString().trim(), o = null; if (lE(e) && s !== 0 && s !== "0")
        if (typeof s == "number")
            r = "px";
        else {
            let a = s.match(/^[+-]?[\d\.]+([a-z]*)$/);
            a && a[1].length == 0 && (o = `Please provide a CSS unit value for ${t}:${s}`);
        } return { error: o, value: i + r }; }
};
function lE(n) { switch (n) {
    case "width":
    case "height":
    case "minWidth":
    case "minHeight":
    case "maxWidth":
    case "maxHeight":
    case "left":
    case "top":
    case "bottom":
    case "right":
    case "fontSize":
    case "outlineWidth":
    case "outlineOffset":
    case "paddingTop":
    case "paddingLeft":
    case "paddingBottom":
    case "paddingRight":
    case "marginTop":
    case "marginLeft":
    case "marginBottom":
    case "marginRight":
    case "borderRadius":
    case "borderWidth":
    case "borderTopWidth":
    case "borderLeftWidth":
    case "borderRightWidth":
    case "borderBottomWidth":
    case "textIndent": return !0;
    default: return !1;
} }
var H = class {
    closedByChildren = {};
    contentType;
    closedByParent = !1;
    implicitNamespacePrefix;
    isVoid;
    ignoreFirstLf;
    canSelfClose;
    preventNamespaceInheritance;
    constructor({ closedByChildren: e, implicitNamespacePrefix: t, contentType: s = Bt.PARSABLE_DATA, closedByParent: r = !1, isVoid: i = !1, ignoreFirstLf: o = !1, preventNamespaceInheritance: a = !1, canSelfClose: l = !1 } = {}) { e && e.length > 0 && e.forEach(c => this.closedByChildren[c] = !0), this.isVoid = i, this.closedByParent = r || i, this.implicitNamespacePrefix = t || null, this.contentType = s, this.ignoreFirstLf = o, this.preventNamespaceInheritance = a, this.canSelfClose = l ?? i; }
    isClosedByChild(e) { return this.isVoid || e.toLowerCase() in this.closedByChildren; }
    getContentType(e) { return typeof this.contentType == "object" ? (e === void 0 ? void 0 : this.contentType[e]) ?? this.contentType.default : this.contentType; }
}, wh, _s;
function nc(n) { return _s || (wh = new H({ canSelfClose: !0 }), _s = Object.assign(Object.create(null), { base: new H({ isVoid: !0 }), meta: new H({ isVoid: !0 }), area: new H({ isVoid: !0 }), embed: new H({ isVoid: !0 }), link: new H({ isVoid: !0 }), img: new H({ isVoid: !0 }), input: new H({ isVoid: !0 }), param: new H({ isVoid: !0 }), hr: new H({ isVoid: !0 }), br: new H({ isVoid: !0 }), source: new H({ isVoid: !0 }), track: new H({ isVoid: !0 }), wbr: new H({ isVoid: !0 }), p: new H({ closedByChildren: ["address", "article", "aside", "blockquote", "div", "dl", "fieldset", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"], closedByParent: !0 }), thead: new H({ closedByChildren: ["tbody", "tfoot"] }), tbody: new H({ closedByChildren: ["tbody", "tfoot"], closedByParent: !0 }), tfoot: new H({ closedByChildren: ["tbody"], closedByParent: !0 }), tr: new H({ closedByChildren: ["tr"], closedByParent: !0 }), td: new H({ closedByChildren: ["td", "th"], closedByParent: !0 }), th: new H({ closedByChildren: ["td", "th"], closedByParent: !0 }), col: new H({ isVoid: !0 }), svg: new H({ implicitNamespacePrefix: "svg" }), foreignObject: new H({ implicitNamespacePrefix: "svg", preventNamespaceInheritance: !0 }), math: new H({ implicitNamespacePrefix: "math" }), li: new H({ closedByChildren: ["li"], closedByParent: !0 }), dt: new H({ closedByChildren: ["dt", "dd"] }), dd: new H({ closedByChildren: ["dt", "dd"], closedByParent: !0 }), rb: new H({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: !0 }), rt: new H({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: !0 }), rtc: new H({ closedByChildren: ["rb", "rtc", "rp"], closedByParent: !0 }), rp: new H({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: !0 }), optgroup: new H({ closedByChildren: ["optgroup"], closedByParent: !0 }), option: new H({ closedByChildren: ["option", "optgroup"], closedByParent: !0 }), pre: new H({ ignoreFirstLf: !0 }), listing: new H({ ignoreFirstLf: !0 }), style: new H({ contentType: Bt.RAW_TEXT }), script: new H({ contentType: Bt.RAW_TEXT }), title: new H({ contentType: { default: Bt.ESCAPABLE_RAW_TEXT, svg: Bt.PARSABLE_DATA } }), textarea: new H({ contentType: Bt.ESCAPABLE_RAW_TEXT, ignoreFirstLf: !0 }) }), new sr().allKnownElementNames().forEach(e => { !_s[e] && pl(e) === null && (_s[e] = new H({ canSelfClose: !1 })); })), _s[n] ?? _s[n.toLowerCase()] ?? wh; }
var Eh = { A: "LINK", B: "BOLD_TEXT", BR: "LINE_BREAK", EM: "EMPHASISED_TEXT", H1: "HEADING_LEVEL1", H2: "HEADING_LEVEL2", H3: "HEADING_LEVEL3", H4: "HEADING_LEVEL4", H5: "HEADING_LEVEL5", H6: "HEADING_LEVEL6", HR: "HORIZONTAL_RULE", I: "ITALIC_TEXT", LI: "LIST_ITEM", LINK: "MEDIA_LINK", OL: "ORDERED_LIST", P: "PARAGRAPH", Q: "QUOTATION", S: "STRIKETHROUGH_TEXT", SMALL: "SMALL_TEXT", SUB: "SUBSTRIPT", SUP: "SUPERSCRIPT", TBODY: "TABLE_BODY", TD: "TABLE_CELL", TFOOT: "TABLE_FOOTER", TH: "TABLE_HEADER_CELL", THEAD: "TABLE_HEADER", TR: "TABLE_ROW", TT: "MONOSPACED_TEXT", U: "UNDERLINED_TEXT", UL: "UNORDERED_LIST" }, sc = class {
    _placeHolderNameCounts = {};
    _signatureToName = {};
    getStartTagPlaceholderName(e, t, s) { let r = this._hashTag(e, t, s); if (this._signatureToName[r])
        return this._signatureToName[r]; let i = e.toUpperCase(), o = Eh[i] || `TAG_${i}`, a = this._generateUniqueName(s ? o : `START_${o}`); return this._signatureToName[r] = a, a; }
    getCloseTagPlaceholderName(e) { let t = this._hashClosingTag(e); if (this._signatureToName[t])
        return this._signatureToName[t]; let s = e.toUpperCase(), r = Eh[s] || `TAG_${s}`, i = this._generateUniqueName(`CLOSE_${r}`); return this._signatureToName[t] = i, i; }
    getPlaceholderName(e, t) { let s = e.toUpperCase(), r = `PH: ${s}=${t}`; if (this._signatureToName[r])
        return this._signatureToName[r]; let i = this._generateUniqueName(s); return this._signatureToName[r] = i, i; }
    getUniquePlaceholder(e) { return this._generateUniqueName(e.toUpperCase()); }
    getStartBlockPlaceholderName(e, t) { let s = this._hashBlock(e, t); if (this._signatureToName[s])
        return this._signatureToName[s]; let r = this._generateUniqueName(`START_BLOCK_${this._toSnakeCase(e)}`); return this._signatureToName[s] = r, r; }
    getCloseBlockPlaceholderName(e) { let t = this._hashClosingBlock(e); if (this._signatureToName[t])
        return this._signatureToName[t]; let s = this._generateUniqueName(`CLOSE_BLOCK_${this._toSnakeCase(e)}`); return this._signatureToName[t] = s, s; }
    _hashTag(e, t, s) { let r = `<${e}`, i = Object.keys(t).sort().map(a => ` ${a}=${t[a]}`).join(""), o = s ? "/>" : `></${e}>`; return r + i + o; }
    _hashClosingTag(e) { return this._hashTag(`/${e}`, {}, !1); }
    _hashBlock(e, t) { let s = t.length === 0 ? "" : ` (${t.sort().join("; ")})`; return `@${e}${s} {}`; }
    _hashClosingBlock(e) { return this._hashBlock(`close_${e}`, []); }
    _toSnakeCase(e) { return e.toUpperCase().replace(/[^A-Z0-9]/g, "_"); }
    _generateUniqueName(e) { if (!this._placeHolderNameCounts.hasOwnProperty(e))
        return this._placeHolderNameCounts[e] = 1, e; let s = this._placeHolderNameCounts[e]; return this._placeHolderNameCounts[e] = s + 1, `${e}_${s}`; }
}, cE = new Jo(new Di);
function $f(n, e) { let t = new rc(cE, n, e); return (s, r, i, o, a) => t.toI18nMessage(s, r, i, o, a); }
function uE(n, e) { return e; }
var rc = class {
    _expressionParser;
    _retainEmptyTokens;
    _preserveExpressionWhitespace;
    constructor(e, t, s) { this._expressionParser = e, this._retainEmptyTokens = t, this._preserveExpressionWhitespace = s; }
    toI18nMessage(e, t = "", s = "", r = "", i) { let o = { isIcu: e.length == 1 && e[0] instanceof En, icuDepth: 0, placeholderRegistry: new sc, placeholderToContent: {}, placeholderToMessage: {}, visitNodeFn: i || uE }, a = P(this, e, o); return new Le(a, o.placeholderToContent, o.placeholderToMessage, t, s, r); }
    visitElement(e, t) { return this._visitElementLike(e, t); }
    visitComponent(e, t) { return this._visitElementLike(e, t); }
    visitDirective(e, t) { throw new Error("Unreachable code"); }
    visitAttribute(e, t) { let s = e.valueTokens === void 0 || e.valueTokens.length === 1 ? new Mt(e.value, e.valueSpan || e.sourceSpan) : this._visitTextWithInterpolation(e.valueTokens, e.valueSpan || e.sourceSpan, t, e.i18n); return t.visitNodeFn(e, s); }
    visitText(e, t) { let s = e.tokens.length === 1 ? new Mt(e.value, e.sourceSpan) : this._visitTextWithInterpolation(e.tokens, e.sourceSpan, t, e.i18n); return t.visitNodeFn(e, s); }
    visitComment(e, t) { return null; }
    visitExpansion(e, t) { t.icuDepth++; let s = {}, r = new Tn(e.switchValue, e.type, s, e.sourceSpan); if (e.cases.forEach(a => { s[a.value] = new rt(a.expression.map(l => l.visit(this, t)), a.expSourceSpan); }), t.icuDepth--, t.isIcu || t.icuDepth > 0) {
        let a = t.placeholderRegistry.getUniquePlaceholder(`VAR_${e.type}`);
        return r.expressionPlaceholder = a, t.placeholderToContent[a] = { text: e.switchValue, sourceSpan: e.switchValueSourceSpan }, t.visitNodeFn(e, r);
    } let i = t.placeholderRegistry.getPlaceholderName("ICU", e.sourceSpan.toString()); t.placeholderToMessage[i] = this.toI18nMessage([e], "", "", "", void 0); let o = new In(r, i, e.sourceSpan); return t.visitNodeFn(e, o); }
    visitExpansionCase(e, t) { throw new Error("Unreachable code"); }
    visitBlock(e, t) { let s = P(this, e.children, t); if (e.name === "switch")
        return new rt(s, e.sourceSpan); let r = e.parameters.map(l => l.expression), i = t.placeholderRegistry.getStartBlockPlaceholderName(e.name, r), o = t.placeholderRegistry.getCloseBlockPlaceholderName(e.name); t.placeholderToContent[i] = { text: e.startSourceSpan.toString(), sourceSpan: e.startSourceSpan }, t.placeholderToContent[o] = { text: e.endSourceSpan ? e.endSourceSpan.toString() : "}", sourceSpan: e.endSourceSpan ?? e.sourceSpan }; let a = new zt(e.name, r, i, o, s, e.sourceSpan, e.startSourceSpan, e.endSourceSpan); return t.visitNodeFn(e, a); }
    visitBlockParameter(e, t) { throw new Error("Unreachable code"); }
    visitLetDeclaration(e, t) { return null; }
    _visitElementLike(e, t) { let s = P(this, e.children, t), r = {}, i = p => { r[p.name] = p.value; }, o, a; e instanceof Me ? (o = e.name, a = nc(e.name).isVoid) : (o = e.fullName, a = e.tagName ? nc(e.tagName).isVoid : !1), e.attrs.forEach(i), e.directives.forEach(p => p.attrs.forEach(i)); let l = t.placeholderRegistry.getStartTagPlaceholderName(o, r, a); t.placeholderToContent[l] = { text: e.startSourceSpan.toString(), sourceSpan: e.startSourceSpan }; let c = ""; a || (c = t.placeholderRegistry.getCloseTagPlaceholderName(o), t.placeholderToContent[c] = { text: `</${o}>`, sourceSpan: e.endSourceSpan ?? e.sourceSpan }); let h = new jt(o, r, l, c, s, a, e.sourceSpan, e.startSourceSpan, e.endSourceSpan); return t.visitNodeFn(e, h); }
    _visitTextWithInterpolation(e, t, s, r) { let i = [], o = !1; for (let a of e)
        switch (a.type) {
            case 8:
            case 17:
                o = !0;
                let [l, c, h] = a.parts, p = mE(c) || "INTERPOLATION", m = s.placeholderRegistry.getPlaceholderName(p, c);
                if (this._preserveExpressionWhitespace)
                    s.placeholderToContent[m] = { text: a.parts.join(""), sourceSpan: a.sourceSpan }, i.push(new mt(c, m, a.sourceSpan));
                else {
                    let v = this.normalizeExpression(a);
                    s.placeholderToContent[m] = { text: `${l}${v}${h}`, sourceSpan: a.sourceSpan }, i.push(new mt(v, m, a.sourceSpan));
                }
                break;
            default:
                if (a.parts[0].length > 0 || this._retainEmptyTokens) {
                    let v = i[i.length - 1];
                    v instanceof Mt ? (v.value += a.parts[0], v.sourceSpan = new B(v.sourceSpan.start, a.sourceSpan.end, v.sourceSpan.fullStart, v.sourceSpan.details)) : i.push(new Mt(a.parts[0], a.sourceSpan));
                }
                else
                    this._retainEmptyTokens && i.push(new Mt(a.parts[0], a.sourceSpan));
                break;
        } return o ? (hE(i, r), new rt(i, t)) : i[0]; }
    normalizeExpression(e) { let t = e.parts[1], s = this._expressionParser.parseBinding(t, e.sourceSpan, e.sourceSpan.start.offset); return Kw(s); }
};
function hE(n, e) { if (e instanceof Le && (pE(e), e = e.nodes[0]), e instanceof rt) {
    fE(e.children, n);
    for (let t = 0; t < n.length; t++)
        n[t].sourceSpan = e.children[t].sourceSpan;
} }
function pE(n) { let e = n.nodes; if (e.length !== 1 || !(e[0] instanceof rt))
    throw new Error("Unexpected previous i18n message - expected it to consist of only a single `Container` node."); }
function fE(n, e) {
    if (n.length !== e.length)
        throw new Error(`
The number of i18n message children changed between first and second pass.

First pass (${n.length} tokens):
${n.map(t => `"${t.sourceSpan.toString()}"`).join(`
`)}

Second pass (${e.length} tokens):
${e.map(t => `"${t.sourceSpan.toString()}"`).join(`
`)}
    `.trim());
    if (n.some((t, s) => e[s].constructor !== t.constructor))
        throw new Error("The types of the i18n message children changed between first and second pass.");
}
var dE = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
function mE(n) { return n.split(dE)[2]; }
var Sh = new Set(["iframe|srcdoc", "*|innerhtml", "*|outerhtml", "embed|src", "iframe|src", "object|codebase", "object|data"]);
function xh(n, e) { return n = n.toLowerCase(), e = e.toLowerCase(), Sh.has(n + "|" + e) || Sh.has("*|" + e); }
var gE = n => (e, t) => { let s = n.get(e) ?? e; return s instanceof an && (t instanceof In && s.i18n instanceof Le && (t.previousMessage = s.i18n), s.i18n = t), t; }, Ko = class {
    keepI18nAttrs;
    enableI18nLegacyMessageIdFormat;
    preserveSignificantWhitespace;
    retainEmptyTokens;
    hasI18nMeta = !1;
    _errors = [];
    constructor(e = !1, t = !1, s = !0, r = !s) { this.keepI18nAttrs = e, this.enableI18nLegacyMessageIdFormat = t, this.preserveSignificantWhitespace = s, this.retainEmptyTokens = r; }
    _generateI18nMessage(e, t = "", s) { let { meaning: r, description: i, customId: o } = this._parseMetadata(t), l = $f(this.retainEmptyTokens, this.preserveSignificantWhitespace)(e, r, i, o, s); return this._setMessageId(l, t), this._setLegacyIds(l, t), l; }
    visitAllWithErrors(e) { let t = e.map(s => s.visit(this, null)); return new nr(t, this._errors); }
    visitElement(e) { return this._visitElementLike(e), e; }
    visitComponent(e, t) { return this._visitElementLike(e), e; }
    visitExpansion(e, t) { let s, r = e.i18n; if (this.hasI18nMeta = !0, r instanceof In) {
        let i = r.name;
        s = this._generateI18nMessage([e], r);
        let o = Wp(s);
        o.name = i, t !== null && (t.placeholderToMessage[i] = s);
    }
    else
        s = this._generateI18nMessage([e], t || r); return e.i18n = s, e; }
    visitText(e) { return e; }
    visitAttribute(e) { return e; }
    visitComment(e) { return e; }
    visitExpansionCase(e) { return e; }
    visitBlock(e, t) { return P(this, e.children, t), e; }
    visitBlockParameter(e, t) { return e; }
    visitLetDeclaration(e, t) { return e; }
    visitDirective(e, t) { return e; }
    _visitElementLike(e) { let t; if (Fm(e)) {
        this.hasI18nMeta = !0;
        let s = [], r = {};
        for (let i of e.attrs)
            if (i.name === Up) {
                let o = e.i18n || i.value, a = new Map, l = this.preserveSignificantWhitespace ? e.children : yt(new Ni(!1, a), e.children);
                t = this._generateI18nMessage(l, o, gE(a)), t.nodes.length === 0 && (t = void 0), e.i18n = t;
            }
            else if (i.name.startsWith(bl)) {
                let o = i.name.slice(bl.length), a;
                e instanceof Ae ? a = e.tagName === null ? !1 : xh(e.tagName, o) : a = xh(e.name, o), a ? this._reportError(i, `Translating attribute '${o}' is disallowed for security reasons.`) : r[o] = i.value;
            }
            else
                s.push(i);
        if (Object.keys(r).length)
            for (let i of s) {
                let o = r[i.name];
                o !== void 0 && i.value && (i.i18n = this._generateI18nMessage([i], i.i18n || o));
            }
        this.keepI18nAttrs || (e.attrs = s);
    } P(this, e.children, t); }
    _parseMetadata(e) { return typeof e == "string" ? EE(e) : e instanceof Le ? e : {}; }
    _setMessageId(e, t) { e.id || (e.id = t instanceof Le && t.id || Wc(e)); }
    _setLegacyIds(e, t) { if (this.enableI18nLegacyMessageIdFormat)
        e.legacyIds = [Cp(e), Ap(e)];
    else if (typeof t != "string") {
        let s = t instanceof Le ? t : t instanceof In ? t.previousMessage : void 0;
        e.legacyIds = s ? s.legacyIds : [];
    } }
    _reportError(e, t) { this._errors.push(new N(e.sourceSpan, t)); }
}, vE = "|", wE = "@@";
function EE(n = "") { let e, t, s; if (n = n.trim(), n) {
    let r = n.indexOf(wE), i = n.indexOf(vE), o;
    [o, e] = r > -1 ? [n.slice(0, r), n.slice(r + 2)] : [n, ""], [t, s] = i > -1 ? [o.slice(0, i), o.slice(i + 1)] : ["", o];
} return { customId: e, meaning: t, description: s }; }
function SE(n) { let e = []; return n.description ? e.push({ tagName: "desc", text: n.description }) : e.push({ tagName: "suppress", text: "{msgDescriptions}" }), n.meaning && e.push({ tagName: "meaning", text: n.meaning }), Np(e); }
var xE = "goog.getMsg";
function yE(n, e, t, s) { let r = AE(e), i = [d(r)]; Object.keys(s).length && (i.push(Go(Jc(s, !0), !0)), i.push(Go({ original_code: ye(Object.keys(s).map(l => ({ key: Oi(l), quoted: !0, value: e.placeholders[l] ? d(e.placeholders[l].sourceSpan.toString()) : d(e.placeholderToMessage[l].nodes.map(c => c.sourceSpan.toString()).join("")) }))) }))); let o = new he(t.name, D(xE).callFn(i), gt, ue.Final); o.addLeadingComment(SE(e)); let a = new Te(n.set(t)); return [o, a]; }
var ic = class {
    formatPh(e) { return `{$${Oi(e)}}`; }
    visitText(e) { return e.value; }
    visitContainer(e) { return e.children.map(t => t.visit(this)).join(""); }
    visitIcu(e) { return If(e); }
    visitTagPlaceholder(e) { return e.isVoid ? this.formatPh(e.startName) : `${this.formatPh(e.startName)}${e.children.map(t => t.visit(this)).join("")}${this.formatPh(e.closeName)}`; }
    visitPlaceholder(e) { return this.formatPh(e.name); }
    visitBlockPlaceholder(e) { return `${this.formatPh(e.startName)}${e.children.map(t => t.visit(this)).join("")}${this.formatPh(e.closeName)}`; }
    visitIcuPlaceholder(e, t) { return this.formatPh(e.name); }
}, CE = new ic;
function AE(n) { return n.nodes.map(e => e.visit(CE, null)).join(""); }
function kE(n, e, t) { let { messageParts: s, placeHolders: r } = _E(e), i = bE(e), o = r.map(c => t[c.text]), a = Lp(e, s, r, o, i), l = n.set(a); return [new Te(l)]; }
var oc = class {
    placeholderToMessage;
    pieces;
    constructor(e, t) { this.placeholderToMessage = e, this.pieces = t; }
    visitText(e) { if (this.pieces[this.pieces.length - 1] instanceof wn)
        this.pieces[this.pieces.length - 1].text += e.value;
    else {
        let t = new B(e.sourceSpan.fullStart, e.sourceSpan.end, e.sourceSpan.fullStart, e.sourceSpan.details);
        this.pieces.push(new wn(e.value, t));
    } }
    visitContainer(e) { e.children.forEach(t => t.visit(this)); }
    visitIcu(e) { this.pieces.push(new wn(If(e), e.sourceSpan)); }
    visitTagPlaceholder(e) { this.pieces.push(this.createPlaceholderPiece(e.startName, e.startSourceSpan ?? e.sourceSpan)), e.isVoid || (e.children.forEach(t => t.visit(this)), this.pieces.push(this.createPlaceholderPiece(e.closeName, e.endSourceSpan ?? e.sourceSpan))); }
    visitPlaceholder(e) { this.pieces.push(this.createPlaceholderPiece(e.name, e.sourceSpan)); }
    visitBlockPlaceholder(e) { this.pieces.push(this.createPlaceholderPiece(e.startName, e.startSourceSpan ?? e.sourceSpan)), e.children.forEach(t => t.visit(this)), this.pieces.push(this.createPlaceholderPiece(e.closeName, e.endSourceSpan ?? e.sourceSpan)); }
    visitIcuPlaceholder(e) { this.pieces.push(this.createPlaceholderPiece(e.name, e.sourceSpan, this.placeholderToMessage[e.name])); }
    createPlaceholderPiece(e, t, s) { return new Jn(Oi(e, !1), t, s); }
};
function _E(n) { let e = [], t = new oc(n.placeholderToMessage, e); return n.nodes.forEach(s => s.visit(t)), TE(e); }
function bE(n) { let e = n.nodes[0], t = n.nodes[n.nodes.length - 1]; return new B(e.sourceSpan.fullStart, t.sourceSpan.end, e.sourceSpan.fullStart, e.sourceSpan.details); }
function TE(n) { let e = [], t = []; n[0] instanceof Jn && e.push(Pa(n[0].sourceSpan.start)); for (let s = 0; s < n.length; s++) {
    let r = n[s];
    r instanceof wn ? e.push(r) : (t.push(r), n[s - 1] instanceof Jn && e.push(Pa(n[s - 1].sourceSpan.end)));
} return n[n.length - 1] instanceof Jn && e.push(Pa(n[n.length - 1].sourceSpan.end)), { messageParts: e, placeHolders: t }; }
function Pa(n) { return new wn("", new B(n, n)); }
var yh = "ngI18nClosureMode", IE = "i18n_", NE = "I18N_EXP_", Ch = "\uFFFD", DE = "MSG_";
function Ah(n) { return `${DE}${n}`.toUpperCase(); }
function PE(n) { return new he(n.name, void 0, gt, void 0, n.sourceSpan); }
function LE(n) { let e = n.relativeContextFilePath.replace(/[^A-Za-z0-9]/g, "_").toUpperCase() + "_", t = new Map, s = new Map, r = new Map, i = new Map; for (let l of n.units)
    for (let c of l.ops())
        if (c.kind === u.ExtractedAttribute && c.i18nContext !== null) {
            let h = t.get(c.i18nContext) ?? [];
            h.push(c), t.set(c.i18nContext, h);
        }
        else if (c.kind === u.I18nAttributes)
            s.set(c.target, c);
        else if (c.kind === u.I18nExpression && c.usage === lr.I18nAttribute) {
            let h = r.get(c.target) ?? [];
            h.push(c), r.set(c.target, h);
        }
        else
            c.kind === u.I18nMessage && i.set(c.xref, c); let o = new Map, a = new Map; for (let l of n.units)
    for (let c of l.create)
        if (c.kind === u.I18nMessage) {
            if (c.messagePlaceholder === null) {
                let { mainVar: h, statements: p } = Of(n, e, i, c);
                if (c.i18nBlock !== null) {
                    let m = n.addConst(h, p);
                    a.set(c.i18nBlock, m);
                }
                else {
                    n.constsInitializers.push(...p), o.set(c.i18nContext, h);
                    let m = t.get(c.i18nContext);
                    if (m !== void 0)
                        for (let v of m)
                            v.expression = h.clone();
                }
            }
            E.remove(c);
        } for (let l of n.units)
    for (let c of l.create)
        if (Bn(c)) {
            let h = s.get(c.xref);
            if (h === void 0)
                continue;
            let p = r.get(c.xref);
            if (p === void 0)
                throw new Error("AssertionError: Could not find any i18n expressions associated with an I18nAttributes instruction");
            let m = new Set;
            p = p.filter(w => { let C = m.has(w.name); return m.add(w.name), !C; });
            let v = p.flatMap(w => { let C = o.get(w.context); if (C === void 0)
                throw new Error("AssertionError: Could not find i18n expression's value"); return [d(w.name), C]; });
            h.i18nAttributesConfig = n.addConst(new Tt(v));
        } for (let l of n.units)
    for (let c of l.create)
        if (c.kind === u.I18nStart) {
            let h = a.get(c.root);
            if (h === void 0)
                throw new Error("AssertionError: Could not find corresponding i18n block index for an i18n message op; was an i18n message incorrectly assumed to correspond to an attribute?");
            c.messageIndex = h;
        } }
function Of(n, e, t, s) { let r = [], i = new Map; for (let c of s.subMessages) {
    let h = t.get(c), { mainVar: p, statements: m } = Of(n, e, t, h);
    r.push(...m);
    let v = i.get(h.messagePlaceholder) ?? [];
    v.push(p), i.set(h.messagePlaceholder, v);
} BE(s, i), s.params = new Map([...s.params.entries()].sort()); let o = D(n.pool.uniqueName(IE)), a = FE(n.pool, s.message.id, e, n.i18nUseExternalIds), l; if (s.needsPostprocessing || s.postprocessingParams.size > 0) {
    let c = Object.fromEntries([...s.postprocessingParams.entries()].sort()), h = Jc(c, !1), p = [];
    s.postprocessingParams.size > 0 && p.push(Go(h, !0)), l = m => y(f.i18nPostprocess).callFn([m, ...p]);
} return r.push(...ME(s.message, o, a, s.params, l)), { mainVar: o, statements: r }; }
function BE(n, e) { for (let [t, s] of e)
    s.length === 1 ? n.params.set(t, s[0]) : (n.params.set(t, d(`${Ch}${NE}${t}${Ch}`)), n.postprocessingParams.set(t, q(s))); }
function ME(n, e, t, s, r) { let i = Object.fromEntries(s), o = [PE(e), Fi(RE(), yE(e, n, t, i), kE(e, n, Jc(i, !1)))]; return r && o.push(new Te(e.set(r(e)))), o; }
function RE() { return ir(D(yh)).notIdentical(d("undefined", ma)).and(D(yh)); }
function FE(n, e, t, s) { let r, i = t; if (s) {
    let o = Ah("EXTERNAL_"), a = n.uniqueName(i);
    r = `${o}${zn(e)}$$${a}`;
}
else {
    let o = Ah(i);
    r = n.uniqueName(o);
} return D(r); }
function $E(n) { for (let e of n.units) {
    let t = null, s = null, r = new Map, i = new Map, o = new Map;
    for (let a of e.create)
        switch (a.kind) {
            case u.I18nStart:
                if (a.context === null)
                    throw Error("I18n op should have its context set.");
                t = a;
                break;
            case u.I18nEnd:
                t = null;
                break;
            case u.IcuStart:
                if (a.context === null)
                    throw Error("Icu op should have its context set.");
                s = a;
                break;
            case u.IcuEnd:
                s = null;
                break;
            case u.Text:
                if (t !== null)
                    if (r.set(a.xref, t), i.set(a.xref, s), a.icuPlaceholder !== null) {
                        let l = fv(n.allocateXrefId(), a.icuPlaceholder, [a.initialValue]);
                        E.replace(a, l), o.set(a.xref, l);
                    }
                    else
                        E.remove(a);
                break;
        }
    for (let a of e.update)
        switch (a.kind) {
            case u.InterpolateText:
                if (!r.has(a.target))
                    continue;
                let l = r.get(a.target), c = i.get(a.target), h = o.get(a.target), p = c ? c.context : l.context, m = c ? wi.Postproccessing : wi.Creation, v = [];
                for (let w = 0; w < a.interpolation.expressions.length; w++) {
                    let C = a.interpolation.expressions[w];
                    v.push(mf(p, l.xref, l.xref, l.handle, C, h?.xref ?? null, a.interpolation.i18nPlaceholders[w] ?? null, m, lr.I18nText, "", C.sourceSpan ?? a.sourceSpan));
                }
                E.replaceWithMany(a, v), h !== void 0 && (h.strings = a.interpolation.strings);
                break;
        }
} }
function OE(n) { for (let e of n.units)
    for (let t of e.create)
        switch (t.kind) {
            case u.ElementStart:
            case u.ConditionalCreate:
            case u.ConditionalBranchCreate:
            case u.Template:
                if (!Array.isArray(t.localRefs))
                    throw new Error("AssertionError: expected localRefs to be an array still");
                if (t.numSlotsUsed += t.localRefs.length, t.localRefs.length > 0) {
                    let s = VE(t.localRefs);
                    t.localRefs = n.addConst(s);
                }
                else
                    t.localRefs = null;
                break;
        } }
function VE(n) { let e = []; for (let t of n)
    e.push(d(t.name), d(t.target)); return q(e); }
function qE(n) { for (let e of n.units) {
    let t = Pe.HTML;
    for (let s of e.create)
        s.kind === u.ElementStart && s.namespace !== t && (E.insertBefore(iv(s.namespace), s), t = s.namespace);
} }
function UE(n) { let e = [], t = 0, s = 0, r = 0, i = 0, o = 0, a = null; for (; t < n.length;)
    switch (n.charCodeAt(t++)) {
        case 40:
            s++;
            break;
        case 41:
            s--;
            break;
        case 39:
            r === 0 ? r = 39 : r === 39 && n.charCodeAt(t - 1) !== 92 && (r = 0);
            break;
        case 34:
            r === 0 ? r = 34 : r === 34 && n.charCodeAt(t - 1) !== 92 && (r = 0);
            break;
        case 58:
            !a && s === 0 && r === 0 && (a = Vf(n.substring(o, t - 1).trim()), i = t);
            break;
        case 59:
            if (a && i > 0 && s === 0 && r === 0) {
                let c = n.substring(i, t - 1).trim();
                e.push(a, c), o = t, i = 0, a = null;
            }
            break;
    } if (a && i) {
    let l = n.slice(i).trim();
    e.push(a, l);
} return e; }
function Vf(n) { return n.replace(/[a-z][A-Z]/g, e => e.charAt(0) + "-" + e.charAt(1)).toLowerCase(); }
function HE(n) { let e = new Map; for (let t of n.units)
    for (let s of t.create)
        Bn(s) && e.set(s.xref, s); for (let t of n.units)
    for (let s of t.create)
        if (s.kind === u.ExtractedAttribute && s.bindingKind === b.Attribute && gf(s.expression)) {
            let r = e.get(s.target);
            if (r !== void 0 && (r.kind === u.Template || r.kind === u.ConditionalCreate || r.kind === u.ConditionalBranchCreate) && r.templateKind === Ge.Structural)
                continue;
            if (s.name === "style") {
                let i = UE(s.expression.value);
                for (let o = 0; o < i.length - 1; o += 2)
                    E.insertBefore(ft(s.target, b.StyleProperty, null, i[o], d(i[o + 1]), null, null, J.STYLE), s);
                E.remove(s);
            }
            else if (s.name === "class") {
                let i = s.expression.value.trim().split(/\s+/g);
                for (let o of i)
                    E.insertBefore(ft(s.target, b.ClassName, null, o, null, null, null, J.NONE), s);
                E.remove(s);
            }
        } }
function WE(n) { _r(n.root, n.componentName, { index: 0 }); }
function _r(n, e, t) { n.fnName === null && (n.fnName = n.job.pool.uniqueName(zn(`${e}_${n.job.fnSuffix}`), !1)); let s = new Map; for (let r of n.ops())
    switch (r.kind) {
        case u.Property:
        case u.DomProperty:
            r.bindingKind === b.LegacyAnimation && (r.name = "@" + r.name);
            break;
        case u.Animation:
            if (r.handlerFnName === null) {
                let c = r.name.replace(".", "");
                r.handlerFnName = `${n.fnName}_${c}_cb`, r.handlerFnName = zn(r.handlerFnName);
            }
            break;
        case u.AnimationListener:
            if (r.handlerFnName !== null)
                break;
            if (!r.hostListener && r.targetSlot.slot === null)
                throw new Error("Expected a slot to be assigned");
            let i = r.name.replace(".", "");
            r.hostListener ? r.handlerFnName = `${e}_${i}_HostBindingHandler` : r.handlerFnName = `${n.fnName}_${r.tag.replace("-", "_")}_${i}_${r.targetSlot.slot}_listener`, r.handlerFnName = zn(r.handlerFnName);
            break;
        case u.Listener:
            if (r.handlerFnName !== null)
                break;
            if (!r.hostListener && r.targetSlot.slot === null)
                throw new Error("Expected a slot to be assigned");
            let o = "";
            r.isLegacyAnimationListener && (r.name = `@${r.name}.${r.legacyAnimationPhase}`, o = "animation"), r.hostListener ? r.handlerFnName = `${e}_${o}${r.name}_HostBindingHandler` : r.handlerFnName = `${n.fnName}_${r.tag.replace("-", "_")}_${o}${r.name}_${r.targetSlot.slot}_listener`, r.handlerFnName = zn(r.handlerFnName);
            break;
        case u.TwoWayListener:
            if (r.handlerFnName !== null)
                break;
            if (r.targetSlot.slot === null)
                throw new Error("Expected a slot to be assigned");
            r.handlerFnName = zn(`${n.fnName}_${r.tag.replace("-", "_")}_${r.name}_${r.targetSlot.slot}_listener`);
            break;
        case u.Variable:
            s.set(r.xref, jE(r.variable, t));
            break;
        case u.RepeaterCreate:
            if (!(n instanceof dt))
                throw new Error("AssertionError: must be compiling a component");
            if (r.handle.slot === null)
                throw new Error("Expected slot to be assigned");
            if (r.emptyView !== null) {
                let c = n.job.views.get(r.emptyView);
                _r(c, `${e}_${r.functionNameSuffix}Empty_${r.handle.slot + 2}`, t);
            }
            _r(n.job.views.get(r.xref), `${e}_${r.functionNameSuffix}_${r.handle.slot + 1}`, t);
            break;
        case u.Projection:
            if (!(n instanceof dt))
                throw new Error("AssertionError: must be compiling a component");
            if (r.handle.slot === null)
                throw new Error("Expected slot to be assigned");
            if (r.fallbackView !== null) {
                let c = n.job.views.get(r.fallbackView);
                _r(c, `${e}_ProjectionFallback_${r.handle.slot}`, t);
            }
            break;
        case u.ConditionalCreate:
        case u.ConditionalBranchCreate:
        case u.Template:
            if (!(n instanceof dt))
                throw new Error("AssertionError: must be compiling a component");
            let a = n.job.views.get(r.xref);
            if (r.handle.slot === null)
                throw new Error("Expected slot to be assigned");
            let l = r.functionNameSuffix.length === 0 ? "" : `_${r.functionNameSuffix}`;
            _r(a, `${e}${l}_${r.handle.slot}`, t);
            break;
        case u.StyleProp:
            r.name = kh(zE(r.name));
            break;
        case u.ClassProp:
            r.name = kh(r.name);
            break;
    } for (let r of n.ops())
    de(r, i => { if (!(!(i instanceof nn) || i.name !== null)) {
        if (!s.has(i.xref))
            throw new Error(`Variable ${i.xref} not yet named`);
        i.name = s.get(i.xref);
    } }); }
function jE(n, e) { if (n.name === null)
    switch (n.kind) {
        case be.Context:
            n.name = `ctx_r${e.index++}`;
            break;
        case be.Identifier:
            let t = n.identifier === it ? "i" : "";
            n.name = `${n.identifier}_${t}r${++e.index}`;
            break;
        default:
            n.name = `_r${++e.index}`;
            break;
    } return n.name; }
function zE(n) { return n.startsWith("--") ? n : Vf(n); }
function kh(n) { let e = n.indexOf("!important"); return e > -1 ? n.substring(0, e) : n; }
function GE(n) { for (let e of n.units) {
    for (let t of e.functions)
        La(t.ops);
    for (let t of e.create)
        (t.kind === u.Listener || t.kind === u.Animation || t.kind === u.AnimationListener || t.kind === u.TwoWayListener) && La(t.handlerOps);
    La(e.update);
} }
function La(n) { for (let e of n) {
    if (e.kind !== u.Statement || !(e.statement instanceof Te) || !(e.statement.expr instanceof $o))
        continue;
    let t = e.statement.expr.steps, s = !0;
    for (let r = e.next; r.kind !== u.ListEnd && s; r = r.next)
        de(r, (i, o) => { if (!Gt(i))
            return i; if (s && !(o & U.InChildOperation))
            switch (i.kind) {
                case I.NextContext:
                    i.steps += t, E.remove(e), s = !1;
                    break;
                case I.GetCurrentView:
                case I.Reference:
                case I.ContextLetReference:
                    s = !1;
                    break;
            } });
} }
var XE = "ng-container";
function YE(n) { for (let e of n.units) {
    let t = new Set;
    for (let s of e.create)
        s.kind === u.ElementStart && s.tag === XE && (s.kind = u.ContainerStart, t.add(s.xref)), s.kind === u.ElementEnd && t.has(s.xref) && (s.kind = u.ContainerEnd);
} }
function QE(n, e) { let t = n.get(e); if (t === void 0)
    throw new Error("All attributes should have an element-like target."); return t; }
function ZE(n) { let e = new Map; for (let t of n.units)
    for (let s of t.create)
        Bn(s) && e.set(s.xref, s); for (let t of n.units)
    for (let s of t.create)
        (s.kind === u.ElementStart || s.kind === u.ContainerStart) && s.nonBindable && E.insertAfter(ev(s.xref), s), (s.kind === u.ElementEnd || s.kind === u.ContainerEnd) && QE(e, s.xref).nonBindable && E.insertBefore(tv(s.xref), s); }
function Ft(n) { return e => e.kind === n; }
function Dr(n, e) { return t => t.kind === n && e === t.expression instanceof le; }
function JE(n) { return n.kind === u.Listener && !(n.hostListener && n.isLegacyAnimationListener) || n.kind === u.TwoWayListener || n.kind === u.Animation || n.kind === u.AnimationListener; }
function KE(n) { return (n.kind === u.Property || n.kind === u.TwoWayProperty) && !(n.expression instanceof le); }
var eS = [{ test: n => n.kind === u.Listener && n.hostListener && n.isLegacyAnimationListener }, { test: JE }], tS = [{ test: Ft(u.StyleMap), transform: ea }, { test: Ft(u.ClassMap), transform: ea }, { test: Ft(u.StyleProp) }, { test: Ft(u.ClassProp) }, { test: Dr(u.Attribute, !0) }, { test: Dr(u.Property, !0) }, { test: KE }, { test: Dr(u.Attribute, !1) }, { test: Ft(u.Control) }], nS = [{ test: Dr(u.DomProperty, !0) }, { test: Dr(u.DomProperty, !1) }, { test: Ft(u.Attribute) }, { test: Ft(u.StyleMap), transform: ea }, { test: Ft(u.ClassMap), transform: ea }, { test: Ft(u.StyleProp) }, { test: Ft(u.ClassProp) }], _h = new Set([u.Listener, u.TwoWayListener, u.AnimationListener, u.StyleMap, u.ClassMap, u.StyleProp, u.ClassProp, u.Property, u.TwoWayProperty, u.DomProperty, u.Attribute, u.Animation, u.Control]);
function sS(n) { for (let e of n.units) {
    bh(e.create, eS);
    let t = e.job.kind === k.Host ? nS : tS;
    bh(e.update, t);
} }
function bh(n, e) { let t = [], s = null; for (let r of n) {
    let i = Ei(r) ? r.target : null;
    (!_h.has(r.kind) || i !== s && s !== null && i !== null) && (E.insertBefore(Th(t, e), r), t = [], s = null), _h.has(r.kind) && (t.push(r), E.remove(r), s = i ?? s);
} n.push(Th(t, e)); }
function Th(n, e) { let t = Array.from(e, () => new Array); for (let s of n) {
    let r = e.findIndex(i => i.test(s));
    t[r].push(s);
} return t.flatMap((s, r) => { let i = e[r].transform; return i ? i(s) : s; }); }
function ea(n) { return n.slice(n.length - 1); }
function rS(n) { for (let e of n.units) {
    let t = kf(e);
    for (let s of e.ops())
        if (s.kind === u.Binding) {
            let r = oS(t, s.target);
            iS(s.name) && r.kind === u.Projection && E.remove(s);
        }
} }
function iS(n) { return n.toLowerCase() === "select"; }
function oS(n, e) { let t = n.get(e); if (t === void 0)
    throw new Error("All attributes should have an slottable target."); return t; }
function aS(n) { for (let e of n.units)
    lS(e); }
function lS(n) { for (let e of n.update)
    de(e, (t, s) => { if (!Gt(t) || t.kind !== I.PipeBinding)
        return; if (s & U.InChildOperation)
        throw new Error("AssertionError: pipe bindings should not appear in child expressions"); if (e.target == null)
        throw new Error("AssertionError: expected slot handle to be assigned for pipe creation"); cS(n, e.target, t); }); }
function cS(n, e, t) { for (let s = n.create.head.next; s.kind !== u.ListEnd; s = s.next) {
    if (!cr(s) || s.xref !== e)
        continue;
    for (; s.next.kind === u.Pipe;)
        s = s.next;
    let r = rv(t.target, t.targetSlot, t.name);
    E.insertBefore(r, s.next);
    return;
} throw new Error(`AssertionError: unable to find insertion point for pipe ${t.name}`); }
function uS(n) { for (let e of n.units)
    for (let t of e.update)
        ce(t, s => !(s instanceof ws) || s.args.length <= 4 ? s : new Ci(s.target, s.targetSlot, s.name, q(s.args), s.args.length), U.None); }
function hS(n) { qf(n.root, 0); }
function qf(n, e) { let t = null; for (let s of n.create)
    switch (s.kind) {
        case u.I18nStart:
            s.subTemplateIndex = e === 0 ? null : e, t = s;
            break;
        case u.I18nEnd:
            t.subTemplateIndex === null && (e = 0), t = null;
            break;
        case u.ConditionalCreate:
        case u.ConditionalBranchCreate:
        case u.Template:
            e = zi(n.job.views.get(s.xref), t, s.i18nPlaceholder, e);
            break;
        case u.RepeaterCreate:
            let r = n.job.views.get(s.xref);
            e = zi(r, t, s.i18nPlaceholder, e), s.emptyView !== null && (e = zi(n.job.views.get(s.emptyView), t, s.emptyI18nPlaceholder, e));
            break;
        case u.Projection:
            s.fallbackView !== null && (e = zi(n.job.views.get(s.fallbackView), t, s.fallbackViewI18nPlaceholder, e));
            break;
    } return e; }
function zi(n, e, t, s) { if (t !== void 0) {
    if (e === null)
        throw Error("Expected template with i18n placeholder to be in an i18n block.");
    s++, pS(n, e);
} return qf(n, s); }
function pS(n, e) { if (n.create.head.next?.kind !== u.I18nStart) {
    let t = n.job.allocateXrefId();
    E.insertAfter(Sa(t, e.message, e.root, null), n.create.head), E.insertBefore(xa(t, null), n.create.tail);
} }
function fS(n) { for (let e of n.units)
    for (let t of e.ops())
        de(t, s => { if (!(s instanceof vs) || s.body === null)
            return; let r = new ac(s.args.length); s.fn = n.pool.getSharedConstant(r, s.body), s.body = null; }); }
var ac = class extends Hr {
    numArgs;
    constructor(e) { super(), this.numArgs = e; }
    keyOf(e) { return e instanceof Pn ? `param(${e.index})` : super.keyOf(e); }
    toSharedConstantDeclaration(e, t) { let s = []; for (let i = 0; i < this.numArgs; i++)
        s.push(new Z("a" + i, re)); let r = _(t, i => i instanceof Pn ? D("a" + i.index) : i, U.None); return new he(e, new Fn(s, r), void 0, ue.Final); }
};
function dS(n) { for (let e of n.units)
    for (let t of e.update)
        ce(t, (s, r) => r & U.InChildOperation ? s : s instanceof Tt ? mS(s) : s instanceof Et ? gS(s) : s, U.None); }
function mS(n) { let e = [], t = []; for (let s of n.entries) {
    if (s instanceof Cn) {
        if (s.expression.isConstant())
            e.push(s);
        else {
            let r = t.length;
            t.push(s.expression), e.push(new Cn(new Pn(r)));
        }
        continue;
    }
    if (s.isConstant())
        e.push(s);
    else {
        let r = t.length;
        t.push(s), e.push(new Pn(r));
    }
} return new vs(q(e), t); }
function gS(n) { let e = [], t = []; for (let s of n.entries) {
    if (s instanceof qt) {
        if (s.expression.isConstant())
            e.push(s);
        else {
            let r = t.length;
            t.push(s.expression), e.push(new qt(new Pn(r)));
        }
        continue;
    }
    if (s.value.isConstant())
        e.push(s);
    else {
        let r = t.length;
        t.push(s.value), e.push(new cs(s.key, new Pn(r), s.quoted));
    }
} return new vs(new Et(e), t); }
function vS(n) { for (let e of n.units)
    for (let t of e.ops())
        ce(t, s => s instanceof as && (s.flags === null || !s.flags.includes("g")) ? n.pool.getSharedConstant(new lc, s) : s, U.None); }
var lc = class extends Hr {
    toSharedConstantDeclaration(e, t) { return new he(e, t, void 0, ue.Final); }
};
function wS(n, e, t, s, r) { return Vn(f.element, n, e, t, s, r); }
function ES(n, e, t, s, r) { return Vn(f.elementStart, n, e, t, s, r); }
function Vn(n, e, t, s, r, i) { let o = [d(e)]; return t !== null && o.push(d(t)), r !== null ? o.push(d(s), d(r)) : s !== null && o.push(d(s)), F(n, o, i); }
function Uf(n, e, t, s, r, i, o, a, l) { let c = [d(e), t, d(s), d(r), d(i), d(o)]; for (a !== null && (c.push(d(a)), c.push(y(f.templateRefExtractor))); c[c.length - 1].isEquivalent(An);)
    c.pop(); return F(n, c, l); }
function cu(n, e, t, s, r) { let i = [d(e)]; return t instanceof le ? i.push(ur(t, r)) : i.push(t), s !== null && i.push(s), F(n, i, r); }
function SS(n) { return F(f.elementEnd, [], n); }
function xS(n, e, t, s) { return Vn(f.elementContainerStart, n, null, e, t, s); }
function yS(n, e, t, s) { return Vn(f.elementContainer, n, null, e, t, s); }
function CS() { return F(f.elementContainerEnd, [], null); }
function AS(n, e, t, s, r, i, o, a) { return Uf(f.templateCreate, n, e, t, s, r, i, o, a); }
function kS() { return F(f.disableBindings, [], null); }
function _S() { return F(f.enableBindings, [], null); }
function bS(n, e, t, s, r) { let i = [d(n), e]; return t !== null && i.push(y(t)), F(s ? f.syntheticHostListener : f.listener, i, r); }
function Ih(n, e) { return y(f.twoWayBindingSet).callFn([n, e]); }
function TS(n, e, t) { return F(f.twoWayListener, [d(n), e], t); }
function IS(n, e) { return F(f.pipe, [d(n), d(e)], null); }
function NS() { return F(f.namespaceHTML, [], null); }
function DS() { return F(f.namespaceSVG, [], null); }
function PS() { return F(f.namespaceMathML, [], null); }
function LS(n, e) { return F(f.advance, n > 1 ? [d(n)] : [], e); }
function BS(n) { return y(f.reference).callFn([d(n)]); }
function MS(n) { return y(f.nextContext).callFn(n === 1 ? [] : [d(n)]); }
function RS() { return y(f.getCurrentView).callFn([]); }
function FS(n) { return y(f.restoreView).callFn([n]); }
function $S(n) { return y(f.resetView).callFn([n]); }
function OS(n, e, t) { let s = [d(n, null)]; return e !== "" && s.push(d(e)), F(f.text, s, t); }
function VS(n, e, t, s, r, i, o, a, l, c, h) { let p = [d(n), d(e), t ?? d(null), d(s), d(r), d(i), o ?? d(null), a ?? d(null), l ? y(f.deferEnableTimerScheduling) : d(null), d(h)], m; for (; (m = p[p.length - 1]) !== null && m instanceof xe && m.value === null;)
    p.pop(); return F(f.defer, p, c); }
var qS = new Map([[ee.Idle, { none: f.deferOnIdle, prefetch: f.deferPrefetchOnIdle, hydrate: f.deferHydrateOnIdle }], [ee.Immediate, { none: f.deferOnImmediate, prefetch: f.deferPrefetchOnImmediate, hydrate: f.deferHydrateOnImmediate }], [ee.Timer, { none: f.deferOnTimer, prefetch: f.deferPrefetchOnTimer, hydrate: f.deferHydrateOnTimer }], [ee.Hover, { none: f.deferOnHover, prefetch: f.deferPrefetchOnHover, hydrate: f.deferHydrateOnHover }], [ee.Interaction, { none: f.deferOnInteraction, prefetch: f.deferPrefetchOnInteraction, hydrate: f.deferHydrateOnInteraction }], [ee.Viewport, { none: f.deferOnViewport, prefetch: f.deferPrefetchOnViewport, hydrate: f.deferHydrateOnViewport }], [ee.Never, { none: f.deferHydrateNever, prefetch: f.deferHydrateNever, hydrate: f.deferHydrateNever }]]);
function US(n, e, t, s) { let r = qS.get(n)?.[t]; if (r === void 0)
    throw new Error(`Unable to determine instruction for trigger ${n}`); return F(r, e, s); }
function HS(n) { return F(f.projectionDef, n ? [n] : [], null); }
function WS(n, e, t, s, r, i, o) { let a = [d(n)]; return (e !== 0 || t !== null || s !== null) && (a.push(d(e)), t !== null && a.push(t), s !== null && (t === null && a.push(d(null)), a.push(D(s), d(r), d(i)))), F(f.projection, a, o); }
function jS(n, e, t, s) { let r = [d(n), d(e)]; return t !== null && r.push(d(t)), F(f.i18nStart, r, s); }
function zS(n, e, t, s, r, i, o, a) { let l = [d(n), e, d(t), d(s), d(r), d(i)]; for (o !== null && (l.push(d(o)), l.push(y(f.templateRefExtractor))); l[l.length - 1].isEquivalent(An);)
    l.pop(); return F(f.conditionalCreate, l, a); }
function GS(n, e, t, s, r, i, o, a) { let l = [d(n), e, d(t), d(s), d(r), d(i)]; for (o !== null && (l.push(d(o)), l.push(y(f.templateRefExtractor))); l[l.length - 1].isEquivalent(An);)
    l.pop(); return F(f.conditionalBranchCreate, l, a); }
function XS(n, e, t, s, r, i, o, a, l, c, h, p, m, v) { let w = [d(n), D(e), d(t), d(s), d(r), d(i), o]; return (a || l !== null) && (w.push(d(a)), l !== null && (w.push(D(l), d(c), d(h)), (p !== null || m !== null) && w.push(d(p)), m !== null && w.push(d(m)))), F(f.repeaterCreate, w, v); }
function YS(n, e) { return F(f.repeater, [n], e); }
function QS(n, e, t) { return n === "prefetch" ? F(f.deferPrefetchWhen, [e], t) : n === "hydrate" ? F(f.deferHydrateWhen, [e], t) : F(f.deferWhen, [e], t); }
function ZS(n, e) { return F(f.declareLet, [d(n)], e); }
function JS(n, e) { return y(f.storeLet).callFn([n], e); }
function KS(n) { return y(f.readContextLet).callFn([d(n)]); }
function ex(n, e, t, s) { let r = [d(n), d(e)]; return t && r.push(d(t)), F(f.i18n, r, s); }
function tx(n) { return F(f.i18nEnd, [], n); }
function nx(n, e) { let t = [d(n), d(e)]; return F(f.i18nAttributes, t, null); }
function sx(n, e, t) { return cu(f.ariaProperty, n, e, null, t); }
function rx(n, e, t, s) { return cu(f.property, n, e, t, s); }
function ix(n) { return F(f.control, [], n); }
function ox(n) { return F(f.controlCreate, [], n); }
function ax(n, e, t, s) { let r = [d(n), e]; return t !== null && r.push(t), F(f.twoWayProperty, r, s); }
function lx(n, e, t, s, r) { let i = [d(n)]; return e instanceof le ? i.push(ur(e, r)) : i.push(e), (t !== null || s !== null) && i.push(t ?? d(null)), s !== null && i.push(d(s)), F(f.attribute, i, null); }
function cx(n, e, t, s) { let r = [d(n)]; return e instanceof le ? r.push(ur(e, s)) : r.push(e), t !== null && r.push(d(t)), F(f.styleProp, r, s); }
function ux(n, e, t) { return F(f.classProp, [d(n), e], t); }
function hx(n, e) { let t = n instanceof le ? ur(n, e) : n; return F(f.styleMap, [t], e); }
function px(n, e) { let t = n instanceof le ? ur(n, e) : n; return F(f.classMap, [t], e); }
function fx(n, e, t, s, r) { return Vn(f.domElement, n, e, t, s, r); }
function dx(n, e, t, s, r) { return Vn(f.domElementStart, n, e, t, s, r); }
function mx(n) { return F(f.domElementEnd, [], n); }
function gx(n, e, t, s) { return Vn(f.domElementContainerStart, n, null, e, t, s); }
function vx(n, e, t, s) { return Vn(f.domElementContainer, n, null, e, t, s); }
function wx() { return F(f.domElementContainerEnd, [], null); }
function Ex(n, e, t, s) { let r = [d(n), e]; return t !== null && r.push(y(t)), F(f.domListener, r, s); }
function Sx(n, e, t, s, r, i, o, a) { return Uf(f.domTemplate, n, e, t, s, r, i, o, a); }
var Nh = [f.pipeBind1, f.pipeBind2, f.pipeBind3, f.pipeBind4];
function xx(n, e, t) { if (t.length < 1 || t.length > Nh.length)
    throw new Error("pipeBind() argument count out of bounds"); let s = Nh[t.length - 1]; return y(s).callFn([d(n), d(e), ...t]); }
function yx(n, e, t) { return y(f.pipeBindV).callFn([d(n), d(e), t]); }
function Cx(n, e, t) { let s = Hf(n, e); return $x(Mx, [], s, t); }
function Ax(n, e) { return F(f.i18nExp, [n], e); }
function kx(n, e) { return F(f.i18nApply, [d(n)], e); }
function _x(n, e, t, s) { return cu(f.domProperty, n, e, t, s); }
function bx(n, e, t, s) { let r = [e]; t !== null && r.push(t); let i = n === "enter" ? f.animationEnter : f.animationLeave; return F(i, r, s); }
function Tx(n, e, t, s) { let i = [e instanceof le ? ur(e, s) : e]; t !== null && i.push(t); let o = n === "enter" ? f.animationEnter : f.animationLeave; return F(o, i, s); }
function Ix(n, e, t, s) { let r = [e], i = n === "enter" ? f.animationEnterListener : f.animationLeaveListener; return F(i, r, s); }
function Nx(n, e, t) { return F(f.syntheticHostProperty, [d(n), e], t); }
function Dx(n, e, t) { return uu(Fx, [d(n), e], t, null); }
function Px(n, e) { return F(f.attachSourceLocations, [d(n), e], null); }
function Lx(n, e, t) { return y(f.arrowFunction).callFn([d(n), e, t]); }
function Hf(n, e) { if (n.length < 1 || e.length !== n.length - 1)
    throw new Error("AssertionError: expected specific shape of args for strings/expressions in interpolation"); let t = []; if (e.length === 1 && n[0] === "" && n[1] === "")
    t.push(e[0]);
else {
    let s;
    for (s = 0; s < e.length; s++)
        t.push(d(n[s]), e[s]);
    t.push(d(n[s]));
} return t; }
function ur(n, e) { let t = Hf(n.strings, n.expressions); return uu(Rx, [], t, e); }
function F(n, e, t) { let s = y(n).callFn(e, t); return ot(new Te(s, t)); }
function Bx(n, e, t) { let s = [n]; return e !== null && s.push(e), F(f.conditional, s, t); }
var Mx = { constant: [f.textInterpolate, f.textInterpolate1, f.textInterpolate2, f.textInterpolate3, f.textInterpolate4, f.textInterpolate5, f.textInterpolate6, f.textInterpolate7, f.textInterpolate8], variable: f.textInterpolateV, mapping: n => { if (n % 2 === 0)
        throw new Error("Expected odd number of arguments"); return (n - 1) / 2; } }, Rx = { constant: [f.interpolate, f.interpolate1, f.interpolate2, f.interpolate3, f.interpolate4, f.interpolate5, f.interpolate6, f.interpolate7, f.interpolate8], variable: f.interpolateV, mapping: n => { if (n % 2 === 0)
        throw new Error("Expected odd number of arguments"); return (n - 1) / 2; } }, Fx = { constant: [f.pureFunction0, f.pureFunction1, f.pureFunction2, f.pureFunction3, f.pureFunction4, f.pureFunction5, f.pureFunction6, f.pureFunction7, f.pureFunction8], variable: f.pureFunctionV, mapping: n => n };
function uu(n, e, t, s) { let r = n.mapping(t.length), i = t.at(-1); if (t.length > 1 && i instanceof xe && i.value === "" && t.pop(), r < n.constant.length)
    return y(n.constant[r]).callFn([...e, ...t], s); if (n.variable !== null)
    return y(n.variable).callFn([...e, q(t)], s); throw new Error("AssertionError: unable to call variadic function"); }
function $x(n, e, t, s) { return ot(uu(n, e, t, s).toStmt()); }
var Ox = new Map([["window", f.resolveWindow], ["document", f.resolveDocument], ["body", f.resolveBody]]), Vx = new Map([["class", "className"], ["for", "htmlFor"], ["formaction", "formAction"], ["innerHtml", "innerHTML"], ["readonly", "readOnly"], ["tabindex", "tabIndex"]]);
function qx(n) { for (let e of n.units)
    Ux(e, e.create), ya(e, e.update); }
function Ux(n, e) { for (let t of e)
    switch (ce(t, s => Wf(n, s), U.None), t.kind) {
        case u.Text:
            E.replace(t, OS(t.handle.slot, t.initialValue, t.sourceSpan));
            break;
        case u.ElementStart:
            E.replace(t, n.job.mode === He.DomOnly ? dx(t.handle.slot, t.tag, t.attributes, t.localRefs, t.startSourceSpan) : ES(t.handle.slot, t.tag, t.attributes, t.localRefs, t.startSourceSpan));
            break;
        case u.Element:
            E.replace(t, n.job.mode === He.DomOnly ? fx(t.handle.slot, t.tag, t.attributes, t.localRefs, t.wholeSourceSpan) : wS(t.handle.slot, t.tag, t.attributes, t.localRefs, t.wholeSourceSpan));
            break;
        case u.ElementEnd:
            E.replace(t, n.job.mode === He.DomOnly ? mx(t.sourceSpan) : SS(t.sourceSpan));
            break;
        case u.ContainerStart:
            E.replace(t, n.job.mode === He.DomOnly ? gx(t.handle.slot, t.attributes, t.localRefs, t.startSourceSpan) : xS(t.handle.slot, t.attributes, t.localRefs, t.startSourceSpan));
            break;
        case u.Container:
            E.replace(t, n.job.mode === He.DomOnly ? vx(t.handle.slot, t.attributes, t.localRefs, t.wholeSourceSpan) : yS(t.handle.slot, t.attributes, t.localRefs, t.wholeSourceSpan));
            break;
        case u.ContainerEnd:
            E.replace(t, n.job.mode === He.DomOnly ? wx() : CS());
            break;
        case u.I18nStart:
            E.replace(t, jS(t.handle.slot, t.messageIndex, t.subTemplateIndex, t.sourceSpan));
            break;
        case u.I18nEnd:
            E.replace(t, tx(t.sourceSpan));
            break;
        case u.I18n:
            E.replace(t, ex(t.handle.slot, t.messageIndex, t.subTemplateIndex, t.sourceSpan));
            break;
        case u.I18nAttributes:
            if (t.i18nAttributesConfig === null)
                throw new Error("AssertionError: i18nAttributesConfig was not set");
            E.replace(t, nx(t.handle.slot, t.i18nAttributesConfig));
            break;
        case u.Template:
            if (!(n instanceof dt))
                throw new Error("AssertionError: must be compiling a component");
            if (Array.isArray(t.localRefs))
                throw new Error("AssertionError: local refs array should have been extracted into a constant");
            let s = n.job.views.get(t.xref);
            E.replace(t, t.templateKind === Ge.Block || n.job.mode === He.DomOnly ? Sx(t.handle.slot, D(s.fnName), s.decls, s.vars, t.tag, t.attributes, t.localRefs, t.startSourceSpan) : AS(t.handle.slot, D(s.fnName), s.decls, s.vars, t.tag, t.attributes, t.localRefs, t.startSourceSpan));
            break;
        case u.DisableBindings:
            E.replace(t, kS());
            break;
        case u.EnableBindings:
            E.replace(t, _S());
            break;
        case u.Pipe:
            E.replace(t, IS(t.handle.slot, t.name));
            break;
        case u.DeclareLet:
            E.replace(t, ZS(t.handle.slot, t.sourceSpan));
            break;
        case u.AnimationString:
            E.replace(t, Tx(t.animationKind, t.expression, t.sanitizer, t.sourceSpan));
            break;
        case u.Animation:
            let r = Gi(n, t.handlerFnName, t.handlerOps, !1);
            E.replace(t, bx(t.animationKind, r, t.sanitizer, t.sourceSpan));
            break;
        case u.AnimationListener:
            let i = Gi(n, t.handlerFnName, t.handlerOps, t.consumesDollarEvent);
            E.replace(t, Ix(t.animationKind, i, null, t.sourceSpan));
            break;
        case u.Listener:
            let o = Gi(n, t.handlerFnName, t.handlerOps, t.consumesDollarEvent), a = t.eventTarget ? Ox.get(t.eventTarget) : null;
            if (a === void 0)
                throw new Error(`Unexpected global target '${t.eventTarget}' defined for '${t.name}' event. Supported list of global targets: window,document,body.`);
            E.replace(t, n.job.mode === He.DomOnly && !t.hostListener && !t.isLegacyAnimationListener ? Ex(t.name, o, a, t.sourceSpan) : bS(t.name, o, a, t.hostListener && t.isLegacyAnimationListener, t.sourceSpan));
            break;
        case u.TwoWayListener:
            E.replace(t, TS(t.name, Gi(n, t.handlerFnName, t.handlerOps, !0), t.sourceSpan));
            break;
        case u.Variable:
            if (t.variable.name === null)
                throw new Error(`AssertionError: unnamed variable ${t.xref}`);
            E.replace(t, ot(new he(t.variable.name, t.initializer, void 0, ue.Final)));
            break;
        case u.Namespace:
            switch (t.active) {
                case Pe.HTML:
                    E.replace(t, NS());
                    break;
                case Pe.SVG:
                    E.replace(t, DS());
                    break;
                case Pe.Math:
                    E.replace(t, PS());
                    break;
            }
            break;
        case u.Defer:
            let l = !!t.loadingMinimumTime || !!t.loadingAfterTime || !!t.placeholderMinimumTime;
            E.replace(t, VS(t.handle.slot, t.mainSlot.slot, t.resolverFn, t.loadingSlot?.slot ?? null, t.placeholderSlot?.slot ?? null, t.errorSlot?.slot ?? null, t.loadingConfig, t.placeholderConfig, l, t.sourceSpan, t.flags));
            break;
        case u.DeferOn:
            let c = [];
            switch (t.trigger.kind) {
                case ee.Never:
                case ee.Idle:
                case ee.Immediate: break;
                case ee.Timer:
                    c = [d(t.trigger.delay)];
                    break;
                case ee.Viewport:
                    t.modifier === "hydrate" ? c = t.trigger.options ? [t.trigger.options] : [] : (c = [d(t.trigger.targetSlot?.slot ?? null)], t.trigger.targetSlotViewSteps !== 0 ? c.push(d(t.trigger.targetSlotViewSteps)) : t.trigger.options && c.push(d(null)), t.trigger.options && c.push(t.trigger.options));
                    break;
                case ee.Interaction:
                case ee.Hover:
                    t.modifier === "hydrate" ? c = [] : (c = [d(t.trigger.targetSlot?.slot ?? null)], t.trigger.targetSlotViewSteps !== 0 && c.push(d(t.trigger.targetSlotViewSteps)));
                    break;
                default: throw new Error(`AssertionError: Unsupported reification of defer trigger kind ${t.trigger.kind}`);
            }
            E.replace(t, US(t.trigger.kind, c, t.modifier, t.sourceSpan));
            break;
        case u.ProjectionDef:
            E.replace(t, HS(t.def));
            break;
        case u.Projection:
            if (t.handle.slot === null)
                throw new Error("No slot was assigned for project instruction");
            let h = null, p = null, m = null;
            if (t.fallbackView !== null) {
                if (!(n instanceof dt))
                    throw new Error("AssertionError: must be compiling a component");
                let O = n.job.views.get(t.fallbackView);
                if (O === void 0)
                    throw new Error("AssertionError: projection had fallback view xref, but fallback view was not found");
                if (O.fnName === null || O.decls === null || O.vars === null)
                    throw new Error("AssertionError: expected projection fallback view to have been named and counted");
                h = O.fnName, p = O.decls, m = O.vars;
            }
            E.replace(t, WS(t.handle.slot, t.projectionSlotIndex, t.attributes, h, p, m, t.sourceSpan));
            break;
        case u.ConditionalCreate:
            if (!(n instanceof dt))
                throw new Error("AssertionError: must be compiling a component");
            if (Array.isArray(t.localRefs))
                throw new Error("AssertionError: local refs array should have been extracted into a constant");
            let v = n.job.views.get(t.xref);
            E.replace(t, zS(t.handle.slot, D(v.fnName), v.decls, v.vars, t.tag, t.attributes, t.localRefs, t.startSourceSpan));
            break;
        case u.ConditionalBranchCreate:
            if (!(n instanceof dt))
                throw new Error("AssertionError: must be compiling a component");
            if (Array.isArray(t.localRefs))
                throw new Error("AssertionError: local refs array should have been extracted into a constant");
            let w = n.job.views.get(t.xref);
            E.replace(t, GS(t.handle.slot, D(w.fnName), w.decls, w.vars, t.tag, t.attributes, t.localRefs, t.startSourceSpan));
            break;
        case u.RepeaterCreate:
            if (t.handle.slot === null)
                throw new Error("No slot was assigned for repeater instruction");
            if (!(n instanceof dt))
                throw new Error("AssertionError: must be compiling a component");
            let C = n.job.views.get(t.xref);
            if (C.fnName === null)
                throw new Error("AssertionError: expected repeater primary view to have been named");
            let T = null, A = null, R = null;
            if (t.emptyView !== null) {
                let O = n.job.views.get(t.emptyView);
                if (O === void 0)
                    throw new Error("AssertionError: repeater had empty view xref, but empty view was not found");
                if (O.fnName === null || O.decls === null || O.vars === null)
                    throw new Error("AssertionError: expected repeater empty view to have been named and counted");
                T = O.fnName, A = O.decls, R = O.vars;
            }
            E.replace(t, XS(t.handle.slot, C.fnName, t.decls, t.vars, t.tag, t.attributes, jx(n, t), t.usesComponentInstance, T, A, R, t.emptyTag, t.emptyAttributes, t.wholeSourceSpan));
            break;
        case u.SourceLocation:
            let se = q(t.locations.map(({ targetSlot: O, offset: xt, line: hr, column: Id }) => { if (O.slot === null)
                throw new Error("No slot was assigned for source location"); return q([d(O.slot), d(xt), d(hr), d(Id)]); }));
            E.replace(t, Px(t.templatePath, se));
            break;
        case u.ControlCreate:
            E.replace(t, ox(t.sourceSpan));
            break;
        case u.Statement: break;
        default: throw new Error(`AssertionError: Unsupported reification of create op ${u[t.kind]}`);
    } }
function ya(n, e) { for (let t of e)
    switch (ce(t, s => Wf(n, s), U.None), t.kind) {
        case u.Advance:
            E.replace(t, LS(t.delta, t.sourceSpan));
            break;
        case u.Property:
            E.replace(t, n.job.mode === He.DomOnly && t.bindingKind !== b.LegacyAnimation && t.bindingKind !== b.Animation ? Dh(t) : Hx(t));
            break;
        case u.Control:
            E.replace(t, Wx(t));
            break;
        case u.TwoWayProperty:
            E.replace(t, ax(t.name, t.expression, t.sanitizer, t.sourceSpan));
            break;
        case u.StyleProp:
            E.replace(t, cx(t.name, t.expression, t.unit, t.sourceSpan));
            break;
        case u.ClassProp:
            E.replace(t, ux(t.name, t.expression, t.sourceSpan));
            break;
        case u.StyleMap:
            E.replace(t, hx(t.expression, t.sourceSpan));
            break;
        case u.ClassMap:
            E.replace(t, px(t.expression, t.sourceSpan));
            break;
        case u.I18nExpression:
            E.replace(t, Ax(t.expression, t.sourceSpan));
            break;
        case u.I18nApply:
            E.replace(t, kx(t.handle.slot, t.sourceSpan));
            break;
        case u.InterpolateText:
            E.replace(t, Cx(t.interpolation.strings, t.interpolation.expressions, t.sourceSpan));
            break;
        case u.Attribute:
            E.replace(t, lx(t.name, t.expression, t.sanitizer, t.namespace, t.sourceSpan));
            break;
        case u.DomProperty:
            if (t.expression instanceof le)
                throw new Error("not yet handled");
            t.bindingKind === b.LegacyAnimation || t.bindingKind === b.Animation ? E.replace(t, Nx(t.name, t.expression, t.sourceSpan)) : E.replace(t, Dh(t));
            break;
        case u.Variable:
            if (t.variable.name === null)
                throw new Error(`AssertionError: unnamed variable ${t.xref}`);
            E.replace(t, ot(new he(t.variable.name, t.initializer, void 0, ue.Final)));
            break;
        case u.Conditional:
            if (t.processed === null)
                throw new Error("Conditional test was not set.");
            E.replace(t, Bx(t.processed, t.contextValue, t.sourceSpan));
            break;
        case u.Repeater:
            E.replace(t, YS(t.collection, t.sourceSpan));
            break;
        case u.DeferWhen:
            E.replace(t, QS(t.modifier, t.expr, t.sourceSpan));
            break;
        case u.StoreLet: throw new Error(`AssertionError: unexpected storeLet ${t.declaredName}`);
        case u.Statement: break;
        default: throw new Error(`AssertionError: Unsupported reification of update op ${u[t.kind]}`);
    } }
function Dh(n) { return _x(Vx.get(n.name) ?? n.name, n.expression, n.sanitizer, n.sourceSpan); }
function Hx(n) { return _f(n.name) ? sx(n.name, n.expression, n.sourceSpan) : rx(n.name, n.expression, n.sanitizer, n.sourceSpan); }
function Wx(n) { return ix(n.sourceSpan); }
function Wf(n, e) { if (!Gt(e))
    return e; switch (e.kind) {
    case I.NextContext: return MS(e.steps);
    case I.Reference: return BS(e.targetSlot.slot + 1 + e.offset);
    case I.LexicalRead: throw new Error(`AssertionError: unresolved LexicalRead of ${e.name}`);
    case I.TwoWayBindingSet: throw new Error("AssertionError: unresolved TwoWayBindingSet");
    case I.RestoreView:
        if (typeof e.view == "number")
            throw new Error("AssertionError: unresolved RestoreView");
        return FS(e.view);
    case I.ResetView: return $S(e.expr);
    case I.GetCurrentView: return RS();
    case I.ReadVariable:
        if (e.name === null)
            throw new Error(`Read of unnamed variable ${e.xref}`);
        return D(e.name);
    case I.ReadTemporaryExpr:
        if (e.name === null)
            throw new Error(`Read of unnamed temporary ${e.xref}`);
        return D(e.name);
    case I.AssignTemporaryExpr:
        if (e.name === null)
            throw new Error(`Assign of unnamed temporary ${e.xref}`);
        return D(e.name).set(e.expr);
    case I.PureFunctionExpr:
        if (e.fn === null)
            throw new Error("AssertionError: expected PureFunctions to have been extracted");
        return Dx(e.varOffset, e.fn, e.args);
    case I.PureFunctionParameterExpr: throw new Error("AssertionError: expected PureFunctionParameterExpr to have been extracted");
    case I.PipeBinding: return xx(e.targetSlot.slot, e.varOffset, e.args);
    case I.PipeBindingVariadic: return yx(e.targetSlot.slot, e.varOffset, e.args);
    case I.SlotLiteralExpr: return d(e.slot.slot);
    case I.ContextLetReference: return KS(e.targetSlot.slot);
    case I.StoreLet: return JS(e.value, e.sourceSpan);
    case I.TrackContext: return D("this");
    case I.ArrowFunction:
        if (e.varOffset === null)
            throw new Error("AssertionError: variable offset was not assigned to arrow function");
        return Lx(e.varOffset, n.job.pool.getSharedFunctionReference(zx(n, e), "arrowFn"), D(it));
    default: throw new Error(`AssertionError: Unsupported reification of ir.Expression kind: ${I[e.kind]}`);
} }
function Gi(n, e, t, s) { ya(n, t); let r = []; for (let o of t) {
    if (o.kind !== u.Statement)
        throw new Error(`AssertionError: expected reified statements, but found op ${u[o.kind]}`);
    r.push(o.statement);
} let i = []; return s && i.push(new Z("$event", re)), on(i, r, void 0, void 0, e); }
function jx(n, e) { if (e.trackByFn !== null)
    return e.trackByFn; let t = [new Z("$index", yn), new Z("$item", re)], s; if (e.trackByOps === null)
    s = e.usesComponentInstance ? on(t, [new me(e.track)]) : ie(t, e.track);
else {
    ya(n, e.trackByOps);
    let r = [];
    for (let i of e.trackByOps) {
        if (i.kind !== u.Statement)
            throw new Error(`AssertionError: expected reified statements, but found op ${u[i.kind]}`);
        r.push(i.statement);
    }
    s = e.usesComponentInstance || r.length !== 1 || !(r[0] instanceof me) ? on(t, r) : ie(t, r[0].value);
} return e.trackByFn = n.job.pool.getSharedFunctionReference(s, "_forTrack"), e.trackByFn; }
function zx(n, e) { ya(n, e.ops); let t = []; for (let r of e.ops) {
    if (r.kind !== u.Statement)
        throw new Error(`AssertionError: expected reified statements, but found op ${u[r.kind]}`);
    t.push(r.statement);
} let s = t.length === 1 && t[0] instanceof me ? t[0].value : t; return ie([new Z(e.contextName, re), new Z(e.currentViewName, re)], ie(e.parameters, s)); }
function Gx(n) { for (let e of n.units)
    for (let t of e.update)
        switch (t.kind) {
            case u.Attribute:
            case u.Binding:
            case u.ClassProp:
            case u.ClassMap:
            case u.Property:
            case u.StyleProp:
            case u.StyleMap:
                t.expression instanceof Ai && E.remove(t);
                break;
        } }
function Xx(n) { for (let e of n.units)
    for (let t of e.create)
        switch (t.kind) {
            case u.I18nContext:
                E.remove(t);
                break;
            case u.I18nStart:
                t.context = null;
                break;
        } }
function Yx(n) { for (let e of n.units)
    for (let t of e.update) {
        if (t.kind !== u.Variable || t.variable.kind !== be.Identifier || !(t.initializer instanceof Si))
            continue;
        let s = t.variable.identifier, r = t;
        for (; r && r.kind !== u.ListEnd;)
            ce(r, i => i instanceof ke && i.name === s ? d(void 0) : i, U.None), r = r.prev;
    } }
function Qx(n) { for (let e of n.units) {
    let t = new Set;
    for (let s of e.update)
        s.kind === u.I18nExpression && t.add(s.i18nOwner);
    for (let s of e.create)
        switch (s.kind) {
            case u.I18nAttributes:
                if (t.has(s.xref))
                    continue;
                E.remove(s);
        }
} }
function Zx(n) { for (let e of n.units) {
    for (let t of e.functions)
        Pr(e, t.ops);
    Pr(e, e.create), Pr(e, e.update);
} }
function Pr(n, e) { let t = new Map; t.set(n.xref, D(it)); for (let s of e)
    switch (s.kind) {
        case u.Variable:
            s.variable.kind === be.Context && t.set(s.variable.view, new nn(s.xref));
            break;
        case u.Animation:
        case u.AnimationListener:
        case u.Listener:
        case u.TwoWayListener:
            Pr(n, s.handlerOps);
            break;
        case u.RepeaterCreate:
            s.trackByOps !== null && Pr(n, s.trackByOps);
            break;
    } n === n.job.root && t.set(n.xref, D(it)); for (let s of e)
    ce(s, r => { if (r instanceof Dn) {
        if (!t.has(r.view))
            throw new Error(`No context found for reference to view ${r.view} from view ${n.xref}`);
        return t.get(r.view);
    }
    else
        return r; }, U.None); }
function Jx(n) { for (let e of n.units)
    for (let t of e.create)
        if (t.kind === u.Defer) {
            if (t.resolverFn !== null)
                continue;
            if (t.ownResolverFn !== null) {
                if (t.handle.slot === null)
                    throw new Error("AssertionError: slot must be assigned before extracting defer deps functions");
                let s = e.fnName?.replace("_Template", "");
                t.resolverFn = n.pool.getSharedFunctionReference(t.ownResolverFn, `${s}_Defer_${t.handle.slot}_DepsFn`, !1);
            }
        } }
function Kx(n) { for (let e of n.units)
    Ph(e.create), Ph(e.update); }
function Ph(n) { for (let e of n)
    (e.kind === u.Listener || e.kind === u.TwoWayListener || e.kind === u.AnimationListener) && ce(e, t => t instanceof ke && t.name === "$event" ? ((e.kind === u.Listener || e.kind === u.AnimationListener) && (e.consumesDollarEvent = !0), new vt(t.name)) : t, U.InChildOperation); }
function e2(n) { let e = new Map, t = new Map; for (let s of n.units)
    for (let r of s.create)
        switch (r.kind) {
            case u.I18nContext:
                e.set(r.xref, r);
                break;
            case u.ElementStart:
                t.set(r.xref, r);
                break;
        } Nt(n, n.root, e, t); }
function Nt(n, e, t, s, r) { let i = null, o = new Map; for (let a of e.create)
    switch (a.kind) {
        case u.I18nStart:
            if (!a.context)
                throw Error("Could not find i18n context for i18n op");
            i = { i18nBlock: a, i18nContext: t.get(a.context) };
            break;
        case u.I18nEnd:
            i = null;
            break;
        case u.ElementStart:
            if (a.i18nPlaceholder !== void 0) {
                if (i === null)
                    throw Error("i18n tag placeholder should only occur inside an i18n block");
                Lh(a, i.i18nContext, i.i18nBlock, r), r && a.i18nPlaceholder.closeName && o.set(a.xref, r), r = void 0;
            }
            break;
        case u.ElementEnd:
            let l = s.get(a.xref);
            if (l && l.i18nPlaceholder !== void 0) {
                if (i === null)
                    throw Error("AssertionError: i18n tag placeholder should only occur inside an i18n block");
                Bh(l, i.i18nContext, i.i18nBlock, o.get(a.xref)), o.delete(a.xref);
            }
            break;
        case u.Projection:
            if (a.i18nPlaceholder !== void 0) {
                if (i === null)
                    throw Error("i18n tag placeholder should only occur inside an i18n block");
                Lh(a, i.i18nContext, i.i18nBlock, r), Bh(a, i.i18nContext, i.i18nBlock, r), r = void 0;
            }
            if (a.fallbackView !== null) {
                let m = n.views.get(a.fallbackView);
                if (a.fallbackViewI18nPlaceholder === void 0)
                    Nt(n, m, t, s);
                else {
                    if (i === null)
                        throw Error("i18n tag placeholder should only occur inside an i18n block");
                    Xi(n, m, a.handle.slot, a.fallbackViewI18nPlaceholder, i.i18nContext, i.i18nBlock, r), Nt(n, m, t, s), Yi(n, m, a.handle.slot, a.fallbackViewI18nPlaceholder, i.i18nContext, i.i18nBlock, r), r = void 0;
                }
            }
            break;
        case u.ConditionalCreate:
        case u.ConditionalBranchCreate:
        case u.Template:
            let c = n.views.get(a.xref);
            if (a.i18nPlaceholder === void 0)
                Nt(n, c, t, s);
            else {
                if (i === null)
                    throw Error("i18n tag placeholder should only occur inside an i18n block");
                a.templateKind === Ge.Structural ? Nt(n, c, t, s, a) : (Xi(n, c, a.handle.slot, a.i18nPlaceholder, i.i18nContext, i.i18nBlock, r), Nt(n, c, t, s), Yi(n, c, a.handle.slot, a.i18nPlaceholder, i.i18nContext, i.i18nBlock, r), r = void 0);
            }
            break;
        case u.RepeaterCreate:
            if (r !== void 0)
                throw Error("AssertionError: Unexpected structural directive associated with @for block");
            let h = a.handle.slot + 1, p = n.views.get(a.xref);
            if (a.i18nPlaceholder === void 0)
                Nt(n, p, t, s);
            else {
                if (i === null)
                    throw Error("i18n tag placeholder should only occur inside an i18n block");
                Xi(n, p, h, a.i18nPlaceholder, i.i18nContext, i.i18nBlock, r), Nt(n, p, t, s), Yi(n, p, h, a.i18nPlaceholder, i.i18nContext, i.i18nBlock, r), r = void 0;
            }
            if (a.emptyView !== null) {
                let m = a.handle.slot + 2, v = n.views.get(a.emptyView);
                if (a.emptyI18nPlaceholder === void 0)
                    Nt(n, v, t, s);
                else {
                    if (i === null)
                        throw Error("i18n tag placeholder should only occur inside an i18n block");
                    Xi(n, v, m, a.emptyI18nPlaceholder, i.i18nContext, i.i18nBlock, r), Nt(n, v, t, s), Yi(n, v, m, a.emptyI18nPlaceholder, i.i18nContext, i.i18nBlock, r), r = void 0;
                }
            }
            break;
    } }
function Lh(n, e, t, s) { let { startName: r, closeName: i } = n.i18nPlaceholder, o = ne.ElementTag | ne.OpenTag, a = n.handle.slot; s !== void 0 && (o |= ne.TemplateTag, a = { element: a, template: s.handle.slot }), i || (o |= ne.CloseTag), rr(e.params, r, a, t.subTemplateIndex, o); }
function Bh(n, e, t, s) { let { closeName: r } = n.i18nPlaceholder; if (r) {
    let i = ne.ElementTag | ne.CloseTag, o = n.handle.slot;
    s !== void 0 && (i |= ne.TemplateTag, o = { element: o, template: s.handle.slot }), rr(e.params, r, o, t.subTemplateIndex, i);
} }
function Xi(n, e, t, s, r, i, o) { let { startName: a, closeName: l } = s, c = ne.TemplateTag | ne.OpenTag; l || (c |= ne.CloseTag), o !== void 0 && rr(r.params, a, o.handle.slot, i.subTemplateIndex, c), rr(r.params, a, t, jf(n, i, e), c); }
function Yi(n, e, t, s, r, i, o) { let { closeName: a } = s, l = ne.TemplateTag | ne.CloseTag; a && (rr(r.params, a, t, jf(n, i, e), l), o !== void 0 && rr(r.params, a, o.handle.slot, i.subTemplateIndex, l)); }
function jf(n, e, t) { for (let s of t.create)
    if (s.kind === u.I18nStart)
        return s.subTemplateIndex; return e.subTemplateIndex; }
function rr(n, e, t, s, r) { let i = n.get(e) ?? []; i.push({ value: t, subTemplateIndex: s, flags: r }), n.set(e, i); }
function t2(n) { let e = new Map, t = new Map, s = new Map; for (let o of n.units)
    for (let a of o.create)
        switch (a.kind) {
            case u.I18nStart:
                e.set(a.xref, a.subTemplateIndex);
                break;
            case u.I18nContext:
                t.set(a.xref, a);
                break;
            case u.IcuPlaceholder:
                s.set(a.xref, a);
                break;
        } let r = new Map, i = o => o.usage === lr.I18nText ? o.i18nOwner : o.context; for (let o of n.units)
    for (let a of o.update)
        if (a.kind === u.I18nExpression) {
            let l = r.get(i(a)) || 0, c = e.get(a.i18nOwner) ?? null, h = { value: l, subTemplateIndex: c, flags: ne.ExpressionIndex };
            n2(a, h, t, s), r.set(i(a), l + 1);
        } }
function n2(n, e, t, s) { if (n.i18nPlaceholder !== null) {
    let r = t.get(n.context), i = n.resolutionTime === wi.Creation ? r.params : r.postprocessingParams, o = i.get(n.i18nPlaceholder) || [];
    o.push(e), i.set(n.i18nPlaceholder, o);
} n.icuPlaceholder !== null && s.get(n.icuPlaceholder)?.expressionPlaceholders.push(e); }
function s2(n) { for (let e of n.units) {
    for (let t of e.functions)
        Lr(e, t.ops, null);
    Lr(e, e.create, null), Lr(e, e.update, null);
} }
function Lr(n, e, t) { let s = new Map, r = new Map; for (let i of e)
    switch (i.kind) {
        case u.Variable:
            switch (i.variable.kind) {
                case be.Identifier:
                    if (i.variable.local) {
                        if (r.has(i.variable.identifier))
                            continue;
                        r.set(i.variable.identifier, i.xref);
                    }
                    else if (s.has(i.variable.identifier))
                        continue;
                    s.set(i.variable.identifier, i.xref);
                    break;
                case be.Alias:
                    if (s.has(i.variable.identifier))
                        continue;
                    s.set(i.variable.identifier, i.xref);
                    break;
                case be.SavedView:
                    t = { view: i.variable.view, variable: i.xref };
                    break;
            }
            break;
        case u.Animation:
        case u.AnimationListener:
        case u.Listener:
        case u.TwoWayListener:
            Lr(n, i.handlerOps, t);
            break;
        case u.RepeaterCreate:
            i.trackByOps !== null && Lr(n, i.trackByOps, t);
            break;
    } for (let i of e)
    i.kind === u.Listener || i.kind === u.TwoWayListener || i.kind === u.Animation || i.kind === u.AnimationListener || ce(i, o => { if (o instanceof ke)
        return r.has(o.name) ? new nn(r.get(o.name)) : s.has(o.name) ? new nn(s.get(o.name)) : new Xe(new Dn(n.job.root.xref), o.name); if (o instanceof yi && typeof o.view == "number") {
        if (t === null || t.view !== o.view)
            throw new Error(`AssertionError: no saved view ${o.view} from view ${n.xref}`);
        return o.view = new nn(t.variable), o;
    }
    else
        return o; }, U.None); for (let i of e)
    de(i, o => { if (o instanceof ke)
        throw new Error(`AssertionError: no lexical reads should remain, but found read of ${o.name}`); }); }
var r2 = new Map([[J.HTML, f.sanitizeHtml], [J.RESOURCE_URL, f.sanitizeResourceUrl], [J.SCRIPT, f.sanitizeScript], [J.STYLE, f.sanitizeStyle], [J.URL, f.sanitizeUrl], [J.ATTRIBUTE_NO_BINDING, f.validateAttribute]]), i2 = new Map([[J.HTML, f.trustConstantHtml], [J.RESOURCE_URL, f.trustConstantResourceUrl]]);
function o2(n) { for (let e of n.units) {
    if (n.kind !== k.Host) {
        for (let t of e.create)
            if (t.kind === u.ExtractedAttribute) {
                let s = i2.get(Mh(t.securityContext)) ?? null;
                t.trustedValueFn = s !== null ? y(s) : null;
            }
    }
    for (let t of e.update)
        switch (t.kind) {
            case u.Property:
            case u.Attribute:
            case u.DomProperty:
                let s = null;
                Array.isArray(t.securityContext) && t.securityContext.length === 2 && t.securityContext.includes(J.URL) && t.securityContext.includes(J.RESOURCE_URL) ? s = f.sanitizeUrlOrResourceUrl : s = r2.get(Mh(t.securityContext)) ?? null, t.sanitizer = s !== null ? y(s) : null;
                break;
        }
} }
function Mh(n) { if (Array.isArray(n)) {
    if (n.length > 1)
        throw Error("AssertionError: Ambiguous security context");
    return n[0] || J.NONE;
} return n; }
function a2(n) { for (let e of n.units) {
    for (let t of e.functions)
        Rh(n, e, t.ops) && Fh(e, t.ops, D(t.currentViewName));
    e.create.prepend([gn(e.job.allocateXrefId(), { kind: be.SavedView, name: null, view: e.xref }, new Ol, pt.None)]);
    for (let t of e.create)
        (t.kind === u.Listener || t.kind === u.TwoWayListener || t.kind === u.Animation || t.kind === u.AnimationListener) && Rh(n, e, t.handlerOps) && Fh(e, t.handlerOps, e.xref);
} }
function Rh(n, e, t) { let s = e !== n.root; if (!s)
    for (let r of t)
        de(r, i => { (i instanceof Fo || i instanceof xi) && (s = !0); }); return s; }
function Fh(n, e, t) { e.prepend([gn(n.job.allocateXrefId(), { kind: be.Context, name: null, view: n.xref }, new yi(t), pt.None)]); for (let s of e)
    s.kind === u.Statement && s.statement instanceof me && (s.statement.value = new Oo(s.statement.value)); }
function l2(n) { let e = new Map; for (let t of n.units) {
    let s = 0;
    for (let r of t.create)
        cr(r) && (r.handle.slot = s, e.set(r.xref, r.handle.slot), s += r.numSlotsUsed);
    t.decls = s;
} for (let t of n.units)
    for (let s of t.ops())
        if (s.kind === u.Template || s.kind === u.ConditionalCreate || s.kind === u.ConditionalBranchCreate || s.kind === u.RepeaterCreate) {
            let r = n.views.get(s.xref);
            s.decls = r.decls;
        } }
function c2(n) { let e = new Set, t = new Map; for (let s of n.units)
    for (let r of s.ops())
        r.kind === u.DeclareLet && t.set(r.xref, r), de(r, i => { i instanceof xi && e.add(i.target); }); for (let s of n.units)
    for (let r of s.update)
        ce(r, i => i instanceof Si && !e.has(i.target) ? (u2(i) || E.remove(t.get(i.target)), i.value) : i, U.None); }
function u2(n) { let e = !1; return _(n, t => ((t instanceof ws || t instanceof Ci) && (e = !0), t), U.None), e; }
function h2(n) { let e = new Set; for (let t of n.units)
    for (let s of t.ops())
        de(s, r => { if (r instanceof j)
            switch (r.operator) {
                case x.Exponentiation:
                    p2(r, e);
                    break;
                case x.NullishCoalesce:
                    f2(r, e);
                    break;
                case x.And:
                case x.Or: d2(r, e);
            } }); for (let t of n.units)
    for (let s of t.ops())
        ce(s, r => r instanceof wt ? e.has(r) ? r : r.expr : r, U.None); }
function p2(n, e) { n.lhs instanceof wt && n.lhs.expr instanceof rn && e.add(n.lhs); }
function f2(n, e) { n.lhs instanceof wt && ($h(n.lhs.expr) || n.lhs.expr instanceof bt) && e.add(n.lhs), n.rhs instanceof wt && ($h(n.rhs.expr) || n.rhs.expr instanceof bt) && e.add(n.rhs); }
function d2(n, e) { n.lhs instanceof wt && n.lhs.expr instanceof j && n.lhs.expr.operator === x.NullishCoalesce && e.add(n.lhs); }
function $h(n) { return n instanceof j && (n.operator === x.And || n.operator === x.Or); }
function m2(n) { for (let e of n.units)
    for (let t of e.update)
        if (t.kind === u.Binding)
            switch (t.bindingKind) {
                case b.ClassName:
                    if (t.expression instanceof le)
                        throw new Error("Unexpected interpolation in ClassName binding");
                    E.replace(t, qg(t.target, t.name, t.expression, t.sourceSpan));
                    break;
                case b.StyleProperty:
                    E.replace(t, Vg(t.target, t.name, t.expression, t.unit, t.sourceSpan));
                    break;
                case b.Property:
                case b.Template:
                    t.name === "style" ? E.replace(t, Ug(t.target, t.expression, t.sourceSpan)) : t.name === "class" && E.replace(t, Hg(t.target, t.expression, t.sourceSpan));
                    break;
            } }
function g2(n) { for (let e of n.units) {
    e.create.prepend(Br(e.create)), e.update.prepend(Br(e.update));
    for (let t of e.functions)
        t.ops.prepend(Br(t.ops));
} }
function Br(n) { let e = 0, t = []; for (let s of n) {
    let r = new Map;
    de(s, (c, h) => { h & U.InChildOperation || c instanceof Ln && r.set(c.xref, c); });
    let i = 0, o = new Set, a = new Set, l = new Map;
    de(s, (c, h) => { h & U.InChildOperation || (c instanceof Xt ? (o.has(c.xref) || (o.add(c.xref), l.set(c.xref, `tmp_${e}_${i++}`)), Oh(l, c)) : c instanceof Ln && (r.get(c.xref) === c && (a.add(c.xref), i--), Oh(l, c))); }), t.push(...Array.from(new Set(l.values())).map(c => ot(new he(c)))), e++, s.kind === u.Listener || s.kind === u.Animation || s.kind === u.AnimationListener || s.kind === u.TwoWayListener ? s.handlerOps.prepend(Br(s.handlerOps)) : s.kind === u.RepeaterCreate && s.trackByOps !== null && s.trackByOps.prepend(Br(s.trackByOps));
} return t; }
function Oh(n, e) { let t = n.get(e.xref); if (t === void 0)
    throw new Error(`Found xref with unassigned name: ${e.xref}`); e.name = t; }
function v2(n) { for (let e of n.units)
    for (let t of e.create)
        if (t.kind === u.RepeaterCreate)
            if (t.track instanceof vt && t.track.name === "$index")
                t.trackByFn = y(f.repeaterTrackByIndex);
            else if (t.track instanceof vt && t.track.name === "$item")
                t.trackByFn = y(f.repeaterTrackByIdentity);
            else if (w2(n.root.xref, t.track))
                t.usesComponentInstance = !0, t.track.receiver.receiver.view === e.xref ? t.trackByFn = t.track.receiver : (t.trackByFn = y(f.componentInstance).callFn([]).prop(t.track.receiver.name), t.track = t.trackByFn);
            else {
                t.track = _(t.track, r => { if (r instanceof ws || r instanceof Ci)
                    throw new Error("Illegal State: Pipes are not allowed in this context"); return r instanceof Dn ? (t.usesComponentInstance = !0, new $l(r.view)) : r; }, U.None);
                let s = new E;
                s.push(ot(new me(t.track, t.track.sourceSpan))), t.trackByOps = s;
            } }
function w2(n, e) { if (!(e instanceof Ue) || e.args.length === 0 || e.args.length > 2 || !(e.receiver instanceof Xe && e.receiver.receiver instanceof Dn) || e.receiver.receiver.view !== n)
    return !1; let [t, s] = e.args; return !(t instanceof vt) || t.name !== "$index" ? !1 : e.args.length === 1 ? !0 : !(!(s instanceof vt) || s.name !== "$item"); }
function E2(n) { for (let e of n.units)
    for (let t of e.create)
        t.kind === u.RepeaterCreate && (t.track = _(t.track, s => { if (s instanceof ke) {
            if (t.varNames.$index.has(s.name))
                return D("$index");
            if (s.name === t.varNames.$implicit)
                return D("$item");
        } return s; }, U.None)); }
function S2(n) { for (let e of n.units)
    for (let t of e.create)
        t.kind === u.TwoWayListener && ce(t, s => { if (!(s instanceof Vo))
            return s; let { target: r, value: i } = s; if (r instanceof Xe || r instanceof Vt)
            return Ih(r, i).or(r.set(i)); if (r instanceof nn)
            return Ih(r, i); throw new Error("Unsupported expression in two-way action binding."); }, U.InChildOperation); }
function x2(n) { for (let e of n.units) {
    let t = 0;
    for (let i of e.ops())
        Ta(i) && (t += y2(i));
    let s = i => { Gt(i) && (i instanceof vs || (Wu(i) && (i.varOffset = t), Ta(i) && (t += Vh(i)))); }, r = i => { !Gt(i) || !(i instanceof vs) || (Wu(i) && (i.varOffset = t), Ta(i) && (t += Vh(i))); };
    for (let i of e.create)
        de(i, s);
    for (let i of e.update)
        de(i, s);
    for (let i of e.create)
        de(i, r);
    for (let i of e.update)
        de(i, r);
    e.vars = t;
} if (n instanceof _i)
    for (let e of n.units)
        for (let t of e.create) {
            if (t.kind !== u.Template && t.kind !== u.RepeaterCreate && t.kind !== u.ConditionalCreate && t.kind !== u.ConditionalBranchCreate)
                continue;
            let s = n.views.get(t.xref);
            t.vars = s.vars;
        } }
function y2(n) { let e; switch (n.kind) {
    case u.Attribute: return e = 1, n.expression instanceof le && !C2(n.expression) && (e += n.expression.expressions.length), e;
    case u.Property:
    case u.DomProperty: return e = 1, n.expression instanceof le && (e += n.expression.expressions.length), e;
    case u.Control: return 2;
    case u.TwoWayProperty: return 1;
    case u.StyleProp:
    case u.ClassProp:
    case u.StyleMap:
    case u.ClassMap: return e = 2, n.expression instanceof le && (e += n.expression.expressions.length), e;
    case u.InterpolateText: return n.interpolation.expressions.length;
    case u.I18nExpression:
    case u.Conditional:
    case u.DeferWhen:
    case u.StoreLet: return 1;
    case u.RepeaterCreate: return n.emptyView ? 1 : 0;
    default: throw new Error(`Unhandled op: ${u[n.kind]}`);
} }
function Vh(n) { switch (n.kind) {
    case I.PureFunctionExpr: return 1 + n.args.length;
    case I.PipeBinding: return 1 + n.args.length;
    case I.PipeBindingVariadic: return 1 + n.numArgs;
    case I.StoreLet:
    case I.ArrowFunction: return 1;
    default: throw new Error(`AssertionError: unhandled ConsumesVarsTrait expression ${n.constructor.name}`);
} }
function C2(n) { return !(n.expressions.length !== 1 || n.strings.length !== 2 || n.strings[0] !== "" || n.strings[1] !== ""); }
function A2(n) { for (let e of n.units) {
    for (let t of e.functions)
        wr(t.ops);
    wr(e.create), wr(e.update);
    for (let t of e.create)
        t.kind === u.Listener || t.kind === u.Animation || t.kind === u.AnimationListener || t.kind === u.TwoWayListener ? wr(t.handlerOps) : t.kind === u.RepeaterCreate && t.trackByOps !== null && wr(t.trackByOps);
    for (let t of e.functions)
        Er(t.ops, null), qh(t.ops);
    for (let t of e.create)
        t.kind === u.Listener || t.kind === u.Animation || t.kind === u.AnimationListener || t.kind === u.TwoWayListener ? (Er(t.handlerOps, Qi), qh(t.handlerOps)) : t.kind === u.RepeaterCreate && t.trackByOps !== null && Er(t.trackByOps, Qi);
    Er(e.create, Qi), Er(e.update, Qi);
} }
var Ee = (function (n) { return n[n.None = 0] = "None", n[n.ViewContextRead = 1] = "ViewContextRead", n[n.ViewContextWrite = 2] = "ViewContextWrite", n[n.SideEffectful = 4] = "SideEffectful", n; })(Ee || {});
function Qi(n) { return !(n & U.InArrowFunctionOperation); }
function wr(n) { let e = new Map; for (let t of n)
    t.kind === u.Variable && t.flags & pt.AlwaysInline && (de(t, s => { if (Gt(s) && hu(s) !== Ee.None)
        throw new Error("AssertionError: A context-sensitive variable was marked AlwaysInline"); }), e.set(t.xref, t)), ce(t, s => s instanceof nn && e.has(s.xref) ? e.get(s.xref).initializer.clone() : s, U.None); for (let t of e.values())
    E.remove(t); }
function Er(n, e) { let t = new Map, s = new Map, r = new Set, i = new Map; for (let c of n) {
    if (c.kind === u.Variable) {
        if (t.has(c.xref) || s.has(c.xref))
            throw new Error(`Should not see two declarations of the same variable: ${c.xref}`);
        t.set(c.xref, c), s.set(c.xref, 0);
    }
    i.set(c, k2(c, e)), _2(c, s, r, e);
} let o = !1; for (let c of n.reversed()) {
    let h = i.get(c);
    if (c.kind === u.Variable && s.get(c.xref) === 0) {
        if (o && h.fences & Ee.ViewContextWrite || h.fences & Ee.SideEffectful) {
            let p = ot(c.initializer.toStmt());
            i.set(p, h), E.replace(c, p);
        }
        else
            b2(c, s), E.remove(c);
        i.delete(c), t.delete(c.xref), s.delete(c.xref);
        continue;
    }
    h.fences & Ee.ViewContextRead && (o = !0);
} let a = []; for (let [c, h] of s) {
    let m = !!(t.get(c).flags & pt.AlwaysInline);
    h !== 1 || m || r.has(c) || a.push(c);
} let l; for (; l = a.pop();) {
    let c = t.get(l), h = i.get(c);
    if (!!(c.flags & pt.AlwaysInline))
        throw new Error("AssertionError: Found an 'AlwaysInline' variable after the always inlining pass.");
    for (let m = c.next; m.kind !== u.ListEnd; m = m.next) {
        let v = i.get(m);
        if (v.variablesUsed.has(l)) {
            if (!I2(c, m))
                break;
            if (T2(l, c.initializer, m, h.fences)) {
                v.variablesUsed.delete(l);
                for (let w of h.variablesUsed)
                    v.variablesUsed.add(w);
                v.fences |= h.fences, t.delete(l), s.delete(l), i.delete(c), E.remove(c);
            }
            break;
        }
        if (!zf(v.fences, h.fences))
            break;
    }
} }
function hu(n) { switch (n.kind) {
    case I.NextContext: return Ee.ViewContextRead | Ee.ViewContextWrite;
    case I.RestoreView: return Ee.ViewContextRead | Ee.ViewContextWrite | Ee.SideEffectful;
    case I.StoreLet: return Ee.SideEffectful;
    case I.Reference:
    case I.ContextLetReference: return Ee.ViewContextRead;
    default: return Ee.None;
} }
function k2(n, e) { let t = Ee.None, s = new Set; return de(n, (r, i) => { !Gt(r) || e !== null && !e(i) || (r.kind === I.ReadVariable ? s.add(r.xref) : t |= hu(r)); }), { fences: t, variablesUsed: s }; }
function _2(n, e, t, s) { de(n, (r, i) => { if (!Gt(r) || s !== null && !s(i) || r.kind !== I.ReadVariable)
    return; let o = e.get(r.xref); o !== void 0 && (e.set(r.xref, o + 1), i & U.InChildOperation && t.add(r.xref)); }); }
function b2(n, e) { de(n, t => { if (!Gt(t) || t.kind !== I.ReadVariable)
    return; let s = e.get(t.xref); if (s !== void 0) {
    if (s === 0)
        throw new Error(`Inaccurate variable count: ${t.xref} - found another read but count is already 0`);
    e.set(t.xref, s - 1);
} }); }
function zf(n, e) { if (n & Ee.ViewContextWrite) {
    if (e & Ee.ViewContextRead)
        return !1;
}
else if (n & Ee.ViewContextRead && e & Ee.ViewContextWrite)
    return !1; return !0; }
function T2(n, e, t, s) { let r = !1, i = !0; return ce(t, (o, a) => { if (!Gt(o) || r || !i)
    return o; if (a & U.InChildOperation && s & Ee.ViewContextRead)
    return o; switch (o.kind) {
    case I.ReadVariable:
        if (o.xref === n)
            return r = !0, e;
        break;
    default:
        let l = hu(o);
        i = i && zf(l, s);
        break;
} return o; }, U.None), r; }
function I2(n, e) { switch (n.variable.kind) {
    case be.Identifier: return n.initializer instanceof vt && n.initializer.name === it;
    case be.Context: return e.kind === u.Variable;
    default: return !0;
} }
function qh(n) { let e = n.head.next, t = n.tail.prev; e !== null && t !== null && e.next === t && e.kind === u.Statement && e.statement instanceof Te && e.statement.expr instanceof yi && t.kind === u.Statement && t.statement instanceof me && t.statement.value instanceof Oo && (E.remove(e), t.statement.value = t.statement.value.expr); }
function N2(n) { for (let e of n.units) {
    let t = null, s = null;
    for (let r of e.create)
        switch (r.kind) {
            case u.I18nStart:
                t = r;
                break;
            case u.I18nEnd:
                t = null;
                break;
            case u.IcuStart:
                t === null && (s = n.allocateXrefId(), E.insertBefore(Sa(s, r.message, void 0, null), r));
                break;
            case u.IcuEnd:
                s !== null && (E.insertAfter(xa(s, null), r), s = null);
                break;
        }
} }
function D2(n) { for (let e of n.units) {
    for (let t of e.create)
        t.kind !== u.Animation && t.kind !== u.AnimationListener && t.kind !== u.Listener && t.kind !== u.TwoWayListener && Uh(e, t);
    for (let t of e.update)
        Uh(e, t);
} }
function Uh(n, e) { ce(e, (t, s) => { if (!(t instanceof Fn) || s & U.InChildOperation)
    return t; if (Array.isArray(t.body))
    throw new Error("AssertionError: unexpected multi-line arrow function"); let r = new Vl(t.params, t.body); return n.functions.add(r), r; }, U.None); }
var P2 = new Set(["formField"]);
function L2(n) { for (let e of n.units)
    B2(e); }
function B2(n) { for (let e of n.update)
    e.kind === u.Property && P2.has(e.name) && $2(n, e); }
var M2 = new Set([u.Container, u.ContainerStart, u.ContainerEnd, u.Element, u.ElementStart, u.ElementEnd, u.Template]);
function R2(n) { return M2.has(n.kind); }
function F2(n, e) { let t = null; for (let s of n.create)
    !R2(s) || s.xref !== e || (t = s); return t; }
function $2(n, e) { let t = F2(n, e.target); if (t === null)
    throw new Error(`No create instruction found for control target ${e.target}`); let s = mv(e.sourceSpan); E.insertAfter(s, t), E.insertAfter(Yg(e.target, e.sourceSpan), e); }
var O2 = [{ kind: k.Tmpl, fn: rS }, { kind: k.Both, fn: vS }, { kind: k.Host, fn: Ew }, { kind: k.Tmpl, fn: qE }, { kind: k.Tmpl, fn: hS }, { kind: k.Tmpl, fn: N2 }, { kind: k.Both, fn: qv }, { kind: k.Both, fn: m2 }, { kind: k.Both, fn: _v }, { kind: k.Tmpl, fn: L2 }, { kind: k.Both, fn: Fv }, { kind: k.Both, fn: Cv }, { kind: k.Tmpl, fn: Vv }, { kind: k.Both, fn: HE }, { kind: k.Tmpl, fn: Gx }, { kind: k.Both, fn: Iv }, { kind: k.Both, fn: sS }, { kind: k.Tmpl, fn: Nv }, { kind: k.Tmpl, fn: aS }, { kind: k.Tmpl, fn: Uv }, { kind: k.Tmpl, fn: uS }, { kind: k.Both, fn: D2 }, { kind: k.Both, fn: dS }, { kind: k.Tmpl, fn: mw }, { kind: k.Tmpl, fn: dw }, { kind: k.Tmpl, fn: gw }, { kind: k.Tmpl, fn: a2 }, { kind: k.Both, fn: vv }, { kind: k.Both, fn: Kx }, { kind: k.Tmpl, fn: E2 }, { kind: k.Tmpl, fn: Yx }, { kind: k.Both, fn: s2 }, { kind: k.Tmpl, fn: Hv }, { kind: k.Tmpl, fn: S2 }, { kind: k.Tmpl, fn: v2 }, { kind: k.Both, fn: Zx }, { kind: k.Both, fn: o2 }, { kind: k.Tmpl, fn: OE }, { kind: k.Both, fn: Xv }, { kind: k.Both, fn: h2 }, { kind: k.Both, fn: g2 }, { kind: k.Both, fn: A2 }, { kind: k.Both, fn: c2 }, { kind: k.Tmpl, fn: $E }, { kind: k.Tmpl, fn: Ov }, { kind: k.Tmpl, fn: Qx }, { kind: k.Tmpl, fn: xv }, { kind: k.Tmpl, fn: Ev }, { kind: k.Tmpl, fn: l2 }, { kind: k.Tmpl, fn: e2 }, { kind: k.Tmpl, fn: t2 }, { kind: k.Tmpl, fn: cw }, { kind: k.Tmpl, fn: LE }, { kind: k.Tmpl, fn: vw }, { kind: k.Both, fn: Bv }, { kind: k.Tmpl, fn: Xx }, { kind: k.Both, fn: x2 }, { kind: k.Tmpl, fn: fw }, { kind: k.Both, fn: WE }, { kind: k.Tmpl, fn: Jx }, { kind: k.Tmpl, fn: GE }, { kind: k.Tmpl, fn: YE }, { kind: k.Tmpl, fn: Gv }, { kind: k.Tmpl, fn: yv }, { kind: k.Tmpl, fn: ZE }, { kind: k.Both, fn: fS }, { kind: k.Both, fn: qx }, { kind: k.Both, fn: Tv }];
function Gf(n, e) { for (let t of O2)
    (t.kind === e || t.kind === k.Both) && t.fn(n); }
function V2(n, e) { let t = Yf(n.root); return Xf(n.root, e), t; }
function Xf(n, e) { for (let t of n.job.units) {
    if (t.parent !== n.xref)
        continue;
    Xf(t, e);
    let s = Yf(t);
    e.statements.push(s.toDeclStmt(s.name));
} }
function Yf(n) { if (n.fnName === null)
    throw new Error(`AssertionError: view ${n.xref} is unnamed`); let e = []; for (let i of n.create) {
    if (i.kind !== u.Statement)
        throw new Error(`AssertionError: expected all create ops to have been compiled, but got ${u[i.kind]}`);
    e.push(i.statement);
} let t = []; for (let i of n.update) {
    if (i.kind !== u.Statement)
        throw new Error(`AssertionError: expected all update ops to have been compiled, but got ${u[i.kind]}`);
    t.push(i.statement);
} let s = ta(1, e), r = ta(2, t); return on([new Z(or, yn), new Z(it, re)], [...s, ...r], void 0, void 0, n.fnName); }
function ta(n, e) { return e.length === 0 ? [] : [Fi(new j(x.BitwiseAnd, D(or), d(n)), e)]; }
function q2(n) { if (n.root.fnName === null)
    throw new Error("AssertionError: host binding function is unnamed"); let e = []; for (let i of n.root.create) {
    if (i.kind !== u.Statement)
        throw new Error(`AssertionError: expected all create ops to have been compiled, but got ${u[i.kind]}`);
    e.push(i.statement);
} let t = []; for (let i of n.root.update) {
    if (i.kind !== u.Statement)
        throw new Error(`AssertionError: expected all update ops to have been compiled, but got ${u[i.kind]}`);
    t.push(i.statement);
} if (e.length === 0 && t.length === 0)
    return null; let s = ta(1, e), r = ta(2, t); return on([new Z(or, yn), new Z(it, re)], [...s, ...r], void 0, void 0, n.root.fnName); }
var ss = new sr, rs = "ng-template", U2 = "animate.";
function io(n) { return n instanceof Le; }
function H2(n) { return io(n) && n.nodes.length === 1 && n.nodes[0] instanceof Tn; }
function W2(n, e, t, s, r, i, o, a, l, c) { let h = new _i(n, t, s, r, i, o, a, l, c); return cn(h.root, e), h; }
function j2(n, e, t) { let s = new zo(n.componentName, t, He.DomOnly); for (let r of n.properties ?? []) {
    let i = b.Property;
    r.name.startsWith("attr.") && (r.name = r.name.substring(5), i = b.Attribute), r.isLegacyAnimation && (i = b.LegacyAnimation), r.isAnimation && (i = b.Animation);
    let o = e.calcPossibleSecurityContexts(n.componentSelector, r.name, i === b.Attribute).filter(a => a !== J.NONE);
    z2(s, r, i, o);
} for (let [r, i] of Object.entries(n.attributes) ?? []) {
    let o = e.calcPossibleSecurityContexts(n.componentSelector, r, !0).filter(a => a !== J.NONE);
    G2(s, r, i, o);
} for (let r of n.events ?? [])
    X2(s, r); return s; }
function z2(n, e, t, s) { let r, i = e.expression.ast; i instanceof $i ? r = new le(i.strings, i.expressions.map(o => V(o, n, e.sourceSpan)), []) : r = V(i, n, e.sourceSpan), n.root.update.push(gs(n.root.xref, t, e.name, r, null, s, !1, !1, null, null, e.sourceSpan)); }
function G2(n, e, t, s) { let r = gs(n.root.xref, b.Attribute, e, t, null, s, !0, !1, null, null, t.sourceSpan); n.root.update.push(r); }
function X2(n, e) { let t; if (e.type === Oe.Animation)
    t = xf(n.root.xref, new Ie, e.name, null, Pi(n.root, e.handler, e.handlerSpan), e.name.endsWith("enter") ? "enter" : "leave", e.targetOrPhase, !0, e.sourceSpan);
else {
    let [s, r] = e.type !== Oe.LegacyAnimation ? [null, e.targetOrPhase] : [e.targetOrPhase, null];
    t = lu(n.root.xref, new Ie, e.name, null, Pi(n.root, e.handler, e.handlerSpan), s, r, !0, e.sourceSpan);
} n.root.create.push(t); }
function cn(n, e) { for (let t of e)
    if (t instanceof Ht)
        Y2(n, t);
    else if (t instanceof st)
        Q2(n, t);
    else if (t instanceof Qs)
        Z2(n, t);
    else if (t instanceof Yn)
        Qf(n, t, null);
    else if (t instanceof Gs)
        Zf(n, t, null);
    else if (t instanceof To)
        J2(n, t);
    else if (t instanceof bo)
        K2(n, t);
    else if (t instanceof fs)
        ey(n, t);
    else if (t instanceof Vp)
        ny(n, t);
    else if (t instanceof Ys)
        sy(n, t);
    else if (t instanceof Yc)
        iy(n, t);
    else if (!(t instanceof Tr))
        throw new Error(`Unsupported template node: ${t.constructor.name}`); }
function Y2(n, e) { if (e.i18n !== void 0 && !(e.i18n instanceof Le || e.i18n instanceof jt))
    throw Error(`Unhandled i18n metadata type for element: ${e.i18n.constructor.name}`); let t = n.job.allocateXrefId(), [s, r] = It(e.name), i = Zg(r, t, bf(s), e.i18n instanceof jt ? e.i18n : void 0, e.startSourceSpan, e.sourceSpan); n.create.push(i), ay(n, i, e), ed(i, e); let o = null; e.i18n instanceof Le && (o = n.job.allocateXrefId(), n.create.push(Sa(o, e.i18n, void 0, e.startSourceSpan))), cn(n, e.children); let a = Kg(t, e.endSourceSpan ?? e.startSourceSpan); n.create.push(a), o !== null && E.insertBefore(xa(o, e.endSourceSpan ?? e.startSourceSpan), a); }
function Q2(n, e) { if (e.i18n !== void 0 && !(e.i18n instanceof Le || e.i18n instanceof jt))
    throw Error(`Unhandled i18n metadata type for template: ${e.i18n.constructor.name}`); let t = n.job.allocateView(n.xref), s = e.tagName, r = ""; e.tagName && ([r, s] = It(e.tagName)); let i = e.i18n instanceof jt ? e.i18n : void 0, o = bf(r), a = s === null ? "" : Lv(s, o), l = oy(e) ? Ge.NgTemplate : Ge.Structural, c = vf(t.xref, l, s, a, o, i, e.startSourceSpan, e.sourceSpan); n.create.push(c), ly(n, c, e, l), ed(c, e), cn(t, e.children); for (let { name: h, value: p } of e.variables)
    t.contextVariables.set(h, p !== "" ? p : "$implicit"); if (l === Ge.NgTemplate && e.i18n instanceof Le) {
    let h = n.job.allocateXrefId();
    E.insertAfter(Sa(h, e.i18n, void 0, e.startSourceSpan), t.create.head), E.insertBefore(xa(h, e.endSourceSpan ?? e.startSourceSpan), t.create.tail);
} }
function Z2(n, e) { if (e.i18n !== void 0 && !(e.i18n instanceof jt))
    throw Error(`Unhandled i18n metadata type for element: ${e.i18n.constructor.name}`); let t = null; e.children.some(i => !(i instanceof va) && (!(i instanceof Yn) || i.value.trim().length > 0)) && (t = n.job.allocateView(n.xref), cn(t, e.children)); let s = n.job.allocateXrefId(), r = av(s, e.selector, e.i18n, t?.xref ?? null, e.sourceSpan); for (let i of e.attributes) {
    let o = ss.securityContext(e.name, i.name, !0);
    n.update.push(gs(r.xref, b.Attribute, i.name, d(i.value), null, o, !0, !1, null, Kt(i.i18n), i.sourceSpan));
} n.create.push(r); }
function Qf(n, e, t) { n.create.push(Sf(n.job.allocateXrefId(), e.value, t, e.sourceSpan)); }
function Zf(n, e, t) { let s = e.value; if (s instanceof ze && (s = s.ast), !(s instanceof $i))
    throw new Error(`AssertionError: expected Interpolation for BoundText node, got ${s.constructor.name}`); if (e.i18n !== void 0 && !(e.i18n instanceof rt))
    throw Error(`Unhandled i18n metadata type for text interpolation: ${e.i18n?.constructor.name}`); let r = e.i18n instanceof rt ? e.i18n.children.filter(o => o instanceof mt).map(o => o.name) : []; if (r.length > 0 && r.length !== s.expressions.length)
    throw Error(`Unexpected number of i18n placeholders (${s.expressions.length}) for BoundText with ${s.expressions.length} expressions`); let i = n.job.allocateXrefId(); n.create.push(Sf(i, "", t, e.sourceSpan)), n.update.push(Fg(i, new le(s.strings, s.expressions.map(o => V(o, n.job, null)), r), e.sourceSpan)); }
function J2(n, e) { let t = null, s = []; for (let r = 0; r < e.branches.length; r++) {
    let i = e.branches[r], o = n.job.allocateView(n.xref), a = na(n, o.xref, i);
    i.expressionAlias !== null && o.contextVariables.set(i.expressionAlias.name, Af);
    let l;
    if (i.i18n !== void 0) {
        if (!(i.i18n instanceof zt))
            throw Error(`Unhandled i18n metadata type for if block: ${i.i18n?.constructor.name}`);
        l = i.i18n;
    }
    let h = (r === 0 ? wf : Ef)(o.xref, Ge.Block, a, "Conditional", Pe.HTML, l, i.startSourceSpan, i.sourceSpan);
    n.create.push(h), t === null && (t = o.xref);
    let p = i.expression ? V(i.expression, n.job, null) : null, m = new Uo(p, h.xref, h.handle, i.expressionAlias);
    s.push(m), cn(o, i.children);
} n.update.push(df(t, null, s, e.sourceSpan)); }
function K2(n, e) { if (e.groups.length === 0)
    return; let t = null, s = []; for (let r = 0; r < e.groups.length; r++) {
    let i = e.groups[r], o = n.job.allocateView(n.xref), a = na(n, o.xref, i), l;
    if (i.i18n !== void 0) {
        if (!(i.i18n instanceof zt))
            throw Error(`Unhandled i18n metadata type for switch block: ${i.i18n?.constructor.name}`);
        l = i.i18n;
    }
    let h = (r === 0 ? wf : Ef)(o.xref, Ge.Block, a, "Case", Pe.HTML, l, i.startSourceSpan, i.sourceSpan);
    n.create.push(h), t === null && (t = o.xref);
    for (let p of i.cases) {
        let m = p.expression ? V(p.expression, n.job, e.startSourceSpan) : null, v = new Uo(m, h.xref, h.handle);
        s.push(v);
    }
    cn(o, i.children);
} n.update.push(df(t, V(e.expression, n.job, null), s, e.sourceSpan)); }
function Zi(n, e, t, s, r) { if (t !== void 0 && !(t instanceof zt))
    throw Error("Unhandled i18n metadata type for defer block"); if (s === void 0)
    return null; let i = n.job.allocateView(n.xref); cn(i, s); let o = vf(i.xref, Ge.Block, null, `Defer${e}`, Pe.HTML, t, r, r); return n.create.push(o), o; }
function ey(n, e) { let t = null; if (n.job.deferMeta.mode === 0) {
    if (!n.job.deferMeta.blocks.has(e))
        throw new Error("AssertionError: unable to find a dependency function for this deferred block");
    t = n.job.deferMeta.blocks.get(e) ?? null;
} let s = Zi(n, "", e.i18n, e.children, e.sourceSpan), r = Zi(n, "Loading", e.loading?.i18n, e.loading?.children, e.loading?.sourceSpan), i = Zi(n, "Placeholder", e.placeholder?.i18n, e.placeholder?.children, e.placeholder?.sourceSpan), o = Zi(n, "Error", e.error?.i18n, e.error?.children, e.error?.sourceSpan), a = n.job.allocateXrefId(), l = lv(a, s.xref, s.handle, t, n.job.allDeferrableDepsFn, e.sourceSpan); l.placeholderView = i?.xref ?? null, l.placeholderSlot = i?.handle ?? null, l.loadingSlot = r?.handle ?? null, l.errorSlot = o?.handle ?? null, l.placeholderMinimumTime = e.placeholder?.minimumTime ?? null, l.loadingMinimumTime = e.loading?.minimumTime ?? null, l.loadingAfterTime = e.loading?.afterTime ?? null, l.flags = ty(e), n.create.push(l); let c = [], h = []; Ba("hydrate", e.hydrateTriggers, c, h, n, a), Ba("none", e.triggers, c, h, n, a), Ba("prefetch", e.prefetchTriggers, c, h, n, a), c.some(m => m.modifier === "none") || h.some(m => m.modifier === "none") || c.push(fn(a, { kind: ee.Idle }, "none", null)), n.create.push(c), n.update.push(h); }
function ty(n) { return Object.keys(n.hydrateTriggers).length > 0 ? 1 : null; }
function Ba(n, e, t, s, r, i) { if (e.idle !== void 0) {
    let o = fn(i, { kind: ee.Idle }, n, e.idle.sourceSpan);
    t.push(o);
} if (e.immediate !== void 0) {
    let o = fn(i, { kind: ee.Immediate }, n, e.immediate.sourceSpan);
    t.push(o);
} if (e.timer !== void 0) {
    let o = fn(i, { kind: ee.Timer, delay: e.timer.delay }, n, e.timer.sourceSpan);
    t.push(o);
} if (e.hover !== void 0) {
    let o = fn(i, { kind: ee.Hover, targetName: e.hover.reference, targetXref: null, targetSlot: null, targetView: null, targetSlotViewSteps: null }, n, e.hover.sourceSpan);
    t.push(o);
} if (e.interaction !== void 0) {
    let o = fn(i, { kind: ee.Interaction, targetName: e.interaction.reference, targetXref: null, targetSlot: null, targetView: null, targetSlotViewSteps: null }, n, e.interaction.sourceSpan);
    t.push(o);
} if (e.viewport !== void 0) {
    let o = fn(i, { kind: ee.Viewport, targetName: e.viewport.reference, targetXref: null, targetSlot: null, targetView: null, targetSlotViewSteps: null, options: e.viewport.options ? V(e.viewport.options, r.job, e.viewport.sourceSpan) : null }, n, e.viewport.sourceSpan);
    t.push(o);
} if (e.never !== void 0) {
    let o = fn(i, { kind: ee.Never }, n, e.never.sourceSpan);
    t.push(o);
} if (e.when !== void 0) {
    if (e.when.value instanceof $i)
        throw new Error("Unexpected interpolation in defer block when trigger");
    let o = zg(i, V(e.when.value, r.job, e.when.sourceSpan), n, e.when.sourceSpan);
    s.push(o);
} }
function ny(n, e) { if (e.i18n instanceof Le && H2(e.i18n)) {
    let t = n.job.allocateXrefId();
    n.create.push(hv(t, e.i18n, Wp(e.i18n).name, null));
    for (let [s, r] of Object.entries(S(S({}, e.vars), e.placeholders)))
        r instanceof Gs ? Zf(n, r, s) : Qf(n, r, s);
    n.create.push(pv(t));
}
else
    throw Error(`Unhandled i18n metadata type for ICU: ${e.i18n?.constructor.name}`); }
function sy(n, e) { let t = n.job.allocateView(n.xref), s = `\u0275$index_${t.xref}`, r = `\u0275$count_${t.xref}`, i = new Set; t.contextVariables.set(e.item.name, e.item.value); for (let A of e.contextVariables)
    A.value === "$index" && i.add(A.name), A.name === "$index" ? t.contextVariables.set("$index", A.value).set(s, A.value) : A.name === "$count" ? t.contextVariables.set("$count", A.value).set(r, A.value) : t.aliases.add({ kind: be.Alias, name: null, identifier: A.name, expression: ry(A, s, r) }); let o = ve(e.trackBy.span, e.sourceSpan), a = V(e.trackBy, n.job, o); cn(t, e.children); let l = null, c = null; e.empty !== null && (l = n.job.allocateView(n.xref), cn(l, e.empty.children), c = na(n, l.xref, e.empty)); let h = { $index: i, $implicit: e.item.name }; if (e.i18n !== void 0 && !(e.i18n instanceof zt))
    throw Error("AssertionError: Unhandled i18n metadata type or @for"); if (e.empty?.i18n !== void 0 && !(e.empty.i18n instanceof zt))
    throw Error("AssertionError: Unhandled i18n metadata type or @empty"); let p = e.i18n, m = e.empty?.i18n, v = na(n, t.xref, e), w = Jg(t.xref, l?.xref ?? null, v, a, h, c, p, m, e.startSourceSpan, e.sourceSpan); n.create.push(w); let C = V(e.expression, n.job, ve(e.expression.span, e.sourceSpan)), T = jg(w.xref, w.handle, C, e.sourceSpan); n.update.push(T); }
function ry(n, e, t) { switch (n.value) {
    case "$index": return new ke(e);
    case "$count": return new ke(t);
    case "$first": return new ke(e).identical(d(0));
    case "$last": return new ke(e).identical(new ke(t).minus(d(1)));
    case "$even": return new ke(e).modulo(d(2)).identical(d(0));
    case "$odd": return new ke(e).modulo(d(2)).notIdentical(d(0));
    default: throw new Error(`AssertionError: unknown @for loop variable ${n.value}`);
} }
function iy(n, e) { let t = n.job.allocateXrefId(); n.create.push(cv(t, e.name, e.sourceSpan)), n.update.push(Xg(t, e.name, V(e.value, n.job, e.valueSpan), e.sourceSpan)); }
function V(n, e, t) { if (n instanceof ze)
    return V(n.ast, e, t); if (n instanceof $t)
    return n.receiver instanceof Ut ? new ke(n.name) : new Xe(V(n.receiver, e, t), n.name, null, ve(n.span, t)); if (n instanceof js) {
    if (n.receiver instanceof Ut)
        throw new Error("Unexpected ImplicitReceiver");
    return new Ue(V(n.receiver, e, t), n.args.map(s => V(s, e, t)), void 0, ve(n.span, t));
}
else {
    if (n instanceof We)
        return d(n.value, void 0, ve(n.span, t));
    if (n instanceof Rs)
        switch (n.operator) {
            case "+": return new rn(Os.Plus, V(n.expr, e, t), void 0, ve(n.span, t));
            case "-": return new rn(Os.Minus, V(n.expr, e, t), void 0, ve(n.span, t));
            default: throw new Error(`AssertionError: unknown unary operator ${n.operator}`);
        }
    else if (n instanceof Be) {
        let s = Dv.get(n.operation);
        if (s === void 0)
            throw new Error(`AssertionError: unknown binary operator ${n.operation}`);
        return new j(s, V(n.left, e, t), V(n.right, e, t), void 0, ve(n.span, t));
    }
    else {
        if (n instanceof zr)
            return new Dn(e.root.xref);
        if (n instanceof hs)
            return new Vt(V(n.receiver, e, t), V(n.key, e, t), void 0, ve(n.span, t));
        if (n instanceof Ws)
            throw new Error("AssertionError: Chain in unknown context");
        if (n instanceof ps) {
            let s = n.keys.map((r, i) => { let o = V(n.values[i], e, t); return r.kind === "spread" ? new qt(o) : new cs(r.key, o, r.quoted); });
            return new Et(s, void 0, ve(n.span, t));
        }
        else {
            if (n instanceof Yr)
                return new Tt(n.expressions.map(s => V(s, e, t)));
            if (n instanceof mo)
                return new bt(V(n.condition, e, t), V(n.trueExp, e, t), V(n.falseExp, e, t), void 0, ve(n.span, t));
            if (n instanceof Kr)
                return V(n.expression, e, t);
            if (n instanceof go)
                return new ws(e.allocateXrefId(), new Ie, n.name, [V(n.exp, e, t), ...n.args.map(s => V(s, e, t))]);
            if (n instanceof Xr)
                return new Ks(V(n.receiver, e, t), V(n.key, e, t), ve(n.span, t));
            if (n instanceof Gr)
                return new Js(V(n.receiver, e, t), n.name);
            if (n instanceof wo)
                return new Es(V(n.receiver, e, t), n.args.map(s => V(s, e, t)));
            if (n instanceof Ne)
                return new Ai(ve(n.span, t));
            if (n instanceof Qr)
                return Dp(V(n.expression, e, t), ve(n.span, t));
            if (n instanceof Zr)
                return ir(V(n.expression, e, t));
            if (n instanceof Jr)
                return new Fr(V(n.expression, e, t), void 0, ve(n.span, t));
            if (n instanceof ti)
                return Hh(n, e, t);
            if (n instanceof ei)
                return new Vs(V(n.tag, e, t), Hh(n.template, e, t), void 0, ve(n.span, t));
            if (n instanceof ni)
                return new wt(V(n.expression, e, t), void 0, ve(n.span, t));
            if (n instanceof xo)
                return new as(n.body, n.flags, t);
            if (n instanceof vo)
                return new Cn(V(n.expression, e, t));
            if (n instanceof So)
                return uy(ie(n.parameters.map(s => new Z(s.name, re)), V(n.body, e, t)));
            throw new Error(`Unhandled expression type "${n.constructor.name}" in file "${t?.start.file.url}"`);
        }
    }
} }
function Hh(n, e, t) { return new Us(n.elements.map(s => new $r(s.text, ve(s.span, t))), n.expressions.map(s => V(s, e, t)), ve(n.span, t)); }
function cc(n, e, t, s) { let r; return e instanceof $i ? r = new le(e.strings, e.expressions.map(i => V(i, n, null)), Object.keys(Kt(t)?.placeholders ?? {})) : e instanceof te ? r = V(e, n, null) : r = d(e), r; }
var Jf = new Map([[X.Property, b.Property], [X.TwoWay, b.TwoWayProperty], [X.Attribute, b.Attribute], [X.Class, b.ClassName], [X.Style, b.StyleProperty], [X.LegacyAnimation, b.LegacyAnimation], [X.Animation, b.Animation]]);
function oy(n) { return It(n.tagName ?? "")[1] === rs; }
function Kt(n) { if (n == null)
    return null; if (!(n instanceof Le))
    throw Error(`Expected i18n meta to be a Message, but got: ${n.constructor.name}`); return n; }
function ay(n, e, t) { let s = new Array, r = new Set; for (let i of t.attributes) {
    let o = ss.securityContext(t.name, i.name, !0);
    s.push(gs(e.xref, b.Attribute, i.name, cc(n.job, i.value, i.i18n), null, o, !0, !1, null, Kt(i.i18n), i.sourceSpan)), i.i18n && r.add(i.name);
} for (let i of t.inputs)
    r.has(i.name) && console.error(`On component ${n.job.componentName}, the binding ${i.name} is both an i18n attribute and a property. You may want to remove the property binding. This will become a compilation error in future versions of Angular.`), s.push(gs(e.xref, Jf.get(i.type), i.name, cc(n.job, Li(i.value), i.i18n), i.unit, i.securityContext, !1, !1, null, Kt(i.i18n) ?? null, i.sourceSpan)); n.create.push(s.filter(i => i?.kind === u.ExtractedAttribute)), n.update.push(s.filter(i => i?.kind === u.Binding)); for (let i of t.outputs) {
    if (i.type === Oe.LegacyAnimation && i.phase === null)
        throw Error("Animation listener should have a phase");
    i.type === Oe.TwoWay ? n.create.push(yf(e.xref, e.handle, i.name, e.tag, Kf(n, i.handler, i.handlerSpan), i.sourceSpan)) : i.type === Oe.Animation ? n.create.push(xf(e.xref, e.handle, i.name, e.tag, Pi(n, i.handler, i.handlerSpan), i.name.endsWith("enter") ? "enter" : "leave", i.target, !1, i.sourceSpan)) : n.create.push(lu(e.xref, e.handle, i.name, e.tag, Pi(n, i.handler, i.handlerSpan), i.phase, i.target, !1, i.sourceSpan));
} s.some(i => i?.i18nMessage) !== null && n.create.push(Cf(n.job.allocateXrefId(), new Ie, e.xref)); }
function ly(n, e, t, s) { let r = new Array; for (let i of t.templateAttrs)
    if (i instanceof Xs) {
        let o = ss.securityContext(rs, i.name, !0);
        r.push(Ji(n, e.xref, X.Attribute, i.name, i.value, null, o, !0, s, Kt(i.i18n), i.sourceSpan));
    }
    else
        r.push(Ji(n, e.xref, i.type, i.name, Li(i.value), i.unit, i.securityContext, !0, s, Kt(i.i18n), i.sourceSpan)); for (let i of t.attributes) {
    let o = ss.securityContext(rs, i.name, !0);
    r.push(Ji(n, e.xref, X.Attribute, i.name, i.value, null, o, !1, s, Kt(i.i18n), i.sourceSpan));
} for (let i of t.inputs)
    r.push(Ji(n, e.xref, i.type, i.name, Li(i.value), i.unit, i.securityContext, !1, s, Kt(i.i18n), i.sourceSpan)); n.create.push(r.filter(i => i?.kind === u.ExtractedAttribute)), n.update.push(r.filter(i => i?.kind === u.Binding)); for (let i of t.outputs) {
    if (i.type === Oe.LegacyAnimation && i.phase === null)
        throw Error("Animation listener should have a phase");
    if (s === Ge.NgTemplate && (i.type === Oe.TwoWay ? n.create.push(yf(e.xref, e.handle, i.name, e.tag, Kf(n, i.handler, i.handlerSpan), i.sourceSpan)) : n.create.push(lu(e.xref, e.handle, i.name, e.tag, Pi(n, i.handler, i.handlerSpan), i.phase, i.target, !1, i.sourceSpan))), s === Ge.Structural && i.type !== Oe.LegacyAnimation) {
        let o = ss.securityContext(rs, i.name, !1);
        n.create.push(ft(e.xref, b.Property, null, i.name, null, null, null, o));
    }
} r.some(i => i?.i18nMessage) !== null && n.create.push(Cf(n.job.allocateXrefId(), new Ie, e.xref)); }
function Ji(n, e, t, s, r, i, o, a, l, c, h) { let p = typeof r == "string"; if (l === Ge.Structural) {
    if (!a)
        switch (t) {
            case X.Property:
            case X.Class:
            case X.Style: return ft(e, b.Property, null, s, null, null, c, o);
            case X.TwoWay: return ft(e, b.TwoWayProperty, null, s, null, null, c, o);
        }
    if (!p && (t === X.Attribute || t === X.LegacyAnimation || t === X.Animation))
        return null;
} let m = Jf.get(t); return l === Ge.NgTemplate && (t === X.Class || t === X.Style || t === X.Attribute && !p) && (m = b.Property), gs(e, m, s, cc(n.job, r, c), i, o, p, a, l, c, h); }
function Pi(n, e, t) { e = Li(e); let s = new Array, r = e instanceof Ws ? e.expressions : [e]; if (r.length === 0)
    throw new Error("Expected listener to have non-empty expression list."); let i = r.map(a => V(a, n.job, t)), o = i.pop(); return s.push(...i.map(a => ot(new Te(a, a.sourceSpan)))), s.push(ot(new me(o, o.sourceSpan))), s; }
function Kf(n, e, t) { e = Li(e); let s = new Array; if (e instanceof Ws)
    if (e.expressions.length === 1)
        e = e.expressions[0];
    else
        throw new Error("Expected two-way listener to have a single expression."); let r = V(e, n.job, t), i = new ke("$event"), o = new Vo(r, i); return s.push(ot(new Te(o))), s.push(ot(new me(i))), s; }
function Li(n) { return n instanceof ze ? n.ast : n; }
function ed(n, e) { cy(n.localRefs); for (let { name: t, value: s } of e.references)
    n.localRefs.push({ name: t, target: s }); }
function cy(n) { if (!Array.isArray(n))
    throw new Error("AssertionError: expected an array"); }
function ve(n, e) { if (e === null)
    return null; let t = e.start.moveBy(n.start), s = e.start.moveBy(n.end), r = e.fullStart.moveBy(n.start); return new B(t, s, r); }
function na(n, e, t) { let s = null; for (let r of t.children)
    if (!(r instanceof va || r instanceof Yc)) {
        if (s !== null)
            return null;
        if (r instanceof Ht || r instanceof st && r.tagName !== null)
            s = r;
        else
            return null;
    } if (s !== null) {
    for (let i of s.attributes)
        if (!i.name.startsWith(U2)) {
            let o = ss.securityContext(rs, i.name, !0);
            n.update.push(gs(e, b.Attribute, i.name, d(i.value), null, o, !0, !1, null, Kt(i.i18n), i.sourceSpan));
        }
    for (let i of s.inputs)
        if (i.type !== X.LegacyAnimation && i.type !== X.Animation && i.type !== X.Attribute) {
            let o = ss.securityContext(rs, i.name, !0);
            n.create.push(ft(e, b.Property, null, i.name, null, null, null, o));
        }
    let r = s instanceof Ht ? s.name : s.tagName;
    return r === rs ? null : r;
} return null; }
function uy(n) { let e = new Set(n.params.map(t => t.name)); return _(n, t => { if (t instanceof Fn)
    for (let s of t.params)
        e.add(s.name);
else if (t instanceof ke && e.has(t.name))
    return D(t.name); return t; }, U.None); }
var td = !1;
function Ak(n) { td = n; }
function hy() { return td; }
function sa(n, e) { return Fi(D(or).bitwiseAnd(d(n), null), e); }
function py(n) { return (n.descendants ? 1 : 0) | (n.static ? 2 : 0) | (n.emitDistinctChangesOnly ? 4 : 0); }
function fy(n, e) { if (Array.isArray(n.predicate)) {
    let t = [];
    return n.predicate.forEach(s => { let r = s.split(",").map(i => d(i.trim())); t.push(...r); }), e.getConstLiteral(q(t), !0);
}
else
    switch (n.predicate.forwardRef) {
        case 0:
        case 2: return n.predicate.expression;
        case 1: return y(f.resolveForwardRef).callFn([n.predicate.expression]);
    } }
function nd(n, e, t) { let s = []; return t !== void 0 && s.push(...t), n.isSignal && s.push(new Xe(D(it), n.propertyName)), s.push(fy(n, e), d(py(n))), n.read && s.push(n.read), s; }
var pu = Symbol("queryAdvancePlaceholder");
function sd(n) { let e = [], t = 0, s = () => { t > 0 && (e.unshift(y(f.queryAdvance).callFn(t === 1 ? [] : [d(t)]).toStmt()), t = 0); }; for (let r = n.length - 1; r >= 0; r--) {
    let i = n[r];
    i === pu ? t++ : (s(), e.unshift(i));
} return s(), e; }
function dy(n, e, t) { let s = [], r = [], i = jp(c => r.push(c), eu), o = null, a = null; n.forEach(c => { let h = nd(c, e); if (c.isSignal ? (o ??= y(f.viewQuerySignal), o = o.callFn(h)) : (a ??= y(f.viewQuery), a = a.callFn(h)), c.isSignal) {
    r.push(pu);
    return;
} let p = i(), m = y(f.loadQuery).callFn([]), v = y(f.queryRefresh).callFn([p.set(m)]), w = D(it).prop(c.propertyName).set(c.first ? p.prop("first") : p); r.push(v.and(w).toStmt()); }), o !== null && s.push(new Te(o)), a !== null && s.push(new Te(a)); let l = t ? `${t}_Query` : null; return on([new Z(or, yn), new Z(it, re)], [sa(1, s), sa(2, sd(r))], gt, null, l); }
function my(n, e, t) { let s = [], r = [], i = jp(c => r.push(c), eu), o = null, a = null; for (let c of n) {
    let h = nd(c, e, [D("dirIndex")]);
    if (c.isSignal ? (o ??= y(f.contentQuerySignal), o = o.callFn(h)) : (a ??= y(f.contentQuery), a = a.callFn(h)), c.isSignal) {
        r.push(pu);
        continue;
    }
    let p = i(), m = y(f.loadQuery).callFn([]), v = y(f.queryRefresh).callFn([p.set(m)]), w = D(it).prop(c.propertyName).set(c.first ? p.prop("first") : p);
    r.push(v.and(w).toStmt());
} o !== null && s.push(new Te(o)), a !== null && s.push(new Te(a)); let l = t ? `${t}_ContentQueries` : null; return on([new Z(or, yn), new Z(it, re), new Z("dirIndex", yn)], [sa(1, s), sa(2, sd(r))], gt, null, l); }
var ra = class extends Df {
    constructor() { super(nc); }
    parse(e, t, s) { return super.parse(e, t, s); }
}, Ki = ".", gy = "attr", Ma = "animate", vy = "class", wy = "style", Ey = "*", Ra = "animate-", uc = class {
    _exprParser;
    _schemaRegistry;
    errors;
    constructor(e, t, s) { this._exprParser = e, this._schemaRegistry = t, this.errors = s; }
    createBoundHostProperties(e, t) { let s = []; for (let r of Object.keys(e)) {
        let i = e[r];
        typeof i == "string" ? this.parsePropertyBinding(r, i, !0, !1, t, t.start.offset, void 0, [], s, t) : this._reportError(`Value of the host property binding "${r}" needs to be a string representing an expression but got "${i}" (${typeof i})`, t);
    } return s; }
    createDirectiveHostEventAsts(e, t) { let s = []; for (let r of Object.keys(e)) {
        let i = e[r];
        typeof i == "string" ? this.parseEvent(r, i, !1, t, t, [], s, t) : this._reportError(`Value of the host listener "${r}" needs to be a string representing an expression but got "${i}" (${typeof i})`, t);
    } return s; }
    parseInterpolation(e, t, s) { let r = t.fullStart.offset; try {
        let i = this._exprParser.parseInterpolation(e, t, r, s);
        return i && this.errors.push(...i.errors), i;
    }
    catch (i) {
        return this._reportError(`${i}`, t), this._exprParser.wrapLiteralPrimitive("ERROR", t, r);
    } }
    parseInterpolationExpression(e, t) { let s = t.start.offset; try {
        let r = this._exprParser.parseInterpolationExpression(e, t, s);
        return r && this.errors.push(...r.errors), r;
    }
    catch (r) {
        return this._reportError(`${r}`, t), this._exprParser.wrapLiteralPrimitive("ERROR", t, s);
    } }
    parseInlineTemplateBinding(e, t, s, r, i, o, a, l) { let c = s.start.offset + Ey.length, h = this._parseTemplateBindings(e, t, s, c, r); for (let p of h) {
        let m = hn(s, p.sourceSpan), v = p.key.source, w = hn(s, p.key.span);
        if (p instanceof si) {
            let C = p.value ? p.value.source : "$implicit", T = p.value ? hn(s, p.value.span) : void 0;
            a.push(new ul(v, C, m, w, T));
        }
        else if (p.value) {
            let C = l ? m : s, T = hn(s, p.value.ast.sourceSpan);
            this._parsePropertyAst(v, p.value, !1, C, w, T, i, o);
        }
        else
            i.push([v, ""]), this.parseLiteralAttr(v, null, w, r, void 0, i, o, w);
    } }
    _parseTemplateBindings(e, t, s, r, i) { try {
        let o = this._exprParser.parseTemplateBindings(e, t, s, r, i);
        return o.errors.forEach(a => this.errors.push(a)), o.warnings.forEach(a => { this._reportError(a, s, vn.WARNING); }), o.templateBindings;
    }
    catch (o) {
        return this._reportError(`${o}`, s), [];
    } }
    parseLiteralAttr(e, t, s, r, i, o, a, l) { Fa(e) ? (e = e.substring(1), l !== void 0 && (l = hn(l, new tt(l.start.offset + 1, l.end.offset))), t && this._reportError('Assigning animation triggers via @prop="exp" attributes with an expression is invalid. Use property bindings (e.g. [@prop]="exp") or use an attribute without a value (e.g. @prop) instead.', s, vn.ERROR), this._parseLegacyAnimation(e, t, s, r, l, i, o, a)) : a.push(new Ps(e, this._exprParser.wrapLiteralPrimitive(t, "", r), Pt.LITERAL_ATTR, s, l, i)); }
    parsePropertyBinding(e, t, s, r, i, o, a, l, c, h) { e.length === 0 && this._reportError("Property name is missing in binding", i); let p = !1; e.startsWith(Ra) ? (p = !0, e = e.substring(Ra.length), h !== void 0 && (h = hn(h, new tt(h.start.offset + Ra.length, h.end.offset)))) : Fa(e) && (p = !0, e = e.substring(1), h !== void 0 && (h = hn(h, new tt(h.start.offset + 1, h.end.offset)))), p ? this._parseLegacyAnimation(e, t, i, o, h, a, l, c) : e.startsWith(`${Ma}${Ki}`) ? this._parseAnimation(e, this.parseBinding(t, s, a || i, o), i, h, a, l, c) : this._parsePropertyAst(e, this.parseBinding(t, s, a || i, o), r, i, h, a, l, c); }
    parsePropertyInterpolation(e, t, s, r, i, o, a, l) { let c = this.parseInterpolation(t, r || s, l); return c ? (this._parsePropertyAst(e, c, !1, s, a, r, i, o), !0) : !1; }
    _parsePropertyAst(e, t, s, r, i, o, a, l) { a.push([e, t.source]), l.push(new Ps(e, t, s ? Pt.TWO_WAY : Pt.DEFAULT, r, i, o)); }
    _parseAnimation(e, t, s, r, i, o, a) { o.push([e, t.source]), a.push(new Ps(e, t, Pt.ANIMATION, s, r, i)); }
    _parseLegacyAnimation(e, t, s, r, i, o, a, l) { e.length === 0 && this._reportError("Animation trigger is missing", s); let c = this.parseBinding(t || "undefined", !1, o || s, r); a.push([e, c.source]), l.push(new Ps(e, c, Pt.LEGACY_ANIMATION, s, i, o)); }
    parseBinding(e, t, s, r) { try {
        let i = t ? this._exprParser.parseSimpleBinding(e, s, r) : this._exprParser.parseBinding(e, s, r);
        return i && this.errors.push(...i.errors), i;
    }
    catch (i) {
        return this._reportError(`${i}`, s), this._exprParser.wrapLiteralPrimitive("ERROR", s, r);
    } }
    createBoundElementProperty(e, t, s = !1, r = !0) { if (t.isLegacyAnimation)
        return new Co(t.name, X.LegacyAnimation, J.NONE, t.expression, null, t.sourceSpan, t.keySpan, t.valueSpan); let i = null, o, a = null, l = t.name.split(Ki), c; if (l.length > 1)
        if (l[0] == gy) {
            a = l.slice(1).join(Ki), s || this._validatePropertyOrAttributeName(a, t.sourceSpan, !0), c = $a(this._schemaRegistry, e, a, !0);
            let h = a.indexOf(":");
            if (h > -1) {
                let p = a.substring(0, h), m = a.substring(h + 1);
                a = so(p, m);
            }
            o = X.Attribute;
        }
        else
            l[0] == vy ? (a = l[1], o = X.Class, c = [J.NONE]) : l[0] == wy ? (i = l.length > 2 ? l[2] : null, a = l[1], o = X.Style, c = [J.STYLE]) : l[0] == Ma && (a = t.name, o = X.Animation, c = [J.NONE]); if (a === null) {
        let h = this._schemaRegistry.getMappedPropName(t.name);
        a = r ? h : t.name, c = $a(this._schemaRegistry, e, h, !1), o = t.type === Pt.TWO_WAY ? X.TwoWay : X.Property, s || this._validatePropertyOrAttributeName(h, t.sourceSpan, !1);
    } return new Co(a, o, c[0], t.expression, i, t.sourceSpan, t.keySpan, t.valueSpan); }
    parseEvent(e, t, s, r, i, o, a, l) { e.length === 0 && this._reportError("Event name is missing in binding", r), Fa(e) ? (e = e.slice(1), l !== void 0 && (l = hn(l, new tt(l.start.offset + 1, l.end.offset))), this._parseLegacyAnimationEvent(e, t, r, i, a, l)) : this._parseRegularEvent(e, t, s, r, i, o, a, l); }
    calcPossibleSecurityContexts(e, t, s) { let r = this._schemaRegistry.getMappedPropName(t); return $a(this._schemaRegistry, e, r, s); }
    parseEventListenerName(e) { let [t, s] = om(e, [null, e]); return { eventName: s, target: t }; }
    parseLegacyAnimationEventName(e) { let t = am(e, [e, null]); return { eventName: t[0], phase: t[1] === null ? null : t[1].toLowerCase() }; }
    _parseLegacyAnimationEvent(e, t, s, r, i, o) { let { eventName: a, phase: l } = this.parseLegacyAnimationEventName(e), c = this._parseAction(t, r); i.push(new yo(a, l, Oe.LegacyAnimation, c, s, r, o)), a.length === 0 && this._reportError("Animation event name is missing in binding", s), l ? l !== "start" && l !== "done" && this._reportError(`The provided animation output phase value "${l}" for "@${a}" is not supported (use start or done)`, s) : this._reportError(`The animation trigger output event (@${a}) is missing its phase value name (start or done are currently supported)`, s); }
    _parseRegularEvent(e, t, s, r, i, o, a, l) { let { eventName: c, target: h } = this.parseEventListenerName(e), p = this.errors.length, m = this._parseAction(t, i), v = this.errors.length === p; o.push([e, m.source]), s && v && !this._isAllowedAssignmentEvent(m) && this._reportError("Unsupported expression in a two-way binding", r); let w = Oe.Regular; s && (w = Oe.TwoWay), e.startsWith(`${Ma}${Ki}`) && (w = Oe.Animation), a.push(new yo(c, h, w, m, r, i, l)); }
    _parseAction(e, t) { let s = t && t.start ? t.start.offset : 0; try {
        let r = this._exprParser.parseAction(e, t, s);
        return r && this.errors.push(...r.errors), !r || r.ast instanceof Ne ? (this._reportError("Empty expressions are not allowed", t), this._exprParser.wrapLiteralPrimitive("ERROR", t, s)) : r;
    }
    catch (r) {
        return this._reportError(`${r}`, t), this._exprParser.wrapLiteralPrimitive("ERROR", t, s);
    } }
    _reportError(e, t, s = vn.ERROR) { this.errors.push(new N(t, e, s)); }
    _validatePropertyOrAttributeName(e, t, s) { let r = s ? this._schemaRegistry.validateAttribute(e) : this._schemaRegistry.validateProperty(e); r.error && this._reportError(r.msg, t, vn.ERROR); }
    _isAllowedAssignmentEvent(e) { return e instanceof ze ? this._isAllowedAssignmentEvent(e.ast) : e instanceof Kr ? this._isAllowedAssignmentEvent(e.expression) : e instanceof js && e.args.length === 1 && e.receiver instanceof $t && e.receiver.name === "$any" && e.receiver.receiver instanceof Ut ? this._isAllowedAssignmentEvent(e.args[0]) : (e instanceof $t || e instanceof hs) && !hc(e); }
};
function hc(n) { return n instanceof Gr || n instanceof Xr ? !0 : n instanceof ni ? hc(n.expression) : n instanceof $t || n instanceof hs || n instanceof js ? hc(n.receiver) : !1; }
function Fa(n) { return n[0] == "@"; }
function $a(n, e, t, s) { let r, i = o => n.securityContext(o, t, s); return e === null ? r = n.allKnownElementNames().map(i) : (r = [], is.parse(e).forEach(o => { let a = o.element ? [o.element] : n.allKnownElementNames(), l = new Set(o.notSelectors.filter(h => h.isElementSelector()).map(h => h.element)), c = a.filter(h => !l.has(h)); r.push(...c.map(i)); })), r.length === 0 ? [J.NONE] : Array.from(new Set(r)).sort(); }
function hn(n, e) { let t = e.start - n.start.offset, s = e.end - n.end.offset; return new B(n.start.moveBy(t), n.end.moveBy(s), n.fullStart.moveBy(t), n.details); }
function Sy(n) { if (n == null || n.length === 0 || n[0] == "/")
    return !1; let e = n.match(xy); return e === null || e[1] == "package" || e[1] == "asset"; }
var xy = /^([^:/?#]+):/, yy = "select", Cy = "link", Ay = "rel", ky = "href", _y = "stylesheet", by = "style", Ty = "script", Iy = "ngNonBindable", Ny = "ngProjectAs";
function rd(n) { let e = null, t = null, s = null, r = !1, i = ""; n.attrs.forEach(l => { let c = l.name.toLowerCase(); c == yy ? e = l.value : c == ky ? t = l.value : c == Ay ? s = l.value : l.name == Iy ? r = !0 : l.name == Ny && l.value.length > 0 && (i = l.value); }), e = Dy(e); let o = n.name.toLowerCase(), a = et.OTHER; return hl(o) ? a = et.NG_CONTENT : o == by ? a = et.STYLE : o == Ty ? a = et.SCRIPT : o == Cy && s == _y && (a = et.STYLESHEET), new pc(a, e, t, r, i); }
var et = (function (n) { return n[n.NG_CONTENT = 0] = "NG_CONTENT", n[n.STYLE = 1] = "STYLE", n[n.STYLESHEET = 2] = "STYLESHEET", n[n.SCRIPT = 3] = "SCRIPT", n[n.OTHER = 4] = "OTHER", n; })(et || {}), pc = class {
    type;
    selectAttr;
    hrefAttr;
    nonBindable;
    projectAs;
    constructor(e, t, s, r, i) { this.type = e, this.selectAttr = t, this.hrefAttr = s, this.nonBindable = r, this.projectAs = i; }
};
function Dy(n) { return n === null || n.length === 0 ? "*" : n; }
var Py = /^\s*([0-9A-Za-z_$]*)\s+of\s+([\S\s]*)/, Ly = /^track\s+([\S\s]*)/, By = /^(as\s+)(.*)/, Ca = /^else[^\S\r\n]+if/, My = /^let\s+([\S\s]*)/, Ry = /^[$A-Z_][0-9A-Z_$]*$/i, Wh = /(\s*)(\S+)(\s*)/, Mr = new Set(["$index", "$first", "$last", "$even", "$odd", "$count"]);
function jh(n) { return n === "empty"; }
function zh(n) { return n === "else" || Ca.test(n); }
function Fy(n, e, t, s) { let r = Hy(e), i = [], o = Gh(n, r, s); o !== null && i.push(new Kn(o.expression, P(t, n.children, n.children), o.expressionAlias, n.sourceSpan, n.startSourceSpan, n.endSourceSpan, n.nameSpan, n.i18n)); for (let p of e)
    if (Ca.test(p.name)) {
        let m = Gh(p, r, s);
        if (m !== null) {
            let v = P(t, p.children, p.children);
            i.push(new Kn(m.expression, v, m.expressionAlias, p.sourceSpan, p.startSourceSpan, p.endSourceSpan, p.nameSpan, p.i18n));
        }
    }
    else if (p.name === "else") {
        let m = P(t, p.children, p.children);
        i.push(new Kn(null, m, null, p.sourceSpan, p.startSourceSpan, p.endSourceSpan, p.nameSpan, p.i18n));
    } let a = i.length > 0 ? i[0].startSourceSpan : n.startSourceSpan, l = i.length > 0 ? i[i.length - 1].endSourceSpan : n.endSourceSpan, c = n.sourceSpan, h = i[i.length - 1]; return h !== void 0 && (c = new B(a.start, h.sourceSpan.end)), { node: new To(i, c, n.startSourceSpan, l, n.nameSpan), errors: r }; }
function $y(n, e, t, s) { let r = [], i = Vy(n, r, s), o = null, a = null; for (let l of e)
    l.name === "empty" ? a !== null ? r.push(new N(l.sourceSpan, "@for loop can only have one @empty block")) : l.parameters.length > 0 ? r.push(new N(l.sourceSpan, "@empty block cannot have parameters")) : a = new ci(P(t, l.children, l.children), l.sourceSpan, l.startSourceSpan, l.endSourceSpan, l.nameSpan, l.i18n) : r.push(new N(l.sourceSpan, `Unrecognized @for loop block "${l.name}"`)); if (i !== null)
    if (i.trackBy === null)
        r.push(new N(n.startSourceSpan, '@for loop must have a "track" expression'));
    else {
        let l = a?.endSourceSpan ?? n.endSourceSpan, c = new B(n.sourceSpan.start, l?.end ?? n.sourceSpan.end);
        qy(i.trackBy.expression, i.trackBy.keywordSpan, r), o = new Ys(i.itemName, i.expression, i.trackBy.expression, i.trackBy.keywordSpan, i.context, P(t, n.children, n.children), a, c, n.sourceSpan, n.startSourceSpan, l, n.nameSpan, n.i18n);
    } return { node: o, errors: r }; }
function Oy(n, e, t) { let s = Wy(n), r = n.parameters.length > 0 ? Bi(n.parameters[0], t) : t.parseBinding("", !1, n.sourceSpan, 0), i = [], o = [], a = [], l = null, c = null; for (let p of n.children) {
    if (!(p instanceof ut))
        continue;
    if ((p.name !== "case" || p.parameters.length === 0) && p.name !== "default" && p.name !== "default never") {
        o.push(new Io(p.name, p.sourceSpan, p.nameSpan));
        continue;
    }
    c !== null && s.push(new N(p.sourceSpan, '@default block with "never" parameter must be the last case in a switch'));
    let m = p.name === "case", v = null;
    if (m)
        v = Bi(p.parameters[0], t);
    else if (p.name === "default never") {
        (p.children.length > 0 || p.endSourceSpan !== null && p.endSourceSpan.start.offset !== p.endSourceSpan.end.offset) && s.push(new N(p.sourceSpan, '@default block with "never" parameter cannot have a body')), a.length > 0 && s.push(new N(p.sourceSpan, 'A @case block with no body cannot be followed by a @default block with "never" parameter')), c = new Sl(p.sourceSpan, p.startSourceSpan, p.endSourceSpan, p.nameSpan);
        continue;
    }
    let w = new El(v, p.sourceSpan, p.startSourceSpan, p.endSourceSpan, p.nameSpan);
    if (a.push(w), p.children.length === 0 && p.endSourceSpan !== null && p.endSourceSpan.start.offset === p.endSourceSpan.end.offset) {
        l === null && (l = p.sourceSpan);
        continue;
    }
    let T = p.sourceSpan, A = p.startSourceSpan;
    l !== null && (T = new B(l.start, p.sourceSpan.end), A = new B(l.start, p.startSourceSpan.end), l = null);
    let R = new li(a, P(e, p.children, p.children), T, A, p.endSourceSpan, p.nameSpan, p.i18n);
    i.push(R), a = [];
} return { node: new bo(r, i, o, c, n.sourceSpan, n.startSourceSpan, n.endSourceSpan, n.nameSpan), errors: s }; }
function Vy(n, e, t) { if (n.parameters.length === 0)
    return e.push(new N(n.startSourceSpan, "@for loop does not have an expression")), null; let [s, ...r] = n.parameters, i = jy(s, e)?.match(Py); if (!i || i[2].trim().length === 0)
    return e.push(new N(s.sourceSpan, 'Cannot parse expression. @for loop expression must match the pattern "<identifier> of <expression>"')), null; let [, o, a] = i; Mr.has(o) && e.push(new N(s.sourceSpan, `@for loop item name cannot be one of ${Array.from(Mr).join(", ")}.`)); let l = s.expression.split(" ")[0], c = new B(s.sourceSpan.start, s.sourceSpan.start.moveBy(l.length)), h = { itemName: new bn(o, "$implicit", c, c), trackBy: null, expression: Bi(s, t, a), context: Array.from(Mr, p => { let m = new B(n.startSourceSpan.end, n.startSourceSpan.end); return new bn(p, p, m, m); }) }; for (let p of r) {
    let m = p.expression.match(My);
    if (m !== null) {
        let w = new B(p.sourceSpan.start.moveBy(m[0].length - m[1].length), p.sourceSpan.end);
        Uy(p.sourceSpan, m[1], w, o, h.context, e);
        continue;
    }
    let v = p.expression.match(Ly);
    if (v !== null) {
        if (h.trackBy !== null)
            e.push(new N(p.sourceSpan, '@for loop can only have one "track" expression'));
        else {
            let w = Bi(p, t, v[1]);
            w.ast instanceof Ne && e.push(new N(n.startSourceSpan, '@for loop must have a "track" expression'));
            let C = new B(p.sourceSpan.start, p.sourceSpan.start.moveBy(5));
            h.trackBy = { expression: w, keywordSpan: C };
        }
        continue;
    }
    e.push(new N(p.sourceSpan, `Unrecognized @for loop parameter "${p.expression}"`));
} return h; }
function qy(n, e, t) { let s = new fc; n.ast.visit(s), s.hasPipe && t.push(new N(e, "Cannot use pipes in track expressions")); }
function Uy(n, e, t, s, r, i) { let o = e.split(","), a = t.start; for (let l of o) {
    let c = l.split("="), h = c.length === 2 ? c[0].trim() : "", p = c.length === 2 ? c[1].trim() : "";
    if (h.length === 0 || p.length === 0)
        i.push(new N(n, 'Invalid @for loop "let" parameter. Parameter should match the pattern "<name> = <variable name>"'));
    else if (!Mr.has(p))
        i.push(new N(n, `Unknown "let" parameter variable "${p}". The allowed variables are: ${Array.from(Mr).join(", ")}`));
    else if (h === s)
        i.push(new N(n, `Invalid @for loop "let" parameter. Variable cannot be called "${s}"`));
    else if (r.some(m => m.name === h))
        i.push(new N(n, `Duplicate "let" parameter variable "${p}"`));
    else {
        let [, m, v] = c[0].match(Wh) ?? [], w = m !== void 0 && c.length === 2 ? new B(a.moveBy(m.length), a.moveBy(m.length + v.length)) : t, C;
        if (c.length === 2) {
            let [, A, R] = c[1].match(Wh) ?? [];
            C = A !== void 0 ? new B(a.moveBy(c[0].length + 1 + A.length), a.moveBy(c[0].length + 1 + A.length + R.length)) : void 0;
        }
        let T = new B(w.start, C?.end ?? w.end);
        r.push(new bn(h, p, T, w, C));
    }
    a = a.moveBy(l.length + 1);
} }
function Hy(n) { let e = [], t = !1; for (let s = 0; s < n.length; s++) {
    let r = n[s];
    r.name === "else" ? (t ? e.push(new N(r.startSourceSpan, "Conditional can only have one @else block")) : n.length > 1 && s < n.length - 1 ? e.push(new N(r.startSourceSpan, "@else block must be last inside the conditional")) : r.parameters.length > 0 && e.push(new N(r.startSourceSpan, "@else block cannot have parameters")), t = !0) : Ca.test(r.name) || e.push(new N(r.startSourceSpan, `Unrecognized conditional block @${r.name}`));
} return e; }
function Wy(n) { let e = [], t = !1; if (n.parameters.length !== 1)
    return e.push(new N(n.startSourceSpan, "@switch block must have exactly one parameter")), e; for (let s of n.children)
    if (!(s instanceof Mn || s instanceof ln && s.value.trim().length === 0)) {
        if (!(s instanceof ut) || s.name !== "case" && s.name !== "default" && s.name !== "default never") {
            e.push(new N(s.sourceSpan, "@switch block can only contain @case and @default blocks"));
            continue;
        }
        s.name === "default never" ? (t && e.push(new N(s.startSourceSpan, "@switch block can only have one @default block")), t = !0) : s.name === "default" ? (t ? e.push(new N(s.startSourceSpan, "@switch block can only have one @default block")) : s.parameters.length > 0 && e.push(new N(s.startSourceSpan, "@default block cannot have parameters")), t = !0) : s.name === "case" && s.parameters.length !== 1 && e.push(new N(s.startSourceSpan, "@case block must have exactly one parameter"));
    } return e; }
function Bi(n, e, t) { let s, r; return typeof t == "string" ? (s = Math.max(0, n.expression.lastIndexOf(t)), r = s + t.length) : (s = 0, r = n.expression.length), e.parseBinding(n.expression.slice(s, r), !1, n.sourceSpan, n.sourceSpan.start.offset + s); }
function Gh(n, e, t) { if (n.parameters.length === 0)
    return e.push(new N(n.startSourceSpan, "Conditional block does not have an expression")), null; let s = Bi(n.parameters[0], t), r = null; for (let i = 1; i < n.parameters.length; i++) {
    let o = n.parameters[i], a = o.expression.match(By);
    if (a === null)
        e.push(new N(o.sourceSpan, `Unrecognized conditional parameter "${o.expression}"`));
    else if (n.name !== "if" && !Ca.test(n.name))
        e.push(new N(o.sourceSpan, '"as" expression is only allowed on `@if` and `@else if` blocks'));
    else if (r !== null)
        e.push(new N(o.sourceSpan, 'Conditional can only have one "as" expression'));
    else {
        let l = a[2].trim();
        if (Ry.test(l)) {
            let c = o.sourceSpan.start.moveBy(a[1].length), h = new B(c, c.moveBy(l.length));
            r = new bn(l, l, h, h);
        }
        else
            e.push(new N(o.sourceSpan, '"as" expression must be a valid JavaScript identifier'));
    }
} return { expression: s, expressionAlias: r }; }
function jy(n, e) { let t = n.expression, s = /^\s$/, r = 0, i = 0, o = t.length - 1; for (let a = 0; a < t.length; a++) {
    let l = t[a];
    if (l === "(")
        i = a + 1, r++;
    else {
        if (s.test(l))
            continue;
        break;
    }
} if (r === 0)
    return t; for (let a = t.length - 1; a > -1; a--) {
    let l = t[a];
    if (l === ")") {
        if (o = a, r--, r === 0)
            break;
    }
    else {
        if (s.test(l))
            continue;
        break;
    }
} return r !== 0 ? (e.push(new N(n.sourceSpan, "Unclosed parentheses in expression")), null) : t.slice(i, o); }
var fc = class extends zs {
    hasPipe = !1;
    visitPipe() { this.hasPipe = !0; }
}, zy = /^\d+\.?\d*(ms|s)?$/, Gy = /^\s$/, Xh = new Map([[ht, Re], [Ot, Zt], [$e, ge]]), Fe = (function (n) { return n.IDLE = "idle", n.TIMER = "timer", n.INTERACTION = "interaction", n.IMMEDIATE = "immediate", n.HOVER = "hover", n.VIEWPORT = "viewport", n.NEVER = "never", n; })(Fe || {});
function Xy({ expression: n, sourceSpan: e }, t, s) { let r = n.indexOf("never"), i = new B(e.start.moveBy(r), e.start.moveBy(r + 5)), o = fu(n, e), a = du(n, e); r === -1 ? s.push(new N(e, 'Could not find "never" keyword in expression')) : mu("never", t, s, new ml(i, e, o, null, a)); }
function Oa({ expression: n, sourceSpan: e }, t, s, r) { let i = n.indexOf("when"), o = new B(e.start.moveBy(i), e.start.moveBy(i + 4)), a = fu(n, e), l = du(n, e); if (i === -1)
    r.push(new N(e, 'Could not find "when" keyword in expression'));
else {
    let c = Mi(n, i + 1), h = t.parseBinding(n.slice(c), !1, e, e.start.offset + c);
    mu("when", s, r, new Ao(h, e, a, o, l));
} }
function Va({ expression: n, sourceSpan: e }, t, s, r, i) { let o = n.indexOf("on"), a = new B(e.start.moveBy(o), e.start.moveBy(o + 2)), l = fu(n, e), c = du(n, e); if (o === -1)
    r.push(new N(e, 'Could not find "on" keyword in expression'));
else {
    let h = Mi(n, o + 1), p = n.startsWith("hydrate");
    new dc(n, t, h, e, s, r, p ? nC : tC, p, l, a, c).parse();
} }
function fu(n, e) { return n.startsWith("prefetch") ? new B(e.start, e.start.moveBy(8)) : null; }
function du(n, e) { return n.startsWith("hydrate") ? new B(e.start, e.start.moveBy(7)) : null; }
var dc = class {
    expression;
    bindingParser;
    start;
    span;
    triggers;
    errors;
    validator;
    isHydrationTrigger;
    prefetchSpan;
    onSourceSpan;
    hydrateSpan;
    index = 0;
    tokens;
    constructor(e, t, s, r, i, o, a, l, c, h, p) { this.expression = e, this.bindingParser = t, this.start = s, this.span = r, this.triggers = i, this.errors = o, this.validator = a, this.isHydrationTrigger = l, this.prefetchSpan = c, this.onSourceSpan = h, this.hydrateSpan = p, this.tokens = new Di().tokenize(e.slice(s)); }
    parse() { for (; this.tokens.length > 0 && this.index < this.tokens.length;) {
        let e = this.token();
        if (!e.isIdentifier()) {
            this.unexpectedToken(e);
            break;
        }
        if (this.isFollowedByOrLast(De))
            this.consumeTrigger(e, []), this.advance();
        else if (this.isFollowedByOrLast($e)) {
            this.advance();
            let t = this.errors.length, s = this.consumeParameters();
            if (this.errors.length !== t)
                break;
            this.consumeTrigger(e, s), this.advance();
        }
        else
            this.index < this.tokens.length - 1 && this.unexpectedToken(this.tokens[this.index + 1]);
        this.advance();
    } }
    advance() { this.index++; }
    isFollowedByOrLast(e) { return this.index === this.tokens.length - 1 ? !0 : this.tokens[this.index + 1].isCharacter(e); }
    token() { return this.tokens[Math.min(this.index, this.tokens.length - 1)]; }
    consumeTrigger(e, t) { let s = this.span.start.moveBy(this.start + e.index - this.tokens[0].index), r = new B(s, s.moveBy(e.strValue.length)), i = s.moveBy(this.token().end - e.index), o = e.index === 0, a = o ? this.onSourceSpan : null, l = o ? this.prefetchSpan : null, c = o ? this.hydrateSpan : null, h = new B(o ? this.span.start : s, i); try {
        switch (e.toString()) {
            case Fe.IDLE:
                this.trackTrigger("idle", Yy(t, r, h, l, a, c));
                break;
            case Fe.TIMER:
                this.trackTrigger("timer", Qy(t, r, h, this.prefetchSpan, this.onSourceSpan, this.hydrateSpan));
                break;
            case Fe.INTERACTION:
                this.trackTrigger("interaction", Ky(t, r, h, this.prefetchSpan, this.onSourceSpan, this.hydrateSpan, this.validator));
                break;
            case Fe.IMMEDIATE:
                this.trackTrigger("immediate", Zy(t, r, h, this.prefetchSpan, this.onSourceSpan, this.hydrateSpan));
                break;
            case Fe.HOVER:
                this.trackTrigger("hover", Jy(t, r, h, this.prefetchSpan, this.onSourceSpan, this.hydrateSpan, this.validator));
                break;
            case Fe.VIEWPORT:
                this.trackTrigger("viewport", eC(this.start, this.isHydrationTrigger, this.bindingParser, t, r, h, this.prefetchSpan, this.onSourceSpan, this.hydrateSpan, this.validator));
                break;
            default: throw new Error(`Unrecognized trigger type "${e}"`);
        }
    }
    catch (p) {
        this.error(e, p.message);
    } }
    consumeParameters() { let e = []; if (!this.token().isCharacter($e))
        return this.unexpectedToken(this.token()), e; this.advance(); let t = [], s = []; for (; this.index < this.tokens.length;) {
        let r = this.token();
        if (r.isCharacter(ge) && t.length === 0) {
            s.length && e.push({ expression: this.tokenRangeText(s), start: s[0].index });
            break;
        }
        if (r.type === L.Character && Xh.has(r.numValue) && t.push(Xh.get(r.numValue)), t.length > 0 && r.isCharacter(t[t.length - 1]) && t.pop(), t.length === 0 && r.isCharacter(De) && s.length > 0) {
            e.push({ expression: this.tokenRangeText(s), start: s[0].index }), this.advance(), s = [];
            continue;
        }
        s.push(r), this.advance();
    } return (!this.token().isCharacter(ge) || t.length > 0) && this.error(this.token(), "Unexpected end of expression"), this.index < this.tokens.length - 1 && !this.tokens[this.index + 1].isCharacter(De) && this.unexpectedToken(this.tokens[this.index + 1]), e; }
    tokenRangeText(e) { return e.length === 0 ? "" : this.expression.slice(this.start + e[0].index, this.start + e[e.length - 1].end); }
    trackTrigger(e, t) { mu(e, this.triggers, this.errors, t); }
    error(e, t) { let s = this.span.start.moveBy(this.start + e.index), r = s.moveBy(e.end - e.index); this.errors.push(new N(new B(s, r), t)); }
    unexpectedToken(e) { this.error(e, `Unexpected token "${e}"`); }
};
function mu(n, e, t, s) { e[n] ? t.push(new N(s.sourceSpan, `Duplicate "${n}" trigger is not allowed`)) : e[n] = s; }
function Yy(n, e, t, s, r, i) { if (n.length > 0)
    throw new Error(`"${Fe.IDLE}" trigger cannot have parameters`); return new gl(e, t, s, r, i); }
function Qy(n, e, t, s, r, i) { if (n.length !== 1)
    throw new Error(`"${Fe.TIMER}" trigger must have exactly one parameter`); let o = ia(n[0].expression); if (o === null)
    throw new Error(`Could not parse time value of trigger "${Fe.TIMER}"`); return new wl(o, e, t, s, r, i); }
function Zy(n, e, t, s, r, i) { if (n.length > 0)
    throw new Error(`"${Fe.IMMEDIATE}" trigger cannot have parameters`); return new vl(e, t, s, r, i); }
function Jy(n, e, t, s, r, i, o) { return o(Fe.HOVER, n), new ko(n[0]?.expression ?? null, e, t, s, r, i); }
function Ky(n, e, t, s, r, i, o) { return o(Fe.INTERACTION, n), new _o(n[0]?.expression ?? null, e, t, s, r, i); }
function eC(n, e, t, s, r, i, o, a, l, c) { c(Fe.VIEWPORT, s); let h, p; if (s.length === 0)
    h = p = null;
else if (!s[0].expression.startsWith("{"))
    h = s[0].expression, p = null;
else {
    let m = t.parseBinding(s[0].expression, !1, i, i.start.offset + n + s[0].start);
    if (m.ast instanceof ps) {
        if (m.ast.keys.some(w => w.kind === "spread"))
            throw new Error("Spread operator are not allowed in this context");
        if (m.ast.keys.some(w => w.kind === "property" && w.key === "root"))
            throw new Error('The "root" option is not supported in the options parameter of the "viewport" trigger');
    }
    else
        throw new Error('Options parameter of the "viewport" trigger must be an object literal');
    let v = m.ast.keys.findIndex(w => w.kind === "property" && w.key === "trigger");
    if (v === -1)
        h = null, p = m.ast;
    else {
        let w = m.ast.values[v], C = (T, A) => A !== v;
        if (!(w instanceof $t) || !(w.receiver instanceof Ut))
            throw new Error('"trigger" option of the "viewport" trigger must be an identifier');
        h = w.name, p = new ps(m.ast.span, m.ast.sourceSpan, m.ast.keys.filter(C), m.ast.values.filter(C));
    }
} if (e && h !== null)
    throw new Error('"viewport" hydration trigger cannot have a "trigger"'); if (p) {
    let m = mc.findDynamicNode(p);
    if (m !== null)
        throw new Error(`Options of the "viewport" trigger must be an object literal containing only literal values, but "${m.constructor.name}" was found`);
} return new ri(h, p, r, i, o, a, l); }
function tC(n, e) { if (e.length > 1)
    throw new Error(`"${n}" trigger can only have zero or one parameters`); }
function nC(n, e) { if (n === Fe.VIEWPORT) {
    if (e.length > 1)
        throw new Error(`Hydration trigger "${n}" cannot have more than one parameter`);
    return;
} if (e.length > 0)
    throw new Error(`Hydration trigger "${n}" cannot have parameters`); }
function Mi(n, e = 0) { let t = !1; for (let s = e; s < n.length; s++)
    if (Gy.test(n[s]))
        t = !0;
    else if (t)
        return s; return -1; }
function ia(n) { let e = n.match(zy); if (!e)
    return null; let [t, s] = e; return parseFloat(t) * (s === "s" ? 1e3 : 1); }
var mc = class n extends zs {
    dynamicNode = null;
    static findDynamicNode(e) { let t = new n; return t.visit(e), t.dynamicNode; }
    visit(e) { !(e instanceof ze) && !(e instanceof We) && !(e instanceof Yr) && !(e instanceof ps) ? this.dynamicNode = e : super.visit(e); }
}, sC = /^prefetch\s+when\s/, rC = /^prefetch\s+on\s/, iC = /^hydrate\s+when\s/, oC = /^hydrate\s+on\s/, aC = /^hydrate\s+never(\s*)$/, id = /^minimum\s/, lC = /^after\s/, cC = /^when\s/, uC = /^on\s/;
function gc(n) { return n === "placeholder" || n === "loading" || n === "error"; }
function hC(n, e, t, s) { let r = [], { placeholder: i, loading: o, error: a } = pC(e, r, t), { triggers: l, prefetchTriggers: c, hydrateTriggers: h } = gC(n, s, r), p = n.endSourceSpan, m = n.sourceSpan.end; if (e.length > 0) {
    let C = e[e.length - 1];
    p = C.endSourceSpan, m = C.sourceSpan.end;
} let v = new B(n.sourceSpan.start, m); return { node: new fs(P(t, n.children, n.children), l, c, h, i, o, a, n.nameSpan, v, n.sourceSpan, n.startSourceSpan, p, n.i18n), errors: r }; }
function pC(n, e, t) { let s = null, r = null, i = null; for (let o of n)
    try {
        if (!gc(o.name)) {
            e.push(new N(o.startSourceSpan, `Unrecognized block "@${o.name}"`));
            break;
        }
        switch (o.name) {
            case "placeholder":
                s !== null ? e.push(new N(o.startSourceSpan, "@defer block can only have one @placeholder block")) : s = fC(o, t);
                break;
            case "loading":
                r !== null ? e.push(new N(o.startSourceSpan, "@defer block can only have one @loading block")) : r = dC(o, t);
                break;
            case "error":
                i !== null ? e.push(new N(o.startSourceSpan, "@defer block can only have one @error block")) : i = mC(o, t);
                break;
        }
    }
    catch (a) {
        e.push(new N(o.startSourceSpan, a.message));
    } return { placeholder: s, loading: r, error: i }; }
function fC(n, e) { let t = null; for (let s of n.parameters)
    if (id.test(s.expression)) {
        if (t != null)
            throw new Error('@placeholder block can only have one "minimum" parameter');
        let r = ia(s.expression.slice(Mi(s.expression)));
        if (r === null)
            throw new Error('Could not parse time value of parameter "minimum"');
        t = r;
    }
    else
        throw new Error(`Unrecognized parameter in @placeholder block: "${s.expression}"`); return new ii(P(e, n.children, n.children), t, n.nameSpan, n.sourceSpan, n.startSourceSpan, n.endSourceSpan, n.i18n); }
function dC(n, e) { let t = null, s = null; for (let r of n.parameters)
    if (lC.test(r.expression)) {
        if (t != null)
            throw new Error('@loading block can only have one "after" parameter');
        let i = ia(r.expression.slice(Mi(r.expression)));
        if (i === null)
            throw new Error('Could not parse time value of parameter "after"');
        t = i;
    }
    else if (id.test(r.expression)) {
        if (s != null)
            throw new Error('@loading block can only have one "minimum" parameter');
        let i = ia(r.expression.slice(Mi(r.expression)));
        if (i === null)
            throw new Error('Could not parse time value of parameter "minimum"');
        s = i;
    }
    else
        throw new Error(`Unrecognized parameter in @loading block: "${r.expression}"`); return new oi(P(e, n.children, n.children), t, s, n.nameSpan, n.sourceSpan, n.startSourceSpan, n.endSourceSpan, n.i18n); }
function mC(n, e) { if (n.parameters.length > 0)
    throw new Error("@error block cannot have parameters"); return new ai(P(e, n.children, n.children), n.nameSpan, n.sourceSpan, n.startSourceSpan, n.endSourceSpan, n.i18n); }
function gC(n, e, t, s) { let r = {}, i = {}, o = {}; for (let a of n.parameters)
    cC.test(a.expression) ? Oa(a, e, r, t) : uC.test(a.expression) ? Va(a, e, r, t) : sC.test(a.expression) ? Oa(a, e, i, t) : rC.test(a.expression) ? Va(a, e, i, t) : iC.test(a.expression) ? Oa(a, e, o, t) : oC.test(a.expression) ? Va(a, e, o, t) : aC.test(a.expression) ? Xy(a, o, t) : t.push(new N(a.sourceSpan, "Unrecognized trigger")); return o.never && Object.keys(o).length > 1 && t.push(new N(n.startSourceSpan, "Cannot specify additional `hydrate` triggers if `hydrate never` is present")), { triggers: r, prefetchTriggers: i, hydrateTriggers: o }; }
var vC = /^(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.*)$/, Yh = 1, Qh = 2, Zh = 3, Jh = 4, Kh = 5, wC = 6, Sr = 7, pn = { BANANA_BOX: { start: "[(", end: ")]" }, PROPERTY: { start: "[", end: "]" }, EVENT: { start: "(", end: ")" } }, qa = "*", EC = new Set(["link", "style", "script", "ng-template", "ng-container", "ng-content"]), SC = new Set(["ngProjectAs", "ngNonBindable"]);
function xC(n, e, t) { let s = new vc(e, t), r = P(s, n, n), i = e.errors.concat(s.errors), o = { nodes: r, errors: i, styleUrls: s.styleUrls, styles: s.styles, ngContentSelectors: s.ngContentSelectors }; return t.collectCommentNodes && (o.commentNodes = s.commentNodes), o; }
var vc = class {
    bindingParser;
    options;
    errors = [];
    styles = [];
    styleUrls = [];
    ngContentSelectors = [];
    commentNodes = [];
    inI18nBlock = !1;
    processedNodes = new Set;
    constructor(e, t) { this.bindingParser = e, this.options = t; }
    visitElement(e) { let t = io(e.i18n); t && (this.inI18nBlock && this.reportError("Cannot mark an element as translatable inside of a translatable section. Please remove the nested i18n marker.", e.sourceSpan), this.inI18nBlock = !0); let s = rd(e); if (s.type === et.SCRIPT)
        return null; if (s.type === et.STYLE) {
        let A = yC(e);
        return A !== null && this.styles.push(A), null;
    }
    else if (s.type === et.STYLESHEET && Sy(s.hrefAttr))
        return this.styleUrls.push(s.hrefAttr), null; let r = km(e.name), { attributes: i, boundEvents: o, references: a, variables: l, templateVariables: c, elementHasInlineTemplate: h, parsedProperties: p, templateParsedProperties: m, i18nAttrsMeta: v } = this.prepareAttributes(e.attrs, r), w = this.extractDirectives(e), C; s.nonBindable ? C = P(ep, e.children).flat(1 / 0) : C = P(this, e.children, e.children); let T; if (s.type === et.NG_CONTENT) {
        let A = s.selectAttr, R = e.attrs.map(se => this.visitAttribute(se));
        T = new Qs(A, R, C, e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.i18n), this.ngContentSelectors.push(A);
    }
    else if (r) {
        let A = this.categorizePropertyAttributes(e.name, p, v);
        T = new st(e.name, i, A.bound, o, w, [], C, a, l, e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.i18n);
    }
    else {
        let A = this.categorizePropertyAttributes(e.name, p, v);
        if (e.name === "ng-container")
            for (let R of A.bound)
                R.type === X.Attribute && this.reportError("Attribute bindings are not supported on ng-container. Use property bindings instead.", R.sourceSpan);
        T = new Ht(e.name, i, A.bound, o, w, C, a, e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.isVoid, e.i18n);
    } return h && (T = this.wrapInTemplate(T, m, c, v, r, t)), t && (this.inI18nBlock = !1), T; }
    visitAttribute(e) { return new Xs(e.name, e.value, e.sourceSpan, e.keySpan, e.valueSpan, e.i18n); }
    visitText(e) { return this.processedNodes.has(e) ? null : this._visitTextWithInterpolation(e.value, e.sourceSpan, e.tokens, e.i18n); }
    visitExpansion(e) { if (!e.i18n)
        return null; if (!io(e.i18n))
        throw new Error(`Invalid type "${e.i18n.constructor}" for "i18n" property of ${e.sourceSpan.toString()}. Expected a "Message"`); let t = e.i18n, s = {}, r = {}; return Object.keys(t.placeholders).forEach(i => { let o = t.placeholders[i]; if (i.startsWith(Rm)) {
        let a = i.trim(), l = this.bindingParser.parseInterpolationExpression(o.text, o.sourceSpan);
        s[a] = new Gs(l, o.sourceSpan);
    }
    else
        r[i] = this._visitTextWithInterpolation(o.text, o.sourceSpan, null); }), new Vp(s, r, e.sourceSpan, t); }
    visitExpansionCase(e) { return null; }
    visitComment(e) { return this.options.collectCommentNodes && this.commentNodes.push(new va(e.value || "", e.sourceSpan)), null; }
    visitLetDeclaration(e, t) { let s = this.bindingParser.parseBinding(e.value, !1, e.valueSpan, e.valueSpan.start.offset); return s.errors.length === 0 && s.ast instanceof Ne && this.reportError("@let declaration value cannot be empty", e.valueSpan), new Yc(e.name, s, e.sourceSpan, e.nameSpan, e.valueSpan); }
    visitComponent(e) { let t = io(e.i18n); if (t && (this.inI18nBlock && this.reportError("Cannot mark a component as translatable inside of a translatable section. Please remove the nested i18n marker.", e.sourceSpan), this.inI18nBlock = !0), e.tagName !== null && EC.has(e.tagName))
        return this.reportError(`Tag name "${e.tagName}" cannot be used as a component tag`, e.startSourceSpan), null; let { attributes: s, boundEvents: r, references: i, templateVariables: o, elementHasInlineTemplate: a, parsedProperties: l, templateParsedProperties: c, i18nAttrsMeta: h } = this.prepareAttributes(e.attrs, !1); this.validateSelectorlessReferences(i); let p = this.extractDirectives(e), m; e.attrs.find(C => C.name === "ngNonBindable") ? m = P(ep, e.children).flat(1 / 0) : m = P(this, e.children, e.children); let v = this.categorizePropertyAttributes(e.tagName, l, h), w = new Tr(e.componentName, e.tagName, e.fullName, s, v.bound, r, p, m, i, e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.i18n); return a && (w = this.wrapInTemplate(w, c, o, h, !1, t)), t && (this.inI18nBlock = !1), w; }
    visitDirective() { return null; }
    visitBlockParameter() { return null; }
    visitBlock(e, t) { let s = Array.isArray(t) ? t.indexOf(e) : -1; if (s === -1)
        throw new Error("Visitor invoked incorrectly. Expecting visitBlock to be invoked siblings array as its context"); if (this.processedNodes.has(e))
        return null; let r = null; switch (e.name) {
        case "defer":
            r = hC(e, this.findConnectedBlocks(s, t, gc), this, this.bindingParser);
            break;
        case "switch":
            r = Oy(e, this, this.bindingParser);
            break;
        case "for":
            r = $y(e, this.findConnectedBlocks(s, t, jh), this, this.bindingParser);
            break;
        case "if":
            r = Fy(e, this.findConnectedBlocks(s, t, zh), this, this.bindingParser);
            break;
        default:
            let i;
            gc(e.name) ? (i = `@${e.name} block can only be used after an @defer block.`, this.processedNodes.add(e)) : jh(e.name) ? (i = `@${e.name} block can only be used after an @for block.`, this.processedNodes.add(e)) : zh(e.name) ? (i = `@${e.name} block can only be used after an @if or @else if block.`, this.processedNodes.add(e)) : i = `Unrecognized block @${e.name}.`, r = { node: new Io(e.name, e.sourceSpan, e.nameSpan), errors: [new N(e.sourceSpan, i)] };
            break;
    } return this.errors.push(...r.errors), r.node; }
    findConnectedBlocks(e, t, s) { let r = []; for (let i = e + 1; i < t.length; i++) {
        let o = t[i];
        if (!(o instanceof Mn)) {
            if (o instanceof ln && o.value.trim().length === 0) {
                this.processedNodes.add(o);
                continue;
            }
            if (!(o instanceof ut) || !s(o.name))
                break;
            r.push(o), this.processedNodes.add(o);
        }
    } return r; }
    categorizePropertyAttributes(e, t, s) { let r = [], i = []; return t.forEach(o => { let a = s[o.name]; if (o.isLiteral)
        i.push(new Xs(o.name, o.expression.source || "", o.sourceSpan, o.keySpan, o.valueSpan, a));
    else {
        let l = this.bindingParser.createBoundElementProperty(e, o, !0, !1);
        r.push(fl.fromBoundElementProperty(l, a));
    } }), { bound: r, literal: i }; }
    prepareAttributes(e, t) { let s = [], r = [], i = [], o = [], a = [], l = {}, c = [], h = [], p = !1; for (let m of e) {
        let v = !1, w = tp(m.name), C = !1;
        if (m.i18n && (l[m.name] = m.i18n), w.startsWith(qa)) {
            p && this.reportError("Can't have multiple template bindings on one element. Use only one attribute prefixed with *", m.sourceSpan), C = !0, p = !0;
            let T = m.value, A = w.substring(qa.length), R = [], se = m.valueSpan ? m.valueSpan.fullStart.offset : m.sourceSpan.fullStart.offset + m.name.length;
            this.bindingParser.parseInlineTemplateBinding(A, T, m.sourceSpan, se, [], c, R, !0), h.push(...R.map(O => new bn(O.name, O.value, O.sourceSpan, O.keySpan, O.valueSpan)));
        }
        else
            v = this.parseAttribute(t, m, [], s, r, i, o);
        !v && !C && a.push(this.visitAttribute(m));
    } return { attributes: a, boundEvents: r, references: o, variables: i, templateVariables: h, elementHasInlineTemplate: p, parsedProperties: s, templateParsedProperties: c, i18nAttrsMeta: l }; }
    parseAttribute(e, t, s, r, i, o, a) { let l = tp(t.name), c = t.value, h = t.sourceSpan, p = t.valueSpan ? t.valueSpan.fullStart.offset : h.fullStart.offset; function m(A, R, se) { let O = t.name.length - l.length, xt = A.start.moveBy(R.length + O), hr = xt.moveBy(se.length); return new B(xt, hr, xt, se); } let v = l.match(vC); if (v) {
        if (v[Yh] != null) {
            let A = v[Sr], R = m(h, v[Yh], A);
            this.bindingParser.parsePropertyBinding(A, c, !1, !1, h, p, t.valueSpan, s, r, R);
        }
        else if (v[Qh])
            if (e) {
                let A = v[Sr], R = m(h, v[Qh], A);
                this.parseVariable(A, c, h, R, t.valueSpan, o);
            }
            else
                this.reportError('"let-" is only supported on ng-template elements.', h);
        else if (v[Zh]) {
            let A = v[Sr], R = m(h, v[Zh], A);
            this.parseReference(A, c, h, R, t.valueSpan, a);
        }
        else if (v[Jh]) {
            let A = [], R = v[Sr], se = m(h, v[Jh], R);
            this.bindingParser.parseEvent(R, c, !1, h, t.valueSpan || h, s, A, se), Ua(A, i);
        }
        else if (v[Kh]) {
            let A = v[Sr], R = m(h, v[Kh], A);
            this.bindingParser.parsePropertyBinding(A, c, !1, !0, h, p, t.valueSpan, s, r, R), this.parseAssignmentEvent(A, c, h, t.valueSpan, s, i, R, p);
        }
        else if (v[wC]) {
            let A = m(h, "", l);
            this.bindingParser.parseLiteralAttr(l, c, h, p, t.valueSpan, s, r, A);
        }
        return !0;
    } let w = null; if (l.startsWith(pn.BANANA_BOX.start) ? w = pn.BANANA_BOX : l.startsWith(pn.PROPERTY.start) ? w = pn.PROPERTY : l.startsWith(pn.EVENT.start) && (w = pn.EVENT), w !== null && l.endsWith(w.end) && l.length > w.start.length + w.end.length) {
        let A = l.substring(w.start.length, l.length - w.end.length), R = m(h, w.start, A);
        if (w.start === pn.BANANA_BOX.start)
            this.bindingParser.parsePropertyBinding(A, c, !1, !0, h, p, t.valueSpan, s, r, R), this.parseAssignmentEvent(A, c, h, t.valueSpan, s, i, R, p);
        else if (w.start === pn.PROPERTY.start)
            this.bindingParser.parsePropertyBinding(A, c, !1, !1, h, p, t.valueSpan, s, r, R);
        else {
            let se = [];
            this.bindingParser.parseEvent(A, c, !1, h, t.valueSpan || h, s, se, R), Ua(se, i);
        }
        return !0;
    } let C = m(h, "", l); return this.bindingParser.parsePropertyInterpolation(l, c, h, t.valueSpan, s, r, C, t.valueTokens ?? null); }
    extractDirectives(e) { let t = e instanceof Ae ? e.tagName : e.name, s = [], r = new Set; for (let i of e.directives) {
        let o = !1;
        for (let v of i.attrs)
            v.name.startsWith(qa) ? (o = !0, this.reportError(`Shorthand template syntax "${v.name}" is not supported inside a directive context`, v.sourceSpan)) : SC.has(v.name) && (o = !0, this.reportError(`Attribute "${v.name}" is not supported in a directive context`, v.sourceSpan));
        if (!o && r.has(i.name) && (o = !0, this.reportError(`Cannot apply directive "${i.name}" multiple times on the same element`, i.sourceSpan)), o)
            continue;
        let { attributes: a, parsedProperties: l, boundEvents: c, references: h, i18nAttrsMeta: p } = this.prepareAttributes(i.attrs, !1);
        this.validateSelectorlessReferences(h);
        let { bound: m } = this.categorizePropertyAttributes(t, l, p);
        for (let v of m)
            v.type !== X.Property && v.type !== X.TwoWay && (o = !0, this.reportError("Binding is not supported in a directive context", v.sourceSpan));
        o || (r.add(i.name), s.push(new Op(i.name, a, m, c, h, i.sourceSpan, i.startSourceSpan, i.endSourceSpan, void 0)));
    } return s; }
    filterAnimationAttributes(e) { return e.filter(t => !t.name.startsWith("animate.")); }
    filterAnimationInputs(e) { return e.filter(t => t.type !== X.Animation); }
    wrapInTemplate(e, t, s, r, i, o) { let a = this.categorizePropertyAttributes("ng-template", t, r), l = []; a.literal.forEach(m => l.push(m)), a.bound.forEach(m => l.push(m)); let c = { attributes: [], inputs: [], outputs: [] }; (e instanceof Ht || e instanceof Tr) && (c.attributes.push(...this.filterAnimationAttributes(e.attributes)), c.inputs.push(...this.filterAnimationInputs(e.inputs)), c.outputs.push(...e.outputs)); let h = i && o ? void 0 : e.i18n, p; return e instanceof Tr ? p = e.tagName : e instanceof st ? p = null : p = e.name, new st(p, c.attributes, c.inputs, c.outputs, [], l, [e], [], s, !1, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, h); }
    _visitTextWithInterpolation(e, t, s, r) { let i = Bf(e), o = this.bindingParser.parseInterpolation(i, t, s); return o ? new Gs(o, t, r) : new Yn(i, t); }
    parseVariable(e, t, s, r, i, o) { e.indexOf("-") > -1 ? this.reportError('"-" is not allowed in variable names', s) : e.length === 0 && this.reportError("Variable does not have a name", s), o.push(new bn(e, t, s, r, i)); }
    parseReference(e, t, s, r, i, o) { e.indexOf("-") > -1 ? this.reportError('"-" is not allowed in reference names', s) : e.length === 0 ? this.reportError("Reference does not have a name", s) : o.some(a => a.name === e) && this.reportError(`Reference "#${e}" is defined more than once`, s), o.push(new ui(e, t, s, r, i)); }
    parseAssignmentEvent(e, t, s, r, i, o, a, l) { let c = []; this.bindingParser.parseEvent(`${e}Change`, t, !0, s, r || s, i, c, a), Ua(c, o); }
    validateSelectorlessReferences(e) { if (e.length === 0)
        return; let t = new Set; for (let s of e)
        s.value.length > 0 ? this.reportError("Cannot specify a value for a local reference in this context", s.valueSpan || s.sourceSpan) : t.has(s.name) ? this.reportError("Duplicate reference names are not allowed", s.sourceSpan) : t.add(s.name); }
    reportError(e, t, s = vn.ERROR) { this.errors.push(new N(t, e, s)); }
}, wc = class {
    visitElement(e) { let t = rd(e); if (t.type === et.SCRIPT || t.type === et.STYLE || t.type === et.STYLESHEET)
        return null; let s = P(this, e.children, null); return new Ht(e.name, P(this, e.attrs), [], [], [], s, [], e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.isVoid); }
    visitComment(e) { return null; }
    visitAttribute(e) { return new Xs(e.name, e.value, e.sourceSpan, e.keySpan, e.valueSpan, e.i18n); }
    visitText(e) { return new Yn(e.value, e.sourceSpan); }
    visitExpansion(e) { return null; }
    visitExpansionCase(e) { return null; }
    visitBlock(e, t) { let s = [new Yn(e.startSourceSpan.toString(), e.startSourceSpan), ...P(this, e.children)]; return e.endSourceSpan !== null && s.push(new Yn(e.endSourceSpan.toString(), e.endSourceSpan)), s; }
    visitBlockParameter(e, t) { return null; }
    visitLetDeclaration(e, t) { return new Yn(`@let ${e.name} = ${e.value};`, e.sourceSpan); }
    visitComponent(e, t) { let s = P(this, e.children, null); return new Ht(e.fullName, P(this, e.attrs), [], [], [], s, [], e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, !1); }
    visitDirective(e, t) { return null; }
}, ep = new wc;
function tp(n) { return /^data-/i.test(n) ? n.substring(5) : n; }
function Ua(n, e) { e.push(...n.map(t => dl.fromParsedEvent(t))); }
function yC(n) { return n.children.length !== 1 || !(n.children[0] instanceof ln) ? null : n.children[0].value; }
var CC = [" ", `
`, "\r", "	"];
function od(n, e, t = {}) { let { preserveWhitespaces: s, enableI18nLegacyMessageIdFormat: r } = t, i = t.enableSelectorless ?? !1, o = oa(i), l = new ra().parse(n, e, pe(S({ leadingTriviaChars: CC }, t), { tokenizeExpansionForms: !0, tokenizeBlocks: t.enableBlockSyntax ?? !0, tokenizeLet: t.enableLetSyntax ?? !0, selectorlessEnabled: i })); if (!t.alwaysAttemptHtmlToR3AstConversion && l.errors && l.errors.length > 0) {
    let O = { preserveWhitespaces: s, errors: l.errors, nodes: [], styleUrls: [], styles: [], ngContentSelectors: [] };
    return t.collectCommentNodes && (O.commentNodes = []), O;
} let c = l.rootNodes, h = !(t.preserveSignificantWhitespace ?? !0), p = new Ko(!s, r, t.preserveSignificantWhitespace, h), m = p.visitAllWithErrors(c); if (!t.alwaysAttemptHtmlToR3AstConversion && m.errors && m.errors.length > 0) {
    let O = { preserveWhitespaces: s, errors: m.errors, nodes: [], styleUrls: [], styles: [], ngContentSelectors: [] };
    return t.collectCommentNodes && (O.commentNodes = []), O;
} c = m.rootNodes, s || (c = P(new Ni(!0, void 0, !1), c), p.hasI18nMeta && (c = P(new Ko(!1, void 0, !0, h), c))); let { nodes: v, errors: w, styleUrls: C, styles: T, ngContentSelectors: A, commentNodes: R } = xC(c, o, { collectCommentNodes: !!t.collectCommentNodes }); w.push(...l.errors, ...m.errors); let se = { preserveWhitespaces: s, errors: w.length > 0 ? w : null, nodes: v, styleUrls: C, styles: T, ngContentSelectors: A }; return t.collectCommentNodes && (se.commentNodes = R), se; }
var AC = new sr;
function oa(n = !1) { return new uc(new Jo(new Di, n), AC, []); }
var aa = "%COMP%", Ec = `_nghost-${aa}`, Sc = `_ngcontent-${aa}`;
function ad(n, e, t) { let s = new ae, r = da(n.selector); return s.set("type", n.type.value), r.length > 0 && s.set("selectors", Ve(r)), n.queries.length > 0 && s.set("contentQueries", my(n.queries, e, n.name)), n.viewQueries.length && s.set("viewQuery", dy(n.viewQueries, e, n.name)), s.set("hostBindings", NC(n.host, n.typeSourceSpan, t, e, n.selector || "", n.name, s)), s.set("inputs", Tl(n.inputs, !0)), s.set("outputs", Tl(n.outputs)), n.exportAs !== null && s.set("exportAs", q(n.exportAs.map(i => d(i)))), n.isStandalone === !1 && s.set("standalone", d(!1)), n.isSignal && s.set("signals", d(!0)), s; }
function ld(n, e) { let t = [], s = e.providers, r = e.viewProviders; if (s || r) {
    let i = [s || new Tt([])];
    r && i.push(r), t.push(y(f.ProvidersFeature).callFn(i));
} if (e.hostDirectives?.length && t.push(y(f.HostDirectivesFeature).callFn([BC(e.hostDirectives)])), e.usesInheritance && t.push(y(f.InheritDefinitionFeature)), e.lifecycle.usesOnChanges && t.push(y(f.NgOnChangesFeature)), e.controlCreate !== null && t.push(y(f.ControlFeature).callFn([d(e.controlCreate.passThroughInput)])), "externalStyles" in e && e.externalStyles?.length) {
    let i = e.externalStyles.map(o => d(o));
    t.push(y(f.ExternalStylesFeature).callFn([q(i)]));
} t.length && n.set("features", q(t)); }
function kC(n, e, t) { let s = ad(n, e, t); ld(s, n); let r = y(f.defineDirective).callFn([s.toLiteralMap()], void 0, !0), i = hd(n); return { expression: r, type: i, statements: [] }; }
function _C(n, e, t) { let s = ad(n, e, t); ld(s, n); let r = n.selector && is.parse(n.selector), i = r && r[0]; if (i) {
    let w = i.getAttrs();
    w.length && s.set("attrs", e.getConstLiteral(q(w.map(C => C != null ? d(C) : d(void 0))), !0));
} let o = n.name, a = null; if (n.defer.mode === 1 && n.defer.dependenciesFn !== null) {
    let w = `${o}_DeferFn`;
    e.statements.push(new he(w, n.defer.dependenciesFn, void 0, ue.Final)), a = D(w);
} let l = n.isStandalone && !n.hasDirectiveDependencies ? He.DomOnly : He.Full, c = W2(n.name, n.template.nodes, e, l, n.relativeContextFilePath, n.i18nUseExternalIds, n.defer, a, n.relativeTemplatePath, hy()); Gf(c, k.Tmpl); let h = V2(c, e); if (c.contentSelectors !== null && s.set("ngContentSelectors", c.contentSelectors), s.set("decls", d(c.root.decls)), s.set("vars", d(c.root.vars)), c.consts.length > 0 && (c.constsInitializers.length > 0 ? s.set("consts", ie([], [...c.constsInitializers, new me(q(c.consts))])) : s.set("consts", q(c.consts))), s.set("template", h), n.declarationListEmitMode !== 3 && n.declarations.length > 0)
    s.set("dependencies", bC(q(n.declarations.map(w => w.type)), n.declarationListEmitMode));
else if (n.declarationListEmitMode === 3) {
    let w = [n.type.value];
    n.rawImports && w.push(n.rawImports), s.set("dependencies", y(f.getComponentDepsFactory).callFn(w));
} n.encapsulation === null && (n.encapsulation = Ct.Emulated); let p = !!n.externalStyles?.length; if (n.styles && n.styles.length) {
    let C = (n.encapsulation == Ct.Emulated ? LC(n.styles, Sc, Ec) : n.styles).reduce((T, A) => (A.trim().length > 0 && T.push(e.getConstLiteral(d(A))), T), []);
    C.length > 0 && (p = !0, s.set("styles", q(C)));
} !p && n.encapsulation === Ct.Emulated && (n.encapsulation = Ct.None), n.encapsulation !== Ct.Emulated && s.set("encapsulation", d(n.encapsulation)), n.animations !== null && s.set("data", ye([{ key: "animation", value: n.animations, quoted: !1 }])), n.changeDetection !== null && (typeof n.changeDetection == "number" && n.changeDetection !== Ri.Default ? s.set("changeDetection", d(n.changeDetection)) : typeof n.changeDetection == "object" && s.set("changeDetection", n.changeDetection)); let m = y(f.defineComponent).callFn([s.toLiteralMap()], void 0, !0), v = cd(n); return { expression: m, type: v, statements: [] }; }
function cd(n) { let e = ud(n); return e.push(yc(n.template.ngContentSelectors)), e.push(Se(d(n.isStandalone))), e.push(pd(n)), n.isSignal && e.push(Se(d(n.isSignal))), Se(y(f.ComponentDeclaration, e)); }
function bC(n, e) { switch (e) {
    case 0: return n;
    case 1: return ie([], n);
    case 2:
        let t = n.prop("map").callFn([y(f.resolveForwardRef)]);
        return ie([], t);
    case 3: throw new Error("Unsupported with an array of pre-resolved dependencies");
} }
function TC(n) { return Se(d(n)); }
function xc(n) { let e = Object.keys(n).map(t => { let s = Array.isArray(n[t]) ? n[t][0] : n[t]; return { key: t, value: d(s), quoted: !0 }; }); return ye(e); }
function yc(n) { return n.length > 0 ? Se(q(n.map(e => d(e)))) : _t; }
function ud(n) { let e = n.selector !== null ? n.selector.replace(/\n/g, "") : null; return [ga(n.type.type, n.typeArgumentCount), e !== null ? TC(e) : _t, n.exportAs !== null ? yc(n.exportAs) : _t, Se(IC(n)), Se(xc(n.outputs)), yc(n.queries.map(t => t.propertyName))]; }
function IC(n) { return ye(Object.keys(n.inputs).map(e => { let t = n.inputs[e], s = [{ key: "alias", value: d(t.bindingPropertyName), quoted: !0 }, { key: "required", value: d(t.required), quoted: !0 }]; return t.isSignal && s.push({ key: "isSignal", value: d(t.isSignal), quoted: !0 }), { key: e, value: ye(s), quoted: !0 }; })); }
function hd(n) { let e = ud(n); return e.push(_t), e.push(Se(d(n.isStandalone))), e.push(pd(n)), n.isSignal && e.push(Se(d(n.isSignal))), Se(y(f.DirectiveDeclaration, e)); }
function NC(n, e, t, s, r, i, o) { let a = t.createBoundHostProperties(n.properties, e), l = t.createDirectiveHostEventAsts(n.listeners, e); n.specialAttributes.styleAttr && (n.attributes.style = d(n.specialAttributes.styleAttr)), n.specialAttributes.classAttr && (n.attributes.class = d(n.specialAttributes.classAttr)); let c = j2({ componentName: i, componentSelector: r, properties: a, events: l, attributes: n.attributes }, t, s); Gf(c, k.Host), o.set("hostAttrs", c.root.attributes); let h = c.root.vars; return h !== null && h > 0 && o.set("hostVars", d(h)), q2(c); }
function DC(n) { let e = {}, t = {}, s = {}, r = {}; for (let i of Object.keys(n)) {
    let o = n[i];
    if (i.startsWith("(") && i.endsWith(")")) {
        if (typeof o != "string")
            throw new Error("Event binding must be string");
        t[i.slice(1, -1)] = o;
    }
    else if (i.startsWith("[") && i.endsWith("]")) {
        if (typeof o != "string")
            throw new Error("Property binding must be string");
        s[i.slice(1, -1)] = o;
    }
    else
        switch (i) {
            case "class":
                if (typeof o != "string")
                    throw new Error("Class binding must be string");
                r.classAttr = o;
                break;
            case "style":
                if (typeof o != "string")
                    throw new Error("Style binding must be string");
                r.styleAttr = o;
                break;
            default: typeof o == "string" ? e[i] = d(o) : e[i] = o;
        }
} return { attributes: e, listeners: t, properties: s, specialAttributes: r }; }
function PC(n, e) { let t = oa(); return t.createDirectiveHostEventAsts(n.listeners, e), t.createBoundHostProperties(n.properties, e), t.errors; }
function LC(n, e, t) { let s = new Mo; return n.map(r => s.shimCssText(r, e, t)); }
function kk(n, e) { let t = new Mo, s = e ? Sc.replace(aa, e) : Sc, r = e ? Ec.replace(aa, e) : Ec; return t.shimCssText(n, s, r); }
function pd(n) { return n.hostDirectives?.length ? Se(q(n.hostDirectives.map(e => ye([{ key: "directive", value: ir(e.directive.type), quoted: !1 }, { key: "inputs", value: xc(e.inputs || {}), quoted: !1 }, { key: "outputs", value: xc(e.outputs || {}), quoted: !1 }])))) : _t; }
function BC(n) { let e = [], t = !1; for (let s of n) {
    if (!s.inputs && !s.outputs)
        e.push(s.directive.type);
    else {
        let r = [{ key: "directive", value: s.directive.type, quoted: !1 }];
        if (s.inputs) {
            let i = la(s.inputs);
            i && r.push({ key: "inputs", value: i, quoted: !1 });
        }
        if (s.outputs) {
            let i = la(s.outputs);
            i && r.push({ key: "outputs", value: i, quoted: !1 });
        }
        e.push(ye(r));
    }
    s.isForwardReference && (t = !0);
} return t ? new en([], [new me(q(e))]) : q(e); }
function la(n) { let e = []; for (let t in n)
    n.hasOwnProperty(t) && e.push(d(t), d(n[t])); return e.length > 0 ? q(e) : null; }
function _k(n) { let e = []; if (n.mode === 0)
    for (let t of n.dependencies)
        if (t.isDeferrable) {
            let s = ie([new Z("m", re)], D("m").prop(t.isDefaultImport ? "default" : t.symbolName)), r = new ls(t.importPath).prop("then").callFn([s]);
            e.push(r);
        }
        else
            e.push(t.typeReference);
else
    for (let { symbolName: t, importPath: s, isDefaultImport: r } of n.dependencies) {
        let i = ie([new Z("m", re)], D("m").prop(r ? "default" : t)), o = new ls(s).prop("then").callFn([i]);
        e.push(o);
    } return ie([], q(e)); }
var Cc = class extends zs {
    visit(e) { e instanceof ze ? this.visit(e.ast) : e.visit(this); }
    visitElement(e) { this.visitAllTemplateNodes(e.attributes), this.visitAllTemplateNodes(e.inputs), this.visitAllTemplateNodes(e.outputs), this.visitAllTemplateNodes(e.directives), this.visitAllTemplateNodes(e.references), this.visitAllTemplateNodes(e.children); }
    visitTemplate(e) { this.visitAllTemplateNodes(e.attributes), this.visitAllTemplateNodes(e.inputs), this.visitAllTemplateNodes(e.outputs), this.visitAllTemplateNodes(e.directives), this.visitAllTemplateNodes(e.templateAttrs), this.visitAllTemplateNodes(e.variables), this.visitAllTemplateNodes(e.references), this.visitAllTemplateNodes(e.children); }
    visitContent(e) { this.visitAllTemplateNodes(e.children); }
    visitBoundAttribute(e) { this.visit(e.value); }
    visitBoundEvent(e) { this.visit(e.handler); }
    visitBoundText(e) { this.visit(e.value); }
    visitIcu(e) { Object.keys(e.vars).forEach(t => this.visit(e.vars[t])), Object.keys(e.placeholders).forEach(t => this.visit(e.placeholders[t])); }
    visitDeferredBlock(e) { e.visitAll(this); }
    visitDeferredTrigger(e) { e instanceof Ao ? this.visit(e.value) : e instanceof ri && e.options !== null && this.visit(e.options); }
    visitDeferredBlockPlaceholder(e) { this.visitAllTemplateNodes(e.children); }
    visitDeferredBlockError(e) { this.visitAllTemplateNodes(e.children); }
    visitDeferredBlockLoading(e) { this.visitAllTemplateNodes(e.children); }
    visitSwitchBlock(e) { this.visit(e.expression), this.visitAllTemplateNodes(e.groups); }
    visitSwitchBlockCase(e) { e.expression && this.visit(e.expression); }
    visitSwitchBlockCaseGroup(e) { this.visitAllTemplateNodes(e.cases), this.visitAllTemplateNodes(e.children); }
    visitSwitchExhaustiveCheck(e) { }
    visitForLoopBlock(e) { e.item.visit(this), this.visitAllTemplateNodes(e.contextVariables), this.visit(e.expression), this.visitAllTemplateNodes(e.children), e.empty?.visit(this); }
    visitForLoopBlockEmpty(e) { this.visitAllTemplateNodes(e.children); }
    visitIfBlock(e) { this.visitAllTemplateNodes(e.branches); }
    visitIfBlockBranch(e) { e.expression && this.visit(e.expression), e.expressionAlias?.visit(this), this.visitAllTemplateNodes(e.children); }
    visitLetDeclaration(e) { this.visit(e.value); }
    visitComponent(e) { this.visitAllTemplateNodes(e.attributes), this.visitAllTemplateNodes(e.inputs), this.visitAllTemplateNodes(e.outputs), this.visitAllTemplateNodes(e.directives), this.visitAllTemplateNodes(e.references), this.visitAllTemplateNodes(e.children); }
    visitDirective(e) { this.visitAllTemplateNodes(e.attributes), this.visitAllTemplateNodes(e.inputs), this.visitAllTemplateNodes(e.outputs), this.visitAllTemplateNodes(e.references); }
    visitVariable(e) { }
    visitReference(e) { }
    visitTextAttribute(e) { }
    visitText(e) { }
    visitUnknownBlock(e) { }
    visitAllTemplateNodes(e) { for (let t of e)
        this.visit(t); }
};
function np(n, e) { let t = new Set(e); return n.filter(s => !t.has(s)); }
function bk(n, e) { let t = new Rr; for (let c of e) {
    let h = { selector: c, exportAs: null, inputs: { hasBindingPropertyName() { return !1; } }, outputs: { hasBindingPropertyName() { return !1; } } };
    t.addSelectables(is.parse(c), [h]);
} let s = od(n, ""), i = new ca(t).bind({ template: s.nodes }), o = i.getEagerlyUsedDirectives().map(c => c.selector), a = i.getUsedDirectives().map(c => c.selector), l = i.getEagerlyUsedPipes(); return { directives: { regular: o, deferCandidates: np(a, o) }, pipes: { regular: l, deferCandidates: np(i.getUsedPipes(), l) } }; }
var ca = class {
    directiveMatcher;
    constructor(e) { this.directiveMatcher = e; }
    bind(e) { if (!e.template && !e.host)
        throw new Error("Empty bound targets are not supported"); let t = new Map, s = [], r = new Set, i = new Map, o = new Map, a = new Map, l = new Map, c = new Map, h = new Map, p = new Set, m = new Set, v = []; if (e.template) {
        let w = ua.apply(e.template);
        MC(w, a), Ac.apply(e.template, this.directiveMatcher, t, s, r, i, o), ha.applyWithScope(e.template, w, l, c, h, p, m, v);
    } return e.host && (t.set(e.host.node, e.host.directives), ha.applyWithScope(e.host.node, ua.apply(e.host.node), l, c, h, p, m, v)), new kc(e, t, s, r, i, o, l, c, h, a, p, m, v); }
}, ua = class n {
    parentScope;
    rootNode;
    namedEntities = new Map;
    elementLikeInScope = new Set;
    childScopes = new Map;
    isDeferred;
    constructor(e, t) { this.parentScope = e, this.rootNode = t, this.isDeferred = e !== null && e.isDeferred ? !0 : t instanceof fs; }
    static newRootScope() { return new n(null, null); }
    static apply(e) { let t = n.newRootScope(); return t.ingest(e), t; }
    ingest(e) { e instanceof st ? (e.variables.forEach(t => this.visitVariable(t)), e.children.forEach(t => t.visit(this))) : e instanceof Kn ? (e.expressionAlias !== null && this.visitVariable(e.expressionAlias), e.children.forEach(t => t.visit(this))) : e instanceof Ys ? (this.visitVariable(e.item), e.contextVariables.forEach(t => this.visitVariable(t)), e.children.forEach(t => t.visit(this))) : e instanceof li || e instanceof ci || e instanceof fs || e instanceof ai || e instanceof ii || e instanceof oi || e instanceof Qs ? e.children.forEach(t => t.visit(this)) : e instanceof hi || e.forEach(t => t.visit(this)); }
    visitElement(e) { this.visitElementLike(e); }
    visitTemplate(e) { e.directives.forEach(t => t.visit(this)), e.references.forEach(t => this.visitReference(t)), this.ingestScopedNode(e); }
    visitVariable(e) { this.maybeDeclare(e); }
    visitReference(e) { this.maybeDeclare(e); }
    visitDeferredBlock(e) { this.ingestScopedNode(e), e.placeholder?.visit(this), e.loading?.visit(this), e.error?.visit(this); }
    visitDeferredBlockPlaceholder(e) { this.ingestScopedNode(e); }
    visitDeferredBlockError(e) { this.ingestScopedNode(e); }
    visitDeferredBlockLoading(e) { this.ingestScopedNode(e); }
    visitSwitchBlock(e) { e.groups.forEach(t => t.visit(this)); }
    visitSwitchBlockCase(e) { }
    visitSwitchBlockCaseGroup(e) { this.ingestScopedNode(e); }
    visitSwitchExhaustiveCheck(e) { }
    visitForLoopBlock(e) { this.ingestScopedNode(e), e.empty?.visit(this); }
    visitForLoopBlockEmpty(e) { this.ingestScopedNode(e); }
    visitIfBlock(e) { e.branches.forEach(t => t.visit(this)); }
    visitIfBlockBranch(e) { this.ingestScopedNode(e); }
    visitContent(e) { this.ingestScopedNode(e); }
    visitLetDeclaration(e) { this.maybeDeclare(e); }
    visitComponent(e) { this.visitElementLike(e); }
    visitDirective(e) { e.references.forEach(t => this.visitReference(t)); }
    visitBoundAttribute(e) { }
    visitBoundEvent(e) { }
    visitBoundText(e) { }
    visitText(e) { }
    visitTextAttribute(e) { }
    visitIcu(e) { }
    visitDeferredTrigger(e) { }
    visitUnknownBlock(e) { }
    visitElementLike(e) { e.directives.forEach(t => t.visit(this)), e.references.forEach(t => this.visitReference(t)), e.children.forEach(t => t.visit(this)), this.elementLikeInScope.add(e); }
    maybeDeclare(e) { this.namedEntities.has(e.name) || this.namedEntities.set(e.name, e); }
    lookup(e) { return this.namedEntities.has(e) ? this.namedEntities.get(e) : this.parentScope !== null ? this.parentScope.lookup(e) : null; }
    getChildScope(e) { let t = this.childScopes.get(e); if (t === void 0)
        throw new Error(`Assertion error: child scope for ${e} not found`); return t; }
    ingestScopedNode(e) { let t = new n(this, e); t.ingest(e), this.childScopes.set(e, t); }
}, Ac = class n {
    directiveMatcher;
    directives;
    eagerDirectives;
    missingDirectives;
    bindings;
    references;
    isInDeferBlock = !1;
    constructor(e, t, s, r, i, o) { this.directiveMatcher = e, this.directives = t, this.eagerDirectives = s, this.missingDirectives = r, this.bindings = i, this.references = o; }
    static apply(e, t, s, r, i, o, a) { new n(t, s, r, i, o, a).ingest(e); }
    ingest(e) { e.forEach(t => t.visit(this)); }
    visitElement(e) { this.visitElementOrTemplate(e); }
    visitTemplate(e) { this.visitElementOrTemplate(e); }
    visitDeferredBlock(e) { let t = this.isInDeferBlock; this.isInDeferBlock = !0, e.children.forEach(s => s.visit(this)), this.isInDeferBlock = t, e.placeholder?.visit(this), e.loading?.visit(this), e.error?.visit(this); }
    visitDeferredBlockPlaceholder(e) { e.children.forEach(t => t.visit(this)); }
    visitDeferredBlockError(e) { e.children.forEach(t => t.visit(this)); }
    visitDeferredBlockLoading(e) { e.children.forEach(t => t.visit(this)); }
    visitSwitchBlock(e) { e.groups.forEach(t => t.visit(this)); }
    visitSwitchBlockCase(e) { }
    visitSwitchBlockCaseGroup(e) { e.children.forEach(t => t.visit(this)); }
    visitSwitchExhaustiveCheck(e) { }
    visitForLoopBlock(e) { e.item.visit(this), e.contextVariables.forEach(t => t.visit(this)), e.children.forEach(t => t.visit(this)), e.empty?.visit(this); }
    visitForLoopBlockEmpty(e) { e.children.forEach(t => t.visit(this)); }
    visitIfBlock(e) { e.branches.forEach(t => t.visit(this)); }
    visitIfBlockBranch(e) { e.expressionAlias?.visit(this), e.children.forEach(t => t.visit(this)); }
    visitContent(e) { e.children.forEach(t => t.visit(this)); }
    visitComponent(e) { if (this.directiveMatcher instanceof oo) {
        let t = this.directiveMatcher.match(e.componentName);
        t.length > 0 ? this.trackSelectorlessMatchesAndDirectives(e, t) : this.missingDirectives.add(e.componentName);
    } e.directives.forEach(t => t.visit(this)), e.children.forEach(t => t.visit(this)); }
    visitDirective(e) { if (this.directiveMatcher instanceof oo) {
        let t = this.directiveMatcher.match(e.name);
        t.length > 0 ? this.trackSelectorlessMatchesAndDirectives(e, t) : this.missingDirectives.add(e.name);
    } }
    visitElementOrTemplate(e) { if (this.directiveMatcher instanceof Rr) {
        let t = [], s = $m(e);
        this.directiveMatcher.match(s, (r, i) => t.push(...i)), this.trackSelectorBasedBindingsAndDirectives(e, t);
    }
    else
        e.references.forEach(t => { t.value.trim() === "" && this.references.set(t, e); }); e.directives.forEach(t => t.visit(this)), e.children.forEach(t => t.visit(this)); }
    trackMatchedDirectives(e, t) { t.length > 0 && (this.directives.set(e, t), this.isInDeferBlock || this.eagerDirectives.push(...t)); }
    trackSelectorlessMatchesAndDirectives(e, t) { if (t.length === 0)
        return; this.trackMatchedDirectives(e, t); let s = (r, i, o) => { r[o].hasBindingPropertyName(i.name) && this.bindings.set(i, r); }; for (let r of t)
        e.inputs.forEach(i => s(r, i, "inputs")), e.attributes.forEach(i => s(r, i, "inputs")), e.outputs.forEach(i => s(r, i, "outputs")); e.references.forEach(r => this.references.set(r, { directive: t[0], node: e })); }
    trackSelectorBasedBindingsAndDirectives(e, t) { this.trackMatchedDirectives(e, t), e.references.forEach(r => { let i = null; if (r.value.trim() === "")
        i = t.find(o => o.isComponent) || null;
    else if (i = t.find(o => o.exportAs !== null && o.exportAs.some(a => a === r.value)) || null, i === null)
        return; i !== null ? this.references.set(r, { directive: i, node: e }) : this.references.set(r, e); }); let s = (r, i) => { let o = t.find(l => l[i].hasBindingPropertyName(r.name)), a = o !== void 0 ? o : e; this.bindings.set(r, a); }; e.inputs.forEach(r => s(r, "inputs")), e.attributes.forEach(r => s(r, "inputs")), e instanceof st && e.templateAttrs.forEach(r => s(r, "inputs")), e.outputs.forEach(r => s(r, "outputs")); }
    visitVariable(e) { }
    visitReference(e) { }
    visitTextAttribute(e) { }
    visitBoundAttribute(e) { }
    visitBoundEvent(e) { }
    visitBoundAttributeOrEvent(e) { }
    visitText(e) { }
    visitBoundText(e) { }
    visitIcu(e) { }
    visitDeferredTrigger(e) { }
    visitUnknownBlock(e) { }
    visitLetDeclaration(e) { }
}, ha = class n extends Cc {
    bindings;
    symbols;
    usedPipes;
    eagerPipes;
    deferBlocks;
    nestingLevel;
    scope;
    rootNode;
    level;
    visitNode = e => e.visit(this);
    constructor(e, t, s, r, i, o, a, l, c) { super(), this.bindings = e, this.symbols = t, this.usedPipes = s, this.eagerPipes = r, this.deferBlocks = i, this.nestingLevel = o, this.scope = a, this.rootNode = l, this.level = c; }
    static applyWithScope(e, t, s, r, i, o, a, l) { let c = e instanceof st ? e : null; new n(s, r, o, a, l, i, t, c, 0).ingest(e); }
    ingest(e) { if (e instanceof st)
        e.variables.forEach(this.visitNode), e.children.forEach(this.visitNode), this.nestingLevel.set(e, this.level);
    else if (e instanceof Kn)
        e.expressionAlias !== null && this.visitNode(e.expressionAlias), e.children.forEach(this.visitNode), this.nestingLevel.set(e, this.level);
    else if (e instanceof Ys)
        this.visitNode(e.item), e.contextVariables.forEach(t => this.visitNode(t)), e.trackBy.visit(this), e.children.forEach(this.visitNode), this.nestingLevel.set(e, this.level);
    else if (e instanceof fs) {
        if (this.scope.rootNode !== e)
            throw new Error(`Assertion error: resolved incorrect scope for deferred block ${e}`);
        this.deferBlocks.push([e, this.scope]), e.children.forEach(t => t.visit(this)), this.nestingLevel.set(e, this.level);
    }
    else
        e instanceof li || e instanceof ci || e instanceof ai || e instanceof ii || e instanceof oi || e instanceof Qs ? (e.children.forEach(t => t.visit(this)), this.nestingLevel.set(e, this.level)) : e instanceof hi ? this.nestingLevel.set(e, 0) : e.forEach(this.visitNode); }
    visitTemplate(e) { e.inputs.forEach(this.visitNode), e.outputs.forEach(this.visitNode), e.directives.forEach(this.visitNode), e.templateAttrs.forEach(this.visitNode), e.references.forEach(this.visitNode), this.ingestScopedNode(e); }
    visitVariable(e) { this.rootNode !== null && this.symbols.set(e, this.rootNode); }
    visitReference(e) { this.rootNode !== null && this.symbols.set(e, this.rootNode); }
    visitDeferredBlock(e) { this.ingestScopedNode(e), e.triggers.when?.value.visit(this), e.prefetchTriggers.when?.value.visit(this), e.hydrateTriggers.when?.value.visit(this), e.hydrateTriggers.never?.visit(this), e.placeholder && this.visitNode(e.placeholder), e.loading && this.visitNode(e.loading), e.error && this.visitNode(e.error); }
    visitDeferredBlockPlaceholder(e) { this.ingestScopedNode(e); }
    visitDeferredBlockError(e) { this.ingestScopedNode(e); }
    visitDeferredBlockLoading(e) { this.ingestScopedNode(e); }
    visitSwitchBlockCase(e) { e.expression?.visit(this); }
    visitSwitchBlockCaseGroup(e) { e.cases.forEach(t => t.visit(this)), this.ingestScopedNode(e); }
    visitSwitchExhaustiveCheck(e) { }
    visitForLoopBlock(e) { e.expression.visit(this), this.ingestScopedNode(e), e.empty?.visit(this); }
    visitForLoopBlockEmpty(e) { this.ingestScopedNode(e); }
    visitIfBlockBranch(e) { e.expression?.visit(this), this.ingestScopedNode(e); }
    visitContent(e) { this.ingestScopedNode(e); }
    visitLetDeclaration(e) { super.visitLetDeclaration(e), this.rootNode !== null && this.symbols.set(e, this.rootNode); }
    visitPipe(e, t) { return this.usedPipes.add(e.name), this.scope.isDeferred || this.eagerPipes.add(e.name), super.visitPipe(e, t); }
    visitPropertyRead(e, t) { return this.maybeMap(e, e.name), super.visitPropertyRead(e, t); }
    visitSafePropertyRead(e, t) { return this.maybeMap(e, e.name), super.visitSafePropertyRead(e, t); }
    ingestScopedNode(e) { let t = this.scope.getChildScope(e); new n(this.bindings, this.symbols, this.usedPipes, this.eagerPipes, this.deferBlocks, this.nestingLevel, t, e, this.level + 1).ingest(e); }
    maybeMap(e, t) { if (!(e.receiver instanceof Ut))
        return; let s = this.scope.lookup(t); s !== null && this.bindings.set(e, s); }
}, kc = class {
    target;
    directives;
    eagerDirectives;
    missingDirectives;
    bindings;
    references;
    exprTargets;
    symbols;
    nestingLevel;
    scopedNodeEntities;
    usedPipes;
    eagerPipes;
    deferredBlocks;
    deferredScopes;
    constructor(e, t, s, r, i, o, a, l, c, h, p, m, v) { this.target = e, this.directives = t, this.eagerDirectives = s, this.missingDirectives = r, this.bindings = i, this.references = o, this.exprTargets = a, this.symbols = l, this.nestingLevel = c, this.scopedNodeEntities = h, this.usedPipes = p, this.eagerPipes = m, this.deferredBlocks = v.map(w => w[0]), this.deferredScopes = new Map(v); }
    getEntitiesInScope(e) { return this.scopedNodeEntities.get(e) ?? new Set; }
    getDirectivesOfNode(e) { return this.directives.get(e) || null; }
    getReferenceTarget(e) { return this.references.get(e) || null; }
    getConsumerOfBinding(e) { return this.bindings.get(e) || null; }
    getExpressionTarget(e) { return this.exprTargets.get(e) || null; }
    getDefinitionNodeOfSymbol(e) { return this.symbols.get(e) || null; }
    getNestingLevel(e) { return this.nestingLevel.get(e) || 0; }
    getUsedDirectives() { let e = new Set; return this.directives.forEach(t => t.forEach(s => e.add(s))), Array.from(e.values()); }
    getEagerlyUsedDirectives() { let e = new Set(this.eagerDirectives); return Array.from(e.values()); }
    getUsedPipes() { return Array.from(this.usedPipes); }
    getEagerlyUsedPipes() { return Array.from(this.eagerPipes); }
    getDeferBlocks() { return this.deferredBlocks; }
    getDeferredTriggerTarget(e, t) { if (!(t instanceof _o) && !(t instanceof ri) && !(t instanceof ko))
        return null; let s = t.reference; if (s === null) {
        let i = null;
        if (e.placeholder !== null) {
            for (let o of e.placeholder.children)
                if (!(o instanceof va)) {
                    if (i !== null)
                        return null;
                    o instanceof Ht && (i = o);
                }
        }
        return i;
    } let r = this.findEntityInScope(e, s); if (r instanceof ui && this.getDefinitionNodeOfSymbol(r) !== e) {
        let i = this.getReferenceTarget(r);
        if (i !== null)
            return this.referenceTargetToElement(i);
    } if (e.placeholder !== null) {
        let i = this.findEntityInScope(e.placeholder, s), o = i instanceof ui ? this.getReferenceTarget(i) : null;
        if (o !== null)
            return this.referenceTargetToElement(o);
    } return null; }
    isDeferred(e) { for (let t of this.deferredBlocks) {
        if (!this.deferredScopes.has(t))
            continue;
        let s = [this.deferredScopes.get(t)];
        for (; s.length > 0;) {
            let r = s.pop();
            if (r.elementLikeInScope.has(e))
                return !0;
            s.push(...r.childScopes.values());
        }
    } return !1; }
    referencedDirectiveExists(e) { return !this.missingDirectives.has(e); }
    findEntityInScope(e, t) { let s = this.getEntitiesInScope(e); for (let r of s)
        if (r.name === t)
            return r; return null; }
    referenceTargetToElement(e) { return e instanceof Ht ? e : e instanceof st || e.node instanceof Tr || e.node instanceof Op || e.node instanceof hi ? null : this.referenceTargetToElement(e.node); }
};
function MC(n, e) { let t = new Map; function s(i) { if (t.has(i.rootNode))
    return t.get(i.rootNode); let o = i.namedEntities, a; return i.parentScope !== null ? a = new Map([...s(i.parentScope), ...o]) : a = new Map(o), t.set(i.rootNode, a), a; } let r = [n]; for (; r.length > 0;) {
    let i = r.pop();
    for (let o of i.childScopes.values())
        r.push(o);
    s(i);
} for (let [i, o] of t)
    e.set(i, new Set(o.values())); }
var _c = class {
}, bc = class {
    jitEvaluator;
    FactoryTarget = Lt;
    ResourceLoader = _c;
    elementSchemaRegistry = new sr;
    constructor(e = new Pl) { this.jitEvaluator = e; }
    compilePipe(e, t, s) { let r = { name: s.name, type: we(s.type), typeArgumentCount: 0, pipeName: s.pipeName, pure: s.pure, isStandalone: s.isStandalone }, i = Vu(r); return this.jitExpression(i.expression, e, t, []); }
    compilePipeDeclaration(e, t, s) { let r = JC(s), i = Vu(r); return this.jitExpression(i.expression, e, t, []); }
    compileInjectable(e, t, s) { let { expression: r, statements: i } = Nu({ name: s.name, type: we(s.type), typeArgumentCount: s.typeArgumentCount, providedIn: lp(s.providedIn), useClass: bs(s, "useClass"), useFactory: ap(s, "useFactory"), useValue: bs(s, "useValue"), useExisting: bs(s, "useExisting"), deps: s.deps?.map(gd) }, !0); return this.jitExpression(r, e, t, i); }
    compileInjectableDeclaration(e, t, s) { let { expression: r, statements: i } = Nu({ name: s.type.name, type: we(s.type), typeArgumentCount: 0, providedIn: lp(s.providedIn), useClass: bs(s, "useClass"), useFactory: ap(s, "useFactory"), useValue: bs(s, "useValue"), useExisting: bs(s, "useExisting"), deps: s.deps?.map(cp) }, !0); return this.jitExpression(r, e, t, i); }
    compileInjector(e, t, s) { let r = { type: we(s.type), providers: s.providers && s.providers.length > 0 ? new W(s.providers) : null, imports: s.imports.map(o => new W(o)) }, i = Ou(r); return this.jitExpression(i.expression, e, t, []); }
    compileInjectorDeclaration(e, t, s) { let r = KC(s), i = Ou(r); return this.jitExpression(i.expression, e, t, []); }
    compileNgModule(e, t, s) { let r = { kind: Jt.Global, type: we(s.type), bootstrap: s.bootstrap.map(we), declarations: s.declarations.map(we), publicDeclarationTypes: null, imports: s.imports.map(we), includeImportTypes: !0, exports: s.exports.map(we), selectorScopeMode: Bo.Inline, containsForwardDecls: !1, schemas: s.schemas ? s.schemas.map(we) : null, id: s.id ? new W(s.id) : null }, i = ng(r); return this.jitExpression(i.expression, e, t, []); }
    compileNgModuleDeclaration(e, t, s) { let r = sg(s); return this.jitExpression(r, e, t, []); }
    compileDirective(e, t, s) { let r = ip(s); return this.compileDirectiveFromMeta(e, t, r); }
    compileDirectiveDeclaration(e, t, s) { let r = this.createParseSourceSpan("Directive", s.type.name, t), i = dd(s, r); return this.compileDirectiveFromMeta(e, t, i); }
    compileDirectiveFromMeta(e, t, s) { let r = new ho, i = oa(), o = kC(s, r, i); return this.jitExpression(o.expression, e, t, r.statements); }
    compileComponent(e, t, s) { let { template: r, defer: i } = md(s.template, s.name, t, s.preserveWhitespaces, void 0), o = pe(S(S({}, s), ip(s)), { selector: s.selector || this.elementSchemaRegistry.getDefaultComponentElementName(), template: r, declarations: s.declarations.map(OC), declarationListEmitMode: 0, defer: i, styles: [...s.styles, ...r.styles], encapsulation: s.encapsulation, changeDetection: s.changeDetection ?? null, animations: s.animations != null ? new W(s.animations) : null, viewProviders: s.viewProviders != null ? new W(s.viewProviders) : null, relativeContextFilePath: "", i18nUseExternalIds: !0, relativeTemplatePath: null }), a = `ng:///${s.name}.js`; return this.compileComponentFromMeta(e, a, o); }
    compileComponentDeclaration(e, t, s) { let r = this.createParseSourceSpan("Component", s.type.name, t), i = $C(s, r, t); return this.compileComponentFromMeta(e, t, i); }
    compileComponentFromMeta(e, t, s) { let r = new ho, i = oa(), o = _C(s, r, i); return this.jitExpression(o.expression, e, t, r.statements); }
    compileFactory(e, t, s) { let r = jn({ name: s.name, type: we(s.type), typeArgumentCount: s.typeArgumentCount, deps: UC(s.deps), target: s.target }); return this.jitExpression(r.expression, e, t, r.statements); }
    compileFactoryDeclaration(e, t, s) { let r = jn({ name: s.type.name, type: we(s.type), typeArgumentCount: 0, deps: Array.isArray(s.deps) ? s.deps.map(cp) : s.deps, target: s.target }); return this.jitExpression(r.expression, e, t, r.statements); }
    createParseSourceSpan(e, t, s) { return Qm(e, t, s); }
    jitExpression(e, t, s, r) { let i = [...r, new he("$def", e, void 0, ue.Exported)]; return this.jitEvaluator.evaluateStatements(s, i, new Bl(t), !0).$def; }
};
function sp(n) { return pe(S({}, n), { isSignal: n.isSignal, predicate: fd(n.predicate), read: n.read ? new W(n.read) : null, static: n.static, emitDistinctChangesOnly: n.emitDistinctChangesOnly }); }
function rp(n) { return { propertyName: n.propertyName, first: n.first ?? !1, predicate: fd(n.predicate), descendants: n.descendants ?? !1, read: n.read ? new W(n.read) : null, static: n.static ?? !1, emitDistinctChangesOnly: n.emitDistinctChangesOnly ?? !0, isSignal: !!n.isSignal }; }
function fd(n) { return Array.isArray(n) ? n : Gc(new W(n), 1); }
function ip(n) { let e = ZC(n.inputs || []), t = Wa(n.outputs || []), s = n.propMetadata, r = {}, i = {}; for (let a in s)
    s.hasOwnProperty(a) && s[a].forEach(l => { GC(l) ? r[a] = { bindingPropertyName: l.alias || a, classPropertyName: a, required: l.required || !1, isSignal: !!l.isSignal, transformFunction: l.transform != null ? new W(l.transform) : null } : XC(l) && (i[a] = l.alias || a); }); let o = n.hostDirectives?.length ? n.hostDirectives.map(a => typeof a == "function" ? { directive: we(a), inputs: null, outputs: null, isForwardReference: !1 } : { directive: we(a.directive), isForwardReference: !1, inputs: a.inputs ? Wa(a.inputs) : null, outputs: a.outputs ? Wa(a.outputs) : null }) : null; return pe(S({}, n), { typeArgumentCount: 0, typeSourceSpan: n.typeSourceSpan, type: we(n.type), deps: null, host: S({}, WC(n.propMetadata, n.typeSourceSpan, n.host)), inputs: S(S({}, e), r), outputs: S(S({}, t), i), queries: n.queries.map(sp), providers: n.providers != null ? new W(n.providers) : null, viewQueries: n.viewQueries.map(sp), hostDirectives: o }); }
function dd(n, e) { let t = n.hostDirectives?.length ? n.hostDirectives.map(s => ({ directive: we(s.directive), isForwardReference: !1, inputs: s.inputs ? op(s.inputs) : null, outputs: s.outputs ? op(s.outputs) : null })) : null; return { name: n.type.name, type: we(n.type), typeSourceSpan: e, selector: n.selector ?? null, inputs: n.inputs ? YC(n.inputs) : {}, outputs: n.outputs ?? {}, host: RC(n.host), queries: (n.queries ?? []).map(rp), viewQueries: (n.viewQueries ?? []).map(rp), providers: n.providers !== void 0 ? new W(n.providers) : null, exportAs: n.exportAs ?? null, usesInheritance: n.usesInheritance ?? !1, controlCreate: n.controlCreate ?? null, lifecycle: { usesOnChanges: n.usesOnChanges ?? !1 }, deps: null, typeArgumentCount: 0, isStandalone: n.isStandalone ?? Rp(n.version), isSignal: n.isSignal ?? !1, hostDirectives: t }; }
function RC(n = {}) { return { attributes: FC(n.attributes ?? {}), listeners: n.listeners ?? {}, properties: n.properties ?? {}, specialAttributes: { classAttr: n.classAttribute, styleAttr: n.styleAttribute } }; }
function op(n) { let e = null; for (let t = 1; t < n.length; t += 2)
    e = e || {}, e[n[t - 1]] = n[t]; return e; }
function FC(n) { let e = {}; for (let t of Object.keys(n))
    e[t] = new W(n[t]); return e; }
function $C(n, e, t) { let { template: s, defer: r } = md(n.template, n.type.name, t, n.preserveWhitespaces ?? !1, n.deferBlockDependencies), i = []; if (n.dependencies)
    for (let a of n.dependencies)
        switch (a.kind) {
            case "directive":
            case "component":
                i.push(Ha(a));
                break;
            case "pipe":
                i.push(qC(a));
                break;
        }
else
    (n.components || n.directives || n.pipes) && (n.components && i.push(...n.components.map(a => Ha(a, !0))), n.directives && i.push(...n.directives.map(a => Ha(a))), n.pipes && i.push(...VC(n.pipes))); let o = i.some(({ kind: a }) => a === tn.Directive || a === tn.NgModule); return pe(S({}, dd(n, e)), { template: s, styles: n.styles ?? [], declarations: i, viewProviders: n.viewProviders !== void 0 ? new W(n.viewProviders) : null, animations: n.animations !== void 0 ? new W(n.animations) : null, defer: r, changeDetection: n.changeDetection ?? Ri.Default, encapsulation: n.encapsulation ?? Ct.Emulated, declarationListEmitMode: 2, relativeContextFilePath: "", i18nUseExternalIds: !0, relativeTemplatePath: null, hasDirectiveDependencies: o }); }
function OC(n) { return pe(S({}, n), { type: new W(n.type) }); }
function Ha(n, e = null) { return { kind: tn.Directive, isComponent: e || n.kind === "component", selector: n.selector, type: new W(n.type), inputs: n.inputs ?? [], outputs: n.outputs ?? [], exportAs: n.exportAs ?? null }; }
function VC(n) { return n ? Object.keys(n).map(e => ({ kind: tn.Pipe, name: e, type: new W(n[e]) })) : []; }
function qC(n) { return { kind: tn.Pipe, name: n.name, type: new W(n.type) }; }
function md(n, e, t, s, r) { let i = od(n, t, { preserveWhitespaces: s }); if (i.errors !== null) {
    let l = i.errors.map(c => c.toString()).join(", ");
    throw new Error(`Errors during JIT compilation of template for ${e}: ${l}`);
} let a = new ca(null).bind({ template: i.nodes }); return { template: i, defer: HC(a, r) }; }
function bs(n, e) { if (n.hasOwnProperty(e))
    return Gc(new W(n[e]), 0); }
function ap(n, e) { if (n.hasOwnProperty(e))
    return new W(n[e]); }
function lp(n) { let e = typeof n == "function" ? new W(n) : new xe(n ?? null); return Gc(e, 0); }
function UC(n) { return n == null ? null : n.map(gd); }
function gd(n) { let e = n.attribute != null, t = n.token === null ? null : new W(n.token), s = e ? new W(n.attribute) : t; return vd(s, e, n.host, n.optional, n.self, n.skipSelf); }
function cp(n) { let e = n.attribute ?? !1, t = n.token === null ? null : new W(n.token); return vd(t, e, n.host ?? !1, n.optional ?? !1, n.self ?? !1, n.skipSelf ?? !1); }
function vd(n, e, t, s, r, i) { let o = e ? d("unknown") : null; return { token: n, attributeNameType: o, host: t, optional: s, self: r, skipSelf: i }; }
function HC(n, e) { let t = n.getDeferBlocks(), s = new Map; for (let r = 0; r < t.length; r++) {
    let i = e?.[r];
    s.set(t[r], i ? new W(i) : null);
} return { mode: 0, blocks: s }; }
function WC(n, e, t) {
    let s = DC(t || {}), r = PC(s, e);
    if (r.length)
        throw new Error(r.map(i => i.msg).join(`
`));
    for (let i in n)
        n.hasOwnProperty(i) && n[i].forEach(o => { jC(o) ? s.properties[o.hostPropertyName || i] = wm("this", i) : zC(o) && (s.listeners[o.eventName || i] = `${i}(${(o.args || []).join(",")})`); });
    return s;
}
function jC(n) { return n.ngMetadataName === "HostBinding"; }
function zC(n) { return n.ngMetadataName === "HostListener"; }
function GC(n) { return n.ngMetadataName === "Input"; }
function XC(n) { return n.ngMetadataName === "Output"; }
function YC(n) { return Object.keys(n).reduce((e, t) => { let s = n[t]; return typeof s == "string" || Array.isArray(s) ? e[t] = QC(s) : e[t] = { bindingPropertyName: s.publicName, classPropertyName: t, transformFunction: s.transformFunction !== null ? new W(s.transformFunction) : null, required: s.isRequired, isSignal: s.isSignal }, e; }, {}); }
function QC(n) { return typeof n == "string" ? { bindingPropertyName: n, classPropertyName: n, transformFunction: null, required: !1, isSignal: !1 } : { bindingPropertyName: n[0], classPropertyName: n[1], transformFunction: n[2] ? new W(n[2]) : null, required: !1, isSignal: !1 }; }
function ZC(n) { return n.reduce((e, t) => { if (typeof t == "string") {
    let [s, r] = wd(t);
    e[r] = { bindingPropertyName: s, classPropertyName: r, required: !1, isSignal: !1, transformFunction: null };
}
else
    e[t.name] = { bindingPropertyName: t.alias || t.name, classPropertyName: t.name, required: t.required || !1, isSignal: !1, transformFunction: t.transform != null ? new W(t.transform) : null }; return e; }, {}); }
function Wa(n) { return n.reduce((e, t) => { let [s, r] = wd(t); return e[r] = s, e; }, {}); }
function wd(n) { let [e, t] = n.split(":", 2).map(s => s.trim()); return [t ?? e, e]; }
function JC(n) { return { name: n.type.name, type: we(n.type), typeArgumentCount: 0, pipeName: n.name, deps: null, pure: n.pure ?? !0, isStandalone: n.isStandalone ?? Rp(n.version) }; }
function KC(n) { return { name: n.type.name, type: we(n.type), providers: n.providers !== void 0 && n.providers.length > 0 ? new W(n.providers) : null, imports: n.imports !== void 0 ? n.imports.map(e => new W(e)) : [] }; }
function Tk(n) { let e = n.ng || (n.ng = {}); e.\u0275compilerFacade = new bc; }
var up = class {
    defaultEncapsulation;
    preserveWhitespaces;
    strictInjectionParameters;
    constructor({ defaultEncapsulation: e = Ct.Emulated, preserveWhitespaces: t, strictInjectionParameters: s } = {}) { this.defaultEncapsulation = e, this.preserveWhitespaces = eA(lm(t)), this.strictInjectionParameters = s === !0; }
};
function eA(n, e = !1) { return n === null ? e : n; }
var Ed = "i18n", xr = "i18n-", tA = /^i18n:?/, nA = "|", sA = "@@", hp = !1;
function rA(n, e, t, s) { return new pa(e, t, s).extract(n); }
function iA(n, e, t, s) { return new pa(t, s).merge(n, e); }
var Tc = class {
    messages;
    errors;
    constructor(e, t) { this.messages = e, this.errors = t; }
}, Dt = (function (n) { return n[n.Extract = 0] = "Extract", n[n.Merge = 1] = "Merge", n; })(Dt || {}), pa = class {
    _implicitTags;
    _implicitAttrs;
    _preserveSignificantWhitespace;
    _depth;
    _inI18nNode;
    _inImplicitNode;
    _inI18nBlock;
    _blockMeaningAndDesc;
    _blockChildren;
    _blockStartDepth;
    _inIcu;
    _msgCountAtSectionStart;
    _errors;
    _mode;
    _messages;
    _translations;
    _createI18nMessage;
    constructor(e, t, s = !0) { this._implicitTags = e, this._implicitAttrs = t, this._preserveSignificantWhitespace = s; }
    extract(e) { return this._init(Dt.Extract), e.forEach(t => t.visit(this, null)), this._inI18nBlock && this._reportError(e[e.length - 1], "Unclosed block"), new Tc(this._messages, this._errors); }
    merge(e, t) { this._init(Dt.Merge), this._translations = t; let r = new Me("wrapper", [], [], e, !1, void 0, void 0, void 0, !1).visit(this, null); return this._inI18nBlock && this._reportError(e[e.length - 1], "Unclosed block"), new nr(r.children, this._errors); }
    visitExpansionCase(e, t) { let s = P(this, e.expression, t); if (this._mode === Dt.Merge)
        return new bi(e.value, s, e.sourceSpan, e.valueSourceSpan, e.expSourceSpan); }
    visitExpansion(e, t) { this._mayBeAddBlockChildren(e); let s = this._inIcu; this._inIcu || (this._isInTranslatableSection && this._addMessage([e]), this._inIcu = !0); let r = P(this, e.cases, t); return this._mode === Dt.Merge && (e = new En(e.switchValue, e.type, r, e.sourceSpan, e.switchValueSourceSpan)), this._inIcu = s, e; }
    visitComment(e, t) { let s = oA(e); if (s && this._isInTranslatableSection) {
        this._reportError(e, "Could not start a block inside a translatable section");
        return;
    } let r = aA(e); if (r && !this._inI18nBlock) {
        this._reportError(e, "Trying to close an unopened block");
        return;
    } if (!this._inI18nNode && !this._inIcu) {
        if (this._inI18nBlock) {
            if (r)
                if (this._depth == this._blockStartDepth) {
                    this._closeTranslatableSection(e, this._blockChildren), this._inI18nBlock = !1;
                    let i = this._addMessage(this._blockChildren, this._blockMeaningAndDesc), o = this._translateMessage(e, i);
                    return P(this, o);
                }
                else {
                    this._reportError(e, "I18N blocks should not cross element boundaries");
                    return;
                }
        }
        else if (s) {
            if (!hp && console && console.warn) {
                hp = !0;
                let i = e.sourceSpan.details ? `, ${e.sourceSpan.details}` : "";
                console.warn(`I18n comments are deprecated, use an <ng-container> element instead (${e.sourceSpan.start}${i})`);
            }
            this._inI18nBlock = !0, this._blockStartDepth = this._depth, this._blockChildren = [], this._blockMeaningAndDesc = e.value.replace(tA, "").trim(), this._openTranslatableSection(e);
        }
    } }
    visitText(e, t) { return this._isInTranslatableSection && this._mayBeAddBlockChildren(e), e; }
    visitElement(e, t) { return this._visitElementLike(e, t); }
    visitAttribute(e, t) { throw new Error("unreachable code"); }
    visitBlock(e, t) { P(this, e.children, t); }
    visitBlockParameter(e, t) { }
    visitLetDeclaration(e, t) { }
    visitComponent(e, t) { return this._visitElementLike(e, t); }
    visitDirective(e, t) { throw new Error("unreachable code"); }
    _init(e) { this._mode = e, this._inI18nBlock = !1, this._inI18nNode = !1, this._depth = 0, this._inIcu = !1, this._msgCountAtSectionStart = void 0, this._errors = [], this._messages = [], this._inImplicitNode = !1, this._createI18nMessage = $f(!this._preserveSignificantWhitespace, this._preserveSignificantWhitespace); }
    _visitElementLike(e, t) { this._mayBeAddBlockChildren(e), this._depth++; let s = this._inI18nNode, r = this._inImplicitNode, i = [], o, a = e instanceof Ae ? e.tagName : e.name, l = lA(e), c = l ? l.value : "", h = this._implicitTags.some(m => a === m) && !this._inIcu && !this._isInTranslatableSection, p = !r && h; if (this._inImplicitNode = r || h, !this._isInTranslatableSection && !this._inIcu) {
        if (l || p) {
            this._inI18nNode = !0;
            let m = this._addMessage(e.children, c);
            o = this._translateMessage(e, m);
        }
        if (this._mode == Dt.Extract) {
            let m = l || p;
            m && this._openTranslatableSection(e), P(this, e.children), m && this._closeTranslatableSection(e, e.children);
        }
    }
    else
        (l || p) && this._reportError(e, "Could not mark an element as translatable inside a translatable section"), this._mode == Dt.Extract && P(this, e.children); return this._mode === Dt.Merge && (o || e.children).forEach(v => { let w = v.visit(this, t); w && !this._isInTranslatableSection && (i = i.concat(w)); }), this._visitAttributesOf(e), this._depth--, this._inI18nNode = s, this._inImplicitNode = r, this._mode === Dt.Merge ? e instanceof Me ? new Me(e.name, this._translateAttributes(e), this._translateDirectives(e), i, e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan, e.isVoid) : new Ae(e.componentName, e.tagName, e.fullName, this._translateAttributes(e), this._translateDirectives(e), i, e.isSelfClosing, e.sourceSpan, e.startSourceSpan, e.endSourceSpan) : null; }
    _visitAttributesOf(e) { let t = {}, s = this._implicitAttrs[e instanceof Ae ? e.tagName || "" : e.name] || []; e.attrs.filter(r => r instanceof Sn && r.name.startsWith(xr)).forEach(r => { t[r.name.slice(xr.length)] = r.value; }), e.attrs.forEach(r => { r.name in t ? this._addMessage([r], t[r.name]) : s.some(i => r.name === i) && this._addMessage([r]); }); }
    _addMessage(e, t) { if (e.length == 0 || this._isEmptyAttributeValue(e) || this._isPlaceholderOnlyAttributeValue(e) || this._isPlaceholderOnlyMessage(e))
        return null; let { meaning: s, description: r, id: i } = pp(t), o = this._createI18nMessage(e, s, r, i); return this._messages.push(o), o; }
    _isEmptyAttributeValue(e) { return fp(e) ? e[0].value.trim() === "" : !1; }
    _isPlaceholderOnlyAttributeValue(e) { if (!fp(e))
        return !1; let t = e[0].valueTokens ?? [], s = t.filter(i => i.type === 17), r = t.filter(i => i.type === 16).map(i => i.parts[0].trim()).join(""); return s.length === 1 && r === ""; }
    _isPlaceholderOnlyMessage(e) { if (!cA(e))
        return !1; let t = e[0].tokens, s = t.filter(i => i.type === 8), r = t.filter(i => i.type === 5).map(i => i.parts[0].trim()).join(""); return s.length === 1 && r === ""; }
    _translateMessage(e, t) { if (t && this._mode === Dt.Merge) {
        let s = this._translations.get(t);
        if (s)
            return s;
        this._reportError(e, `Translation unavailable for message id="${this._translations.digest(t)}"`);
    } return []; }
    _translateAttributes(e) { let t = {}, s = []; return e.attrs.forEach(r => { r.name.startsWith(xr) && (t[r.name.slice(xr.length)] = pp(r.value)); }), e.attrs.forEach(r => { if (!(r.name === Ed || r.name.startsWith(xr)))
        if (r.value && r.value != "" && t.hasOwnProperty(r.name)) {
            let { meaning: i, description: o, id: a } = t[r.name], l = this._createI18nMessage([r], i, o, a), c = this._translations.get(l);
            if (c)
                if (c.length == 0)
                    s.push(new Sn(r.name, "", r.sourceSpan, void 0, void 0, void 0, void 0));
                else if (c[0] instanceof ln) {
                    let h = c[0].value;
                    s.push(new Sn(r.name, h, r.sourceSpan, void 0, void 0, void 0, void 0));
                }
                else
                    this._reportError(e, `Unexpected translation for attribute "${r.name}" (id="${a || this._translations.digest(l)}")`);
            else
                this._reportError(e, `Translation unavailable for attribute "${r.name}" (id="${a || this._translations.digest(l)}")`);
        }
        else
            s.push(r); }), s; }
    _translateDirectives(e) { return e.directives.map(t => new Xo(t.name, this._translateAttributes(t), t.sourceSpan, t.startSourceSpan, t.endSourceSpan)); }
    _mayBeAddBlockChildren(e) { this._inI18nBlock && !this._inIcu && this._depth == this._blockStartDepth && this._blockChildren.push(e); }
    _openTranslatableSection(e) { this._isInTranslatableSection ? this._reportError(e, "Unexpected section start") : this._msgCountAtSectionStart = this._messages.length; }
    get _isInTranslatableSection() { return this._msgCountAtSectionStart !== void 0; }
    _closeTranslatableSection(e, t) { if (!this._isInTranslatableSection) {
        this._reportError(e, "Unexpected section end");
        return;
    } let s = this._msgCountAtSectionStart; if (t.reduce((i, o) => i + (o instanceof Mn ? 0 : 1), 0) == 1)
        for (let i = this._messages.length - 1; i >= s; i--) {
            let o = this._messages[i].nodes;
            if (!(o.length == 1 && o[0] instanceof Mt)) {
                this._messages.splice(i, 1);
                break;
            }
        } this._msgCountAtSectionStart = void 0; }
    _reportError(e, t) { this._errors.push(new N(e.sourceSpan, t)); }
};
function oA(n) { return !!(n instanceof Mn && n.value && n.value.startsWith("i18n")); }
function aA(n) { return !!(n instanceof Mn && n.value && n.value === "/i18n"); }
function lA(n) { return n.attrs.find(e => e instanceof Sn && e.name === Ed) || null; }
function pp(n) { if (!n)
    return { meaning: "", description: "", id: "" }; let e = n.indexOf(sA), t = n.indexOf(nA), [s, r] = e > -1 ? [n.slice(0, e), n.slice(e + 2)] : [n, ""], [i, o] = t > -1 ? [s.slice(0, t), s.slice(t + 1)] : ["", s]; return { meaning: i, description: o, id: r.trim() }; }
function cA(n) { return n.length === 1 && n[0] instanceof ln; }
function fp(n) { return n.length === 1 && n[0] instanceof Sn; }
var Ic = class {
    closedByParent = !1;
    implicitNamespacePrefix = null;
    isVoid = !1;
    ignoreFirstLf = !1;
    canSelfClose = !0;
    preventNamespaceInheritance = !1;
    requireExtraParent(e) { return !1; }
    isClosedByChild(e) { return !1; }
    getContentType() { return Bt.PARSABLE_DATA; }
}, uA = new Ic;
function hA(n) { return uA; }
var Rn = class extends Df {
    constructor() { super(hA); }
    parse(e, t, s = {}) { return super.parse(e, t, pe(S({}, s), { tokenizeBlocks: !1, tokenizeLet: !1, selectorlessEnabled: !1 })); }
}, pA = "1.2", fA = "urn:oasis:names:tc:xliff:document:1.2", dA = "en", Qt = "x", mA = "mrk", gA = "file", Sd = "source", vA = "seg-source", wA = "alt-trans", EA = "target", Nc = "trans-unit", SA = "context-group", dp = "context", Dc = class extends Zs {
    write(e, t) { let s = new xA, r = []; e.forEach(l => { let c = []; l.sources.forEach(p => { let m = new $(SA, { purpose: "location" }); m.children.push(new G(10), new $(dp, { "context-type": "sourcefile" }, [new Q(p.filePath)]), new G(10), new $(dp, { "context-type": "linenumber" }, [new Q(`${p.startLine}`)]), new G(8)), c.push(new G(8), m); }); let h = new $(Nc, { id: l.id, datatype: "html" }); h.children.push(new G(8), new $(Sd, {}, s.serialize(l.nodes)), ...c), l.description && h.children.push(new G(8), new $("note", { priority: "1", from: "description" }, [new Q(l.description)])), l.meaning && h.children.push(new G(8), new $("note", { priority: "1", from: "meaning" }, [new Q(l.meaning)])), h.children.push(new G(6)), r.push(new G(6), h); }); let i = new $("body", {}, [...r, new G(4)]), o = new $("file", { "source-language": t || dA, datatype: "plaintext", original: "ng2.template" }, [new G(4), i, new G(2)]), a = new $("xliff", { version: pA, xmlns: fA }, [new G(2), o, new G]); return Qc([new pi({ version: "1.0", encoding: "UTF-8" }), new G, a, new G]); }
    load(e, t) {
        let s = new Pc, { locale: r, msgIdToHtml: i, errors: o } = s.parse(e, t), a = {}, l = new yA;
        if (Object.keys(i).forEach(c => { let { i18nNodes: h, errors: p } = l.convert(i[c], t); o.push(...p), a[c] = h; }), o.length)
            throw new Error(`xliff parse errors:
${o.join(`
`)}`);
        return { locale: r, i18nNodesByMsgId: a };
    }
    digest(e) { return yp(e); }
}, xA = class {
    visitText(e, t) { return [new Q(e.value)]; }
    visitContainer(e, t) { let s = []; return e.children.forEach(r => s.push(...r.visit(this))), s; }
    visitIcu(e, t) { let s = [new Q(`{${e.expressionPlaceholder}, ${e.type}, `)]; return Object.keys(e.cases).forEach(r => { s.push(new Q(`${r} {`), ...e.cases[r].visit(this), new Q("} ")); }), s.push(new Q("}")), s; }
    visitTagPlaceholder(e, t) { let s = CA(e.tag); if (e.isVoid)
        return [new $(Qt, { id: e.startName, ctype: s, "equiv-text": `<${e.tag}/>` })]; let r = new $(Qt, { id: e.startName, ctype: s, "equiv-text": `<${e.tag}>` }), i = new $(Qt, { id: e.closeName, ctype: s, "equiv-text": `</${e.tag}>` }); return [r, ...this.serialize(e.children), i]; }
    visitPlaceholder(e, t) { return [new $(Qt, { id: e.name, "equiv-text": `{{${e.value}}}` })]; }
    visitBlockPlaceholder(e, t) { let s = `x-${e.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`, r = new $(Qt, { id: e.startName, ctype: s, "equiv-text": `@${e.name}` }), i = new $(Qt, { id: e.closeName, ctype: s, "equiv-text": "}" }); return [r, ...this.serialize(e.children), i]; }
    visitIcuPlaceholder(e, t) { let s = `{${e.value.expression}, ${e.value.type}, ${Object.keys(e.value.cases).map(r => r + " {...}").join(" ")}}`; return [new $(Qt, { id: e.name, "equiv-text": s })]; }
    serialize(e) { return [].concat(...e.map(t => t.visit(this))); }
}, Pc = class {
    _unitMlString;
    _errors;
    _msgIdToHtml;
    _locale = null;
    parse(e, t) { this._unitMlString = null, this._msgIdToHtml = {}; let s = new Rn().parse(e, t); return this._errors = s.errors, P(this, s.rootNodes, null), { msgIdToHtml: this._msgIdToHtml, errors: this._errors, locale: this._locale }; }
    visitElement(e, t) { switch (e.name) {
        case Nc:
            this._unitMlString = null;
            let s = e.attrs.find(c => c.name === "id");
            if (!s)
                this._addError(e, `<${Nc}> misses the "id" attribute`);
            else {
                let c = s.value;
                this._msgIdToHtml.hasOwnProperty(c) ? this._addError(e, `Duplicated translations for msg ${c}`) : (P(this, e.children, null), typeof this._unitMlString == "string" ? this._msgIdToHtml[c] = this._unitMlString : this._addError(e, `Message ${c} misses a translation`));
            }
            break;
        case Sd:
        case vA:
        case wA: break;
        case EA:
            let r = e.startSourceSpan.end.offset, i = e.endSourceSpan.start.offset, a = e.startSourceSpan.start.file.content.slice(r, i);
            this._unitMlString = a;
            break;
        case gA:
            let l = e.attrs.find(c => c.name === "target-language");
            l && (this._locale = l.value), P(this, e.children, null);
            break;
        default: P(this, e.children, null);
    } }
    visitAttribute(e, t) { }
    visitText(e, t) { }
    visitComment(e, t) { }
    visitExpansion(e, t) { }
    visitExpansionCase(e, t) { }
    visitBlock(e, t) { }
    visitBlockParameter(e, t) { }
    visitLetDeclaration(e, t) { }
    visitComponent(e, t) { }
    visitDirective(e, t) { }
    _addError(e, t) { this._errors.push(new N(e.sourceSpan, t)); }
}, yA = class {
    _errors;
    convert(e, t) { let s = new Rn().parse(e, t, { tokenizeExpansionForms: !0 }); return this._errors = s.errors, { i18nNodes: this._errors.length > 0 || s.rootNodes.length == 0 ? [] : [].concat(...P(this, s.rootNodes)), errors: this._errors }; }
    visitText(e, t) { return new Mt(e.value, e.sourceSpan); }
    visitElement(e, t) { if (e.name === Qt) {
        let s = e.attrs.find(r => r.name === "id");
        return s ? new mt("", s.value, e.sourceSpan) : (this._addError(e, `<${Qt}> misses the "id" attribute`), null);
    } return e.name === mA ? [].concat(...P(this, e.children)) : (this._addError(e, "Unexpected tag"), null); }
    visitExpansion(e, t) { let s = {}; return P(this, e.cases).forEach(r => { s[r.value] = new rt(r.nodes, e.sourceSpan); }), new Tn(e.switchValue, e.type, s, e.sourceSpan); }
    visitExpansionCase(e, t) { return { value: e.value, nodes: P(this, e.expression) }; }
    visitComment(e, t) { }
    visitAttribute(e, t) { }
    visitBlock(e, t) { }
    visitBlockParameter(e, t) { }
    visitLetDeclaration(e, t) { }
    visitComponent(e, t) { this._addError(e, "Unexpected node"); }
    visitDirective(e, t) { this._addError(e, "Unexpected node"); }
    _addError(e, t) { this._errors.push(new N(e.sourceSpan, t)); }
};
function CA(n) { switch (n.toLowerCase()) {
    case "br": return "lb";
    case "img": return "image";
    default: return `x-${n}`;
} }
var AA = "2.0", kA = "urn:oasis:names:tc:xliff:document:2.0", _A = "en", Zn = "ph", Lc = "pc", bA = "mrk", xd = "xliff", yd = "source", TA = "target", Bc = "unit", Mc = class extends Zs {
    write(e, t) { let s = new Rc, r = []; e.forEach(a => { let l = new $(Bc, { id: a.id }), c = new $("notes"); (a.description || a.meaning) && (a.description && c.children.push(new G(8), new $("note", { category: "description" }, [new Q(a.description)])), a.meaning && c.children.push(new G(8), new $("note", { category: "meaning" }, [new Q(a.meaning)]))), a.sources.forEach(p => { c.children.push(new G(8), new $("note", { category: "location" }, [new Q(`${p.filePath}:${p.startLine}${p.endLine !== p.startLine ? "," + p.endLine : ""}`)])); }), c.children.push(new G(6)), l.children.push(new G(6), c); let h = new $("segment"); h.children.push(new G(8), new $(yd, {}, s.serialize(a.nodes)), new G(6)), l.children.push(new G(6), h, new G(4)), r.push(new G(4), l); }); let i = new $("file", { original: "ng.template", id: "ngi18n" }, [...r, new G(2)]), o = new $(xd, { version: AA, xmlns: kA, srcLang: t || _A }, [new G(2), i, new G]); return Qc([new pi({ version: "1.0", encoding: "UTF-8" }), new G, o, new G]); }
    load(e, t) {
        let s = new Fc, { locale: r, msgIdToHtml: i, errors: o } = s.parse(e, t), a = {}, l = new IA;
        if (Object.keys(i).forEach(c => { let { i18nNodes: h, errors: p } = l.convert(i[c], t); o.push(...p), a[c] = h; }), o.length)
            throw new Error(`xliff2 parse errors:
${o.join(`
`)}`);
        return { locale: r, i18nNodesByMsgId: a };
    }
    digest(e) { return Wc(e); }
}, Rc = class {
    _nextPlaceholderId = 0;
    visitText(e, t) { return [new Q(e.value)]; }
    visitContainer(e, t) { let s = []; return e.children.forEach(r => s.push(...r.visit(this))), s; }
    visitIcu(e, t) { let s = [new Q(`{${e.expressionPlaceholder}, ${e.type}, `)]; return Object.keys(e.cases).forEach(r => { s.push(new Q(`${r} {`), ...e.cases[r].visit(this), new Q("} ")); }), s.push(new Q("}")), s; }
    visitTagPlaceholder(e, t) { let s = NA(e.tag); if (e.isVoid)
        return [new $(Zn, { id: (this._nextPlaceholderId++).toString(), equiv: e.startName, type: s, disp: `<${e.tag}/>` })]; let r = new $(Lc, { id: (this._nextPlaceholderId++).toString(), equivStart: e.startName, equivEnd: e.closeName, type: s, dispStart: `<${e.tag}>`, dispEnd: `</${e.tag}>` }), i = [].concat(...e.children.map(o => o.visit(this))); return i.length ? i.forEach(o => r.children.push(o)) : r.children.push(new Q("")), [r]; }
    visitPlaceholder(e, t) { let s = (this._nextPlaceholderId++).toString(); return [new $(Zn, { id: s, equiv: e.name, disp: `{{${e.value}}}` })]; }
    visitBlockPlaceholder(e, t) { let s = new $(Lc, { id: (this._nextPlaceholderId++).toString(), equivStart: e.startName, equivEnd: e.closeName, type: "other", dispStart: `@${e.name}`, dispEnd: "}" }), r = [].concat(...e.children.map(i => i.visit(this))); return r.length ? r.forEach(i => s.children.push(i)) : s.children.push(new Q("")), [s]; }
    visitIcuPlaceholder(e, t) { let s = Object.keys(e.value.cases).map(i => i + " {...}").join(" "), r = (this._nextPlaceholderId++).toString(); return [new $(Zn, { id: r, equiv: e.name, disp: `{${e.value.expression}, ${e.value.type}, ${s}}` })]; }
    serialize(e) { return this._nextPlaceholderId = 0, [].concat(...e.map(t => t.visit(this))); }
}, Fc = class {
    _unitMlString;
    _errors;
    _msgIdToHtml;
    _locale = null;
    parse(e, t) { this._unitMlString = null, this._msgIdToHtml = {}; let s = new Rn().parse(e, t); return this._errors = s.errors, P(this, s.rootNodes, null), { msgIdToHtml: this._msgIdToHtml, errors: this._errors, locale: this._locale }; }
    visitElement(e, t) { switch (e.name) {
        case Bc:
            this._unitMlString = null;
            let s = e.attrs.find(h => h.name === "id");
            if (!s)
                this._addError(e, `<${Bc}> misses the "id" attribute`);
            else {
                let h = s.value;
                this._msgIdToHtml.hasOwnProperty(h) ? this._addError(e, `Duplicated translations for msg ${h}`) : (P(this, e.children, null), typeof this._unitMlString == "string" ? this._msgIdToHtml[h] = this._unitMlString : this._addError(e, `Message ${h} misses a translation`));
            }
            break;
        case yd: break;
        case TA:
            let r = e.startSourceSpan.end.offset, i = e.endSourceSpan.start.offset, a = e.startSourceSpan.start.file.content.slice(r, i);
            this._unitMlString = a;
            break;
        case xd:
            let l = e.attrs.find(h => h.name === "trgLang");
            l && (this._locale = l.value);
            let c = e.attrs.find(h => h.name === "version");
            if (c) {
                let h = c.value;
                h !== "2.0" ? this._addError(e, `The XLIFF file version ${h} is not compatible with XLIFF 2.0 serializer`) : P(this, e.children, null);
            }
            break;
        default: P(this, e.children, null);
    } }
    visitAttribute(e, t) { }
    visitText(e, t) { }
    visitComment(e, t) { }
    visitExpansion(e, t) { }
    visitExpansionCase(e, t) { }
    visitBlock(e, t) { }
    visitBlockParameter(e, t) { }
    visitLetDeclaration(e, t) { }
    visitComponent(e, t) { }
    visitDirective(e, t) { }
    _addError(e, t) { this._errors.push(new N(e.sourceSpan, t)); }
}, IA = class {
    _errors;
    convert(e, t) { let s = new Rn().parse(e, t, { tokenizeExpansionForms: !0 }); return this._errors = s.errors, { i18nNodes: this._errors.length > 0 || s.rootNodes.length == 0 ? [] : [].concat(...P(this, s.rootNodes)), errors: this._errors }; }
    visitText(e, t) { return new Mt(e.value, e.sourceSpan); }
    visitElement(e, t) { switch (e.name) {
        case Zn:
            let s = e.attrs.find(o => o.name === "equiv");
            if (s)
                return [new mt("", s.value, e.sourceSpan)];
            this._addError(e, `<${Zn}> misses the "equiv" attribute`);
            break;
        case Lc:
            let r = e.attrs.find(o => o.name === "equivStart"), i = e.attrs.find(o => o.name === "equivEnd");
            if (!r)
                this._addError(e, `<${Zn}> misses the "equivStart" attribute`);
            else if (!i)
                this._addError(e, `<${Zn}> misses the "equivEnd" attribute`);
            else {
                let o = r.value, a = i.value;
                return [].concat(new mt("", o, e.sourceSpan), ...e.children.map(c => c.visit(this, null)), new mt("", a, e.sourceSpan));
            }
            break;
        case bA: return [].concat(...P(this, e.children));
        default: this._addError(e, "Unexpected tag");
    } return null; }
    visitExpansion(e, t) { let s = {}; return P(this, e.cases).forEach(r => { s[r.value] = new rt(r.nodes, e.sourceSpan); }), new Tn(e.switchValue, e.type, s, e.sourceSpan); }
    visitExpansionCase(e, t) { return { value: e.value, nodes: [].concat(...P(this, e.expression)) }; }
    visitComment(e, t) { }
    visitAttribute(e, t) { }
    visitBlock(e, t) { }
    visitBlockParameter(e, t) { }
    visitLetDeclaration(e, t) { }
    visitComponent(e, t) { this._addError(e, "Unexpected node"); }
    visitDirective(e, t) { this._addError(e, "Unexpected node"); }
    _addError(e, t) { this._errors.push(new N(e.sourceSpan, t)); }
};
function NA(n) { switch (n.toLowerCase()) {
    case "br":
    case "b":
    case "i":
    case "u": return "fmt";
    case "img": return "image";
    case "a": return "link";
    default: return "other";
} }
var mp = "translationbundle", gp = "translation", vp = "ph", $c = class extends Zs {
    write(e, t) { throw new Error("Unsupported"); }
    load(e, t) {
        let s = new Oc, { locale: r, msgIdToHtml: i, errors: o } = s.parse(e, t), a = {}, l = new Vc;
        if (Object.keys(i).forEach(c => {
            DA(a, c, function () {
                let { i18nNodes: p, errors: m } = l.convert(i[c], t);
                if (m.length)
                    throw new Error(`xtb parse errors:
${m.join(`
`)}`);
                return p;
            });
        }), o.length)
            throw new Error(`xtb parse errors:
${o.join(`
`)}`);
        return { locale: r, i18nNodesByMsgId: a };
    }
    digest(e) { return qp(e); }
    createNameMapper(e) { return new No(e, Zc); }
};
function DA(n, e, t) { Object.defineProperty(n, e, { configurable: !0, enumerable: !0, get: function () { let s = t(); return Object.defineProperty(n, e, { enumerable: !0, value: s }), s; }, set: s => { throw new Error("Could not overwrite an XTB translation"); } }); }
var Oc = class {
    _bundleDepth;
    _errors;
    _msgIdToHtml;
    _locale = null;
    parse(e, t) { this._bundleDepth = 0, this._msgIdToHtml = {}; let s = new Rn().parse(e, t); return this._errors = s.errors, P(this, s.rootNodes), { msgIdToHtml: this._msgIdToHtml, errors: this._errors, locale: this._locale }; }
    visitElement(e, t) { switch (e.name) {
        case mp:
            this._bundleDepth++, this._bundleDepth > 1 && this._addError(e, `<${mp}> elements can not be nested`);
            let s = e.attrs.find(i => i.name === "lang");
            s && (this._locale = s.value), P(this, e.children, null), this._bundleDepth--;
            break;
        case gp:
            let r = e.attrs.find(i => i.name === "id");
            if (!r)
                this._addError(e, `<${gp}> misses the "id" attribute`);
            else {
                let i = r.value;
                if (this._msgIdToHtml.hasOwnProperty(i))
                    this._addError(e, `Duplicated translations for msg ${i}`);
                else {
                    let o = e.startSourceSpan.end.offset, a = e.endSourceSpan.start.offset, c = e.startSourceSpan.start.file.content.slice(o, a);
                    this._msgIdToHtml[i] = c;
                }
            }
            break;
        default: this._addError(e, "Unexpected tag");
    } }
    visitAttribute(e, t) { }
    visitText(e, t) { }
    visitComment(e, t) { }
    visitExpansion(e, t) { }
    visitExpansionCase(e, t) { }
    visitBlock(e, t) { }
    visitBlockParameter(e, t) { }
    visitLetDeclaration(e, t) { }
    visitComponent(e, t) { this._addError(e, "Unexpected node"); }
    visitDirective(e, t) { this._addError(e, "Unexpected node"); }
    _addError(e, t) { this._errors.push(new N(e.sourceSpan, t)); }
}, Vc = class {
    _errors;
    convert(e, t) { let s = new Rn().parse(e, t, { tokenizeExpansionForms: !0 }); return this._errors = s.errors, { i18nNodes: this._errors.length > 0 || s.rootNodes.length == 0 ? [] : P(this, s.rootNodes), errors: this._errors }; }
    visitText(e, t) { return new Mt(e.value, e.sourceSpan); }
    visitExpansion(e, t) { let s = {}; return P(this, e.cases).forEach(r => { s[r.value] = new rt(r.nodes, e.sourceSpan); }), new Tn(e.switchValue, e.type, s, e.sourceSpan); }
    visitExpansionCase(e, t) { return { value: e.value, nodes: P(this, e.expression) }; }
    visitElement(e, t) { if (e.name === vp) {
        let s = e.attrs.find(r => r.name === "name");
        if (s)
            return new mt("", s.value, e.sourceSpan);
        this._addError(e, `<${vp}> misses the "name" attribute`);
    }
    else
        this._addError(e, "Unexpected tag"); return null; }
    visitComment(e, t) { }
    visitAttribute(e, t) { }
    visitBlock(e, t) { }
    visitBlockParameter(e, t) { }
    visitLetDeclaration(e, t) { }
    visitComponent(e, t) { this._addError(e, "Unexpected node"); }
    visitDirective(e, t) { this._addError(e, "Unexpected node"); }
    _addError(e, t) { this._errors.push(new N(e.sourceSpan, t)); }
}, fa = class n {
    _i18nNodesByMsgId;
    digest;
    mapperFactory;
    _i18nToHtml;
    constructor(e = {}, t, s, r, i = $s.Warning, o) { this._i18nNodesByMsgId = e, this.digest = s, this.mapperFactory = r, this._i18nToHtml = new qc(e, t, s, r, i, o); }
    static load(e, t, s, r, i) { let { locale: o, i18nNodesByMsgId: a } = s.load(e, t), l = h => s.digest(h), c = h => s.createNameMapper(h); return new n(a, o, l, c, r, i); }
    get(e) {
        let t = this._i18nToHtml.convert(e);
        if (t.errors.length)
            throw new Error(t.errors.join(`
`));
        return t.nodes;
    }
    has(e) { return this.digest(e) in this._i18nNodesByMsgId; }
}, qc = class {
    _i18nNodesByMsgId;
    _locale;
    _digest;
    _mapperFactory;
    _missingTranslationStrategy;
    _console;
    _srcMsg;
    _errors = [];
    _contextStack = [];
    _mapper;
    constructor(e = {}, t, s, r, i, o) { this._i18nNodesByMsgId = e, this._locale = t, this._digest = s, this._mapperFactory = r, this._missingTranslationStrategy = i, this._console = o; }
    convert(e) { this._contextStack.length = 0, this._errors.length = 0; let t = this._convertToText(e), s = e.nodes[0].sourceSpan.start.file.url, r = new ra().parse(t, s, { tokenizeExpansionForms: !0 }); return { nodes: r.rootNodes, errors: [...this._errors, ...r.errors] }; }
    visitText(e, t) { return wa(e.value); }
    visitContainer(e, t) { return e.children.map(s => s.visit(this)).join(""); }
    visitIcu(e, t) { let s = Object.keys(e.cases).map(i => `${i} {${e.cases[i].visit(this)}}`); return `{${this._srcMsg.placeholders.hasOwnProperty(e.expression) ? this._srcMsg.placeholders[e.expression].text : e.expression}, ${e.type}, ${s.join(" ")}}`; }
    visitPlaceholder(e, t) { let s = this._mapper(e.name); return this._srcMsg.placeholders.hasOwnProperty(s) ? this._srcMsg.placeholders[s].text : this._srcMsg.placeholderToMessage.hasOwnProperty(s) ? this._convertToText(this._srcMsg.placeholderToMessage[s]) : (this._addError(e, `Unknown placeholder "${e.name}"`), ""); }
    visitTagPlaceholder(e, t) { let s = `${e.tag}`, r = Object.keys(e.attrs).map(o => `${o}="${e.attrs[o]}"`).join(" "); if (e.isVoid)
        return `<${s} ${r}/>`; let i = e.children.map(o => o.visit(this)).join(""); return `<${s} ${r}>${i}</${s}>`; }
    visitIcuPlaceholder(e, t) { return this._convertToText(this._srcMsg.placeholderToMessage[e.name]); }
    visitBlockPlaceholder(e, t) { let s = e.parameters.length === 0 ? "" : ` (${e.parameters.join("; ")})`, r = e.children.map(i => i.visit(this)).join(""); return `@${e.name}${s} {${r}}`; }
    _convertToText(e) { let t = this._digest(e), s = this._mapperFactory ? this._mapperFactory(e) : null, r; if (this._contextStack.push({ msg: this._srcMsg, mapper: this._mapper }), this._srcMsg = e, this._i18nNodesByMsgId.hasOwnProperty(t))
        r = this._i18nNodesByMsgId[t], this._mapper = a => s ? s.toInternalName(a) : a;
    else {
        if (this._missingTranslationStrategy === $s.Error) {
            let a = this._locale ? ` for locale "${this._locale}"` : "";
            this._addError(e.nodes[0], `Missing translation for message "${t}"${a}`);
        }
        else if (this._console && this._missingTranslationStrategy === $s.Warning) {
            let a = this._locale ? ` for locale "${this._locale}"` : "";
            this._console.warn(`Missing translation for message "${t}"${a}`);
        }
        r = e.nodes, this._mapper = a => a;
    } let i = r.map(a => a.visit(this)).join(""), o = this._contextStack.pop(); return this._srcMsg = o.msg, this._mapper = o.mapper, i; }
    _addError(e, t) { this._errors.push(new N(e.sourceSpan, t)); }
}, wp = class {
    _htmlParser;
    getTagDefinition;
    _translationBundle;
    constructor(e, t, s, r = $s.Warning, i) { if (this._htmlParser = e, t) {
        let o = PA(s);
        this._translationBundle = fa.load(t, "i18n", o, r, i);
    }
    else
        this._translationBundle = new fa({}, null, yp, void 0, r, i); }
    parse(e, t, s = {}) { let r = this._htmlParser.parse(e, t, S({}, s)); return r.errors.length ? new nr(r.rootNodes, r.errors) : iA(r.rootNodes, this._translationBundle, [], {}); }
};
function PA(n) { switch (n = (n || "xlf").toLowerCase(), n) {
    case "xmb": return new kl;
    case "xtb": return new $c;
    case "xliff2":
    case "xlf2": return new Mc;
    default: return new Dc;
} }
var Ep = class {
    _htmlParser;
    _implicitTags;
    _implicitAttrs;
    _locale;
    _preserveWhitespace;
    _messages = [];
    constructor(e, t, s, r = null, i = !0) { this._htmlParser = e, this._implicitTags = t, this._implicitAttrs = s, this._locale = r, this._preserveWhitespace = i; }
    updateFromTemplate(e, t) { let s = this._htmlParser.parse(e, t, { tokenizeExpansionForms: !0 }); if (s.errors.length)
        return s.errors; let r = this._preserveWhitespace ? s.rootNodes : yt(new Ni(!1), s.rootNodes), i = rA(r, this._implicitTags, this._implicitAttrs, this._preserveWhitespace); return i.errors.length ? i.errors : (this._messages.push(...i.messages), []); }
    getMessages() { return this._messages; }
    write(e, t) { let s = {}, r = new Uc; this._messages.forEach(o => { let a = e.digest(o); s.hasOwnProperty(a) ? s[a].sources.push(...o.sources) : s[a] = o; }); let i = Object.keys(s).map(o => { let a = e.createNameMapper(s[o]), l = s[o], c = a ? r.convert(l.nodes, a) : l.nodes, h = new Le(c, {}, {}, l.meaning, l.description, o); return h.sources = l.sources, t && h.sources.forEach(p => p.filePath = t(p.filePath)), h; }); return e.write(i, this._locale); }
}, Uc = class extends xl {
    convert(e, t) { return t ? e.map(s => s.visit(this, t)) : e; }
    visitTagPlaceholder(e, t) { let s = t.toPublicName(e.startName), r = e.closeName ? t.toPublicName(e.closeName) : e.closeName, i = e.children.map(o => o.visit(this, t)); return new jt(e.tag, e.attrs, s, r, i, e.isVoid, e.sourceSpan, e.startSourceSpan, e.endSourceSpan); }
    visitBlockPlaceholder(e, t) { let s = t.toPublicName(e.startName), r = e.closeName ? t.toPublicName(e.closeName) : e.closeName, i = e.children.map(o => o.visit(this, t)); return new zt(e.name, e.parameters, s, r, i, e.sourceSpan, e.startSourceSpan, e.endSourceSpan); }
    visitPlaceholder(e, t) { return new mt(e.value, t.toPublicName(e.name), e.sourceSpan); }
    visitIcuPlaceholder(e, t) { return new In(e.value, t.toPublicName(e.name), e.sourceSpan); }
}, Sp = class n {
    forwardMap;
    reverseMap;
    constructor(e) { this.forwardMap = e, this.reverseMap = LA(e); }
    static empty() { return new n(new Map); }
    static fromMappedObject(e) { let t = new Map; for (let s of Object.keys(e)) {
        let r = e[s], i;
        typeof r == "string" ? i = { classPropertyName: s, bindingPropertyName: r, isSignal: !1 } : i = r, t.set(s, i);
    } return new n(t); }
    static merge(e, t) { let s = new Map(e.forwardMap.entries()); for (let [r, i] of t.forwardMap)
        s.set(r, i); return new n(s); }
    get classPropertyNames() { return Array.from(this.forwardMap.keys()); }
    get propertyNames() { return Array.from(this.reverseMap.keys()); }
    hasBindingPropertyName(e) { return this.reverseMap.has(e); }
    getByBindingPropertyName(e) { return this.reverseMap.has(e) ? this.reverseMap.get(e) : null; }
    getByClassPropertyName(e) { return this.forwardMap.has(e) ? this.forwardMap.get(e) : null; }
    toDirectMappedObject() { let e = {}; for (let [t, s] of this.forwardMap)
        e[t] = s.bindingPropertyName; return e; }
    toJointMappedObject(e) { let t = {}; for (let [s, r] of this.forwardMap)
        t[s] = e(r); return t; }
    *[Symbol.iterator]() { for (let e of this.forwardMap.values())
        yield e; }
};
function LA(n) { let e = new Map; for (let [t, s] of n)
    e.has(s.bindingPropertyName) || e.set(s.bindingPropertyName, []), e.get(s.bindingPropertyName).push(s); return e; }
function BA(n) { let e = Cd(n); return ie([], [Wr(e).toStmt()]).callFn([]); }
function Cd(n) { return y(f.setClassMetadata).callFn([n.type, n.decorators, n.ctorParameters ?? d(null), n.propDecorators ?? d(null)]); }
function Pk(n, e) { return e === null || e.length === 0 ? BA(n) : Ad(n, e.map(t => new Z(t.symbolName, re)), kd(e)); }
function Lk(n, e, t) { return Ad(n, t.map(s => new Z(s, re)), e); }
function Ad(n, e, t) { let s = Cd(n), r = ie(e, [s.toStmt()]), i = y(f.setClassMetadataAsync).callFn([n.type, t, r]); return ie([], [Wr(i).toStmt()]).callFn([]); }
function kd(n) { let e = n.map(({ symbolName: t, importPath: s, isDefaultImport: r }) => { let i = ie([new Z("m", re)], D("m").prop(r ? "default" : t)); return new ls(s).prop("then").callFn([i]); }); return ie([], q(e)); }
var MA = "12.0.0", RA = "18.0.0";
function FA(n) { let e = new ae; return e.set("minVersion", d(MA)), e.set("version", d("21.2.8")), e.set("ngImport", y(f.core)), e.set("type", n.type), e.set("decorators", n.decorators), e.set("ctorParameters", n.ctorParameters), e.set("propDecorators", n.propDecorators), y(f.declareClassMetadata).callFn([e.toLiteralMap()]); }
function Bk(n, e) { if (e === null || e.length === 0)
    return FA(n); let t = new ae, s = new ae; return s.set("decorators", n.decorators), s.set("ctorParameters", n.ctorParameters ?? d(null)), s.set("propDecorators", n.propDecorators ?? d(null)), t.set("minVersion", d(RA)), t.set("version", d("21.2.8")), t.set("ngImport", y(f.core)), t.set("type", n.type), t.set("resolveDeferredDeps", kd(e)), t.set("resolveMetadata", ie(e.map(r => new Z(r.symbolName, re)), s.toLiteralMap())), y(f.declareClassMetadataAsync).callFn([t.toLiteralMap()]); }
function br(n, e) { return n === null || n.length === 0 ? null : q(n.map(t => e(t))); }
function ja(n, e) { let t = Object.keys(n).map(s => { let r = n[s]; return { key: s, value: e(r), quoted: !0 }; }); return t.length > 0 ? ye(t) : null; }
function $A(n) { return n === "invalid" ? d("invalid") : n === null ? d(null) : q(n.map(_d)); }
function _d(n) { let e = new ae; return e.set("token", n.token), n.attributeNameType !== null && e.set("attribute", d(!0)), n.host && e.set("host", d(!0)), n.optional && e.set("optional", d(!0)), n.self && e.set("self", d(!0)), n.skipSelf && e.set("skipSelf", d(!0)), e.toLiteralMap(); }
function Mk(n) { let e = bd(n), t = y(f.declareDirective).callFn([e.toLiteralMap()]), s = hd(n); return { expression: t, type: s, statements: [] }; }
function bd(n) { let e = new ae, t = OA(n); return e.set("minVersion", d(t)), e.set("version", d("21.2.8")), e.set("type", n.type.value), n.isStandalone !== void 0 && e.set("isStandalone", d(n.isStandalone)), n.isSignal && e.set("isSignal", d(n.isSignal)), n.selector !== null && e.set("selector", d(n.selector)), e.set("inputs", Td(n) ? UA(n.inputs) : HA(n.inputs)), e.set("outputs", Tl(n.outputs)), e.set("host", VA(n.host)), e.set("providers", n.providers), n.queries.length > 0 && e.set("queries", q(n.queries.map(xp))), n.viewQueries.length > 0 && e.set("viewQueries", q(n.viewQueries.map(xp))), n.exportAs !== null && e.set("exportAs", Ve(n.exportAs)), n.usesInheritance && e.set("usesInheritance", d(!0)), n.lifecycle.usesOnChanges && e.set("usesOnChanges", d(!0)), n.controlCreate && e.set("controlCreate", ye([{ key: "passThroughInput", value: d(n.controlCreate.passThroughInput), quoted: !1 }])), n.hostDirectives?.length && e.set("hostDirectives", qA(n.hostDirectives)), e.set("ngImport", y(f.core)), e; }
function OA(n) { let e = "14.0.0"; return Object.values(n.inputs).some(s => s.transformFunction !== null) && (e = "16.1.0"), Td(n) && (e = "17.1.0"), (n.queries.some(s => s.isSignal) || n.viewQueries.some(s => s.isSignal)) && (e = "17.2.0"), e; }
function Td(n) { return Object.values(n.inputs).some(e => e.isSignal); }
function xp(n) { let e = new ae; return e.set("propertyName", d(n.propertyName)), n.first && e.set("first", d(!0)), e.set("predicate", Array.isArray(n.predicate) ? Ve(n.predicate) : Ds(n.predicate)), n.emitDistinctChangesOnly || e.set("emitDistinctChangesOnly", d(!1)), n.descendants && e.set("descendants", d(!0)), e.set("read", n.read), n.static && e.set("static", d(!0)), n.isSignal && e.set("isSignal", d(!0)), e.toLiteralMap(); }
function VA(n) { let e = new ae; return e.set("attributes", ja(n.attributes, t => t)), e.set("listeners", ja(n.listeners, d)), e.set("properties", ja(n.properties, d)), n.specialAttributes.styleAttr && e.set("styleAttribute", d(n.specialAttributes.styleAttr)), n.specialAttributes.classAttr && e.set("classAttribute", d(n.specialAttributes.classAttr)), e.values.length > 0 ? e.toLiteralMap() : null; }
function qA(n) { let e = n.map(t => { let s = [{ key: "directive", value: t.isForwardReference ? Xc(t.directive.type) : t.directive.type, quoted: !1 }], r = t.inputs ? la(t.inputs) : null, i = t.outputs ? la(t.outputs) : null; return r && s.push({ key: "inputs", value: r, quoted: !1 }), i && s.push({ key: "outputs", value: i, quoted: !1 }), ye(s); }); return q(e); }
function UA(n) { let e = Object.getOwnPropertyNames(n); return e.length === 0 ? null : ye(e.map(t => { let s = n[t]; return { key: t, quoted: Kc.test(t), value: ye([{ key: "classPropertyName", quoted: !1, value: Ve(s.classPropertyName) }, { key: "publicName", quoted: !1, value: Ve(s.bindingPropertyName) }, { key: "isSignal", quoted: !1, value: Ve(s.isSignal) }, { key: "isRequired", quoted: !1, value: Ve(s.required) }, { key: "transformFunction", quoted: !1, value: s.transformFunction ?? An }]) }; })); }
function HA(n) { let e = Object.getOwnPropertyNames(n); return e.length === 0 ? null : ye(e.map(t => { let s = n[t], r = s.bindingPropertyName, i = r !== t, o; if (i || s.transformFunction !== null) {
    let a = [Ve(r), Ve(t)];
    s.transformFunction !== null && a.push(s.transformFunction), o = q(a);
}
else
    o = Ve(r); return { key: t, quoted: Kc.test(t), value: o }; })); }
function Rk(n, e, t) { let s = WA(n, e, t), r = y(f.declareComponent).callFn([s.toLiteralMap()]), i = cd(n); return { expression: r, type: i, statements: [] }; }
function WA(n, e, t) { let s = bd(n), r = new Hc; if (z(r, e.nodes), s.set("template", jA(e, t)), t.isInline && s.set("isInline", d(!0)), r.hasBlocks && s.set("minVersion", d("17.0.0")), s.set("styles", br(n.styles, d)), s.set("dependencies", GA(n)), s.set("viewProviders", n.viewProviders), s.set("animations", n.animations), n.changeDetection !== null) {
    if (typeof n.changeDetection == "object")
        throw new Error("Impossible state! Change detection flag is not resolved!");
    s.set("changeDetection", y(f.ChangeDetectionStrategy).prop(Ri[n.changeDetection]));
} if (n.encapsulation !== Ct.Emulated && s.set("encapsulation", y(f.ViewEncapsulation).prop(Ct[n.encapsulation])), e.preserveWhitespaces === !0 && s.set("preserveWhitespaces", d(!0)), n.defer.mode === 0) {
    let i = [], o = !1;
    for (let a of n.defer.blocks.values())
        a === null ? i.push(d(null)) : (i.push(a), o = !0);
    o && s.set("deferBlockDependencies", q(i));
}
else
    throw new Error("Unsupported defer function emit mode in partial compilation"); return s; }
function jA(n, e) { if (e.inlineTemplateLiteralExpression !== null)
    return e.inlineTemplateLiteralExpression; if (e.isInline)
    return d(e.content, null, null); let t = e.content, s = new gi(t, e.sourceUrl), r = new ms(s, 0, 0, 0), i = zA(s, t), o = new B(r, i); return d(t, null, o); }
function zA(n, e) {
    let t = e.length, s = 0, r = 0, i = 0;
    do
        s = e.indexOf(`
`, r), s !== -1 && (r = s + 1, i++);
    while (s !== -1);
    return new ms(n, t, i, t - r);
}
function GA(n) { let e = n.declarationListEmitMode !== 0 ? Xc : t => t; if (n.declarationListEmitMode === 3)
    throw new Error("Unsupported emit mode"); return br(n.declarations, t => { switch (t.kind) {
    case tn.Directive:
        let s = new ae;
        return s.set("kind", d(t.isComponent ? "component" : "directive")), s.set("type", e(t.type)), s.set("selector", d(t.selector)), s.set("inputs", br(t.inputs, d)), s.set("outputs", br(t.outputs, d)), s.set("exportAs", br(t.exportAs, d)), s.toLiteralMap();
    case tn.Pipe:
        let r = new ae;
        return r.set("kind", d("pipe")), r.set("type", e(t.type)), r.set("name", d(t.name)), r.toLiteralMap();
    case tn.NgModule:
        let i = new ae;
        return i.set("kind", d("ngmodule")), i.set("type", e(t.type)), i.toLiteralMap();
} }); }
var Hc = class extends _m {
    hasBlocks = !1;
    visitDeferredBlock() { this.hasBlocks = !0; }
    visitDeferredBlockPlaceholder() { this.hasBlocks = !0; }
    visitDeferredBlockLoading() { this.hasBlocks = !0; }
    visitDeferredBlockError() { this.hasBlocks = !0; }
    visitIfBlock() { this.hasBlocks = !0; }
    visitIfBlockBranch() { this.hasBlocks = !0; }
    visitForLoopBlock() { this.hasBlocks = !0; }
    visitForLoopBlockEmpty() { this.hasBlocks = !0; }
    visitSwitchBlock() { this.hasBlocks = !0; }
    visitSwitchBlockCase() { this.hasBlocks = !0; }
    visitSwitchBlockCaseGroup() { this.hasBlocks = !0; }
}, XA = "12.0.0";
function Fk(n) { let e = new ae; return e.set("minVersion", d(XA)), e.set("version", d("21.2.8")), e.set("ngImport", y(f.core)), e.set("type", n.type.value), e.set("deps", $A(n.deps)), e.set("target", y(f.FactoryTarget).prop(Lt[n.target])), { expression: y(f.declareFactory).callFn([e.toLiteralMap()]), statements: [], type: $p(n) }; }
var YA = "12.0.0";
function $k(n) { let e = QA(n), t = y(f.declareInjectable).callFn([e.toLiteralMap()]), s = zp(n); return { expression: t, type: s, statements: [] }; }
function QA(n) { let e = new ae; if (e.set("minVersion", d(YA)), e.set("version", d("21.2.8")), e.set("ngImport", y(f.core)), e.set("type", n.type.value), n.providedIn !== void 0) {
    let t = Ds(n.providedIn);
    t.value !== null && e.set("providedIn", t);
} return n.useClass !== void 0 && e.set("useClass", Ds(n.useClass)), n.useExisting !== void 0 && e.set("useExisting", Ds(n.useExisting)), n.useValue !== void 0 && e.set("useValue", Ds(n.useValue)), n.useFactory !== void 0 && e.set("useFactory", n.useFactory), n.deps !== void 0 && e.set("deps", q(n.deps.map(_d))), e; }
var ZA = "12.0.0";
function Ok(n) { let e = JA(n), t = y(f.declareInjector).callFn([e.toLiteralMap()]), s = af(n); return { expression: t, type: s, statements: [] }; }
function JA(n) { let e = new ae; return e.set("minVersion", d(ZA)), e.set("version", d("21.2.8")), e.set("ngImport", y(f.core)), e.set("type", n.type.value), e.set("providers", n.providers), n.imports.length > 0 && e.set("imports", q(n.imports)), e; }
var KA = "14.0.0";
function Vk(n) { let e = ek(n), t = y(f.declareNgModule).callFn([e.toLiteralMap()]), s = lf(n); return { expression: t, type: s, statements: [] }; }
function ek(n) { let e = new ae; if (n.kind === Jt.Local)
    throw new Error("Invalid path! Local compilation mode should not get into the partial compilation path"); return e.set("minVersion", d(KA)), e.set("version", d("21.2.8")), e.set("ngImport", y(f.core)), e.set("type", n.type.value), n.bootstrap.length > 0 && e.set("bootstrap", At(n.bootstrap, n.containsForwardDecls)), n.declarations.length > 0 && e.set("declarations", At(n.declarations, n.containsForwardDecls)), n.imports.length > 0 && e.set("imports", At(n.imports, n.containsForwardDecls)), n.exports.length > 0 && e.set("exports", At(n.exports, n.containsForwardDecls)), n.schemas !== null && n.schemas.length > 0 && e.set("schemas", q(n.schemas.map(t => t.value))), n.id !== null && e.set("id", n.id), e; }
var tk = "14.0.0";
function qk(n) { let e = nk(n), t = y(f.declarePipe).callFn([e.toLiteralMap()]), s = cf(n); return { expression: t, type: s, statements: [] }; }
function nk(n) { let e = new ae; return e.set("minVersion", d(tk)), e.set("version", d("21.2.8")), e.set("ngImport", y(f.core)), e.set("type", n.type.value), n.isStandalone !== void 0 && e.set("isStandalone", d(n.isStandalone)), e.set("name", d(n.pipeName ?? n.name)), n.pure === !1 && e.set("pure", d(n.pure)), e; }
function Uk(n) { let e = { className: n.className }; n.filePath && (e.filePath = n.filePath, e.lineNumber = n.lineNumber), n.forbidOrphanRendering && (e.forbidOrphanRendering = d(!0)); let t = y(f.setClassDebugInfo).callFn([n.type, Go(e)]); return ie([], [Wr(t).toStmt()]).callFn([]); }
function Hk(n) { let i = `${n.className}_HmrLoad`, o = n.namespaceDependencies.map(T => new sn({ moduleName: T.moduleName, name: null })), a = D("m").prop("default"), l = y(f.replaceMetadata).callFn([n.type, a, q(o), q(n.localDependencies.map(T => T.runtimeRepresentation)), D("import").prop("meta"), D("id")]), c = ie([new Z("m", re)], a.and(l)), h = y(f.getReplaceMetadataURL).callFn([D("id"), D("t"), D("import").prop("meta").prop("url")]), p = new _n(i, [new Z("t", re)], [new ls(h, null, "@vite-ignore").prop("then").callFn([c]).toStmt()], null, ue.Final), m = ie([new Z("d", re)], D("d").prop("id").identical(D("id")).and(D(i).callFn([D("d").prop("timestamp")]))), v = D(i).callFn([D("Date").prop("now").callFn([])]), w = D("import").prop("meta").prop("hot"), C = w.clone().prop("on").callFn([d("angular:component-update"), m]); return ie([], [new he("id", d(encodeURIComponent(`${n.filePath}@${n.className}`)), null, ue.Final), p, Wr(v).toStmt(), Wr(w.and(C)).toStmt()]).callFn([]); }
function Wk(n, e, t) { let s = "\u0275\u0275namespaces", r = [t.className, s].map(o => new Z(o, re)), i = []; for (let o of t.localDependencies)
    r.push(new Z(o.name, re)); for (let o = 0; o < t.namespaceDependencies.length; o++)
    i.push(new he(t.namespaceDependencies[o].assignedName, D(s).key(d(o)), re, ue.Final)); i.push(...e); for (let o of n)
    if (o.initializer !== null) {
        i.push(D(t.className).prop(o.name).set(o.initializer).toStmt());
        for (let a of o.statements)
            i.push(a);
    } return new _n(`${t.className}_UpdateMetadata`, r, i, null, ue.Final); }
var sk = (function (n) { return n[n.Selector = 0] = "Selector", n[n.HostDirective = 1] = "HostDirective", n; })(sk || {}), jk = new sl("21.2.8");
export { te as AST, jr as ASTWithName, ze as ASTWithSource, tt as AbsoluteSourceSpan, Za as ArrayType, So as ArrowFunction, Fn as ArrowFunctionExpr, ll as ArrowFunctionIdentifierParameter, Sn as Attribute, Be as Binary, x as BinaryOperator, j as BinaryOperatorExpr, go as BindingPipe, no as BindingPipeType, X as BindingType, ut as Block, Yo as BlockParameter, Co as BoundElementProperty, kt as BuiltinType, Yt as BuiltinTypeName, Xa as CUSTOM_ELEMENTS_SCHEMA, js as Call, Ws as Chain, Ri as ChangeDetectionStrategy, Sp as ClassPropertyMapping, Cc as CombinedRecursiveAstVisitor, nl as CommaExpr, Mn as Comment, up as CompilerConfig, bc as CompilerFacadeImpl, Ae as Component, mo as Conditional, bt as ConditionalExpr, ho as ConstantPool, is as CssSelector, re as DYNAMIC_TYPE, _n as DeclareFunctionStmt, he as DeclareVarStmt, Xo as Directive, sr as DomElementSchemaRegistry, ls as DynamicImportExpr, gr as EOF, Me as Element, tc as ElementSchemaRegistry, ol as EmitterVisitorContext, Ne as EmptyExpr, En as Expansion, bi as ExpansionCase, Y as Expression, cl as ExpressionBinding, Te as ExpressionStatement, nt as ExpressionType, sn as ExternalExpr, el as ExternalReference, Lt as FactoryTarget, en as FunctionExpr, ra as HtmlParser, H as HtmlTagDefinition, wp as I18NHtmlParser, Ur as IfStmt, Ut as ImplicitReceiver, qs as InstantiateExpr, $i as Interpolation, Ue as InvokeFunctionExpr, qr as JSDocComment, Pl as JitEvaluator, hs as KeyedRead, Vr as LeadingComment, Qo as LetDeclaration, Di as Lexer, Yr as LiteralArray, Tt as LiteralArrayExpr, xe as LiteralExpr, ps as LiteralMap, Et as LiteralMapExpr, cs as LiteralMapPropertyAssignment, qt as LiteralMapSpreadAssignment, We as LiteralPrimitive, Or as LocalizedString, Ja as MapType, sk as MatchSource, Ep as MessageBundle, _t as NONE_TYPE, Ya as NO_ERRORS_SCHEMA, an as NodeWithI18n, Kr as NonNullAssert, Hs as NotExpr, wt as ParenthesizedExpr, ni as ParenthesizedExpression, N as ParseError, vn as ParseErrorLevel, ms as ParseLocation, gi as ParseSourceFile, B as ParseSourceSpan, us as ParseSpan, nr as ParseTreeResult, yo as ParsedEvent, Oe as ParsedEventType, Ps as ParsedProperty, Pt as ParsedPropertyType, ul as ParsedVariable, Jo as Parser, Qr as PrefixNot, $t as PropertyRead, f as R3Identifiers, Jt as R3NgModuleMetadataKind, Bo as R3SelectorScopeMode, ca as R3TargetBinder, tn as R3TemplateDependencyKind, Vt as ReadKeyExpr, Xe as ReadPropExpr, vt as ReadVarExpr, zs as RecursiveAstVisitor, rh as RecursiveVisitor, xo as RegularExpressionLiteral, as as RegularExpressionLiteralExpr, _c as ResourceLoader, me as ReturnStatement, oE as SCHEMA, vh as SECURITY_SCHEMA, ma as STRING_TYPE, wo as SafeCall, Xr as SafeKeyedRead, Gr as SafePropertyRead, Ga as SelectorContext, za as SelectorListContext, Rr as SelectorMatcher, oo as SelectorlessMatcher, Zs as Serializer, Zl as SplitInterpolation, vo as SpreadElement, Cn as SpreadElementExpr, kn as Statement, ue as StmtModifier, Nr as StringToken, ns as StringTokenKind, Bt as TagContentType, ei as TaggedTemplateLiteral, Vs as TaggedTemplateLiteralExpr, Jl as TemplateBindingParseResult, ti as TemplateLiteral, Eo as TemplateLiteralElement, $r as TemplateLiteralElementExpr, Us as TemplateLiteralExpr, ln as Text, zr as ThisReceiver, Ye as TmplAstBlockNode, fl as TmplAstBoundAttribute, Ao as TmplAstBoundDeferredTrigger, dl as TmplAstBoundEvent, Gs as TmplAstBoundText, Tr as TmplAstComponent, Qs as TmplAstContent, fs as TmplAstDeferredBlock, ai as TmplAstDeferredBlockError, oi as TmplAstDeferredBlockLoading, ii as TmplAstDeferredBlockPlaceholder, Wt as TmplAstDeferredTrigger, Op as TmplAstDirective, Ht as TmplAstElement, Ys as TmplAstForLoopBlock, ci as TmplAstForLoopBlockEmpty, hi as TmplAstHostElement, ko as TmplAstHoverDeferredTrigger, Vp as TmplAstIcu, gl as TmplAstIdleDeferredTrigger, To as TmplAstIfBlock, Kn as TmplAstIfBlockBranch, vl as TmplAstImmediateDeferredTrigger, _o as TmplAstInteractionDeferredTrigger, Yc as TmplAstLetDeclaration, ml as TmplAstNeverDeferredTrigger, _m as TmplAstRecursiveVisitor, ui as TmplAstReference, bo as TmplAstSwitchBlock, El as TmplAstSwitchBlockCase, li as TmplAstSwitchBlockCaseGroup, Sl as TmplAstSwitchExhaustiveCheck, st as TmplAstTemplate, Yn as TmplAstText, Xs as TmplAstTextAttribute, wl as TmplAstTimerDeferredTrigger, Io as TmplAstUnknownBlock, bn as TmplAstVariable, ri as TmplAstViewportDeferredTrigger, at as Token, L as TokenType, co as TransplantedType, fe as TreeError, xn as Type, zc as TypeModifier, os as TypeofExpr, Zr as TypeofExpression, Rs as Unary, Os as UnaryOperator, rn as UnaryOperatorExpr, jk as VERSION, si as VariableBinding, sl as Version, Ct as ViewEncapsulation, Fr as VoidExpr, Jr as VoidExpression, W as WrappedNodeExpr, Dc as Xliff, Mc as Xliff2, kl as Xmb, Rn as XmlParser, $c as Xtb, Ff as _ATTR_TO_PROP, Uk as compileClassDebugInfo, BA as compileClassMetadata, Pk as compileComponentClassMetadata, Bk as compileComponentDeclareClassMetadata, _C as compileComponentFromMetadata, FA as compileDeclareClassMetadata, Rk as compileDeclareComponentFromMetadata, Mk as compileDeclareDirectiveFromMetadata, Fk as compileDeclareFactoryFunction, $k as compileDeclareInjectableFromMetadata, Ok as compileDeclareInjectorFromMetadata, Vk as compileDeclareNgModuleFromMetadata, qk as compileDeclarePipeFromMetadata, _k as compileDeferResolverFunction, kC as compileDirectiveFromMetadata, jn as compileFactoryFunction, Hk as compileHmrInitializer, Wk as compileHmrUpdateCallback, Nu as compileInjectable, Ou as compileInjector, ng as compileNgModule, Lk as compileOpaqueAsyncClassMetadata, Vu as compilePipeFromMetadata, kp as computeMsgId, rk as core, $m as createCssSelectorFromNode, zp as createInjectableType, Gc as createMayBeForwardRefExpression, Wr as devOnlyGuardedExpression, Nd as emitDistinctChangesOnlyDefaultValue, kk as encapsulateStyle, ak as escapeRegExp, bk as findMatchingDirectivesAndPipes, nc as getHtmlTagDefinition, pl as getNsPrefix, wm as getSafePropertyAccessString, Jm as identifierName, Tu as isNgContainer, hl as isNgContent, km as isNgTemplate, Np as jsDocComment, Yd as leadingComment, d as literal, ye as literalMap, oa as makeBindingParser, so as mergeNsAndName, ok as outputAst, DC as parseHostBindings, od as parseTemplate, eA as preserveWhitespacesDefault, Tk as publishFacade, Qm as r3JitTypeSourceSpan, zn as sanitizeIdentifier, Ak as setEnableTemplateSourceLocations, It as splitNsName, z as tmplAstVisitAll, PC as verifyHostBindings, P as visitAll };
/*! Bundled license information:

@angular/compiler/fesm2022/compiler.mjs:
  (**
   * @license Angular v21.2.8
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)

@angular/compiler/fesm2022/compiler.mjs:
  (**
   *
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.dev/license
   *)
*/
