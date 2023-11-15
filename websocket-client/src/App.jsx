import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ENDPOINT = 'localhost:3001';

let socket;


function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    const handleSocketMessage = (message) => {
      setData(message);
    };

    socket = io(ENDPOINT);

    // Прослуховування подій від сервера
    socket.on('message', handleSocketMessage);

    // Зупинка прослуховування при розмонтуванні компоненту
    return () => {
      socket.off('message', handleSocketMessage);
      socket.disconnect();
    };
  }, []); // Порожній масив вказує, що ефект повинен викликатися тільки після монтажу та перед розмонтажем

  return (
    <div>
      <h1>Socket.io App</h1>
      <p>{data}</p>
    </div>
  );
}

export default App;
