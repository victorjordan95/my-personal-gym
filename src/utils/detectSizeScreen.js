function isMobile() {
  return window.innerWidth < 768;
}

function isDesktop() {
  return window.innerWidth >= 768;
}

export { isMobile, isDesktop };
