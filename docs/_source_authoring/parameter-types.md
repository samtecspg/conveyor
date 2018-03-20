---
title: Parameter Types
layout: default
order: 0
---

# Parameter Types

if you've already walked through the Basic Source Authoring Tutorial then you'll know that the source definition file is a JSON file. In that JSON file you specify the available parameters for your source. Within Conveyor you have multiple different types of parameters available to you. Some of their details are documented below.

## Text Parameter
The text parameter is your bread and butter. use it anywhere you want a string, even better it's parameter syntax is straightforward.

```
{
    "type": "text",
    "group": "groupName",
    "name": "parameterName",
    "label": "Parameter Label",
    "description": "A description of your parameter.",
    "required": true
}
```

## Code Parameter
Need t large text box for some code, then this is what you need.

```
{
    "type": "code",
    "group": "groupName",
    "name": "parameterName",
    "label": "Parameter Label",
    "placeholder": "Query",
    "description": "A description of your parameter.",
    "required": true
}
```

## Password Parameter

The Password parameter simply hides the password as it's typed on screen. Eventually we will handle better storage of passwords.

```
{
    "type": "password",
    "group": "groupName",
    "name": "parameterName",
    "label": "Parameter Label",
    "description": "A description of your parameter.",
    "required": true
}
```

## Boolean Parameter

This will be reprsented as a switch in the UI and it evalutates to `true` `false` in the Node-RED flow.

```
{
    "type": "boolean",
    "group": "groupName",
    "name": "parameterName",
    "label": "Parameter Label",
    "description": "A description of your parameter.",
}
```

## File Parameter
The file parameter allows the user to upload a file. This file will then be POST'd to `/flow/{name}/data` as aMulti part form upload.

```
{
    "type": "file",
    "group": "groupName",
    "name": "parameterName",
    "label": "Parameter Label",
    "description": "A description of your parameter.",
}
```