/* BLK Marketplace - correctifs (charger après le script principal) */
(function () {
  // 1) Publication : au moins une photo (l'ancien placeholder faisait planter l'envoi)
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#pubSubmit');
    if (!b) return;
    if (!document.querySelector('#publishPhotos .publish-thumb')) {
      e.stopImmediatePropagation(); e.preventDefault();
      showAlert('Ajoute au moins une photo.', 'error');
    }
  }, true);

  // 2) Photo illisible (HEIC...) : message clair
  var _ci = window.compressImage;
  if (_ci) window.compressImage = function () {
    return _ci.apply(this, arguments).catch(function (err) {
      showAlert('Photo illisible (HEIC ?). Essaie un JPG ou PNG.', 'error');
      throw err;
    });
  };

  // 3) Messages non lus : rafraîchir le compteur même hors de l'onglet Messages
  setInterval(function () {
    if (typeof currentUserId !== 'undefined' && currentUserId && authToken) loadMessages();
  }, 8000);

  // 4) Conversation ouverte = messages lus (le compteur ne remonte pas)
  var _lc = window.loadConversation;
  if (_lc) window.loadConversation = function (id) {
    var r = _lc.apply(this, arguments);
    setTimeout(function () { if (activeConversationId === id) markContactRead(id); }, 1500);
    return r;
  };
})();
