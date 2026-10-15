(function () {
  'use strict';

  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia('(min-width: 1000px)');

  /* ano no rodapé */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* rastreio de cliques (GA4 / Meta Pixel / GTM leem o dataLayer) */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (!a) return;
    var name = a.getAttribute('data-track');
    window.dataLayer.push({ event: 'contato_click', canal: name.split('_')[0], posicao: name });
    if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { method: name });
    if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { content_name: name });
  });

  /* copiar telefone */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var txt = btn.getAttribute('data-copy');
      var done = function () {
        btn.textContent = 'Copiado';
        setTimeout(function () { btn.textContent = 'Copiar'; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, function () { selectText(btn.previousElementSibling); });
      } else {
        selectText(btn.previousElementSibling);
      }
    });
  });
  function selectText(el) {
    if (!el) return;
    var r = document.createRange();
    r.selectNodeContents(el);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  /* header + barra mobile + progresso */
  var top = document.querySelector('.top');
  var dock = document.querySelector('.dock');
  var hero = document.querySelector('.hero');
  var prog = document.querySelector('.top__progress');
  function onScrollUi() {
    var y = window.scrollY;
    if (top) top.classList.toggle('is-scrolled', y > 8);
    if (dock && hero) dock.classList.toggle('is-up', y > hero.offsetHeight * 0.6);
    if (prog) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    }
  }

  /* revelar ao rolar */
  var rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add('in'); });
  }

  /* quadro de disjuntores */
  var brks = Array.prototype.slice.call(document.querySelectorAll('.brk'));
  var rows = Array.prototype.slice.call(document.querySelectorAll('.dir li'));
  var count = document.querySelector('.qdc__count');
  function updateCount() {
    if (!count) return;
    var on = brks.filter(function (b) { return b.classList.contains('is-on'); }).length;
    count.textContent = on + '/6 ligados';
  }
  function pair(c) {
    return {
      b: document.querySelector('.brk[data-c="' + c + '"]'),
      r: document.querySelector('.dir li[data-c="' + c + '"]')
    };
  }
  brks.forEach(function (b) {
    b.addEventListener('click', function () {
      b.classList.toggle('is-on');
      updateCount();
    });
    b.addEventListener('mouseenter', function () { var p = pair(b.dataset.c); if (p.r) p.r.classList.add('is-hot'); });
    b.addEventListener('mouseleave', function () { var p = pair(b.dataset.c); if (p.r) p.r.classList.remove('is-hot'); });
  });
  rows.forEach(function (r) {
    r.addEventListener('mouseenter', function () {
      var p = pair(r.dataset.c);
      if (!p.b) return;
      p.b.classList.add('is-hot', 'is-on');
      updateCount();
    });
    r.addEventListener('mouseleave', function () { var p = pair(r.dataset.c); if (p.b) p.b.classList.remove('is-hot'); });
  });
  var qdc = document.querySelector('.qdc');
  function switchAllOn() {
    brks.forEach(function (b, i) {
      setTimeout(function () { b.classList.add('is-on'); updateCount(); }, reduce ? 0 : 260 + i * 170);
    });
  }
  if (qdc && 'IntersectionObserver' in window) {
    var qio = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { switchAllOn(); qio.disconnect(); }
    }, { threshold: 0.45 });
    qio.observe(qdc);
  } else {
    switchAllOn();
  }

  /* ---------- o cabo ---------- */
  var main = document.querySelector('main');
  var layer = document.querySelector('.cable');
  var svg = layer && layer.querySelector('svg');
  var track = svg && svg.querySelector('.cable__track');
  var wire = svg && svg.querySelector('.cable__wire');
  var shade = svg && svg.querySelector('.cable__shade');
  var glow = svg && svg.querySelector('.cable__glow');
  var nodesG = svg && svg.querySelector('.cable__nodes');
  var plug = svg && svg.querySelector('.cable__plug');
  var logo = document.getElementById('logo-plug');
  var socket = document.querySelector('.socket svg');
  var contact = document.getElementById('contato');
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-node]'));

  var total = 0;
  var samples = [];
  var nodes = [];
  var active = false;
  var ticking = false;

  function rel(el) {
    var r = el.getBoundingClientRect();
    var m = main.getBoundingClientRect();
    return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height };
  }

  function build() {
    active = desktop.matches && !!svg && !!logo && !!socket;
    sections.forEach(function (s) { s.classList.toggle('is-energized', !active); });
    if (contact) contact.classList.toggle('is-powered', !active);
    if (!active) return;

    var L = rel(logo);
    var S = rel(socket);
    var sx = L.x + L.w * 0.285;          // pontas do plugue do logo
    var sy = L.y + L.h * 0.878;
    var rx = S.x + S.w / 2;              // eixo da calha
    var ey = S.y + S.h * 0.46 - 6;       // pinos do plugue entram nos furos da tomada

    var d = 'M' + sx + ' ' + sy +
      ' C' + (sx - 110) + ' ' + sy + ' ' + (sx - 120) + ' ' + (sy + 150) + ' ' + ((sx + rx) / 2 - 20) + ' ' + (sy + 170) +
      ' S' + rx + ' ' + (sy + 200) + ' ' + rx + ' ' + (sy + 320) +
      ' L' + rx + ' ' + ey;

    [track, shade, wire, glow].forEach(function (p) { p.setAttribute('d', d); });
    total = wire.getTotalLength();
    [shade, wire, glow].forEach(function (p) {
      p.style.strokeDasharray = total + ' ' + total;
    });

    samples = [];
    for (var l = 0; l <= total; l += 8) samples.push([l, wire.getPointAtLength(l).y]);
    samples.push([total, wire.getPointAtLength(total).y]);

    nodesG.innerHTML = '';
    nodes = sections.filter(function (s) { return s !== contact; }).map(function (s) {
      var head = s.querySelector('.eyebrow') || s;
      var y = rel(head).y + 10;
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'cable__node');
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', rx);
      c.setAttribute('cy', y);
      c.setAttribute('r', 7);
      g.appendChild(c);
      nodesG.appendChild(g);
      return { y: y, el: g, sec: s };
    });
    nodes.push({ y: ey, el: null, sec: contact, end: true });
    draw();
  }

  function lengthAtY(y) {
    var lo = 0, hi = samples.length - 1;
    if (y <= samples[0][1]) return 0;
    if (y >= samples[hi][1]) return total;
    while (hi - lo > 1) {
      var mid = (lo + hi) >> 1;
      if (samples[mid][1] < y) lo = mid; else hi = mid;
    }
    var a = samples[lo], b = samples[hi];
    var t = (y - a[1]) / ((b[1] - a[1]) || 1);
    return a[0] + (b[0] - a[0]) * t;
  }

  function draw() {
    ticking = false;
    if (!active) return;
    var mainTop = main.getBoundingClientRect().top;
    var tipY = reduce ? Infinity : window.innerHeight * 0.62 - mainTop;
    var len = reduce ? total : Math.max(0.001, lengthAtY(tipY));
    var off = total - len;
    wire.style.strokeDashoffset = off;
    shade.style.strokeDashoffset = off;
    glow.style.strokeDashoffset = off;

    var p = wire.getPointAtLength(len);
    var q = wire.getPointAtLength(Math.max(0, len - 2));
    var ang = Math.atan2(p.y - q.y, p.x - q.x) * 180 / Math.PI - 90;
    if (len < 3) ang = 90; // começa apontando pra esquerda, como no logo
    plug.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ') rotate(' + ang + ')');
    plug.style.opacity = len < 24 ? 0 : 1;

    var tipNow = p.y;
    nodes.forEach(function (n) {
      var on = len >= total - 1 ? true : tipNow >= n.y;
      if (n.end) on = len >= total - 1;
      if (n.el) n.el.classList.toggle('is-on', on);
      if (n.sec) {
        if (n.end) n.sec.classList.toggle('is-powered', on);
        n.sec.classList.toggle('is-energized', on);
      }
    });
  }

  function requestDraw() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener('scroll', function () { onScrollUi(); requestDraw(); }, { passive: true });
  var rto;
  window.addEventListener('resize', function () {
    clearTimeout(rto);
    rto = setTimeout(function () { build(); onScrollUi(); }, 120);
  });
  if (desktop.addEventListener) desktop.addEventListener('change', build);

  function init() { build(); onScrollUi(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(init);
  window.addEventListener('load', init);
  init();
  /* a altura da página muda quando as FAQs abrem */
  document.querySelectorAll('.faq details').forEach(function (d) { d.addEventListener('toggle', build); });
})();
