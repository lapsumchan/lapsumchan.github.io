"use strict";
document.querySelectorAll("div.sourceCode").forEach((box, index) => {
  const code = box.querySelector("pre code");
  if (!code) return;
  box.classList.add("code-box");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-code";
  button.textContent = "Copy R code";
  button.setAttribute("aria-label", "Copy R code block " + (index + 1));
  const status = document.createElement("span");
  status.className = "copy-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  box.insertBefore(button, box.firstChild);
  box.insertBefore(status, button.nextSibling);
  button.addEventListener("click", async () => {
    const text = code.textContent;
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); copied = true; } catch (_) {}
    }
    if (!copied) {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      try { copied = document.execCommand("copy"); } catch (_) {}
      field.remove();
      button.focus();
    }
    if (copied) {
      button.textContent = "Copied";
      status.textContent = "R code copied to the clipboard.";
    } else {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Code selected";
      status.textContent = "Clipboard access was blocked. Code selected; use your keyboard copy command.";
    }
    window.setTimeout(() => { button.textContent = "Copy R code"; }, 2500);
  });
});
