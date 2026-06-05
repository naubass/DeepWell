import streamlit as st
import pandas as pd
import plotly.express as px
import warnings
warnings.filterwarnings('ignore')

# Config
st.set_page_config(page_title="DeepWell Analytics", page_icon="🌿", layout="wide")

# Load Data
@st.cache_data
def load_data():
    try:
        df_mental = pd.read_csv('data/teen_mental_health_clean.csv')
        df_sleep = pd.read_csv('data/sleep_health_clean.csv')
        return df_mental, df_sleep
    except FileNotFoundError:
        st.error("⚠️ Error: Dataset file not found. Please verify the file path. / Kesalahan: File dataset tidak ditemukan. Harap periksa path direktori Anda.")
        return pd.DataFrame(), pd.DataFrame()

df_mental, df_sleep = load_data()

# Sidebar: Fitur Bahasa & Navigasi
st.sidebar.image("https://cdn-icons-png.flaticon.com/512/2854/2854194.png", width=80)
lang = st.sidebar.radio("🌐 Language / Bahasa", ["Indonesia", "English"])
is_id = lang == "Indonesia"

st.sidebar.markdown("---")
st.sidebar.markdown(f"**{'Navigasi Analitik:' if is_id else 'Analytics Navigation:'}**")
page = st.sidebar.radio("Menu", [
    "🌟 Overview" if is_id else "🌟 Overview",
    "📊 Eksplorasi Data (EDA)" if is_id else "📊 Exploratory Data (EDA)",
    "🧪 Validasi (A/B Test)" if is_id else "🧪 Pre-Validation (A/B Test)"
])

# ==========================================
# HALAMAN 1: OVERVIEW & KPI
# ==========================================
if page.startswith("🌟"):
    st.title("DeepWell: " + ("Kehidupan Sehat & Kesejahteraan" if is_id else "Healthy Lives & Well-being"))
    st.markdown("Dashboard analitik pendukung AI untuk menganalisis korelasi gaya hidup dan kesehatan mental." if is_id else "AI-supporting analytics dashboard to analyze the correlation between lifestyle and mental health.")
    
    st.markdown("---")
    
    # Fitur Metrik Menarik (KPI)
    st.subheader("Key Performance Indicators (KPI)" if not is_id else "Indikator Utama (KPI)")
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Teen Data", f"{len(df_mental)}", "Rows")
    col2.metric("Total Adult Data", f"{len(df_sleep)}", "Rows")
    col3.metric("Avg Teen Stress", f"{df_mental['stress_level'].mean():.2f}", "-0.2 (Mock Delta)")
    col4.metric("Avg Adult Stress", f"{df_sleep['Stress Level'].mean():.2f}", "-0.5 (Mock Delta)")

    st.markdown("---")
    
    # Tabel
    st.info("📋 Teen Mental Health Dataset" if not is_id else "📋 Dataset Kesehatan Mental Remaja")
    st.dataframe(df_mental.head(10), use_container_width=True)
    
    st.write("")
    
    st.success("📋 Adult Sleep Health Dataset" if not is_id else "📋 Dataset Kesehatan Tidur Dewasa")
    st.dataframe(df_sleep.head(10), use_container_width=True)

    st.markdown("---")
    
    # Download Dataset & Ringkasan Statistik
    st.subheader("Ekspor & Ringkasan Data" if is_id else "Data Export & Summary")
    
    @st.cache_data
    def convert_df(df):
        return df.to_csv(index=False).encode('utf-8')

    csv_mental = convert_df(df_mental)
    csv_sleep = convert_df(df_sleep)

    col_btn1, col_btn2 = st.columns(2)
    with col_btn1:
        st.download_button(
            label="📥 Download Data Remaja (CSV)" if is_id else "📥 Download Teen Data (CSV)",
            data=csv_mental,
            file_name='teen_mental_health_clean.csv',
            mime='text/csv',
        )
    with col_btn2:
        st.download_button(
            label="📥 Download Data Dewasa (CSV)" if is_id else "📥 Download Adult Data (CSV)",
            data=csv_sleep,
            file_name='sleep_health_clean.csv',
            mime='text/csv',
        )
        
    st.write("")
    with st.expander("📈 Lihat Ringkasan Statistik" if is_id else "📈 View Statistical Summary"):
        st.write("**Teen Mental Health:**")
        st.dataframe(df_mental.describe(), use_container_width=True)
        st.write("**Adult Sleep Health:**")
        st.dataframe(df_sleep.describe(), use_container_width=True)

