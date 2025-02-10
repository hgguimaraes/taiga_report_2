import { format, isWithinInterval, parse } from 'date-fns';

interface ReportData {
  id: number;
  subject: string;
  status: string;
  comments: string;
  date: string;
}

export const generateCSV = (data: ReportData[]): string => {
  // Adiciona BOM (Byte Order Mark) para indicar UTF-8
  const BOM = '\uFEFF';
  
  const headers = ['ID', 'Tarefa', 'Data de Criação', 'Status', 'Comentários'];
  const csvContent = [
    headers.join(';'),
    ...data.map(row => {
      // Substitui quebras de linha por espaços para manter tudo em uma única linha
      const formattedComments = row.comments.replace(/\n/g, ' | ');
      
      return [
        row.id,
        `"${row.subject.replace(/"/g, '""')}"`,
        row.date,
        `"${row.status}"`,
        `"${formattedComments.replace(/"/g, '""')}"`
      ].join(';');
    })
  ].join('\n');

  return BOM + csvContent;
};

export const downloadCSV = (content: string, startDate: string, endDate: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `taiga-report_${startDate.replace(/\//g, '-')}_${endDate.replace(/\//g, '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};