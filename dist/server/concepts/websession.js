"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const errors_1 = require("./errors");
const tokens = {
    user1: { category: "User", seed: 1 },
    user2: { category: "User", seed: 2 },
    user3: { category: "User", seed: 3 },
    user4: { category: "User", seed: 4 },
    user5: { category: "User", seed: 5 },
    user6: { category: "User", seed: 6 },
    user7: { category: "User", seed: 7 },
    user8: { category: "User", seed: 8 },
    user9: { category: "User", seed: 9 },
    user10: { category: "User", seed: 10 },
    user11: { category: "User", seed: 11 },
    user12: { category: "User", seed: 12 },
    user13: { category: "User", seed: 6 },
};
const sessions = {};
class WebSessionConcept {
    start(session, token, user) {
        if (token) {
            if (tokens[token]) {
                session.category = tokens[token].category;
                session.user = user.toString();
                session.token = token;
                sessions[token] = session;
                session.seed = tokens[token].seed;
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
            session.seed = 0;
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
        // if (session.token && sessions[session.token]) {
        session.email = email;
        session.link = `https://ASCERwebsite.com/continue?token=${session.token}`;
        session.category = undefined;
        session.user = undefined;
        session.token = "";
        // Send email to category
        // } else {
        //   throw new UnauthenticatedError("Couldn't save session");
        // }
    }
    getCategory(session) {
        this.isActive(session);
        return session.category;
    }
    getToken(session) {
        this.isActive(session);
        return session.token;
    }
    getCategoryFromToken(token) {
        return tokens[token].category;
    }
    getUser(session) {
        this.isActive(session);
        return new mongodb_1.ObjectId(session.user);
    }
    getSeedFromToken(token) {
        return tokens[token].seed;
    }
}
exports.default = WebSessionConcept;
//# sourceMappingURL=websession.js.map