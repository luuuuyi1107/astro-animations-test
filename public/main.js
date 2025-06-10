document.addEventListener("DOMContentLoaded", () => {

  if (location.pathname !== "/") {
    location.href = "/";
  }
  
  const overlay = document.getElementById("overlay");

  // 點擊 overlay-link 時攔截
  document.body.addEventListener("click", async (e) => {
    const link = e.target.closest(".overlay-link");
    if (!link) return;

    e.preventDefault();
    const href = link.getAttribute("href");

    // 如果點擊的是首頁，就觸發滑出動畫
    if (href === "/") {
      overlay.classList.add("translate-x-full");
      history.pushState({}, "", href);
      return;
    }

    const res = await fetch(href);
    const html = await res.text();
    const content = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1];

    if (content) {
      overlay.innerHTML = content;
      overlay.classList.remove("translate-x-full");
    }

    history.pushState({ overlay: true }, "", href);
  });

  // popstate 處理：回首頁就滑出 overlay
  window.addEventListener("popstate", (e) => {
    if (!e.state?.overlay) {
      overlay.classList.add("translate-x-full");
    }
  });
});