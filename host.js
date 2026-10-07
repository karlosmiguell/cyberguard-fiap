/* Modo Professor: quiz ao vivo no projetor, com placar por grupo. Sem servidor.
   O professor revela a resposta e marca quais grupos acertaram. Rota: #/professor */
const HKEY="cyberguard-fiap-host-v1";
let H=null;
try{H=JSON.parse(localStorage.getItem(HKEY)||"null")}catch(e){}
const hsave=()=>{try{localStorage.setItem(HKEY,JSON.stringify(H))}catch(e){}};
const LET=["A","B","C","D"];
let htimer=null;

function hostRoute(el,sub){
 clearInterval(htimer);
 if(sub==="temas")return temas(el);
 if(H&&H.phase&&H.phase!=="setup")return hostPlay(el);
 hostSetup(el);
}

function hostSetup(el){
 const d=(H&&H.cfg)||{teams:["Grupo 1","Grupo 2","Grupo 3","Grupo 4","Grupo 5","Grupo 6"],cats:CATS.slice(),n:12,secs:25};
 el.innerHTML=`<h1>Modo <span>Professor</span></h1>
 <p class="lead">Quiz ao vivo no projetor. Você lê a pergunta, os grupos respondem (mão, cartões A–D ou voz), você revela e marca quem acertou. <a href="#/aula/0">Abrir o Modo Aula (teoria + laboratório + quiz por tema)</a> · <a href="#/temas">todos os assuntos e gabaritos</a>.</p>
 <div class="card"><label class="l">Grupos (um nome por linha, de 2 a 10)</label><textarea id="tm" rows="6">${esc(d.teams.join("\n"))}</textarea>
 <label class="l">Assuntos</label><div class="chips" id="ct">${CATS.map(c=>`<button class="chip ${d.cats.includes(c)?"sel":""}" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>
 <div class="row"><div><label class="l">Perguntas (5 a ${LIVEQ.length})</label><input type="text" id="nq" value="${d.n}" inputmode="numeric"></div><div><label class="l">Segundos por pergunta</label><input type="text" id="sc" value="${d.secs}" inputmode="numeric"></div></div>
 <div class="btns"><button class="btn" id="st">Iniciar quiz ao vivo</button>${H&&H.phase==="end"?'<button class="btn alt" id="rs">Ver último placar</button>':""}</div><div id="fb"></div></div>
 <div class="card"><b>Como explicar aos alunos</b><ol><li>Todos abrem o link do CyberGuard no celular e digitam nome e grupo.</li><li>Na frente, o professor projeta o quiz ao vivo: cada pergunta tem tempo, os grupos respondem, e a resposta é revelada com a explicação.</li><li>Depois, cada aluno joga as fases de e-mails e os minijogos no próprio celular. Quem terminar copia o <b>código de resultado</b>.</li><li>O professor cola os códigos no <a href="#/placar">Placar</a>, e a competição individual e por grupo aparece no projetor.</li></ol></div>
 <div class="card"><b>Dicas de projeção:</b> use F11 para tela cheia. Atalhos: <b>Espaço</b> ou <b>Enter</b> revela e avança; teclas <b>1</b> a <b>9</b> marcam o grupo correspondente depois de revelar. O estado fica salvo se a página recarregar.</div>`;
 document.querySelectorAll("#ct .chip").forEach(b=>b.onclick=()=>b.classList.toggle("sel"));
 if($("#rs"))$("#rs").onclick=()=>{hostPlay(el)};
 $("#st").onclick=()=>{
  const teams=$("#tm").value.split("\n").map(t=>t.trim()).filter(Boolean).slice(0,10);
  const cats=[...document.querySelectorAll("#ct .chip.sel")].map(b=>b.dataset.c);
  const pool=LIVEQ.filter(q=>cats.includes(q.cat));
  const n=Math.max(5,Math.min(pool.length,parseInt($("#nq").value)||12)),secs=Math.max(10,Math.min(120,parseInt($("#sc").value)||25));
  if(teams.length<2){$("#fb").innerHTML='<div class="fb bad">Informe pelo menos 2 grupos.</div>';return}
  if(pool.length<5){$("#fb").innerHTML='<div class="fb bad">Escolha assuntos suficientes (pelo menos 5 perguntas).</div>';return}
  const qs=shuf(pool).slice(0,n).map(q=>{const o=shuf(q.o.map((t,j)=>({t,r:j===q.a})));return {cat:q.cat,q:q.q,w:q.w,o:o.map(x=>x.t),a:o.findIndex(x=>x.r)}});
  H={phase:"q",cfg:{teams,cats,n,secs},fromAula:undefined,teams:teams.map(t=>({n:t,s:0,hits:0})),qs,i:0,marks:{},t0:Date.now()};hsave();hostPlay(el);
 };
}

const rank=()=>H.teams.map((t,i)=>({...t,i})).sort((a,b)=>b.s-a.s);
function sideboard(){
 const r=rank(),mx=Math.max(1,r[0].s);
 return `<div class="card" style="margin:0"><div class="tag">Placar</div>${r.map((t,k)=>`<div style="margin:8px 0"><div style="display:flex;justify-content:space-between;font-size:15px"><span>${k+1}. ${esc(t.n)}</span><b style="color:var(--neon)">${t.s}</b></div><div class="meter"><i style="width:${t.s/mx*100}%"></i></div></div>`).join("")}</div>`;
}
function hostPlay(el){
 clearInterval(htimer);
 if(H.phase==="end")return hostEnd(el);
 const q=H.qs[H.i],rev=H.phase==="reveal";
 const COL=["#ED145B","#FF2E97","#B80F48","#FF5DAE"];
 el.innerHTML=`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="back" id="ex">← Sair</button><span class="tag">Pergunta ${H.i+1} de ${H.qs.length} · ${esc(q.cat)}</span><span style="margin-left:auto;font-size:30px;font-weight:900;color:var(--neon)" id="tk"></span><button class="btn sm alt" id="fs">Tela cheia</button></div>
 <div class="meter" style="height:10px"><i id="tb" style="width:100%"></i></div>
 <div class="row" style="align-items:flex-start;margin-top:10px"><div style="flex:3;min-width:300px">
 <p style="font-size:clamp(22px,3.2vw,38px);font-weight:800;line-height:1.25;margin:10px 0 18px">${esc(q.q)}</p>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${q.o.map((o,j)=>`<div style="border-radius:14px;padding:16px;font-size:clamp(16px,2vw,24px);font-weight:700;background:${rev?(j===q.a?"rgba(46,229,157,.2)":"#151515"):"#151515"};border:2px solid ${rev?(j===q.a?"var(--ok)":"#2a2a2a"):COL[j]};opacity:${rev&&j!==q.a?.45:1}"><span style="color:${COL[j]};margin-right:8px">${LET[j]}</span>${esc(o)}</div>`).join("")}</div>
 ${rev?`<div class="fb ok" style="font-size:clamp(15px,1.7vw,20px)"><b>Resposta: ${LET[q.a]}.</b> ${esc(q.w)}</div>
 <div class="tag" style="margin-top:14px">Marque quem acertou (✓ +100) e o mais rápido (⚡ +50)</div>
 <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;margin-top:6px">${H.teams.map((t,i)=>{const m=H.marks[i]||{};return `<div class="card" style="margin:0;padding:10px"><div style="font-size:14px;margin-bottom:6px">${i+1}. ${esc(t.n)}</div><button class="btn sm ${m.ok?"":"alt"}" data-m="ok" data-i="${i}">✓ Acertou</button> <button class="btn sm ${m.fast?"":"alt"}" data-m="fast" data-i="${i}">⚡ Rápido</button></div>`}).join("")}</div>`:""}
 <div class="btns"><button class="btn" id="nx">${rev?(H.i+1<H.qs.length?"Próxima pergunta →":"Finalizar e ver o pódio"):"Revelar resposta"}</button></div></div>
 <div style="flex:1;min-width:230px">${sideboard()}</div></div>`;
 $("#ex").onclick=()=>{H.phase=H.phase==="end"?"end":"setup-keep";if(H.phase==="setup-keep")H.phase="setup";hsave();nav("#/professor");render()};
 $("#fs").onclick=()=>{document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()};
 document.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,m=H.marks[i]=H.marks[i]||{};m[b.dataset.m]=!m[b.dataset.m];if(b.dataset.m==="fast"&&m.fast)m.ok=true;hsave();hostPlay(el)});
 $("#nx").onclick=()=>hostNext(el);
 if(!rev){
  const total=H.cfg.secs;let left=Math.max(0,total-Math.floor((Date.now()-(H.t0||Date.now()))/1000));
  const tick=()=>{$("#tk")&&($("#tk").textContent=left>0?left+"s":"Tempo!");$("#tb")&&($("#tb").style.width=left/total*100+"%");if(left<=0)clearInterval(htimer);left--};
  tick();htimer=setInterval(tick,1000);
 }else{$("#tk").textContent=""}
}
function hostNext(el){
 if(H.phase==="q"){H.phase="reveal";hsave();return hostPlay(el)}
 // aplicar marcas
 H.teams.forEach((t,i)=>{const m=H.marks[i]||{};if(m.ok){t.s+=100;t.hits++}if(m.fast)t.s+=50});
 H.marks={};H.i++;H.t0=Date.now();
 H.phase=H.i>=H.qs.length?"end":"q";hsave();hostPlay(el);
}
function hostEnd(el){
 const r=rank(),med=["🥇","🥈","🥉"];
 const top=r.slice(0,3);
 el.innerHTML=`<h1>Pódio <span>final</span></h1>
 <div style="display:flex;gap:12px;align-items:flex-end;justify-content:center;margin:20px 0;flex-wrap:wrap">${[1,0,2].filter(k=>top[k]).map(k=>`<div class="card on" style="width:200px;text-align:center;margin:0;padding-top:${k===0?40:20}px;padding-bottom:${k===0?40:20}px"><div style="font-size:54px">${med[k]}</div><h3>${esc(top[k].n)}</h3><div class="big" style="font-size:40px">${top[k].s}</div><div class="lead">${top[k].hits} acertos</div></div>`).join("")}</div>
 <div class="card"><table><tr><th>#</th><th>Grupo</th><th>Acertos</th><th>Pontos</th></tr>${r.map((t,k)=>`<tr><td>${k+1}</td><td>${esc(t.n)}</td><td>${t.hits}/${H.qs.length}</td><td><b>${t.s}</b></td></tr>`).join("")}</table></div>
 <div class="btns"><button class="btn" id="cp">Copiar ranking</button>${H.fromAula!==undefined?`<button class="btn" onclick="nav('#/aula/${H.fromAula}')">← Voltar à aula</button>`:""}<button class="btn alt" id="nw">Novo quiz</button><button class="btn alt" onclick="nav('#/placar')">Placar da competição individual</button></div>
 <div class="card"><b>Próximo passo:</b> peça que todos abram o CyberGuard no celular, joguem as fases e mandem o código de resultado. Você cola os códigos em <b>Placar da competição</b> e a disputa continua até o fim do workshop.</div>`;
 $("#cp").onclick=async()=>{const t=r.map((x,k)=>`${k+1}. ${x.n}: ${x.s} pts (${x.hits}/${H.qs.length} acertos)`).join("\n");try{await navigator.clipboard.writeText(t);$("#cp").textContent="Copiado ✓"}catch(e){}};
 $("#nw").onclick=()=>{H.phase="setup";hsave();hostRoute(el)};
}

/* Atalhos de teclado do projetor */
addEventListener("keydown",e=>{
 if(!H||!/^#\/professor/.test(location.hash)||H.phase==="setup"||H.phase==="end")return;
 if(/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||""))return;
 if(e.key===" "||e.key==="Enter"){e.preventDefault();hostNext($("#app"))}
 else if(H.phase==="reveal"&&/^[1-9]$/.test(e.key)&&H.teams[+e.key-1]){const i=+e.key-1,m=H.marks[i]=H.marks[i]||{};m.ok=!m.ok;hsave();hostPlay($("#app"))}
});

/* Guia de assuntos e gabaritos (para o professor) */
function temas(el){
 el.innerHTML=`<button class="back" onclick="nav('#/professor')">← Modo Professor</button><h1>Todos os <span>assuntos</span></h1>
 <p class="lead">${LIVEQ.length} perguntas em ${CATS.length} assuntos, mais 5 fases de e-mails. Cada resposta traz a explicação para você usar na fala.</p>
 ${CATS.map(c=>`<h2>${esc(c)} <span>· ${LIVEQ.filter(q=>q.cat===c).length}</span></h2>`+LIVEQ.filter(q=>q.cat===c).map(q=>`<div class="card"><b>${esc(q.q)}</b><div class="lead" style="margin-top:6px">✔ ${esc(q.o[q.a])}</div><div style="font-size:14px;color:#cfcfcf">${esc(q.w)}</div></div>`).join("")).join("")}
 <h2>Fases <span>· e-mails de treino</span></h2>${DAYS.map(d=>`<div class="card"><span class="tag">Dia ${d.id}</span> <b>${esc(d.title)}</b><div class="lead">${esc(d.desc)}</div>${EMAILS.filter(e=>e.day===d.id).map(e=>`<div style="font-size:14px;margin:4px 0">${e.scam?"🚩 Golpe":"✅ Legítimo"} · <b>${esc(e.sub||e.ch)}</b> — ${esc(e.why)}</div>`).join("")}</div>`).join("")}`;
}
