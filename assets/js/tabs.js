document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".wrapper > section");
  if (!content) return;

  const headings = Array.from(content.children).filter(
    element => element.tagName === "H2"
  );

  if (headings.length < 2) return;

  const navigation = document.createElement("div");
  navigation.className = "academic-tabs";
  navigation.setAttribute("role", "tablist");
  navigation.setAttribute("aria-label", "Academic profile sections");

  content.insertBefore(navigation, headings[0]);

  const tabs = [];

  headings.forEach((heading, index) => {
    const sectionId = heading.id || `section-${index + 1}`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = heading.textContent;
    button.id = `tab-${sectionId}`;
    button.setAttribute("role", "tab");

    const panel = document.createElement("div");
    panel.id = `panel-${sectionId}`;
    panel.className = "academic-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", button.id);
    panel.tabIndex = 0;

    button.setAttribute("aria-controls", panel.id);

    content.insertBefore(panel, heading);

    // Move this heading and its content into its own panel.
    let node = heading;

    while (node) {
      if (node !== heading && node.nodeName === "H2") break;

      const next = node.nextSibling;
      panel.appendChild(node);
      node = next;
    }

    navigation.appendChild(button);
    tabs.push({ button, panel, sectionId });
  });

  function activate(index, focus = false) {
    tabs.forEach((tab, i) => {
      const selected = i === index;

      tab.button.setAttribute("aria-selected", String(selected));
      tab.button.tabIndex = selected ? 0 : -1;
      tab.panel.hidden = !selected;
    });

    if (focus) tabs[index].button.focus();
  }

  function selectFromHash() {
    const index = tabs.findIndex(
      tab => `#${tab.sectionId}` === window.location.hash
    );

    activate(index >= 0 ? index : 0);
  }

  tabs.forEach((tab, index) => {
    tab.button.addEventListener("click", () => {
      activate(index);
      history.replaceState(null, "", `#${tab.sectionId}`);
    });

    tab.button.addEventListener("keydown", event => {
      let next = index;

      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") {
        next = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;

      event.preventDefault();
      activate(next, true);
      history.replaceState(null, "", `#${tabs[next].sectionId}`);
    });
  });

  window.addEventListener("hashchange", selectFromHash);
  selectFromHash();
});
