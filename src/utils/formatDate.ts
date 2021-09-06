import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

export function formatDate(timestamp: string, pattern = 'dd MMM yyyy'): string {
  const date = new Date(timestamp);

  return format(date, pattern, { locale: ptBr });
}
