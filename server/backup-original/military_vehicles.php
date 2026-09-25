<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
include("connection.php");
include("auth.php");

//Auth Start
// $auth = new authObj();
// $isAuthorized = $auth->authenticate();
// if(!$isAuthorized)
// {
// 	header("HTTP/1.0 401");
// 	exit;
// }
//Auth End

$db = new dbObj();
$connection = $db->getConnstring();

$request_method = $_SERVER["REQUEST_METHOD"];
switch($request_method)
{
	case 'GET':
		if (!empty($_GET["id"])) {
			$id = intval($_GET["id"]);
			getStudent($id);
		} elseif (!empty($_GET["course"])) {
			$course = $_GET["course"];
			searchStudentsCourse($course);
		} elseif (!empty($_GET["name"])) {
			$name = $_GET["name"];
			searchStudentsName($name);
		} else {
			getStudents();
		}
		break;
		
	case 'POST':
		$data = json_decode(file_get_contents('php://input'), true);
		insertStudent(
			$data["firstname"] ?? '',
			$data["middlename"] ?? '',
			$data["lastname"] ?? '',
			$data["course"] ?? '',
			$data["email"] ?? '',
			$data["picture"] ?? ''
		);
		break;

	case 'PUT':
		$id = intval($_GET["id"]);
		$data = json_decode(file_get_contents('php://input'), true);
		updateStudent(
			$id,
			$data["firstname"] ?? '',
			$data["middlename"] ?? '',
			$data["lastname"] ?? '',
			$data["course"] ?? '',
			$data["email"] ?? '',
			$data["picture"] ?? ''
		);
		break;

	case 'DELETE':
		$id = intval($_GET["id"]);
		deleteStudent($id);
		break;

	default:
		header("HTTP/1.0 405 Method Not Implemented");
		break;
}

function getStudents()
{
	global $connection;
	$sql = "SELECT * from students";
	$result = $connection->query($sql);
	$response = array();
	if ($result->num_rows > 0) {
		while ($row = $result->fetch_assoc()) {
			array_push($response, $row);
		}
	}
	header('Content-Type: application/json');
	echo json_encode($response);
}

function getStudent($id)
{
	global $connection;
	$sql = "SELECT * from students WHERE id='".$id."'";
	$result = $connection->query($sql);
	$row = $result->fetch_assoc();
	header('Content-Type: application/json');
	echo json_encode($row);
}

function insertStudent($firstname, $middlename, $lastname, $course, $email, $picture)
{
	global $connection;
	$sql = "INSERT INTO students (firstname, middlename, lastname, course, email, picture) VALUES ('".$firstname."','".$middlename."','".$lastname."','".$course."','".$email."','".$picture."')";
	$response = array();
	if($connection->query($sql))
	{
		header("HTTP/1.0 201");
		$response = array(
			'status' => 1,
			'status_message' => 'Student Added Successfully.'
		);
	}
	else
	{
		header("HTTP/1.0 400");
		$response = array(
			'status' => 0,
			'status_message' => 'Student Addition Failed.'
		);
	}
	header('Content-Type: application/json');
	echo json_encode($response);
}

function updateStudent($id, $firstname, $middlename, $lastname, $course, $email, $picture)
{
	global $connection;
	$sql = "UPDATE students SET firstname='".$firstname."', middlename='".$middlename."', lastname='".$lastname."', course='".$course."', email='".$email."', picture='".$picture."' WHERE id='".$id."'";
	$response = array();
	if($connection->query($sql))
	{
		$response = array(
			'status' => 1,
			'status_message' => 'Student Updated Successfully.'
		);
	}
	else
	{
		header("HTTP/1.0 400");
		$response = array(
			'status' => 0,
			'status_message' => 'Student Updation Failed.'
		);
	}
	header('Content-Type: application/json');
	echo json_encode($response);
}

function deleteStudent($id)
{
	global $connection;
	$sql = "DELETE from students WHERE id='".$id."'";
	$response = array();
	if($connection->query($sql))
	{
		$response = array(
			'status' => 1,
			'status_message' => 'Student Record Deleted.'
		);
	}
	else
	{
		header("HTTP/1.0 400");
		$response = array(
			'status' => 0,
			'status_message' => 'Student Deletion Failed.'
		);
	}
	header('Content-Type: application/json');
	echo json_encode($response);
}

function searchStudentsCourse($course)
{
	global $connection;
	$sql = "SELECT * from students WHERE course LIKE '%" . $course . "%'";

	$result = $connection->query($sql);
	$response = array();
	if ($result->num_rows > 0) {
		while ($row = $result->fetch_assoc()) {
			array_push($response, $row);
		}
	}
	header('Content-Type: application/json');
	echo json_encode($response);
}

function searchStudentsName($name)
{
	global $connection;
	$sql = "SELECT * from students WHERE firstname LIKE '%" . $name . "%' OR lastname LIKE '%" . $name . "%'";

	$result = $connection->query($sql);
	$response = array();
	if ($result->num_rows > 0) {
		while ($row = $result->fetch_assoc()) {
			array_push($response, $row);
		}
	}
	header('Content-Type: application/json');
	echo json_encode($response);
}
?>