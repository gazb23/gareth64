from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


PAPER = colors.HexColor("#F3F0E8")
INK = colors.HexColor("#171B19")
MOSS = colors.HexColor("#335E4A")
MID = colors.HexColor("#525C56")
HAIRLINE = colors.HexColor("#C8C9C0")
PALE_MOSS = colors.HexColor("#E4E9E2")
WHITE = colors.white


def escape(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def link(url: str, label: str, colour: str = "#335E4A") -> str:
    return f'<link href="{escape(url)}" color="{colour}">{escape(label)}</link>'


class ResumeDocument(BaseDocTemplate):
    def __init__(self, filename: str, *, title: str, author: str):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=17 * mm,
            rightMargin=17 * mm,
            topMargin=15 * mm,
            bottomMargin=15 * mm,
            title=title,
            author=author,
            subject="Professional resume for Gareth Beall, Lead AI/ML Engineer",
            creator="Gareth64 resume generator",
        )
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
            id="resume",
        )
        self.addPageTemplates(PageTemplate(id="resume", frames=[frame], onPage=self._decorate_page))

    def _decorate_page(self, canvas, document) -> None:
        width, height = A4
        canvas.saveState()
        canvas.setTitle(self.title)
        canvas.setAuthor(self.author)
        canvas.setSubject("Professional resume for Gareth Beall, Lead AI/ML Engineer")
        canvas.setKeywords("clinical AI, RAG, LLM, machine learning, pharmacist, retrieval, evaluation")
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, width, height, stroke=0, fill=1)
        canvas.setStrokeColor(MOSS)
        canvas.setLineWidth(1.6)
        canvas.line(self.leftMargin, height - 9 * mm, width - self.rightMargin, height - 9 * mm)
        canvas.setFont("Courier-Bold", 7)
        canvas.setFillColor(MOSS)
        canvas.drawString(self.leftMargin, 8 * mm, "GARETH64 / CAREER FILE")
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(MID)
        canvas.drawRightString(width - self.rightMargin, 8 * mm, f"PAGE {document.page:02d}")
        canvas.restoreState()


