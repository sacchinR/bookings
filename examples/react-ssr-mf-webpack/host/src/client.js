(function hydrateRemote() {
  var bootData = window.__BOOT_DATA__;

  function renderRemoteClientCard() {
    if (!window.remoteApp || typeof window.remoteApp.get !== 'function') {
      return;
    }

    var factory = window.remoteApp.get('./FancyCard');
    var module = factory();
    var FancyCard = module.default;
    var slot = document.getElementById('remote-slot');

    if (slot && FancyCard) {
      slot.innerHTML = FancyCard(bootData);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderRemoteClientCard);
  } else {
    renderRemoteClientCard();
  }
})();
