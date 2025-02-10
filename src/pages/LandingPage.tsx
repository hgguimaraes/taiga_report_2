import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Terminal } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <img
            src="https://sofintech.com.br/images/logo-default-191x52.png"
            alt="Sofintech Logo"
            className="h-8"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Taiga Tools
          </h1>
          <p className="text-xl text-gray-600">
            Escolha a ferramenta que deseja utilizar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Report Generator Card */}
          <button
            onClick={() => navigate('/report')}
            className="group relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 rounded-t-2xl" />
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Gerador de Relatórios
              </h2>
              <p className="text-gray-600 mb-6">
                Gere relatórios detalhados de backlogs e comentários do Taiga com filtros por período.
              </p>
              <span className="text-indigo-600 font-medium group-hover:text-indigo-700">
                Acessar Ferramenta →
              </span>
            </div>
          </button>

          {/* API Tester Card */}
          <button
            onClick={() => navigate('/api-tester')}
            className="group relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 rounded-t-2xl" />
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Terminal className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                API Tester
              </h2>
              <p className="text-gray-600 mb-6">
                Teste e explore os endpoints da API do Taiga com uma interface interativa.
              </p>
              <span className="text-blue-600 font-medium group-hover:text-blue-700">
                Acessar Ferramenta →
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Sofintech. Todos os direitos reservados.</p>
            <p className="text-xs mt-1">Software proprietário - Uso exclusivo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;