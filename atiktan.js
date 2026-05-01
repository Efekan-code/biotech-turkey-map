// Province name lookup (plate -> name) from posa-data
const PLATE_NAMES = {
    '01':'Adana','02':'Adıyaman','03':'Afyonkarahisar','04':'Ağrı','05':'Amasya',
    '06':'Ankara','07':'Antalya','08':'Artvin','09':'Aydın','10':'Balıkesir',
    '11':'Bilecik','12':'Bingöl','13':'Bitlis','14':'Bolu','15':'Burdur',
    '16':'Bursa','17':'Çanakkale','18':'Çankırı','19':'Çorum','20':'Denizli',
    '21':'Diyarbakır','22':'Edirne','23':'Elazığ','24':'Erzincan','25':'Erzurum',
    '26':'Eskişehir','27':'Gaziantep','28':'Giresun','29':'Gümüşhane','30':'Hakkari',
    '31':'Hatay','32':'Isparta','33':'Mersin','34':'İstanbul','35':'İzmir',
    '36':'Kars','37':'Kastamonu','38':'Kayseri','39':'Kırklareli','40':'Kırşehir',
    '41':'Kocaeli','42':'Konya','43':'Kütahya','44':'Malatya','45':'Manisa',
    '46':'Kahramanmaraş','47':'Mardin','48':'Muğla','49':'Muş','50':'Nevşehir',
    '51':'Niğde','52':'Ordu','53':'Rize','54':'Sakarya','55':'Samsun',
    '56':'Siirt','57':'Sinop','58':'Sivas','59':'Tekirdağ','60':'Tokat',
    '61':'Trabzon','62':'Tunceli','63':'Şanlıurfa','64':'Uşak','65':'Van',
    '66':'Yozgat','67':'Zonguldak','68':'Aksaray','69':'Bayburt','70':'Karaman',
    '71':'Kırıkkale','72':'Batman','73':'Şırnak','74':'Bartın','75':'Ardahan',
    '76':'Iğdır','77':'Yalova','78':'Karabük','79':'Kilis','80':'Osmaniye','81':'Düzce',
};

const CAT_COLORS = {
    narenciye: { fill: 'rgba(249,115,22,0.28)', hover: '#f97316', glow: '249,115,22' },
    findik:    { fill: 'rgba(180,83,9,0.35)',   hover: '#b45309', glow: '180,83,9'   },
    uzum:      { fill: 'rgba(124,58,237,0.28)', hover: '#7c3aed', glow: '124,58,237' },
    zeytin:    { fill: 'rgba(101,163,13,0.28)', hover: '#65a30d', glow: '101,163,13' },
    cay:       { fill: 'rgba(8,145,178,0.28)',  hover: '#0891b2', glow: '8,145,178'  },
    tahil:     { fill: 'rgba(217,119,6,0.28)',  hover: '#d97706', glow: '217,119,6'  },
    diger:     { fill: 'rgba(99,102,241,0.22)', hover: '#6366f1', glow: '99,102,241' },
};

