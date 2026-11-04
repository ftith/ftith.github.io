(function () {
  "use strict";

  var search = document.getElementById("site-search");
  if (!search) return;

  var input = document.getElementById("search-input");
  var status = document.getElementById("search-status");
  var results = document.getElementById("search-results");
  var index = [];

  function renderResults() {
    var terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    results.replaceChildren();

    if (!terms.length) {
      status.textContent = "Enter a search term to find posts.";
      return;
    }

    var matches = index.filter(function (page) {
      var searchable = [page.title, page.summary, page.content, page.tags]
        .join(" ")
        .toLocaleLowerCase();
      return terms.every(function (term) {
        return searchable.includes(term);
      });
    }).sort(function (a, b) {
      var aTitle = a.title.toLocaleLowerCase();
      var bTitle = b.title.toLocaleLowerCase();
      var query = terms.join(" ");
      var aStarts = aTitle.startsWith(query) ? 0 : 1;
      var bStarts = bTitle.startsWith(query) ? 0 : 1;
      return aStarts - bStarts || aTitle.localeCompare(bTitle);
    });

    matches.forEach(function (page) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.className = "post-card";
      link.href = page.permalink;

      var title = document.createElement("h2");
      title.className = "post-card__title";
      title.textContent = page.title;
      link.appendChild(title);

      var excerpt = document.createElement("p");
      excerpt.className = "post-card__excerpt";
      excerpt.textContent = page.summary;
      link.appendChild(excerpt);

      item.appendChild(link);
      results.appendChild(item);
    });

    status.textContent = matches.length
      ? matches.length + (matches.length === 1 ? " result" : " results")
      : "No results found.";
  }

  fetch(search.dataset.indexUrl)
    .then(function (response) {
      if (!response.ok) throw new Error("Search index request failed: " + response.status);
      return response.json();
    })
    .then(function (pages) {
      if (!Array.isArray(pages)) throw new Error("Search index has an invalid format.");
      index = pages;
      input.disabled = false;
      status.textContent = "Enter a search term to find posts.";
      input.addEventListener("input", renderResults);
    })
    .catch(function (error) {
      console.error(error);
      status.textContent = "Search is unavailable right now.";
    });
})();
