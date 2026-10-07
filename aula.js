/* Modo Aula: roteiro PRÁTICO por tema (a teoria fica no PPT). Funciona para o professor projetar
   e para os alunos seguirem no próprio celular. Rota: #/aula/N */
const AULA=[
 {cat:"Casos reais",t:"Casos reais",tarefa:["Defesa Civil, Arup e JBS: o que enganou ou parou cada um?","Faça o quiz relâmpago e descubra o que NÃO aconteceu (celular invadido, sistema invadido)."],lab:[]},
 {cat:"Phishing e golpes",t:"Phishing",tarefa:["Dia 1: use as 5 ferramentas em cada e-mail antes de decidir.","Dia 2: descubra o domínio real do link do e-mail \"Valide seu acesso\".","Treine rápido no Caça-Golpe."],lab:[{l:"Fase Dia 1",h:"#/fase/1"},{l:"Fase Dia 2",h:"#/fase/2"},{l:"Caça-Golpe",h:"#/mini/caca"}]},
 {cat:"Engenharia social",t:"Engenharia social",tarefa:["Dia 3: um e-mail passa em SPF e DKIM e mesmo assim é golpe. Qual?","Dia 5: o que você faria com o áudio do gestor pedindo o código?"],lab:[{l:"Fase Dia 3",h:"#/fase/3"},{l:"Fase Dia 5",h:"#/fase/5"}]},
 {cat:"Malware e ransomware",t:"Malware e ransomware",tarefa:["Dia 1: qual anexo é um executável disfarçado de PDF?","Dia 2: por que uma atualização do Windows não chega por e-mail?"],lab:[{l:"Fase Dia 1",h:"#/fase/1"},{l:"Fase Dia 2",h:"#/fase/2"}]},
 {cat:"Contas, senhas e MFA",t:"Senhas e MFA",tarefa:["Monte uma frase de 4 palavras e chegue a 70% de força.","Dia 3: por que o pedido para \"desativar o MFA\" é golpe?"],lab:[{l:"Senha forte",h:"#/mini/senha"},{l:"Fase Dia 3",h:"#/fase/3"}]},
 {cat:"LGPD: conceitos",t:"LGPD: conceitos",tarefa:["Classifique 10 dados em pessoal, sensível ou não pessoal. Tente 10/10.","Discuta: CPF e salário são sensíveis?"],lab:[{l:"Dados e LGPD",h:"#/mini/dados"}]},
 {cat:"LGPD: obrigações e sanções",t:"LGPD: direitos, prazos e multas",tarefa:["Responda o quiz relâmpago sobre direitos do titular, multa e prazo de comunicação.","Jogue o Quiz de Segurança completo para fixar."],lab:[{l:"Quiz de Segurança",h:"#/mini/quiz"}]},
 {cat:"Incidentes e resposta",t:"Incidentes",tarefa:["Escolha a melhor ação nos 4 cenários de vazamento.","Em grupo: quem avisa quem, e em quanto tempo?"],lab:[{l:"Incidentes",h:"#/mini/inc"}]},
 {cat:"Terceiros e continuidade",t:"Terceiros e continuidade",tarefa:["Dia 3: o e-mail do fornecedor é real, mas a conta foi invadida. Como confirmar?","Discuta: quem verifica o fim do acesso de um fornecedor?"],lab:[{l:"Fase Dia 3",h:"#/fase/3"}]},
 {cat:"IA e privacidade",t:"IA e informações corporativas",tarefa:["Reescreva o pedido \"resuma os afastamentos por pessoa\" sem expor dados.","Marque no checklist o que você já faz com IA."],lab:[{l:"Checklist",h:"#/checklist"}]},
 {cat:null,t:"Fechamento",tarefa:["Marque seu checklist de segurança.","Veja seu resultado, copie o código e envie ao professor para o placar."],lab:[{l:"Checklist",h:"#/checklist"},{l:"Meu resultado e código",h:"#/resultado"}]}
];

function aulaRoute(el,idx){
 const i=Math.max(0,Math.min(AULA.length-1,parseInt(idx)||0));
 const m=AULA[i];
 try{sessionStorage.setItem("cgAula",String(i))}catch(e){}
 el.innerHTML=`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="tag">Aula prática · tema ${i+1} de ${AULA.length}</span><button class="btn sm alt" style="margin-left:auto" id="fs">Tela cheia</button></div>
 <div class="meter"><i style="width:${(i+1)/AULA.length*100}%"></i></div>
 <h1 style="font-size:clamp(28px,4vw,46px)">${esc(m.t)}</h1>
 <div class="row" style="align-items:flex-start"><div style="flex:3;min-width:300px"><div class="tag">Sua tarefa</div><ol style="font-size:clamp(17px,2.2vw,26px);line-height:1.5;padding-left:26px">${m.tarefa.map(p=>`<li style="margin:10px 0">${esc(p)}</li>`).join("")}</ol></div>
 <div style="flex:1.2;min-width:250px"><div class="card on"><div class="tag">Praticar agora</div>${m.lab.length?m.lab.map(x=>`<div class="btns"><button class="btn" data-h="${x.h}">${esc(x.l)} →</button></div>`).join(""):'<p>Neste tema não há laboratório. Siga para o quiz.</p>'}${m.cat?'<div class="btns"><button class="btn alt" id="qz">⚡ Quiz relâmpago do tema</button></div>':""}</div></div></div>
 <div class="btns"><button class="btn alt" ${i?"":"disabled"} onclick="nav('#/aula/${i-1}')">← Tema anterior</button><button class="btn" ${i<AULA.length-1?"":"disabled"} onclick="nav('#/aula/${i+1}')">Próximo tema →</button></div>
 <div class="card" style="margin-top:20px"><div class="tag">Professor</div><div class="btns"><button class="btn sm alt" onclick="nav('#/professor')">Quiz ao vivo por grupos</button><button class="btn sm alt" onclick="nav('#/placar')">Placar da competição</button><button class="btn sm alt" onclick="nav('#/temas')">Assuntos e gabaritos</button></div></div>`;
 document.querySelectorAll("[data-h]").forEach(b=>b.onclick=()=>nav(b.dataset.h));
 $("#fs").onclick=()=>{document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()};
 if($("#qz"))$("#qz").onclick=()=>{
  if(H&&(H.phase==="q"||H.phase==="reveal")&&!confirm("Há um quiz ao vivo em andamento. Substituir por este quiz relâmpago?"))return;
  const teams=(H&&H.cfg&&H.cfg.teams)||["Grupo 1","Grupo 2","Grupo 3","Grupo 4","Grupo 5","Grupo 6"];
  const pool=LIVEQ.filter(q=>q.cat===m.cat);
  const qs=shuf(pool).slice(0,Math.min(4,pool.length)).map(q=>{const o=shuf(q.o.map((t,j)=>({t,r:j===q.a})));return {cat:q.cat,q:q.q,w:q.w,o:o.map(x=>x.t),a:o.findIndex(x=>x.r)}});
  H={phase:"q",cfg:{teams,cats:(H&&H.cfg&&H.cfg.cats)||CATS.slice(),n:qs.length,secs:20},teams:(H&&H.teams&&H.teams.length===teams.length)?H.teams.map(t=>({...t})):teams.map(t=>({n:t,s:0,hits:0})),qs,i:0,marks:{},t0:Date.now(),fromAula:i};hsave();
  nav("#/professor");
 };
}
