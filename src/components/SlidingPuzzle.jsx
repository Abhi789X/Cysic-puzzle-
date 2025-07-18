import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

function getMatrix(tileArray) {
  const matrix = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    matrix.push(tileArray.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE));
  }
  return matrix;
}

function isSolvable(tiles) {
  let inversions = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j] && tiles[i] !== TILE_COUNT - 1 && tiles[j] !== TILE_COUNT - 1) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
}

function isComplete(tiles) {
  for (let i = 0; i < TILE_COUNT - 1; i++) {
    if (tiles[i] !== i) return false;
  }
  return true;
}

function SlidingPuzzle({ image, onBack }) {
  const [tiles, setTiles] = useState([]);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const initialTiles = [...Array(TILE_COUNT).keys()];
    let shuffled = [];

    do {
      shuffled = [...initialTiles].sort(() => Math.random() - 0.5);
    } while (!isSolvable(shuffled) || isComplete(shuffled));

    setTiles(shuffled);
  }, [image]);

  function handleTileClick(index) {
    const emptyIndex = tiles.indexOf(TILE_COUNT - 1);
    const targetRow = Math.floor(index / GRID_SIZE);
    const targetCol = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const isAdjacent =
      (targetRow === emptyRow && Math.abs(targetCol - emptyCol) === 1) ||
      (targetCol === emptyCol && Math.abs(targetRow - emptyRow) === 1);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setIsSolved(isComplete(newTiles));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-zinc-900 to-black text-white">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Sliding Puzzle</h1>
        <p className="text-sm text-gray-400">
          Tap a tile next to the empty spot to move. Arrange to complete the image.
        </p>
      </div>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 100px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 100px)`,
        }}
      >
        {tiles.map((tile, index) => (
          <motion.div
            key={tile}
            onClick={() => handleTileClick(index)}
            className={`w-[100px] h-[100px] rounded-md ${
              tile === TILE_COUNT - 1 ? "bg-white" : "cursor-pointer"
            }`}
            whileTap={{ scale: 0.9 }}
            style={{
              backgroundImage:
                tile === TILE_COUNT - 1 ? "none" : `url(${image})`,
              backgroundSize: `${GRID_SIZE * 100}px ${GRID_SIZE * 100}px`,
              backgroundPosition: `-${(tile % GRID_SIZE) * 100}px -${Math.floor(tile / GRID_SIZE) * 100}px`,
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </div>
      {isSolved && (
        <motion.div
          className="mt-4 text-green-400 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🎉 Puzzle Completed!
        </motion.div>
      )}
      <Button
        onClick={onBack}
        className="mt-6 bg-white text-black hover:bg-gray-200 transition"
      >
        Back
      </Button>
    </div>
  );
}

export default SlidingPuzzle;
