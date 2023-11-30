import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface ImageDoc extends BaseDoc {
  filename: string;
  link: string;
}

export default class ImageConcept {
  public readonly images = new DocCollection<ImageDoc>("images");

  async create(filename: string, link: string) {
    if (filename && link) {
      const _id = await this.images.createOne({ filename, link });
      return { msg: "Image created successfully!", user: await this.images.readOne({ _id }) };
    } else {
      throw new NotFoundError("Filename and Link are required");
    }
  }

  async getImageById(_id: ObjectId) {
    const image = await this.images.readOne({ _id });
    if (image === null) {
      throw new NotFoundError(`Image not found!`);
    }
  }

  async getImageByFilename(filename: string) {
    const image = await this.images.readOne({ filename });
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

  async getFilename(_id: ObjectId) {
    const image = await this.images.readOne({ _id });
    if (image === null) {
      throw new NotFoundError(`Image not found!`);
    } else {
      return image.filename;
    }
  }

  async delete(filename: string) {
    const image = await this.images.readOne({ filename });
    if (!image) {
      throw new NotFoundError(`Image not found!`);
    }
    await this.images.deleteOne({ filename });
    return { msg: "Image deleted!" };
  }

  async deleteAll() {
    await this.images.deleteMany({});
    return { msg: "Images deleted!" };
  }
}
