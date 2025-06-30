import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import StoryComponent from "./StoryComponent";
import 'solid-devtools';

import "./styles.css";

export default function App() {
  return <MantineProvider theme={theme}>
    <StoryComponent />
  </MantineProvider>;
}
