import json

with open('province-topics.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

descs = {
    '01': "Adana, Türkiye'nin güneyinde yer alan ve tarımıyla öne çıkan önemli bir ilimizdir. Seyhan Nehri üzerine kuruludur.",
    '02': "Adıyaman, Güneydoğu Anadolu Bölgesi'nde yer alır. Nemrut Dağı ile ünlüdür.",
    '03': "Afyonkarahisar, termal suları, mermeri ve kaymağı ile meşhurdur.",
    '04': "Ağrı, Türkiye'nin en yüksek dağı olan Ağrı Dağı'na ev sahipliği yapar.",
    '05': "Amasya, Şehzadeler şehri olarak bilinir ve elmasıyla meşhurdur.",
    '06': "Ankara, Türkiye Cumhuriyeti'nin başkentidir. Anıtkabir burada yer almaktadır.",
    '07': "Antalya, turizmin başkentidir ve muhteşem plajlara sahiptir.",
    '08': "Artvin, Karadeniz'in yeşil incisidir ve doğal güzellikleriyle büyüleyicidir.",
    '09': "Aydın, Ege Bölgesi'nin önemli tarım ve turizm merkezlerinden biridir. İnciri meşhurdur.",
    '10': "Balıkesir, hem Marmara hem de Ege Denizi'ne kıyısı olan güzel bir ilimizdir.",
    '11': "Bilecik, Osmanlı İmparatorluğu'nun temellerinin atıldığı tarihi bir şehirdir.",
    '12': "Bingöl, Doğu Anadolu'da yer alan doğal gölleriyle bilinen bir ildir.",
    '13': "Bitlis, tarihi dokusu ve yöresel mimarisi ile dikkat çeker.",
    '14': "Bolu, gölleri ve ormanlarıyla Türkiye'nin doğa cennetlerinden biridir. Abant çok popülerdir.",
    '15': "Burdur, Göller Yöresi'nde bulunur ve Salda Gölü ile ünlüdür.",
    '16': "Bursa, Osmanlı'ya başkentlik yapmış, Uludağ'ı ve kestane şekeri ile meşhur bir sanayi şehridir.",
    '17': "Çanakkale, tarihi savaşların yaşandığı Gelibolu Yarımadası'na ev sahipliği yapar.",
    '18': "Çankırı, İç Anadolu'da yer alır ve tuz mağaralarıyla dikkat çeker.",
    '19': "Çorum, leblebisi ve tarihi Hitit kalıntılarıyla bilinir.",
    '20': "Denizli, Pamukkale travertenleri ve horozuyla dünyaca ünlüdür.",
    '21': "Diyarbakır, tarihi surları ve karpuzuyla meşhurdur.",
    '22': "Edirne, Mimar Sinan'ın ustalık eseri Selimiye Camii'ne ev sahipliği yapar.",
    '23': "Elazığ, Gakkoşlar diyarı olarak bilinir ve Harput Kalesi ile meşhurdur.",
    '24': "Erzincan, bakırcılık sanatı ve tulum peyniri ile öne çıkar.",
    '25': "Erzurum, Palandöken Dağı ile kış turizminin önemli merkezlerindendir.",
    '26': "Eskişehir, Porsuk Çayı ve öğrenci şehri kimliğiyle dinamik bir ildir.",
    '27': "Gaziantep, mutfağıyla UNESCO tarafından tescillenmiş bir gastronomi şehridir.",
    '28': "Giresun, fındığın başkentidir.",
    '29': "Gümüşhane, tarihi yaylaları ve doğal güzellikleri ile bilinir.",
    '30': "Hakkari, sarp dağları ve eşsiz kış manzaralarıyla dikkat çeker.",
    '31': "Hatay, medeniyetlerin beşiği ve mutfağıyla ünlü güzide bir ilimizdir.",
    '32': "Isparta, gülleri ve halılarıyla Türkiye'nin gül bahçesidir.",
    '33': "Mersin, tantunisi, narenciyesi ve sahil şeridiyle çok önemlidir.",
    '34': "İstanbul, Türkiye'nin kalbi, iki kıtayı birbirine bağlayan dünya metropolisidir.",
    '35': "İzmir, Ege'nin incisi, kordonu ve tarihi Saat Kulesi ile ünlüdür.",
    '36': "Kars, ters laleleri ve tarihi Ani Harabeleri ile meşhurdur.",
    '37': "Kastamonu, Karadeniz'in tarihi dokusunu koruyan önemli bir şehridir.",
    '38': "Kayseri, mantısı, pastırması ve Erciyes Dağı ile tanınır.",
    '39': "Kırklareli, ormanları ve sakin yaşamıyla Trakya'nın şirin bir ilidir.",
    '40': "Kırşehir, Ahi Evran'ın memleketi ve kültür şehridir.",
    '41': "Kocaeli, Türkiye'nin önemli sanayi ve liman kentlerinden biridir.",
    '42': "Konya, Mevlana Celaleddin Rumi'nin şehri ve etli ekmeğiyle meşhurdur.",
    '43': "Kütahya, çinileri ve tarihi konaklarıyla ünlü bir ildir.",
    '44': "Malatya, kayısısı ile tüm dünyada haklı bir üne sahiptir.",
    '45': "Manisa, Mesir Macunu ve Spil Dağı ile bilinir.",
    '46': "Kahramanmaraş, dondurması ve kahramanlık destanlarıyla tanınır.",
    '47': "Mardin, taş evleri ve eşsiz tarihi atmosferiyle büyüleyicidir.",
    '48': "Muğla, Bodrum, Marmaris, Fethiye gibi ilçeleriyle turizm cennetidir.",
    '49': "Muş, Malazgirt Ovası'na ve tarihi lalesi ile bilinir.",
    '50': "Nevşehir, Kapadokya'nın kalbi ve peribacaları diyarıdır.",
    '51': "Niğde, tarımı ve Hacı Bektaş Veli ile anılan kültürel dokusuyla önemlidir.",
    '52': "Ordu, fındık bahçeleri ve yaylalarıyla ünlü bir Karadeniz şehridir.",
    '53': "Rize, çayın başkenti ve yeşilin her tonunun bulunduğu bir doğa harikasıdır.",
    '54': "Sakarya, sanayisi ve doğal güzellikleriyle Marmara'nın önemli bir ilidir.",
    '55': "Samsun, Milli Mücadele'nin başladığı ve Karadeniz'in en büyük şehridir.",
    '56': "Siirt, büryan kebabı ve fıstığıyla tanınır.",
    '57': "Sinop, Türkiye'nin en kuzey ucu ve mutlu insanlar şehri olarak bilinir.",
    '58': "Sivas, tarihi medreseleri, kangal köpeği ve geniş coğrafyasıyla bilinir.",
    '59': "Tekirdağ, köftesi ve Trakya'nın önemli tarım merkezlerinden biri olmasıyla öne çıkar.",
    '60': "Tokat, yaprağı ve tarihi çarşılarıyla meşhurdur.",
    '61': "Trabzon, Sümela Manastırı ve yaylalarıyla Karadeniz'in çok önemli turizm şehridir.",
    '62': "Tunceli, Munzur Vadisi ve bakir doğasıyla harika bir ildir.",
    '63': "Şanlıurfa, Göbeklitepe, Balıklıgöl ve efsanelerle dolu tarihiyle peygamberler şehridir.",
    '64': "Uşak, halısı, battaniyesi ve Karun Hazineleri ile tanınır.",
    '65': "Van, kaşarı, kahvaltısı ve eşsiz Van Gölü ile özel bir ildir.",
    '66': "Yozgat, İç Anadolu'nun merkezinde yer alan köklü bir geçmişe sahiptir.",
    '67': "Zonguldak, madenleri ve ormanlarıyla Türkiye'nin kömür diyarıdır.",
    '68': "Aksaray, Kapadokya bölgesinin giriş kapısı ve tarihi kervansaraylarıyla bilinir.",
    '69': "Bayburt, pestili ve tarihi kaleleriyle meşhurdur.",
    '70': "Karaman, elması, bisküvisi ve Türk dilinin başkenti olmasıyla ünlüdür.",
    '71': "Kırıkkale, silah sanayisi ve Kızılırmak üzerindeki köprüleriyle bilinir.",
    '72': "Batman, Hasankeyf antik kenti ile tarihi bir mirasa sahiptir.",
    '73': "Şırnak, doğal güzellikleri ve yöresel kültürü ile dikkat çeker.",
    '74': "Bartın, filyos nehri, sahil şeridi ve doğal güzellikleriyle meşhurdur.",
    '75': "Ardahan, kaşar peyniri ve doğal yaylalarıyla öne çıkar.",
    '76': "Iğdır, doğunun Çukurovası olarak bilinir ve pamuk yetişen ender yerlerdendir.",
    '77': "Yalova, termal kaplıcaları ve çiçekçiliğiyle ünlü Marmara ilidir.",
    '78': "Karabük, Amasra gibi turistik yerlere ve demir çelik sanayisine sahiptir.",
    '79': "Kilis, Türkiye'nin güney sınırında yer alan stratejik ve kültürel bir ildir.",
    '80': "Osmaniye, yer fıstığı ve Çukurova'nın bereketli topraklarıyla tanınır.",
    '81': "Düzce, fındığı ve yaylalarıyla Batı Karadeniz'in yeşil şehridir."
}

lines = ['const provinces = [']
for plate in [f'{i:02d}' for i in range(1, 82)]:
    d = data[plate]
    desc = descs.get(plate, d['name'])
    desc_escaped = desc.replace('"', '\\"').replace("'", "\\'")
    topics_json = json.dumps(d['topics'], ensure_ascii=False)
    flags_json = json.dumps(d['biotech_flags'], ensure_ascii=False)
    has_biotech = 'true' if d['has_biotech'] else 'false'
    lines.append(f'    {{ plate: "{plate}", name: "{d["name"]}", desc: "{desc_escaped}", hasBiotech: {has_biotech}, topics: {topics_json}, biotechFlags: {flags_json} }},')
lines.append('];')

with open('data.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

print(f'data.js yazıldı. {sum(1 for l in lines if "hasBiotech: true" in l)} biotech il.')
