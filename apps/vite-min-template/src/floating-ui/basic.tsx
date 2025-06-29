import { arrow, autoUpdate, flip, FloatingArrow, offset, shift, useFloating } from "@floating-ui/solid";
import { createSignal, createEffect } from "solid-js";

// Import your FloatingArrow component
// import { FloatingArrow } from "./FloatingArrow";

export function Basic() {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();
  const [isOpen, setIsOpen] = createSignal(false);

  const floating = useFloating({
    placement: 'top',
    open: isOpen,
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl()
    }),
    // KEY FIX: Make middleware reactive to arrowEl changes
    middleware: () => {
      const baseMiddleware = [
        offset(10),
        flip(),
        shift({ padding: 5 })
      ];

      // Only add arrow middleware when arrow element exists
      const currentArrowEl = arrowEl();
      if (currentArrowEl) {
        baseMiddleware.push(arrow({ element: currentArrowEl }));
      }

      return baseMiddleware;
    },
    whileElementsMounted: autoUpdate
  });

  return (
    <div style={{ padding: '50px', display: 'flex', 'flex-direction': 'column', gap: '20px' }}>
      <button
        ref={setReferenceEl}
        onClick={() => setIsOpen(!isOpen())}
        style={{
          padding: '10px 20px',
          'background-color': '#007bff',
          color: 'white',
          border: 'none',
          'border-radius': '4px',
          cursor: 'pointer',
          width: 'fit-content'
        }}
      >
        Toggle Tooltip
      </button>

      {isOpen() && (
        <div
          ref={setFloatingEl}
          style={`
            ${floating.floatingStyles};
            background-color: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
          `}
        >
          Basic tooltip with arrow
          <FloatingArrow
            ref={setArrowEl}
            context={floating.context}
            fill="#333"
            stroke="#333"
            strokeWidth={1}
          />
        </div>
      )}
    </div>
  );
}

// Alternative approach - force update after arrow is set
export function BasicAlternative() {
  const [referenceEl, setReferenceEl] = createSignal<HTMLElement>();
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement>();
  const [arrowEl, setArrowEl] = createSignal<SVGSVGElement>();
  const [isOpen, setIsOpen] = createSignal(false);

  const floating = useFloating({
    placement: 'top',
    open: isOpen,
    elements: () => ({
      reference: referenceEl(),
      floating: floatingEl()
    }),
    middleware: () => [
      offset(10),
      flip(),
      shift({ padding: 5 }),
      // Always include arrow middleware, but it will be ignored if element doesn't exist
      arrow({ element: arrowEl() || document.createElement('div') })
    ],
    whileElementsMounted: autoUpdate
  });

  // Force an update when arrow element is set
  createEffect(() => {
    const currentArrowEl = arrowEl();
    if (currentArrowEl && isOpen()) {
      // Force a position update after arrow element is available
      setTimeout(() => floating.update(), 0);
    }
  });

  const handleArrowRef = (el: SVGSVGElement) => {
    setArrowEl(el);
    // Trigger an update after the arrow is set
    if (isOpen()) {
      setTimeout(() => floating.update(), 0);
    }
  };

  return (
    <div style={{ padding: '50px', display: 'flex', 'flex-direction': 'column', gap: '20px' }}>
      <button
        ref={setReferenceEl}
        onClick={() => setIsOpen(!isOpen())}
        style={{
          padding: '10px 20px',
          'background-color': '#007bff',
          color: 'white',
          border: 'none',
          'border-radius': '4px',
          cursor: 'pointer',
          width: 'fit-content'
        }}
      >
        Toggle Tooltip (Alternative)
      </button>

      {isOpen() && (
        <div
          ref={setFloatingEl}
          style={`
            ${floating.floatingStyles};
            background-color: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
          `}
        >
          Basic tooltip with arrow
          <FloatingArrow
            ref={handleArrowRef}
            context={floating.context}
            fill="#333"
          />
        </div>
      )}
    </div>
  );
}
