from embedder import embed_user_query
from vectorstore import search_in_pinecone
from llm import query_llm_with_context

def process_user_query(query: str, debug: bool = False):
    
    # Embed the user's query to create a vector representation
    query_vector = embed_user_query(query)
    
    # Search the vector DB to find top matching chunks related to the user's question
    matched_chunks = search_in_pinecone(query_vector)
    
    # Send the user query and the search results (query + context) to the LLm for generating response
    generated_response = query_llm_with_context(query, matched_chunks)
    return generated_response
    
    