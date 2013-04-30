// This model represents the Student information returned by the service
Ext.define('jsMidiParser.model.NoteModel', {
	extend: 'Ext.data.Model',

	config: {
        identifier: {
                type: 'uuid'
            },
		idProperty: 'Song_ID',
		fields: [
			{
				name: 'C',
			},
			{
				name: 'CsDb',
			},
			{
				name: 'D',
			},
			{
				name: 'DsEb',
			},
			{
				name: 'E',
			},
			{
				name: 'F',
			},
			{
				name: 'FsGb',
			},
			{
				name: 'G',
			},
			{
				name: 'GsAb',
			},
			{
				name: 'A',
			},
			{
				name: 'AsBb',
			},
			{
				name: 'B',
			},
		],
	}
});