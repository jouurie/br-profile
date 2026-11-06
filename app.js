/* Static public character pages; playback host remains outside route rendering. */
(() => {
  'use strict';
  const data = window.BRENDAN_CONTENT;
  const main = document.getElementById('main');
  const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const label = text => text.replace(/\s*·\s*/g, '·');
  const linkify = text => escape(text).replace(/https:\/\/[^\s<]+/g, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  const sections = data.sections;
  const routes = ['intro', 'home', 'profile', 'world', 'opening', 'guide', 'playlist'];
  const titles = {intro:'꿈으로 입장',home:'홈',profile:'프로필',world:'세계관',opening:'도입부',guide:'이용 가이드',playlist:'플레이리스트'};
  let route = 'intro', profileTab = 0, worldTab = 0, noteTab = 0, placeIndex = 0, guideKey = '진행 안내', guideGroup = 0, settingsPlatform = 'elyn';
  const guideGroups = [
    {title:'시작과 진행',items:['진행 안내','플레이 팁','추천 플레이','로어북 예산 안내','채팅방 이전 안내']},
    {title:'설정과 출력',items:['추천 설정값','모델 추천','출력 가이던스','추가 요약 지침']},
    {title:'명령어와 상태창',items:['명령어','상태창','상태창 · 대사 복원 지침']}
  ];
  const icons = {
    play:'<path d="m9 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
    pause:'<path d="M8 5v14M16 5v14" stroke-width="5"/>',
    prev:'<path d="M5 5v14M19 5 8 12l11 7z" fill="currentColor"/>',
    next:'<path d="M19 5v14M5 5l11 7-11 7z" fill="currentColor"/>',
    repeat:'<path d="M3 11V7a3 3 0 0 1 3-3h14m-3-3 3 3-3 3M21 13v4a3 3 0 0 1-3 3H4m3 3-3-3 3-3"/><text x="12" y="17" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="currentColor" stroke="none">1</text>',
    chevron:'<path d="m9 5 7 7-7 7"/>',
    original:'<path d="M14 3h7v7m0-7L10 14M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>',
    muted:'<path d="m3 9 4 0 5-4v14l-5-4H3zM17 9l5 6m0-6-5 6"/>',
    volume:'<path d="m3 9 4 0 5-4v14l-5-4H3zM16 8c3 2 3 6 0 8M19 5c5 4 5 10 0 14"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  const heading = (title, english, kind='guide', lines=[title]) => `<header class="page-heading section-heading ${kind}-heading">${flatHeaderDecor(kind)}<h1 class="scrap-title${lines.length>1?' scrap-title-stepped':''}" aria-label="${escape(title)}">${lines.map(line=>`<span class="scrap-title-line">${escape(line)}</span>`).join(' ')}</h1><span class="english" aria-hidden="true">${english}</span></header>`;
  const star = '<svg class="star-mark" viewBox="0 0 48 48" aria-hidden="true"><path d="m24 3 6 14 15 1-12 10 4 16-13-8-13 8 4-16L3 18l15-1z"/></svg>';
  const waves = '<svg class="wave-mark" viewBox="0 0 180 45" aria-hidden="true"><path class="wave-back" d="M2 21C7 18 10 4 20 8s7 16 20 15 7-12 16-13 4 6 2 13c-4 12-16 15-25 9S20 20 14 26 0 29 2 21ZM69 17c9-12 17-5 22 3s15 9 23-3 17-5 10 4-21 16-31 11-15-1-21-3-7-6-3-12ZM135 21c5-13 15-12 21-4s14 7 19-1 10 5 3 13-25 4-30 0-12 4-17 0 0-5 4-8Z"/><path class="wave-front" d="M3 30c9-7 14 0 22 2s12-4 20-2 0 9-8 9-24-6-29-3-11-3-5-6ZM82 31c9-6 16 6 27 0s15-2 10 4-19 7-27 4-16-4-10-8Z"/></svg>';
  const worldWaves = '<svg class="wave-mark world-wave" viewBox="0 0 210 48" aria-hidden="true"><path class="wave-back" d="M1 38C16 24 24 9 38 11C52 13 40 34 59 29C75 25 81 5 95 6C114 8 96 31 117 26C133 23 141 3 155 6C171 10 153 29 176 25C190 23 199 23 209 32C190 29 184 42 168 40C149 38 153 25 141 31C123 42 116 43 105 36C95 29 97 22 86 29C70 40 59 43 47 36C36 29 38 23 28 28C14 36 10 44 1 43Z"/><path class="wave-front" d="M28 16C42 6 51 14 45 25C40 32 46 36 56 32C48 39 35 35 39 26C44 16 37 13 28 19ZM84 12C101 0 111 10 104 22C100 29 106 32 116 29C105 37 93 32 98 23C104 13 94 10 84 16ZM145 12C159 2 170 12 163 23C159 30 169 32 179 29C164 38 153 31 158 23C163 14 154 10 145 16Z"/><path d="M5 43C22 33 27 32 41 37S61 42 76 35S94 32 107 38S128 39 141 33S160 43 175 39S194 31 209 33" fill="none" stroke="var(--blue)" stroke-width="3"/></svg>';
  const worldSurf = '<svg class="wave-mark world-surf" viewBox="0 0 500 100" preserveAspectRatio="none" aria-hidden="true"><path fill="var(--blue)" d="M0 43C48 8 60 71 104 41S168 9 204 45S273 16 309 40S380 14 418 42S469 20 500 35V100H0Z"/><path fill="var(--cyan)" d="M0 55C39 15 63 87 108 52S169 32 208 58S263 29 312 55S369 36 416 58S466 30 500 49V100H0Z"/><path fill="var(--paper)" opacity=".65" d="M0 70C43 39 70 96 113 70S170 52 211 76S274 53 314 72S372 58 417 76S468 54 500 68V100H0Z"/><path fill="var(--cyan)" d="M0 83C45 61 67 105 114 84S172 72 215 90S276 70 318 87S376 76 421 88S469 74 500 81V100H0Z"/></svg>';
  const ladder = '<svg class="ladder-mark" viewBox="0 0 80 90" aria-hidden="true"><path d="M20 80V20C20 0 40 0 40 20v10M50 80V20C50 0 70 0 70 20v10M20 40h30M20 58h30M20 76h30"/></svg>';
  const smile = '<svg class="smile-mark" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="M14 27q10 17 21-1M16 15v5M31 15v5"/></svg>';
  const palm = '<span class="palm-mark" aria-hidden="true"></span>';

  const flatWave = '<svg class="flat-wave-art" viewBox="0 0 400 110" aria-hidden="true"><path fill="var(--cyan)" stroke="var(--paper)" stroke-width="4" d="M8 98C38 62 48 25 83 25C108 25 99 44 83 54C73 61 77 74 91 68C113 59 125 25 154 20C180 15 177 36 161 48C145 61 147 73 164 68C191 60 205 13 238 9C270 5 263 27 247 42C234 54 241 67 259 58C284 46 306 25 327 33C348 42 323 58 329 67C338 82 362 71 390 92L394 102H7Z"/><path fill="var(--blue)" d="M22 99C58 75 76 88 104 72C127 58 133 48 149 42C125 70 141 87 164 79C200 69 217 27 242 22C223 43 217 61 230 71C246 85 279 61 294 57C277 76 282 88 305 84C333 79 355 94 380 101Z"/><path fill="var(--paper)" d="M56 66C65 48 75 38 87 36C89 39 78 46 76 49C65 58 66 61 56 66ZM210 45C216 27 229 18 243 18C238 24 221 31 210 45Z"/></svg>';
  const flatDroplets = '<svg class="flat-droplets" viewBox="0 0 72 90" aria-hidden="true"><path fill="var(--cyan)" d="M14 62C6 35 23 2 36 8C52 16 30 46 14 62ZM36 65C47 42 70 35 69 49C68 62 52 65 36 65ZM11 80C13 69 24 67 27 74C30 82 17 87 11 80Z"/><path stroke="var(--paper)" stroke-width="3" d="m29 17-3 6m34 25-4 3"/></svg>';
  const flatRibbon = '<svg class="flat-ribbon" viewBox="0 0 400 250" aria-hidden="true"><path d="M41 201C-2 179 44 110 122 113C226 117 195 27 150 26C96 24 94 67 138 98C198 141 234 234 310 219C379 207 360 147 296 156C242 164 213 242 171 235C123 227 194 178 253 175C311 171 355 187 384 212" fill="none" stroke="var(--ink)" stroke-width="15" stroke-linecap="round"/></svg>';
  const flatCassette = '<div class="flat-cassette"><svg viewBox="0 0 240 145" aria-hidden="true"><rect x="4" y="4" width="232" height="137" rx="9" fill="var(--blue)" stroke="var(--ink)" stroke-width="5"/><rect x="19" y="18" width="202" height="32" rx="4" fill="var(--paper)"/><circle cx="71" cy="82" r="22" fill="var(--cyan)"/><circle cx="71" cy="82" r="10" fill="var(--navy)"/><circle cx="169" cy="82" r="22" fill="var(--cyan)"/><circle cx="169" cy="82" r="10" fill="var(--navy)"/><rect x="25" y="113" width="190" height="16" rx="3" fill="var(--cyan)"/></svg><span>DREAM PLAYLIST</span></div>';
  const flatTicket = fill => '<div class="flat-decor-ticket '+fill+'"><svg viewBox="0 0 100 180" aria-hidden="true"><path fill="var(--'+fill+')" stroke="var(--ink)" stroke-width="2" d="M8 3H92V12L97 16L92 21L97 27L92 33L97 39L92 45L97 51L92 57L97 63L92 69L97 75L92 81L97 87L92 93L97 99L92 105L97 111L92 117L97 123L92 129L97 135L92 141L97 147L92 153L97 159L92 165V177H8V165L3 159L8 153L3 147L8 141L3 135L8 129L3 123L8 117L3 111L8 105L3 99L8 93L3 87L8 81L3 75L8 69L3 63L8 57L3 51L8 45L3 39L8 33L3 27L8 21L3 16L8 12Z"/><path d="M18 15H82M18 165H82" stroke="var(--blue)" stroke-width="1.5"/><path d="M13 27V153M87 27V153" stroke="var(--navy)" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 13"/></svg>'+palm+waves+'</div>';
  function flatHeaderDecor(kind){
    const palms='<span class="flat-palm flat-palm-a">'+palm+'</span><span class="flat-palm flat-palm-b">'+palm+'</span>';
    const surf='<span class="flat-surf flat-surf-a">'+flatWave+'</span><span class="flat-surf flat-surf-b">'+flatWave+'</span>';
    const sparks='<span class="flat-spark flat-spark-a">'+star+'</span><span class="flat-spark flat-spark-b">'+star+'</span><span class="flat-splash">'+flatDroplets+'</span>';
    let extra='';
    if(kind==='guide')extra='<span class="flat-pool-ladder">'+ladder.replace('<path','<path class="ladder-outline"')+ladder+'</span>'+flatTicket('paper')+flatTicket('lime');
    if(kind==='playlist')extra=flatRibbon+flatCassette;
    return '<div class="flat-header-decor flat-decor-'+kind+'" aria-hidden="true">'+palms+surf+sparks+extra+'</div>';
  }
  const pin = '<svg class="pin-icon" viewBox="0 0 24 28" aria-hidden="true"><path d="M12 27S2 15 2 10a10 10 0 0 1 20 0c0 5-10 17-10 17Z"/><circle cx="12" cy="10" r="4"/></svg>';
  const railIcons = {tip:'<path d="M9 19h6M10 23h4M8 15a8 8 0 1 1 8 0l-1 3H9Z"/>',book:'<path d="M12 5C7 1 2 3 2 3v17s5-2 10 1c5-3 10-1 10-1V3s-5-2-10 2Zm0 0v16"/>',chat:'<path d="M21 11a9 9 0 0 1-9 9H5l-4 3 2-7a9 9 0 1 1 18-5Z"/><path d="M7 11h.1M12 11h.1M17 11h.1"/>'};
  const railIcon = name => `<svg class="rail-icon" viewBox="0 0 24 28" aria-hidden="true">${railIcons[name]}</svg>`;
  let paperId=0;
  function ticketFrame(fill='paper',shape='sheet') {
    const geometries={sheet:[700,420,6,[38,95,152,209,266,323,380]],row:[250,70,3.5,[11,27,43,59]],compact:[350,40,3.2,[10,20,30]],card:[200,160,6,[22,51,80,109,138]],'start-row':[350,100,4,[17,39,61,83]]};
    const [w,h,r,ys]=geometries[shape],corner=Math.min(7,h*.12),depth=r*1.2;
    let path=`M${corner} 2H${w-corner}Q${w-corner} ${corner} ${w-2} ${corner}`;
    for(const y of ys)path+=`V${y-r}c${-depth} 0 ${-depth} ${r*2} 0 ${r*2}`;
    path+=`V${h-corner}Q${w-corner} ${h-corner} ${w-corner} ${h-2}H${corner}Q${corner} ${h-corner} 2 ${h-corner}`;
    for(const y of [...ys].reverse())path+=`V${y+r}c${depth} 0 ${depth} ${-r*2} 0 ${-r*2}`;
    path+=`V${corner}Q${corner} ${corner} ${corner} 2Z`;
    const id=`paper-${paperId++}`;
    const pattern=fill==='paper'?`<defs><pattern id="${id}" width="300" height="300" patternUnits="userSpaceOnUse" stroke="none"><rect width="300" height="300" fill="#fff" stroke="none"/><image href="assets/paper-texture.png" width="300" height="300" opacity=".35" stroke="none"/></pattern></defs>`:'';
    return `<svg class="ticket-frame frame-${shape} fill-${fill}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${pattern}<path d="${path}" ${pattern?`fill="url(#${id})"`:''} vector-effect="non-scaling-stroke"/></svg>`;
  }
  const buttonTicket = (fill='blue') => ticketFrame(fill,'row').replace('class="ticket-frame','class="button-edge ticket-frame');
  const startFrame = fill => ticketFrame(fill,'card')+ticketFrame(fill,'start-row');
  const titleMark = () => `<div class="ticket-title" aria-label="See you after."><span>SEE YOU</span><span>AFTER.</span>${star}</div><div class="name-ticket">BRENDAN HALE</div>`;
  const poolPhoto = (extra='') => `<figure class="polaroid pool-photo ${extra}"><img src="assets/waterpark.png" alt="꿈속 워터파크의 푸른 수영장" width="1536" height="1024"><figcaption>Our Summer<br>Never Ends.</figcaption></figure>`;
  const portraitPhoto = (extra='') => `<figure class="polaroid portrait ${extra}"><img src="assets/brendan.png" alt="은백색 머리와 푸른 눈의 브렌든 헤일" width="1024" height="1536"><figcaption>Brendan Hale</figcaption>${smile}</figure>`;

  // Keep original copy payloads intact; strip source-only bullet decorations at display time.
  function prose(text) {
    const lines = text.split('\n');
    let html = '', list = false;
    const close = () => { if (list) { html += '</ul>'; list = false; } };
    for (const [index, line] of lines.entries()) {
      if (!line.trim()) { close(); continue; }
      if (line.startsWith('▸ ')) {
        close();
        const next = lines.slice(index + 1).find(value => value.trim()) || '';
        const tag = next.startsWith('· ') ? 'h3' : 'p';
        html += `<${tag}>${linkify(tag === 'h3' ? label(line.slice(2).replace(/^🔗\s*/, '')) : line.slice(2).replace(/^🔗\s*/, ''))}</${tag}>`;
      }
      else if (line.startsWith('· ')) { if (!list) { html += '<ul>'; list = true; } html += `<li>${linkify(line.slice(2))}</li>`; }
      else if (line.startsWith('↳ ')) { close(); html += `<p class="subnote">${linkify(line.slice(2))}</p>`; }
      else { close(); html += `<p>${linkify(line)}</p>`; }
    }
    close();
    return `<div class="prose">${html}</div>`;
  }
  // Semantic line icons share the same cobalt heading role across reading renderers.
  const subjectIcon = title => {
    const t=String(title).replace(/<[^>]*>/g,'');
    const path=/사별|전하기/.test(t)?'<rect x="2" y="4" width="20" height="16"/><path d="m2 5 10 8L22 5M2 20l7-8m13 8-7-8"/>':/사라질/.test(t)?'<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3Z"/>':/작품/.test(t)?'<path d="M12 5C7 2 2 4 2 4v17s5-2 10 1c5-3 10-1 10-1V4s-5-2-10 1Zm0 0v17"/>':/성인/.test(t)?'<path d="M12 22 3 13A6 6 0 0 1 12 5a6 6 0 0 1 9 8Z"/>':/다음 꿈/.test(t)?'<rect x="5" y="2" width="14" height="20" rx="1"/><path d="M10 19h4"/>':/장소|무대|공간|워터파크/.test(t)?'<path d="M12 22S4 14 4 9a8 8 0 1 1 16 0c0 5-8 13-8 13Z"/><circle cx="12" cy="9" r="2.5"/>':/사람|친구|브렌든|모습|이름/.test(t)?'<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3Z"/>':/꿈|시간|깨어/.test(t)?'<path d="M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z"/>':/지침|설정|모델|출력|상태|명령/.test(t)?'<rect x="5" y="2" width="14" height="20" rx="1"/><path d="M9 6h6M9 10h6M9 14h4M10 19h4"/>':/이야기|흔적|기억|요약|소재/.test(t)?'<path d="M12 5C7 2 2 4 2 4v17s5-2 10 1c5-3 10-1 10-1V4s-5-2-10 1Zm0 0v17"/>':'<path d="M21 11a9 8 0 0 1-9 8H6l-4 3 1-7a8 8 0 1 1 18-4Z"/>';
    return '<svg class="subject-icon" viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';
  };
  const subjectLabel = title => subjectIcon(title)+'<span>'+title+'</span>';
  const menuRail = (html,kind) => '<div class="menu-rail '+kind+'"><button type="button" class="rail-step" data-rail-step="-1" aria-label="이전 항목"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>'+html+'<button type="button" class="rail-step" data-rail-step="1" aria-label="다음 항목"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button></div>';
  function syncMenuRails(reveal=false) {
    main.querySelectorAll('.menu-rail').forEach(shell=>{
      const rail=shell.children[1],buttons=shell.querySelectorAll('.rail-step'),active=rail.querySelector('[aria-selected="true"],[aria-current="true"]');
      if(reveal&&active){const a=active.getBoundingClientRect(),r=rail.getBoundingClientRect();if(a.left<r.left)rail.scrollLeft-=r.left-a.left;else if(a.right>r.right)rail.scrollLeft+=a.right-r.right;}
      buttons[0].disabled=rail.scrollLeft<=1;buttons[1].disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-1;
    });
  }
  main.addEventListener('scroll',()=>syncMenuRails(),true);
  // One label and its continuous body form a row, rather than a card per sentence.
  function readingRows(html) {
    return html.replace(/<h3>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3>|<\/div>$)/g,
      (_, title, body) => `<section class="reading-row"><h4>${subjectLabel(title)}</h4><div class="reading-value">${body}</div></section>`);
  }
  const readingProse = text => readingRows(prose(text));
  const copyUnit = (text, title, action='COPY') => `<div class="copy-unit"><pre>${escape(text)}</pre><div class="copy-action"><span class="copy-result" role="status"></span><button type="button" data-copy="${escape(text)}" aria-label="${escape(title)} 복사">${escape(action)}</button></div></div>`;

  // Guide roles follow the meaning of each item; shared profile/world prose stays unchanged.
  const guideDocument = (html, kind='') => `<div class="guide-document${kind?' guide-'+kind:''}">${html}</div>`;
  const guideSection = (title, body, level=3, role=/class="guide-(?:rows|section)/.test(body)?'group':'subject') => {
    const caption=linkify(label(title.replace(/^🔗\s*/,'')));
    return `<section class="guide-section guide-${role}"><h${level}>${role==='subject'?subjectLabel(caption):caption}</h${level}>${body}</section>`;
  };
  const guideText = text => text.split(/((?:하단\s*)?\[\s*⭐?\s*(?:모델 추천|출력 가이던스)\s*\]|플레이 팁(?=을 참고))/g).map(part=>{
    const reference=part.match(/^(?:하단\s*)?\[\s*⭐?\s*(모델 추천|출력 가이던스)\s*\]$|^(플레이 팁)$/);
    const key=reference?.[1]||reference?.[2];
    return key?`<a href="#guide/${encodeURIComponent(key)}">${escape(key)}</a>`:linkify(part);
  }).join('');
  const guidePath = text => `<ol class="guide-path" aria-label="설정 입력 경로">${text.split(/\s*→\s*/).map((step,index,steps)=>`<li>${escape(step)}${index<steps.length-1?'<span aria-hidden="true">→</span>':''}</li>`).join('')}</ol>`;
  const guideNote = text => `<p class="guide-note">${guideText(text)}</p>`;
  const guideList = lines => `<ul class="guide-list">${lines.map(line=>`<li>${guideText(line)}</li>`).join('')}</ul>`;
  function guideRows(rows, kind='settings') {
    return `<dl class="guide-rows guide-${kind}">${rows.map(row=>`<div class="guide-row"><dt>${subjectLabel(guideText(row.term))}</dt><dd><p>${guideText(row.value)}</p>${(row.notes||[]).map(guideNote).join('')}</dd></div>`).join('')}</dl>`;
  }
  function guideBlocks(text, nested=false) {
    const lines=text.split('\n').filter(line=>line.trim());
    let html='', index=0;
    while(index<lines.length) {
      const line=lines[index];
      if(line.startsWith('▸ ')) {
        const title=line.slice(2), body=[];
        index++;
        while(index<lines.length&&!lines[index].startsWith('▸ '))body.push(lines[index++]);
        if(title.startsWith('🔗')&&body.length===1&&/^https:\/\/\S+$/.test(body[0])) {
          const caption=label(title.replace(/^🔗\s*/,'').replace(/:\s*$/,''));
          html+=`<p class="guide-resource"><a href="${escape(body[0])}" target="_blank" rel="noopener noreferrer">${escape(caption)} <span aria-hidden="true">↗</span></a></p>`;
        } else html+=guideSection(title,guideBlocks(body.join('\n'),nested),nested?4:3);
      } else if(line.startsWith('· ')) {
        const entries=[];
        while(index<lines.length&&lines[index].startsWith('· ')) {
          const value=lines[index++].slice(2),notes=[];
          while(index<lines.length&&lines[index].startsWith('↳ '))notes.push(lines[index++].slice(2));
          entries.push({value,notes});
        }
        // Notes naming another setting explain this section, not the final table value.
        const sectionNotes=[];
        entries.forEach(entry=>{entry.notes=entry.notes.filter(note=>{
          if(note.startsWith('기본 ')||note.startsWith('설명이 길어지면')){sectionNotes.push(note);return false;}
          if(entries.some(other=>{if(other===entry||!other.value.includes(': '))return false;const term=other.value.split(': ')[0];return note.startsWith(term+'은 ')||note.startsWith(term+'는 ');})){sectionNotes.push(note);return false;}
          return true;
        });});
        // A plain recommendation does not erase the label/value roles beside it.
        let start=0;
        while(start<entries.length) {
          const paired=entries[start].value.includes(': ');let end=start+1;
          while(end<entries.length&&entries[end].value.includes(': ')===paired)end++;
          const group=entries.slice(start,end);
          if(paired)html+=guideRows(group.map(entry=>{const at=entry.value.indexOf(': ');return {term:entry.value.slice(0,at),separator:':',value:entry.value.slice(at+2),notes:entry.notes};}));
          else html+=`<ul class="guide-list">${group.map(entry=>`<li>${guideText(entry.value)}${entry.notes.map(guideNote).join('')}</li>`).join('')}</ul>`;
          start=end;
        }
        if(sectionNotes.length)html+=`<aside class="guide-notes">${sectionNotes.map(guideNote).join('')}</aside>`;
      } else if(line.startsWith('↳ ')) { html+=guideNote(line.slice(2));index++; }
      else {html+=`<p>${guideText(line)}</p>`;index++;}
    }
    return html;
  }
  function guideSettings(text) {
    // NODY has two real setting locations, with subject headings nested beneath each.
    if(settingsPlatform!=='nody')return text.split(/(?=^▸ )/m).filter(part=>part.trim()).map(part=>{
      const lines=part.trim().split('\n');
      return guideSection(lines.shift().slice(2),guideBlocks(lines.join('\n')),3,'group');
    }).join('');
    const groups=text.split(/(?=^▸ 채팅방 설정 → )/m).filter(part=>part.trim());
    return groups.map(part=>{const lines=part.trim().split('\n');return guideSection(lines.shift().slice(2),guideBlocks(lines.join('\n'),true));}).join('');
  }
  function guideBody(key) {
    const text = sections[key];
    if(key==='플레이 팁') {
      return guideDocument(guideRows(text.split('\n').filter(Boolean).map(line=>{const [term,...value]=line.slice(2).split(' → ');return {term,separator:'→',value:value.join(' → ')};}),'tips'));
    }
    if(key==='추천 플레이') {
      const lines=text.split('\n').filter(Boolean).map(line=>line.slice(2));
      return guideDocument(guideSection('먼저 다가가기',guideList(lines.slice(0,15)))+guideSection('거리와 반응 살피기',guideList(lines.slice(15))));
    }
    if(key==='명령어') {
      const [intro,...lines]=text.split('\n').filter(Boolean);
      return guideDocument(`<p>${linkify(intro)}</p>`+guideRows(lines.map(line=>{const [term,...value]=line.slice(2).split(' | ');return {term,separator:'|',value:value.join(' | ')};}),'commands'));
    }
    if(key==='로어북 예산 안내') {
      return guideDocument(guideList(text.split('\n').filter(Boolean).map(line=>line.replace(/^▸ /,''))));
    }
    if (key === '추천 설정값') {
      const selected = settingsPlatform === 'elyn' ? text : data.nodySettings;
      return `<div id="settings-platform-content" role="tabpanel" aria-labelledby="settings-tab-${settingsPlatform}">${guideDocument(guideSettings(selected),'settings-'+settingsPlatform)}<div class="copy-unit settings-copy"><div class="copy-action"><span class="copy-result" role="status"></span><button type="button" data-copy="${escape(selected)}" aria-label="${settingsPlatform.toUpperCase()} 추천 설정값 전체 복사">설정값 복사</button></div></div></div>`;
    }
    if (key === '출력 가이던스') {
      const split = text.split('▸ ');
      const [location,...intro]=split.shift().trim().split('\n');
      let optionalNext=false;
      return guideDocument(guidePath(location)+guideBlocks(intro.join('\n')) + split.map(part => {
        const lines = part.trim().split('\n');
        const title = lines.shift().trim();
        const optional = lines.indexOf('(선택 사항)');
        if (optional !== -1) lines.splice(optional, 1);
        const note=optionalNext?guideNote('(선택 사항)'):'';
        optionalNext=optional!==-1;
        return guideSection(title,note+copyUnit(lines.join('\n').trim(),title,'내용 복사'));
      }).join(''));
    }
    if (key === '추가 요약 지침') {
      const [location, ...body] = text.split('\n\n');
      return guideDocument(guidePath(location) + copyUnit(body.join('\n\n'), key,'지침 복사'));
    }
    if (key === '상태창') {
      return guideDocument(text.split(/(?=^▸ )/m).filter(part=>part.trim()).map(part=>{
        const lines=part.trim().split('\n'),title=lines.shift().slice(2),body=lines.join('\n');
        if(body.trim().startsWith('<BrenStatus'))return guideSection(title,copyUnit(body.trim(),'상태창 '+title,title+' 복사'));
        const groups=body.split(/(?=^· )/m).filter(part=>part.trim());
        return guideSection(title,groups.map(group=>{
          const entries=group.trim().split('\n'),subject=entries.shift().slice(2);
          return guideSection(subject,guideRows(entries.filter(line=>line.startsWith('↳ ')).map(line=>{const value=line.slice(2),at=value.indexOf(': ');return {term:value.slice(0,at),separator:':',value:value.slice(at+2)};}),'props'),4);
        }).join(''));
      }).join(''));
    }
    return guideDocument(guideBlocks(text),key==='모델 추천'?'models':'');
  }
  function intro() {
    return `<section class="intro-view" aria-label="꿈으로 입장"><div class="intro-backdrop"><div class="intro-scene-plane"><img class="intro-scene" src="assets/waterpark.png" alt="푸른 물빛과 워터슬라이드가 있는 실내 워터파크" width="1672" height="941" fetchpriority="high"><span class="intro-scene-dim" aria-hidden="true"></span><svg class="intro-character-backing" viewBox="0 0 1672 941" aria-hidden="true" focusable="false"><path d="M1274 248 L1413 321 L1420 403 L1392 429 L1395 468 L1476 520 L1606 583 L1607 700 L1635 724 L1631 871 L1608 941 L662 941 L686 846 L610 752 L633 683 L701 603 L721 576 L760 577 L844 553 L898 507 L945 504 L1044 523 L1125 501 L1104 392 L1154 291 Z M965 688 L1108 711 L1084 825 L1043 788 L1003 731 Z" fill="var(--blue)" fill-rule="evenodd" transform="translate(10 10)"/><path d="M1274 248 L1413 321 L1420 403 L1392 429 L1395 468 L1476 520 L1606 583 L1607 700 L1635 724 L1631 871 L1608 941 L662 941 L686 846 L610 752 L633 683 L701 603 L721 576 L760 577 L844 553 L898 507 L945 504 L1044 523 L1125 501 L1104 392 L1154 291 Z M965 688 L1108 711 L1084 825 L1043 788 L1003 731 Z" fill="var(--paper)" fill-rule="evenodd"/></svg><img class="intro-character" src="assets/br-intro-character.webp" alt="" aria-hidden="true" width="3840" height="3072" fetchpriority="high"></div></div><div class="intro-foreground"><div class="intro-scene-plane"><img class="intro-character" src="assets/br-intro-character.webp" alt="" aria-hidden="true" width="3840" height="3072" fetchpriority="high"><p class="intro-quote">“끝나고<br>잠깐 보자.”</p></div></div><div class="intro-stage"><div class="hero-ticket intro-ticket"><svg class="ticket-frame intro-ticket-frame" viewBox="0 0 716 554" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="intro-paper-texture" width="300" height="300" patternUnits="userSpaceOnUse" stroke="none"><rect width="300" height="300" fill="var(--paper)" stroke="none"/><image href="assets/paper-texture.png" width="300" height="300" opacity=".35" stroke="none"/></pattern></defs><path class="intro-ticket-backing" d="M28 3H472L479 11H670L696 37V170C660 170 660 230 696 230V508L670 534H28L3 509V230C39 230 39 170 3 170V28Z" transform="translate(14 14)"/><path class="intro-ticket-paper" d="M28 3H472L479 11H670L696 37V170C660 170 660 230 696 230V508L670 534H28L3 509V230C39 230 39 170 3 170V28Z"/><path class="intro-ticket-inset" d="M33 14H466L473 22H665L685 42V160C645 164 645 235 685 240V503L665 523H33L14 504V240C54 235 54 164 14 160V33Z"/></svg>${titleMark().replaceAll("AFTER.","LATER.").replace("See you after.","See you later.")}${[1].map(i=>`<span class="wave-fragment intro-wave intro-wave-1" aria-hidden="true"><svg class="intro-title-swoosh" viewBox="0 0 640 240" preserveAspectRatio="none" aria-hidden="true"><path d="M47 174C-14 190 -3 231 90 229C207 226 478 151 586 76C651 31 623 10 553 22C605 20 623 34 567 69C454 138 210 217 94 218C39 219 20 208 47 174Z"/></svg></span>`).join('')}<div class="intro-story"><h1>죽은 소꿉친구가 돌아왔다.</h1><p class="hook-sub">다시 만날 수 있는 곳은 꿈속뿐.</p></div><span class="intro-palm-sticker" aria-hidden="true"><svg class="intro-palm-mark" viewBox="0 0 120 160"><path d="M38 154C40 111 49 72 66 40L73 43C58 78 55 117 58 154Z"/><path d="M67 43C48 17 21 13 7 29C29 27 44 37 54 49C30 33 8 39 1 63C20 49 39 50 57 55C35 54 18 73 19 96C30 77 45 67 64 61C65 82 76 95 85 102C82 80 76 65 72 56C93 59 109 68 120 79C115 54 95 42 77 46C97 33 110 34 120 37C108 15 83 18 69 37C70 17 59 3 42 3C57 14 61 27 67 43Z"/></svg></span><div class="ticket-pool" aria-hidden="true"><svg class="intro-pool-mark" viewBox="0 0 140 100"><path class="intro-pool-water" d="M6 78C13 65 25 68 33 62C46 55 56 63 66 59C80 53 91 61 103 62C116 60 119 69 128 72C143 79 142 95 127 97H17C3 98-5 88 6 78Z"/><path class="intro-pool-ladder" d="M51 79V19C51 2 70 2 70 19V25M85 79V19C85 2 104 2 104 19V25M51 43H85M51 60H85"/><path class="intro-pool-ripple" d="M15 86C23 77 30 94 39 86S55 94 64 86S80 94 89 86S105 94 114 86S123 88 128 85"/></svg></div><a class="button admission-button ticket-button" href="#home">${buttonTicket()}입장하기 <span aria-hidden="true">→</span></a></div></div></section>`;
  }
  function home() {
    return `<section class="home-view view mature-view modular-view" aria-label="브렌든 소개">
      <div class="home-book-hero">
        <header class="home-book-identity"><h1>SEE YOU<br>AFTER.</h1><p class="home-book-name">BRENDAN HALE</p><p class="home-book-genre">1990s CANADA / DREAMCORE / MYSTERY</p></header>
        <div class="home-book-story"><h2>죽은 소꿉친구가 돌아왔다.</h2><p>다시 만날 수 있는 곳은 꿈속뿐.</p></div>
        <div class="home-book-actions"><a class="button" href="#profile">브렌든 알아보기 <span aria-hidden="true">›</span></a><a class="button light" href="#guide">시작 전 안내 <span aria-hidden="true">›</span></a></div>
        <div class="home-book-portrait">${portraitPhoto('home-book-photo')}${star}<blockquote class="home-book-quote">“끝나고 잠깐 보자.”</blockquote></div>
        <div class="home-book-pool">${poolPhoto('home-book-pool-photo')}<p class="handwritten">언제나, 여름의 끝에서.</p></div>
      </div>
      <div class="disclosures"><div class="disclosure-buttons"><button type="button" data-disclose="tw" aria-expanded="false" aria-controls="tw-panel">${railIcon('chat')}TW <span aria-hidden="true">+</span></button><button type="button" data-disclose="motif" aria-expanded="false" aria-controls="motif-panel">${railIcon('book')}MOTIF <span aria-hidden="true">+</span></button></div><div id="tw-panel" class="disclosure-body" hidden>${prose(data.tw)}</div><div id="motif-panel" class="disclosure-body" hidden>${prose(sections['모티브'])}</div></div>
      <article class="intro-paper"><h2>소개</h2><div class="tag-row">${data.tags.flatMap(tag=>tag==='ALL'?['HL','BL']:[tag]).map(tag=>`<span class="tag">${escape(tag)}</span>`).join('')}</div>${prose(data.intro)}</article>
    </section>`;
  }
  const profilePaper = id => `<svg class="profile-paper-frame" aria-hidden="true"><defs><pattern id="profile-paper-${id}" width="300" height="300" patternUnits="userSpaceOnUse"><rect width="300" height="300" fill="var(--paper)" stroke="none"/><image href="assets/paper-texture.png" width="300" height="300" opacity=".35" stroke="none"/></pattern></defs><path fill="url(#profile-paper-${id})"/></svg>`;
  function drawProfilePaper(node) {
    const svg=node.querySelector(':scope > .profile-paper-frame');if(!svg)return;
    const w=node.clientWidth,h=node.clientHeight;if(!w||!h)return;
    const right=w-1,bottom=h-1;let d=`M1 1H${right}`;
    for(let y=23,i=0;y<bottom-14;y+=[35,41,32,38][i++%4]){const r=[7,6,8][i%3];d+=`V${y-r}Q${right-r*2} ${y} ${right} ${y+r}`;}
    d+=`V${bottom}H1`;const cuts=[];
    for(let y=29,i=0;y<bottom-14;y+=[39,33,43,35][i++%4])cuts.push([y,[6,8,7][i%3]]);
    for(const [y,r] of cuts.reverse())d+=`V${y+r}Q${1+r*2} ${y} 1 ${y-r}`;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.querySelector('path').setAttribute('d',d+'V1Z');
  }
  let profilePaperObserver;
  function mountProfilePapers(){
    profilePaperObserver?.disconnect();
    if(route==='world'){
      profilePaperObserver=new ResizeObserver(entries=>entries.forEach(entry=>drawWorldPaper(entry.target)));
      document.querySelectorAll('.world-map-paper,.world-reading').forEach(node=>{drawWorldPaper(node);profilePaperObserver.observe(node);});
      return;
    }
    if(route!=='profile'&&route!=='opening')return;
    profilePaperObserver=new ResizeObserver(entries=>entries.forEach(entry=>drawProfilePaper(entry.target)));
    document.querySelectorAll(route==='profile'?'.profile-hero,.profile-body':'.opening-story,.opening-guide').forEach(node=>{drawProfilePaper(node);profilePaperObserver.observe(node);});
  }
  const worldPaper = id => `<svg class="world-paper-frame" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="world-paper-${id}" width="300" height="300" patternUnits="userSpaceOnUse"><rect width="300" height="300" fill="var(--paper)" stroke="none"/><image href="assets/paper-texture.png" width="300" height="300" opacity=".35" stroke="none"/></pattern></defs><path fill="url(#world-paper-${id})"/></svg>`;
  function drawWorldPaper(node){
    const svg=node.querySelector(':scope > .world-paper-frame');if(!svg)return;
    const w=node.clientWidth,h=node.clientHeight;if(!w||!h)return;
    const right=w-1,bottom=h-1;let d=`M1 1H${right}`;
    if(node.classList.contains('world-reading'))for(let y=26;y<bottom-18;y+=38)d+=`V${y-7}a9 7 0 0 0 0 14`;
    d+=`V${bottom}H1`;
    const cuts=[];for(let y=27;y<bottom-18;y+=38)cuts.push(y);
    for(const y of cuts.reverse())d+=`V${y+7}a9 7 0 0 0 0 -14`;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.querySelector('path').setAttribute('d',d+'V1Z');
  }
  const profileGroups = [[0,1],[2,4],[3,5]];
  function profileContent(tab=profileTab) { return profilePaper('body')+profileGroups[tab].map(index => `<h3>${star}<span>${escape(label(data.profile[index].title))}</span>${waves}</h3>${readingProse(data.profile[index].text)}`).join(''); }
  function profile() {
    return `<section class="view profile-view mature-view modular-view"><article class="profile-sheet">${flatHeaderDecor('profile')}<div class="profile-hero">${profilePaper('hero')}<div class="profile-rim-waves" aria-hidden="true"><span>${flatWave}</span><span>${flatWave}</span></div><div class="profile-photo">${portraitPhoto('profile-portrait')}${star}</div><div class="profile-identity">${palm}<span class="profile-stamp" aria-hidden="true">FIRST<br>DREAM</span><p class="profile-handwritten handwritten">언제나, 여름의 끝에서.</p><h1 class="profile-title" aria-label="브렌든 헤일"><span>브렌든</span> <span>헤일</span>${star}</h1><p class="profile-nameplate">Brendan Hale</p><p class="profile-metadata">18세<span>·</span>캐나다 레스브리지<span>·</span>라이프가드</p></div></div><div class="profile-tabs" role="tablist" aria-label="프로필 항목">${['기본 정보·외형','성격·버릇·특징','말투·취향'].map((name,i)=>`<button type="button" role="tab" id="profile-tab-${i}" data-profile="${i}" aria-selected="${profileTab===i}" aria-controls="profile-panel">${ticketFrame(profileTab===i?'blue':'paper','row')}<span>${name.replaceAll('·','<span class="profile-separator">·</span>')}</span>${waves}</button>`).join('')}</div><div id="profile-panel" class="profile-body" role="tabpanel" aria-labelledby="profile-tab-${profileTab}">${profileContent()}</div></article></section>`;
  }
  const places = [
    {name:'입구',x:14,y:65,text:'매표소 직원은 표를 끊고 손목에 팔찌를 채웁니다.'},
    {name:'푸드코트',x:44,y:4,text:'푸드코트 직원은 닫힌 카운터 안에서 주문을 받습니다.'},
    {name:'오락실',x:15,y:9,text:'꺼져 있던 오락기와 푸드코트 간판이 켜집니다. 낯선 출입문도 나타납니다.'},
    {name:'락커룸',x:54,y:67,text:'졸업파티나 사고 얘기를 꺼내면 브렌든이 피해 다니던 락커룸이나 직원 복도의 문이 열립니다.'},
    {name:'파도풀',x:69,y:39,text:'파도풀 가장자리에 앉아 물에 발을 담글 수 있습니다.'},
    {name:'직원 복도',x:87,y:72,text:'브렌든이 사라진 뒤에도 푸드코트에는 불이 켜져 있습니다. 직원 복도 쪽에는 젖은 발자국이 남습니다.'}
  ];
  const worldKeys = ['세계관','꿈 회차','깨어나는 시간'];
  const noteKeys = ['1990s 캐나다 워터파크','브렌든','꿈의 워터파크','사라진 브렌든','꿈속 사람들','진행 소재'];
  const noteHeadings = {
    '1990s 캐나다 워터파크':['주 무대','꿈의 시작 장소','다시 열리는 공간','사고의 흔적','깨어날 때'],
    '브렌든':['다시 만난 소꿉친구','익숙한 모습','피하는 이야기'],
    '꿈의 워터파크':['다시 켜지는 불빛','이어지는 장소','둘만의 공간','남겨진 흔적'],
    '사라진 브렌든':['남은 흔적','되풀이되는 이름'],
    '꿈속 사람들':['매표소 직원','반 친구와 직원','사람이 많아질 때','불확실한 정체']
  };
  function worldNotes(key) {
    if (!noteHeadings[key]) return readingProse(sections[key]);
    const lines = sections[key].split('\n').filter(line => line.startsWith('▸ '));
    return readingRows(`<div class="prose">${lines.map((line,i)=>`<h3>${escape(noteHeadings[key][i])}</h3><ul><li>${linkify(line.slice(2))}</li></ul>`).join('')}</div>`);
  }
  function world() {
    return `<section class="view world-view mature-view modular-view"><div class="world-scenery" aria-hidden="true">${palm}${palm}${palm}${palm}${worldSurf}</div><header class="world-hero section-heading">${flatHeaderDecor('world')}<svg class="world-title-rays" viewBox="0 0 420 160" aria-hidden="true"><path d="m128 7 6-8m-4 15 9-4M0 81l8-7m-7 16 5-5"/></svg>${palm}<span class="world-ticket" aria-hidden="true">${ticketFrame('lime','row')}WORLD</span><h1 class="scrap-title"><span class="scrap-title-line">꿈의 워터파크</span></h1><span class="world-english" aria-hidden="true">Dream Waterpark</span><span class="world-title-wave" aria-hidden="true">${worldWaves}</span>${worldWaves}</header><div class="world-brochure"><section class="world-map-paper">${worldPaper('map')}<div class="world-backsheet" aria-hidden="true"><span>FIRST DREAM</span>${palm}</div><div class="native-map"><img class="map-art" src="assets/waterpark-map.png" alt="입구, 오락실, 푸드코트, 파도풀, 락커룸과 직원 복도로 구성된 워터파크 안내도" width="1536" height="1024">${places.map((place,i)=>`<details class="map-place" name="world-place" style="--x:${place.x}%;--y:${place.y}%;--slot:${i+1};--mobile-slot:${i%3+1};--mobile-row:${Math.floor(i/3)+2}"><summary class="place-summary" aria-label="${place.name}" aria-controls="place-info-${i}"><span class="map-pin" aria-hidden="true"><span class="map-pin-tag${i===4?' map-pin-ticket':''}">${i===4?ticketFrame('paper','row'):''}${pin}<span class="map-pin-name">${place.name}</span><span class="map-pin-number">${i+1}</span></span></span><span class="place-list-label" aria-hidden="true">${ticketFrame('paper','row')}<b class="place-number">${i+1}</b><span>${place.name}</span><span class="place-chevron">›</span></span></summary><div id="place-info-${i}" class="place-inline"><h3>${pin}${place.name}</h3><p>${place.text}</p></div></details>`).join('')}</div><div class="world-map-footer" aria-hidden="true"><span class="world-map-signature">Our Summer<br>Never Ends.</span>${worldWaves}</div><span class="fold-corner" aria-hidden="true"></span></section><section class="world-reading">${worldPaper('reading')}${menuRail(`<div class="tab-row" role="tablist" aria-label="세계관 항목">${worldKeys.map((name,i)=>`<button type="button" role="tab" id="world-tab-${i}" data-world="${i}" aria-selected="${worldTab===i}" aria-controls="world-panel">${ticketFrame(worldTab===i?'blue':'paper','row')}<span>${name}</span></button>`).join('')}</div>`,'parent-menu')}<div class="world-reading-columns"><div class="world-copy"><div class="world-content${worldTab===0?' world-premise':''}" id="world-panel" role="tabpanel" aria-labelledby="world-tab-${worldTab}">${readingProse(sections[worldKeys[worldTab]])}${palm}</div><blockquote class="world-summer-note">Our Summer<br>Never Ends.</blockquote></div><aside class="world-context"><div class="world-pool-memento">${poolPhoto('world-pool-photo').replace('Our Summer<br>Never Ends.',places[4].name+waves)}${star}</div>${worldWaves}</aside></div><section class="world-notes"><h2>워터파크에 남은 이야기</h2>${menuRail(`<div class="world-note-tabs" role="tablist" aria-label="세계관 상세">${noteKeys.map((key,i)=>`<button type="button" role="tab" id="note-tab-${i}" data-note="${i}" aria-selected="${noteTab===i}" aria-controls="note-panel">${ticketFrame('paper','row')}<span>${key}</span></button>`).join('')}</div>`,'child-menu')}<div id="note-panel" role="tabpanel" aria-labelledby="note-tab-${noteTab}">${worldNotes(noteKeys[noteTab])}</div></section><span class="fold-corner" aria-hidden="true"></span></section></div></section>`;
  }
  function opening() {
    const title='<span class="scrap-title-line">졸업앨범을</span> <span class="scrap-title-line">펼친 밤</span>';
    return `<section class="view opening-view mature-view modular-view" aria-label="도입부"><div class="keepsake"><header class="opening-story-header section-heading">${flatHeaderDecor('opening')}<span class="opening-dream-ticket">${ticketFrame('blue','row')}<span>01<span class="middle-dot">·</span>첫 번째 꿈</span>${star}</span><h1 class="opening-display scrap-title scrap-title-stepped" aria-label="졸업앨범을 펼친 밤">${title}</h1><div class="opening-summer opening-english" aria-hidden="true"><span>Our Summer Never Ends.</span></div><span class="opening-title-wave" aria-hidden="true">${waves}</span>${star}</header><article class="opening-story"><div class="opening-photo-sheet"><figure class="opening-scene"><img src="assets/opening-album-night-flat-v2.png" alt="밤의 책상 위에 펼쳐진 오래된 졸업앨범" width="1672" height="941"><div class="opening-album-to"><span class="opening-album-strip">To. You ${waves}</span></div><div class="opening-album-message"><p class="opening-album-strip"><span>여기는 여름이</span> <span>끝나지 않는 곳이야.</span></p><p class="opening-album-strip">너도 그날을 기억해?</p><p class="opening-album-strip"><span>이번에는 내가</span> <span>기다리고 있을게.</span></p></div><div class="opening-album-sign"><span class="opening-album-strip">Brendan Hale ${smile}</span></div></figure><div class="opening-caption"><p class="opening-story-summary">${escape(data.opening.replace(/^⑴\s*/,''))}</p><button type="button" class="opening-read" data-opening-full aria-haspopup="dialog"><span>전문 보기</span>${icon('chevron')}</button></div></div></article><section class="opening-guide" aria-labelledby="opening-guide-title">${profilePaper('opening-guide')}<h2 id="opening-guide-title">${star}<span>진행 안내</span>${waves}</h2><div class="opening-guide-columns">${sections['진행 안내'].split(/\n\s*\n/).map(part=>`<div class="opening-guide-part">${readingProse(part)}</div>`).join('')}</div><div class="opening-setup"><a class="button lime" href="#guide/추천 설정값">${ticketFrame('lime','row')}<span>시작 전 설정 확인 ${icon('chevron')}</span></a></div></section></div></section>`;
  }
  let openingDialog = null;
  function showOpeningFull(trigger) {
    if(openingDialog)return;
    const dialog=document.createElement('dialog');
    dialog.className='opening-dialog';
    dialog.setAttribute('aria-labelledby','opening-full-title');
    dialog.innerHTML=`<header class="opening-dialog-header"><h2 id="opening-full-title">졸업앨범을 펼친 밤</h2><button type="button" class="opening-dialog-close" aria-label="전문 닫기">닫기 <span aria-hidden="true">×</span></button></header><div class="opening-full-text" tabindex="0">${escape(data.openingFull).replace(/{{user}}/g,'<span class="opening-user">{{user}}</span>')}</div>`;
    const scrollY=window.scrollY,bodyStyle=document.body.style;
    const properties=['position','top','left','right','width','overflow'];
    const saved=properties.map(name=>[name,bodyStyle.getPropertyValue(name),bodyStyle.getPropertyPriority(name)]);
    let cleaned=false,backdropStart=false;
    const close=(restoreFocus=true)=>{
      if(cleaned)return;
      cleaned=true;
      if(dialog.open)dialog.close();
      saved.forEach(([name,value,priority])=>{if(value)bodyStyle.setProperty(name,value,priority);else bodyStyle.removeProperty(name);});
      dialog.remove();openingDialog=null;
      window.scrollTo({top:scrollY,behavior:'instant'});
      if(restoreFocus&&trigger.isConnected)trigger.focus({preventScroll:true});
    };
    openingDialog={close};
    dialog.querySelector('button').addEventListener('click',()=>close());
    dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
    dialog.addEventListener('close',()=>close());
    const outside=event=>{const box=dialog.getBoundingClientRect();return event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom;};
    dialog.addEventListener('pointerdown',event=>{backdropStart=event.target===dialog&&outside(event);});
    dialog.addEventListener('click',event=>{if(backdropStart&&event.target===dialog&&outside(event))close();backdropStart=false;});
    document.body.append(dialog);
    bodyStyle.position='fixed';bodyStyle.top=`-${scrollY}px`;bodyStyle.left='0';bodyStyle.right='0';bodyStyle.width='100%';bodyStyle.overflow='hidden';
    dialog.showModal();
    dialog.querySelector('button').focus({preventScroll:true});
  }
  const guideItemButtons = items => items.map(key=>`<button type="button" class="guide-item" data-guide="${escape(key)}" aria-current="${guideKey===key}">${ticketFrame('paper','row')}<span>${escape(label(key))}</span></button>`).join('');
  const guideItems = () => menuRail(`<div class="guide-items">${guideItemButtons(guideGroups[guideGroup].items)}</div>`,'child-menu');
  const guideTitle = key => escape(label(key))+(key==='모델 추천'?'<span class="guide-platform-label">ELYN</span>':'');
  const guidePlatformTabs = () => `<div class="guide-platform-tabs" role="tablist" aria-label="추천 설정 플랫폼">${['elyn','nody'].map(platform=>`<button type="button" role="tab" id="settings-tab-${platform}" data-settings-platform="${platform}" aria-selected="${settingsPlatform===platform}" aria-controls="settings-platform-content">${platform.toUpperCase()}</button>`).join('')}</div>`;
  const guideReading = () => `<header class="guide-context"><h2 id="guide-reading-title">${guideTitle(guideKey)}</h2>${guideKey==='추천 설정값'?guidePlatformTabs():''}</header><div class="guide-reading-body">${guideBody(guideKey)}</div>`;
  function guide() {
    return `<section class="view guide-view mature-view modular-view">${heading('이용 가이드','Before You Dream')}${menuRail(`<div class="guide-categories" role="tablist" aria-label="가이드 분류">${guideGroups.map((group,i)=>`<button type="button" role="tab" id="guide-group-${i}" data-guide-group="${i}" aria-selected="${guideGroup===i}" aria-controls="guide-item-directory">${group.title}</button>`).join('')}</div>`,'parent-menu')}<div class="guide-layout"><aside id="guide-item-directory" class="guide-directory" role="tabpanel" aria-labelledby="guide-group-${guideGroup}" aria-label="가이드 항목">${guideItems()}</aside><article class="guide-content" id="guide-content" aria-labelledby="guide-reading-title" tabindex="0">${guideReading()}</article></div></section>`;
  }
  const screws = className => `<div class="${className}" aria-hidden="true">${'<i class="screw"></i>'.repeat(4)}</div>`;
  function playlist() {
    return `<section class="view playlist-view mature-view modular-view">${heading('여름밤의 플레이리스트','Dream Playlist','playlist',['여름밤의','플레이리스트'])}<div class="playlist-layout"><section class="cassette-panel mixtape-console" aria-label="카세트 재생기"><div class="deck-window"><div class="cassette-art" aria-hidden="true"><img src="assets/cassette.png" alt="" width="1536" height="1024"><span class="cassette-art-title">DREAM PLAYLIST</span><span class="cassette-art-caption">Same summer. Same mixtape.</span></div></div><div class="console-controls"><div class="console-display"><p id="track-current" class="track-current"></p><div class="range-row"><span id="elapsed" class="seek-time">0:00</span><input type="range" id="seek" min="0" max="1000" value="0" aria-label="재생 위치"><span id="duration" class="seek-time">0:00</span></div></div><div class="player-controls" role="group" aria-label="재생 제어"><button type="button" data-music="prev" aria-label="이전 곡">${icon('prev')}</button><button type="button" data-music="toggle" aria-label="재생">${icon('play')}</button><button type="button" data-music="next" aria-label="다음 곡">${icon('next')}</button><button type="button" data-music="repeat" aria-label="한 곡 반복" aria-pressed="${music.repeatOne}">${icon('repeat')}</button><a data-original href="${escape(data.playlist[music.index].url)}" target="_blank" rel="noopener noreferrer" aria-label="현재 곡 원곡 페이지 열기">${icon('original')}</a></div><div class="range-row volume-row"><button type="button" data-mute aria-label="음소거" aria-pressed="${music.volume===0}">${icon('volume')}</button><input type="range" id="volume" min="0" max="100" value="${music.volume}" aria-label="음량"></div></div><p id="music-message" class="music-message" role="status" ${music.message?'':'hidden'}>${escape(music.message)}</p><div class="deck-decoration" aria-hidden="true">${waves}<span class="console-current"></span><span class="console-trim"></span></div></section><div class="track-directory"><h2 class="track-list-title">TRACKLIST</h2><ol class="track-list" aria-label="곡 목록">${data.playlist.map((track,i)=>`<li>${ticketFrame('paper','compact')}<button type="button" class="track-pick" data-track="${i}" aria-pressed="${music.index===i}"><span>${track.name.includes(' - ')?`<strong>${escape(track.name.split(' - ')[0])}</strong><span class="track-divider" aria-hidden="true"> — </span><span class="track-song">${escape(track.name.split(' - ').slice(1).join(' - '))}</span>`:escape(track.name)}</span></button><a class="track-external" href="${escape(track.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(track.name)} YouTube에서 열기">${icon('original')}</a></li>`).join('')}</ol></div></div></section>`;
  }
  const views = {intro,home,profile,world,opening,guide,playlist};
  // Reserve each sibling set from its real rendered copy at the current width.
  function reservePanel(selector, variants) {
    const panel=main.querySelector(selector);if(!panel)return;
    const probe=panel.cloneNode(false);probe.removeAttribute('id');
    Object.assign(probe.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',left:'0',top:'0',width:`${panel.offsetWidth}px`,minHeight:'0',height:'auto',transform:'none'});
    panel.parentElement.append(probe);
    let height=0;
    for(const variant of variants){probe.innerHTML=variant.html??variant;probe.className=variant.className??panel.className;height=Math.max(height,Math.ceil(parseFloat(getComputedStyle(probe).height)));}
    probe.remove();panel.style.minHeight=`${height}px`;
  }
  // Keep tab geometry stable without reserving the longest tab's empty paper.
  function sizeReadingViewport(selector, firstVariant, ceiling) {
    const panel=main.querySelector(selector);if(!panel)return;
    panel.classList.add('compact-reader');panel.tabIndex=0;
    const probe=panel.cloneNode(false);probe.removeAttribute('id');
    probe.innerHTML=firstVariant.html??firstVariant;
    if(firstVariant.className)probe.className=firstVariant.className+' compact-reader';
    Object.assign(probe.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',left:'0',top:'0',width:`${panel.offsetWidth}px`,minHeight:'0',height:'auto',maxHeight:'none',overflow:'auto',transform:'none'});
    panel.parentElement.append(probe);
    const height=Math.min(ceiling,Math.ceil(probe.getBoundingClientRect().height));
    probe.remove();panel.style.minHeight='0';panel.style.height=`${height}px`;
  }
  let stableWidthObserver,stableWidth=0,stableFrame=0;
  function sizeStablePanels(){
    const narrow=(main.querySelector('.view')?.clientWidth??770)<=650;
    if(route==='profile'){
      sizeReadingViewport('#profile-panel',profileContent(0),narrow?600:520);
      drawProfilePaper(document.getElementById('profile-panel'));
    }
    if(route==='world'){
      // Ordinary world prose follows its natural document height.
      const map=main.querySelector('.native-map'),probe=document.createElement('div');
      probe.className='place-inline';Object.assign(probe.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',width:`${map.clientWidth}px`,left:'0',top:'0'});map.append(probe);
      let height=0;for(const place of places){probe.innerHTML=`<h3>${pin}${escape(place.name)}</h3><p>${escape(place.text)}</p>`;height=Math.max(height,Math.ceil(parseFloat(getComputedStyle(probe).height)));}
      probe.remove();map.style.setProperty('--place-reading-height',`${height}px`);
    }
    if(route==='world')syncMenuRails(true);
    if(route==='guide'){
      reservePanel('.guide-context>h2',guideGroups.flatMap(group=>group.items).map(guideTitle));
      syncMenuRails(true);
    }
  }
  function mountStablePanels(){
    stableWidthObserver?.disconnect();cancelAnimationFrame(stableFrame);stableWidth=0;
    sizeStablePanels();
    const view=main.querySelector('.view');if(!view)return;
    stableWidthObserver=new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-stableWidth)<.5)return;stableWidth=width;cancelAnimationFrame(stableFrame);stableFrame=requestAnimationFrame(sizeStablePanels);});
    stableWidthObserver.observe(view);
    document.fonts.ready.then(()=>{if(view.isConnected)sizeStablePanels();});
  }
  function render() {
    openingDialog?.close(false);
    const [candidate, rawKey] = location.hash.slice(1).split('/');
    route = routes.includes(candidate) ? candidate : 'intro';
    history.scrollRestoration=route==='guide'?'manual':'auto';
    if(route==='guide'){
      guideGroup=0;guideKey=guideGroups[0].items[0];settingsPlatform='elyn';
    }
    if (route==='guide' && rawKey) {
      let key;
      try { key = decodeURIComponent(rawKey); } catch { key = ''; }
      const groupIndex=guideGroups.findIndex(group=>group.items.includes(key));
      if(groupIndex!==-1){guideKey=key;guideGroup=groupIndex;}
      // Explicit shortcuts open once; reload and main-menu visits start fresh.
      history.replaceState(null,'','#guide');
    }
    main.innerHTML=(route==='intro'?'':`<div class="b-wide-stage b-${route}-stage" aria-hidden="true"></div>`)+views[route]();
    mountProfilePapers();

    mountStablePanels();
    document.body.dataset.page=route;
    document.title=`${titles[route]} | 브렌든 헤일`;
    document.querySelectorAll('[data-route]').forEach(link=>{if(link.dataset.route===route)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    document.querySelector('[data-route][aria-current=page]')?.scrollIntoView({block:'nearest',inline:'nearest'});
    updateMusic();
    mountTrackTicker();
    window.scrollTo({top:0,behavior:'instant'});
    if(route==='guide'&&rawKey)requestAnimationFrame(()=>document.getElementById('guide-content').scrollIntoView({block:'start',behavior:'instant'}));
  }

  const music = {index:0, player:null, loading:null, pending:false, request:0, playing:false, repeatOne:false, volume:65, lastVolume:65, elapsed:0, duration:0, message:''};
  const tickerMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const tickerHover=matchMedia('(hover: hover) and (pointer: fine)');
  let trackTicker;
  function syncTrackTicker(){
    if(!trackTicker)return;
    const {node,animation}=trackTicker;
    const running=music.playing&&node.isConnected&&!document.hidden&&trackTicker.visible&&!tickerMotion.matches&&!trackTicker.hovered&&document.activeElement!==node;
    if(animation){if(running)animation.play();else animation.pause();}
  }
  function measureTrackTicker(){
    if(!trackTicker)return;
    const {node}=trackTicker, text=node.querySelector('.track-title-text'), belt=node.querySelector('.track-title-belt');
    if(!text)return;
    const width=text.getBoundingClientRect().width, viewport=node.clientWidth;
    const signature=`${text.textContent}|${width}|${viewport}|${tickerMotion.matches}`;
    if(signature===trackTicker.signature)return;
    trackTicker.signature=signature;
    trackTicker.animation?.cancel();trackTicker.animation=null;node.scrollLeft=0;
    const overflowing=width>viewport+1;
    node.classList.toggle('is-overflowing',overflowing);
    const gap=Math.max(32,viewport-width+32);
    belt.style.gap=`${gap}px`;
    if(!tickerMotion.matches){
      const distance=width+gap, travel=distance/28*1000, hold=1400;
      trackTicker.animation=belt.animate([
        {transform:'translateX(0)',offset:0},
        {transform:'translateX(0)',offset:hold/(travel+hold)},
        {transform:`translateX(-${distance}px)`,offset:1}
      ],{duration:travel+hold,iterations:Infinity,easing:'linear'});
      syncTrackTicker();
    }
  }
  function mountTrackTicker(){
    trackTicker?.animation?.cancel();trackTicker?.resize.disconnect();trackTicker?.intersection.disconnect();trackTicker=null;
    const node=document.getElementById('track-current');if(!node)return;
    trackTicker={node,visible:true,hovered:false,animation:null,signature:''};
    trackTicker.resize=new ResizeObserver(measureTrackTicker);trackTicker.resize.observe(node);
    trackTicker.intersection=new IntersectionObserver(entries=>{if(trackTicker?.node!==node)return;trackTicker.visible=entries[0].isIntersecting;syncTrackTicker();});trackTicker.intersection.observe(node);
    node.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&tickerHover.matches){trackTicker.hovered=true;syncTrackTicker();}});
    node.addEventListener('pointerleave',()=>{trackTicker.hovered=false;syncTrackTicker();});
    node.addEventListener('focus',syncTrackTicker);node.addEventListener('blur',syncTrackTicker);
    measureTrackTicker();
    document.fonts.ready.then(()=>{if(trackTicker?.node===node)measureTrackTicker();});
  }
  tickerMotion.addEventListener('change',measureTrackTicker);
  document.addEventListener('visibilitychange',syncTrackTicker);
  function message(text='') { music.message=text;const node=document.getElementById('music-message');if(node){node.textContent=text;node.hidden=!text;} }
  function time(ms) { const seconds=Math.max(0,Math.floor(ms/1000));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`; }
  function updateMusic() {
    const title=data.playlist[music.index].name;
    document.body.classList.toggle('playing',music.playing);
    document.querySelectorAll('[data-music]').forEach(button=>{
      const type=button.dataset.music;
      button.innerHTML=icon(type==='toggle'?(music.playing?'pause':'play'):type);
      if(type==='toggle')button.setAttribute('aria-label',music.playing?'일시정지':'재생');
      if(type==='repeat')button.setAttribute('aria-pressed',music.repeatOne);
      button.disabled=Boolean(music.loading)&&type==='toggle';
    });
    const original=document.querySelector('[data-original]');if(original){original.href=data.playlist[music.index].url;original.setAttribute('aria-label',title+' 원곡 페이지 열기');}
    const current=document.getElementById('track-current');
    if(current&&current.dataset.title!==title){
      current.dataset.title=title;current.setAttribute('aria-label',title);current.tabIndex=0;
      current.innerHTML=`<span class="track-title-belt"><span class="track-title-text">${escape(title)}</span><span class="track-title-copy" aria-hidden="true">${escape(title)}</span></span>`;
      measureTrackTicker();
    }
    syncTrackTicker();
    document.querySelectorAll('[data-track]').forEach(button=>{button.setAttribute('aria-pressed',Number(button.dataset.track)===music.index);});
    const elapsed=document.getElementById('elapsed');if(elapsed)elapsed.textContent=time(music.elapsed);
    const duration=document.getElementById('duration');if(duration)duration.textContent=time(music.duration);
    const seek=document.getElementById('seek');if(seek&&document.activeElement!==seek)seek.value=music.duration?Math.round(music.elapsed/music.duration*1000):0;
    const volume=document.getElementById('volume');if(volume&&document.activeElement!==volume)volume.value=music.volume;
    const mute=document.querySelector('[data-mute]');if(mute){mute.innerHTML=icon(music.volume===0?'muted':'volume');mute.setAttribute('aria-pressed',music.volume===0);mute.setAttribute('aria-label',music.volume===0?'음소거 해제':'음소거');}
  }
  async function ensurePlayer() {
    if(music.player)return music.player;
    if(music.loading)return music.loading;
    message('YouTube를 연결하고 있습니다.');
    music.loading=(async()=>{
      await window.RieYouTube.sdk();
      return await new Promise(resolve=>{
        let player;
        player=window.RieYouTube.create('youtube-player',data.playlist[music.index].url,{
          ready(){music.player=player;player.setVolume(music.volume);if(!music.pending)message();resolve(player);},
          play(){music.pending=false;music.playing=true;message();updateMusic();},
          pause(){music.pending=false;music.playing=false;message();updateMusic();},
          buffering(){music.pending=true;music.playing=false;message('곡을 불러오는 중입니다.');updateMusic();},
          progress(elapsed,duration){if(music.pending)return;music.elapsed=elapsed;music.duration=duration;updateMusic();},
          volume(value,muted){music.volume=muted?0:value;if(music.volume)music.lastVolume=music.volume;updateMusic();},
          finish(){selectTrack(music.repeatOne?music.index:nextTrackIndex(),true);},
          error(code){music.pending=false;music.playing=false;updateMusic();message(`이 곡을 재생할 수 없습니다 (${code}). 다른 곡을 선택하거나 YouTube에서 열어 주세요.`);},
          blocked(){music.pending=false;music.playing=false;updateMusic();message('재생 버튼을 한 번 더 눌러 주세요.');}
        });
      });
    })();
    updateMusic();
    try { return await music.loading; }
    catch(error){music.pending=false;music.playing=false;message(error.message);throw error;}
    finally {music.loading=null;updateMusic();}
  }
  function nextTrackIndex(){return (music.index+1)%data.playlist.length;}
  async function selectTrack(index,autoPlay=true) {
    const request=++music.request;
    music.index=(index+data.playlist.length)%data.playlist.length;
    music.pending=autoPlay;music.playing=false;music.elapsed=0;music.duration=0;message(autoPlay?'곡을 불러오는 중입니다.':'');updateMusic();
    try {
      const player=await ensurePlayer();
      if(request!==music.request)return;
      message('곡을 불러오는 중입니다.');
      player.load(data.playlist[music.index].url,{auto_play:autoPlay});
    } catch { /* The shared status provides recovery. */ }
  }
  document.addEventListener('click',async event=>{
    const button=event.target.closest('button');
    if(!button)return;
    if(button.hasAttribute('data-opening-full'))showOpeningFull(button);
    if(button.hasAttribute('data-top')){
      main.querySelectorAll('.compact-reader,.guide-content').forEach(panel=>{panel.scrollTop=0;});
      window.scrollTo({top:0,behavior:'instant'});
    }
    if(button.hasAttribute('data-rail-step')){button.closest('.menu-rail').children[1].scrollBy({left:Number(button.dataset.railStep)*180,behavior:'smooth'});}
    if(button.hasAttribute('data-nav-step'))document.getElementById('main-navigation').scrollBy({left:Number(button.dataset.navStep)*180,behavior:'smooth'});
    if(button.hasAttribute('data-guide-group')){
      guideGroup=Number(button.dataset.guideGroup);guideKey=guideGroups[guideGroup].items[0];
      document.querySelectorAll('[data-guide-group]').forEach(node=>node.setAttribute('aria-selected',node===button));
      const directory=document.getElementById('guide-item-directory');directory.innerHTML=guideItems();directory.setAttribute('aria-labelledby',button.id);
      document.getElementById('guide-content').innerHTML=guideReading();
      document.getElementById('guide-content').scrollTop=0;sizeStablePanels();
    }
    if(button.hasAttribute('data-settings-platform')){
      settingsPlatform=button.dataset.settingsPlatform;
      const panel=document.getElementById('guide-content');
      panel.innerHTML=guideReading();panel.scrollTop=0;sizeStablePanels();
      panel.querySelector(`[data-settings-platform="${settingsPlatform}"]`).focus({preventScroll:true});
    }
    if(button.hasAttribute('data-profile')){
      profileTab=Number(button.dataset.profile);
      document.querySelectorAll('[data-profile]').forEach(tab=>tab.setAttribute('aria-selected',tab===button));
      const panel=document.getElementById('profile-panel');panel.innerHTML=profileContent();panel.scrollTop=0;panel.setAttribute('aria-labelledby',button.id);drawProfilePaper(panel);
    }
    if(button.hasAttribute('data-world')){
      worldTab=Number(button.dataset.world);document.querySelectorAll('[data-world]').forEach(tab=>tab.setAttribute('aria-selected',tab===button));
      const panel=document.getElementById('world-panel');panel.innerHTML=readingProse(sections[worldKeys[worldTab]]);panel.scrollTop=0;panel.classList.toggle('world-premise',worldTab===0);panel.setAttribute('aria-labelledby',button.id);syncMenuRails(true);
    }
    if(button.hasAttribute('data-note')){
      noteTab=Number(button.dataset.note);document.querySelectorAll('[data-note]').forEach(tab=>tab.setAttribute('aria-selected',tab===button));
      const panel=document.getElementById('note-panel');panel.innerHTML=worldNotes(noteKeys[noteTab]);panel.scrollTop=0;panel.setAttribute('aria-labelledby',button.id);syncMenuRails(true);
    }
    if(button.hasAttribute('data-guide')){
      guideKey=button.dataset.guide;
      document.querySelectorAll('[data-guide]').forEach(node=>node.setAttribute('aria-current',node===button));
      document.getElementById('guide-content').innerHTML=guideReading();
      document.getElementById('guide-content').scrollTop=0;sizeStablePanels();
    }
    if(button.hasAttribute('data-disclose')){
      const panel=document.getElementById(`${button.dataset.disclose}-panel`),open=button.getAttribute('aria-expanded')==='true';
      document.querySelectorAll('[data-disclose]').forEach(node=>{node.setAttribute('aria-expanded','false');document.getElementById(`${node.dataset.disclose}-panel`).hidden=true;});
      button.setAttribute('aria-expanded',!open);panel.hidden=open;
    }
    if(button.hasAttribute('data-copy')){
      const status=button.parentElement.querySelector('.copy-result');
      try{await navigator.clipboard.writeText(button.dataset.copy);status.textContent='복사했습니다.';}catch{status.textContent='복사할 텍스트를 선택해 주세요.';const range=document.createRange();range.selectNodeContents(button.closest('.settings-copy')?document.getElementById('settings-platform-content').querySelector('.guide-document'):button.closest('.copy-unit').querySelector('pre'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);}
    }
    if(button.hasAttribute('data-track'))await selectTrack(Number(button.dataset.track));
    if(button.hasAttribute('data-mute'))setVolume(music.volume?0:music.lastVolume||65);
    if(button.hasAttribute('data-music')){
      const action=button.dataset.music;
      if(action==='repeat'){music.repeatOne=!music.repeatOne;updateMusic();}
      else if(action==='prev'||action==='next')await selectTrack(action==='next'?nextTrackIndex():music.index-1);
      else try{const existed=Boolean(music.player);const player=await ensurePlayer();if(existed)player.toggle();else player.play();}catch{}
    }
  });
  /* B-v2 touch feedback: route-local controls, without cancelling native gestures. */
  let touchPressed=null;
  function clearTouchPress(){touchPressed?.classList.remove('b-touch-pressed');touchPressed=null;}
  document.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='touch')return;
    clearTouchPress();
    const control=event.target.closest('a,button,summary');
    if(!control?.closest('.home-view,.playlist-view,.modular-view')||control.disabled)return;
    touchPressed=control;control.classList.add('b-touch-pressed');
  },{passive:true});
  window.addEventListener('pointerup',clearTouchPress,{passive:true});
  window.addEventListener('pointercancel',clearTouchPress,{passive:true});
  window.addEventListener('scroll',clearTouchPress,{capture:true,passive:true});
  /* End B-v2 touch feedback. */
  // The horizontal guide directory must release touch hover on hybrid devices.
  let guideTouchPressed=null, guideTouchRest=null;
  function clearGuideTouch(){
    if(!guideTouchPressed)return;
    guideTouchPressed.classList.remove('b-touch-pressed');
    guideTouchRest?.classList.remove('b-touch-rest');
    guideTouchRest=guideTouchPressed;guideTouchRest.classList.add('b-touch-rest');guideTouchPressed=null;
  }
  document.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='touch')return;
    clearGuideTouch();
    const control=event.target.closest('.guide-view .guide-item');
    if(!control||control.disabled)return;
    guideTouchRest?.classList.remove('b-touch-rest');guideTouchRest=null;
    guideTouchPressed=control;control.classList.add('b-touch-pressed');
  },{passive:true});
  document.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'){guideTouchRest?.classList.remove('b-touch-rest');guideTouchRest=null;}},{passive:true});
  window.addEventListener('pointerup',clearGuideTouch,{passive:true});
  window.addEventListener('pointercancel',clearGuideTouch,{passive:true});
  window.addEventListener('scroll',clearGuideTouch,{capture:true,passive:true});
  function setVolume(value){music.volume=Math.max(0,Math.min(100,value));if(music.volume)music.lastVolume=music.volume;music.player?.setVolume(music.volume);updateMusic();}
  document.addEventListener('input',event=>{
    if(event.target.id==='volume')setVolume(Number(event.target.value));
    if(event.target.id==='seek'&&music.duration)music.player?.seekTo(Number(event.target.value)/1000*music.duration);
  });
  document.addEventListener('wheel',event=>{if(!event.target.closest('.volume-row')||event.ctrlKey||event.metaKey)return;event.preventDefault();setVolume(music.volume+(event.deltaY<0?5:-5));},{passive:false});
  document.addEventListener('keydown',event=>{
    const tab=event.target.closest('[role=tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    const tabs=[...tab.parentElement.querySelectorAll('[role=tab]')];let index=tabs.indexOf(tab);
    if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else index=(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    event.preventDefault();tabs[index].focus();tabs[index].click();
  });
  const characters=document.querySelector('.characters');
  const closeCharacters=()=>{characters.open=false;};
  document.addEventListener('click',event=>{if(!characters.contains(event.target))closeCharacters();});
  characters.addEventListener('click',event=>{if(event.target.closest('a'))closeCharacters();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&characters.open){closeCharacters();characters.querySelector('summary').focus();}});
  window.addEventListener('hashchange',()=>{closeCharacters();render();});
  document.querySelector('[data-route="guide"]').addEventListener('click',event=>{
    if(route!=='guide')return;
    event.preventDefault();history.replaceState(null,'','#guide');render();
  });
  new ResizeObserver(()=>document.documentElement.style.setProperty('--header',`${document.querySelector('.site-header').getBoundingClientRect().height}px`)).observe(document.querySelector('.site-header'));
  render();
})();
