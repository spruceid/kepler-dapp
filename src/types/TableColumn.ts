import type { SvelteComponent } from "svelte/internal";

export type TableColumn = {
    /**
     * Object with informations about the header
     */
    header?: {
        /**
         * Text to be displayed in the header
         */
        title: string,
        /**
         * HTML attributes to be applied to the header
         */
        options?: {
            /**
             * Additional classes to be applied to the header
             */
            class: string,
            /**
             * If true override default attributes,
             * defaults to false
             */
            override?: boolean,
        },
    };

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
    component?: SvelteComponent;
}