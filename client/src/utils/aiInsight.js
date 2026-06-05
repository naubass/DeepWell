// Fungsi kalkulasi AI Insight Mingguan
export function generateWeeklyInsight(history) {
    // 1. Syarat minimal 3 data
    if (!history || history.length < 3) {
        return `Kumpulkan minimal ${3 - (history?.length || 0)} data check-in lagi minggu ini untuk membuka analisis pola well-being kamu. Terus konsisten, ya!`;
    }

    // 2. Ambil maksimal 7 data terakhir
    const recentHistory = history.slice(0, 7);
    const totalDays = recentHistory.length;

    let totalScore = 0;
    let totalMental = 0;
    let totalSleep = 0;

    recentHistory.forEach(item => {
        totalScore += (item.well_being_score || 0);
        totalMental += (item.mental_health_score || 0);
        totalSleep += (item.sleep_health_score || 0);
    });

    // 3. Hitung rata-rata
    const avgScore = totalScore / totalDays;
    const avgMental = totalMental / totalDays;
    const avgSleep = totalSleep / totalDays;

    // 4. Logika Kondisional (Insight)
    if (avgScore >= 75) {
        return `Luar biasa! Selama ${totalDays} hari terakhir, kondisimu sangat stabil (Score: ${avgScore.toFixed(0)}/100). Pertahankan rutinitas tidur dan aktivitasmu saat ini karena terbukti efektif menjaga mood-mu tetap positif.`;
    }

    if (avgScore <= 50 && avgMental <= 50 && avgSleep <= 50) {
        return `⚠️ Perhatian: Dalam ${totalDays} hari terakhir, baik beban mental maupun kualitas tidurmu sedang sangat menurun (Score: ${avgScore.toFixed(0)}/100). Ini adalah tanda awal fase kelelahan ekstrem. Sangat disarankan untuk mengambil jeda istirahat penuh di akhir pekan ini.`;
    }

    // Jika skor menengah ke bawah, cari tahu mana yang lebih parah
    if (avgMental < avgSleep) {
        return `Dari data ${totalDays} hari terakhir, pola well-being kamu sedikit berfluktuasi (Rata-rata: ${avgScore.toFixed(0)}/100). Indikator Mental Health kamu relatif lebih tertekan dibandingkan tidurmu. Sepertinya ada pikiran yang menumpuk. Luangkan waktu sejenak untuk me-time hari ini.`;
    } else {
        return `Pola well-being kamu di angka rata-rata ${avgScore.toFixed(0)}/100 dalam ${totalDays} hari ini. Namun, indikator Sleep Health terlihat lebih bermasalah. Kurang tidur kronis bisa memicu burnout lho. Cobalah untuk disiplin menjauhkan layar gadget 1 jam sebelum tidur malam ini.`;
    }
}
