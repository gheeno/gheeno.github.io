/* Noodle landing — the copy button on the install block. No dependencies.
   Nothing else on the page needs JavaScript: the bowl's steam is CSS inside
   the SVG, and the cursor blink is CSS in the stylesheet. */
(function () {
  'use strict';

  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    var source = document.querySelector(btn.getAttribute('data-copy'));
    if (!source) return;

    var idle = btn.textContent;
    var timer;

    function flash(label) {
      btn.textContent = label;
      btn.classList.add('is-copied');
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        btn.textContent = idle;
        btn.classList.remove('is-copied');
      }, 1600);
    }

    /* execCommand is the fallback for file:// and any other non-secure
       context, where navigator.clipboard is simply absent. */
    function legacyCopy(text) {
      var pad = document.createElement('textarea');
      pad.value = text;
      pad.setAttribute('readonly', '');
      pad.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(pad);
      pad.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(pad);
      return ok;
    }

    btn.addEventListener('click', function () {
      var text = source.textContent.replace(/\s+$/, '');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { flash('copied'); },
          function () { flash(legacyCopy(text) ? 'copied' : 'press ⌘C'); }
        );
        return;
      }

      flash(legacyCopy(text) ? 'copied' : 'press ⌘C');
    });
  });
})();
