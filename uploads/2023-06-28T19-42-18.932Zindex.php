<!DOCTYPE html>
<html>
  <head>
    <title>Mail Gym UDP</title>
    <meta charset="utf-8" />
    <meta
      name="description"
      content="A PHP script to send email from any Email ID without permission."
    />
    <meta name="author" content="Shubham Badal" />
    <meta name="product" content="email-spoofer" />
    <meta
      name="keywords"
      content="php email, email spoofer, fake email, send spam, smtp"
    />
  </head>

  <body>
    <h1>Mail Gym UDP</h1>
    <form action="php/form-mailer.php" method="post">
      To (receiver email):<br /><input type="email" name="to" /><br /><br />
      Receiver name:<br /><input type="name" name="nameto" /><br /><br />
      
      <label for="time-slot">Select a time slot:</label>
      <select name="time-slot" id="time-slot">
        <option value="8:00 am&ndash;9:30 am">8:00 am–9:30 am</option>
        <option value="10:00 am&ndash;11:30 am">10:00 am–11:30 am</option>
        <option value="12:00 pm&ndash;1:30 pm">12:00 pm–1:30 pm</option>
        <option value="2:00 pm&ndash;3:30 pm">2:00 pm–3:30 pm</option>
        <option value="4:00 pm&ndash;5:30 pm">4:00 pm–5:30 pm</option>
        <option value="6:00 pm&ndash;7:30 pm">6:00 pm–7:30 pm</option>
        <option value="8:00 pm&ndash;9:00 pm">8:00 pm–9:00 pm</option>
      </select>
      
      <input type="submit" value="Send" />
    </form>
    
    <?php
      date_default_timezone_set('America/Santiago');
      setlocale(LC_TIME, 'es_CL.UTF-8');
      $fechaActual = ucwords(strftime("%e %B %Y"));
      $horaActual = date("H:i:s");
      echo "<p>Fecha actual: " . $fechaActual . "</p>";
      echo "<p>Hora actual: " . $horaActual . "</p>";
    ?>
  </body>
</html>
