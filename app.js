/* SaunaHouse — katalog z wyceną. Wszystkie podstrony rysuje ten router. */
let CATS=[], PRODUCTS=[];
const bySlug = s => CATS.find(c=>c.slug===s);
const prodsOf = slug => PRODUCTS.filter(p=>p.c===slug);
const esc = s => String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const zl = n => n.toLocaleString('pl-PL')+' zł';

/* ---- opinie z Google (wizytówka: Sauna House, Fabryczna 13, Dobre Miasto) ---- */
const G={rating:'5,0',count:9,url:'https://www.google.com/maps/place/Sauna+House/@53.9865742,20.3837294,17z/data=!4m6!3m5!1s0x46e288f91952f5f5:0x1ce3db75cb4c7097!8m2!3d53.9865742!4d20.3837294!16s%2Fg%2F1tdrv_sz'};
const GREVIEWS=[
 {a:'Michał',d:'6 dni temu',s:5,t:'Domek Premium. Wysoka jakość i perfekcja wykonania. Możliwość zmian w projekcie. Bardzo krótki czas montażu (1–2 dni). Cena adekwatna do jakości wykonanej usługi. Polecam Sauna House!'},
 {a:'Tomasz',d:'6 miesięcy temu',s:5,t:'Na wiosenno-letnie poranki przy kawie w sam raz.'},
 {a:'Lecho',d:'5 lat temu',s:5,t:'Domek wykonany rewelacyjnie, polecam firmę Pana Leszka Sauna House.'},
 {a:'Aśka',d:'5 lat temu',s:5,t:'Korzystaliśmy z usług tej firmy i muszę przyznać, że jestem pod ogromnym wrażeniem profesjonalizmu. Domek jest super jakości, solidny i można było wynegocjować małe zmiany pod nasze potrzeby. Montaż odbył się w miarę terminowo, chociaż pogoda sprawiła małe przesunięcie, ale to nie było problemem. Montaż jednodniowy i już można było zacząć cieszyć się nowym nabytkiem. Polecam tę firmę, bo jakość całości bardzo dobra i cena niezbyt wygórowana, jak na tę jakość.'},
 {a:'Teresa',d:'2 lata temu',s:5,t:'W kwietniu 2024 został postawiony domek na działce, jestem bardzo zadowolona. Domek piękny szczelny, ekipa pełna profesjonalizmu, czystym sumieniem polecam Pana Leszka i jego ekipę.'}
];
/* codzienna rotacja opinii: pokazujemy 3, wybór zależy od dnia */
const REV_SHOWN=3;
const revDay=Math.floor(Date.now()/86400000);
const revShift=revDay%GREVIEWS.length;
const shownReviews=[...GREVIEWS.slice(revShift),...GREVIEWS.slice(0,revShift)];
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const gBadge=()=>`<a class="gbadge" href="${G.url}" target="_blank" rel="noopener"><span class="gr">Google</span><span class="gstar">★</span><b>${G.rating}</b><span class="gs">★★★★★</span><small>(${G.count} opinii)</small></a>`;
const revCard=(r,gi)=>{const t=r.t.length>150?r.t.slice(0,150).replace(/\s+\S*$/,'')+'…':r.t;return `<div class="review" ${gi!=null?`title="Kliknij, aby rozwinąć opinię" onclick="showReview(${gi})" style="cursor:pointer"`:''}><div class="rs">${stars(r.s)} <small>${r.s},0/5</small></div><p>"${esc(t)}"</p><div class="who">${esc(r.a)} · ${esc(r.d)} · opinia Google${gi!=null?' · <b>rozwiń ▾</b>':''}</div></div>`;};
window.showReview=function(i){
  const r=GREVIEWS[i]; if(!r) return;
  let m=document.getElementById('revModal');
  if(!m){m=document.createElement('div');m.id='revModal';document.body.appendChild(m);}
  m.innerHTML=`<div class="revm-bg" onclick="hideReview()"></div><div class="revm" role="dialog">
    <button class="revm-x" onclick="hideReview()" aria-label="Zamknij">✕</button>
    <div class="rs">${stars(r.s)} <small>${r.s},0/5</small></div>
    <p>"${esc(r.t)}"</p>
    <div class="who">${esc(r.a)} · ${esc(r.d)} · opinia Google</div>
    <a class="btn alt" href="${G.url}" target="_blank" rel="noopener">zobacz na Google →</a>
  </div>`;
  m.classList.add('on');
};
window.hideReview=function(){document.getElementById('revModal')?.classList.remove('on');};

