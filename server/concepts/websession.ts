import crypto from "crypto";
import { SessionData } from "express-session";
import { ObjectId } from "mongodb";
import { NotAllowedError, UnauthenticatedError } from "./errors";

export type WebSessionDoc = SessionData;

declare module "express-session" {
  export interface SessionData {
    user?: string;
    token: string;
    email: string;
    link: string;
  }
}

const sessions: WebSessionDoc[] = [];

export default class WebSessionConcept {
  start(session: WebSessionDoc, user?: ObjectId, token?: string) {
    if (token) {
      this.isNotActive(session);
      const existingSession = this.getSessionFromToken(sessions, token.toString());
      if (existingSession) {
        return existingSession;
      }
    } else {
      this.isNotActive(session);
      session.user = user?.toString();
      session.token = crypto.randomBytes(20).toString("hex");
      sessions.push(session);
    }
  }

  end(session: WebSessionDoc, email?: string) {
    this.isActive(session);
    if (email) {
      this.saveAndContinueLater(session, email);
    } else {
      session.user = undefined;
      session.token = "";
      session.email = "";
      session.link = "";
    }
  }

  isActive(session: WebSessionDoc) {
    if (!session.token) {
      throw new UnauthenticatedError("Must be in a session!");
    }
  }

  isNotActive(session: WebSessionDoc) {
    if (session.token) {
      throw new NotAllowedError("Must not already be in a session!");
    }
  }

  getSessionFromToken(sessions: WebSessionDoc[], token: string) {
    const session = sessions.find((session) => session.token === token);
    if (session) {
      return session;
    } else {
      throw new UnauthenticatedError("Invalid token!");
    }
  }

  getCurrentSession(session: WebSessionDoc, token?: string) {
    this.isActive(session);
    if (token) {
      const currentSession = this.getSessionFromToken(sessions, token);
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
    session.email = email;
    session.link = `https://ASCERwebsite.com/continue?token=${session.token}`;

    // Send email to user
  }

  getUser(session: WebSessionDoc) {
    this.isActive(session);
    return new ObjectId(session.user);
  }
}
