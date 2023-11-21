"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const errors_1 = require("./errors");
const tokens = ["user1", "user2", "user3", "user4"];
const sessions = {};
class WebSessionConcept {
    start(session, token, category, user) {
        var _a;
        if (token) {
            if (tokens.includes(token)) {
                if (sessions[token]) {
                    session.category = sessions[token].category;
                    session.user = (_a = sessions[token].user) === null || _a === void 0 ? void 0 : _a.toString();
                    session.token = token;
                    // return sessions[token];
                }
                else {
                    session.category = category;
                    session.user = user.toString();
                    session.token = token;
                    sessions[token] = session;
                }
            }
            else {
                throw new errors_1.UnauthenticatedError("Invalid token!");
            }
        }
        else {
            throw new errors_1.UnauthenticatedError("Token is required!");
        }
    }
    end(session, email) {
        this.isActive(session);
        if (email) {
            this.saveAndContinueLater(session, email);
        }
        else {
            session.category = undefined;
            session.user = undefined;
            session.token = "";
            session.email = "";
            session.link = "";
        }
    }
    isActive(session) {
        if (!session.category && !session.user && !session.token) {
            throw new errors_1.UnauthenticatedError("Must be in a session!");
        }
    }
    isNotActive(session) {
        if (session.category && session.user && session.token) {
            throw new errors_1.NotAllowedError("Must not already be in a session!");
        }
    }
    // getSessionFromToken(sessions: WebSessionDoc[], token: string) {
    //   const session = sessions.find((session) => session.token === token);
    //   if (session) {
    //     return session;
    //   } else {
    //     throw new UnauthenticatedError("Invalid token!");
    //   }
    // }
    getSessionFromToken(token) {
        if (sessions[token]) {
            return sessions[token];
        }
        else {
            throw new errors_1.UnauthenticatedError("Invalid token!");
        }
    }
    getCurrentSession(session, token) {
        this.isActive(session);
        if (token) {
            const currentSession = this.getSessionFromToken(token);
            return currentSession;
        }
        else {
            const currentSession = session;
            return currentSession;
        }
    }
    getSessions() {
        return sessions;
    }
    saveAndContinueLater(session, email) {
        this.isActive(session);
        if (session.token && sessions[session.token]) {
            session.email = email;
            session.link = `https://ASCERwebsite.com/continue?token=${session.token}`;
            // Send email to category
        }
        else {
            throw new errors_1.UnauthenticatedError("Invalid token!");
        }
    }
    getCategory(session) {
        this.isActive(session);
        return session.category;
    }
    getUser(session) {
        this.isActive(session);
        return new mongodb_1.ObjectId(session.user);
    }
}
exports.default = WebSessionConcept;
//# sourceMappingURL=websession.js.map