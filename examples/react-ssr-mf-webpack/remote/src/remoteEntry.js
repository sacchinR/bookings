(function initRemote(global) {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function FancyCard(props) {
    var title = escapeHtml((props && props.title) || 'Untitled');
    var body = escapeHtml((props && props.body) || '');

    return '<article style="border:2px solid #22c55e;padding:16px;border-radius:10px;background:#f0fdf4;">' +
      '<h2 style="margin-top:0;">' + title + '</h2>' +
      '<p style="margin-bottom:0;">' + body + '</p>' +
      '</article>';
  }

  global.remoteApp = {
    get: function get(moduleName) {
      if (moduleName === './FancyCard') {
        return function factory() {
          return { default: FancyCard };
        };
      }

      throw new Error('Unknown module: ' + moduleName);
    },
    init: function init() {}
  };
})(window);
