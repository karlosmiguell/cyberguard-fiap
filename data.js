/* Conteúdo do CyberGuard FIAP. Organização fictícia: Atlântica Serviços.
   Todos os domínios usam sufixos reservados (.example, .invalid) e não existem de verdade. */
const OK_AUTH = "SPF aprovado · DKIM aprovado · DMARC aprovado";

const DAYS = [
 { id:1, title:"Primeiro dia na Atlântica", desc:"Golpes que dá para perceber de longe. Aprenda os sinais básicos.", d:1 },
 { id:2, title:"A rotina aperta", desc:"Domínios parecidos, mensagens de número novo e atualizações falsas.", d:2 },
 { id:3, title:"Os golpes ficam sofisticados", desc:"Pedido de PIX, troca de conta de fornecedor e pedido para desligar o MFA.", d:3 },
 { id:4, title:"As coisas ficam sutis", desc:"Nem tudo que parece suspeito é golpe. Nem tudo que parece normal é seguro.", d:4 },
 { id:5, title:"Pressão e urgência", desc:"Suporte remoto, deepfake e áudio clonado. Quanto mais pressa, mais se confirma.", d:5 }
];

/* n: [nome, endereço]  link: [texto exibido, destino real] | null  att: nome do anexo | null
   scam: true = golpe  rem/auth/ctx: o que cada ferramenta revela  why: explicação final */
