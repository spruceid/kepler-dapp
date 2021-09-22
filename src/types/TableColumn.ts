import type { SvelteComponent } from 'svelte/internal';

export type TableColumn = {
  /**
   * Object with informations about the header
   */
  header?: {
    /**
     * Column ID
     */
    id: string;

    /**
     * Text to be displayed in the header
     */
    title: string;

    /**
     * Whether the table can be sorted by this column
     */
    allowSorting?: boolean;

    /**
     * HTML attributes to be applied to the header
     */
    options?: {
      /**
       * Additional classes to be applied to the header
       */
      class: string;
      /**
       * If true override default attributes,
       * defaults to false
       */
      override?: boolean;
    };
  };

  /**
   * Optional custom comparator to use for sorting the elements
   */
  comparator?: (a: any, b: any) => number;

  /**
   * path to access the object value, if not found
   * path will be used as label for the field
   * eg: path.to.my.value
   */
  path: string;

  /**
   * Function used to pass arguments to a custom
   * element during renderer
   */
  options?: (content, index: number) => {};

  /**
   * Function used to apply changes to the content
   * yet to be rendered.
   */
  transform?: (content, index: number) => string | number | boolean;

  /**
   * Custom component to be used to render the
   * column content, if none passed a simple
   * div with the content will be shown
   */
  component?: typeof SvelteComponent;
};
