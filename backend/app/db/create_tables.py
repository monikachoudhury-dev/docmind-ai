from app.db.base import Base
from app.db.database import engine

# Import all models
from app.models.user import User

Base.metadata.create_all(bind=engine)

print("✅ All tables created successfully.")