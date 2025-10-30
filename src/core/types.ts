// Definição da Tabela de Páginas (Page Table Entry)
export interface PageTableEntry {
    pageNumber: number; 
    frameNumber: number | null; // Número da Moldura Física (null se não estiver na MP)
    isPresent: boolean; // Bit de Presença (true se a página estiver na memória física).
    loadTime: number; // Tempo de Carga (usado pelo FIFO para rastrear a ordem de entrada).
}

// Definição da Memória Física (Page Frame)
export interface PhysicalMemoryFrame {
    frameNumber: number; // Identificador da moldura física
    pageNumber: number | null; // Qual página virtual está ocupando esta moldura (null se livre)
}

// Estado Global da Simulação
export interface SimulationState {
    physicalMemorySize: number; // Tamanho da memória física (em # de molduras)
    virtualMemorySize: number; // Tamanho da memória virtual (em # de páginas)
    accessSequence: number[]; // Lista de acessos a endereços virtuais simulados
    
    loadTimeCounter: number; // NOVO: Contador global de tempo para o FIFO (dentro do estado).

    pageTable: PageTableEntry[]; // Tabela de Páginas completa
    physicalMemory: PhysicalMemoryFrame[]; // Molduras da Memória Física

    pageFaults: number; // Contador total de falhas de página
    currentAccessIndex: number; // Índice do próximo acesso a ser processado
    simulationLog: string[]; // Logs das operações
}

// Resultado de uma Operação de Acesso
export interface AccessResult {
    isPageFault: boolean; // Indica se ocorreu uma falha de página
    pageNumber: number;
    frameNumber: number | null; 
    logMessage: string;
}
