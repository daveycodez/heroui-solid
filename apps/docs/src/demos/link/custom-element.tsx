import { Link } from "heroui-solid"

export function LinkCustomElement() {
  return (
    <Link as="button" onClick={() => alert("Link activated!")} type="button">
      Link-styled button
      <Link.Icon />
    </Link>
  )
}
