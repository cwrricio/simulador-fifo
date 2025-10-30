import type { PageTableEntry } from './types'; 

/**
 * Função utilitária para formatar a tabela de páginas para exibição na UI.
 */
export function getPageTableDisplay(pageTable: PageTableEntry[]): any[] {
    return pageTable.map(p => ({
        Página: p.pageNumber,
        Moldura: p.frameNumber !== null ? `M${p.frameNumber}` : 'N/A',
        Presença: p.isPresent ? 'Sim' : 'Não',
        'Tempo Carga (FIFO)': p.loadTime,
    }));
}
