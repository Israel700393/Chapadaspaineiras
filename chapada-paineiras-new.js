// Sistema Completo do Condomínio Chapada das Paineiras
// Dados do sistema
let isLoggedIn = false;
let currentTheme = localStorage.getItem('theme') || 'light';
let atividades = [];
let moradores = [];
let historicoFinanceiro = [];
let editingMoradorId = null;
let filteredMoradores = [];

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
        conteudo: "A piscina estará fechada para manutenção nos dias 15 e 16 de dezembro.",
        tipo: "info",
        data: "2025-12-10"
    },
    {
        id: 2,
        titulo: "Reunião de Condomínio", 
        conteudo: "Reunião extraordinária marcada para o dia 20/12 às 19h no salão de festas.",
        tipo: "warning",
        data: "2025-12-08"
    }
];

let mensagensData = [];// 
    // SISTEMA DE TEMA DARK/LIGHT 
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton();
    
    // Aplicar tema aos elementos existentes
    applyThemeToElements();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeButton();
    
    // Animação suave de transição
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
    
    applyThemeToElements();
    showNotification(`Tema ${currentTheme === 'dark' ? 'escuro' : 'claro'} ativado!`, 'success');
}

function updateThemeButton() {
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        themeButton.innerHTML = currentTheme === 'light' ? '🌙 Escuro' : '☀️ Claro';
        themeButton.title = `Mudar para tema ${currentTheme === 'light' ? 'escuro' : 'claro'}`;
    }
}

function applyThemeToElements() {
    // Aplicar tema a elementos dinâmicos
    const dynamicElements = document.querySelectorAll('.dynamic-theme');
    dynamicElements.forEach(element => {
        if (currentTheme === 'dark') {
            element.classList.add('dark-theme');
        } else {
            element.classList.remove('dark-theme');
        }
    });
}

function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        if (!localStorage.getItem('theme')) {
            currentTheme = 'dark';
            initializeTheme();
        }
    }
}

// ===== INICIALIZAÇÃO DO SISTEMA =====
function initializeApp() {
    // Verificar se está logado
    const savedLogin = localStorage.getItem('adminLoggedIn');
    if (savedLogin === 'true') {
        isLoggedIn = true;
        showAdminSection();
    }

    // Carregar dados salvos
    loadSavedData();
    
    // Inicializar tema
    initializeTheme();
    detectSystemTheme();
}

function loadSavedData() {
    // Carregar regras
    const savedRegras = localStorage.getItem('regrasData');
    if (savedRegras) {
        regrasData = JSON.parse(savedRegras);
        updateRegrasDisplay();
    }

    // Carregar avisos
    const savedAvisos = localStorage.getItem('avisosData');
    if (savedAvisos) {
        avisosData = JSON.parse(savedAvisos);
    }

    // Carregar mensagens
    const savedMensagens = localStorage.getItem('mensagensData');
    if (savedMensagens) {
        mensagensData = JSON.parse(savedMensagens);
    }

    // Carregar atividades
    const savedAtividades = localStorage.getItem('atividades');
    if (savedAtividades) {
        atividades = JSON.parse(savedAtividades);
    }

    // Carregar moradores
    const savedMoradores = localStorage.getItem('moradores');
    if (savedMoradores) {
        moradores = JSON.parse(savedMoradores);
    } else {
        createDefaultMoradores();
    }

    // Carregar histórico financeiro
    const savedHistorico = localStorage.getItem('historicoFinanceiro');
    if (savedHistorico) {
        historicoFinanceiro = JSON.parse(savedHistorico);
    }
}

function createDefaultMoradores() {
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
        }
    ];
    localStorage.setItem('moradores', JSON.stringify(moradores));
}//
 //EVENT LISTENERS 
function setupEventListeners() {
    // Menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Fechar menu mobile ao clicar em link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Tema toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
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
    setupModalEventListeners();

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
    
    // Smooth scrolling
    setupSmoothScrolling();
}

function setupModalEventListeners() {
    // Login modal
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

    // Morador modal
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

    // Confirm modal
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
}

function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#admin') return;
            
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

