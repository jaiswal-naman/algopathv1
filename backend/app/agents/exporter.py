"""
ExporterAgent - The Scribe
Converts LFA JSON data into downloadable documents (DOCX, CSV).
"""

import csv
import json
from io import StringIO, BytesIO
from typing import Dict, Any, List
# We'll need python-docx for Word documents
# pip install python-docx

class Exporter:
    """
    Handles export of LFA data to various formats.
    """

    def __init__(self):
        pass

    def generate_csv(self, lfa_data: Dict[str, Any]) -> str:
        """
        Convert LFA to CSV string.
        Structure: Level, Description, Indicators, Verification, Assumptions
        """
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(["Level", "Description", "Indicators", "Means of Verification", "Assumptions/Risks"])
        
        # Goal (Impact)
        goal = lfa_data.get("goal", "")
        writer.writerow(["Goal", goal, "", "", ""])

        # Outcomes
        for outcome in lfa_data.get("outcomes", []):
            desc = outcome.get("description", "")
            indicators = "; ".join(outcome.get("indicators", []))
            verification = "; ".join(outcome.get("verification_means", []))
            assumptions = "; ".join(outcome.get("assumptions", []))
            writer.writerow(["Outcome", desc, indicators, verification, assumptions])

        # Outputs
        for output_item in lfa_data.get("outputs", []):
            desc = output_item.get("description", "")
            indicators = "; ".join(output_item.get("indicators", []))
            verification = "; ".join(output_item.get("verification_means", []))
            assumptions = "; ".join(output_item.get("assumptions", []))
            writer.writerow(["Output", desc, indicators, verification, assumptions])

        # Activities
        for activity in lfa_data.get("activities", []):
            desc = activity.get("description", "")
            # Activities usually have inputs/costs instead of indicators, but mapping to LFA standard
            writer.writerow(["Activity", desc, "", "", ""])

        return output.getvalue()

    def generate_docx(self, lfa_data: Dict[str, Any], metadata: Dict[str, Any]) -> BytesIO:
        """
        Convert LFA to Word Document (BytesIO).
        """
        # Note: Requires 'python-docx' library. 
        # Since we might not have it installed yet, we'll return a placeholder or need to install it.
        # For now, I will assume we can install it.
        
        try:
            from docx import Document
            from docx.shared import Inches, Pt
            from docx.enum.table import WD_TABLE_ALIGNMENT
        except ImportError:
            raise ImportError("python-docx is needed for Word export.")

        document = Document()
        
        # Title
        title = metadata.get("title", "Logical Framework Matrix")
        document.add_heading(title, 0)

        # Metadata
        p = document.add_paragraph()
        p.add_run(f"Organization: {metadata.get('organization', 'N/A')}\n").bold = True
        p.add_run(f"Donor: {metadata.get('donor', 'N/A')}\n").bold = True
        p.add_run(f"Date: {metadata.get('date', 'N/A')}")
        
        document.add_heading('Logical Framework Matrix', level=1)

        # Table
        table = document.add_table(rows=1, cols=4)
        table.style = 'Table Grid'
        
        # Header Row
        hdr_cells = table.rows[0].cells
        hdr_cells[0].text = 'Project Description'
        hdr_cells[1].text = 'Indicators'
        hdr_cells[2].text = 'Means of Verification'
        hdr_cells[3].text = 'Assumptions'

        # Goal
        row = table.add_row().cells
        row[0].text = f"GOAL: {lfa_data.get('goal', '')}"
        
        # Outcomes
        for outcome in lfa_data.get("outcomes", []):
            row = table.add_row().cells
            row[0].text = f"OUTCOME: {outcome.get('description', '')}"
            row[1].text = "\n".join(outcome.get("indicators", []))
            row[2].text = "\n".join(outcome.get("verification_means", []))
            row[3].text = "\n".join(outcome.get("assumptions", []))

        # Outputs
        for output_item in lfa_data.get("outputs", []):
            row = table.add_row().cells
            row[0].text = f"OUTPUT: {output_item.get('description', '')}"
            row[1].text = "\n".join(output_item.get("indicators", []))
            row[2].text = "\n".join(output_item.get("verification_means", []))
            row[3].text = "\n".join(output_item.get("assumptions", []))

        # Activities
        for activity in lfa_data.get("activities", []):
            row = table.add_row().cells
            row[0].text = f"ACTIVITY: {activity.get('description', '')}"
        
        buffer = BytesIO()
        document.save(buffer)
        buffer.seek(0)
        return buffer
