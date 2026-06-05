import React from "react";
import EmptyState from "./EmptyState.jsx";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <EmptyState
          title="Terjadi masalah pada tampilan"
          description="Muat ulang halaman atau kembali ke dashboard untuk melanjutkan."
          actionLabel="Reload"
          onAction={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
