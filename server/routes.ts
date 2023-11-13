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
  async startSession(session: WebSessionDoc, category: string, token?: string) {
    if (token) {
      const userID = WebSession.getUser(session);
      if (userID) {
        WebSession.start(session, category, userID, token);
      }
    } else {
      const user = await User.create(category);
      const userID = user.user?._id;
      if (userID) {
        WebSession.start(session, category, userID);
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
    const category = WebSession.getCategory(session);
    const user = WebSession.getUser(session);
    if (category) {
      return await Dataset.create(image_id, rating, category, user);
    }
  }

  @Router.get("/dataset/rating")
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

  @Router.get("/dataset")
  async getDataset() {
    return await Dataset.getDataset();
  }

}

export default getExpressRouter(new Routes());