const EMAILS = [
// ---------- DIA 1 ----------
{day:1,scam:true,ch:"E-mail",n:["TI Atlântica","suporte@atlantica-ti.example"],sub:"Sua conta será bloqueada em 24h!!!",
 body:"Prezado colaborador, identificamos atividade suspeita na sua conta. Para evitar o <b>bloqueio em 24 horas</b>, clique no botão e regularize seus dados imediatamente.",
 link:["Regularizar agora","http://atlantica-ti.example/login-seguro"],att:null,
 rem:"O endereço atlantica-ti.example parece o da empresa, mas o domínio oficial é atlantica.example.",
 auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"Domínio criado há 6 dias. Nunca enviou e-mail para a empresa antes.",
 why:"Endereço parecido, mas não igual, e pressa para você clicar sem pensar. Desconfie de urgência com ameaça."},
{day:1,scam:false,ch:"E-mail",n:["RH Atlântica","rh@atlantica.example"],sub:"Treinamento de segurança: inscrições abertas",
 body:"Olá! As inscrições para o treinamento de segurança digital estão abertas. Acesse o portal de treinamentos, como sempre, e escolha a turma.",
 link:["Portal de treinamentos","https://portal.atlantica.example/treinamentos"],att:null,
 rem:"Endereço rh@atlantica.example, do domínio oficial da empresa.",
 auth:OK_AUTH,ctx:"Remetente é do RH. O link aponta para o portal interno que você já conhece.",
 why:"Domínio oficial, sem urgência, sem pedido de dados e link para o portal conhecido. É legítima."},
{day:1,scam:true,ch:"E-mail",n:["Prêmios Online","promocoes@premios-online.example"],sub:"Você ganhou um vale-presente de R$ 500!",
 body:"Parabéns! Você foi sorteado(a). Informe seu <b>CPF e os dados do cartão</b> para receber o vale em até 10 minutos.",
 link:["Resgatar prêmio","http://bit-premio.example/r/9xk2"],att:null,
 rem:"Remetente externo desconhecido. Você não participou de nenhum sorteio.",
 auth:"SPF reprovado · DKIM ausente · DMARC ausente",ctx:"Nenhuma campanha da empresa com esse nome. Link encurtado esconde o destino.",
 why:"Prêmio inesperado, pressa e pedido de CPF e cartão. Ninguém sorteia dinheiro e pede seus dados."},
{day:1,scam:true,ch:"E-mail",n:["Cobrança","cobranca@fornecedor-xyz.example"],sub:"2ª via da fatura em atraso",
 body:"Segue a fatura em atraso. Abra o anexo para ver os valores e evitar protesto.",
 link:null,att:"fatura_setembro.pdf.exe",
 rem:"Fornecedor que não consta no cadastro da empresa.",
 auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"Nenhum contrato ou pedido em aberto com esse nome.",
 why:"Extensão dupla (.pdf.exe): é um programa disfarçado de PDF. Porta de entrada comum de ransomware."},
// ---------- DIA 2 ----------
{day:2,scam:false,ch:"E-mail",n:["Marina (Gestão)","marina@atlantica.example"],sub:"Alinhamento de amanhã às 10h",
 body:"Oi! Já enviei o convite no calendário corporativo. A pauta está no próprio evento. Qualquer ajuste me avise por aqui.",
 link:null,att:null,
 rem:"Colega conhecida, endereço do domínio oficial.",
 auth:OK_AUTH,ctx:"O convite realmente aparece no seu calendário corporativo.",
 why:"Remetente conhecido, canal oficial, sem link e sem pedido de dados. Rotina normal de trabalho."},
{day:2,scam:true,ch:"WhatsApp",n:["Diretor (número novo)","+55 11 9xxxx-0000"],sub:"",
 body:"Oi, é o diretor. Troquei de número, salva aí. Preciso de um favor discreto: compra 5 cartões-presente de R$ 200 e me manda os códigos. Depois reembolso.",
 link:null,att:null,
 rem:"Número que não está nos contatos da empresa. A foto de perfil foi copiada do site.",
 auth:"Não se aplica (mensagem de aplicativo)",ctx:"O diretor continua com o número de sempre. Nenhum aviso de troca foi feito pelos canais oficiais.",
 why:"Golpe do falso chefe com número novo. Confirme ligando para o número que você já tinha."},
{day:2,scam:true,ch:"E-mail",n:["Portal Atlântica","acesso@atlantica.example"],sub:"Valide seu acesso ao portal",
 body:"Detectamos uma mudança no seu perfil. Clique para validar seu acesso ao portal.",
 link:["portal.atlantica.example","https://portal.atlantica.example.validacao.invalid/entrar"],att:null,
 rem:"O nome de exibição é convincente, mas o endereço real vem de fora (cabeçalho forjado).",
 auth:"SPF reprovado · DKIM reprovado · DMARC reprovado",ctx:"Nenhuma alteração de perfil foi feita. O domínio real do link é validacao.invalid.",
 why:"O texto do link engana: o domínio verdadeiro é o que vem logo antes da primeira barra, no fim: validacao.invalid."},
{day:2,scam:true,ch:"E-mail",n:["Atualização do Windows","noreply@micr0soft-update.example"],sub:"Atualização crítica: instale agora",
 body:"Seu computador está vulnerável. Baixe e execute o arquivo para instalar a atualização de segurança imediatamente.",
 link:null,att:"atualizacao_critica.exe",
 rem:"O domínio troca o 'o' por zero (micr0soft). Atualizações reais não chegam por e-mail.",
 auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"A TI atualiza as estações por política interna, sem pedir ação do usuário.",
 why:"Atualização real vem pelo próprio sistema, nunca por anexo em e-mail. Executável + urgência = golpe."},
// ---------- DIA 3 ----------
{day:3,scam:true,ch:"E-mail",n:["Diretor Financeiro","diretoria.financeiro@mail-corp.example"],sub:"Pagamento urgente e confidencial",
 body:"Preciso que faça um PIX de R$ 48.700 hoje para um fornecedor novo. É confidencial, não comente com ninguém. Estou em reunião, não consigo ligar.",
 link:null,att:null,
 rem:"O nome é o do diretor, mas o endereço é externo, não é o do domínio da empresa.",
 auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"Não há ordem de pagamento nem fornecedor com esse nome no sistema financeiro.",
 why:"Urgência, sigilo e autoridade são a receita do golpe do falso executivo. Confirme por outro canal e siga a aprovação."},
{day:3,scam:true,ch:"E-mail",n:["Contas a Receber","financeiro@fornecedor-real.example"],sub:"Atualização dos nossos dados bancários",
 body:"Informamos que nossa conta mudou. A partir de hoje, os pagamentos devem ser feitos na conta do anexo. Pedimos urgência na atualização.",
 link:null,att:"novos_dados_bancarios.pdf",
 rem:"O endereço é do fornecedor real e a assinatura confere.",
 auth:OK_AUTH,ctx:"A conta de e-mail do fornecedor foi invadida há 2 dias, segundo o contato cadastrado.",
 why:"Até e-mail legítimo pode estar invadido. Troca de conta bancária se confirma por telefone cadastrado, antes de pagar."},
{day:3,scam:false,ch:"E-mail",n:["Suporte TI","helpdesk@atlantica.example"],sub:"Chamado #4821 resolvido",
 body:"O chamado #4821 que você abriu ontem sobre a impressora foi concluído. Se o problema persistir, responda por aqui.",
 link:["Ver chamado no helpdesk","https://helpdesk.atlantica.example/chamados/4821"],att:null,
 rem:"Endereço do domínio oficial da empresa.",
 auth:OK_AUTH,ctx:"O chamado #4821 existe e foi aberto por você.",
 why:"Você abriu esse chamado, o domínio é oficial e o link vai ao helpdesk interno. É legítima."},
{day:3,scam:true,ch:"E-mail",n:["Segurança Atlântica","seguranca@atlantica-seg.example"],sub:"Desative o MFA para a migração",
 body:"Para concluir a migração do seu acesso, desative temporariamente a verificação em duas etapas e nos envie o código recebido por SMS.",
 link:null,att:null,
 rem:"O domínio atlantica-seg.example não é o oficial.",
 auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"Não existe migração programada. A equipe de TI nunca pede para desligar o MFA nem o código.",
 why:"Ninguém legítimo pede para desligar o MFA ou passar o código. Essa é a defesa que o atacante precisa derrubar."},
// ---------- DIA 4 ----------
{day:4,scam:false,ch:"E-mail",n:["Serviço de Contas","no-reply@servico-oficial.example"],sub:"Novo acesso à sua conta",
 body:"Houve um login em um novo dispositivo. Se foi você, ignore. Se não foi, abra o <b>aplicativo oficial</b> e troque sua senha. Esta mensagem não contém links.",
 link:null,att:null,
 rem:"Serviço que você usa, domínio consistente com os e-mails anteriores.",
 auth:OK_AUTH,ctx:"Você entrou de um notebook novo há 3 minutos.",
 why:"Sem link, sem pressa e orienta abrir o aplicativo oficial por conta própria. Mesmo assim, acesse direto, sem clicar."},
{day:4,scam:true,ch:"E-mail",n:["Marina (Gestão)","marina.gestao@outlook-mail.example"],sub:"Marina compartilhou \"Folha_Salarial_2026.xlsx\"",
 body:"Marina compartilhou um arquivo com você. Entre com seu e-mail corporativo para visualizar.",
 link:["Abrir arquivo","https://arquivos-compartilhados.example/entrar?u=atlantica"],att:null,
 rem:"Nome conhecido, mas o endereço é de um serviço de e-mail gratuito. A Marina usa o e-mail corporativo.",
 auth:"SPF aprovado · DKIM ausente · DMARC reprovado",ctx:"A Marina disse que não compartilhou nada. A tela pede sua senha corporativa.",
 why:"Usa o nome de uma pessoa real e uma curiosidade (folha salarial) para roubar sua senha. Confira o endereço real."},
{day:4,scam:false,ch:"E-mail",n:["Encarregado de Dados (DPO)","dpo@atlantica.example"],sub:"Atualização da política de privacidade",
 body:"Atualizamos a política de privacidade. Ela está disponível no site institucional. Não é necessária nenhuma ação, apenas leitura.",
 link:["Política de privacidade","https://atlantica.example/privacidade"],att:null,
 rem:"Endereço do encarregado, domínio oficial.",
 auth:OK_AUTH,ctx:"A atualização foi anunciada no comunicado interno da semana passada.",
 why:"Domínio oficial, não pede dados e já foi anunciada por outro canal. Comunicados reais também existem."},
{day:4,scam:true,ch:"E-mail",n:["Reuniões Atlântica","agenda@atlantica-reunioes.example"],sub:"Entre na reunião: escaneie o QR code",
 body:"A reunião com a diretoria começa em 5 minutos. Escaneie o QR code abaixo com o celular para entrar. [imagem: QR code]",
 link:["QR code da reunião","https://reuniao-atlantica.example/entrar?t=8f2"],att:null,
 rem:"Domínio atlantica-reunioes.example não é o oficial.",
 auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"Não há reunião com a diretoria hoje no calendário. QR code esconde o destino real do link.",
 why:"O QR code leva você ao celular, onde a proteção do e-mail não alcança. Confirme no calendário e não escaneie."},
// ---------- DIA 5 ----------
{day:5,scam:true,ch:"E-mail + ligação",n:["Suporte Técnico","suporte@atlantica-help.example"],sub:"Acesso remoto necessário agora",
 body:"Aqui é do suporte. Detectamos um vírus. Instale o AnyDesk, abra e me passe o código de nove dígitos, que eu removo agora. Estou ligando para você também.",
 link:["Baixar AnyDesk","https://download-anydesk.example/setup"],att:null,
 rem:"O domínio atlantica-help.example não é o oficial.",
 auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"Não há nenhum chamado aberto por você. A TI só acessa com chamado registrado.",
 why:"Quem pede acesso remoto sem chamado quer controlar sua máquina. Confirme pelo canal interno antes de autorizar."},
{day:5,scam:true,ch:"Videochamada",n:["CFO e diretoria (convite)","reuniao@videoconf-corp.example"],sub:"Reunião urgente e confidencial: transação",
 body:"Entre agora na videochamada. A diretoria e o CFO vão explicar uma transação sigilosa que você precisa executar hoje.",
 link:["Entrar na videochamada","https://videoconf-corp.example/sala/9921"],att:null,
 rem:"Domínio externo ao da empresa.",
 auth:"SPF reprovado · DKIM ausente · DMARC reprovado",ctx:"Nenhuma reunião registrada. O processo de pagamentos exige aprovação em sistema, não em chamada.",
 why:"Vídeo e voz podem ser falsificados por IA. Mesmo vendo o chefe, siga a aprovação do processo e confirme por contato conhecido."},
{day:5,scam:false,ch:"E-mail",n:["Atlântica Contas","contas@atlantica.example"],sub:"Redefinição de senha solicitada",
 body:"Recebemos um pedido de redefinição de senha da sua conta há 2 minutos. Use o link abaixo para criar uma nova senha. O link expira em 15 minutos.",
 link:["Criar nova senha","https://contas.atlantica.example/redefinir?token=ab12"],att:null,
 rem:"Endereço do domínio oficial da empresa.",
 auth:OK_AUTH,ctx:"Você mesmo pediu a redefinição de senha agora há pouco.",
 why:"Tem prazo curto, mas você pediu, o domínio é oficial e o link vai ao sistema de contas. Urgência sozinha não prova golpe."},
{day:5,scam:true,ch:"WhatsApp (áudio)",n:["Gestor (número desconhecido)","+55 11 9xxxx-1111"],sub:"",
 body:"[áudio de 14 segundos] Com a voz do gestor: \"Tô sem acesso, chegou um código no seu celular. Me passa aqui rápido, é para liberar o sistema agora.\"",
 link:null,att:"audio_gestor.mp3",
 rem:"Número que não é o do gestor. A voz foi gerada por IA a partir de áudios públicos.",
 auth:"Não se aplica (mensagem de aplicativo)",ctx:"O gestor está de férias e não pediu nenhum código.",
 why:"Código MFA nunca se compartilha, nem com a voz de quem você conhece. Pare e ligue para o número cadastrado."}
];

