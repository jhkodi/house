const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

fetch("./data.json")
  .then(response => response.json())
  .then(json => {

    let htmlCode = '';
    const bodyElement = document.querySelector('body');

    if (id) {  //Single house display
      // function filterById(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['id'] == id);})[0];}
      //const house = filterById(json.houses, id);

      const house = json.houses.filter(function (jsonObject) { return (jsonObject['id'] == id); })[0];
      console.log(house);
      if (house) {
        document.title = house.title;
        htmlCode += `
          <div class="single-house">
            <div>
              <h1 style="color:red;">${house.title}, ${house.price} ${house.extra_info ? '<br>(' + house.extra_info + ')' : ''}</h1>
              <h2>${house.bedrooms} · ${house.bathrooms} · ${house.parkings} · ${house.size} · ${house.year} yr</h1>
              <h2>費$${house.condo_fee} · 地$${house.city_tax} · 校$${house.school_tax}</h1>
            </div>`

        if (house.google_map) {
          htmlCode += `
            <div>
              <iframe src="${house.google_map}"
              style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>`
        }

        htmlCode += '<div>';
        house.images.forEach(image => {
          htmlCode += `<img class="single-house__image" src="${image}">`;
        });

        htmlCode += "</div>";
        htmlCode += "</div>";

      }
      else {
        htmlCode = '<p>Invalid id</p>';
      }
    }

    // All houses listing
    else {

      htmlCode = '<table class="house-table">';
      json.houses.forEach(house => {
        if (house.display) {
          htmlCode += `
            <tbody class="${(house.date_delisted ? 'not-' : '')}available">
              <tr>
                <td colspan="99" class="house-table__cover"><a href="?id=${house.id}"><img src ="${house.images[0]}"></a></td>
              </tr>
              <tr>
                <td class="house-table__price">${house.price}</td>
                <td class="house-table__address">${house.address}</td>
                <td class="house-table__description">${house.extra_info}</td>
              </tr>
              <tr>
                <td colspan="99" class="house-table__detail">${house.bedrooms} · ${house.bathrooms} · ${house.parkings} · ${house.size} · ${house.year} yr
                  <br>費$${house.condo_fee} · 地$${house.city_tax} · 校$${house.school_tax}</td>
              </tr>
            </tbody>
          <tr><td class="house-table__blank-row">&nbsp;</td></tr>`;
        }
      });

      htmlCode += '</table>';

      //console.log(htmlCode);

    }

    bodyElement.innerHTML = htmlCode;

  });