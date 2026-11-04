import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Discipline, CEFRLevel, CourseCategory } from '../../types';
import { UserPhoto } from '../common/UserPhoto';
import {
  GraduationCap,
  Plus,
  Clock,
  BookOpen,
  Calendar,
  Users,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  Layers,
  ChevronRight,
  Sparkles,
  Award,
  Filter,
  DollarSign,
  Briefcase,
  Monitor,
  ShieldCheck,
  Languages,
} from 'lucide-react';

export const CoursesManager: React.FC = () => {
  const { courses, teachers, classes, addCourse, updateCourse, deleteCourse } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CourseCategory>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'schedule' | 'teachers'>('courses');

  // Form State for new course
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'languages' as CourseCategory,
    level: 'A1',
    totalWorkloadHours: 120,
    durationMonths: 6,
    tuitionMonthlyMT: 3500,
    certificationBadge: 'Certificado CFPA',
    description: '',
    objectives: '',
  });

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(c.level).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    const objectivesList = formData.objectives
      .split('\n')
      .map((o) => o.trim())
      .filter(Boolean);

    addCourse({
      name: formData.name,
      code: formData.code,
      category: formData.category,
      level: formData.level,
      totalWorkloadHours: Number(formData.totalWorkloadHours),
      durationMonths: Number(formData.durationMonths),
      tuitionMonthlyMT: Number(formData.tuitionMonthlyMT),
      certificationBadge: formData.certificationBadge,
      description: formData.description,
      objectives: objectivesList.length > 0 ? objectivesList : ['Desenvolvimento integral de competências práticas'],
      disciplines: [
        {
          id: `disc-${Date.now()}-1`,
          name: 'Módulo Prático I - Fundamentos & Prática',
          code: 'MOD-01',
          workloadHours: Math.round(Number(formData.totalWorkloadHours) * 0.5),
          teacherName: teachers[0]?.name || 'Corpo Docente CFPA',
          description: 'Desenvolvimento das bases técnicas e práticas do módulo.',
        },
        {
          id: `disc-${Date.now()}-2`,
          name: 'Módulo Prático II - Aplicação no Mercado',
          code: 'MOD-02',
          workloadHours: Math.round(Number(formData.totalWorkloadHours) * 0.5),
          teacherName: teachers[1]?.name || 'Corpo Docente CFPA',
          description: 'Estudos de caso, exercícios aplicados e projeto prático.',
        },
      ],
    });

    setShowNewCourseModal(false);
    setFormData({
      name: '',
      code: '',
      category: 'languages',
      level: 'A1',
      totalWorkloadHours: 120,
      durationMonths: 6,
      tuitionMonthlyMT: 3500,
      certificationBadge: 'Certificado CFPA',
      description: '',
      objectives: '',
    });
  };

  const getCategoryLabel = (cat?: CourseCategory) => {
    switch (cat) {
      case 'languages':
        return 'Línguas & IELTS';
      case 'tech':
        return 'TICs & Informática';
      case 'industry':
        return 'Indústria & HSST';
      case 'corporate':
        return 'Logística & Gestão';
      case 'tutoring':
        return 'Apoio Escolar';
      case 'translation':
        return 'Tradução Ajuramentada';
      default:
        return 'Geral';
    }
  };

  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            Catálogo Integrado de Formações Profissionais (CFPA)
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Cursos Técnicos, Línguas & Explicações
          </h1>
          <p className="text-slate-500 text-xs mt-1 max-w-2xl">
            Planejamento pedagógico do Centro de Formação Profissional ASDE: Língua Inglesa (IELTS/CEFR), Informática Aplicada, TICs, HSST, Logística, Tradução e Apoio Escolar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewCourseModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Curso</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catálogo de Cursos ({courses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Grade Horária Semanal</span>
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Corpo Docente & Formadores ({teachers.length})</span>
        </button>
      </div>

      {/* TAB 1: COURSES & DISCIPLINES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {/* Category Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {(
              [
                { id: 'all', label: 'Todos os Cursos' },
                { id: 'languages', label: 'Línguas & IELTS' },
                { id: 'tech', label: 'TICs & Informática' },
                { id: 'industry', label: 'Indústria & HSST' },
                { id: 'corporate', label: 'Logística & Gestão' },
                { id: 'translation', label: 'Tradução Ajuramentada' },
                { id: 'tutoring', label: 'Apoio Escolar' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Courses List */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar curso, nível ou código..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {filteredCourses.map((course) => {
                  const isSelected = selectedCourse?.id === course.id;
                  return (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono">
                          {course.code}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {getCategoryLabel(course.category)}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                        {course.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{course.totalWorkloadHours}h totais</span>
                        </div>
                        <span className="font-extrabold text-emerald-800">
                          {course.tuitionMonthlyMT || 3500} MT/mês
                        </span>
                        <span className="text-slate-400">{course.durationMonths} meses</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Course Full Dossier */}
            <div className="lg:col-span-2 space-y-5">
              {selectedCourse ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                  {/* Header of Selected Course */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                          {selectedCourse.code}
                        </span>
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {getCategoryLabel(selectedCourse.category)}
                        </span>
                        {selectedCourse.certificationBadge && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            {selectedCourse.certificationBadge}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        {selectedCourse.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {selectedCourse.description}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center shrink-0 min-w-[140px]">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                        Propina Mensal
                      </span>
                      <span className="text-xl font-black text-emerald-900 block">
                        {selectedCourse.tuitionMonthlyMT || 3500} MT
                      </span>
                      <span className="text-[10px] text-emerald-700">Pagamento BIM</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Carga Horária
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {selectedCourse.totalWorkloadHours} Horas
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Duração
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {selectedCourse.durationMonths} Meses
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Nível de Saída
                      </span>
                      <span className="text-lg font-black text-emerald-800">
                        {selectedCourse.level}
                      </span>
                    </div>
                  </div>

                  {/* Objectives */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Competências & Objetivos Práticos do Curso</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedCourse.objectives.map((obj, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span className="text-slate-700 leading-snug">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disciplines Matrix */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span>Módulos & Matriz de Disciplinas ({selectedCourse.disciplines.length})</span>
                      </h3>
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {selectedCourse.disciplines.map((disc) => (
                        <div key={disc.id} className="p-4 bg-white hover:bg-slate-50/80 transition space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {disc.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                              {disc.workloadHours}h
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {disc.description}
                          </p>
                          <span className="text-[11px] text-slate-400 block pt-1">
                            Formador Responsável: <strong>{disc.teacherName}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                  Selecione um curso para visualizar a ementa completa.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Grade de Salas & Horários de Aulas
              </h3>
              <p className="text-xs text-slate-500">
                Turnos matutino, vespertino e pós-laboral no Centro de Formação Profissional ASDE na Beira.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div key={cls.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    {cls.code}
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {cls.level}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">{cls.name}</h4>
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Docente: {cls.teacherName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Local: {cls.room} • {cls.modality}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEACHERS */}
      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-emerald-300 transition"
            >
              <div className="flex items-center gap-3">
                <UserPhoto
                  src={teacher.avatar}
                  name={teacher.name}
                  size="xl"
                  borderClassName="border-2 border-emerald-200 shadow-md"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                    {teacher.name}
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold block">
                    Sotaque / Origem: {teacher.accent}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {teacher.email}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Certificações:
                </span>
                <div className="flex flex-wrap gap-1">
                  {teacher.certifications.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{teacher.activeClassesCount} Turmas Ativas</span>
                <span className="font-bold text-emerald-800">Classificação: {teacher.rating}/5.0</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CREATE NEW COURSE */}
      {showNewCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl p-6 w-full max-w-lg space-y-4 animate-in fade-in zoom-in-95 my-8">
            <h3 className="text-base font-extrabold text-slate-900">
              Cadastrar Nova Formação Profissional
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Curso / Formação *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Informática para Negócios & Contabilidade"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Área / Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CourseCategory })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="languages">Línguas & Inglês IELTS</option>
                    <option value="tech">TICs & Informática</option>
                    <option value="industry">Indústria & HSST</option>
                    <option value="corporate">Logística & Gestão</option>
                    <option value="tutoring">Apoio Escolar & Explicações</option>
                    <option value="translation">Tradução Ajuramentada</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código do Curso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TEC-INF-80"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Carga Horária (h) *</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    required
                    value={formData.totalWorkloadHours}
                    onChange={(e) => setFormData({ ...formData, totalWorkloadHours: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duração (Meses) *</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    required
                    value={formData.durationMonths}
                    onChange={(e) => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Propina (MT) *</label>
                  <input
                    type="number"
                    min="500"
                    required
                    value={formData.tuitionMonthlyMT}
                    onChange={(e) => setFormData({ ...formData, tuitionMonthlyMT: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ementa / Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Proposta pedagógica e competências a serem desenvolvidas..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Objetivos Específicos (1 por linha)</label>
                <textarea
                  rows={3}
                  placeholder="Capacitar no manuseamento prático de ferramentas&#10;Desenvolver raciocínio analítico&#10;Integrar ao mercado de trabalho"
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewCourseModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition cursor-pointer"
                >
                  Cadastrar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
