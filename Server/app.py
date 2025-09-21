from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from models import db, User, Clothing, Character
from PIL import Image
import os, uuid

app = Flask(__name__, instance_relative_config=True) #플라스크 앱 생성
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}}) # CORS 설정 (프론트엔드 주소 허용)

# 인스턴스 폴더 및 업로드 폴더 생성
os.makedirs(app.instance_path, exist_ok=True)
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# 데이터베이스 설정
db_path = os.path.join(app.instance_path, "fashion.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
with app.app_context():
    db.create_all()

# 업로드 파일 크기 제한 및 허용 확장자 설정
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename: str) -> bool: 
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# 여기서부터 라우트 정의
# 기본 홈 라우트
@app.route("/")
def home():
    return jsonify({"status": "ok", "message": "Fashion AI backend running"}), 200 

# 업로드된 파일 제공 라우트
@app.route("/uploads/<name>")
def download_file(name):
    return send_from_directory(app.config["UPLOAD_FOLDER"], name, as_attachment=False)

# 옷 목록 조회 라우트
@app.route("/api/clothes", methods=["GET"])
def list_clothes():
    rows = Clothing.query.order_by(Clothing.created_at.desc()).all()
    return jsonify([{"id": r.id, "name": r.name, "category": r.category, "color": r.color, "image_url": f"/uploads/{r.image_path}"} for r in rows]), 200

# 키, 몸무게, 체형을 고려한 사이즈 추천 라우트 (임시 구현) 나중에 ai 모델때 활용
@app.route("/health")
def health():
    return jsonify({"status": "healthy"}), 200

# 옷 업로드 라우트
@app.route("/api/clothes", methods=["POST"])
def upload_clothing():
    name = request.form.get("name") or "이름을 모르겠습니다"
    category = request.form.get("category") or "기타"
    color = request.form.get("color")
    file = request.files.get("file")

    if not file or file.filename == "": # 파일이 없거나 이름이 비어있으면 오류 반환
        return jsonify({"error": "file is required"}), 400 
    if not allowed_file(file.filename):# 확장자 검사
        return jsonify({"error": "unsupported file type"}), 400

    base = secure_filename(file.filename)

    # 파일 저장 및 썸네일 생성
    ext = base.rsplit(".", 1)[1].lower()
    fname = f"{uuid.uuid4().hex}.{ext}"
    fpath = os.path.join(app.config["UPLOAD_FOLDER"], fname)
    file.save(fpath)

    # 썸네일 생성, 생성안되도, 그냥 무시
    thumb_name = None 
    try:
        im = Image.open(fpath)
        im.thumbnail((512, 512))
        thumb_name = f"{uuid.uuid4().hex}_thumb.{ext}"
        im.save(os.path.join(app.config["UPLOAD_FOLDER"], thumb_name))
    except Exception:
        pass

    # DB에 저장
    user = User.query.first()
    if not user:
        user = User(username="test_user", email="test@example.com")
        db.session.add(user); db.session.commit()

    item = Clothing(user_id=user.id, name=name, category=category, color=color, image_path=fname)
    db.session.add(item); db.session.commit()

    return jsonify({"id": item.id, "name": item.name, "category": category, "color": color, "image_url": f"/uploads/{fname}", "thumbnail_url": f"/uploads/{thumb_name}" if thumb_name else None}), 201

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=8000)
