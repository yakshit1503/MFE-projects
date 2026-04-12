// frontend/src/app/app.component.ts
import { Component as Component2, ViewEncapsulation as ViewEncapsulation2 } from "@angular/core";

// frontend/src/app/features/staybook/components/staybook-page/staybook-page.component.ts
import { Component, ViewEncapsulation, computed } from "@angular/core";
import * as i02 from "@angular/core";

// frontend/src/app/shared/state/shell-shared-state.service.ts
import { Injectable, signal } from "@angular/core";
import * as i0 from "@angular/core";
var SHELL_STATE_EVENT = "portfolio-shell-state-change";
var ShellSharedStateService = class _ShellSharedStateService {
  state = signal({
    activeApp: "yakshit-chawla-portfolio",
    city: "Toronto",
    audience: "Recruiters",
    timeframe: "This week",
    userName: "Yakshit Chawla",
    message: "Waiting for shell data.",
    theme: "dark"
  }, ...ngDevMode ? [{ debugName: "state" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    if (typeof window === "undefined") {
      return;
    }
    if (window.__PORTFOLIO_SHELL_STATE__) {
      this.state.set(window.__PORTFOLIO_SHELL_STATE__);
    }
    window.addEventListener(SHELL_STATE_EVENT, this.handleShellState);
  }
  handleShellState = (event) => {
    this.state.set(event.detail);
  };
  static \u0275fac = function ShellSharedStateService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShellSharedStateService)();
  };
  static \u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({ token: _ShellSharedStateService, factory: _ShellSharedStateService.\u0275fac, providedIn: "root" });
};

