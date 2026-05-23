interface Props {
  items: string[];
  separator?: string;
}

export function Marquee({ items, separator = "✦" }: Props) {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-bone/10 bg-coal/40 py-5">
      <div className="mask-fade-r flex">
        <div className="flex shrink-0 animate-marquee gap-12 whitespace-nowrap pr-12">
          {loop.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-12 font-mono text-xs uppercase tracking-widest text-mist"
            >
              <span>{item}</span>
              <span className="text-brass/60">{separator}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
