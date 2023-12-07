import { Router, getExpressRouter } from "./framework/router";

import { Dataset, Image, User, WebSession } from "./app";
import { DatasetDoc } from "./concepts/dataset";
import { WebSessionDoc } from "./concepts/websession";
import { ObjectId } from "mongodb";
import { UserDoc } from "./concepts/user";


class Routes {
  // @Router.get("/session")
  // async getCurrentSession(session: WebSessionDoc, token?: string) {
  //   const newSession = WebSession.getCurrentSession(session, token);
  //   return newSession;
  // }

  @Router.get("/session")
  async getCurrentToken(session: WebSessionDoc) {
    const currentToken = WebSession.getToken(session);
    return currentToken;
  }

  // @Router.get("/session/sessions")
  // async getSessions() {
  //   const Sessions = WebSession.getSessions();
  //   return Sessions;
  // }

  @Router.post("/session/start")
  async startSession(session: WebSessionDoc, token: string) {
    const user = await User.getUserByToken(token);

    if (user != null) {
      WebSession.start(session, token, user._id);
    } else {
      const category = WebSession.getCategoryFromToken(token);
      const newUser = await User.create(category, token);
      if (newUser.user != null) {
        WebSession.start(session, token, newUser.user._id);
      }
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

  @Router.delete("/users")
  async deleteUsers() {
    return await User.deleteAll();
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.get("/users/category")
  async getQuestion(session: WebSessionDoc) {
    WebSession.isActive(session);
    const category = WebSession.getCategory(session);
    if (category) {
      return await User.getQuestion(category);
    }
  }

  @Router.get("/users/descriptions")
  async getDescriptions(session: WebSessionDoc) {
    WebSession.isActive(session);
    const category = WebSession.getCategory(session);
    if (category) {
      return await User.getDescriptions(category);
    }
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, category: string, token: string) {
    WebSession.isActive(session);
    return await User.create(category, token);
  }

  @Router.get("/images")
  async getImages() {
    return await Image.getImages();
  }

  @Router.post("/images")
  async createImage(file: string, link: string) {
    return await Image.create(file, link);
  }

  @Router.delete("/images")
  async deleteImage(file: string) {
    return await Image.delete(file);
  }

  @Router.get("/images/:_id")
  async getFilename(_id: ObjectId) {
    return await Image.getFilename(_id);
  }

  @Router.get("/dataset/rating/:image")
  async getRatingNumber(session: WebSessionDoc, image: string) {
    const image_id = await Image.getImageByFilename(image);
    const token = WebSession.getToken(session);
    return await Dataset.getRatingNumber(image_id, token);
  }

  @Router.post("/dataset")
  async createDataEntry(session: WebSessionDoc, image: string, rating: number) {
    const image_id = await Image.getImageByFilename(image);
    const category = WebSession.getCategory(session);
    const token = WebSession.getToken(session);
    if (category) {
      return await Dataset.create(image_id, rating, category, token);
    }
  }

  @Router.get("/dataset/rating")
  async getRating(image: string) {
    const image_id = await Image.getImageByFilename(image);
    return await Dataset.getRatingbyID(image_id);
  }

  @Router.patch("/dataset")
  async updateData(image: string, update: Partial<DatasetDoc>) {
    const image_id = await Image.getImageByFilename(image);
    const entry_id = await Dataset.getIDbyfile(image_id);
    return await Dataset.update(entry_id, update);
  }

  @Router.get("/dataset")
  async getDataset() {
    return await Dataset.getDataset();
  }

  @Router.get("/dataset/users/:token")
  async getDatasetbyToken(token: string) {
    return await Dataset.getDatasetbyToken(token);
  }

  @Router.delete("/dataset")
  async deleteDataset() {
    return await Dataset.deleteAll();
  }
}

export default getExpressRouter(new Routes());
