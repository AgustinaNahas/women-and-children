import Link from "next/link";
import { basePath } from "@/lib/site";

const redirectScript = `var lang=(navigator.language||"").toLowerCase();var next=lang.indexOf("es")===0?"/es/":"/en/";location.replace(${JSON.stringify(basePath)}+next);`;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[40rem] flex-col justify-center gap-4 px-5">
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <h1 className="font-script text-5xl font-normal text-thread">Women and children</h1>
      <p>
        <Link href="/en" hrefLang="en" lang="en">
          English
        </Link>
        {" · "}
        <Link href="/es" hrefLang="es" lang="es">
          Español
        </Link>
      </p>
    </main>
  );
}
