
  function validateForm() {
    // Clear any previous error messages
    document.getElementById('error-message').innerText = '';

    // Get input field values
    var name = document.getElementsByName('name')[0].value;
    var phone = document.getElementsByName('phone')[0].value;
    var houseNumber = document.getElementsByName('houseNumber')[0].value;
    var pincode = document.getElementsByName('pincode')[0].value;
    var address = document.getElementsByName('address')[0].value;
    var city = document.getElementsByName('city')[0].value;
    var state = document.getElementsByName('state')[0].value;

    // Validation rules (you can customize these)
    if (name.trim() === '') {
      showError('Please enter a valid name.');
      return false;
    }

    if (phone.trim() === '' || isNaN(phone)) {
      showError('Please enter a valid phone number.');
      return false;
    }

    if (houseNumber.trim() === '' || isNaN(houseNumber)) {
      showError('Please enter a valid house number.');
      return false;
    }

    if (pincode.trim() === '' || isNaN(pincode)) {
      showError('Please enter a valid pincode.');
      return false;
    }

    if (address.trim() === '') {
      showError('Please enter a valid address.');
      return false;
    }

    if (city.trim() === '') {
      showError('Please enter a valid city.');
      return false;
    }

    if (state.trim() === '') {
      showError('Please enter a valid state.');
      return false;
    }

    // If all fields are valid, the form can be submitted
    return true;
  }

  function showError(errorMessage) {
    document.getElementById('error-message').innerText = errorMessage;
  }
