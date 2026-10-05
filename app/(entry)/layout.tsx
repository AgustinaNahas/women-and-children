import { publicPath } from "@/lib/site";
import "../globals.css";

export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ ["--texture-field" as string]: `url("${publicPath("/tela-negra.jpg")}")` }}>
      <body className="bg-field font-text text-lg text-script">{children}</body>
    </html>
  );
}
