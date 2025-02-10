import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Send, RefreshCw, AlertCircle, CheckCircle, ArrowLeft, Copy, Check } from 'lucide-react';
import axios from 'axios';

interface ApiResponse {
  status: number;
  data: any;
  headers?: any;
}

interface EndpointConfig {
  value: string;
  method: string;
  label: string;
  description: string;
  defaultBody?: string;
  params?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

function ApiTester() {
  const [endpoint, setEndpoint] = useState('/auth');
  const [method, setMethod] = useState('POST');
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    type: "normal",
    username: "hg_guimaraes",
    password: "051283Hgs@"
  }, null, 2));
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({
    project: '',
    page: '1',
    page_size: '30'
  });

  const predefinedEndpoints: EndpointConfig[] = [
    {
      value: '/auth',
      method: 'POST',
      label: 'Autenticação',
      description: 'Autentica um usuário e retorna um token de acesso',
      defaultBody: JSON.stringify({
        type: "normal",
        username: "hg_guimaraes",
        password: "051283Hgs@"
      }, null, 2)
    },
    {
      value: '/userstories',
      method: 'GET',
      label: 'Listar Histórias',
      description: 'Retorna a lista de histórias de usuário de um projeto',
      params: [
        { name: 'project', type: 'number', required: true, description: 'ID do projeto' },
        { name: 'page', type: 'number', required: false, description: 'Número da página' },
        { name: 'page_size', type: 'number', required: false, description: 'Itens por página' }
      ]
    },
    {
      value: '/history/userstory/{id}',
      method: 'GET',
      label: 'Buscar Comentários',
      description: 'Retorna a lista de comentários de uma história',
      params: [
        { name: 'id', type: 'number', required: true, description: 'ID da história' }
      ]
    }
  ];

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequest = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token && endpoint !== '/auth') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let finalEndpoint = endpoint;
      if (method === 'GET' && Object.keys(queryParams).length > 0) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        finalEndpoint += `?${params.toString()}`;
      }

      const config = {
        method,
        url: `https://api.taiga.io/api/v1${finalEndpoint}`,
        headers,
        data: method !== 'GET' ? JSON.parse(requestBody) : undefined,
      };

      const result = await axios(config);

      if (endpoint === '/auth' && result.data.auth_token) {
        setToken(result.data.auth_token);
      }

      setResponse({
        status: result.status,
        data: result.data,
        headers: result.headers,
      });
    } catch (err: any) {
      setError(
        err.response
          ? `Error ${err.response.status}: ${JSON.stringify(err.response.data, null, 2)}`
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedEndpoint = predefinedEndpoints.find(ep => ep.value === endpoint);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <img
              src="https://sofintech.com.br/images/logo-default-191x52.png"
              alt="Sofintech Logo"
              className="h-8"
            />
            <div className="border-l border-gray-200 h-8" />
            <h1 className="text-xl font-semibold text-gray-900">API Tester</h1>
          </div>
          {token && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Autenticado</span>
                <button
                  onClick={handleCopyToken}
                  className="ml-2 text-green-600 hover:text-green-700"
                  title="Copiar token"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Request</h2>
              
              {/* Endpoint Selection */}
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Endpoint Predefinido
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {predefinedEndpoints.map((ep) => (
                    <button
                      key={ep.value}
                      onClick={() => {
                        setEndpoint(ep.value);
                        setMethod(ep.method);
                        if (ep.defaultBody) {
                          setRequestBody(ep.defaultBody);
                        } else {
                          setRequestBody('');
                        }
                      }}
                      className={`px-4 py-3 rounded-md text-sm ${
                        endpoint === ep.value
                          ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                          : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{ep.label}</span>
                        <span className="text-xs text-gray-500 mt-1">{ep.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Method & Endpoint */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="col-span-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="/endpoint"
                  className="col-span-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Query Parameters */}
              {method === 'GET' && selectedEndpoint?.params && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Query Parameters
                  </label>
                  <div className="space-y-3">
                    {selectedEndpoint.params.map(param => (
                      <div key={param.name} className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">
                          {param.name}
                          {param.required && <span className="text-red-500">*</span>}
                          <span className="ml-1 text-gray-400">({param.description})</span>
                        </label>
                        <input
                          type="text"
                          value={queryParams[param.name] || ''}
                          onChange={(e) => setQueryParams(prev => ({
                            ...prev,
                            [param.name]: e.target.value
                          }))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body */}
              {method !== 'GET' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Body
                  </label>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={10}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                  />
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleRequest}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Request
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Response</h2>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 rounded-md">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono overflow-auto">
                      {error}
                    </pre>
                  </div>
                </div>
              )}

              {response && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      response.status >= 200 && response.status < 300
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {response.status}
                    </span>
                  </div>

                  {/* Headers */}
                  <div className="bg-gray-50 rounded-md p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Headers</h3>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono overflow-auto">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                  </div>

                  {/* Response Body */}
                  <div className="bg-gray-50 rounded-md p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Body</h3>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono overflow-auto">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {!error && !response && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Terminal className="w-12 h-12 mb-2" />
                  <p className="text-sm">Aguardando request...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApiTester;