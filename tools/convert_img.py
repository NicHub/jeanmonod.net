import os
from PIL import Image

# SRC_DIR = "../images/sites_web_old"
SRC_DIR = "../images/sites_web_highres"
DST_DIR = "../images/sites_web"
HEIGHT = 300
FORMAT = "webp"

os.makedirs(DST_DIR, exist_ok=True)

for filename in os.listdir(SRC_DIR):
    if not filename.lower().endswith(
        (".png", ".jpg", ".jpeg", ".bmp", ".tiff", "webp")
    ):
        continue
    base, _ = os.path.splitext(filename)
    dst_path = os.path.join(DST_DIR, f"{base}.webp")
    if os.path.exists(dst_path):
        continue
    src_path = os.path.join(SRC_DIR, filename)
    with Image.open(src_path) as img:
        print(filename)
        w, h = img.size
        print(w / h)
        new_w = int(w * HEIGHT / h)
        print(new_w / HEIGHT)
        print(new_w, HEIGHT)
        print("---")
        img_resized = img.resize((new_w, HEIGHT), Image.Resampling.LANCZOS)
        img_resized.save(dst_path, FORMAT, quality=90)
