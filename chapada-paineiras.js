// Dados do sistema
let isLoggedIn = false;
let atividades = [];
let moradores = [];
let historicoFinanceiro = [];
let regrasData = {
    piscina: [
        "Horário de funcionamento: 6h às 22h",
        "Crianças menores de 12 anos devem estar acompanhadas",
        "Proibido consumo de bebidas alcoólicas",
        "Máximo 10 pessoas por vez"
    ],
    gourmet: [
        "Reserva obrigatória com 48h de antecedência",
        "Limpeza após o uso é responsabilidade do usuário",
        "Som ambiente até 22h",
        "Máximo 20 pessoas"
    ],
    elevadores: [
        "Máximo 6 pessoas ou 450kg",
        "Prioridade para idosos e deficientes",
        "Proibido fumar",
        "Animais devem usar coleira"
    ],
    estacionamento: [
        "Uma vaga por apartamento",
        "Vagas de visitantes: máximo 2h",
        "Proibido lavar veículos",
        "Velocidade máxima: 10 km/h"
    ],
    portaria: [
        "Visitantes devem ser anunciados",
        "Entregadores: horário comercial",
        "Documento obrigatório para entrada",
        "Portão fecha automaticamente às 22h"
    ]
};

let avisosData = [
    {
        id: 1,
        titulo: "Manutenção da Piscina",
        conteudo: "A piscina estará fechada para manutenção nos dias 15 e 16 de dezembro. Pedimos a compreensão de todos.",
        tipo: "info",
        data: "2025-12-10"
    },
    {
        id: 2,
        titulo: "Reunião de Condomínio",
        conteudo: "Reunião extraordinária marcada para o dia 20/12 às 19h no salão de festas. Pauta: aprovação do orçamento 2025.",
        tipo: "warning",
        data: "2025-12-08"
    },
    {
        id: 3,
        titulo: "Problema no Elevador",
        conteudo: "O elevador social está em manutenção. Previsão de retorno: 12/12. Use o elevador de serviço.",
        tipo: "urgent",
        data: "2025-12-05"
    }
];

let mensagensData = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    loadAvisos();
    setupSmoothScrolling();
    setupMobileMenu();
});

function initializeApp() {
    // Verificar se está logado
    const savedLogin = localStorage.getItem('adminLoggedIn');
    if (savedLogin === 'true') {
        isLoggedIn = true;
        showAdminSection();
    }

    // Carregar dados salvos
    const savedRegras = localStorage.getItem('regrasData');
    if (savedRegras) {
        regrasData = JSON.parse(savedRegras);
        updateRegrasDisplay();
    }

    const savedAvisos = localStorage.getItem('avisosData');
    if (savedAvisos) {
        avisosData = JSON.parse(savedAvisos);
    }

    const savedMensagens = localStorage.getItem('mensagensData');
    if (savedMensagens) {
        mensagensData = JSON.parse(savedMensagens);
    }

    const savedAtividades = localStorage.getItem('atividades');
    if (savedAtividades) {
        atividades = JSON.parse(savedAtividades);
    }

    const savedMoradores = localStorage.getItem('moradores');
    if (savedMoradores) {
        moradores = JSON.parse(savedMoradores);
    }

    const savedHistorico = localStorage.getItem('historicoFinanceiro');
    if (savedHistorico) {
        historicoFinanceiro = JSON.parse(savedHistorico);
    }
}

function setupEventListeners() {
    // Menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Admin link
    const adminLink = document.querySelector('.admin-link');
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                showAdminSection();
            } else {
                showLoginModal();
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Modal close
    const modal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.close');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Admin tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Formulário de reclamação
    const reclamacaoForm = document.getElementById('reclamacao-form');
    if (reclamacaoForm) {
        reclamacaoForm.addEventListener('submit', handleReclamacao);
    }

    // Admin forms
    setupAdminForms();
}

function setupMobileMenu() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#admin') return; // Admin é tratado separadamente

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.style.display = 'block';
}

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Credenciais simples (em produção, usar autenticação real)
    if (username === 'reginaldo' && password === 'paineiras2025') {
        isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('login-modal').style.display = 'none';
        showAdminSection();
        showNotification('Login realizado com sucesso!', 'success');
    } else {
        showNotification('Credenciais inválidas!', 'error');
    }
}

function handleLogout() {
    isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('admin').style.display = 'none';
    document.querySelector('body').scrollIntoView({ behavior: 'smooth' });
    showNotification('Logout realizado com sucesso!', 'success');
}

function showAdminSection() {
    const adminSection = document.getElementById('admin');
    adminSection.style.display = 'block';
    adminSection.scrollIntoView({ behavior: 'smooth' });
    loadDashboard();
    loadMensagens();
    loadMoradores();
    loadHistoricoFinanceiro();
}

function switchTab(tabId) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab and corresponding content
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function setupAdminForms() {
    // Adicionar regra
    const adicionarRegraBtn = document.getElementById('adicionar-regra');
    if (adicionarRegraBtn) {
        adicionarRegraBtn.addEventListener('click', adicionarRegra);
    }

    // Adicionar aviso
    const adicionarAvisoBtn = document.getElementById('adicionar-aviso');
    if (adicionarAvisoBtn) {
        adicionarAvisoBtn.addEventListener('click', adicionarAviso);
    }

    // Formulários financeiros
    const boletoForm = document.getElementById('boleto-form');
    if (boletoForm) {
        boletoForm.addEventListener('submit', gerarBoleto);
    }

    const notaForm = document.getElementById('nota-form');
    if (notaForm) {
        notaForm.addEventListener('submit', gerarNotaFiscal);
    }
}

function adicionarRegra() {
    const area = document.getElementById('area-select').value;
    const novaRegra = document.getElementById('nova-regra').value.trim();

    if (!novaRegra) {
        showNotification('Digite uma regra válida!', 'error');
        return;
    }

    regrasData[area].push(novaRegra);
    localStorage.setItem('regrasData', JSON.stringify(regrasData));
    updateRegrasDisplay();
    document.getElementById('nova-regra').value = '';
    showNotification('Regra adicionada com sucesso!', 'success');
}

