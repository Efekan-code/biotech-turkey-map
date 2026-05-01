# Etkileşimli Türkiye Haritası 🇹🇷

Bu proje, Vanilla HTML, CSS ve Javascript kullanılarak geliştirilmiş, etkileşimli bir Türkiye Haritası uygulamasıdır. Proje, şık ve modern "Glassmorphism" (cam efekti) tasarım dili ile hazırlanmış olup karanlık/aydınlık tema (Dark/Light mode) desteğine sahiptir.

## Özellikler ✨
- **Etkileşimli SVG Harita:** Harita üzerindeki herhangi bir ile geldiğinizde vurgulanır.
- **Dinamik İl Listesi:** Sol menüde plakalarına göre sıralanmış iller bulunur. Listeden veya haritadan hover (üzerine gelme) yapıldığında her iki taraf da senkronize bir şekilde çalışır.
- **Animasyonlar:** Fare ile üzerine gelindiğinde illerde 3 boyutlu kalkma hissiyatı (drop-shadow filter) veren pürüzsüz geçişler bulunur.
- **Light/Dark Tema:** Kullanıcı dilediği zaman tek tıkla karanlık veya aydınlık tasarıma geçiş yapabilir.
- **İl Bilgi Ekranı:** İllere tıklandığında, o ile özgü plaka ve kısa açıklamayı gösteren bir pop-up modülü açılır.

## Kurulum ve Çalıştırma 🚀
Proje herhangi bir derleyici, paket veya framework (React, Vue vb.) içermediği için kurulumu çok kolaydır. Ancak harita bir dış SVG dosyası olduğundan, tarayıcıların güvenlik kısıtlamaları nedeniyle (CORS) doğrudan `index.html` dosyasına çift tıklayarak çalıştırıldığında harita görünmeyebilir.

**Local Server ile Çalıştırma (Önerilen):**
1. Bilgisayarınızda Node.js kuruluysa terminal üzerinden şu komutu çalıştırın:
   ```bash
   npx serve
   ```
2. Veya VS Code kullanıyorsanız, `index.html` dosyasına sağ tıklayıp **"Open with Live Server"** seçeneğine tıklayabilirsiniz.
3. Python yüklüyse: `python -m http.server`

## Teknolojiler 🛠️
- HTML5
- CSS3 (Vanilla, Glassmorphism, CSS Variables)
- ES6 Javascript (Vanilla JS)
- SVG
