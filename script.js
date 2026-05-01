document.addEventListener("DOMContentLoaded", () => {
    const svgMapContainer = document.getElementById("svgMap");
    const provinceList = document.getElementById("province-list");
    const modal = document.getElementById("info-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalPlate = document.getElementById("modal-plate");
    const modalDesc = document.getElementById("modal-desc");

    // Haritayı yükle
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
        // Listeyi Doldur
        provinces.forEach(province => {
            const li = document.createElement("li");
            li.className = "province-item";
            li.dataset.plate = province.plate;
            li.innerHTML = `
                <div class="plate-badge">${province.plate}</div>
                <span class="name">${province.name}</span>
            `;
            provinceList.appendChild(li);

            // Liste elemanına hover
            li.addEventListener("mouseenter", () => {
                const mapGroup = document.querySelector(`g[data-plate="${province.plate}"]`);
                if (mapGroup) mapGroup.classList.add("active");
            });

            li.addEventListener("mouseleave", () => {
                const mapGroup = document.querySelector(`g[data-plate="${province.plate}"]`);
                if (mapGroup) mapGroup.classList.remove("active");
            });

            // Liste elemanına tıklama
            li.addEventListener("click", () => {
                openModal(province);
            });
        });

        // Harita Elemanlarına Event Ekle
        const mapGroups = document.querySelectorAll("g[data-plate]");
        mapGroups.forEach(group => {
            const plate = group.dataset.plate;
            const provinceData = provinces.find(p => p.plate === plate);

            if(provinceData) {
                // Haritada hover
                group.addEventListener("mouseenter", () => {
                    const listItem = document.querySelector(`.province-item[data-plate="${plate}"]`);
                    if (listItem) {
                        listItem.classList.add("active");
                        // Scroll'u otomatik kaydırmak isterseniz:
                        // listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                });

                group.addEventListener("mouseleave", () => {
                    const listItem = document.querySelector(`.province-item[data-plate="${plate}"]`);
                    if (listItem) listItem.classList.remove("active");
                });

                // Haritada tıklama
                group.addEventListener("click", () => {
                    openModal(provinceData);
                });
            }
        });
    }

    // Modal İşlemleri
    function openModal(province) {
        modalTitle.textContent = province.name;
        modalPlate.textContent = province.plate;
        modalDesc.textContent = province.desc;
        modal.classList.remove("hidden");
    }

    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Modalı dışarı tıklayınca kapatma
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
});