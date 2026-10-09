import { publicPath } from "@/lib/site";

export function SoWhat({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <section id="so-what" className="overflow-x-clip bg-field px-5 py-[clamp(4.5rem,12vh,8rem)]" aria-labelledby="so-what-title">
      <div className="mx-auto w-full max-w-xl">
        <div className="relative mx-auto mb-[clamp(2rem,6vh,4.5rem)] mt-24 w-[min(100%,34rem)] rotate-[7deg]">
          <img src={publicPath("/puntilla.png")} alt="" className="pointer-events-none block h-auto w-[80%] mx-auto select-none" />
          <h2
            id="so-what-title"
            className="absolute inset-0 m-0 flex items-center justify-center px-[18%] pb-[4%] text-center font-script text-[clamp(2.6rem,9vw,5.4rem)] leading-none font-normal text-balance text-thread"
          >
            {title}
          </h2>
        </div>
        <div className="flex flex-col gap-6 text-[clamp(1.2rem,2vw,1.45rem)] mt-48 leading-snug">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
