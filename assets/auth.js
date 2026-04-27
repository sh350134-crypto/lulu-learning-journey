(() => {
  const STORAGE_KEY = "luluLearningJourney:auth";
  const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

  function now() {
    return Date.now();
  }

  function readAuth() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      if (typeof parsed.loggedInAt !== "number") return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function writeAuth(payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function isLoggedIn() {
    const data = readAuth();
    if (!data) return false;
    const age = now() - data.loggedInAt;
    if (age < 0) return false;
    return age <= TTL_MS;
  }

  function login(inputPassword, expectedPassword) {
    if (String(inputPassword || "") !== String(expectedPassword || "")) return false;
    writeAuth({ loggedInAt: now() });
    return true;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function requireLogin() {
    if (isLoggedIn()) return;

    const here = window.location.pathname.split("/").pop() || "";
    const isIndex = here === "" || here.toLowerCase() === "index.html";
    if (!isIndex) {
      window.location.replace(
        window.location.pathname.includes("/alphatracker/")
          ? "../index.html"
          : "./index.html",
      );
    }
  }

  window.Auth = {
    isLoggedIn,
    login,
    logout,
    requireLogin,
  };
})();

