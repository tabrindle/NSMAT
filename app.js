Ext.Loader.setPath({
    'Ext': 'touch/src',
    'jsMidiParser': 'app'
});

Base64Binary = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function(input) {
        var bytes = (input.length/4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    decode: function(input, arrayBuffer) {
        //get last chars to see if are valid
        var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));      
        var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));      

        var bytes = (input.length/4) * 3;
        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i=0; i<bytes; i+=3) {  
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;           
            if (enc3 != 64) uarray[i+1] = chr2;
            if (enc4 != 64) uarray[i+2] = chr3;
        }

        return uarray;  
    }
}

JSMIDIParser = {
    // debug (bool), when enabled will log in console unimplemented events warnings and general and errors.
    debug: true,   
    
    // IO() should be called in order attach a listener to the INPUT HTML element
    // that will provide the binary data automating the conversion, and returning
    // the structured data to the provided callback function.
    IO: function(_fileElement, _callback){
        if (!window.File || !window.FileReader){                            // check browser compatibillity
            if (this.debug) {
                console.log("Error",'File input is not fully supported in this browser.')
            }
            return false;
        }

        document.getElementById(_fileElement).onchange = (function(_t){     // set the file open event handler
            return function(InputEvt){
                if (!InputEvt.target.files.length) 
                    return false;
                var reader = new FileReader();                              // prepare the file Reader
                reader.readAsArrayBuffer(InputEvt.target.files[0]);         // read the binary data
                reader.onload = (function(_t) {                             // when ready...
                    return function(e){
                        console.log(e.target.result)
                        _callback( _t.parse(new Uint8Array(e.target.result))); // encode data with Uint8Array and call the parser
                    }
                })(_t);                             
            };
        })(this);
    },

    AjaxIO: function(file, callback){

        callback(this.parse(file));
           
    },
    
    // parse() function reads the binary data, interpreting and spliting each chuck
    // and parsing it to a structured Object. When job is finised returns the object
    // or 'false' if any error was generated.   
    parse: function(FileAsUint8Array){
        var file = {
            data: null,
            pointer: 0,
            movePointer: function(_bytes){                              // move the pointer negative and positive direction
                this.pointer += _bytes;
                return this.pointer;
            },
            readInt: function(_bytes){                                  // get integer from next _bytes group (big-endian) 
                var value = 0;
                if(_bytes > 1){
                    for(var i=1; i<= (_bytes-1); i++){
                        value += parseInt(this.data[this.pointer]) * Math.pow(256, (_bytes - i));
                        this.pointer++;
                    };
                };
                value += parseInt(this.data[this.pointer]);
                this.pointer++; 
                return value;
            },
            readStr: function(_bytes){                                  // read as ASCII chars, the followoing _bytes
                var text = '';
                for(var character=1; character <= _bytes; character++) text +=  String.fromCharCode(this.readInt(1));
                return text;
            },
            readIntVLV: function(){                                     // read a variable length value
                var value = 0;
                if(parseInt(this.data[this.pointer]) < 128) {           // ...value in a single byte
                    value = this.readInt(1);
                }else{                                                  // ...value in multiple bytes
                    var FirstBytes = [];
                    while(parseInt(this.data[this.pointer]) >= 128){
                        FirstBytes.push(this.readInt(1) - 128);
                    };
                    var lastByte  = this.readInt(1);;
                    for(var dt = 1; dt <= FirstBytes.length; dt++){
                        value = FirstBytes[FirstBytes.length - dt] * Math.pow(128, dt);
                    };
                    value += lastByte;
                };
                return value;
            }
        };
        file.data = FileAsUint8Array                                             // 8 bits bytes file data array
        //  ** read FILE HEADER 
        if(file.readInt(4) != 0x4D546864){                                      // Header validation failed (not MIDI standard or file corrupt.)
            Ext.Msg.alert("Error", "Not MIDI standard or file is corrupt")  
            return false; 
        }         

        var headerSize          = file.readInt(4);                              // header size (unused var), getted just for read pointer movement
        var MIDI                = {};                                           // create new midi object
        MIDI.formatType         = file.readInt(2);                              // get MIDI Format Type
        MIDI.tracks             = file.readInt(2);                              // get ammount of track chunks
        MIDI.track              = [];                                           // create array key for track data storing
        var timeDivisionByte1   = file.readInt(1);                              // get Time Division first byte
        var timeDivisionByte2   = file.readInt(1);                              // get Time Division second byte
        if(timeDivisionByte1 >= 128){                                           // discover Time Division mode (fps or tpf)
            MIDI.timeDivision    = [];                                          
            MIDI.timeDivision[0] = timeDivisionByte1 - 128;                     // frames per second MODE  (1st byte)
            MIDI.timeDivision[1] = timeDivisionByte2;                           // ticks in each frame     (2nd byte)
        }else MIDI.timeDivision  = (timeDivisionByte1 * 256) + timeDivisionByte2;// else... ticks per beat MODE  (2 bytes value)
        //  ** read TRACK CHUNK  
        for (var t=1; t <= MIDI.tracks; t++) {                                    
            MIDI.track[t-1] = {                                                 // create new Track entry in Array
                event: []
            } 

            if(file.readInt(4) != 0x4D54726B){                                  // Header validation failed (not MIDI standard or file corrupt.)
                Ext.Msg.alert("Error", "Not MIDI standard or file is corrupt")  
                return false; 
            }

            var chunkLength = file.readInt(4)                                   // var NOT USED, just for pointer move. get chunk size (bytes length)
            var e = 0                                                           // init event counter
            var endOfTrack = false                                              // FLAG for track reading secuence breaking
            var errorCount = 0

            //read EVENT CHUNK
            while(!endOfTrack){
                e++                                                             // increase by 1 event counter
                MIDI.track[t-1].event[e-1] = {};                                // create new event object, in events array
                MIDI.track[t-1].event[e-1].deltaTime  = file.readIntVLV();      // get DELTA TIME OF MIDI event (Variable Length Value)
                var statusByte = file.readInt(1);                               // read EVENT TYPE (STATUS BYTE)
                if(statusByte >= 128) {                                         // NEW STATUS BYTE DETECTED
                    laststatusByte = statusByte     
                }              
                else {                                                          // 'RUNNING STATUS' situation detected
                    statusByte = laststatusByte;                                // apply last loop, Status Byte
                    file.movePointer(-1);                                       // move back the pointer (cause readed byte is not status byte) 
                };
                // ** Identify EVENT
                if(statusByte == 0xFF){                                         // Meta Event type
                    MIDI.track[t-1].event[e-1].type = 0xFF                      // assign metaEvent code to array
                    MIDI.track[t-1].event[e-1].metaType = file.readInt(1)       // assign metaEvent subtype
                    var metaEventLength = file.readIntVLV();                    // get the metaEvent length
                    switch(MIDI.track[t-1].event[e-1].metaType){
                        case 0x2F:                                              // end of track, has no data byte
                            endOfTrack = true;                                  // change FLAG to force track reading loop breaking
                            break;  
                        case 0x01:                                              // Text Event
                        case 0x02:                                              // Copyright Notice
                        case 0x03:                                              // Sequence/Track Name (documentation: http://www.ta7.de/txt/musik/musi0006.htm)
                        case 0x06:                                              // Marker
                            MIDI.track[t-1].event[e-1].data = file.readStr(metaEventLength);
                            break;
                        case 0x21:                                              // MIDI PORT
                        case 0x59:                                              // Key Signature
                        case 0x51:                                              // Set Tempo
                            MIDI.track[t-1].event[e-1].data = file.readInt(metaEventLength);
                            break;
                        case 0x54:                                              // SMPTE Offset
                        case 0x58:                                              // Time Signature
                            MIDI.track[t-1].event[e-1].data    = [];
                            MIDI.track[t-1].event[e-1].data[0] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[1] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[2] = file.readInt(1);
                            MIDI.track[t-1].event[e-1].data[3] = file.readInt(1);
                            break;
                        default :
                            file.readInt(metaEventLength);
                            MIDI.track[t-1].event[e-1].data = file.readInt(metaEventLength);
                            if (this.debug) console.log("Unimplemented 0xFF event! data block readed as Integer");
                            errorCount++
                            if(errorCount > 10000){
                                Ext.Msg.alert("Error", "Something seems to have gone wrong during parsing.")
                                return false
                            }
                    };
                }

                // MIDI Control Events OR System Exclusive Events
                else {
                    // split the status byte HEX representation, to obtain 4 bits values                                                          
                    statusByte = statusByte.toString(16).split('') 

                    // force 2 digits            
                    if(!statusByte[1]) statusByte.unshift('0')

                    // first byte is EVENT TYPE ID
                    MIDI.track[t-1].event[e-1].type = parseInt(statusByte[0], 16)

                    // second byte is channel
                    MIDI.track[t-1].event[e-1].channel = parseInt(statusByte[1], 16)

                    switch(MIDI.track[t-1].event[e-1].type){
                        // System Exclusive Events
                        case 0xF:                                               
                            var event_length = file.readIntVLV()
                            MIDI.track[t-1].event[e-1].data = file.readInt(event_length)
                            if (this.debug) {
                                console.log("Unimplemented 0xF exclusive events! data block readed as Integer")
                            }
                            break;

                        // Note Aftertouch
                        case 0xA:                                               
                        case 0xB:                                               // Controller
                        case 0xE:                                               // Pitch Bend Event
                        case 0x8:                                               // Note off
                        case 0x9:                                               // Note On
                            MIDI.track[t-1].event[e-1].data = [];
                            MIDI.track[t-1].event[e-1].data[0] = file.readInt(1)
                            MIDI.track[t-1].event[e-1].data[1] = file.readInt(1)
                            break;
                        case 0xC:                                               // Program Change   
                        case 0xD:                                               // Channel Aftertouch
                            MIDI.track[t-1].event[e-1].data = file.readInt(1)
                            break;
                        default:
                            if (this.debug) console.log("Unknown EVENT detected.... reading cancelled!");
                            return false;
                    };
                };
            };      
        };
        console.log(MIDI)
        return MIDI;
    }
},

