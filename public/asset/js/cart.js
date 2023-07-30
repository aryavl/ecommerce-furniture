// document.querySelector('.js-addcart-detail').addEventListener('click', function() {
//     var productId = $(this).data('productid');
//     const quantity = $("#count").val();

//     // Your AJAX request to the server
//     $.ajax({
//         method: "POST",
//         url: "/cart", // The server route you set up to handle the data
//         data: { quantity: quantity, productId: productId },
//         success: function(response) {
//             console.log("AJAX request was successful!", response);
            
//             // You can show a success message here or handle the response as needed
//         },
//         error: function(error) {
//             console.error("AJAX request failed:", error);
//         }
//     });
// });
// document.querySelector('.js-addcart-detail').addEventListener('click', function() {
//     // Your AJAX request to the /test endpoint
//     $.ajax({
//       method: 'GET',
//       url: '/cart',
//       success: function(response) {
//         console.log("AJAX request to /cart was successful!");
//         console.log("Response:", response.message);
//       },
//       error: function(error) {
//         console.error("AJAX request to /test failed:", error);
//       }
//     });
//   });
  
document.querySelector('.js-addcart-detail').addEventListener('click', function() {
    // Your AJAX POST request to the /test-post endpoint
    
  
    let productId = $(this).data('productid');
    
    const quantity = $("#count").val();
    
 // Your message to be sent to the server
 

    $.ajax({
      method: 'POST',
      url: '/product-detail',
      data: { productId: productId,count:quantity },
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
    
  });