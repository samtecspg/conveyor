---
title: Basics
layout: default
order: 0
---

# Basic of Source Authoring

Having many Sources and having quality sources is paramount to the Conveyor product. Both quality and quantity improve the ease at which a user can get data into Elasticsearch using Conveyor. As such, we're going to walk through how to create sources and some best practices when doing so.

### Node-RED

To get started authoring your own Sources, you'll first need an understanding of Node-RED. If you havven't used it before then check out this quick and fun tutorial I wrote for it. [A Fun Introduction to Node-RED](https://blog.spg.ai/a-fun-introduction-to-node-red-4d14d8bdbc6b)

Here is what the basic Node-RED interface looks like.

![Blank Node-RED Interface]()

On the left you have a list of available nodes, the center contains the flow or where the flow will go, and the right contains an info and debug panel. To create a flow you drag nodes onto the flow and connect them. For more detail see the above tutorial.

Some nodes like the `function` node provide a blank text box for inputting your code.

![Editing a Function Node]()

While other provide more guided inputs.

![Editing a Switch Node]()

Both of these nodes have a JSON representation. To see the JSON behind a node select it, click the menu button in the upper right hand corner, select export, choose to your clipboard, and see the JSON representation of the Node you have selected. As an example, the below is the JSON from the switch node.

```
[
    {
        "id": "5ad142fa.4caaec",
        "type": "switch",
        "z": "a12e453d.6c0c4",
        "name": "",
        "property": "payload",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": ""
            }
        ],
        "checkall": "true",
        "outputs": 1,
        "x": 97.5,
        "y": 62,
        "wires": [
            []
        ]
    }
]
```
{% raw %}
All of the values in the above JSON can be replaced with `{{Mustache}}` parameters. Some of them even have to be replaced. This forms the basis for how sources work.
{% endraw %}

### Flow Templates

In the API the JSON definition of a source is stored as a *flow definition* and interacting with them is done via the `/flowtemplate` endpoint. This definition contains the Node-RED flow, which is an array of the Node Object shown above. But it also has more information, which is mostly used for generating the UI that the user will see when they are creating a Channel.

Here is the high level Flow Template JSON:

```
{
    "name": ,
    "description": ,
    "groups": [],
    "parameters": [],
    "flow": {}
}
```

Name and Description seem self explanatory. Groups and Parameters are best shown with an example. Take the below JSON consisting of 2 groups, each with just a single parameter.

```
NEED TO CREATE THIS
```

This would be rendered as below:

![Basic Conveyor Groups and Parameters Markup]()

The above markup is inclusive of all current functionality for groups. Though there are several open issues to enhance groups. But there are more parameters available than just the text parameter. For full documentation see the [Parameters](./parameter-types/) section of the docs.

## A Basic, but complete example

Probably the most basic example would just be a single node with a single group and parameter. But we want this basic example to have some meat on it's bones. This example will create a record in Elasticsearch every time a button is clicked in Node-RED. We're assuming you followed the [Basic Installation Instructions](../getting_started/basic-installation/). If you didn't then it may require some adaptation. For some tips on how to manage custom configurations see the section on [Global Configuration](./global-configuration/) values, but we aren't using them in this example.