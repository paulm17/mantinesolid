import { arrow, autoUpdate, FloatingArrow, offset, useFloating } from "@floating-ui/solid";
import { createSignal } from "solid-js";

export function CustomStyling() {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();

  const floating = useFloating({
    placement: 'bottom',
    open: true,
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl()
    }),
    middleware: () => [
      offset(15),
      arrow({ element: arrowEl()! })
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <div style={{ padding: '50px', display: 'flex', gap: '50px', 'flex-wrap': 'wrap' }}>
      {/* Large button */}
      <div>
        <div
          ref={setReferenceEl}
          style={{
            padding: '15px',
            'background-color': '#007bff',
            color: 'white',
            'border-radius': '8px',
            'text-align': 'center',
            'margin-bottom': '20px'
          }}
        >
          Large Button
        </div>

        <div
          ref={setFloatingEl}
          style={`
            ${floating.floatingStyles};
            background-color: #28a745;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 16px;
            z-index: 1000;
          `}
        >
          Custom large arrow
          <FloatingArrow
            ref={setArrowEl}
            context={floating.context}
            width={24}
            height={12}
            fill="#28a745"
          />
        </div>
      </div>
    </div>
  );
}
