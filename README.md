# 🚀 Simulador de Gerenciamento de Memória (FIFO)

A página "vítima" do FIFO sendo escolhida e tendo que sair da memória física:

![GIF de HSimpsons](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnZkamxrdmh0ZHAxd20zZjkzNWVwcnExMXoxZXFmdnR4OTV6dzV0aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/11gC4odpiRKuha/giphy.gif)

Este projeto é um simulador gráfico interativo para visualização do gerenciamento de memória virtual paginada, desenvolvido para a disciplina de Sistemas Operacionais da Universidade Federal do Pampa (UNIPAMPA).

A aplicação permite ao usuário definir o tamanho da memória física e virtual, inserir uma sequência de acessos a páginas e observar o comportamento do algoritmo de substituição de página **FIFO (First In, First Out)**.

## 👥 Autores

* **Camilla Charão Borchhardt Quincozes**
* **Emanuel Carricio Ferreira**

## ✨ Funcionalidades

* **Configuração Dinâmica:** Permite ao usuário definir o número de molduras (Memória Física) e o número de páginas (Memória Virtual).
* **Sequência de Acesso:** Permite inserir uma sequência customizada de acessos às páginas.
* **Controle de Execução:** A simulação pode ser executada passo a passo ("Próximo Passo") ou de uma só vez ("Executar Tudo").
* **Visualização da Tabela de Páginas:** Exibe a tabela de páginas completa, mostrando para qual moldura cada página está mapeada, o bit de presença (Sim/Não) e o tempo de carga (Load Time) usado pelo FIFO.
* **Visualização da Memória Física:** Mostra o estado de cada moldura (LIVRE ou OCUP) e qual página a ocupa.
* **Contabilidade de Desempenho:** Calcula e exibe o número total de **Falhas** (Page Faults) e **Acertos** (Hits).
* **Log de Operações:** Apresenta um log detalhado de cada acesso, indicando se foi Acerto ou Falha e, em caso de substituição, qual página foi a "vítima" do FIFO.

## 🛠️ Tecnologias Utilizadas

* **React:** Biblioteca principal para a construção da interface do usuário.
* **TypeScript:** Garante a tipagem e robustez do código-fonte.
* **Tailwind CSS:** Utilizado para a estilização rápida e responsiva dos componentes.

## ⚙️ Como Executar

1.  Clone este repositório:
    ```bash
    git clone [URL-DO-SEU-REPOSITORIO]
    cd [NOME-DA-PASTA]
    ```

2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm  run dev 
    ```

4.  Abra `http://localhost:3000` (ou a porta indicada no seu terminal) no seu navegador.

## 📂 Estrutura do Projeto

A arquitetura do projeto separa claramente a lógica da simulação da interface do usuário:

* `/src/core/`: Contém toda a lógica pura da simulação em TypeScript, sem nenhuma dependência do React.
    * `types.ts`: Define as estruturas de dados centrais (`SimulationState`, `PageTableEntry`).
    * `memory.ts`: Contém a lógica principal de `initializeSimulation` e `processAccess` (o coração do simulador).
    * `fifo.ts`: Implementa a lógica `findVictimFifo` para seleção da vítima.
    * `utils.ts`: Funções auxiliares (ex: formatar a tabela para exibição).

* `/src/components/`: Contém os componentes React "burros" responsáveis apenas por exibir a interface.
    * `Controls.tsx`: Inputs de configuração e botões de ação.
    * `AcessList.tsx`: Input da sequência de acesso e visualização do progresso.
    * `MemoryTable.tsx`: Renderiza a Tabela de Páginas e a Memória Física.
    * `Summary.tsx`: Exibe os resultados (Falhas, Acertos) e o Log.

* `/src/App.tsx`: O componente "orquestrador" que gerencia o `SimulationState` e conecta os botões (de `Controls.tsx`) com a lógica (de `memory.ts`).
