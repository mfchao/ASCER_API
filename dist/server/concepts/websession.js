"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const mongodb_1 = require("mongodb");
const errors_1 = require("./errors");
const sessions = [];
class WebSessionConcept {
    start(session, category, user, token) {
        if (token) {
            this.isNotActive(session);
            const existingSession = this.getSessionFromToken(sessions, token.toString());
            if (existingSession) {
                return existingSession;
            }
        }
        else {
            this.isNotActive(session);
            session.category = category;
            session.user = user.toString();
            session.token = crypto_1.default.randomBytes(20).toString("hex");
            sessions.push(session);
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
        if (!session.category && !session.user) {
            throw new errors_1.UnauthenticatedError("Must be in a session!");
        }
    }
    isNotActive(session) {
        if (session.category && session.user) {
            throw new errors_1.NotAllowedError("Must not already be in a session!");
        }
    }
    getSessionFromToken(sessions, token) {
        const session = sessions.find((session) => session.token === token);
        if (session) {
            return session;
        }
        else {
            throw new errors_1.UnauthenticatedError("Invalid token!");
        }
    }
    getCurrentSession(session, token) {
        this.isActive(session);
        if (token) {
            const currentSession = this.getSessionFromToken(sessions, token);
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
        session.email = email;
        session.link = `https://ASCERwebsite.com/continue?token=${session.token}`;
        // Send email to category
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