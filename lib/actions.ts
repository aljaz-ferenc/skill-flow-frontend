"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import {
  type AnswerResult,
  Exercise,
  type Lesson,
  type Roadmap,
} from "@/lib/types";

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
  lessonId: string;
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

    revalidatePath("/lessons");
    return (await res.json()) as { lesson_id: string };
  } catch (err) {
    console.error(err);
  }
}

export async function getLessonsByConceptId(conceptId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("prod");
    const lessonDocs = await db
      .collection<Lesson>("lessons")
      .find({ conceptId })
      .toArray();

    return lessonDocs.map((doc) => ({
      _id: doc._id.toString(),
      content: doc.content,
      exercise: doc.exercise,
      conceptId: doc.conceptId,
      title: doc.title,
      status: doc.status,
      description: doc.description,
      learning_objectives: doc.learning_objectives,
      is_final: doc.is_final,
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

export async function generateRoadmap(topic: string) {
  try {
    const res = await fetch("http://127.0.0.1:8000/generate-roadmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    if (!res.ok) {
      throw new Error("Error generating request");
    }
    revalidatePath("/dashboard/roadmaps");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getLessonById(lessonId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("prod");
    const lessonsCol = db.collection<Lesson>("lessons");

    return await lessonsCol.findOne({
      _id: lessonId,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function completeLesson(lessonId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("prod");
    const lessonsCol = db.collection("lessons");

    const updatedLesson = await lessonsCol.findOneAndUpdate(
      { _id: new ObjectId(lessonId) },
      {
        $set: {
          status: "completed",
        },
      },
      { returnDocument: "after" },
    );
    revalidatePath("/lessons");
    return JSON.parse(JSON.stringify(updatedLesson)) as Lesson;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
