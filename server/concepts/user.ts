import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface UserDoc extends BaseDoc {
  category: string;
}

export default class UserConcept {
  public readonly users = new DocCollection<UserDoc>("users");

  async create(category: string) {
    await this.canCreate(category);
    const _id = await this.users.createOne({ category });
    return { msg: "User created successfully!", user: await this.users.readOne({ _id }) };
  }

  async getUserById(_id: ObjectId) {
    const user = await this.users.readOne({ _id });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
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

  private async canCreate(category: string) {
    if (!category) {
      throw new BadValuesError("Category must be non-empty!");
    }
  }

}