/* ---- SVG ilustracje (zamiast zdjęć; kolory pochodzą z nazwy) ---- */
function hash(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h);}
function hue(s){return 30+(hash(s)%60);}
function illu(kind,seed){
  const h=hue(seed), wood=`hsl(${h},45%,60%)`, wood2=`hsl(${h},42%,46%)`, dark=`hsl(${h},45%,34%)`;
  const sky1=`hsl(${(h+150)%360},30%,88%)`, sky2=`hsl(${(h+120)%360},40%,96%)`;
  const roof=`hsl(${(h+200)%360},28%,30%)`, glass=`hsl(190,45%,68%)`, glassD=`hsl(190,50%,55%)`;
  const sun=`hsl(38,90%,72%)`, ground=`hsl(110,25%,76%)`;
  const door=`hsl(${(h+40)%360},40%,38%)`;
  let body='';
  if(kind.includes('balia')){
    body=`<ellipse cx="150" cy="158" rx="86" ry="20" fill="${dark}" opacity=".25"/>
    <path d="M70 148 a80 26 0 0 1 160 0 l0 -46 a80 24 0 0 0 -160 0 z" fill="${wood}"/>
    <path d="M74 132 l152 0" stroke="${wood2}" stroke-width="3"/><path d="M74 118 l152 0" stroke="${wood2}" stroke-width="3"/>
    <ellipse cx="150" cy="100" rx="80" ry="22" fill="${wood}"/><ellipse cx="150" cy="100" rx="64" ry="15" fill="hsl(200,50%,58%)"/>
    <ellipse cx="150" cy="100" rx="64" ry="15" fill="none" stroke="hsl(200,45%,45%)" stroke-width="2"/>
    <path d="M60 150 l-14 8 M60 150 l0 10 M240 150 l14 8 M240 150 l0 10" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>
    <path d="M118 82 q6 -10 0 -18 M138 84 q6 -10 0 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>`;
  } else if(kind.includes('beczka')){
    body=`<ellipse cx="152" cy="160" rx="96" ry="16" fill="${dark}" opacity=".25"/>
    <ellipse cx="150" cy="122" rx="94" ry="44" fill="${wood}"/>
    <path d="M62 122 l176 0 M62 108 l176 0 M62 136 l176 0" stroke="${wood2}" stroke-width="3"/>
    <ellipse cx="150" cy="122" rx="94" ry="44" fill="none" stroke="${wood2}" stroke-width="3"/>
    <rect x="186" y="102" width="32" height="42" rx="5" fill="${dark}"/><rect x="190" y="106" width="24" height="34" rx="3" fill="${glass}"/>
    <path d="M100 84 q6 -10 0 -18 M118 82 q6 -10 0 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M56 100 a94 44 0 0 0 10 24" stroke="${wood2}" stroke-width="3" fill="none"/>`;
  } else if(kind.includes('sauna')){
    body=`<ellipse cx="150" cy="176" rx="105" ry="14" fill="${dark}" opacity=".22"/>
    <rect x="55" y="88" width="190" height="84" rx="4" fill="${wood}"/>
    <rect x="55" y="88" width="190" height="84" rx="4" fill="none" stroke="${wood2}" stroke-width="2"/>
    <path d="M55 106 l190 0 M55 124 l190 0 M55 142 l190 0 M55 160 l190 0" stroke="${wood2}" stroke-width="2" opacity=".7"/>
    <rect x="148" y="108" width="52" height="64" fill="${dark}"/><rect x="152" y="112" width="44" height="60" fill="${glass}"/>
    <path d="M152 112 l44 0 M152 132 l44 0 M174 112 l0 60" stroke="${glassD}" stroke-width="2"/>
    <rect x="80" y="130" width="40" height="42" fill="hsl(15,60%,50%)"/><circle cx="100" cy="148" r="10" fill="hsl(20,80%,62%)"/>
    <path d="M78 128 l44 0" stroke="${dark}" stroke-width="4"/>
    <path d="M90 78 q8 -14 0 -26 M110 76 q8 -14 0 -26" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>`;
  } else if(kind.includes('garaz')||kind.includes('wiata')){
    body=`<ellipse cx="150" cy="176" rx="110" ry="13" fill="${dark}" opacity=".22"/>
    <path d="M45 112 L150 52 L255 112 Z" fill="${roof}"/><path d="M45 112 L150 52 L255 112 Z" fill="none" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
    <rect x="58" y="112" width="184" height="64" fill="${wood}"/>
    <rect x="95" y="126" width="70" height="50" fill="${glass}"/><path d="M130 126 l0 50 M95 151 l70 0" stroke="${glassD}" stroke-width="2"/>
    <path d="M58 112 l184 0" stroke="${dark}" stroke-width="5"/>`;
  } else if(kind.includes('dziec')||kind.includes('piaskow')||kind.includes('hust')||kind.includes('zabaw')){
    body=`<ellipse cx="150" cy="176" rx="105" ry="13" fill="${dark}" opacity=".22"/>
    <rect x="65" y="108" width="115" height="66" fill="${wood}"/><path d="M55 108 L122 62 L190 108 Z" fill="hsl(12,58%,52%)"/>
    <rect x="140" y="122" width="28" height="34" fill="${door}"/><rect x="92" y="120" width="26" height="22" fill="${glass}"/>
    <circle cx="228" cy="88" r="16" fill="${wood}" stroke="${wood2}" stroke-width="3"/><path d="M228 88 L228 172" stroke="${wood2}" stroke-width="5"/>
    <rect x="210" y="118" width="36" height="8" fill="hsl(12,58%,52%)"/><path d="M214 118 l0 14 M242 118 l0 14" stroke="hsl(12,58%,52%)" stroke-width="3"/>`;
  } else if(kind.includes('pergola')||kind.includes('zadasz')||kind.includes('ogrod-zim')){
    body=`<ellipse cx="150" cy="176" rx="110" ry="13" fill="${dark}" opacity=".22"/>
    <rect x="48" y="98" width="204" height="10" rx="2" fill="${roof}"/>
    <rect x="55" y="108" width="9" height="64" fill="${wood}"/><rect x="236" y="108" width="9" height="64" fill="${wood}"/>
    <path d="M48 92 L252 92" stroke="${dark}" stroke-width="3"/>
    <path d="M64 112 q42 24 86 0 q42 24 86 0" stroke="${glass}" stroke-width="3" fill="${glass}" opacity=".35"/>
    <rect x="70" y="150" width="60" height="8" fill="${wood2}"/><rect x="170" y="150" width="60" height="8" fill="${wood2}"/>`;
  } else {
    body=`<ellipse cx="150" cy="176" rx="105" ry="13" fill="${dark}" opacity=".22"/>
    <rect x="72" y="102" width="156" height="72" fill="${wood}"/>
    <path d="M62 102 L150 50 L238 102 Z" fill="${roof}"/><path d="M62 102 L150 50 L238 102 Z" fill="none" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
    <rect x="88" y="118" width="34" height="56" fill="${door}"/><circle cx="114" cy="148" r="2.5" fill="${sun}"/>
    <rect x="146" y="118" width="44" height="30" fill="${glass}"/><path d="M146 133 l44 0 M168 118 l0 30" stroke="${glassD}" stroke-width="2"/>
    <path d="M196 84 l0 -16 M190 68 l12 0 M192 62 l8 0" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 174 l220 0" stroke="${ground}" stroke-width="4"/>`;
  }
  return `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMax slice" role="img" aria-label="ilustracja: ${esc(seed)}">
  <defs><linearGradient id="sky${hash(seed)%9999}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky2}"/><stop offset="1" stop-color="${sky1}"/></linearGradient></defs>
  <rect width="300" height="200" fill="url(#sky${hash(seed)%9999})"/>
  <circle cx="252" cy="42" r="16" fill="${sun}"/><circle cx="252" cy="42" r="24" fill="${sun}" opacity=".3"/>
  <ellipse cx="72" cy="52" rx="36" ry="13" fill="#fff" opacity=".85"/><ellipse cx="98" cy="46" rx="26" ry="11" fill="#fff" opacity=".85"/>
  <path d="M0 176 Q150 162 300 176 L300 200 L0 200 Z" fill="${ground}"/>${body}</svg>`;
}
const ph = (seed,cls='') => `<span class="ph ${cls}" data-seed="${esc(seed)}">${illu(seed.toLowerCase(),seed)}</span>`;
const photo=(p,cls='')=>p.img?`<span class="phwrap"><img class="${cls}" src="${esc(p.img)}" alt="${esc(p.n)}" loading="lazy" style="width:100%;height:100%;object-fit:contain">${catLbl(p)}</span>`:illu(p.c,p.n);
const catLbl=p=>'';

/* ---- lista główna ---- */
function mainCats(){ return CATS.filter(c=>!c.parent&&c.slug!=='od-reki'); }
function navCats(){
  const m=mainCats();
  const order=['domki-drewniane','sauny','garaze','wiaty','altany','zadaszenia','domki-narzedziowe','dla-dzieci','pozostale'];
  return order.map(s=>m.find(c=>c.slug===s)).filter(Boolean).concat(m.filter(c=>!order.includes(c.slug)));
}
function renderNav(){
  const nav=document.getElementById('nav');
  nav.innerHTML=navCats().map(c=>{
    const sub=(c.subs||[]).map(s=>{const sc=bySlug(s);return sc?`<a href="#/k/${s}">${esc(sc.name)}</a>`:''}).join('');
    return `<div><a href="#/k/${c.slug}">${esc(c.name)}</a>${sub?`<div class="sub">${sub}</div>`:''}</div>`;
  }).join('')+
  `<div><a href="#/o-nas">O nas</a></div><div><a href="#/montaz">Montaż</a></div><div><a href="#/galeria">Galeria</a></div><div><a href="#/kontakt">Kontakt</a></div>`;
}
function renderFoot(){
  document.getElementById('footGrid').innerHTML=`
  <div><h4>Kategorie</h4><ul>${mainCats().map(c=>`<li><a href="#/k/${c.slug}">${esc(c.name)}</a></li>`).join('')}</ul></div>
  <div><h4>Produkty</h4><ul><li><a href="#/szukaj">Wyszukaj produkt</a></li><li><a href="#/wycena">Wycena online</a></li></ul></div>
  <div><h4>Informacje</h4><ul><li><a href="#/polityka">Polityka prywatności</a></li><li><a href="#/regulamin">Regulamin</a></li><li><a href="javascript:shCookiesOpen()">Ustawienia cookies</a></li><li><a href="#/o-nas">O nas</a></li><li><a href="#/kontakt">Kontakt</a></li><li><a href="#/mapa">Mapa strony</a></li><li><a href="#/galeria">Galeria</a></li><li><a href="#/montaz">Montaż</a></li></ul></div>
  <div><h4>Kontakt</h4><ul><li>Sauna House<br>L. Ługiewicz P. Zbrzeski s.c.</li><li>ul. Fabryczna 13<br>11-040 Dobre Miasto</li><li>☎ <a href="tel:+48695422424">695 422 424</a></li><li>✉ <a href="mailto:saunahouse@wp.pl">saunahouse@wp.pl</a></li><li><a href="https://allegro.pl/uzytkownik/leszek32l" target="_blank" rel="noopener">Nasze Allegro</a></li><li><a href="https://www.facebook.com/p/Saunahousepl-100077345640359/" target="_blank" rel="noopener">Facebook</a></li></ul></div>`;
}

/* ---- strony ---- */
function crumbs(path){ return `<p class="crumbs">🏠 <a href="#/">Strona główna</a>${path}</p>`; }

