/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Drop = Toolkit.Component.extend(function(nodes, options) {
        var events;

        this.component = 'Drop';
        this.version = '1.1.0';
        this.options = options = this.setOptions(options);
        this.element = null; // Current drop
        this.node = null; // Opened the drop
        this.nodes = nodes = $(nodes);
        this.events = events = {};

        // Initialize events
        $.each(['down', 'up', 'left', 'right'], function(i, value) {
            events['clickout .' + Toolkit.options.vendor + 'drop--' + value] = 'hide';
        });

        events['clickout ' + nodes.selector] = 'hide';
        events[options.mode + ' ' + nodes.selector] = '__show';

        this.enable();
        this.fireEvent('init');
    }, {

        /**
         * Hide the opened element and remove active state.
         */
        hide: function() {
            if (this.element && this.element.is(':shown')) {
                this.element.conceal();
                this.node.removeClass(Toolkit.options.isPrefix + 'active');

                this.fireEvent('hide', [this.element, this.node]);
            }
        },

        /**
         * Open the target element and apply active state.
         *
         * @param {jQuery} node
         */
        show: function(node) {
            this.element.reveal();

            this.node = node = $(node);
            this.node.addClass(Toolkit.options.isPrefix + 'active');

            this.fireEvent('show', [this.element, node]);
        },

        /**
         * When a node is clicked, grab the target from the attribute.
         * Validate the target element, then either display or hide.
         *
         * @private
         * @param {jQuery.Event} e
         */
        __show: function(e) {
            e.preventDefault();

            var node = $(e.target),
                target = this.readValue(node, this.options.getTarget);

            if (!target || target.substr(0, 1) !== '#') {
                return;
            }

            // Hide previous drops
            if (this.options.hideOpened && this.node && !this.node.is(node)) {
                this.hide();
            }

            this.element = $(target);
            this.node = node;

            if (!this.element.is(':shown')) {
                this.show(node);
            } else {
                this.hide();
            }
        }

    }, {
        mode: 'click',
        getTarget: 'data-drop',
        hideOpened: true
    });

    /**
     * Defines a component that can be instantiated through drop().
     */
    Toolkit.createComponent('drop', function(options) {
        return new Toolkit.Drop(this, options);
    }, true);

})(jQuery);