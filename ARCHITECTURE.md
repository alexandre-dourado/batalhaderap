# ARCHITECTURE - BATALHA

## 1. Stack Tecnológica
- **React 18** (UI)
- **TypeScript** (Tipagem forte)
- **Vite** (Build e dev server)
- **Tailwind CSS** (Estilização)
- **Dexie.js** (Wrapper IndexedDB para persistência offline)
- **Vite PWA Plugin** (Service worker e manifest)

## 2. Estrutura de Diretórios
```
src/
├── components/
│   ├── ui/ (Botões, Inputs, Cards isolados)
│   ├── bracket/ (Componente visual de chaveamento)
│   ├── battle/ (Motor e tela da batalha live)
│   ├── audio/ (Player de beats local)
├── core/
│   ├── engine/ (Lógica de sorteio, avanço de chaves, vitórias)
│   ├── db/ (Dexie config e stores)
│   ├── types/ (Tipos TypeScript)
├── hooks/ (Custom hooks para db, timer, etc)
├── pages/ (Rotas da aplicação)
├── assets/ (Ícones, sons)
```

## 3. Princípio Offline-First
Todos os dados (`events`, `participants`, `battles`, `beats`) são lidos e escritos primeiramente no Dexie.js (IndexedDB). Não dependemos de APIs web. A aplicação funcionará offline e garantirá o estado através de salvamentos a cada passo do operador.
