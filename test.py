import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage

# Ensure the necessary libraries are installed:
# pip install langchain langchain-google-genai faiss-cpu
import warnings
warnings.filterwarnings('ignore')

# Load the environment variables (replace with your actual API keys)
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "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"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"] = "RAG_APPLICATION_MEMORY"
os.environ["GOOGLE_API_KEY"] = "AIzaSyBgw6Gp4-hJPm1WL1uu317Xzy1g5BJZtc4"

# Initialize the embeddings model
gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Load the FAISS vectorstore from the local directory
FAISS_INDEX = "D:\\Mega Project\\faiss\\"  # Path to your FAISS index
vectorstore = FAISS.load_local(FAISS_INDEX, gemini_embeddings, allow_dangerous_deserialization=True)

# Create a retriever from the vectorstore
retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 4})

# Define the system prompt for question answering
system_prompt = (
    "You are an assistant for both general conversation and question-answering tasks. "
    "You can respond to general conversational inputs like 'hi', 'hello', or 'thank you' with polite and friendly responses. "
    "For question-answering tasks, use the following pieces of retrieved context to answer the question. "
    "If you don't know the answer, say that you don't know. "
    "Use three sentences maximum and keep the answer concise. "
    "\n\n{context}"
)

# Initialize the GoogleGenerativeAI model for chat-based responses
model = ChatGoogleGenerativeAI(model="gemini-1.0-pro", convert_system_message_to_human=True)

# Create a prompt template using ChatPromptTemplate
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

# Predefined responses for common conversational inputs
general_responses = {
    "hi": "Hello! How can I assist you today?",
    "hello": "Hi there! How can I help you?",
    "thank you": "You're welcome! Feel free to ask if you need anything else.",
    "thanks": "You're welcome!",
    "bye": "Goodbye! Have a great day!"
}

def chatbot_interface():
    while True:
        user_input = input("You: ").lower()

        # Exit condition
        if user_input.lower() == 'exit':
            print("Bot: Goodbye! Have a nice day!")
            break

        # Handle general conversational inputs
        if user_input.lower() in general_responses:
            print("Bot:", general_responses[user_input])
            continue

        # Handle question-answering inputs with RAG model
        try:
            response = rag_chain.invoke({"input": user_input})["answer"]
            
            #if "sorry" or "apologize" or "does not" in response:
            #   print("Bot:", model.invoke(user_input).content)
                
            #else:
            
            print("Bot:", response)

        except Exception as e:
            print("Bot: An error occurred:", e)

if __name__ == "__main__":
    chatbot_interface()
