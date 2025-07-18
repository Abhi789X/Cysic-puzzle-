import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const GRID_SIZE = 3;
const TILE_SIZE = 100; // pixels

const generateShuffledTiles = () => {
  const tiles = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
};

const SlidingPuzzle = ({ image }) => {
  const [tiles, setTiles] = useState(generateShuffledTiles());
  const [gameWon, setGameWon] = useState(false);

  const handleClick = (index) => {
    const emptyIndex = tiles.indexOf(GRID_SIZE * GRID_SIZE - 1);
    const isAdjacent =
      [1, -1, GRID_SIZE, -GRID_SIZE].includes(index - emptyIndex) &&
      Math.abs(Math.floor(index / GRID_SIZE) - Math.floor(emptyIndex / GRID_SIZE)) <= 1 &&
      Math.abs((index % GRID_SIZE) - (emptyIndex % GRID_SIZE)) <= 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      checkWin(newTiles);
    }
  };

  const checkWin = (tiles) => {
    const isSolved = tiles.every((tile, index) => tile === index);
    setGameWon(isSolved);
  };

  useEffect(() => {
    checkWin(tiles);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {gameWon && <Confetti />}
      <h1 className="text-3xl font-bold mb-4">Sliding Puzzle Game</h1>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
          gap: "2px",
        }}
      >
        {tiles.map((tile, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`w-[${TILE_SIZE}px] h-[${TILE_SIZE}px] border border-gray-600 ${
              tile === GRID_SIZE * GRID_SIZE - 1 ? "bg-white" : "cursor-pointer"
            }`}
            style={{
              backgroundImage:
                tile === GRID_SIZE * GRID_SIZE - 1 ? "none" : `url(${image})`,
              backgroundSize: `${TILE_SIZE * GRID_SIZE}px ${TILE_SIZE * GRID_SIZE}px`,
              backgroundPosition: `-${(tile % GRID_SIZE) * TILE_SIZE}px -${
                Math.floor(tile / GRID_SIZE) * TILE_SIZE
              }px`,
              backgroundRepeat: "no-repeat",
              backgroundColor: tile === GRID_SIZE * GRID_SIZE - 1 ? "white" : "transparent",
            }}
          />
        ))}
      </div>
      {gameWon && <p className="mt-4 text-green-400 font-semibold">Puzzle Solved! 🎉</p>}
    </div>
  );
};

export default SlidingPuzzle;
