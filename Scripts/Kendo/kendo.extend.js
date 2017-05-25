

kendo.data.binders.widget.tooltip = {
    value: kendo.data.Binder.extend({
        refresh: function () {
            var that = this;
            var tooltip = this.element;

            if (this._showHandler) {
                tooltip.unbind("show", this._showHandler);
            } else {
                this._showHandler = function () {
                    tooltip.content.html(that.bindings["value"].get());
                };
            }
            tooltip.bind("show", this._showHandler);
        }
    })
};