from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

# Initialize model
llm = ChatOllama(model="llama3.2:1b", temperature=0.6)

SYSTEM_PROMPT = (
    "You are an emotional companion, friend, and confidant for perinatal women. "
    "Respond with warmth, empathy and be concise."
)

# -------------------------------
# Summarization Function
# -------------------------------
def summarize_history(messages, llm):
    """Summarize the full chat history into one compressed message."""
    text = "\n".join([m.content for m in messages])

    summary_prompt = [
        SystemMessage(content="Summarize this conversation concisely and warmly."),
        HumanMessage(content=text)
    ]

    result = llm.invoke(summary_prompt)
    return result.content  # summary string


# -------------------------------
# Chatbot Node
# -------------------------------
def chatbot(state: MessagesState):
    messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    bot_message = llm.invoke(messages)
    return {"messages": state["messages"] + [bot_message]}


# -------------------------------
# Build LangGraph
# -------------------------------
graph = StateGraph(MessagesState)
graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)
app = graph.compile()


# -------------------------------
# Runtime State
# -------------------------------
state = {"messages": []}


# -------------------------------
# Chat Loop
# -------------------------------
while True:
    user = input("You: ")

    if user.lower() in ["exit", "quit", "bye"]:
        print("Bot: Goodbye! Take care!")
        break

    # Add user message
    state["messages"].append(HumanMessage(content=user))

    # If more than 4 messages → summarise and compress
    if len(state["messages"]) > 4:
        summary_text = summarize_history(state["messages"], llm)

        # Replace history with summary only
        state["messages"] = [HumanMessage(content=f"[Summary]: {summary_text}")]

    # Run the graph
    state = app.invoke({"messages": state["messages"]})

    bot_reply = state["messages"][-1].content
    print("Bot:", bot_reply)
