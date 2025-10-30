// src/core/fifo.ts

import type { PageTableEntry } from './types';

/**
 * Implementa o algoritmo FIFO (First In, First Out) para substituição de página.
 * Seleciona a página que foi carregada na memória há mais tempo (menor 'loadTime').
 * @param pageTable A tabela de páginas atual.
 * @returns O PageTableEntry da página vítima.
 */
export function findVictimFifo(pageTable: PageTableEntry[]): PageTableEntry | null {
    
    // Filtra apenas as páginas que estão ATUALMENTE na memória física (isPresent = true).
    const residentPages = pageTable.filter(p => p.isPresent); 

    if (residentPages.length === 0) {
        return null; // Não há páginas para remover
    }

    // FIFO: Encontra o menor (mais antigo) valor de loadTime.
    let victim: PageTableEntry = residentPages[0];

    for (const page of residentPages) {
        if (page.loadTime < victim.loadTime) {
            victim = page;
        }
    }
    
    return victim;
}
