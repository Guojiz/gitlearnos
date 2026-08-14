// GitLearnOS learning panel — browser client half.
//
// This file is the built client entry in the exact `window.__ModuleLoader__`
// module format the DeepSeek Harness web profile consumes (see shipped
// `@deepseek-ai/dsh-client-ui-*` bundles). It needs no build step: the web
// profile serves it straight from `exports["./client"]`.
//
// It only READS the agent-maintained queue through the `/gitlearnos` logical
// RPC channel registered by the Host half (`adapters/deepseek-harness/index.js`);
// it never writes learner state and never decides the order itself.
window.__ModuleLoader__.load({
  id: "gitlearnos",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react = require("react");

    const css = [
      ".gl-wrap{display:flex;justify-content:center}",
      ".gl-card{box-sizing:border-box;width:100%;max-width:560px;border:1px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-specific-tip,var(--dsw-alias-bg-layer-1));overflow:hidden}",
      ".gl-bar{display:flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none;transition:background .15s}",
      ".gl-bar:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.08))}",
      ".gl-bar-caret{font-size:10px;color:var(--dsw-alias-label-secondary)}",
      ".gl-item{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 16px;font-size:13px;color:var(--dsw-alias-label-primary);cursor:pointer;background:none;border:none;width:100%;text-align:left;border-top:1px solid var(--dsw-alias-border-l1)}",
      ".gl-item:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.08))}",
      ".gl-item-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".gl-item-verb{flex:none;font-size:11px;color:var(--dsw-alias-label-secondary)}",
      ".gl-back{padding:8px 16px;font-size:12px;color:var(--dsw-alias-brand-primary);cursor:pointer;background:none;border:none;border-top:1px solid var(--dsw-alias-border-l1)}",
      ".gl-op{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;font-size:13px;color:var(--dsw-alias-label-primary);cursor:pointer;background:none;border:none;width:100%;text-align:left;border-top:1px solid var(--dsw-alias-border-l1)}",
      ".gl-op:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.08))}",
      ".gl-op-arrow{color:var(--dsw-alias-label-secondary);font-size:10px}",
      ".gl-foot{padding:10px 16px;font-size:10px;color:var(--dsw-alias-label-secondary);opacity:.6;border-top:1px solid var(--dsw-alias-border-l1)}",
    ].join("");

    const inject = ["slots", "connection"];

    function apply(ctx) {
      const tag = document.createElement("style");
      tag.dataset.plugin = "gitlearnos";
      tag.textContent = css;
      document.head.appendChild(tag);
      ctx.effect(() => () => { tag.remove(); }, "gitlearnos: css");

      const readStatus = () => ctx.connection.rpc.call("/gitlearnos", "status", undefined);

      function Item(props) {
        return react.createElement("button", { className: "gl-item", onClick: props.onClick },
          react.createElement("span", { className: "gl-item-name" }, props.name),
          react.createElement("span", { className: "gl-item-verb" }, "(" + props.verb + ")"));
      }

      function Op(props) {
        return react.createElement("button", { className: "gl-op", onClick: props.onClick },
          react.createElement("span", null, props.label),
          react.createElement("span", { className: "gl-op-arrow" }, "→"));
      }

      function Dock(props) {
        const actions = props && props.inputActions;
        const [data, setData] = react.useState(null);
        const [error, setError] = react.useState(null);
        const [open, setOpen] = react.useState(false);
        const [active, setActive] = react.useState(null);

        react.useEffect(() => {
          let alive = true;
          async function load() {
            try {
              const result = await readStatus();
              if (!alive) return;
              if (result && result.ok) {
                setData(result.value);
                setError(null);
              } else {
                setError((result && result.error && result.error.message) || "读取失败");
              }
            } catch (err) {
              if (alive) setError(String((err && err.message) || err));
            }
          }
          load();
          const timer = window.setInterval(load, 30000);
          return () => {
            alive = false;
            window.clearInterval(timer);
          };
        }, []);

        function ask(text) {
          if (actions && typeof actions.setDraft === "function") actions.setDraft(text);
        }

        if (error !== null) {
          return react.createElement("div", { className: "gl-wrap" },
            react.createElement("div", { className: "gl-card" },
              react.createElement("div", { className: "gl-bar" }, "GitLearnOS：" + error)));
        }
        if (data === null) {
          return react.createElement("div", { className: "gl-wrap" },
            react.createElement("div", { className: "gl-card" },
              react.createElement("div", { className: "gl-bar" }, "GitLearnOS")));
        }

        const bar = react.createElement("div", {
          className: "gl-bar",
          onClick: () => { setOpen(!open); setActive(null); },
        }, "GitLearnOS", react.createElement("span", { className: "gl-bar-caret" }, open ? "▾" : "▸"));

        let body = null;
        if (open) {
          if (active) {
            const ops = [
              { label: "复习一遍", prompt: "请带我复习「" + active + "」" },
              { label: "做几道题", prompt: "请给我出几道关于「" + active + "」的题" },
              { label: "问老师", prompt: "请帮我准备关于「" + active + "」要问老师的问题" },
              { label: "看我的笔记", prompt: "请展示我关于「" + active + "」的笔记和模型" },
            ];
            body = [react.createElement("button", {
              key: "b",
              className: "gl-back",
              onClick: () => setActive(null),
            }, "← " + active)].concat(ops.map(o => react.createElement(Op, {
              key: o.label,
              label: o.label,
              onClick: () => ask(o.prompt),
            })));
          } else if (!data.topics || data.topics.length === 0) {
            body = react.createElement("div", { key: "e", className: "gl-item" }, "暂无内容");
          } else {
            body = data.topics.map(t => react.createElement(Item, {
              key: t.name,
              name: t.name,
              verb: t.verb,
              onClick: () => setActive(t.name),
            }));
          }
        }

        const foot = open ? react.createElement("div", { className: "gl-foot" },
          (data.isSample ? "演示数据 · " : "") + (data.queueMaintained ? "" : "Agent 尚未维护队列，当前为自动收集 · ") + "顺序由 Agent 判断") : null;

        return react.createElement("div", { className: "gl-wrap" },
          react.createElement("div", { className: "gl-card" }, bar, body, foot));
      }

      ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
        name: "conversation.input.dock",
        id: "gitlearnos",
        order: 30,
      }, Dock));
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
