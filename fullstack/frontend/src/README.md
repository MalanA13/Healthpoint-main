# HealPoint Frontend Structure

```text
src/
  main.jsx
  App.jsx
  api.js
  hooks/
    useAuth.jsx
  components/
    Header.jsx
    Footer.jsx
    MetricCard.jsx
    RiskBadge.jsx
    StatusBadge.jsx
    AppointmentCard.jsx
    DoctorCard.jsx
    FacilityCard.jsx
    RecordCard.jsx
    LoadingSpinner.jsx
    Toast.jsx
    EmptyState.jsx
    TabBar.jsx
    ErrorBoundary.jsx
  pages/
    LandingPage.jsx
    LoginPage.jsx
    RegisterPage.jsx
    UserDashboard.jsx
    AdminDashboard.jsx
  styles/
    index.css
    header.css
    landing.css
    auth.css
    dashboard.css
    components.css
```

Frontend menggunakan React Router, reusable components, JWT token dari `useAuth`, dan CSS modular berbasis design variables.
