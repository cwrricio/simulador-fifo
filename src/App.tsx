
import React, { useState, useCallback } from "react";
// Importa as funções de lógica do core do simulador.
import {
  initializeSimulation, // Inicializa as estruturas de memória (tabela, molduras).
  processAccess, // Executa um único passo da simulação (HIT ou FAULT).
} from "./core/memory";
import type { SimulationState } from "./core/types"; 

// Importa a função de formatação de utilitários (getPageTableDisplay)
import { getPageTableDisplay } from "./core/utils"; 

// Importa os componentes da interface.
import Controls from "./components/Controls"; 
import AcessList from "./components/AcessList"; 
import MemoryTable from "./components/MemoryTable";
import Summary from "./components/Summary"; 


// Configuração inicial padrão do estado da simulação.
// Inicializa com 4 molduras físicas, 10 páginas virtuais, e nenhuma sequência de acesso.
const initialConfig: SimulationState = initializeSimulation(4, 10, []);

const App: React.FC = () => {
  // Estado principal: armazena todo o status da simulação (tabelas, contadores, logs).
  const [simState, setSimState] = useState<SimulationState>(initialConfig);
  // Estado para o input de texto da sequência de páginas, mantido fora do 'simState'
  // para permitir a edição antes da inicialização.
  const [inputAcessos, setInputAcessos] = useState<string>(
    "0 1 7 2 3 2 7 1 0 3" // Sequência de teste padrão.
  );

  // Prepara os dados da Tabela de Páginas para exibição na UI, usando a função utilitária.
  const pageTableData = getPageTableDisplay(simState.pageTable);

  /**
   * Função chamada ao clicar em "Iniciar / Reiniciar".
   * 1. Converte a string de acessos em um array de números.
   * 2. Valida se os acessos estão dentro dos limites da Memória Virtual.
   * 3. Reinicia o estado da simulação.
   */
  const handleInitialize = useCallback(
    (physSize: number, virtSize: number) => {
      // Converte a string de acessos em números, ignorando espaços e NaN.
      const accessArray = inputAcessos
        .split(/\s+/)
        .map(Number)
        .filter((n) => !isNaN(n));

      // Requisito: Acessos devem ser menores que o tamanho da memória virtual.
      const invalidAccess = accessArray.some((p) => p < 0 || p >= virtSize);
      if (invalidAccess) {
        // ATENÇÃO: É recomendado substituir alert() por um modal customizado, conforme as regras da plataforma.
        alert(
          `Acesso virtual inválido. Os endereços devem estar entre 0 e ${
            virtSize - 1
          }.`
        );
        return;
      }

      // Inicializa o estado com as novas configurações.
      const newState = initializeSimulation(physSize, virtSize, accessArray);
      setSimState(newState);
    },
    [inputAcessos] // Recria a função se a string de acessos mudar.
  );

  /**
   * Função chamada ao clicar em "Proximo Passo".
   * Executa um único passo de simulação.
   */
  const handleNextStep = useCallback(() => {
    const { currentAccessIndex, accessSequence } = simState;

    // Verifica se a simulação já terminou.
    if (currentAccessIndex >= accessSequence.length) {
      setSimState((prev) => ({
        ...prev,
        simulationLog: [...prev.simulationLog, "Fim da Sequência de Acessos."],
      }));
      return;
    }

    // Obtém a próxima página a ser acessada.
    const nextPageAccess = accessSequence[currentAccessIndex];
    // Processa o acesso e obtém o novo estado (imutabilidade).
    const { newState } = processAccess(simState, nextPageAccess);

    // Atualiza o estado da aplicação.
    setSimState(newState);
  }, [simState]); // Depende de 'simState' para obter o estado atual.

  /**
   * Função chamada ao clicar em "Executar Tudo".
   * Itera sobre todos os acessos restantes até o final da sequência.
   */
  const handleRunAll = useCallback(() => {
    let currentState = simState;

    // Loop que continua enquanto houver acessos pendentes.
    while (
      currentState.currentAccessIndex < currentState.accessSequence.length
    ) {
      const nextPageAccess =
        currentState.accessSequence[currentState.currentAccessIndex];
      // Processa o acesso, atualiza o estado e usa o novo estado para a próxima iteração.
      const { newState } = processAccess(currentState, nextPageAccess);
      currentState = newState;
    }
    // Atualiza o estado da aplicação UMA VEZ após a conclusão de todos os passos.
    setSimState(currentState);
  }, [simState]); // Depende de 'simState' para começar do estado atual.

  // Componente de Renderização
  return (
    // Estilo: Fundo com gradiente e layout responsivo.
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-3">
      {/* Título */}
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Simulador de Memória - FIFO
        </h1>
        <p className="text-xs text-gray-600 font-medium">
          Paginação + Algoritmo FIFO
        </p>
      </div>

      {/* Layout principal em GRID (3 colunas em telas grandes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-7xl mx-auto">
        {/* Coluna 1: Controles e Lista de Acessos */}
        <div className="lg:col-span-1 space-y-3">
          <Controls
            physSize={simState.physicalMemorySize}
            virtSize={simState.virtualMemorySize}
            onInitialize={handleInitialize}
            onNextStep={handleNextStep}
            onRunAll={handleRunAll}
            // Propriedade para desabilitar botões se a sequência terminar.
            isFinished={
              simState.currentAccessIndex >= simState.accessSequence.length
            }
          />

          <AcessList
            inputAcessos={inputAcessos}
            setInputAcessos={setInputAcessos}
            accessSequence={simState.accessSequence}
            currentAccessIndex={simState.currentAccessIndex}
          />
        </div>

        {/* Coluna 2: Tabela de Páginas e Memória Física (Ocupa 2/3 da largura) */}
        <div className="lg:col-span-2 space-y-3">
          <MemoryTable
            pageTableData={pageTableData}
            physicalMemory={simState.physicalMemory}
          />
        </div>
      </div>

      {/* Sumário e Logs (Linha inteira) */}
      <div className="mt-3">
        <Summary
          pageFaults={simState.pageFaults}
          totalAccesses={simState.accessSequence.length}
          simulationLog={simState.simulationLog}
        />
      </div>
    </div>
  );
};

export default App;
