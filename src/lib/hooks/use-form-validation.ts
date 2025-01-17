import { useState, useCallback } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T extends { [key: string]: string }>(
  initialValues: T,
  validationRules: { [K in keyof T]?: ValidationRules }
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((name: keyof T, value: string) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && !value) {
      return 'Ce champ est requis';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum ${rules.minLength} caractères requis`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum ${rules.maxLength} caractères autorisés`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Format invalide';
    }

    if (rules.custom && !rules.custom(value)) {
      return 'Valeur invalide';
    }

    return '';
  }, [validationRules]);

  const handleChange = useCallback((name: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validate]);

  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void>
  ) => {
    setIsSubmitting(true);
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    Object.keys(values).forEach(key => {
      const error = validate(key as keyof T, values[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    setIsSubmitting(false);
  }, [values, validate]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  };
}