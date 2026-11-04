import { InstitutionalProfileData } from '../types';

export const INSTITUTIONAL_PROFILE: InstitutionalProfileData = {
  name: 'Centro de Formação Profissional ASDE',
  acronym: 'CFPA',
  slogan: 'Formamos Competências. Transformamos Carreiras.',
  nuit: '401953728',
  city: 'Cidade da Beira, Província de Sofala, Moçambique',
  address: 'Rua Capitão Pereira do Lago, Bairro de Matacuane, Cidade da Beira',
  contacts: ['(+258) 853357973', '(+258) 875411436'],
  whatsappContact: '846348589',
  email: 'cfpasde.geral@gmail.com',
  bankDetails: {
    bankName: 'Millennium BIM',
    accountNumber: '956365875',
    nib: '000100000095636587557',
    holderName: 'Centro de Formação Profissional ASDE',
    currency: 'Meticais (MT / MZN)',
  },
  foundedYear: 2021,
  history: `O CFPA tem origem em 2021, sob a designação ASDE Learning, como parte integrante do ASDE Group. A sua primeira actuação foi na área de explicações e apoio escolar, abrangendo desde o ensino primário ao universitário.

Face à crescente necessidade de formação em língua inglesa na Cidade da Beira — especialmente no modelo IELTS com foco na comunicação oral — surgiu o ASDE Learning, dedicado ao ensino intensivo de inglês em seis meses.

A elevada adesão a este programa revelou o desafio mais amplo da formação profissional, levando à criação do Centro de Formação Profissional ASDE, que hoje integra explicações, ensino de línguas e cursos técnicos e profissionais com abordagem prática orientada para o "saber fazer", sendo hoje uma referência na Região Centro de Moçambique.`,
  mission: `Treinar, formar e capacitar com conhecimento, habilidades e atitudes nas áreas de Ciência, Economia e Gestão, Tecnologia e Indústria, e Línguas — para que os nossos formandos ingressem e se consolidem no mercado de trabalho, promovendo o desenvolvimento pessoal e profissional ao longo da vida, bem como contribuir para o desenvolvimento social e económico local, nacional e regional.`,
  vision: `Ser uma instituição de referência nacional e regional em formação técnica e profissional, reconhecida pela qualidade, inovação metodológica e ligação directa ao mercado de trabalho.`,
  values: [
    {
      title: 'Excelência',
      description: 'Compromisso com a qualidade e rigor em tudo o que fazemos.',
    },
    {
      title: 'Inovação',
      description: 'Metodologias pedagógicas modernas e actualizadas ao mercado de trabalho.',
    },
    {
      title: 'Comprometimento',
      description: 'Dedicação total ao sucesso, progressão e resultados dos nossos formandos.',
    },
    {
      title: 'Inclusão',
      description: 'Formação acessível para todos os níveis socioeconômicos e perfis de carreira.',
    },
    {
      title: 'Empregabilidade',
      description: 'Foco prático e directo no "saber fazer" e na rápida inserção profissional.',
    },
    {
      title: 'Integridade',
      description: 'Ética, transparência, honestidade e rigor em toda a actuação institucional.',
    },
  ],
  areas: [
    {
      title: 'Ensino de Línguas (Inglês IELTS & Outras Línguas)',
      description: 'Inglês intensivo no modelo IELTS com foco nas quatro habilidades linguísticas (Speaking, Listening, Reading, Writing) e destaque para a comunicação oral. Outras línguas disponíveis mediante procura.',
      tag: 'Línguas',
    },
    {
      title: 'Cursos Técnicos e Profissionais',
      description: 'Administração e Gestão, Tecnologias de Informação e Comunicação (TICs), Construção Civil e Manutenção Industrial — 100% orientados para a prática e mercado.',
      tag: 'Técnico-Profissional',
    },
    {
      title: 'Explicações e Apoio Escolar',
      description: 'Do ensino primário ao universitário, com acompanhamento personalizado e orientado para o sucesso acadêmico continuado.',
      tag: 'Apoio Acadêmico',
    },
    {
      title: 'Tradutor e Intérprete Ajuramentado',
      description: 'Serviços especializados de tradução oficial e interpretação certificada com rigor linguístico e validade jurídica para documentos e contextos institucionais.',
      tag: 'Tradução Oficial',
    },
    {
      title: 'Formação Corporativa & Workshops',
      description: 'Programas de curta ou média duração desenhados sob medida para capacitar equipas empresariais em áreas de competências práticas e alto impacto.',
      tag: 'Empresarial',
    },
  ],
  successCases: [
    {
      partner: 'Instituto Náutico e Portuário',
      course: 'Higiene, Saúde e Segurança no Trabalho (HSST)',
      description: 'Formação operacional dos colaboradores com foco direto no desempenho de segurança e conformidade portuária.',
    },
    {
      partner: 'REVIMO',
      course: 'Excel — Do Básico ao Intermédio',
      description: 'Capacitação digital dos colaboradores com competências aplicadas ao ambiente profissional e gestão de planilhas.',
    },
    {
      partner: 'ESSOR (Parceria Internacional)',
      course: 'Transporte e Logística em Inglês Aplicado',
      description: 'Formação técnica em inglês setorial, reforçando a comunicação internacional e a empregabilidade no corredor logístico da Beira.',
    },
  ],
};
