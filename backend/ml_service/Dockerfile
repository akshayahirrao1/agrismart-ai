# syntax=docker/dockerfile:1
# Pinning Python 3.11 here permanently avoids the numpy/TensorFlow
# compatibility issues hit locally with Python 3.14 (distutils removal etc).
FROM python:3.11-slim

WORKDIR /app

# Lean production requirements (no TensorFlow/Pillow — the local disease
# model isn't deployed, see requirements.txt vs requirements.prod.txt)
COPY requirements.prod.txt .
RUN pip install --no-cache-dir -r requirements.prod.txt

# Only what's needed to train + serve crop/soil models
COPY app.py train_models.py ./
COPY dataset ./dataset

# Trained .pkl files are gitignored on purpose (regenerated here, not
# committed as binary artifacts) — this bakes them into the image at build
# time from the committed dataset CSVs.
RUN python train_models.py

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser && \
    chown -R appuser:appgroup /app
USER appuser

EXPOSE 8000

# Render (and most platforms) inject $PORT at runtime — shell-form CMD is
# required here so that variable actually gets expanded.
CMD gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 90 app:app