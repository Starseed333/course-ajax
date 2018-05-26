/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
    		url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
    		headers: {
    			Authorization: 'Client-ID d27788dc48e5657d3d0b44fdeebc8704ee37cea42f6c2e29c7b5cc9675386a1b'
    		}
    	}).done(addImage)
    	.fail(function(err) {
    		console.log("Sorry Unsplash Error");
    		requestError(err, 'image');
    		console.log("Sorry image error");
    	});

    	$.ajax({
    		url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=5a45e5af2fee47e4849852e377600a1d`,
    	}).done(addArticles)
    	.fail(function(err) {
    		console.log("Sorry NY Times error");
    		requestError(err, 'articles');
    		console.log("Sorry Article Error");
    	});


    });
    //the data is passed in directly as an object
    function addImage(data){
    	//jquery will automatically convert the response to json
        let htmlContent = '';
        //handle the case if no images are returned
		if (data && data.results && data.results[0]){
            const firstImage = data.results[0];
            htmlContent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = '<div class= "error-no-image">Sorry no images available</div>';
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles (data) {
        let htmlContent = '';
        if (data.response && data.response.docs && data.response.docs.length > 1){
            htmlContent = '<ul>' + data.response.docs.map(article => `<li>
                    <h2><a href="${article.web_url}">${article.headline.main}</a><h2>
                    <p>${article.snippet}</p>
                </li>`
            ).join('')+ '</ul>';
        } else {
            htmlContent = '<div class= "error-no-articles">No articles available</div>';
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
})();
