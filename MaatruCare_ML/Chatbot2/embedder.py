from langchain_community.embeddings import OllamaEmbeddings
from dotenv import load_dotenv
import os
from typing import List

# Load environment variables from .env file
load_dotenv()

ollama_embed_model = OllamaEmbeddings(model="nomic-embed-text:v1.5")

def embed_chunks(chunks: List[str]) -> List[List[float]]:
    """
    Embed chunks using ollama's embedding model.
    """
    embeddings = ollama_embed_model.embed_documents(chunks)
    return embeddings

def embed_user_query(query: str) -> List[float]:
    """
    Embeds a user query using Ollama embedding model
    """
    
    response = ollama_embed_model.embed_query(query)
    return response