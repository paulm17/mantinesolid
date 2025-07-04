declare function getDocument(element?: Element | null): Document;
declare function activeElement(doc: Document): Element;
declare function createAttribute(name: string): string;
declare function contains(parent?: Element | null, child?: Element | null): boolean;
declare function isVirtualPointerEvent(event: PointerEvent): boolean;
declare function getTarget(event: Event): EventTarget;
declare function isEventTargetWithin(event: Event, node: Node | null | undefined): boolean;
declare function isRootElement(element: Element): boolean;
declare function isMouseLikePointerType(pointerType: string | undefined, strict?: boolean): boolean;
export { getDocument, activeElement, createAttribute, contains, isVirtualPointerEvent, getTarget, isEventTargetWithin, isRootElement, isMouseLikePointerType, };
