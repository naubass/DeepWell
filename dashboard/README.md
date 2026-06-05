# 🌿 DeepWell Analytics Dashboard

![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=Streamlit&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Plotly](https://img.shields.io/badge/Plotly-239120?style=for-the-badge&logo=plotly&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)

DeepWell Analytics adalah dashboard interaktif berbasis web yang dibangun untuk menganalisis korelasi antara gaya hidup, durasi tidur, aktivitas fisik, dan dampaknya terhadap tingkat stres atau kesehatan mental. Dashboard ini berfungsi sebagai fondasi analitik dan validasi statistik (A/B Testing) sebelum rekomendasi diimplementasikan pada sistem AI DeepWell.

## ✨ Fitur Utama

- **🌐 Multilingual Support:** Mendukung Bahasa Indonesia dan Bahasa Inggris yang dapat diubah secara _real-time_.
- **📊 Interactive Exploratory Data Analysis (EDA):** Visualisasi data yang dinamis menggunakan Plotly, termasuk _Boxplot_, _Scatter Plot_, dan matriks korelasi (_Heatmap_).
- **🎛️ Dynamic Filtering:** Fitur _slider_ interaktif pada _sidebar_ untuk menyaring dataset berdasarkan rentang durasi tidur pengguna.
- **🧪 A/B Testing Validation:** Validasi statistik untuk membuktikan hipotesis intervensi kesehatan (Olahraga vs Durasi Tidur) beserta visualisasi perbandingan rata-rata stres.
- **📥 Data Export & Summary:** Kemampuan untuk mengunduh dataset yang telah dibersihkan (CSV) dan melihat ringkasan statistik deskriptif secara langsung.

## 📁 Struktur Direktori

Pastikan struktur folder Anda terlihat seperti ini:

```text
dashboard/
├── .venv/                       # Virtual environment (hanya di lokal)
├── data/                        # Folder penyimpan dataset
│   ├── sleep_health_clean.csv
│   └── teen_mental_health_clean.csv
├── README.md                    # Dokumentasi proyek
├── app.py                       # File utama aplikasi Streamlit
└── requirements.txt             # Daftar library Python yang dibutuhkan
```

## 🚀 Cara Menjalankan di Komputer Lokal (Localhost)

Ikuti langkah-langkah di bawah ini untuk menjalankan dashboard di komputer Anda:

**1. Clone atau Buka Folder Proyek**
Buka terminal (Git Bash/Command Prompt) dan arahkan ke direktori proyek:

```bash
cd path/to/dashboard
```

**2. Buat Virtual Environment**
Sangat disarankan menggunakan virtual environment untuk menghindari konflik versi library:

```bash
python -m venv .venv
```

**3. Aktifkan Virtual Environment**

- Untuk pengguna Windows (Git Bash/CMD):
  ```bash
  source .venv/Scripts/activate
  ```
- Untuk pengguna Linux / macOS:
  ```bash
  source .venv/bin/activate
  ```

**4. Install Dependensi (Library)**
Instal semua library yang dibutuhkan melalui `requirements.txt`:

```bash
pip install -r requirements.txt
```

**5. Jalankan Aplikasi**
Eksekusi perintah Streamlit untuk menyalakan server lokal:

```bash
streamlit run app.py
```

Aplikasi akan otomatis terbuka di browser Anda melalui alamat `http://localhost:8501`.

## ☁️ Cara Deploy ke Streamlit Cloud

Untuk membuat dashboard ini bisa diakses secara publik, ikuti langkah ini:

1. Buat akun dan login ke [GitHub](https://github.com).
2. Buat repository baru, lalu _push_ file `app.py`, `requirements.txt`, dan kedua file `.csv` ke repository tersebut. Pastikan folder `.venv` tidak ikut ter-_push_ (gunakan `.gitignore`).
3. Buat akun dan login ke [Streamlit Community Cloud](https://share.streamlit.io/).
4. Klik tombol **"New app"** dan hubungkan akun GitHub Anda.
5. Pilih repository proyek DeepWell ini, tentukan _branch_ utama (biasanya `main` atau `master`), dan atur _Main file path_ menjadi `app.py`.
6. Klik **"Deploy!"** dan tunggu beberapa menit hingga proses _build_ selesai. URL publik siap dibagikan!
