import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="mx-auto w-full max-w-[40rem] px-5 py-[clamp(3rem,8vw,6rem)]">
      <h1>Page not found</h1>
      <p lang="es">Página no encontrada.</p>
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