function home(){
  const top=PRODUCTS.filter(p=>p.c==='domki-drewniane').slice(0,8);
  const tileImg={'sauny':'img/sauna-kat.jpg','domki-drewniane':'img/domki-kat.jpg','altany':'https://www.saunahouse.pl/assets/img/Altanki/pawilon.PNG'};
  return `<section class="hero"><div class="hero-txt"><h1>Domek letniskowy<br><em>pod Twoje okno.</em></h1>
  <p>Produkujemy domki letniskowe z tarasem — idealne na weekendy nad jeziorem i na działkę. To także cała zabudowa drewniana: sauny, altany, garaże i zadaszenia. Doradzimy, dowozimy i montujemy w całej Polsce.</p>
  <a class="cta" href="#/k/domki-drewniane">Zobacz domki drewniane</a></div><div class="hero-art"><img src="https://www.saunahouse.pl/assets/img/Domki/Xxl/domek_xxl.PNG" alt="Drewniany domek z tarasem — SaunaHouse" loading="eager"></div></section>
  <div class="sec"><h2>Kategorie</h2></div>
  <div class="tiles">${navCats().map(c=>`<a class="tile" href="#/k/${c.slug}">${tileImg[c.slug]?`<span class="ph"><img src="${tileImg[c.slug]}" alt="${esc(c.name)}" loading="lazy" style="width:100%;height:100%;object-fit:contain"></span>`:ph(c.name)}<h3>${esc(c.name)}</h3></a>`).join('')}
  </div>
  <div class="sec"><h2>Domki drewniane</h2><a href="#/k/domki-drewniane">zobacz wszystko →</a></div>
  <div class="grid">${top.map(card).join('')}</div>
  <div class="sec"><h2>Dlaczego warto nam zaufać?</h2></div>
  <div class="why">
  <div class="item"><h3>🏭 Własna produkcja</h3><p>Projektujemy i produkujemy we własnej stoliarni w Dobrym Mieście — wymiary i układ pomieszczeń dopasowujemy do potrzeb klienta, nie tylko do katalogu.</p></div>
  <div class="item"><h3>🚚 Cała Polska</h3><p>Doradzamy przy wyborze modelu, dowozimy i montujemy w każdym województwie. Koszt transportu ustalamy indywidualnie, przed zamówieniem.</p></div>
  <div class="item"><h3>🔧 Montaż bez komplikacji</h3><p>Doświadczona ekipa stawia domek czy saunę w 1–2 dni. W pakiecie masz pełne okucia, wkręty i instrukcję — chcesz, złożysz też samodzielnie.</p></div>
  <div class="item"><h3>⭐ 5,0 na Google</h3><p>Klienci oceniają nas na 5,0 z 9 opinii w Google. Sprzedaż prowadzimy też od lat na <a href="https://allegro.pl/uzytkownik/leszek32l" target="_blank" rel="noopener">Allegro</a>.</p></div>
  </div>
  <div class="sec"><h2>Co mówią o nas klienci?</h2><a href="${G.url}" target="_blank" rel="noopener">wszystkie opinie na Google →</a></div>
  ${gBadge()}
  <div class="revbelt"><div class="revtrack" style="--revdur:50s"><div class="revhalf">${shownReviews.map(r=>revCard(r,GREVIEWS.indexOf(r))).join('')}</div><div class="revhalf" aria-hidden="true">${shownReviews.map(r=>revCard(r,GREVIEWS.indexOf(r))).join('')}</div></div></div>
  <p class="kv">Opinie pochodzą z wizytówki Google (5,0 z ${G.count} opinii). Codziennie inna kolejność — całość zawsze dostępna na Google.</p>`;
}

function card(p){
  const tag=p.tag?`<span class="badge ${p.tag==='Nowy'?'new':''}">${esc(p.tag)}</span>`:'';
  return `<div class="card"><a class="ph" href="#/p/${prodSlug(p)}">${photo(p)}</a><div class="info">${tag}<span class="name"><a href="#/p/${prodSlug(p)}">${esc(p.n)}</a></span><span class="price">${zl(p.p)}</span><a class="btn alt" style="text-align:center" href="#/p/${prodSlug(p)}">Zapytaj o wycenę</a></div></div>`;
}
function prodSlug(p){ return p.n.toLowerCase().replace(/[^a-z0-9ąćęłńóśźż ]+/gi,'').replace(/ +/g,'-').slice(0,60); }
function findProd(slug){ return PRODUCTS.find(p=>prodSlug(p)===slug); }

function catPage(slug){
  const c=bySlug(slug); if(!c) return notFound();
  const path=c.parent?` → <a href="#/k/${c.parent}">${esc(bySlug(c.parent).name)}</a> → ${esc(c.name)}`:` → ${esc(c.name)}`;
  let subTiles='';
  if(c.subs) subTiles=`<div class="tiles">${c.subs.map(s=>{const sc=bySlug(s);return sc?`<a class="tile" href="#/k/${s}">${ph(sc.name)}<h3>${esc(sc.name)}</h3></a>`:''}).join('')}</div>`;
  const ps=(function collect(slug){let ps=prodsOf(slug);for(const s of (bySlug(slug).subs||[]))if(bySlug(s))ps=ps.concat(collect(s));return ps;})(slug);
  return crumbs(path)+`<h1>${esc(c.name)}</h1><p>${esc(c.desc||'')}</p>${subTiles}
  ${ps.length?`<div class="filters"><label>Cena max: <input id="fmax" type="number" placeholder="np. 30000" oninput="filterCat('${slug}')"></label><label>Sortuj: <select id="fsort" onchange="filterCat('${slug}')"><option value="">Domyślnie</option><option value="pa">Cena ↑</option><option value="pd">Cena ↓</option><option value="na">Nazwa A–Z</option></select></label></div><div class="grid" id="catGrid">${ps.map(card).join('')}</div>`:''}`;
}
window.filterCat=function(slug){
  const max=+((document.getElementById('fmax')||{}).value)||Infinity;
  const sort=(document.getElementById('fsort')||{}).value||'';
  let ps=(function collect(slug){let ps=prodsOf(slug);for(const s of (bySlug(slug).subs||[]))if(bySlug(s))ps=ps.concat(collect(s));return ps;})(slug).filter(p=>p.p<=max);
  if(sort==='pa')ps=[...ps].sort((a,b)=>a.p-b.p);
  else if(sort==='pd')ps=[...ps].sort((a,b)=>b.p-a.p);
  else if(sort==='na')ps=[...ps].sort((a,b)=>a.n.localeCompare(b.n,'pl'));
  document.getElementById('catGrid').innerHTML=ps.map(card).join('');
};

/* dane od właściciela: szczegółowy opis/specyfikacja domków (letniskowe + ogrodowe) */
const DOMKI_EXTRA={
 desc:`Domek wykonany jest z wysokiej jakości świerku skandynawskiego, a deski łączone są na pióro i wpust — podwaliny są fabrycznie impregnowane. Wnętrze podzielono na jedno większe pomieszczenie i dwa mniejsze, ponad wszystkim znajduje się poddasze (z drabiną i małym okienkiem). Wejście to drzwi dwuskrzydłowe z zawiasami i kompletem okuć; doświetlają je dwa okna dwuskrzydłowe i dwa okna jednoskrzydłowe — wszystkie z niezbędnymi okuciami. Okna i drzwi przeszklone są szybą ze szkła i wykończone szprosami; montaż dużych okien jest identyczny jak montaż drzwi. Wewnątrz zamontowane jest dwoje drzwi wewnętrznych. Przed domkiem rozciąga się zadaszony taras. Do każdego pakietu dołączamy instrukcję montażu oraz niezbędne okucia, wkręty i gwoździe.`,
 spec:[
  ['Grubość desek','Ścianowe 40 mm; podłogowe i dachowe 18 mm'],
  ['Materiał','Wysokiej jakości świerk skandynawski'],
  ['Łączenie desek','Pióro i wpust, impregnowane podwaliny'],
  ['Wnętrze','Jedno większe pomieszczenie + dwa mniejsze'],
  ['Poddasze','Tak — z drabiną i małym okienkiem'],
  ['Drzwi zewnętrzne','Dwuskrzydłowe, z zawiasami i kompletem okuć'],
  ['Drzwi wewnętrzne','Dwoje'],
  ['Okna','2 × dwuskrzydłowe + 2 × jednoskrzydłowe, z okuciami'],
  ['Szyby','Szkło, wykończenie szprosami (montaż dużych okien jak drzwi)'],
  ['Taras','Zadaszony'],
  ['W pakiecie','Instrukcja montażu, okucia, wkręty i gwoździe'],
  ['Papa dachowa','Nie zawarta w pakiecie (do wyboru w wycenie)']
 ]
};