/* Caça-Golpe: 16 cartas (10 golpes e 6 legítimas) */
const CARDS = [
 ["Seu CPF foi bloqueado. Regularize em gov-cpf.example em 2 horas.",1,"Órgãos públicos não bloqueiam CPF por link, e o domínio não é oficial."],
 ["Chamado #4821 resolvido. Veja no helpdesk interno.",0,"Você abriu o chamado e o helpdesk é o interno."],
 ["Pix recebido por engano. Devolva para esta outra conta.",1,"Golpe comum: o Pix volta pelo banco, não para uma conta diferente."],
 ["Sua encomenda está retida. Pague uma taxa de R$ 7,90.",1,"Taxas reais não são cobradas por link de mensagem inesperada."],
 ["Holerite de setembro disponível no portal da intranet.",0,"Aviso de rotina, que aponta para o portal que você conhece."],
 ["Aqui é do suporte. Me passe o código que chegou no seu celular.",1,"Ninguém do suporte precisa do seu código."],
 ["Reunião de equipe amanhã às 10h, convite no calendário corporativo.",0,"Canal oficial, sem link nem pedido de dados."],
 ["Parabéns! Você ganhou um sorteio. Envie o código SMS para receber.",1,"Prêmio + código SMS é tentativa de invadir sua conta."],
 ["Seu e-mail expira hoje. Clique aqui para manter a caixa de entrada.",1,"Expiração por link é isca clássica de phishing."],
 ["Backup noturno concluído com sucesso. Relatório automático em anexo (.pdf).",0,"Relatório que você já recebe todo dia, de sistema conhecido."],
 ["Vaga home office! Pague R$ 120 do kit de trabalho para começar.",1,"Emprego legítimo não cobra para você trabalhar."],
 ["Fornecedor: nosso boleto mudou de conta. Pague até hoje na nova conta.",1,"Mudança de conta se confirma por contato cadastrado antes de pagar."],
 ["Código de verificação 482913. Não compartilhe com ninguém. (você acabou de pedir)",0,"Se foi você que pediu, é legítimo, e o aviso para não compartilhar é verdadeiro."],
 ["Chefe: compra 3 cartões-presente e manda os códigos, depois eu reembolso.",1,"Pedido de cartões-presente por mensagem é golpe do falso chefe."],
 ["Sua fatura do cartão chegou. Abra o app do banco para ver.",0,"Orienta abrir o aplicativo, sem link."],
 ["Atualize seus dados bancários agora: link-banco-seguro.example/login",1,"Banco não pede atualização por link, e o domínio é falso."]
].map(c=>({t:c[0],scam:!!c[1],why:c[2]}));

