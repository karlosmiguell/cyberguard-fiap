/* Papéis e acompanhamento ao vivo.
   - Aluno: um representante por grupo cadastra e joga; os demais só acompanham (somente leitura).
   - Professor: PIN no navegador; vê todas as telas e acompanha os grupos.
   O espelho usa WebRTC (PeerJS): o representante envia o HTML da tela, sem servidor próprio. */
const PROF_HASH="a06ec69376ac3f59cfc7ded307f006016e2dcb06e3642056c5668bd4ddf47a8d";
const isProf=()=>{try{return localStorage.getItem("cgProf")==="1"}catch(e){return false}};
const slug=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,30);
const sha256=async t=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,"0")).join("");

/* ---------- PIN do professor ---------- */
function profLogin(el){
 if(isProf()){el.innerHTML=`<h1>Modo <span>professor</span> ativo</h1><p class="lead">Você tem acesso a todas as telas pela barra no topo.</p><div class="btns"><button class="btn" onclick="nav('#/')">Ir para o início</button><button class="btn alt" id="out">Sair do modo professor</button></div>`;
  $("#out").onclick=()=>{try{localStorage.removeItem("cgProf")}catch(e){}render()};return}
 el.innerHTML=`<h1>Área do <span>professor</span></h1><p class="lead">Digite o PIN para liberar todas as telas.</p><div class="card"><input type="password" id="pin" placeholder="PIN" autocomplete="off"><div class="btns"><button class="btn" id="ok">Entrar</button></div><div id="fb"></div></div>`;
 const go=async()=>{const h=await sha256($("#pin").value.trim());if(h===PROF_HASH){try{localStorage.setItem("cgProf","1")}catch(e){}nav("#/prof");render()}else $("#fb").innerHTML='<div class="fb bad">PIN incorreto.</div>'};
 $("#ok").onclick=go;$("#pin").addEventListener("keydown",e=>{if(e.key==="Enter")go()});$("#pin").focus();
}
function profGate(el){
 el.innerHTML=`<h1>Área <span>do professor</span></h1><div class="card"><p>Esta tela é exclusiva do professor.</p><div class="btns"><button class="btn" onclick="nav('#/')">Voltar ao início</button></div></div>`;
}
function ptool(){
 const t=$("#ptool");if(!t)return;
 if(!isProf()){t.innerHTML="";t.style.display="none";return}
 const L=[["Competição","#/"],["Como funciona","#/competicao"],["Placar","#/placar"],["Acompanhar grupos","#/grupos"],["Gabaritos","#/temas"],["Roteiro por tema","#/aula/0"],["Quiz ao vivo","#/professor"],["Sair","#/prof"]];
 t.style.display="flex";t.innerHTML='<span class="tag">Professor</span>'+L.map(l=>`<a href="${l[1]}">${l[0]}</a>`).join("");
}

/* ---------- espelho: lado do representante ---------- */
let LP=null,LC=[],LAST="",LSTAT="";
function snap(){
 return JSON.stringify({h:location.hash,hud:($("#hud")||{}).innerHTML||"",html:($("#app")||{}).innerHTML||"",
  meta:{g:S.group,n:S.name,xp:xp(),cs:S.cs||null,ce:S.ce||null,tag:(($("#app .tag")||{}).textContent||"").slice(0,80),ts:Date.now()}});
}
function pushSnap(){
 const s=snap();if(s===LAST)return;LAST=s;LC=LC.filter(c=>c.open);LC.forEach(c=>{try{c.send(s)}catch(e){}});
}
function liveStatus(m){LSTAT=m;const b=$("#livebadge");if(b)b.textContent=m}
function liveHost(tries){
 if(!window.Peer||!S.group||LP)return;
 tries=tries||0;
 try{LP=new Peer("cgfiap-"+slug(S.group))}catch(e){liveStatus("Sem acompanhamento ao vivo");return}
 LP.on("open",()=>liveStatus("Acompanhamento ao vivo ativo"));
 LP.on("connection",c=>{LC.push(c);c.on("open",()=>{try{c.send(snap())}catch(e){}});c.on("data",()=>{})});
 LP.on("error",e=>{
  if(e.type==="unavailable-id"){try{LP.destroy()}catch(x){}LP=null;if(tries<6)setTimeout(()=>liveHost(tries+1),4000);else liveStatus("Nome de grupo já em uso por outro dispositivo")}
  else if(e.type==="network"||e.type==="server-error"||e.type==="socket-error")liveStatus("Sem conexão para acompanhamento ao vivo")});
 LP.on("disconnected",()=>{try{LP.reconnect()}catch(e){}});
}
function liveStart(){
 const app=$("#app");if(!app)return;
 let tm=null;new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(pushSnap,400)}).observe(app,{childList:true,subtree:true,characterData:true,attributes:true});
 setInterval(pushSnap,2500);
 if(S.group)liveHost();
}

