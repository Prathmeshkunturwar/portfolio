"use client";

import CountUp from "@/components/animations/CountUp";

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
}

export default function StatCard({ value, suffix, label }: StatCardProps) {
  return (
    <div className="p-8">
      <div className="text-5xl lg:text-6xl font-bold font-mono text-[#F1F5F9]">
        <CountUp end={value} suffix={suffix} />
      </div>
      <p className="text-sm text-[#64748B] mt-2">{label}</p>
    </div>
  );
}
