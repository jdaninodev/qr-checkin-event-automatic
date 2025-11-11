'use client';

import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  label: string;
  icon?: LucideIcon;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

export default function InputField({
  label,
  icon: Icon,
  type = 'text',
  required = false,
  value,
  onChange,
  placeholder,
}: InputFieldProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        {Icon && <Icon className="w-4 h-4 text-[#2b54bf]" />}
        {label} {required && <span className="text-[#2b54bf]">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2b54bf] focus:border-[#2b54bf] transition-all hover:border-[#2b54bf]/30"
        placeholder={placeholder}
      />
    </div>
  );
}
