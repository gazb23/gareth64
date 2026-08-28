import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { siteContent } from "../src/content/site";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const outputDirectory = join(projectRoot, "output", "pdf");
const outputPath = join(outputDirectory, siteContent.resume.fileName);
const publicPath = join(projectRoot, "public", siteContent.resume.fileName);
const scratchDirectory = mkdtempSync(join(tmpdir(), "gareth64-resume-"));
const contentPath = join(scratchDirectory, "site-content.json");
const venvPython = join(projectRoot, ".venv", "bin", "python3");
const python = process.env.CODEX_PDF_PYTHON ?? (existsSync(venvPython) ? venvPython : "python3");

mkdirSync(outputDirectory, { recursive: true });
mkdirSync(dirname(publicPath), { recursive: true });
writeFileSync(contentPath, JSON.stringify(siteContent), "utf8");

try {
  const result = spawnSync(
    python,
    [join(scriptDirectory, "build-resume-pdf.py"), "--content", contentPath, "--output", outputPath],
    { cwd: projectRoot, encoding: "utf8" },
  );

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`PDF builder exited with status ${result.status ?? "unknown"}.`);
  }

  copyFileSync(outputPath, publicPath);
  console.log(`Copied downloadable resume to ${publicPath}`);
} finally {
  rmSync(scratchDirectory, { recursive: true, force: true });
}
