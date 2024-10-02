import { LogService } from "@core/server";
import { Server, Socket } from "socket.io";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway({ cors: { origin: "*" }, transports: ["websocket"] })
export class GroupCallGateway extends LogService("GroupCallGateway") {
  @WebSocketServer() server: Server;

  @SubscribeMessage("join")
  async join(client: Socket, { roomId, userId }: { roomId: string; userId: string }) {
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId };
    if (clients.length === 0) {
      this.logger.log(`created Room ${roomId}`);
      void client.join(roomId);
      client.rooms.add(roomId);
    } else if (clients.length > 0) {
      this.logger.log(`joined ${userId} from to ${roomId}`);
      for (const client_ of clients) client_.emit("introduce", { userId });
      void client.join(roomId);
    } else {
      client.rooms.clear();
      void client.leave(roomId);
      client.emit("full");
    }

    client.on("disconnect", () => {
      this.logger.log("disconnect");
      this.server.to(roomId).emit(`disconnected:${userId}`);
    });

    client.on("leave", () => {
      this.logger.log("leave");
      this.server.to(roomId).emit(`disconnected:${userId}`);
      client.rooms.clear();
      void client.leave(roomId);
    });
  }
  @SubscribeMessage("welcome")
  async receive(client: Socket, { userId, roomId, from }: { userId: string; roomId: string; from: string }) {
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    const receiver = clients.find((client: { data: { userId: string } }) => client.data.userId === from);
    receiver?.emit("welcome", { roomId, userId });
  }

  @SubscribeMessage("signal")
  async exchange(
    client: Socket,
    { desc, roomId, userId, from }: { desc: string; roomId: string; userId: string; from: string }
  ) {
    // this.logger.log("to :", from, "from : ", userId, "roomId : ", roomId);
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    const socket = clients.find((client: { data: { userId: string } }) => client.data.userId === from);
    if (!socket) return;
    socket.emit(`desc:${userId}`, { desc, userId });
  }

  // @SubscribeMessage("leave")
  // async leave(client: Socket, { selfId }) {
  //   this.logger.log("leave");
  //   const roomId = client.rooms.values()[0];
  //   if (roomId) this.server.to(roomId).emit(`disconnected:${selfId}`);
  //   client.rooms.clear();
  //   client.leave(roomId);
  // }
}