function prodDesc(p,c){
  const dim=p.n.match(/(\d+[.,]\d+)\s*[x×]\s*(\d+[.,]\d+)\s*m/i);
  const th=p.n.match(/(\d+)\s*mm/i);
  const extra=(c&&c.slug&&c.slug==='domki-drewniane')?DOMKI_EXTRA:null;
  let s=`<b>${esc(p.n)}</b> — ${esc(c.name.toLowerCase())} produkcji Sauna House (Dobre Miasto, Warmia). ${esc(c.desc||'')}`;
  if(dim) s+=` Wymiary zabudowy: <b>${dim[1].replace(',', '.')} × ${dim[2].replace(',', '.')} m</b>`;
  if(c&&c.slug==='sauny-ogrodowe') s+=` Ściany sauny mają grubość <b>58 mm</b>`;
  if(th&&!extra) s+=(dim?' przy grubości ścian ':' Grubość ścian: ')+`<b>${th[1]} mm</b>`;
  else if(extra) s+=` przy grubości ścian <b>40 mm</b>`;
  if(extra) s+=`. ${extra.desc}`;
  else s+=`. Konstrukcja powstaje z litego drewna w naszej stoliarni, a pakiety zawierają pełne okucia, wkręty i instrukcję montażu — domek lub saunę postawisz samodzielnie albo z naszą ekipą (montaż w 1–2 dni na całej Polsce).`;
  s+=` Cena ${zl(p.p)} jest <b>demonstracyjna</b> — finalna wycena zależy od wyposażenia, pieca i miejsca montażu. <a href="#/wycena?produkt=${encodeURIComponent(p.n)}">Zapytaj o wycenę →</a>`;
  return s;
}
function specRows(p,c){
  const dim=p.n.match(/(\d+[.,]\d+)\s*[x×]\s*(\d+[.,]\d+)\s*m/i);
  const th=p.n.match(/(\d+)\s*mm/i);
  const extra=(c&&c.slug&&c.slug==='domki-drewniane')?DOMKI_EXTRA:null;
  const rows=[];
  rows.push(['Model',esc(p.n)]);
  if(dim) rows.push(['Wymiary',`${dim[1].replace(',', '.')} × ${dim[2].replace(',', '.')} m (szer. × gł.)`]);
  if(c&&c.slug==='sauny-ogrodowe') rows.push(['Grubość ścian','58 mm']);
  if(th&&!extra) rows.push(['Grubość ścian',`${th[1]} mm`]);
  if(extra){
    return rows.concat(extra.spec);
  }
  rows.push(['Materiał','Świerk skandynawski — drewno lite']);
  rows.push(['Taras',/taras/i.test(p.n)?'Tak, w standardzie':'Zgodnie z projektem / wyceną']);
  rows.push(['Wyposażenie pakietu','Okucia, wkręty i gwoździe, instrukcja montażu']);
  rows.push(['Montaż','Ekipa SaunaHouse lub samodzielny wg instrukcji']);
  rows.push(['Transport','Dostawa na terenie całej Polski lub odbiór osobisty']);
  rows.push(['Wymiary i wyposażenie na życzenie','Tak — własna stoliarnia, bez limitu katalogu']);
  rows.push(['Cena',`${zl(p.p)} — cena demonstracyjna, wycena indywidualna`]);
  return rows;
}

function prodPage(slug){
  const p=findProd(slug); if(!p) return notFound();
  window.__pCur=p;
  const c=bySlug(p.c);
  // galeria: zdjęcie produktu + zdjęcia produktów z tej samej kategorii + ilustracje SVG
  const imgs=[];
  if(p.img) imgs.push({src:p.img,label:esc(p.n)});
  if(p.dimImg) imgs.push({src:p.dimImg,label:'Wymiary — '+esc(p.n)});
  for(const s of prodsOf(p.c)){ if(imgs.length>=6) break; if(s.img&&!imgs.some(i=>i.src===s.img)) imgs.push({src:s.img,label:esc(s.n)}); }
  const nIllu=Math.max(0,Math.min(6-imgs.length,3));
  for(let i=0;i<nIllu;i++) imgs.push({svg:true});
  let gal;
  const LB=imgs.filter(x=>!x.svg).map(x=>({src:x.src,label:x.label}));
  window.__pLb=LB;
  if(imgs.length>1){
    const main=imgs[0].svg?illu(p.c,p.n):`<span class="phwrap"><img id="pMainImg" src="${esc(imgs[0].src)}" alt="${esc(p.n)}" title="Kliknij, aby powiększyć" onclick="openLightbox(this.src,this.alt,window.__pLb.length>1?window.__pLb:null)" style="width:100%;height:100%;object-fit:contain;cursor:zoom-in">${catLbl(p)}</span>`;
    gal=`<div class="big">${main}</div><div class="thumbs">${imgs.map((im,i)=>
      `<button type="button" class="thumb${i===0?' on':''}" data-seed="${esc(p.n+i)}" onclick="setProdPhoto(this,${im.svg?`'svg'`:`'${esc(im.src).replace(/'/g,"\\'")}'`})">${im.svg?illu(p.c,p.n+i):`<img src="${esc(im.src)}" alt="" loading="lazy">`}</button>`).join('')}</div>`;
  } else gal=`<div class="big">${photo(p)}</div>`;
  const sib=prodsOf(p.c).filter(x=>x!==p).slice(0,4);
  return crumbs(` → <a href="#/k/${p.c}">${esc(c.name)}</a> → ${esc(p.n)}`)+
  `<div class="prod"><div class="gallery">${gal}</div><div><h1>${esc(p.n)}</h1>
  <p class="kv" style="margin-top:-6px">💡 Kliknij zdjęcie, aby je powiększyć.</p>
  <p class="price">od ${zl(p.p)}</p><p class="kv">Cena demonstracyjna. Wycena indywidualna zależy od wymiarów, drewna, pieca i wyposażenia.</p>
  <a class="btn" href="#/wycena?produkt=${encodeURIComponent(p.n)}">Wyceń ten produkt</a>
  <a class="btn alt" href="#/kontakt">Zadaj pytanie</a></div></div>`+
  `<div class="sec dimsec"><div class="ptabs"><button type="button" class="ptab on" id="ptabDesc" onclick="showPTab('desc')">Opis</button><button type="button" class="ptab" id="ptabDim" onclick="showPTab('dim')">Wymiary</button></div></div>
  <div class="page" id="paneDesc"><div class="desc-wrap" id="descWrap">${prodDesc(p,c)}</div><button class="btn alt dmore" onclick="toggleDesc(this)">Rozwiń ▾</button></div>
  <div class="page" id="paneDim" style="display:none">${p.dimImg
    ?`<figure class="dimfig"><img src="${esc(p.dimImg)}" alt="Wymiary — ${esc(p.n)}" title="Kliknij, aby powiększyć" onclick="openLightbox('${esc(p.dimImg).replace(/'/g,"\\'")}','Wymiary — ${esc(p.n).replace(/'/g,"")}',window.__pLb)" style="cursor:zoom-in"><figcaption>Szkic z wymiarami zabudowy — kliknij, aby powiększyć.</figcaption></figure>`
    :`<div class="dimempty">📐 <b>Wymiary</b><br>Zdjęcie z wymiarami tego modelu będzie wkrótce. W celu uzyskania dokładnych wymiarów — <a href="#/kontakt">zapytaj</a>.</div>`}</div>
  <div class="sec"><h2>Specyfikacja techniczna</h2></div>
  <div class="page"><div class="desc-wrap" id="specWrap"><table class="spec">${specRows(p,c).map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')}</table></div><button class="btn alt dmore" onclick="toggleWrap('specWrap',this)">Rozwiń ▾</button></div>`+
  `
  <div class="sec"><h2>Dostosuj produkt — wycena online</h2></div>
  <div class="formbox">${quoteForm(p.n,p.c)}</div>
  <div class="sec"><h2>Opinie klientów</h2><a href="${G.url}" target="_blank" rel="noopener">zobacz na Google →</a></div>
  ${gBadge()}
  <div class="revbelt"><div class="revtrack" style="--revdur:50s"><div class="revhalf">${shownReviews.map(r=>revCard(r,GREVIEWS.indexOf(r))).join('')}</div><div class="revhalf" aria-hidden="true">${shownReviews.map(r=>revCard(r,GREVIEWS.indexOf(r))).join('')}</div></div></div>
  ${sib.length?`<div class="sec"><h2>Podobne produkty</h2></div><div class="grid">${sib.map(card).join('')}</div>`:''}`;
}