/* Quiz: 12 perguntas. A resposta certa é o índice 'a' (embaralhado na tela) */
const QUIZ = [
 {q:"Uma mensagem diz: \"clique para evitar o bloqueio da conta em 24 horas\". O que isso indica?",o:["É sempre legítimo, contas bloqueiam rápido","A pressa forçada é uma técnica clássica de golpe","Só é golpe se vier de desconhecido","Não indica nada"],a:1,w:"Criar pressa para você agir sem pensar é tática clássica de golpe."},
 {q:"O \"diretor financeiro\" pede um PIX urgente e sigilo por e-mail. O que fazer?",o:["Fazer o PIX para não incomodar a diretoria","Responder pedindo detalhes","Confirmar por outro canal conhecido antes de qualquer pagamento","Encaminhar a um colega decidir"],a:2,w:"Urgência, sigilo e autoridade são a receita do golpe. Confirme por outro canal e siga a aprovação."},
 {q:"Por que nunca desligar a verificação em duas etapas a pedido de uma mensagem?",o:["Ela é opcional e não faz diferença","Isso remove uma das principais proteções contra invasão de conta","Só funciona no Android","É ilegal desligar"],a:1,w:"Equipe de TI real nunca pede para desligar o MFA."},
 {q:"O anexo se chama \"nota_fiscal.pdf.exe\". O que isso indica?",o:["PDF protegido por senha","Dois nomes colados escondendo um programa perigoso","Formato válido de compactação","Nada de errado"],a:1,w:"Termina em .exe, que é programa. O .pdf antes só serve para enganar."},
 {q:"O cadeado de HTTPS aparece no site. Isso garante que ele é confiável?",o:["Sim, o site é seguro e verdadeiro","Não, só indica que a conexão é criptografada","Sim, se o cadeado estiver verde","Só vale em sites de bancos"],a:1,w:"Sites falsos também têm HTTPS. O cadeado protege a conexão, não prova quem está do outro lado."},
 {q:"O link exibe \"portal.empresa.com\", mas o destino real é \"portal.empresa.com.validacao.invalid\". Qual é o domínio verdadeiro?",o:["portal.empresa.com","empresa.com","validacao.invalid","Todos valem"],a:2,w:"O domínio real é o trecho final antes da primeira barra. Aqui, validacao.invalid."},
 {q:"Alguém do \"suporte\" liga e pede o código de seis dígitos que chegou por SMS. O que você faz?",o:["Informa, porque é do suporte","Informa só os 3 primeiros dígitos","Não informa e confirma o chamado pelo canal interno","Pede que mande por e-mail"],a:2,w:"O código MFA é pessoal. O suporte verdadeiro não precisa dele."},
 {q:"Qual destes é um dado pessoal SENSÍVEL pela LGPD?",o:["CPF","Endereço de e-mail","Dado de saúde","Nome completo"],a:2,w:"Saúde, biometria, religião, origem racial e filiação sindical são sensíveis. CPF é pessoal, mas não sensível."},
 {q:"Reutilizar a mesma senha em vários serviços é arriscado porque…",o:["Fica difícil de lembrar","Um vazamento em um serviço compromete todos os outros","As senhas expiram mais rápido","Não há risco real"],a:1,w:"Atacantes testam senhas vazadas em outros serviços (credential stuffing)."},
 {q:"Você percebe que enviou uma planilha com dados de clientes à pessoa errada. O melhor é…",o:["Esperar para ver se ela avisa","Apagar a mensagem e esquecer","Avisar imediatamente a TI e o encarregado (DPO)","Pedir segredo à pessoa e seguir"],a:2,w:"Reportar rápido reduz o dano e permite cumprir a comunicação de incidentes."},
 {q:"O que significa a regra de backup 3-2-1?",o:["3 senhas, 2 fatores, 1 dispositivo","3 cópias, em 2 mídias diferentes, com 1 fora do local","3 backups por dia, 2 por semana, 1 por mês","3 pessoas, 2 aprovações, 1 responsável"],a:1,w:"Mais de uma cópia, em mídias diferentes e uma fora do local protege contra ransomware e falhas."},
 {q:"Um QR code chega por e-mail para \"entrar na reunião\". O que fazer?",o:["Escanear, é prático","Escanear só pelo celular pessoal","Conferir no calendário e não escanear sem confirmar a origem","Escanear e conferir a página depois"],a:2,w:"O QR code esconde o destino e leva você a um dispositivo menos protegido."}
];

