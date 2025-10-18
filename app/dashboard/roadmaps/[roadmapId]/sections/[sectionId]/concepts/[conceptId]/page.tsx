import Lesson from "@/app/dashboard/roadmaps/[roadmapId]/sections/[sectionId]/concepts/[conceptId]/_components/Lesson";
import {
  generateLesson,
  getLessonsByConceptId,
  getRoadmap,
} from "@/lib/actions";

export default async function ConceptPage(
  props: PageProps<"/dashboard/roadmaps/[roadmapId]/sections/[sectionId]/concepts/[conceptId]">,
) {
  const { params } = props;
  const { conceptId, roadmapId, sectionId } = await params;

  // const lesson = await generateLesson({ roadmapId, conceptId, sectionId });
  const roadmap = await getRoadmap(roadmapId);
  const lessons = await getLessonsByConceptId(conceptId);
  console.log(lessons);
  const section = roadmap.sections.find((section) => section._id === sectionId);
  const concept = section?.concepts.find(
    (concept) => concept._id === conceptId,
  );

  if (!lessons.length && section && roadmap && concept) {
    await generateLesson({
      roadmapId,
      conceptId: concept._id,
      roadmapTitle: roadmap.topic,
      sectionTitle: section.title,
      conceptTitle: concept.title,
    });
  }

  return (
    <main className="h-screen flex flex-col">
      <Lesson lessons={lessons} />
    </main>
  );
}