def make_styles() -> dict[str, ParagraphStyle]:
    sample = getSampleStyleSheet()
    return {
        "machine": ParagraphStyle(
            "Machine",
            parent=sample["Normal"],
            fontName="Courier-Bold",
            fontSize=7.5,
            leading=9,
            textColor=MOSS,
            spaceAfter=5,
        ),
        "band": ParagraphStyle(
            "Band",
            parent=sample["Normal"],
            fontName="Courier-Bold",
            fontSize=7.5,
            leading=9,
            textColor=WHITE,
            spaceAfter=0,
        ),
        "name": ParagraphStyle(
            "Name",
            parent=sample["Title"],
            fontName="Helvetica-Bold",
            fontSize=29,
            leading=30,
            textColor=INK,
            spaceAfter=4,
        ),
        "headline": ParagraphStyle(
            "Headline",
            parent=sample["Normal"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=MOSS,
            spaceAfter=7,
        ),
        "lead": ParagraphStyle(
            "Lead",
            parent=sample["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=14,
            textColor=INK,
            spaceAfter=7,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=sample["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=11,
            textColor=MID,
            spaceAfter=0,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=sample["Heading2"],
            fontName="Courier-Bold",
            fontSize=8,
            leading=10,
            textColor=MOSS,
            spaceBefore=8,
            spaceAfter=5,
            keepWithNext=True,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=sample["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=10.8,
            leading=13,
            textColor=INK,
            spaceAfter=1,
            keepWithNext=True,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=sample["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8,
            leading=10,
            textColor=MID,
            spaceAfter=4,
            keepWithNext=True,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=sample["Normal"],
            fontName="Helvetica",
            fontSize=8.35,
            leading=11.2,
            textColor=INK,
            leftIndent=10,
            firstLineIndent=-7,
            bulletIndent=0,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=sample["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11.5,
            textColor=INK,
            spaceAfter=4,
        ),
        "itemTitle": ParagraphStyle(
            "ItemTitle",
            parent=sample["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.6,
            leading=10.5,
            textColor=INK,
            spaceAfter=1,
        ),
        "itemText": ParagraphStyle(
            "ItemText",
            parent=sample["Normal"],
            fontName="Helvetica",
            fontSize=7.7,
            leading=10,
            textColor=MID,
        ),
        "rightMeta": ParagraphStyle(
            "RightMeta",
            parent=sample["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=MID,
            alignment=TA_RIGHT,
        ),
    }


def section_heading(label: str, styles: dict[str, ParagraphStyle]) -> Table:
    table = Table(
        [[Paragraph(escape(label.upper()), styles["section"]), ""]],
        colWidths=[47 * mm, 129 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LINEBELOW", (0, 0), (-1, -1), 0.55, HAIRLINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    return table


def experience_block(entry: dict[str, Any], styles: dict[str, ParagraphStyle]) -> list[Any]:
    title = f"{escape(entry['role'])} <font color='#525C56'>/ {escape(entry['organisation'])}</font>"
    parts: list[Any] = [
        Paragraph(title, styles["role"]),
        Paragraph(f"{escape(entry['period'])} | {escape(entry['location'])}", styles["meta"]),
    ]
    for highlight in entry["highlights"]:
        parts.append(Paragraph(escape(highlight), styles["bullet"], bulletText="-"))
    return parts


def build_resume(content: dict[str, Any], output_path: Path) -> None:
    styles = make_styles()
    resume = content["resume"]
    links = content["links"]
    output_path.parent.mkdir(parents=True, exist_ok=True)

    document = ResumeDocument(
        str(output_path),
        title=f"{content['name']} - {content['headline']} Resume",
        author=content["name"],
    )

    story: list[Any] = [
        Paragraph("GARETH64 / READY.", styles["machine"]),
        Paragraph(escape(content["name"]), styles["name"]),
        Paragraph(escape(content["headline"]), styles["headline"]),
        Paragraph(escape(content["differentiator"]), styles["lead"]),
        Paragraph(
            " &nbsp;|&nbsp; ".join(
                [
                    escape(content["location"]),
                    link(f"mailto:{content['email']}", content["email"]),
                    link(links["linkedin"], "LinkedIn"),
                    link(links["github"], "GitHub"),
                    link(links["site"], "Portfolio"),
                ]
            ),
            styles["contact"],
        ),
        Spacer(1, 6),
        section_heading("Profile", styles),
        Spacer(1, 5),
        Paragraph(escape(resume["profile"]), styles["body"]),
        section_heading("Experience", styles),
        Spacer(1, 6),
        *experience_block(resume["experience"][0], styles),
    ]

    for entry in resume["experience"][1:]:
        story.extend(experience_block(entry, styles))
        story.append(Spacer(1, 5))

    story.extend(
        [
            PageBreak(),
            section_heading("Selected system", styles),
            Spacer(1, 6),
            Paragraph(
                f"{escape(content['iris']['name'])} <font color='#525C56'>/ {escape(content['iris']['label'])}</font>",
                styles["role"],
            ),
            Paragraph(escape(content["iris"]["summary"]), styles["body"]),
        ]
    )

    chapter_rows = []
    for title, text in content["iris"]["chapters"]:
        chapter_rows.append(
            [
                Paragraph(escape(title.upper()), styles["machine"]),
                Paragraph(escape(text), styles["itemText"]),
            ]
        )
    chapter_table = Table(chapter_rows, colWidths=[30 * mm, 146 * mm])
    chapter_table.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, -2), 0.35, HAIRLINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 3.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
            ]
        )
    )

    story.extend([chapter_table, section_heading("Capabilities", styles), Spacer(1, 6)])
    capability_rows = []
    for title, text in resume["capabilities"]:
        capability_rows.append(
            [
                Paragraph(escape(title), styles["itemTitle"]),
                Paragraph(escape(text), styles["itemText"]),
            ]
        )
    capability_table = Table(capability_rows, colWidths=[38 * mm, 138 * mm])
    capability_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE_MOSS),
                ("BOX", (0, 0), (-1, -1), 0.5, HAIRLINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, HAIRLINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.extend([capability_table, Spacer(1, 4), section_heading("Selected product work", styles), Spacer(1, 6)])

    product_cells = []
    for product in content["products"]:
        product_cells.append(
            [
                Paragraph(link(product["href"], product["name"]), styles["itemTitle"]),
                Paragraph(escape(product["role"]), styles["meta"]),
                Paragraph(escape(product["description"]), styles["itemText"]),
            ]
        )
    # Lay products out two per row so any count fits the page width.
    per_row = 2
    cell_width = 176 / per_row
    product_rows = [product_cells[i : i + per_row] for i in range(0, len(product_cells), per_row)]
    if len(product_rows[-1]) < per_row:
        product_rows[-1].extend([""] * (per_row - len(product_rows[-1])))
    product_table = Table(product_rows, colWidths=[cell_width * mm] * per_row)
    product_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOX", (0, 0), (-1, -1), 0.5, HAIRLINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, HAIRLINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.extend([product_table, Spacer(1, 4), section_heading("Education", styles), Spacer(1, 6)])

    education = resume["education"]
    education_table = Table(
        [
            [
                Paragraph(
                    f"{escape(education['qualification'])}<br/><font color='#525C56'>{escape(education['institution'])}</font>",
                    styles["itemTitle"],
                ),
                Paragraph(escape(education["year"]), styles["rightMeta"]),
            ]
        ],
        colWidths=[146 * mm, 30 * mm],
    )
    education_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.extend([education_table, Spacer(1, 8)])
    interactive_note = (
        f'THIS RESUME RUNS AS A PLAYABLE COMMODORE 64 AT {link(links["site"], "GARETHBEALL.COM", "#FFFFFF")}. '
        "LOAD A TAPE, ASK THE AI ANYTHING."
    )
    story.append(
        Table(
            [[Paragraph(interactive_note, styles["band"])]],
            colWidths=[176 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), MOSS),
                    ("TEXTCOLOR", (0, 0), (-1, -1), WHITE),
                    ("LEFTPADDING", (0, 0), (-1, -1), 9),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            ),
        )
    )

    document.build(story)
    print(f"Built {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the Gareth64 PDF resume from canonical site content.")
    parser.add_argument("--content", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    arguments = parser.parse_args()

    with arguments.content.open("r", encoding="utf-8") as stream:
        content = json.load(stream)
    build_resume(content, arguments.output)


if __name__ == "__main__":
    main()