function updateRegrasDisplay() {
    Object.keys(regrasData).forEach(area => {
        const lista = document.getElementById(`regras-${area}`);
        if (lista) {
            lista.innerHTML = '';
            regrasData[area].forEach((regra, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${regra}
                    ${isLoggedIn ? `<button onclick="removerRegra('${area}', ${index})" class="btn-remove">×</button>` : ''}
                `;
                lista.appendChild(li);
            });
        }
    });
}

function removerRegra(area, index) {
    regrasData[area].splice(index, 1);
    localStorage.setItem('regrasData', JSON.stringify(regrasData));
    updateRegrasDisplay();
    showNotification('Regra removida!', 'success');
}

function adicionarAviso() {
    const titulo = document.getElementById('titulo-aviso').value.trim();
    const conteudo = document.getElementById('conteudo-aviso').value.trim();
    const tipo = document.getElementById('tipo-aviso').value;

    if (!titulo || !conteudo) {
        showNotification('Preencha todos os campos!', 'error');
        return;
    }

    const novoAviso = {
        id: Date.now(),
        titulo,
        conteudo,
        tipo,
        data: new Date().toISOString().split('T')[0]
    };

    avisosData.unshift(novoAviso);
    localStorage.setItem('avisosData', JSON.stringify(avisosData));
    loadAvisos();

    // Limpar formulário
    document.getElementById('titulo-aviso').value = '';
    document.getElementById('conteudo-aviso').value = '';
    document.getElementById('tipo-aviso').value = 'info';

    showNotification('Aviso publicado com sucesso!', 'success');
}

function loadAvisos() {
    const container = document.getElementById('avisos-container');
    if (!container) return;

    container.innerHTML = '';

    avisosData.forEach(aviso => {
        const avisoElement = document.createElement('div');
        avisoElement.className = `aviso-card ${aviso.tipo}`;
        avisoElement.innerHTML = `
            <div class="aviso-header">
                <h3 class="aviso-title">${aviso.titulo}</h3>
                <span class="aviso-date">${formatDate(aviso.data)}</span>
                ${isLoggedIn ? `<button onclick="removerAviso(${aviso.id})" class="btn-remove">×</button>` : ''}
            </div>
            <p>${aviso.conteudo}</p>
        `;
        container.appendChild(avisoElement);
    });
}

function removerAviso(id) {
    avisosData = avisosData.filter(aviso => aviso.id !== id);
    localStorage.setItem('avisosData', JSON.stringify(avisosData));
    loadAvisos();
    showNotification('Aviso removido!', 'success');
}

function handleReclamacao(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const mensagem = {
        id: Date.now(),
        nome: formData.get('nome'),
        apartamento: formData.get('apartamento'),
        tipo: formData.get('tipo'),
        mensagem: formData.get('mensagem'),
        data: new Date().toISOString(),
        status: 'nova'
    };

    mensagensData.unshift(mensagem);
    localStorage.setItem('mensagensData', JSON.stringify(mensagensData));

    e.target.reset();
    showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
}

function loadMensagens() {
    const container = document.getElementById('mensagens-lista');
    if (!container) return;

    container.innerHTML = '';

    if (mensagensData.length === 0) {
        container.innerHTML = '<p>Nenhuma mensagem recebida.</p>';
        return;
    }

    mensagensData.forEach(msg => {
        const msgElement = document.createElement('div');
        msgElement.className = 'mensagem-card';
        msgElement.innerHTML = `
            <div class="mensagem-header">
                <h4>${msg.nome} - Apt. ${msg.apartamento}</h4>
                <span class="mensagem-tipo ${msg.tipo}">${msg.tipo.toUpperCase()}</span>
                <span class="mensagem-data">${formatDateTime(msg.data)}</span>
            </div>
            <p>${msg.mensagem}</p>
            <div class="mensagem-actions">
                <button onclick="marcarComoLida(${msg.id})" class="btn btn-small ${msg.status === 'lida' ? 'btn-secondary' : 'btn-primary'}">
                    ${msg.status === 'lida' ? 'Lida' : 'Marcar como Lida'}
                </button>
                <button onclick="removerMensagem(${msg.id})" class="btn btn-small btn-danger">Remover</button>
            </div>
        `;
        container.appendChild(msgElement);
    });
}

function marcarComoLida(id) {
    const mensagem = mensagensData.find(msg => msg.id === id);
    if (mensagem) {
        mensagem.status = 'lida';
        localStorage.setItem('mensagensData', JSON.stringify(mensagensData));
        loadMensagens();
    }
}

function removerMensagem(id) {
    mensagensData = mensagensData.filter(msg => msg.id !== id);
    localStorage.setItem('mensagensData', JSON.stringify(mensagensData));
    loadMensagens();
    showNotification('Mensagem removida!', 'success');
}

function gerarBoleto(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const dados = {
        nome: formData.get('nome'),
        apartamento: formData.get('apartamento'),
        cpf: formData.get('cpf'),
        valor: parseFloat(formData.get('valor')),
        descricao: formData.get('descricao'),
        vencimento: formData.get('vencimento'),
        tipoCobranca: formData.get('tipo-cobranca')
    };

    // Gerar dados do boleto
    const boletoData = {
        numero: generateBoletoNumber(),
        nossoNumero: generateNossoNumero(),
        codigoBarras: generateCodigoBarras(dados.valor),
        linhaDigitavel: generateLinhaDigitavel(dados.valor),
        ...dados,
        dataGeracao: new Date().toLocaleDateString('pt-BR'),
        dataVencimento: new Date(dados.vencimento).toLocaleDateString('pt-BR')
    };

    // Gerar PDF do boleto
    gerarBoletoPDF(boletoData);

    // Salvar no histórico
    historicoFinanceiro.unshift({
        id: Date.now(),
        tipo: 'boleto',
        numero: boletoData.numero,
        nome: dados.nome,
        apartamento: dados.apartamento,
        valor: dados.valor,
        data: new Date().toISOString(),
        status: 'gerado'
    });

    localStorage.setItem('historicoFinanceiro', JSON.stringify(historicoFinanceiro));

    // Adicionar atividade
    adicionarAtividade(`Boleto gerado para ${dados.nome} - Apt. ${dados.apartamento} - R$ ${dados.valor.toFixed(2)}`);

    e.target.reset();
    loadHistoricoFinanceiro();
    updateDashboardNumbers();
    showNotification('Boleto PDF gerado com sucesso!', 'success');
}

function gerarNotaFiscal(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const dados = {
        nome: formData.get('nome'),
        cpfCnpj: formData.get('cpf-cnpj'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        endereco: formData.get('endereco'),
        valor: parseFloat(formData.get('valor')),
        tipoServico: formData.get('tipo-servico'),
        descricaoServico: formData.get('descricao-servico')
    };

    // Gerar dados da nota fiscal
    const notaData = {
        numero: Math.floor(Math.random() * 100000) + 1,
        serie: '001',
        chaveAcesso: generateChaveAcesso(),
        ...dados,
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        horaEmissao: new Date().toLocaleTimeString('pt-BR'),
        valorIss: (dados.valor * 0.05).toFixed(2), // 5% de ISS
        valorLiquido: (dados.valor * 0.95).toFixed(2)
    };

    // Gerar PDF da nota fiscal
    gerarNotaFiscalPDF(notaData);

    // Salvar no histórico
    historicoFinanceiro.unshift({
        id: Date.now(),
        tipo: 'nota-fiscal',
        numero: notaData.numero,
        nome: dados.nome,
        valor: dados.valor,
        data: new Date().toISOString(),
        status: 'emitida'
    });

    localStorage.setItem('historicoFinanceiro', JSON.stringify(historicoFinanceiro));

    // Adicionar atividade
    adicionarAtividade(`Nota Fiscal emitida para ${dados.nome} - R$ ${dados.valor.toFixed(2)}`);

    e.target.reset();
    loadHistoricoFinanceiro();
    updateDashboardNumbers();
    showNotification('Nota Fiscal PDF gerada com sucesso!', 'success');
}

function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;

    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    `;

    document.body.appendChild(notification);

    // Auto remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Adicionar estilos para animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .btn-remove {
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 10px;
        transition: all 0.3s ease;
    }
    
    .btn-remove:hover {
        background: #c82333;
        transform: scale(1.1);
    }
    
    .mensagem-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
        border-left: 4px solid var(--accent-color);
    }
    
    .mensagem-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .mensagem-tipo {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .mensagem-tipo.reclamacao { background: #ffebee; color: #c62828; }
    .mensagem-tipo.sugestao { background: #e8f5e8; color: #2e7d32; }
    .mensagem-tipo.elogio { background: #fff3e0; color: #ef6c00; }
    .mensagem-tipo.manutencao { background: #e3f2fd; color: #1565c0; }
    
    .mensagem-data {
        color: #666;
        font-size: 0.9rem;
    }
    
    .mensagem-actions {
        margin-top: 1rem;
        display: flex;
        gap: 10px;
    }
    
    .btn-small {
        padding: 6px 12px;
        font-size: 0.8rem;
    }
    
    .btn-danger {
        background: #dc3545;
        color: white;
    }
    
    .btn-danger:hover {
        background: #c82333;
    }
`;
document.head.appendChild(style);

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function updateDashboardNumbers() {
    document.getElementById('mensagens-pendentes').textContent = mensagensData.filter(m => m.status === 'nova').length;
    document.getElementById('avisos-ativos').textContent = avisosData.length;
    document.getElementById('boletos-gerados').textContent = historicoFinanceiro.filter(h => h.tipo === 'boleto').length;
}

function loadAtividades() {
    const container = document.getElementById('atividades-recentes');
    if (!container) return;

    container.innerHTML = '';

    if (atividades.length === 0) {
        container.innerHTML = '<p>Nenhuma atividade recente.</p>';
        return;
    }

    atividades.slice(0, 5).forEach(atividade => {
        const atividadeElement = document.createElement('div');
        atividadeElement.className = 'activity-item';
        atividadeElement.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-clock"></i>
            </div>
            <div class="activity-content">
                <p>${atividade.descricao}</p>
                <span class="activity-time">${formatDateTime(atividade.data)}</span>
            </div>
        `;
        container.appendChild(atividadeElement);
    });
}

function adicionarAtividade(descricao) {
    atividades.unshift({
        id: Date.now(),
        descricao,
        data: new Date().toISOString()
    });

    // Manter apenas as últimas 50 atividades
    if (atividades.length > 50) {
        atividades = atividades.slice(0, 50);
    }

    localStorage.setItem('atividades', JSON.stringify(atividades));
    loadAtividades();
}

// Funções de Geração de PDFs
function gerarBoletoPDF(dados) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurar fonte
    doc.setFont('helvetica');

    // Cabeçalho
    doc.setFontSize(16);
    doc.setTextColor(44, 85, 48); // Verde do condomínio
    doc.text('CONDOMÍNIO CHAPADA DAS PAINEIRAS', 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('CNPJ: 12.345.678/0001-90', 20, 30);
    doc.text('Endereço: Rua das Paineiras, 123 - Chapada', 20, 37);

    // Título do boleto
    doc.setFontSize(18);
    doc.setTextColor(44, 85, 48);
    doc.text('BOLETO DE COBRANÇA', 20, 55);

    // Linha separadora
    doc.setDrawColor(44, 85, 48);
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);

    // Dados do boleto
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Coluna esquerda
    doc.text('Número do Boleto:', 20, 75);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.numero, 20, 82);

    doc.setFont('helvetica', 'normal');
    doc.text('Nosso Número:', 20, 95);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.nossoNumero, 20, 102);

    doc.setFont('helvetica', 'normal');
    doc.text('Data de Vencimento:', 20, 115);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.dataVencimento, 20, 122);

    // Coluna direita
    doc.setFont('helvetica', 'normal');
    doc.text('Data de Geração:', 110, 75);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.dataGeracao, 110, 82);

    doc.setFont('helvetica', 'normal');
    doc.text('Valor do Documento:', 110, 95);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 53, 69); // Vermelho para valor
    doc.text(`R$ ${dados.valor.toFixed(2)}`, 110, 102);

    // Dados do pagador
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('DADOS DO PAGADOR', 20, 140);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 145, 190, 145);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    doc.text('Nome:', 20, 155);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.nome, 35, 155);

    doc.setFont('helvetica', 'normal');
    doc.text('Apartamento:', 20, 165);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.apartamento, 50, 165);

    doc.setFont('helvetica', 'normal');
    doc.text('CPF:', 110, 165);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.cpf, 125, 165);

    // Descrição
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('DESCRIÇÃO DA COBRANÇA', 20, 185);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 190, 190, 190);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    // Quebrar texto longo
    const splitDescription = doc.splitTextToSize(dados.descricao, 170);
    doc.text(splitDescription, 20, 200);

    // Código de barras (simulado)
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('CÓDIGO DE BARRAS', 20, 230);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 235, 190, 235);

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.codigoBarras, 20, 245);

    // Linha digitável
    doc.setFontSize(10);
    doc.setTextColor(44, 85, 48);
    doc.text('LINHA DIGITÁVEL', 20, 260);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.linhaDigitavel, 20, 270);

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Este boleto pode ser pago em qualquer banco ou aplicativo bancário até a data de vencimento.', 20, 285);
    doc.text('Após o vencimento, sujeito a multa e juros conforme legislação vigente.', 20, 292);

    // Salvar PDF
    doc.save(`boleto_${dados.numero}.pdf`);
}

