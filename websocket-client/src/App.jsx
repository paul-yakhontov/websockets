import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const ENDPOINT = "localhost:3001";

let socket;

function App() {
  const styleProp = useSpring({
    scale: 2,
    from: { scale: 1 },
    delay: 1000,
  });
  return (
    <animated.div style={styleProp}>
      <h1>Socket.io App</h1>
    </animated.div>
  );
}

export default App;
