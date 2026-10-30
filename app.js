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
  const titles = {intro:'꿈으로 입장',home:'홈',profile:'프로필',world:'세계관',opening:'도입부',guide:'플레이가이드',playlist:'플레이리스트'};
  let route = 'intro', profileTab = 0, worldTab = 0, noteTab = 0, placeIndex = 0, guideKey = '진행 안내', guideGroup = 0;
  const guideGroups = [
    {title:'시작과 진행',items:['진행 안내','플레이 팁','추천 플레이','로어북 예산 안내','채팅방 이전 안내']},
    {title:'설정과 출력',items:['추천 설정값','모델 추천','출력 가이던스','추가 요약 지침']},
    {title:'명령어와 상태창',items:['명령어','상태창','상태창 · 대사 복원 지침']},
    {title:'업데이트',items:['최종 리팩토링']}
  ];
  const icons = {
    play:'<path d="m9 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
    pause:'<path d="M8 5v14M16 5v14" stroke-width="5"/>',
    prev:'<path d="M5 5v14M19 5 8 12l11 7z" fill="currentColor"/>',
    next:'<path d="M19 5v14M5 5l11 7-11 7z" fill="currentColor"/>',
    volume:'<path d="m3 9 4 0 5-4v14l-5-4H3zM16 8c3 2 3 6 0 8M19 5c5 4 5 10 0 14"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  const heading = (title, english) => `<div class="page-heading"><h1>${title}</h1><span class="english" aria-hidden="true">${english}</span></div>`;
  const star = '<svg class="star-mark" viewBox="0 0 48 48" aria-hidden="true"><path d="m24 3 6 14 15 1-12 10 4 16-13-8-13 8 4-16L3 18l15-1z"/></svg>';
  const waves = '<svg class="wave-mark" viewBox="0 0 180 45" aria-hidden="true"><path class="wave-back" d="M2 21C7 18 10 4 20 8s7 16 20 15 7-12 16-13 4 6 2 13c-4 12-16 15-25 9S20 20 14 26 0 29 2 21ZM69 17c9-12 17-5 22 3s15 9 23-3 17-5 10 4-21 16-31 11-15-1-21-3-7-6-3-12ZM135 21c5-13 15-12 21-4s14 7 19-1 10 5 3 13-25 4-30 0-12 4-17 0 0-5 4-8Z"/><path class="wave-front" d="M3 30c9-7 14 0 22 2s12-4 20-2 0 9-8 9-24-6-29-3-11-3-5-6ZM82 31c9-6 16 6 27 0s15-2 10 4-19 7-27 4-16-4-10-8Z"/></svg>';
  const ladder = '<svg class="ladder-mark" viewBox="0 0 80 90" aria-hidden="true"><path d="M20 80V20C20 0 40 0 40 20v10M50 80V20C50 0 70 0 70 20v10M20 40h30M20 58h30M20 76h30"/></svg>';
  const smile = '<svg class="smile-mark" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="M14 27q10 17 21-1M16 15v5M31 15v5"/></svg>';
  const palm = '<span class="palm-mark" aria-hidden="true"></span>';
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
  const copyUnit = (text, title) => `<div class="copy-unit"><pre>${escape(text)}</pre><div class="copy-action"><span class="copy-result" role="status"></span><button type="button" data-copy="${escape(text)}" aria-label="${escape(title)} 복사">COPY</button></div></div>`;

  function guideBody(key) {
    const text = sections[key];
    if (key === '출력 가이던스') {
      const split = text.split('▸ ');
      return prose(split.shift()) + split.map(part => {
        const lines = part.trim().split('\n');
        const title = lines.shift().trim();
        const optional = lines.indexOf('(선택 사항)');
        if (optional !== -1) lines.splice(optional, 1);
        return `<h3>${escape(label(title))}</h3>${copyUnit(lines.join('\n').trim(),title)}${optional!==-1?'<p class="subnote">(선택 사항)</p>':''}`;
      }).join('');
    }
    if (key === '추가 요약 지침') {
      const [location, ...body] = text.split('\n\n');
      return prose(location) + copyUnit(body.join('\n\n'), key);
    }
    if (key === '상태창') {
      return `<div class="prose">${text.split(/(<BrenStatus[^>]+\/>)/g).map(part => part.startsWith('<BrenStatus') ? copyUnit(part,'상태창 예시') : prose(part)).join('')}</div>`;
    }
    return prose(text);
  }
  function intro() {
    return `<section class="intro-view" aria-label="꿈으로 입장"><img class="intro-scene" src="assets/waterpark.png" alt="푸른 물빛과 워터슬라이드가 있는 실내 워터파크" width="1536" height="1024" fetchpriority="high"><div class="intro-stage"><div class="hero-ticket intro-ticket">${ticketFrame()}${titleMark()}${[1,2,3,4].map(i=>`<span class="wave-fragment intro-wave intro-wave-${i}" aria-hidden="true"><svg class="wave-mark" viewBox="0 0 160 56" aria-hidden="true"><path class="wave-front" stroke="none" d="M3 31C8 22 9 12 21 13C35 15 34 24 46 23C61 21 58 5 73 5C89 5 83 24 98 25C114 26 112 13 127 14C142 15 134 29 149 31C158 32 159 42 151 47C141 53 129 43 118 46C104 51 97 40 85 43C71 48 63 53 51 47C39 41 32 50 20 47C10 46 0 42 3 31Z"/></svg></span>`).join('')}<h1>죽은 소꿉친구가 돌아왔다.</h1><p class="hook-sub">꿈에서만 허락된 재회로.</p>${palm}<div class="ticket-pool" aria-hidden="true">${waves}${ladder}</div><a class="button admission-button ticket-button" href="#home">${buttonTicket()}입장하기 <span aria-hidden="true">→</span></a></div><p class="intro-quote">“끝나고<br>잠깐 보자.”</p></div></section>`;
  }
  function home() {
    return `<section class="home-view view" aria-label="브렌든 소개">
      <div class="hero"><p class="home-handwritten handwritten">언제나, 여름의 끝에서.</p><div class="hero-ticket">${ticketFrame()}${palm}<div class="ticket-copy">${titleMark()}<span class="wave-fragment wave-one" aria-hidden="true">${waves}</span><span class="wave-fragment wave-two" aria-hidden="true">${waves}</span><h1>죽은 소꿉친구가 돌아왔다.</h1><p class="hook-sub">꿈에서만 허락된 재회로.</p><div class="ticket-pool" aria-hidden="true">${waves}${ladder}</div>
          <div class="hero-actions"><a class="button ticket-button" href="#profile">${buttonTicket()}브렌든 알아보기 <span aria-hidden="true">›</span></a><a class="button light ticket-button" href="#guide">${buttonTicket('paper')}시작 전 안내 <span aria-hidden="true">›</span></a></div>
          <p class="hero-genre">1990s CANADA / DREAMCORE / MYSTERY</p>
        </div><div class="home-photos">${poolPhoto()}${portraitPhoto()}${star}<p class="hero-quote">“끝나고<br>잠깐 보자.”</p></div></div>
      </div>
      <section class="start-strip" aria-labelledby="before-title">${ticketFrame()}<div class="start-main"><div class="start-title">${star}<h2 id="before-title">시작하기 전에</h2>${waves}<p>진행 방식과 설정을 확인하세요.</p></div>
        <a class="start-link" href="#guide/진행 안내">${startFrame('cyan')}<b>01</b><span><strong>진행 안내 <span aria-hidden="true">›</span></strong><small>꿈의 진행 방식과<br>기본 규칙을 소개합니다.</small></span></a>
        <a class="start-link" href="#guide/추천 설정값">${startFrame('lime')}<b>02</b><span><strong>추천 설정 <span aria-hidden="true">›</span></strong><small>플레이 방식에 맞는<br>설정값을 확인합니다.</small></span></a>
        <a class="start-link" href="#guide/명령어">${startFrame('cyan')}<b>03</b><span><strong>명령어<span class="middle-dot">·</span>상태창 <span aria-hidden="true">›</span></strong><small>기본 명령어와<br>상태창 구성을 확인합니다.</small></span></a>
      </div><div class="quick-links"><a href="#guide/플레이 팁">${railIcon('tip')}플레이 팁 <span aria-hidden="true">›</span></a><a href="#guide/로어북 예산 안내">${railIcon('book')}로어북 예산 <span aria-hidden="true">›</span></a><a href="#guide/채팅방 이전 안내">${railIcon('chat')}채팅방 이전 <span aria-hidden="true">›</span></a></div></section>
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
  function profileContent() { return profilePaper('body')+profileGroups[profileTab].map(index => `<h3>${star}<span>${escape(label(data.profile[index].title))}</span>${waves}</h3>${prose(data.profile[index].text)}`).join(''); }
  function profile() {
    return `<section class="view profile-view"><article class="profile-sheet"><div class="profile-hero">${profilePaper('hero')}<div class="profile-photo">${portraitPhoto('profile-portrait')}${star}</div><div class="profile-identity">${palm}<span class="profile-stamp" aria-hidden="true">FIRST<br>DREAM</span><p class="profile-handwritten handwritten">언제나, 여름의 끝에서.</p><h1 class="profile-title" aria-label="브렌든 헤일"><span>브렌든</span> <span>헤일</span>${star}</h1><p class="profile-nameplate">Brendan Hale</p><p class="profile-metadata">18세<span>·</span>캐나다 레스브리지<span>·</span>라이프가드</p><blockquote class="profile-quote">“끝나고 잠깐 보자.”${waves}</blockquote></div></div><div class="profile-tabs" role="tablist" aria-label="프로필 항목">${['기본 정보·외형','성격·버릇·특징','말투·취향'].map((name,i)=>`<button type="button" role="tab" id="profile-tab-${i}" data-profile="${i}" aria-selected="${profileTab===i}" aria-controls="profile-panel">${ticketFrame(profileTab===i?'blue':'paper','row')}<span>${name.replaceAll('·','<span class="profile-separator">·</span>')}</span>${waves}</button>`).join('')}</div><div id="profile-panel" class="profile-body" role="tabpanel" aria-labelledby="profile-tab-${profileTab}">${profileContent()}</div></article></section>`;
  }
  const places = [
    {name:'입구',x:14,y:74,text:'매표소 직원은 표를 끊고 손목에 팔찌를 채웁니다.'},
    {name:'푸드코트',x:43,y:27,text:'푸드코트 직원은 닫힌 카운터 안에서 주문을 받습니다.'},
    {name:'오락실',x:15,y:12,text:'꺼진 오락기와 푸드코트 간판에 불이 들어오고, 낯선 출입문이 나타납니다.'},
    {name:'락커룸',x:54,y:69,text:'졸업파티나 사고 얘기가 나오면 브렌든이 피하던 락커룸이나 직원 복도 문이 열립니다.'},
    {name:'파도풀',x:69,y:34,text:'파도풀 가장자리에 앉아 물에 발을 담그기'},
    {name:'직원 복도',x:86,y:70,text:'브렌든이 사라져도 푸드코트의 조명은 켜져 있고, 직원 복도 쪽에는 젖은 발자국이 남습니다.'}
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
    if (!noteHeadings[key]) return prose(sections[key]);
    const lines = sections[key].split('\n').filter(line => line.startsWith('▸ '));
    return `<div class="prose">${lines.map((line,i)=>`<h3>${escape(noteHeadings[key][i])}</h3><ul><li>${linkify(line.slice(2))}</li></ul>`).join('')}</div>`;
  }
  function world() {
    return `<section class="view world-view"><div class="world-scenery" aria-hidden="true">${palm}${palm}${palm}${palm}${waves}${waves}</div><header class="world-hero">${palm}<span class="world-ticket" aria-hidden="true">${ticketFrame('lime','row')}WORLD</span><h1><span class="world-title-extrude" aria-hidden="true">꿈의 워터파크</span><span class="world-title-side" aria-hidden="true">꿈의 워터파크</span><span class="world-title-keyline" aria-hidden="true">꿈의 워터파크</span><span class="world-title-face">꿈의 워터파크</span></h1><span class="world-english" aria-hidden="true">Dream Waterpark</span><p class="world-quote">“끝나고<br>잠깐 보자.”</p><span class="world-title-wave" aria-hidden="true">${waves}</span>${waves}</header><div class="world-brochure"><section class="world-map-paper">${worldPaper('map')}<div class="world-backsheet" aria-hidden="true"><span>FIRST DREAM</span>${palm}</div><div class="native-map"><img class="map-art" src="assets/waterpark-map.png" alt="입구, 오락실, 푸드코트, 파도풀, 락커룸과 직원 복도로 구성된 워터파크 안내도" width="1536" height="1024">${places.map((place,i)=>`<details class="map-place" name="world-place" style="--x:${place.x}%;--y:${place.y}%;--slot:${i+1};--mobile-slot:${i%3+1};--mobile-row:${Math.floor(i/3)+2}"${i===4?' open':''}><summary class="place-summary" aria-label="${place.name}" aria-controls="place-info-${i}"><span class="map-pin" aria-hidden="true"><span class="map-pin-tag">${pin}<span class="map-pin-name">${place.name}</span><span class="map-pin-number">${i+1}</span></span></span><span class="place-list-label" aria-hidden="true">${ticketFrame('paper','row')}<b class="place-number">${i+1}</b><span>${place.name}</span><span class="place-chevron">›</span></span></summary><div id="place-info-${i}" class="place-inline"><h3>${pin}${place.name}</h3><p>${place.text}</p></div></details>`).join('')}</div><div class="world-map-footer" aria-hidden="true"><span class="world-map-signature">Our Summer<br>Never Ends.</span>${waves}</div><span class="fold-corner" aria-hidden="true"></span></section><section class="world-reading">${worldPaper('reading')}<div class="tab-row" role="tablist" aria-label="세계관 항목">${worldKeys.map((name,i)=>`<button type="button" role="tab" id="world-tab-${i}" data-world="${i}" aria-selected="${worldTab===i}" aria-controls="world-panel">${ticketFrame(worldTab===i?'blue':'paper','row')}<span>${name}</span></button>`).join('')}</div><div class="world-reading-columns"><div class="world-copy"><div class="world-content${worldTab===0?' world-premise':''}" id="world-panel" role="tabpanel" aria-labelledby="world-tab-${worldTab}">${prose(sections[worldKeys[worldTab]])}${palm}</div><blockquote class="world-summer-note">Our Summer<br>Never Ends.</blockquote></div><aside class="world-context"><div class="world-pool-memento">${poolPhoto('world-pool-photo').replace('Our Summer<br>Never Ends.',places[4].name+waves)}${star}</div>${waves}</aside></div><section class="world-notes"><h2>워터파크에 남은 이야기</h2><div class="world-note-tabs" role="tablist" aria-label="세계관 상세">${noteKeys.map((key,i)=>`<button type="button" role="tab" id="note-tab-${i}" data-note="${i}" aria-selected="${noteTab===i}" aria-controls="note-panel">${key}</button>`).join('')}</div><div id="note-panel" role="tabpanel" aria-labelledby="note-tab-${noteTab}">${worldNotes(noteKeys[noteTab])}</div></section><span class="fold-corner" aria-hidden="true"></span></section></div></section>`;
  }
  function opening() {
    return `<section class="view opening-view" aria-label="도입부"><div class="keepsake"><article class="opening-story">${profilePaper('opening-story')}<header class="opening-story-header"><span class="opening-story-number" aria-label="첫 번째 도입부">01</span><h1>졸업앨범을 펼친 밤</h1><button type="button" class="opening-read" data-opening-full aria-haspopup="dialog">전문 보기 <span aria-hidden="true">↗</span></button></header><figure class="opening-scene"><img src="assets/opening-album-night.png" alt="밤의 책상 위에 펼쳐진 오래된 졸업앨범" width="1536" height="864"></figure><p class="opening-story-summary">${escape(data.opening.replace(/^⑴\s*/,''))}</p><blockquote class="opening-story-quote">“끝나고 잠깐 보자.”${waves}</blockquote></article><section class="opening-guide" aria-labelledby="opening-guide-title">${profilePaper('opening-guide')}<h2 id="opening-guide-title">진행 안내</h2>${prose(sections['진행 안내'])}<p class="letter-signature">Brendan Hale ${smile}</p></section></div><div class="opening-setup">${ticketFrame()}<a class="button lime" href="#guide/추천 설정값">시작 전 설정 확인 <span aria-hidden="true">›</span></a></div></section>`;
  }
  let openingDialog = null;
  function showOpeningFull(trigger) {
    if(openingDialog)return;
    const dialog=document.createElement('dialog');
    dialog.className='opening-dialog';
    dialog.setAttribute('aria-labelledby','opening-full-title');
    dialog.innerHTML=`<header class="opening-dialog-header"><h2 id="opening-full-title">졸업앨범을 펼친 밤</h2><button type="button" class="opening-dialog-close" aria-label="전문 닫기">닫기 <span aria-hidden="true">×</span></button></header><div class="opening-full-text" tabindex="0">${escape(data.openingFull)}</div>`;
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
  const guideItems = () => `<div class="guide-items">${guideGroups[guideGroup].items.map(key=>`<button type="button" class="guide-item" data-guide="${escape(key)}" aria-current="${guideKey===key}">${ticketFrame('paper','row')}${escape(label(key))}<span class="item-chevron" aria-hidden="true">›</span></button>`).join('')}</div><div class="guide-pool" aria-hidden="true">${palm}${ladder}${waves}</div>`;
  const guideReading = () => `<h2>${escape(label(guideKey))}</h2><div class="prose">${guideBody(guideKey)}</div>`;
  function guide() {
    return `<section class="view guide-view">${heading('플레이가이드','Before You Dream')}<div class="guide-categories" role="tablist" aria-label="가이드 분류">${guideGroups.map((group,i)=>`<button type="button" role="tab" id="guide-group-${i}" data-guide-group="${i}" aria-selected="${guideGroup===i}" aria-controls="guide-item-directory">${group.title}</button>`).join('')}</div><div class="guide-layout"><aside id="guide-item-directory" class="guide-directory" role="tabpanel" aria-labelledby="guide-group-${guideGroup}" aria-label="가이드 항목">${guideItems()}</aside><article class="guide-content" id="guide-content" tabindex="-1">${guideReading()}</article></div></section>`;
  }
  const screws = className => `<div class="${className}" aria-hidden="true">${'<i class="screw"></i>'.repeat(4)}</div>`;
  function playlist() {
    return `<section class="view playlist-view">${heading('여름밤의 플레이리스트','Dream Playlist')}<div class="playlist-layout">${ticketFrame()}<section class="cassette-panel" aria-label="카세트 재생기">${screws('deck-screws')}<span class="speaker-holes" aria-hidden="true"></span><div class="deck-title" aria-hidden="true">DREAM PLAYLIST ${star}</div><div class="deck-window"><div class="cassette-art" aria-hidden="true"><img src="assets/cassette.png" alt="" width="1536" height="1024"><span class="cassette-art-title">DREAM PLAYLIST</span><span class="cassette-art-caption">Same summer. Same mixtape.</span></div></div><p id="track-current" class="track-current"></p><div class="range-row"><span id="elapsed" class="seek-time">0:00</span><input type="range" id="seek" min="0" max="1000" value="0" aria-label="재생 위치"><span id="duration" class="seek-time">0:00</span></div><div class="player-controls"><button type="button" data-music="prev" aria-label="이전 곡">${icon('prev')}</button><button type="button" data-music="toggle" aria-label="재생">${icon('play')}</button><button type="button" data-music="next" aria-label="다음 곡">${icon('next')}</button></div><div class="range-row volume-row"><button type="button" data-mute aria-label="음소거" aria-pressed="${music.volume===0}">${icon('volume')}</button><input type="range" id="volume" min="0" max="100" value="${music.volume}" aria-label="음량"></div><div class="deck-decoration" aria-hidden="true">${waves}${ladder}</div></section><ol class="track-list" aria-label="곡 목록">${data.playlist.map((track,i)=>`<li>${ticketFrame('paper','compact')}<button type="button" class="track-pick" data-track="${i}" aria-pressed="${music.index===i}"><span>${track.name.includes(' - ')?`<strong>${escape(track.name.split(' - ')[0])}</strong><span class="track-divider" aria-hidden="true"> — </span>${escape(track.name.split(' - ').slice(1).join(' - '))}`:escape(track.name)}</span></button><a class="track-external" href="${escape(track.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(track.name)} YouTube에서 열기">↗</a></li>`).join('')}</ol></div></section>`;
  }
  const views = {intro,home,profile,world,opening,guide,playlist};
  function render() {
    openingDialog?.close(false);
    const [candidate, rawKey] = location.hash.slice(1).split('/');
    route = routes.includes(candidate) ? candidate : 'intro';
    if (route==='guide' && rawKey) {
      let key;
      try { key = decodeURIComponent(rawKey); } catch { key = ''; }
      const groupIndex=guideGroups.findIndex(group=>group.items.includes(key));
      if(groupIndex!==-1){guideKey=key;guideGroup=groupIndex;}
    }
    main.innerHTML=views[route]();
    mountProfilePapers();
    document.body.dataset.page=route;
    document.title=`${titles[route]} | 브렌든 헤일`;
    document.querySelectorAll('[data-route]').forEach(link=>{if(link.dataset.route===route)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    document.querySelector('[data-route][aria-current=page]')?.scrollIntoView({block:'nearest',inline:'nearest'});
    updateMusic();
    window.scrollTo({top:0,behavior:'instant'});
    if(route==='guide'&&rawKey)requestAnimationFrame(()=>document.getElementById('guide-content').scrollIntoView({block:'start',behavior:'instant'}));
  }

  const music = {index:0, player:null, loading:null, playing:false, volume:65, lastVolume:65, elapsed:0, duration:0};
  function message(text='') { const node=document.getElementById('music-message');node.textContent=text;node.hidden=!text; }
  function time(ms) { const seconds=Math.max(0,Math.floor(ms/1000));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`; }
  function updateMusic() {
    const title=data.playlist[music.index].name;
    document.body.classList.toggle('playing',music.playing);
    document.getElementById('dock-title').textContent=music.player||music.loading?title:'여름밤의 플레이리스트';
    document.querySelectorAll('[data-music]').forEach(button=>{
      const type=button.dataset.music;
      button.innerHTML=icon(type==='toggle'?(music.playing?'pause':'play'):type);
      if(type==='toggle')button.setAttribute('aria-label',music.playing?'일시정지':'재생');
      button.disabled=Boolean(music.loading);
    });
    const current=document.getElementById('track-current');if(current)current.textContent=title;
    document.querySelectorAll('[data-track]').forEach(button=>{button.setAttribute('aria-pressed',Number(button.dataset.track)===music.index);button.disabled=Boolean(music.loading);});
    const elapsed=document.getElementById('elapsed');if(elapsed)elapsed.textContent=time(music.elapsed);
    const duration=document.getElementById('duration');if(duration)duration.textContent=time(music.duration);
    const seek=document.getElementById('seek');if(seek&&document.activeElement!==seek)seek.value=music.duration?Math.round(music.elapsed/music.duration*1000):0;
    const volume=document.getElementById('volume');if(volume&&document.activeElement!==volume)volume.value=music.volume;
    const mute=document.querySelector('[data-mute]');if(mute){mute.setAttribute('aria-pressed',music.volume===0);mute.setAttribute('aria-label',music.volume===0?'음소거 해제':'음소거');}
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
          ready(){music.player=player;player.setVolume(music.volume);message();resolve(player);},
          play(){music.playing=true;message();updateMusic();},
          pause(){music.playing=false;updateMusic();},
          progress(elapsed,duration){music.elapsed=elapsed;music.duration=duration;updateMusic();},
          volume(value,muted){music.volume=muted?0:value;if(music.volume)music.lastVolume=music.volume;updateMusic();},
          finish(){selectTrack((music.index+1)%data.playlist.length,true);},
          error(code){message(`이 곡을 재생할 수 없습니다 (${code}). 다른 곡을 선택하거나 YouTube에서 열어 주세요.`);},
          blocked(){message('재생 버튼을 한 번 더 눌러 주세요.');}
        });
      });
    })();
    updateMusic();
    try { return await music.loading; }
    catch(error){message(error.message);throw error;}
    finally {music.loading=null;updateMusic();}
  }
  async function selectTrack(index,autoPlay=true) {
    music.index=(index+data.playlist.length)%data.playlist.length;
    music.elapsed=0;music.duration=0;message();updateMusic();
    try {
      const player=await ensurePlayer();
      player.load(data.playlist[music.index].url,{auto_play:autoPlay});
    } catch { /* The shared status provides recovery. */ }
  }
  document.addEventListener('click',async event=>{
    const button=event.target.closest('button');
    if(!button)return;
    if(button.hasAttribute('data-opening-full'))showOpeningFull(button);
    if(button.hasAttribute('data-top'))window.scrollTo({top:0,behavior:'instant'});
    if(button.hasAttribute('data-nav-step'))document.getElementById('main-navigation').scrollBy({left:Number(button.dataset.navStep)*180,behavior:'smooth'});
    if(button.hasAttribute('data-guide-group')){
      guideGroup=Number(button.dataset.guideGroup);guideKey=guideGroups[guideGroup].items[0];
      history.replaceState(null,'',`#guide/${encodeURIComponent(guideKey)}`);
      document.querySelectorAll('[data-guide-group]').forEach(node=>node.setAttribute('aria-selected',node===button));
      const directory=document.getElementById('guide-item-directory');directory.innerHTML=guideItems();directory.setAttribute('aria-labelledby',button.id);
      document.getElementById('guide-content').innerHTML=guideReading();
    }
    if(button.hasAttribute('data-profile')){
      profileTab=Number(button.dataset.profile);
      document.querySelectorAll('[data-profile]').forEach(tab=>tab.setAttribute('aria-selected',tab===button));
      const panel=document.getElementById('profile-panel');panel.innerHTML=profileContent();panel.setAttribute('aria-labelledby',button.id);drawProfilePaper(panel);
    }
    if(button.hasAttribute('data-world')){
      worldTab=Number(button.dataset.world);document.querySelectorAll('[data-world]').forEach(tab=>tab.setAttribute('aria-selected',tab===button));
      const panel=document.getElementById('world-panel');panel.innerHTML=prose(sections[worldKeys[worldTab]]);panel.classList.toggle('world-premise',worldTab===0);panel.setAttribute('aria-labelledby',button.id);
    }
    if(button.hasAttribute('data-note')){
      noteTab=Number(button.dataset.note);document.querySelectorAll('[data-note]').forEach(tab=>tab.setAttribute('aria-selected',tab===button));
      const panel=document.getElementById('note-panel');panel.innerHTML=worldNotes(noteKeys[noteTab]);panel.setAttribute('aria-labelledby',button.id);
    }
    if(button.hasAttribute('data-guide')){
      guideKey=button.dataset.guide;
      history.replaceState(null,'',`#guide/${encodeURIComponent(guideKey)}`);
      document.querySelectorAll('[data-guide]').forEach(node=>node.setAttribute('aria-current',node===button));
      document.getElementById('guide-content').innerHTML=guideReading();
    }
    if(button.hasAttribute('data-disclose')){
      const panel=document.getElementById(`${button.dataset.disclose}-panel`),open=button.getAttribute('aria-expanded')==='true';
      document.querySelectorAll('[data-disclose]').forEach(node=>{node.setAttribute('aria-expanded','false');document.getElementById(`${node.dataset.disclose}-panel`).hidden=true;});
      button.setAttribute('aria-expanded',!open);panel.hidden=open;
    }
    if(button.hasAttribute('data-copy')){
      const status=button.parentElement.querySelector('.copy-result');
      try{await navigator.clipboard.writeText(button.dataset.copy);status.textContent='복사했습니다.';}catch{status.textContent='복사할 텍스트를 선택해 주세요.';const range=document.createRange();range.selectNodeContents(button.closest('.copy-unit').querySelector('pre'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);}
    }
    if(button.hasAttribute('data-track'))await selectTrack(Number(button.dataset.track));
    if(button.hasAttribute('data-mute'))setVolume(music.volume?0:music.lastVolume||65);
    if(button.hasAttribute('data-music')){
      const action=button.dataset.music;
      if(action==='prev'||action==='next')await selectTrack(music.index+(action==='next'?1:-1));
      else try{const existed=Boolean(music.player);const player=await ensurePlayer();if(existed)player.toggle();else player.play();}catch{}
    }
  });
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
  window.addEventListener('hashchange',render);
  document.querySelector('.site-footer').insertAdjacentHTML('beforeend',palm+waves);
  new ResizeObserver(()=>document.documentElement.style.setProperty('--header',`${document.querySelector('.site-header').getBoundingClientRect().height}px`)).observe(document.querySelector('.site-header'));
  render();
})();
