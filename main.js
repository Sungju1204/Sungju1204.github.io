/* =========================================================
   임성주 포트폴리오 — main.js (외부 라이브러리 없음)
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---------- 다크 모드 ---------- */
  var themeBtn = document.getElementById('themeBtn');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark() ? '#0e1015' : '#f6f5f1');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeColor();
    });
  }
  syncThemeColor();

  /* ---------- 내비게이션: 스크롤 테두리 + 현재 섹션 표시 ---------- */
  var nav = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute('href'));
      if (sec) secObs.observe(sec);
    });
  }

  /* ---------- 스크롤 등장 애니메이션 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 탭 ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (box, bi) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(box.querySelectorAll('[role="tabpanel"]'));
    tabs.forEach(function (tab, i) {
      var tid = 'tab-' + bi + '-' + i, pid = 'panel-' + bi + '-' + i;
      tab.id = tid; tab.setAttribute('aria-controls', pid);
      tab.tabIndex = i === 0 ? 0 : -1;
      if (panels[i]) { panels[i].id = pid; panels[i].setAttribute('aria-labelledby', tid); }
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
          select(n); tabs[n].focus();
        }
      });
    });
    function select(n) {
      tabs.forEach(function (t, i) {
        var on = i === n;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (panels[i]) panels[i].hidden = !on;
      });
    }
  });

  /* ---------- 스크린샷 갤러리: 없는 이미지는 숨기고, 클릭하면 확대 ---------- */
  document.querySelectorAll('[data-gallery]').forEach(function (g) {
    Array.prototype.slice.call(g.querySelectorAll('img')).forEach(function (img) {
      function ok() { img.style.display = ''; g.classList.add('has-img'); }
      function fail() { img.style.display = 'none'; }
      if (img.complete) { if (img.naturalWidth > 0) ok(); else fail(); }
      img.addEventListener('load', ok);
      img.addEventListener('error', fail);
      img.addEventListener('click', function () { openLightbox(img); });
    });
  });
  function openLightbox(img) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', img.alt || '이미지 확대');
    var big = document.createElement('img');
    big.src = img.src; big.alt = img.alt;
    box.appendChild(big);
    function close() { box.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    box.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(box);
  }

  /* ---------- Homography 데모 ----------
     평면의 네 꼭짓점(src)을 사용자가 옮긴 네 점(dst)에 대응시키는
     3x3 행렬 H를 8원 1차 연립방정식으로 풀고, CSS matrix3d로 적용합니다. */
  var stage = document.getElementById('homoStage');
  var plane = document.getElementById('homoPlane');
  var out = document.getElementById('homoMatrix');
  var resetBtn = document.getElementById('homoReset');
  if (stage && plane && out) {
    var PW = 240, PH = 150;
    var INIT = [[0.14, 0.2], [0.84, 0.1], [0.9, 0.86], [0.2, 0.78]];
    var pts = INIT.map(function (p) { return p.slice(); });
    var handles = Array.prototype.slice.call(stage.querySelectorAll('.homo__pt'));

    function solve(A, b) {
      var n = b.length, i, j, k;
      for (i = 0; i < n; i++) A[i] = A[i].concat([b[i]]);
      for (i = 0; i < n; i++) {
        var max = i;
        for (k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[max][i])) max = k;
        var tmp = A[i]; A[i] = A[max]; A[max] = tmp;
        if (Math.abs(A[i][i]) < 1e-12) return null;
        for (k = i + 1; k < n; k++) {
          var f = A[k][i] / A[i][i];
          for (j = i; j <= n; j++) A[k][j] -= f * A[i][j];
        }
      }
      var x = new Array(n);
      for (i = n - 1; i >= 0; i--) {
        var s = A[i][n];
        for (j = i + 1; j < n; j++) s -= A[i][j] * x[j];
        x[i] = s / A[i][i];
      }
      return x;
    }

    function homography(src, dst) {
      var A = [], b = [];
      for (var i = 0; i < 4; i++) {
        var x = src[i][0], y = src[i][1], u = dst[i][0], v = dst[i][1];
        A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
        A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
      }
      var h = solve(A, b);
      return h ? h.concat([1]) : null;
    }

    function fmt(n) { var s = n.toFixed(3); return (n >= 0 ? ' ' : '') + s; }

    function render() {
      var W = stage.clientWidth, H = stage.clientHeight;
      var dst = pts.map(function (p) { return [p[0] * W, p[1] * H]; });
      handles.forEach(function (el, i) {
        el.style.left = dst[i][0] + 'px';
        el.style.top = dst[i][1] + 'px';
      });
      var h = homography([[0, 0], [PW, 0], [PW, PH], [0, PH]], dst);
      if (!h) return;
      plane.style.transform = 'matrix3d(' + [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, h[8]].join(',') + ')';
      out.textContent =
        'H = ⎡' + fmt(h[0]) + ' ' + fmt(h[1]) + ' ' + fmt(h[2]).padStart(9) + ' ⎤\n' +
        '    ⎢' + fmt(h[3]) + ' ' + fmt(h[4]) + ' ' + fmt(h[5]).padStart(9) + ' ⎥\n' +
        '    ⎣' + fmt(h[6]) + ' ' + fmt(h[7]) + ' ' + fmt(h[8]).padStart(9) + ' ⎦';
    }

    handles.forEach(function (el) {
      var i = +el.getAttribute('data-i');
      el.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        function move(ev) {
          var r = stage.getBoundingClientRect();
          pts[i] = [
            Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)),
            Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height))
          ];
          render();
        }
        function up() {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', up);
          el.removeEventListener('pointercancel', up);
        }
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
      });
      // 키보드로도 조작 가능 (방향키)
      el.addEventListener('keydown', function (e) {
        var d = { ArrowLeft: [-0.02, 0], ArrowRight: [0.02, 0], ArrowUp: [0, -0.02], ArrowDown: [0, 0.02] }[e.key];
        if (!d) return;
        e.preventDefault();
        pts[i] = [Math.min(1, Math.max(0, pts[i][0] + d[0])), Math.min(1, Math.max(0, pts[i][1] + d[1]))];
        render();
      });
    });

    if (resetBtn) resetBtn.addEventListener('click', function () {
      pts = INIT.map(function (p) { return p.slice(); });
      render();
    });
    window.addEventListener('resize', render);
    render();
  }
})();
