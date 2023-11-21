import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface UserDoc extends BaseDoc {
  category: string;
  token: string;
}

export default class UserConcept {
  public readonly users = new DocCollection<UserDoc>("users");

  async create(category: string, token: string) {
    await this.canCreate(category, token);
    const _id = await this.users.createOne({ category, token });
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

  private async canCreate(category: string, token: string) {
    if (!category && !token) {
      throw new BadValuesError("Category and token must be non-empty!");
    }
  }

}
