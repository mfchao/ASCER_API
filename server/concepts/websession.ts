import crypto from "crypto";
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
  }
}

const tokens: string[] = ["user1", "user2", "user3", "user4"];
const sessions: { [token: string]: WebSessionDoc } = {};

export default class WebSessionConcept {
  start(session: WebSessionDoc, token: string, category: string, user: ObjectId) {
    if (token) {
      if (tokens.includes(token)) {
        if (sessions[token]) {
          session.category = sessions[token].category;
          session.user = sessions[token].user?.toString();
          session.token = token;
          // return sessions[token];
        } else {
          session.category = category;
          session.user = user.toString();
          session.token = token;
          sessions[token] = session;
        }
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
    if (session.category && session.user && session.token ) {
      throw new NotAllowedError("Must not already be in a session!");
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
    if (session.token && sessions[session.token]) {
      session.email = email;
      session.link = `https://ASCERwebsite.com/continue?token=${session.token}`;
      // Send email to category
    } else {
      throw new UnauthenticatedError("Invalid token!");
    }
  }

  getCategory(session: WebSessionDoc) {
    this.isActive(session);
    return session.category;
  }

  getUser(session: WebSessionDoc) {
    this.isActive(session);
    return new ObjectId(session.user);
  }
}


