(function() {
  'use strict';

  let movies = [];

  const renderMovies = function() {
    $('#listings').empty();
    $('.material-tooltip').remove();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  const getMovies = function(searchTerm) {
    movies = [];

    const $xhr = $.ajax({
      method: 'GET',
      url: `http://www.omdbapi.com/?s=${searchTerm}`,
      dataType: 'json'
    });

    $xhr.done((data) => {
      const results = data.Search;

      for (const result of results) {
        const movie = {
          id: result.imdbID,
          poster: result.Poster,
          title: result.Title,
          year: result.Year
        };

        getPlot(movie);
      }
    });

    $xhr.fail((err) => {
      console.error(err);
    });
  };

  const getPlot = function(movie) {
    const $xhr = $.ajax({
      method: 'GET',
      url: `http://www.omdbapi.com/?i=${movie.id}&plot=full`,
      dataType: 'json'
    });

    $xhr.done((data) => {
      movie.plot = data.Plot;

      movies.push(movie);

      renderMovies();
    });

    $xhr.fail((err) => {
      console.error(err);
    });
  };

  $('form').on('submit', (event) => {
    event.preventDefault();

    const searchTerm = $('#search').val();

    if (searchTerm.trim() === '') {
      return;
    }

    getMovies(searchTerm);
  });
})();
