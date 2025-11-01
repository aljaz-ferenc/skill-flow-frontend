const BASE_URL = process.env.BASE_URL;

if (!BASE_URL) throw new Error("BASE_URL missing in .env");

// biome-ignore lint/complexity/noStaticOnlyClass: explanation
export class Endpoints {
  public static lesson = `${BASE_URL}/lesson`;
  public static checkAnswer = `${BASE_URL}/check-answer`;
  public static generateRoadmap = `${BASE_URL}/generate-roadmap`;
  public static planLessons = `${BASE_URL}/plan-lessons`;
}