function gerarNotaFiscalPDF(dados) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurar fonte
    doc.setFont('helvetica');

    // Cabeçalho
    doc.setFontSize(16);
    doc.setTextColor(44, 85, 48);
    doc.text('NOTA FISCAL DE SERVIÇOS ELETRÔNICA', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Número: ${dados.numero}`, 20, 30);
    doc.text(`Série: ${dados.serie}`, 80, 30);
    doc.text(`Data: ${dados.dataEmissao}`, 130, 30);
    doc.text(`Hora: ${dados.horaEmissao}`, 170, 30);

    // Chave de acesso
    doc.setFontSize(8);
    doc.text(`Chave de Acesso: ${dados.chaveAcesso}`, 20, 40);

    // Linha separadora
    doc.setDrawColor(44, 85, 48);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Prestador de serviços
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('PRESTADOR DE SERVIÇOS', 20, 55);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 60, 190, 60);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDOMÍNIO CHAPADA DAS PAINEIRAS', 20, 70);

    doc.setFont('helvetica', 'normal');
    doc.text('CNPJ: 12.345.678/0001-90', 20, 77);
    doc.text('Inscrição Municipal: 123456789', 20, 84);
    doc.text('Endereço: Rua das Paineiras, 123 - Chapada - São Paulo/SP', 20, 91);
    doc.text('CEP: 01234-567 | Telefone: (11) 99999-9999', 20, 98);

    // Tomador de serviços
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('TOMADOR DE SERVIÇOS', 20, 115);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 120, 190, 120);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.nome, 20, 130);

    doc.setFont('helvetica', 'normal');
    doc.text(`CPF/CNPJ: ${dados.cpfCnpj}`, 20, 137);
    doc.text(`E-mail: ${dados.email}`, 20, 144);
    doc.text(`Telefone: ${dados.telefone}`, 110, 144);

    // Quebrar endereço se necessário
    const splitEndereco = doc.splitTextToSize(`Endereço: ${dados.endereco}`, 170);
    doc.text(splitEndereco, 20, 151);

    // Discriminação dos serviços
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('DISCRIMINAÇÃO DOS SERVIÇOS', 20, 175);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 180, 190, 180);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    doc.text(`Tipo de Serviço: ${dados.tipoServico}`, 20, 190);

    // Quebrar descrição se necessário
    const splitDescricao = doc.splitTextToSize(`Descrição: ${dados.descricaoServico}`, 170);
    doc.text(splitDescricao, 20, 200);

    // Valores
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('VALORES', 20, 230);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 235, 190, 235);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text('Valor dos Serviços:', 20, 245);
    doc.setFont('helvetica', 'bold');
    doc.text(`R$ ${dados.valor.toFixed(2)}`, 150, 245);

    doc.setFont('helvetica', 'normal');
    doc.text('(-) ISS (5%):', 20, 252);
    doc.setFont('helvetica', 'bold');
    doc.text(`R$ ${dados.valorIss}`, 150, 252);

    doc.setFont('helvetica', 'normal');
    doc.text('Valor Líquido:', 20, 259);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 85, 48);
    doc.text(`R$ ${dados.valorLiquido}`, 150, 259);

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Esta Nota Fiscal foi gerada eletronicamente e possui validade jurídica.', 20, 280);
    doc.text('Consulte a autenticidade no site da Prefeitura Municipal.', 20, 287);

    // Salvar PDF
    doc.save(`nota_fiscal_${dados.numero}.pdf`);
}

// Funções auxiliares para geração de códigos
function generateBoletoNumber() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generateNossoNumero() {
    return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
}

function generateCodigoBarras(valor) {
    const valorFormatted = Math.floor(valor * 100).toString().padStart(10, '0');
    return `34191790010104351004791020150008184560000${valorFormatted}`;
}

function generateLinhaDigitavel(valor) {
    const valorFormatted = Math.floor(valor * 100).toString().padStart(10, '0');
    return `34191.79001 01043.510047 91020.150008 1 84560000${valorFormatted}`;
}

function generateChaveAcesso() {
    return Math.random().toString(36).substr(2, 44).toUpperCase();
}

// Funções de Moradores
function loadMoradores() {
    // Carregar moradores salvos ou criar dados de exemplo
    const savedMoradores = localStorage.getItem('moradores');
    if (savedMoradores) {
        moradores = JSON.parse(savedMoradores);
    } else {
        // Dados de exemplo
        moradores = [
            { id: 1, nome: 'João Silva', apartamento: '101', telefone: '(11) 99999-1111', email: 'joao@email.com', status: 'ativo' },
            { id: 2, nome: 'Maria Santos', apartamento: '102', telefone: '(11) 99999-2222', email: 'maria@email.com', status: 'ativo' },
            { id: 3, nome: 'Pedro Oliveira', apartamento: '201', telefone: '(11) 99999-3333', email: 'pedro@email.com', status: 'ativo' }
        ];
        localStorage.setItem('moradores', JSON.stringify(moradores));
    }

    displayMoradores();
}

function displayMoradores() {
    const container = document.getElementById('moradores-lista');
    if (!container) return;

    container.innerHTML = '';

    moradores.forEach(morador => {
        const moradorElement = document.createElement('div');
        moradorElement.className = 'morador-card';
        moradorElement.innerHTML = `
            <div class="morador-info">
                <h4>${morador.nome}</h4>
                <p><i class="fas fa-home"></i> Apartamento ${morador.apartamento}</p>
                <p><i class="fas fa-phone"></i> ${morador.telefone}</p>
                <p><i class="fas fa-envelope"></i> ${morador.email}</p>
                <span class="status-badge ${morador.status}">${morador.status.toUpperCase()}</span>
            </div>
            <div class="morador-actions">
                <button onclick="editarMorador(${morador.id})" class="btn btn-small btn-secondary">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="removerMorador(${morador.id})" class="btn btn-small btn-danger">
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
        `;
        container.appendChild(moradorElement);
    });
}

function loadHistoricoFinanceiro() {
    const savedHistorico = localStorage.getItem('historicoFinanceiro');
    if (savedHistorico) {
        historicoFinanceiro = JSON.parse(savedHistorico);
    }

    displayHistoricoFinanceiro();
}

function displayHistoricoFinanceiro() {
    const container = document.getElementById('historico-financeiro');
    if (!container) return;

    container.innerHTML = '';

    if (historicoFinanceiro.length === 0) {
        container.innerHTML = '<p>Nenhum documento gerado ainda.</p>';
        return;
    }

    historicoFinanceiro.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'historico-item';
        itemElement.innerHTML = `
            <div class="historico-info">
                <div class="historico-header">
                    <h5>${item.tipo === 'boleto' ? 'Boleto' : 'Nota Fiscal'} #${item.numero}</h5>
                    <span class="historico-date">${formatDateTime(item.data)}</span>
                </div>
                <p><strong>${item.nome}</strong> ${item.apartamento ? `- Apt. ${item.apartamento}` : ''}</p>
                <p class="historico-valor">R$ ${item.valor.toFixed(2)}</p>
            </div>
            <div class="historico-status">
                <span class="status-badge ${item.status}">${item.status.toUpperCase()}</span>
            </div>
        `;
        container.appendChild(itemElement);
    });
}

// Funções do Dashboard
function loadDashboard() {
    updateDashboardNumbers();
    loadAtividades();
}

function updateDashboardNumbers() {
    document.getElementById('mensagens-pendentes').textContent = mensagensData.filter(m => m.status === 'nova').length;
    document.getElementById('avisos-ativos').textContent = avisosData.length;
    document.getElementById('boletos-gerados').textContent = historicoFinanceiro.filter(h => h.tipo === 'boleto').length;
}

function loadAtividades() {
    const container = document.getElementById('atividades-recentes');
    if (!container) return;

    container.innerHTML = '';

    if (atividades.length === 0) {
        container.innerHTML = '<p>Nenhuma atividade recente.</p>';
        return;
    }

    atividades.slice(0, 5).forEach(atividade => {
        const atividadeElement = document.createElement('div');
        atividadeElement.className = 'activity-item';
        atividadeElement.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-clock"></i>
            </div>
            <div class="activity-content">
                <p>${atividade.descricao}</p>
                <span class="activity-time">${formatDateTime(atividade.data)}</span>
            </div>
        `;
        container.appendChild(atividadeElement);
    });
}

