"use client";
import { client } from "../common/client";
import Peer from "simple-peer";
const stunServer = "stun:stun4.l.google.com:19302";

interface MyStream {
  id: string;
  socketId: string;
  nickName: string;
  mic: number;
  cam: boolean;
  muted: boolean;
  blind: boolean;
  isTalk: boolean;
  quality: number;
  forceMute: boolean;
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
}
export class Call {
  roomId: string;
  userId: string;
  selfId: string;
  initiator: boolean;
  peer: Peer.Instance | null = null;
  mediaStream: MediaStream;
  mediaTrack: MediaStreamTrack;
  connected: boolean;
  data: any;
  static defaultMyStream: MyStream = {
    mic: 100,
    forceMute: false,
    isTalk: false,
    cam: false,
    muted: false,
    blind: true,
    id: "",
    nickName: "",
    socketId: "",
    quality: 0,
    localStream: null,
    screenStream: null,
  };
  constructor(
    userId: string,
    roomId: string,
    selfId: string,
    initiator: boolean,
    localStream: MediaStream,
    screenStream: MediaStream | null,
    onConnect: (mediaStream: MediaStream) => void,
    onDisconnect: () => void
  ) {
    this.initiator = initiator;
    this.userId = userId;
    this.roomId = roomId;
    this.selfId = selfId;
    this.connected = false;
    this.peer = new Peer({
      initiator: this.initiator,
      streams: [localStream, ...(screenStream ? [screenStream] : [])],
      trickle: true,

      config: { iceServers: [{ urls: stunServer }] },
    });
    if (!initiator)
      client.socket?.emit("welcome", {
        roomId: roomId,
        from: userId,
        userId: selfId,
      });
    this.peer.on("signal", (data) => {
      if (!client.socket) return;
      const signal = {
        desc: data,
        from: this.userId,
        userId: this.selfId,
        roomId,
      };
      client.socket.emit("signal", signal);
    });
    this.peer.on("connect", (stream) => {
      this.connected = true;
      // setRemoteVideo(stream);
    });
    this.peer.on(`stream`, (stream) => {
      this.mediaStream = stream;
      onConnect(stream);
    });
    this.peer.on("data", (data) => {
      //? transfer Uint8Array to string and parse json
      const newData = JSON.parse(new TextDecoder().decode(data as Buffer)) as object;
      this.data = newData;
      // updatePeer({ ...peer, ...newData });
    });
    this.peer.on(`track`, (track, stream) => {
      //!not used
      // this.mediaTrack = track;
    });
    // this.peer._debug = console.log;
    // this.peer.on("close", (err) => console.log(userId, "close"));
    // this.peer.on("end", (err) => console.log(userId, "end"));
    // this.peer.on("pause", (err) => console.log(userId, "pause"));
    this.peer.on("close", () => {
      if (!this.peer) return;
      this.peer.destroy();
      client.socket?.off(`desc:${userId}`);
      client.socket?.off(`disconnected:${userId}`);
      this.peer.removeAllListeners("close");
      onDisconnect();
    });
    // this.peer.on("readable", (err) => console.log(userId, "readable"));
    // this.peer.on("resume", (err) => console.log(userId, "resume"));
    // this.peer.on("error", (err) => console.log(userId, "peer"));
    client.socket?.on(`desc:${userId}`, (data: { desc: string }) => {
      if (!this.peer) return;
      if (this.peer.connected) return;
      this.peer.signal(data.desc);
    });
    client.socket?.on(`disconnected:${userId}`, () => {
      if (!this.peer) return;
      this.peer.destroy();
      client.socket?.off(`desc:${userId}`);
      client.socket?.off(`disconnected:${userId}`);
      this.peer.removeAllListeners("close");
    });
  }
  // connectEventListener(callback: (userId: string) => void) {
  //   this.peer.on("connect", (stream) => {
  //     this.connected = true;
  //     this.peer.off("");
  //     callback(this.userId);
  //   });
  // }
  // disconnectEventListener(callback: (userId: string) => void) {
  //   client.socket?.on(`disconnected:${this.userId}`, () => {
  //     this.peer.destroy();
  //     client.socket?.off(`desc:${this.userId}`);
  //     client.socket?.off(`disconnected:${this.userId}`);
  //     this.peer.removeAllListeners("close");
  //     callback(this.userId);
  //   });
  // }
  connect(otherId: string) {
    if (!this.peer) return;
    if (this.peer.destroyed) return;
    this.peer.signal(otherId);
  }

  disableAudioTracks() {
    if (!this.peer) return;
    if (this.peer.destroyed) return;
    this.mediaStream.getAudioTracks().forEach((track) => (track.enabled = false));
  }
  enableAudioTracks() {
    if (!this.peer) return;
    if (this.peer.destroyed) return;
    this.mediaStream.getAudioTracks().forEach((track) => (track.enabled = true));
  }
  disableVideoTracks() {
    if (!this.peer) return;
    if (this.peer.destroyed) return;
    this.mediaStream.getVideoTracks().forEach((track) => (track.enabled = false));
  }
  enableVideoTracks() {
    if (!this.peer) return;
    if (this.peer.destroyed) return;
    this.mediaStream.getVideoTracks().forEach((track) => (track.enabled = true));
  }
}

// export const getUserMedia = async (opt?: MediaStreamConstraints) => {
//   const newStream = await navigator.mediaDevices.getUserMedia(opt);
//   return newStream;
// };

// export const checkVolume = (stream: MediaStream) => {
//   const audioContext = new AudioContext();
//   const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
//   const analyserNode = audioContext.createAnalyser();
//   mediaStreamAudioSourceNode.connect(analyserNode);
//   const pcmData = new Float32Array(analyserNode.fftSize);
//   const asd = () => {
//     analyserNode.getFloatTimeDomainData(pcmData);
//     let sumSquares = 0.0;
//     for (const amplitude of pcmData) {
//       sumSquares += amplitude * amplitude;
//     }
//     return sumSquares;
//   };
//   return asd;
//   // javascriptNode.onaudioprocess = () => {
//   //   const array = new Uint8Array(analyser.frequencyBinCount);
//   //   analyser.getByteFrequencyData(array);
//   //   const values = array.reduce((a, b) => a + b);
//   //   const average = values / array.length;
//   // };
// };
