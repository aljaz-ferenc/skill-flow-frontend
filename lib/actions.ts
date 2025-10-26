"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
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

export async function unlockLesson(lessonId: string) {
  console.log("Unlocking lesson...");
  try {
    const client = await clientPromise;
    const db = client.db("prod");
    const lessonsCol = db.collection<Lesson>("lessons");

    await lessonsCol.findOneAndUpdate(
      { _id: lessonId },
      { $set: { status: "current" } },
    );

    revalidatePath("/lessons");
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
    console.log("Generating lesson...");
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
      exercises: doc.exercises,
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
  console.log("checking answer");
  try {
    const res = await fetch("http://127.0.0.1:8000/check-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Error checking answer: ${await res.text()}`);
    }

    const answerResult: AnswerResult = await res.json();

    return answerResult;
  } catch (err) {
    console.error(err);
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
    console.log(`Completing lesson: ${lessonId}`)
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

    console.log("UPDATED_LESSON: ", updatedLesson)

    revalidatePath("/lessons");
    return JSON.parse(JSON.stringify(updatedLesson)) as Lesson;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deleteRoadmap(roadmapId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("prod");
    const roadmapCol = db.collection<Roadmap>("roadmaps");
    const lessonsCol = db.collection<Lesson>("lessons");

    const roadmap = await roadmapCol.findOne({ _id: new ObjectId(roadmapId) });
    const conceptsIds = roadmap?.sections.flatMap((section) =>
      section.concepts.map((c) => c._id),
    );

    await lessonsCol.deleteMany({
      conceptId: { $in: conceptsIds },
    });

    await roadmapCol.deleteOne({
      _id: new ObjectId(roadmapId),
    });

    revalidatePath("/dashboard/roadmaps");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function planLessons(payload: {
  roadmap_topic: string;
  roadmap_id: string;
  section_title: string;
  concept_title: string;
  concept_id: string;
  section_id: string;
}) {
  try {
    const res = await fetch("http://127.0.0.1:8000/plan-lessons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Error planning lessons: ${await res.text()}`);
    }
    console.log(await res.json());
  } catch (err) {
    console.error(`Error planning lessons: ${err}`);
    throw err;
  }
}

export async function unlockConcept({
  conceptId,
  sectionId,
  roadmapId,
}: {
  conceptId: string;
  sectionId: string;
  roadmapId: string;
}) {
  try {
    const client = await clientPromise;
    const db = client.db("prod");
    const roadmapCol = db.collection<Roadmap>("roadmaps");

    const updatedRoadmap = await roadmapCol.findOneAndUpdate(
      { _id: new ObjectId(roadmapId) },
      {
        $set: {
          "sections.$[section].concepts.$[concept].status": "current",
        },
      },
      {
        arrayFilters: [
          { "section._id": sectionId },
          { "concept._id": conceptId },
        ],
        returnDocument: "after",
      },
    );

    return JSON.parse(JSON.stringify(updatedRoadmap));
  } catch (err) {
    console.error("Error unlocking concept", err);
    throw err;
  }
}

export async function completeConcept({
  conceptId,
  sectionId,
  roadmapId,
}: {
  conceptId: string;
  sectionId: string;
  roadmapId: string;
}) {
  try {
      console.log('Completing concept...')
    const client = await clientPromise;
    const db = client.db("prod");
    const roadmapCol = db.collection<Roadmap>("roadmaps");

    const updatedRoadmap = await roadmapCol.findOneAndUpdate(
      { _id: new ObjectId(roadmapId) },
      {
        $set: {
          "sections.$[section].concepts.$[concept].status": "completed",
        },
      },
      {
        arrayFilters: [
          { "section._id": sectionId },
          { "concept._id": conceptId },
        ],
        returnDocument: "after",
      },
    );
    return JSON.parse(JSON.stringify(updatedRoadmap));
  } catch (err) {
    console.error("Error unlocking concept", err);
    throw err;
  }
}


export async function unlockSection({roadmapId, sectionId}:{roadmapId: string, sectionId: string}){
    try{
        const client = await clientPromise
        const db = client.db('prod')
        const roadmapsCol = db.collection<Roadmap>('roadmaps')

        await roadmapsCol.findOneAndUpdate({_id: new ObjectId(roadmapId)}, {
            $set: {
                "sections.$[section].status": 'current'
            }
        }, {arrayFilters: [
                {'section._id': sectionId}
            ]})

        revalidatePath(`/dashboard/roadmaps/${roadmapId}`)
    }catch (err){
        console.error(`Error unlocking section: ${err}`)
        throw err
    }
}