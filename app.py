import streamlit as st
import os
import time  
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
import warnings

# Suppress warnings
warnings.filterwarnings('ignore')

# Load the environment variables (replace with your actual API keys)
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = ""
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"] = "RAG_APPLICATION_MEMORY"
os.environ["GOOGLE_API_KEY"] = ""

# Streamlit UI setup
st.set_page_config(page_title="LawGPT", page_icon="⚖️")
st.title("⚖️ Legal ChatBot")
st.markdown("""
    <style>
    .chat-message {
        border-radius: 10px;
        padding: 10px;
        margin: 5px;
        max-width: 80%;
    }
    .user {
        background-color: #ec7063;
        align-self: flex-end;
    }
    .assistant {
        background-color: #00ff00;
        align-self: flex-start;
    }
    .stButton > button {
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 16px;
        transition: background-color 0.3s;
    }
    .stButton > button:hover {
        background-color: #ec7063;
    }
    </style>
""", unsafe_allow_html=True)

# Reset conversation function
def reset_conversation():
    st.session_state.messages = []

# Predefined responses for common conversational inputs
general_responses = {
    "hi": "Hello! How can I assist you today?",
    "hello": "Hi there! How can I help you?",
    "thank you": "You're welcome! Feel free to ask if you need anything else.",
    "thanks": "You're welcome!",
    "bye": "Goodbye! Have a great day!"
}

# Initialize session state for messages
if "messages" not in st.session_state:
    st.session_state.messages = []

# Initialize embeddings model
gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Load FAISS vectorstore from local directory
FAISS_INDEX = "D:\\Mega Project\\my_vectorstore\\"  # Path to your FAISS index
vectorstore = FAISS.load_local(FAISS_INDEX, gemini_embeddings, allow_dangerous_deserialization=True)

# Create retriever from vectorstore
retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 8})
#retriever = vectorstore.as_retriever(search_type="mmr", search_kwargs={"k": 8, "lambda": 0.7})  

# Define system prompt for question answering
system_prompt = (
    "You are an assistant for both general conversation and question-answering tasks. "
    "For question-answering tasks, use the following pieces of retrieved context to answer the question. "
    "If you don't know the answer, say that you don't know."
    "Use three sentences maximum and keep the answer concise. "
    "\n\n{context}"
)

# Initialize GoogleGenerativeAI model for chat-based responses
model = ChatGoogleGenerativeAI(model="gemini-1.0-pro", convert_system_message_to_human=True)

# Create prompt template using ChatPromptTemplate
chat_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}")
    ]
)

# Create a chain for combining documents with the prompt
question_answering_chain = create_stuff_documents_chain(model, chat_prompt)

# Create the retrieval chain (combines retriever and document chain)
rag_chain = create_retrieval_chain(retriever, question_answering_chain)

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message.get("role")):
        st.markdown(f'<div class="chat-message {message.get("role")}">{message.get("content")}</div>', unsafe_allow_html=True)

# Input prompt for the user to type messages
input_prompt = st.chat_input("Say something...")

if input_prompt:
    st.session_state.messages.append({"role": "user", "content": input_prompt})

    # Display user message
    with st.chat_message("user"):
        st.markdown(f'<div class="chat-message user">{input_prompt}</div>', unsafe_allow_html=True)

    # Check for predefined general responses first
    bot_response = general_responses.get(input_prompt.lower())

    if bot_response:
        # If a predefined response is found, use it
        with st.chat_message("assistant"):
            st.markdown(f'<div class="chat-message assistant">{bot_response}</div>', unsafe_allow_html=True)
    else:
        # Otherwise, use the RAG model to get the answer
        with st.chat_message("assistant"):
            with st.status("Thinking 💡...", expanded=True):
                result = rag_chain.invoke({"input": input_prompt})  # Use the rag_chain to invoke the model
                message_placeholder = st.empty()
                full_response = ""

                # Simulate typing effect for the model's response
                for chunk in result["answer"]:
                    full_response += chunk
                    time.sleep(0.02)  # Simulate typing delay
                    message_placeholder.markdown(f'<div class="chat-message assistant">{full_response}</div>', unsafe_allow_html=True)

    # Append bot's response to session state
    st.session_state.messages.append({"role": "assistant", "content": bot_response if bot_response else full_response})

# Reset button to clear the conversation
if st.button('Reset All Chat 🗑️', on_click=reset_conversation):
    reset_conversation()