/* ---------- espelho: lado de quem acompanha ---------- */
function cleanHtml(h){
 const d=new DOMParser().parseFromString(String(h),"text/html");
 d.querySelectorAll("script,iframe,object,embed,link,meta,style,form,base").forEach(n=>n.remove());
 d.querySelectorAll("*").forEach(n=>{[...n.attributes].forEach(a=>{
  if(/^on/i.test(a.name)||a.name==="id"||a.name==="style"||a.name==="srcdoc"||/^\s*(javascript|data):/i.test(a.value))n.removeAttribute(a.name);
  if(a.name==="href")n.removeAttribute("href")})});
 return d.body.innerHTML;
}
let FP=null;
function peerAnon(){if(FP&&!FP.destroyed)return FP;FP=new Peer();return FP}
function mirrorTo(box,statusEl,group,onMeta){
 if(!window.Peer){statusEl.textContent="Biblioteca de conexão indisponível (verifique a internet).";return null}
 const p=peerAnon();let got=false,conn=null,retry=null;
 const connect=()=>{
  statusEl.textContent="Conectando ao grupo “"+group+"”…";
  conn=p.connect("cgfiap-"+slug(group),{reliable:true});
  const to=setTimeout(()=>{if(!got)statusEl.textContent="Não encontrei o grupo “"+group+"”. Confira o nome exato e se o representante já se cadastrou."},9000);
  conn.on("data",s=>{try{const d=JSON.parse(s);got=true;clearTimeout(to);statusEl.textContent="Acompanhando ao vivo · somente leitura";box.innerHTML=cleanHtml(d.html);if(onMeta)onMeta(d.meta,d)}catch(e){}});
  conn.on("close",()=>{statusEl.textContent="Conexão encerrada. Tentando reconectar…";retry=setTimeout(connect,4000)});
  conn.on("error",()=>{statusEl.textContent="Falha na conexão. Tentando novamente…";retry=setTimeout(connect,5000)});
 };
 const start=()=>connect();if(p.open)start();else p.on("open",start);
 p.on("error",e=>{if(e.type==="peer-unavailable"){statusEl.textContent="Grupo “"+group+"” não encontrado. Confira o nome e se o representante já se cadastrou."}});
 return {close:()=>{clearTimeout(retry);try{conn&&conn.close()}catch(e){}}};
}
let CUR=null;
function acompanhar(el){
 if(CUR){CUR.close();CUR=null}
 const last=(()=>{try{return localStorage.getItem("cgFollow")||""}catch(e){return ""}})();
 el.innerHTML=`<button class="back" onclick="nav('#/')">← Início</button><h1>Acompanhar um <span>grupo</span></h1>
 <p class="lead">Digite o <b>mesmo nome de grupo</b> que o representante cadastrou. Você verá a tela dele ao vivo, sem poder editar nada.</p>
 <div class="card"><label class="l" for="gn">Nome do grupo</label><input type="text" id="gn" maxlength="30" value="${esc(last)}" placeholder="Ex.: Os Guardiões"><div class="btns"><button class="btn" id="go">Acompanhar</button></div></div>
 <div id="st" class="lead"></div><div class="banner" id="bn" style="display:none">👀 Somente leitura</div><div id="mirror" class="mirror"></div>`;
 const go=()=>{const g=$("#gn").value.trim();if(!g)return;try{localStorage.setItem("cgFollow",g)}catch(e){}
  if(CUR)CUR.close();$("#bn").style.display="block";$("#bn").textContent="👀 Somente leitura · Grupo “"+g+"”";CUR=mirrorTo($("#mirror"),$("#st"),g)};
 $("#go").onclick=go;$("#gn").addEventListener("keydown",e=>{if(e.key==="Enter")go()});
 if(last&&location.hash.indexOf("auto")>-1)go();
}

