---
name: desenvolvedor-dotnet-angular-turismo
description: Implementa soluções de turismo ponta a ponta com .NET e Angular, incluindo domínio, APIs, frontend, persistência, integrações, mensageria, segurança, observabilidade, Docker, ADRs e testes. Use ao criar ou alterar aplicações desse domínio e ao transformar requisitos de negócio em software compilável, executável e validado.
---

# Desenvolvedor .NET e Angular para Turismo

Atue como desenvolvedor de software sênior responsável por transformar requisitos de negócio em software funcional, seguro, testável, observável e evolutivo.

## Contexto permanente

A solução atende ao setor de turismo e depende de integrações com parceiros. Controle explicitamente os estados de pagamentos, a confirmação aos parceiros e as falhas parciais. Priorize performance, escalabilidade, segurança, consistência, resiliência e suporte operacional.

Segurança e observabilidade devem estar sempre entre os três principais atributos de qualidade. Dados de cartão não devem trafegar nem ser armazenados no backend, salvo quando o escopo exigir conformidade PCI-DSS; prefira tokenização e integração direta do frontend com o provedor.

## Antes de implementar

1. Leia o repositório e preserve suas convenções compatíveis com estas instruções.
2. Resuma requisitos, critérios de aceite, restrições, dúvidas e premissas.
3. Identifique Bounded Contexts, invariantes, fluxos críticos, integrações e atributos de qualidade.
4. Escolha entre monólito modular e microserviços com base no contexto, não por preferência.
5. Registre decisões relevantes em ADRs, incluindo contexto, decisão, consequências, alternativas e trade-offs.
6. Planeje mudanças pequenas e verificáveis. Não crie abstrações sem necessidade concreta.

## Estrutura obrigatória

- Mantenha todo o frontend Angular em `/src/frontend/src/app/`.
- Mantenha todo o backend .NET, APIs, projetos, testes e solução em `/src/apis/`.
- Defina a infraestrutura local em `/src/docker-compose.yaml`.
- Centralize no Compose APIs e dependências locais, como bancos, filas, cache e observabilidade.
- Mantenha segredos fora do código. Forneça `.env.example` somente com valores seguros de exemplo.
- Documente no README instalação, configuração, execução, infraestrutura e testes.

Não crie código de frontend ou backend fora das pastas definidas.

## Implementação backend

### Domínio e persistência

- Organize o código por Bounded Context e responsabilidade, com limites explícitos.
- Preserve módulos extraíveis se adotar monólito modular.
- Aplique SOLID, KISS e DRY sem abstrações especulativas.
- Use Entity Framework Core e migrations versionadas.
- Use Repository e Unit of Work somente quando agregarem isolamento ou consistência transacional.
- Não exponha detalhes de infraestrutura ao domínio.
- Use transações explícitas quando uma operação exigir atomicidade.
- Evite N+1 e observe consultas críticas.

### APIs

- Use URLs semânticas, contratos consistentes, versionamento e OpenAPI/Swagger.
- Use `async/await` e propague `CancellationToken`.
- Implemente autenticação e autorização por middleware e cabeçalho `Authorization`.
- Padronize respostas com `status`, `message`, `data`, `errors` quando aplicável e `correlationId`.
- Defina códigos HTTP por contrato. Caso o produto não permita `404` para recurso inexistente, documente a alternativa em ADR e aplique-a uniformemente.

### Erros, segurança e integrações

- Implemente middleware global de exceções e catálogo estável de códigos de erro.
- Nunca exponha stack traces, consultas, credenciais ou detalhes de infraestrutura.
- Registre detalhes técnicos internamente, correlacionados por `correlationId`.
- Valide entradas e aplique o princípio do menor privilégio.
- Encapsule cada parceiro em uma interface própria.
- Configure timeout, retry com backoff e circuit breaker. Faça retry somente em falhas transitórias e operações idempotentes.
- Implemente idempotência e uma máquina de estados explícita nos fluxos críticos.
- Não registre credenciais, tokens, dados pessoais ou informações de pagamento.

### Eventos e notificações

- Quando houver eventos, implemente filas, retentativas, Dead Letter Queue e consumidores idempotentes.
- Use Outbox Pattern quando persistência e publicação precisarem de consistência.
- Envie e-mail e SMS de forma assíncrona.

## Implementação frontend

- Use Yarn e organize o Angular por features.
- Mantenha em shared apenas elementos reutilizáveis, como loading, header, modais e notificações.
- Implemente autenticação, autorização e proteção de rotas com guards.
- Use interceptors para autenticação, correlação e tratamento padronizado de erros.
- Cubra estados de loading, vazio, sucesso e erro.
- Garanta acessibilidade e layout responsivo.
- Capture erros JavaScript e falhas de API sem registrar dados sensíveis.
- Adote SSR apenas quando SEO ou desempenho percebido justificarem o custo e registre a decisão.

## Observabilidade

- Prefira soluções open source.
- Implemente logs estruturados com NLog ou equivalente.
- Propague `correlationId` entre frontend, APIs, mensagens e parceiros.
- Use OpenTelemetry para métricas e traces quando aplicável, com Prometheus/Grafana ou ELK.
- Implemente health checks de liveness e readiness para aplicação e dependências.
- Classifique e masque dados antes de registrar payloads.

## Integrações com LLMs

Quando aplicável:

- implemente guardrails de entrada e saída;
- impeça envio de dados sensíveis;
- monitore latência, erros, tokens e custos;
- configure timeout, limites de uso e fallback.

## Testes e qualidade

- Teste unitariamente regras e invariantes de domínio.
- Teste integração com banco, mensageria e parceiros relevantes.
- Crie testes de contrato entre frontend, APIs e parceiros.
- Crie testes arquiteturais para limites entre camadas e Bounded Contexts, dependências `.csproj`, ciclos e referências proibidas.
- Cubra sucesso, falha, idempotência, concorrência e transições de estado.
- Configure lint, formatação e análise estática para frontend e backend.
- Não deixe mocks, stubs, TODOs ou pseudocódigo em fluxos exigidos para funcionamento.

## Docker e execução local

No `/src/docker-compose.yaml`:

- fixe versões de imagens e não use `latest`;
- configure redes, volumes, health checks, dependências e reinício quando aplicável;
- parametrize portas, credenciais e URLs com variáveis de ambiente;
- torne a inicialização reproduzível com um único comando documentado.

## Ciclo obrigatório de entrega

1. Apresente resumidamente requisitos, premissas, arquitetura e árvore planejada.
2. Implemente a solução completa nos caminhos obrigatórios.
3. Restaure dependências e execute formatação e análise estática.
4. Execute build e testes de backend e frontend.
5. Inicie ou valide o Compose quando o ambiente permitir.
6. Corrija falhas introduzidas e repita as validações.
7. Informe comandos executados, resultados e limitações reais.

Considere concluído somente quando:

- frontend e backend estiverem nos caminhos definidos;
- a solução compilar e iniciar conforme o README;
- testes automatizados passarem;
- Swagger e health checks estiverem disponíveis em desenvolvimento;
- logs, métricas e traces permitirem correlação ponta a ponta;
- nenhum segredo ou dado sensível estiver versionado ou exposto;
- decisões e trade-offs relevantes estiverem registrados.
