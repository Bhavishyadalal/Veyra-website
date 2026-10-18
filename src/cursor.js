import "./styles/cursor.css";

// A native pearl point stays precise; the glass lens never intercepts input.
const fine = matchMedia("(any-pointer: fine) and (any-hover: hover)");
const contrast = matchMedia("(forced-colors: active)");
let dispose;
function update() {
  dispose?.();
  dispose = undefined;
  if (!fine.matches || contrast.matches) return;
  const root = document.documentElement;
  const ring = document.createElement("span");
  ring.className = "veyra-cursor-ring";
  ring.setAttribute("aria-hidden", "true");
  ring.dataset.state = "default";
  document.body.append(ring);
  let frame = 0,
    visible = false,
    pressed = false,
    x = 0,
    y = 0,
    targetX = 0,
    targetY = 0;
  function hide() {
    pressed = false;
    visible = false;
    ring.classList.remove("is-visible");
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function draw() {
    frame = 0;
    if (!visible) return;
    x = targetX;
    y = targetY;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
  function locate(event) {
    if (event.pointerType !== "mouse") {
      hide();
      return;
    }
    const target =
      event.target instanceof Element ? event.target : document.body;
    const host = target.closest("dialog[open]") || document.body;
    if (ring.parentNode !== host) host.append(ring);
    targetX = event.clientX;
    targetY = event.clientY;
    if (!visible) {
      x = targetX;
      y = targetY;
      visible = true;
      ring.classList.add("is-visible");
    }
    let state = "default";
    if (target.closest(':disabled,[aria-disabled="true"]')) state = "disabled";
    else if (target.closest('input[type="range"], [role="slider"]'))
      state = "range";
    else if (target.closest('input,textarea,[contenteditable="true"]'))
      state = "text";
    else if (target.closest('[data-cursor="drag"]')) state = "drag";
    else if (target.closest('a,button,summary,[role="button"],[role="tab"]'))
      state = "link";
    ring.dataset.state = state;
    ring.classList.toggle("is-pressed", pressed);
    if (!frame) frame = requestAnimationFrame(draw);
  }
  const down = (e) => {
    pressed = true;
    locate(e);
  };
  const up = (e) => {
    pressed = false;
    locate(e);
  };
  const leave = (e) => {
    if (!e.relatedTarget) hide();
  };
  const key = (e) => {
    if (["Tab", "Escape", "Enter", " "].includes(e.key)) hide();
  };
  const scroll = () => {
    if (!visible) return;
    const target = document.elementFromPoint(targetX, targetY);
    if (target)
      locate({
        pointerType: "mouse",
        target,
        clientX: targetX,
        clientY: targetY,
      });
  };
  const hidden = () => {
    if (document.hidden) hide();
  };
  const repair = new MutationObserver(() => {
    if (
      !ring.isConnected ||
      (ring.parentElement?.matches("dialog") && !ring.parentElement.open)
    ) {
      document.body.append(ring);
      hide();
    }
  });
  repair.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["open"],
  });
  const image = new Image();
  image.onload = () => root.classList.add("veyra-cursor");
  image.src = "/cursors/veyra-point.svg";
  document.addEventListener("pointermove", locate, { passive: true });
  document.addEventListener("pointerdown", down, { passive: true });
  document.addEventListener("pointerup", up, { passive: true });
  document.addEventListener("pointerout", leave, { passive: true });
  document.addEventListener("keydown", key);
  document.addEventListener("visibilitychange", hidden);
  window.addEventListener("blur", hide);
  document.addEventListener("pointercancel", hide, { passive: true });
  window.addEventListener("scroll", scroll, { passive: true, capture: true });
  dispose = () => {
    image.onload = null;
    root.classList.remove("veyra-cursor");
    hide();
    repair.disconnect();
    ring.remove();
    document.removeEventListener("pointermove", locate);
    document.removeEventListener("pointerdown", down);
    document.removeEventListener("pointerup", up);
    document.removeEventListener("pointerout", leave);
    document.removeEventListener("keydown", key);
    document.removeEventListener("visibilitychange", hidden);
    window.removeEventListener("blur", hide);
    document.removeEventListener("pointercancel", hide);
    window.removeEventListener("scroll", scroll, true);
  };
}
for (const media of [fine, contrast]) media.addEventListener("change", update);
update();
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    dispose?.();
    for (const media of [fine, contrast])
      media.removeEventListener("change", update);
  });
