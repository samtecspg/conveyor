---
title: Text File
layout: default
order: 0
---

# Text File

The end goal of this plugin will be a drag and drop section were you just drag a collection of files onto the screen and *presto* all of their contents are inside of Elasticsearch. But phase one is a bit more manual.

Select a file to upload, specify how it is delimited, and a few other options detailed below. Then click finish and *presto*... well you get the idea.

## Parameters

### Basic Information

- **Name** - Give your new channel a name. The name impacts the url for configuration and data access of the channel. In a typical installation Configuration options will be available at localhost:4000/flow/{name}/config and data operations will be available at localhost:4000/flow/{name}/config
- **Description** - This description will be shown on the Channel's list page. It's useful for others and to yourself to remember what is what.
- **Index** - This one is a bit more obscure and has to do with how Elasticsearch stores data. Think of it as a table name.

### Information about the File

- **File to upload** - Well when you are going to upload a file generally you need to specify which file it is you want to upload.
- **File Format** - specify how your file is delimited. Choose other if it is a non-standard delimiter.
- **Other Seperator** - If you chose "Other" as your delimiter specify here what the delimiter should be.
- **First Row Header** - If the first row of your data contains the column names set this to true.

### Data Storage Options

- **Overwrite** - This toggle allows you to specify whether existing data should be overwritten or not when importing a new file to this same channel. If you set this to true then each time you upload a file you will be able completely overwriting the data stored in Elasticsearch. If you set it to false then you will be appending data.
- **Unique Field** - If you specify a unique field then appended data will be de-duplicated based on the unique field. This allows for incremental loading. As an example, if you exported your monthly sales orders and imprted them into Conveyor and chose the Sales Order ID, you would be able to upload a new file each month and append the data into Elasticsearch.


