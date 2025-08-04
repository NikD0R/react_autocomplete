import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

interface AppProps {
  delay?: number;
}

export const App: React.FC<AppProps> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selected, setSelected] = useState<Person | null>(null);

  function updateSuggestions(newQuery: string) {
    setSuggestions(
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(newQuery),
      ),
    );
  }

  const applyQuery = useCallback(debounce(updateSuggestions, delay), [delay]);

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (selected && event.target.value !== selected.name) {
      setSelected(null);
    }

    setQuery(event.target.value.toLowerCase());
    applyQuery(event.target.value.toLowerCase());
  }

  function handleFocusInput(event: React.FocusEvent<HTMLInputElement>) {
    if (event.target.value === '') {
      setSuggestions(peopleFromServer);
    }
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocusInput}
              onBlur={() => setSuggestions([])}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {suggestions.map(suggestion => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={suggestion.name}
                  onMouseDown={() => setSelected(suggestion)}
                >
                  <p className="has-text-link">{suggestion.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {query !== '' && suggestions.length === 0 && (
          <div
            className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start
            "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
