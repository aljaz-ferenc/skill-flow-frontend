import type { ObjectId } from "mongodb";

export type BaseExercise = {
  type: "mcq" | "question";
  createdAt: Date;
  completed: boolean;
  summary: string;
};

export type MCQExercise = BaseExercise & {
  type: "mcq";
  exercise: {
    question: string;
    answerOptions: string[];
    answer_index: number;
  };
};

export type QuestionExercise = BaseExercise & {
  type: "question";
  exercise: {
    question: string;
  };
};

export type Exercise = MCQExercise | QuestionExercise;

export type Lesson = {
  _id: string;
  content: string;
  exercise: Exercise;
  conceptId: string;
  title: string;
  isFinal: boolean;
};

export type ConceptMeta = {
  title: string;
  description: string;
  _id: string;
  lessons: Lesson[];
};

export type Section = {
  title: string;
  description: string;
  concepts: ConceptMeta[];
  _id: string;
};

export type Roadmap = {
  _id: ObjectId;
  topic: string;
  sections: Section[];
  createdAt: Date;
};
