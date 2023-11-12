"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlreadyFriendsError = exports.FriendNotFoundError = exports.FriendRequestAlreadyExistsError = exports.FriendRequestNotFoundError = void 0;
const doc_1 = __importDefault(require("../framework/doc"));
const errors_1 = require("./errors");
class FriendConcept {
    constructor() {
        this.friends = new doc_1.default("friends");
        this.requests = new doc_1.default("friendRequests");
    }
    getRequests(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requests.readMany({
                $or: [{ from: user }, { to: user }],
            });
        });
    }
    sendRequest(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.canSendRequest(from, to);
            yield this.requests.createOne({ from, to, status: "pending" });
            return { msg: "Sent request!" };
        });
    }
    acceptRequest(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removePendingRequest(from, to);
            // Following two can be done in parallel, thus we use `void`
            void this.requests.createOne({ from, to, status: "accepted" });
            void this.addFriend(from, to);
            return { msg: "Accepted request!" };
        });
    }
    rejectRequest(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removePendingRequest(from, to);
            yield this.requests.createOne({ from, to, status: "rejected" });
            return { msg: "Rejected request!" };
        });
    }
    removeRequest(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removePendingRequest(from, to);
            return { msg: "Removed request!" };
        });
    }
    removeFriend(user, friend) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendship = yield this.friends.popOne({
                $or: [
                    { user1: user, user2: friend },
                    { user1: friend, user2: user },
                ],
            });
            if (friendship === null) {
                throw new FriendNotFoundError(user, friend);
            }
            return { msg: "Unfriended!" };
        });
    }
    getFriends(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendships = yield this.friends.readMany({
                $or: [{ user1: user }, { user2: user }],
            });
            // Making sure to compare ObjectId using toString()
            return friendships.map((friendship) => (friendship.user1.toString() === user.toString() ? friendship.user2 : friendship.user1));
        });
    }
    addFriend(user1, user2) {
        return __awaiter(this, void 0, void 0, function* () {
            void this.friends.createOne({ user1, user2 });
        });
    }
    removePendingRequest(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.requests.popOne({ from, to, status: "pending" });
            if (request === null) {
                throw new FriendRequestNotFoundError(from, to);
            }
            return request;
        });
    }
    isNotFriends(u1, u2) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendship = yield this.friends.readOne({
                $or: [
                    { user1: u1, user2: u2 },
                    { user1: u2, user2: u1 },
                ],
            });
            if (friendship !== null || u1.toString() === u2.toString()) {
                throw new AlreadyFriendsError(u1, u2);
            }
        });
    }
    canSendRequest(u1, u2) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.isNotFriends(u1, u2);
            // check if there is pending request between these users
            const request = yield this.requests.readOne({
                from: { $in: [u1, u2] },
                to: { $in: [u1, u2] },
                status: "pending",
            });
            if (request !== null) {
                throw new FriendRequestAlreadyExistsError(u1, u2);
            }
        });
    }
}
exports.default = FriendConcept;
class FriendRequestNotFoundError extends errors_1.NotFoundError {
    constructor(from, to) {
        super("Friend request from {0} to {1} does not exist!", from, to);
        this.from = from;
        this.to = to;
    }
}
exports.FriendRequestNotFoundError = FriendRequestNotFoundError;
class FriendRequestAlreadyExistsError extends errors_1.NotAllowedError {
    constructor(from, to) {
        super("Friend request between {0} and {1} already exists!", from, to);
        this.from = from;
        this.to = to;
    }
}
exports.FriendRequestAlreadyExistsError = FriendRequestAlreadyExistsError;
class FriendNotFoundError extends errors_1.NotFoundError {
    constructor(user1, user2) {
        super("Friendship between {0} and {1} does not exist!", user1, user2);
        this.user1 = user1;
        this.user2 = user2;
    }
}
exports.FriendNotFoundError = FriendNotFoundError;
class AlreadyFriendsError extends errors_1.NotAllowedError {
    constructor(user1, user2) {
        super("{0} and {1} are already friends!", user1, user2);
        this.user1 = user1;
        this.user2 = user2;
    }
}
exports.AlreadyFriendsError = AlreadyFriendsError;
//# sourceMappingURL=friend.js.map