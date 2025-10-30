import React, { useState } from "react";

interface ControlsProps {
  physSize: number;
  virtSize: number;
  onInitialize: (physSize: number, virtSize: number) => void;
  onNextStep: () => void;
  onRunAll: () => void;
  isFinished: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  physSize,
  virtSize,
  onInitialize,
  onNextStep,
  onRunAll,
  isFinished,
}) => {
  // Estado local para a Memória Física (Molduras)
  const [inputPhysSize, setInputPhysSize] = useState(physSize);
  // Estado local para a Memória Virtual (Páginas)
  const [inputVirtSize, setInputVirtSize] = useState(virtSize);

  // Função para lidar com o clique no botão Iniciar / Reiniciar
  const handleInitializeClick = () => {
    // Verifica se os tamanhos são válidos
    if (inputPhysSize > 0 && inputVirtSize > 0) {
      // Chama a função de inicialização do componente App.tsx com os novos valores
      onInitialize(inputPhysSize, inputVirtSize);
    } else {
      // Usa o mecanismo de erro do App.tsx (handleError) em vez de alert()
      // Se a validação mais complexa estiver no App.tsx, aqui apenas garantimos > 0
      alert("Os tamanhos da memoria devem ser maiores que zero.");
    }
  };

  // Garante que o estado local seja sincronizado caso o App.tsx o mude (ex: após inicialização)
  React.useEffect(() => {
    setInputPhysSize(physSize);
  }, [physSize]);

  React.useEffect(() => {
    setInputVirtSize(virtSize);
  }, [virtSize]);


  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-3 rounded-lg shadow-lg border border-blue-200">
      <h2 className="text-sm font-bold text-gray-800 mb-3">Configuracao</h2>

      <div className="space-y-2">
        {/* INPUT: Memória Física (Molduras) */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Memoria Fisica (Molduras)
          </label>
          <input
            type="number"
            min="1"
            value={inputPhysSize}
            onChange={(e) => setInputPhysSize(Number(e.target.value))}
            // O campo não está desabilitado, permitindo a mudança.
            className="w-full border-2 border-blue-400 rounded p-1.5 text-sm font-bold text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* INPUT: Memória Virtual (Páginas) */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Memoria Virtual (Paginas)
          </label>
          <input
            type="number"
            min="1"
            value={inputVirtSize}
            onChange={(e) => setInputVirtSize(Number(e.target.value))}
            // O campo não está desabilitado, permitindo a mudança.
            className="w-full border-2 border-blue-400 rounded p-1.5 text-sm font-bold text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <button
          onClick={handleInitializeClick}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded font-bold text-xs hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 shadow"
        >
          Iniciar / Reiniciar
        </button>

        <button
          onClick={onNextStep}
          disabled={isFinished}
          className={`w-full p-2 rounded font-bold text-xs transition shadow ${
            isFinished
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105"
          }`}
        >
          {isFinished ? "Concluida" : "Proximo Passo"}
        </button>

        <button
          onClick={onRunAll}
          disabled={isFinished}
          className={`w-full p-2 rounded font-bold text-xs transition shadow ${
            isFinished
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105"
          }`}
        >
          Executar Tudo
        </button>
      </div>
    </div>
  );
};

export default Controls;
