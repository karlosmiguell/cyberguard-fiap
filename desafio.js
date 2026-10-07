/* Desafio da turma (competição): mesmas 16 questões para todos, cobrindo os 10 assuntos.
   Vence quem faz mais pontos e, em empate, o menor tempo. Também: hub, página de exemplo e placar. */
const DZ_EMAIL_IDX=[0,6,9,10,18,19];
const dzCat=c=>LIVEQ.filter(q=>q.cat===c)[0];
const dzItems=()=>{
 const Q=c=>({k:"q",d:dzCat(c)}),E=i=>({k:"e",e:EMAILS[i]});
 return [Q("Phishing e golpes"),E(DZ_EMAIL_IDX[0]),Q("Engenharia social"),E(DZ_EMAIL_IDX[1]),Q("Contas, senhas e MFA"),E(DZ_EMAIL_IDX[2]),Q("Malware e ransomware"),Q("LGPD: conceitos"),E(DZ_EMAIL_IDX[3]),Q("Incidentes e resposta"),Q("LGPD: obrigações e sanções"),E(DZ_EMAIL_IDX[4]),Q("Terceiros e continuidade"),Q("IA e privacidade"),E(DZ_EMAIL_IDX[5]),Q("Casos reais")];
};
const DZ_MAX=1600;
const fmtT=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};

/* ---------- hub (página inicial) ---------- */
function hub(el){
 const done=!!S.dr;
 el.innerHTML=`<h1>Olá, <span>${esc(S.name)}</span></h1>
 <p class="lead">Escolha por onde começar. O laboratório é para treinar com calma. O desafio vale a competição.</p>
 <div class="grid">
 <div class="card"><span class="tag">1 · Treino livre</span><h3>Laboratório</h3><p>Todos os assuntos: fases de e-mails, minijogos, LGPD, senha, incidentes e checklist. Não vale na competição.</p><div class="btns"><button class="btn" onclick="nav('#/lab')">Abrir o laboratório</button></div></div>
 <div class="card ${done?"":"on"}"><span class="tag">2 · Competição</span><h3>Desafio da turma</h3><p>16 questões sobre os 10 assuntos, com cronômetro. Mais pontos em menos tempo ganha o chocolate. ${done?"<b>Você já concluiu o seu.</b>":""}</p><div class="btns"><button class="btn" onclick="nav('#/desafio')">${done?"Ver meu resultado":"Ir para o desafio"}</button></div></div>
 <div class="card"><span class="tag">3 · Entenda</span><h3>Como funciona a competição</h3><p>Regras, pontuação, desempate por tempo e um placar de exemplo. Dá para testar o desafio sem valer nada.</p><div class="btns"><button class="btn alt" onclick="nav('#/competicao')">Ver como funciona</button></div></div>
 </div>`;
}

/* ---------- página de exemplo: como funciona a competição ---------- */
function competicao(el){
 const demo=[["Ana","1",1500,372],["Bruno","2",1500,520],["Carla","1",1300,330],["Diego","3",1200,300],["Eva","2",1000,410]];
 el.innerHTML=`<h1>Como funciona a <span>competição</span></h1>
 <p class="lead">Vence quem entrega <b>correto</b>, com <b>mais pontos</b>, em <b>menos tempo</b>. Prêmio: 🍫 um chocolate.</p>
 <div class="grid">
  <div class="card"><span class="tag">Passo 1</span><h3>O desafio</h3><p>16 questões iguais para todos: 6 e-mails (golpe ou legítimo) e 10 perguntas, uma de cada assunto.</p></div>
  <div class="card"><span class="tag">Passo 2</span><h3>Pontos</h3><p>100 pontos por acerto. Máximo: ${DZ_MAX}. Errar ou marcar "Não sei" dá 0 e não tira pontos.</p></div>
  <div class="card"><span class="tag">Passo 3</span><h3>Tempo</h3><p>O cronômetro corre do primeiro ao último item. Em empate de pontos, vence o menor tempo.</p></div>
  <div class="card"><span class="tag">Passo 4</span><h3>Entrega</h3><p>No fim, copie o <b>código do desafio</b> e entregue ao professor. Ele monta o placar na frente de todos.</p></div>
 </div>
 <h2>Exemplo de <span>placar</span> <small style="font-size:13px;color:var(--mut)">(ilustrativo)</small></h2>
 <div class="card"><table><tr><th>#</th><th>Nome</th><th>Grupo</th><th>Pontos</th><th>Tempo</th></tr>${demo.map((d,i)=>`<tr><td>${i+1}${i===0?" 🍫":""}</td><td>${d[0]}</td><td>${d[1]}</td><td><b>${d[2]}</b></td><td>${fmtT(d[3])}</td></tr>`).join("")}</table>
 <p class="lead" style="margin:10px 0 0">Ana e Bruno empataram em 1.500 pontos. Ana ganha por ter feito em menos tempo.</p></div>
 <h2>Assuntos <span>do desafio</span></h2>
 <div class="chips">${CATS.map(c=>`<span class="chip">${esc(c)}</span>`).join("")}</div>
 <div class="card"><b>Regras justas:</b> uma tentativa oficial por pessoa; depois disso, só modo teste. Sem consulta a colegas durante o desafio. Reportar erro de conteúdo ao professor.</div>
 <div class="btns"><button class="btn" onclick="nav('#/desafio/teste')">Testar o desafio (modo teste, não vale)</button><button class="btn alt" onclick="nav('#/lab')">Abrir o laboratório</button><button class="btn alt" onclick="nav('#/placar')">Placar (professor)</button></div>`;
}

