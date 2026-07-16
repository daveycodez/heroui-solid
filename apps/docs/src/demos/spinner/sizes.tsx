import { Spinner } from "heroui-solid"

export function SpinnerSizes() {
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
        <Spinner size="sm" />
        <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
          Small
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
        <Spinner size="md" />
        <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
          Medium
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
        <Spinner size="lg" />
        <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
          Large
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
        <Spinner size="xl" />
        <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
          Extra Large
        </span>
      </div>
    </>
  )
}
