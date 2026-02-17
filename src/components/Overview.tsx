const featureBullets = [
  "UML class diagram editor linked directly to code.",
  "Java source editor for classroom-friendly workflows.",
  "Structogram view for algorithm structure and planning.",
  "Object bench with direct method-call testing.",
  "Integrated compile and run console feedback.",
];

export function Overview() {
  return (
    <section
      className="section-wrap"
      id="overview"
    >
      <p className="section-kicker">Overview</p>
      <h2 className="section-title mt-2">What is Unimozer Next?</h2>
      <p className="section-subtitle">
        Unimozer Next helps you learn Java by connecting class diagrams, code,
        and program output in one place.
      </p>
      <ul className="mt-6 grid list-disc gap-x-8 gap-y-2 pl-5 text-sm text-[var(--text-secondary)] sm:grid-cols-2">
        {featureBullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