/* ---------- desafio ---------- */
let DZ=null,dztimer=null;
function desafioRoute(el,mode){
 clearInterval(dztimer);
 const test=mode==="teste";
 if(!test&&S.dr)return dzResult(el,S.dr,false);
 if(!test&&S.dz&&S.dz.start&&!S.dz.end)return dzRun(el,false,true);
 el.innerHTML=`<button class="back" onclick="nav('#/')">← Início</button><h1>Desafio <span>da turma</span>${test?" · modo teste":""}</h1>
 <p class="lead">${test?"Modo teste: igual ao desafio real, mas não vale nada e não gera código.":"Valendo o chocolate. Você tem uma tentativa oficial."}</p>
 <div class="card"><ul><li>16 questões sobre os 10 assuntos, uma de cada vez.</li><li>100 pontos por acerto. O cronômetro corre do início ao fim (inclui ler as explicações).</li><li>Vence quem fizer mais pontos e, em empate, menor tempo.</li><li>No fim, você recebe um código para entregar ao professor.</li></ul>
 <div class="btns"><button class="btn" id="go">${test?"Iniciar teste":"Iniciar o desafio oficial"}</button>${test?"":'<button class="btn alt" onclick="nav(\'#/desafio/teste\')">Prefiro testar antes</button>'}</div></div>`;
 $("#go").onclick=()=>{
  if(!test){S.dz={start:Date.now(),i:0,s:0,hits:0};save()}
  else DZ={start:Date.now(),i:0,s:0,hits:0};
  dzRun($("#app"),test,false);
 };
}
function dzRun(el,test,resume){
 clearInterval(dztimer);
 const R=test?DZ:S.dz;if(!R)return desafioRoute(el,test?"teste":"");
 const items=dzItems();
 if(R.i>=items.length){R.end=Date.now();if(!test){S.dr={s:R.s,t:Math.round((R.end-R.start)/1000),hits:R.hits};save()}return dzResult(el,{s:R.s,t:Math.round((R.end-R.start)/1000),hits:R.hits},test)}
 const it=items[R.i];let answered=false;
 const head=`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="tag">Desafio${test?" (teste)":""} · item ${R.i+1} de ${items.length}</span><span style="margin-left:auto;font-size:26px;font-weight:900;color:var(--neon)" id="clk">0:00</span><span class="pill"><b>${R.s}</b> pts</span></div><div class="meter"><i style="width:${R.i/items.length*100}%"></i></div>`;
 const tick=()=>{const c=$("#clk");if(c)c.textContent=fmtT((Date.now()-R.start)/1000)};
 const finish=(ok)=>{if(ok){R.s+=100;R.hits++}if(!test)save();hud()};
 const next=()=>{R.i++;if(!test)save();dzRun($("#app"),test,false)};
 if(it.k==="q"){
  const o=shuf(it.d.o.map((t,j)=>({t,r:j===it.d.a})));
  el.innerHTML=head+`<div class="card"><div class="tag">${esc(it.d.cat)}</div><p style="font-size:20px;color:#fff;margin:6px 0">${esc(it.d.q)}</p>${o.map((x,j)=>`<button class="opt" data-j="${j}">${esc(x.t)}</button>`).join("")}<div id="fb"></div></div>`;
  document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{if(answered)return;answered=true;const j=+b.dataset.j,ok=o[j].r;
   document.querySelectorAll(".opt").forEach((x,k)=>{x.disabled=true;if(o[k].r)x.classList.add("ok");else if(k===j)x.classList.add("bad")});
   finish(ok);$("#fb").innerHTML=`<div class="fb ${ok?"ok":"bad"}"><b>${ok?"Correto! +100":"Não é essa."}</b> ${esc(it.d.w)}<div class="btns"><button class="btn" id="nx">Próximo →</button></div></div>`;$("#nx").onclick=next;$("#nx").focus()});
 }else{
  const e=it.e,seen=new Set();
  el.innerHTML=head+`<div class="card"><div class="tag">E-mail · golpe ou legítimo?</div><div class="mail"><div class="h">Canal: ${esc(e.ch)}<br>De: <b>${esc(e.n[0])}</b> &lt;${esc(e.n[1])}&gt;${e.sub?`<br>Assunto: <b>${esc(e.sub)}</b>`:""}</div><div>${e.body}</div>${e.link?`<div><span class="lk">${esc(e.link[0])}</span></div>`:""}${e.att?`<div><span class="at">📎 ${esc(e.att)}</span></div>`:""}</div>
  <div class="tools">${TOOLS.map(t=>`<button class="tool" data-k="${t[0]}">${t[1]}</button>`).join("")}</div><ul class="finds" id="finds"></ul>
  <div class="decide" id="decide"><button data-c="report">🚩 Reportar (golpe)</button><button data-c="ok">✅ Aceitar (legítimo)</button><button data-c="idk">🤔 Não sei</button></div><div id="fb"></div></div>`;
  document.querySelectorAll(".tool").forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(seen.has(k))return;seen.add(k);b.classList.add("used");
   const txt={rem:esc(e.rem),link:e.link?`Destino real: <b>${esc(e.link[1])}</b>`:"Esta mensagem não tem link.",att:e.att?`Arquivo: <b>${esc(e.att)}</b>`:"Esta mensagem não tem anexo.",auth:esc(e.auth),ctx:esc(e.ctx)}[k];
   $("#finds").insertAdjacentHTML("beforeend",`<li><b>${TOOLS.find(t=>t[0]===k)[1]}</b><br>${txt}</li>`)});
  document.querySelectorAll("#decide button").forEach(b=>b.onclick=()=>{if(answered)return;answered=true;
   document.querySelectorAll("#decide button").forEach(x=>x.disabled=true);
   const c=b.dataset.c,ok=(c==="report"&&e.scam)||(c==="ok"&&!e.scam);finish(ok);
   $("#fb").innerHTML=`<div class="fb ${ok?"ok":"bad"}"><b>${ok?"Acertou! +100":"Não foi dessa vez."}</b> Era <b>${e.scam?"golpe":"mensagem legítima"}</b>. ${esc(e.why)}<div class="btns"><button class="btn" id="nx">Próximo →</button></div></div>`;$("#nx").onclick=next;$("#nx").focus()});
 }
 tick();dztimer=setInterval(tick,1000);
}
function dzResult(el,r,test){
 clearInterval(dztimer);
 const code=test?"":encodeCode({n:S.name,g:S.group||"-",s:xp(),l:level(),d:DAYS.filter(d=>phaseDone(d.id)).length,b:Object.values(badges()).filter(Boolean).length,c:r.s,ct:r.t});
 el.innerHTML=`<button class="back" onclick="nav('#/')">← Início</button><h1>Desafio <span>${test?"(teste) ":""}concluído</span></h1>
 <div class="card row"><div><div class="big">${r.s}</div><div class="lead">de ${DZ_MAX} pontos</div></div><div><div class="big">${fmtT(r.t)}</div><div class="lead">tempo total</div></div><div><div class="big">${r.hits}/16</div><div class="lead">acertos</div></div></div>
 ${test?'<div class="fb mid">Este foi o modo teste: não vale na competição e não gera código.</div><div class="btns"><button class="btn" onclick="nav(\'#/desafio/teste\')">Testar de novo</button><button class="btn alt" onclick="nav(\'#/competicao\')">Como funciona</button></div>':
 `<h2>Código para <span>entregar ao professor</span></h2><code class="cd" id="cd">${code}</code><div class="btns"><button class="btn" id="cp">Copiar código</button><button class="btn alt" onclick="nav('#/')">Início</button></div>
 <div class="card">Vence quem tiver <b>mais pontos</b> e, em empate, <b>menor tempo</b>. O placar é montado pelo professor com os códigos.</div>`}`;
 if($("#cp"))$("#cp").onclick=async()=>{try{await navigator.clipboard.writeText(code);$("#cp").textContent="Copiado ✓"}catch(e){const rg=document.createRange();rg.selectNodeContents($("#cd"));const s=getSelection();s.removeAllRanges();s.addRange(rg);$("#cp").textContent="Selecionado: copie com Ctrl+C"}};
}

