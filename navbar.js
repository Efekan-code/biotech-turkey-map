(function () {
    const pages = [
        { href: 'index.html', label: 'Ana Sayfa' },
        { href: 'atiktan.html', label: 'Atıktan Katma Değere' },
        { href: 'bilgiler.html', label: 'Önemli Bilgiler' },
    ];

    function getActivePage() {
        const path = window.location.pathname.split('/').pop();
        return path === '' ? 'index.html' : (path || 'index.html');
    }

    function renderNavbar() {
        const active = getActivePage();
        const links = pages.map(p => `
            <a href="${p.href}" class="nav-link${active === p.href ? ' active' : ''}">${p.label}</a>
        `).join('');

        const nav = document.createElement('nav');
        nav.className = 'navbar glass-panel';
        nav.innerHTML = `
            <span class="navbar-brand">🌿 Posa Ekonomisi</span>
            <div class="navbar-links">${links}</div>
            <button id="theme-toggle" class="theme-btn" title="Tema Değiştir">🌙</button>
        `;
        document.body.prepend(nav);

        document.getElementById('theme-toggle').addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            document.getElementById('theme-toggle').textContent =
                document.body.classList.contains('light-theme') ? '☀️' : '🌙';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNavbar);
    } else {
        renderNavbar();
    }
})();
