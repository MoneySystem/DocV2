/* ═══════════════════════════════════════════════════════════════
   MoneySystem — Documentation Navigation & Interactivity
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const searchInput = document.querySelector('.sidebar-search input');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.doc-section');
  const breadcrumbCurrent = document.querySelector('.breadcrumb .current');
  const noResults = document.querySelector('.no-results');

  /* ─── Navigation ─── */
  function navigateTo(sectionId) {
    // Hide all sections
    sections.forEach(s => s.classList.remove('active'));

    // Show target section
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add('active');
    }

    // Update active nav item
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Update breadcrumb
    const activeItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (activeItem && breadcrumbCurrent) {
      breadcrumbCurrent.textContent = activeItem.querySelector('.nav-label')?.textContent || sectionId;
    }

    // Hide no results
    if (noResults) noResults.classList.remove('show');

    // Scroll content to top
    const contentArea = document.querySelector('.content-area');
    if (contentArea) contentArea.scrollTop = 0;

    // Close mobile sidebar
    closeSidebar();

    // Update URL hash
    history.replaceState(null, '', `#${sectionId}`);
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (item.tagName === 'A' && item.getAttribute('href')) {
        return;
      }
      const sectionId = item.dataset.section;
      if (sectionId) navigateTo(sectionId);
    });
  });

  /* ─── Category Expand/Collapse ─── */
  document.querySelectorAll('.nav-category-label').forEach(label => {
    label.addEventListener('click', () => {
      const category = label.parentElement;
      category.classList.toggle('collapsed');
    });
  });

  /* ─── Sidebar Mobile ─── */
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* ─── Search ─── */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (!query) {
        // Show all nav items
        navItems.forEach(item => item.style.display = '');
        document.querySelectorAll('.nav-category').forEach(c => {
          c.style.display = '';
          c.classList.remove('collapsed');
        });
        if (noResults) noResults.classList.remove('show');
        return;
      }

      let hasResults = false;

      // Filter nav items
      document.querySelectorAll('.nav-category').forEach(category => {
        let categoryHasMatch = false;
        const items = category.querySelectorAll('.nav-item');

        items.forEach(item => {
          const label = (item.querySelector('.nav-label')?.textContent || '').toLowerCase();
          const matches = label.includes(query);
          item.style.display = matches ? '' : 'none';
          if (matches) {
            categoryHasMatch = true;
            hasResults = true;
          }
        });

        category.style.display = categoryHasMatch ? '' : 'none';
        if (categoryHasMatch) category.classList.remove('collapsed');
      });

      if (noResults) {
        noResults.classList.toggle('show', !hasResults);
      }
    });

    // Keyboard shortcut: Ctrl+K / Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.blur();
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      }
    });
  }

  /* ─── Endpoint Toggle ─── */
  document.querySelectorAll('.endpoint-header').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('open');
    });
  });

  /* ─── Planejamento por setor (Gráfica / Automotivo) — Visão Geral ─── */
  const sectorPlanner = document.querySelector('[data-sector-planner]');
  if (sectorPlanner) {
    const planTabs = sectorPlanner.querySelectorAll('.sector-plan-tab');
    const planPanels = sectorPlanner.querySelectorAll('.sector-plan-panel');

    function activateSectorPlan(plan) {
      planTabs.forEach((tab) => {
        const on = tab.dataset.plan === plan;
        tab.classList.toggle('active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      planPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.planPanel === plan);
      });
    }

    planTabs.forEach((tab) => {
      tab.addEventListener('click', () => activateSectorPlan(tab.dataset.plan));
    });
  }

  /* ─── Hash Navigation ─── */
  const hash = window.location.hash.slice(1);
  const hashEl = hash ? document.getElementById(hash) : null;
  if (hashEl?.classList.contains('doc-section')) {
    navigateTo(hash);
  } else {
    navigateTo('visao-geral');
  }

  /* ─── Smooth Entrance Animation ─── */
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '1';
  });
});