window.setProdPhoto=function(el,v){
  document.querySelectorAll('.thumbs .thumb').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  const big=el.closest('.gallery').querySelector('.big');
  if(v==='svg') big.innerHTML=illu(el.dataset.seed||'',el.dataset.seed||'');
  else big.innerHTML=`<span class="phwrap"><img id="pMainImg" src="${v}" alt="${el.dataset.seed||'Zdjęcie produktu'}" title="Kliknij, aby powiększyć" onclick="openLightbox(this.src,this.alt,window.__pLb&&window.__pLb.length>1?window.__pLb:null)" style="width:100%;height:100%;object-fit:contain;cursor:zoom-in">${catLbl(window.__pCur||{})}</span>`;
};

function quoteForm(name='',cat=''){
  cat=cat||'';
  let fields='';
  if(cat.startsWith('sauny')||cat.startsWith('balie')||cat.startsWith('beczki')){
    fields=`<label>Wymiary / model</label><input name="wymiary" placeholder="np. 4,0 x 2,4 m">
    <label>Piec</label><select name="piec"><option>Piec elektryczny</option><option>Opalany drewnem z wewnątrz</option><option>Opalany drewnem z zewnątrz</option><option>Bez pieca</option></select>
    <label>Drewno / kolor</label><select name="drewno"><option>Cedr</option><option>Świerk skandynawski</option><option>Hemlock</option><option>Termo-świerk</option></select>
    <label>Wyposażenie dodatkowe</label><textarea name="dodatki" placeholder="szyba panoramiczna, prysznic, ławki, hydromasaż…"></textarea>`;
  } else if(cat.startsWith('domki')){
    fields=`<label>Wymiary / model</label><input name="wymiary" placeholder="np. 5,0 x 4,0 m">
    <label>Deski podłogowe</label><select name="podloga"><option>18 mm</option><option>28 mm</option></select>
    <label>Pokrycie dachowe</label><select name="dach"><option>Papa termozgrzewalna</option><option>Gont</option><option>Blachodachówka</option><option>Bez pokrycia</option></select>
    <label>Wyposażenie dodatkowe</label><div class="extra"><div class="checks"><label class="chk"><input type="checkbox" name="dodatki" value="Rynny"> 🌧 Rynny</label><label class="chk"><input type="checkbox" name="dodatki" value="Okiennice"> 🪟 Okiennice</label></div><input name="dodatkiInne" class="other" placeholder="Inne — np. taras, zadaszenie tarasu…"></div>
    <label>Informacje dodatkowe</label><textarea name="info" placeholder="uwagi, preferowany termin, lokalizacja…"></textarea>`;
  } else if(cat.startsWith('altany')||cat.startsWith('pawilony')||cat.startsWith('wiaty')||cat.startsWith('zadaszenia')||cat.startsWith('pergole')||cat.startsWith('hustawki')){
    fields=`<label>Wymiary</label><input name="wymiary" placeholder="np. 3,0 x 3,0 m">
    <label>Materiał dachu / pokrycie</label><select name="dach"><option>Deska drewniana</option><option>Papa</option><option>Blacha</option><option>Gont bitumiczny</option></select>
    <label>Dodatkowe uwagi</label><textarea name="dodatki" placeholder="podłoga, balustrada, słupy, umiejscowienie…"></textarea>`;
  } else if(cat.startsWith('garaze')){
    fields=`<label>Wymiary</label><input name="wymiary" placeholder="np. 3,5 x 5,0 m">
    <label>Brama</label><select name="brama"><option>Segmentowa</option><option>Uchylna</option><option>Bez bramy</option></select>
    <label>Grubość ścian</label><select name="sciany"><option>28 mm</option><option>34 mm</option><option>45 mm</option></select>
    <label>Dodatkowe uwagi</label><textarea name="dodatki" placeholder="okno, drzwi boczne, piętro…"></textarea>`;
  } else {
    fields=`<label>Wymiary</label><input name="wymiary" placeholder="np. 2,0 x 2,0 m">
    <label>Dodatkowe uwagi</label><textarea name="dodatki" placeholder="opisz, co dostosować"></textarea>`;
  }
  return `<form onsubmit="return sendQuote(event)"><label>Produkt</label><input name="produkt" value="${esc(name)}">
  ${fields}
  <div class="zproj">📐 <b>Masz własny projekt?</b> Wystarczy prosty szkic z góry: zaznacz główne wymiary (szerokość i głębokość) oraz miejsca, w których mają być okna i drzwi. Na takim rysunku przygotujemy dokładną wycenę bez zbędnych formalności.</div>
  <label>Zdjęcie lub szkic (opcjonalnie)</label><input name="zdjecie" type="file" accept="image/*" capture="environment">
  <label>Montaż</label><select name="montaz" onchange="montazToggle(this)"><option>Z montażem (ekipa SaunaHouse)</option><option>Samodzielny (bez montażu)</option></select>
  <label id="row-miejsce">Miejsce montażu</label><input id="row-miejsce-in" name="miejsce" placeholder="miejscowość, kod pocztowy — np. Dobre Miasto, 11-040">
  <label>Transport</label><select name="transport" onchange="transportToggle(this)"><option>Dostawa — SaunaHouse (do ustalenia)</option><option>Transport własny (odbiór osobisty)</option></select>
  <label id="row-dostawa" style="display:none">Miejsce dostawy</label><input id="row-dostawa-in" name="dostawa" style="display:none" placeholder="miejscowość, kod pocztowy — np. Dobre Miasto, 11-040">
  <label>Imię i nazwisko</label><input name="imie" required placeholder="Jan Kowalski">
  <label>Telefon</label><input name="telefon" type="tel" placeholder="600 000 000">
  <label>E-mail</label><input name="email" type="email" required placeholder="jan@example.com">
  <p style="margin-top:12px"><button class="btn">Wyślij zapytanie o wycenę</button></p></form><p id="qmsg" class="kv" style="margin-top:8px"></p>`;
}
window.montazToggle=function(sel){
  const solo=sel.value.indexOf('Samodzielny')>-1;
  const show=(id,on,blank)=>{const el=document.getElementById(id); if(!el) return; el.style.display=on?'':'none'; if(blank) el.value='';};
  show('row-miejsce',!solo); show('row-miejsce-in',!solo,true);
  // przy montażu z ekipą miejsce dostawy jest zbędne — jest miejsce montażu
  show('row-dostawa',solo); show('row-dostawa-in',solo,true);
};
window.transportToggle=function(sel){
  const dostawa=sel.value.indexOf('Dostawa')>-1;
  const soloSel=document.querySelector('[name=montaz]');
  const solo=soloSel && soloSel.value.indexOf('Samodzielny')>-1;
  // miejsce dostawy tylko przy montażu samodzielnym
  const show=(id,on,blank)=>{const el=document.getElementById(id); if(!el) return; el.style.display=on?'':'none'; if(blank) el.value='';};
  show('row-dostawa',dostawa&&solo); show('row-dostawa-in',dostawa&&solo,true);
};
window.sendQuote=function(e){
  const form=e.target;
  const f=new FormData(form);
  const fileInput=form.querySelector('input[type="file"]');
  const file=fileInput&&fileInput.files&&fileInput.files[0];
  const msg=[...f.entries()].filter(([k,v])=>String(v).trim()!=='').map(([k,v])=>`${k}: ${v}`).join('\n')+(file?`\nzdjecie: plik "${file.name}" — dołączony do wiadomości`: '');
  const el=document.getElementById('qmsg');
  const hasFile=!!file;
  el.innerHTML=hasFile
    ?'Dziękujemy! Otwieramy program pocztowy — <b>dołącz proszę zdjęcie</b> do tworzonej wiadomości (przycisk „Załącz"), bo pola formularza nie przesyłają plików automatycznie.'
    :'Dziękujemy! Zapytanie przygotowane. Ponieważ strona demo nie ma serwera, wyślemy je Twoim mailem — otwieramy program pocztowy.';
  location.href='mailto:saunahouse@wp.pl?subject='+encodeURIComponent('Wycena: '+f.get('produkt'))+'&body='+encodeURIComponent(msg);
  return false;
};