// ===== SISTEMA DE LOGIN =====
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.style.display = 'block';
    modal.classList.add('show');
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'sindico' && password === 'paineiras2025') {
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

// ===== SISTEMA DE TABS =====
function switchTab(tabId) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
    
    // Carregar dados específicos da tab
    switch(tabId) {
        case 'dashboard-tab':
            loadDashboard();
            break;
        case 'moradores-tab':
            loadMoradores();
            break;
        case 'mensagens-tab':
            loadMensagens();
            break;
        case 'financeiro-tab':
            loadHistoricoFinanceiro();
            break;
        case 'relatorios-tab':
            updateRelatoriosStats();
            break;
    }
}// ==
// DASHBOARD 
function loadDashboard() {
    updateDashboardNumbers();
    loadAtividades();
}

function updateDashboardNumbers() {
    const totalApartamentos = document.getElementById('total-apartamentos');
    const mensagensPendentes = document.getElementById('mensagens-pendentes');
    const avisosAtivos = document.getElementById('avisos-ativos');
    const boletosGerados = document.getElementById('boletos-gerados');
    
    if (totalApartamentos) totalApartamentos.textContent = '48';
    if (mensagensPendentes) mensagensPendentes.textContent = mensagensData.filter(m => m.status === 'nova').length;
    if (avisosAtivos) avisosAtivos.textContent = avisosData.length;
    if (boletosGerados) boletosGerados.textContent = historicoFinanceiro.filter(h => h.tipo === 'boleto').length;
}

