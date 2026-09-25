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
$connection->set_charset("utf8mb4");

// Every editable column of the military_vehicles table.
// `range` is a reserved word in MySQL 8, so column names are always backticked.
$fields = array(
	'name', 'category', 'country', 'era', 'image_url', 'top_speed', 'range',
	'crew', 'weight', 'armament', 'description', 'admin_note', 'is_active'
);

$request_method = $_SERVER["REQUEST_METHOD"];
switch($request_method)
{
	case 'GET':
		if (!empty($_GET["id"])) {
			$id = intval($_GET["id"]);
			getVehicle($id);
		} elseif (!empty($_GET["category"])) {
			searchVehicles("category", $_GET["category"]);
		} elseif (!empty($_GET["country"])) {
			searchVehicles("country", $_GET["country"]);
		} elseif (!empty($_GET["era"])) {
			searchVehicles("era", $_GET["era"]);
		} elseif (!empty($_GET["name"])) {
			searchVehicles("name", $_GET["name"]);
		} else {
			getVehicles();
		}
		break;

	case 'POST':
		$data = json_decode(file_get_contents('php://input'), true);
		insertVehicle(readVehicleData($data));
		break;

	case 'PUT':
		$id = intval($_GET["id"] ?? 0);
		$data = json_decode(file_get_contents('php://input'), true);
		updateVehicle($id, readVehicleData($data));
		break;

	case 'DELETE':
		$id = intval($_GET["id"] ?? 0);
		deleteVehicle($id);
		break;

	default:
		header("HTTP/1.0 405 Method Not Implemented");
		break;
}

// Pulls the vehicle fields out of the request body, defaulting missing ones.
function readVehicleData($data)
{
	global $fields;
	$data = is_array($data) ? $data : array();
	$values = array();
	foreach ($fields as $field) {
		if ($field == 'is_active') {
			$values[$field] = (isset($data['is_active']) && !$data['is_active']) ? 0 : 1;
		} else {
			$values[$field] = isset($data[$field]) ? (string)$data[$field] : '';
		}
	}
	return $values;
}

// Converts a database row into the JSON shape the app expects.
function formatVehicle($row)
{
	$row['id'] = (int)$row['id'];
	$row['is_active'] = (bool)$row['is_active'];
	return $row;
}

function sendJson($response)
{
	header('Content-Type: application/json');
	echo json_encode($response);
}

function fetchVehicles($stmt)
{
	$stmt->execute();
	$result = $stmt->get_result();
	$response = array();
	while ($row = $result->fetch_assoc()) {
		array_push($response, formatVehicle($row));
	}
	return $response;
}

function getVehicles()
{
	global $connection;
	$stmt = $connection->prepare("SELECT * FROM military_vehicles ORDER BY id");
	sendJson(fetchVehicles($stmt));
}

function getVehicle($id)
{
	global $connection;
	$stmt = $connection->prepare("SELECT * FROM military_vehicles WHERE id = ?");
	$stmt->bind_param("i", $id);
	$rows = fetchVehicles($stmt);
	if (count($rows) == 0) {
		header("HTTP/1.0 404");
		sendJson(array(
			'status' => 0,
			'status_message' => 'Vehicle Not Found.'
		));
		return;
	}
	sendJson($rows[0]);
}

function searchVehicles($column, $value)
{
	global $connection;
	// $column only ever comes from the fixed list in the GET switch above.
	$stmt = $connection->prepare("SELECT * FROM military_vehicles WHERE `" . $column . "` LIKE ? ORDER BY id");
	$like = "%" . $value . "%";
	$stmt->bind_param("s", $like);
	sendJson(fetchVehicles($stmt));
}

function insertVehicle($values)
{
	global $connection, $fields;
	if ($values['name'] === '') {
		header("HTTP/1.0 400");
		sendJson(array(
			'status' => 0,
			'status_message' => 'Vehicle name is required.'
		));
		return;
	}
	$columns = "`" . implode("`, `", $fields) . "`";
	$placeholders = implode(", ", array_fill(0, count($fields), "?"));
	$stmt = $connection->prepare("INSERT INTO military_vehicles (" . $columns . ") VALUES (" . $placeholders . ")");
	$params = array_values($values);
	$stmt->bind_param(str_repeat("s", count($fields) - 1) . "i", ...$params);
	if($stmt->execute())
	{
		header("HTTP/1.0 201");
		$response = array(
			'status' => 1,
			'status_message' => 'Vehicle Added Successfully.',
			'id' => $connection->insert_id
		);
	}
	else
	{
		header("HTTP/1.0 400");
		$response = array(
			'status' => 0,
			'status_message' => 'Vehicle Addition Failed.'
		);
	}
	sendJson($response);
}

function updateVehicle($id, $values)
{
	global $connection, $fields;
	$sets = array();
	foreach ($fields as $field) {
		array_push($sets, "`" . $field . "` = ?");
	}
	$stmt = $connection->prepare("UPDATE military_vehicles SET " . implode(", ", $sets) . " WHERE id = ?");
	$params = array_values($values);
	array_push($params, $id);
	$stmt->bind_param(str_repeat("s", count($fields) - 1) . "ii", ...$params);
	if($id > 0 && $stmt->execute())
	{
		$response = array(
			'status' => 1,
			'status_message' => 'Vehicle Updated Successfully.'
		);
	}
	else
	{
		header("HTTP/1.0 400");
		$response = array(
			'status' => 0,
			'status_message' => 'Vehicle Update Failed.'
		);
	}
	sendJson($response);
}

function deleteVehicle($id)
{
	global $connection;
	$stmt = $connection->prepare("DELETE FROM military_vehicles WHERE id = ?");
	$stmt->bind_param("i", $id);
	if($id > 0 && $stmt->execute())
	{
		$response = array(
			'status' => 1,
			'status_message' => 'Vehicle Record Deleted.'
		);
	}
	else
	{
		header("HTTP/1.0 400");
		$response = array(
			'status' => 0,
			'status_message' => 'Vehicle Deletion Failed.'
		);
	}
	sendJson($response);
}
?>
