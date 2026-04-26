import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  { label: "Schwarz", value: "Schwarz", hex: "#3a3a3a" },
  { label: "Gold", value: "Gold", hex: "#D4AF37" },
  { label: "Blau", value: "Blau", hex: "#1E63FF" },
  { label: "Rot", value: "Rot", hex: "#D92727" },
];

export default function FarbanfrageTheken() {
  const [selectedColor, setSelectedColor] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = selectedColor && emailRegex.test(email) && orderNumber.trim();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isValid) {
      setError("Bitte wählen Sie eine Farbe aus und füllen Sie beide Felder aus.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      to: "info@drehtechnik-reich.de",
      subject: "Neue Farbanfrage für Theke",
      selectedColor,
      customerEmail: email,
      shopifyOrderNumber: orderNumber,
      message: `Neue Farbanfrage\n\nFarbe: ${selectedColor}\nE-Mail: ${email}\nShopify Bestellnummer: ${orderNumber}`,
    };

    try {
      const WEB3FORMS_ACCESS_KEY = "673c3b9a-a708-4187-a430-d230ab01e012";
      const FORM_ENDPOINT = "https://api.web3forms.com/submit";

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Neue Farbanfrage für Theke",
          from_name: "Drehtechnik Reich Website",
          email,
          message: `Neue Farbanfrage

━━━━━━━━━━━━━━
FARBE: ${selectedColor}
E-MAIL: ${email}
BESTELLNUMMER: ${orderNumber}
━━━━━━━━━━━━━━

Diese Anfrage wurde über Ihre Website (drehtechnikreich.com) gesendet.`,
        }),
      });

      if (!response.ok) {
        throw new Error("Die Anfrage konnte nicht gesendet werden.");
      }

      setShowSuccess(true);
      setEmail("");
      setOrderNumber("");
      setSelectedColor("");
    } catch (err) {
      setError("Die Anfrage konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt per E-Mail.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section style={styles.section}>
      <div style={styles.card}>
        <div style={styles.header}>
          <p style={styles.kicker}>Farbanpassung für Ihre Theke</p>
          <h2 style={styles.title}>Wunschfarbe auswählen</h2>
          <p style={styles.subtitle}>
            Wählen Sie eine dauerhaft verfügbare Farbe für die Aluminium-Legierung Ihrer Theke aus und senden Sie uns Ihre unverbindliche Anfrage.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.colorGrid} aria-label="Farbauswahl">
            {COLORS.map((color) => {
              const active = selectedColor === color.value;
              return (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  style={{
                    ...styles.colorOption,
                    borderColor: active ? "#3a3a3a" : "#E5E5E5",
                    boxShadow: active ? "0 0 0 4px rgba(0,0,0,0.08)" : "none",
                  }}
                  aria-pressed={active}
                  aria-label={color.label}
                >
                  <span
                    style={{
                      ...styles.colorCircle,
                      background: color.hex,
                    }}
                  />
                  <span style={styles.colorLabel}>{color.label}</span>
                </button>
              );
            })}
          </div>

          {selectedColor && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={styles.selectedHint}
            >
              Ausgewählte Farbe: <strong>{selectedColor}</strong>
            </motion.div>
          )}

          <div style={styles.inputs}>
            <label style={styles.label}>
              E-Mail Adresse
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ihre E-Mail aus der Bestellung"
                required
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Shopify Bestellnummer
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="z. B. #1234"
                required
                style={styles.input}
              />
            </label>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            style={{
              ...styles.submitButton,
              opacity: !isValid || isSubmitting ? 0.55 : 1,
              cursor: !isValid || isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Anfrage wird gesendet..." : "Anfrage jetzt unverbindlich abschicken"}
          </button>
        </form>

        <p style={styles.delivery}><span style={styles.deliveryInner}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#3a3a3a" strokeWidth="2"/><path d="M12 7v5l3 2" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Lieferzeit: ca. 3 Wochen</span></p>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={styles.popup}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
            >
              <h3 style={styles.popupTitle}>Danke für Ihre Anfrage</h3>
              <p style={styles.popupText}>
                Sie erhalten eine Rückmeldung innerhalb von 24 Stunden.
              </p>
              <button style={styles.popupButton} onClick={() => setShowSuccess(false)}>
                Schließen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const styles = {
  section: {
    width: "100%",
    padding: "48px 20px",
    boxSizing: "border-box",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#3a3a3a",
  },
  card: {
    maxWidth: 760,
    margin: "0 auto",
    background: "#FFFFFF",
    border: "1px solid #ECECEC",
    borderRadius: 24,
    padding: "32px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
  },
  header: {
    textAlign: "center",
    marginBottom: 28,
  },
  kicker: {
    margin: "0 0 8px",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#777777",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "clamp(28px, 4vw, 42px)",
    lineHeight: 1.08,
    fontWeight: 700,
  },
  subtitle: {
    margin: "0 auto",
    maxWidth: 590,
    fontSize: 16,
    lineHeight: 1.6,
    color: "#555555",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 14,
  },
  colorOption: {
    appearance: "none",
    border: "2px solid #E5E5E5",
    borderRadius: 20,
    background: "#FFFFFF",
    padding: "18px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.2s ease",
  },
  colorCircle: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.12)",
  },
  colorLabel: {
    fontSize: 15,
    fontWeight: 700,
  },
  selectedHint: {
    textAlign: "center",
    background: "#F7F7F7",
    borderRadius: 16,
    padding: "12px 16px",
    fontSize: 15,
    color: "#333333",
  },
  inputs: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    fontSize: 14,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #DCDCDC",
    borderRadius: 14,
    padding: "14px 15px",
    fontSize: 16,
    outline: "none",
    background: "#FFFFFF",
  },
  submitButton: {
    width: "100%",
    border: "none",
    borderRadius: 16,
    padding: "16px 20px",
    background: "#3a3a3a",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 800,
    transition: "opacity 0.2s ease, transform 0.2s ease",
  },
  delivery: {
    margin: "24px 0 0",
    textAlign: "center",
    fontSize: 15,
    fontWeight: 700,
    color: "#444444",
  },
  deliveryInner: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  error: {
    margin: 0,
    color: "#B00020",
    fontSize: 14,
    textAlign: "center",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  popup: {
    width: "100%",
    maxWidth: 420,
    background: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    textAlign: "center",
    boxShadow: "0 24px 70px rgba(0,0,0,0.25)",
  },
  popupTitle: {
    margin: "0 0 10px",
    fontSize: 26,
    fontWeight: 800,
  },
  popupText: {
    margin: "0 0 22px",
    fontSize: 16,
    lineHeight: 1.5,
    color: "#555555",
  },
  popupButton: {
    border: "none",
    borderRadius: 14,
    padding: "13px 18px",
    background: "#3a3a3a",
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
};
