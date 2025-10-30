import React from "react";
import type { PhysicalMemoryFrame } from "../core/types";

interface MemoryTableProps {
  pageTableData: { [key: string]: string | number | boolean }[];
  physicalMemory: PhysicalMemoryFrame[];
}

const MemoryTable: React.FC<MemoryTableProps> = ({
  pageTableData,
  physicalMemory,
}) => {
  const columns = pageTableData.length > 0 ? Object.keys(pageTableData[0]) : [];

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-white to-cyan-50 p-3 rounded-lg shadow-lg border border-cyan-200">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          Tabela de Paginas
        </h2>
        <div className="overflow-x-auto rounded border border-cyan-200">
          <table className="min-w-full text-xs">
            <thead className="bg-cyan-600 text-white">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-2 py-1.5 text-left text-xs font-bold uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {pageTableData.map((row, idx) => (
                <tr
                  key={idx}
                  className={
                    row.Presenca === "Sim" ? "bg-green-100" : "bg-red-100"
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-2 py-1.5 text-xs font-bold text-gray-900"
                    >
                      {col === "Presenca" ? (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                            row[col] === "Sim"
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {row[col] === "Sim" ? "Sim" : "Nao"}
                        </span>
                      ) : (
                        row[col]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-yellow-50 p-3 rounded-lg shadow-lg border border-yellow-300">
        <h2 className="text-sm font-bold text-gray-800 mb-3">Memoria Fisica</h2>
        <div className="flex flex-wrap gap-2 p-2 bg-yellow-50 rounded">
          {physicalMemory.map((frame) => (
            <div
              key={frame.frameNumber}
              className={`p-2 border-2 rounded text-center font-mono text-xs font-bold ${
                frame.pageNumber !== null
                  ? "bg-cyan-600 border-cyan-700 text-white"
                  : "bg-gray-300 border-gray-500 text-gray-800"
              }`}
              style={{ minWidth: "60px" }}
            >
              <div className="font-bold text-xs">
                {frame.pageNumber !== null ? "OCUP" : "LIVRE"}
              </div>
              <div className="text-xs font-bold">M{frame.frameNumber}</div>
              {frame.pageNumber !== null && (
                <div className="text-sm font-extrabold">
                  P{frame.pageNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryTable;
