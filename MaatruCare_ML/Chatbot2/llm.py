from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()

client = ChatOllama(model="llama3.2:1b", temperature=0.4)

def query_llm_with_context(query: str, context: str) -> str:
    system_content = """
    You are a warm, empathetic emotional support companion for perinatal mothers.
    Always start by acknowledging and validating the user's feelings.
    If the user asks a medical or pregnancy-related question, use the provided context
    to explain gently and clearly, and remind them to consult a healthcare professional.
    If the context does not contain enough information, say so and stay supportive.
    Avoid giving direct medical instructions or making diagnoses.
    """
    
    human_content = f""""Context:
    {context}
    
    User question:
    {query}
    """
    
    messages = [
        SystemMessage(content=system_content),
        HumanMessage(content=human_content)
    ]
    
    response = client.invoke(messages)
    return response.content