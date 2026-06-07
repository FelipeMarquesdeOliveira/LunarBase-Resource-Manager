# LunarBase Resource Manager

> **Global Solution 2026.1** — Mobile Development & IoT
> Engenharia de Software — 3º Ano
> FIAP

Dashboard mobile em **React Native + Expo (TypeScript)** que simula a gestao de recursos vitais de uma base lunar. O app conecta as disciplinas da GS em um projeto unico e integrado.

## Tema

Vertente: **Sistemas autonomos e robotica para exploracao espacial**.

Conectado aos **ODS da ONU** (9 - Industria, Inovacao e Infraestrutura / 13 - Acao Climática), o app simula o monitoramento e gestao de agua, energia, oxigenio e alimentos em uma base lunar — demonstrando como a tecnologia espacial impacta a vida na Terra.

## Estrutura do Projeto

```
LunarBase-Resource-Manager/
├── app/                          # Expo Router (navegacao por arquivo)
│   ├── _layout.tsx               # Root layout com providers (Theme, Resources, Simulation)
│   ├── index.tsx                 # Tela splash/home
│   ├── (tabs)/                   # Navegacao por abas
│   │   ├── _layout.tsx           # Tab navigator
│   │   ├── dashboard.tsx          # Dashboard principal com graficos
│   │   ├── resources.tsx          # Lista de recursos com filtro
│   │   ├── events.tsx            # Eventos (EVA, tempestade solar, etc.)
│   │   └── settings.tsx          # Ajustes, tema e configuracao de simulacao
│   ├── resource/
│   │   ├── [id].tsx              # Detalhe de recurso especifico
│   │   └── new.tsx               # Formulario de novo recurso com validacao
│   └── simulation/
│       └── index.tsx             # Simulacao de consumo dia a dia
├── src/
│   ├── components/               # 10 componentes reutilizaveis
│   ├── context/                  # ThemeContext, ResourcesContext, SimulationContext
│   ├── hooks/                    # useAsyncStorage, useResourceStats
│   ├── services/                 # AsyncStorage wrapper
│   ├── data/                     # Mock data com recursos e eventos
│   ├── types/                    # Tipagens TypeScript
│   ├── theme/                    # Paleta de cores espaciais (dark/light)
│   └── utils/                    # Logica de criticidade e formatacao
└── assets/                      # Icones e splash com tema espacial
```

## Funcionalidades

| Recurso | Implementacao |
|---|---|
| **Expo Router** | 6 telas, navegacao stack + tabs |
| **useState / useEffect** | Gerenciamento de estado em todas as telas |
| **Context API** | ThemeContext, ResourcesContext, SimulationContext |
| **AsyncStorage** | Persistencia de tema, recursos e configuracao de simulacao |
| **Formulario com validacao** | NewResourceScreen com validacao completa |
| **Dashboards com graficos** | Dashboard com LineChart (react-native-chart-kit) |
| **Componentizacao** | 10 componentes reutilizaveis |
| **Tema dinammico (dark/light)** | Toggle automatico com persistencia |
| **TypeScript** | Projeto 100% tipado |

## Screens

1. **Home/Splash** — Tela inicial com animacao de loading
2. **Dashboard** — Metricas, graficos de historico, cards de recursos
3. **Recursos** — Lista com filtro por tipo (agua, energia, oxigenio, alimento)
4. **Eventos** — Lista de eventos lunares (EVA, tempestade solar, reabastecimento, manutencao, alertas)
5. **Ajustes** — Toggle de tema, configuracao de eventos ativos, reset de dados
6. **Detalhe do Recurso** — Metricas, historico em grafico, botoes de ajuste
7. **Novo Recurso** — Formulario com validacao (nome, unidade, capacidade, consumo, fonte)
8. **Simulacao** — Configura tripulacao e dias, executa simulacao de consumo

## Instalacao e Execucao

### Pré-requisitos
- Node.js 18+
- npm ou pnpm
- Expo Go (Android/iOS) ou emulador

### Passos

```bash
# Clonar o repositorio
git clone https://github.com/FelipeMarquesdeOliveira/LunarBase-Resource-Manager.git
cd LunarBase-Resource-Manager

# Instalar dependencias
npm install

# Executar
npx expo start
```

### Expo Go (QR Code)
1. Instale o app **Expo Go** no celular
2. Escaneie o QR Code gerado pelo `npx expo start`
3. O app vai carregar com hot-reload

## Tecnologias

- React Native + Expo SDK 53
- TypeScript
- Expo Router (file-based routing)
- react-native-chart-kit (graficos)
- react-native-reanimated (animações)
- @react-native-async-storage/async-storage (persistência)
- React Native SVG

## Integrantes

- Nome Completo | RM: 000000
- Nome Completo | RM: 000000
- Nome Completo | RM: 000000
- Nome Completo | RM: 000000
- Nome Completo | RM: 000000

---

**Professor:** Prof. Hercules Ramos
**Disciplina:** Mobile Development & IoT — Global Solution 2026.1
**FIAP** — Todos os direitos reservados