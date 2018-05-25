(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        // Unsplash
        let imgRequest = new XMLHttpRequest();
        imgRequest.onload = addImage;
        imgRequest.onerror = function(err){
            resquestError(err, 'image');
        };
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID d27788dc48e5657d3d0b44fdeebc8704ee37cea42f6c2e29c7b5cc9675386a1b');
        imgRequest.send();

        // NYT Articles
        let articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=5a45e5af2fee47e4849852e377600a1d`);
        articleRequest.send();
    });

    function addImage(){
    	//convert the response into a javascript object | format data
        const data = JSON.parse( this.responseText );
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

    function addArticles () {
        let htmlContent = '';
        const data = JSON.parse( this.responseText );

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

