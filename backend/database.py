import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_connection():
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL não encontrada. Verifique o arquivo .env")
    
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
