'use strict';

// put your own value below!
const apiKey = 'ZGeon6KCIUK4AfHIzXhCaXJAledfZvDqU7vOzsL7'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson.total);
  if(responseJson.total != 0){
    $('#results-list').empty();
    $('#format-error').addClass('hidden');
    // iterate through the items array
    for (let i = 0; i < responseJson.data.length; i++){
      let parkAddress = responseJson.data[i].addresses[0];
      $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}
      <span class="park-url"><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></span>
      </p>
      <p>Address:<br> 
      ${parkAddress.line1} ${parkAddress.line2}<br>
      ${parkAddress.city}, ${parkAddress.stateCode} ${parkAddress.postalCode}
      </p>
      </li>`
    )};
    //display the results section  
    $('#results').removeClass('hidden');
  }else{
    $('#results-list').empty()
    $('#results').addClass('hidden');
    $('#format-error').removeClass('hidden');
  }
  
}

function getNationalParksInfo(query, maxResults=10) {
  const params = {
    stateCode: query,
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNationalParksInfo(searchTerm, maxResults);
  });
}

$(watchForm);