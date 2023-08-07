FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

COPY ./ /app

RUN pip3 install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]