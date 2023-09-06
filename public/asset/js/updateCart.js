
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
           console.log("Response:-----", response);
document.getElementById("total").value = response.grandTotal
        
  
        },
        error: function(error) {
          console.error("AJAX POST request to /test-post failed:", error);
        }
      });
      
}
