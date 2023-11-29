import { Router, getExpressRouter } from "./framework/router";

import { Dataset, Image, User, WebSession } from "./app";
import { DatasetDoc } from "./concepts/dataset";
import { WebSessionDoc } from "./concepts/websession";

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
  async startSession(session: WebSessionDoc, token: string, category?: string) {
    const user = await User.getUserByToken(token);
    // if  (user && category) {
    //   throw new Error("This session already exists!");
    // }

    if (user != null) {
      WebSession.start(session, token, user.category, user._id);
    } else {
      if (category) {
        const newUser = await User.create(category, token);
        if (newUser.user != null) {
          WebSession.start(session, token, newUser.user.category, newUser.user._id);
        }
      } else {
        throw new Error("Category not provided");
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

  @Router.delete("/images/file")
  async deleteImage(file: string) {
    return await Image.delete(file);
  }

  @Router.delete("/images")
  async deleteAllImages() {
    return await Image.deleteAll();
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

  @Router.get("/dataset/token")
  async getDatasetbyToken(token: string) {
    return await Dataset.getDatasetbyToken(token);
  }
}

export default getExpressRouter(new Routes());
