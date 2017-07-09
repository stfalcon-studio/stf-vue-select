<script>
import { eventHub } from './even-hub.js';
import { getPosition, hasPositioFixedAncestor, isMob, addClass } from './dom-lib';
import throttle from "lodash.throttle";

export default {
    name: 'stf-select',

    created() {
        this.idSelect = "s" + (Date.now() * Math.random()).toString().replace(".", "_");

        this._optionSelectedCallback = (event) => {
            if (event.selectId === this.idSelect) {
                this._close();
                this.$emit('input', event.value);
                const searchInpitEl = this.$el.querySelector(".stf-select__search-input");
                this._beforeSetValueFocus = true;
                searchInpitEl && searchInpitEl.focus();
                this._beforeSetValueFocus = false;
            }

            if (event.selectId !== this.idSelect) {
                this._close();
            }
        };

        this._onOptionMounted = (event) => {
            if (event.selectId === this.idSelect) {
                this.options.push(event.option);
            }
        };

        this._onOptionDestroyed = (event) => { 
            if (event.selectId === this.idSelect) {
                let index = this.options.indexOf(event.option);
                
                if (index !== -1) {
                    this.options.splice(index, 1);
                }
            }
        };

        this._onOpenedSelect = (event) => {
            if (event.idSelect !== this.idSelect) {
                this._close();
            }
        };

        eventHub.$on('stf-select-option.selected', this._optionSelectedCallback);
        eventHub.$on("stf-select-option.mounted", this._onOptionMounted);
        eventHub.$on("stf-select-option.destroyed", this._onOptionDestroyed);
        eventHub.$on("stf-select.opened", this._onOpenedSelect);
    },

    data() {
        return {
            message: 'Hello Vue!',
            isOpened: false,
            idSelect: "",
            isNeedHideOption: false,
            hasAncesroFixed: false,
            options: [],
        };
    },

    beforeDestroy() {
        document.body.removeChild(this.__selectOptionsWrapEl);
        window.removeEventListener("resize", this._runOnResize);
        window.removeEventListener("click", this._runOnWindowClick);
        eventHub.$off('stf-select-option.selected', this._optionSelectedCallback);
        eventHub.$off('stf-select-option.mounted', this._onOptionMounted);
        eventHub.$off("stf-select-option.destroyed", this._onOptionDestroyed);
        eventHub.$off("stf-select.opened", this._onOpenedSelect);
    },

    mounted() {
        this.__selectOptionsWrapEl = this.$el.querySelector(".stf-select__options-wraped");
        this.__selectOptionsEl = this.$el.querySelector(".stf-select__options");
        document.body.appendChild(this.__selectOptionsWrapEl);
        this.__selectContainerEl = this.$el.querySelector(".stf-select__container");

        this._addwidowResizeListener();
        this._addOutClickListener();

        this._isMob = isMob();
        this._inputEl = this.$el.querySelector("input");
    },
    methods: {
        keyDown(event) {
            switch (event.keyCode) {
                case 40:
                    this._keyArrowDown(event);
                    break;
                case 38:
                    this._keyArrowUp(event);
                    break;
                case 27:
                    this._close();
                    const searchInpitEl = this.$el.querySelector(".stf-select__search-input");
                    searchInpitEl && searchInpitEl.focus();
                    break;
                case 13:
                    if (!this.isOpened) {
                        this._open();
                    } else if (!this.value) {
                        const option = document.querySelector(`.stf-select__options-wraped[select-id="${this.idSelect}"] .stf-select-option`);
                        if (option) {
                            option.click();
                        }
                    } else {
                        this._close();
                    }

                    break;
                case 9:
                    setTimeout(() => this._close(), 100);

                    break;
                default: {
                    if (this._inputEl && (this._inputEl !== document.activeElement)) {

                    }
                }
            }
        },
        keyPress(event) {
            if (
                event.keyCode !== 40 && event.keyCode !== 38 &&
                event.keyCode !== 27 && event.keyCode !== 13 && event.keyCode !== 9 &&
                this._inputEl && this._inputEl !== document.activeElement

            ) {
                this.isOpened = true;
                addClass(this.$el, 'stf-select_opened');
                
                this.hasAncesroFixed = hasPositioFixedAncestor(this.$el);
                eventHub.$emit('stf-select-option.opened', {
                    selectId: this.idSelect
                });

                setTimeout(() => {
                    this._inputEl && this._inputEl.focus();
                }, 100);

                this._calculatePositionAnsSize();

                event = event || window.event;
                let charCode = event.which || event.keyCode;
                let charTyped = String.fromCharCode(charCode);
                if ((/[\wА-Яа-яїєЇЄь]/).test(charTyped)) {
                    this._inputEl.value = charTyped;
                } else {
                    this._inputEl.value = '';
                }

                let eventntInput = new Event('input');
                this._inputEl.dispatchEvent(eventntInput);

                eventHub.$emit("stf-select.opened", { idSelect: this.idSelect });
            }
        },
        onUnblur() {
        },
        onMouseWheal(event) {
            if ((this.__selectOptionsEl.scrollTop >= (this.__selectOptionsEl.scrollHeight - this.__selectOptionsEl.offsetHeight) && event.deltaY > 0) || ((this.__selectOptionsEl.scrollTop === 0) && event.deltaY < 0)) {
                event.preventDefault();
            }

            this.loadMore();
        },
        onSelectFocus(event) {
            if (this.needFocusInpOnTab && !this._beforeSetValueFocus) {
                this._open();
            }
        },
        open(event) {
            this._open();
            event.preventDefault();
            event.stopPropagation();
        },

        openClose() {
            this.isOpened = !this.isOpened;
            if (this.isOpened) {
                this._open();
            } else {
                this._close();
            }
        },

        loadMore: throttle(loadMore, 100),

        _calculatePositionAnsSize() {
            if (!this.isOpened) {
                return;
            }

            this.hasAncesroFixed = hasPositioFixedAncestor(this.$el);
            this.__selectOptionsEl.style.position = this.hasAncesroFixed ? 'fixed' : 'absolute';
            const containerOffset = getPosition(this.__selectContainerEl);
            this.__selectOptionsEl.style.top = containerOffset.top + this.__selectContainerEl.offsetHeight + 'px';
            this.__selectOptionsEl.style.left = containerOffset.left + 'px';
            this.__selectOptionsEl.style.width = this.__selectContainerEl.offsetWidth + 'px';
        },

        _addwidowResizeListener() {
            const vm = this;
            this._runOnResize = function (evt) {
                if (!vm._isMob) {
                    vm._close();
                }
            };

            window.addEventListener("resize", this._runOnResize);
        },
        _addOutClickListener() {
            const vm = this;
            this._runOnWindowClick = function (evt) {
                vm._close();
            };

            window.addEventListener("click", this._runOnWindowClick);
        },

        _open() {
            this.isOpened = true;
            eventHub.$emit('stf-select-option.opened', {
                selectId: this.idSelect
            });
            addClass(this.$el, 'stf-select_opened');
            const inputEl = this.$el.querySelector("input");
            if (inputEl !== document.activeElement) {
                if (inputEl) {
                    inputEl.focus();
                    inputEl.select();
                } else {
                    const searchInpitEl = this.$el.querySelector(".stf-select__search-input") 
                    if (searchInpitEl && searchInpitEl !== document.activeElement) {
                        searchInpitEl.focus();
                    }
                }
            }

            this._calculatePositionAnsSize();
            this._inputEl = this.$el.querySelector("input");
            eventHub.$emit("stf-select.opened", { idSelect: this.idSelect });
        },
        _close() {
            this.isOpened = false;
            this._inputEl = this.$el.querySelector("input");
        },

        _keyArrowDown(event) {
            const elements = this._getArrayElementForFocus();
            const currentFocusedIndex = this._getCurentFocuseIndex(elements);
            let next = currentFocusedIndex === undefined ? 0 : (currentFocusedIndex + 1);

            if (next >= (elements && elements.length)) {
                next = 0;
            }

            setTimeout(() => elements[next] && elements[next].focus(), 100);

            event.stopPropagation();
            event.preventDefault();
        },
        _keyArrowUp(event) {
            const elements = this._getArrayElementForFocus();
            const currentFocusedIndex = this._getCurentFocuseIndex(elements);
            let prev = currentFocusedIndex === undefined ? -1 : (currentFocusedIndex - 1);

            if (prev < 0) {
                if (elements.length) prev = elements.length - 1;
            }

            setTimeout(() => elements[prev] && elements[prev].focus(), 100);

            event.stopPropagation();
            event.preventDefault();
        },
        _getArrayElementForFocus() {
            const elements = [];
            elements.push(...this.$el.querySelectorAll('input'));
            elements.push(...document.querySelectorAll(`[select-id="${this.idSelect}"] .stf-select-option`));

            return elements;
        },
        _getCurentFocuseIndex(elements) {
            for (let key in elements) {
                if (elements[key] === document.activeElement) {
                    return +key;
                }
            }

            return undefined;
        }
    },

    props: {
        value: [Object, Number, String, Array, Boolean],
        more: Boolean,
        pending: Boolean,
        optionsWrapClass: String,
        needFocusInpOnTab: {
            type: Boolean,
            default: false
        },
    },
}

function loadMore() {
    if (!this.pending && this.more &&
        this.__selectOptionsEl.scrollTop > ((this.__selectOptionsEl.scrollHeight - this.__selectOptionsEl.offsetHeight) * 0.66)
    ) {
        this.$emit('loadMore', {});
    }
}

</script>

<template src="./stf-select.html" ></template>

<style lang="scss" src="./stf-select.scss">

</style>