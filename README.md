# List Card

This card give you a table generated with data from the [feedparser custom component](https://github.com/custom-components/sensor.feedparser) or any other sensor that provides data as a list of attributes.

![example](example.png)

From left to right: [feedparser](https://github.com/custom-components/sensor.feedparser) | [aftership](https://github.com/custom-components/sensor.aftership) | [untappd](https://github.com/custom-components/sensor.untapped)

## Options

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:list-card`
| entity | string | **Required** | The entity_id of the entity you want to show.
| title | string | **Optional** | Add a custom title to the card.
| row_limit | number | **Optional** | Limit the number of rows to display.
| columns | object | **Optional** | List of columns to display.

## Column object

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| title | string | **Required** | Column header to display.
| field | string | **Required** | key value of the entity that you wish to display.
| add_link | string | **Optional** | key value of entity that has the link property to use.
| type | string | **Optional** | options are `image`. Default is `text`.
| style | object | **Optional** | CSS styles to apply to this column.
| regex | string | **Optional** | Regex string to apply to field.
| prefix | string | **Optional** | String to prefix to field.
| postfix | string | **Optional** | String to postfix to field.


## Installation

### Step 1

Install `list-card` by copying `list-card.js`from this repo to `<config directory>/www/list-card.js` on your Home Assistant instanse.

**Example:**

```bash
wget https://raw.githubusercontent.com/custom-cards/list-card/master/list-card.js
mv list-card.js /config/www/
```

### Step 2

Link `list-card` inside you `ui-lovelace.yaml`.

```yaml
resources:
  - url: /local/list-card.js?v=0
    type: js
```

### Step 3

Add a custom element in your `ui-lovelace.yaml`

```yaml
      - type: custom:list-card
        entity: sensor.engineering_feed
        title: Engineering Feed
        columns:
          - title: ''
            type: image
            add_link: link
            field: image
          - title: Title
            field: title
            style:
              - white-space: nowrap
          - title: Description
            field: description
```
