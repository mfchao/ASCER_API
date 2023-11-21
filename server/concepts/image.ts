import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface ImageDoc extends BaseDoc {
  file: string;
}

export default class ImageConcept {
  public readonly images = new DocCollection<ImageDoc>("images");

  async create(file: string) {
    const _id = await this.images.createOne({ file });
    return { msg: "Image created successfully!", user: await this.images.readOne({ _id }) };
  }

  async getImageById(_id: ObjectId) {
    const image = await this.images.readOne({ _id });
    if (image === null) {
      throw new NotFoundError(`Image not found!`);
    }
  }

  async getImageByFile(file: string) {
    const image = await this.images.readOne({ file });
    if (image === null) {
      throw new NotFoundError(`Image not found!`);
    } else {
      return image._id;
    }
  }

  async getImages() {
    const users = await this.images.readMany({});
    return users;
  }

  async delete(file: string) {
    const image = await this.images.readOne({ file });
    if (!image) {
      throw new NotFoundError(`Image not found!`);
    }
    await this.images.deleteOne({ file });
    return { msg: "Image deleted!" };
  }
}
