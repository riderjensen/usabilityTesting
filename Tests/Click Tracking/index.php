<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $to = 'kennethcstephens@gmail.com'; 
    $subject = 'Portfolio Contact Form';
    
			
    $body = "From: $name\n E-Mail: $email";
				
   if ($_POST['submit']) {
    if (mail ($to, $subject, $body, $from)) { 
        header('Location: http://kennystephens.thedevelopedweb.com/thank-you.html#contact');
       

        
    } else { 
        echo '<p>Something went wrong, go back and try again!</p>'; 
    }
}
?>
