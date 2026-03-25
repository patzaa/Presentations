import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const { markdown, filename } = await request.json();

    // Use /tmp on Vercel (read-only filesystem), output/ locally
    const isVercel = !!process.env.VERCEL;
    const outDir = isVercel ? "/tmp" : join(process.cwd(), "output");
    await mkdir(outDir, { recursive: true });

    const filePath = join(outDir, filename);
    await writeFile(filePath, markdown, "utf-8");

    return Response.json({ ok: true, path: filePath });
  } catch (err) {
    console.error("Save error:", err);
    return Response.json({ error: "Failed to save" }, { status: 500 });
  }
}
