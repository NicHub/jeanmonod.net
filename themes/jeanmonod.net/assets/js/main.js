function normalizeHostname(hostname) {
    return (hostname || "").replace(/^www\./, "").toLowerCase();
}

function getInternalHosts() {
    const hosts = new Set();
    const currentHost = normalizeHostname(window.location.hostname);
    const configuredHost = normalizeHostname(document.body?.dataset.siteHost);

    if (currentHost) hosts.add(currentHost);
    if (configuredHost) hosts.add(configuredHost);

    return hosts;
}

function shouldOpenInNewWindow(anchor, internalHosts) {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return false;

    let url;
    try {
        url = new URL(href, window.location.href);
    } catch {
        return false;
    }

    if (!["http:", "https:"].includes(url.protocol)) return false;

    return !internalHosts.has(normalizeHostname(url.hostname));
}

function ensureNoopener(anchor) {
    const relValues = new Set((anchor.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    relValues.add("noopener");
    relValues.add("noreferrer");
    anchor.setAttribute("rel", Array.from(relValues).join(" "));
}

function decorateExternalLinks() {
    const internalHosts = getInternalHosts();
    const anchors = document.querySelectorAll("a[href]");

    anchors.forEach((anchor) => {
        if (!shouldOpenInNewWindow(anchor, internalHosts)) return;

        const target = anchor.getAttribute("target");
        if (!target || target === "_self") {
            anchor.setAttribute("target", "_blank");
        }

        if (anchor.getAttribute("target") === "_blank") {
            ensureNoopener(anchor);
        }
    });
}

function getPageNavHref(kind) {
    const link = document.querySelector(`[data-page-nav="${kind}"]`);
    return link ? link.getAttribute("href") : "";
}

function shouldIgnoreKeyNavigation(event) {
    const target = event.target;
    if (!target) return false;

    if (target.closest("input, textarea, select, button, [contenteditable='true']")) {
        return true;
    }

    return event.metaKey || event.ctrlKey || event.altKey;
}

function navigateTo(href) {
    if (!href) return;
    sessionStorage.setItem("hd-nav", "1");
    window.location.href = href;
}

function slugify(text) {
    return (text || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getTextWithoutFootnoteRefs(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll(".footnote-ref, sup[id^='fnref'], a[href^='#fn:']").forEach((ref) => ref.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
}

function getParentListItemLabel(li) {
    const firstParagraph = li.firstElementChild && li.firstElementChild.tagName === "P" ? li.firstElementChild : null;
    if (firstParagraph) {
        const paragraphText = getTextWithoutFootnoteRefs(firstParagraph);
        if (paragraphText) return paragraphText;
    }

    const firstStrong = li.querySelector("strong");
    if (firstStrong) {
        const strongText = getTextWithoutFootnoteRefs(firstStrong);
        if (strongText) return strongText;
    }

    return getTextWithoutFootnoteRefs(li);
}

function addParentListAnchors() {
    const parentItems = document.querySelectorAll(".article-body.prose > ol > li");

    parentItems.forEach((li, index) => {
        if (li.id) return;

        const label = getParentListItemLabel(li);
        const slug = slugify(label);
        li.id = slug || `item-${index + 1}`;

        const anchor = document.createElement("a");
        anchor.className = "list-anchor-link";
        anchor.href = `#${li.id}`;
        anchor.setAttribute("aria-label", `Lien vers ${label}`);
        anchor.textContent = "#";

        const firstParagraph = li.firstElementChild && li.firstElementChild.tagName === "P" ? li.firstElementChild : null;
        if (firstParagraph) {
            firstParagraph.append("\u00A0");
            firstParagraph.appendChild(anchor);
        } else {
            li.append("\u00A0");
            li.appendChild(anchor);
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.repeat || shouldIgnoreKeyNavigation(event)) return;

    if (event.key === "ArrowLeft") {
      const href = getPageNavHref("prev");
      if (href) {
        event.preventDefault();
        navigateTo(href);
      }
      return;
    }

    if (event.key === "ArrowRight") {
      const href = getPageNavHref("next");
      if (href) {
        event.preventDefault();
        navigateTo(href);
      }
      return;
    }

    if (event.key === "ArrowUp" && event.shiftKey) {
      const href = getPageNavHref("home") || "/";
      event.preventDefault();
      navigateTo(href);
      return;
    }

    if (event.key === "§") {
      const href = getPageNavHref("home") || "/";
      event.preventDefault();
      navigateTo(href);
    }
});

decorateExternalLinks();
addParentListAnchors();