function adicionarAtividade(descricao) {
    atividades.unshift({
        id: Date.now(),
        descricao,
        data: new Date().toISOString()
    });

    // Manter apenas as últimas 50 atividades
    if (atividades.length > 50) {
        atividades = atividades.slice(0, 50);
    }

    localStorage.setItem('atividades', JSON.stringify(atividades));
    loadAtividades();
}

// Funções de Geração de PDFs
function gerarBoletoPDF(dados) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurar fonte
    doc.setFont('helvetica');

    // Cabeçalho
    doc.setFontSize(16);
    doc.setTextColor(44, 85, 48); // Verde do condomínio
    doc.text('CONDOMÍNIO CHAPADA DAS PAINEIRAS', 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('CNPJ: 12.345.678/0001-90', 20, 30);
    doc.text('Endereço: Rua das Paineiras, 123 - Chapada', 20, 37);

    // Título do boleto
    doc.setFontSize(18);
    doc.setTextColor(44, 85, 48);
    doc.text('BOLETO DE COBRANÇA', 20, 55);

    // Linha separadora
    doc.setDrawColor(44, 85, 48);
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);

    // Dados do boleto
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Coluna esquerda
    doc.text('Número do Boleto:', 20, 75);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.numero, 20, 82);

    doc.setFont('helvetica', 'normal');
    doc.text('Nosso Número:', 20, 95);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.nossoNumero, 20, 102);

    doc.setFont('helvetica', 'normal');
    doc.text('Data de Vencimento:', 20, 115);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.dataVencimento, 20, 122);

    // Coluna direita
    doc.setFont('helvetica', 'normal');
    doc.text('Data de Geração:', 110, 75);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.dataGeracao, 110, 82);

    doc.setFont('helvetica', 'normal');
    doc.text('Valor do Documento:', 110, 95);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 53, 69); // Vermelho para valor
    doc.text(`R$ ${dados.valor.toFixed(2)}`, 110, 102);

    // Dados do pagador
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('DADOS DO PAGADOR', 20, 140);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 145, 190, 145);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    doc.text('Nome:', 20, 155);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.nome, 35, 155);

    doc.setFont('helvetica', 'normal');
    doc.text('Apartamento:', 20, 165);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.apartamento, 50, 165);

    doc.setFont('helvetica', 'normal');
    doc.text('CPF:', 110, 165);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.cpf, 125, 165);

    // Descrição
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('DESCRIÇÃO DA COBRANÇA', 20, 185);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 190, 190, 190);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    // Quebrar texto longo
    const splitDescription = doc.splitTextToSize(dados.descricao, 170);
    doc.text(splitDescription, 20, 200);

    // Código de barras (simulado)
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('CÓDIGO DE BARRAS', 20, 230);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 235, 190, 235);

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.codigoBarras, 20, 245);

    // Linha digitável
    doc.setFontSize(10);
    doc.setTextColor(44, 85, 48);
    doc.text('LINHA DIGITÁVEL', 20, 260);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.linhaDigitavel, 20, 270);

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Este boleto pode ser pago em qualquer banco ou aplicativo bancário até a data de vencimento.', 20, 285);
    doc.text('Após o vencimento, sujeito a multa e juros conforme legislação vigente.', 20, 292);

    // Salvar PDF
    doc.save(`boleto_${dados.numero}.pdf`);
}

