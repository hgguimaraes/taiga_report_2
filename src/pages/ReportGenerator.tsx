import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Loader, ArrowLeft } from 'lucide-react';
import { authenticate, getUserStories, getComments } from '../services/taigaApi';
import { generateCSV, downloadCSV } from '../utils/csv';
import { format, parse, isWithinInterval } from 'date-fns';

function ReportGenerator() {
  const [projectUrl, setProjectUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const formatDateFromPicker = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  const handleGenerateReport = async () => {
    if (!projectUrl || !startDate || !endDate) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      setError('');
      setLoading(true);
      setProgress(0);
      setStatus('Autenticando...');
      
      await authenticate();
      setStatus('Carregando dados...');
      setProgress(10);

      const projectSlug = projectUrl.match(/project\/([^/]+)(?:\/|$)/)?.[1];
      if (!projectSlug) {
        throw new Error('URL do projeto inválida. Use o formato: https://tree.taiga.io/project/nome-projeto');
      }

      const stories = await getUserStories(projectSlug);
      setStatus('Processando histórias...');
      setProgress(30);

      const reportData = [];
      const totalStories = stories.length;

      for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        const comments = await getComments(story.id);
        const progressPercentage = 30 + Math.floor((i / totalStories) * 60);
        setProgress(progressPercentage);
        setStatus(`Processando história ${i + 1} de ${totalStories}...`);

        const filteredComments = comments.filter(comment => {
          const commentDate = new Date(comment.created_at);
          const startDateTime = parse(startDate, 'dd/MM/yyyy', new Date());
          const endDateTime = parse(endDate, 'dd/MM/yyyy', new Date());
          
          return isWithinInterval(commentDate, { start: startDateTime, end: endDateTime });
        });

        if (filteredComments.length > 0) {
          const formattedComments = filteredComments
            .map(comment => 
              `[${format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm')} - ${comment.user.full_name}]: ${comment.comment}`
            )
            .join('\n');

          reportData.push({
            id: story.id,
            subject: story.subject,
            status: story.status_extra_info.name,
            comments: formattedComments,
            date: format(new Date(story.created_date), 'dd/MM/yyyy')
          });
        }
      }

      setStatus('Gerando arquivo CSV...');
      setProgress(90);
      const csvContent = generateCSV(reportData);
      downloadCSV(csvContent, startDate, endDate);
      setProgress(100);
      setStatus('Relatório gerado com sucesso!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar relatório';
      setError(errorMessage);
      setStatus('');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 flex flex-col">
      {/* Header */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <img 
              src="https://sofintech.com.br/images/logo-default-191x52.png" 
              alt="Sofintech Logo" 
              className="h-8"
            />
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-gray-800">Gerador de Relatórios</h2>
            <p className="text-sm text-gray-500">Taiga Report Generator</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 flex-grow">
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL do Projeto
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="https://tree.taiga.io/project/nome-projeto"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Exemplo: https://tree.taiga.io/project/tenorioclaudio-banpara
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formatDateForDisplay(startDate)}
                onChange={(e) => setStartDate(formatDateFromPicker(e.target.value))}
                disabled={loading}
                max={formatDateForDisplay(endDate) || undefined}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formatDateForDisplay(endDate)}
                onChange={(e) => setEndDate(formatDateFromPicker(e.target.value))}
                disabled={loading}
                min={formatDateForDisplay(startDate) || undefined}
              />
            </div>
          </div>

          <button
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors duration-200 flex items-center justify-center gap-3 font-medium"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <Download className="w-6 h-6" />
            )}
            {loading ? 'Processando...' : 'Gerar Relatório'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {!loading && status && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {status}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Sofintech. Todos os direitos reservados.</p>
            <p className="text-xs mt-1">Software proprietário - Uso exclusivo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportGenerator;