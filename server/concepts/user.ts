import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface UserDoc extends BaseDoc {
  token: string;
  category: string;
  question: string;
  descriptions: string[];
  confidence?: number;

}

export default class UserConcept {
  public readonly users = new DocCollection<UserDoc>("users");

  async create(category: string, token: string) {
    await this.canCreate(category, token);
    let question;
    let descriptions;
    if (category == "Sales") {
      question = "On a scale of 1 to 5, how likely do you think this tile product is to achieve success in the market, considering both immediate sales volume and long-term market presence?";
      descriptions = ["Very Unlikely", "Very Likely"];
    } else if (category == "Customer") {
      question =
        "How would you rate the overall aesthetics and design of the tile product (on a scale of 1 to 5), considering the potential satisfaction of both traditional and trend-focused customer segments?";
      descriptions = ["Very UnAesthetic", "Very Aesthetic"];
    } else if (category == "Designer") {
      question = "On a scale of 1 to 5, how likely do you believe this tile product is to be a trend-setting product, influencing future design preferences in the US market?";
      descriptions = ["Very Unlikely", "Very Likely"];
    } else {
      question = "How trendy do you think this tile design is?";
      descriptions = ["Very UnTrendy", "Very Trendy"];
    }
    const _id = await this.users.createOne({ category, token, question, descriptions });
    return { msg: "User created successfully!", user: await this.users.readOne({ _id }) };
  }

  async getUserById(_id: ObjectId) {
    const user = await this.users.readOne({ _id });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
  }

  async getUserByToken(token: string) {
    return await this.users.readOne({ token });
  }

  async getQuestion(category: string) {
    const user = await this.users.readOne({ category });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    } else {
      return user.question;
    }
  }

  async getDescriptions(category: string) {
    const user = await this.users.readOne({ category });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    } else {
      return user.descriptions;
    }
  }

  async getCategory(_id: ObjectId) {
    const user = await this.users.readOne({ _id });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    } else {
      return user.category;
    }
  }

  async getUsers() {
    const users = await this.users.readMany({});
    return users;
  }

  async deleteAll() {
    await this.users.deleteMany({});
    return { msg: "Users deleted!" };
  }

  private async canCreate(category: string, token: string) {
    if (!category && !token) {
      throw new BadValuesError("Category and token must be non-empty!");
    }
  }

  async update(_id: ObjectId, update: Partial<UserDoc>) {
    await this.users.updateOne({ _id }, update);
    return { msg: "User updated successfully!" };
  }
}
