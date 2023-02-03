import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RepoSearch.css";

const RepoSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [repos, setRepos] = useState([]);
  const [sortedRepos, setSortedRepos] = useState([]);
  const [sortOption, setSortOption] = useState("stars");

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${searchTerm}`
      );
      setRepos(response.data.items);
    };

    fetchRepos();
  }, [searchTerm]);

  useEffect(() => {
    if (sortOption === "updated_at") {
      setSortedRepos([...repos].sort((a, b) => {
        const aDate = new Date(a[sortOption]);
        const bDate = new Date(b[sortOption]);
        return bDate - aDate;
      }));
    } else {
      setSortedRepos([...repos].sort((a, b) => b[sortOption] - a[sortOption]));
    }
  }, [repos, sortOption]);

  const handleSearch = event => {
    event.preventDefault();
    setSearchTerm(searchTerm);
  };

  const handleSort = event => {
    setSortOption(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <select onChange={handleSort} value={sortOption}>
        <option value="stars">Stars</option>
        <option value="watchers">Watchers</option>
        <option value="score">Score</option>
        <option value="name">Name</option>
        <option value="created_at">Created at</option>
        <option value="updated_at">Updated at</option>
      </select>
      <div className="repo-cards">
        {sortedRepos.map(repo => (
          <div className="repo-card" key={repo.id}>
            <img src={repo.owner.avatar_url} alt={repo.owner.login} />
            <h2>{repo.name}</h2>
            <p>Stars: {repo.stargazers_count}</p>
            <p>Description: {repo.description}</p>
            <p>Language: {repo.language}</p>
          </div>
        ))}
         
      </div>
    </div>
  );
};

export default RepoSearch;
