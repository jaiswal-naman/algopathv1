"""
RetrievalAgent - The Librarian
Performs semantic search to find matching LFA templates from Pinecone.
"""

import json
from typing import Dict, Any, List, Optional
from openai import OpenAI
from ..graph.state import AgentState, MatchedTemplate, WorkflowPhase


class Retriever:
    """
    Semantic search agent that finds matching LFA templates.
    """

    def __init__(self, client: OpenAI, vector_store=None):
        self.client = client
        self.vector_store = vector_store
        self.model = "gpt-4o"
        self.embedding_model = "text-embedding-3-small"

    def _create_search_query(self, state: AgentState) -> str:
        """
        Create a comprehensive search query from the final profile.
        """
        program_brief = state.get("program_brief", {})
        answers = state.get("answers", [])

        # Build search query from brief
        query_parts = [
            program_brief.get("summary", ""),
            program_brief.get("goal", ""),
            program_brief.get("target_audience", ""),
        ]

        # Add challenges
        challenges = program_brief.get("challenges", [])
        if challenges:
            query_parts.extend(challenges)

        # Add key answers
        for answer in answers[:5]:  # Top 5 answers
            query_parts.append(answer.get("answer", ""))

        return " ".join(filter(None, query_parts))

    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding vector for text."""
        response = self.client.embeddings.create(
            model=self.embedding_model,
            input=text
        )
        return response.data[0].embedding

    def process(self, state: AgentState) -> AgentState:
        """
        Search for matching templates based on the final profile.

        Args:
            state: Current state with program_brief and answers

        Returns:
            Updated state with matched_templates
        """
        try:
            # Create final profile by merging brief and answers
            program_brief = state.get("program_brief", {})
            answers = state.get("answers", [])

            final_profile = {
                **program_brief,
                "answers": answers
            }
            state["final_profile"] = final_profile

            # Create search query
            search_query = self._create_search_query(state)

            if not search_query.strip():
                state["error"] = "No content available for search"
                return state

            # Get embedding
            query_embedding = self._get_embedding(search_query)

            # Search vector store if available
            matched_templates = []

            if self.vector_store:
                results = self.vector_store.search(
                    vector=query_embedding,
                    top_k=5
                )

                for match in results.get("matches", []):
                    template = MatchedTemplate(
                        id=match["id"],
                        title=match.get("metadata", {}).get("title", "Untitled"),
                        score=match["score"],
                        preview=match.get("metadata", {}).get("preview", "")
                    )
                    matched_templates.append(template.model_dump())
            else:
                # Demo mode: return sample templates
                matched_templates = self._get_demo_templates(search_query)

            state["matched_templates"] = matched_templates
            state["phase"] = WorkflowPhase.WAITING_FOR_SELECTION.value
            state["messages"] = state.get("messages", []) + [
                f"Found {len(matched_templates)} matching templates"
            ]

        except Exception as e:
            state["error"] = f"Template search failed: {str(e)}"

        return state

    def _get_demo_templates(self, query: str) -> List[Dict[str, Any]]:
        """Return demo templates when vector store is not configured."""
        query_lower = query.lower()

        templates = [
            {
                "id": "tmpl_education_001",
                "title": "Primary Education Quality Improvement Program",
                "score": 0.92,
                "preview": "Goal: Improve learning outcomes for primary school students through teacher training and resource provision."
            },
            {
                "id": "tmpl_education_002",
                "title": "Digital Literacy for Rural Schools",
                "score": 0.88,
                "preview": "Goal: Equip rural students with essential digital skills through computer labs and trained instructors."
            },
            {
                "id": "tmpl_education_003",
                "title": "School Infrastructure Development",
                "score": 0.85,
                "preview": "Goal: Enhance learning environments through infrastructure improvements and facility upgrades."
            },
            {
                "id": "tmpl_community_001",
                "title": "Community Health Education Initiative",
                "score": 0.82,
                "preview": "Goal: Improve community health outcomes through awareness campaigns and local health worker training."
            },
            {
                "id": "tmpl_youth_001",
                "title": "Youth Skill Development Program",
                "score": 0.80,
                "preview": "Goal: Prepare youth for employment through vocational training and soft skills development."
            }
        ]

        # Adjust scores based on query relevance
        if "education" in query_lower or "school" in query_lower:
            templates[0]["score"] = 0.95
            templates[1]["score"] = 0.91
        elif "health" in query_lower:
            templates[3]["score"] = 0.94
        elif "youth" in query_lower or "skill" in query_lower:
            templates[4]["score"] = 0.93

        # Sort by score
        templates.sort(key=lambda x: x["score"], reverse=True)
        return templates[:5]

    async def aprocess(self, state: AgentState) -> AgentState:
        """Async version of process."""
        return self.process(state)
