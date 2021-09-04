import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const pattern = 'dd MMM yyyy';

  return format(date, pattern, { locale: ptBr });
}
