FROM python:3.11-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements
COPY requirements-light.txt .

# Install CPU-only torch first, then other dependencies
RUN pip install --no-cache-dir --user \
    torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir --user -r requirements-light.txt

# Final stage
FROM python:3.11-slim

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

WORKDIR /app

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"] 