document.addEventListener('DOMContentLoaded', () => {
    const svgMapContainer = document.getElementById('svgMap');
    const provinceList    = document.getElementById('province-list');
    const modal           = document.getElementById('info-modal');
    const closeModalBtn   = document.getElementById('close-modal');
    const modalTitle      = document.getElementById('modal-title');
    const modalCatBadge   = document.getElementById('modal-cat-badge');
    const modalPotential  = document.getElementById('modal-potential');
    const modalExtra      = document.getElementById('modal-extra');
    const modalCompounds  = document.getElementById('modal-compounds');

    fetch('turkey-map.svg')
        .then(r => r.text())
        .then(svg => {
            svgMapContainer.innerHTML = svg;
            initApp();
        });

    function initApp() {
        // Build sidebar list
        posaProvinces.forEach(p => {
            const cat  = POSA_CATEGORIES[p.category];
            const name = PLATE_NAMES[p.plate] || p.plate;
            const li   = document.createElement('li');
            li.className = 'province-item';
            li.dataset.plate = p.plate;
            li.innerHTML = `
                <div class="plate-badge" style="background:${CAT_COLORS[p.category].hover}">${p.plate}</div>
                <span class="name">${name}</span>
                <span class="cat-dot" style="background:${CAT_COLORS[p.category].hover}" title="${cat.label}"></span>
            `;
            provinceList.appendChild(li);
            li.addEventListener('mouseenter', () => highlightMap(p.plate, true));
            li.addEventListener('mouseleave', () => highlightMap(p.plate, false));
            li.addEventListener('click', () => openModal(p, name));
        });

        // Style + wire map groups
        const mapGroups = document.querySelectorAll('g[data-plate]');
        mapGroups.forEach(group => {
            const plate = group.dataset.plate;
            const pData = posaProvinces.find(p => p.plate === plate);
            if (!pData) return;

            const c = CAT_COLORS[pData.category];
            // Set default fill via CSS custom property
            group.querySelectorAll('path').forEach(path => {
                path.style.fill = c.fill;
            });
            group.dataset.category = pData.category;

            group.addEventListener('mouseenter', () => {
                highlightList(plate, true);
                group.querySelectorAll('path').forEach(path => {
                    path.style.fill = c.hover;
                    path.style.filter = `drop-shadow(0 0 12px rgba(${c.glow},0.8))`;
                });
            });
            group.addEventListener('mouseleave', () => {
                highlightList(plate, false);
                group.querySelectorAll('path').forEach(path => {
                    path.style.fill = c.fill;
                    path.style.filter = '';
                });
            });
            group.addEventListener('click', () => openModal(pData, PLATE_NAMES[plate] || plate));
        });
    }

    function highlightMap(plate, on) {
        const g = document.querySelector(`g[data-plate="${plate}"]`);
        if (!g) return;
        const pData = posaProvinces.find(p => p.plate === plate);
        if (!pData) return;
        const c = CAT_COLORS[pData.category];
        g.querySelectorAll('path').forEach(path => {
            path.style.fill   = on ? c.hover : c.fill;
            path.style.filter = on ? `drop-shadow(0 0 12px rgba(${c.glow},0.8))` : '';
        });
    }

    function highlightList(plate, on) {
        const li = document.querySelector(`.province-item[data-plate="${plate}"]`);
        if (li) li.classList.toggle('active', on);
    }

    function openModal(pData, name) {
        const cat = POSA_CATEGORIES[pData.category];
        const c   = CAT_COLORS[pData.category];

        modalTitle.textContent = name;

        modalCatBadge.textContent = `${cat.icon} ${cat.label}`;
        modalCatBadge.style.background = `rgba(${c.glow},0.15)`;
        modalCatBadge.style.borderColor = `rgba(${c.glow},0.4)`;
        modalCatBadge.style.color = c.hover;

        const potMap = { yüksek: 'pot-yuksek', orta: 'pot-orta', başlangıç: 'pot-baslangic' };
        modalPotential.textContent = pData.potential.charAt(0).toUpperCase() + pData.potential.slice(1);
        modalPotential.className = `pot-badge ${potMap[pData.potential] || 'pot-baslangic'}`;

        modalExtra.textContent = pData.extra || cat.description;

        // Compounds
        modalCompounds.innerHTML = '';
        const header = document.createElement('p');
        header.className = 'compounds-header';
        header.textContent = 'Elde Edilebilecek Bileşenler';
        modalCompounds.appendChild(header);

        cat.compounds.forEach(c2 => {
            const row = document.createElement('div');
            row.className = 'compound-row';
            row.innerHTML = `
                <span class="compound-name">${c2.name}</span>
                <span class="compound-value">${c2.value}</span>
                <span class="compound-market">${c2.market}</span>
            `;
            modalCompounds.appendChild(row);
        });

        modal.classList.remove('hidden');
    }

    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
});
