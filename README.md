NSMAT
=====

New Software Music Analysis Tool

NSMAT

Using the Sencha Touch 2.1 Framework (HTML5 and JavaScript based application development tools) and a JavaScript based MIDI parsing function, a Music Analysis Tool was created to assist in validating the FSMC project by the EPlex research group at UCF. This tool, hereafter called NSMAT (New Software Music Analysis Tool), first accepts a MIDI file as input, then parses it into a JavaScript object. This object contains each MIDI event in the order in which it occurs. Each of these events contain data as to where in the piece they occur, as well as the MIDI note number. Most notable for this project are the "note-on" events. NSMAT after converting the MIDI file into a more easily used object, an array of the entire piece's MIDI note numbers is compiled. This serves to help create a visual representation of the distribution of distinct pitches during a piece.

MUSIC

Music at its most elementary level can be, for ease of analysis, represented as a series of numbers equating to discrete pitches and rhythms. The MIDI format, a standardized specification of messages employed by computers and synthesizers conveniently uses the numbers 1 through 127 to represent the most commonly used pitches. This enables various methods of numerical analysis to be applied to music, albeit at a low level. For example, a pattern of notes representing an arpeggiated D major chord, D, F\#, and A could be easily found as the numbers 62, 66 and 69 accordingly. Further, by using the differences between one note's MIDI number and the next, an array of note intervals from the piece can be constructed. Similar to the previous example, this enables the ability to search for an arpeggiated major chord simply by searching for the pattern of intervals 4 then 3.

FSMC

Functional scaffolding for musical composition (FSMC) is a non-traditional composition technique, perhaps more easily explained as interactive music breeding. It creates musical accompaniment through mathematics, for example through functional transformations of an existing human produced melody. It’s built on the idea that pieces of a song are functionally related to each other. This interactive musical breeding is achieved through evolving a type of artificial neural network called a CPPN, or Common Pattern Producing Network. This represents the relationship between the input and output notes. Interestingly, the software, Meastrogenesis, the current housing for the FSMC protocol requires no musical knowledge to operate; only the ability to choose what you think sounds best. While this inherently non-musical process is capable of assisting generation of pieces near indistinguishable from fully human composed works, because FSMC itself contains no encoded musical knowledge, it is not well understood what types of musical relationships these functional transformations create, preserve or destroy. The intent of my paper is to to explore the development of a software analysis program meant to investigate the linking of the musical properties that FSMC harnesses to the musical properties that FSMC defacto generates.

