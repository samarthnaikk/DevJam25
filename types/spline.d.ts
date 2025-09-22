declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      url?: string;
      'loading-anim-type'?: string;
      'data-no-watermark'?: string;
    };
  }
}
