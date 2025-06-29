import { createSignal } from "solid-js";
import { arrow, autoUpdate, FloatingArrow, offset, useFloating } from "@floating-ui/solid";

export function Border() {
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
      offset(10),
      arrow({ element: arrowEl()! })
    ],
    whileElementsMounted: autoUpdate
  });

  return (
    <div style={{ padding: '50px' }}>
      <div
        ref={setReferenceEl}
        style={{
          padding: '15px',
          'background-color': '#6c757d',
          color: 'white',
          'border-radius': '4px',
          'text-align': 'center',
          width: 'fit-content'
        }}
      >
        Reference
      </div>

      <div
        ref={setFloatingEl}
        style={`
          ${floating.floatingStyles};
          background-color: white;
          color: #333;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 14px;
          z-index: 1000;
          border: 2px solid #007bff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `}
      >
        Tooltip with border
        <FloatingArrow
          ref={setArrowEl}
          context={floating.context}
          fill="white"
          stroke="#007bff"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}
