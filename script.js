document.addEventListener("DOMContentLoaded", () => {
    const svgMapContainer = document.getElementById("svgMap");
    const provinceList    = document.getElementById("province-list");
    const modal           = document.getElementById("info-modal");
    const closeModalBtn   = document.getElementById("close-modal");
    const modalTitle      = document.getElementById("modal-title");
    const modalPlate      = document.getElementById("modal-plate");
    const modalDesc       = document.getElementById("modal-desc");
    const modalTopics     = document.getElementById("modal-topics");

    fetch('turkey-map.svg')
        .then(r => r.text())
        .then(svg => { svgMapContainer.innerHTML = svg; initApp(); })
        .catch(() => { svgMapContainer.innerHTML = "<p style='color:red'>Harita yüklenemedi.</p>"; });

    function initApp() {
        provinces.forEach(province => {
            const li = document.createElement("li");
            li.className = "province-item" + (province.hasBiotech ? " has-biotech" : "");
            li.dataset.plate = province.plate;
            li.innerHTML = `
                <div class="plate-badge">${province.plate}</div>
                <span class="name">${province.name}</span>
                ${province.hasBiotech ? '<span class="biotech-indicator" title="Biyoteknoloji / Katma Değerli Tarım Yatırımı">BT</span>' : ''}
            `;
            provinceList.appendChild(li);
            li.addEventListener("mouseenter", () => { const g = document.querySelector(`g[data-plate="${province.plate}"]`); if (g) g.classList.add("active"); });
            li.addEventListener("mouseleave", () => { const g = document.querySelector(`g[data-plate="${province.plate}"]`); if (g) g.classList.remove("active"); });
            li.addEventListener("click", () => openModal(province));
        });

        document.querySelectorAll("g[data-plate]").forEach(group => {
            const plate = group.dataset.plate;
            const p = provinces.find(p => p.plate === plate);
            if (!p) return;
            if (p.hasBiotech) group.classList.add("biotech-province");
            group.addEventListener("mouseenter", () => { const li = document.querySelector(`.province-item[data-plate="${plate}"]`); if (li) li.classList.add("active"); });
            group.addEventListener("mouseleave", () => { const li = document.querySelector(`.province-item[data-plate="${plate}"]`); if (li) li.classList.remove("active"); });
            group.addEventListener("click", () => openModal(p));
        });
    }

    function openModal(province) {
        modalTitle.textContent = province.name;
        modalPlate.textContent = province.plate;

        modalDesc.innerHTML = '<div class="agri-section-label">Tarımsal Ürünler</div>';

        // Agri products
        if (province.agriProducts && province.agriProducts.length > 0) {
            const grid = document.createElement('div');
            grid.className = 'agri-grid';
            province.agriProducts.forEach(p => {
                const chip = document.createElement('div');
                chip.className = 'agri-chip';
                chip.innerHTML = `<span class="agri-icon">${p.icon}</span><span class="agri-name">${p.name}</span>`;
                grid.appendChild(chip);
            });
            modalDesc.appendChild(grid);
        }

        // Topics
        modalTopics.innerHTML = '';
        if (province.topics && province.topics.length > 0) {
            const hasBiotech = province.biotechFlags && province.biotechFlags.some(Boolean);
            if (hasBiotech) {
                const leg = document.createElement("div");
                leg.className = "topic-legend";
                leg.innerHTML = '<span class="legend-dot biotech-dot"></span> Biyoteknoloji / Katma Değerli Tarım';
                modalTopics.appendChild(leg);
            }
            province.topics.forEach((topic, i) => {
                const isBiotech = province.biotechFlags && province.biotechFlags[i];
                const div = document.createElement("div");
                div.className = "topic-item" + (isBiotech ? " biotech-topic" : "");
                div.innerHTML = isBiotech
                    ? `<span class="topic-dot biotech-dot"></span><span>${topic}</span>`
                    : `<span class="topic-dot"></span><span>${topic}</span>`;
                modalTopics.appendChild(div);
            });
        }

        modal.classList.remove("hidden");
    }

    closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });
});
