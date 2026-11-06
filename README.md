# ⚔️ KazTactics - Jogo Web de Estratégia Tática em Turnos & Deckbuilder

Um jogo completo de Estratégia Tática em Turnos com Ação Reativa em Tempo Real e Construção de Baralhos, construído com **Next.js (App Router, Turbopack)**, **TypeScript**, **Tailwind CSS**, **Drizzle ORM** e banco de dados **NeonDB PostgreSQL Serverless**.

---

## 🚀 Como Executar o Jogo

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar o servidor de desenvolvimento
npm run dev
```

Acesse no navegador: **`http://localhost:3000`**

---

## 🗺️ Mapa de Rotas e Telas

1. **Hub Principal (`/`)**: Painel central do comandante, resumo dos 4 pilares, catálogo com as 50 cartas e manual tático explicando os 8 tipos e a mecânica de Linha de Visão vs Arremesso.
2. **Mapa de Fases da Campanha (`/campaign`)**: 5 Fases PvE com progressão contínua, bloqueio de estágios futuros, HP dos Núcleos inimigos e recompensas em Ouro persistidas no NeonDB.
3. **Meu Baralho / Deckbuilder (`/deckbuilder`)**: Montagem e validação estrita de baralhos de exatamente **30 cartas** (exatamente **20 Monstros** e **10 Feitiços**), curva de mana e filtros completos.
4. **Campo de Batalha Tático (`/battle?stage=X`)**: Tabuleiro tático matricial **11x7** com:
   - Destruição de Núcleos (Jogador com 1000 HP vs IA com barra de HP da fase).
   - Gestão de Mana (+3 por turno, teto de 15).
   - Limite estrito de 7/7 criaturas vivas em campo.
   - Algoritmo de Linha de Visão (*Line of Sight*) via Bresenham 2D bloqueado por obstáculos e unidades.
   - Ataques de *Arremesso* em arco parabólico saltando sobre muralhas.
   - Feitiços instantâneos disparáveis a qualquer momento.
   - Números de dano flutuantes (*Floating Damage Numbers*).
   - Inteligência Artificial PvE tática com heurísticas de foco no Núcleo e dano letal.
5. **Loja de Pacotes & Gacha 3D (`/shop`)**: Abertura interativa de boosters com virada de cartas 3D (*flip*), auras de raridade e probabilidades ponderadas no servidor.

---

## 🧪 Scripts de Validação Automatizados

Todos os scripts foram desenhados com encerramento de conexão seguro no NeonDB:

```bash
# Testar integridade do banco e baralho inicial
npx --yes tsx src/db/verify.ts

# Testar Loja e Gacha System com dedução segura de ouro
npx --yes tsx src/db/test-shop.ts

# Testar validação estrita de baralho (30 cartas: 20M / 10F)
npx --yes tsx src/db/test-deckbuilder.ts

# Testar movimentação BFS e Linha de Visão vs Arremesso
npx --yes tsx src/db/test-grid.ts

# Testar economia de mana (+3/turno até 15) e limite de 7 criaturas
npx --yes tsx src/db/test-gamestate.ts

# Testar física de combate de Bresenham e bloqueios
npx --yes tsx src/db/test-combat-math.ts

# Testar condições de vitória (Núcleo e Extermínio) e depósito no NeonDB
npx --yes tsx src/db/test-loop-victory.ts

# Testar Inteligência Artificial PvE (Heurísticas e tomada de decisão)
npx --yes tsx src/db/test-ai-engine.ts

# Testar fluxo completo de fases da campanha e progressão
npx --yes tsx src/db/test-campaign-flow.ts
```
