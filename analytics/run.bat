@echo off
set PYTHONPATH=D:\FinCore\analytics
python -c "import sys; sys.path.insert(0, r'D:\FinCore\analytics'); from src.main import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8000)"