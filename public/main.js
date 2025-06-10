document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");

  if (location.pathname !== "/") {
    localStorage.setItem("pathname", location.pathname);
    location.href = "/";
    return;
  }


  const storedPath = localStorage.getItem("pathname");
  if (location.pathname === "/" && storedPath) {
    // 等一下再滑入
    setTimeout(async () => {
      const res = await fetch(storedPath);
      const html = await res.text();
      const content = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1];
      
      if (content) {
        overlay.innerHTML = content;
        overlay.classList.remove("translate-x-full");
      }
      history.pushState({ overlay: true }, "", storedPath);
      localStorage.removeItem("pathname");
    }, 10);
  }

  document.body.addEventListener("click", async (e) => {
    const link = e.target.closest(".overlay-link");
    if (!link) return;

    e.preventDefault();
    const href = link.getAttribute("href");

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

  window.addEventListener("popstate", (e) => {
    if (!e.state?.overlay) {
      overlay.classList.add("translate-x-full");
    }
  });
});
