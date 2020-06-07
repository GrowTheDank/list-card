class ListCard extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
      if (!config.entity) {
        throw new Error('Please define an entity');
      }

      const root = this.shadowRoot;
      if (root.lastChild) root.removeChild(root.lastChild);

      const cardConfig = Object.assign({}, config);
      const columns = cardConfig.columns;
      const card = document.createElement('ha-card');
      const content = document.createElement('div');
      const style = document.createElement('style');
      style.textContent = `
            ha-card {
              /* sample css */
            }
            table {
              width: 100%;
              padding: 0 16px 16px 16px;
            }
            thead th {
              text-align: left;
            }
            tbody tr:nth-child(odd) {
              background-color: var(--paper-card-background-color);
            }
            tbody tr:nth-child(even) {
              background-color: var(--secondary-background-color);
            }
            .button {
              overflow: auto;
              padding: 16px;
            }
            paper-button {
              float: right;
            }
            td a {
              color: var(--primary-text-color);
              text-decoration-line: none;
              font-weight: normal;
            }
          `;

      // Go through columns and add CSS sytling to each column that is defined
      if (columns) {
        for (let column in columns) {
          if (columns.hasOwnProperty(column) && columns[column].hasOwnProperty('style')) {
            let styles = columns[column]['style'];

            style.textContent += `
              .${columns[column].field} {`

            for (let index in styles) {
              if (styles.hasOwnProperty(index)) {
                for (let s in styles[index]) {
                  style.textContent += `
                  ${s}: ${styles[index][s]};`;
                }
              }
            }

            style.textContent += `}`;
          }
        }
      }

      content.id = "container";
      cardConfig.title ? card.header = cardConfig.title : null;
      card.appendChild(content);
      card.appendChild(style);
      root.appendChild(card);
      this._config = cardConfig;
    }

    set hass(hass) {
      const config = this._config;
      const root = this.shadowRoot;
      const card = root.lastChild;

      if (hass.states[config.entity]) {
        const feed = config.feed_attribute ? hass.states[config.entity].attributes[config.feed_attribute] : hass.states[config.entity].attributes;
        const columns = config.columns;
        this.style.display = 'block';
        const rowLimit = config.row_limit ? config.row_limit : Object.keys(feed).length;
        let rows = 0;

        if (feed !== undefined && Object.keys(feed).length > 0) {
          let card_content = '<ul>';

          for (let entry in feed) {
            if (rows >= rowLimit) break;
            if (feed.hasOwnProperty(entry)) {
              if (!columns) {
                for (let field in feed[entry]) {
                  if (feed[entry].hasOwnProperty(field)) {
                    card_content += `${feed[entry][field]}`;
                  }
                }
              } else {
                let has_field = true;
                for (let column in columns) {
                  if (!feed[entry].hasOwnProperty(columns[column].field)) {
                    has_field = false;
                    break;
                  }
                }
                if (!has_field) continue;
                for (let column in columns) {
                  if (columns.hasOwnProperty(column)) {
                    card_content += `<li class=${columns[column].field}>`;
                    if (columns[column].hasOwnProperty('add_link')) {
                      card_content +=  `<a href="${feed[entry][columns[column].add_link]}" target='_blank'>`;
                    }
                    if (columns[column].hasOwnProperty('type')) {
                      if (columns[column].type === 'image') {
                        if (feed[entry][columns[column].field][0].hasOwnProperty('url')) {
                          let newText = `<img src="${feed[entry][columns[column].field][0].url}" width="70" height="90">`;
                          }
		      }
		    } else {
			if (columns[column].hasOwnProperty('regex')) {
                  	  let newText = new RegExp(columns[column].regex).exec(feed[entry][columns[column].field]);
                          if (columns[column].hasOwnProperty('prefix')) {
                            newText = columns[column].prefix + newText;
                          }
                          if (columns[column].hasOwnProperty('postfix')) {
                            newText += columns[column].postfix;
                          }
                          card_content += `${newText}`;

			} else {
		          let newText = feed[entry][columns[column].field];
                    	  if (columns[column].hasOwnProperty('prefix')) {
                      	    newText = columns[column].prefix + feed[entry][columns[column].field];
                    	  } 
                    	  if (columns[column].hasOwnProperty('postfix')) {
                      	    newText += columns[column].postfix;
                    	  }
                    	  card_content += `${newText}`;
			}
		    }
                    if (columns[column].hasOwnProperty('add_link')) {
                      card_content +=  `</a>`;
                    }
                  }
                }
              }
              card_content += `</li`;
              ++rows;
            }
          }
          root.lastChild.hass = hass;
          card_content += `</ul>`;
          root.getElementById('container').innerHTML = card_content;
        } else {
          this.style.display = 'none';
        }
      } else {
        this.style.display = 'none';
      }
    }

    getCardSize() {
      return 1;
    }
  }

  customElements.define('list-card', ListCard);
