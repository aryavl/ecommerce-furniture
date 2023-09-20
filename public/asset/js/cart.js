
  
document.querySelector('.js-addcart-detail').addEventListener('click', function() {
    // Your AJAX POST request to the /test-post endpoint
    
  
    let productId = $(this).data('productid');
    
    const quantity = 1;
    
 // Your message to be sent to the server
 

    $.ajax({
      method: 'POST',
      url: '/product-detail',
      data: { productId: productId,count:quantity },
      success: function(response) {
        console.log("AJAX POST request to /test-post was successful!");
         console.log("Response:", response);
        
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Success!',
        //     text: 'Product added to cart!',
        //   });
          

              // document.querySelector('.js-addcart-detail').textContent = "Remove from Cart";
            //  document.querySelector('.msg').textContent = response.message;
              

      },
      error: function(error) {
        console.error("AJAX POST request to /test-post failed:", error);
      }
    });
    
  });