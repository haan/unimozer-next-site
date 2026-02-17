import { useState } from "react";
import featureObjectBench from "../assets/screenshots/feature-object-bench.svg";
import featureStructogram from "../assets/screenshots/feature-structogram.svg";
import featureUmlDiagramFallback from "../assets/screenshots/feature-uml-diagram.jpg";
import featureUmlDiagram from "../assets/screenshots/feature-uml-diagram.webp";
import featureWizardFallback from "../assets/screenshots/feature-wizard.jpg";
import featureWizard from "../assets/screenshots/feature-wizard.webp";

interface Slide {
  title: string;
  caption: string;
  src: string;
  webpSrc?: string;
  alt: string;
}

const slides: Slide[] = [
  {
    title: "Large UML Diagram Overview",
    caption:
      "This view shows the class structure on one canvas, making relationships and responsibilities easy to discuss before editing code.",
    src: featureUmlDiagramFallback,
    webpSrc: featureUmlDiagram,
    alt: "Unimozer Next screenshot showing a large UML class diagram with linked classes including BouncyBall, HeavyBall, Ball, Balls, DrawPanel, and MainFrame.",
  },
  {
    title: "Guided Code Generation",
    caption:
      "Students can use built-in wizards to create classes, constructors, fields, and methods without memorizing Java syntax first.",
    src: featureWizardFallback,
    webpSrc: featureWizard,
    alt: "Unimozer Next screenshot showing a wizard that helps students generate Java class elements directly from guided form steps.",
  },
  {
    title: "Structogram Method View",
    caption:
      "Algorithms can be explained step by step using a visual structogram for the selected method.",
    src: featureStructogram,
    alt: "Unimozer Next screenshot showing the structogram view for method flow planning.",
  },
  {
    title: "Object Bench Interaction",
    caption:
      "Learners can create objects and call methods to observe runtime behavior directly.",
    src: featureObjectBench,
    alt: "Unimozer Next screenshot showing object bench interaction with object instances and method calls.",
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
              See how diagrams, code, and object interaction work together.
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
                {slide.webpSrc ? (
                  <picture>
                    <source
                      srcSet={slide.webpSrc}
                      type="image/webp"
                    />
                    <img
                      alt={slide.alt}
                      className="h-auto w-full"
                      loading="lazy"
                      src={slide.src}
                    />
                  </picture>
                ) : (
                  <img
                    alt={slide.alt}
                    className="h-auto w-full"
                    loading="lazy"
                    src={slide.src}
                  />
                )}
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
