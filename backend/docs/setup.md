## Setup Instructions

### Python Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Environment Configuration

1. Copy `.env.example` to `.env` and configure as needed
2. Ensure PostgreSQL is running
3. Create a database for this project:
   ```bash
   sudo createdb project-to-agent -U postgres
   ```

### Database Seeding

```bash
python3 recreate_db.py
```

### Running the Backend

```bash
fastapi run main.py
```