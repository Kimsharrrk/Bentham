

from PIL import Image
from io import BytesIO


def test_print_routes(client):
    print(client.application.url_map)
    assert True



def make_png_bytes(w=8, h=8, color=(255,255,255,255)):
    im = Image.new("RGBA", (w, h), color)
    buf = BytesIO(); im.save(buf, format="PNG"); buf.seek(0)
    return buf

def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200

def test_upload_and_list(client):
    png = make_png_bytes()
    data = {
        "name": "흰 셔츠",
        "category": "상의",
        "color": "white",
        "file": (png, "sample.png"),
    }
    r = client.post("/api/clothes", data=data, content_type="multipart/form-data")
    assert r.status_code == 201
    j = r.get_json()
    assert "image_url" in j and j["image_url"].startswith("/uploads/")
    r2 = client.get("/api/clothes")
    assert r2.status_code == 200
    arr = r2.get_json()
    assert any(it["image_url"] == j["image_url"] for it in arr)
