const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
const posListString = urlParams.get('list');


fetch("./data.json")
  .then(response => response.json())
  .then(json => {

    let htmlCode = '';
    const bodyElement = document.querySelector('body');

    if (id) {  //Single house display
      // function filterById(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['id'] == id);})[0];}
      //const house = filterById(json.houses, id);

      const house = json.houses.filter(function (jsonObject) { return (jsonObject['id'] == id); })[0];
      //console.log(house);
      if (house) {
        document.title = house.title;
        htmlCode += `
          <div class="single-house">
            <div>
              <h1 style="color:red;">${house.title}, ${house.price} ${house.extra_info ? '<br>(' + house.extra_info + ')' : ''}</h1>
              <h2>${house.bedrooms} · ${house.bathrooms} · ${house.parkings} · ${house.size} · ${house.year} yr</h2>
              <h2>費$${house.condo_fee} · 地$${house.city_tax} · 校$${house.school_tax}</h2>
              <div class="single-house__external-links">
                <a href="${(house.centris_link) ? house.centris_link : '#'}"><i class="fa-solid fa-house-circle-${(house.centris_link) ? 'check' : 'exclamation'}"></i></a>
                <a href="http://www.google.com/search?q=${encodeURIComponent('centris ' + house.centris)}"><i class="fa-solid fa-magnifying-glass-arrow-right"></i></a>
                <a href="http://maps.google.com/?q=${encodeURIComponent(house.address)}"><i class="fa-solid fa-location-dot"></i></a>
              </div>
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
    else {

      htmlCode += `
        <div class="lists-div">
          <label for="lists">選擇清單: </label>
          <select name="lists" id="lists" class="lists-select" onChange="listChange(this)">
            <option value="">全部</option>`;
      predefinedList = false;
      Object.entries(json.lists).forEach(([listName, listValue]) => {        
        predefinedList = (predefinedList || (listValue == posListString));
        htmlCode += `<option value="${listValue}" ${(listValue == posListString) ? ' selected' : ''}>${listName}</option>`;
      });
      if (!predefinedList && posListString) {
        console.log(`<option value="${posListString}" selected>自訂清單</option>`);
        htmlCode += `<option value="${posListString}" selected>自訂清單</option>`;
      }
      htmlCode += `</select></div>`;


      if (posListString) {  //Position listing display

        const posList = posListString.split(',');
        htmlCode += '<table class="house-pos-list-table">';
        posList.forEach(pos => {
          const house = json.houses.filter(function (jsonObject) { return (jsonObject['pos'] == pos); })[0];
          //console.log(house);
          htmlCode += `
          <tbody class="${(house.date_delisted ? 'not-' : '')}available">
            <tr>
              <td class="house-pos-list-table__cover">${(house.pos > 0) ? '<span class="house-pos-list-table__postion">' + house.pos + '</span>' : ""}<a href="?id=${house.id}"><img src ="${house.images[0]}"></a></td>
              <td class="house-pos-list-table__price">${house.price}</td>
              <td class="house-pos-list-table__address">${house.address}, ${house.city}</td>
              <td class="house-pos-list-table__external-info">
                ${house.centris}<br>
                <div class="house-pos-list-table__external-links">
                  <a href="${(house.centris_link) ? house.centris_link : '#'}"><i class="fa-solid fa-house-circle-${(house.centris_link) ? 'check' : 'exclamation'}"></i></a>
                  <a href="http://www.google.com/search?q=${encodeURIComponent('centris ' + house.centris)}"><i class="fa-solid fa-magnifying-glass-arrow-right"></i></a>
                  <a href="http://maps.google.com/?q=${encodeURIComponent(house.address)}"><i class="fa-solid fa-location-dot"></i></a>
                </div>
              </td>
            </tr>
          </tbody>`;

        });
        htmlCode += '</table>';

      } else { // All houses listing

        htmlCode += '<table class="house-table">';
        json.houses.forEach(house => {
          if (house.display) {
            if (house.pos > 0) {
              //htmlCode += `${house.pos}`;
            }
            htmlCode += `
            <tbody class="${(house.date_delisted ? 'not-' : '')}available">
              <tr>
                <td colspan="99" class="house-table__cover">${(house.pos > 0) ? '<span class="house-table__postion">' + house.pos + '</span>' : ""}<a href="?id=${house.id}"><img src ="${house.images[0]}"></a></td>
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

        

      }
    }

    //console.log(htmlCode);
    bodyElement.innerHTML = htmlCode;

  });

function listChange(selectObject) {
  var value = selectObject.value;
  window.location.href = (selectObject.value ? "?list=" + selectObject.value : ".");
}  