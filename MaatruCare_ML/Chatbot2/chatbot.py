from typing import List, Optional, TypedDict
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver
from QueryProcessor import process_user_query
import os
from dotenv import load_dotenv
import sqlite3

load_dotenv()


class ChatState(TypedDict):
    user_id: str
    messages: List[BaseMessage]
    retrieved_chunks: List[str]
    long_term_memory: List[str]
    mood_level: Optional[str]

def rag_llm_node(state: ChatState) -> ChatState:
    last_msg = state["messages"][-1]
    assert isinstance(last_msg, HumanMessage)
    user_query = last_msg.content
    
    answer = process_user_query(user_query)
    state["messages"].append(AIMessage(content=answer))
    return state

def build_app(db_path: str = "chat_state.db"):
    builder = StateGraph(ChatState)
    
    builder.add_node("rag_llm",rag_llm_node)
    builder.set_entry_point("rag_llm")
    builder.add_edge("rag_llm",END)
    conn = sqlite3.connect(db_path,check_same_thread = False)
    checkpointer = SqliteSaver(conn)
    app = builder.compile(checkpointer=checkpointer)
    return app

if __name__ == "__main__":
    app = build_app()
    
    USER_ID = "testuser@example.com"
    THREAD_ID = f"{USER_ID}-chat"
    
    while True:
        user_query = input("You: ")
        if user_query.strip().lower() in ["quit","exit","bye"]:
            break
        init_state: ChatState={
            "user_id": USER_ID,
            "messages": [HumanMessage(content=user_query)],
            "retrieved_chunks": [],
            "long_term_memory": [],
            "mood_level": None,
        }
        result = app.invoke(
            init_state,
            config={"configurable":{"thread_id":THREAD_ID}},
        )
        bot_reply = result["messages"][-1].content
        print("Bot: ",bot_reply)
    
    


