<?php
    
    $db = new PDO("mysql:host=localhost;dbname=db1",'user','password');
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
