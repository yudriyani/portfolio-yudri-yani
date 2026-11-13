(function () {
  "use strict";

  /* ---------- Data yang mudah diubah ---------- */
  const ROLES = ["Front-End Developer", "Web Developer", "UI Enthusiast"];
  const SKILLS_ROW_1 = ["HTML", "CSS", "PHP", "Laravel", "Node.js", "MySQL"];
  const SKILLS_ROW_2 = ["PostgreSQL", "Docker", "Flutter", "Figma", "Canva", "Draw.io"];

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Nama: huruf naik satu per satu ---------- */
  function splitName() {
    const el = document.getElementById("nm");
    const words = el.textContent.split(" ");
    let index = 0;

    el.setAttribute("aria-label", words.join(" "));
    el.textContent = "";

    words.forEach(function (word) {
      const wrap = document.createElement("span");
      wrap.className = "w";
      wrap.setAttribute("aria-hidden", "true");

      word.split("").forEach(function (letter) {
        const ch = document.createElement("span");
        ch.className = "ch";
        ch.style.setProperty("--i", index++);
        ch.textContent = letter;
        wrap.appendChild(ch);
      });

      el.appendChild(wrap);
    });
  }

  /* ---------- 2. Teks peran diketik bergantian ---------- */
  function typeRoles() {
    const el = document.getElementById("role");
    let roleIndex = 0;
    let charCount = 0;
    let deleting = false;

    function tick() {
      const text = ROLES[roleIndex];

      if (reduceMotion) {
        el.textContent = text;
        return;
      }

      charCount += deleting ? -1 : 1;
      el.textContent = text.slice(0, charCount);

      let delay = deleting ? 40 : 90;
      if (!deleting && charCount === text.length) {
        deleting = true;
        delay = 1400;          // jeda setelah selesai mengetik
      } else if (deleting && charCount === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % ROLES.length;
        delay = 300;
      }
      setTimeout(tick, delay);
    }

    setTimeout(tick, reduceMotion ? 0 : 1000);
  }

  /* ---------- 3. Baris skill yang berjalan ---------- */
  function buildSkills() {
    function row(list, extraClass) {
      // digandakan 4x supaya animasi berulang tanpa celah
      const chips = list.concat(list, list, list)
        .map(function (name) { return '<span class="chip">' + name + "</span>"; })
        .join("");
      return '<div class="track ' + extraClass + '">' + chips + "</div>";
    }
    document.getElementById("marquee").innerHTML =
      row(SKILLS_ROW_1, "") + row(SKILLS_ROW_2, "rev");
  }

  /* ---------- 4. Muncul saat di-scroll ---------- */
  function revealOnScroll() {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(".rv").forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 5. Garis progres scroll ---------- */
  function scrollProgress() {
    const bar = document.getElementById("bar");

    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight || 1;
      bar.style.transform = "scaleX(" + doc.scrollTop / max + ")";
    }

    addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- 6. Cahaya kursor dan kartu miring (hanya untuk mouse) ---------- */
  function pointerEffects() {
    if (reduceMotion || !matchMedia("(pointer: fine)").matches) return;

    const glow = document.getElementById("glow");
    addEventListener("pointermove", function (e) {
      glow.style.opacity = 1;
      glow.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
    });

    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        const box = card.getBoundingClientRect();
        const x = (e.clientX - box.left) / box.width - 0.5;
        const y = (e.clientY - box.top) / box.height - 0.5;
        card.style.setProperty("--ry", x * 10 + "deg");
        card.style.setProperty("--rx", -y * 10 + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- 7. Animasi kartu sertifikat ---------- */
  function certEffects() {
    const cards = document.querySelectorAll(".cert");
    if (!cards.length) return;

    // buat kilau dan lencana otomatis (kalau belum ada di HTML)
    cards.forEach(function (card) {
      if (card.querySelector(".seal")) return;

      const shine = document.createElement("span");
      shine.className = "shine";
      shine.setAttribute("aria-hidden", "true");

      const seal = document.createElement("span");
      seal.className = "seal";
      seal.setAttribute("aria-hidden", "true");
      seal.textContent = "✓";

      card.prepend(shine, seal);
    });

    // lencana "distempel" saat kartu terlihat di layar
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("pop");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    cards.forEach(function (card) { observer.observe(card); });

    // cahaya lembut mengikuti kursor di dalam kartu (hanya untuk mouse)
    if (reduceMotion || !matchMedia("(pointer: fine)").matches) return;

    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        const box = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - box.left) + "px");
        card.style.setProperty("--my", (e.clientY - box.top) + "px");
      });
    });
  }

  /* ---------- Jalankan semuanya ---------- */
  splitName();
  typeRoles();
  buildSkills();
  revealOnScroll();
  scrollProgress();
  pointerEffects();
  certEffects();
})();