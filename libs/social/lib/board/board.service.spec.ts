// import { BoardService } from "./board.service";
// import { TestSystem } from "@shared/test-server";
// import { environment } from "../env/environment";

// import * as db from "../db";
// import * as sample from "../sample";
// import { StoryService } from "../story/story.service";
// import { cnst } from "../cnst";
// import { registerModules } from "../server";
// describe("Board Service", () => {
//   const system = new TestSystem();
//   let boardService: BoardService;
//   let storyService: StoryService;
//   let network: db.shared.Network.Doc;
//   let user: db.User.Doc;
//   let story: db.Story.Doc;
//   const address = environment.klaytn.root.address;
//   beforeAll(async () => {
//     const app = await system.init(registerModules(environment));
//     boardService = app.get<BoardService>(BoardService);
//     storyService = app.get<StoryService>(StoryService);
//     network = await sample.shared.createNetwork(app, "klaytn");
//     [user] = await sample.createUser(app, network._id, address);
//   });
//   afterAll(async () => await system.terminate());
//   let board: db.Board.Doc;
//   let input: cnst.BoardInput;
//   it("Create Board", async () => {
//     input = sample.boardInput();
//     board = await boardService.create(input);
//     expect(board.status).toEqual("active");
//     expect(board).toEqual(expect.objectContaining(input));
//   });
//   it("Update Board", async () => {
//     input = sample.boardInput();
//     board = await boardService.update(board._id, input);
//     expect(board).toEqual(expect.objectContaining(input));
//   });
//   it("Able to Create Story with included roles", async () => {
//     story = await storyService.create(sample.storyInput(board._id, user._id));
//     expect(story.status).toEqual("active");
//   });
//   it("Unable to Create Story with not included roles", async () => {
//     await board.set({ roles: ["admin"] }).save();
//     await expect(storyService.create(sample.storyInput(board._id, user._id))).rejects.toThrow();
//   });
//   // it("Auto Approve Policy", async () => {
//   //   await board.set({ roles: ["admin", "user"], policy: ["autoApprove"] }).save();
//   //   story = await storyService.create(sample.storyInput(board._id, user._id));
//   //   expect(story.status).toEqual("approved");
//   // });
//   it("Remove Board", async () => {
//     board = await boardService.remove(board._id);
//     expect(board.status).toEqual("inactive");
//   });
//   // it("Unable to create Story when board is removed", async () => {
//   //   await boardService.remove(board._id);
//   //   await expect(storyService.create(sample.storyInput(board._id, user._id))).rejects.toThrow();
//   // });
// });
