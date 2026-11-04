'use strict';

(function () {
  const api = window.guide;
  document.getElementById('save').onclick = () => api.placeToast();
  document.getElementById('reset').onclick = () => api.resetToast();
  document.getElementById('cancel').onclick = () => api.cancelToastMove();
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') api.cancelToastMove();
    if (e.key === 'Enter') api.placeToast();
  });
})();