window.toggleWrap=function(id,btn){
  const w=document.getElementById(id);
  const open=w.classList.toggle('open');
  btn.textContent=open?'Zwiń ▴':'Rozwiń ▾';
  btn.classList.toggle('on',open);
};
window.toggleDesc=function(btn){ toggleWrap('descWrap',btn); };
window.showPTab=function(which){
  const d=document.getElementById('paneDesc'), m=document.getElementById('paneDim');
  const bd=document.getElementById('ptabDesc'), bm=document.getElementById('ptabDim');
  if(!d||!m) return;
  const dim=(which==='dim');
  d.style.display=dim?'none':''; m.style.display=dim?'':'none';
  bd.classList.toggle('on',!dim); bm.classList.toggle('on',dim);
};

window.openLightbox=function(src,caption,list){
  const ov=document.createElement('div');
  ov.id='lightbox';
  const items=(list&&list.length>1)?list:null;
  if(items){ window.__lbItems=items; window.__lbIdx=Math.max(0,items.findIndex(x=>x.src===src)); }
  else { window.__lbItems=null; }
  let zoom=1,ox=0,oy=0;
  const paint=()=>{
    const it=window.__lbItems?window.__lbItems[window.__lbIdx]:null;
    const s=it?it.src:src, c=it?it.label:(caption||'');
    zoom=1;ox=0;oy=0;applyT();
    ov.querySelector('.lb-in img').src=s;
    ov.querySelector('.lb-in img').alt=c;
    const p=ov.querySelector('.lb-in p');
    if(c){ p.style.display=''; p.textContent=c+(window.__lbItems?`  (${window.__lbIdx+1}/${window.__lbItems.length})`:''); }
    else p.style.display='none';
  };
  const imgEl=()=>ov.querySelector('.lb-in img');
  const applyT=()=>{const im=imgEl();if(!im)return;im.style.transform=zoom>1?`translate(${ox}px,${oy}px) scale(${zoom})`:'';im.style.cursor=zoom>1?'grab':'zoom-in';};
  ov.innerHTML=`<div class="lb-in"><button class="lb-x" aria-label="Zamknij">✕</button>`+
    (items?`<button class="lb-nav lb-prev" aria-label="Poprzednie">‹</button><button class="lb-nav lb-next" aria-label="Następne">›</button>`:'')+
    `<img src="${src}" alt="${caption||''}"><p></p></div>`;
  ov.addEventListener('wheel',e=>{
    e.preventDefault();
    const im=imgEl(); if(!im) return;
    const r=im.getBoundingClientRect();
    const px=e.clientX-r.left-r.width/2, py=e.clientY-r.top-r.height/2;
    const z0=zoom;
    zoom=Math.min(6,Math.max(1,zoom*(e.deltaY<0?1.25:0.8)));
    const k=zoom/z0;
    if(zoom>1){ ox=px-((px-ox)*k); oy=py-((py-oy)*k); }
    else { ox=0;oy=0; }
    applyT();
  },{passive:false});
  let drag=null;
  ov.addEventListener('pointerdown',e=>{ const im=imgEl(); if(im&&zoom>1&&e.target===im){ drag={x:e.clientX-ox,y:e.clientY-oy}; im.style.cursor='grabbing'; e.preventDefault(); } });
  window.addEventListener('pointermove',e=>{ if(drag){ ox=e.clientX-drag.x; oy=e.clientY-drag.y; applyT(); } });
  window.addEventListener('pointerup',()=>{ if(drag){ drag=null; const im=imgEl(); if(im) im.style.cursor='grab'; } });
  ov.addEventListener('click',e=>{ if(e.target===ov||e.target.classList.contains('lb-x')) { ov.remove(); window.__lbItems=null; } });
  const step=d=>{ const n=window.__lbItems; if(!n) return; window.__lbIdx=(window.__lbIdx+d+n.length)%n.length; paint(); };
  if(items){ ov.querySelector('.lb-prev').onclick=e=>{e.stopPropagation();step(-1)}; ov.querySelector('.lb-next').onclick=e=>{e.stopPropagation();step(1)}; }
  document.addEventListener('keydown',function esc(e){
    if(!document.body.contains(ov)){ document.removeEventListener('keydown',esc); return; }
    if(e.key==='Escape'){ ov.remove(); window.__lbItems=null; document.removeEventListener('keydown',esc); }
    else if(e.key==='ArrowLeft'){ step(-1); }
    else if(e.key==='ArrowRight'){ step(1); }
  });
  document.body.appendChild(ov);
  if(items){ const p=ov.querySelector('.lb-in p'); p.textContent=(caption||'')+`  (1/${items.length})`; p.style.display=''; }
  else { const p=ov.querySelector('.lb-in p'); if(caption){ p.textContent=caption; } else p.style.display='none'; }
};
function simplePage(t,body){ return crumbs(` → ${t}`)+`<div class="page"><h1>${t}</h1>${body}</div>`; }
function notFound(){ return `<div class="page"><h1>Nie znaleziono strony</h1><p><a href="#/">Wróć na stronę główną</a></p></div>`; }

