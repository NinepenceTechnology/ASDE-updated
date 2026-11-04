const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'data', 'initialData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Remove all Unsplash avatar URLs and replace with empty string ''
content = content.replace(/avatar:\s*['"]https:\/\/images\.unsplash\.com[^'"]+['"]/g, "avatar: ''");

// 2. Replace Brazilian phone numbers with Mozambican (+258)
content = content.replace(/\+55 \(11\) 98721-3344/g, '+258 84 335 7973');
content = content.replace(/\+55 \(11\) 97654-2211/g, '+258 87 541 1436');
content = content.replace(/\+55 \(11\) 99182-4455/g, '+258 85 335 7973');
content = content.replace(/\+55 \(11\) 99345-6789/g, '+258 84 634 8589');
content = content.replace(/\+55 \(11\) 98112-9900/g, '+258 84 123 4567');
content = content.replace(/\+55 \(11\) 97223-1122/g, '+258 87 987 6543');
content = content.replace(/\+55 \(11\) 99445-8877/g, '+258 85 554 3321');
content = content.replace(/\+55 \(11\) 98334-0011/g, '+258 84 776 5544');
content = content.replace(/\+55 \(11\) 99122-3300/g, '+258 86 332 1100');
content = content.replace(/\+55 \(11\) 97788-9911/g, '+258 84 990 1234');
content = content.replace(/\+55 \(11\) 98833-2211/g, '+258 87 112 3344');
content = content.replace(/\+55 \(11\) 99882-3344/g, '+258 85 998 7766');

// 3. Replace emails to Mozambican domains
content = content.replace(/@linguabridge\.edu/g, '@asde.co.mz');
content = content.replace(/@techcorp\.com\.br/g, '@empresa.co.mz');
content = content.replace(/@academico\.br/g, '@estudante.co.mz');

// 4. Update tuition values to Meticais (MT)
content = content.replace(/tuitionValue: 480,/g, 'tuitionValue: 3500,');
content = content.replace(/tuitionValue: 520,/g, 'tuitionValue: 3500,');
content = content.replace(/tuitionValue: 690,/g, 'tuitionValue: 4200,');
content = content.replace(/tuitionValue: 460,/g, 'tuitionValue: 2800,');
content = content.replace(/tuitionValue: 750,/g, 'tuitionValue: 4800,');

// 5. Update invoices to Meticais and Mozambican bank/mobile payment methods
content = content.replace(
  /amount: 480\.0,\s*dueDate: '10\/06\/2025',\s*paidDate: '08\/06\/2025',\s*status: 'paid',\s*method: 'Pix',/g,
  "amount: 3500.0, dueDate: '10/06/2025', paidDate: '08/06/2025', status: 'paid', method: 'Transferência BIM',"
);
content = content.replace(
  /amount: 520\.0,\s*dueDate: '10\/06\/2025',\s*paidDate: '09\/06\/2025',\s*status: 'paid',\s*method: 'Cartão de Crédito',/g,
  "amount: 3500.0, dueDate: '10/06/2025', paidDate: '09/06/2025', status: 'paid', method: 'Depósito Bancário',"
);
content = content.replace(
  /amount: 520\.0,\s*dueDate: '15\/06\/2025',\s*status: 'pending',/g,
  "amount: 3500.0, dueDate: '15/06/2025', status: 'pending',"
);
content = content.replace(
  /amount: 520\.0,\s*dueDate: '20\/05\/2025',\s*status: 'overdue',/g,
  "amount: 3500.0, dueDate: '20/05/2025', status: 'overdue',"
);
content = content.replace(
  /amount: 690\.0,\s*dueDate: '05\/06\/2025',\s*paidDate: '04\/06\/2025',\s*status: 'paid',\s*method: 'Pix',/g,
  "amount: 4200.0, dueDate: '05/06/2025', paidDate: '04/06/2025', status: 'paid', method: 'Transferência BIM',"
);
content = content.replace(
  /amount: 460\.0,\s*dueDate: '10\/06\/2025',\s*paidDate: '10\/06\/2025',\s*status: 'paid',\s*method: 'Boleto Bancário',/g,
  "amount: 2800.0, dueDate: '10/06/2025', paidDate: '10/06/2025', status: 'paid', method: 'M-Pesa',"
);

