# Primary Dataset

*sleep\_health\_clean.csv*  
Dataset utama ini digunakan sebagai fondasi analisis untuk memetakan hubungan langsung antara variabel gaya hidup seperti durasi tidur, kualitas tidur, dan aktivitas fisik terhadap fluktuasi tingkat stres pengguna.

| Nama Kolom | Tipe Data | Penjelasan |
| :---: | :---: | ----- |
| **Gender** | Kategorikal | Jenis kelamin responden (Male, Female, dll). |
| **Age** | Numerik | Usia responden dalam satuan tahun. |
| **Occupation** | Kategorikal | Profesi atau pekerjaan responden. |
| **Sleep Duration** | Numerik | Rata-rata durasi tidur harian dalam satuan jam (contoh: 6.5, 7.0). |
| **Quality of Sleep** | Numerik | Penilaian subjektif kualitas tidur dengan skala 1-10. |
| **Physical Activity** | Numerik | Rata-rata durasi aktivitas fisik per hari dalam satuan menit. |
| **Stress Level** | Ordinal (Target) | Target prediksi model AI. Skala telah diharmonisasi: **0 (Low)**, **1 (Medium)**, dan **2 (High)**. |
| **BMI Category** | Kategorikal | Indeks Massa Tubuh. Kategori telah diseragamkan menjadi: *normal*, *overweight*, dan *obese*. |
| **Heart Rate** | Numerik | Rata-rata detak jantung saat istirahat (BPM \- *Beats Per Minute*). |
| **Daily Steps** | Numerik | Jumlah rata-rata langkah kaki per hari. |
| **Sleep Disorder** | Kategorikal | Diagnosis gangguan tidur (contoh: *none*, *insomnia*, *sleep apnea*). |
| **BP\_Systolic** | Numerik | Angka atas pada tekanan darah (Sistolik). |
| **BP\_Diastolic** | Numerik | Angka bawah pada tekanan darah (Diastolik). |

# Supplementary Dataset

*mental\_health\_clean.csv*  
Dataset ini digunakan untuk memperkaya konteks faktor gaya hidup dan kondisi mental.

| Nama Kolom | Tipe Data | Penjelasan |
| :---: | :---: | ----- |
| **Age** | Numerik | Usia responden dalam satuan tahun. |
| **Gender** | Kategorikal | Jenis kelamin responden. |
| **Exercise Level** | Kategorikal | Kategori intensitas aktivitas fisik (contoh: *low*, *moderate*, *high*). |
| **Diet Type** | Kategorikal | Pola makan atau diet responden (contoh: *balanced*, *junk food*, *vegan*). |
| **Sleep Hours** | Numerik | Rata-rata durasi tidur harian dalam satuan jam. |
| **Stress Level** | Ordinal (Target) | Tingkat stres yang telah diharmonisasi: **0 (Low)**, **1 (Medium)**, dan **2 (High)**. |
| **Mental Health Condition** | Kategorikal | Diagnosis kondisi psikologis (contoh: *anxiety*, *depression*, *bipolar*). |
| **Work Hours per Week** | Numerik | Total jam kerja responden dalam satu minggu. |
| **Screen Time per Day (Hours)** | Numerik | Rata-rata durasi menatap layar gawai per hari dalam jam. |
| **Social Interaction Score** | Numerik | Skor penilaian tingkat interaksi sosial harian. |
| **Happiness Score** | Numerik | Skor subjektif tingkat kebahagiaan responden. |

# Reference Dataset

*student\_stress\_clean.csv*  
Dataset ini digunakan sebagai referensi perbandingan distribusi *balanced data*. 

| Nama Kolom | Tipe Data | Penjelasan |
| :---: | :---: | ----- |
| **anxiety\_level** | Numerik | Metrik yang mengukur tingkat kecemasan responden. |
| **self\_esteem** | Numerik | Metrik yang mengukur tingkat kepercayaan diri. |
| **mental\_health\_history** | Kategorikal | Indikator biner riwayat gangguan mental (biasanya 0 \= Tidak ada, 1 \= Ada). |
| **depression** | Numerik | Metrik indikasi tingkat depresi. |
| **headache** | Numerik | Indikator frekuensi atau tingkat keparahan sakit kepala. |
| **blood\_pressure** | Numerik | Skor indikasi tekanan darah responden. |
| **sleep\_quality** | Numerik | Metrik penilaian kualitas tidur. |
| **breathing\_problem** | Numerik | Indikator adanya masalah atau gangguan pernapasan. |
| **noise\_level** | Numerik | Tingkat paparan kebisingan di lingkungan responden. |
| **living\_conditions** | Numerik | Penilaian kualitas kondisi tempat tinggal responden. |
| **safety** | Numerik | Penilaian perasaan aman di lingkungan sekitar. |
| **basic\_needs** | Numerik | Indikator pemenuhan kebutuhan dasar sehari-hari. |
| **social\_support** | Numerik | Tingkat dukungan sosial yang diterima dari lingkungan terdekat. |
| **stress\_level** | Ordinal (Target) | Tingkat stres yang telah diharmonisasi: **0 (Low)**, **1 (Medium)**, dan **2 (High)**. |

