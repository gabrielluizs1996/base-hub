#  📈 Base Exchange - NX Monorepo

Este projeto faz parte do **desafio técnico para Engenheiro de Software** da **Flowa**, enviado via **Coodesh**. Ele consiste em uma aplicação de exchange de ordens, implementada como um monorepo utilizando **NX**, com múltiplos apps e libs compartilhadas.

<div align="center">

  [![Live Demo](https://img.shields.io/badge/Live_Demo-white?logo=vercel&logoColor=3c83f6&style=for-the-badge)](https://base-hub-liart.vercel.app/)

</div>

---

## Tecnologias Utilizadas

- **Monorepo**: [NX](https://nx.dev/)
- **Frontend**: React + TypeScript
- **State Management**: Zustand
- **UI Components**: Biblioteca interna baseada em Tailwind CSS
- **Testes**: Jest + Testing Library + Playwright (E2E)
- **Estilo**: Tailwind CSS
- **Ferramentas de Build**: Vite (para apps React) + NX CLI

---

## Estrutura do Projeto

```
base-exchange/
├── apps/
│   ├── shell/          # Aplicação principal da exchange
│   └── shell-e2e/      # Testes E2E da aplicação
│   ├── order/          # Remote da exchange
│   └── order-e2e/      # Testes E2E do Remote
├── libs/
│   ├── domain/         # Lógica de negócios e modelos de dados
│   └── shared/         # Componentes reutilizáveis e estilos
└── nx.json             # Configuração do monorepo NX
```

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/gabrielluizs1996/base-hub.git
cd base-hub
npm install
```

> Certifique-se de ter o **Node.js >= 18** e **NX CLI** instalado globalmente (`npm install -g nx`).

---

## Scripts Disponíveis

Executados via **NX** ou **npm**:

```bash
# Rodar a aplicação em modo de desenvolvimento
nx serve shell

# Build de produção
npm run build:shell

# Executar testes unitários
nx test shell

# Executar testes E2E
nx e2e shell-e2e
```

> Alguns scripts podem ser chamados diretamente pelo NX:
> `nx serve shell` | `nx build shell` | `nx test domain`

---

## Funcionalidades Principais

- Cadastro e listagem de ordens de compra e venda
- Filtragem e ordenação de ordens
- Modal de criação e cancelamento de ordens
- Badges de status e side da ordem
- Armazenamento de estado via Zustand
- Layout responsivo utilizando Tailwind CSS

---

## Observações

- Este projeto é **parte de um desafio técnico**, então algumas soluções podem priorizar **clareza e organização** do que produção em larga escala.
- O foco está na **estrutura modular do monorepo**, **componentização**, **testes automatizados** e **boa prática em TypeScript/React**.

---

## Autor

**Gabriel Luiz** – Envio do desafio para **Flowa** via **Coodesh**
Contato:

[![](https://img.shields.io/badge/LinkedIn-gabrielluizs1996-white?logo=inspire&logoColor=blue&style=for-the-badge)](https://www.linkedin.com/in/gabrielluizs1996/)