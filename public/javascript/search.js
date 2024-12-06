//   code added in clustermap.js

// const searchInput = document.querySelector('#search-input');
// const cpu=document.querySelector('#cp');
// const searchButton = document.querySelector('#search-button');




// searchInput.addEventListener('input', (e) => {
//     const text=e.target.value;
//     let content= camp.map((c) => {
//         if(c.title.toLowerCase().includes(text.toLowerCase()) || c.location.toLowerCase().includes(text.toLowerCase()) || c.description.toLowerCase().includes(text.toLowerCase())){
//             return `<div class="card mb-3">
//                 <div class="row">
//                     <div class="col-md-4">
//                         ${c.image.length!==0 ? `<img class="img-fluid img-thumbnail" src="${c.image[0].HomePage}" alt="">` : `<img class="img-fluid img-thumbnail" src="https://res.cloudinary.com/dhtxywza0/image/upload/w_400,h_300/v1684793983/YelpCamp/bqlyxwcqzivezngcbwic.jpg" alt="">`}
//                     </div>
//                     <div class="col-md-8">
//                         <div class="card-body">
//                         <h5 class="card-title">${ c.title } </h5>
//                         <br>
//                         <h3 class="card-title">$ ${ c.price } </h3>
//                         <br>
//                         <p class="card-text text-muted">Location: ${ c.location } </p>
//                         <a class="btn btn-primary" href="/items/${ c.id }">View</a>
//                     </div>
//                     </div>
//                 </div>
//             </div>`
//         }else{
//             return '';
//         }
//     });
//     const result=camp.map((c) => {
//         if(c.title.toLowerCase().includes(text.toLowerCase()) || c.location.toLowerCase().includes(text.toLowerCase()) || c.description.toLowerCase().includes(text.toLowerCase())){
//             return c;
//         }
//     });
//     cpu.innerHTML=content.join('');
// });

// searchButton.addEventListener('click', (e) => {
//     searchInput.value='';
// });