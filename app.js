/* CyberGuard FIAP — lógica do jogo. Sem servidor: o progresso fica só neste navegador. */
const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
EMAILS.forEach((e,i)=>e.id=i);

/* ---------- estado ---------- */
const KEY="cyberguard-fiap-v1";
let S={name:"",group:"",phase:{},mini:{},ck:{},tools:{}};
try{S=Object.assign(S,JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};

const MINI={
 caca:{t:"Caça-Golpe",d:"16 mensagens curtas: golpe ou legítima? 40 pontos por acerto.",max:640},
 quiz:{t:"Quiz de Segurança",d:"12 perguntas de múltipla escolha. 100 pontos por acerto.",max:1200},
 dados:{t:"Dados e LGPD",d:"Classifique 10 dados em pessoal, sensível ou não pessoal. 50 pontos por acerto.",max:500},
 inc:{t:"Incidentes",d:"4 cenários de vazamento: qual é a melhor ação? 100 pontos por acerto.",max:400},
 senha:{t:"Senha forte",d:"Monte uma senha de teste com pelo menos 70% de força. 100 pontos.",max:100}
};
const dayEmails=d=>EMAILS.filter(e=>e.day===d);
const dayMax=d=>dayEmails(d).length*100*d;
const phasePts=d=>Object.values((S.phase[d]||{}).ans||{}).reduce((a,b)=>a+b,0);
const phaseDone=d=>dayEmails(d).every(e=>((S.phase[d]||{}).ans||{})[e.id]!==undefined);
const phaseUnlocked=d=>true; /* laboratório: tudo liberado */
const ckCount=()=>Object.values(S.ck).filter(Boolean).length;
const ckPts=()=>ckCount()*10;
const miniPts=()=>Object.values(S.mini).reduce((a,b)=>a+b,0);
const xp=()=>DAYS.reduce((a,d)=>a+phasePts(d.id),0)+miniPts()+ckPts();
const maxXp=()=>DAYS.reduce((a,d)=>a+dayMax(d.id),0)+Object.values(MINI).reduce((a,m)=>a+m.max,0)+CHECKLIST.flatMap(g=>g[1]).length*10;
const level=()=>Math.floor(xp()/1000)+1;
const badges=()=>{
 const got={};let correctReport=false,perfect=false;
 DAYS.forEach(d=>{const a=(S.phase[d.id]||{}).ans||{};
  dayEmails(d.id).forEach(e=>{if(e.scam&&a[e.id]>0)correctReport=true});
  if(phaseDone(d.id)&&dayEmails(d.id).every(e=>a[e.id]>0))perfect=true});
 got.primeiro=correctReport;got.aguia=perfect;
 got.calma=Object.values(S.tools).filter(n=>n>=2).length>=12;
 got.lgpd=(S.mini.dados||0)>=500;got.plano=ckCount()>=9;return got};

/* ---------- navegação ---------- */
let P=null,M=null;
function nav(h){location.hash=h}
window.addEventListener("hashchange",render);
function hud(){
 const lv=level(),into=xp()%1000;
 $("#hud").innerHTML=S.name?`<span class="pill">${esc(S.name)}${S.group?" · Grupo "+esc(S.group):""}</span><span class="pill">Nível <b>${lv}</b><span class="xpbar"><i style="width:${into/10}%"></i></span></span><span class="pill"><b>${xp()}</b> XP</span>`:"";
}
function render(){
 hud();const r=(location.hash||"#/").slice(2).split("/");const v=r[0]||"home",a=r[1];
 let ai=null;try{ai=sessionStorage.getItem("cgAula")}catch(e){}
 const ba=$("#backAula");if(ba){const show=ai!==null&&["fase","mini","checklist","resultado"].includes(v);ba.style.display=show?"block":"none";ba.href="#/aula/"+(ai||0)}
 const pl=$("#pl");if(pl)pl.style.display=(v==="desafio"||v==="home")?"none":"inline";
 const el=$("#app");scrollTo(0,0);
 if(v==="placar")return placar(el);
 if(v==="professor")return hostRoute(el,a);
 if(v==="competicao")return competicao(el);
 if(v==="temas")return temas(el);
 if(v==="aula")return aulaRoute(el,r[1]);
 if(!S.name)return welcome(el);
 if(v==="desafio")return desafioRoute(el,a);
 if(v==="lab")return home(el);
 if(v==="fase")return phaseStart(el,+a);
 if(v==="mini")return mini(el,a);
 if(v==="checklist")return checklist(el);
 if(v==="resultado")return result(el);
 hub(el);
}

/* ---------- boas-vindas e início ---------- */
function welcome(el){
 el.innerHTML=`<h1>Você é o(a) analista de segurança <span>de hoje</span></h1>
 <p class="lead">Na Atlântica Serviços (empresa fictícia), a caixa de entrada não para. Investigue cada mensagem, decida se é golpe e some pontos. Nada do que você digita sai do seu navegador.</p>
 <div class="card"><label class="l" for="nm">Seu nome ou apelido</label><input type="text" id="nm" maxlength="30" placeholder="Ex.: Ana S." autocomplete="off">
 <label class="l" for="gp">Seu grupo</label><select id="gp"><option value="">Sem grupo</option>${[1,2,3,4,5,6,7,8].map(n=>`<option>${n}</option>`).join("")}</select>
 <div class="btns"><button class="btn" id="go">Começar</button></div></div>
 <div class="card"><b>Como funciona</b><ul><li>5 fases com 4 e-mails cada. Use as ferramentas de investigação (de graça e sem limite).</li><li>Decida: <b>Reportar</b> (golpe), <b>Aceitar</b> (legítimo) ou <b>Não sei</b>. Errar não tira pontos.</li><li>Minijogos, LGPD, senha e o checklist final somam XP. No final, gere seu código para o placar da turma.</li></ul></div>`;
 $("#go").onclick=()=>{const n=$("#nm").value.trim();if(!n){$("#nm").focus();return}S.name=n.slice(0,30);S.group=$("#gp").value;save();render()};
}
function home(el){
 const bg=badges(),bc=Object.values(bg).filter(Boolean).length;
 el.innerHTML=`<button class="back" onclick="nav('#/')">← Início</button><h1>Laboratório <span>· ${esc(S.name)}</span></h1>
 <div class="btns" style="margin:0 0 8px"><button class="btn sm alt" onclick="nav('#/aula/0')">Roteiro por tema (aula)</button><button class="btn sm alt" onclick="nav('#/competicao')">Como funciona a competição</button></div>
 <p class="lead">Progresso geral: ${xp()} de ${maxXp()} XP</p><div class="meter"><i style="width:${Math.min(100,xp()/maxXp()*100)}%"></i></div>
 <h2>Fases <span>· caixa de entrada</span></h2>
 <div class="grid">${DAYS.map(d=>{const un=phaseUnlocked(d.id),dn=phaseDone(d.id),n=Object.keys((S.phase[d.id]||{}).ans||{}).length;
  return `<div class="card ${un?"":"lock"} ${dn?"on":""}"><span class="tag">Dia ${d.id} · dificuldade ${d.d}</span><h3>${d.title}</h3><p>${d.desc}</p>
  <div class="prog" style="font-size:13px;color:var(--mut)">${dn?"Concluída":n+"/4 e-mails"} · ${phasePts(d.id)}/${dayMax(d.id)} pts</div>
  <div class="btns"><button class="btn sm" ${un?"":"disabled"} onclick="nav('#/fase/${d.id}')">${dn?"Treinar de novo":n?"Continuar":un?"Começar":"Trancada"}</button></div></div>`}).join("")}</div>
 <h2>Minijogos <span>· para treinar</span></h2>
 <div class="grid">${Object.entries(MINI).map(([k,m])=>`<div class="card"><span class="tag">Melhor: ${S.mini[k]||0}/${m.max}</span><h3>${m.t}</h3><p>${m.d}</p><div class="btns"><button class="btn sm alt" onclick="nav('#/mini/${k}')">Jogar</button></div></div>`).join("")}
 <div class="card"><span class="tag">${ckCount()}/${CHECKLIST.flatMap(g=>g[1]).length} marcados</span><h3>Checklist de segurança</h3><p>Seu plano pessoal de boas práticas. Dá para imprimir ou salvar em PDF.</p><div class="btns"><button class="btn sm alt" onclick="nav('#/checklist')">Abrir</button></div></div></div>
 <h2>Conquistas <span>· ${bc}/${BADGES.length}</span></h2>
 <div class="badges">${BADGES.map(b=>`<div class="badge ${bg[b[0]]?"got":""}"><b>${b[1]}</b>${b[2]}</div>`).join("")}</div>
 <div class="btns"><button class="btn" onclick="nav('#/resultado')">Ver meu resultado e código</button></div>`;
}

/* ---------- fases: e-mails ---------- */
const TOOLS=[["rem","Quem mandou?"],["link","Para onde o link leva?"],["att","O que tem no anexo?"],["auth","Cabeçalhos do e-mail"],["ctx","Registro interno"]];
function phaseStart(el,d){
 if(!DAYS.find(x=>x.id===d)||!phaseUnlocked(d))return nav("#/lab");
 const practice=phaseDone(d);
 const ans=((S.phase[d]||{}).ans)||{};
 const queue=shuf(dayEmails(d).filter(e=>practice||ans[e.id]===undefined));
 P={d,queue,i:0,practice,seen:{},answered:false,got:0};
 mailView(el);
}
function mailView(el){
 if(P.i>=P.queue.length)return phaseEnd(el);
 const e=P.queue[P.i];P.seen[e.id]=P.seen[e.id]||new Set();P.answered=false;
 el.innerHTML=`<button class="back" onclick="nav('#/lab')">← Voltar ao painel</button>
 <div class="tag">Dia ${P.d} · e-mail ${P.i+1} de ${P.queue.length}${P.practice?" · modo treino (sem pontos)":""}</div>
 <div class="mail"><div class="h">Canal: ${esc(e.ch)}<br>De: <b>${esc(e.n[0])}</b> &lt;${esc(e.n[1])}&gt;${e.sub?`<br>Assunto: <b>${esc(e.sub)}</b>`:""}</div>
 <div>${e.body}</div>
 ${e.link?`<div><span class="lk">${esc(e.link[0])}</span></div>`:""}
 ${e.att?`<div><span class="at">📎 ${esc(e.att)}</span></div>`:""}</div>
 <div class="tools" id="tools">${TOOLS.map(t=>`<button class="tool" data-k="${t[0]}">${t[1]}</button>`).join("")}</div>
 <ul class="finds" id="finds"></ul>
 <div class="decide" id="decide"><button data-c="report">🚩 Reportar (golpe)</button><button data-c="ok">✅ Aceitar (legítimo)</button><button data-c="idk">🤔 Não sei</button></div>
 <div id="fb"></div>`;
 const finds=$("#finds");
 const reveal=k=>{
  const txt={rem:e.rem,link:e.link?`Texto exibido: “${e.link[0]}”. Destino real: <b>${esc(e.link[1])}</b>`:"Esta mensagem não tem link.",att:e.att?`Arquivo: <b>${esc(e.att)}</b>${/\.(exe|scr|bat|js)$/i.test(e.att)?" — é um programa executável.":""}`:"Esta mensagem não tem anexo.",auth:e.auth,ctx:e.ctx}[k];
  const label=TOOLS.find(t=>t[0]===k)[1];
  finds.insertAdjacentHTML("beforeend",`<li><b>${label}</b><br>${k==="rem"?esc(txt):k==="auth"||k==="ctx"?esc(txt):txt}</li>`)};
 document.querySelectorAll("#tools .tool").forEach(b=>b.onclick=()=>{
  const k=b.dataset.k;if(P.seen[e.id].has(k))return;P.seen[e.id].add(k);b.classList.add("used");reveal(k);
  if(!P.practice){S.tools[e.id]=P.seen[e.id].size;save()}});
 document.querySelectorAll("#decide button").forEach(b=>b.onclick=()=>decide(e,b.dataset.c));
}
function decide(e,c){
 if(P.answered)return;P.answered=true;
 document.querySelectorAll("#decide button").forEach(b=>b.disabled=true);
 const right=(c==="report"&&e.scam)||(c==="ok"&&!e.scam);
 const pts=right?100*P.d:0;
 if(!P.practice){S.phase[P.d]=S.phase[P.d]||{ans:{}};S.phase[P.d].ans[e.id]=pts;save();hud()}
 P.got+=pts;
 const cls=right?"ok":c==="idk"?"mid":"bad";
 const head=right?`Acertou! +${pts} pontos.`:c==="idk"?"“Não sei” é uma resposta honesta: na dúvida, pergunte em vez de clicar. 0 pontos.":"Não foi dessa vez. 0 pontos, e nada é descontado.";
 $("#fb").innerHTML=`<div class="fb ${cls}"><b>${head}</b><br>Era: <b>${e.scam?"golpe":"mensagem legítima"}</b>. ${esc(e.why)}<div class="btns"><button class="btn" id="nx">${P.i+1<P.queue.length?"Próximo e-mail →":"Concluir o dia"}</button></div></div>`;
 $("#nx").onclick=()=>{P.i++;mailView($("#app"))};$("#nx").focus();
}
function phaseEnd(el){
 const d=P.d;hud();
 el.innerHTML=`<h1>Dia ${d} <span>concluído</span></h1><div class="card"><div class="big">${P.practice?"—":P.got}</div><p class="lead">${P.practice?"Treino concluído. Em treino não há pontos novos.":`pontos ganhos agora · total do dia: ${phasePts(d)}/${dayMax(d)}`}</p>
 <div class="btns">${d<5?`<button class="btn" onclick="nav('#/fase/${d+1}')">Ir para o Dia ${d+1} →</button>`:""}<button class="btn alt" onclick="nav('#/lab')">Painel</button></div></div>`;
}

/* ---------- minijogos ---------- */
function bank(k,v){S.mini[k]=Math.max(S.mini[k]||0,v);save();hud()}
function mini(el,k){
 if(!MINI[k])return nav("#/lab");
 ({caca,quiz,dados,inc,senha})[k](el);
}
function endCard(el,k,score,extra){
 bank(k,score);
 el.innerHTML=`<h1>${MINI[k].t} <span>concluído</span></h1><div class="card"><div class="big">${score}/${MINI[k].max}</div><p class="lead">${extra||""} Sua melhor pontuação conta no XP (${S.mini[k]}).</p><div class="btns"><button class="btn" onclick="mini($('#app'),'${k}')">Jogar de novo</button><button class="btn alt" onclick="nav('#/lab')">Painel</button></div></div>`;
}
function caca(el){
 const q=shuf(CARDS);let i=0,sc=0,hit=0;
 const show=()=>{
  if(i>=q.length)return endCard(el,"caca",sc,`${hit} de ${q.length} corretas.`);
  const c=q[i];
  el.innerHTML=`<button class="back" onclick="nav('#/lab')">← Painel</button><div class="tag">Caça-Golpe · ${i+1} de ${q.length}</div>
  <div class="card"><p style="font-size:20px;color:#fff;margin:0">${esc(c.t)}</p><div class="decide" style="grid-template-columns:1fr 1fr" id="dc"><button data-c="1">🚩 Golpe</button><button data-c="0">✅ Legítima</button></div><div id="fb"></div></div>`;
  document.querySelectorAll("#dc button").forEach(b=>b.onclick=()=>{
   document.querySelectorAll("#dc button").forEach(x=>x.disabled=true);
   const ok=(b.dataset.c==="1")===c.scam;if(ok){sc+=40;hit++}
   $("#fb").innerHTML=`<div class="fb ${ok?"ok":"bad"}"><b>${ok?"Acertou! +40":"Errou. 0 pontos."}</b> Era ${c.scam?"golpe":"legítima"}. ${esc(c.why)}<div class="btns"><button class="btn" id="nx">Próxima →</button></div></div>`;
   $("#nx").onclick=()=>{i++;show()};$("#nx").focus()})};
 show();
}
function quiz(el){
 const q=shuf(LIVEQ).slice(0,12).map(x=>{const o=x.o.map((t,j)=>({t,r:j===x.a}));return {q:x.q,o:shuf(o),w:x.w}});let i=0,sc=0,hit=0;
 const show=()=>{
  if(i>=q.length)return endCard(el,"quiz",sc,`${hit} de ${q.length} corretas.`);
  const c=q[i];
  el.innerHTML=`<button class="back" onclick="nav('#/lab')">← Painel</button><div class="tag">Quiz · ${i+1} de ${q.length}</div>
  <div class="card"><p style="font-size:19px;color:#fff;margin:0 0 6px">${esc(c.q)}</p>${c.o.map((o,j)=>`<button class="opt" data-j="${j}">${esc(o.t)}</button>`).join("")}<div id="fb"></div></div>`;
  document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
   const j=+b.dataset.j,ok=c.o[j].r;if(ok){sc+=100;hit++}
   document.querySelectorAll(".opt").forEach((x,k)=>{x.disabled=true;if(c.o[k].r)x.classList.add("ok");else if(k===j)x.classList.add("bad")});
   $("#fb").innerHTML=`<div class="fb ${ok?"ok":"bad"}"><b>${ok?"Correto! +100":"Não é essa."}</b> ${esc(c.w)}<div class="btns"><button class="btn" id="nx">Próxima →</button></div></div>`;
   $("#nx").onclick=()=>{i++;show()};$("#nx").focus()})};
 show();
}
function dados(el){
 const zn=["Dado pessoal","Dado pessoal sensível","Não é dado pessoal"];let sel=null,place={};
 const draw=()=>{
  el.innerHTML=`<button class="back" onclick="nav('#/lab')">← Painel</button><h1>Dados e <span>LGPD</span></h1><p class="lead">Escolha um dado e toque na caixa onde ele se encaixa (LGPD, art. 5º).</p>
  <div class="card"><div class="chips">${DATA_ITEMS.map((it,i)=>place[i]===undefined?`<button class="chip ${sel===i?"sel":""}" data-i="${i}">${esc(it[0])}</button>`:"").join("")||'<span class="lead">Todos classificados. Toque em Verificar.</span>'}</div>
  <div class="zones">${zn.map((z,k)=>`<div class="zone" data-z="${k}"><h4>${z}</h4>${DATA_ITEMS.map((it,i)=>place[i]===k?`<button class="chip" data-r="${i}">${esc(it[0])}</button>`:"").join(" ")}</div>`).join("")}</div>
  <div class="btns"><button class="btn" id="vf">Verificar</button><button class="btn alt" id="rs">Reiniciar</button></div><div id="fb"></div></div>`;
  document.querySelectorAll(".chip[data-i]").forEach(b=>b.onclick=()=>{sel=+b.dataset.i;draw()});
  document.querySelectorAll(".chip[data-r]").forEach(b=>b.onclick=ev=>{ev.stopPropagation();delete place[+b.dataset.r];draw()});
  document.querySelectorAll(".zone").forEach(z=>z.onclick=()=>{if(sel===null)return;place[sel]=+z.dataset.z;sel=null;draw()});
  $("#rs").onclick=()=>{sel=null;place={};draw()};
  $("#vf").onclick=()=>{
   if(Object.keys(place).length<DATA_ITEMS.length){$("#fb").innerHTML='<div class="fb bad">Classifique todos os itens primeiro.</div>';return}
   let ok=0,errs=[];DATA_ITEMS.forEach((it,i)=>{if(place[i]===it[1])ok++;else errs.push(`<b>${esc(it[0])}</b> → ${zn[it[1]]}`)});
   bank("dados",ok*50);
   $("#fb").innerHTML=`<div class="fb ${ok===10?"ok":"bad"}"><b>${ok}/10 corretos (+${ok*50} XP).</b> ${errs.length?"Revise: "+errs.join("; ")+".":"Perfeito!"}<div class="btns"><button class="btn" onclick="nav('#/lab')">Painel</button></div></div>`}};
 draw();
}
function inc(el){
 const q=shuf(SCENARIOS).map(x=>({q:x.q,w:x.w,o:shuf(x.o.map((t,j)=>({t,r:j===x.a})))}));let i=0,sc=0,hit=0;
 const show=()=>{
  if(i>=q.length)return endCard(el,"inc",sc,`${hit} de ${q.length} decisões corretas.`);
  const c=q[i];
  el.innerHTML=`<button class="back" onclick="nav('#/lab')">← Painel</button><div class="tag">Incidente ${i+1} de ${q.length}</div>
  <div class="card"><p style="font-size:19px;color:#fff;margin:0 0 6px">${esc(c.q)}</p>${c.o.map((o,j)=>`<button class="opt" data-j="${j}">${esc(o.t)}</button>`).join("")}<div id="fb"></div></div>`;
  document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
   const j=+b.dataset.j,ok=c.o[j].r;if(ok){sc+=100;hit++}
   document.querySelectorAll(".opt").forEach((x,k)=>{x.disabled=true;if(c.o[k].r)x.classList.add("ok");else if(k===j)x.classList.add("bad")});
   $("#fb").innerHTML=`<div class="fb ${ok?"ok":"bad"}"><b>${ok?"Boa decisão! +100":"Não é a melhor ação."}</b> ${esc(c.w)}<div class="btns"><button class="btn" id="nx">Continuar →</button></div></div>`;
   $("#nx").onclick=()=>{i++;show()};$("#nx").focus()})};
 show();
}
const COMMON=["123456","password","senha","qwerty","abc123","111111","12345678","admin","brasil","fiap","letmein","iloveyou","atlantica"];
function senha(el){
 el.innerHTML=`<button class="back" onclick="nav('#/lab')">← Painel</button><h1>Senha <span>forte</span></h1><p class="lead">Digite uma senha <b>de teste</b> (nunca a que você realmente usa). Nada é enviado ou salvo.</p>
 <div class="card"><input type="password" id="pw" placeholder="Digite uma senha de teste" autocomplete="off"><label class="l"><input type="checkbox" id="sh"> mostrar</label>
 <div class="meter"><i id="mt" style="width:0;background:var(--bad)"></i></div><div id="pr" class="lead">Digite para avaliar.</div><ul id="tp" class="lead"></ul>
 <div class="fb ok">💡 Exemplo: <b>cafe-azul-bicicleta-chuva-17</b>. Longa, fácil de lembrar e difícil de adivinhar. Use um gerenciador de senhas e MFA.</div>
 <div class="btns"><button class="btn" id="ok" disabled>Concluir (precisa de 70%)</button></div></div>`;
 const pw=$("#pw");$("#sh").onchange=e=>pw.type=e.target.checked?"text":"password";
 pw.oninput=()=>{const v=pw.value,l=v.toLowerCase();let s=0,t=[];
  if(v.length>=12)s+=35;else t.push("Use pelo menos 12 caracteres (o comprimento é o que mais importa)");
  if(v.length>=16)s+=15;
  if(/[a-z]/.test(v)&&/[A-Z]/.test(v))s+=10;else t.push("Misture maiúsculas e minúsculas");
  if(/\d/.test(v))s+=10;else t.push("Inclua números");
  if(/[^A-Za-z0-9]/.test(v))s+=10;else t.push("Inclua separadores ou símbolos (-, _)");
  if(/(.)\1{2,}/.test(v)||/(012|123|234|345|456|567|678|789|abc|qwe)/i.test(v)){s-=20;t.push("Evite repetições e sequências")}
  if(COMMON.some(c=>l.includes(c))){s-=40;t.push("Contém palavra ou senha muito comum")}
  if(v.split(/[\s\-_.]+/).length>=4)s+=20;
  s=v?Math.max(0,Math.min(100,s)):0;
  $("#mt").style.width=s+"%";$("#mt").style.background=s<40?"#ff4d4d":s<70?"#ffb020":"#2ee59d";
  $("#pr").textContent=v?`Força: ${s}% (${s<40?"fraca":s<70?"média":"forte"})`:"Digite para avaliar.";
  $("#tp").innerHTML=t.map(x=>"<li>"+esc(x)+"</li>").join("");$("#ok").disabled=s<70};
 $("#ok").onclick=()=>{pw.value="";endCard(el,"senha",100,"Você montou uma senha forte.")};
}

