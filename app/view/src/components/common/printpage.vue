<template>
    <div class="print-page">
        <slot></slot>
    </div>
</template>
<script>
    import 'jquery';
    import 'printthis';
    export default {
        data () {
            return {
                option:{
                    debug: false,               // show the iframe for debugging
                    importCSS: true,            // import page CSS
                    importStyle: false,         // import style tags
                    printContainer: true,       // grab outer container as well as the contents of the selector
                    pageTitle: "",              // add title to print page
                    removeInline: false,        // remove all inline styles from print elements
                    printDelay: 0,            // variable print delay; depending on complexity a higher value may be necessary
                    header: null,               // prefix to html
                    footer: null,               // postfix to html
                    base: false ,               // preserve the BASE tag, or accept a string for the URL
                    formValues: true,           // preserve input/form values
                    canvas: false,              // copy canvas elements (experimental)
                    doctypeString: "...",       // enter a different doctype for older markup
                    removeScripts: false        // remove script tags from print content
                },
            }
        },
        methods:{
            print(){
                $(this.$el).printThis(this.option);
            }
        }
    }
</script>