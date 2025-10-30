import React from "react";

interface AcessListProps {
  inputAcessos: string;
  setInputAcessos: (value: string) => void;
  accessSequence: number[];
  currentAccessIndex: number;
}

const AcessList: React.FC<AcessListProps> = ({
  inputAcessos,
  setInputAcessos,
  accessSequence,
  currentAccessIndex,
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 p-3 rounded-lg shadow-lg border border-purple-200">
      <h2 className="text-sm font-bold text-gray-800 mb-3">Lista de Acessos</h2>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Sequencia de Paginas
        </label>
        <input
          type="text"
          value={inputAcessos}
          onChange={(e) => setInputAcessos(e.target.value)}
          placeholder="0 1 7 2 3 2 7 1 0 3"
          className="w-full border-2 border-purple-400 rounded p-1.5 text-xs font-mono font-bold text-gray-900 bg-white focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <h3 className="text-xs font-bold mb-2 text-gray-800">
          Sequencia Atual:
        </h3>
        <div className="flex flex-wrap gap-1.5 p-2 bg-purple-50 rounded max-h-28 overflow-auto">
          {accessSequence.length === 0 ? (
            <p className="text-gray-500 text-xs">Nenhuma sequencia</p>
          ) : (
            accessSequence.map((page, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                  index === currentAccessIndex
                    ? "bg-orange-500 text-white ring-2 ring-orange-600 animate-pulse"
                    : index < currentAccessIndex
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 border-2 border-gray-400 text-gray-900"
                }`}
              >
                {page}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AcessList;
