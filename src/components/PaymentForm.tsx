import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymentMethod } from '@/services/payment.service';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { Loader2 } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const mobileMoneySchema = z.object({
  phoneNumber: z.string().regex(/^\+225\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/, 'Numéro de téléphone invalide'),
});

export function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const form = useForm({
    resolver: zodResolver(mobileMoneySchema),
  });

  const handleSubmit = async () => {
    try {
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Mode de paiement</h3>
        <PaymentMethodSelector
          methods={[]}
          selectedMethod={null}
          onSelect={() => {}}
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label>Numéro de téléphone</Label>
          <Input
            {...form.register('phoneNumber')}
            placeholder="+225 XX XX XX XX"
            className="mt-1"
          />
          {form.formState.errors.phoneNumber?.message && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              `Payer ${amount.toLocaleString()} FCFA`
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}