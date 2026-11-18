type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionHeading({ eyebrow, title, description, centered = false }: Props) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="heading-lg mt-5">{title}</h2>
      {description && <p className="muted mt-5 text-base leading-8">{description}</p>}
    </div>
  );
}
