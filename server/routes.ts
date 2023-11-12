import { Router, getExpressRouter } from "./framework/router";

import { Dataset, Image, User, WebSession } from "./app";
import { DatasetDoc } from "./concepts/dataset";
import { WebSessionDoc } from "./concepts/websession";

class Routes {
  @Router.get("/session")
  async getCurrentSession(session: WebSessionDoc, token?: string) {
    const newSession = WebSession.getCurrentSession(session, token);
    return newSession;
  }

  @Router.get("/session/sessions")
  async getSessions() {
    const Sessions = WebSession.getSessions();
    return Sessions;
  }

  @Router.post("/session/start")
  async startSession(session: WebSessionDoc, token?: string) {
    if (token) {
      const user = WebSession.getUser(session);
      WebSession.start(session, user, token);
    } else {
      WebSession.start(session);
    }
    return { msg: "Session started!", session };
  }

  @Router.post("/session/end")
  async endSession(session: WebSessionDoc, email?: string) {
    if (email) {
      WebSession.end(session, email);
    } else {
      WebSession.end(session);
    }

    return { msg: "Session ended!", session };
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, category: string) {
    WebSession.isActive(session);
    return await User.create(category);
  }

  @Router.get("/images")
  async getImages() {
    return await Image.getImages();
  }

  @Router.post("/images")
  async createImage(file: string) {
    return await Image.create(file);
  }

  @Router.delete("/images")
  async deleteImage(file: string) {
    return await Image.delete(file);
  }

  @Router.post("/dataset")
  async createDataEntry(session: WebSessionDoc, image: string, rating: number) {
    const image_id = await Image.getImageByFile(image);
    const user = WebSession.getUser(session);
    const category = await User.getCategory(user);
    return await Dataset.create(image_id, rating, category);
  }

  @Router.get("/dataset")
  async getRating(image: string) {
    const image_id = await Image.getImageByFile(image);
    return await Dataset.getRatingbyID(image_id);
  }

  @Router.patch("/dataset")
  async updateData(image: string, update: Partial<DatasetDoc>) {
    const image_id = await Image.getImageByFile(image);
    const entry_id = await Dataset.getIDbyfile(image_id);
    return await Dataset.update(entry_id, update);
  }

  //   @Router.delete("/users")
  //   async deleteUser(session: WebSessionDoc) {
  //     const user = WebSession.getUser(session);
  //     WebSession.end(session);
  //     return await User.delete(user);
  //   }

  //   @Router.post("/logout")
  //   async logOut(session: WebSessionDoc) {
  //     WebSession.end(session);
  //     return { msg: "Logged out!" };
  //   }

  //   @Router.get("/posts")
  //   async getPosts(author?: string) {
  //     let posts;
  //     if (author) {
  //       const id = (await User.getUserByUsername(author))._id;
  //       posts = await Post.getByAuthor(id);
  //     } else {
  //       posts = await Post.getPosts({});
  //     }
  //     return Responses.posts(posts);
  //   }

  //   @Router.post("/posts")
  //   async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
  //     const user = WebSession.getUser(session);
  //     const created = await Post.create(user, content, options);
  //     return { msg: created.msg, post: await Responses.post(created.post) };
  //   }

  //   @Router.patch("/posts/:_id")
  //   async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
  //     const user = WebSession.getUser(session);
  //     await Post.isAuthor(user, _id);
  //     return await Post.update(_id, update);
  //   }

  //   @Router.delete("/posts/:_id")
  //   async deletePost(session: WebSessionDoc, _id: ObjectId) {
  //     const user = WebSession.getUser(session);
  //     await Post.isAuthor(user, _id);
  //     return Post.delete(_id);
  //   }

  //   @Router.get("/friends")
  //   async getFriends(session: WebSessionDoc) {
  //     const user = WebSession.getUser(session);
  //     return await User.idsToUsernames(await Friend.getFriends(user));
  //   }

  //   @Router.delete("/friends/:friend")
  //   async removeFriend(session: WebSessionDoc, friend: string) {
  //     const user = WebSession.getUser(session);
  //     const friendId = (await User.getUserByUsername(friend))._id;
  //     return await Friend.removeFriend(user, friendId);
  //   }

  //   @Router.get("/friend/requests")
  //   async getRequests(session: WebSessionDoc) {
  //     const user = WebSession.getUser(session);
  //     return await Responses.friendRequests(await Friend.getRequests(user));
  //   }

  //   @Router.post("/friend/requests/:to")
  //   async sendFriendRequest(session: WebSessionDoc, to: string) {
  //     const user = WebSession.getUser(session);
  //     const toId = (await User.getUserByUsername(to))._id;
  //     return await Friend.sendRequest(user, toId);
  //   }

  //   @Router.delete("/friend/requests/:to")
  //   async removeFriendRequest(session: WebSessionDoc, to: string) {
  //     const user = WebSession.getUser(session);
  //     const toId = (await User.getUserByUsername(to))._id;
  //     return await Friend.removeRequest(user, toId);
  //   }

  //   @Router.put("/friend/accept/:from")
  //   async acceptFriendRequest(session: WebSessionDoc, from: string) {
  //     const user = WebSession.getUser(session);
  //     const fromId = (await User.getUserByUsername(from))._id;
  //     return await Friend.acceptRequest(fromId, user);
  //   }

  //   @Router.put("/friend/reject/:from")
  //   async rejectFriendRequest(session: WebSessionDoc, from: string) {
  //     const user = WebSession.getUser(session);
  //     const fromId = (await User.getUserByUsername(from))._id;
  //     return await Friend.rejectRequest(fromId, user);
  //   }
}

export default getExpressRouter(new Routes());
