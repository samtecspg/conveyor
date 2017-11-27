---
title: /flowtemplate
layout: default
order: 0
---

# /flowtemplate
As we discussed in the [How it Works](../) section on the first page, conveyor scripts Node-RED to create some extra ease of getting data into Elastic. Specifically we create Node-RED templates for typical data sources. These templates are stored in Elastisearch as Flow Templates and can created/read/updated/delete from the `/flowtemplate` endpoint.

### Basic Structure
The basic structure of a flow tempalte is shown below:
```
{
    "name": ,
    "description": ,
    "groups": [],
    "parameters": [],
    "flow": {}
}
```

 - **name** - A descriptive name for your channel source.
 - **description** - A more in depth synopsis of the capability of the channel source.
 - **groups** - A logical grouping of parameters.
 - **parameters** - The values from your Node-RED flow that can be set when creating an instance from the channel source. For more information see the Parameter Types section of Authoring a Channel Source.
 - **flow** - The actual Node-RED flow as a JSON object with parameters placedholders defined with `{{handlebars}}` markup.

 All of the below endpoints operate on the above above structure.
 
 If you have the conveyor API running locally you can visit [http://localhost:4000/documentation](http://localhost:4000/documentation) for a Swagger based explorer.