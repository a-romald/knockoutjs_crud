A lightweight Knockout.js Applications that allows to implement main CRUD functions.
The sql-file with tags appended.

Requires to include jQuery > 1.7, jQuery.tmpl 1.0.0pre and Knockout.js 2.3.0

Features

    Descriptive demonstration of Knockout.js features for data manipulation.
    All Knockout.js code is placed into model.js. file
    
Requires PHP-code in response.php file with this code:

    <?php
    
    $db = new PDO("mysql:host=localhost;dbname=db1",'user','password');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    $db->exec('SET CHARACTER SET utf8');
    
    //Retrive list of tags
    if($_SERVER['HTTP_X_REQUESTED_WITH']=='XMLHttpRequest' && $_GET['option'] == 'list') {
        try {
            $sql = "SELECT id, title FROM tags";
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
            }
        catch(PDOException $e)
            {
            echo $e->getMessage();
            }
    
    }
    
    //Add tag
    elseif($_SERVER['HTTP_X_REQUESTED_WITH']=='XMLHttpRequest' && $_POST['option'] == 'add') {
        try {
            $tag = $_POST['tag'];
            $stmt = $db->prepare("INSERT INTO tags(title) VALUES(?)");
            $stmt->bindValue(1, $tag, PDO::PARAM_STR);
            $stmt->execute();
            if ($stmt) {
                $result = array();
                $result['id'] = $db->lastInsertId();
                $result['title'] = $tag;
            }
            echo json_encode($result);
            }
        catch(PDOException $e)
            {
            echo $e->getMessage();
            }
    
    }
    
    //Delete tag
    elseif($_SERVER['HTTP_X_REQUESTED_WITH']=='XMLHttpRequest' && $_GET['option'] == 'delete') {
        try {
            $id = $_GET['tag_id'];
            $stmt = $db->prepare("DELETE FROM tags WHERE id = ?");
            $stmt->bindValue(1, $id, PDO::PARAM_INT);
            $stmt->execute();
            if ($stmt) $result = 'success'; else $result = 'error';
            echo json_encode($result);
            }
        catch(PDOException $e)
            {
            echo $e->getMessage();
            }
    
    }
    
    //Edit tag
    elseif($_SERVER['HTTP_X_REQUESTED_WITH']=='XMLHttpRequest' && $_POST['option'] == 'edit') {
        try {
            $id = $_POST['tag_id'];
            $title = $_POST['tag_title'];
            $stmt = $db->prepare("UPDATE tags SET title = ? WHERE id = ?");
            $stmt->bindValue(1, $title, PDO::PARAM_STR);
            $stmt->bindValue(2, $id, PDO::PARAM_INT);
            $stmt->execute();
            if ($stmt) {
                $result = array();
                $result['title'] = $title;
            }
            echo json_encode($result);
            }
        catch(PDOException $e)
            {
            echo $e->getMessage();
            }
    
    }
?>    

All other features like Search and Alphabet filter are implemented with javascript-code
and don't need php-code and seach in mysql database.