# ==========================================
# HALAMAN 2: EDA & GRAFIK INTERAKTIF
# ==========================================
elif page.startswith("📊"):
    st.title("📊 " + ("Eksplorasi Data Analitik" if is_id else "Exploratory Data Analysis"))
    
    # Fitur: Slider Filter Data
    st.sidebar.markdown("---")
    st.sidebar.markdown(f"**{'🎛️ Filter Data Interaktif' if is_id else '🎛️ Interactive Filter'}**")
    
    min_sleep, max_sleep = float(df_sleep['Sleep Duration'].min()), float(df_sleep['Sleep Duration'].max())
    sleep_filter = st.sidebar.slider(
        "Filter Durasi Tidur (Jam)" if is_id else "Filter Sleep Duration (Hours)",
        min_value=min_sleep, max_value=max_sleep, value=(min_sleep, max_sleep)
    )
    
    df_sleep_filtered = df_sleep[(df_sleep['Sleep Duration'] >= sleep_filter[0]) & (df_sleep['Sleep Duration'] <= sleep_filter[1])]

    # Fitur: Heatmap
    tab1, tab2, tab3 = st.tabs([
        "Mental Health (Teen)", 
        "Sleep Health (Adult)", 
        "Heatmap Korelasi" if is_id else "Correlation Heatmap"
    ])
    
    with tab1:
        st.subheader("Distribusi Stres vs Aktivitas Fisik" if is_id else "Stress Distribution vs Physical Activity")
        # Plotly Boxplot
        fig1 = px.box(df_mental, x='physical_activity', y='stress_level', 
                      color='physical_activity',
                      labels={'physical_activity': 'Aktivitas Fisik' if is_id else 'Physical Activity',
                              'stress_level': 'Tingkat Stres' if is_id else 'Stress Level'})
        st.plotly_chart(fig1, use_container_width=True)
        st.caption("💡 *Tip: Hover over the boxplot to see exact medians and quartiles!*" if not is_id else "💡 *Tips: Arahkan kursor ke grafik untuk melihat nilai pasti median dan kuartil!*")
            
    with tab2:
        st.subheader("Korelasi Durasi Tidur terhadap Stres" if is_id else "Correlation Between Sleep Duration and Stress")
        # Plotly Scatter
        fig2 = px.scatter(df_sleep_filtered, x='Sleep Duration', y='Stress Level', 
                          color='Stress Level', size='Sleep Duration',
                          color_continuous_scale='RdYlGn_r',
                          labels={'Sleep Duration': 'Durasi Tidur (Jam)' if is_id else 'Sleep Duration (Hours)',
                                  'Stress Level': 'Tingkat Stres' if is_id else 'Stress Level'})
        st.plotly_chart(fig2, use_container_width=True)

    with tab3:
        st.subheader("Matriks Korelasi (Data Remaja)" if is_id else "Correlation Matrix (Teen Data)")
        st.markdown("Melihat seberapa kuat hubungan antar variabel numerik." if is_id else "Observing the strength of relationships between numeric variables.")

        numeric_df = df_mental.select_dtypes(include=['float64', 'int64'])
        if not numeric_df.empty:
            corr_matrix = numeric_df.corr()
            fig_heat = px.imshow(corr_matrix, text_auto=True, aspect="auto", color_continuous_scale='RdBu_r')
            st.plotly_chart(fig_heat, use_container_width=True)
        else:
            st.warning("Data numerik tidak cukup untuk membuat heatmap." if is_id else "Not enough numeric data to generate heatmap.")

# ==========================================
# HALAMAN 3: A/B TESTING 
# ==========================================
elif page.startswith("🧪"):
    st.title("🧪 " + ("Validasi Sistem (A/B Testing)" if is_id else "System Validation (A/B Testing)"))
    st.markdown("Statistik pembuktian intervensi AI beserta visualisasi perbandingan rata-rata tingkat stres." if is_id else "Statistical proof of AI interventions along with mean stress level comparison visualizations.")
    
    st.divider()

    col_test1, col_test2 = st.columns(2)

    with col_test1:
        st.subheader("Uji 1: Aktivitas Fisik" if is_id else "Test 1: Physical Activity")
        st.markdown(f"""
        * **Group A (Active):** 5.38
        * **Group B (Inactive):** 5.52
        * **P-Value:** `0.21981` ({"Gagal Menolak H0" if is_id else "Failed to Reject H0"})
        """)
        
        df_ab1 = pd.DataFrame({
            'Grup' if is_id else 'Group': ['A (Aktif)' if is_id else 'A (Active)', 'B (Jarang)' if is_id else 'B (Inactive)'],
            'Stres Rata-rata' if is_id else 'Mean Stress': [5.38, 5.52]
        })
        fig_ab1 = px.bar(df_ab1, x='Grup' if is_id else 'Group', y='Stres Rata-rata' if is_id else 'Mean Stress', 
                         color='Grup' if is_id else 'Group', 
                         color_discrete_sequence=['#636EFA', '#EF553B'], text_auto='.2f')
        fig_ab1.update_layout(showlegend=False, margin=dict(t=30, b=0, l=0, r=0), height=300)
        st.plotly_chart(fig_ab1, use_container_width=True)

        st.warning("⚠️ **Insight:** " + ("Olahraga saja tidak cukup signifikan menurunkan stres." if is_id else "Exercise alone is not significant enough to reduce stress."))
    
    with col_test2:
        st.subheader("Uji 2: Durasi Tidur" if is_id else "Test 2: Sleep Duration")
        st.markdown(f"""
        * **Group A (> 7 hrs):** 5.59
        * **Group B (≤ 7 hrs):** 7.56
        * **P-Value:** `0.00000` ({"H0 Ditolak" if is_id else "H0 Rejected"})
        """)

        df_ab2 = pd.DataFrame({
            'Grup' if is_id else 'Group': ['A (> 7 Jam)' if is_id else 'A (> 7 hrs)', 'B (≤ 7 Jam)' if is_id else 'B (≤ 7 hrs)'],
            'Stres Rata-rata' if is_id else 'Mean Stress': [5.59, 7.56]
        })
        fig_ab2 = px.bar(df_ab2, x='Grup' if is_id else 'Group', y='Stres Rata-rata' if is_id else 'Mean Stress', 
                         color='Grup' if is_id else 'Group', 
                         color_discrete_sequence=['#00CC96', '#AB63FA'], text_auto='.2f')
        fig_ab2.update_layout(showlegend=False, margin=dict(t=30, b=0, l=0, r=0), height=300)
        st.plotly_chart(fig_ab2, use_container_width=True)

        st.success("🎯 **Insight:** " + ("Tidur cukup terbukti secara absolut menurunkan stres. AI wajib fokus ke rekomendasi tidur!" if is_id else "Adequate sleep is proven to reduce stress. AI must focus on sleep recommendations!"))