const PAGES={
  'o-nas':()=>simplePage('O nas',`<p>Sauna House to rodzinna firma z Dobrego Miasta na Warmii, działająca od lat w branży drewnianej. Specjalizujemy się w produkcji saun, domków ogrodowych, domków narzędziowych, altanek i pawilonów z najwyższej jakości świerku skandynawskiego. Każdy produkt wykonujemy z drewna litego lub boazerii, a wymiary i układ pomieszczeń dopasowujemy do potrzeb klienta — dzięki własnej stoliarni nie jesteśmy ograniczeni do katalogowych modeli.</p>
  <p>U nas stawiamy na solidne wykonanie: grubość ścian, jakość desek, okucia i stolarka okienna dobierane są tak, aby domek czy sauna służyły przez lata bez dodatkowych prac. Wszystkie pakiety zawierają instrukcję montażu oraz niezbędne okucia, wkręty i gwoździe, a montaż jest możliwy zarówno samodzielnie, jak i z naszą ekipą.</p>
  <p>Realizujemy zamówienia na terenie całej Polski — doradzimy przy wyborze modelu, dowozimy i montujemy na gotowym podłożu. Klienci mogą też kupować nasze produkty przez Allegro, gdzie od lat prowadzimy aukcje i zbieramy pozytywne opinie.</p>
  <p><b>Adres:</b> ul. Fabryczna 13, 11-040 Dobre Miasto</p>
  <p><b>Kontakt:</b> ☎ <a href="tel:+48695422424">695 422 424</a> · ✉ saunahouse@wp.pl</p>
  <p>Znajdziesz nas również na <a href="https://allegro.pl/uzytkownik/leszek32l" target="_blank" rel="noopener">Allegro</a> i <a href="https://www.facebook.com/p/Saunahousepl-100077345640359/" target="_blank" rel="noopener">Facebooku</a>.</p>`),
  'montaz':()=>simplePage('Montaż',`
  <div class="msteps">
    <div class="mstep"><span class="n">1</span><h3>🚚 Dostawa i rozładunek</h3><p>Przywozimy pakiet na miejsce montażu w całej Polsce i rozładowujemy na działce.</p></div>
    <div class="mstep"><span class="n">2</span><h3>🏗️ Montaż konstrukcji i dachu</h3><p>Ekipa SaunaHouse stawia konstrukcję ścian i dach — typowo w 1–2 dni.</p></div>    <div class="mstep"><span class="n">3</span><h3>🔌 Podłączenie pieca</h3><p>Wykonujemy podłączenie pieca — wymagane uprawnienia elektryczne mamy zapewnione.</p></div>
  </div>
  <div class="mnote"><div><h3>📦 Co jest w pakiecie</h3><p>Instrukcja montażu oraz niezbędne okucia, wkręty i gwoździe — budowę możesz też wykonać we własnym zakresie.</p></div><div><h3>🧰 Chcesz montować samodzielnie?</h3><p>Instrukcja z pakietu prowadzi krok po kroku — resztę dobierzesz w wycenie online.</p></div></div>
  <div class="formbox" style="max-width:560px;margin:20px auto 0"><h3 style="margin-bottom:6px">Wycena montażu</h3><p style="font-size:14px;color:#5b6f63;margin-bottom:10px">Podaj lokalizację i model — przygotujemy indywidualną ofertę.</p><a class="btn" href="#/wycena" style="display:inline-block">Zapytaj o wycenę montażu</a></div>`),
  'galeria':()=>{ const GAL=[
    {label:'Sauna Ogrodowa',src:'https://www.saunahouse.pl/assets/img/Sauny/Ogrodowa/sauna_ogrodowa.PNG'},
    {label:'Sauna Exklusiv Narożna',src:'https://www.saunahouse.pl/assets/img/Sauny/Exklusiv%20Narozna/sauna_exklusiv_narozna.PNG'},
    {label:'Sauna Exklusiv Standard',src:'https://www.saunahouse.pl/assets/img/Sauny/Exklusic%20Standard/sauna_exklusiv_standard.PNG'},
    {label:'Sauna Blockbohlen',src:'https://www.saunahouse.pl/assets/img/Sauny/Blockbohlen/sauna_blockbohlen.PNG'},
    {label:'Sauna Elementowa Standard',src:'https://www.saunahouse.pl/assets/img/Sauny/Elementowa%20Standard/sauna_elementowa_standard.PNG'},
    {label:'Sauna Elementowa Narożna',src:'https://www.saunahouse.pl/assets/img/Sauny/Elementowa%20Narozna/sauna_elementowa_narozna.PNG'},
    {label:'Domek XXL',src:'https://www.saunahouse.pl/assets/img/Domki/Xxl/domek_xxl.PNG'},
    {label:'Domek Komfort',src:'https://www.saunahouse.pl/assets/img/Domki/Komfort/domek_komfort.PNG'},
    {label:'Domek Premium',src:'https://www.saunahouse.pl/assets/img/Domki/Premium/domek_premium.PNG'},
    {label:'Domek Relax',src:'https://www.saunahouse.pl/assets/img/Domki/Relax/domek_relax.PNG'},
    {label:'Domek Jaś',src:'https://www.saunahouse.pl/assets/img/Domki/Jas/domek_jas.PNG'},
    {label:'Domek Adaś',src:'https://www.saunahouse.pl/assets/img/Domki/Adas/domek_adas.PNG'},
    {label:'Domek Italia',src:'https://www.saunahouse.pl/assets/img/Domki/Italia/domek_italia.PNG'},
    {label:'Altana otwarta 270x270',src:'https://www.saunahouse.pl/assets/img/Altanki/altana_otwarta_czterokatna.PNG'},
    {label:'Pawilon ośmiokątny',src:'https://www.saunahouse.pl/assets/img/Altanki/pawilon.PNG'}
  ];
  window.shGal=GAL;
  return simplePage('Galeria',`<p>Nasze produkty (zdjęcia z oferty SaunaHouse):</p>
  <div class="gal">${GAL.map((g,i)=>`<div class="tile" style="cursor:zoom-in" onclick="openLightbox('${esc(g.src).replace(/'/g,"\\'")}','${esc(g.label).replace(/'/g,"\\'")}',shGal)"><span class="ph"><img src="${g.src}" alt="${esc(g.label)}" loading="lazy" style="width:100%;height:100%;object-fit:contain"></span><h3 style="font-size:15px">${esc(g.label)}</h3></div>`).join('')}</div>`);
},
  'kontakt':()=>simplePage('Kontakt',`
  <div class="cinfo">
    <a class="citem" href="tel:+48695422424"><span class="ico">📞</span><div><b>695 422 424</b><small>Zadzwoń i zapytaj o wycenę</small></div></a>
    <a class="citem" href="mailto:saunahouse@wp.pl"><span class="ico">✉️</span><div><b>saunahouse@wp.pl</b><small>Odpowiadamy w ciągu 1–2 dni roboczych</small></div></a>
    <a class="citem" href="https://www.google.com/maps/place/Fabryczna+13,+11-040+Dobre+Miasto" target="_blank" rel="noopener"><span class="ico">📍</span><div><b>ul. Fabryczna 13, 11-040 Dobre Miasto</b><small>Sauna House L. Ługiewicz P. Zbrzeski s.c.</small></div></a>
    <a class="citem" href="https://allegro.pl/uzytkownik/leszek32l" target="_blank" rel="noopener"><span class="ico">🛒</span><div><b>Sklep na Allegro</b><small>Gotowe produkty z wysyłką</small></div></a>
    <a class="citem" href="https://www.facebook.com/p/Saunahousepl-100077345640359/" target="_blank" rel="noopener"><span class="ico">👍</span><div><b>Facebook</b><small>Realizacje i nowości</small></div></a>
  </div>
  <div class="formbox" style="margin-top:20px"><h3 style="margin-bottom:6px">Formularz kontaktowy</h3><form onsubmit="return sendQuote(event)"><label>Imię i nazwisko</label><input name="imie" required placeholder="Jan Kowalski"><label>Telefon</label><input name="telefon" type="tel" placeholder="600 000 000"><label>E-mail</label><input name="email" type="email" required placeholder="jan@example.com"><label>Wiadomość</label><textarea name="tresc" required placeholder="Czym możemy pomóc?"></textarea><p style="margin-top:12px"><button class="btn">Wyślij wiadomość</button></p></form></div>`),
  'polityka':()=>simplePage('Polityka prywatności i cookies',`
  <p><b>Administrator danych osobowych:</b> Sauna House L. Ługiewicz P. Zbrzeski s.c., ul. Fabryczna 13, 11-040 Dobre Miasto, NIP 739-387-33-48, REGON 360892778, e-mail: saunahouse@wp.pl, tel. 695 422 424.</p>
  <h3 style="margin:18px 0 6px">Jakie dane zbieramy i po co</h3>
  <p>Zbieramy wyłącznie dane, które podajesz dobrowolnie w formularzach (imię i nazwisko, telefon, e-mail, wybrane opcje produktu, miejsce montażu/dostawy). Używamy ich <b>wyłącznie</b> do przygotowania i przesłania wyceny, odpowiedzi na zapytanie oraz kontaktu w sprawie zamówienia. Podstawą przetwarzania jest art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) oraz Twoja zgoda.</p>
  <h3 style="margin:18px 0 6px">Jak długo przechowujemy dane</h3>
  <p>Zapytania o wycenę przechowujemy do 12 miesięcy, chyba że dojdzie do współpracy — wtedy dane przetwarzamy zgodnie z przepisami podatkowymi i okresami przedawnienia roszczeń.</p>
  <h3 style="margin:18px 0 6px">Pliki cookies</h3>
  <p>Strona używa trzech kategorii plików cookies. Możesz je włączyć/wyłączyć na <a href="#/cookies">Ustawieniach cookies</a>:</p>
  <ul>
    <li><b>Niezbędne</b> — zapamiętywanie Twoich wyborów zgody i ustawień; ich używanie nie wymaga zgody, bo strona nie działa bez nich.</li>
    <li><b>Analityczne</b> — anonimowa statystyka odwiedzin, pomaga ulepszać stronę.</li>
    <li><b>Marketingowe</b> — dopasowanie treści i oferty do zainteresowań.</li>
  </ul>
  <p>Zapisujemy Twoją zgodę w pamięci przeglądarki (localStorage) wraz z datą — dzięki temu nie pytamy ponownie przy każdej wizycie. Zgodę możesz wycofać w każdej chwili: <a href="#/cookies">Ustawienia cookies</a> lub przez wyczyszczenie danych przeglądarki.</p>
  <h3 style="margin:18px 0 6px">Twoje prawa (RODO)</h3>
  <p>Masz prawo do: dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu oraz wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych. Realizujemy je bezpłatnie — napisz na <a href="mailto:saunahouse@wp.pl">saunahouse@wp.pl</a>.</p>
  <h3 style="margin:18px 0 6px">Odbiorcy danych</h3>
  <p>Nie sprzedajemy i nie udostępniamy danych podmiotom trzecim w celach marketingowych. Korzystamy z serwisów zewnętrznych wyłącznie technicznie (Google Fonts — czcionki; Google Maps — mapa lokalizacji), które mogą używać własnych cookies zgodnie ze swoimi politykami.</p>
  <p style="margin-top:16px">Polityka obowiązuje od 13 listopada 2026 r.</p>`),
  'regulamin':()=>simplePage('Regulamin',`
  <p><b>1. Postanowienia ogólne.</b> Serwis saunahouse.pl (dalej „Serwis") prowadzony jest przez Sauna House L. Ługiewicz P. Zbrzeski s.c., ul. Fabryczna 13, 11-040 Dobre Miasto, NIP 739-387-33-48, REGON 360892778 (dalej „Sprzedawca"). Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu.</p>
  <p><b>2. Charakter Serwisu.</b> Serwis jest katalogiem produktów z możliwością zapytania o wycenę. Prezentowane ceny mają charakter <b>demonstracyjny</b> i nie stanowią oferty w rozumieniu art. 66 Kodeksu cywilnego — ostateczna cena i warunki ustalane są indywidualnie (wymiary, drewno, piec, wyposażenie, transport i montaż).</p>
  <p><b>3. Zamawianie.</b> Zamówienia i zapytania przyjmujemy przez formularz wyceny na Serwisie, e-mail (saunahouse@wp.pl), telefon (695 422 424) oraz nasze <a href="https://allegro.pl/uzytkownik/leszek32l" target="_blank" rel="noopener">aukcje Allegro</a>. Umowa sprzedaży dochodzi do skutku po potwierdzeniu zamówienia przez Sprzedawcę (lub — dla zakupów na Allegro — po zawarciu transakcji na platformie).</p>
  <p><b>4. Płatność.</b> Formy płatności ustalane są indywidualnie (przelew, płatność przy odbiorze, zasady platformy Allegro). Towar pozostaje własnością Sprzedawcy do czasu pełnej zapłaty.</p>
  <p><b>5. Dostawa i montaż.</b> Termin dostawy i montażu ustalany jest indywidualnie. Koszt transportu zależy od odległości i wielkości zamówienia. Montaż realizuje ekipa Sprzedawcy na podłożu przygotowanym przez Klienta lub klient montuje samodzielnie wg dołączonej instrukcji.</p>
  <p><b>6. Odstąpienie od umowy.</b> Konsument ma prawo odstąpić od umowy zawartej na odległość w ciągu <b>14 dni</b> bez podania przyczyny (ustawa o prawach konsumenta). Wzór oświadczenia o odstąpieniu udostępniamy na życzenie. Zwrot kosztów następuje nie później niż w ciągu 14 dni od otrzymania oświadczenia. Prawo to nie przysługuje w przypadkach wskazanych w art. 38 tej ustawy, m.in. dla produktów wytwarzanych na indywidualne wymiary (produkcja na zamówienie).</p>
  <p><b>7. Reklamacje.</b> Sprzedawca odpowiada za zgodność towaru z umową na zasadach Kodeksu cywilnego i ustawy o prawach konsumenta. Reklamację zgłoś telefonicznie, e-mailem lub listem na adres siedziby. Rozpatrujemy ją w ciągu <b>14 dni</b>; bez odpowiedzi w tym terminie uznaje się, że uznaliśmy reklamację. Klient niebędący konsumentem odpowiada za sprawdzanie towaru przy odbiorze i ma obowiązki z art. 563 KC (zbadanie i zawiadomienie o wadach).</p>
  <p><b>8. Dane osobowe.</b> Dane z formularzy przetwarzamy zgodnie z <a href="#/polityka">Polityką prywatności</a>. Wykorzystujemy je wyłącznie do realizacji zapytania i zamówienia.</p>
  <p><b>9. Prawa autorskie.</b> Wszystkie zdjęcia, opisy i projekt Serwisu są własnością Sprzedawcy lub osób, które udzieliły licencji. Kopiowanie treści bez zgody jest zabronione.</p>
  <p><b>10. Postanowienia końcowe.</b> W sprawach nieuregulowanych stosuje się prawo polskie. Sąd właściwy dla konsumenta wyznaczany jest zgodnie z przepisami ogólnymi; w pozostałych przypadkach sąd właściwy dla siedziby Sprzedawcy. Serwis może być rejestrowany przez narzędzia analityczne zgodnie z ustawieniami cookies. Regulamin może być zmieniany — zmiany obowiązują od publikacji i nie naruszają nabytych praw.</p>
  <p style="margin-top:16px">Kontakt: Sauna House, ul. Fabryczna 13, 11-040 Dobre Miasto · saunahouse@wp.pl · 695 422 424.</p>`),
  'cookies':()=>simplePage('Ustawienia cookies',`<p>Twoja aktualna zgoda jest zapisana w przeglądarce. Możesz ją zmienić w każdej chwili:</p><div class="formbox" style="max-width:420px"><button class="btn" onclick="shCookiesOpen();location.hash='#/kontakt';return false" style="width:100%">Otwórz ustawienia cookies</button></div><p>Uwaga: wycofanie zgody na pliki niezbędne nie jest możliwe, bo bez nich strona nie zapamięta ustawień. Szczegóły w <a href="#/polityka">Polityce prywatności</a>.</p>`),
  'mapa':()=>simplePage('Mapa strony',`<ul>${CATS.map(c=>`<li><a href="#/k/${c.slug}">${esc(c.name)}</a></li>`).join('')}<li><a href="#/o-nas">O nas</a></li><li><a href="#/montaz">Montaż</a></li><li><a href="#/galeria">Galeria</a></li><li><a href="#/kontakt">Kontakt</a></li></ul>`),
  'wycena':(q)=>simplePage('Wycena online',`<p>Uzupełnij szczegóły — przygotujemy indywidualną ofertę z ceną i terminem.</p><div class="formbox">${quoteForm(q&&q.get('produkt')||'')}</div>`),
};

