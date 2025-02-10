## Manual do Usuário - Taiga Report Generator

### Introdução

O Taiga Report Generator é uma ferramenta que permite gerar relatórios detalhados de histórias de usuário e comentários do Taiga. Este manual fornece instruções passo a passo para utilizar todas as funcionalidades da aplicação.

### Índice

1. [Acesso à Aplicação](#acesso-à-aplicação)
2. [Gerador de Relatórios](#gerador-de-relatórios)
3. [API Tester](#api-tester)
4. [Solução de Problemas](#solução-de-problemas)

### Acesso à Aplicação

1. Abra seu navegador web
2. Acesse a URL da aplicação
3. Na página inicial, você verá duas opções:
   - Gerador de Relatórios
   - API Tester

### Gerador de Relatórios

#### Gerando um Relatório

1. Clique em "Gerador de Relatórios" na página inicial
2. Preencha os campos necessários:
   - URL do Projeto Taiga
     - Formato: `https://tree.taiga.io/project/nome-projeto`
     - Exemplo: `https://tree.taiga.io/project/meu-projeto`
   - Data Inicial
   - Data Final

3. Clique em "Gerar Relatório"
4. Aguarde o processamento (acompanhe pela barra de progresso)
5. O arquivo CSV será baixado automaticamente

#### Formato do Relatório

O arquivo CSV gerado contém as seguintes colunas:
- ID: Identificador da história
- Tarefa: Título da história
- Data de Criação: Data em que a história foi criada
- Status: Status atual da história
- Comentários: Lista de comentários no formato:
  ```
  [DATA - AUTOR]: COMENTÁRIO
  [DATA - AUTOR]: COMENTÁRIO
  ```

### API Tester

#### Realizando Testes

1. Clique em "API Tester" na página inicial
2. Escolha um endpoint predefinido ou configure manualmente:
   - Autenticação
   - Listar Histórias
   - Buscar Comentários

3. Para cada endpoint:
   - Selecione o método HTTP
   - Configure parâmetros (se necessário)
   - Adicione corpo da requisição (se necessário)
   - Clique em "Enviar Request"

#### Endpoints Disponíveis

1. **Autenticação**
   - Método: POST
   - Endpoint: /auth
   - Corpo: Credenciais

2. **Listar Histórias**
   - Método: GET
   - Endpoint: /userstories
   - Parâmetros:
     - project (obrigatório)
     - page
     - page_size

3. **Buscar Comentários**
   - Método: GET
   - Endpoint: /history/userstory/{id}
   - Parâmetros:
     - id (obrigatório)

### Solução de Problemas

#### Erros Comuns

1. **URL do Projeto Inválida**
   - Verifique se a URL está no formato correto
   - Confirme se o projeto existe e é acessível

2. **Erro de Autenticação**
   - Verifique suas credenciais
   - Tente gerar um novo token

3. **Sem Dados no Período**
   - Confirme se existem histórias no período selecionado
   - Verifique se as datas estão corretas

4. **Erro ao Baixar Relatório**
   - Verifique as permissões do navegador
   - Tente novamente em alguns minutos

#### Dicas

1. **Performance**
   - Use períodos menores para relatórios mais rápidos
   - Evite gerar relatórios muito grandes

2. **Formato de Datas**
   - Use o seletor de data para evitar erros
   - Datas devem estar no formato DD/MM/YYYY

3. **API Tester**
   - Copie o token após autenticação
   - Use o botão de copiar para evitar erros

### Suporte

Para suporte técnico ou dúvidas:
- Email: suporte@sofintech.com.br
- Website: https://sofintech.com.br

### Atualizações

A aplicação é atualizada regularmente. Consulte a documentação mais recente para novidades e melhorias.