/* ---------- checklist ---------- */
function checklist(el){
 let k=0;
 el.innerHTML=`<button class="back" onclick="nav('#/lab')">← Painel</button><h1>Seu <span>checklist</span></h1><p class="lead">Marque o que você já faz ou se compromete a fazer a partir de amanhã. Cada item vale 10 XP.</p>
 <div class="card"><div class="logo"><b>CyberGuard FIAP · Checklist de Segurança Digital, Privacidade e Conformidade</b></div>
 <div class="lead">${esc(S.name)}${S.group?" · Grupo "+esc(S.group):""} · ${new Date().toLocaleDateString("pt-BR")}</div>
 ${CHECKLIST.map(g=>`<div class="grp">${g[0]}</div>`+g[1].map(t=>{const id=k++;return `<label class="ck"><input type="checkbox" data-id="${id}" ${S.ck[id]?"checked":""}><span>${esc(t)}</span></label>`}).join("")).join("")}
 <label class="l">Meu compromisso nº 1</label><input type="text" id="cm" maxlength="90" placeholder="Ex.: ativar MFA no e-mail hoje" value="${esc(S.commit||"")}"></div>
 <div class="btns"><button class="btn" onclick="window.print()">🖨 Imprimir / Salvar PDF</button><button class="btn alt" onclick="nav('#/resultado')">Ver meu resultado →</button></div>`;
 document.querySelectorAll(".ck input").forEach(c=>c.onchange=()=>{S.ck[c.dataset.id]=c.checked;save();hud()});
 $("#cm").oninput=e=>{S.commit=e.target.value;save()};
}

