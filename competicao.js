/* Competição: o Laboratório é a competição. Um representante por grupo joga, o grupo ajuda.
   Vence quem entrega com mais pontos e, em empate, em menos tempo. */
const fmtT=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};

/* ---------- como funciona (usada pelo professor no projetor) ---------- */
function competicao(el){
 const demo=[["Os Guardiões","Ana",8200,2410],["Firewall","Bruno",8200,3120],["Cyber Squad","Carla",7600,2300],["Bits e Bytes","Diego",6900,1800],["Zero Day","Eva",5400,1500]];
 const prof=isProf();
 el.innerHTML=`<h1>Como funciona a <span>competição</span></h1>
 <p class="lead">O Laboratório é a competição. Vence o grupo que entrega com <b>mais pontos</b> e, em empate, em <b>menos tempo</b>. Prêmio: 🍫 um chocolate.</p>
 <div class="grid">
  <div class="card"><span class="tag">Passo 1 · Cadastro</span><h3>Um por grupo</h3><p>Apenas um aluno do grupo (o representante) cadastra o grupo e joga. Os demais ajudam a decidir e podem acompanhar a tela ao vivo, só para ver.</p></div>
  <div class="card"><span class="tag">Passo 2 · Início</span><h3>Valendo!</h3><p>Quando o professor disser “valendo”, o representante clica em <b>Iniciar competição</b>. O cronômetro começa a correr.</p></div>
  <div class="card"><span class="tag">Passo 3 · Atividades</span><h3>Tudo liberado</h3><p>5 fases de e-mails, 5 minijogos e o checklist, em qualquer ordem. Cobrem todos os assuntos. Errar não tira pontos.</p></div>
  <div class="card"><span class="tag">Passo 4 · Entrega</span><h3>Entregar</h3><p>Ao terminar (ou quando o tempo acabar), o representante clica em <b>Entregar</b>. O tempo para e aparece o código. Depois não dá para continuar.</p></div>
  <div class="card on"><span class="tag">Passo 5 · Vitória</span><h3>Pontos e tempo</h3><p>Ganha quem tiver mais pontos. Se empatar, vence o menor tempo. O professor monta o placar com os códigos.</p></div>
 </div>
 <h2>Como os pontos <span>funcionam</span></h2>
 <div class="card"><ul><li><b>Fases (e-mails):</b> 100 pontos × dificuldade do dia por acerto (máximo 6.000). Errar ou marcar “Não sei” dá 0, sem perder nada.</li><li><b>Minijogos:</b> Caça-Golpe (40 por acerto), Quiz (100), Dados e LGPD (50), Incidentes (100) e Senha forte (100). Conta a melhor pontuação de cada um.</li><li><b>Checklist:</b> 10 pontos por item marcado.</li><li>Pontuação total possível: ${maxXp()}.</li></ul></div>
 <h2>Exemplo de <span>placar</span> <small style="font-size:13px;color:var(--mut)">(ilustrativo)</small></h2>
 <div class="card"><table><tr><th>#</th><th>Grupo</th><th>Representante</th><th>Pontos</th><th>Tempo</th></tr>${demo.map((d,i)=>`<tr><td>${i+1}${i===0?" 🍫":""}</td><td>${d[0]}</td><td>${d[1]}</td><td><b>${d[2]}</b></td><td>${fmtT(d[3])}</td></tr>`).join("")}</table>
 <p class="lead" style="margin:10px 0 0">Os Guardiões e o Firewall empataram em 8.200 pontos. Os Guardiões ganham por terem entregado em menos tempo.</p></div>
 <h2>Assuntos <span>cobertos</span></h2>
 <div class="chips">${CATS.map(c=>`<span class="chip">${esc(c)}</span>`).join("")}</div>
 ${prof?`<h2>Para você: demonstração <span>ao vivo</span></h2>
 <div class="card"><ol><li>Projete esta página e explique as regras.</li><li>No seu notebook, cadastre um grupo de exemplo (“Demo”), clique em <b>Iniciar</b> e mostre uma fase, um minijogo e o checklist.</li><li>Clique em <b>Entregar</b> e mostre o código. Em <b>Placar</b>, cole o código para mostrar o ranking.</li><li>Abra <b>Acompanhar grupos</b> no seu notebook e, em outro aparelho, a tela “Acompanhar um grupo” para mostrar o espelho ao vivo.</li><li>Para repetir a demonstração: na tela de resultado, use <b>Reiniciar tudo</b> (só aparece para você).</li></ol></div>`:""}
 <div class="btns"><button class="btn" onclick="nav('#/')">${S.name?"Ir para a competição":"Cadastrar meu grupo"}</button>${prof?'<button class="btn alt" onclick="nav(\'#/placar\')">Placar</button><button class="btn alt" onclick="nav(\'#/grupos\')">Acompanhar grupos</button>':""}</div>`;
}

/* ---------- placar da competição (professor) ---------- */
function placar(el){
 el.innerHTML=`<h1>Placar da <span>competição</span></h1><p class="lead">Cole os códigos entregues pelos grupos (um por linha). Ordem: mais pontos e, em empate, menor tempo.</p>
 <div class="card"><textarea id="ta" rows="5" placeholder="CG1.eyJ..."></textarea><div class="btns"><button class="btn" id="mk">Montar placar</button><button class="btn alt" id="ex">Exemplo</button></div></div><div id="out"></div>`;
 const build=()=>{
  const by={};($("#ta").value.match(/CG1\.[A-Za-z0-9+/=]+/g)||[]).forEach(c=>{const o=decodeCode(c);if(!o)return;const k=String(o.g).toLowerCase(),has=typeof o.c==="number";const p=by[k];
   if(!p||(has&&(!(typeof p.c==="number")||o.c>p.c||(o.c===p.c&&o.ct<p.ct))))by[k]=o});
  const all=Object.values(by),L=all.filter(o=>typeof o.c==="number").sort((a,b)=>b.c-a.c||a.ct-b.ct),X=all.filter(o=>typeof o.c!=="number");
  if(!all.length){$("#out").innerHTML='<div class="card">Nenhum código válido encontrado.</div>';return}
  $("#out").innerHTML=`<h2>Ranking <span>dos grupos</span></h2><div class="card"><table><tr><th>#</th><th>Grupo</th><th>Representante</th><th>Pontos</th><th>Tempo</th></tr>${L.map((o,i)=>`<tr><td>${i+1}${i===0?" 🍫":i<3?" "+["","🥈","🥉"][i]:""}</td><td>${esc(o.g)}</td><td>${esc(o.n)}</td><td><b>${o.c}</b></td><td>${fmtT(o.ct)}</td></tr>`).join("")||'<tr><td colspan="5">Nenhum grupo entregou ainda.</td></tr>'}</table></div>
  ${X.length?`<h2>Ainda sem <span>entrega</span></h2><div class="card">${X.map(o=>"Grupo "+esc(o.g)+" ("+esc(o.n)+")").join("<br>")}</div>`:""}`};
 $("#mk").onclick=build;
 $("#ex").onclick=()=>{$("#ta").value=[["Ana","Os Guardiões",8200,2410],["Bruno","Firewall",8200,3120],["Carla","Cyber Squad",7600,2300],["Diego","Bits e Bytes",6900,1800],["Eva","Zero Day",5400,1500]].map(([n,g,c,ct])=>encodeCode({n,g,s:c,l:Math.floor(c/1000)+1,d:5,b:3,c,ct})).join("\n");build()};
}