Ext.application({
    name: 'jsMidiParser',
     // debug (bool), when enabled will log in console unimplemented events warnings and general and errors.
    debug: false,  
    songname: 'Default',
    
    requires: [
        'Ext.MessageBox',
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'Ext.chart.PolarChart',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.interactions.ItemInfo',
        'Ext.dataview.List'
    ],

    views: ['Main'],

    models: ['NoteModel'],

    stores: ['NoteStore'],

    launch: function() {
        // Initialize the main view
        var Main = Ext.create('jsMidiParser.view.Main')
        // Destroy the #appLoadingIndicator element
        setTimeout(function() {
            Ext.fly('appLoadingIndicator').destroy();
            Ext.Viewport.add(Main);
            JSMIDIParser.IO('filereader1', jsMidiParser.app.MyCallback1)
            JSMIDIParser.IO('filereader2', jsMidiParser.app.MyCallback2)
        }, 2500);
        counter1 = 0
        counter2 = 0
    },

    MyCallback1: function(obj){
        counter1++
        console.log(counter1)
        //set the title of the midi track 
        /*var fileName = $('#filereader1').val();
        if(!fileName){
            var fieldset = Ext.ComponentQuery.query('#analysis1')[0]
            fieldset.setTitle('Analysis of '+jsMidiParser.app.songname)
        }
        else{
            if(filename)
                fileName = fileName.substring(12, fileName.length) 
            var fieldset = Ext.ComponentQuery.query('#analysis1')[0]
            fieldset.setTitle('Analysis of '+fileName)
        }*/
        
        console.log("%o", obj);
        if(obj == false)
            return 0
        //Ext.Msg.alert("Analysis Complete.", "File 1 Has been analyzed", Ext.EmptyFn);
        var array1 = []
        for(var i=0; i<obj.tracks; i++){
            //console.log("i",i)
            var track = obj.track[i];
            for(var j=1; j<track.event.length-1; j++){
               // console.log("j",j)
                var events = track.event[j]
                for(var k=0; k<events.data.length; k++){
                    //console.log("k",k)
                    if(events.type == 9){
                        var data = events.data
                        array1.push(data[k])
                    }
                    else
                        console.log("Event Skipped")
                }
            }
        }
        console.log(array1)

        //initialize array of note occurances
        notesArray = []
        for(var i=1; i<128; i++){
            notesArray[i]=0
        }

        //sort array1 into tallied occurrances in notesArray.
        for(var i=0;i<array1.length;i++){
            var value = array1[i]
            notesArray[value]++
        }
        console.log("Note Array 0-127")
        console.log(notesArray)

        note12Array = []
        for(var i=0; i<12; i++){
            note12Array[i]=0
        }

        //sort array1 into tallied occurrances in notesArray.
        for(var i=0;i<array1.length;i++){
            if(array1[i] != 0){
                var value = array1[i]%12
                note12Array[value]++
            }
        }
        console.log("Note Array 0-12")
        console.log(note12Array)

        var total = 0

        for(var i=0;i<12;i++){
            total = total + note12Array[i]
        }
        //console.log("total")
        //console.log(total)
        

        var modelOne = Ext.create('jsMidiParser.model.NoteModel', {
            C: note12Array[0],
            CsDb: note12Array[1],
            D: note12Array[2],
            DsEb: note12Array[3],
            E: note12Array[4],
            F: note12Array[5],
            FsGb: note12Array[6],
            G: note12Array[7],
            GsAb: note12Array[8],
            A: note12Array[9],
            AsBb: note12Array[10],
            B: note12Array[11]
        });

        console.log(modelOne);

        var NoteStore = Ext.getStore('NoteStore');

        NoteStore.add(modelOne)

        var chart = new Ext.chart.PolarChart({
            animate: true,
            layout: 'fit',
            shadow: true,
            flex: 8,
            margin: 25,
            interactions: ['rotate',
                {
                    type: 'iteminfo',
                    listeners: {
                        show: function(me, item, panel) {
                            panel.setWidth(300)
                            panel.setHeight(200)
                            panel.setHtml(
                                '<div style="font-weight: bold;">Note Name: ' + item.record.get('name') + '<div>' +
                                '<div style="font-weight: bold;">Number of Occurances: ' + item.record.get('data1') + '<div>' +
                                '<div style="font-weight: bold;">Total Note-On Occurances: ' + total + '<div>' +
                                '<div style="font-weight: bold;">Proportion: ' + item.record.get('data1')/total*100 + '%<div>'
                            );
                        }
                    }
                }
            ],
            colors: [
                "#FF0000", //red - C
                "#9000FF", //blue/purple Db
                "#FFFF00", //yellow D
                "#B7468B", // DsEb
                "#C3F2FF", // E
                "#AB0034", // F
                "#7F8BFD", // FsGb
                "#FF7F00", // G
                "#BB75FC", // GsAb
                "#33CC33", // A
                "#A9677C", // AsBb
                "#8EC9FF"  // B
            ],

            store: {
              fields: ['name', 'data1'],
              data: [
                  {'name':'C', 'data1': note12Array[0]},
                  {'name':'CsDb', 'data1':note12Array[1]},
                  {'name':'D', 'data1':note12Array[2]},
                  {'name':'DsEb', 'data1': note12Array[3]},
                  {'name':'E', 'data1':note12Array[4]},
                  {'name':'F', 'data1':note12Array[5]},
                  {'name':'FsGb', 'data1':note12Array[6]},
                  {'name':'G', 'data1':note12Array[7]},
                  {'name':'GsAb', 'data1': note12Array[8]},
                  {'name':'A', 'data1':note12Array[9]},
                  {'name':'AsBb', 'data1':note12Array[10]},
                  {'name':'B', 'data1':note12Array[11]},

              ]
            },
            series: [{
                type: 'pie',
                labelField: 'name',
                title: "Note Distribution",
                label: {
                    display: 'middle',
                    contrast: true,
                    minMargin: 10
                },
                tips: {
                    width: 80,
                    height: 25,
                    renderer: function(storeItem, item) {
                        this.setTitle(item.data1[1] + '</span>');
                    }
                },
                xField: 'data1',
            }],
        });
        Ext.Viewport.add(chart);


        var container = Ext.ComponentQuery.query('#chart1Container')[0]
        container.add(chart);
        
        
    },

    MyCallback2: function(obj){

        counter2++
        console.log(counter2)

        //set the title of the midi track 
       /* var fileName = $('#filereader2').val();
        if(!fileName){
            var fieldset = Ext.ComponentQuery.query('#analysis2')[0]
            fieldset.setTitle('Analysis of '+jsMidiParser.app.songname)
        }
        else{
            if(filename)
                fileName = fileName.substring(12, fileName.length) 
            var fieldset = Ext.ComponentQuery.query('#analysis2')[0]
            fieldset.setTitle('Analysis of '+fileName)
        }*/

        console.log("%o", obj);
        //Ext.Msg.alert("Analysis Complete.", "File 1 Has been analyzed", Ext.EmptyFn);
        var array1 = []
        for(var i=0; i<obj.tracks; i++){
            //console.log("i",i)
            var track = obj.track[i];
            for(var j=1; j<track.event.length-1; j++){
               // console.log("j",j)
                var events = track.event[j]
                for(var k=0; k<events.data.length; k++){
                    //console.log("k",k)
                    if(events.type == 9){
                        var data = events.data
                        array1.push(data[k])
                    }
                    else
                        console.log("Event Skipped")
                }
            }
        }
        console.log(array1)

        //initialize array of note occurances
        notesArray = []
        for(var i=1; i<128; i++){
            notesArray[i]=0
        }

        //sort array1 into tallied occurrances in notesArray.
        for(var i=0;i<array1.length;i++){
            var value = array1[i]
            notesArray[value]++
        }
        console.log("Note Array 0-127")
        console.log(notesArray)

        note12Array = []
        for(var i=0; i<12; i++){
            note12Array[i]=0
        }

        //sort array1 into tallied occurrances in notesArray.
        for(var i=0;i<array1.length;i++){
            if(array1[i] != 0){
                var value = array1[i]%12
                note12Array[value]++
            }
        }
        console.log("Note Array 1-12")
        console.log(note12Array)

        var total = 0

        for(var i=0;i<12;i++){
            total = total + note12Array[i]
        }
        //console.log("total")
        //console.log(total)

        var modelOne = Ext.create('jsMidiParser.model.NoteModel', {
            C: note12Array[0],
            CsDb: note12Array[1],
            D: note12Array[2],
            DsEb: note12Array[3],
            E: note12Array[4],
            F: note12Array[5],
            FsGb: note12Array[6],
            G: note12Array[7],
            GsAb: note12Array[8],
            A: note12Array[9],
            AsBb: note12Array[10],
            B: note12Array[11]
        });

        console.log(modelOne);

        var NoteStore = Ext.getStore('NoteStore');

        NoteStore.add(modelOne)

        var chart = new Ext.chart.PolarChart({
            animate: true,
            shadow: true,
            flex: 8,
            margin: 25,
            title: "Note Distribution",
            interactions: ['rotate', 
                {
                    type: 'iteminfo',
                    listeners: {
                        show: function(me, item, panel) {
                            panel.setWidth(300)
                            panel.setHeight(200)
                            panel.setHtml(
                                '<div style="font-weight: bold;">Note Name: ' + item.record.get('name') + '<div>' +
                                '<div style="font-weight: bold;">Number of Occurances: ' + item.record.get('data1') + '<div>' +
                                '<div style="font-weight: bold;">Total Note-On Occurances: ' + total + '<div>' +
                                '<div style="font-weight: bold;">Proportion: ' + item.record.get('data1')/total*100 + '%<div>'
                            );
                        }
                    }
                }
            ],
            colors: [
                "#FF0000", //red - C
                "#9000FF", //blue/purple Db
                "#FFFF00", //yellow D
                "#B7468B", // DsEb
                "#C3F2FF", // E
                "#AB0034", // F
                "#7F8BFD", // FsGb
                "#FF7F00", // G
                "#BB75FC", // GsAb
                "#33CC33", // A
                "#A9677C", // AsBb
                "#8EC9FF"  // B
            ],

            store: {
              fields: ['name', 'data1'],
              data: [
                  {'name':'C', 'data1': note12Array[0]},
                  {'name':'CsDb', 'data1':note12Array[1]},
                  {'name':'D', 'data1':note12Array[2]},
                  {'name':'DsEb', 'data1': note12Array[3]},
                  {'name':'E', 'data1':note12Array[4]},
                  {'name':'F', 'data1':note12Array[5]},
                  {'name':'FsGb', 'data1':note12Array[6]},
                  {'name':'G', 'data1':note12Array[7]},
                  {'name':'GsAb', 'data1': note12Array[8]},
                  {'name':'A', 'data1':note12Array[9]},
                  {'name':'AsBb', 'data1':note12Array[10]},
                  {'name':'B', 'data1':note12Array[11]},

              ]
            },
            series: [{
                type: 'pie',
                labelField: 'name',
                title: "Note Distribution",
                label: {
                    display: 'middle',
                    contrast: true,
                    minMargin: 10
                },
                tips: {
                    width: 80,
                    height: 25,
                    renderer: function(storeItem, item) {
                        this.setTitle(item.data1[1] + '</span>');
                    }
                },
                xField: 'data1',
            }],
        });
        Ext.Viewport.add(chart);
        var container = Ext.ComponentQuery.query('#chart2Container')[0]
        container.add(chart);
    },
});