/* ---------- resultado, código e placar ---------- */
const encodeCode=o=>"CG1."+btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const decodeCode=s=>{try{const m=s.trim().match(/CG1\.[A-Za-z0-9+/=]+/);if(!m)return null;const o=JSON.parse(decodeURIComponent(escape(atob(m[0].slice(4)))));return typeof o.s==="number"&&o.n?o:null}catch(e){return null}};
function myCode(){return encodeCode({n:S.name,g:S.group||"-",s:xp(),l:level(),d:DAYS.filter(d=>phaseDone(d.id)).length,b:Object.values(badges()).filter(Boolean).length})}
function result(el){
 const pc=Math.round(xp()/maxXp()*100),bg=badges();
 const title=pc>=85?"🛡 Guardião(ã) CyberGuard":pc>=60?"🔐 Defensor(a) em formação":"🎯 Aprendiz — revise e refaça!";
 el.innerHTML=`<button class="back" onclick="nav('#/lab')">← Painel</button><h1>Seu <span>resultado</span></h1>
 <div class="card row"><div><div class="big">${pc}%</div><div class="lead">${xp()} de ${maxXp()} XP · Nível ${level()}</div><h3>${title}</h3><div>${esc(S.name)}${S.group?" · Grupo "+esc(S.group):""}</div></div>
 <div>${DAYS.map(d=>`<div>Dia ${d.id}: <b>${phasePts(d.id)}/${dayMax(d.id)}</b></div>`).join("")}${Object.entries(MINI).map(([k,m])=>`<div>${m.t}: <b>${S.mini[k]||0}/${m.max}</b></div>`).join("")}<div>Checklist: <b>${ckPts()}/120</b></div></div></div>
 <div class="badges">${BADGES.map(b=>`<div class="badge ${bg[b[0]]?"got":""}"><b>${b[1]}</b>${b[2]}</div>`).join("")}</div>
 <h2>Código para o <span>placar da turma</span></h2><p class="lead">Copie o código e envie ao facilitador (chat ou formulário). Ele aparece no placar do projetor.</p>
 <code class="cd" id="cd">${myCode()}</code>
 <div class="btns"><button class="btn" id="cp">Copiar código</button><button class="btn alt" onclick="window.print()">🖨 Imprimir resultado</button><button class="btn alt" id="rs">Reiniciar tudo</button></div>
 <div class="card"><b>Lembre-se:</b> na dúvida, <b>pare, desconfie, confirme por outro canal e reporte</b> à TI e ao Encarregado (DPO).</div>`;
 $("#cp").onclick=async()=>{try{await navigator.clipboard.writeText(myCode());$("#cp").textContent="Copiado ✓"}catch(e){const r=document.createRange();r.selectNodeContents($("#cd"));const s=getSelection();s.removeAllRanges();s.addRange(r);$("#cp").textContent="Selecionado: copie com Ctrl+C"}};
 $("#rs").onclick=()=>{if(confirm("Apagar todo o seu progresso neste navegador?")){try{localStorage.removeItem(KEY)}catch(e){}location.hash="#/";location.reload()}};
}
render();
