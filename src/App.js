import React, {
  Component
}
from 'react';
import './App.css';

const DEFAULT_QUERY = 'Bill Gates';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

function isSearched(query) {
  return function(item) {
    return !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !==
      -1;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      searchKey: '',
    };
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
  }

  needsToSearchTopstories(query) {
    return !this.state.results[query];
  }

  setSearchTopstories(result) {
    const {
      hits, page
    } = result;
    const {
      query
    } = this.state;
    const {
      searchKey
    } = this.state;
    const oldHits = page === 0 ? [] : this.state.results[searchKey].hits;
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {...this.state.results, [searchKey]: {
          hits: updatedHits,
          page
        }
      }
    });
  }

  fetchSearchTopstories(query, page) {
    fetch(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
      )
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const query = this.state.query;
    this.fetchSearchTopstories(query, DEFAULT_PAGE);
    this.setState({
      searchKey: query
    });
  }

  onSearchSubmit(event) {
    const {
      query
    } = this.state;
    this.setState({
      searchKey: query
    });
    if (this.needsToSearchTopstories(query)) {
      this.fetchSearchTopstories(query, DEFAULT_PAGE);
    }
    event.preventDefault();
  }
  onSearchChange(event) {
    this.setState({
      query: event.target.value
    });
  }
  render() {
    const {
      query, results, searchKey
    } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) ||
      0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return ( < div className = "main-wrapper" >
      < div className = "page" >
      < div className = "interactions" >
      < h1 > Yet Another Hacker News Clone < /h1> < Search value = {
        query
      }
      onChange = {
        this.onSearchChange
      }
      onSubmit = {
        this.onSearchSubmit
      } > Search < /Search> < /div> < Table list = {
        list
      }
      /> < div className = "interactions" >
      < Button onClick = {
        () => this.fetchSearchTopstories(searchKey, page + 1)
      } > More < /Button> < /div> < /div> < /div>
    );
  }
}

function Search({
  value, onChange, onSubmit, children
}) {
  return ( < form onSubmit = {
      onSubmit
    } >
    < input type = "text"
    value = {
      value
    }
    onChange = {
      onChange
    }
    /> < button type = "submit" > {
      children
    } < /button> < /form>
  );
}

function Table({
  list
}) {
  return ( < div className = "table" > {
    list.map((item) =>
      < div key = {
        item.objectID
      }
      className = "table-row" >
      < span style = {
        {
          width: '40%'
        }
      } > < a href = {
        item.url
      } > {
        item.title
      } < /a></span >
      < span style = {
        {
          width: '30%'
        }
      } > {
        item.author
      } < /span> < span style = {
        {
          wdith: '15%'
        }
      } > {
        item.num_comments
      } < /span> < span style = {
        {
          width: '15%'
        }
      } > {
        item.points
      } < /span> < /div>
    )
  } < /div>);
}

function Button({
  onClick, children
}) {
  return ( < button onClick = {
      onClick
    }
    type = "button" > {
      children
    } < /button>
  );
}
export default App;
