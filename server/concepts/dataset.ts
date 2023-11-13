import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface DatasetDoc extends BaseDoc {
  image: ObjectId;
  rating: number;
  category: string;
  user: ObjectId;
}

export default class DatasetConcept {
  public readonly dataset = new DocCollection<DatasetDoc>("dataset");

  async create(image: ObjectId, rating: number, category: string, user: ObjectId) {
    if (rating) {
      const alreadyRated = await this.alreadyRated(image, user);
      if (alreadyRated) {
        const existingEntry = await this.dataset.readOne({ image, user });
        if (existingEntry) {
          await this.dataset.updateOne({ _id: existingEntry._id }, { rating });
          return { msg: "Rating updated successfully!", dataset: await this.dataset.readOne({ _id: existingEntry._id }) };
        }
      } else {
        const _id = await this.dataset.createOne({ image, rating, category, user });
        return { msg: "Data entry created successfully!", dataset: await this.dataset.readOne({ _id }) };
      }
    } else {
      throw new BadValuesError("please submit a rating!")
    }
    
  }

  private async alreadyRated(image: ObjectId, user: ObjectId) {
    const entry = await this.dataset.readOne({ image, user });
    return entry !== null;  
  }

  async getRatingbyID(image: ObjectId) {
    const entry = await this.dataset.readMany({ image });
    if (entry === null) {
      throw new NotFoundError(`User not found!`);
    } else {
      return entry;
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