function gerarNotaFiscalPDF(dados) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurar fonte
    doc.setFont('helvetica');

    // Cabeçalho
    doc.setFontSize(16);
    doc.setTextColor(44, 85, 48);
    doc.text('NOTA FISCAL DE SERVIÇOS ELETRÔNICA', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Número: ${dados.numero}`, 20, 30);
    doc.text(`Série: ${dados.serie}`, 80, 30);
    doc.text(`Data: ${dados.dataEmissao}`, 130, 30);
    doc.text(`Hora: ${dados.horaEmissao}`, 170, 30);

    // Chave de acesso
    doc.setFontSize(8);
    doc.text(`Chave de Acesso: ${dados.chaveAcesso}`, 20, 40);

    // Linha separadora
    doc.setDrawColor(44, 85, 48);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    // Prestador de serviços
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('PRESTADOR DE SERVIÇOS', 20, 55);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 60, 190, 60);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDOMÍNIO CHAPADA DAS PAINEIRAS', 20, 70);

    doc.setFont('helvetica', 'normal');
    doc.text('CNPJ: 12.345.678/0001-90', 20, 77);
    doc.text('Inscrição Municipal: 123456789', 20, 84);
    doc.text('Endereço: Rua das Paineiras, 123 - Chapada - São Paulo/SP', 20, 91);
    doc.text('CEP: 01234-567 | Telefone: (11) 99999-9999', 20, 98);

    // Tomador de serviços
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('TOMADOR DE SERVIÇOS', 20, 115);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 120, 190, 120);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.nome, 20, 130);

    doc.setFont('helvetica', 'normal');
    doc.text(`CPF/CNPJ: ${dados.cpfCnpj}`, 20, 137);
    doc.text(`E-mail: ${dados.email}`, 20, 144);
    doc.text(`Telefone: ${dados.telefone}`, 110, 144);

    // Quebrar endereço se necessário
    const splitEndereco = doc.splitTextToSize(`Endereço: ${dados.endereco}`, 170);
    doc.text(splitEndereco, 20, 151);

    // Discriminação dos serviços
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('DISCRIMINAÇÃO DOS SERVIÇOS', 20, 175);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 180, 190, 180);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    doc.text(`Tipo de Serviço: ${dados.tipoServico}`, 20, 190);

    // Quebrar descrição se necessário
    const splitDescricao = doc.splitTextToSize(`Descrição: ${dados.descricaoServico}`, 170);
    doc.text(splitDescricao, 20, 200);

    // Valores
    doc.setFontSize(12);
    doc.setTextColor(44, 85, 48);
    doc.text('VALORES', 20, 230);

    doc.setDrawColor(44, 85, 48);
    doc.line(20, 235, 190, 235);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text('Valor dos Serviços:', 20, 245);
    doc.setFont('helvetica', 'bold');
    doc.text(`R$ ${dados.valor.toFixed(2)}`, 150, 245);

    doc.setFont('helvetica', 'normal');
    doc.text('(-) ISS (5%):', 20, 252);
    doc.setFont('helvetica', 'bold');
    doc.text(`R$ ${dados.valorIss}`, 150, 252);

    doc.setFont('helvetica', 'normal');
    doc.text('Valor Líquido:', 20, 259);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 85, 48);
    doc.text(`R$ ${dados.valorLiquido}`, 150, 259);

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Esta Nota Fiscal foi gerada eletronicamente e possui validade jurídica.', 20, 280);
    doc.text('Consulte a autenticidade no site da Prefeitura Municipal.', 20, 287);

    // Salvar PDF
    doc.save(`nota_fiscal_${dados.numero}.pdf`);
}

// Funções auxiliares para geração de códigos
function generateBoletoNumber() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generateNossoNumero() {
    return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
}

function generateCodigoBarras(valor) {
    const valorFormatted = Math.floor(valor * 100).toString().padStart(10, '0');
    return `34191790010104351004791020150008184560000${valorFormatted}`;
}

function generateLinhaDigitavel(valor) {
    const valorFormatted = Math.floor(valor * 100).toString().padStart(10, '0');
    return `34191.79001 01043.510047 91020.150008 1 84560000${valorFormatted}`;
}

function generateChaveAcesso() {
    return Math.random().toString(36).substr(2, 44).toUpperCase();
}

// Funções de Moradores
function loadMoradores() {
    // Carregar moradores salvos ou criar dados de exemplo
    const savedMoradores = localStorage.getItem('moradores');
    if (savedMoradores) {
        moradores = JSON.parse(savedMoradores);
    } else {
        // Dados de exemplo
        moradores = [
            { id: 1, nome: 'João Silva', apartamento: '101', telefone: '(11) 99999-1111', email: 'joao@email.com', status: 'ativo' },
            { id: 2, nome: 'Maria Santos', apartamento: '102', telefone: '(11) 99999-2222', email: 'maria@email.com', status: 'ativo' },
            { id: 3, nome: 'Pedro Oliveira', apartamento: '201', telefone: '(11) 99999-3333', email: 'pedro@email.com', status: 'ativo' }
        ];
        localStorage.setItem('moradores', JSON.stringify(moradores));
    }

    displayMoradores();
}

function displayMoradores() {
    const container = document.getElementById('moradores-lista');
    if (!container) return;

    container.innerHTML = '';

    moradores.forEach(morador => {
        const moradorElement = document.createElement('div');
        moradorElement.className = 'morador-card';
        moradorElement.innerHTML = `
            <div class="morador-info">
                <h4>${morador.nome}</h4>
                <p><i class="fas fa-home"></i> Apartamento ${morador.apartamento}</p>
                <p><i class="fas fa-phone"></i> ${morador.telefone}</p>
                <p><i class="fas fa-envelope"></i> ${morador.email}</p>
                <span class="status-badge ${morador.status}">${morador.status.toUpperCase()}</span>
            </div>
            <div class="morador-actions">
                <button onclick="editarMorador(${morador.id})" class="btn btn-small btn-secondary">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="removerMorador(${morador.id})" class="btn btn-small btn-danger">
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
        `;
        container.appendChild(moradorElement);
    });
}

function editarMorador(id) {
    const morador = moradores.find(m => m.id === id);
    if (morador) {
        const novoNome = prompt('Nome:', morador.nome);
        const novoApartamento = prompt('Apartamento:', morador.apartamento);
        const novoTelefone = prompt('Telefone:', morador.telefone);
        const novoEmail = prompt('E-mail:', morador.email);

        if (novoNome && novoApartamento && novoTelefone && novoEmail) {
            morador.nome = novoNome;
            morador.apartamento = novoApartamento;
            morador.telefone = novoTelefone;
            morador.email = novoEmail;

            localStorage.setItem('moradores', JSON.stringify(moradores));
            displayMoradores();
            showNotification('Morador atualizado com sucesso!', 'success');
        }
    }
}

function removerMorador(id) {
    if (confirm('Tem certeza que deseja remover este morador?')) {
        moradores = moradores.filter(m => m.id !== id);
        localStorage.setItem('moradores', JSON.stringify(moradores));
        displayMoradores();
        showNotification('Morador removido com sucesso!', 'success');
    }
}

function loadHistoricoFinanceiro() {
    const savedHistorico = localStorage.getItem('historicoFinanceiro');
    if (savedHistorico) {
        historicoFinanceiro = JSON.parse(savedHistorico);
    }

    displayHistoricoFinanceiro();
}

function displayHistoricoFinanceiro() {
    const container = document.getElementById('historico-financeiro');
    if (!container) return;

    container.innerHTML = '';

    if (historicoFinanceiro.length === 0) {
        container.innerHTML = '<p>Nenhum documento gerado ainda.</p>';
        return;
    }

    historicoFinanceiro.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'historico-item';
        itemElement.innerHTML = `
            <div class="historico-info">
                <div class="historico-header">
                    <h5>${item.tipo === 'boleto' ? 'Boleto' : 'Nota Fiscal'} #${item.numero}</h5>
                    <span class="historico-date">${formatDateTime(item.data)}</span>
                </div>
                <p><strong>${item.nome}</strong> ${item.apartamento ? `- Apt. ${item.apartamento}` : ''}</p>
                <p class="historico-valor">R$ ${item.valor.toFixed(2)}</p>
            </div>
            <div class="historico-status">
                <span class="status-badge ${item.status}">${item.status.toUpperCase()}</span>
            </div>
        `;
        container.appendChild(itemElement);
    });
}
     //funções avançadas do admin
let editingMoradorId = null;
let filteredMoradores = [];

function loadMoradores() {
    const savedMoradores = localStorage.getItem('moradores');
    if (savedMoradores) {
        moradores = JSON.parse(savedMoradores);
    } else {
        // Dados de exemplo mais completos
        moradores = [
            {
                id: 1,
                nome: 'João Silva Santos',
                cpf: '123.456.789-00',
                email: 'joao.silva@email.com',
                telefone: '(11) 99999-1111',
                nascimento: '1985-03-15',
                profissao: 'Engenheiro',
                apartamento: '101',
                bloco: 'A',
                tipo: 'proprietario',
                entrada: '2020-01-15',
                status: 'ativo',
                vagas: 1,
                observacoes: 'Síndico anterior'
            },
            {
                id: 2,
                nome: 'Maria Santos Oliveira',
                cpf: '987.654.321-00',
                email: 'maria.santos@email.com',
                telefone: '(11) 99999-2222',
                nascimento: '1990-07-22',
                profissao: 'Médica',
                apartamento: '102',
                bloco: 'A',
                tipo: 'proprietario',
                entrada: '2021-03-10',
                status: 'ativo',
                vagas: 2,
                observacoes: ''
            },
            {
                id: 3,
                nome: 'Pedro Oliveira Costa',
                cpf: '456.789.123-00',
                email: 'pedro.oliveira@email.com',
                telefone: '(11) 99999-3333',
                nascimento: '1978-12-05',
                profissao: 'Advogado',
                apartamento: '201',
                bloco: 'B',
                tipo: 'inquilino',
                entrada: '2022-06-01',
                status: 'ativo',
                vagas: 1,
                observacoes: 'Contrato até 2025'
            }
        ];
        localStorage.setItem('moradores', JSON.stringify(moradores));
    }

    filteredMoradores = [...moradores];
    displayMoradores();
    updateMoradoresStats();
}

function displayMoradores() {
    const container = document.getElementById('moradores-lista');
    if (!container) return;

    container.innerHTML = '';

    if (filteredMoradores.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>Nenhum morador encontrado</h3>
                <p>Adicione novos moradores ou ajuste os filtros de busca.</p>
            </div>
        `;
        return;
    }

    filteredMoradores.forEach(morador => {
        const moradorElement = document.createElement('div');
        moradorElement.className = 'morador-card';
        moradorElement.innerHTML = `
            <div class="morador-header">
                <div class="morador-info">
                    <h4>${morador.nome}</h4>
                </div>
                <div class="morador-apt">Apt ${morador.apartamento}</div>
            </div>
            <div class="morador-details">
                <div class="morador-detail">
                    <i class="fas fa-envelope"></i>
                    <span>${morador.email}</span>
                </div>
                <div class="morador-detail">
                    <i class="fas fa-phone"></i>
                    <span>${morador.telefone}</span>
                </div>
                <div class="morador-detail">
                    <i class="fas fa-briefcase"></i>
                    <span>${morador.profissao || 'Não informado'}</span>
                </div>
                <div class="morador-detail">
                    <i class="fas fa-user-tag"></i>
                    <span>${getTipoLabel(morador.tipo)}</span>
                </div>
                ${morador.vagas ? `
                <div class="morador-detail">
                    <i class="fas fa-car"></i>
                    <span>${morador.vagas} vaga${morador.vagas > 1 ? 's' : ''}</span>
                </div>
                ` : ''}
            </div>
            <div class="morador-footer">
                <span class="status-badge ${morador.status}">${morador.status}</span>
                <div class="morador-actions">
                    <button onclick="editarMorador(${morador.id})" class="btn-icon btn-edit" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="confirmarRemocaoMorador(${morador.id})" class="btn-icon btn-delete" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(moradorElement);
    });
}

function updateMoradoresStats() {
    const totalElement = document.getElementById('total-moradores');
    const ativosElement = document.getElementById('moradores-ativos');

    if (totalElement) totalElement.textContent = moradores.length;
    if (ativosElement) ativosElement.textContent = moradores.filter(m => m.status === 'ativo').length;
}

function getTipoLabel(tipo) {
    const tipos = {
        'proprietario': 'Proprietário',
        'inquilino': 'Inquilino',
        'familiar': 'Familiar'
    };
    return tipos[tipo] || tipo;
}

function showMoradorModal(morador = null) {
    const modal = document.getElementById('morador-modal');
    const title = document.getElementById('morador-modal-title');
    const form = document.getElementById('morador-form');

    if (morador) {
        title.innerHTML = '<i class="fas fa-user-edit"></i> Editar Morador';
        editingMoradorId = morador.id;

        // Preencher formulário
        document.getElementById('morador-nome').value = morador.nome || '';
        document.getElementById('morador-cpf').value = morador.cpf || '';
        document.getElementById('morador-email').value = morador.email || '';
        document.getElementById('morador-telefone').value = morador.telefone || '';
        document.getElementById('morador-nascimento').value = morador.nascimento || '';
        document.getElementById('morador-profissao').value = morador.profissao || '';
        document.getElementById('morador-apartamento').value = morador.apartamento || '';
        document.getElementById('morador-bloco').value = morador.bloco || '';
        document.getElementById('morador-tipo').value = morador.tipo || 'proprietario';
        document.getElementById('morador-entrada').value = morador.entrada || '';
        document.getElementById('morador-status').value = morador.status || 'ativo';
        document.getElementById('morador-vagas').value = morador.vagas || 1;
        document.getElementById('morador-observacoes').value = morador.observacoes || '';
    } else {
        title.innerHTML = '<i class="fas fa-user-plus"></i> Adicionar Morador';
        editingMoradorId = null;
        form.reset();

        // Valores padrão
        document.getElementById('morador-tipo').value = 'proprietario';
        document.getElementById('morador-status').value = 'ativo';
        document.getElementById('morador-vagas').value = 1;
        document.getElementById('morador-entrada').value = new Date().toISOString().split('T')[0];
    }

    modal.style.display = 'block';
}

function saveMorador(formData) {
    const moradorData = {
        nome: formData.get('nome'),
        cpf: formData.get('cpf'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        nascimento: formData.get('nascimento'),
        profissao: formData.get('profissao'),
        apartamento: formData.get('apartamento'),
        bloco: formData.get('bloco'),
        tipo: formData.get('tipo'),
        entrada: formData.get('entrada'),
        status: formData.get('status'),
        vagas: parseInt(formData.get('vagas')) || 1,
        observacoes: formData.get('observacoes')
    };

    if (editingMoradorId) {
        // Editar morador existente
        const index = moradores.findIndex(m => m.id === editingMoradorId);
        if (index !== -1) {
            moradores[index] = { ...moradores[index], ...moradorData };
            adicionarAtividade(`Morador ${moradorData.nome} foi atualizado`);
        }
    } else {
        // Adicionar novo morador
        const newMorador = {
            id: Date.now(),
            ...moradorData
        };
        moradores.push(newMorador);
        adicionarAtividade(`Novo morador ${moradorData.nome} foi adicionado - Apt ${moradorData.apartamento}`);
    }

    localStorage.setItem('moradores', JSON.stringify(moradores));
    filteredMoradores = [...moradores];
    displayMoradores();
    updateMoradoresStats();
    updateDashboardNumbers();

    document.getElementById('morador-modal').style.display = 'none';
    showNotification(editingMoradorId ? 'Morador atualizado com sucesso!' : 'Morador adicionado com sucesso!', 'success');
}

function editarMorador(id) {
    const morador = moradores.find(m => m.id === id);
    if (morador) {
        showMoradorModal(morador);
    }
}

function confirmarRemocaoMorador(id) {
    const morador = moradores.find(m => m.id === id);
    if (morador) {
        showConfirmModal(
            'Remover Morador',
            `Tem certeza que deseja remover ${morador.nome}? Esta ação não pode ser desfeita.`,
            () => removerMorador(id)
        );
    }
}

function removerMorador(id) {
    const morador = moradores.find(m => m.id === id);
    if (morador) {
        moradores = moradores.filter(m => m.id !== id);
        localStorage.setItem('moradores', JSON.stringify(moradores));
        filteredMoradores = [...moradores];
        displayMoradores();
        updateMoradoresStats();
        updateDashboardNumbers();
        adicionarAtividade(`Morador ${morador.nome} foi removido`);
        showNotification('Morador removido com sucesso!', 'success');
    }
}

function filterMoradores() {
    const searchTerm = document.getElementById('search-morador').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;

    filteredMoradores = moradores.filter(morador => {
        const matchesSearch = !searchTerm ||
            morador.nome.toLowerCase().includes(searchTerm) ||
            morador.apartamento.toLowerCase().includes(searchTerm) ||
            morador.email.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusFilter || morador.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    displayMoradores();
}

// Modal de Confirmação
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const titleElement = document.getElementById('confirm-title');
    const messageElement = document.getElementById('confirm-message');
    const confirmBtn = document.getElementById('confirm-ok');

    titleElement.textContent = title;
    messageElement.textContent = message;

    // Remover listeners anteriores
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    // Adicionar novo listener
    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        modal.style.display = 'none';
    });

    modal.style.display = 'block';
}

// Funções de Relatórios Avançadas
function gerarRelatorioMensal() {
    const mes = document.getElementById('mes-relatorio').value;
    const ano = document.getElementById('ano-relatorio').value;

    showLoadingOverlay();

    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Cabeçalho
        doc.setFontSize(18);
        doc.setTextColor(44, 85, 48);
        doc.text('RELATÓRIO MENSAL - CONDOMÍNIO CHAPADA DAS PAINEIRAS', 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Período: ${getMonthName(mes)}/${ano}`, 20, 35);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);

        // Linha separadora
        doc.setDrawColor(44, 85, 48);
        doc.line(20, 50, 190, 50);

        // Estatísticas gerais
        doc.setFontSize(14);
        doc.setTextColor(44, 85, 48);
        doc.text('ESTATÍSTICAS GERAIS', 20, 65);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total de Apartamentos: 48`, 20, 80);
        doc.text(`Moradores Ativos: ${moradores.filter(m => m.status === 'ativo').length}`, 20, 90);
        doc.text(`Avisos Publicados: ${avisosData.length}`, 20, 100);
        doc.text(`Boletos Gerados: ${historicoFinanceiro.filter(h => h.tipo === 'boleto').length}`, 20, 110);

        // Atividades do mês
        doc.setFontSize(14);
        doc.setTextColor(44, 85, 48);
        doc.text('ATIVIDADES DO MÊS', 20, 130);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        let yPos = 145;
        const atividadesMes = atividades.slice(0, 10); // Últimas 10 atividades

        atividadesMes.forEach((atividade, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`• ${atividade.descricao}`, 25, yPos);
            yPos += 10;
        });

        hideLoadingOverlay();
        doc.save(`relatorio_mensal_${mes}_${ano}.pdf`);
        showNotification('Relatório mensal gerado com sucesso!', 'success');
    }, 1000);
}

function gerarRelatorioMoradores() {
    showLoadingOverlay();

    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Cabeçalho
        doc.setFontSize(18);
        doc.setTextColor(44, 85, 48);
        doc.text('LISTA DE MORADORES - CONDOMÍNIO CHAPADA DAS PAINEIRAS', 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
        doc.text(`Total de moradores: ${moradores.length}`, 20, 45);

        // Linha separadora
        doc.setDrawColor(44, 85, 48);
        doc.line(20, 50, 190, 50);

        let yPos = 65;

        moradores.forEach((morador, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${morador.nome}`, 20, yPos);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Apartamento: ${morador.apartamento}`, 20, yPos + 10);
            doc.text(`Telefone: ${morador.telefone}`, 20, yPos + 20);
            doc.text(`E-mail: ${morador.email}`, 20, yPos + 30);
            doc.text(`Status: ${morador.status}`, 120, yPos + 10);
            doc.text(`Tipo: ${getTipoLabel(morador.tipo)}`, 120, yPos + 20);

            if (index < moradores.length - 1) {
                doc.setDrawColor(200, 200, 200);
                doc.line(20, yPos + 35, 190, yPos + 35);
            }

            yPos += 45;
        });

        hideLoadingOverlay();
        doc.save('lista_moradores.pdf');
        showNotification('Lista de moradores gerada com sucesso!', 'success');
    }, 1000);
}

function gerarRelatorioFinanceiro() {
    const dataInicio = document.getElementById('data-inicio').value;
    const dataFim = document.getElementById('data-fim').value;

    if (!dataInicio || !dataFim) {
        showNotification('Selecione as datas de início e fim!', 'error');
        return;
    }

    showLoadingOverlay();

    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Cabeçalho
        doc.setFontSize(18);
        doc.setTextColor(44, 85, 48);
        doc.text('RELATÓRIO FINANCEIRO - CONDOMÍNIO CHAPADA DAS PAINEIRAS', 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Período: ${new Date(dataInicio).toLocaleDateString('pt-BR')} a ${new Date(dataFim).toLocaleDateString('pt-BR')}`, 20, 35);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);

        // Filtrar documentos do período
        const documentosPeriodo = historicoFinanceiro.filter(doc => {
            const docDate = new Date(doc.data);
            return docDate >= new Date(dataInicio) && docDate <= new Date(dataFim);
        });

        // Estatísticas
        const totalBoletos = documentosPeriodo.filter(d => d.tipo === 'boleto').length;
        const totalNotas = documentosPeriodo.filter(d => d.tipo === 'nota-fiscal').length;
        const valorTotal = documentosPeriodo.reduce((sum, doc) => sum + doc.valor, 0);

        doc.setDrawColor(44, 85, 48);
        doc.line(20, 50, 190, 50);

        doc.setFontSize(14);
        doc.setTextColor(44, 85, 48);
        doc.text('RESUMO FINANCEIRO', 20, 65);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Boletos Gerados: ${totalBoletos}`, 20, 80);
        doc.text(`Notas Fiscais Emitidas: ${totalNotas}`, 20, 90);
        doc.text(`Valor Total: R$ ${valorTotal.toFixed(2)}`, 20, 100);

        // Lista de documentos
        if (documentosPeriodo.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(44, 85, 48);
            doc.text('DOCUMENTOS GERADOS', 20, 120);

            let yPos = 135;

            documentosPeriodo.forEach((documento, index) => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                doc.text(`${documento.tipo === 'boleto' ? 'Boleto' : 'Nota Fiscal'} #${documento.numero}`, 20, yPos);
                doc.text(`${documento.nome}`, 20, yPos + 10);
                doc.text(`R$ ${documento.valor.toFixed(2)}`, 150, yPos);
                doc.text(`${new Date(documento.data).toLocaleDateString('pt-BR')}`, 150, yPos + 10);

                yPos += 25;
            });
        }

        hideLoadingOverlay();
        doc.save(`relatorio_financeiro_${dataInicio}_${dataFim}.pdf`);
        showNotification('Relatório financeiro gerado com sucesso!', 'success');
    }, 1000);
}

