import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

export function PhoneInput({ value, onChange, disabled, label }: PhoneInputProps) {
  const [localValue, setLocalValue] = useState(value.replace('+225 ', ''));

  useEffect(() => {
    setLocalValue(value.replace('+225 ', ''));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 10);
    setLocalValue(input);
    
    // Format with spaces: XX XX XX XX XX
    const formatted = input.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    onChange(`+225 ${formatted}`);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">+225</span>
        </div>
        <Input
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className="pl-24"
          placeholder="XX XX XX XX XX"
          maxLength={14}
        />
      </div>
    </div>
  );
}