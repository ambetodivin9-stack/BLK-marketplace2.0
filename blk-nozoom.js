/* BLK - Désactive le zoom (pincement + double tap + zoom auto dans les champs) sur iOS */
(function () {
  // 1) CSS : bloque le pincement et le double-tap, et empêche le zoom auto des champs (iOS zoome si police < 16px)
  var css =
    'html,body{touch-action:pan-x pan-y;-webkit-text-size-adjust:100%;text-size-adjust:100%;}' +
    'input,select,textarea{font-size:16px !important;}';
  var style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  // 2) Safari iOS ignore user-scalable=no : on bloque les gestes de pincement à la main
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (type) {
    document.addEventListener(type, function (e) { e.preventDefault(); }, { passive: false });
  });
  document.addEventListener('touchmove', function (e) {
    if ((e.touches && e.touches.length > 1) || (e.scale && e.scale !== 1)) e.preventDefault();
  }, { passive: false });
})();
