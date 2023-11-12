import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface DatasetDoc extends BaseDoc {
  image: ObjectId;
  rating: number;
  category: string;
}

export default class DatasetConcept {
  public readonly dataset = new DocCollection<DatasetDoc>("dataset");

  async create(image: ObjectId, rating: number, category: string) {
    if (rating) {
      const _id = await this.dataset.createOne({ image, rating, category });
      return { msg: "Data entry created successfully!", dataset: await this.dataset.readOne({ _id }) };
    } else {
      throw new NotFoundError(`Please enter a rating!`);
    }
  }

  async getRatingbyID(image: ObjectId) {
    const entry = await this.dataset.readOne({ image });
    if (entry === null) {
      throw new NotFoundError(`User not found!`);
    } else {
      return entry?.rating;
    }
  }

  async getIDbyfile(image: ObjectId) {
    const entry = await this.dataset.readOne({ image });
    if (entry === null) {
      throw new NotFoundError(`User not found!`);
    } else {
      return entry?._id;
    }
  }

  async getDataset() {
    const dataset = await this.dataset.readMany({});
    return dataset;
  }

  async update(_id: ObjectId, update: Partial<DatasetDoc>) {
    if (update.rating !== undefined) {
      await this.dataset.updateOne({ _id }, update);
      return { msg: "Entry updated successfully!" };
    }
  }
}
