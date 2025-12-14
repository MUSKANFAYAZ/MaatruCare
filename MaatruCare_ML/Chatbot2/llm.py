from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()

client = ChatOllama(model="llama3.2:1b", temperature=0.4)

def query_llm_with_context(query: str, context: str) -> str:
    system_content = """
    You are a warm, empathetic emotional support companion for perinatal mothers.
    Use ONLY the following context to answer. Do NOT repeat or quote the context in your response.
    
    CONTEXT: {context}
    
    Always start by acknowledging and validating the user's feelings.
    If the user asks a medical question, explain gently using the context, and remind them to consult a healthcare professional.
    If context lacks info, say so and stay supportive. Avoid diagnoses.
    """
    
    human_content = f""""User:
    {query}
    """
    
    messages = [
        SystemMessage(content=system_content),
        HumanMessage(content=human_content)
    ]
    
    response = client.invoke(messages)
    return response.content