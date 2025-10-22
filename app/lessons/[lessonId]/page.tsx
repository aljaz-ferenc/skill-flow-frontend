export default async function Lesson(props: PageProps<"/lessons/[lessonId]">) {
  const { lessonId } = await props.params;

  return <div>lesson</div>;
}
