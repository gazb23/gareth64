from __future__ import annotations

import argparse
import json
from html import escape
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak

INK = colors.HexColor("#1B252D")
MUTED = colors.HexColor("#52616A")
ACCENT = colors.HexColor("#315E58")
styles = {
    'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=26, leading=30, textColor=INK, spaceAfter=5),
    'headline': ParagraphStyle('headline', fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=ACCENT, spaceAfter=6),
    'contact': ParagraphStyle('contact', fontName='Helvetica', fontSize=9.3, leading=13, textColor=MUTED, spaceAfter=10),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10.8, leading=14.5, textColor=INK, spaceAfter=5),
    'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=ACCENT, spaceBefore=7, spaceAfter=5, keepWithNext=True),
    'role': ParagraphStyle('role', fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=INK, spaceAfter=3, keepWithNext=True),
    'meta': ParagraphStyle('meta', fontName='Helvetica', fontSize=9.3, leading=13, textColor=MUTED, spaceAfter=4, keepWithNext=True),
    'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=10.8, leading=14.5, textColor=INK, leftIndent=10, bulletIndent=0, spaceAfter=4),
    'continued': ParagraphStyle('continued', fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=INK, spaceAfter=6, keepWithNext=True),
}

def para(text, style="body"):
    return Paragraph(escape(text), styles[style])


def bullet(text):
    return Paragraph(escape(text), styles["bullet"], bulletText="-")


def section(group):
    return [para(group["title"], "section"), *(bullet(text) for text in group["bullets"])]


def footer(canvas, document):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D6DEDC"))
    canvas.setLineWidth(.5)
    canvas.line(17 * mm, 14 * mm, A4[0] - 17 * mm, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(17 * mm, 10 * mm, "Gareth Beall | garethbeall.com")
    canvas.drawRightString(A4[0] - 17 * mm, 10 * mm, f"{document.page} / 2")
    canvas.restoreState()


def build_resume(content, output_path):
    resume = content["resume"]
    primary, *independent = resume["experience"]
    sections = resume["engineeringSections"]
    links = content["links"]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(output_path), pagesize=A4,
        leftMargin=17 * mm, rightMargin=17 * mm,
        topMargin=15 * mm, bottomMargin=20 * mm,
        title=f"{content['name']} - Lead AI/ML Engineer Resume",
        author=content["name"], subject=resume["headline"],
        invariant=1,
    )
    contact = (
        f'<link href="{escape(links["site"])}" color="#315E58"><b>garethbeall.com</b></link>'
        f' &nbsp; | &nbsp; <link href="mailto:{escape(content["email"])}">{escape(content["email"])}</link>'
        f'<br/>{escape(content["location"])} &nbsp; | &nbsp; '
        f'<link href="{escape(links["linkedin"])}">LinkedIn</link> &nbsp; | &nbsp; '
        f'<link href="{escape(links["github"])}">github.com/gazb23</link>'
    )
    story = [
        para(content["name"], "name"),
        para(resume["headline"], "headline"),
        Paragraph(contact, styles["contact"]),
        para(resume["profile"]),
        para("Experience", "section"),
        para(f'{primary["role"]} | {primary["organisation"]}', "role"),
        para(f'{primary["period"]} | {primary["location"]}', "meta"),
        para(primary["highlights"][0]),
        *(bullet(text) for text in primary["highlights"][1:]),
    ]
    for group in sections[:3]:
        story.extend(section(group))
    story.extend([
        PageBreak(), para(content["name"], "continued"),
        para("IRIS engineering | Queensland Health | Continued", "meta"),
    ])
    for group in sections[3:]:
        story.extend(section(group))
    story.append(para("Independent work", "section"))
    for job in independent:
        if job["organisation"] == "Independent projects":
            story.append(para(f'{job["role"]} | {job["period"]}', "role"))
        else:
            story.extend([
                para(f'{job["role"]} | {job["organisation"]}', "role"),
                para(job["period"], "meta"),
            ])
        story.extend(bullet(text) for text in job["highlights"])
    story.append(para("Technical experience", "section"))
    for title, description in resume["capabilities"]:
        story.append(Paragraph(f'<b>{escape(title)}:</b> {escape(description)}', styles["body"]))
    education = resume["education"]
    story.extend([
        para("Clinical background and education", "section"),
        para(resume["clinicalBackground"]),
        para(f'{education["qualification"]} | {education["institution"]} | {education["year"]}'),
    ])
    document.build(story, onFirstPage=footer, onLaterPages=footer)
    pages = PdfReader(output_path).pages
    if len(pages) != 2:
        raise ValueError(f"Expected a two-page resume, got {len(pages)}; review the layout before publishing.")
    print(f"Built {output_path} ({len(pages)} pages)")


def main():
    parser = argparse.ArgumentParser(description="Build the public resume from canonical site content.")
    parser.add_argument("--content", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    build_resume(json.loads(args.content.read_text()), args.output)


if __name__ == "__main__":
    main()
