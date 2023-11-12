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

  // async getUserByUsername(username: string) {
  //   const user = await this.users.readOne({ username });
  //   if (user === null) {
  //     throw new NotFoundError(`User not found!`);
  //   }
  //   return this.sanitizeUser(user);
  // }

  // async idsToUsernames(ids: ObjectId[]) {
  //   const users = await this.users.readMany({ _id: { $in: ids } });

  //   // Store strings in Map because ObjectId comparison by reference is wrong
  //   const idToUser = new Map(users.map((user) => [user._id.toString(), user]));
  //   return ids.map((id) => idToUser.get(id.toString())?.username ?? "DELETED_USER");
  // }

  async getUsers() {
    const users = await this.users.readMany({});
    return users;
  }

  // async authenticate(username: string, password: string) {
  //   const user = await this.users.readOne({ username, password });
  //   if (!user) {
  //     throw new NotAllowedError("Username or password is incorrect.");
  //   }
  //   return { msg: "Successfully authenticated.", _id: user._id };
  // }

  // async update(_id: ObjectId, update: Partial<UserDoc>) {
  //   if (update.username !== undefined) {
  //     await this.isUsernameUnique(update.username);
  //   }
  //   await this.users.updateOne({ _id }, update);
  //   return { msg: "User updated successfully!" };
  // }

  // async delete(_id: ObjectId) {
  //   await this.users.deleteOne({ _id });
  //   return { msg: "User deleted!" };
  // }

  // async userExists(_id: ObjectId) {
  //   const maybeUser = await this.users.readOne({ _id });
  //   if (maybeUser === null) {
  //     throw new NotFoundError(`User not found!`);
  //   }
  // }

  private async canCreate(category: string) {
    if (!category) {
      throw new BadValuesError("Category must be non-empty!");
    }
  }

  // private async isUsernameUnique(username: string) {
  //   if (await this.users.readOne({ username })) {
  //     throw new NotAllowedError(`User with username ${username} already exists!`);
  //   }
  // }
}
