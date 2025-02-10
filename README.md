# Taiga Report Generator

## Descrição

O Taiga Report Generator é uma aplicação web desenvolvida pela Sofintech que permite gerar relatórios detalhados de backlogs e comentários do Taiga, uma plataforma de gestão de projetos ágeis. A aplicação oferece uma interface intuitiva para filtrar e exportar dados por período específico.

## Funcionalidades Principais

- 🔐 Autenticação automática com a API do Taiga
- 📊 Geração de relatórios em formato CSV
- 📅 Filtro por período (data inicial e final)
- 📝 Exportação de dados incluindo:
  - ID da tarefa
  - Título da tarefa
  - Data de criação
  - Status da tarefa
  - Comentários (com data e autor)
- 📈 Barra de progresso em tempo real
- 🎨 Interface moderna e responsiva
- 🧪 API Tester integrado para testes de endpoints

## Tecnologias Utilizadas

- **Frontend:**
  - React 18.3.1
  - TypeScript
  - Tailwind CSS
  - Lucide React (ícones)
  - date-fns (manipulação de datas)

- **Integração:**
  - Axios para requisições HTTP
  - API Taiga v1

## Requisitos do Sistema

- Node.js 18.x ou superior
- NPM 8.x ou superior
- Acesso à internet para conexão com a API do Taiga

## Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd taiga-report-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   VITE_TAIGA_API_URL=https://api.taiga.io/api/v1
   VITE_TAIGA_USERNAME=seu_usuario
   VITE_TAIGA_PASSWORD=sua_senha
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

```
src/
├── pages/
│   ├── LandingPage.tsx    # Página inicial com seleção de ferramentas
│   ├── ReportGenerator.tsx # Gerador de relatórios
│   └── ApiTester.tsx      # Interface de teste da API
├── services/
│   └── taigaApi.ts       # Serviços de comunicação com a API do Taiga
├── types/
│   └── taiga.ts          # Definições de tipos TypeScript
├── utils/
│   └── csv.ts            # Utilitários para geração e download de CSV
├── App.tsx               # Componente principal da aplicação
└── main.tsx             # Ponto de entrada da aplicação
```

## Uso da Aplicação

### Gerador de Relatórios

1. Acesse a aplicação através do navegador
2. Selecione "Gerador de Relatórios" na página inicial
3. Insira a URL do projeto Taiga no formato: `https://tree.taiga.io/project/nome-projeto`
4. Selecione o período desejado usando os campos de data inicial e final
5. Clique em "Gerar Relatório"
6. Aguarde o processamento (acompanhe pela barra de progresso)
7. O arquivo CSV será baixado automaticamente ao finalizar

### API Tester

1. Selecione "API Tester" na página inicial
2. Escolha um endpoint predefinido ou insira um personalizado
3. Selecione o método HTTP apropriado
4. Configure o corpo da requisição (se necessário)
5. Clique em "Enviar Request"
6. Visualize a resposta da API no painel direito

## Formato do Relatório CSV

O relatório gerado contém as seguintes colunas:
- **ID**: Identificador único da tarefa
- **Tarefa**: Título/descrição da tarefa
- **Data de Criação**: Data em que a tarefa foi criada
- **Status**: Status atual da tarefa
- **Comentários**: Lista de comentários no formato `[DATA - AUTOR]: COMENTÁRIO`

## Manutenção e Desenvolvimento

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run preview`: Visualiza a build de produção localmente
- `npm run lint`: Executa a verificação de código com ESLint

### Boas Práticas

- Mantenha as credenciais seguras usando variáveis de ambiente
- Siga o padrão de commits do projeto
- Documente alterações significativas
- Execute o linter antes de commits

## Segurança

- As credenciais são armazenadas em variáveis de ambiente
- A autenticação é gerenciada automaticamente
- Tokens são mantidos apenas em memória durante a sessão

## Suporte

Para suporte técnico ou dúvidas, entre em contato com a equipe de desenvolvimento da Sofintech:
- Email: [suporte@sofintech.com.br](mailto:suporte@sofintech.com.br)
- Website: [https://sofintech.com.br](https://sofintech.com.br)

## Licença

© 2024 Sofintech. Todos os direitos reservados.
Software proprietário - Uso exclusivo