// 6. Ensure INSTITUTIONAL_PROFILE is exported from initialData as well
if (!content.includes('export { INSTITUTIONAL_PROFILE }')) {
  content = "export { INSTITUTIONAL_PROFILE } from './institutionalData';\n" + content;
}

// 7. Add rich beginner lessons to Unit 1
const beginnerLessonsToAdd = `
      {
        id: 'les-102',
        unitId: 'u-1',
        unitNumber: 1,
        title: 'The English Alphabet, Phonics & Spelling Names',
        subtitle: 'Domine a pronúncia de cada letra de A a Z e soletre nomes, e-mails e siglas com precisão.',
        level: 'A1',
        estimatedMinutes: 12,
        xpValue: 120,
        grammarFocus: 'Pronúncia das vogais inglesas (A /eɪ/, E /iː/, I /aɪ/, O /oʊ/, U /juː/) • Distinção fonética B/V e G/J',
        vocabulary: [
          {
            id: 'v-b1',
            word: 'Spell',
            phonetic: '/spel/',
            translation: 'Soletrar',
            partOfSpeech: 'verb',
            exampleSentence: 'Could you please spell your last name for the registration?',
            exampleTranslation: 'Poderia por favor soletrar seu sobrenome para a matrícula?',
          },
          {
            id: 'v-b2',
            word: 'Vowel',
            phonetic: '/vaʊ.əl/',
            translation: 'Vogal',
            partOfSpeech: 'noun',
            exampleSentence: 'English has five written vowels: A, E, I, O and U.',
            exampleTranslation: 'O inglês possui cinco vogais escritas: A, E, I, O e U.',
          },
          {
            id: 'v-b3',
            word: 'Consonant',
            phonetic: '/ˈkɒn.sə.nənt/',
            translation: 'Consoante',
            partOfSpeech: 'noun',
            exampleSentence: 'The consonant sound /th/ requires placing your tongue between your teeth.',
            exampleTranslation: 'O som da consoante /th/ exige colocar a língua entre os dentes.',
          },
          {
            id: 'v-b4',
            word: 'Alphabet',
            phonetic: '/ˈæl.fə.bet/',
            translation: 'Alfabeto',
            partOfSpeech: 'noun',
            exampleSentence: 'There are 26 letters in the English alphabet.',
            exampleTranslation: 'Há 26 letras no alfabeto da língua inglesa.',
          },
        ],
        dialogue: [
          {
            id: 'd-b1',
            speaker: 'Secretary (CFPA)',
            speakerRole: 'partner',
            text: 'Welcome to ASDE Professional Training Center! How do you spell your first name?',
            translation: 'Bem-vindo ao Centro de Formação ASDE! Como você soletra seu primeiro nome?',
            suggestedReplyTips: ['It is M-A-R-I-A.', 'Let me spell it: L-U-C-A-S.'],
          },
          {
            id: 'd-b2',
            speaker: 'You (Student)',
            speakerRole: 'user',
            text: 'My name is Lucas: L-U-C-A-S, and my email is lucas@asde.co.mz.',
            translation: 'Meu nome é Lucas: L-U-C-A-S, e meu e-mail é lucas@asde.co.mz.',
          },
        ],
        pronunciationPrompts: [
          {
            phrase: 'Could you spell that for me, please?',
            phoneticTips: 'Ligue o som: /kʊd-juː spel ðæt fɔːr miː pliːz/.',
            translation: 'Você poderia soletrar isso para mim, por favor?',
            context: 'Atendimento na secretaria do CFPA',
          },
          {
            phrase: 'A, B, C, D, E, F, G.',
            phoneticTips: 'A /eɪ/, B /biː/, C /siː/, D /diː/, E /iː/, F /ef/, G /dʒiː/.',
            translation: 'A, B, C, D, E, F, G.',
            context: 'Treino de pronúncia do alfabeto',
          },
        ],
        questions: [
          {
            id: 'q-b1',
            type: 'multiple_choice',
            prompt: 'Como se pronuncia a letra "E" no alfabeto em inglês?',
            explanation: 'A letra "E" em inglês tem o som de /iː/ (como em "see" ou "bee"). Já a letra "I" tem o som de /aɪ/.',
            options: ['/iː/ (som "ii")', '/eɪ/ (som "ei")', '/aɪ/ (som "ai")', '/oʊ/ (som "ou")'],
            correctAnswer: '/iː/ (som "ii")',
          },
          {
            id: 'q-b2',
            type: 'fill_blank',
            prompt: 'Complete: "How do you ______ your surname?"',
            explanation: 'Usamos o verbo "spell" (soletrar).',
            options: ['spell', 'speak', 'write', 'say'],
            correctAnswer: 'spell',
          },
        ],
      },
      {
        id: 'les-103',
        unitId: 'u-1',
        unitNumber: 1,
        title: 'Numbers, Prices in Meticais & Telling Time',
        subtitle: 'Aprenda os números de 0 a 100, como dizer valores em Meticais (MT) e perguntar as horas do dia.',
        level: 'A1',
        estimatedMinutes: 15,
        xpValue: 130,
        grammarFocus: 'Cardinal numbers (1-100) • Questions with "What time is it?" • "How much is...?" para preços',
        vocabulary: [
          {
            id: 'v-n1',
            word: 'O\\'clock',
            phonetic: '/əˈklɒk/',
            translation: 'Em ponto (para horas exatas)',
            partOfSpeech: 'adverb',
            exampleSentence: 'Our English lesson starts at eight o\\'clock sharp.',
            exampleTranslation: 'Nossa aula de inglês começa às oito em ponto.',
          },
          {
            id: 'v-n2',
            word: 'Meticais',
            phonetic: '/me.tiˈkaɪs/',
            translation: 'Meticais (moeda oficial de Moçambique)',
            partOfSpeech: 'noun',
            exampleSentence: 'The monthly tuition fee is 3,500 Meticais (MT).',
            exampleTranslation: 'A propina mensal é de 3.500 Meticais (MT).',
          },
          {
            id: 'v-n3',
            word: 'Quarter past',
            phonetic: '/ˈkwɔː.tər pɑːst/',
            translation: 'E quinze (passado um quarto de hora)',
            partOfSpeech: 'phrase',
            exampleSentence: 'It is a quarter past three in the afternoon.',
            exampleTranslation: 'São três e quinze da tarde.',
          },
          {
            id: 'v-n4',
            word: 'Half past',
            phonetic: '/hɑːf pɑːst/',
            translation: 'E meia (meia hora passada)',
            partOfSpeech: 'phrase',
            exampleSentence: 'The class finishes at half past five.',
            exampleTranslation: 'A aula termina às cinco e meia.',
          },
        ],
        dialogue: [
          {
            id: 'd-n1',
            speaker: 'Classmate',
            speakerRole: 'partner',
            text: 'Excuse me! What time does the grammar class begin today?',
            translation: 'Com licença! A que horas começa a aula de gramática hoje?',
            suggestedReplyTips: ['It begins at 6 o\\'clock.', 'At half past six.'],
          },
          {
            id: 'd-n2',
            speaker: 'You (Student)',
            speakerRole: 'user',
            text: 'It begins at half past six (6:30 PM) in Room 2.',
            translation: 'Começa às seis e meia (18h30) na Sala 2.',
          },
        ],
        pronunciationPrompts: [
          {
            phrase: 'What time is it now, please?',
            phoneticTips: 'Conecte suavemente: /wɒt taɪm ɪz ɪt naʊ pliːz/.',
            translation: 'Que horas são agora, por favor?',
            context: 'Perguntando o horário',
          },
          {
            phrase: 'The course fee is three thousand five hundred Meticais.',
            phoneticTips: 'Pratique o /θ/ de "three" e "thousand" com a ponta da língua nos dentes.',
            translation: 'A propina do curso é de três mil e quinhentos Meticais.',
            context: 'Falando sobre valores',
          },
        ],
        questions: [
          {
            id: 'q-n1',
            type: 'multiple_choice',
            prompt: 'Como dizemos "7:30" em inglês britânico e internacional formal?',
            explanation: '"Half past seven" significa literalmente "meia hora passada das sete" (7:30).',
            options: ['Half past seven', 'Seven past thirty', 'Seven clock thirty', 'Quarter to seven'],
            correctAnswer: 'Half past seven',
          },
          {
            id: 'q-n2',
            type: 'fill_blank',
            prompt: 'Complete a pergunta de preço: "______ much is the course fee?"',
            explanation: 'Usamos "How much" para perguntar valores e preços de coisas incontáveis.',
            options: ['How', 'What', 'Where', 'Who'],
            correctAnswer: 'How',
          },
        ],
      },`;

