import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PaymentMethod } from '@/services/payment.service';
import { Card } from '@/components/ui/card';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: string | null;
  onSelect: (methodId: string) => void;
}

export function PaymentMethodSelector({
  methods,
  selectedMethod,
  onSelect
}: PaymentMethodSelectorProps) {
  return (
    <RadioGroup value={selectedMethod || ''} onValueChange={onSelect}>
      <div className="grid gap-4">
        {methods.map((method) => (
          <Card key={method.id} className="p-4">
            <div className="flex items-center space-x-4">
              <RadioGroupItem value={method.id} id={method.id} />
              <img src={method.icon} alt={method.name} className="h-8 w-8" />
              <Label htmlFor={method.id}>{method.name}</Label>
            </div>
          </Card>
        ))}
      </div>
    </RadioGroup>
  );
}