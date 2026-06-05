FROM python:3.9-slim

# Buat pengguna non-root dengan UID 1000 (Standar wajib Hugging Face Spaces)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Salin berkas persyaratan dan pasang dependensi (Docker cache optimization)
COPY --chown=user fullstack/backend/ai-service/requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Salin seluruh repositori ke dalam container agar path relatif model tetap valid
COPY --chown=user . /app

# Setel working directory ke subfolder flask
WORKDIR /app/fullstack/backend/ai-service

# Expose port 7860 (Port default wajib untuk Hugging Face Spaces)
EXPOSE 7860

# Jalankan server Flask
CMD ["python", "app.py"]
