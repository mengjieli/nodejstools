var flower;
(function (flower) {
    var CCSCheckBoxGroup = (function (_super) {
        /**
         _name: null,
         _selected: null,
         _checks: null,
         */
        __extends(CCSCheckBoxGroup, _super);
        function CCSCheckBoxGroup() {
            _super.call(this);
            this._super();
            this._name = name;
            this._checks = new Array();
        }

        var d = __define, c = CCSCheckBoxGroup;
        p = c.prototype;

        p.init = function (checks, selected) {
            selected = selected == null ? 0 : selected;
            while (this._checks && this._checks.length) {
                this._checks.pop().removeEventsByOwner(this);
            }
            this._checks = checks;
            if (this._checks) {
                for (var i = 0; i < this._checks.length; i++) {
                    this._checks[i].addEventListener(flower.Event.CHANGE, this.onCheckBoxChange, this);
                    this._checks[i].addEventListener(flower.Event.REMOVE, this.onDisplayCheckBox, this);
                }
                this.setSelected(this._checks[selected]);
            }
        }

        p.addCheckBox = function (val) {
            for (var i = 0; i < this._checks.length; i++) {
                if (this._checks[i] == val) return;
            }
            this._checks.push(val);
            val.setGroup(this);
            val.addEventListener(flower.Event.CHANGE, this.onCheckBoxChange, this);
            val.addEventListener(flower.Event.REMOVE, this.onDisplayCheckBox, this);
            if (!this._selected && val.getSlected()) {
                this._selected = val;
                if (this._checks.length == 1) {
                    this.dispatchEvent(new flower.CCSCheckBoxEvent(flower.CCSCheckBoxEvent.SELECTED, this._selected, this.getSelectedIndex()));
                }
            }
            else if (val.getSlected()) val.setSelected(false);
        }

        p.getSelected = function () {
            return this._selected;
        }

        p.getSelectedIndex = function () {
            for (var i = 0; i < this._checks.length; i++) {
                if (this._checks[i] == this._selected) return i;
            }
            return null;
        }

        p.setSelected = function (check) {
            this._selected = check;
            this._selected.setSelected(true);
        }

        p.setSelectedIndex = function (index) {
            this._selected = this._checks[index];
            this._selected.setSelected(true);
        }

        p.getLength = function () {
            return this._checks.length;
        }

        p.onDisplayCheckBox = function (e) {
            e.currentTarget.removeEventsByOwner(this);
            for (var i = 0; i < this._checks.length; i++) {
                if (this._checks[i] == e.currentTarget) {
                    this._checks.splice(i, 1);
                    break;
                }
            }
            if (this._checks.length == 0) {
                flower.CCSCheckBoxGroup.groups[this._name] = null;
                this.dispose();
            }
        }

        p.onCheckBoxChange = function (e) {
            var check = e.currentTarget;
            if (check.getSlected() == false) return;
            this._selected = check;
            for (var i = 0; i < this._checks.length; i++) {
                if (this._checks[i] != check) this._checks[i].setSelected(false);
            }
            this.dispatchEvent(new flower.CCSCheckBoxEvent(flower.CCSCheckBoxEvent.SELECTED, this._selected, this.getSelectedIndex()));
        }

        CCSCheckBoxGroup.groups = {};
        CCSCheckBoxGroup.addToGroup = function (name, check) {
            if (!CCSCheckBoxGroup.groups[name]) CCSCheckBoxGroup.groups[name] = new CCSCheckBoxGroup(name);
            (CCSCheckBoxGroup.groups[name]).addCheckBox(check);
            return CCSCheckBoxGroup.groups[name];
        };
        CCSCheckBoxGroup.create = function (name, checks, selected) {
            checks = checks == null ? null : checks;
            selected = selected == null ? 0 : selected;
            if (!CCSCheckBoxGroup.groups[name]) CCSCheckBoxGroup.groups[name] = new CCSCheckBoxGroup(name);
            (CCSCheckBoxGroup.groups[name]).init(checks, selected);
            return CCSCheckBoxGroup.groups[name];
        };

        return CCSCheckBoxGroup;
    })(flower.EventDispatcher);
    flower.CCSCheckBoxGroup = CCSCheckBoxGroup;
})(flower || (flower = {}));
