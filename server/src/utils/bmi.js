/**
 * Menghitung dan mengembalikan kategori BMI berdasarkan standar WHO.
 * @param {number} weightKg - Berat dalam kilogram
 * @param {number} heightCm - Tinggi dalam centimeter
 * @returns {string} Kategori BMI
 */
export const calculateBMICategory = (weightKg, heightCm) => {
    if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
        return "Normal";
    }
    
    const heightM = heightCm / 100.0;
    const bmi = weightKg / (heightM * heightM);

    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25.0) return "Normal";
    if (bmi >= 25.0 && bmi < 30.0) return "Overweight";
    return "Obese";
};