import type { ObjectId } from "mongodb";

export type ConceptMeta = {
  title: string;
  description: string;
};

export type Section = {
  title: string;
  description: string;
  concepts: ConceptMeta[];
};

export type Roadmap = {
  _id: ObjectId;
  topic: string;
  sections: Section[];
  createdAt: Date;
};
