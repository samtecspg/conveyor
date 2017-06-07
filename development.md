# Development

Commiting against this repo involves several built in tests.

Below is the procedure for setting up the environment for those tests.

## Environment

There is a `.env.example` file that you will need to use to create a `.env` file suitable to your environment. The number one thing to pay attention to is the ES_INDEX, which sets the index where the API will store the flow and flow tempaltes. This variable defaults to `flow` and thus stores in ES at `/flow/default` and `/flowtemplate/default`. Bur for example changing ES_INDEX=channel would store data in ES at `/channel/default` and `/channeltemplate/default`.

## Docker

Launch the development environment with `docker-compose -f docker-compose-dev.yml up --build`. This will start Node Red, Elasticsearch, and Kibana.

Go to Kibana (defaults to http://localhost:5601) and create a flow and flowtemplate. Keep in mind that if you plan on changing the default ES_INDEX environment variable you will need to create records that are in those indices.

```
POST /{{ES_INDEX}}template/default
	{
		"name": "anduin-executions",
		"description": "Anduin Executions can be posted here for storage and use in Samson",
		"parameters": [
			"channelName",
			"url"
		],
		"flow": "{\"label\":\"flow-{{channelName}}-{{_id}}\",\"nodes\":[{\"id\":\"{{channelName}}-1-{{_id}}\",\"type\":\"http in\",\"z\":\"96c7bac4.7985d8\",\"name\":\"\",\"url\":\"/{{url}}\",\"method\":\"post\",\"swaggerDoc\":\"\",\"x\":356,\"y\":455,\"wires\":[[\"{{channelName}}-3-{{_id}}\",\"{{channelName}}-4-{{_id}}\"]]},{\"id\":\"{{channelName}}-2-{{_id}}\",\"type\":\"http response\",\"z\":\"96c7bac4.7985d8\",\"name\":\"\",\"x\":646,\"y\":455,\"wires\":[]},{\"id\":\"{{channelName}}-3-{{_id}}\",\"type\":\"function\",\"z\":\"96c7bac4.7985d8\",\"name\":\"\",\"func\":\"msg.payload = 'Test Channel1';\\n\\nreturn msg;\",\"outputs\":1,\"noerr\":0,\"x\":506,\"y\":427,\"wires\":[[\"{{channelName}}-2-{{_id}}\"]]},{\"id\":\"{{channelName}}-4-{{_id}}\",\"type\":\"debug\",\"z\":\"96c7bac4.7985d8\",\"name\":\"debug\",\"active\":true,\"console\":\"false\",\"complete\":\"true\",\"x\":513.5,\"y\":514,\"wires\":[]}]}"
	}
```

Copy and paste the return `_id` into the _TEST_DATA_CHANNEL_TEMPLATE_ID_1_ in the  .env file. Also copy and paste it below for the templateId.


```
POST /{{ES_INDEX}}/default
{
    "templateId": "{{TEST_DATA_CHANNEL_TEMPLATE_ID_1}}",
    "name": "anduin-executions",
    "description": "Anduin Executions can be posted here for storage and use in Samson",
    "parameters": [
        {
            "key": "channelName",
            "value": "testname"
        }, {
            "key": "url",
            "value": "url-path"
        }
    ]
}
```

Copy and paste the returned `_id` of that command into the _TEST_DATA_CHANNEL_ID_1_ in the .env file.

With all of that done, I think you should be ready to `npm test` or commit your changes.