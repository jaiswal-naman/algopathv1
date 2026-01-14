"""
Base Agent - Common functionality for all agents
Provides standardized error handling, logging, and configuration.
"""

import os
import logging
from typing import Dict, Any, Optional
from abc import ABC, abstractmethod
from openai import OpenAI, APIConnectionError, APITimeoutError, RateLimitError, AuthenticationError

logger = logging.getLogger("lfa_builder.agents")


class AgentError(Exception):
    """Base exception for agent errors."""
    pass


class AgentConfigError(AgentError):
    """Configuration error."""
    pass


class AgentAPIError(AgentError):
    """API call error with details."""
    def __init__(self, message: str, retryable: bool = False):
        super().__init__(message)
        self.retryable = retryable


class BaseAgent(ABC):
    """
    Base class for all LFA Builder agents.
    Provides common error handling and configuration.
    """

    def __init__(self, client: OpenAI):
        self.client = client
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o")
        self.temperature = float(os.getenv("LLM_TEMPERATURE", "0.4"))
        self.timeout = float(os.getenv("LLM_TIMEOUT", "90"))
        self.max_retries = int(os.getenv("LLM_MAX_RETRIES", "2"))

    def _call_openai(
        self,
        messages: list,
        temperature: Optional[float] = None,
        json_response: bool = True
    ) -> str:
        """
        Make an OpenAI API call with proper error handling.

        Args:
            messages: List of message dicts
            temperature: Override default temperature
            json_response: Whether to request JSON format

        Returns:
            Response content string

        Raises:
            AgentAPIError: On API errors with retry info
        """
        temp = temperature if temperature is not None else self.temperature
        retries = 0

        while retries <= self.max_retries:
            try:
                kwargs = {
                    "model": self.model,
                    "messages": messages,
                    "temperature": temp,
                    "timeout": self.timeout,
                }

                if json_response:
                    kwargs["response_format"] = {"type": "json_object"}

                response = self.client.chat.completions.create(**kwargs)
                content = response.choices[0].message.content

                if json_response:
                    return self._clean_json_response(content)
                return content

            except AuthenticationError as e:
                logger.error(f"Authentication error: {e}")
                raise AgentAPIError(
                    "API authentication failed. Please check your API key.",
                    retryable=False
                )

            except RateLimitError as e:
                logger.warning(f"Rate limit hit (attempt {retries + 1}): {e}")
                if retries < self.max_retries:
                    retries += 1
                    import time
                    time.sleep(2 ** retries)  # Exponential backoff
                    continue
                raise AgentAPIError(
                    "API rate limit exceeded. Please try again in a moment.",
                    retryable=True
                )

            except APITimeoutError as e:
                logger.warning(f"API timeout (attempt {retries + 1}): {e}")
                if retries < self.max_retries:
                    retries += 1
                    continue
                raise AgentAPIError(
                    "Request timed out. Please try again.",
                    retryable=True
                )

            except APIConnectionError as e:
                logger.error(f"Connection error (attempt {retries + 1}): {e}")
                if retries < self.max_retries:
                    retries += 1
                    import time
                    time.sleep(1)
                    continue
                raise AgentAPIError(
                    "Could not connect to AI service. Please check your connection.",
                    retryable=True
                )

            except Exception as e:
                logger.exception(f"Unexpected API error: {e}")
                raise AgentAPIError(
                    f"An unexpected error occurred: {str(e)}",
                    retryable=False
                )

        raise AgentAPIError("Max retries exceeded", retryable=False)

    def _clean_json_response(self, content: str) -> str:
        """
        Clean JSON response by removing markdown code blocks.
        """
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        
        if content.endswith("```"):
            content = content[:-3]
            
        return content.strip()

    @abstractmethod
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process the current state and return updated state.

        Args:
            state: Current agent state

        Returns:
            Updated state
        """
        pass

    async def aprocess(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Async version of process (default implementation)."""
        return self.process(state)
