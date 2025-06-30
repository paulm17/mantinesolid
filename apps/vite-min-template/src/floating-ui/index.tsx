import { Basic } from "./basic";
import { Placements } from "./placements";
import { CustomStyling } from "./customStyling";
import { Border } from "./border";
import { Rounded } from "./rounded";
import { Interactive } from "./interactive";
import { MultipleArrow } from "./multipleArrow";
import { UseClickApp } from "./useClick";
import { UseFocusApp } from "./useFocus";
import { UseDismissApp } from "./useDismiss";
import { UseInteractionApp } from "./useInteraction";
import { UseDelayGroupApp } from "./useDelayGroup";
import { Stack } from "@mantine/core";

export default function FloatingUIApps() {
  return (
    <Stack>
      <Basic />
      <Placements />
      <CustomStyling />
      <Border />
      <Rounded />
      <Interactive />
      <MultipleArrow />
      <UseClickApp />
      <UseFocusApp />
      <UseDismissApp />
      <UseInteractionApp />
      <UseDelayGroupApp />
    </Stack>
  );
}
