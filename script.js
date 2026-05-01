document.addEventListener("DOMContentLoaded", () => {
    const svgMapContainer = document.getElementById("svgMap");
    const provinceList = document.getElementById("province-list");
    const modal = document.getElementById("info-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalPlate = document.getElementById("modal-plate");
    const modalDesc = document.getElementById("modal-desc");
    const modalTopics = document.getElementById("modal-topics");

    fetch('turkey-map.svg')
        .then(response => response.text())
        .then(svgContent => {
            svgMapContainer.innerHTML = svgContent;
            initApp();
        })
        .catch(error => {
            console.error("Harita yüklenemedi:", error);
            svgMapContainer.innerHTML = "<p style='color:red'>Harita yüklenirken bir hata oluştu.</p>";
        });

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

            li.addEventListener("mouseenter", () => {
                const mapGroup = document.querySelector(`g[data-plate="${province.plate}"]`);
                if (mapGroup) mapGroup.classList.add("active");
            });
            li.addEventListener("mouseleave", () => {
                const mapGroup = document.querySelector(`g[data-plate="${province.plate}"]`);
                if (mapGroup) mapGroup.classList.remove("active");
            });
            li.addEventListener("click", () => openModal(province));
        });

        const mapGroups = document.querySelectorAll("g[data-plate]");
        mapGroups.forEach(group => {
            const plate = group.dataset.plate;
            const provinceData = provinces.find(p => p.plate === plate);
            if (!provinceData) return;

            if (provinceData.hasBiotech) {
                group.classList.add("biotech-province");
            }

            group.addEventListener("mouseenter", () => {
                const listItem = document.querySelector(`.province-item[data-plate="${plate}"]`);
                if (listItem) listItem.classList.add("active");
            });
            group.addEventListener("mouseleave", () => {
                const listItem = document.querySelector(`.province-item[data-plate="${plate}"]`);
                if (listItem) listItem.classList.remove("active");
            });
            group.addEventListener("click", () => openModal(provinceData));
        });
    }

    function openModal(province) {
        modalTitle.textContent = province.name;
        modalPlate.textContent = province.plate;

        // Replace desc with agri products grid
        if (province.agriProducts && province.agriProducts.length > 0) {
            modalDesc.innerHTML = '';
            const grid = document.createElement('div');
            grid.className = 'agri-grid';
            province.agriProducts.forEach(p => {
                const chip = document.createElement('div');
                chip.className = 'agri-chip';
                chip.innerHTML = `<span class="agri-icon">${p.icon}</span><span class="agri-name">${p.name}</span>`;
                grid.appendChild(chip);
            });
            modalDesc.appendChild(grid);
        } else {
            modalDesc.textContent = province.desc;
        }

        // Build topic list
        modalTopics.innerHTML = '';
        if (province.topics && province.topics.length > 0) {
            const hasBiotechTopics = province.biotechFlags && province.biotechFlags.some(Boolean);
            if (hasBiotechTopics) {
                const legend = document.createElement("div");
                legend.className = "topic-legend";
                legend.innerHTML = '<span class="legend-dot biotech-dot"></span> Biyoteknoloji / Katma Değerli Tarım';
                modalTopics.appendChild(legend);
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
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    // Theme toggle is handled by navbar.js
});
