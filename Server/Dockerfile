# Dockerfile
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# 시스템 패키지 (필요 시 추가)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libjpeg-dev zlib1g-dev && rm -rf /var/lib/apt/lists/*

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# 소스 복사
COPY . .

# 업로드/instance 보장
RUN mkdir -p /app/uploads /app/instance

# Gunicorn으로 실행 (app.py의 Flask 인스턴스가 app 변수라고 가정)
EXPOSE 8000
CMD ["gunicorn", "-w", "2", "-k", "gthread", "-b", "0.0.0.0:8000", "app:app"]