/* ---------- professor: acompanhar vários grupos ---------- */
let GM={};
function grupos(el){
 Object.values(GM).forEach(m=>m.close());GM={};
 let list=[];try{list=JSON.parse(localStorage.getItem("cgGroups")||"[]")}catch(e){}
 const saveL=()=>{try{localStorage.setItem("cgGroups",JSON.stringify(list))}catch(e){}};
 const draw=()=>{
  el.innerHTML=`<h1>Acompanhar <span>grupos</span></h1><p class="lead">Adicione os nomes dos grupos cadastrados. Cada cartão mostra o andamento ao vivo, e você pode abrir a tela completa do grupo.</p>
  <div class="card"><label class="l" for="ng">Nome do grupo</label><input type="text" id="ng" maxlength="30" placeholder="Nome exato cadastrado pelo representante"><div class="btns"><button class="btn" id="ad">Adicionar</button></div></div>
  <div class="grid" id="gl">${list.map(g=>`<div class="card" data-g="${esc(g)}"><span class="tag">${esc(g)}</span><h3 data-r="n">—</h3><p data-r="s">Conectando…</p><div class="btns"><button class="btn sm alt" data-o="${esc(g)}">Abrir tela</button><button class="btn sm alt" data-x="${esc(g)}">Remover</button></div></div>`).join("")}</div>
  <div class="banner" id="bn2" style="display:none"></div><div id="st2" class="lead"></div><div id="mirror2" class="mirror"></div>`;
  $("#ad").onclick=()=>{const g=$("#ng").value.trim();if(g&&!list.includes(g)){list.push(g);saveL();draw()}};
  document.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{list=list.filter(x=>x!==b.dataset.x);saveL();draw()});
  document.querySelectorAll("[data-o]").forEach(b=>b.onclick=()=>{const g=b.dataset.o;Object.values(GM).forEach(m=>{m.full=false});if(GM[g])GM[g].full=true;$("#bn2").style.display="block";$("#bn2").textContent="Tela do grupo “"+g+"” · somente leitura";if(GM[g]&&GM[g].last)$("#mirror2").innerHTML=cleanHtml(GM[g].last.html);scrollTo(0,document.body.scrollHeight)});
  list.forEach(g=>{
   const card=[...document.querySelectorAll("#gl .card")].find(c=>c.dataset.g===g);const hid=document.createElement("div");
   const m=mirrorTo(hid,{set textContent(t){const p=card&&card.querySelector('[data-r="s"]');if(p&&!(GM[g]&&GM[g].got))p.textContent=t}},g,(meta,d)=>{
    GM[g].got=true;GM[g].last=d;
    if(card){card.querySelector('[data-r="n"]').textContent=meta.n||"—";card.querySelector('[data-r="s"]').innerHTML=`${meta.ce?`✅ Entregue: <b>${meta.xp}</b> pts em ${fmtT((meta.ce-meta.cs)/1000)}`:meta.cs?`⏱ Em andamento: <b>${meta.xp}</b> pts · ${fmtT((meta.ts-meta.cs)/1000)}`:"Ainda não iniciou"}<br><span style="color:var(--mut)">${esc(meta.tag||"")}</span>`}
    if(GM[g].full)$("#mirror2").innerHTML=cleanHtml(d.html)});
   if(m){GM[g]=m;m.full=false;m.got=false}
  });
 };
 draw();
}
