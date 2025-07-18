import React, { useState } from "react";
import SlidingPuzzle from "./components/SlidingPuzzle";

const imageOptions = [
  { name: "Cysic Logo", path: "/images/logo.jpg" },
  { name: "ZK Boy", path: "/images/character.jpg" },
  { name: "ZK Penguin", path: "/images/penguin.jpg" },
];

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-8 p-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
        Cysic Puzzle Game
      </h1>

      {!selectedImage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {imageOptions.map((img) => (
            <button
              key={img.name}
              onClick={() => setSelectedImage(img.path)}
              className="hover:scale-105 transition transform"
            >
              <img
                src={img.path}
                alt={img.name}
                className="rounded-lg w-60 h-60 object-cover border-2 border-purple-500"
              />
              <p className="mt-2">{img.name}</p>
            </button>
          ))}
        </div>
      )}

      {selectedImage && (
        <SlidingPuzzle image={selectedImage} onBack={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
