import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { Roadmap } from "@/lib/types";

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
    return await db
      .collection("roadmaps")
      .findOne({ _id: new ObjectId(roadmapId) });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
