import { Student, CEFR_IELTS_MAP } from '../types';

/**
 * Exporta a lista de alunos por nível com campos de avaliação por estilos para formato compatível com Excel (.csv com UTF-8 BOM)
 */
export function exportStudentsToExcel(
  students: Student[],
  levelTitle: string = 'Todos os Níveis'
): void {
  // Cabeçalhos das colunas formatadas para o Excel
  const headers = [
    'Nº de Inscrição / Matrícula',
    'Nome Completo do Aluno',
    'Nível CEFR',
    'Equivalência IELTS',
    'Turma',
    'Status da Matrícula',
    'Telefone / WhatsApp',
    'Email',
    'Horas de Exposição no App (h)',
    'Nota Exercícios no App (%)',
    'Exercícios Concluídos no App',
    'Avaliação - Fala (Speaking 0-100)',
    'Avaliação - Escuta (Listening 0-100)',
    'Avaliação - Escrita (Writing 0-100)',
    'Avaliação - Gramática (Grammar 0-100)',
    'Avaliação - Leitura (Reading 0-100)',
    'Média Ponderada Final (0-100)',
    'Valor Mensalidade (MT)',
    'Situação Financeira',
  ];

  const rows = students.map((s) => {
    const latestGrade = s.grades && s.grades.length > 0 ? s.grades[0] : null;
    const levelInfo = CEFR_IELTS_MAP[s.level];

    const speaking = latestGrade?.speaking ?? '';
    const listening = latestGrade?.listening ?? '';
    const writing = latestGrade?.writing ?? '';
    const grammar = latestGrade?.grammar ?? '';
    const reading = latestGrade?.reading ?? '';
    const overall = latestGrade?.overall ?? '';

    return [
      `"${s.enrollmentCode || ''}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.level}"`,
      `"${levelInfo?.ieltsBand || ''}"`,
      `"${s.className.replace(/"/g, '""')}"`,
      `"${s.status === 'active' ? 'Ativo' : s.status === 'trial' ? 'Degustação' : 'Inativo'}"`,
      `"${s.phone || ''}"`,
      `"${s.email || ''}"`,
      `"${(s.appProgress.hoursStudied || 0).toFixed(1)}"`,
      `"${(s.appProgress.exercisesAverageScore || 0).toFixed(1)}%"`,
      `"${s.appProgress.exercisesCompletedCount || 0}"`,
      `"${speaking}"`,
      `"${listening}"`,
      `"${writing}"`,
      `"${grammar}"`,
      `"${reading}"`,
      `"${overall}"`,
      `"${s.tuitionValue || 480}"`,
      `"${s.tuitionStatus === 'paid' ? 'Em dia' : s.tuitionStatus === 'overdue' ? 'Em atraso' : 'Pendente'}"`,
    ];
  });

  // UTF-8 BOM para garantir compatibilidade com caracteres acentuados no Microsoft Excel
  const bom = '\uFEFF';
  const csvContent =
    bom +
    headers.join(';') +
    '\n' +
    rows.map((r) => r.join(';')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const sanitizedTitle = levelTitle.toLowerCase().replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `asde_pauta_alunos_${sanitizedTitle}_${dateStr}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
