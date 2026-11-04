import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FinancialInvoice } from '../../types';
import { BankingDetailsCard } from '../common/BankingDetailsCard';
import { INSTITUTIONAL_PROFILE } from '../../data/institutionalData';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Receipt,
  FileCheck,
  Search,
  Filter,
  X,
  CreditCard,
  Building,
  Printer,
} from 'lucide-react';

export const FinancialHub: React.FC = () => {
  const { invoices, students, markInvoicePaid, createInvoice } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptInvoice, setReceiptInvoice] = useState<FinancialInvoice | null>(null);

  // New invoice state in Meticais (MT)
  const [newInv, setNewInv] = useState({
    studentId: students[0]?.id || '',
    description: 'Propina Mensal - Curso de Inglês Intensivo (IELTS)',
    amount: 3500,
    dueDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('pt-PT'),
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === newInv.studentId);
    if (!student) return;

    createInvoice({
      studentId: student.id,
      studentName: student.name,
      description: newInv.description,
      amount: Number(newInv.amount),
      dueDate: newInv.dueDate,
      status: 'pending',
    });

    setIsModalOpen(false);
    setNewInv({
      studentId: students[0]?.id || '',
      description: 'Propina Mensal - Curso de Inglês Intensivo (IELTS)',
      amount: 3500,
      dueDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('pt-PT'),
    });
  };

  // Calculations in Meticais (MT)
  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = invoices.filter((i) => i.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gestão Financeira & Propinas (CFPA)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Controlo de liquidação, emissão de faturas e pagamentos em Meticais (MT) via Millennium BIM.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Emitir Nova Cobrança de Propina</span>
        </button>
      </div>

      {/* STRATEGIC MILLENNIUM BIM BANKING CARD */}
      <BankingDetailsCard
        title="Conta Oficial Millennium BIM para Recebimento de Propinas"
        showSupportContacts={true}
      />

      {/* KPI Cards in Meticais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Emitido
          </span>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {totalInvoiced.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT
          </div>
          <p className="text-xs text-slate-400 mt-1">{invoices.length} faturas emitidas</p>
        </div>

        {/* Received */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Liquidado
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">
            {totalPaid.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT
          </div>
          <p className="text-xs text-emerald-600 mt-1 font-semibold">
            {Math.round((totalPaid / (totalInvoiced || 1)) * 100)}% recebido via BIM / Caixa
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              A Receber (No Prazo)
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-700">
            {totalPending.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT
          </div>
          <p className="text-xs text-slate-500 mt-1">Aguardando comprovativo</p>
        </div>

        {/* Overdue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Propinas Atrasadas
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600">
            {totalOverdue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT
          </div>
          <p className="text-xs text-rose-500 mt-1 font-semibold">Notificar via WhatsApp / SMS</p>
        </div>
      </div>

      {/* Invoices List with filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar fatura ou formando..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {(['all', 'paid', 'pending', 'overdue'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all'
                  ? 'Todas'
                  : st === 'paid'
                  ? 'Liquidadas'
                  : st === 'pending'
                  ? 'Pendentes'
                  : 'Atrasadas'}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Invoices */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Formando</th>
                <th className="py-3 px-3">Descrição da Propina</th>
                <th className="py-3 px-3">Valor (MT)</th>
                <th className="py-3 px-3">Vencimento / Liquidação</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{inv.studentName}</td>
                  <td className="py-3 px-3 text-slate-600">{inv.description}</td>
                  <td className="py-3 px-3 font-extrabold text-emerald-900">
                    {inv.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    <span>{inv.dueDate}</span>
                    {inv.paidDate && (
                      <span className="block text-[10px] text-emerald-600 font-semibold">
                        Liquidado em {inv.paidDate} ({inv.method || 'Transferência BIM'})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {inv.status === 'paid'
                        ? 'Liquidado'
                        : inv.status === 'pending'
                        ? 'Pendente'
                        : 'Atrasado'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.status !== 'paid' ? (
                        <button
                          onClick={() => {
                            const method = prompt(
                              'Selecione a forma de pagamento:\n1 - Transferência BIM\n2 - Depósito Bancário\n3 - M-Pesa\n4 - E-Mola\n5 - Espécie / Caixa\n6 - POS',
                              'Transferência BIM'
                            );
                            if (method) {
                              markInvoicePaid(inv.id, method);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-xs transition cursor-pointer"
                        >
                          Confirmar Pagamento
                        </button>
                      ) : (
                        <button
                          onClick={() => setReceiptInvoice(inv)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-500" />
                          <span>Recibo</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL RECEIPT PREVIEW MODAL */}
      {receiptInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-emerald-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-700" />
                <span className="font-extrabold text-slate-900 text-sm">
                  Recibo Oficial de Quitação de Propina
                </span>
              </div>
              <button
                onClick={() => setReceiptInvoice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="text-center pb-3 border-b border-slate-200">
                <span className="font-black text-sm text-slate-900 block">
                  {INSTITUTIONAL_PROFILE.name} ({INSTITUTIONAL_PROFILE.acronym})
                </span>
                <span className="text-[10px] text-slate-500 block">
                  NUIT: {INSTITUTIONAL_PROFILE.nuit} • {INSTITUTIONAL_PROFILE.address}
                </span>
                <span className="text-[10px] text-emerald-800 font-bold block">
                  Banco Millennium BIM • Conta: 956365875
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Formando:</span>
                <span className="font-bold text-slate-900">{receiptInvoice.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Descrição:</span>
                <span className="font-medium text-slate-800">{receiptInvoice.description}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Valor Liquidado:</span>
                <span className="font-black text-emerald-700 text-sm">
                  {receiptInvoice.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} MT
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Data de Liquidação:</span>
                <span className="text-slate-800">{receiptInvoice.paidDate || 'Hoje'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Método Utilizado:</span>
                <span className="font-bold text-emerald-800">
                  {receiptInvoice.method || 'Transferência Millennium BIM'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Recibo</span>
              </button>
              <button
                onClick={() => setReceiptInvoice(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-emerald-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Emitir Nova Cobrança de Propina</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Selecionar Formando</label>
                <select
                  value={newInv.studentId}
                  onChange={(e) => setNewInv({ ...newInv, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.enrollmentCode || 'ASDE'}) - {s.level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={newInv.description}
                  onChange={(e) => setNewInv({ ...newInv, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Valor em Meticais (MT)</label>
                  <input
                    type="number"
                    required
                    value={newInv.amount}
                    onChange={(e) => setNewInv({ ...newInv, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Data de Vencimento</label>
                  <input
                    type="text"
                    required
                    value={newInv.dueDate}
                    onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                Os dados para depósito ou transferência bancária no Millennium BIM (Conta: 956365875) serão enviados automaticamente com a fatura.
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition cursor-pointer"
                >
                  Confirmar Emissão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
