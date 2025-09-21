# 데이터베이스 모델 정의


from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()

# 사용자
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False) 
    email = db.Column(db.String(120), unique=True, nullable=False) 
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) 
    clothes = db.relationship('Clothing', backref='owner', lazy=True)

# 옷
class Clothing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(30))
    image_path = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
# 캐릭터
class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    body_type = db.Column(db.String(50))
    height = db.Column(db.Integer)
    image_path = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))