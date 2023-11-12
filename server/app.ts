import DatasetConcept from "./concepts/dataset";
import ImageConcept from "./concepts/image";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Image = new ImageConcept();
export const Dataset = new DatasetConcept();
