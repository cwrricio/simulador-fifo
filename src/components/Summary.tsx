import React from "react";

interface SummaryProps {
  pageFaults: number;
  totalAccesses: number;
  simulationLog: string[];
}

const Summary: React.FC<SummaryProps> = ({
  pageFaults,
  totalAccesses,
  simulationLog,
}) => {
  const hits = totalAccesses > 0 ? totalAccesses - pageFaults : 0;

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 p-4 rounded-lg shadow-lg border border-indigo-200">
      <h2 className="text-base font-bold text-indigo-700 mb-3">Resultado</h2>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 bg-red-500 rounded text-white text-center">
          <div className="text-xs font-bold">Falhas</div>
          <div className="text-2xl font-black">{pageFaults}</div>
        </div>

        <div className="p-2 bg-green-500 rounded text-white text-center">
          <div className="text-xs font-bold">Acertos</div>
          <div className="text-2xl font-black">{hits}</div>
        </div>

        <div className="p-2 bg-blue-500 rounded text-white text-center">
          <div className="text-xs font-bold">Total</div>
          <div className="text-2xl font-black">{totalAccesses}</div>
        </div>
      </div>

      <div className="bg-gray-800 p-3 rounded">
        <h3 className="text-xs font-bold text-white mb-2">Log de Operacoes</h3>
        <div className="bg-black p-2 rounded text-xs h-40 overflow-y-auto font-mono">
          {simulationLog.map((log, idx) => (
            <div
              key={idx}
              className={`mb-1 ${
                log.includes("FALHA") ? "text-red-400" : "text-green-400"
              }`}
            >
              [{idx + 1}] {log}
            </div>
          ))}
          {simulationLog.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              Nenhum log disponivel
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
