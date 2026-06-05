from pathlib import Path

import pandas as pd
import streamlit as st


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "processed" / "appointments_clean.csv"


@st.cache_data
def load_data() -> pd.DataFrame:
    return pd.read_csv(DATA_PATH, parse_dates=["scheduled_day", "appointment_day"])


def no_show_rate(series: pd.Series) -> float:
    return float(series.mean() * 100) if len(series) else 0.0


st.set_page_config(page_title="HealPoint Analytics", layout="wide")
st.title("HealPoint Analytics Dashboard")

df = load_data()

with st.sidebar:
    st.header("Filter")
    gender = st.multiselect("Gender", sorted(df["gender"].unique()), default=sorted(df["gender"].unique()))
    age_group = st.multiselect("Age Group", sorted(df["age_group"].unique()), default=sorted(df["age_group"].unique()))
    sms_received = st.multiselect("SMS Received", [0, 1], default=[0, 1])
    chronic = st.multiselect("Has Chronic Condition", [0, 1], default=[0, 1])
    neighbourhood_options = sorted(df["neighbourhood"].unique())
    neighbourhood = st.multiselect("Neighbourhood", neighbourhood_options, default=neighbourhood_options[:15])

filtered = df[
    df["gender"].isin(gender)
    & df["age_group"].isin(age_group)
    & df["sms_received"].isin(sms_received)
    & df["has_chronic_condition"].isin(chronic)
    & df["neighbourhood"].isin(neighbourhood)
]

overall_rate = no_show_rate(filtered["is_no_show"])
avg_waiting = filtered["waiting_days"].mean() if len(filtered) else 0
high_wait_rate = no_show_rate(filtered.loc[filtered["waiting_days"] > 30, "is_no_show"])

left, mid, right, last = st.columns(4)
left.metric("Total Appointment", f"{len(filtered):,}")
mid.metric("No-show Rate", f"{overall_rate:.1f}%")
right.metric("Avg Waiting Days", f"{avg_waiting:.1f}")
last.metric(">30 Days No-show", f"{high_wait_rate:.1f}%")

st.divider()

tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs(
    [
        "BQ1 Overall",
        "BQ2 Waiting Days",
        "BQ3 Age Group",
        "BQ4 Area Priority",
        "BQ5 SMS Reminder",
        "Conclusion",
    ]
)

with tab1:
    st.subheader("BQ1: Berapa tingkat no-show overall?")
    attendance = filtered["is_no_show"].map({0: "Show", 1: "No-show"}).value_counts()
    st.bar_chart(attendance)
    st.write(f"No-show rate pada data terfilter adalah **{overall_rate:.1f}%**.")

with tab2:
    st.subheader("BQ2: Apakah waiting days memengaruhi no-show?")
    wait_bins = pd.cut(
        filtered["waiting_days"],
        bins=[-1, 0, 3, 7, 14, 30, 180],
        labels=["Same day", "1-3", "4-7", "8-14", "15-30", ">30"],
    )
    wait_chart = filtered.assign(wait_bin=wait_bins).groupby("wait_bin", observed=True)["is_no_show"].mean() * 100
    st.bar_chart(wait_chart)
    st.write("Appointment dengan jeda lebih panjang perlu prioritas reminder karena cenderung memiliki risiko lebih tinggi.")

with tab3:
    st.subheader("BQ3: Kelompok usia mana yang memiliki risiko lebih tinggi?")
    age_chart = filtered.groupby("age_group")["is_no_show"].mean().sort_values(ascending=False) * 100
    st.bar_chart(age_chart)
    st.write("Segmentasi usia membantu menentukan pendekatan komunikasi reminder.")

with tab4:
    st.subheader("BQ4: Wilayah mana yang perlu diprioritaskan?")
    top_area = (
        filtered.groupby("neighbourhood")
        .agg(total=("appointment_id", "count"), no_show_rate=("is_no_show", "mean"))
        .query("total >= 20")
        .sort_values("no_show_rate", ascending=False)
        .head(10)
    )
    top_area["no_show_rate"] = top_area["no_show_rate"] * 100
    st.dataframe(top_area, use_container_width=True)
    st.bar_chart(top_area["no_show_rate"])
    st.write("Area dengan total appointment cukup besar dan no-show rate tinggi menjadi target operasional.")

with tab5:
    st.subheader("BQ5: Bagaimana status SMS reminder terhadap no-show?")
    sms_chart = filtered.groupby("sms_received")["is_no_show"].mean().rename(index={0: "No SMS", 1: "SMS"}) * 100
    gender_chart = filtered.groupby("gender")["is_no_show"].mean() * 100
    col1, col2 = st.columns(2)
    col1.bar_chart(sms_chart)
    col2.bar_chart(gender_chart)
    st.write("SMS reminder perlu dianalisis bersama waiting days agar interpretasinya tidak bias.")

with tab6:
    st.subheader("Kesimpulan")
    st.markdown(
        f"""
        - Dataset appointment menunjukkan no-show rate **{overall_rate:.1f}%** pada filter aktif.
        - `waiting_days`, `age_group`, `neighbourhood`, dan `sms_received` layak dipakai sebagai fitur model.
        - HealPoint dapat membantu admin memprioritaskan reminder untuk appointment berisiko tinggi.
        - Dataset final sudah siap dipakai AI Engineer karena target `is_no_show` tidak masuk ke fitur training.
        """
    )
    st.subheader("Sample Clean Data")
    st.dataframe(filtered.head(100), use_container_width=True)
