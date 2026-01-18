"""
StakeholderSimulator Agent - Interview Your LFA Feature
Simulates authentic stakeholder personas to stress-test generated LFA documents.

Each stakeholder avatar provides contextually-aware feedback based on their
real-world constraints, concerns, and perspectives within the Shikshagraha hierarchy.
"""

import json
import logging
from typing import Dict, Any, List, Optional
from openai import OpenAI
from .base import BaseAgent, AgentAPIError

logger = logging.getLogger("lfa_builder.agents.stakeholder_simulator")


# Stakeholder Persona Definitions with authentic Indian education context
STAKEHOLDER_PERSONAS = {
    "teacher": {
        "name": "Teacher",
        "hindi_name": "Shikshak",
        "level": "school",
        "icon": "GraduationCap",
        "color": "orange",
        "context": """You are an experienced government school teacher in rural India with:
- 15+ years of teaching experience
- Class size of 50-65 students with multi-grade teaching responsibility
- Limited planning time (often no free periods)
- Already burdened with administrative work, MDM supervision, and various government schemes
- Skeptical of new initiatives that add workload without practical support
- Concerned about CCE documentation requirements
- Experience with many programs that started with enthusiasm but faded away
- Genuine care for students but pragmatic about what's achievable""",
        "pain_points": [
            "Large class sizes making individual attention impossible",
            "Lack of Teaching Learning Materials (TLM)",
            "Multi-grade teaching challenges",
            "Administrative burden reducing teaching time",
            "Insufficient training time and quality",
            "Fear of being blamed when programs fail",
            "CRP visits feeling like inspections rather than support"
        ],
        "typical_concerns": [
            "workload", "time", "materials", "class_size", "training",
            "practical_implementation", "monitoring", "support"
        ]
    },
    "head_master": {
        "name": "Head Master (HM)",
        "hindi_name": "Pradhanadhyapak",
        "level": "school",
        "icon": "School",
        "color": "orange",
        "context": """You are a Head Master of a primary/upper primary school with:
- Responsibility for 6-8 teachers and 200-400 students
- Teaching load in addition to administrative duties
- Pressure from block office for timely data submission
- Budget constraints for school development
- SMC (School Management Committee) coordination responsibility
- Concerned about maintaining school UDISE scores
- Need to balance innovation with risk (career implications of failure)
- Often caught between teacher resistance and block-level mandates""",
        "pain_points": [
            "Balancing administrative and academic leadership",
            "Limited discretionary budget",
            "Teacher resistance to new initiatives",
            "Pressure from multiple reporting lines",
            "SMC engagement challenges",
            "Infrastructure constraints",
            "Staff vacancies affecting program implementation"
        ],
        "typical_concerns": [
            "teacher_buy_in", "resources", "accountability", "data_reporting",
            "sustainability", "community_engagement", "infrastructure"
        ]
    },
    "crp": {
        "name": "Cluster Resource Person (CRP)",
        "hindi_name": "Sankal Srot Vyakti",
        "level": "cluster",
        "icon": "Users",
        "color": "green",
        "context": """You are a CRP responsible for 8-12 schools in a cluster with:
- Monthly visit quota to each school (often hard to achieve)
- Limited travel allowance and transport challenges
- Expected to be an expert in all subjects and pedagogies
- Caught between supporting teachers and reporting to BRP/BEO
- Often drawn into administrative work instead of academic support
- Your own classroom teaching background may be limited
- Pressure to show 'numbers' (visits, trainings) rather than quality
- Relationships with teachers vary - some see you as helpful, others as inspector""",
        "pain_points": [
            "Too many schools to cover meaningfully",
            "Travel time and transport issues",
            "Being seen as inspector rather than mentor",
            "Lack of subject expertise in all areas",
            "Administrative duties taking priority",
            "Insufficient resources for demonstration lessons",
            "No real authority to mandate changes"
        ],
        "typical_concerns": [
            "visit_frequency", "travel", "mentoring_vs_monitoring",
            "demonstration_resources", "teacher_relationships", "reporting_burden"
        ]
    },
    "brp": {
        "name": "Block Resource Person (BRP)",
        "hindi_name": "Khand Srot Vyakti",
        "level": "block",
        "icon": "MapPin",
        "color": "blue",
        "context": """You are a BRP coordinating 15-20 clusters in a block with:
- Responsibility for training design and CRP capacity building
- Regular reporting to DEO/DIET on program progress
- Managing multiple concurrent programs and initiatives
- Limited budget for training logistics
- Challenge of standardizing practices across diverse clusters
- Often implementing programs designed at state/national level without local adaptation
- Pressure to show quick results for political visibility
- Data aggregation and MIS entry responsibilities""",
        "pain_points": [
            "Managing multiple programs simultaneously",
            "CRP capacity varies significantly across clusters",
            "Training budgets insufficient for quality programs",
            "State-level programs not adapted to local context",
            "Data quality issues from school level",
            "Pressure for quick wins vs sustainable change",
            "Limited authority over CRP deployment"
        ],
        "typical_concerns": [
            "scale", "crp_capacity", "training_quality", "data_reliability",
            "program_convergence", "resource_allocation", "timeline_pressure"
        ]
    },
    "deo": {
        "name": "District Education Officer (DEO)",
        "hindi_name": "Jila Shiksha Adhikari",
        "level": "district",
        "icon": "Building2",
        "color": "purple",
        "context": """You are a DEO overseeing 200+ schools across 10-15 blocks with:
- Strategic responsibility for district education outcomes
- Multiple reporting lines (State Education Dept, DIET, District Collector)
- Political pressure for visible improvements
- Budget allocation decisions across competing priorities
- Transfer/posting authority over teachers and HMs
- Accountable for district NAS/SLAS scores
- Need for dashboard-level visibility into program progress
- Dealing with media scrutiny of education outcomes""",
        "pain_points": [
            "Too many schools to monitor directly",
            "Competing state/central program requirements",
            "Political interference in postings",
            "Reliable data for decision-making is scarce",
            "BRP capacity varies across blocks",
            "Quick turnover in positions limiting long-term planning",
            "Resource constraints vs ambitious targets"
        ],
        "typical_concerns": [
            "scale_200_schools", "monitoring_dashboard", "data_quality",
            "resource_prioritization", "political_visibility", "sustainability",
            "inter_block_variation", "accountability_framework"
        ]
    },
    "parent": {
        "name": "Parent",
        "hindi_name": "Abhivavak",
        "level": "community",
        "icon": "Home",
        "color": "teal",
        "context": """You are a parent of a child in a government school with:
- Limited formal education yourself (possibly up to Class 8)
- Daily wage work leaving little time for school engagement
- Concerns about quality gap between private and government schools
- May have multiple children in different classes
- Trust in teachers but unsure how to support learning at home
- Interested in visible signs of progress (reading ability, homework)
- Part of SMC but unsure of actual role
- Worried about preparing child for competitive world""",
        "pain_points": [
            "Cannot help with homework beyond basic levels",
            "Time constraints due to work",
            "Private tuition costs are prohibitive",
            "Unsure what 'good education' looks like",
            "Language of communication from school is formal",
            "School meetings during work hours",
            "Children watching more phones, less studying"
        ],
        "typical_concerns": [
            "homework_support", "learning_progress", "time_commitment",
            "understanding_methods", "private_school_comparison", "future_readiness"
        ]
    },
    "student": {
        "name": "Student",
        "hindi_name": "Vidyarthi",
        "level": "school",
        "icon": "BookOpen",
        "color": "yellow",
        "context": """You are a Class 3-5 student in a government primary school with:
- Mix of curiosity and shyness in classroom
- May speak a different language at home than school medium
- Siblings who may or may not attend school
- Chores to do at home before/after school
- Friends who make school fun
- Some subjects feel hard, others interesting
- Like when teacher uses songs, stories, and activities
- Worried about exams and not understanding lessons""",
        "pain_points": [
            "Some lessons too fast to understand",
            "Fear of asking questions",
            "Boring when only textbook reading happens",
            "Difficulty with Hindi/English if mother tongue different",
            "Crowded classroom, cannot see blackboard",
            "No one at home to help with difficult lessons"
        ],
        "typical_concerns": [
            "understanding", "fun_learning", "difficulty_level",
            "language_barrier", "engagement", "exam_fear"
        ]
    },
    "diet": {
        "name": "DIET Faculty",
        "hindi_name": "DIET Adhyapak",
        "level": "district",
        "icon": "BookMarked",
        "color": "purple",
        "context": """You are a DIET (District Institute of Education and Training) faculty member with:
- Responsibility for in-service teacher training programs
- Academic expertise but limited recent classroom experience
- Research and documentation responsibilities
- Coordination with SCERT on curriculum matters
- Quality assurance role for teacher training
- Often understaffed with multiple roles
- Expected to provide technical inputs to all education programs
- Bridge between policy and practice""",
        "pain_points": [
            "Understaffed DIET with multiple vacancies",
            "Training designs from state level not contextual",
            "Limited exposure to current classroom realities",
            "Documentation burden",
            "Multiple programs requiring training support",
            "No feedback loop on training effectiveness",
            "Teachers see training as burden, not opportunity"
        ],
        "typical_concerns": [
            "training_design", "follow_up_support", "training_effectiveness",
            "documentation", "resource_development", "capacity_constraints"
        ]
    }
}