function fazerBackup() {
    const backupData = {
        moradores,
        avisosData,
        mensagensData,
        historicoFinanceiro,
        atividades,
        regrasData,
        timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `backup_chapada_paineiras_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    showNotification('Backup realizado com sucesso!', 'success');
}

function restaurarBackup() {
    document.getElementById('restore-file').click();
}

// Funções auxiliares
function getMonthName(month) {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[parseInt(month) - 1];
}

function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Event Listeners Avançados
function setupAdvancedEventListeners() {
    // Modal de morador
    const addMoradorBtn = document.getElementById('add-morador-btn');
    if (addMoradorBtn) {
        addMoradorBtn.addEventListener('click', () => showMoradorModal());
    }

    // Formulário de morador
    const moradorForm = document.getElementById('morador-form');
    if (moradorForm) {
        moradorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            saveMorador(formData);
        });
    }

    // Fechar modais
    const closeMoradorModal = document.getElementById('close-morador-modal');
    if (closeMoradorModal) {
        closeMoradorModal.addEventListener('click', () => {
            document.getElementById('morador-modal').style.display = 'none';
        });
    }

    const cancelMorador = document.getElementById('cancel-morador');
    if (cancelMorador) {
        cancelMorador.addEventListener('click', () => {
            document.getElementById('morador-modal').style.display = 'none';
        });
    }

    // Modal de confirmação
    const closeConfirmModal = document.getElementById('close-confirm-modal');
    if (closeConfirmModal) {
        closeConfirmModal.addEventListener('click', () => {
            document.getElementById('confirm-modal').style.display = 'none';
        });
    }

    const confirmCancel = document.getElementById('confirm-cancel');
    if (confirmCancel) {
        confirmCancel.addEventListener('click', () => {
            document.getElementById('confirm-modal').style.display = 'none';
        });
    }

    // Busca e filtros
    const searchMorador = document.getElementById('search-morador');
    if (searchMorador) {
        searchMorador.addEventListener('input', filterMoradores);
    }

    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
        filterStatus.addEventListener('change', filterMoradores);
    }

    // Relatórios
    const gerarRelatorioMensalBtn = document.getElementById('gerar-relatorio-mensal');
    if (gerarRelatorioMensalBtn) {
        gerarRelatorioMensalBtn.addEventListener('click', gerarRelatorioMensal);
    }

    const gerarRelatorioMoradoresBtn = document.getElementById('gerar-relatorio-moradores');
    if (gerarRelatorioMoradoresBtn) {
        gerarRelatorioMoradoresBtn.addEventListener('click', gerarRelatorioMoradores);
    }

    const gerarRelatorioFinanceiroBtn = document.getElementById('gerar-relatorio-financeiro');
    if (gerarRelatorioFinanceiroBtn) {
        gerarRelatorioFinanceiroBtn.addEventListener('click', gerarRelatorioFinanceiro);
    }

    // Backup
    const backupBtn = document.getElementById('backup-dados');
    if (backupBtn) {
        backupBtn.addEventListener('click', fazerBackup);
    }

    const restoreBtn = document.getElementById('restore-dados');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', restaurarBackup);
    }

    // Restaurar arquivo
    const restoreFile = document.getElementById('restore-file');
    if (restoreFile) {
        restoreFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const backupData = JSON.parse(event.target.result);

                        // Restaurar dados
                        if (backupData.moradores) moradores = backupData.moradores;
                        if (backupData.avisosData) avisosData = backupData.avisosData;
                        if (backupData.mensagensData) mensagensData = backupData.mensagensData;
                        if (backupData.historicoFinanceiro) historicoFinanceiro = backupData.historicoFinanceiro;
                        if (backupData.atividades) atividades = backupData.atividades;
                        if (backupData.regrasData) regrasData = backupData.regrasData;

                        // Salvar no localStorage
                        localStorage.setItem('moradores', JSON.stringify(moradores));
                        localStorage.setItem('avisosData', JSON.stringify(avisosData));
                        localStorage.setItem('mensagensData', JSON.stringify(mensagensData));
                        localStorage.setItem('historicoFinanceiro', JSON.stringify(historicoFinanceiro));
                        localStorage.setItem('atividades', JSON.stringify(atividades));
                        localStorage.setItem('regrasData', JSON.stringify(regrasData));

                        // Recarregar dados
                        filteredMoradores = [...moradores];
                        displayMoradores();
                        updateMoradoresStats();
                        loadAvisos();
                        loadMensagens();
                        loadHistoricoFinanceiro();
                        updateRegrasDisplay();
                        updateDashboardNumbers();

                        showNotification('Backup restaurado com sucesso!', 'success');
                    } catch (error) {
                        showNotification('Erro ao restaurar backup. Arquivo inválido.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        });
    }
}

// Inicializar event listeners avançados
document.addEventListener('DOMContentLoaded', function () {
    setupAdvancedEventListeners();
});