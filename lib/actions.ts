"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { AnswerResult, Lesson, Roadmap } from "@/lib/types";

export async function getRoadmaps() {
  try {
    const client = await clientPromise;
    const db = client.db("prod");
    return (await db.collection("roadmaps").find({}).toArray()) as Roadmap[];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getRoadmap(roadmapId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("prod");
    return (await db
      .collection("roadmaps")
      .findOne({ _id: new ObjectId(roadmapId) })) as Roadmap;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function generateLesson(body: {
  roadmapId: string;
  conceptId: string;
  roadmapTitle: string;
  sectionTitle: string;
  conceptTitle: string;
}) {
  try {
    const res = await fetch("http://127.0.0.1:8000/lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error generating lesson: ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export async function getLessonsByConceptId(conceptId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("prod");
    const docs = await db.collection("lessons").find({ conceptId }).toArray();

    return docs.map((doc) => ({
      _id: doc._id.toString(),
      content: doc.content,
      summary: doc.summary,
      exercise: doc.exercise,
      createdAt: doc.createdAt,
      completed: doc.completed,
      conceptId: doc.conceptId,
      title: doc.title,
      isFinal: doc.is_final,
    })) as Lesson[];
  } catch (err) {
    console.error("Could not get lessons by conceptId: ", err);
    throw err;
  }
}

export async function checkAnswer(payload: {
  question: string;
  answer: string;
  lessonContent: string;
}): Promise<AnswerResult> {
  console.log("PAYLOAD: ", payload);
  try {
    const res = await fetch("http://127.0.0.1:8000/check-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Error checking answer");
    }

    return await res.json();
  } catch (err) {
    throw new Error("Error checking answer");
  }
}
