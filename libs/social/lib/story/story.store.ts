import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.Story)
export class StoryStore extends stateOf(fetch.storyGql, {
  // state
}) {
  likeStory(id: string) {
    const { story } = this.pick("story");
    if (story.setLike()) void fetch.likeStory(story.id);
    this.setStory(story);
  }
  resetLikeStory(id: string) {
    const { story } = this.pick("story");
    if (story.resetLike()) void fetch.resetLikeStory(story.id);
    this.setStory(story);
  }
  unlikeStory(id: string) {
    const { story } = this.pick("story");
    if (story.unlike()) void fetch.unlikeStory(story.id);
    this.setStory(story);
  }
  async approveStory(id: string) {
    const story = await fetch.approveStory(id);
    this.setStory(story);
  }
  async denyStory(id: string) {
    const story = await fetch.denyStory(id);
    this.setStory(story);
  }
}
