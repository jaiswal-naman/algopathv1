"""
VisualizerAgent - The Artist
Converts LFA documents into Mermaid.js diagram syntax.
"""

import re
from typing import Dict, Any, List
from ..graph.state import AgentState, WorkflowPhase


class GraphVisualizer:
    """
    Translator agent that converts LFA JSON into Mermaid.js diagrams.
    """

    def __init__(self):
        pass

    def _sanitize_text(self, text: str, max_length: int = 50) -> str:
        """Sanitize text for Mermaid diagram compatibility."""
        if not text:
            return "Untitled"

        # Replace double quotes with single quotes to prevent breaking Mermaid strings
        sanitized = text.replace('"', "'")
        
        # Remove newlines
        sanitized = sanitized.replace('\n', ' ').replace('\r', '')

        # Truncate if too long (keeping it readable)
        if len(sanitized) > max_length:
            sanitized = sanitized[:max_length-3] + "..."

        return sanitized.strip() or "Untitled"

    def _generate_flowchart(self, lfa: Dict[str, Any]) -> str:
        """Generate a top-down flowchart showing the LFA hierarchy."""
        lines = ["flowchart TD"]

        # Goal node
        goal_text = self._sanitize_text(lfa.get("goal", "Program Goal"))
        lines.append(f'    GOAL["{goal_text}"]')
        lines.append('    style GOAL fill:#1e40af,color:#fff,stroke:#1e3a8a')

        # Outcomes
        outcomes = lfa.get("outcomes", [])
        for i, outcome in enumerate(outcomes):
            oc_id = outcome.get("id", f"OC{i+1}")
            oc_text = self._sanitize_text(outcome.get("description", f"Outcome {i+1}"))
            lines.append(f'    {oc_id}["{oc_text}"]')
            lines.append(f'    style {oc_id} fill:#059669,color:#fff,stroke:#047857')
            lines.append(f'    GOAL --> {oc_id}')

            # Outputs for this outcome
            outputs = outcome.get("outputs", [])
            for j, output in enumerate(outputs):
                op_id = output.get("id", f"OP{i+1}_{j+1}").replace(".", "_")
                op_text = self._sanitize_text(output.get("description", f"Output {j+1}"))
                lines.append(f'    {op_id}["{op_text}"]')
                lines.append(f'    style {op_id} fill:#d97706,color:#fff,stroke:#b45309')
                lines.append(f'    {oc_id} --> {op_id}')

                # Activities for this output
                activities = output.get("activities", [])
                for k, activity in enumerate(activities):
                    act_id = activity.get("id", f"A{i+1}_{j+1}_{k+1}").replace(".", "_")
                    act_text = self._sanitize_text(activity.get("description", f"Activity {k+1}"), 40)
                    lines.append(f'    {act_id}["{act_text}"]')
                    lines.append(f'    style {act_id} fill:#7c3aed,color:#fff,stroke:#6d28d9')
                    lines.append(f'    {op_id} --> {act_id}')

        return "\n".join(lines)

    def _generate_mindmap(self, lfa: Dict[str, Any]) -> str:
        """Generate a mindmap visualization of the LFA."""
        lines = ["mindmap"]

        # Root (Goal)
        goal_text = self._sanitize_text(lfa.get("goal", "Program Goal"), 40)
        lines.append(f'  root(("{goal_text}"))')

        # Outcomes
        outcomes = lfa.get("outcomes", [])
        for outcome in outcomes:
            oc_text = self._sanitize_text(outcome.get("description", "Outcome"), 35)
            lines.append(f'    {oc_text}')

            # Outputs
            for output in outcome.get("outputs", []):
                op_text = self._sanitize_text(output.get("description", "Output"), 30)
                lines.append(f'      {op_text}')

                # Activities
                for activity in output.get("activities", []):
                    act_text = self._sanitize_text(activity.get("description", "Activity"), 25)
                    lines.append(f'        {act_text}')

        return "\n".join(lines)

    def _generate_lfa_table(self, lfa: Dict[str, Any]) -> str:
        """Generate a structured view as a journey diagram."""
        lines = ["journey"]
        lines.append(f'    title {self._sanitize_text(lfa.get("title", "LFA Journey"), 30)}')

        # Goal section
        lines.append("    section Goal")
        goal_text = self._sanitize_text(lfa.get("goal", "Achieve program goal"), 25)
        lines.append(f"      {goal_text}: 5")

        # Outcomes section
        outcomes = lfa.get("outcomes", [])
        for i, outcome in enumerate(outcomes):
            oc_text = self._sanitize_text(outcome.get("description", f"Outcome {i+1}"), 25)
            lines.append(f"    section {oc_text}")

            for output in outcome.get("outputs", []):
                op_text = self._sanitize_text(output.get("description", "Output"), 20)
                lines.append(f"      {op_text}: 4")

                for activity in output.get("activities", []):
                    act_text = self._sanitize_text(activity.get("description", "Activity"), 20)
                    lines.append(f"      {act_text}: 3")

        return "\n".join(lines)

    def process(self, state: AgentState) -> AgentState:
        """
        Convert LFA document to Mermaid.js syntax.

        Args:
            state: Current state with lfa_document

        Returns:
            Updated state with mermaid_code
        """
        lfa_document = state.get("lfa_document")

        if not lfa_document:
            state["error"] = "No LFA document available for visualization"
            return state

        try:
            # Generate flowchart (primary visualization)
            mermaid_code = self._generate_flowchart(lfa_document)

            state["mermaid_code"] = mermaid_code
            state["phase"] = WorkflowPhase.COMPLETED.value
            state["messages"] = state.get("messages", []) + [
                "Mermaid diagram generated successfully"
            ]

        except Exception as e:
            state["error"] = f"Visualization failed: {str(e)}"

        return state

    def generate_all_views(self, lfa_document: Dict[str, Any]) -> Dict[str, str]:
        """Generate all visualization types for the LFA."""
        return {
            "flowchart": self._generate_flowchart(lfa_document),
            "mindmap": self._generate_mindmap(lfa_document),
            "journey": self._generate_lfa_table(lfa_document)
        }

    async def aprocess(self, state: AgentState) -> AgentState:
        """Async version of process."""
        return self.process(state)
