Ext.define('jsMidiParser.view.Main', {
    extend: 'Ext.form.Panel',
    xtype: 'main',

    config: {
        padding: 10,
        scrollable: null,
        layout: {
            type: 'hbox',       
        },
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                title: 'Midi Parser and Analyzer',
                items: [
                    {
                        xtype: 'button',
                        docked: 'left',
                        text: 'Settings',
                        margin: 10,
                        handler: function(button){
                            console.log("button")
                            var panel = Ext.create( 'Ext.form.Panel', {
                                modal: true,
                                scrollable: false,

                                margin: 20,
                                width: 500,
                                height: 300,
                                hideOnMaskTap: true,

                                items: [
                                    {
                                        xtype: 'fieldset',
                                        margin: 20,
                                        items: [
                                            /*{
                                                xtype: 'selectfield',
                                                label: 'Choose one',
                                                options: [
                                                    {text: 'First Option',  value: 'first'},
                                                    {text: 'Second Option', value: 'second'},
                                                    {text: 'Third Option',  value: 'third'}
                                                ]
                                            },*/
                                            {
                                                xtype: 'radiofield',
                                                name : 'synesthesia',
                                                labelWidth: '75%',
                                                label: 'Scriabin Synesthesia',
                                                checked: true
                                            },
                                            {
                                                xtype: 'radiofield',
                                                name : 'synesthesia',
                                                labelWidth: '75%',
                                                label: 'Newton Synesthesia',
                                            },
                                            {
                                                xtype: 'radiofield',
                                                name : 'synesthesia',
                                                labelWidth: '75%',
                                                label: 'Circle of Fifths Coloring',
                                            }
                                        ]
                                    }
                                ]
                            })
                            panel.showBy(button)
                        }
                    }
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'vbox'
                },
                flex: 1,
                id: 'chart1Container',
                items: [
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                            {
                                xtype: 'fieldset',
                                flex: 10,
                                title: 'Input MIDI File 1',
                                margin: '20 20 0 20',
                            },
                            {
                                xtype: 'button',
                                flex: 1,
                                text: 'Import',
                                id: 'button1',
                                handler: function(){
                                    $('#button1').bind("click", function () {
                                        $('#filereader1').click();
                                    });
                                    //this.disable();
                                }
                            },
                            {
                                xtype: 'fieldset',
                                flex: 1,
                                title: 'OR',
                                margin: '20 20 0 20',
                            },
                            {
                                xtype: 'button',
                                flex: 1,
                                text: 'Pick',
                                handler: function(button){
                                    var panel = Ext.create( 'Ext.form.Panel', {
                                        modal: true,
                                        layout: 'card',
                                        scrollable: false,
                                        width: 400,
                                        height: 575,
                                        hideOnMaskTap: true,
                                        showAnimation: 'fadeIn',
                                        hideAnimation: 'fadeOut',
                                        items:[
                                             {
                                                xtype: 'list',
                                                layout:'fit',
                                                itemTpl: '{title}',
                                                data: [
                                                    { title: 'Item 1' },
                                                    { title: 'Item 2' },
                                                    { title: 'Item 3' },
                                                    { title: 'Item 4' },
                                                    { title: 'Item 1' },
                                                    { title: 'Item 2' },
                                                    { title: 'Item 3' },
                                                    { title: 'Item 4' },
                                                    { title: 'Item 1' },
                                                    { title: 'Item 2' },
                                                    { title: 'Item 3' },
                                                    { title: 'Item 4' }
                                                ],
                                                listeners:{
                                                    itemtap: function(record){
                                                        console.log(record)
                                                        this.parent.hide()
                                                    }
                                                }
                                            }
                                        ]
                                    })
                                    panel.showBy(button)
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        hidden: true,
                        html: '<input type="file" id="filereader1">',
                    },
                    {
                        xtype: 'fieldset',
                        id: 'analysis',
                        title: 'Analysis',
                        margin: '0 20 -30 20',
                        padding: '0',
                        //instructions: 'This reperesents a distribution of notes within this piece',
                    },

                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'vbox'
                },
                flex: 1,
                id: 'chart2Container',
                items: [
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                            {
                                xtype: 'fieldset',
                                flex: 10,
                                title: 'Input MIDI File 2',
                                margin: '20 20 0 20',
                            },
                            {
                                xtype: 'button',
                                flex: 1,
                                text: 'Import',
                                id: 'button2',
                                handler: function(){
                                    $('#button2').bind("click", function () {
                                        $('#filereader2').click();
                                    });
                                    //this.disable();
                                }
                            },
                            {
                                xtype: 'fieldset',
                                flex: 1,
                                title: 'OR',
                                margin: '20 20 0 20',
                            },
                            {
                                xtype: 'button',
                                flex: 1,
                                text: 'Pick',
                                handler: function(button){
                                    var panel = Ext.create( 'Ext.form.Panel', {
                                        modal: true,
                                        scrollable: false,
                                        layout: 'card',
                                        width: 400,
                                        height: 575,
                                        hideOnMaskTap: true,
                                        showAnimation: 'fadeIn',
                                        hideAnimation: 'fadeOut',
                                        items:[
                                            {
                                                xtype: 'list',
                                                layout:'fit',
                                                scrollable: false,
                                                itemTpl: '{title}',
                                                data: [
                                                    { title: 'Item 1' },
                                                    { title: 'Item 2' },
                                                    { title: 'Item 3' },
                                                    { title: 'Item 4' },
                                                    { title: 'Item 1' },
                                                    { title: 'Item 2' },
                                                    { title: 'Item 3' },
                                                    { title: 'Item 4' },
                                                    { title: 'Item 1' },
                                                    { title: 'Item 2' },
                                                    { title: 'Item 3' },
                                                    { title: 'Item 4' }
                                                ],
                                                listeners:{
                                                    select: function(record){
                                                        console.log(record)
                                                        this.parent.hide()
                                                    }
                                                }
                                            }
                                        ]
                                    })
                                    panel.showBy(button)
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        hidden: true,
                        html: '<input type="file" id="filereader2">',
                    },
                    {
                        xtype: 'fieldset',
                        id: 'analysis',
                        title: 'Analysis',
                        margin: '0 20 -30 20',
                        padding: '0',
                        //instructions: 'This reperesents a distribution of notes within this piece',
                    },

                ]
            },
        ]
    },

});
