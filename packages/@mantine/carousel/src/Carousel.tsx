import { createSignal, Index, JSX, onCleanup, onMount, splitProps } from 'solid-js';
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import createEmblaCarousel from 'embla-carousel-solid';
import {
  AccordionChevron,
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getSpacing,
  MantineSpacing,
  rem,
  StyleProp,
  StylesApiProps,
  UnstyledButton,
  useDirection,
  useProps,
  useRandomClassName,
  useStyles,
} from '@mantine/core';
import { clamp } from '@mantine/hooks';
import { CarouselProvider } from './Carousel.context';
import { CarouselSlide } from './CarouselSlide/CarouselSlide';
import {
  CarouselContainerVariables,
  CarouselVariables,
} from './CarouselVariables/CarouselVariables';
import { getChevronRotation } from './get-chevron-rotation';
import classes from './Carousel.module.css';

export type CarouselStylesNames =
  | 'slide'
  | 'root'
  | 'viewport'
  | 'container'
  | 'controls'
  | 'control'
  | 'indicators'
  | 'indicator';

export type CarouselCssVariables = {
  root: '--carousel-height' | '--carousel-control-size' | '--carousel-controls-offset';
};

export interface CarouselProps
  extends BoxProps,
    StylesApiProps<CarouselFactory>,
    ElementProps<'div'> {
  /** Options passed down to embla carousel */
  emblaOptions?: EmblaOptionsType;

  /** <Carousel.Slide /> components */
  children?: JSX.Element;

  /** Called when next slide is shown */
  onNextSlide?: () => void;

  /** Called when previous slider is shown */
  onPreviousSlide?: () => void;

  /** Called with slide index when slide changes */
  onSlideChange?: (index: number) => void;

  /** Get embla API as ref */
  getEmblaApi?: (embla: EmblaCarouselType) => void;

  /** Props passed down to next control */
  nextControlProps?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;

  /** Props passed down to previous control */
  previousControlProps?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;

  /** Controls size of the next and previous controls, `26` by default */
  controlSize?: JSX.CSSProperties['width'];

  /** Controls position of the next and previous controls, key of `theme.spacing` or any valid CSS value, `'sm'` by default */
  controlsOffset?: MantineSpacing;

  /** Controls slide width based on viewport width, `'100%'` by default */
  slideSize?: StyleProp<string | number>;

  /** Key of theme.spacing or number to set gap between slides */
  slideGap?: StyleProp<MantineSpacing>;

  /** Carousel orientation, `'horizontal'` by default */
  orientation?: 'horizontal' | 'vertical';

  /** Determines type of queries used for responsive styles, `'media'` by default */
  type?: 'media' | 'container';

  /** Slides container `height`, required for vertical orientation */
  height?: JSX.CSSProperties['height'];

  /** Determines whether gap between slides should be treated as part of the slide size, `true` by default */
  includeGapInSize?: boolean;

  /** Index of initial slide */
  initialSlide?: number;

  /** Determines whether next/previous controls should be displayed, true by default */
  withControls?: boolean;

  /** Determines whether indicators should be displayed, `false` by default */
  withIndicators?: boolean;

  /** An array of embla plugins */
  plugins?: EmblaPluginType[];

  /** Icon of the next control */
  nextControlIcon?: JSX.Element;

  /** Icon of the previous control */
  previousControlIcon?: JSX.Element;

  /** Determines whether arrow key should switch slides, `true` by default */
  withKeyboardEvents?: boolean;
}

export type CarouselFactory = Factory<{
  props: CarouselProps;
  ref: HTMLDivElement;
  stylesNames: CarouselStylesNames;
  vars: CarouselCssVariables;
  staticComponents: {
    Slide: typeof CarouselSlide;
  };
}>;

const defaultProps: Partial<CarouselProps> = {
  controlSize: '26px',
  controlsOffset: 'sm',
  slideSize: '100%',
  slideGap: 0,
  orientation: 'horizontal',
  includeGapInSize: true,
  initialSlide: 0,
  withControls: true,
  withIndicators: false,
  withKeyboardEvents: true,
  type: 'media',
};

const defaultEmblaOptions: EmblaOptionsType = {
  align: 'center',
  loop: false,
  slidesToScroll: 1,
  dragFree: false,
  inViewThreshold: 0,
  skipSnaps: false,
  containScroll: 'trimSnaps',
};

const varsResolver = createVarsResolver<CarouselFactory>(
  (_, { height, controlSize, controlsOffset }) => ({
    root: {
      '--carousel-height': rem(height),
      '--carousel-control-size': rem(controlSize),
      '--carousel-controls-offset': getSpacing(controlsOffset),
    },
  })
);