// frontend/src/app/features/staybook/components/staybook-page/staybook-page.component.ts
var StaybookPageComponent = class _StaybookPageComponent {
  hostState;
  summary;
  constructor(shellSharedStateService) {
    this.hostState = shellSharedStateService.state;
    this.summary = computed(() => `${this.hostState().userName} is targeting ${this.hostState().audience} in ${this.hostState().city} for ${this.hostState().timeframe}.`, ...ngDevMode ? [{ debugName: "summary" }] : (
      /* istanbul ignore next */
      []
    ));
  }
  static \u0275fac = function StaybookPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StaybookPageComponent)(i02.\u0275\u0275directiveInject(ShellSharedStateService));
  };
  static \u0275cmp = /* @__PURE__ */ i02.\u0275\u0275defineComponent({ type: _StaybookPageComponent, selectors: [["app-staybook-page"]], decls: 34, vars: 3, consts: [[1, "remote-page"], [1, "badge"], [1, "intro"], [1, "host-state"], [1, "grid"]], template: function StaybookPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      i02.\u0275\u0275domElementStart(0, "section", 0)(1, "div", 1);
      i02.\u0275\u0275text(2, "Product Demo");
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(3, "h2");
      i02.\u0275\u0275text(4, "StayBook");
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(5, "p", 2);
      i02.\u0275\u0275text(6, " Hotel discovery, room planning, and reservation ideas can evolve here while the portfolio shell renders the result. ");
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(7, "article", 3)(8, "h3");
      i02.\u0275\u0275text(9, "Host Shared Data");
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(10, "p");
      i02.\u0275\u0275text(11);
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(12, "dl")(13, "div")(14, "dt");
      i02.\u0275\u0275text(15, "Source");
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(16, "dd");
      i02.\u0275\u0275text(17);
      i02.\u0275\u0275domElementEnd()();
      i02.\u0275\u0275domElementStart(18, "div")(19, "dt");
      i02.\u0275\u0275text(20, "Message");
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(21, "dd");
      i02.\u0275\u0275text(22);
      i02.\u0275\u0275domElementEnd()()()();
      i02.\u0275\u0275domElementStart(23, "div", 4)(24, "article")(25, "h3");
      i02.\u0275\u0275text(26, "Featured Stays");
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(27, "p");
      i02.\u0275\u0275text(28, "Lakefront villas, boutique city lofts, and work-friendly suites are curated for this week.");
      i02.\u0275\u0275domElementEnd()();
      i02.\u0275\u0275domElementStart(29, "article")(30, "h3");
      i02.\u0275\u0275text(31, "Reservation Snapshot");
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(32, "p");
      i02.\u0275\u0275text(33, "Check-in windows, room types, and pricing widgets can all evolve here independently.");
      i02.\u0275\u0275domElementEnd()()()();
    }
    if (rf & 2) {
      i02.\u0275\u0275advance(11);
      i02.\u0275\u0275textInterpolate(ctx.summary());
      i02.\u0275\u0275advance(6);
      i02.\u0275\u0275textInterpolate(ctx.hostState().activeApp);
      i02.\u0275\u0275advance(5);
      i02.\u0275\u0275textInterpolate(ctx.hostState().message);
    }
  }, styles: ['/* frontend/src/app/features/staybook/components/staybook-page/staybook-page.component.scss */\n:host {\n  display: block;\n  font-family:\n    "Bahnschrift",\n    "Aptos",\n    "Trebuchet MS",\n    sans-serif;\n  --page-border: rgba(251, 146, 60, 0.24);\n  --page-bg:\n    radial-gradient(\n      circle at 88% 8%,\n      rgba(251, 146, 60, 0.34),\n      transparent 18rem),\n    linear-gradient(\n      145deg,\n      #3b1b08 0%,\n      #6f3110 56%,\n      #a44c1d 100%);\n  --page-text: #ffe7d2;\n  --page-shadow: 0 24px 70px rgba(154, 52, 18, 0.26);\n  --badge-bg: #fb923c;\n  --badge-text: #3b1b08;\n  --paragraph-text: #ffd9c4;\n  --card-bg: rgba(35, 10, 2, 0.82);\n  --card-border: rgba(251, 146, 60, 0.14);\n  --card-shadow: 0 16px 40px rgba(251, 146, 60, 0.2);\n  --heading-text: #ffe8d6;\n}\n:host-context(html[data-theme=light]) {\n  --page-border: rgba(194, 65, 12, 0.22);\n  --page-bg:\n    radial-gradient(\n      circle at 88% 8%,\n      rgba(251, 146, 60, 0.34),\n      transparent 18rem),\n    linear-gradient(\n      145deg,\n      #fff7ed 0%,\n      #ffedd5 56%,\n      #fed7aa 100%);\n  --page-text: #431407;\n  --page-shadow: 0 24px 70px rgba(154, 52, 18, 0.16);\n  --badge-bg: #c2410c;\n  --badge-text: #ffffff;\n  --paragraph-text: #7c2d12;\n  --card-bg: rgba(255, 255, 255, 0.78);\n  --card-border: rgba(194, 65, 12, 0.14);\n  --card-shadow: 0 16px 40px rgba(154, 52, 18, 0.1);\n  --heading-text: #431407;\n}\n.remote-page {\n  display: grid;\n  gap: 1.1rem;\n  padding: clamp(1.2rem, 4vw, 2.5rem);\n  border: 1px solid var(--page-border);\n  border-radius: 2rem;\n  background: var(--page-bg);\n  color: var(--page-text);\n  box-shadow: 0 24px 70px rgba(154, 52, 18, 0.16);\n}\n.badge {\n  justify-self: start;\n  padding: 0.45rem 0.75rem;\n  border-radius: 999px;\n  background: var(--badge-bg);\n  color: var(--badge-text);\n  font-size: 0.75rem;\n  font-weight: 900;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n}\nh2 {\n  margin: 0;\n  color: var(--heading-text);\n  font-size: clamp(2.2rem, 5vw, 4.5rem);\n  letter-spacing: -0.06em;\n  line-height: 0.95;\n}\n.intro,\n.host-state p,\narticle p,\ndd {\n  color: var(--paragraph-text);\n  line-height: 1.65;\n}\n.host-state,\n.grid article {\n  padding: 1.2rem;\n  border: 1px solid var(--card-border);\n  border-radius: 1.4rem;\n  background: var(--card-bg);\n  box-shadow: 0 16px 40px rgba(154, 52, 18, 0.1);\n}\n.host-state dl,\n.grid {\n  display: grid;\n  gap: 0.9rem;\n}\n.host-state dl {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  margin: 1rem 0 0;\n}\n.grid {\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n}\ndt,\nh3 {\n  color: #c2410c;\n  font-weight: 900;\n}\ndd {\n  margin: 0.25rem 0 0;\n}\n@media (max-width: 640px) {\n  .host-state dl {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=staybook-page.component.css.map */\n'], encapsulation: 3 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassDebugInfo(StaybookPageComponent, { className: "StaybookPageComponent", filePath: "frontend/src/app/features/staybook/components/staybook-page/staybook-page.component.ts", lineNumber: 10 });
})();

// frontend/src/app/app.component.ts
import * as i03 from "@angular/core";
var App = class _App {
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ i03.\u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 1, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      i03.\u0275\u0275element(0, "app-staybook-page");
    }
  }, dependencies: [StaybookPageComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=app.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassDebugInfo(App, { className: "App", filePath: "frontend/src/app/app.component.ts", lineNumber: 11 });
})();
export {
  App
};
//# sourceMappingURL=Component.js.map
