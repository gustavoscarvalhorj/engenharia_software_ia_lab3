# Refúgio — PoC de reservas de hotéis

SPA Angular para validar a busca de hotéis e a revisão de uma estadia. Todas as APIs são interceptadas no navegador pelo MSW; não há backend, banco de dados, autenticação, pagamento ou confirmação de reserva.

## Requisitos

- Node.js 20.19+ ou 22.12+
- Corepack habilitado

## Executar

```bash
corepack yarn install
corepack yarn start
```

Acesse `http://localhost:4200`. O service worker mockado precisa ser servido pela aplicação; abrir o HTML diretamente não funciona.

## Qualidade

```bash
corepack yarn lint
corepack yarn test --watch=false
corepack yarn build
```

## Arquitetura

- `src/app/features/hotel-search`: domínio, acesso HTTP e página da busca.
- `src/app/features/checkout`: domínio, acesso HTTP e página de revisão.
- `src/app/shared`: contratos e validadores reutilizáveis, sem dependência de features.
- `src/app/core`: infraestrutura transversal de HTTP e observabilidade.
- `src/app/mocks`: handlers MSW e fixtures em memória.

As rotas `/hotels` e `/checkout` são carregadas de forma preguiçosa. A seleção transitória é serializada na URL; o checkout consulta novamente o hotel por ID. Um acesso inválido ou expirado redireciona a jornada para uma nova busca.

## Cenários dos mocks

Os handlers aceitam o cabeçalho de desenvolvimento/teste `x-mock-scenario` com `empty` ou `error`. Nenhum controle técnico é mostrado ao usuário final. A resposta normal tem latência inferior a 500 ms e todos os contratos incluem `correlationId`.

## Decisões

As decisões arquiteturais estão em `arch.md`. O checkout implementado é somente um resumo de hotel, datas, hóspedes, noites e total estimado (`diária × noites`), sem coleta de dados pessoais.