export const Carousel = factory<CarouselFactory>(_props => {
  const props = useProps('Carousel', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'children',
    'getEmblaApi',
    'onNextSlide',
    'onPreviousSlide',
    'onSlideChange',
    'nextControlProps',
    'previousControlProps',
    'controlSize',
    'controlsOffset',
    'slideSize',
    'slideGap',
    'orientation',
    'height',
    'includeGapInSize',
    'draggable',
    'initialSlide',
    'withControls',
    'withIndicators',
    'plugins',
    'nextControlIcon',
    'previousControlIcon',
    'withKeyboardEvents',
    'mod',
    'type',
    'emblaOptions',
    'ref'
  ]);

  const getStyles = useStyles<CarouselFactory>({
    name: 'Carousel',
    classes,
    props,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    vars: local.vars,
    varsResolver,
  });

  const responsiveClassName = useRandomClassName();
  const { dir } = useDirection();

  const [emblaRefElement, emblaApi] = createEmblaCarousel(
    () => ({
      axis: local.orientation === 'horizontal' ? 'x' : 'y',
      direction: local.orientation === 'horizontal' ? dir : undefined,
      startIndex: local.initialSlide,
      ...defaultEmblaOptions,
      ...local.emblaOptions,
    }),
    () => local.plugins || []
  );

  const [selected, setSelected] = createSignal(0);
  const [slidesCount, setSlidesCount] = createSignal(0);

  const handleScroll = (index: number) => {
    const embla = emblaApi();
    return embla && embla.scrollTo(index);
  };

  const handleSelect = () => {
    const embla = emblaApi();

    if (!embla) {
      return;
    }
    const slide = embla.selectedScrollSnap();
    setSelected(slide);
    slide !== selected() && local.onSlideChange?.(slide);
  };

  const handlePrevious = () => {
    const embla = emblaApi();
    embla?.scrollPrev();
    local.onPreviousSlide?.();
  };

  const handleNext = () => {
    const embla = emblaApi();

    embla?.scrollNext();
    local.onNextSlide?.();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (local.withKeyboardEvents) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      }
    }
  };

  onMount(() => {
    const embla = emblaApi();
    if (embla) {
      local.getEmblaApi?.(embla);
      handleSelect();
      setSlidesCount(embla.scrollSnapList().length);
      embla.on('select', handleSelect);

      onCleanup(() => {
        embla.off('select', handleSelect);
      });
    }
  });

  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    const embla = emblaApi();
    if (embla) {
      local.getEmblaApi?.(embla);
      handleSelect();
      setSlidesCount(embla.scrollSnapList().length);
      embla.on('select', handleSelect);

      const observer = new MutationObserver(() => {
        embla.reInit();
        const count = embla.scrollSnapList().length;
        setSlidesCount(count);
        setSelected((currentSelected) => clamp(currentSelected, 0, count > 0 ? count - 1 : 0));
      });

      if (containerRef) {
        observer.observe(containerRef, { childList: true });
      }

      onCleanup(() => {
        embla.off('select', handleSelect);
        observer.disconnect();
      });
    }
  });

  const canScrollPrev = () => emblaApi()?.canScrollPrev() || false;
  const canScrollNext = () => emblaApi()?.canScrollNext() || false;

  const indicators = () => (
    <Index each={Array(slidesCount()).fill(0)}>
      {(_, index) => (
        <UnstyledButton
          {...getStyles('indicator')}
          data-active={index === selected() || undefined}
          aria-hidden
          tabIndex={-1}
          onClick={() => handleScroll(index)}
          data-orientation={local.orientation}
          onMouseDown={(event) => event.preventDefault()}
        />
      )}
    </Index>
  );

  return (
    <CarouselProvider value={{ getStyles, orientation: local.orientation }}>
      {local.type === 'container' ? (
        <CarouselContainerVariables {...props} selector={`.${responsiveClassName}`} />
      ) : (
        <CarouselVariables {...props} selector={`.${responsiveClassName}`} />
      )}

      <Box
        ref={local.ref}
        {...getStyles('root', { className: responsiveClassName })}
        {...others}
        mod={[{ orientation: local.orientation, 'include-gap-in-size': local.includeGapInSize }, local.mod]}
        onKeyDown={handleKeydown}
      >
        <div {...getStyles('viewport')} ref={emblaRefElement} data-type={local.type}>
          <div
            {...getStyles('container', { className: responsiveClassName })}
            data-orientation={local.orientation}
            ref={containerRef}
          >
            {local.children}
          </div>
        </div>

        {local.withIndicators && (
          <div {...getStyles('indicators')} data-orientation={local.orientation}>
            {indicators()}
          </div>
        )}

        {local.withControls && (
          <div {...getStyles('controls')} data-orientation={local.orientation}>
            <UnstyledButton
              {...local.previousControlProps}
              {...getStyles('control', {
                className: local.previousControlProps?.class,
                style: local.previousControlProps?.style as any,
              })}
              onClick={(event) => {
                handlePrevious();
                typeof local.previousControlProps?.onClick === "function" && local.previousControlProps?.onClick?.(event);
              }}
              data-inactive={!canScrollPrev() || undefined}
              tabIndex={canScrollPrev() ? 0 : -1}
            >
              {typeof local.previousControlIcon !== 'undefined' ? (
                local.previousControlIcon
              ) : (
                <AccordionChevron
                  style={{
                    transform: `rotate(${getChevronRotation({
                      dir,
                      orientation: local.orientation,
                      direction: 'previous',
                    })}deg)`,
                  }}
                />
              )}
            </UnstyledButton>

            <UnstyledButton
              {...local.nextControlProps}
              {...getStyles('control', {
                className: local.nextControlProps?.class,
                style: local.previousControlProps?.style as any,
              })}
              onClick={(event) => {
                handleNext();
                typeof local.nextControlProps?.onClick === "function" && local.nextControlProps?.onClick?.(event);
              }}
              data-inactive={!canScrollNext() || undefined}
              tabIndex={canScrollNext() ? 0 : -1}
            >
              {typeof local.nextControlIcon !== 'undefined' ? (
                local.nextControlIcon
              ) : (
                <AccordionChevron
                  style={{
                    transform: `rotate(${getChevronRotation({
                      dir,
                      orientation: local.orientation,
                      direction: 'next',
                    })}deg)`,
                  }}
                />
              )}
            </UnstyledButton>
          </div>
        )}
      </Box>
    </CarouselProvider>
  );
});

Carousel.classes = classes;
Carousel.displayName = '@mantine/carousel/Carousel';
Carousel.Slide = CarouselSlide;
