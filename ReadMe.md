# OrderAPI_Validator

1) Post:
- url: ```localhost:3001/api/validator?retailer=<retailer>```
- body: Payload for the Order API
- response body: Notes on the payload
2) Get:
- url: ```localhost:3001/api/retrieve?retailer=<retailer>&order=<order>```
- response body: The exact json payload from the Post

## Schema for Post Response

### Valid Order API JSON
```
{
	"Success": "Perfect"
}
```

### Malformed Schema or Missing/Malformed data
```
{
	"Warning": "This JSON will not work",
	"Errors": {
		"this will bee a list of attributes that are failing"
	},
	"Notes": {

	}
}
```

### Malformed JSON
```
{
	"Error": "Malformed JSON"
}
```