function loadAtividades() {
    const container = document.getElementById('atividades-recentes');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (atividades.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhuma atividade recente.</p>';
        return;
    }
    
    atividades.slice(0, 5).forEach(atividade => {
        const atividadeElement = document.createElement('div');
        atividadeElement.className = 'activity-item dynamic-theme';
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
    
    applyThemeToElements();
}

function adicionarAtividade(descricao) {
    atividades.unshift({
        id: Date.now(),
        descricao,
        data: new Date().toISOString()
    });
    
    if (atividades.length > 50) {
        atividades = atividades.slice(0, 50);
    }
    
    localStorage.setItem('atividades', JSON.stringify(atividades));
    loadAtividades();
    updateDashboardNumbers();
}

// ===== GESTÃO DE MORADORES =====
function loadMoradores() {
    filteredMoradores = [...moradores];
    displayMoradores();
    updateMoradoresStats();
    setupMoradoresEventListeners();
}

function displayMoradores() {
    const container = document.getElementById('moradores-lista');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredMoradores.length === 0) {
        container.innerHTML = `
            <div class="empty-state dynamic-theme">
                <i class="fas fa-users"></i>
                <h3>Nenhum morador encontrado</h3>
                <p>Adicione novos moradores ou ajuste os filtros de busca.</p>
            </div>
        `;
        applyThemeToElements();
        return;
    }
    
    filteredMoradores.forEach((morador, index) => {
        const moradorElement = document.createElement('div');
        moradorElement.className = 'morador-card dynamic-theme';
        moradorElement.style.animationDelay = `${index * 0.1}s`;
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
    
    applyThemeToElements();
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

function setupMoradoresEventListeners() {
    // Adicionar morador
    const addMoradorBtn = document.getElementById('add-morador-btn');
    if (addMoradorBtn) {
        addMoradorBtn.onclick = () => showMoradorModal();
    }
    
    // Busca
    const searchMorador = document.getElementById('search-morador');
    if (searchMorador) {
        searchMorador.oninput = filterMoradores;
    }
    
    // Filtro de status
    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
        filterStatus.onchange = filterMoradores;
    }
    
    // Formulário de morador
    const moradorForm = document.getElementById('morador-form');
    if (moradorForm) {
        moradorForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            saveMorador(formData);
        };
    }
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
    modal.classList.add('show');
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
        const index = moradores.findIndex(m => m.id === editingMoradorId);
        if (index !== -1) {
            moradores[index] = { ...moradores[index], ...moradorData };
            adicionarAtividade(`Morador ${moradorData.nome} foi atualizado`);
        }
    } else {
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
//SISTEMA DE REGRAS
function setupAdminForms() {
    // Adicionar regra
    const adicionarRegraBtn = document.getElementById('adicionar-regra');
    if (adicionarRegraBtn) {
        adicionarRegraBtn.onclick = adicionarRegra;
    }

    // Adicionar aviso
    const adicionarAvisoBtn = document.getElementById('adicionar-aviso');
    if (adicionarAvisoBtn) {
        adicionarAvisoBtn.onclick = adicionarAviso;
    }

    // Formulários financeiros
    const boletoForm = document.getElementById('boleto-form');
    if (boletoForm) {
        boletoForm.onsubmit = gerarBoleto;
    }

    const notaForm = document.getElementById('nota-form');
    if (notaForm) {
        notaForm.onsubmit = gerarNotaFiscal;
    }

    // Relatórios
    setupRelatoriosEventListeners();
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
    adicionarAtividade(`Nova regra adicionada para ${area}: ${novaRegra}`);
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
    const regra = regrasData[area][index];
    regrasData[area].splice(index, 1);
    localStorage.setItem('regrasData', JSON.stringify(regrasData));
    updateRegrasDisplay();
    adicionarAtividade(`Regra removida de ${area}: ${regra}`);
    showNotification('Regra removida!', 'success');
}

// ===== SISTEMA DE AVISOS =====
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
    
    document.getElementById('titulo-aviso').value = '';
    document.getElementById('conteudo-aviso').value = '';
    document.getElementById('tipo-aviso').value = 'info';
    
    adicionarAtividade(`Novo aviso publicado: ${titulo}`);
    showNotification('Aviso publicado com sucesso!', 'success');
}

function loadAvisos() {
    const container = document.getElementById('avisos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    avisosData.forEach(aviso => {
        const avisoElement = document.createElement('div');
        avisoElement.className = `aviso-card ${aviso.tipo} dynamic-theme`;
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
    
    applyThemeToElements();
}

function removerAviso(id) {
    const aviso = avisosData.find(a => a.id === id);
    avisosData = avisosData.filter(aviso => aviso.id !== id);
    localStorage.setItem('avisosData', JSON.stringify(avisosData));
    loadAvisos();
    updateDashboardNumbers();
    if (aviso) {
        adicionarAtividade(`Aviso removido: ${aviso.titulo}`);
    }
    showNotification('Aviso removido!', 'success');
}

// ===== SISTEMA DE MENSAGENS =====
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
    adicionarAtividade(`Nova mensagem recebida de ${mensagem.nome} - Apt ${mensagem.apartamento}`);
    showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
}

function loadMensagens() {
    const container = document.getElementById('mensagens-lista');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (mensagensData.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhuma mensagem recebida.</p>';
        return;
    }
    
    mensagensData.forEach(msg => {
        const msgElement = document.createElement('div');
        msgElement.className = 'mensagem-card dynamic-theme';
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
    
    applyThemeToElements();
}

function marcarComoLida(id) {
    const mensagem = mensagensData.find(msg => msg.id === id);
    if (mensagem) {
        mensagem.status = 'lida';
        localStorage.setItem('mensagensData', JSON.stringify(mensagensData));
        loadMensagens();
        updateDashboardNumbers();
    }
}

function removerMensagem(id) {
    const mensagem = mensagensData.find(msg => msg.id === id);
    mensagensData = mensagensData.filter(msg => msg.id !== id);
    localStorage.setItem('mensagensData', JSON.stringify(mensagensData));
    loadMensagens();
    updateDashboardNumbers();
    if (mensagem) {
        adicionarAtividade(`Mensagem removida de ${mensagem.nome}`);
    }
    showNotification('Mensagem removida!', 'success');
}

// ===== SISTEMA FINANCEIRO =====
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
    
    const boletoData = {
        numero: generateBoletoNumber(),
        nossoNumero: generateNossoNumero(),
        codigoBarras: generateCodigoBarras(dados.valor),
        linhaDigitavel: generateLinhaDigitavel(dados.valor),
        ...dados,
        dataGeracao: new Date().toLocaleDateString('pt-BR'),
        dataVencimento: new Date(dados.vencimento).toLocaleDateString('pt-BR')
    };
    
    gerarBoletoPDF(boletoData);
    
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
    adicionarAtividade(`Boleto gerado para ${dados.nome} - Apt. ${dados.apartamento} - R$ ${dados.valor.toFixed(2)}`);
    
    e.target.reset();
    loadHistoricoFinanceiro();
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
    
    const notaData = {
        numero: Math.floor(Math.random() * 100000) + 1,
        serie: '001',
        chaveAcesso: generateChaveAcesso(),
        ...dados,
        dataEmissao: new Date().toLocaleDateString('pt-BR'),
        horaEmissao: new Date().toLocaleTimeString('pt-BR'),
        valorIss: (dados.valor * 0.05).toFixed(2),
        valorLiquido: (dados.valor * 0.95).toFixed(2)
    };
    
    gerarNotaFiscalPDF(notaData);
    
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
    adicionarAtividade(`Nota Fiscal emitida para ${dados.nome} - R$ ${dados.valor.toFixed(2)}`);
    
    e.target.reset();
    loadHistoricoFinanceiro();
    showNotification('Nota Fiscal PDF gerada com sucesso!', 'success');
}

function loadHistoricoFinanceiro() {
    const container = document.getElementById('historico-financeiro');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (historicoFinanceiro.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum documento gerado ainda.</p>';
        return;
    }
    
    historicoFinanceiro.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'historico-item dynamic-theme';
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
    
    applyThemeToElements();
}// 
//SISTEMA DE RELATÓRIOS
function setupRelatoriosEventListeners() {
    const gerarRelatorioMensalBtn = document.getElementById('gerar-relatorio-mensal');
    if (gerarRelatorioMensalBtn) {
        gerarRelatorioMensalBtn.onclick = gerarRelatorioMensal;
    }
    
    const gerarRelatorioMoradoresBtn = document.getElementById('gerar-relatorio-moradores');
    if (gerarRelatorioMoradoresBtn) {
        gerarRelatorioMoradoresBtn.onclick = gerarRelatorioMoradores;
    }
    
    const gerarRelatorioFinanceiroBtn = document.getElementById('gerar-relatorio-financeiro');
    if (gerarRelatorioFinanceiroBtn) {
        gerarRelatorioFinanceiroBtn.onclick = gerarRelatorioFinanceiro;
    }
    
    const backupBtn = document.getElementById('backup-dados');
    if (backupBtn) {
        backupBtn.onclick = fazerBackup;
    }
    
    const restoreBtn = document.getElementById('restore-dados');
    if (restoreBtn) {
        restoreBtn.onclick = () => document.getElementById('restore-file').click();
    }
    
    const restoreFile = document.getElementById('restore-file');
    if (restoreFile) {
        restoreFile.onchange = handleRestoreFile;
    }
}

function updateRelatoriosStats() {
    const receitaMensal = document.getElementById('receita-mensal');
    const taxaInadimplencia = document.getElementById('taxa-inadimplencia');
    const totalManutencoes = document.getElementById('total-manutencoes');
    
    if (receitaMensal) {
        const receita = historicoFinanceiro.reduce((sum, item) => sum + item.valor, 0);
        receitaMensal.textContent = `R$ ${receita.toFixed(2)}`;
    }
    
    if (taxaInadimplencia) {
        taxaInadimplencia.textContent = '5%'; // Simulado
    }
    
    if (totalManutencoes) {
        const manutencoes = mensagensData.filter(m => m.tipo === 'manutencao').length;
        totalManutencoes.textContent = manutencoes;
    }
}

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
        
        doc.setDrawColor(44, 85, 48);
        doc.line(20, 50, 190, 50);
        
        doc.setFontSize(14);
        doc.setTextColor(44, 85, 48);
        doc.text('ESTATÍSTICAS GERAIS', 20, 65);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total de Apartamentos: 48`, 20, 80);
        doc.text(`Moradores Ativos: ${moradores.filter(m => m.status === 'ativo').length}`, 20, 90);
        doc.text(`Avisos Publicados: ${avisosData.length}`, 20, 100);
        doc.text(`Boletos Gerados: ${historicoFinanceiro.filter(h => h.tipo === 'boleto').length}`, 20, 110);
        
        doc.setFontSize(14);
        doc.setTextColor(44, 85, 48);
        doc.text('ATIVIDADES DO MÊS', 20, 130);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        let yPos = 145;
        const atividadesMes = atividades.slice(0, 10);
        
        atividadesMes.forEach((atividade) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`• ${atividade.descricao}`, 25, yPos);
            yPos += 10;
        });
        
        hideLoadingOverlay();
        doc.save(`relatorio_mensal_${mes}_${ano}.pdf`);
        adicionarAtividade(`Relatório mensal gerado para ${getMonthName(mes)}/${ano}`);
        showNotification('Relatório mensal gerado com sucesso!', 'success');
    }, 1000);
}

function gerarRelatorioMoradores() {
    showLoadingOverlay();
    
    setTimeout(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.setTextColor(44, 85, 48);
        doc.text('LISTA DE MORADORES - CONDOMÍNIO CHAPADA DAS PAINEIRAS', 20, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
        doc.text(`Total de moradores: ${moradores.length}`, 20, 45);
        
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
        adicionarAtividade('Lista de moradores gerada em PDF');
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
        
        doc.setFontSize(18);
        doc.setTextColor(44, 85, 48);
        doc.text('RELATÓRIO FINANCEIRO - CONDOMÍNIO CHAPADA DAS PAINEIRAS', 20, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Período: ${new Date(dataInicio).toLocaleDateString('pt-BR')} a ${new Date(dataFim).toLocaleDateString('pt-BR')}`, 20, 35);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
        
        const documentosPeriodo = historicoFinanceiro.filter(doc => {
            const docDate = new Date(doc.data);
            return docDate >= new Date(dataInicio) && docDate <= new Date(dataFim);
        });
        
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
        
        if (documentosPeriodo.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(44, 85, 48);
            doc.text('DOCUMENTOS GERADOS', 20, 120);
            
            let yPos = 135;
            
            documentosPeriodo.forEach((documento) => {
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
        adicionarAtividade(`Relatório financeiro gerado para período ${dataInicio} a ${dataFim}`);
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
    
    adicionarAtividade('Backup completo do sistema realizado');
    showNotification('Backup realizado com sucesso!', 'success');
}

function handleRestoreFile(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backupData = JSON.parse(event.target.result);
                
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
                
                adicionarAtividade('Sistema restaurado a partir de backup');
                showNotification('Backup restaurado com sucesso!', 'success');
            } catch (error) {
                showNotification('Erro ao restaurar backup. Arquivo inválido.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// ===== MODAL DE CONFIRMAÇÃO =====
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const titleElement = document.getElementById('confirm-title');
    const messageElement = document.getElementById('confirm-message');
    const confirmBtn = document.getElementById('confirm-ok');
    
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.onclick = () => {
        onConfirm();
        modal.style.display = 'none';
    };
    
    modal.style.display = 'block';
    modal.classList.add('show');
}

// ===== FUNÇÕES AUXILIARES =====
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

function getMonthName(month) {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[parseInt(month) - 1];
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overoading-overlay;
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
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
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
} 
// GERAÇÃO DE PDFs 
function gerarBoletoPDF(dados) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurar fonte
    doc.setFont('helvetica');
    
    // Cabeçalho
    doc.setFontSize(16);
    doc.setTextColor(44, 85, 48);
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
    doc.setTextColor(220, 53, 69);
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
    
    const splitDescription = doc.splitTextToSize(dados.descricao, 170);
    doc.text(splitDescription, 20, 200);
    
    // Código de barras
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
    
    doc.save(`nota_fiscal_${dados.numero}.pdf`);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadAvisos();
    updateRegrasDisplay();
    
    // Escutar mudanças na preferência do sistema
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                currentTheme = e.matches ? 'dark' : 'light';
                initializeTheme();
            }
        });
    }
});

// Adicionar estilos para animações
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
    
    .empty-message {
        text-align: center;
        color: var(--gray-medium);
        font-style: italic;
        padding: 2rem;
    }
    
    .modal.show .modal-content {
        animation: modalSlideIn 0.3s ease-out;
    }
    
    .morador-card {
        animation: cardSlideIn 0.3s ease-out;
    }
    
    .morador-card:nth-child(even) {
        animation-delay: 0.1s;
    }
    
    .morador-card:nth-child(3n) {
        animation-delay: 0.2s;
    }
`;

document.head.appendChild(style);
