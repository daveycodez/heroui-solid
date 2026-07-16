import { Spinner } from "heroui-solid"

export function SpinnerColors() {
  return (
    <>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          gap: "0.5rem"
        }}
      >
        <Spinner color="current" />
        <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
          Current
        </span>
      </div>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          gap: "0.5rem"
        }}
      >
        <Spinner color="accent" />
        <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
          Accent
        </span>
      </div>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          gap: "0.5rem"
        }}
      >
        <Spinner color="success" />
        <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
          Success
        </span>
      </div>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          gap: "0.5rem"
        }}
      >
        <Spinner color="warning" />
        <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
          Warning
        </span>
      </div>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          gap: "0.5rem"
        }}
      >
        <Spinner color="danger" />
        <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
          Danger
        </span>
      </div>
    </>
  )
}
