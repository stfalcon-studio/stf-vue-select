<script>
import { eventHub } from './even-hub.js';
import { findAncestor } from './dom-lib';

export default {
    name: 'stf-select-option',

    data() {
        return {
            selectId: "",
            isSelected: false
        };
    },

    beforeDestroy() {
        eventHub.$emit("stf-select-option.destroyed",
            {
                option: this,
                selectId: this.selectId,
            }
        );
    },

    methods: {
        selectValue() {
            eventHub.$emit("stf-select-option.selected",
                {
                    value: this.value,
                    selectId: this.selectId,
                }
            );
            this.isSelected = true;
        },
        keyDown(event) {
            switch (event.keyCode) {
                case 13:
                    this.selectValue();
                    event.preventDefault();
                    event.stopPropagation();
                    break;
            }
        }
    },

    mounted() {
        const el = findAncestor(this.$el, '.stf-select__options-wraped');

        if (el) {
            this.selectId = el.getAttribute("select-id");
        }

        eventHub.$emit("stf-select-option.mounted",
            {
                option: this,
                selectId: this.selectId,
            }
        );
    },

    props: [
        'value',
    ],
};
</script>

<template src="./stf-select-option.html"></template>