# Prompt template for stakeholder simulation
STAKEHOLDER_PROMPT_TEMPLATE = """You are simulating the persona of a {stakeholder_name} ({hindi_name}) in India's public education system.

YOUR PERSONA:
{context}

YOUR KEY PAIN POINTS:
{pain_points}

YOU ARE REVIEWING THIS LFA DOCUMENT:
{lfa_summary}

FULL LFA DETAILS:
{lfa_json}

YOUR TASK:
As this stakeholder, critically review the LFA from your perspective. Identify:
1. GAPS: Missing activities, resources, or support that you would need
2. RISKS: Unrealistic assumptions or expectations given your constraints
3. CONCERNS: Practical implementation challenges from your viewpoint
4. SUGGESTIONS: Constructive ideas to make this work better for you

RESPONSE STYLE:
- Speak in FIRST PERSON as the stakeholder
- Use simple, direct language (imagine speaking in a focus group)
- Be specific - reference actual elements from the LFA
- Balance criticism with constructive suggestions
- Include 1-2 Hindi/Indian education terms naturally where appropriate
- Express genuine concerns, not generic feedback
- Limit to 3-5 key points, each clearly explained

RESPONSE FORMAT (JSON):
{{
    "greeting": "A brief, in-character greeting acknowledging the program",
    "feedback_items": [
        {{
            "type": "gap|risk|concern|suggestion",
            "severity": "critical|important|minor",
            "title": "Brief title of the issue",
            "message": "Detailed feedback in first person (2-3 sentences)",
            "lfa_reference": "Specific part of LFA this relates to (outcome, activity, indicator, etc.)",
            "recommendation": "What would help address this (optional)"
        }}
    ],
    "overall_sentiment": "supportive|cautious|skeptical|concerned",
    "closing_remark": "A brief closing that reflects your stakeholder's perspective"
}}

Be authentic. Your feedback should make the program designers think: "This is exactly what a real {stakeholder_name} would say."
"""


