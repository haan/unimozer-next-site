import { useState } from "react";
import featureJavaEditor from "../assets/screenshots/feature-java-editor.svg";
import featureObjectBench from "../assets/screenshots/feature-object-bench.svg";
import featureStructogram from "../assets/screenshots/feature-structogram.svg";
import featureUmlDiagram from "../assets/screenshots/feature-uml-diagram.svg";

interface Slide {
  title: string;
  caption: string;
  src: string;
  alt: string;
}

const slides: Slide[] = [
  {
    title: "UML-to-code connection",
    caption:
      "Students can design classes visually and immediately see how structure maps to Java source.",
    src: featureUmlDiagram,
    alt: "Placeholder screenshot showing the UML class diagram workspace in Unimozer Next.",
  },
  {
    title: "Java editor in context",
    caption:
      "Teachers can discuss syntax and design choices while keeping the diagram and code workflows aligned.",
    src: featureJavaEditor,
    alt: "Placeholder screenshot showing Java source editor panels in Unimozer Next.",
  },
  {
    title: "Structogram guidance",
    caption:
      "Algorithm flow can be taught with a structured visual representation before or during code writing.",
    src: featureStructogram,
    alt: "Placeholder screenshot showing structogram view used for algorithm planning.",
  },
  {
    title: "Object bench experiments",
    caption:
      "Learners can instantiate classes and call methods quickly to understand runtime behavior.",
    src: featureObjectBench,
    alt: "Placeholder screenshot showing object bench and method call interactions.",
  },
];

export function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  const showPrevious = () => {
    setCurrentIndex((index) => (index === 0 ? slides.length - 1 : index - 1));
  };

  const showNext = () => {
    setCurrentIndex((index) => (index === slides.length - 1 ? 0 : index + 1));
  };

  return (
    <section className="section-wrap">
      <div className="card">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Screenshots</p>
            <h2 className="section-title mt-2">Feature Highlights</h2>
            <p className="section-subtitle mt-2">
              Practical screenshots focused on classroom workflows.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Show previous feature screenshot"
              className="btn-secondary"
              onClick={showPrevious}
              type="button"
            >
              Previous
            </button>
            <button
              aria-label="Show next feature screenshot"
              className="btn-secondary"
              onClick={showNext}
              type="button"
            >
              Next
            </button>
          </div>
        </div>

        <div
          aria-label="Feature screenshot carousel"
          className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-card-strong)]"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              showPrevious();
            }
            if (event.key === "ArrowRight") {
              showNext();
            }
          }}
          role="region"
          tabIndex={0}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <figure
                className="min-w-full"
                key={slide.title}
              >
                <img
                  alt={slide.alt}
                  className="h-auto w-full"
                  loading="lazy"
                  src={slide.src}
                />
                <figcaption className="border-t border-[var(--border-soft)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {slide.title}:
                  </span>{" "}
                  {slide.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <p
          aria-live="polite"
          className="mt-4 text-sm text-[var(--text-secondary)]"
        >
          {currentIndex + 1} / {slides.length} -{" "}
          {currentSlide?.title ?? "Feature preview"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {slides.map((slide, index) => (
            <button
              aria-label={`Jump to slide ${index + 1}: ${slide.title}`}
              className={`h-2.5 w-8 rounded-full border ${
                index === currentIndex
                  ? "border-[var(--accent)] bg-[var(--accent)]"
                  : "border-[var(--border-soft)] bg-[var(--bg-card)]"
              }`}
              key={slide.title}
              onClick={() => setCurrentIndex(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
