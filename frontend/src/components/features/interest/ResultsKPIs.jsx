import React from 'react';
import { SubCard } from '../../ui/Card';

export default function ResultsKPIs({ interestResults }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SubCard
        title="Tổng tiền gốc đã nộp"
        value={interestResults.totalInvested.toLocaleString('vi-VN') + ' VNĐ'}
        valueClass="text-slate-300"
      />
      <SubCard
        title="Tổng tiền lãi nhận"
        value={'+' + interestResults.interestEarned.toLocaleString('vi-VN') + ' VNĐ'}
        valueClass="text-emerald-400"
      />
      <SubCard
        title="Tổng tài sản nhận được"
        value={interestResults.finalBalance.toLocaleString('vi-VN') + ' VNĐ'}
        valueClass="bg-gradient-to-r from-emerald-400 to-teal-100 bg-clip-text text-transparent"
      />
    </div>
  );
}
