import React from "react";

const PrivacySection = ({
  id,
  number,
  icon: Icon,
  title,
  children,
}) => {
  return (
    <article
      id={id}
      className="privacy-section scroll-mt-24 border-b border-white/[0.06] pb-12 pt-12 first:pt-0"
    >
      <div>
        <div className="mb-4 flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest text-white/30">
            {number}
          </span>

          <div className="h-px w-8 bg-white/10" />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
            <Icon size={16} className="text-white/70" />
          </div>

          <h2 className="font-serif text-xl font-medium sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>

      <div className="mt-6 max-w-[65ch] text-[14px] leading-7 text-white/60 sm:text-[15px]">
        {children}
      </div>
    </article>
  );
};

export const DataTerm = ({
  icon: Icon,
  term,
  text,
}) => (
  <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
    <dt className="flex items-center gap-2.5 text-sm font-medium text-white/85">
      <Icon size={14} className="text-[#c9a468]" />
      {term}
    </dt>

    <dd className="text-[13px] leading-6 text-white/50 sm:text-[14px]">
      {text}
    </dd>
  </div>
);

export const DataTermCompact = ({
  title,
  text,
}) => (
  <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
    <dt className="text-sm font-medium text-white/85">
      {title}
    </dt>

    <dd className="text-[13px] leading-6 text-white/50 sm:text-[14px]">
      {text}
    </dd>
  </div>
);

export const RightItem = ({
  letter,
  icon: Icon,
  title,
  text,
}) => (
  <li className="flex items-start gap-4 py-5">
    <span className="font-mono text-[11px] text-white/25">
      {letter}
    </span>

    <Icon
      size={15}
      className="mt-0.5 shrink-0 text-[#c9a468]"
    />

    <div>
      <div className="text-sm font-medium text-white/85">
        {title}
      </div>

      <p className="mt-1 text-[13px] leading-6 text-white/50">
        {text}
      </p>
    </div>
  </li>
);

export const BulletList = ({ items }) => (
  <div className="mt-6 space-y-2.5">
    {items.map((item) => (
      <div
        key={item}
        className="flex items-start gap-3"
      >
        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#c9a468]/70" />

        <span className="text-[14px]">
          {item}
        </span>
      </div>
    ))}
  </div>
);

export default PrivacySection;