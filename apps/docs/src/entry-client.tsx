// @refresh reload
import { mount, StartClient } from "@solidjs/start/client"

// biome-ignore lint/style/noNonNullAssertion: #app is rendered by entry-server
mount(() => <StartClient />, document.getElementById("app")!)
