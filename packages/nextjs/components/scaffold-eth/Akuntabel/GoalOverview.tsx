export function GoalOverview({
  description,
  completed,
  fundsReleased,
}: {
  description: string;
  completed: boolean;
  fundsReleased: boolean;
}) {
  return (
    <section>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>Completed:</strong> {completed ? "Yes" : "No"}
      </p>
      <p>
        <strong>Funds Released:</strong> {fundsReleased ? "Yes" : "No"}
      </p>
    </section>
  );
}
