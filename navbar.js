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
            <a href="index.html" class="navbar-brand">
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 8 A42 42 0 1 1 8 50" stroke="#34d399" stroke-width="11" stroke-linecap="round" fill="none"/>
                    <polygon points="6,38 20,52 22,36" fill="#34d399"/>
                    <ellipse cx="38" cy="56" rx="16" ry="22" fill="#38bdf8" transform="rotate(-20,38,56)"/>
                    <ellipse cx="62" cy="56" rx="16" ry="22" fill="#0ea5e9" transform="rotate(20,62,56)"/>
                    <line x1="50" y1="78" x2="50" y2="90" stroke="#34d399" stroke-width="5" stroke-linecap="round"/>
                </svg>
                <span>Localvore</span>
            </a>
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
