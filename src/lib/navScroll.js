// Smooth-scrolls to a section while pushing a hash history entry so the
// Android back button walks back through sections instead of exiting.
export function navigateToSection(target) {
  const el = document.getElementById(target);
  if (el) {
    try {
      history.pushState({ section: target }, "", `#${target}`);
    } catch (e) {}
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}