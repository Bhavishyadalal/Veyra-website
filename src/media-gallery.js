import { animate, inView } from "motion";
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reduced.matches)
  inView(
    ".asset",
    (element) => {
      animate(
        element,
        { opacity: [0.6, 1], y: [12, 0] },
        { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      );
    },
    { amount: 0.1 },
  );
document.documentElement.classList.add("enhanced");
for (const button of document.querySelectorAll("[data-filter]"))
  button.addEventListener("click", () => {
    const filter = button.dataset.filter.split(",");
    for (const b of document.querySelectorAll("[data-filter]"))
      b.setAttribute("aria-pressed", String(b === button));
    for (const card of document.querySelectorAll(".asset"))
      card.hidden =
        filter[0] !== "all" && !filter.includes(card.dataset.category);
  });
const dialog = document.createElement("dialog");
dialog.setAttribute("aria-labelledby", "media-modal-title");
dialog.innerHTML =
  '<div class="modal-bar"><span class="modal-title" id="media-modal-title"></span><button type="button" aria-label="Close image preview">×</button></div><div class="checker"><img alt=""></div>';
document.body.append(dialog);
const image = dialog.querySelector("img"),
  title = dialog.querySelector(".modal-title");
for (const link of document.querySelectorAll("[data-preview]"))
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    title.textContent = link.dataset.title;
    image.src = link.href;
    image.alt = link.querySelector("img").alt;
    dialog.showModal();
  });
dialog.querySelector("button").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
