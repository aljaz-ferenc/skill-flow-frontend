import type { ObjectId } from "mongodb";

export type BaseExercise = {
  type: "mcq" | "question";
  createdAt: Date;
  completed: boolean;
  summary: string;
};

export type MCQExercise = BaseExercise & {
  type: "mcq";
  question: string;
  answer_options: string[];
  answer_index: number;
};

export type QuestionExercise = BaseExercise & {
  type: "question";
  question: string;
};

export type Exercise = MCQExercise | QuestionExercise;

export type Lesson = {
  _id: string;
  content?: string;
  exercises?: Exercise[];
  conceptId: string;
  title: string;
  is_final: boolean;
  status: "locked" | "current" | "completed";
  description: string;
  learning_objectives: string[];
};

export type LessonMeta = {
  title: string;
  description: string;
  learning_objectives: string[];
  status: "locked" | "current" | "completed";
};

export type ConceptMeta = {
  title: string;
  description: string;
  _id: string;
  lessons: LessonMeta[];
  status: "locked" | "current" | "completed";
};

export type Section = {
  title: string;
  description: string;
  concepts: ConceptMeta[];
  _id: string;
  status: "locked" | "current" | "completed";
};

export type Roadmap = {
  _id: ObjectId;
  topic: string;
  sections: Section[];
  createdAt: Date;
};

export type AnswerResult = {
  is_correct: boolean;
  additional_explanation: string;
};
