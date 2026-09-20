import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import test from "node:test"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const script = join(root, "script/github/close-issues.ts")

function run(args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, options)
    let output = ""

    child.stdout.on("data", (chunk) => (output += chunk))
    child.stderr.on("data", (chunk) => (output += chunk))
    child.on("error", reject)
    child.on("close", (code) => resolve({ code, output }))
  })
}

test("does not close a stale issue unless it has the autoclose label", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "close-issues-test-"))
  const trace = join(dir, "trace.json")
  const preload = join(dir, "preload.mjs")

  t.after(() => rm(dir, { force: true, recursive: true }))

  await writeFile(
    preload,
    `
      import { writeFileSync } from "node:fs"

      const calls = []
      globalThis.fetch = async (input, init = {}) => {
        const url = String(input)
        const method = init.method ?? "GET"
        calls.push({ method, url })

        if (url.includes("/issues?")) {
          return Response.json([
            { number: 101, updated_at: "2020-01-01T00:00:00Z", labels: [{ name: "P0" }] },
            { number: 102, updated_at: "2020-01-01T00:00:00Z", labels: [{ name: "autoclose" }] },
            { number: 103, updated_at: "2999-01-01T00:00:00Z", labels: [{ name: "autoclose" }] }
          ])
        }

        if (url.endsWith("/comments") && method === "POST") return new Response("{}", { status: 201 })
        if (method === "PATCH") return new Response("{}", { status: 200 })
        throw new Error("Unexpected request: " + method + " " + url)
      }

      process.on("exit", () => writeFileSync(process.env.CLOSE_ISSUES_TRACE, JSON.stringify(calls)))
    `,
  )

  const result = await run(
    ["--experimental-strip-types", "--import", pathToFileURL(preload).href, script],
    {
      cwd: root,
      env: {
        ...process.env,
        CLOSE_ISSUES_TRACE: trace,
        GITHUB_REPOSITORY: "vepretski/7ya.io",
        GITHUB_TOKEN: "test-token",
        NODE_NO_WARNINGS: "1",
      },
    },
  )

  assert.equal(result.code, 0, result.output)
  assert.deepEqual(
    JSON.parse(await readFile(trace, "utf8"))
      .filter((call) => call.method === "PATCH")
      .map((call) => call.url),
    ["https://api.github.com/repos/vepretski/7ya.io/issues/102"],
  )
})
