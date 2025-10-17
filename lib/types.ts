import type { ObjectId } from "mongodb";

export type LessonMeta = {
  title: string;
  description: string;
};

export type Section = {
  title: string;
  description: string;
  lessons: LessonMeta[];
};

export type Roadmap = {
  _id: ObjectId;
  topic: string;
  sections: Section[];
  createdAt: Date;
};
