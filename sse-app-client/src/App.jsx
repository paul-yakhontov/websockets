import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/events');

    eventSource.onmessage = (event) => {
      console.log('message have received');
      setData(event.data);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Server-Sent Events</h1>
      <p>Data from server: {data}</p>
    </div>
  );
}

export default App;
