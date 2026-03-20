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
│   ├── api/            # Backend com Node.js + Express
│   └── shell-e2e/      # Testes E2E da aplicação
│   ├── order/          # Remote da exchange
│   └── order-e2e/      # Testes E2E do Remote
├── libs/
│   ├── domain/         # Lógica de negócios e modelos de dados
│   └── shared/         # Componentes reutilizáveis e estilos
└── nx.json             # Configuração do monorepo NX
```

---

## Arquitetura

Este projeto segue uma arquitetura baseada em monorepo com NX:

- apps: aplicações executáveis (frontend e backend)
- libs: módulos compartilhados entre aplicações
  - domain: regras de negócio e tipos
  - shared: UI e utilitários reutilizáveis

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

# Frontend
nx serve shell

# Backend
nx serve api

# Executar testes unitários
nx test shell

# Executar testes E2E
nx e2e shell-e2e
```

> Alguns scripts podem ser chamados diretamente pelo NX caso esteja instalado globalmente:
> `npm add --global nx`
> `nx serve shell` | `nx build shell` | `nx test domain`

---

## Funcionalidades

### 📦 Gestão de Ordens
- Criação, listagem e cancelamento de ordens
- Status de execução (open, partial, executed, cancelled)

### 🔍 Filtros e Consulta
- Filtro por instrumento, status, side e data
- Ordenação dinâmica
- Paginação no backend

### 🎨 Interface
- Modal de criação de ordens
- Badges de status e side
- Layout responsivo com Tailwind

### ⚙️ Arquitetura
- Estado global com Zustand
- Comunicação via API REST
- Monorepo com NX e libs compartilhadas

---

## Decisões Técnicas

- Uso de Zustand para simplicidade e performance no estado global
- Backend em Express para simular uma API real de exchange
- NX para isolamento de domínios, reutilização de código e escalabilidade do monorepo

Por se tratar de um desafio técnico, a escolha pelo uso de um monorepo com NX foi feita de forma intencional para demonstrar uma arquitetura mais escalável e próxima de cenários reais de produtos em crescimento.
Em vez de uma abordagem monolítica tradicional, a aplicação foi estruturada em domínios separados (apps e libs compartilhadas), permitindo melhor organização, isolamento de responsabilidades e evolução independente das partes do sistema.
Apesar do escopo atual conter uma aplicação principal e um backend, a arquitetura foi pensada para suportar facilmente a expansão do sistema, incluindo novos frontends, serviços backend adicionais e compartilhamento de regras de negócio entre eles.

---

## Autor

**Gabriel Luiz** – Envio do desafio para **Flowa** via **Coodesh**
Contato:

[![](https://img.shields.io/badge/LinkedIn-gabrielluizs1996-white?logo=inspire&logoColor=blue&style=for-the-badge)](https://www.linkedin.com/in/gabrielluizs1996/)