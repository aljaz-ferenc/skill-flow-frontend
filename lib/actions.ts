import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import type { Exercise, Lesson, Roadmap } from "@/lib/types";

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

export async function checkAnswer(exercise: Exercise) {
  try {
    if (exercise.type === "question") {
    }
  } catch (err) {
    console.error(err);
  }
}
