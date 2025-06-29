import { For, createSignal } from "solid-js";
import { Portal } from 'solid-js/web';
import { arrow, autoUpdate, FloatingArrow, offset, useFloating } from "@floating-ui/solid";

function Tooltip(props: { label: string; color: string; placement: "top" | "right" | "bottom" | "left" }) {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();

  const floating = useFloating({
    placement: () => props.placement,
    open: true,
    // Using the getter syntax from your working example
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl(),
    }),
    // Using the getter syntax from your working example
    middleware: () => [
      offset(10),
      arrow({ element: arrowEl()! }),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <>
      <div
        ref={setReferenceEl}
        style={{
          padding: "15px",
          'background-color': "#f8f9fa",
          border: "2px solid #dee2e6",
          'border-radius': "4px",
          'text-align': "center",
          'font-weight': "bold",
        }}
      >
        {props.label}
      </div>

      <Portal>
        <div
          ref={setFloatingEl}
          style={floating.floatingStyles}
        >
          <div
            style={`
              background-color: ${props.color};
              color: white;
              padding: 10px 15px;
              border-radius: 4px;
              font-size: 13px;
              z-index: 1000;
            `}
          >
            {props.placement} tooltip
            <FloatingArrow ref={setArrowEl} context={floating.context} fill={props.color} />
          </div>
        </div>
      </Portal>
    </>
  );
}


export function MultipleArrow() {
  const examples: {
    placement: "top" | "right" | "bottom" | "left";
    color:     string;
    label:     string;
  }[] = [
    { placement: "top",    color: "#007bff", label: "Blue Top"     },
    { placement: "right",  color: "#28a745", label: "Green Right"  },
    { placement: "bottom", color: "#ffc107", label: "Yellow Bottom"},
    { placement: "left",   color: "#dc3545", label: "Red Left"     },
  ];

  return (
    <div style={{ padding: "100px", display: "grid", "grid-template-columns": "1fr 1fr", gap: "100px" }}>
      <For each={examples}>
        {(ex) => <Tooltip {...ex} />}
      </For>
    </div>
  );
}
