/* Laboratório do professor: validar as atividades com a turma na tela.
   Mostra cada atividade (e-mails, Caça-Golpe, quiz, LGPD, incidentes) e revela a resposta passo a passo.
   Exclusivo do professor. Rota: #/validar  (setas ← → navegam, Espaço revela) */
function vItems(){
 const L=[];
 DAYS.forEach(d=>EMAILS.filter(e=>e.day===d.id).forEach((e,i)=>L.push({sec:"Dia "+d.id+" · "+d.title,k:"email",e,n:i+1,of:4,key:"fase"+d.id})));
 CARDS.forEach((c,i)=>L.push({sec:"Caça-Golpe",k:"card",c,n:i+1,of:CARDS.length,key:"caca"}));
 LIVEQ.forEach((q,i)=>L.push({sec:"Quiz · "+q.cat,k:"quiz",q,n:i+1,of:LIVEQ.length,key:"quiz"}));
 L.push({sec:"Dados e LGPD",k:"dados",key:"dados",n:1,of:1});
 SCENARIOS.forEach((s,i)=>L.push({sec:"Incidentes",k:"inc",s,n:i+1,of:SCENARIOS.length,key:"inc"}));
 L.push({sec:"Senha forte",k:"senha",key:"senha",n:1,of:1});
 L.push({sec:"Checklist",k:"check",key:"check",n:1,of:1});
 return L;
}
let VI=0,VR=false,VT={};
function validar(el,idx){
 const items=vItems();
 VI=Math.max(0,Math.min(items.length-1,parseInt(idx)||0));
 VR=false;VT={};
 vdraw(el,items);
}
function vSections(items){const s=[];items.forEach((it,i)=>{const key=it.key;if(!s.length||s[s.length-1].key!==key)s.push({key,label:it.key.startsWith("fase")?"Fase "+it.key.slice(4):({caca:"Caça-Golpe",quiz:"Quiz",dados:"Dados LGPD",inc:"Incidentes",senha:"Senha",check:"Checklist"})[key],i})});return s}
function vdraw(el,items){
 const it=items[VI],secs=vSections(items),cur=secs.filter(s=>s.i<=VI).pop();
 let body="";
 if(it.k==="email"){
  const e=it.e;
  body=`<div class="mail"><div class="h">Canal: ${esc(e.ch)}<br>De: <b>${esc(e.n[0])}</b> &lt;${esc(e.n[1])}&gt;${e.sub?`<br>Assunto: <b>${esc(e.sub)}</b>`:""}</div><div style="font-size:clamp(16px,1.9vw,22px)">${e.body}</div>${e.link?`<div><span class="lk">${esc(e.link[0])}</span></div>`:""}${e.att?`<div><span class="at">📎 ${esc(e.att)}</span></div>`:""}</div>
  <div class="tools">${TOOLS.map(t=>`<button class="tool ${VT[t[0]]||VR?"used":""}" data-t="${t[0]}">${t[1]}</button>`).join("")}</div>
  <ul class="finds">${TOOLS.filter(t=>VT[t[0]]||VR).map(t=>{const k=t[0];const txt={rem:esc(e.rem),link:e.link?`Texto exibido: “${esc(e.link[0])}”. Destino real: <b>${esc(e.link[1])}</b>`:"Esta mensagem não tem link.",att:e.att?`Arquivo: <b>${esc(e.att)}</b>`:"Esta mensagem não tem anexo.",auth:esc(e.auth),ctx:esc(e.ctx)}[k];return `<li><b>${t[1]}</b><br>${txt}</li>`}).join("")}</ul>
  ${VR?`<div class="fb ${e.scam?"bad":"ok"}" style="font-size:clamp(16px,1.9vw,22px)"><b>Resposta: ${e.scam?"🚩 GOLPE (reportar)":"✅ LEGÍTIMO (aceitar)"}</b><br>${esc(e.why)}</div>`:""}`;
 }else if(it.k==="card"){
  body=`<p style="font-size:clamp(22px,3vw,34px);font-weight:700;margin:10px 0">${esc(it.c.t)}</p>${VR?`<div class="fb ${it.c.scam?"bad":"ok"}" style="font-size:clamp(16px,1.9vw,22px)"><b>Resposta: ${it.c.scam?"🚩 GOLPE":"✅ LEGÍTIMA"}</b><br>${esc(it.c.why)}</div>`:""}`;
 }else if(it.k==="quiz"){
  const q=it.q;
  body=`<p style="font-size:clamp(22px,3vw,34px);font-weight:700;margin:10px 0">${esc(q.q)}</p>${q.o.map((o,j)=>`<div style="padding:12px 14px;margin:8px 0;border-radius:10px;font-size:clamp(16px,2vw,24px);border:2px solid ${VR&&j===q.a?"var(--ok)":"#333"};background:${VR&&j===q.a?"rgba(46,229,157,.15)":"#151515"};opacity:${VR&&j!==q.a?.5:1}"><b style="color:var(--neon)">${"ABCD"[j]}</b> &nbsp;${esc(o)}</div>`).join("")}${VR?`<div class="fb ok" style="font-size:clamp(16px,1.9vw,22px)"><b>Resposta: ${"ABCD"[q.a]}.</b> ${esc(q.w)}</div>`:""}`;
 }else if(it.k==="dados"){
  const zn=["Dado pessoal","Dado pessoal sensível","Não é dado pessoal"];
  body=`<p class="lead">Classifique cada item. ${VR?"":"Clique em Revelar para ver o gabarito."}</p><div class="zones">${zn.map((z,k)=>`<div class="zone" style="cursor:default"><h4>${z}</h4>${DATA_ITEMS.map(d=>(VR&&d[1]===k)?`<div class="chip ok" style="margin:3px 0">${esc(d[0])}</div>`:"").join("")}</div>`).join("")}</div>${VR?"":`<div class="chips" style="margin-top:12px">${DATA_ITEMS.map(d=>`<span class="chip">${esc(d[0])}</span>`).join("")}</div>`}${VR?`<div class="fb mid">CPF e salário são pessoais, não sensíveis. Confidencial não é o mesmo que sensível. Biometria que identifica a pessoa é sensível.</div>`:""}`;
 }else if(it.k==="inc"){
  const s=it.s;
  body=`<p style="font-size:clamp(20px,2.6vw,30px);font-weight:700;margin:10px 0">${esc(s.q)}</p>${s.o.map((o,j)=>`<div style="padding:12px 14px;margin:8px 0;border-radius:10px;font-size:clamp(16px,2vw,24px);border:2px solid ${VR&&j===s.a?"var(--ok)":"#333"};background:${VR&&j===s.a?"rgba(46,229,157,.15)":"#151515"};opacity:${VR&&j!==s.a?.5:1}"><b style="color:var(--neon)">${"ABC"[j]}</b> &nbsp;${esc(o)}</div>`).join("")}${VR?`<div class="fb ok"><b>Melhor ação: ${"ABC"[s.a]}.</b> ${esc(s.w)}</div>`:""}`;
 }else if(it.k==="senha"){
  body=`<ul style="font-size:clamp(18px,2.2vw,26px);line-height:1.6"><li>Comprimento vale mais que símbolos (12+ caracteres).</li><li>Frase de 4 palavras e única por serviço. Ex.: <b>cafe-azul-bicicleta-chuva-17</b></li><li>Evite sequências, repetições e palavras comuns.</li>${VR?"<li>Gerenciador de senhas + MFA. Nunca compartilhe código MFA.</li><li>Pontuação: o minijogo vale 100 pontos com pelo menos 70% de força.</li>":""}</ul>`;
 }else{
  body=`<p class="lead">12 itens em 5 grupos. Cada item marcado vale 10 pontos (máximo 120).</p>${CHECKLIST.map(g=>`<div class="grp">${esc(g[0])}</div>${g[1].map(t=>`<div style="padding:4px 0;font-size:clamp(15px,1.8vw,20px)">☐ ${esc(t)}</div>`).join("")}`).join("")}`;
 }
 el.innerHTML=`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="tag">Validação · ${esc(it.sec)} · ${it.n}/${it.of} · item ${VI+1} de ${items.length}</span><button class="btn sm alt" style="margin-left:auto" id="fs">Tela cheia</button></div>
 <div class="chips" style="margin:8px 0">${secs.map(s=>`<button class="chip ${s===cur?"sel":""}" data-i="${s.i}">${esc(s.label)}</button>`).join("")}</div>
 <div class="meter"><i style="width:${(VI+1)/items.length*100}%"></i></div>
 ${body}
 <div class="btns"><button class="btn alt" id="pv" ${VI?"":"disabled"}>← Anterior</button><button class="btn" id="rv">${VR?"Ocultar resposta":"Revelar resposta"}</button><button class="btn alt" id="nx" ${VI<items.length-1?"":"disabled"}>Próxima →</button></div>
 <p class="lead" style="font-size:12px;margin-top:10px">Atalhos: ← → navegam · Espaço revela ou oculta.</p>`;
 el.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{VT[b.dataset.t]=!VT[b.dataset.t];vdraw(el,items)});
 el.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{nav("#/validar/"+b.dataset.i)});
 $("#rv").onclick=()=>{VR=!VR;vdraw(el,items)};
 $("#pv").onclick=()=>nav("#/validar/"+(VI-1));
 $("#nx").onclick=()=>nav("#/validar/"+(VI+1));
 $("#fs").onclick=()=>{document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()};
}
addEventListener("keydown",e=>{
 if(!/^#\/validar/.test(location.hash)||!isProf())return;
 if(/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||""))return;
 if(e.key==="ArrowRight")nav("#/validar/"+(VI+1));
 else if(e.key==="ArrowLeft"&&VI>0)nav("#/validar/"+(VI-1));
 else if(e.key===" "){e.preventDefault();const b=$("#rv");b&&b.click()}
});
