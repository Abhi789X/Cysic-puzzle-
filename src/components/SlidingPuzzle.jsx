import React, { useState, useEffect } from "react";

const GRID_SIZE = 3;

export default function SlidingPuzzle({ image, onBack }) {
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(GRID_SIZE * GRID_SIZE - 1);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    resetPuzzle();
  }, [image]);

  function resetPuzzle() {
    // Create a solvable puzzle
    let temp = Array.from({ length: GRID_SIZE * GRID_SIZE - 1 }, (_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = temp.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    
    // Add empty tile at the end
    temp.push(GRID_SIZE * GRID_SIZE - 1);
    setTiles(temp);
    setEmptyIndex(GRID_SIZE * GRID_SIZE - 1);
    setSolved(false);
  }

  function moveTile(i) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const isAdjacent = 
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[i], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[i]];
      setTiles(newTiles);
      setEmptyIndex(i);

      // Check if solved
      const isSolved = newTiles.slice(0, -1).every((val, idx) => val === idx);
      setSolved(isSolved);
    }
  }

  // Calculate tile size based on container
  const tileSize = 100; // 300px container / 3 tiles

  return (
    <div className="flex flex-col items-center">
      <button onClick={onBack} className="mb-4 text-purple-400 underline self-start">
        ← Back
      </button>

      <div className="grid grid-cols-3 gap-0 w-[300px] h-[300px] mx-auto border-2 border-cyan-500 overflow-hidden relative">
        {tiles.map((tile, index) => {
          if (tile === GRID_SIZE * GRID_SIZE - 1) {
            return (
              <div 
                key={index}
                className="bg-black/80 border border-white/30"
                onClick={() => moveTile(index)}
              />
            );
          }
          
          const row = Math.floor(tile / GRID_SIZE);
          const col = tile % GRID_SIZE;
          
          return (
            <div
              key={index}
              className="border border-white/30 cursor-pointer"
              onClick={() => moveTile(index)}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: `${GRID_SIZE * 100}%`,
                backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
              }}
            />
          );
        })}
      </div>

      {solved && (
        <div className="mt-6 text-2xl text-green-400 font-bold animate-pulse">
          🎉 ZK is the ENDGAME. Welcome to the Future. 🚀
        </div>
      )}
      
      <button 
        onClick={resetPuzzle} 
        className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
      >
        Shuffle
      </button>
    </div>
  );
}
