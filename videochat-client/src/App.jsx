import { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [socket] = useState(() => io("http://localhost:3000"));
  const pc = useRef(new RTCPeerConnection(null));

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        stream
          .getTracks()
          .forEach((track) => pc.current.addTrack(track, stream));
      })
      .catch((error) => console.error(error));

    pc.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    socket.on("call", async (call) => {
      pc.current.setRemoteDescription(new RTCSessionDescription(call));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(createAnswer);
      socket.emit("answer", answer);
    });

    socket.on("answer", (answer) => {
      pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("cancel-candidate", (candidate) => {
      pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
    };
  }, [socket]);

  const createCall = async () => {
    const call = await pc.current.createOffer();
    await pc.current.setLocalDescription(call);
    socket.emit("call", call);
  };

  return (
    <div>
      <h1>Vide Chat</h1>
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
      <button onClick={createCall}>call</button>
    </div>
  );
}

export default App;
