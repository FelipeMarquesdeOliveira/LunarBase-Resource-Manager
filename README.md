# LunarBase Resource Manager

Global Solution 2026.1 - Mobile Development & IoT
Engenharia de Software - 3o Ano
FIAP

## Descricao

Dashboard mobile em React Native + Expo (TypeScript) que simula a gestao de recursos vitais de uma base lunar. O sistema conecta as disciplinas da Global Solution em um projeto unico e integrado, demonstrando o monitoramento e controle de agua, energia, oxigenio e alimentos em um ambiente lunar.

Vertente: Sistemas autonomos e robotica para exploracao espacial.

Conexao com ODS da ONU: ODS 9 (Industria, Inovacao e Infraestrutura) / ODS 13 (Acao Climatica).

## Estrutura do Projeto

```
LunarBase-Resource-Manager/
|-- app/                          # Expo Router (navegacao por arquivo)
|   |-- _layout.tsx               # Root layout com providers (Theme, Resources, Simulation)
|   |-- index.tsx                 # Tela splash/home com animacao
|   |-- (tabs)/                   # Navegacao por abas
|   |   |-- _layout.tsx           # Tab navigator
|   |   |-- dashboard.tsx          # Command center interativo
|   |   |-- resources.tsx         # Lista de recursos com filtros
|   |   |-- events.tsx            # Eventos lunares (EVA, tempestade solar, etc.)
|   |   |-- settings.tsx          # Ajustes, tema e configuracao
|   |-- resource/
|   |   |-- [id].tsx              # Detalhe de recurso com +/- e grafico
|   |   |-- new.tsx               # Formulario de novo recurso com validacao
|   |-- simulation/
|   |   |-- index.tsx             # Simulacao de consumo dia a dia
|   |-- space/
|       |-- index.tsx             # Dados reais da NASA APOD API
|-- src/
|   |-- components/               # 12 componentes reutilizaveis
|   |-- context/                  # ThemeContext, ResourcesContext, SimulationContext
|   |-- hooks/                    # useAsyncStorage, useResourceStats
|   |-- services/                 # AsyncStorage + NASA API
|   |-- data/                     # Mock data com recursos e eventos lunares
|   |-- types/                    # Tipagens TypeScript completas
|   |-- theme/                    # Paleta de cores espaciais (dark/light)
|   |-- utils/                    # Logica de criticidade e formatacao
|-- assets/                      # Icones e splash com tema espacial
```

## Funcionalidades Implementadas

| Recurso | Descricao |
|---|---|
| Expo Router | 9 telas com navegacao stack + tabs |
| useState / useEffect | Gerenciamento de estado em todas as telas |
| Context API | ThemeContext, ResourcesContext, SimulationContext |
| AsyncStorage | Persistencia de tema, recursos e configuracao de simulacao |
| Formulario com validacao | NewResourceScreen com validacao completa |
| Dashboards com graficos | Dashboard + ResourceDetail com LineChart |
| Componentizacao | 12 componentes reutilizaveis |
| Tema dinamico (dark/light) | Toggle automatico com persistencia |
| TypeScript | Projeto 100% tipado |
| Animações | Focus-triggered em todas as telas |
| NASA APOD API | Dados reais de astronomia (diferencial) |

## Screens

### Home / Splash
Tela inicial com animacao de entrada, status da base e botao "Enter System".

<!-- ![Home](assets/screenshots/home.png) -->

### Dashboard — Command Center
Mission clock, status da missão (dia, tripulação, recursos ativos) e widgets interativos de ajuste rápido por recurso.

<img src="assets/screenshots/dashboard.png" width="280" />

### Recursos
Lista de todos os recursos vitais com filtros por tipo (ALL, H2O, PWR, O2, FOOD), métricas de autonomia e consumo diário.

<img src="assets/screenshots/recursos.png" width="280" />

### Eventos
Painel de eventos lunares (EVA, tempestade solar, reabastecimento, manutenção) com contadores de severidade HIGH / MED / LOW.

<img src="assets/screenshots/eventos.png" width="280" />

### Ajustes / Settings
Controle de tema (Auto / Light / Dark), toggles de eventos de simulação e acesso rápido à Simulation.

<img src="assets/screenshots/ajustes.png" width="280" />

### Detalhe de Recurso
Métricas detalhadas (current, max, autonomia, consumo diário), gráfico de tendência 7 dias e botões de ajuste (−10 / −1 / +1 / +10).

<img src="assets/screenshots/detalhe-recurso.png" width="280" />

### Novo Recurso
Formulário completo com seleção de tipo (H2O / PWR / O2 / FOOD), campos validados e botão SAVE.

<!-- ![Novo Recurso](assets/screenshots/novo-recurso.png) -->

### Simulação
Configuração de tripulação e duração em dias, execução de simulação de consumo com eventos aleatórios.

<img src="assets/screenshots/simulacao.png" width="280" />

## Instalacao e Execucao

### Pre-requisitos
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

# Executar em modo de desenvolvimento
npx expo start

# Limpar cache se necessario
npx expo start --clear
```

### Expo Go (QR Code)
1. Instale o app Expo Go no celular
2. Escaneie o QR Code gerado pelo npx expo start
3. O app carregara com hot-reload

## Tecnologias

- React Native + Expo SDK 53
- TypeScript (strict mode)
- Expo Router (file-based routing)
- react-native-chart-kit (graficos)
- react-native-reanimated (animacoes)
- @react-native-async-storage/async-storage (persistencia)
- React Native SVG
- NASA Open APIs (diferencial)

## Integrantes

- Felipe Marques de Oliveira | RM: 556319
- Gabriel Barros Cisoto | RM: 556309

## Professor

Prof. Hercules Ramos
Disciplina: Mobile Development & IoT - Global Solution 2026.1
FIAP - Todos os direitos reservados