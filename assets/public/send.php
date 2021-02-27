<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST'){     
    // CHANGE THE TWO LINES BELOW
    $email_to = "imrantectivo@gmail.com";
     
    $email_subject = "Customer Contact";
     
     
    function died($error) {
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }
     
    // validation expected data exists
    if(!isset($_POST['first_last_name']) ||
        !isset($_POST['email']) ||
        !isset($_POST['zip_code']) ||
        !isset($_POST['phone_number']) ||
        !isset($_POST['total_price']) ||
        !isset($_POST['item_name'])) {
        died('We are sorry, but there appears to be a problem with the form you submitted.');       
    }
     
    $first_last_name = $_POST['first_last_name']; // required
    $email_from = $_POST['email']; // required
    $zip_code = $_POST['zip_code']; // required
    $phone_number = $_POST['phone_number']; // not required
    $total_price = $_POST['total_price']; // required
    $item_name = $_POST['item_name']; // required
     
    $error_message = "";
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
  if(!preg_match($email_exp,$email_from)) {
    $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
  }
    $string_exp = "/^[A-Za-z .'-]+$/";
  if(!preg_match($string_exp,$first_last_name)) {
    $error_message .= 'The First Name you entered does not appear to be valid.<br />';
  }
  if(!preg_match($string_exp,$item_name)) {
    $error_message .= 'The Last Name you entered does not appear to be valid.<br />';
  }
  if(strlen($zip_code) < 5) {
    $error_message .= 'The postcode you entered do not appear to be valid.<br />';
  }
   if(strlen($phone_number)) {
    $error_message .= 'The postcode you entered do not appear to be valid.<br />';
  }
   if(strlen($total_price)) {
    $error_message .= 'The postcode you entered do not appear to be valid.<br />';
  }
  if(strlen($error_message) > 0) {
    died($error_message);
  }
    $email_message = "Form details below.\n\n";
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
     
    $email_message .= "First and Last Name: ".clean_string($first_last_name)."\n";
    $email_message .= "Email: ".clean_string($email_from)."\n";
    $email_message .= "Zip Code: ".clean_string($zip_code)."\n";
    $email_message .= "Phone: ".clean_string($phone_number)."\n";
    $email_message .= "Total Price: ".clean_string($total_price)."\n";
    $email_message .= "Item Name: ".clean_string($item_name)."\n";
     
     
// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers); ?>
<script type="text/javascript">

  alert('Thanks for your contact!');


window.location.href = "index.php";
</script>
    


 
 
<?php

}
die();
?>






