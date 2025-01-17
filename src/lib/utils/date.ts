import { format, parseISO, isValid, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(date: string | Date, formatStr = "dd/MM/yyyy 'à' HH:mm") {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    return format(dateObj, formatStr, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

export function validateDate(dateStr: string): boolean {
  try {
    const date = new Date(dateStr);
    return isValid(date) && date > new Date();
  } catch {
    return false;
  }
}

export function getDefaultEndDate(): string {
  return addDays(new Date(), 3).toISOString();
}

export function formatDateForInput(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) {
      return new Date().toISOString().slice(0, 16);
    }
    return date.toISOString().slice(0, 16);
  } catch {
    return new Date().toISOString().slice(0, 16);
  }
}