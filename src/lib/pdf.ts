import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

type Finding = {
  title: string
  description: string
  severity: string
  category?: string | null
  file?: string | null
  lineNumber?: number | null
  remediation?: string | null
}

type AuditReport = {
  id: string
  projectName: string
  size: string
  status: string
  overallSeverity: string | null
  findingsCount: number
  duration: string | null
  completedAt: Date | null
  createdAt: Date
  project?: { name: string; description?: string | null }
  findings: Finding[]
}

export async function generateAuditPdf(audit: AuditReport): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  let page = doc.addPage()
  let { width, height } = page.getSize()

  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const margin = 48
  // Derive current max line width from the active page width
  const getMaxWidth = () => width - margin * 2
  let cursorY = height - margin

  const drawText = (text: string, opts?: { size?: number; color?: { r: number; g: number; b: number }; bold?: boolean }) => {
    const size = opts?.size ?? 12
    const color = opts?.color ? rgb(opts.color.r, opts.color.g, opts.color.b) : rgb(0, 0, 0)
    const usedFont = opts?.bold ? fontBold : font
    page.drawText(text, { x: margin, y: cursorY - size, size, font: usedFont, color })
    cursorY -= size + 6
  }

  const wrapText = (text: string, size: number, usedFont = font, availableWidth = getMaxWidth()) => {
    const words = text.split(/\s+/)
    const lines: string[] = []
    let line = ''
    for (const word of words) {
      const tryLine = line ? `${line} ${word}` : word
      const width = usedFont.widthOfTextAtSize(tryLine, size)
      if (width > availableWidth) {
        if (line) lines.push(line)
        line = word
      } else {
        line = tryLine
      }
    }
    if (line) lines.push(line)
    return lines
  }

  const ensureSpace = (needed: number) => {
    if (cursorY - needed < margin) {
      page = doc.addPage()
      const size = page.getSize()
      width = size.width
      height = size.height
      cursorY = height - margin
    }
  }

  // Header
  page.drawRectangle({ x: 0, y: height - 28, width, height: 28, color: rgb(0.96, 0.96, 0.98) })
  page.drawText('Audit Report', { x: margin, y: height - 20, size: 14, font: fontBold, color: rgb(0.12, 0.12, 0.16) })

  cursorY -= 24
  drawText(`Project: ${audit.projectName}`, { size: 16, bold: true })
  if (audit.project?.description) {
    const descLines = wrapText(audit.project.description, 11)
    for (const line of descLines) {
      ensureSpace(18)
      page.drawText(line, { x: margin, y: cursorY - 11, size: 11, font })
      cursorY -= 15
    }
  }

  // Metadata
  const meta: string[] = [
    `Audit ID: ${audit.id}`,
    `Size: ${audit.size}`,
    `Status: ${audit.status}`,
    `Overall Severity: ${audit.overallSeverity ?? 'N/A'}`,
    `Findings: ${audit.findingsCount}`,
    `Duration: ${audit.duration ?? 'N/A'}`,
    `Started: ${new Date(audit.createdAt).toLocaleString()}`,
    `Completed: ${audit.completedAt ? new Date(audit.completedAt).toLocaleString() : 'N/A'}`,
  ]

  ensureSpace(20)
  drawText('Summary', { size: 14, bold: true })
  for (const item of meta) {
    ensureSpace(18)
    page.drawText(item, { x: margin, y: cursorY - 12, size: 12, font })
    cursorY -= 16
  }

  // Findings
  ensureSpace(24)
  drawText(`Findings (${audit.findings.length})`, { size: 14, bold: true })

  if (audit.findings.length === 0) {
    ensureSpace(16)
    page.drawText('No findings recorded for this audit.', { x: margin, y: cursorY - 12, size: 12, font })
    cursorY -= 18
  } else {
    const label = (t: string) => t
    let idx = 1
    for (const f of audit.findings) {
      ensureSpace(22)
      page.drawText(`${idx}. ${f.title}`, { x: margin, y: cursorY - 13, size: 13, font: fontBold })
      cursorY -= 18

      const pairs: Array<[string, string]> = [
        ['Severity', f.severity],
        ['Category', f.category ?? 'N/A'],
      ]
      for (const [k, v] of pairs) {
        ensureSpace(16)
        page.drawText(`${label(k)}: ${v}`, { x: margin + 8, y: cursorY - 11, size: 11, font })
        cursorY -= 14
      }

      // Location: {path:line} (wrapped)
      {
        const loc = f.file
          ? `${f.file}${f.lineNumber != null ? ':' + f.lineNumber : ''}`
          : (f.lineNumber != null ? `:${f.lineNumber}` : 'N/A')
        ensureSpace(16)
        page.drawText('Location:', { x: margin + 8, y: cursorY - 11, size: 11, font: fontBold })
        cursorY -= 14
  const locLines = wrapText(loc, 11, font, getMaxWidth() - 12)
        for (const line of locLines) {
          ensureSpace(14)
          page.drawText(line, { x: margin + 12, y: cursorY - 11, size: 11, font })
          cursorY -= 14
        }
      }

      if (f.description) {
        ensureSpace(16)
        page.drawText('Description:', { x: margin + 8, y: cursorY - 11, size: 11, font: fontBold })
        cursorY -= 14
        const descLines = wrapText(f.description, 11)
        for (const line of descLines) {
          ensureSpace(14)
          page.drawText(line, { x: margin + 12, y: cursorY - 11, size: 11, font })
          cursorY -= 14
        }
      }

      if (f.remediation) {
        ensureSpace(16)
        page.drawText('Remediation:', { x: margin + 8, y: cursorY - 11, size: 11, font: fontBold })
        cursorY -= 14
        const remLines = wrapText(f.remediation, 11)
        for (const line of remLines) {
          ensureSpace(14)
          page.drawText(line, { x: margin + 12, y: cursorY - 11, size: 11, font })
          cursorY -= 14
        }
      }

      cursorY -= 6
      idx++
    }
  }

  return await doc.save()
}
