'use client';

import { User } from 'lucide-react';

interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  delay?: number;
}

export default function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b-2 border-[#2b54bf]/20 mb-6">
      {icon || <User className="w-6 h-6 text-[#2b54bf]" />}
      <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-[#2b54bf] to-[#fed113]">
        {title}
      </h2>
    </div>
  );
}
