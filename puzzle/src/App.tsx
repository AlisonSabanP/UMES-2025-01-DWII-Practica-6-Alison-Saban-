import React, { useState, useEffect } from 'react';
import './App.css'

const App: React.FC = () => {
  const [piezas, setPiezas] = useState<number[]>([]);
  const [movimientos, setMovimientos] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const urlImagen = 'https://i.pinimg.com/736x/b0/d5/f5/b0d5f5539e5869877ae464a66291e923.jpg';

  const empezarJuego = () => {
    const ordenCorrecto = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let mezclado = [...ordenCorrecto];

    for (let i = mezclado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mezclado[i], mezclado[j]] = [mezclado[j], mezclado[i]];
    }

    setPiezas(mezclado);
    setMovimientos(0);
    setTerminado(false);
  };

  const estaResuelto = (lista: number[]) => {
    return lista.every((valor, indice) => {
      if (indice === 8) return valor === 0; 
      return valor === indice + 1;          
    });
  };

  const alHacerClic = (posicion: number) => {
    if (terminado) return; 

    const indiceVacio = piezas.indexOf(0);
    const fila = Math.floor(posicion / 3);
    const columna = posicion % 3;
    const filaVacio = Math.floor(indiceVacio / 3);
    const columnaVacio = indiceVacio % 3;

    const puedeMoverse =
      (Math.abs(fila - filaVacio) === 1 && columna === columnaVacio) ||
      (Math.abs(columna - columnaVacio) === 1 && fila === filaVacio);

    if (!puedeMoverse) return;

    const nuevasPiezas = [...piezas];
    [nuevasPiezas[posicion], nuevasPiezas[indiceVacio]] = [nuevasPiezas[indiceVacio], nuevasPiezas[posicion]];

    setPiezas(nuevasPiezas);
    const nuevosMovimientos = movimientos + 1;
    setMovimientos(nuevosMovimientos);

    if (estaResuelto(nuevasPiezas)) {
      setTerminado(true);
      const mejor = localStorage.getItem('mejorPuntaje');
      if (!mejor || nuevosMovimientos < parseInt(mejor)) {
        localStorage.setItem('mejorPuntaje', nuevosMovimientos.toString());
      }
    }
  };

  useEffect(() => {
    empezarJuego();
  }, []);

  return (
    <div className="bg-blue-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Puzzle</h1>

      {terminado && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center">
          ¡Felicidades! Lo resolviste en {movimientos} movimientos.
        </div>
      )}

      <div className="grid grid-cols-3 gap-1 bg-gray-300 p-1 rounded">
        {piezas.map((pieza, index) => (
          pieza === 0 ? (
            <div
              key={index}
              className="w-20 h-20 bg-white border-2 border-dashed border-gray-400 rounded"
            />
          ) : (
            <button
              key={index}
              className="w-20 h-20 rounded overflow-hidden shadow"
              style={{
                backgroundImage: `url(${urlImagen})`,
                backgroundSize: '300px 300px',
                backgroundPosition: `-${(pieza - 1) % 3 * 100}px -${Math.floor((pieza - 1) / 3) * 100}px`,
              }}
              onClick={() => alHacerClic(index)}
            />
          )
        ))}
      </div>

      <div className="mt-4 text-center">
        <p>Movimientos: <strong>{movimientos}</strong></p>
        <p className="text-sm text-gray-600">
          Mejor: {localStorage.getItem('mejorPuntaje') || '—'}
        </p>
        <button
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={empezarJuego}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
};

export default App;