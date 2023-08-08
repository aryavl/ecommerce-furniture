// // Get a reference to the input field

// // document.addEventListener("DOMContentLoaded", function() {
// //     console.log("DOMContentLoaded event fired");
// //     // Rest of your code here
// //     document.querySelector('.why').addEventListener('change', function() {
// //         console.log("input value changed");
// //         console.log("input value changed:", this.value);
// //       });
// //   });
// const countInputs = document.querySelectorAll('.why');

// countInputs.forEach(input => {
//   input.addEventListener('change', function () {
//     const itemId = this.dataset.itemId;
//     const quantity = this.value;
//     console.log(quantity,itemId); // Log the updated input value
//   });

//   const decrementBtn = input.previousElementSibling;
//   const incrementBtn = input.nextElementSibling;

//   decrementBtn.addEventListener('click', function () {
//     const inputField = this.nextElementSibling;
//     let value = parseInt(inputField.value);
//     if (value > 1) {
//       inputField.value = --value;
//       inputField.dispatchEvent(new Event('change'));
//     }
//   });

//   incrementBtn.addEventListener('click', function () {
//     const inputField = this.previousElementSibling;
//     inputField.value = this.value+inputField.value;
//     inputField.dispatchEvent(new Event('change'));
//   });
// });
// // Define the event handler function
// function handleChange(event) {
//   // Get the updated value from the input field
//   const newValue = event.target.value;
  
//   // Get the data-item-id attribute from the input field
//   const itemId = event.target.getAttribute('data-item-id');
// console.log(newValue);
//   // Make an Axios POST request with the updated value and item ID
//   axios.post('/cart', {
//     itemID: itemId,
//     count: newValue
//   })
//   .then(response => {
//     // Handle the response if needed
//     console.log('Request successful:', response.data);
//   })
//   .catch(error => {
//     // Handle errors if the request fails
//     console.error('Error:', error);
//   });
// }
const input =  document.getElementById("inpt")
const message = (msg,cls)=>{
const p=document.querySelector('.msg')
p.innerHTML=msg
p.classList.add(cls);
}
function increasecount(prdId,count){
   
    count++
    // console.log(prdId);
    
    axiosFetching(prdId,count)
   }

function decrementCount(prdId,count){
    if(count<=1){
        // console.log(count);
        message("Quantity minimum zero", "text-danger") 
      }else{
        count--;
        axiosFetching(prdId,count)
      }
}

function axiosFetching(prdId,count){
    $.ajax({
        method: 'POST',
        url: '/updateQuantity',
        data: { productId: prdId,count:count },
        success: function(response) {
          console.log("AJAX POST request to /test-post was successful!");
           console.log("Response:", response);

        //    if(response.exceed){
        //            message(response.message, "text-danger") 

        //     }else{
        //         message("","")
        //     }
        input.value=count;
        location.reload();
  
        },
        error: function(error) {
          console.error("AJAX POST request to /test-post failed:", error);
        }
      });
      
}