class StakeholderSimulator(BaseAgent):
    """
    Agent that simulates authentic stakeholder personas to stress-test LFA documents.
    Provides contextually-aware feedback based on real-world constraints and perspectives.
    """

    def __init__(self, client: OpenAI):
        super().__init__(client)
        self.personas = STAKEHOLDER_PERSONAS

    def get_available_stakeholders(self) -> List[Dict[str, Any]]:
        """Return list of available stakeholder personas for the frontend."""
        return [
            {
                "id": key,
                "name": persona["name"],
                "hindi_name": persona["hindi_name"],
                "level": persona["level"],
                "icon": persona["icon"],
                "color": persona["color"],
                "description": self._get_short_description(key)
            }
            for key, persona in self.personas.items()
        ]

    def _get_short_description(self, stakeholder_id: str) -> str:
        """Get a short description for UI display."""
        descriptions = {
            "teacher": "Classroom realities, workload, practical challenges",
            "head_master": "School management, teacher coordination, resources",
            "crp": "Mentoring feasibility, visit logistics, support capacity",
            "brp": "Block-level coordination, training quality, scale challenges",
            "deo": "Strategic oversight, monitoring systems, resource allocation",
            "parent": "Home support, understanding methods, child's progress",
            "student": "Learning experience, engagement, difficulty level",
            "diet": "Training design, capacity building, documentation"
        }
        return descriptions.get(stakeholder_id, "Stakeholder perspective")

    def simulate_interview(
        self,
        stakeholder_id: str,
        lfa_document: Dict[str, Any],
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Generate stakeholder feedback on an LFA document.

        Args:
            stakeholder_id: ID of the stakeholder persona (e.g., 'teacher', 'deo')
            lfa_document: The LFA document to analyze
            conversation_history: Optional previous messages for follow-up questions

        Returns:
            Structured feedback from the stakeholder's perspective
        """
        if stakeholder_id not in self.personas:
            return {
                "error": f"Unknown stakeholder: {stakeholder_id}",
                "available": list(self.personas.keys())
            }

        persona = self.personas[stakeholder_id]

        try:
            # Create LFA summary for context
            lfa_summary = self._create_lfa_summary(lfa_document)
            lfa_json = json.dumps(lfa_document, indent=2)

            # Build the prompt
            prompt = STAKEHOLDER_PROMPT_TEMPLATE.format(
                stakeholder_name=persona["name"],
                hindi_name=persona["hindi_name"],
                context=persona["context"],
                pain_points="\n".join(f"- {p}" for p in persona["pain_points"]),
                lfa_summary=lfa_summary,
                lfa_json=lfa_json
            )

            messages = [{"role": "system", "content": prompt}]

            # Add conversation history if this is a follow-up
            if conversation_history:
                for msg in conversation_history:
                    messages.append({
                        "role": msg.get("role", "user"),
                        "content": msg.get("content", "")
                    })
                # Add follow-up instruction
                messages.append({
                    "role": "user",
                    "content": "Please continue the conversation based on the follow-up question above. Respond in the same JSON format."
                })
            else:
                messages.append({
                    "role": "user",
                    "content": "Please review this LFA and provide your feedback as this stakeholder."
                })

            # Call LLM
            content = self._call_openai(messages, temperature=0.7)
            feedback = json.loads(content)

            # Enrich with metadata
            feedback["stakeholder_id"] = stakeholder_id
            feedback["stakeholder_name"] = persona["name"]
            feedback["stakeholder_level"] = persona["level"]
            feedback["stakeholder_icon"] = persona["icon"]
            feedback["stakeholder_color"] = persona["color"]

            # Calculate issue summary
            feedback["issue_summary"] = self._calculate_issue_summary(
                feedback.get("feedback_items", [])
            )

            logger.info(f"Generated feedback from {persona['name']} with {len(feedback.get('feedback_items', []))} items")

            return feedback

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error in stakeholder simulation: {e}")
            return {
                "error": "Failed to parse stakeholder feedback",
                "stakeholder_id": stakeholder_id,
                "stakeholder_name": persona["name"]
            }

        except AgentAPIError as e:
            logger.error(f"API error in stakeholder simulation: {e}")
            return {
                "error": str(e),
                "stakeholder_id": stakeholder_id,
                "stakeholder_name": persona["name"],
                "retryable": e.retryable
            }

        except Exception as e:
            logger.exception(f"Unexpected error in stakeholder simulation: {e}")
            return {
                "error": f"Unexpected error: {str(e)}",
                "stakeholder_id": stakeholder_id,
                "stakeholder_name": persona["name"]
            }

    def _create_lfa_summary(self, lfa_document: Dict[str, Any]) -> str:
        """Create a human-readable summary of the LFA for context."""
        summary_parts = [
            f"PROGRAM: {lfa_document.get('title', 'Untitled')}",
            f"GOAL: {lfa_document.get('goal', 'Not specified')}",
        ]

        if lfa_document.get('student_level_change'):
            summary_parts.append(f"STUDENT CHANGE: {lfa_document['student_level_change']}")

        # Outcomes summary
        outcomes = lfa_document.get('outcomes', [])
        if outcomes:
            summary_parts.append(f"\nOUTCOMES ({len(outcomes)}):")
            for oc in outcomes:
                summary_parts.append(f"  - {oc.get('id', '?')}: {oc.get('description', '')}")
                for op in oc.get('outputs', []):
                    summary_parts.append(f"    - {op.get('id', '?')}: {op.get('description', '')}")
                    for act in op.get('activities', []):
                        responsible = act.get('responsible_stakeholder', 'Unassigned')
                        summary_parts.append(f"      - {act.get('id', '?')}: {act.get('description', '')} [{responsible}]")

        # Stakeholder practice changes if available
        spc = lfa_document.get('stakeholder_practice_changes', {})
        if any(spc.values()):
            summary_parts.append("\nEXPECTED PRACTICE CHANGES:")
            for role, changes in spc.items():
                if changes:
                    summary_parts.append(f"  {role.replace('_', ' ').title()}: {', '.join(changes[:2])}...")

        # Assumptions
        assumptions = lfa_document.get('assumptions', [])
        if assumptions:
            summary_parts.append(f"\nKEY ASSUMPTIONS: {', '.join(assumptions[:3])}")

        return "\n".join(summary_parts)

    def _calculate_issue_summary(self, feedback_items: List[Dict[str, Any]]) -> Dict[str, int]:
        """Calculate summary counts of issues by severity and type."""
        summary = {
            "critical": 0,
            "important": 0,
            "minor": 0,
            "gaps": 0,
            "risks": 0,
            "concerns": 0,
            "suggestions": 0,
            "total": len(feedback_items)
        }

        for item in feedback_items:
            severity = item.get("severity", "minor")
            item_type = item.get("type", "concern")

            if severity in summary:
                summary[severity] += 1
            if item_type + "s" in summary:  # pluralize
                summary[item_type + "s"] += 1
            elif item_type in summary:
                summary[item_type] += 1

        return summary

    def get_all_stakeholder_feedback(
        self,
        lfa_document: Dict[str, Any],
        stakeholder_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Get feedback from multiple stakeholders at once.

        Args:
            lfa_document: The LFA document to analyze
            stakeholder_ids: Optional list of specific stakeholders (default: all)

        Returns:
            Aggregated feedback from all requested stakeholders
        """
        if stakeholder_ids is None:
            stakeholder_ids = list(self.personas.keys())

        all_feedback = {}
        aggregated_issues = {
            "critical": 0,
            "important": 0,
            "minor": 0,
            "total": 0
        }

        for stakeholder_id in stakeholder_ids:
            feedback = self.simulate_interview(stakeholder_id, lfa_document)
            all_feedback[stakeholder_id] = feedback

            # Aggregate issue counts
            if "issue_summary" in feedback:
                for key in aggregated_issues:
                    aggregated_issues[key] += feedback["issue_summary"].get(key, 0)

        return {
            "stakeholder_feedback": all_feedback,
            "aggregated_summary": aggregated_issues,
            "stakeholders_consulted": stakeholder_ids
        }

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process method for compatibility with BaseAgent interface.
        Not typically used directly - use simulate_interview instead.
        """
        lfa_document = state.get("lfa_document")
        stakeholder_id = state.get("stakeholder_id", "teacher")

        if not lfa_document:
            state["error"] = "No LFA document available for stakeholder review"
            return state

        feedback = self.simulate_interview(stakeholder_id, lfa_document)
        state["stakeholder_feedback"] = feedback

        return state
