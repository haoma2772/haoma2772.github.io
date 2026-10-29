(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-navigation')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

  // Scroll after the mobile menu has closed and its layout has settled.
  const sectionForHash = hash => {
    try { return hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null; }
    catch { return null; }
  };
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    const section = sectionForHash(url.hash);
    if (!section) return;
    event.preventDefault();
    closeMenu();
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
    requestAnimationFrame(() => {
      section.setAttribute('tabindex', '-1');
      section.focus({preventScroll:true});
      section.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
    });
  });
  window.addEventListener('popstate', () => {
    const section = sectionForHash(location.hash);
    if (section) section.scrollIntoView({behavior:'instant', block:'start'});
  });

  if (document.body.classList.contains('home-page')) {
    const sectionLinks = [...menu.querySelectorAll('a')].map(link => {
      const target = new URL(link.href);
      return {link, section: target.pathname === location.pathname ? document.getElementById(target.hash.slice(1)) : null};
    }).filter(item => item.section);
    let scheduled = false;
    const updateActiveSection = () => {
      let active = sectionLinks[0];
      sectionLinks.forEach(item => {
        if (item.section.getBoundingClientRect().top <= 170) active = item;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5) {
        const requested = sectionLinks.find(item => item.section.id === location.hash.slice(1));
        const visibleRequest = requested && requested.section.getBoundingClientRect().top >= 0 && requested.section.getBoundingClientRect().top < window.innerHeight * 0.75;
        active = visibleRequest ? requested : sectionLinks[sectionLinks.length - 1];
      }
      sectionLinks.forEach(item => {
        const current = item === active;
        item.link.classList.toggle('is-active', current);
        if (current) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      });
      scheduled = false;
    };
    window.addEventListener('scroll', () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateActiveSection);
      }
    }, {passive:true});
    window.addEventListener('resize', updateActiveSection);
    window.addEventListener('hashchange', updateActiveSection);
    updateActiveSection();
  }

  const contactStatus = document.querySelector('.contact-status');
  document.querySelectorAll('.copy-email').forEach(button => {
    const label = button.getAttribute('aria-label');
    let reset;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.email);
        clearTimeout(reset);
        button.dataset.copied = 'true';
        button.setAttribute('aria-label', 'Email address copied');
        button.title = 'Copied';
        contactStatus.textContent = `${button.dataset.email} copied to clipboard.`;
        reset = setTimeout(() => {
          delete button.dataset.copied;
          button.setAttribute('aria-label', label);
          button.title = label;
        }, 2000);
      } catch {
        const address = button.closest('.email-contact').querySelector('.email-address');
        const range = document.createRange();
        range.selectNodeContents(address);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        contactStatus.textContent = 'Email address selected. Use your usual copy command.';
      }
    });
  });

  const viewer = document.getElementById('photo-viewer');
  if (viewer && typeof viewer.showModal === 'function') {
    const photos = [...document.querySelectorAll('a[data-gallery]')];
    const image = viewer.querySelector('figure img');
    const caption = viewer.querySelector('figcaption');
    caption.setAttribute('aria-live', 'polite');
    let current = 0;
    let opener;
    const showPhoto = index => {
      current = (index + photos.length) % photos.length;
      const photo = photos[current];
      image.src = photo.href;
      image.alt = photo.querySelector('img').alt;
      caption.textContent = `${photo.dataset.caption || image.alt} · ${current + 1} / ${photos.length}`;
    };
    photos.forEach((photo, index) => photo.addEventListener('click', event => {
      event.preventDefault();
      opener = photo;
      showPhoto(index);
      viewer.showModal();
      document.body.classList.add('viewer-open');
    }));
    viewer.querySelector('.viewer-prev').addEventListener('click', () => showPhoto(current - 1));
    viewer.querySelector('.viewer-next').addEventListener('click', () => showPhoto(current + 1));
    viewer.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {event.preventDefault(); showPhoto(current - 1);}
      if (event.key === 'ArrowRight') {event.preventDefault(); showPhoto(current + 1);}
    });
    viewer.addEventListener('click', event => {
      if (event.target === viewer) viewer.close();
    });
    viewer.addEventListener('close', () => {
      document.body.classList.remove('viewer-open');
      if (opener) opener.focus();
    });
  }
})();
