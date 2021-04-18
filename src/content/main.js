/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { classes: Cc, interfaces: Ci, results: Cr, utils: Cu } = Components;

var ToolboxPlus = {
    currentToolbar: null,
    
    getToolbarNode: function (aNode) {
        if (aNode == null || (aNode && aNode.localName == "toolbar")) {
            return aNode;
        }
        return this.getToolbarNode(aNode.parentNode);
    },
    
    updateMenu: function (aEvent) {
        let targetToolbar = this.getToolbarNode(aEvent.target.triggerNode);
        if (targetToolbar == null) {
            return false;
        }
        this.currentToolbar = targetToolbar;
        
        let toolbarMode = targetToolbar.getAttribute("mode");
        let modeMenuItem;
        switch (toolbarMode) {
            case "full":
                modeMenuItem = document.getElementById("toolbarmode-full");
                break;
            case "text":
                modeMenuItem = document.getElementById("toolbarmode-text");
                break;
            case "icons":
            default:
                modeMenuItem = document.getElementById("toolbarmode-icons");
                break;
        }
        modeMenuItem.setAttribute("checked", true);
        
        let toolbarIconSize = targetToolbar.getAttribute("iconsize");
        let iconSizeMenuItem = document.getElementById("toolbarmode-smallicons");
        let useSmallIcons = (toolbarIconSize == "small");
        iconSizeMenuItem.setAttribute("checked", useSmallIcons);
        iconSizeMenuItem.disabled = (toolbarMode == "text");
        
        let toolbarFlexible = targetToolbar.getAttribute("flexible");
        let flexibleMenuItem = document.getElementById("toolbarmode-flexible");
        let useFlexibleButtons = (toolbarFlexible == "true");
        flexibleMenuItem.setAttribute("checked", useFlexibleButtons);
        
        let labelAlign = targetToolbar.getAttribute("labelalign");
        let labelAlignMenuItem = document.getElementById("toolbarmode-labelalign");
        let useTextBesideIcons = (labelAlign == "end");
        labelAlignMenuItem.setAttribute("checked", useTextBesideIcons);
    },

    setToolbarMode: function (aEvent, aToolbarId = null, aToolbarMode = null) {
        let targetToolbar = aToolbarId ?
                            document.getElementById(aToolbarId) :
                            null;
        let toolbarMode = aToolbarMode;
        
        if (aEvent && aEvent.target) {
            targetToolbar = this.currentToolbar;
            if (!aToolbarMode) {
                toolbarMode = aEvent.target.value;
            }
        }
        
        if (targetToolbar == null || toolbarMode == null) {
            return false;
        }
        
        let allowedValues = ["full", "icons", "text"];
        if (allowedValues.includes(toolbarMode)) {
            targetToolbar.setAttribute("mode", toolbarMode);
            document.persist(targetToolbar.id, "mode");
            return true;
        }
        
        return false;
    },
    
    setIconMode: function (aEvent, aToolbarId = null, aIconMode = null) {
        let targetToolbar = aToolbarId ?
                            document.getElementById(aToolbarId) :
                            null;
        let iconMode = aIconMode;

        if (aEvent && aEvent.target) {
            targetToolbar = this.currentToolbar;
            if (!aIconMode) {
                iconMode = (aEvent.target.getAttribute("checked") == "true") ?
                           "small" :
                           "large";
            }
        }
        
        if (targetToolbar == null || iconMode == null) {
            return false;
        }
        
        let allowedValues = ["small", "large"];
        if (allowedValues.includes(iconMode)) {
            targetToolbar.setAttribute("iconsize", iconMode);
            document.persist(targetToolbar.id, "iconsize");
            return true;
        }
        return false;
    },
    
    setLabelAlign: function (aEvent, aToolbarId = null, aLabelAlign = null) {
        let targetToolbar = aToolbarId ?
                            document.getElementById(aToolbarId) :
                            null;
        let labelAlign = aLabelAlign;

        if (aEvent && aEvent.target) {
            targetToolbar = this.currentToolbar;
            if (!aLabelAlign) {
                labelAlign = (aEvent.target.getAttribute("checked") == "true") ?
                           "end" :
                           "bottom";
            }
        }
        
        if (targetToolbar == null || labelAlign == null) {
            return false;
        }
        
        let allowedValues = ["end", "bottom"];
        if (allowedValues.includes(labelAlign)) {
            targetToolbar.setAttribute("labelalign", labelAlign);
            document.persist(targetToolbar.id, "labelalign");
            return true;
        }
        return false;
    },

    setFlexState: function (aEvent, aToolbarId = null, aFlexState = null) {
        let targetToolbar = aToolbarId ?
                            document.getElementById(aToolbarId) :
                            null;
        let flexState = aFlexState;

        if (aEvent && aEvent.target) {
            targetToolbar = this.currentToolbar;
            if (!aFlexState) {
                flexState = (aEvent.target.getAttribute("checked") == "true") ?
                           true :
                           false;
            }
        }
        
        if (targetToolbar == null || flexState == null) {
            return false;
        }

        targetToolbar.setAttribute("flexible", flexState);
        document.persist(targetToolbar.id, "flexible");
        return true;
    },
    
    resetToolbar: function (aEvent, aToolbarId = null) {
        let targetToolbar = aToolbarId ?
                            document.getElementById(aToolbarId) :
                            null;
        
        if (aEvent && aEvent.target) {
            targetToolbar = this.currentToolbar;
        }
        
        let attributes = ["mode", "iconsize", "labelalign", "flexible"];
        let defaultAttributes = ["icons", "large", "bottom", "false"];
        
        for (let i = 0; i < attributes.length; i++) {
            let defaultValue = defaultAttributes[i];
            let toolboxDefaultValue = targetToolbar.toolbox.getAttribute("default" + attributes[i]);
            let toolbarDefaultValue = targetToolbar.toolbox.getAttribute("default" + attributes[i]);
            
            if (toolboxDefaultValue) {
                defaultValue = toolboxDefaultValue;
            }
            
            if (toolbarDefaultValue) {
                defaultValue = toolbarDefaultValue;
            }
            
            targetToolbar.setAttribute(attributes[i], defaultValue);
            document.persist(targetToolbar.id, attributes[i]);
        }
    },
};
