import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface DatasetDoc extends BaseDoc {
  image: ObjectId;
  ratings: number[];
  timings: number[];
  category: string;
  token: string;
}

export default class DatasetConcept {
  public readonly dataset = new DocCollection<DatasetDoc>("dataset");

  async create(image: ObjectId, rating: number, category: string, token: string, timing: number) {
    if (rating) {
      const alreadyRated = await this.alreadyRated(image, token);
      if (alreadyRated) {
        const existingEntry = await this.dataset.readOne({ image, token });
        if (existingEntry) {
          // await this.dataset.updateOne({ _id: existingEntry._id }, { rating });
          existingEntry.ratings.push(rating);
          existingEntry.timings.push(timing);
          await this.dataset.updateOne({ _id: existingEntry._id }, { ratings: existingEntry.ratings });
          await this.dataset.updateOne({ _id: existingEntry._id }, { timings: existingEntry.timings });
          return { msg: "Rating updated successfully!", dataset: await this.dataset.readOne({ _id: existingEntry._id }) };
        }
      } else {
        const _id = await this.dataset.createOne({ image, ratings: [rating], timings: [timing], category, token });
        return { msg: "Data entry created successfully!", dataset: await this.dataset.readOne({ _id }) };
      }
    } else {
      throw new BadValuesError("please submit a rating!");
    }
  }

  private async alreadyRated(image: ObjectId, token: string) {
    const entry = await this.dataset.readOne({ image, token });
    return entry !== null;
  }

  async getRatingNumber(image: ObjectId, token: string) {
    const entry = await this.dataset.readOne({ image, token });
    if (entry !== null) {
      return entry.ratings[entry.ratings.length - 1];
    } else {
      return;
    }
  }

  async getRatingbyID(image: ObjectId) {
    const entry = await this.dataset.readMany({ image });
    if (entry === null) {
      throw new NotFoundError(`entry not found!`);
    } else {
      return entry;
    }
  }

  async getIDbyfile(image: ObjectId) {
    const entry = await this.dataset.readOne({ image });
    if (entry === null) {
      throw new NotFoundError(`entry not found!`);
    } else {
      return entry?._id;
    }
  }

  async getDataset() {
    const dataset = await this.dataset.readMany({});
    return dataset;
  }

  async getDatasetbyToken(token: string) {
    const dataset = await this.dataset.readMany({ token });
    return dataset;
  }

  async update(_id: ObjectId, update: Partial<DatasetDoc>) {
    if (update.ratings !== undefined) {
      await this.dataset.updateOne({ _id }, update);
      return { msg: "Entry updated successfully!" };
    }
  }

  async deleteAll() {
    await this.dataset.deleteMany({});
    return { msg: "dataset deleted!" };
  }
}