function searchPage(q){
  const res=PRODUCTS.filter(p=>q&&(p.n.toLowerCase().includes(q)||p.c.includes(q)));
  return crumbs(' → Szukaj')+`<div class="page"><h1>${q?`Wyniki: "${esc(q)}"`:'Szukaj'}</h1><form class="search" onsubmit="return goSearch(event)" style="max-width:420px;margin-bottom:16px"><input id="q" placeholder="Szukaj…"><button class="btn alt" type="submit">Szukaj</button></form>${q?(res.length?`<div class="grid">${res.slice(0,48).map(card).join('')}</div>`:'<p>Brak wyników. Spróbuj innej frazy, np. „sauna", „domek".</p>'):`<p>Wpisz frazę powyżej — przeszukamy 63 produkty i kategorie.</p>`}</div>`;
}
window.goSearch=function(e){
  const inp=(e&&e.target&&e.target.querySelector('input'))||document.querySelector('.search input');
  const q=(inp&&inp.value||'').trim();
  if(q){location.hash='#/szukaj/'+encodeURIComponent(q);}
  return false;
};

/* ---- router ---- */
async function load(){
  const d=await fetch('data/data.json').then(r=>r.json());
  CATS=d.cats; PRODUCTS=d.products.filter(p=>p.n);
  window.CATS=CATS; window.PRODUCTS=PRODUCTS; window.prodSlug=prodSlug;
  renderNav(); renderFoot(); route();
}
function route(){
  const h=location.hash.replace(/^#\/?/,'');
  const [path,query]=h.split('?');
  const qs=query?new URLSearchParams(query):null;
  const [a,b,c]=path.split('/').map(x=>{try{return decodeURIComponent(x)}catch(e){return x}});
  let html;
  if(!a) html=home();
  else if(a==='k') html=catPage(b);
  else if(a==='p') html=prodPage(b);
  else if(a==='szukaj') html=searchPage(b?decodeURIComponent(b):'');
  else if(a==='wycena') html=PAGES.wycena(qs);
  else if(PAGES[a]) html=PAGES[a]();
  else html=notFound();
  document.getElementById('app').innerHTML=html;
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);
load();
