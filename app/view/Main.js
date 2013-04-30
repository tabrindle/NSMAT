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
                    /*{
                        xtype: 'button',
                        docked: 'left',
                        text: 'Settings',
                        margin: 10,
                        handler: function(button){
                            console.log("button")
                            var panel = Ext.create( 'Ext.form.Panel', {
                                scrollable: false,
                                margin: 20,
                                width: 400,
                                height: 210,
                                hideAnimation: {type:'fadeOut',duration: 300},
                                showAnimation: {type:'fadeIn',duration: 300},

                                items: [
                                    {
                                        xtype: 'fieldset',
                                        margin: 10,
                                        items: [
                                            {
                                                xtype: 'radiofield',
                                                name : 'synesthesia',
                                                labelWidth: '75%',
                                                label: 'Scriabin Synesthesia',
                                                listeners: {
                                                    change: function(button){
                                                        button.parent.parent.hide()
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'radiofield',
                                                name : 'synesthesia',
                                                labelWidth: '75%',
                                                label: 'Newton Synesthesia',
                                                listeners: {
                                                    change: function(button){
                                                        button.parent.parent.hide()
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'radiofield',
                                                name : 'synesthesia',
                                                labelWidth: '75%',
                                                label: 'Circle of Fifths Coloring',
                                                listeners: {
                                                    change: function(button){
                                                        button.parent.parent.hide()
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            })
                            panel.showBy(button)
                        }
                    },*/
                    {
                        xtype: 'button',
                        text: 'Import',
                        id: 'button1',
                        width: '70px',
                        docked: 'left',
                        margin: 10,
                        handler: function(button){
                            $('#button1').bind("click", function () {
                                $('#filereader1').click();
                            });
                            //button.disable();
                        }
                    },
                    {
                        xtype: 'button',
                        text: 'Pick',
                        width: '70px',
                        docked: 'left',
                        margin: 10,
                        handler: function(button){
                            var panel = Ext.create( 'Ext.form.Panel', {
                                modal: true,
                                layout: 'card',
                                width: 400,
                                height: 400,
                                hideOnMaskTap: true,
                                showAnimation: 'fadeIn',
                                hideAnimation: 'fadeOut',
                                items:[
                                     {
                                        xtype: 'list',
                                        layout:'fit',
                                        indexBar: true,
                                        itemTpl: '{title}',
                                        data: [
                                            { title: 'Black Bird', path: 'midi/Black Bird.txt'},
                                            { title: 'Blue Bells of Scotland', path: 'midi/Blue Bells of Scotland.txt'},
                                            { title: 'Blow the Man Down', path: 'midi/Blow the Man Down.txt'},
                                            { title: 'Scarborough Fair', path: 'midi/Scarborough Fair.txt'},
                                            { title: 'Shenandoah', path: 'midi/Shenandoah.txt'},
                                            { title: 'Bach - Prelude in C', path: 'midi/Bach - Prelude in C.txt'},
                                            { title: 'Beethoven - Diabelli Variation 1', path: 'midi/Beethoven - Diabelli Variation 1.txt'},
                                            { title: 'Beethoven - Diabelli Variation 2', path: 'midi/Beethoven - Diabelli Variation 2.txt'},
                                            { title: 'Mozart Requiem Network 143', path: 'midi/Mozart Requiem Network 143.txt'},
                                            { title: 'Mozart Requiem Network 177', path: 'midi/Mozart Requiem Network 177.txt'},
                                            { title: 'Rachmaninoff Etude in D Network 51', path: 'midi/Rachmaninoff Etude in D Network 51.txt'},
                                            { title: 'Rachmaninoff Etude in D', path: 'midi/Rachmaninoff Etude in D.txt'}
                                        ],
                                        listeners:{
                                            itemtap: function(list, index, target, record, e, eOpts){
                                                //console.log(record.data.path)
                                                var path = record.data.path

                                                jsMidiParser.app.songname = path.substring(5, path.length-4)

                                                $.ajax({
                                                    url: path,
                                                    processData: false,
                                                    contentType: 'text/plain',
                                                                            
                                                }).done(function(data){
                                                    var uintArray = Base64Binary.decode(data); 
                                                    console.log(uintArray)
                                                    JSMIDIParser.AjaxIO(uintArray, jsMidiParser.app.MyCallback1) 
                                                })

                                                this.parent.hide()

                                            }
                                        }
                                    }
                                ]
                            })
                            panel.showBy(button)
                        }
                    },
                    {
                        xtype: 'button',
                        width: '70px',
                        text: 'Import',
                        id: 'button2',
                        margin: 10,
                        docked: 'right',
                        handler: function(button){
                            $('#button2').bind("click", function () {
                                $('#filereader2').click();
                            });
                            //button.disable();
                        }
                    },
                    {
                        xtype: 'button',
                        width: '70px',
                        text: 'Pick',
                        margin: 10,
                        docked: 'right',
                        handler: function(button){
                            var panel = Ext.create( 'Ext.form.Panel', {
                                modal: true,
                                layout: 'card',
                                width: 400,
                                height: 400,
                                hideOnMaskTap: true,
                                showAnimation: 'fadeIn',
                                hideAnimation: 'fadeOut',
                                items:[
                                    {
                                        xtype: 'list',
                                        layout:'fit',
                                        indexBar: true,
                                        itemTpl: '{title}',
                                        data: [
                                            { title: 'Black Bird', path: 'midi/Black Bird.txt'},
                                            { title: 'Blue Bells of Scotland', path: 'midi/Blue Bells of Scotland.txt'},
                                            { title: 'Blow the Man Down', path: 'midi/Blow the Man Down.txt'},
                                            { title: 'Scarborough Fair', path: 'midi/Scarborough Fair.txt'},
                                            { title: 'Shenandoah', path: 'midi/Shenandoah.txt'},
                                            { title: 'Bach - Prelude in C', path: 'midi/Bach - Prelude in C.txt'},
                                            { title: 'Beethoven - Diabelli Variation 1', path: 'midi/Beethoven - Diabelli Variation 1.txt'},
                                            { title: 'Beethoven - Diabelli Variation 2', path: 'midi/Beethoven - Diabelli Variation 2.txt'},
                                            { title: 'Mozart Requiem Network 143', path: 'midi/Mozart Requiem Network 143.txt'},
                                            { title: 'Mozart Requiem Network 177', path: 'midi/Mozart Requiem Network 177.txt'},
                                            { title: 'Rachmaninoff Etude in D Network 51', path: 'midi/Rachmaninoff Etude in D Network 51.txt'},
                                            { title: 'Rachmaninoff Etude in D', path: 'midi/Rachmaninoff Etude in D.txt'}
                                        ],
                                        listeners:{
                                            itemtap: function(list, index, target, record, e, eOpts){
                                                //console.log(record.data.path)
                                                var path = record.data.path

                                                jsMidiParser.app.songname = path.substring(5, path.length-4)

                                                $.ajax({
                                                    url: path,
                                                    processData: false,
                                                    contentType: 'text/plain',
                                                                            
                                                }).done(function(data){
                                                    var uintArray = Base64Binary.decode(data); 
                                                    console.log(uintArray)
                                                    JSMIDIParser.AjaxIO(uintArray, jsMidiParser.app.MyCallback2) 
                                                })

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
                layout: {
                    type: 'vbox'
                },
                flex: 1,
                margin: '0 0 -20 0 ',
                id: 'chart1Container',
                items: [
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox'
                        },
                        items: [/*
                            {
                                xtype: 'fieldset',
                                flex: 10,
                                title: 'Input MIDI File 1',
                                margin: '20 20 0 20',
                            },
                            {
                                xtype: 'button',
                                width: '85px',
                                text: 'Import',
                                id: 'button1',
                                handler: function(button){
                                    $('#button1').bind("click", function () {
                                        $('#filereader1').click();
                                    });
                                    //button.disable()
                                }
                            },

                            {
                                xtype: 'fieldset',
                                width: '55px',
                                title: 'OR',
                                margin: '20 20 0 20',
                            },
                            {
                                xtype: 'button',
                                width: '70px',
                                text: 'Pick',
                                handler: function(button){
                                    var panel = Ext.create( 'Ext.form.Panel', {
                                        modal: true,
                                        layout: 'card',
                                        width: 400,
                                        height: 400,
                                        hideOnMaskTap: true,
                                        showAnimation: 'fadeIn',
                                        hideAnimation: 'fadeOut',
                                        items:[
                                             {
                                                xtype: 'list',
                                                layout:'fit',
                                                indexBar: true,
                                                itemTpl: '{title}',
                                                data: [
                                                    { title: 'Black Bird', path: 'midi/Black Bird.txt'},
                                                    { title: 'Blue Bells of Scotland', path: 'midi/Blue Bells of Scotland.txt'},
                                                    { title: 'Blow the Man Down', path: 'midi/Blow the Man Down.txt'},
                                                    { title: 'Scarborough Fair', path: 'midi/Scarborough Fair.txt'},
                                                    { title: 'Shenandoah', path: 'midi/Shenandoah.txt'},
                                                    { title: 'Johnny Cope', path: 'midi/Johnny Cope.txt'},
                                                ],
                                                listeners:{
                                                    itemtap: function(list, index, target, record, e, eOpts){
                                                        console.log(record.data.path)
                                                        var path = record.data.path

                                                        $.ajax({
                                                            url: path,
                                                            processData: false,
                                                            contentType: 'text/plain',
                                                                                    
                                                        }).done(function(data){
                                                            var uintArray = Base64Binary.decode(data); 
                                                            console.log(uintArray)
                                                            JSMIDIParser.AjaxIO(uintArray, jsMidiParser.app.MyCallback1) 
                                                        })

                                                        this.parent.hide()

                                                    }
                                                }
                                            }
                                        ]
                                    })
                                    panel.showBy(button)
                                }
                            }*/
                        ]
                    },
                    {
                        xtype: 'container',
                        hidden: true,
                        html: '<input type="file" id="filereader1">',
                    },
                    {
                        xtype: 'fieldset',
                        id: 'analysis1',
                        title: 'Analysis',
                        margin: '-10 20 -20 20',
                        padding: '0',
                        instructions: 'This reperesents the distribution of notes within this piece',
                    },

                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'vbox'
                },
                flex: 1,
                margin: '0 0 -20 0 ',
                id: 'chart2Container',
                items: [
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                            /*{
                                xtype: 'fieldset',
                                flex: 10,
                                title: 'Input MIDI File 2',
                                margin: '20 20 0 20',
                            },
                            {
                                xtype: 'button',
                                width: '85px',
                                text: 'Import',
                                id: 'button2',
                                handler: function(button){
                                    $('#button2').bind("click", function () {
                                        $('#filereader2').click();
                                    });
                                    //button.disable();
                                }
                            },
                            {
                                xtype: 'fieldset',
                                width: '55px',
                                title: 'OR',
                                margin: '20 20 0 20',
                            },
                            {
                                xtype: 'button',
                                width: '70px',
                                text: 'Pick',
                                handler: function(button){
                                    var panel = Ext.create( 'Ext.form.Panel', {
                                        modal: true,
                                        scrollable: false,
                                        layout: 'card',
                                        width: 400,
                                        height: 400,
                                        hideOnMaskTap: true,
                                        showAnimation: 'fadeIn',
                                        hideAnimation: 'fadeOut',
                                        items:[
                                            {
                                                xtype: 'list',
                                                layout:'fit',
                                                indexBar: true,
                                                scrollable: false,
                                                itemTpl: '{title}',
                                                data: [
                                                    { title: 'Black Bird', path: 'midi/Black Bird.txt'},
                                                    { title: 'Blue Bells of Scotland', path: 'midi/Blue Bells of Scotland.txt'},
                                                    { title: 'Blow the Man Down', path: 'midi/Blow the Man Down.txt'},
                                                    { title: 'Scarborough Fair', path: 'midi/Scarborough Fair.txt'},
                                                    { title: 'Shenandoah', path: 'midi/Shenandoah.txt'},
                                                    { title: 'Johnny Cope', path: 'midi/Johnny Cope.txt'}
                                                ],
                                                listeners:{
                                                    itemtap: function(list, index, target, record, e, eOpts){
                                                        console.log(record.data.path)
                                                        var path = record.data.path

                                                        $.ajax({
                                                            url: path,
                                                            processData: false,
                                                            contentType: 'text/plain',
                                                                                    
                                                        }).done(function(data){
                                                            var uintArray = Base64Binary.decode(data); 
                                                            console.log(uintArray)
                                                            JSMIDIParser.AjaxIO(uintArray, jsMidiParser.app.MyCallback2) 
                                                        })

                                                        this.parent.hide()

                                                    }
                                                }
                                            }
                                        ]
                                    })
                                    panel.showBy(button)
                                }
                            }*/
                        ]
                    },
                    {
                        xtype: 'container',
                        hidden: true,
                        html: '<input type="file" id="filereader2">',
                    },
                    {
                        xtype: 'fieldset',
                        id: 'analysis2',
                        title: 'Analysis',
                        margin: '-10 20 -20 20',
                        padding: '0',
                        instructions: 'This reperesents the distribution of notes within this piece',
                    },

                ]
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    {
                        xtype: 'button',
                        text: 'Clear Last',
                        ui: 'decline',
                        margin: '5',
                        docked: 'right',
                        handler: function(){
                            var container = Ext.ComponentQuery.query('#chart2Container')[0]
                            var length = container.items.items.length
                            var last = container.items.items[length-1]
                            var analysis = Ext.ComponentQuery.query('#analysis2')[0]
                            analysis.setTitle('Analysis')
                            if(container.items.items.length > 3){
                                container.remove(last)
                                JSMIDIParser.IO('filereader2', jsMidiParser.app.MyCallback2)
                            }
                            else{
                                console.log("oops")
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: 'Clear Last',
                        ui: 'decline',
                        margin: '5',
                        docked: 'left',
                        handler: function(){
                            var container = Ext.ComponentQuery.query('#chart1Container')[0]
                            var length = container.items.items.length
                            var last = container.items.items[length-1]
                            console.log(container.items.items)
                            var analysis = Ext.ComponentQuery.query('#analysis1')[0]
                            analysis.setTitle('Analysis')
                            if(container.items.items.length > 3){
                                container.remove(last)
                                JSMIDIParser.IO('filereader1', jsMidiParser.app.MyCallback1)
                            }
                            else{
                                console.log("oops")
                            }
                        }
                    }
                ]
            }
        ]
    },

});
