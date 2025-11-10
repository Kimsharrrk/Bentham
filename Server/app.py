#app.py

from flask import Flask, jsonify, request, send_from_directory,render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from models import db, User, Clothing, Character, BodyKeypoints, Recommendation
from PIL import Image
import os, uuid

app = Flask(__name__, static_folder="static")
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
    return send_from_directory(app.static_folder, "index.html")

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    # (여기서 email/ID 중복, 비번 해시처리 등 체크 후)
    # User 테이블에 저장
    user = User(username=name, email=email)  # password는 반드시 해싱해서 저장! (생략)
    db.session.add(user)
    db.session.commit()
    # JWT 또는 임시토큰 발급(테스트는 그냥 return 가능)
    return jsonify({"result": "회원가입 성공", "id": user.id}), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "이메일 없음"}), 404
    # 실제 서비스에서는 비번 해시검사 추가!
    return jsonify({"result": "로그인 성공", "id": user.id}), 200

@app.route("/api/users", methods=["GET"])
def list_users():
    users = User.query.all()
    return jsonify([
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "created_at": u.created_at.isoformat(),
        }
        for u in users
    ]), 200




@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(app.static_folder, path)


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

@app.route("/uploadform")
def upload_form():
    return render_template('upload_test.html')


    # app.py - AI 추천 연동용 예시 라우트

@app.route("/api/body_analysis", methods=["POST"])
def save_body_analysis():
    # AI가 POST로 user_id, image_path, keypoints(json) 보내줌
    req = request.get_json()
    user_id = req.get("user_id")
    image_path = req.get("image_path")
    keypoints = req.get("keypoints")
    if not user_id or not image_path or not keypoints:
        return jsonify({"error": "필수값 누락"}), 400

    body = BodyKeypoints(user_id=user_id, image_path=image_path, keypoints=json.dumps(keypoints))
    db.session.add(body);
    db.session.commit()
    return jsonify({"result": "saved", "id": body.id}), 201

@app.route("/api/recommend", methods=["POST"])
def save_recommendation():
    req = request.get_json()
    user_id = req.get("user_id")
    recommend_json = req.get("recommend_json")
    if not user_id or not recommend_json:
        return jsonify({"error": "필수값 누락"}), 400

    rec = Recommendation(user_id=user_id, recommend_json=json.dumps(recommend_json))
    db.session.add(rec);
    db.session.commit()
    return jsonify({"result": "saved", "id": rec.id}), 201

# 추천 기록 조회 API (예시)
@app.route("/api/recommend/<int:user_id>", methods=["GET"])
def get_recommendation(user_id):
    recs = Recommendation.query.filter_by(user_id=user_id).order_by(Recommendation.created_at.desc()).all()
    return jsonify([
        {"id": r.id, "recommend_json": r.recommend_json, "created_at": r.created_at.isoformat()}
        for r in recs
    ]), 200

# 옷 업로드 라우트
@app.route("/api/clothes", methods=["POST"])
def upload_clothing():
    name = request.form.get("name") or "이름을 모2르겠습니다"
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