/* ---------- placar da competição (professor) ---------- */
function placar(el){
 el.innerHTML=`<h1>Placar da <span>competição</span></h1><p class="lead">Cole os códigos do desafio (um por linha). Ordem: mais pontos e, em empate, menor tempo.</p>
 <div class="card"><textarea id="ta" rows="5" placeholder="CG1.eyJ..."></textarea><div class="btns"><button class="btn" id="mk">Montar placar</button><button class="btn alt" id="ex">Exemplo</button></div></div><div id="out"></div>`;
 const build=()=>{
  const by={};($("#ta").value.match(/CG1\.[A-Za-z0-9+/=]+/g)||[]).forEach(c=>{const o=decodeCode(c);if(!o)return;const k=(o.g+"|"+o.n).toLowerCase(),has=typeof o.c==="number";const p=by[k];
   if(!p||(has&&(!(typeof p.c==="number")||o.c>p.c||(o.c===p.c&&o.ct<p.ct))))by[k]=o});
  const all=Object.values(by),L=all.filter(o=>typeof o.c==="number").sort((a,b)=>b.c-a.c||a.ct-b.ct),X=all.filter(o=>typeof o.c!=="number");
  if(!all.length){$("#out").innerHTML='<div class="card">Nenhum código válido encontrado.</div>';return}
  const G={};L.forEach(o=>{const g=G[o.g]=G[o.g]||{n:0,s:0,t:0};g.n++;g.s+=o.c;g.t+=o.ct});
  const gl=Object.entries(G).map(([g,v])=>({g,n:v.n,m:Math.round(v.s/v.n),t:Math.round(v.t/v.n)})).sort((a,b)=>b.m-a.m||a.t-b.t);
  $("#out").innerHTML=`<h2>Ranking <span>individual</span> · desafio</h2><div class="card"><table><tr><th>#</th><th>Nome</th><th>Grupo</th><th>Pontos</th><th>Tempo</th></tr>${L.map((o,i)=>`<tr><td>${i+1}${i===0?" 🍫":i<3?" "+["","🥈","🥉"][i]:""}</td><td>${esc(o.n)}</td><td>${esc(o.g)}</td><td><b>${o.c}</b></td><td>${fmtT(o.ct)}</td></tr>`).join("")||'<tr><td colspan="5">Ninguém entregou o desafio ainda.</td></tr>'}</table></div>
  ${gl.length?`<h2>Ranking <span>por grupo</span> (média)</h2><div class="card"><table><tr><th>#</th><th>Grupo</th><th>Pessoas</th><th>Média de pontos</th><th>Tempo médio</th></tr>${gl.map((g,i)=>`<tr><td>${i+1}</td><td>${esc(g.g)}</td><td>${g.n}</td><td><b>${g.m}</b></td><td>${fmtT(g.t)}</td></tr>`).join("")}</table></div>`:""}
  ${X.length?`<h2>Sem desafio <span>(só laboratório)</span></h2><div class="card">${X.map(o=>esc(o.n)+" ("+esc(o.g)+"): "+o.s+" XP").join("<br>")}</div>`:""}`};
 $("#mk").onclick=build;
 $("#ex").onclick=()=>{$("#ta").value=[["Ana","1",1500,372],["Bruno","2",1500,520],["Carla","1",1300,330],["Diego","3",1200,300],["Eva","2",1000,410]].map(([n,g,c,ct])=>encodeCode({n,g,s:c,l:2,d:3,b:2,c,ct})).join("\n");build()};
}
