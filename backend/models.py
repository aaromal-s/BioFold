from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class AnalysisSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    dataset_name = db.Column(db.String(255), nullable=False)
    params_json = db.Column(db.Text, nullable=False)  # Store JSON as string
    processed_file = db.Column(db.String(255), nullable=True)
    
    def to_dict(self):
        import json
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
            "dataset_name": self.dataset_name,
            "params": json.loads(self.params_json),
            "processed_file": self.processed_file
        }
