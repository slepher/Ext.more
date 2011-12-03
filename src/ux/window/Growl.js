Ext.define('Ext.ux.window.Growl', {
    extend: 'Ext.Component',
    singleton: true,
    container: undefined,
    closerTpl: '<div class="x-growl-msg-close"></div>',
    basicTpl: '<div class="x-growl-msg">{0}</div>',
    fullTpl: '<div class="x-growl-msg {2} {3}"><div class="x-growl-msg-title">{0}</div><div class="x-growl-msg-body">{1}</div></div>',
    timers: {},
    
    cfg: {
        aligment: "t-t",
        duration: 3000,
        context: document,
        offset: [0, 0],
        
        show: function(notification, options) {
            if (!options.pin) {
                notification.fadeIn({duration: 1000}).fadeIn({duration: options.duration}).fadeOut({duration: 1000, remove: true});
            } else {
                notification.fadeIn({duration: 1000});
            }
        },
        
        close: function(notification, evt, elt, options) {
            var curAnim = notification.getActiveAnimation();
            if (curAnim) {
                notification.stopAnimation();
            }
            notification.fadeOut({duration: 1000, remove: true});
        },
        
			  click: Ext.emptyFn
    },
        

    getContainer: function() {
        if (!this.container) {
            this.container = Ext.DomHelper.insertFirst(document.body, {id:'x-growl-ct'}, true);
        }
        
        return this.container;
    },
    
    notify: function(options) {
        Ext.applyIf(options, this.cfg);

        var container = this.getContainer();
        var hasIcon = options.iconCls ? "x-growl-msg-has-icon" : "";
        var hasTitle = options.title ? "x-growl-msg-has-title" : "";
        var content = options.content ? Ext.String.format(this.basicTpl, options.content) : 
            Ext.String.format(this.fullTpl, options.title || "", options.message || "", hasTitle + " " + hasIcon, options.iconCls || "");
        
        var notification = Ext.DomHelper[options.alignment.indexOf("b") === -1 ? "append" : "insertFirst"](container, content, true);

        notification.on("click", function(evt, elt, op) {
				    if (Ext.fly(elt).hasCls("x-growl-msg-close")) {
                options.close(notification, evt, elt, options);					
				    } else {
					      options.click(notification, evt, elt, options);
				    }
        });
        
        if (options.closable !== false) {
            var closer = Ext.DomHelper.append(notification, this.closerTpl, true);
            closer.fadeOut();
            var fadeIn = function(e) {
                closer.fadeIn();
            }
            var fadeOut = function(e) {
                closer.fadeOut();
            }
            notification.hover(fadeIn, fadeOut, closer);
        }
        
        container.alignTo(options.context, options.alignment, options.offset);
        
        options.show(notification, options);
    }    
});