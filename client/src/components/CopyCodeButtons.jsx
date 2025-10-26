import { useEffect } from "react";
import Prism from "prismjs";

export default function CopyCodeButtons({ containerSelector = ".prose" }) {
  useEffect(() => {
    const addButtons = () => {
      const containers = document.querySelectorAll(containerSelector);
      containers.forEach((c) => {
        const pres = c.querySelectorAll("pre");
        pres.forEach((pre) => {
          // avoid double-inserting
          if (pre.querySelector(".code-copy-btn")) return;
          const btn = document.createElement("button");
          btn.innerText = "Copy";
          btn.className = "code-copy-btn";
          btn.onclick = async () => {
            const codeElem = pre.querySelector("code");
            if (!codeElem) return;
            const text = codeElem.innerText;
            try {
              await navigator.clipboard.writeText(text);
              btn.innerText = "Copied";
              setTimeout(() => (btn.innerText = "Copy"), 1200);
            } catch {
              btn.innerText = "Err";
            }
          };
          pre.style.position = "relative";
          pre.appendChild(btn);
        });
      });
      Prism.highlightAll();
    };

    // call once and also observe DOM for changes
    addButtons();

    const observer = new MutationObserver(() => addButtons());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [containerSelector]);

  return null;
}