/* LGPD: pessoal 0, sensível 1, não pessoal 2 */
const DATA_ITEMS = [["Nome completo",0],["CPF",0],["Impressão digital (biometria)",1],["Laudo médico / CID",1],["Filiação a sindicato",1],["E-mail pessoal",0],["Convicção religiosa",1],["CNPJ da empresa",2],["Estatística anonimizada (sem identificar ninguém)",2],["Endereço residencial",0]];

const SCENARIOS = [
 {q:"Um colega manda uma planilha com CPF de clientes pelo WhatsApp pessoal para \"agilizar\".",o:["Tudo bem, é rápido e ele apaga depois","Usar o canal corporativo autorizado, enviando só o necessário e com acesso controlado","Reenviar por e-mail pessoal para ter backup"],a:1,w:"Minimização e canal autorizado: compartilhe só o necessário, em ambiente controlado e com registro."},
 {q:"Você esquece o notebook corporativo (com dados de clientes) em um táxi.",o:["Esperar 1 dia para ver se o motorista devolve","Avisar na hora a TI e o DPO para bloquear, apagar remotamente e registrar o incidente","Não contar para ninguém"],a:1,w:"Tempo é crítico. Comunicar rápido reduz o dano e ajuda a cumprir a comunicação de incidentes (LGPD)."},
 {q:"Você clicou em um link suspeito e digitou sua senha.",o:["Fechar a aba e esquecer","Trocar a senha, ativar MFA e avisar a TI imediatamente","Aguardar para ver se acontece algo"],a:1,w:"Troque a credencial, ative o MFA e reporte: a TI pode revogar sessões e conter o ataque."},
 {q:"Você descobre uma pasta com currículos de candidatos aberta para \"qualquer pessoa com o link\".",o:["Ignorar: não é minha área","Restringir o acesso, se puder, e reportar à TI e ao DPO","Compartilhar o link com colegas para ver"],a:1,w:"Exposição indevida de dados pessoais é incidente. Restrinja e reporte."}
];

