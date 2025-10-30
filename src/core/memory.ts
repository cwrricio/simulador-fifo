import type { 
    SimulationState, 
    PageTableEntry, 
    PhysicalMemoryFrame, 
    AccessResult 
} from './types';
import { findVictimFifo } from './fifo';

// REMOVIDO: Variável global para simular o "tempo" de carregamento (agora está em SimulationState).

/**
 * Inicializa o estado da simulação (Requisito 29).
 */
export function initializeSimulation(
    physicalSize: number, 
    virtualSize: number, 
    accesses: number[]
): SimulationState {
    // globalLoadTimeCounter = 0; // REMOVIDO
    
    // 1. Inicializa a Tabela de Páginas
    const initialPageTable: PageTableEntry[] = [];
    for (let i = 0; i < virtualSize; i++) {
        initialPageTable.push({
            pageNumber: i,
            frameNumber: null,
            isPresent: false, // Bit de presença inicial [cite: 14]
            loadTime: 0,
        });
    }

    // 2. Inicializa a Memória Física (Molduras)
    const initialPhysicalMemory: PhysicalMemoryFrame[] = [];
    for (let i = 0; i < physicalSize; i++) {
        initialPhysicalMemory.push({
            frameNumber: i,
            pageNumber: null,
        });
    }

    return {
        physicalMemorySize: physicalSize,
        virtualMemorySize: virtualSize,
        accessSequence: accesses,
        pageTable: initialPageTable,
        physicalMemory: initialPhysicalMemory,
        pageFaults: 0,
        currentAccessIndex: 0,
        simulationLog: [],
        loadTimeCounter: 0, // NOVO: Inicializa o contador de tempo FIFO no estado.
    };
}


/**
 * Encontra a próxima moldura física livre.
 */
function findFreeFrame(physicalMemory: PhysicalMemoryFrame[]): PhysicalMemoryFrame | null {
    return physicalMemory.find(frame => frame.pageNumber === null) || null;
}

/**
 * Processa um único acesso a uma página virtual e atualiza o estado.
 */
export function processAccess(currentState: SimulationState, virtualPageNumber: number): { newState: SimulationState, result: AccessResult } {
    // Cria uma cópia profunda (imutabilidade)
    const newState: SimulationState = JSON.parse(JSON.stringify(currentState));
    const pageEntry = newState.pageTable[virtualPageNumber];

    let result: AccessResult;
    let logMessage = `Acesso ${newState.currentAccessIndex + 1} (Página ${virtualPageNumber}): `;
    let targetFrame: PhysicalMemoryFrame | null = null;
    let isHit = false; // Flag para rastrear se foi HIT

    // 1. A página está na memória física? (Acerto) [cite: 14]
    if (pageEntry.isPresent && pageEntry.frameNumber !== null) {
        // ACERTO (HIT)
        isHit = true;
        logMessage += `HIT. Encontrada na Moldura ${pageEntry.frameNumber}.`;
        
        targetFrame = newState.physicalMemory[pageEntry.frameNumber];
        
        result = {
            isPageFault: false,
            pageNumber: virtualPageNumber,
            frameNumber: pageEntry.frameNumber,
            logMessage: logMessage,
        };

    } else {
        // 2. FALHA DE PÁGINA (PAGE FAULT) 
        newState.pageFaults++;
        logMessage += `FALHA DE PÁGINA. `;

        targetFrame = findFreeFrame(newState.physicalMemory);
        let victimPage: PageTableEntry | null = null;
        
        // 3. Substituição (Memória cheia) 
        if (targetFrame === null) {
            // Aplica o algoritmo FIFO 
            victimPage = findVictimFifo(newState.pageTable);

            if (victimPage) {
                targetFrame = newState.physicalMemory.find(f => f.frameNumber === victimPage!.frameNumber) || null;
                
                if (targetFrame) {
                    // Remove a página vítima: atualiza a Tabela de Páginas
                    newState.pageTable[victimPage.pageNumber] = {
                        ...victimPage,
                        isPresent: false,
                        frameNumber: null,
                        loadTime: 0, // Zera o tempo de carga da vítima
                    };
                    logMessage += `Vítima (FIFO) - P${victimPage.pageNumber} removida da M${targetFrame.frameNumber}. `;
                }
            }
        }
        
        // 4. Carrega a nova página
        if (targetFrame) {
            newState.loadTimeCounter++; // ATUALIZA O CONTADOR DENTRO DO ESTADO (CORREÇÃO CHAVE)

            // Atualiza a Memória Física
            // TargetFrame é uma referência, precisamos garantir que o array seja atualizado:
            const frameIndex = newState.physicalMemory.findIndex(f => f.frameNumber === targetFrame!.frameNumber);
            if (frameIndex !== -1) {
                 newState.physicalMemory[frameIndex].pageNumber = virtualPageNumber;
            }
            
            // Atualiza a Tabela de Páginas
            newState.pageTable[virtualPageNumber] = {
                ...pageEntry,
                isPresent: true,
                frameNumber: targetFrame.frameNumber,
                loadTime: newState.loadTimeCounter, // Usa o contador do estado
            };

            logMessage += `P${virtualPageNumber} carregada na M${targetFrame.frameNumber}.`;

            result = {
                isPageFault: true,
                pageNumber: virtualPageNumber,
                frameNumber: targetFrame.frameNumber,
                logMessage: logMessage,
            };
        } else {
             logMessage += `ERRO INTERNO: Falha ao alocar a página.`;
             result = { isPageFault: true, pageNumber: virtualPageNumber, frameNumber: null, logMessage: logMessage };
        }
    }

    // 5. Atualiza o Log e o índice (Requisito 25)
    newState.simulationLog.push(logMessage);
    newState.currentAccessIndex++;

    // Garante que o loadTimeCounter seja devolvido no estado
    return { newState, result };
}

// ** FUNÇÕES AUXILIARES para o App.tsx (incluídas para completude) **

/**
 * Processa apenas um passo e retorna o novo estado.
 */
export function nextStep(currentState: SimulationState): { newState: SimulationState } {
    const nextPageAccess = currentState.accessSequence[currentState.currentAccessIndex];
    const { newState } = processAccess(currentState, nextPageAccess);
    return { newState };
}

/**
 * Executa a simulação até o fim.
 */
export function runAllSteps(currentState: SimulationState): { newState: SimulationState } {
    let state = currentState;
    while (state.currentAccessIndex < state.accessSequence.length) {
        const nextPageAccess = state.accessSequence[state.currentAccessIndex];
        const { newState } = processAccess(state, nextPageAccess);
        state = newState;
    }
    return { newState: state };
}