// Check if les-102 is already in Unit 1; if not, inject it
if (!content.includes("'les-102'")) {
  content = content.replace(/(id:\s*'les-101'[\s\S]*?questions:[\s\S]*?\]\s*\},)/, `$1\n${beginnerLessonsToAdd}`);
}

// 8. Replace INITIAL_COURSES with the comprehensive multi-discipline portfolio
const enrichedCourses = `export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-starter',
    name: 'Inglês para Principiantes: Fundação do Zero (Starter A1)',
    code: 'ENG-A1-120',
    category: 'languages',
    level: 'A1',
    totalWorkloadHours: 120,
    durationMonths: 6,
    tuitionMonthlyMT: 3500,
    certificationBadge: 'Certificado CEFR A1 Iniciação',
    description: 'Curso intensivo desenhado especialmente para quem nunca estudou inglês ou sente insegurança com o básico. Foco em pronúncia, alfabeto, números, saudações e frases essenciais.',
    objectives: [
      'Construir base sólida de pronúncia correta desde o primeiro dia',
      'Dominar saudações, apresentações pessoais, família e rotina diária',
      'Compreender diálogos simples e expressar necessidades cotidianas sem medo',
      'Adquirir vocabulário de 800+ palavras essenciais do dia a dia',
    ],
    disciplines: [
      {
        id: 'disc-s1',
        name: 'Alfabeto, Fonética & Sons do Inglês',
        code: 'FON-A1',
        workloadHours: 30,
        teacherName: 'Camila Fernandes Ribeiro',
        description: 'Vogais, consoantes desafiadoras para lusófonos e soletração.',
      },
      {
        id: 'disc-s2',
        name: 'Gramática de Base: To Be & Presente Simples',
        code: 'GRA-A1',
        workloadHours: 35,
        teacherName: 'Sarah Jenkins, M.Ed.',
        description: 'Frases afirmativas, negativas e perguntas do cotidiano.',
      },
      {
        id: 'disc-s3',
        name: 'Vocabulário Prático: Família, Casa & Trabalho',
        code: 'VOC-A1',
        workloadHours: 30,
        teacherName: 'Camila Fernandes Ribeiro',
        description: 'Horas, números, compras em Meticais e direções na cidade.',
      },
      {
        id: 'disc-s4',
        name: 'Laboratório de Conversação & Desinibição Oral',
        code: 'SPK-A1',
        workloadHours: 25,
        teacherName: 'David Alistair Ward',
        description: 'Simulações de diálogos diários e pequenas apresentações.',
      },
    ],
  },
  {
    id: 'crs-1',
    name: 'Formação Completa em Língua Inglesa (General English A1-C1)',
    code: 'ENG-GEN-160',
    category: 'languages',
    level: 'B1',
    totalWorkloadHours: 160,
    durationMonths: 12,
    tuitionMonthlyMT: 3500,
    certificationBadge: 'Certificado Internacional CEFR',
    description: 'Programa integrado das 4 habilidades (Speaking, Listening, Reading, Writing) com base nas diretrizes europeias do CEFR.',
    objectives: [
      'Alcançar fluência comunicativa em situações cotidianas e profissionais',
      'Dominar 2.000+ estruturas lexicais e gramaticais essenciais',
      'Desenvolver pronúncia clara e audição apurada com materiais autênticos',
    ],
    disciplines: [
      {
        id: 'disc-1',
        name: 'Fonética Prática & Pronúncia Aplicada',
        code: 'FON-40',
        workloadHours: 40,
        teacherName: 'David Alistair Ward',
        description: 'Sons vocálicos, entonação e ritmo da língua inglesa.',
      },
      {
        id: 'disc-2',
        name: 'Estruturas Gramaticais & Coesão Textual',
        code: 'GRA-40',
        workloadHours: 40,
        teacherName: 'Camila Fernandes Ribeiro',
        description: 'Tempos verbais compostos, modais e conectores de discurso.',
      },
      {
        id: 'disc-3',
        name: 'Conversação Ativa & Fluência Interativa',
        code: 'SPK-50',
        workloadHours: 50,
        teacherName: 'Sarah Jenkins, M.Ed.',
        description: 'Debates, simulações de situações reais e desinibição oral.',
      },
      {
        id: 'disc-4',
        name: 'Compreensão Auditiva & Cultura Anglófona',
        code: 'LIS-30',
        workloadHours: 30,
        teacherName: 'Sarah Jenkins, M.Ed.',
        description: 'Listening com sotaques globais (US, UK, AUS, CAN).',
      },
    ],
  },
  {
    id: 'crs-2',
    name: 'Inglês para Negócios & Liderança Global (Business English)',
    code: 'ENG-BUS-120',
    category: 'languages',
    level: 'B2',
    totalWorkloadHours: 120,
    durationMonths: 8,
    tuitionMonthlyMT: 4200,
    certificationBadge: 'Certificado Executivo Business English',
    description: 'Programa avançado focado no vocabulário corporativo, negociações internacionais, apresentações de impacto e relatórios executivos.',
    objectives: [
      'Conduzir reuniões e pitches de negócios com segurança e precisão',
      'Redigir e-mails formais, propostas comerciais e memorandos',
      'Negociar acordos comerciais em inglês com parceiros multinacionais',
    ],
    disciplines: [
      {
        id: 'disc-5',
        name: 'Corporate Communication & Meeting Leadership',
        code: 'BUS-40',
        workloadHours: 40,
        teacherName: 'Sarah Jenkins, M.Ed.',
        description: 'Vocabulário executivo e condução de reuniões multilíngues.',
      },
      {
        id: 'disc-6',
        name: 'Negotiations & International Pitching',
        code: 'NEG-40',
        workloadHours: 40,
        teacherName: 'Sarah Jenkins, M.Ed.',
        description: 'Táticas de argumentação e persuasão em ambientes de negócios.',
      },
    ],
  },
  {
    id: 'crs-3',
    name: 'Preparatório Oficial IELTS & TOEFL iBT',
    code: 'ENG-EXAM-90',
    category: 'languages',
    level: 'C1',
    totalWorkloadHours: 90,
    durationMonths: 6,
    tuitionMonthlyMT: 4800,
    certificationBadge: 'IELTS Band 7.5+ Target',
    description: 'Treinamento focado nas técnicas de resolução de exames oficiais de proficiência com simulados cronometrados e feedback banda a banda.',
    objectives: [
      'Alcançar pontuação mínima de 7.5 no IELTS ou 100+ no TOEFL iBT',
      'Dominar estratégias de skimming, scanning e synthesis de textos acadêmicos',
      'Produzir redações Task 1 e Task 2 com coesão, coerência e precisão lexical',
    ],
    disciplines: [
      {
        id: 'disc-8',
        name: 'Academic Writing Task 1 & 2 Mastery',
        code: 'EX-WRT-30',
        workloadHours: 30,
        teacherName: 'David Alistair Ward',
        description: 'Análise de dados (Task 1) e dissertação argumentativa (Task 2).',
      },
      {
        id: 'disc-9',
        name: 'Exam Speaking Interview & Fluency Tactics',
        code: 'EX-SPK-30',
        workloadHours: 30,
        teacherName: 'Sarah Jenkins, M.Ed.',
        description: 'Fluência, coerência e precisão sob pressão de exame.',
      },
    ],
  },
  {
    id: 'crs-revimo-excel',
    name: 'Microsoft Excel: Do Básico ao Intermédio (Parceria REVIMO)',
    code: 'TEC-XLS-60',
    category: 'tech',
    level: 'Intermédio',
    totalWorkloadHours: 60,
    durationMonths: 2,
    tuitionMonthlyMT: 2800,
    certificationBadge: 'Certificado de Competência Digital',
    description: 'Capacitação prática em folhas de cálculo corporativas desenvolvida com a experiência do projeto com a concessionária REVIMO. Foco em automatização de rotinas financeiras e de gestão.',
    objectives: [
      'Construir planilhas profissionais com fórmulas matemáticas, lógicas e de pesquisa',
      'Dominar PROCV/VLOOKUP, ÍNDICE+CORRESP, SE, SOMASE e CONT.SE',
      'Criar tabelas e gráficos dinâmicos para relatórios gerenciais e tomada de decisão',
    ],
    disciplines: [
      {
        id: 'disc-x1',
        name: 'Fundamentos de Planilhas & Fórmulas Essenciais',
        code: 'XLS-20',
        workloadHours: 20,
        teacherName: 'Eng. Fernando Matos',
        description: 'Interface, formatação condicional, operações e funções básicas.',
      },
      {
        id: 'disc-x2',
        name: 'Análise de Dados, Tabelas Dinâmicas & Dashboards',
        code: 'XLS-40',
        workloadHours: 40,
        teacherName: 'Eng. Fernando Matos',
        description: 'Pivot Tables, gráficos interativos e proteção de planilhas.',
      },
    ],
  },
  {
    id: 'crs-hsst',
    name: 'Higiene, Saúde e Segurança no Trabalho (HSST - Parceria INP)',
    code: 'IND-SST-90',
    category: 'industry',
    level: 'Técnico-Profissional',
    totalWorkloadHours: 90,
    durationMonths: 3,
    tuitionMonthlyMT: 3500,
    certificationBadge: 'Certificado Técnico HSST',
    description: 'Formação operacional de referência baseada na experiência com o Instituto Náutico e Portuário. Prevenção de riscos laborais, planos de emergência e normas de conformidade industrial.',
    objectives: [
      'Identificar perigos e avaliar riscos operacionais em ambientes industriais e portuários',
      'Implementar planos de contingência, evacuação e primeiros socorros no trabalho',
      'Auditar conformidade legal com os regulamentos de segurança de Moçambique',
    ],
    disciplines: [
      {
        id: 'disc-h1',
        name: 'Legislação Laboral & Normas de Segurança Industrial',
        code: 'SST-30',
        workloadHours: 30,
        teacherName: 'Técnico Especialista em SST',
        description: 'Regulamentação moçambicana e internacional de saúde no trabalho.',
      },
      {
        id: 'disc-h2',
        name: 'Prevenção de Acidentes, EPIs & Planos de Emergência',
        code: 'SST-60',
        workloadHours: 60,
        teacherName: 'Técnico Especialista em SST',
        description: 'Equipamentos de proteção, combate a incêndio e gestão de crises.',
      },
    ],
  },
  {
    id: 'crs-logistics',
    name: 'Transporte e Logística em Língua Inglesa (Parceria ESSOR)',
    code: 'CORP-LOG-80',
    category: 'corporate',
    level: 'B1-B2 Técnico',
    totalWorkloadHours: 80,
    durationMonths: 3,
    tuitionMonthlyMT: 3800,
    certificationBadge: 'Certificado Logística Internacional',
    description: 'Formação em inglês setorial para os corredores de transporte e logística da Beira. Vocabulário de despacho aduaneiro, Incoterms, navegação e manuseamento de carga.',
    objectives: [
      'Comunicar com operadores internacionais, despachantes e autoridades portuárias',
      'Redigir cartas de porte, manifestos de carga e documentação de expedição em inglês',
      'Gerir reclamações de transporte internacional e desembaraço de mercadorias',
    ],
    disciplines: [
      {
        id: 'disc-l1',
        name: 'Incoterms & Documentação Internacional de Carga',
        code: 'LOG-40',
        workloadHours: 40,
        teacherName: 'Prof. David Alistair Ward',
        description: 'Bill of lading, invoices comerciais, desembaraço e termos marítimos.',
      },
      {
        id: 'disc-l2',
        name: 'Comunicação Portuária & Gestão de Supply Chain em Inglês',
        code: 'LOG-40B',
        workloadHours: 40,
        teacherName: 'Sarah Jenkins, M.Ed.',
        description: 'Atendimento a clientes globais e resolução de imprevistos logísticos.',
      },
    ],
  },
  {
    id: 'crs-tic-admin',
    name: 'Tecnologias de Informação e Comunicação (TICs) & Redes',
    code: 'TEC-NET-120',
    category: 'tech',
    level: 'Técnico-Profissional',
    totalWorkloadHours: 120,
    durationMonths: 4,
    tuitionMonthlyMT: 3500,
    certificationBadge: 'Certificado Técnico em TICs',
    description: 'Capacitação prática em montagem e manutenção de computadores, infraestrutura de redes locais, segurança da informação e suporte ao utilizador.',
    objectives: [
      'Diagnosticar e reparar avarias de hardware e sistemas operacionais',
      'Configurar redes locais LAN/WLAN com switches, routers e cabeamento estruturado',
      'Implementar rotinas de cópias de segurança (backup) e proteção contra ameaças',
    ],
    disciplines: [
      {
        id: 'disc-t1',
        name: 'Hardware, Manutenção & Sistemas Operacionais',
        code: 'TIC-60',
        workloadHours: 60,
        teacherName: 'Formador de TICs',
        description: 'Montagem de computadores, formatação, drivers e suporte helpdesk.',
      },
      {
        id: 'disc-t2',
        name: 'Redes de Computadores & Segurança Digital',
        code: 'TIC-60B',
        workloadHours: 60,
        teacherName: 'Formador de Redes',
        description: 'TCP/IP, endereçamento IP, roteadores Wi-Fi e segurança de dados.',
      },
    ],
  },
  {
    id: 'crs-translation',
    name: 'Serviços Especializados de Tradução & Interpretação Ajuramentada',
    code: 'TRD-JUR-100',
    category: 'translation',
    level: 'C1-C2 Profissional',
    totalWorkloadHours: 100,
    durationMonths: 4,
    tuitionMonthlyMT: 4500,
    certificationBadge: 'Certificado de Tradutor Profissional',
    description: 'Formação avançada em tradução documental e interpretação consecutiva com rigor linguístico e validade jurídica para contextos institucionais e empresariais.',
    objectives: [
      'Traduzir contratos, certidões, estatutos e documentos técnicos com rigor jurídico',
      'Dominar técnicas de interpretação consecutiva e de ligação em reuniões bilaterais',
      'Aplicar glossários terminológicos especializados em Direito, Economia e Engenharia',
    ],
    disciplines: [
      {
        id: 'disc-tr1',
        name: 'Tradução Jurídica & Documentos Oficiais',
        code: 'TRD-50',
        workloadHours: 50,
        teacherName: 'Dr. David Alistair Ward',
        description: 'Terminologia forense, apostilamento e fidúcia documental.',
      },
      {
        id: 'disc-tr2',
        name: 'Técnicas de Interpretação Consecutiva & Ética Profissional',
        code: 'TRD-50B',
        workloadHours: 50,
        teacherName: 'Sarah Jenkins, M.Ed.',
        description: 'Tomada de notas rápida, memorização e dicção em eventos formais.',
      },
    ],
  },
  {
    id: 'crs-tutoring',
    name: 'Programa de Explicações & Apoio Escolar e Universitário',
    code: 'EDU-EXP-120',
    category: 'tutoring',
    level: 'Primário ao Universitário',
    totalWorkloadHours: 120,
    durationMonths: 6,
    tuitionMonthlyMT: 2500,
    certificationBadge: 'Reforço Acadêmico ASDE Learning',
    description: 'Apoio escolar personalizado em Matemática, Física, Química, Português e Inglês para alunos do ensino primário, secundário e universitário da Cidade da Beira.',
    objectives: [
      'Superar dificuldades específicas de aprendizagem e consolidar matérias escolares',
      'Preparar para exames nacionais de admissão ao ensino superior',
      'Desenvolver métodos de estudo eficientes e autonomia acadêmica',
    ],
    disciplines: [
      {
        id: 'disc-e1',
        name: 'Ciências Exatas (Matemática & Física)',
        code: 'EXP-60',
        workloadHours: 60,
        teacherName: 'Corpo Docente de Explicações',
        description: 'Resolução de problemas, álgebra, geometria e cálculo.',
      },
      {
        id: 'disc-e2',
        name: 'Línguas & Expressão Escrita (Português & Inglês)',
        code: 'EXP-60B',
        workloadHours: 60,
        teacherName: 'Corpo Docente de Explicações',
        description: 'Gramática, redação de ensaios e interpretação de textos.',
      },
    ],
  },
];`;

// Replace the old INITIAL_COURSES
content = content.replace(/export const INITIAL_COURSES: Course\[\] = \[[\s\S]*?\n\];/m, enrichedCourses);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated initialData.ts with enriched courses, beginner units, Meticais and zero avatars!');