const CHECKLIST = [
 ["Phishing e engenharia social",["Desconfio de urgência, ameaças e prêmios e confiro o domínio do remetente","Não clico em links nem abro anexos inesperados; acesso o site digitando o endereço","Confirmo pedidos de dinheiro ou dados por um segundo canal"]],
 ["Senhas e acesso",["Uso frase-senha longa e única por serviço (gerenciador de senhas)","Ativei MFA no e-mail, banco e sistemas corporativos","Nunca compartilho senha nem código MFA, nem com o \"suporte\""]],
 ["Dispositivos e backup",["Mantenho sistema e aplicativos atualizados e bloqueio a tela ao sair","Faço backup (regra 3-2-1) e testo a restauração","Uso apenas softwares e redes autorizados"]],
 ["Dados pessoais e LGPD",["Coleto e compartilho só o mínimo necessário, para a finalidade informada","Identifico dados sensíveis e os trato com cuidado redobrado","Não envio dados de clientes por canais pessoais"]],
 ["Incidentes e cultura",["Sei a quem reportar (TI e DPO) e reporto na hora, sem medo","Incentivo colegas a adotarem essas práticas"]]
];

const BADGES = [
 ["primeiro","Primeiro golpe barrado","Reporte corretamente um golpe."],
 ["aguia","Olho de águia","Acerte os 4 e-mails de uma fase."],
 ["calma","Sem pressa","Use 2 ferramentas de investigação em 12 e-mails."],
 ["lgpd","Guardião LGPD","Classifique os 10 dados corretamente."],
 ["plano","Plano de ação","Marque 9 itens do checklist."]
];
