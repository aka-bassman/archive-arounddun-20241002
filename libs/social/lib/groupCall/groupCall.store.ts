import { Call } from "@core/next";
import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.GroupCall)
export class GroupCallStore extends stateOf(fetch.groupCallGql, {
  // peers: [] as Call[],
  // selfCallConnection: { userId: "", mic: 100, cam: true } as CallConnection,
  callConnections: [] as cnst.CallConnection[],
  videoDevices: [] as MediaDeviceInfo[],
  audioDevices: [] as MediaDeviceInfo[],
  ...({
    mediaStream: null,
    screenStream: null,
    mic: 100,
    cam: true,
  } as cnst.CallConnection),
  isTalking: false,
  otherCallConnectionMap: new Map<string, cnst.CallConnection>(),
  otherCallMap: new Map<string, Call>(),
}) {
  async initMediaStream() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    const audioDevices = devices.filter((device) => device.kind === "audioinput");
    const defaultVideo = videoDevices.find((device) => device.deviceId === "default") ?? videoDevices[0];
    const defaultAudio = audioDevices.find((device) => device.deviceId === "default") ?? audioDevices[0];
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        groupId: defaultVideo.groupId,
        width: 200,
        height: 130,
        facingMode: "user",
      },
      audio: { groupId: defaultAudio.groupId },
    });
    mediaStream.getAudioTracks()[0].enabled = true;
    mediaStream.getVideoTracks()[0].enabled = true;
    this.set({ videoDevices, audioDevices, mediaStream, mic: 100, cam: false });
  }
  addCall(userId: string, selfId: string, initiator: boolean) {
    const { otherCallMap, screenStream } = this.get();
    const { groupCall, mediaStream } = this.pick("groupCall", "mediaStream");
    const call = new Call(
      userId,
      groupCall.roomId,
      // `${Math.random()}`,
      selfId,
      initiator,
      mediaStream,
      screenStream,
      (mediaStream) => {
        this.addCallConnection(userId, mediaStream);
      },
      () => {
        this.subCallConnection(userId);
      }
    );
    this.set({ otherCallMap: new Map(otherCallMap).set(userId, call) });
  }
  addCallConnection(userId: string, mediaStream: MediaStream) {
    const { otherCallConnectionMap } = this.get();
    const callConnection = {
      mediaStream,
      screenStream: null,
      mic: 100,
      cam: true,
    };
    this.set({
      otherCallConnectionMap: new Map(otherCallConnectionMap).set(userId, callConnection),
    });
  }
  subCallConnection(userId: string) {
    const { otherCallConnectionMap, otherCallMap } = this.get();
    const callConnectionMap = new Map(otherCallConnectionMap);
    const callMap = new Map(otherCallMap);
    callConnectionMap.delete(userId);
    callMap.delete(userId);
    this.set({ otherCallConnectionMap: callConnectionMap, otherCallMap: callMap });
  }
  leaveGroupCall() {
    const { otherCallMap, otherCallConnectionMap, mediaStream, screenStream } = this.get();

    // !socket한테 알려줘야함
    mediaStream &&
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    screenStream &&
      screenStream.getTracks().forEach((track) => {
        track.stop();
      });
    this.set({
      mediaStream: null,
      screenStream: null,
      otherCallMap: new Map(),
      otherCallConnectionMap: new Map(),
      groupCall: null,
      groupCallLoading: true,
      groupCallModal: null,
    });
  }
  async joinGroupCall(roomId: string, type: cnst.GroupCallType) {
    await this.initMediaStream();
    const groupCall = await fetch.createGroupCall({ roomId, type });
    this.set({ groupCall, groupCallModal: "join" });
  }

  async shareScreen() {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 200, height: 130 },
    });
    this.set({ screenStream });
  }

  addTrack(mediaStreamTrack: MediaStreamTrack) {
    const { mediaStream } = this.pick("mediaStream");
    mediaStream.addTrack(mediaStreamTrack);
  }

  muteSelf() {
    const { mediaStream } = this.pick("mediaStream");
    mediaStream.getAudioTracks()[0].enabled = false;
    this.set({ mic: 0 });
  }
  unmuteSelf() {
    const { mediaStream } = this.pick("mediaStream");
    mediaStream.getAudioTracks()[0].enabled = true;
    this.set({ mic: 100 });
  }
  camOnSelf() {
    const { mediaStream } = this.pick("mediaStream");
    mediaStream.getVideoTracks()[0].enabled = true;
    this.set({ cam: true });
  }
  camOffSelf() {
    const { mediaStream } = this.pick("mediaStream");
    mediaStream.getVideoTracks()[0].enabled = false;
    this.set({ cam: false });
  }
  muteOther(userId: string) {
    const { otherCallMap, otherCallConnectionMap } = this.get();
    const call = otherCallMap.get(userId);
    const callConnection = otherCallConnectionMap.get(userId);
    if (!call || !callConnection) return;
    callConnection.mic = 0;
    this.set({ otherCallConnectionMap: new Map(otherCallConnectionMap) });
    call.disableAudioTracks();
  }
  unmuteOther(userId: string) {
    const { otherCallMap, otherCallConnectionMap } = this.get();
    const call = otherCallMap.get(userId);
    const callConnection = otherCallConnectionMap.get(userId);
    if (!call || !callConnection) return;
    callConnection.mic = 100;
    this.set({ otherCallConnectionMap: new Map(otherCallConnectionMap) });
    call.enableAudioTracks();
  }
  camOnOther(userId: string) {
    const { otherCallMap, otherCallConnectionMap } = this.get();
    const call = otherCallMap.get(userId);
    const callConnection = otherCallConnectionMap.get(userId);
    if (!call || !callConnection) return;
    callConnection.cam = true;
    this.set({ otherCallConnectionMap: new Map(otherCallConnectionMap) });
    call.enableVideoTracks();
  }
  camOffOther(userId: string) {
    const { otherCallMap, otherCallConnectionMap } = this.get();
    const call = otherCallMap.get(userId);
    const callConnection = otherCallConnectionMap.get(userId);
    if (!call || !callConnection) return;
    callConnection.cam = false;
    this.set({ otherCallConnectionMap: new Map(otherCallConnectionMap) });
    call.disableVideoTracks();
  }
}
