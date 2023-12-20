import { SessionData } from "express-session";
import { ObjectId } from "mongodb";
import { NotAllowedError, UnauthenticatedError } from "./errors";

export type WebSessionDoc = SessionData;

declare module "express-session" {
  export interface SessionData {
    category?: string;
    user?: string;
    token: string;
    email: string;
    link: string;
    seed: number;
  }
}

const tokens: { [token: string]: { category: string; seed: number } } = {
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

const sessions: { [token: string]: WebSessionDoc } = {};

export default class WebSessionConcept {
  start(session: WebSessionDoc, token: string, user: ObjectId) {
    if (token) {
      if (tokens[token]) {
        session.category = tokens[token].category;
        session.user = user.toString();
        session.token = token;
        sessions[token] = session;
        session.seed = tokens[token].seed;
      } else {
        throw new UnauthenticatedError("Invalid token!");
      }
    } else {
      throw new UnauthenticatedError("Token is required!");
    }
  }

  end(session: WebSessionDoc, email?: string) {
    this.isActive(session);
    if (email) {
      this.saveAndContinueLater(session, email);
    } else {
      session.category = undefined;
      session.user = undefined;
      session.seed = 0;
      session.token = "";
      session.email = "";
      session.link = "";
    }
  }

  isActive(session: WebSessionDoc) {
    if (!session.category && !session.user && !session.token) {
      throw new UnauthenticatedError("Must be in a session!");
    }
  }

  isNotActive(session: WebSessionDoc) {
    if (session.category && session.user && session.token) {
      throw new NotAllowedError("Must not already be in a session!");
    }
  }

  getSessionFromToken(token: string) {
    if (sessions[token]) {
      return sessions[token];
    } else {
      throw new UnauthenticatedError("Invalid token!");
    }
  }

  getCurrentSession(session: WebSessionDoc, token?: string) {
    this.isActive(session);
    if (token) {
      const currentSession = this.getSessionFromToken(token);
      return currentSession;
    } else {
      const currentSession = session;
      return currentSession;
    }
  }

  getSessions() {
    return sessions;
  }

  saveAndContinueLater(session: WebSessionDoc, email: string) {
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

  getCategory(session: WebSessionDoc) {
    this.isActive(session);
    return session.category;
  }

  getToken(session: WebSessionDoc) {
    this.isActive(session);
    return session.token;
  }

  getCategoryFromToken(token: string) {
    return tokens[token].category;
  }

  getUser(session: WebSessionDoc) {
    this.isActive(session);
    return new ObjectId(session.user);
  }

  getSeedFromToken(token: string) {
    return tokens[token].seed;
  }
}
