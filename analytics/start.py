import sys
import os

# Add analytics directory to Python path
sys.path.insert(0, r'D:\FinCore\analytics')

# Import the app
from src.main import app

# Start uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)