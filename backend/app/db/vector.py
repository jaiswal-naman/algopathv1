"""
Pinecone Vector Store Connection
Manages semantic search for LFA templates.
"""

import os
from typing import List, Dict, Any, Optional

# Make Pinecone optional - gracefully handle import errors
try:
    from pinecone import Pinecone, ServerlessSpec
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False
    Pinecone = None
    ServerlessSpec = None

import logging

logger = logging.getLogger("lfa_builder.db.vector")

class VectorStore:
    """
    Vector store wrapper for Pinecone operations.
    Handles embedding storage and semantic search for templates.
    """

    def __init__(
        self,
        api_key: str = None,
        index_name: str = None,
        dimension: int = 1536  # text-embedding-3-small dimension
    ):
        self.api_key = api_key or os.getenv("PINECONE_API_KEY")
        self.index_name = index_name or os.getenv("PINECONE_INDEX_NAME", "lfa-templates")
        self.dimension = dimension
        self.client = None
        self.index = None

        if self.api_key:
            self._initialize()

    def _initialize(self):
        """Initialize Pinecone client and index."""
        if not PINECONE_AVAILABLE:
            logger.warning("Pinecone SDK not available - vector store disabled")
            return

        try:
            self.client = Pinecone(api_key=self.api_key)

            # Check if index exists
            existing_indexes = [idx.name for idx in self.client.list_indexes()]

            if self.index_name not in existing_indexes:
                # Create index if it doesn't exist
                self.client.create_index(
                    name=self.index_name,
                    dimension=self.dimension,
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region="us-east-1"
                    )
                )

            self.index = self.client.Index(self.index_name)
            logger.info(f"Connected to Pinecone index: {self.index_name}")

        except Exception as e:
            logger.warning(f"Pinecone initialization failed: {e}")
            self.index = None

    def is_available(self) -> bool:
        """Check if vector store is available."""
        return self.index is not None

    def upsert(
        self,
        id: str,
        vector: List[float],
        metadata: Dict[str, Any] = None
    ) -> bool:
        """
        Insert or update a vector in the index.

        Args:
            id: Unique identifier for the vector
            vector: Embedding vector
            metadata: Additional metadata to store

        Returns:
            Success status
        """
        if not self.index:
            return False

        try:
            self.index.upsert(
                vectors=[{
                    "id": id,
                    "values": vector,
                    "metadata": metadata or {}
                }]
            )
            return True
        except Exception as e:
            logger.error(f"Upsert failed: {e}")
            return False

    def upsert_batch(
        self,
        vectors: List[Dict[str, Any]],
        batch_size: int = 100
    ) -> int:
        """
        Insert multiple vectors in batches.

        Args:
            vectors: List of {"id": str, "values": list, "metadata": dict}
            batch_size: Number of vectors per batch

        Returns:
            Number of vectors successfully upserted
        """
        if not self.index:
            return 0

        count = 0
        try:
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                self.index.upsert(vectors=batch)
                count += len(batch)
            return count
        except Exception as e:
            logger.error(f"Batch upsert failed: {e}")
            return count

    def search(
        self,
        vector: List[float],
        top_k: int = 5,
        filter: Dict[str, Any] = None,
        include_metadata: bool = True
    ) -> Dict[str, Any]:
        """
        Search for similar vectors.

        Args:
            vector: Query vector
            top_k: Number of results to return
            filter: Metadata filter
            include_metadata: Whether to include metadata in results

        Returns:
            Search results with matches
        """
        if not self.index:
            return {"matches": []}

        try:
            results = self.index.query(
                vector=vector,
                top_k=top_k,
                filter=filter,
                include_metadata=include_metadata
            )
            return results.to_dict()
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return {"matches": []}

    def delete(self, ids: List[str]) -> bool:
        """
        Delete vectors by ID.

        Args:
            ids: List of vector IDs to delete

        Returns:
            Success status
        """
        if not self.index:
            return False

        try:
            self.index.delete(ids=ids)
            return True
        except Exception as e:
            logger.error(f"Delete failed: {e}")
            return False

    def get_stats(self) -> Dict[str, Any]:
        """Get index statistics."""
        if not self.index:
            return {}

        try:
            return self.index.describe_index_stats().to_dict()
        except Exception as e:
            logger.error(f"Stats failed: {e}")
            return {}


def create_vector_store() -> Optional[VectorStore]:
    """Factory function to create vector store if configured."""
    if not PINECONE_AVAILABLE:
        logger.info("Pinecone SDK not installed - running without vector store")
        return None

    api_key = os.getenv("PINECONE_API_KEY")
    if api_key:
        store = VectorStore(api_key=api_key)
        if store.is_available():
            return store
    return None
