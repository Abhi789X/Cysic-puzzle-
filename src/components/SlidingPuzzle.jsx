import React, { useState, useEffect } from "react";

const GRID_SIZE = 3;

export default function SlidingPuzzle({ image, onBack }) {
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(GRID_SIZE * GRID_SIZE - 1);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const temp = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
    for (let i = temp.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    setTiles(temp);
    setEmptyIndex(temp.indexOf(GRID_SIZE * GRID_SIZE - 1));
  }, [image]);

  function moveTile(i) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      const newTiles = [...tiles];
      [newTiles[i], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[i]];
      setTiles(newTiles);
      setEmptyIndex(i);

      if (newTiles.every((val, idx) => val === idx)) {
        setSolved(true);
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button onClick={onBack} className="mb-4 text-purple-400 underline self-start">
        ← Back
      </button>

      <div className="grid grid-cols-3 gap-0 w-[300px] h-[300px] mx-auto border-2 border-cyan-500 overflow-hidden">
        {tiles.map((tile, index) => 
          tile === GRID_SIZE * GRID_SIZE - 1 ? (
            <div 
              key={index}
              className="bg-black border border-white/30"
              onClick={() => moveTile(index)}
            />
          ) : (
            <div
              key={index}
              className="border border-white/30 cursor-pointer"
              onClick={() => moveTile(index)}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: `${GRID_SIZE * 100}%`,
                backgroundPosition: `-${(tile % GRID_SIZE) * 100}% -${Math.floor(tile / GRID_SIZE) * 100}%`,
                backgroundRepeat: 'no-repeat'
              }}
            />
          )
        )}
      </div>

      {solved && (
        <div className="mt-6 text-2xl text-green-400 font-bold animate-pulse">
          🎉 ZK is the ENDGAME. Welcome to the Future. 🚀
        </div>
      )}
    </div>
  );
}
