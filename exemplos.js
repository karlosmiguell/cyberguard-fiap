/* Exemplos ao vivo do professor: situações DIFERENTES das da competição, para ensinar cada tipo de
   atividade antes de a turma começar. Não pontuam e não alteram o jogo. Rota: #/exemplos */
const OKX="SPF aprovado · DKIM aprovado · DMARC aprovado";
const EX=[
 {k:"intro"},
 {k:"email",pts:100,scam:true,ch:"E-mail",n:["Administrador do E-mail","admin@horizonte-mail.example"],sub:"Sua caixa de entrada está 98% cheia",
  body:"Sua caixa de e-mail está quase cheia e você <b>deixará de receber mensagens hoje</b>. Clique para aumentar o espaço gratuitamente.",
  link:["Aumentar espaço","http://horizonte-quota.example/liberar"],att:null,
  rem:"O domínio horizonte-mail.example não é o da empresa (horizonte.example).",auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"A TI nunca avisa limite de caixa por mensagem externa. Domínio criado há 3 dias.",
  why:"Ameaça de perder acesso hoje + link para domínio estranho. Esse é o jeito mais comum de roubar senhas."},
 {k:"email",pts:100,scam:false,ch:"E-mail",n:["TI Horizonte","ti@horizonte.example"],sub:"Manutenção do sistema de ponto no sábado",
  body:"Informamos que o sistema de ponto ficará indisponível no sábado, das 8h às 12h, para manutenção programada. Nenhuma ação é necessária.",
  link:null,att:null,rem:"Endereço do domínio oficial da empresa.",auth:OKX,ctx:"A manutenção foi publicada no calendário de TI na semana passada.",
  why:"Domínio oficial, sem pedido de dados, sem link e já anunciada em outro canal. É rotina, e golpe nem sempre vem com cara de golpe."},
 {k:"email",pts:200,scam:true,ch:"E-mail",n:["Setor Fiscal","fiscal@horizonte-nfe.example"],sub:"Nota fiscal rejeitada: abra o anexo",
  body:"A nota fiscal 48212 foi rejeitada. Abra o anexo para corrigir os dados e evitar multa.",
  link:null,att:"NF_48212_rejeitada.html",rem:"O domínio horizonte-nfe.example não é o oficial. Nenhuma NF desse número consta no sistema.",auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"Arquivos .html anexados abrem uma página falsa de login no navegador.",
  why:"Anexo .html é um truque comum: abre uma tela de login falsa. Urgência com multa é pressão para você não conferir."},
 {k:"email",pts:300,scam:true,ch:"E-mail",n:["RH Horizonte","beneficios@horizonte-rh.example"],sub:"Atualize seus dados do benefício até hoje",
  body:"Para manter seu vale-alimentação, confirme <b>CPF, data de nascimento e dados bancários</b> neste formulário.",
  link:["Atualizar cadastro","https://forms-beneficios.example/horizonte"],att:null,rem:"O RH real usa rh@horizonte.example, não horizonte-rh.example.",auth:"SPF reprovado · DKIM reprovado · DMARC reprovado",ctx:"O RH não tem nenhuma campanha de atualização aberta e nunca pede dados bancários por link.",
  why:"Pede dados pessoais por link e com prazo curto. Conecta com a LGPD: só se coleta o mínimo, por canal oficial."},
 {k:"email",pts:300,scam:false,ch:"E-mail",n:["Helpdesk","helpdesk@horizonte.example"],sub:"Seu acesso à pasta Financeiro foi aprovado",
  body:"Seu pedido de acesso à pasta Financeiro (chamado #7310) foi aprovado pelo gestor. O acesso vale por 30 dias.",
  link:["Abrir pasta","https://arquivos.horizonte.example/financeiro"],att:null,rem:"Endereço do domínio oficial da empresa.",auth:OKX,ctx:"Você abriu o chamado #7310 ontem, com aprovação do gestor.",
  why:"Você pediu, o domínio é oficial e o acesso é temporário. Desconfiar de tudo também atrapalha: confira o contexto."},
 {k:"card",scam:true,t:"Seu plano de saúde vence hoje. Pague o boleto neste link para não perder a cobertura.",why:"Cobrança com prazo curto por link de mensagem. Confira no aplicativo ou site oficial."},
 {k:"card",scam:false,t:"Reunião da CIPA na sexta às 14h, convite no calendário corporativo.",why:"Canal oficial, sem link e sem pedido de dados."},
 {k:"card",scam:true,t:"Troque sua senha em 30 minutos ou perderá o acesso: clique aqui.",why:"Urgência artificial e link. Troca de senha se faz pelo portal que você já conhece."},
 {k:"quiz",q:"Em https://suporte.horizonte.example.cobranca.invalid/login, qual é o domínio verdadeiro?",o:["horizonte.example","suporte.horizonte.example","cobranca.invalid","login"],a:2,w:"O domínio real é o trecho final antes da primeira barra: cobranca.invalid. O restante é enfeite para enganar."},
 {k:"quiz",q:"Um atestado médico enviado ao RH é, na LGPD, um dado…",o:["Pessoal comum","Pessoal sensível (saúde)","Não pessoal","Público"],a:1,w:"Informação de saúde é dado sensível e exige cuidado reforçado."},
 {k:"quiz",q:"O que é \"vishing\"?",o:["Vírus de vídeo","Golpe por ligação de voz","Virtualização de servidores","Visualização de logs"],a:1,w:"É phishing por voz: ligação com urgência e pedido de código ou transferência. Desligue e ligue de volta pelo número oficial."},
 {k:"dados",items:[["Nome da mãe",0],["Tipo sanguíneo",1],["Placa do carro de um empregado",0],["Foto do crachá",0],["Faturamento anual da empresa",2],["Opinião política",1]]},
 {k:"inc",q:"Você enviou por engano o holerite de um colega ao grupo da equipe.",o:["Apagar a mensagem e fingir que nada aconteceu","Avisar a TI e o DPO e pedir a exclusão da mensagem","Pedir segredo a todos no grupo"],a:1,w:"Exposição de dado pessoal é incidente. Avise na hora para conter e registrar."},
 {k:"senha",items:[["Horizonte2026!","Fraca","Palavra comum e ano. Fácil de adivinhar."],["x9$kP!","Fraca","Curta demais, mesmo com símbolos."],["cafe-azul-trem-lua-48","Forte","Longa, fácil de lembrar, difícil de adivinhar."]]},
 {k:"sim"}
];
let XI=0,XT={},XA=null;
function exemplos(el,idx){
 XI=Math.max(0,Math.min(EX.length-1,parseInt(idx)||0));XT={};XA=null;xdraw(el);
}
function xdraw(el){
 clearInterval(window.xclk);
 const it=EX[XI];let body="";
 const done=XA!==null;
 if(it.k==="intro"){
  body=`<h1 style="font-size:clamp(28px,4vw,46px)">Vamos praticar <span>juntos</span> antes de valer</h1><ul style="font-size:clamp(17px,2.2vw,26px);line-height:1.6"><li>Estes exemplos são <b>diferentes</b> dos da competição.</li><li>Não valem pontos: servem para aprender como cada atividade funciona.</li><li>A turma decide, eu mostro o resultado e a explicação.</li><li>Depois, o representante de cada grupo começa a competição de verdade.</li></ul>`;
 }else if(it.k==="email"){
  const tl=TOOLS.map(t=>t[0]);
  body=`<div class="mail"><div class="h">Canal: ${esc(it.ch)}<br>De: <b>${esc(it.n[0])}</b> &lt;${esc(it.n[1])}&gt;<br>Assunto: <b>${esc(it.sub)}</b></div><div style="font-size:clamp(16px,1.9vw,22px)">${it.body}</div>${it.link?`<div><span class="lk">${esc(it.link[0])}</span></div>`:""}${it.att?`<div><span class="at">📎 ${esc(it.att)}</span></div>`:""}</div>
  <div class="tools">${TOOLS.map(t=>`<button class="tool ${XT[t[0]]?"used":""}" data-t="${t[0]}">${t[1]}</button>`).join("")}</div>
  <ul class="finds">${TOOLS.filter(t=>XT[t[0]]).map(t=>{const k=t[0];const txt={rem:esc(it.rem),link:it.link?`Texto exibido: “${esc(it.link[0])}”. Destino real: <b>${esc(it.link[1])}</b>`:"Esta mensagem não tem link.",att:it.att?`Arquivo: <b>${esc(it.att)}</b>`:"Esta mensagem não tem anexo.",auth:esc(it.auth),ctx:esc(it.ctx)}[k];return `<li><b>${t[1]}</b><br>${txt}</li>`}).join("")}</ul>
  <div class="decide">${[["report","🚩 Reportar (golpe)"],["ok","✅ Aceitar (legítimo)"],["idk","🤔 Não sei"]].map(d=>`<button data-c="${d[0]}" ${done?"disabled":""}>${d[1]}</button>`).join("")}</div>
  ${done?(()=>{const ok=(XA==="report"&&it.scam)||(XA==="ok"&&!it.scam);return `<div class="fb ${ok?"ok":XA==="idk"?"mid":"bad"}" style="font-size:clamp(16px,1.9vw,22px)"><b>${ok?"Acertou! +"+it.pts+" pontos (exemplo)":XA==="idk"?"“Não sei” vale 0, mas não tira pontos.":"Errar vale 0 e não tira pontos."}</b> Era <b>${it.scam?"golpe":"legítimo"}</b>. ${esc(it.why)}</div>`})():""}`;
 }else if(it.k==="card"){
  body=`<p class="tag">Exemplo de Caça-Golpe</p><p style="font-size:clamp(22px,3vw,34px);font-weight:700;margin:10px 0">${esc(it.t)}</p><div class="decide" style="grid-template-columns:1fr 1fr">${[["g","🚩 Golpe"],["l","✅ Legítima"]].map(d=>`<button data-c="${d[0]}" ${done?"disabled":""}>${d[1]}</button>`).join("")}</div>${done?(()=>{const ok=(XA==="g")===it.scam;return `<div class="fb ${ok?"ok":"bad"}"><b>${ok?"Acertou! +40 (exemplo)":"Errou. 0 pontos."}</b> Era ${it.scam?"golpe":"legítima"}. ${esc(it.why)}</div>`})():""}`;
 }else if(it.k==="quiz"){
  body=`<p class="tag">Exemplo de Quiz</p><p style="font-size:clamp(20px,2.8vw,32px);font-weight:700;margin:10px 0">${esc(it.q)}</p>${it.o.map((o,j)=>`<button class="opt ${done&&j===it.a?"ok":done&&XA===j?"bad":""}" data-c="${j}" ${done?"disabled":""} style="font-size:clamp(16px,2vw,24px)"><b style="color:var(--neon)">${"ABCD"[j]}</b> &nbsp;${esc(o)}</button>`).join("")}${done?`<div class="fb ${XA===it.a?"ok":"bad"}"><b>${XA===it.a?"Correto! +100 (exemplo)":"Não é essa."}</b> ${esc(it.w)}</div>`:""}`;
 }else if(it.k==="dados"){
  const zn=["Dado pessoal","Dado pessoal sensível","Não é dado pessoal"];
  body=`<p class="tag">Exemplo de Dados e LGPD</p><p class="lead">Em qual caixa cada item se encaixa? ${done?"":"Peça palpites e depois revele."}</p><div class="zones">${zn.map((z,k)=>`<div class="zone" style="cursor:default"><h4>${z}</h4>${it.items.map(d=>(done&&d[1]===k)?`<div class="chip ok" style="margin:3px 0">${esc(d[0])}</div>`:"").join("")}</div>`).join("")}</div>${done?"":`<div class="chips" style="margin-top:12px">${it.items.map(d=>`<span class="chip">${esc(d[0])}</span>`).join("")}</div><div class="btns"><button class="btn" data-c="show">Revelar classificação</button></div>`}`;
 }else if(it.k==="inc"){
  body=`<p class="tag">Exemplo de Incidente</p><p style="font-size:clamp(20px,2.6vw,30px);font-weight:700;margin:10px 0">${esc(it.q)}</p>${it.o.map((o,j)=>`<button class="opt ${done&&j===it.a?"ok":done&&XA===j?"bad":""}" data-c="${j}" ${done?"disabled":""} style="font-size:clamp(16px,2vw,24px)"><b style="color:var(--neon)">${"ABC"[j]}</b> &nbsp;${esc(o)}</button>`).join("")}${done?`<div class="fb ${XA===it.a?"ok":"bad"}"><b>${XA===it.a?"Boa decisão! +100 (exemplo)":"Não é a melhor ação."}</b> ${esc(it.w)}</div>`:""}`;
 }else if(it.k==="senha"){
  body=`<p class="tag">Exemplo de Senha forte</p><p class="lead">Qual destas senhas é forte? ${done?"":"Peça palpites."}</p>${it.items.map(s=>`<div class="card" style="margin:8px 0;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><code style="font-size:clamp(18px,2.4vw,28px);color:#fff">${esc(s[0])}</code>${done?`<b style="color:${s[1]==="Forte"?"var(--ok)":"var(--bad)"}">${s[1]}</b><span style="color:#cfcfcf">${esc(s[2])}</span>`:""}</div>`).join("")}${done?"":`<div class="btns"><button class="btn" data-c="show">Revelar</button></div>`}`;
 }else{
  body=`<h1 style="font-size:clamp(26px,3.6vw,42px)">Agora vale: <span>como será a competição</span></h1>
  <div class="grid"><div class="card"><span class="tag">1</span><h3>Cadastro</h3><p>Só o representante de cada grupo cadastra e joga. O grupo ajuda.</p></div><div class="card"><span class="tag">2</span><h3>Iniciar</h3><p>Ao meu “valendo”, o representante clica em Iniciar competição.</p></div><div class="card"><span class="tag">3</span><h3>Atividades</h3><p>Fases, minijogos e checklist, em qualquer ordem.</p></div><div class="card"><span class="tag">4</span><h3>Entregar</h3><p>O tempo para e aparece o código para me entregar.</p></div></div>
  <div class="card on" style="text-align:center"><div class="tag">Simulação do cronômetro (exemplo)</div><div class="big" id="xc">0:00</div><div class="btns" style="justify-content:center"><button class="btn" id="xs">Simular início</button><button class="btn alt" id="xe" disabled>Simular entrega</button></div><p class="lead" id="xm" style="margin:8px 0 0">Vence quem tiver mais pontos e, em empate, menos tempo. 🍫</p></div>`;
 }
 el.innerHTML=`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="tag">Exemplos ao vivo · ${XI+1} de ${EX.length}</span><button class="btn sm alt" style="margin-left:auto" id="fs">Tela cheia</button></div>
 <div class="meter"><i style="width:${(XI+1)/EX.length*100}%"></i></div>${body}
 <div class="btns"><button class="btn alt" id="pv" ${XI?"":"disabled"}>← Anterior</button><button class="btn" id="nx" ${XI<EX.length-1?"":"disabled"}>Próximo →</button><button class="btn alt" onclick="nav('#/')">Sair dos exemplos</button></div>
 <p class="lead" style="font-size:12px;margin-top:10px">Exemplos do professor: não valem pontos. Atalhos: ← → navegam.</p>`;
 el.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{XT[b.dataset.t]=!XT[b.dataset.t];xdraw(el)});
 el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{if(XA!==null)return;const v=b.dataset.c;XA=(it.k==="quiz"||it.k==="inc")?+v:v;xdraw(el)});
 $("#pv").onclick=()=>nav("#/exemplos/"+(XI-1));
 $("#nx").onclick=()=>nav("#/exemplos/"+(XI+1));
 $("#fs").onclick=()=>{document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()};
 if(it.k==="sim"){
  let t0=0;const xs=$("#xs"),xe=$("#xe");
  xs.onclick=()=>{t0=Date.now();xs.disabled=true;xe.disabled=false;$("#xm").textContent="Cronômetro correndo…";window.xclk=setInterval(()=>{$("#xc")&&($("#xc").textContent=fmtT((Date.now()-t0)/1000))},500)};
  xe.onclick=()=>{clearInterval(window.xclk);xe.disabled=true;$("#xc").textContent=fmtT((Date.now()-t0)/1000);$("#xm").textContent="Entregue! O tempo parou e o grupo recebe o código. Vence quem tiver mais pontos e, em empate, menos tempo. 🍫"};
 }
}
addEventListener("keydown",e=>{
 if(!/^#\/exemplos/.test(location.hash)||!isProf())return;
 if(/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||""))return;
 if(e.key==="ArrowRight")nav("#/exemplos/"+(XI+1));else if(e.key==="ArrowLeft"&&XI>0)nav("#/exemplos/"+(XI-1));
});
