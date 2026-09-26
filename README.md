# Thư Viện Tiểu Thuyết

Trang web tĩnh (HTML/CSS/JS thuần, không cần build) để đăng tải và đọc tiểu thuyết dài kỳ.

## Cấu trúc thư mục

```
index.html              trang chủ, liệt kê tất cả tiểu thuyết
novel.html               trang mục lục chương của một tiểu thuyết
chapter.html             trang đọc nội dung một chương
css/style.css            toàn bộ giao diện
js/app.js                logic tải dữ liệu và render các trang
data/novels.json          "cơ sở dữ liệu" — danh sách tiểu thuyết + chương
data/chapters/<slug>/<id>.txt   nội dung từng chương (văn bản thuần)
```

## Thêm một tiểu thuyết mới

1. Tạo thư mục `data/chapters/ten-tieu-thuyet/`.
2. Với mỗi chương, tạo một file `.txt`, mỗi đoạn văn cách nhau bằng **một dòng trống**.
3. Mở `data/novels.json`, thêm một object mới vào mảng `novels`:

```json
{
  "slug": "ten-tieu-thuyet",
  "title": "Tên hiển thị",
  "author": "Tên tác giả",
  "description": "Mô tả ngắn.",
  "cover_color": "#8B3A3A",
  "status": "Đang ra chương",
  "chapters": [
    { "id": 1, "title": "Chương 1: ...", "file": "ten-tieu-thuyet/1.txt" }
  ]
}
```

`slug` phải là duy nhất và không dấu, không khoảng trắng (dùng dấu gạch ngang). Không cần sửa bất kỳ file HTML/JS nào — trang sẽ tự đọc `novels.json`.

## Chạy thử ở máy local

Vì trang dùng `fetch()` để tải JSON/txt, bạn cần chạy qua một server local (mở trực tiếp file `index.html` bằng `file://` sẽ không tải được dữ liệu). Ví dụ:

```bash
npx serve .
# hoặc
python3 -m http.server 8000
```

Rồi mở `http://localhost:8000` (hoặc cổng mà serve báo).

## Đưa lên GitHub

```bash
cd novel-site
git init
git add .
git commit -m "Khởi tạo trang thư viện tiểu thuyết"
git branch -M main
git remote add origin https://github.com/<ten-tai-khoan>/<ten-repo>.git
git push -u origin main
```

(Tạo repo trống trên GitHub trước — vào github.com → New repository — rồi copy URL vào lệnh `remote add` ở trên.)

## Deploy bằng Vercel

**Cách 1 — qua giao diện web (khuyên dùng, không cần cài gì):**
1. Vào [vercel.com](https://vercel.com), đăng nhập bằng tài khoản GitHub.
2. Bấm **Add New → Project**.
3. Chọn repo `novel-site` vừa push.
4. Ở phần *Framework Preset*, chọn **Other** (đây là site tĩnh, không cần build command hay output directory nào đặc biệt — để trống).
5. Bấm **Deploy**. Sau khoảng 30 giây, Vercel cho bạn một đường link dạng `ten-repo.vercel.app`.

Từ lần sau, mỗi khi bạn `git push` lên nhánh `main`, Vercel sẽ tự động deploy lại.

**Cách 2 — qua CLI:**
```bash
npm i -g vercel
cd novel-site
vercel        # deploy thử (preview)
vercel --prod # deploy chính thức
```

## Gợi ý mở rộng sau này

- Thêm ô tìm kiếm/lọc theo tên tiểu thuyết trên trang chủ.
- Lưu tiến độ đọc (chương đang đọc dở) bằng `localStorage`.
- Thêm nút chỉnh cỡ chữ ở trang đọc chương.
- Nếu số lượng chương rất lớn, có thể tách `novels.json` thành nhiều file nhỏ theo từng tiểu thuyết.
