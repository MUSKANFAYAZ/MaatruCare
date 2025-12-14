from pdfreader import read_pdf
from chunker import chunk_pages
from embedder import embed_chunks
from vectorstore import store_in_pinecone
from typing import List

pdf_path="D:\AI-Project\MaatruCare_ML\docs\High-Risk-Conditions-in-preg-modified-Final.pdf"

def run():
    # Read the pdf file
    pages=read_pdf(pdf_path)
    
    #Chunk the data into smaller pieces
    chunks=chunk_pages(pages)
    
    
    #Embed the chunks using the Ollama Embedding model to create vector representations
    embeddings=embed_chunks(chunks)
    
    # Store the chunks and their embeddings in pinecone vector database
    store_in_pinecone(chunks, embeddings, namespace="")
    
if __name__ == "__main__":
    run()