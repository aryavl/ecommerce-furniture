const catElements =document.querySelectorAll('.cat')
catElements.forEach(cat=>{
    cat.addEventListener('click',()=>{
        let catId = cat.getAttribute('data-catid')
        console.log(catId);
        $.ajax({
            method: 'POST',
            url: '/filter-cat',
            data: { catId: catId},
            success: function(response) {
              console.log("AJAX POST request to /test-post was successful!");
               console.log("Response:", response);
              
              Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Product added to cart!',
                });
                
      
                    document.querySelector('.js-addcart-detail').textContent = "Remove from Cart";
                  //  document.querySelector('.msg').textContent = response.message;
                    
      
            },
            error: function(error) {
              console.error("AJAX POST request to /test-post failed:", error);
            }
          });
          
    })
})
