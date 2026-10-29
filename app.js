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
  const titles = {intro:'꿈으로 입장',home:'홈',profile:'프로필',world:'세계관',opening:'시작하기',guide:'플레이가이드',playlist:'플레이리스트'};
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
  const waves = '<svg class="wave-mark" viewBox="0 0 180 30" aria-hidden="true"><path d="M0 18Q15 0 30 18T60 18T90 18T120 18T150 18T180 18"/></svg>';
  const ladder = '<svg class="ladder-mark" viewBox="0 0 80 90" aria-hidden="true"><path d="M20 80V20C20 0 40 0 40 20v10M50 80V20C50 0 70 0 70 20v10M20 40h30M20 58h30M20 76h30"/></svg>';
  const smile = '<svg class="smile-mark" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="M14 27q10 17 21-1M16 15v5M31 15v5"/></svg>';
  function ticketFrame(fill='paper') {
    let path='M14 4H686Q686 17 696 17';
    for(let y=20;y<400;y+=40)path+=`V${y}c-17 0-17 22 0 22`;
    path+='V403Q683 403 683 416H17Q17 403 4 403';
    for(let y=380;y>20;y-=40)path+=`V${y}c17 0 17-22 0-22`;
    path+='V17Q14 17 14 4Z';
    return `<svg class="ticket-frame fill-${fill}" viewBox="0 0 700 420" preserveAspectRatio="none" aria-hidden="true"><path d="${path}" vector-effect="non-scaling-stroke"/></svg>`;
  }
  const buttonTicket = (fill='blue') => `<svg class="button-edge fill-${fill}" viewBox="0 0 240 60" preserveAspectRatio="none" aria-hidden="true"><path d="M8 2H232Q232 8 238 8V20Q230 24 238 28V38Q230 42 238 46V52Q232 52 232 58H8Q8 52 2 52V46Q10 42 2 38V28Q10 24 2 20V8Q8 8 8 2Z" vector-effect="non-scaling-stroke"/></svg>`;
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
    return `<section class="intro-view" aria-label="꿈으로 입장"><img class="intro-scene" src="assets/waterpark.png" alt="푸른 물빛과 워터슬라이드가 있는 실내 워터파크" width="1536" height="1024" fetchpriority="high"><div class="intro-stage"><div class="hero-ticket intro-ticket">${ticketFrame()}${titleMark()}<h1>죽은 소꿉친구가 돌아왔다.</h1><p class="hook-sub">꿈에서만 허락된 재회로.</p><div class="ticket-pool" aria-hidden="true">${waves}${ladder}</div><a class="button admission-button ticket-button" href="#home">${buttonTicket()}입장하기 <span aria-hidden="true">→</span></a></div><p class="intro-quote">“끝나고<br>잠깐 보자.”</p></div></section>`;
  }
  function home() {
    return `<section class="home-view view" aria-label="브렌든 소개">
      <div class="hero"><p class="home-handwritten handwritten">언제나, 여름의 끝에서.</p><div class="hero-ticket">${ticketFrame()}<div class="ticket-copy">${titleMark()}<h1>죽은 소꿉친구가 돌아왔다.</h1><p class="hook-sub">꿈에서만 허락된 재회로.</p><div class="ticket-pool" aria-hidden="true">${waves}${ladder}</div>
          <div class="hero-actions"><a class="button ticket-button" href="#profile">${buttonTicket()}브렌든 알아보기 <span aria-hidden="true">›</span></a><a class="button light ticket-button" href="#guide">${buttonTicket('paper')}시작 전 안내 <span aria-hidden="true">›</span></a></div>
          <p class="hero-genre">1990s CANADA / DREAMCORE / MYSTERY</p>
        </div><div class="home-photos">${poolPhoto()}${portraitPhoto()}${star}<p class="hero-quote">“끝나고<br>잠깐 보자.”</p></div></div>
      </div>
      <section class="start-strip" aria-labelledby="before-title">${ticketFrame()}<div class="start-main"><div class="start-title">${star}<h2 id="before-title">시작하기 전에</h2>${waves}<p>진행 방식과 설정을 확인하세요.</p></div>
        <a class="start-link" href="#guide/진행 안내">${ticketFrame('cyan')}<b>01</b><span><strong>진행 안내 <span aria-hidden="true">›</span></strong><small>꿈의 진행 방식과<br>기본 규칙을 소개합니다.</small></span></a>
        <a class="start-link" href="#guide/추천 설정값">${ticketFrame('lime')}<b>02</b><span><strong>추천 설정 <span aria-hidden="true">›</span></strong><small>플레이 방식에 맞는<br>설정값을 확인합니다.</small></span></a>
        <a class="start-link" href="#guide/명령어">${ticketFrame('cyan')}<b>03</b><span><strong>명령어<span class="middle-dot">·</span>상태창 <span aria-hidden="true">›</span></strong><small>기본 명령어와<br>상태창 구성을 확인합니다.</small></span></a>
      </div><div class="quick-links"><a href="#guide/플레이 팁">플레이 팁 <span aria-hidden="true">›</span></a><a href="#guide/로어북 예산 안내">로어북 예산 <span aria-hidden="true">›</span></a><a href="#guide/채팅방 이전 안내">채팅방 이전 <span aria-hidden="true">›</span></a></div></section>
      <div class="disclosures"><div class="disclosure-buttons"><button type="button" data-disclose="tw" aria-expanded="false" aria-controls="tw-panel">TW <span aria-hidden="true">+</span></button><button type="button" data-disclose="motif" aria-expanded="false" aria-controls="motif-panel">MOTIF <span aria-hidden="true">+</span></button></div><div id="tw-panel" class="disclosure-body" hidden>${prose(data.tw)}</div><div id="motif-panel" class="disclosure-body" hidden>${prose(sections['모티브'])}</div></div>
    </section>`;
  }
  const profileGroups = [[0,1],[2,4],[3,5]];
  function profileContent() { return profileGroups[profileTab].map(index => `<h3>${escape(label(data.profile[index].title))}</h3>${prose(data.profile[index].text)}`).join(''); }
  function profile() {
    return `<section class="view profile-view"><div class="album"><div class="album-photos">${poolPhoto()}${portraitPhoto()}${star}<span class="album-stamp" aria-hidden="true">FIRST DREAM</span>${waves}</div><div class="album-reading"><h1 class="album-name">브렌든 헤일</h1><p class="english-name">Brendan Hale</p><div class="tag-row">${data.tags.flatMap(tag=>tag==='ALL'?['HL','BL']:[tag]).map(tag=>`<span class="tag">${escape(tag)}</span>`).join('')}</div><blockquote class="album-quote">“끝나고 잠깐 보자.”</blockquote><div class="tab-row" role="tablist" aria-label="프로필 항목">${['기본 정보·외형','성격·버릇·특징','말투·취향'].map((name,i)=>`<button type="button" role="tab" id="profile-tab-${i}" data-profile="${i}" aria-selected="${profileTab===i}" aria-controls="profile-panel">${name}</button>`).join('')}</div><div id="profile-panel" class="album-panel" role="tabpanel" aria-labelledby="profile-tab-${profileTab}" tabindex="0">${profileContent()}</div></div><article class="intro-paper"><h2>소개</h2>${prose(data.intro)}</article></div></section>`;
  }
  const places = [
    {name:'입구',x:14,y:79,text:'매표소 직원은 표를 끊고 손목에 팔찌를 채웁니다.'},
    {name:'푸드코트',x:43,y:19,text:'푸드코트 직원은 닫힌 카운터 안에서 주문을 받습니다.'},
    {name:'오락실',x:15,y:24,text:'꺼진 오락기와 푸드코트 간판에 불이 들어오고, 낯선 출입문이 나타납니다.'},
    {name:'락커룸',x:53,y:78,text:'졸업파티나 사고 얘기가 나오면 브렌든이 피하던 락커룸이나 직원 복도 문이 열립니다.'},
    {name:'파도풀',x:76,y:46,text:'파도풀 가장자리에 앉아 물에 발을 담그기'},
    {name:'직원 복도',x:87,y:79,text:'브렌든이 사라져도 푸드코트의 조명은 켜져 있고, 직원 복도 쪽에는 젖은 발자국이 남습니다.'}
  ];
  const worldKeys = ['세계관','꿈 회차','깨어나는 시간'];
  const noteKeys = ['1990s 캐나다 워터파크','브렌든','꿈의 워터파크','사라진 브렌든','꿈속 사람들','진행 소재'];
  function world() {
    return `<section class="view world-view">${heading('꿈의 워터파크','Dream Waterpark')}<div class="brochure"><div class="world-layout"><div class="map-page"><div class="map-wrap"><img src="assets/waterpark-map.png" alt="입구, 오락실, 푸드코트, 파도풀, 락커룸과 직원 복도로 구성된 워터파크 안내도" width="1536" height="1024">${places.map((place,i)=>`<button type="button" class="hotspot" data-place="${i}" aria-pressed="${placeIndex===i}" aria-controls="place-panel" style="left:${place.x}%;top:${place.y}%"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22S3 13 3 8a9 9 0 0 1 18 0c0 5-9 14-9 14Z"/><circle cx="12" cy="8" r="3"/></svg>${place.name}</button>`).join('')}</div><div class="place-directory">${places.map((place,i)=>`<button type="button" data-place="${i}" aria-pressed="${placeIndex===i}" aria-controls="place-panel">${place.name}<span aria-hidden="true">›</span></button>`).join('')}</div>${waves}</div><div class="world-reading"><div class="tab-row" role="tablist" aria-label="세계관 항목">${worldKeys.map((name,i)=>`<button type="button" role="tab" id="world-tab-${i}" data-world="${i}" aria-selected="${worldTab===i}" aria-controls="world-panel">${name}</button>`).join('')}</div><div class="world-content" id="world-panel" role="tabpanel" aria-labelledby="world-tab-${worldTab}">${prose(sections[worldKeys[worldTab]])}</div><div id="place-panel" class="place-reading" aria-live="polite"><h3>${places[placeIndex].name}</h3><p>${places[placeIndex].text}</p></div><span class="fold-corner" aria-hidden="true"></span></div></div><section class="world-notes"><h2>워터파크에 남은 이야기</h2><div class="world-note-tabs" role="tablist" aria-label="세계관 상세">${noteKeys.map((key,i)=>`<button type="button" role="tab" id="note-tab-${i}" data-note="${i}" aria-selected="${noteTab===i}" aria-controls="note-panel">${key}</button>`).join('')}</div><div id="note-panel" role="tabpanel" aria-labelledby="note-tab-${noteTab}">${prose(sections[noteKeys[noteTab]])}</div></section></div></section>`;
  }
  function opening() {
    return `<section class="view opening-view"><article class="keepsake"><div class="opening-top">${poolPhoto()}<div class="opening-heading"><h1>시작하기</h1><span class="name-ticket">First Dream</span>${waves}${star}</div></div><div class="opening-layout"><div class="opening-copy"><span class="opening-number" aria-label="첫 번째 시작">01</span><h2>졸업앨범을 펼친 밤</h2><p class="opening-text">${escape(data.opening.replace(/^⑴\s*/,''))}</p>${prose(sections['진행 안내'])}<p class="letter-signature">Brendan Hale ${smile}</p></div><div class="opening-mementos">${portraitPhoto()}<blockquote class="quote-note">“끝나고<br>잠깐 보자.”${waves}</blockquote></div></div></article><div class="opening-setup">${ticketFrame()}<a class="button lime" href="#guide/추천 설정값">시작 전 설정 확인 <span aria-hidden="true">›</span></a></div></section>`;
  }
  const guideItems = () => `<div class="guide-items">${guideGroups[guideGroup].items.map(key=>`<button type="button" class="guide-item" data-guide="${escape(key)}" aria-current="${guideKey===key}">${ticketFrame()}${escape(label(key))}</button>`).join('')}</div>${ladder}${waves}`;
  const guideReading = () => `<h2>${escape(label(guideKey))}</h2><div class="prose">${guideBody(guideKey)}</div>`;
  function guide() {
    return `<section class="view guide-view">${heading('플레이가이드','Before You Dream')}<div class="guide-categories" role="tablist" aria-label="가이드 분류">${guideGroups.map((group,i)=>`<button type="button" role="tab" id="guide-group-${i}" data-guide-group="${i}" aria-selected="${guideGroup===i}" aria-controls="guide-item-directory">${group.title}</button>`).join('')}</div><div class="guide-layout"><aside id="guide-item-directory" class="guide-directory" role="tabpanel" aria-labelledby="guide-group-${guideGroup}" aria-label="가이드 항목">${guideItems()}</aside><article class="guide-content" id="guide-content" tabindex="-1">${guideReading()}</article></div></section>`;
  }
  const screws = className => `<div class="${className}" aria-hidden="true">${'<i class="screw"></i>'.repeat(4)}</div>`;
  function playlist() {
    return `<section class="view playlist-view">${heading('여름밤의 플레이리스트','Dream Playlist')}<div class="playlist-layout">${ticketFrame()}<section class="cassette-panel" aria-label="카세트 재생기">${screws('deck-screws')}<div class="deck-title" aria-hidden="true">DREAM PLAYLIST ${star}</div><div class="deck-window"><div class="cassette-art" aria-hidden="true"><img src="assets/cassette.png" alt="" width="1536" height="1024"><span class="cassette-art-title">DREAM PLAYLIST</span><span class="cassette-art-caption">Same summer. Same mixtape.</span></div></div><p id="track-current" class="track-current"></p><div class="range-row"><span id="elapsed" class="seek-time">0:00</span><input type="range" id="seek" min="0" max="1000" value="0" aria-label="재생 위치"><span id="duration" class="seek-time">0:00</span></div><div class="player-controls"><button type="button" data-music="prev" aria-label="이전 곡">${icon('prev')}</button><button type="button" data-music="toggle" aria-label="재생">${icon('play')}</button><button type="button" data-music="next" aria-label="다음 곡">${icon('next')}</button></div><div class="range-row volume-row"><button type="button" data-mute aria-label="음소거" aria-pressed="${music.volume===0}">${icon('volume')}</button><input type="range" id="volume" min="0" max="100" value="${music.volume}" aria-label="음량"></div><div class="deck-decoration" aria-hidden="true">${waves}${ladder}</div></section><ol class="track-list" aria-label="곡 목록">${data.playlist.map((track,i)=>`<li><button type="button" class="track-pick" data-track="${i}" aria-pressed="${music.index===i}"><span>${escape(track.name)}</span></button><a class="track-external" href="${escape(track.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(track.name)} YouTube에서 열기">↗</a></li>`).join('')}</ol></div></section>`;
  }
  const views = {intro,home,profile,world,opening,guide,playlist};
  function render() {
    const [candidate, rawKey] = location.hash.slice(1).split('/');
    route = routes.includes(candidate) ? candidate : 'intro';
    if (route==='guide' && rawKey) {
      let key;
      try { key = decodeURIComponent(rawKey); } catch { key = ''; }
      const groupIndex=guideGroups.findIndex(group=>group.items.includes(key));
      if(groupIndex!==-1){guideKey=key;guideGroup=groupIndex;}
    }
    main.innerHTML=views[route]();
    document.body.dataset.page=route;
    if(route==='profile'){
      const panel=document.getElementById('profile-panel');
      panel.insertAdjacentHTML('afterend','<button type="button" class="profile-more" data-profile-scroll aria-controls="profile-panel">아래 내용 더 보기 <span aria-hidden="true">↓</span></button>');
      panel.addEventListener('scroll',syncProfileScroll,{passive:true});
      requestAnimationFrame(syncProfileScroll);
    }
    document.title=`${titles[route]} | 브렌든 헤일`;
    document.querySelectorAll('[data-route]').forEach(link=>{if(link.dataset.route===route)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    document.querySelector('[data-route][aria-current=page]')?.scrollIntoView({block:'nearest',inline:'nearest'});
    updateMusic();
    window.scrollTo({top:0,behavior:'instant'});
    if(route==='guide'&&rawKey)requestAnimationFrame(()=>document.getElementById('guide-content').scrollIntoView({block:'start',behavior:'instant'}));
  }

  function syncProfileScroll(){
    const panel=document.getElementById('profile-panel'),button=document.querySelector('[data-profile-scroll]');
    if(!panel||!button)return;
    button.hidden=panel.scrollHeight<=panel.clientHeight+1;
    button.disabled=panel.scrollTop+panel.clientHeight>=panel.scrollHeight-2;
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
      const panel=document.getElementById('profile-panel');panel.innerHTML=profileContent();panel.setAttribute('aria-labelledby',button.id);panel.scrollTop=0;
      syncProfileScroll();
    }
    if(button.hasAttribute('data-profile-scroll'))document.getElementById('profile-panel').scrollBy({top:220,behavior:'instant'});
    if(button.hasAttribute('data-world')){
      worldTab=Number(button.dataset.world);document.querySelectorAll('[data-world]').forEach(tab=>tab.setAttribute('aria-selected',tab===button));
      const panel=document.getElementById('world-panel');panel.innerHTML=prose(sections[worldKeys[worldTab]]);panel.setAttribute('aria-labelledby',button.id);
    }
    if(button.hasAttribute('data-note')){
      noteTab=Number(button.dataset.note);document.querySelectorAll('[data-note]').forEach(tab=>tab.setAttribute('aria-selected',tab===button));
      const panel=document.getElementById('note-panel');panel.innerHTML=prose(sections[noteKeys[noteTab]]);panel.setAttribute('aria-labelledby',button.id);
    }
    if(button.hasAttribute('data-place')){
      placeIndex=Number(button.dataset.place);document.querySelectorAll('[data-place]').forEach(node=>node.setAttribute('aria-pressed',Number(node.dataset.place)===placeIndex));
      document.getElementById('place-panel').innerHTML=`<h3>${places[placeIndex].name}</h3><p>${places[placeIndex].text}</p>`;
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
  new ResizeObserver(()=>document.documentElement.style.setProperty('--header',`${document.querySelector('.site-header').getBoundingClientRect().height}px`)).observe(document.querySelector('.site-header'));
  render();
})();
